import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

export const exportPDF = async (elementId, settings) => {
  const element = document.getElementById(elementId);
  if (!element) return;

  // 1. Capturamos el elemento con alta calidad
  const canvas = await html2canvas(element, {
    scale: 2, // Aumenta la resolución para que no se vea pixelado
    useCORS: true,
    backgroundColor: "#ffffff", // Aseguramos fondo blanco para impresión
    logging: false
  });

  const imgData = canvas.toDataURL('image/png');

  // 2. Configuramos el PDF según tus ajustes de MenuContext
  const pdf = new jsPDF({
    orientation: settings.orientation, // 'portrait' o 'landscape'
    unit: 'mm',
    format: settings.size // 'a4', 'letter', 'legal'
  });

  const pdfWidth = pdf.internal.pageSize.getWidth();
  const pdfHeight = pdf.internal.pageSize.getHeight();

  // Calculamos dimensiones para que la imagen cubra toda la hoja
  const imgProps = pdf.getImageProperties(imgData);
  const ratio = imgProps.width / imgProps.height;
  const canvasHeightInPdf = pdfWidth / ratio;

  // Añadimos la imagen al PDF
  pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, canvasHeightInPdf);
  
  pdf.save(`Menu-Epazzote-${settings.orientation}.pdf`);
};