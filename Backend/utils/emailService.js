const nodemailer = require('nodemailer');

// Configure email transporter
const transporter = nodemailer.createTransporter({
    service: 'gmail', // or your email provider
    auth: {
        user: process.env.EMAIL_USER,     // Add to .env
        pass: process.env.EMAIL_PASSWORD  // Add to .env (use App Password for Gmail)
    }
});

exports.sendOTPEmail = async (email, otp) => {
    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: email,
        subject: 'Your OTP for Vendor Account Verification',
        html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                <h2 style="color: #333;">Vendor Account Verification</h2>
                <p>Your One-Time Password (OTP) for account verification is:</p>
                <div style="background-color: #f4f4f4; padding: 20px; text-align: center; font-size: 32px; font-weight: bold; letter-spacing: 8px; margin: 20px 0;">
                    ${otp}
                </div>
                <p>This OTP is valid for <strong>10 minutes</strong>.</p>
                <p>If you didn't request this verification, please ignore this email.</p>
                <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;">
                <p style="color: #999; font-size: 12px;">This is an automated email. Please do not reply.</p>
            </div>
        `
    };

    try {
        await transporter.sendMail(mailOptions);
        console.log(`OTP email sent to ${email}`);
        return true;
    } catch (error) {
        console.error('Email send error:', error);
        return false;
    }
};