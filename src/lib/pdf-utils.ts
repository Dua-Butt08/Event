/**
 * PDF Generation Utilities
 * Creates professional PDF documents from formatted text
 */

export interface PdfTheme {
  title?: string;
  primary: string; // hex color
  secondary: string; // hex color
}

/**
 * Generate a themed PDF from formatted text content
 */
export function generatePDFStyled(content: string, filename: string, theme: PdfTheme): void {
  const titleText = theme.title || filename.replace(/\.pdf$/, '').replace(/[-_]/g, ' ');
  const htmlContent = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>${filename}</title>
  <style>
    @page { size: A4; margin: 2cm; }
    body { font-family: 'Inter', 'Helvetica', 'Arial', sans-serif; font-size: 11pt; line-height: 1.6; color: #111827; }
    .header {
      text-align: center;
      padding-bottom: 16px;
      margin-bottom: 24px;
      border-bottom: 4px solid ${theme.primary};
    }
    .title {
      font-size: 22pt;
      font-weight: 800;
      color: ${theme.primary};
      letter-spacing: 0.5px;
    }
    .subtitle { font-size: 10pt; color: #6B7280; }
    .section { margin-bottom: 18px; }
    pre { white-space: pre-wrap; word-wrap: break-word; font-family: 'Menlo','Courier New', monospace; font-size: 10pt; background: linear-gradient(90deg, ${theme.primary}11, ${theme.secondary}11); padding: 14px; border-left: 4px solid ${theme.secondary}; border-radius: 8px; }
    .footer { margin-top: 24px; text-align: center; font-size: 9pt; color: #6B7280; border-top: 1px solid ${theme.primary}44; padding-top: 12px; }
  </style>
</head>
<body>
  <div class="header">
    <div class="title">${titleText}</div>
    <div class="subtitle">Generated on ${new Date().toLocaleString()}</div>
  </div>
  <div class="section">
    <pre>${escapeHtml(content)}</pre>
  </div>
  <div class="footer">© ${new Date().getFullYear()} Essential Funnel Optimizer. All rights reserved.</div>
</body>
</html>
  `;

  const blob = new Blob([htmlContent], { type: 'text/html' });
  const url = URL.createObjectURL(blob);
  const printWindow = window.open(url, '_blank');
  if (printWindow) {
    printWindow.onload = () => setTimeout(() => printWindow.print(), 250);
  } else {
    const link = document.createElement('a');
    link.href = url;
    link.download = filename.replace(/\.pdf$/, '.html');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }
}


/**
 * Generate a PDF from formatted text content
 * Uses a simple HTML-to-PDF approach that works in the browser
 */
export function generatePDF(content: string, filename: string): void {
  // Create a printable HTML document
  const htmlContent = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>${filename}</title>
  <style>
    @page {
      size: A4;
      margin: 2cm;
    }
    body {
      font-family: 'Arial', 'Helvetica', sans-serif;
      font-size: 11pt;
      line-height: 1.6;
      color: #333;
      max-width: 100%;
    }
    h1 {
      font-size: 24pt;
      font-weight: bold;
      color: #1a1a1a;
      margin-bottom: 0.5em;
      border-bottom: 3px solid #4a5568;
      padding-bottom: 0.3em;
    }
    h2 {
      font-size: 18pt;
      font-weight: bold;
      color: #2d3748;
      margin-top: 1.5em;
      margin-bottom: 0.5em;
      border-bottom: 2px solid #cbd5e0;
      padding-bottom: 0.2em;
    }
    h3 {
      font-size: 14pt;
      font-weight: bold;
      color: #4a5568;
      margin-top: 1em;
      margin-bottom: 0.3em;
    }
    p {
      margin: 0.5em 0;
      text-align: justify;
    }
    ul {
      margin: 0.5em 0;
      padding-left: 2em;
    }
    li {
      margin: 0.3em 0;
    }
    .section {
      margin-bottom: 2em;
      page-break-inside: avoid;
    }
    .subsection {
      margin-left: 1.5em;
      margin-bottom: 1em;
      page-break-inside: avoid;
    }
    .header {
      text-align: center;
      margin-bottom: 2em;
      padding-bottom: 1em;
      border-bottom: 3px double #4a5568;
    }
    .footer {
      margin-top: 2em;
      padding-top: 1em;
      border-top: 1px solid #cbd5e0;
      text-align: center;
      font-size: 9pt;
      color: #718096;
    }
    pre {
      white-space: pre-wrap;
      word-wrap: break-word;
      font-family: 'Courier New', monospace;
      font-size: 10pt;
      background-color: #f7fafc;
      padding: 1em;
      border-left: 3px solid #4a5568;
      margin: 1em 0;
    }
  </style>
</head>
<body>
  <div class="header">
    <p style="font-size: 10pt; color: #718096; margin-bottom: 0;">Generated on ${new Date().toLocaleDateString()}</p>
  </div>
  <pre>${escapeHtml(content)}</pre>
  <div class="footer">
    <p>© ${new Date().getFullYear()} Essential Funnel Optimizer. All rights reserved.</p>
  </div>
</body>
</html>
  `;

  // Create a blob and trigger download
  const blob = new Blob([htmlContent], { type: 'text/html' });
  const url = URL.createObjectURL(blob);
  
  // Open in a new window for printing
  const printWindow = window.open(url, '_blank');
  
  if (printWindow) {
    printWindow.onload = () => {
      // Small delay to ensure content is rendered
      setTimeout(() => {
        printWindow.print();
        // Note: We don't close the window automatically as the user might want to review
      }, 250);
    };
  } else {
    // Fallback: download as HTML file if popup is blocked
    const link = document.createElement('a');
    link.href = url;
    link.download = filename.replace(/\.pdf$/, '.html');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    
    alert('Popup blocked. Please allow popups to print as PDF, or use the downloaded HTML file.');
  }
}

/**
 * Escape HTML special characters
 */
function escapeHtml(text: string): string {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

/**
 * Alternative: Download as a well-formatted text file
 * This is a simpler fallback that always works
 */
export function downloadAsTextFile(content: string, filename: string): void {
  const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename.replace(/\.pdf$/, '.txt');
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
