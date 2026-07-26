export interface WhatsAppReminderData {
  id?: string;
  recipientName: string;
  recipientPhone: string;
  reminderType: 'HEARING_ALERT' | 'APPOINTMENT_REMINDER' | 'INVOICE_REMINDER' | 'STATUTORY_LIMITATION' | 'CUSTOM';
  caseTitle?: string;
  caseNumber?: string;
  courtName?: string;
  courtHall?: string;
  hearingDate?: string;
  hearingTime?: string;
  hearingStage?: string;
  judgeName?: string;
  appointmentDate?: string;
  appointmentTime?: string;
  appointmentMode?: string;
  purpose?: string;
  invoiceNumber?: string;
  amountDue?: number | string;
  dueDate?: string;
  statutoryType?: string;
  daysRemaining?: number | string;
  lawyerName?: string;
  firmName?: string;
  customMessage?: string;
}

export function sanitizePhoneNumber(phone: string): string {
  if (!phone) return '';
  // Remove all non-numeric characters except leading +
  let cleaned = phone.replace(/[^\d+]/g, '');
  if (cleaned.startsWith('+')) {
    cleaned = cleaned.substring(1);
  }
  // If Indian 10-digit number without country code (e.g. 9876543210), prepend 91
  if (cleaned.length === 10 && (cleaned.startsWith('6') || cleaned.startsWith('7') || cleaned.startsWith('8') || cleaned.startsWith('9'))) {
    cleaned = '91' + cleaned;
  }
  return cleaned;
}

export function generateWhatsAppMessage(data: WhatsAppReminderData): string {
  if (data.customMessage && data.reminderType === 'CUSTOM') {
    return data.customMessage;
  }

  const lawyerName = data.lawyerName || 'Adv. Rajeshwar V. Sharma';
  const firmName = data.firmName || 'LawyerDesk AI Legal Chambers';

  switch (data.reminderType) {
    case 'HEARING_ALERT':
      return `🏛️ *COURT HEARING ALERT - LAWYERDESK AI*

Dear ${data.recipientName || 'Client'},

This is an automated reminder regarding your upcoming hearing in *${data.courtName || 'Delhi High Court'}* (${data.courtHall || 'Court Room 15'}).

📌 *Case:* ${data.caseTitle || 'Legal Matter'} (${data.caseNumber || 'N/A'})
📅 *Date:* ${data.hearingDate || 'Upcoming'}
⏰ *Time:* ${data.hearingTime || '10:30 AM'}
⚖️ *Stage:* ${data.hearingStage || 'Arguments / Hearing'}
🏛️ *Hon'ble Bench:* ${data.judgeName || 'Hon’ble Bench'}

Kindly reach the court premises 30 minutes prior to scheduled time. For urgent queries, reply directly to this message.

Regards,
*${lawyerName}*
${firmName}`;

    case 'APPOINTMENT_REMINDER':
      return `📅 *LEGAL CONSULTATION REMINDER - LAWYERDESK AI*

Dear ${data.recipientName || 'Client'},

Your consultation with *${lawyerName}* is confirmed:

📆 *Date:* ${data.appointmentDate || 'Today'}
⏰ *Time:* ${data.appointmentTime || '03:00 PM'}
📍 *Venue/Mode:* ${data.appointmentMode || 'Chamber Meeting'}
🎯 *Purpose:* ${data.purpose || 'Case Briefing'}

Please bring relevant case documents and order sheets.

Regards,
${firmName}`;

    case 'INVOICE_REMINDER':
      const formattedAmount = typeof data.amountDue === 'number' 
        ? data.amountDue.toLocaleString('en-IN') 
        : (data.amountDue || '0');

      return `💳 *LEGAL FEE PAYMENT REMINDER - LAWYERDESK AI*

Dear ${data.recipientName || 'Client'},

This is a gentle reminder regarding pending legal invoice *#${data.invoiceNumber || 'INV-2026'}* for matter *${data.caseTitle || 'Legal Services'}*.

💰 *Amount Due:* ₹${formattedAmount}
📅 *Due Date:* ${data.dueDate || 'Immediate'}

Kindly process the payment at your earliest convenience to maintain uninterrupted representation.

Regards,
${firmName}`;

    case 'STATUTORY_LIMITATION':
      return `⚠️ *STATUTORY LIMITATION DEADLINE ALERT - LAWYERDESK AI*

Dear ${data.recipientName || 'Counsel / Client'},

This is an urgent automated reminder regarding a statutory court limitation deadline:

📌 *Matter:* ${data.caseTitle || 'Statutory Deadline'} (${data.caseNumber || 'N/A'})
⚖️ *Compliance Type:* ${data.statutoryType || 'Order Compliance / Limitation'}
📅 *Statutory Due Date:* ${data.dueDate || 'Immediate'}
⏳ *Days Remaining:* ${data.daysRemaining ?? 'Critical'} Days

Kindly ensure necessary court filings, affidavits, or stamp deposits are executed prior to deadline expiration.

Regards,
*${lawyerName}*
${firmName}`;

    case 'CUSTOM':
    default:
      return data.customMessage || `Legal update from ${firmName} regarding matter ${data.caseTitle || ''}.`;
  }
}

export function openWhatsAppWeb(recipientPhone: string, message: string): void {
  const cleanPhone = sanitizePhoneNumber(recipientPhone);
  const encodedText = encodeURIComponent(message);
  const whatsappUrl = `https://api.whatsapp.com/send?phone=${cleanPhone}&text=${encodedText}`;
  window.open(whatsappUrl, '_blank', 'noopener,noreferrer');
}

export async function sendBackendWhatsAppReminder(data: WhatsAppReminderData): Promise<{
  success: boolean;
  method: string;
  whatsappUrl?: string;
  message?: string;
  error?: string;
}> {
  try {
    const formattedMessage = generateWhatsAppMessage(data);
    const cleanPhone = sanitizePhoneNumber(data.recipientPhone);

    const response = await fetch('/api/whatsapp/send-reminder', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        recipientPhone: cleanPhone,
        recipientName: data.recipientName,
        reminderType: data.reminderType,
        message: formattedMessage,
        matterTitle: data.caseTitle,
        caseNumber: data.caseNumber,
      }),
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }

    const result = await response.json();
    return result;
  } catch (err: any) {
    console.warn('Backend WhatsApp API call fallback to direct link:', err);
    const cleanPhone = sanitizePhoneNumber(data.recipientPhone);
    const formattedMessage = generateWhatsAppMessage(data);
    const encodedText = encodeURIComponent(formattedMessage);
    const whatsappUrl = `https://api.whatsapp.com/send?phone=${cleanPhone}&text=${encodedText}`;

    return {
      success: true,
      method: 'DIRECT_WHATSAPP_LINK',
      whatsappUrl,
      message: 'Generated direct WhatsApp dispatch link.',
    };
  }
}
