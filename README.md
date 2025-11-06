# 🦙 NUS Llama Printer

**NUS Llama Printer** is a lightweight web platform that allows NUS School of Computing (SoC) students to securely submit printing jobs to the SoC Linux servers (`stu` / `stf`) directly through SSH — no manual terminal commands required.

It also includes an automatic **booklet layout generator**, which intelligently arranges A4 pages into booklet order for double-sided printing.

## Features

- 🔒 **Secure SSH Connection**: Direct connection to SoC servers (stu.comp.nus.edu.sg / stf.comp.nus.edu.sg)
- 📄 **PDF Upload**: Upload any PDF document for printing
- 📖 **Booklet Layout Generator**: Automatically arranges pages for booklet-style printing
- 🖨️ **Print Options**: Support for double-sided printing and multiple copies
- 🎨 **User-Friendly Interface**: Clean, intuitive web interface
- 🔐 **No Data Storage**: Credentials are never stored, files deleted after printing

## Installation

### Prerequisites
- Node.js 14 or higher
- npm or yarn

### Setup

1. Clone the repository:
   ```bash
   git clone https://github.com/Qingbolan/nus-llama-printer.git
   cd nus-llama-printer
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the server:
   ```bash
   npm start
   ```

4. Open your browser and navigate to:
   ```
   http://localhost:3000
   ```

## Usage

1. **Select Server**: Choose either `stu` (students) or `stf` (staff) server
2. **Enter Credentials**: Provide your SoC Unix username and password
3. **Upload PDF**: Select the PDF file you want to print
4. **Enable Booklet** (Optional): Check this option to automatically arrange pages for booklet printing
5. **Configure Options**: Set double-sided printing and number of copies
6. **Submit**: Click "Submit Print Job" to send your document to the printer

### Booklet Layout

The booklet feature automatically arranges your pages so that when printed double-sided and folded in half, the pages appear in the correct reading order. This is perfect for creating booklets, zines, or study materials.

**How it works:**
- The system calculates the optimal page arrangement
- Pages are automatically reordered for booklet printing
- Blank pages are added if needed (must be multiple of 4)
- Each sheet contains 4 pages (2 on front, 2 on back)

## Security

- **SSH Encryption**: All connections use SSH protocol for secure communication
- **No Credential Storage**: Usernames and passwords are never stored on the server
- **Temporary Files**: All uploaded files are deleted immediately after printing
- **Session Management**: Secure session handling with automatic expiration

## Development

### Run in development mode:
```bash
npm run dev
```

This uses nodemon for automatic server restart on file changes.

### Project Structure
```
nus-llama-printer/
├── server.js           # Main server application
├── package.json        # Dependencies and scripts
├── public/            
│   ├── index.html     # Main web interface
│   ├── styles.css     # Styling
│   └── script.js      # Client-side JavaScript
└── uploads/           # Temporary file storage (auto-created)
```

## Technologies Used

- **Backend**: Node.js, Express
- **SSH**: ssh2 library for secure connections
- **PDF Processing**: pdf-lib for booklet generation
- **File Upload**: multer for handling file uploads
- **Frontend**: Vanilla JavaScript, HTML5, CSS3

## Requirements

- Access to NUS SoC Unix servers (stu or stf)
- Valid SoC credentials
- PDF files for printing

## Limitations

- Only PDF files are supported
- Maximum file size: 50MB
- Requires active VPN connection if accessing from outside NUS network
- Booklet layout works best with A4-sized PDFs

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

MIT License

## Disclaimer

This tool is not officially affiliated with NUS or the School of Computing. Use at your own risk. Always ensure you comply with SoC printing policies and quotas.
