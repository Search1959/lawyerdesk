export function numberToWordsIndian(num: number): string {
  if (!num || isNaN(num) || num === 0) return 'Rupees Zero Only';

  const a = [
    '',
    'One ',
    'Two ',
    'Three ',
    'Four ',
    'Five ',
    'Six ',
    'Seven ',
    'Eight ',
    'Nine ',
    'Ten ',
    'Eleven ',
    'Twelve ',
    'Thirteen ',
    'Fourteen ',
    'Fifteen ',
    'Sixteen ',
    'Seventeen ',
    'Eighteen ',
    'Nineteen ',
  ];
  const b = ['', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety'];

  const inWords = (n: number): string => {
    if (n < 20) return a[n];
    const digit = n % 10;
    return `${b[Math.floor(n / 10)]} ${a[digit]}`;
  };

  let str = '';
  const rounded = Math.round(num);
  let n = rounded;

  const crore = Math.floor(n / 10000000);
  n %= 10000000;
  const lakh = Math.floor(n / 100000);
  n %= 100000;
  const thousand = Math.floor(n / 1000);
  n %= 1000;
  const hundred = Math.floor(n / 100);
  const remaining = n % 100;

  if (crore > 0) str += `${inWords(crore)}Crore `;
  if (lakh > 0) str += `${inWords(lakh)}Lakh `;
  if (thousand > 0) str += `${inWords(thousand)}Thousand `;
  if (hundred > 0) str += `${inWords(hundred)}Hundred `;
  if (remaining > 0) str += `${inWords(remaining)}`;

  return `Rupees ${str.trim()} Only`;
}

export function exportInvoicesToCSV(invoices: any[]) {
  if (!invoices || invoices.length === 0) return;

  const headers = [
    'Invoice Number',
    'Client Name',
    'Client GSTIN/PAN',
    'Law Firm Name',
    'Fee Type',
    'Status',
    'Issue Date',
    'Due Date',
    'Subtotal (INR)',
    'GST (INR)',
    'Total (INR)',
    'Notes',
  ];

  const rows = invoices.map((inv) => [
    `"${inv.invoiceNumber || ''}"`,
    `"${(inv.clientName || '').replace(/"/g, '""')}"`,
    `"${inv.clientGstin || ''}"`,
    `"${(inv.lawFirmName || '').replace(/"/g, '""')}"`,
    `"${inv.feeType || 'Appearance Fee'}"`,
    `"${inv.status || 'Pending'}"`,
    `"${inv.issueDate || ''}"`,
    `"${inv.dueDate || ''}"`,
    inv.subtotalINR || 0,
    inv.gstINR || 0,
    inv.totalINR || 0,
    `"${(inv.notes || '').replace(/"/g, '""')}"`,
  ]);

  const csvContent = [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', `LawyerDesk_GST_Invoices_${new Date().toISOString().split('T')[0]}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

export function exportInvoicesToJSON(invoices: any[]) {
  if (!invoices || invoices.length === 0) return;
  const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(invoices, null, 2));
  const link = document.createElement('a');
  link.setAttribute('href', dataStr);
  link.setAttribute('download', `LawyerDesk_Invoices_Backup_${new Date().toISOString().split('T')[0]}.json`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

export function parseInvoicesFromText(text: string): any[] {
  text = text.trim();
  if (text.startsWith('[') || text.startsWith('{')) {
    try {
      const parsed = JSON.parse(text);
      return Array.isArray(parsed) ? parsed : [parsed];
    } catch {
      // Fall through to CSV parser
    }
  }

  // Parse CSV
  const lines = text.split(/\r?\n/).filter((l) => l.trim().length > 0);
  if (lines.length < 2) return [];

  const parsedInvoices: any[] = [];
  for (let i = 1; i < lines.length; i++) {
    // split by comma ignoring quotes
    const cols = lines[i].split(/,(?=(?:[^\"]*\"[^\"]*\")*[^\"]*$)/).map((col) => col.replace(/^"|"$/g, '').trim());
    if (cols.length >= 2) {
      const invNum = cols[0] || `SLA/2026/IMP-${Math.floor(100 + Math.random() * 900)}`;
      const clientName = cols[1] || 'Imported Client';
      const clientGstin = cols[2] || '';
      const lawFirmName = cols[3] || 'LawyerDesk Chambers';
      const feeType = cols[4] || 'Appearance Fee';
      const status = cols[5] || 'Pending';
      const issueDate = cols[6] || new Date().toISOString().split('T')[0];
      const dueDate = cols[7] || new Date(Date.now() + 15 * 86400000).toISOString().split('T')[0];
      const subtotal = Number(cols[8]) || 100000;
      const gst = Number(cols[9]) || Math.round(subtotal * 0.18);
      const total = Number(cols[10]) || subtotal + gst;
      const notes = cols[11] || 'Imported Tax Invoice';

      parsedInvoices.push({
        invoiceNumber: invNum,
        clientName,
        clientGstin,
        lawFirmName,
        feeType,
        status,
        issueDate,
        dueDate,
        subtotalINR: subtotal,
        gstINR: gst,
        totalINR: total,
        taxType: 'CGST_SGST',
        cgstINR: Math.round(gst / 2),
        sgstINR: Math.round(gst / 2),
        igstINR: 0,
        notes,
        items: [{ description: `Legal Fee - ${feeType}`, amountINR: subtotal, sacCode: '998211' }],
      });
    }
  }
  return parsedInvoices;
}

