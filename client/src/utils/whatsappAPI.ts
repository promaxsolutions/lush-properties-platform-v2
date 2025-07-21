// WhatsApp API utilities for sending reminders and notifications

export interface WhatsAppMessage {
  recipient: string;
  message: string;
  type?: 'text' | 'template';
}

export const sendWhatsAppReminder = async (recipient: string, message: string): Promise<boolean> => {
  try {
    const response = await fetch('/api/notifications/whatsapp', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        recipient,
        message,
        type: 'text'
      })
    });

    const result = await response.json();
    return result.success;
  } catch (error) {
    console.error('WhatsApp API Error:', error);
    return false;
  }
};

export const sendMilestoneNotification = async (
  recipient: string, 
  milestones: string[], 
  projectName: string
): Promise<boolean> => {
  const message = `🏗️ ${projectName} Update: Milestones completed - ${milestones.join(', ')}. Great progress!`;
  return sendWhatsAppReminder(recipient, message);
};

export const sendMissingReceiptAlert = async (
  recipient: string, 
  missingItems: string[], 
  projectName: string
): Promise<boolean> => {
  const message = `⚠️ ${projectName} Alert: Missing receipts for - ${missingItems.join(', ')}. Please upload when available.`;
  return sendWhatsAppReminder(recipient, message);
};

export const sendBudgetAlert = async (
  recipient: string, 
  currentSpend: number, 
  budget: number, 
  projectName: string
): Promise<boolean> => {
  const percentage = Math.round((currentSpend / budget) * 100);
  const message = `💰 ${projectName} Budget Alert: ${percentage}% spent ($${currentSpend.toLocaleString()} of $${budget.toLocaleString()})`;
  return sendWhatsAppReminder(recipient, message);
};