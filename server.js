const express = require('express');
const multer = require('multer');
const session = require('express-session');
const bodyParser = require('body-parser');
const path = require('path');
const fs = require('fs');
const { Client } = require('ssh2');
const { PDFDocument } = require('pdf-lib');

const app = express();
const PORT = process.env.PORT || 3000;

// Configure multer for file uploads
const upload = multer({ 
  dest: 'uploads/',
  limits: { fileSize: 50 * 1024 * 1024 } // 50MB limit
});

// Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(session({
  secret: process.env.SESSION_SECRET || 'nus-llama-printer-secret',
  resave: false,
  saveUninitialized: false,
  cookie: { maxAge: 3600000 } // 1 hour
}));
app.use(express.static('public'));

// Ensure uploads directory exists
if (!fs.existsSync('uploads')) {
  fs.mkdirSync('uploads');
}

// Booklet layout generator
function generateBookletLayout(totalPages) {
  // Calculate pages needed (must be multiple of 4 for booklet)
  const sheetsNeeded = Math.ceil(totalPages / 4);
  const totalPagesNeeded = sheetsNeeded * 4;
  const blankPages = totalPagesNeeded - totalPages;
  
  const layout = [];
  
  // Generate the page order for booklet printing
  // Each sheet has 4 pages: front-left, front-right, back-left, back-right
  for (let i = 0; i < sheetsNeeded; i++) {
    const sheetNum = i + 1;
    const frontRight = i * 2 + 1;
    const frontLeft = totalPagesNeeded - (i * 2);
    const backLeft = i * 2 + 2;
    const backRight = totalPagesNeeded - (i * 2) - 1;
    
    layout.push({
      sheet: sheetNum,
      front: [frontLeft, frontRight],
      back: [backLeft, backRight]
    });
  }
  
  return {
    layout,
    totalPages,
    totalPagesNeeded,
    blankPages,
    sheetsNeeded
  };
}

// Process PDF for booklet printing
async function processPDFForBooklet(inputPath, outputPath) {
  try {
    const existingPdfBytes = fs.readFileSync(inputPath);
    const pdfDoc = await PDFDocument.load(existingPdfBytes);
    const totalPages = pdfDoc.getPageCount();
    
    const bookletInfo = generateBookletLayout(totalPages);
    const newPdfDoc = await PDFDocument.create();
    
    // Create booklet pages
    for (const sheet of bookletInfo.layout) {
      // Front page (2 pages side by side)
      const frontPage = newPdfDoc.addPage([841.89, 595.28]); // A4 landscape
      
      // Add front-left page
      if (sheet.front[0] <= totalPages) {
        const [leftPage] = await newPdfDoc.copyPages(pdfDoc, [sheet.front[0] - 1]);
        const { width, height } = leftPage.getSize();
        frontPage.drawPage(leftPage, {
          x: 0,
          y: (595.28 - height) / 2,
          width: width / 2,
          height: height / 2
        });
      }
      
      // Add front-right page
      if (sheet.front[1] <= totalPages) {
        const [rightPage] = await newPdfDoc.copyPages(pdfDoc, [sheet.front[1] - 1]);
        const { width, height } = rightPage.getSize();
        frontPage.drawPage(rightPage, {
          x: 841.89 / 2,
          y: (595.28 - height) / 2,
          width: width / 2,
          height: height / 2
        });
      }
      
      // Back page (2 pages side by side)
      const backPage = newPdfDoc.addPage([841.89, 595.28]); // A4 landscape
      
      // Add back-left page
      if (sheet.back[0] <= totalPages) {
        const [leftPage] = await newPdfDoc.copyPages(pdfDoc, [sheet.back[0] - 1]);
        const { width, height } = leftPage.getSize();
        backPage.drawPage(leftPage, {
          x: 0,
          y: (595.28 - height) / 2,
          width: width / 2,
          height: height / 2
        });
      }
      
      // Add back-right page
      if (sheet.back[1] <= totalPages) {
        const [rightPage] = await newPdfDoc.copyPages(pdfDoc, [sheet.back[1] - 1]);
        const { width, height } = rightPage.getSize();
        backPage.drawPage(rightPage, {
          x: 841.89 / 2,
          y: (595.28 - height) / 2,
          width: width / 2,
          height: height / 2
        });
      }
    }
    
    const pdfBytes = await newPdfDoc.save();
    fs.writeFileSync(outputPath, pdfBytes);
    
    return bookletInfo;
  } catch (error) {
    throw new Error(`Error processing PDF: ${error.message}`);
  }
}

// SSH connection and file transfer
function submitPrintJob(host, username, password, filePath, printerOptions) {
  return new Promise((resolve, reject) => {
    const conn = new Client();
    
    conn.on('ready', () => {
      const remoteFileName = path.basename(filePath);
      const remotePath = `/tmp/${remoteFileName}`;
      
      conn.sftp((err, sftp) => {
        if (err) {
          conn.end();
          return reject(err);
        }
        
        // Upload file
        sftp.fastPut(filePath, remotePath, (err) => {
          if (err) {
            conn.end();
            return reject(err);
          }
          
          // Execute print command
          const printCmd = `lpr ${printerOptions.duplex ? '-o sides=two-sided-long-edge' : ''} ${printerOptions.copies > 1 ? `-#${printerOptions.copies}` : ''} "${remotePath}" && rm "${remotePath}"`;
          
          conn.exec(printCmd, (err, stream) => {
            if (err) {
              conn.end();
              return reject(err);
            }
            
            let output = '';
            let errorOutput = '';
            
            stream.on('close', (code, signal) => {
              conn.end();
              if (code === 0) {
                resolve({ success: true, output });
              } else {
                reject(new Error(`Print command failed: ${errorOutput}`));
              }
            }).on('data', (data) => {
              output += data.toString();
            }).stderr.on('data', (data) => {
              errorOutput += data.toString();
            });
          });
        });
      });
    });
    
    conn.on('error', (err) => {
      reject(err);
    });
    
    conn.connect({
      host,
      port: 22,
      username,
      password
    });
  });
}

// Routes

// Serve main page
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Get booklet layout preview
app.post('/api/booklet-layout', upload.single('file'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }
    
    const pdfBytes = fs.readFileSync(req.file.path);
    const pdfDoc = await PDFDocument.load(pdfBytes);
    const totalPages = pdfDoc.getPageCount();
    
    const bookletInfo = generateBookletLayout(totalPages);
    
    // Clean up uploaded file
    fs.unlinkSync(req.file.path);
    
    res.json(bookletInfo);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Submit print job
app.post('/api/submit-job', upload.single('file'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }
    
    const { server, username, password, enableBooklet, duplex, copies } = req.body;
    
    // Validate inputs
    if (!server || !username || !password) {
      fs.unlinkSync(req.file.path);
      return res.status(400).json({ error: 'Missing required fields' });
    }
    
    // Determine server host
    const serverHost = server === 'stu' ? 'stu.comp.nus.edu.sg' : 'stf.comp.nus.edu.sg';
    
    let filePath = req.file.path;
    
    // Process for booklet if enabled
    if (enableBooklet === 'true') {
      const bookletPath = `${req.file.path}_booklet.pdf`;
      await processPDFForBooklet(filePath, bookletPath);
      fs.unlinkSync(filePath); // Remove original
      filePath = bookletPath;
    }
    
    const printerOptions = {
      duplex: duplex === 'true',
      copies: parseInt(copies) || 1
    };
    
    // Submit print job via SSH
    await submitPrintJob(serverHost, username, password, filePath, printerOptions);
    
    // Clean up
    fs.unlinkSync(filePath);
    
    res.json({ success: true, message: 'Print job submitted successfully' });
  } catch (error) {
    // Clean up file if exists
    if (req.file && fs.existsSync(req.file.path)) {
      fs.unlinkSync(req.file.path);
    }
    
    res.status(500).json({ error: error.message });
  }
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' });
});

app.listen(PORT, () => {
  console.log(`🦙 NUS Llama Printer running on http://localhost:${PORT}`);
});
