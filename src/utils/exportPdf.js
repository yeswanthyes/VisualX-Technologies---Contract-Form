/**
 * Export the contract preview element as a PDF using html2pdf.js
 */
export async function exportToPdf(elementId, clientName) {
  // Dynamically import html2pdf.js (avoids SSR issues)
  const { default: html2pdf } = await import('html2pdf.js');

  const element = document.getElementById(elementId);
  if (!element) {
    console.error('Contract preview element not found');
    return;
  }

  const date = new Date().toISOString().slice(0, 10);
  const safeName = (clientName || 'Client').replace(/[^a-zA-Z0-9]/g, '_');
  const filename = `VisualX_Service_Agreement_${safeName}_${date}.pdf`;

  const opt = {
    margin: [15, 15, 15, 15], // top, right, bottom, left (mm)
    filename,
    image: { type: 'jpeg', quality: 0.98 },
    html2canvas: {
      scale: 2,
      useCORS: true,
      letterRendering: true,
      logging: false,
    },
    jsPDF: {
      unit: 'mm',
      format: 'a4',
      orientation: 'portrait',
    },
    pagebreak: { mode: ['avoid-all', 'css', 'legacy'] },
  };

  try {
    await html2pdf().set(opt).from(element).save();
  } catch (err) {
    console.error('PDF export failed:', err);
    alert('PDF export failed. Please try again.');
  }
}
