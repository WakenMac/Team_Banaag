// pdfReport.js
// Reusable PDF report generator for inventory pages

/**
 * @param {Object} options
 * @param {string} options.title - The inventory type/title (e.g., 'LABORATORY GLASSWARES')
 * @param {string} options.tableSelector - CSS selector for the table body rows (e.g., '#glasswareTableBody tr')
 * @param {Array} options.columns - Array of {header, dataKey} for table columns (excluding remarks and dates)
 * @param {string} options.filename - The filename for the downloaded PDF
 * @param {Array} options.dateColumns - Array of date strings for inventory columns
 * @param {Array} options.data - Array of data for the table body
 */
export async function generateInventoryPdfReport({ title, tableSelector, columns, filename, dateColumns, data }) {
    // Get jsPDF from window object
    const { jsPDF } = window.jspdf;
    if (!jsPDF) {
        console.error('jsPDF is not loaded. Please ensure jsPDF is loaded before using this function.');
        return;
    }

    const doc = new jsPDF('landscape', 'pt', 'a4');

    const logoUrl = '/Frontend_Code/images/usep_logo.png';
    const logoImg = await loadImageAsBase64(logoUrl);
    let y = 40;

    doc.setFont('Old London');
    doc.setFontSize(25);
    const universityName = 'University of Southeastern Philippines';
    const textWidth = doc.getTextWidth(universityName);
    const logoWidth = 40;
    const logoHeight = 40;
    const gap = 12;
    const totalWidth = logoWidth + gap + textWidth;
    const pageWidth = doc.internal.pageSize.width;
    const startX = (pageWidth - totalWidth) / 2;

    const textHeight = 18 * 0.7;
    const yText = y + logoHeight / 2 + textHeight / 2 - 2;

    if (logoImg) {
        doc.addImage(logoImg, 'PNG', startX, y, logoWidth, logoHeight);
    }
    doc.text(universityName, startX + logoWidth + gap, yText);
    y += logoHeight + 4; // less space after the logo + university name
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(12);
    doc.text('REPORT ON PHYSICAL COUNT OF INVENTORIES', doc.internal.pageSize.width / 2, y, { align: 'center' });
    y += 20;
    doc.setFontSize(13);
    doc.text(title, doc.internal.pageSize.width / 2, y, { align: 'center' });

    // Multi-row header
    const headRows = [];
    const firstRow = [...columns.map(col => ({ content: col.header, styles: { halign: 'center', fontStyle: 'bold' } })), { content: 'REMARKS', styles: { halign: 'center', fontStyle: 'bold' } }];
    if (dateColumns && dateColumns.length > 0) {
        firstRow.push({ content: 'DATE OF INVENTORY', colSpan: dateColumns.length, styles: { halign: 'center', fontStyle: 'bold' } });
    }
    headRows.push(firstRow);
    if (dateColumns && dateColumns.length > 0) {
        headRows.push([
            ...columns.map(() => ''),
            '',
            ...dateColumns.map(date => ({ content: date, styles: { halign: 'center', fontStyle: 'bold' } }))
        ]);
    }

    // Gather table data from DOM or use provided data
    let rows = [];
    if (Array.isArray(data) && data.length > 0) {
        rows = data;
    } else {
        document.querySelectorAll(tableSelector).forEach(tr => {
            const tds = tr.querySelectorAll('td');
            const row = [];
            columns.forEach((col, idx) => {
                row.push(tds[idx]?.innerText || '');
            });
            let remarks = '';
            if (tds.length > columns.length) {
                remarks = tds[columns.length]?.innerText || '';
            } else {
                for (let td of tds) {
                    if (td.classList.contains('remarks')) { remarks = td.innerText; break; }
                }
            }
            row.push(remarks);
            // For each date column, try to find a cell with data-date-idx or leave blank
            if (dateColumns && dateColumns.length > 0) {
                dateColumns.forEach((_, idx) => {
                    let val = '';
                    for (let td of tds) {
                        if (td.dataset[`date${idx}`]) { val = td.dataset[`date${idx}`]; break; }
                    }
                    row.push(val);
                });
            }
            rows.push(row);
        });
    }

    doc.autoTable({
        startY: y + 20,
        head: headRows,
        body: rows,
        styles: { fontSize: 9, cellPadding: 3 },
        headStyles: { fillColor: [44, 161, 74], halign: 'center', fontStyle: 'bold' },
        theme: 'grid',
        margin: { left: 40, right: 40 },
    });

    // Signatures
    const pageHeight = doc.internal.pageSize.height;
    doc.setFontSize(11);
    doc.text('Prepared by:', 60, pageHeight - 80);
    doc.text('Noted by:', 400, pageHeight - 80);
    doc.setFontSize(12);
    doc.text('_________________________', 60, pageHeight - 50);
    doc.text('_________________________', 400, pageHeight - 50);
    doc.setFontSize(10);
    doc.text('Technical Staff', 60, pageHeight - 35);
    doc.text('Dean, College of Arts and Sciences', 400, pageHeight - 35);

    doc.save(filename);
}

// Helper to load image as base64
async function loadImageAsBase64(url) {
    return new Promise((resolve) => {
        const img = new window.Image();
        img.crossOrigin = 'Anonymous';
        img.onload = function () {
            const canvas = document.createElement('canvas');
            canvas.width = img.width;
            canvas.height = img.height;
            const ctx = canvas.getContext('2d');
            ctx.drawImage(img, 0, 0);
            resolve(canvas.toDataURL('image/png'));
        };
        img.onerror = function () { resolve(null); };
        img.src = url;
    });
}
