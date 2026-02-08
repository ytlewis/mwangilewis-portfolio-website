const nodemailer = require('nodemailer');

class EmailService {
  constructor() {
    this.transporter = null;
    this.initialized = false;
    this.initializeTransporter();
  }

  initializeTransporter() {
    try {
      // Configure transporter based on environment
      if (process.env.EMAIL_SERVICE === 'gmail') {
        this.transporter = nodemailer.createTransport({
          service: 'gmail',
          auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS
          }
        });
      } else if (process.env.SMTP_HOST) {
        // Generic SMTP configuration
        this.transporter = nodemailer.createTransport({
          host: process.env.SMTP_HOST,
          port: process.env.SMTP_PORT || 587,
          secure: process.env.SMTP_SECURE === 'true',
          auth: {
            user: process.env.SMTP_USER,
            pass: process.env.SMTP_PASS
          }
        });
      } else {
        // Development mode - use ethereal email for testing
        this.createTestAccount();
        return;
      }

      this.initialized = true;
      console.log('Email service initialized successfully');
    } catch (error) {
      console.error('Failed to initialize email service:', error);
      this.initialized = false;
    }
  }

  async createTestAccount() {
    try {
      const testAccount = await nodemailer.createTestAccount();
      
      this.transporter = nodemailer.createTransport({
        host: 'smtp.ethereal.email',
        port: 587,
        secure: false,
        auth: {
          user: testAccount.user,
          pass: testAccount.pass
        }
      });

      this.initialized = true;
      console.log('Test email account created:', testAccount.user);
    } catch (error) {
      console.error('Failed to create test email account:', error);
      this.initialized = false;
    }
  }

  async sendContactNotification(contactData) {
    if (!this.initialized || !this.transporter) {
      console.warn('Email service not initialized, skipping email notification');
      return false;
    }

    try {
      const { name, email, message } = contactData;
      
      const mailOptions = {
        from: process.env.EMAIL_USER || 'noreply@mwangilewis.com',
        to: process.env.ADMIN_EMAIL || 'gathaiyalewis1122@gmail.com',
        subject: `New Contact Form Submission from ${name}`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #E63946; border-bottom: 2px solid #E63946; padding-bottom: 10px;">
              New Contact Form Submission
            </h2>
            
            <div style="background-color: #f8f9fa; padding: 20px; border-radius: 5px; margin: 20px 0;">
              <h3 style="margin-top: 0; color: #333;">Contact Details:</h3>
              <p><strong>Name:</strong> ${name}</p>
              <p><strong>Email:</strong> ${email}</p>
              <p><strong>Submitted:</strong> ${new Date().toLocaleString()}</p>
            </div>
            
            <div style="background-color: #ffffff; padding: 20px; border: 1px solid #dee2e6; border-radius: 5px;">
              <h3 style="margin-top: 0; color: #333;">Message:</h3>
              <p style="line-height: 1.6; color: #555;">${message}</p>
            </div>
            
            <div style="margin-top: 30px; padding: 15px; background-color: #e9ecef; border-radius: 5px; text-align: center;">
              <p style="margin: 0; color: #666; font-size: 14px;">
                This email was sent from the contact form on mwangilewis.com
              </p>
            </div>
          </div>
        `,
        text: `
New Contact Form Submission

Name: ${name}
Email: ${email}
Submitted: ${new Date().toLocaleString()}

Message:
${message}

---
This email was sent from the contact form on mwangilewis.com
        `
      };

      const info = await this.transporter.sendMail(mailOptions);
      
      // Log preview URL for development
      if (process.env.NODE_ENV === 'development' && nodemailer.getTestMessageUrl(info)) {
        console.log('Preview URL:', nodemailer.getTestMessageUrl(info));
      }

      console.log('Contact notification email sent:', info.messageId);
      return true;

    } catch (error) {
      console.error('Failed to send contact notification email:', error);
      return false;
    }
  }

  async sendAdminNotification(message) {
    if (!this.initialized || !this.transporter) {
      console.warn('Email service not initialized, skipping admin notification');
      return false;
    }

    try {
      const mailOptions = {
        from: process.env.EMAIL_USER || 'noreply@mwangilewis.com',
        to: process.env.ADMIN_EMAIL || 'gathaiyalewis1122@gmail.com',
        subject: 'Portfolio Admin Notification',
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #E63946; border-bottom: 2px solid #E63946; padding-bottom: 10px;">
              Admin Notification
            </h2>
            
            <div style="background-color: #ffffff; padding: 20px; border: 1px solid #dee2e6; border-radius: 5px;">
              <p style="line-height: 1.6; color: #555;">${message}</p>
            </div>
            
            <div style="margin-top: 30px; padding: 15px; background-color: #e9ecef; border-radius: 5px; text-align: center;">
              <p style="margin: 0; color: #666; font-size: 14px;">
                Sent from Lewis Portfolio Admin System at ${new Date().toLocaleString()}
              </p>
            </div>
          </div>
        `,
        text: `
Admin Notification

${message}

---
Sent from Lewis Portfolio Admin System at ${new Date().toLocaleString()}
        `
      };

      const info = await this.transporter.sendMail(mailOptions);
      
      // Log preview URL for development
      if (process.env.NODE_ENV === 'development' && nodemailer.getTestMessageUrl(info)) {
        console.log('Preview URL:', nodemailer.getTestMessageUrl(info));
      }

      console.log('Admin notification email sent:', info.messageId);
      return true;

    } catch (error) {
      console.error('Failed to send admin notification email:', error);
      return false;
    }
  }

  async verifyConnection() {
    if (!this.initialized || !this.transporter) {
      return false;
    }

    try {
      await this.transporter.verify();
      return true;
    } catch (error) {
      console.error('Email service connection verification failed:', error);
      return false;
    }
  }
}

// Create singleton instance
const emailService = new EmailService();

module.exports = emailService;