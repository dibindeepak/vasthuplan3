import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { ArchitecturalProject, DrawingPage } from './types';

export interface PdfExportProgress {
  currentPage: number;
  totalPages: number;
  status: string;
}

export interface PdfExportResult {
  success: boolean;
  message: string;
  blobUrl?: string;
  filename?: string;
}

/**
 * Downloads a Blob reliably in any modern browser or sandboxed iframe
 */
export function triggerFileDownload(blob: Blob, filename: string): boolean {
  try {
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    link.target = '_blank';
    link.rel = 'noopener noreferrer';
    link.style.display = 'none';
    document.body.appendChild(link);
    link.click();

    setTimeout(() => {
      try {
        document.body.removeChild(link);
        // keep blob URL alive briefly for download completion
        setTimeout(() => URL.revokeObjectURL(url), 10000);
      } catch (e) {
        // ignore cleanup error
      }
    }, 2000);
    return true;
  } catch (err) {
    console.error('Trigger file download failed:', err);
    return false;
  }
}

/**
 * Captures an HTML element to a canvas cleanly
 */
async function captureElementToCanvas(element: HTMLElement): Promise<HTMLCanvasElement> {
  return await html2canvas(element, {
    scale: 2,
    useCORS: true,
    allowTaint: true,
    logging: false,
    backgroundColor: '#ffffff',
    windowWidth: element.offsetWidth || 1400,
    windowHeight: element.offsetHeight || 990,
    ignoreElements: (el) => {
      return (
        el.classList.contains('no-print') ||
        el.classList.contains('no-export') ||
        el.classList.contains('canvas-hud')
      );
    },
  });
}

/**
 * Export single active sheet or multi-page project to PDF with automatic Date & Time watermark
 */
export async function exportProjectToPdf(
  project: ArchitecturalProject,
  onProgress?: (progress: PdfExportProgress) => void,
  options?: { exportAllPages?: boolean }
): Promise<PdfExportResult> {
  const exportAll = options?.exportAllPages !== false && project.pages && project.pages.length > 1;
  const pagesToExport: DrawingPage[] = exportAll
    ? project.pages
    : [project.pages[project.activePageIndex] || project.pages[0]];

  const totalPages = pagesToExport.length;
  const sanitizedDrawingNum = (project.titleBlock?.drawingNumber || 'AIA-DRAWING')
    .replace(/[^a-zA-Z0-9_-]/g, '_');
  const filename = `${sanitizedDrawingNum}_${project.titleBlock?.date || '2026'}.pdf`;

  // Generate official timestamp for watermark
  const now = new Date();
  const formattedDateTime =
    now.toLocaleDateString('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    }) +
    ' ' +
    now.toLocaleTimeString('en-GB', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    });

  try {
    let pdf: jsPDF | null = null;

    for (let i = 0; i < totalPages; i++) {
      const page = pagesToExport[i];
      const pageNum = i + 1;

      if (onProgress) {
        onProgress({
          currentPage: pageNum,
          totalPages,
          status: `Rendering Sheet ${pageNum} of ${totalPages} (${page.sheetTitle || page.sheetNumber})...`,
        });
      }

      // Find the printable sheet element in the DOM
      let targetElement =
        document.getElementById(`aia-printable-page-${page.id}`) ||
        document.getElementById('aia-master-printable-sheet');

      if (!targetElement) {
        targetElement = document.getElementById('aia-master-printable-sheet');
      }

      if (!targetElement) {
        throw new Error('Printable drawing sheet element not found in DOM.');
      }

      // Temporarily remove transform for 100% crisp, unclipped capture
      const originalTransform = (targetElement as HTMLElement).style.transform;
      const originalTransition = (targetElement as HTMLElement).style.transition;
      let canvas: HTMLCanvasElement;

      try {
        (targetElement as HTMLElement).style.transform = 'none';
        (targetElement as HTMLElement).style.transition = 'none';
        canvas = await captureElementToCanvas(targetElement as HTMLElement);
      } finally {
        (targetElement as HTMLElement).style.transform = originalTransform;
        (targetElement as HTMLElement).style.transition = originalTransition;
      }

      const imgData = canvas.toDataURL('image/jpeg', 0.96);
      const paperSize = page.paperSize || project.paperSize || 'a3';
      const orientation = page.orientation || project.orientation || 'landscape';

      // Dimensions in mm
      // A3: 420 x 297 mm
      // A4: 297 x 210 mm
      if (i === 0) {
        pdf = new jsPDF({
          orientation,
          unit: 'mm',
          format: paperSize,
          compress: true,
        });

        // Set authoritative metadata
        pdf.setProperties({
          title: `${project.titleBlock?.drawingNumber || 'AIA'} - ${project.titleBlock?.drawingTitle || project.name}`,
          subject: `Architectural Drawing Sheet - ${project.titleBlock?.client || ''}`,
          author: `${project.titleBlock?.engineer?.name || 'Er. Deepak C'} (${project.titleBlock?.firm?.name || 'Vasthusilpy'})`,
          keywords: 'AIA architectural drawing, vasthu, floor plan, multi-page',
          creator: 'Vasthusilpy Architectural Studio',
        });
      } else if (pdf) {
        pdf.addPage(paperSize, orientation);
      }

      if (pdf) {
        const pageWidth = pdf.internal.pageSize.getWidth();
        const pageHeight = pdf.internal.pageSize.getHeight();

        // Architectural border margin (4mm from physical page edge)
        const margin = 4;
        const renderWidth = pageWidth - margin * 2;
        const renderHeight = (canvas.height * renderWidth) / canvas.width;

        const yPos = renderHeight < pageHeight ? (pageHeight - renderHeight) / 2 : margin;

        pdf.addImage(
          imgData,
          'JPEG',
          margin,
          yPos > margin ? yPos : margin,
          renderWidth,
          renderHeight
        );

        // =========================================================================
        // AUTOMATIC WATERMARK: DATE & TIME STAMPED ON EVERY DOCUMENT DOWNLOAD
        // =========================================================================
        pdf.setFont('helvetica', 'normal');
        pdf.setFontSize(6.5);
        pdf.setTextColor(100, 116, 139);
        pdf.text(
          `ARCHITECTURAL RECORD • DOWNLOADED / EXPORTED: ${formattedDateTime} • VASTHUSILPY STUDIO • ALL RIGHTS RESERVED`,
          margin,
          pageHeight - 2
        );
      }
    }

    if (!pdf) {
      throw new Error('Failed to create PDF document.');
    }

    if (onProgress) {
      onProgress({
        currentPage: totalPages,
        totalPages,
        status: 'Finalizing PDF package and triggering download...',
      });
    }

    // Generate output blob
    const pdfBlob = pdf.output('blob');
    const blobUrl = URL.createObjectURL(pdfBlob);

    // Trigger download
    const downloaded = triggerFileDownload(pdfBlob, filename);

    return {
      success: true,
      message: `Successfully generated ${totalPages}-page architectural PDF (${filename})`,
      blobUrl,
      filename,
    };
  } catch (error) {
    console.error('PDF Generation Error:', error);
    return {
      success: false,
      message: error instanceof Error ? error.message : 'PDF generation encountered an error.',
    };
  }
}

/**
 * Backward compatibility wrapper
 */
export async function exportAiaSheetToPdf(
  elementId: string,
  project: ArchitecturalProject
): Promise<PdfExportResult> {
  return exportProjectToPdf(project);
}
