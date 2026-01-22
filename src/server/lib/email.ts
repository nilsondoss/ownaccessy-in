import nodemailer from 'nodemailer';
import type { Transporter } from 'nodemailer';

interface EmailOptions {
  to: string;
  subject: string;
  html: string;
  text?: string;
}

class EmailService {
  private transporter: Transporter | null = null;

  constructor() {
    this.initializeTransporter();
  }

  private initializeTransporter() {
    try {
      // Use localhost SMTP (port 25) as per documentation
      this.transporter = nodemailer.createTransport({
        host: 'localhost',
        port: 25,
        secure: false,
        tls: {
          rejectUnauthorized: false,
        },
      });
    } catch (error) {
      console.error('Failed to initialize email transporter:', error);
    }
  }

  async sendEmail(options: EmailOptions): Promise<boolean> {
    if (!this.transporter) {
      console.error('Email transporter not initialized');
      return false;
    }

    try {
      await this.transporter.sendMail({
        from: 'noreply@airoapp.ai',
        to: options.to,
        subject: options.subject,
        html: options.html,
        text: options.text || this.stripHtml(options.html),
      });
      return true;
    } catch (error) {
      console.error('Failed to send email:', error);
      return false;
    }
  }

  private stripHtml(html: string): string {
    return html.replace(/<[^>]*>/g, '');
  }

  // Welcome email when user registers
  async sendWelcomeEmail(email: string, name: string): Promise<boolean> {
    const html = `
      <!DOCTYPE html>
      <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: #2563eb; color: white; padding: 30px; text-align: center; border-radius: 8px 8px 0 0; }
            .content { background: #f9fafb; padding: 30px; border-radius: 0 0 8px 8px; }
            .button { display: inline-block; background: #2563eb; color: white; padding: 12px 30px; text-decoration: none; border-radius: 6px; margin: 20px 0; }
            .footer { text-align: center; margin-top: 30px; color: #6b7280; font-size: 14px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>Welcome to ownaccessy!</h1>
            </div>
            <div class="content">
              <p>Hi ${name},</p>
              <p>Thank you for joining ownaccessy, your trusted platform for accessing verified property information.</p>
              <p><strong>Getting Started:</strong></p>
              <ul>
                <li>Browse our extensive property listings</li>
                <li>Purchase tokens to unlock property owner details</li>
                <li>Download property documents (PDF/Excel)</li>
                <li>Track your unlocked properties in your dashboard</li>
              </ul>
              <p>Ready to explore properties?</p>
              <a href="https://ownaccessy.in/properties" class="button">Browse Properties</a>
              <p>If you have any questions, feel free to reach out to our support team.</p>
              <p>Best regards,<br>The ownaccessy Team</p>
            </div>
            <div class="footer">
              <p>&copy; ${new Date().getFullYear()} ownaccessy. All rights reserved.</p>
            </div>
          </div>
        </body>
      </html>
    `;

    return this.sendEmail({
      to: email,
      subject: 'Welcome to ownaccessy!',
      html,
    });
  }

  // Token purchase confirmation
  async sendTokenPurchaseEmail(
    email: string,
    name: string,
    tokens: number,
    amount: number,
    orderId: string
  ): Promise<boolean> {
    const html = `
      <!DOCTYPE html>
      <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: #10b981; color: white; padding: 30px; text-align: center; border-radius: 8px 8px 0 0; }
            .content { background: #f9fafb; padding: 30px; border-radius: 0 0 8px 8px; }
            .receipt { background: white; padding: 20px; border-radius: 6px; margin: 20px 0; }
            .receipt-row { display: flex; justify-content: space-between; padding: 10px 0; border-bottom: 1px solid #e5e7eb; }
            .receipt-row:last-child { border-bottom: none; font-weight: bold; }
            .button { display: inline-block; background: #2563eb; color: white; padding: 12px 30px; text-decoration: none; border-radius: 6px; margin: 20px 0; }
            .footer { text-align: center; margin-top: 30px; color: #6b7280; font-size: 14px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>✓ Payment Successful</h1>
            </div>
            <div class="content">
              <p>Hi ${name},</p>
              <p>Your token purchase was successful! Your tokens have been added to your account.</p>
              
              <div class="receipt">
                <h3 style="margin-top: 0;">Purchase Receipt</h3>
                <div class="receipt-row">
                  <span>Order ID:</span>
                  <span>${orderId}</span>
                </div>
                <div class="receipt-row">
                  <span>Tokens Purchased:</span>
                  <span>${tokens} tokens</span>
                </div>
                <div class="receipt-row">
                  <span>Amount Paid:</span>
                  <span>₹${amount}</span>
                </div>
                <div class="receipt-row">
                  <span>Date:</span>
                  <span>${new Date().toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
                </div>
              </div>

              <p>You can now use your tokens to unlock property information and access owner details.</p>
              <a href="https://ownaccessy.in/dashboard" class="button">View Dashboard</a>
              
              <p style="margin-top: 30px; font-size: 14px; color: #6b7280;">
                This is an automated receipt for your records. If you have any questions about this transaction, please contact our support team.
              </p>
            </div>
            <div class="footer">
<<<<<<< HEAD
              <p>&copy; ${new Date().getFullYear()} OwnAccessy.in. All rights reserved.</p>
=======
              <p>&copy; ${new Date().getFullYear()} ownaccessy. All rights reserved.</p>
>>>>>>> 20260118033327-qey66h1e3v
            </div>
          </div>
        </body>
      </html>
    `;

    return this.sendEmail({
      to: email,
      subject: `Token Purchase Confirmation - ${tokens} Tokens`,
      html,
    });
  }

  // Property unlock confirmation
  async sendPropertyUnlockEmail(
    email: string,
    name: string,
    propertyTitle: string,
    propertyLocation: string,
    tokensUsed: number,
    remainingTokens: number
  ): Promise<boolean> {
    const html = `
      <!DOCTYPE html>
      <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: #2563eb; color: white; padding: 30px; text-align: center; border-radius: 8px 8px 0 0; }
            .content { background: #f9fafb; padding: 30px; border-radius: 0 0 8px 8px; }
            .property-card { background: white; padding: 20px; border-radius: 6px; margin: 20px 0; border-left: 4px solid #2563eb; }
            .token-info { background: #eff6ff; padding: 15px; border-radius: 6px; margin: 20px 0; }
            .button { display: inline-block; background: #2563eb; color: white; padding: 12px 30px; text-decoration: none; border-radius: 6px; margin: 20px 0; }
            .footer { text-align: center; margin-top: 30px; color: #6b7280; font-size: 14px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>🔓 Property Unlocked</h1>
            </div>
            <div class="content">
              <p>Hi ${name},</p>
              <p>You have successfully unlocked property information!</p>
              
              <div class="property-card">
                <h3 style="margin-top: 0; color: #2563eb;">${propertyTitle}</h3>
                <p style="color: #6b7280; margin: 5px 0;">📍 ${propertyLocation}</p>
              </div>

              <div class="token-info">
                <p style="margin: 5px 0;"><strong>Tokens Used:</strong> ${tokensUsed}</p>
                <p style="margin: 5px 0;"><strong>Remaining Balance:</strong> ${remainingTokens} tokens</p>
              </div>

              <p>You now have access to:</p>
              <ul>
                <li>Property owner contact information</li>
                <li>Verified owner details (name, email, phone)</li>
                <li>Property address and documentation</li>
                <li>Downloadable PDF and Excel reports</li>
              </ul>

              <a href="${process.env.VITE_PUBLIC_URL || 'http://localhost:5173'}/dashboard" class="button">View in Dashboard</a>
              
              ${remainingTokens < 5 ? `
                <p style="background: #fef3c7; padding: 15px; border-radius: 6px; border-left: 4px solid #f59e0b; margin-top: 20px;">
                  ⚠️ <strong>Low Token Balance:</strong> You have ${remainingTokens} tokens remaining. Consider purchasing more tokens to continue unlocking properties.
                </p>
              ` : ''}
            </div>
            <div class="footer">
              <p>&copy; ${new Date().getFullYear()} OwnAccessy.in. All rights reserved.</p>
            </div>
          </div>
        </body>
      </html>
    `;

    return this.sendEmail({
      to: email,
      subject: `Property Unlocked: ${propertyTitle}`,
      html,
    });
  }

  // Low token balance alert
  async sendLowTokenAlert(
    email: string,
    name: string,
    remainingTokens: number
  ): Promise<boolean> {
    const html = `
      <!DOCTYPE html>
      <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: #f59e0b; color: white; padding: 30px; text-align: center; border-radius: 8px 8px 0 0; }
            .content { background: #f9fafb; padding: 30px; border-radius: 0 0 8px 8px; }
            .alert-box { background: #fef3c7; padding: 20px; border-radius: 6px; border-left: 4px solid #f59e0b; margin: 20px 0; }
            .button { display: inline-block; background: #2563eb; color: white; padding: 12px 30px; text-decoration: none; border-radius: 6px; margin: 20px 0; }
            .footer { text-align: center; margin-top: 30px; color: #6b7280; font-size: 14px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>⚠️ Low Token Balance</h1>
            </div>
            <div class="content">
              <p>Hi ${name},</p>
              
              <div class="alert-box">
                <h3 style="margin-top: 0; color: #f59e0b;">Your token balance is running low</h3>
                <p style="font-size: 18px; margin: 10px 0;"><strong>Current Balance: ${remainingTokens} tokens</strong></p>
              </div>

              <p>Don't miss out on unlocking more properties! Purchase tokens now to continue accessing property information.</p>
              
              <p><strong>Available Token Packs:</strong></p>
              <ul>
                <li><strong>Starter Pack:</strong> 10 tokens - ₹500</li>
                <li><strong>Professional Pack:</strong> 25 tokens - ₹1,000 (Best Value)</li>
                <li><strong>Enterprise Pack:</strong> 60 tokens - ₹2,000 (Maximum Savings)</li>
              </ul>

              <a href="https://ownaccessy.in/pricing" class="button">Buy More Tokens</a>
              
              <p style="margin-top: 30px; font-size: 14px; color: #6b7280;">
                This is an automated reminder. You can manage your notification preferences in your account settings.
              </p>
            </div>
            <div class="footer">
              <p>&copy; ${new Date().getFullYear()} ownaccessy. All rights reserved.</p>
            </div>
          </div>
        </body>
      </html>
    `;

    return this.sendEmail({
      to: email,
      subject: '⚠️ Low Token Balance - ownaccessy',
      html,
    });
  }
}

// Export singleton instance
export const emailService = new EmailService();
