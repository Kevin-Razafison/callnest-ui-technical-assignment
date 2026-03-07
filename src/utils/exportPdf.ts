import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

/**
 * Exports a component to PDF.
 */

export const exportComponentToPdf = async (elementId: string, fileName: string) => {
  const element = document.getElementById(elementId);
  if (!element) return;

  try {
    const canvas = await html2canvas(element, {
      scale: 2, // High definition
      useCORS: true,
      backgroundColor: '#0f172a', // Slate-950
      onclone: (clonedDoc) => {
        // 1. Inject a Global Style Shield to replace all oklch colors with HEX/RGB
        const styleShield = clonedDoc.createElement('style');
        styleShield.innerHTML = `
          /* Force all elements to use standard colors and bypass oklch parsing */
          * {
            color: #f8fafc !important; /* slate-50 */
            border-color: #1e293b !important; /* slate-800 */
            background-color: transparent; /* allow container background to show */
            outline-color: #3b82f6 !important;
            fill: #3b82f6 !important; /* Fix for SVG/Recharts */
            stroke: #1e293b !important; /* Fix for SVG/Recharts */
          }
          
          /* Re-apply the specific container background */
          #${elementId}, #${elementId} * {
            background-color: #0f172a !important;
          }

          /* Ensure chart texts remain visible */
          .recharts-text {
            fill: #94a3b8 !important; /* slate-400 */
          }
        `;
        clonedDoc.head.appendChild(styleShield);

        // 2. Manual attribute cleanup for SVGs (Crucial for Recharts)
        const svgs = clonedDoc.getElementsByTagName('svg');
        for (let i = 0; i < svgs.length; i++) {
          const svg = svgs[i];
          // Remove potential oklch values hiding in inline styles
          svg.style.color = '#3b82f6';
          svg.style.fill = '#3b82f6';
        }
      }
    });

    const imgData = canvas.toDataURL('image/png');
    const pdf = new jsPDF({
      orientation: 'landscape',
      unit: 'mm',
      format: 'a4'
    });

    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

    pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
    pdf.save(`${fileName}.pdf`);
  } catch (error) {
    console.error("Critical error during PDF export:", error);
    alert("Compatibility error: Your browser uses a color format (oklch) that the PDF generator cannot parse. Try using Chrome or Firefox if the issue persists.");
  }
};