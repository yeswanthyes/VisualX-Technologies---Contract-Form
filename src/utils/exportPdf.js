/**
 * Export the contract preview element as a PDF using html2pdf.js
 */
export async function exportToPdf(elementId, clientName) {
  const date = new Date().toISOString().slice(0, 10);
  const safeName = (clientName || 'Client').replace(/[^a-zA-Z0-9]/g, '_');
  const filename = `VisualX_Service_Agreement_${safeName}_${date}.pdf`;

  if (window.electron && window.electron.send) {
    // Send request to Electron Main Process to prompt 'Save As' and render native Chromium PDF
    window.electron.send('toMain', { action: 'save-as-pdf', filename });
    // Keep the "Downloading..." spinner active for a moment while dialog pops up
    await new Promise(resolve => setTimeout(resolve, 1500));
  } else {
    // Standard web browser fallback
    window.print();
  }
}
