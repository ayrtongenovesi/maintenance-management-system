import { Injectable } from '@angular/core';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

@Injectable({ providedIn: 'root' })
export class PdfService {
  async elementToPdf(elementId: string, fileName = 'document.pdf'): Promise<string | null> {
    const el = document.getElementById(elementId);
    if (!el) return null;
    const canvas = await html2canvas(el);
    const imgData = canvas.toDataURL('image/png');
    const pdf = new jsPDF('p', 'mm', 'a4');
    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();
    const imgWidth = 150;
    const imgHeight = canvas.height * imgWidth / canvas.width;
    const x = (pageWidth - imgWidth) / 2;
    let heightLeft = imgHeight;
    let position = 20;
    pdf.addImage(imgData, 'PNG', x, position, imgWidth, imgHeight);
    heightLeft -= pageHeight;
    while (heightLeft >= 0) {
      position = heightLeft - imgHeight;
      pdf.addPage();
      pdf.addImage(imgData, 'PNG', x, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;
    }
    const pdfBase64 = pdf.output('datauristring');
    pdf.save(fileName);
    return pdfBase64;
  }
}