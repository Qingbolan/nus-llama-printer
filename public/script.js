document.addEventListener('DOMContentLoaded', function() {
    const printForm = document.getElementById('printForm');
    const previewBtn = document.getElementById('previewBtn');
    const statusMessage = document.getElementById('statusMessage');
    const layoutPreview = document.getElementById('layoutPreview');
    const enableBookletCheckbox = document.getElementById('enableBooklet');
    const fileInput = document.getElementById('file');

    // Show/hide preview button based on booklet checkbox
    enableBookletCheckbox.addEventListener('change', function() {
        if (this.checked) {
            previewBtn.style.display = 'inline-block';
        } else {
            previewBtn.style.display = 'none';
            layoutPreview.style.display = 'none';
        }
    });

    // Preview booklet layout
    previewBtn.addEventListener('click', async function() {
        const file = fileInput.files[0];
        if (!file) {
            showMessage('Please select a PDF file first', 'error');
            return;
        }

        if (!file.name.toLowerCase().endsWith('.pdf')) {
            showMessage('Please select a valid PDF file', 'error');
            return;
        }

        showMessage('Generating booklet layout preview...', 'info');
        previewBtn.disabled = true;

        try {
            const formData = new FormData();
            formData.append('file', file);

            const response = await fetch('/api/booklet-layout', {
                method: 'POST',
                body: formData
            });

            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.error || 'Failed to generate layout');
            }

            const layoutData = await response.json();
            displayLayoutPreview(layoutData);
            showMessage('Layout preview generated successfully', 'success');
        } catch (error) {
            showMessage(`Error: ${error.message}`, 'error');
        } finally {
            previewBtn.disabled = false;
        }
    });

    // Submit print job
    printForm.addEventListener('submit', async function(e) {
        e.preventDefault();

        const formData = new FormData(printForm);
        const file = fileInput.files[0];

        if (!file) {
            showMessage('Please select a PDF file', 'error');
            return;
        }

        if (!file.name.toLowerCase().endsWith('.pdf')) {
            showMessage('Please select a valid PDF file', 'error');
            return;
        }

        // Add checkbox values
        formData.set('enableBooklet', enableBookletCheckbox.checked);
        formData.set('duplex', document.getElementById('duplex').checked);

        showMessage('Submitting print job... This may take a moment.', 'info');
        
        // Disable submit button
        const submitBtn = printForm.querySelector('button[type="submit"]');
        submitBtn.disabled = true;

        try {
            const response = await fetch('/api/submit-job', {
                method: 'POST',
                body: formData
            });

            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.error || 'Failed to submit print job');
            }

            const result = await response.json();
            showMessage('✅ Print job submitted successfully! Your document has been sent to the printer.', 'success');
            
            // Reset form after successful submission
            setTimeout(() => {
                printForm.reset();
                layoutPreview.style.display = 'none';
            }, 2000);
        } catch (error) {
            showMessage(`❌ Error: ${error.message}`, 'error');
        } finally {
            submitBtn.disabled = false;
        }
    });

    function showMessage(message, type) {
        statusMessage.textContent = message;
        statusMessage.className = type;
        statusMessage.style.display = 'block';
    }

    function displayLayoutPreview(layoutData) {
        const layoutContent = document.getElementById('layoutContent');
        
        let html = `
            <div style="margin-bottom: 20px;">
                <strong>Total Pages:</strong> ${layoutData.totalPages}<br>
                <strong>Sheets Needed:</strong> ${layoutData.sheetsNeeded}<br>
                <strong>Total Pages (with blanks):</strong> ${layoutData.totalPagesNeeded}<br>
                ${layoutData.blankPages > 0 ? `<strong>Blank Pages:</strong> ${layoutData.blankPages}` : ''}
            </div>
        `;

        layoutData.layout.forEach(sheet => {
            html += `
                <div class="layout-sheet">
                    <h4>Sheet ${sheet.sheet}</h4>
                    <div class="layout-pages">
                        <div class="layout-side">
                            <strong>Front Side</strong>
                            <div class="page-numbers">
                                <div class="page-number ${sheet.front[0] > layoutData.totalPages ? 'blank' : ''}">
                                    ${sheet.front[0] > layoutData.totalPages ? 'Blank' : sheet.front[0]}
                                </div>
                                <div class="page-number ${sheet.front[1] > layoutData.totalPages ? 'blank' : ''}">
                                    ${sheet.front[1] > layoutData.totalPages ? 'Blank' : sheet.front[1]}
                                </div>
                            </div>
                        </div>
                        <div class="layout-side">
                            <strong>Back Side</strong>
                            <div class="page-numbers">
                                <div class="page-number ${sheet.back[0] > layoutData.totalPages ? 'blank' : ''}">
                                    ${sheet.back[0] > layoutData.totalPages ? 'Blank' : sheet.back[0]}
                                </div>
                                <div class="page-number ${sheet.back[1] > layoutData.totalPages ? 'blank' : ''}">
                                    ${sheet.back[1] > layoutData.totalPages ? 'Blank' : sheet.back[1]}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            `;
        });

        layoutContent.innerHTML = html;
        layoutPreview.style.display = 'block';
    }
});
