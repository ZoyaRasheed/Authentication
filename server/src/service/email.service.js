import nodemailer from 'nodemailer';
import config from '../config/config.js';
import logger from '../util/logger.js'; 

const transporter = nodemailer.createTransport({
  host: config.SMTP_MAIL_HOST, 
  port: config.SMTP_MAIL_PORT,
  secure: config.SMTP_MAIL_PORT === 465, 
  auth: {
    user: config.EMAIL_USER,
    pass: config.EMAIL_PASSWORD, 
  },

  tls: {
    rejectUnauthorized: false,
    minVersion: 'TLSv1.2',
  },
  debug: process.env.NODE_ENV !== 'production',
});

const verifyConnection = async () => {
  try {
    await transporter.verify();
    logger.info('Email service connection verified');
    return true;
  } catch (error) {
    logger.error(`Email service connection failed: ${error.message}`);
    return false;
  }
};

verifyConnection().catch(console.error);

export default {
  sendEmail: async (to, subject, text, html) => {
    try {
      const info = await transporter.sendMail({
        from: `Easy Tech Innovate <${config.EMAIL_USER}>`,
        to,
        subject,
        text,
        ...(html && { html }),
      });
      
      logger.info(`Email sent to ${to}: ${info.messageId}`);
      return info;
    } catch (err) {
      logger.error(`Email error: ${err.message}`);
      
      if (err instanceof Error) {
        throw new Error(`Failed to send email: ${err.message}`);
      }
      throw new Error('An unknown error occurred while sending email');
    }
  }
};