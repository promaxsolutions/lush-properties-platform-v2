import cron from 'node-cron';

interface Project {
  id: string;
  name: string;
  lastUpdate: Date;
  builderEmail: string;
  builderPhone?: string;
  nextMilestone: string;
  daysUntilMilestone: number;
}

interface ReminderService {
  checkInactiveProjects(): Promise<void>;
  sendEmailReminder(project: Project): Promise<void>;
  sendWhatsAppReminder(project: Project): Promise<void>;
}

class AutomatedReminderService implements ReminderService {
  
  // Check for projects inactive for 7+ days
  async checkInactiveProjects(): Promise<void> {
    try {
      // Mock project data - in production, this would query the database
      const projects: Project[] = [
        {
          id: "proj-001",
          name: "Luxury Townhouse Development",
          lastUpdate: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000), // 8 days ago
          builderEmail: "builder@lush.com",
          builderPhone: "+61400000000",
          nextMilestone: "Lockup Complete",
          daysUntilMilestone: 5
        },
        {
          id: "proj-002",
          name: "Modern Villa Project", 
          lastUpdate: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), // 3 days ago
          builderEmail: "contractor@lush.com",
          nextMilestone: "Frame Start",
          daysUntilMilestone: 12
        }
      ];

      const inactiveProjects = projects.filter(project => {
        const daysSinceUpdate = Math.floor((Date.now() - project.lastUpdate.getTime()) / (24 * 60 * 60 * 1000));
        return daysSinceUpdate >= 7;
      });

      console.log(`📅 REMINDER SYSTEM: Found ${inactiveProjects.length} inactive projects`);

      for (const project of inactiveProjects) {
        await this.sendEmailReminder(project);
        if (project.builderPhone) {
          await this.sendWhatsAppReminder(project);
        }
        
        // Log the reminder
        await this.logReminderSent(project);
      }

    } catch (error) {
      console.error('❌ Reminder system error:', error);
    }
  }

  async sendEmailReminder(project: Project): Promise<void> {
    const emailContent = {
      to: project.builderEmail,
      subject: `🚨 Project Update Reminder: ${project.name}`,
      html: `
        <div style="font-family: Inter, Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: linear-gradient(135deg, #007144, #FFD700); padding: 30px; text-align: center; border-radius: 12px 12px 0 0;">
            <h1 style="color: white; margin: 0; font-size: 28px;">LushOS Project Alert</h1>
            <p style="color: rgba(255,255,255,0.9); margin: 10px 0 0 0;">Automated Milestone Reminder</p>
          </div>
          
          <div style="background: white; padding: 30px; border-radius: 0 0 12px 12px; box-shadow: 0 4px 12px rgba(0,0,0,0.15);">
            <h2 style="color: #007144; margin-top: 0;">Project Update Required</h2>
            <p style="font-size: 16px; line-height: 1.6; color: #333;">
              Hi there,<br><br>
              Your project <strong>${project.name}</strong> hasn't been updated in over 7 days. 
              Please upload progress photos, receipts, or milestone updates to keep the project on track.
            </p>
            
            <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
              <h3 style="color: #007144; margin-top: 0;">Project Details:</h3>
              <ul style="margin: 0; padding-left: 20px;">
                <li><strong>Next Milestone:</strong> ${project.nextMilestone}</li>
                <li><strong>Days Until Milestone:</strong> ${project.daysUntilMilestone}</li>
                <li><strong>Last Update:</strong> ${project.lastUpdate.toLocaleDateString()}</li>
              </ul>
            </div>
            
            <div style="text-align: center; margin: 30px 0;">
              <a href="https://lush-app.replit.app/polished-dashboard" 
                 style="background: #007144; color: white; padding: 15px 30px; text-decoration: none; border-radius: 8px; font-weight: 600; display: inline-block;">
                Update Project Now
              </a>
            </div>
            
            <p style="font-size: 14px; color: #666; margin-bottom: 0;">
              This is an automated reminder from LushOS. If you have questions, reply to this email.
            </p>
          </div>
        </div>
      `
    };

    // Mock email sending - in production, use SendGrid or similar
    console.log(`📧 EMAIL REMINDER: Sent to ${project.builderEmail} for project ${project.name}`);
    
    // Simulate API call
    return new Promise(resolve => setTimeout(resolve, 100));
  }

  async sendWhatsAppReminder(project: Project): Promise<void> {
    const whatsappMessage = `
🚨 *LushOS Project Alert*

Hi! Your project *${project.name}* needs an update.

📅 Last update: ${project.lastUpdate.toLocaleDateString()}
🎯 Next milestone: ${project.nextMilestone} (${project.daysUntilMilestone} days)

Please upload:
• Progress photos
• Recent receipts
• Milestone updates

Update now: https://lush-app.replit.app/polished-dashboard

_Automated reminder from LushOS_
    `.trim();

    // Mock WhatsApp API call - in production, use Twilio or WhatsApp Business API
    console.log(`📱 WHATSAPP REMINDER: Sent to ${project.builderPhone} for project ${project.name}`);
    console.log(`Message: ${whatsappMessage}`);
    
    // Simulate API call
    return new Promise(resolve => setTimeout(resolve, 100));
  }

  async logReminderSent(project: Project): Promise<void> {
    const auditData = {
      action: 'REMINDER_SENT',
      userId: 'system',
      email: 'system@lush.com',
      resource: project.id,
      ipAddress: 'internal',
      userAgent: 'LushOS-ReminderSystem/1.0',
      details: {
        projectName: project.name,
        reminderType: 'milestone_inactive',
        daysSinceUpdate: Math.floor((Date.now() - project.lastUpdate.getTime()) / (24 * 60 * 60 * 1000)),
        builderEmail: project.builderEmail
      },
      timestamp: new Date()
    };

    console.log(`📋 AUDIT LOG: Reminder sent for project ${project.name}`);
    
    // In production, this would save to database
    return new Promise(resolve => setTimeout(resolve, 50));
  }
}

// Initialize reminder service
const reminderService = new AutomatedReminderService();

// Setup cron job to run daily at 9 AM
export const setupAutomatedReminders = () => {
  // Run every day at 9:00 AM
  cron.schedule('0 9 * * *', async () => {
    console.log('🕘 CRON JOB: Running automated reminder check at', new Date().toLocaleString());
    await reminderService.checkInactiveProjects();
  });

  // Also run every hour during business hours (9 AM - 6 PM) for more frequent checks
  cron.schedule('0 9-18 * * 1-5', async () => {
    console.log('🕘 HOURLY CHECK: Running reminder system at', new Date().toLocaleString());
    await reminderService.checkInactiveProjects();
  });

  console.log('✅ REMINDER SYSTEM: Automated milestone reminders configured');
  console.log('📅 Schedule: Daily at 9 AM + Hourly during business hours');
  
  // Run initial check
  reminderService.checkInactiveProjects();
};

export { reminderService };