/**
 * Utilities for copying Word-compatible rich HTML + plain text
 * and downloading clean .doc files directly usable in Microsoft Word.
 */

export async function copyRichTextForWord(
  plainText: string,
  htmlContent: string
): Promise<boolean> {
  try {
    if (
      typeof navigator !== 'undefined' &&
      navigator.clipboard &&
      typeof ClipboardItem !== 'undefined'
    ) {
      const htmlBlob = new Blob([htmlContent], { type: 'text/html' });
      const textBlob = new Blob([plainText], { type: 'text/plain' });
      await navigator.clipboard.write([
        new ClipboardItem({
          'text/html': htmlBlob,
          'text/plain': textBlob,
        }),
      ]);
      return true;
    }
  } catch {
    // Fallback to plain text clipboard below
  }

  try {
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      await navigator.clipboard.writeText(plainText);
      return true;
    }
  } catch {
    // Legacy execCommand fallback
  }

  try {
    const textarea = document.createElement('textarea');
    textarea.value = plainText;
    textarea.style.position = 'fixed';
    textarea.style.opacity = '0';
    document.body.appendChild(textarea);
    textarea.focus();
    textarea.select();
    const ok = document.execCommand('copy');
    document.body.removeChild(textarea);
    return ok;
  } catch {
    return false;
  }
}

export function downloadWordDocument(filename: string, bodyHtml: string): void {
  const fullHtml = `<!DOCTYPE html>
<html xmlns:o="urn:schemas-microsoft-com:office:office"
      xmlns:w="urn:schemas-microsoft-com:office:word"
      xmlns="http://www.w3.org/TR/REC-html40"
      lang="vi">
<head>
  <meta charset="utf-8" />
  <title>${filename}</title>
  <style>
    body {
      font-family: "Times New Roman", serif;
      font-size: 13pt;
      line-height: 1.45;
      color: #0F172A;
      margin: 2cm 2cm 2cm 2.5cm;
    }
    h1 { font-size: 15pt; font-weight: bold; margin-bottom: 8pt; }
    h2 { font-size: 13.5pt; font-weight: bold; margin-top: 12pt; margin-bottom: 6pt; }
    p { margin: 4pt 0; text-align: justify; }
    table { border-collapse: collapse; width: 100%; margin: 8pt 0; }
    th, td { border: 1px solid #475569; padding: 6pt; vertical-align: top; text-align: left; }
    th { background: #F1F5F9; font-weight: bold; }
  </style>
</head>
<body>
${bodyHtml}
</body>
</html>`;

  const blob = new Blob(['\ufeff', fullHtml], {
    type: 'application/msword;charset=utf-8',
  });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename.endsWith('.doc') ? filename : `${filename}.doc`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
