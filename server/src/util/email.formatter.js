export const generateConfirmationEmailHtml = (name, confirmationUrl) => {
    return `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Confirm Your Account</title>
        <style>
          body {
            margin: 0;
            padding: 0;
            font-family: 'Arial', sans-serif;
            background-color: #f0f2f5;
            line-height: 1.6;
          }
          
          .email-container {
            max-width: 600px;
            margin: 0 auto;
            background-color: #ffffff;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
            border-radius: 12px;
            overflow: hidden;
          }
          
          .header {
            background-color: #3b82f6;
            color: white;
            text-align: center;
            padding: 20px;
          }
          
          .header h1 {
            margin: 0;
            font-size: 24px;
          }
          
          .content {
            padding: 30px 20px;
            text-align: center;
          }
          
          .content h2 {
            color: #1e1e1e;
            margin-bottom: 20px;
          }
          
          .content p {
            color: #4a4a4a;
            margin-bottom: 20px;
          }
          
          .confirm-button {
            display: inline-block;
            background-color: #3b82f6;
            color: white !important;
            text-decoration: none;
            padding: 12px 24px;
            border-radius: 8px;
            font-weight: bold;
            margin: 20px 0;
          }
          
          .link-section {
            background-color: #f0f2f5;
            padding: 15px;
            margin: 20px 0;
            border-radius: 8px;
            word-break: break-all;
          }
          
          .footer {
            background-color: #f0f2f5;
            color: #6b7280;
            text-align: center;
            padding: 15px;
            font-size: 12px;
          }
          
          @media only screen and (max-width: 600px) {
            .email-container {
              width: 100%;
              border-radius: 0;
            }
          }
        </style>
      </head>
      <body>
        <div class="email-container">
          <div class="header">
            <h1>Account Verification</h1>
          </div>
          
          <div class="content">
            <h2>Verify Your Email Address</h2>
            
            <p>Hi ${name},</p>
            
            <p>Thank you for creating an account. To complete your account setup and access all features, please verify your email address by clicking the button below:</p>
            
            <a href="${confirmationUrl}" class="confirm-button">Verify Email</a>
            
            <p>If the button doesn't work, copy and paste this link into your browser:</p>
            
            <div class="link-section">
              <a href="${confirmationUrl}">${confirmationUrl}</a>
            </div>
            
            <p>If you didn't create an account, you can safely ignore this email.</p>
          </div>
          
          <div class="footer">
            <p>&copy; ${new Date().getFullYear()} All rights reserved.</p>
          </div>
        </div>
      </body>
      </html>
    `;
  };
  
  export const generateAccountConfirmedHtml = () => {
    return `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Account Confirmed</title>
        <style>
          body {
            margin: 0;
            padding: 0;
            font-family: 'Arial', sans-serif;
            background-color: #f0f2f5;
            line-height: 1.6;
          }
          
          .email-container {
            max-width: 600px;
            margin: 0 auto;
            background-color: #ffffff;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
            border-radius: 12px;
            overflow: hidden;
          }
          
          .header {
            background-color: #3b82f6;
            color: white;
            text-align: center;
            padding: 20px;
          }
          
          .header h1 {
            margin: 0;
            font-size: 24px;
          }
          
          .content {
            padding: 30px 20px;
            text-align: center;
          }
          
          .success-icon {
            margin-bottom: 20px;
            display: flex;
            justify-content: center;
          }
          
          .success-icon svg {
            width: 64px;
            height: 64px;
            fill: #22c55e;
          }
          
          .content h2 {
            color: #1e1e1e;
            margin-bottom: 20px;
          }
          
          .content p {
            color: #4a4a4a;
            margin-bottom: 15px;
          }
          
          .footer {
            background-color: #f0f2f5;
            color: #6b7280;
            text-align: center;
            padding: 15px;
            font-size: 12px;
          }
          
          @media only screen and (max-width: 600px) {
            .email-container {
              width: 100%;
              border-radius: 0;
            }
          }
        </style>
      </head>
      <body>
        <div class="email-container">
          <div class="header">
            <h1>Account Verification</h1>
          </div>
          
          <div class="content">
            <div class="success-icon">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
              </svg>
            </div>
            
            <h2>Account Successfully Confirmed!</h2>
            
            <p>Congratulations! Your account has been successfully verified.</p>
            
            <p>You now have full access to all features and services. You can now log in with your credentials.</p>
            
            <p>Thank you for completing this important security step.</p>
          </div>
          
          <div class="footer">
            <p>&copy; ${new Date().getFullYear()} All rights reserved.</p>
          </div>
        </div>
      </body>
      </html>
    `;
  };
  
  export const generatePasswordResetRequestHtml = (name, resetUrl) => {
    return `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Reset Your Password</title>
        <style>
          body {
            margin: 0;
            padding: 0;
            font-family: 'Arial', sans-serif;
            background-color: #f0f2f5;
            line-height: 1.6;
          }
          
          .email-container {
            max-width: 600px;
            margin: 0 auto;
            background-color: #ffffff;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
            border-radius: 12px;
            overflow: hidden;
          }
          
          .header {
            background-color: #3b82f6;
            color: white;
            text-align: center;
            padding: 20px;
          }
          
          .header h1 {
            margin: 0;
            font-size: 24px;
          }
          
          .content {
            padding: 30px 20px;
            text-align: center;
          }
          
          .content h2 {
            color: #1e1e1e;
            margin-bottom: 20px;
          }
          
          .content p {
            color: #4a4a4a;
            margin-bottom: 20px;
          }
          
          .reset-button {
            display: inline-block;
            background-color: #3b82f6;
            color: white !important;
            text-decoration: none;
            padding: 12px 24px;
            border-radius: 8px;
            font-weight: bold;
            margin: 20px 0;
          }
          
          .link-section {
            background-color: #f0f2f5;
            padding: 15px;
            margin: 20px 0;
            border-radius: 8px;
            word-break: break-all;
          }
          
          .warning-section {
            background-color: #fff7ed;
            border-left: 4px solid #f97316;
            padding: 15px;
            margin: 20px 0;
            border-radius: 8px;
            text-align: left;
          }
          
          .warning-section p {
            color: #9a3412;
            margin: 0;
            font-size: 14px;
          }
          
          .footer {
            background-color: #f0f2f5;
            color: #6b7280;
            text-align: center;
            padding: 15px;
            font-size: 12px;
          }
          
          @media only screen and (max-width: 600px) {
            .email-container {
              width: 100%;
              border-radius: 0;
            }
          }
        </style>
      </head>
      <body>
        <div class="email-container">
          <div class="header">
            <h1>Password Reset</h1>
          </div>
          
          <div class="content">
            <h2>Reset Your Password</h2>
            
            <p>Hi ${name},</p>
            
            <p>We received a request to reset your account password. Click the button below to create a new password:</p>
            
            <a href="${resetUrl}" class="reset-button">Reset Password</a>
            
            <p>If you're having trouble with the button, copy and paste this link into your browser:</p>
            
            <div class="link-section">
              <a href="${resetUrl}">${resetUrl}</a>
            </div>
            
            <div class="warning-section">
              <p>⚠️ This password reset link will expire in 15 minutes. If you didn't request this reset, please ignore this email or contact our support team.</p>
            </div>
          </div>
          
          <div class="footer">
            <p>&copy; ${new Date().getFullYear()} All rights reserved.</p>
          </div>
        </div>
      </body>
      </html>
    `;
  };
  
  export const generatePasswordChangedHtml = (name) => {
    return `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Password Changed</title>
        <style>
          body {
            margin: 0;
            padding: 0;
            font-family: 'Arial', sans-serif;
            background-color: #f0f2f5;
            line-height: 1.6;
          }
          
          .email-container {
            max-width: 600px;
            margin: 0 auto;
            background-color: #ffffff;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
            border-radius: 12px;
            overflow: hidden;
          }
          
          .header {
            background-color: #3b82f6;
            color: white;
            text-align: center;
            padding: 20px;
          }
          
          .header h1 {
            margin: 0;
            font-size: 24px;
          }
          
          .content {
            padding: 30px 20px;
            text-align: center;
          }
          
          .success-icon {
            margin-bottom: 20px;
            display: flex;
            justify-content: center;
          }
          
          .success-icon svg {
            width: 64px;
            height: 64px;
            fill: #22c55e;
          }
          
          .content h2 {
            color: #1e1e1e;
            margin-bottom: 20px;
          }
          
          .content p {
            color: #4a4a4a;
            margin-bottom: 15px;
          }
          
          .security-notice {
            background-color: #fef2f2;
            border-left: 4px solid #ef4444;
            padding: 15px;
            margin: 20px 0;
            border-radius: 8px;
            text-align: left;
          }
          
          .security-notice p {
            color: #991b1b;
            margin: 0;
            font-size: 14px;
          }
          
          .support-link {
            color: #3b82f6;
            text-decoration: underline;
          }
          
          .footer {
            background-color: #f0f2f5;
            color: #6b7280;
            text-align: center;
            padding: 15px;
            font-size: 12px;
          }
          
          @media only screen and (max-width: 600px) {
            .email-container {
              width: 100%;
              border-radius: 0;
            }
          }
        </style>
      </head>
      <body>
        <div class="email-container">
          <div class="header">
            <h1>Password Changed</h1>
          </div>
          
          <div class="content">
            <div class="success-icon">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
              </svg>
            </div>
            
            <h2>Password Changed Successfully</h2>
            
            <p>Hi ${name},</p>
            
            <p>Your account password has been successfully changed.</p>
            
            <div class="security-notice">
              <p>⚠️ If you did not make this change, please take immediate action:</p>
              <p>1. Contact our support team at <a href="mailto:support@example.com" class="support-link">support@example.com</a></p>
              <p>2. Change your password if you still have access</p>
              <p>3. Review your recent account activity</p>
            </div>
            
            <p>For your security, you may be asked to log in again on your devices.</p>
          </div>
          
          <div class="footer">
            <p>&copy; ${new Date().getFullYear()} All rights reserved.</p>
          </div>
        </div>
      </body>
      </html>
    `;
  };
  
  export const generatePasswordResetHtml = (name) => {
    return `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Password Reset Successful</title>
        <style>
          body {
            margin: 0;
            padding: 0;
            font-family: 'Arial', sans-serif;
            background-color: #f0f2f5;
            line-height: 1.6;
          }
          
          .email-container {
            max-width: 600px;
            margin: 0 auto;
            background-color: #ffffff;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
            border-radius: 12px;
            overflow: hidden;
          }
          
          .header {
            background-color: #3b82f6;
            color: white;
            text-align: center;
            padding: 20px;
          }
          
          .header h1 {
            margin: 0;
            font-size: 24px;
          }
          
          .content {
            padding: 30px 20px;
            text-align: center;
          }
          
          .success-icon {
            margin-bottom: 20px;
            display: flex;
            justify-content: center;
          }
          
          .success-icon svg {
            width: 64px;
            height: 64px;
            fill: #22c55e;
          }
          
          .content h2 {
            color: #1e1e1e;
            margin-bottom: 20px;
          }
          
          .content p {
            color: #4a4a4a;
            margin-bottom: 15px;
          }
          
          .warning-box {
            background-color: #fef2f2;
            border-left: 4px solid #ef4444;
            padding: 15px;
            margin: 20px 0;
            border-radius: 8px;
            text-align: left;
          }
          
          .warning-box p {
            color: #991b1b;
            margin: 0;
            font-size: 14px;
          }
          
          .tip-box {
            background-color: #f0f9ff;
            border-left: 4px solid #3b82f6;
            padding: 15px;
            margin: 20px 0;
            border-radius: 8px;
            text-align: left;
          }
          
          .tip-box p {
            color: #1d4ed8;
            margin: 0;
            font-size: 14px;
          }
          
          .footer {
            background-color: #f0f2f5;
            color: #6b7280;
            text-align: center;
            padding: 15px;
            font-size: 12px;
          }
          
          @media only screen and (max-width: 600px) {
            .email-container {
              width: 100%;
              border-radius: 0;
            }
          }
        </style>
      </head>
      <body>
        <div class="email-container">
          <div class="header">
            <h1>Password Reset</h1>
          </div>
          
          <div class="content">
            <div class="success-icon">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
              </svg>
            </div>
            
            <h2>Password Reset Successful</h2>
            
            <p>Hi ${name},</p>
            
            <p>Your account password has been successfully reset. You can now log in using your new password.</p>
            
            <div class="warning-box">
              <p>⚠️ If you did not initiate this password reset, please contact our support team immediately to secure your account.</p>
            </div>
            
            <div class="tip-box">
              <p>🔒 Tip: Enable two-factor authentication for additional account security.</p>
            </div>
            
            <p>If you have any questions, our support team is here to help.</p>
          </div>
          
          <div class="footer">
            <p>&copy; ${new Date().getFullYear()} All rights reserved.</p>
          </div>
        </div>
      </body>
      </html>
    `;
  };