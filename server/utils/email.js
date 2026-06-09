const nodemailer = require('nodemailer');

const createTransporter = () => {
  return nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    secure: false,
    auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASS }
  });
};

exports.sendVerificationEmail = async (email, name, token) => {
  try {
    const transporter = createTransporter();
    const verifyUrl = `${process.env.CLIENT_URL}/verify-email/${token}`;
    await transporter.sendMail({
      from: `"EduFlow" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: 'Verify your EduFlow account',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h1 style="color: #6366f1;">Welcome to EduFlow, ${name}!</h1>
          <p>Please verify your email address to get started.</p>
          <a href="${verifyUrl}" style="background: #6366f1; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block; margin: 20px 0;">Verify Email</a>
          <p style="color: #666;">This link expires in 24 hours.</p>
        </div>
      `
    });
    console.log('Verification email sent to:', email);
  } catch (err) {
    console.error('Email send error:', err.message);
  }
};

exports.sendResetEmail = async (email, name, token) => {
  try {
    const transporter = createTransporter();
    const resetUrl = `${process.env.CLIENT_URL}/reset-password/${token}`;
    await transporter.sendMail({
      from: `"EduFlow" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: 'Reset your EduFlow password',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h1 style="color: #6366f1;">Password Reset Request</h1>
          <p>Hi ${name}, click below to reset your password.</p>
          <a href="${resetUrl}" style="background: #6366f1; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block; margin: 20px 0;">Reset Password</a>
          <p style="color: #666;">This link expires in 1 hour. If you didn't request this, ignore this email.</p>
        </div>
      `
    });
  } catch (err) {
    console.error('Reset email send error:', err.message);
  }
};

exports.sendEnrollmentEmail = async (email, name, courseTitle) => {
  try {
    const transporter = createTransporter();
    await transporter.sendMail({
      from: `"EduFlow" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: `Enrolled in ${courseTitle}!`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h1 style="color: #6366f1;">You're enrolled!</h1>
          <p>Hi ${name}, you've successfully enrolled in <strong>${courseTitle}</strong>.</p>
          <a href="${process.env.CLIENT_URL}/dashboard" style="background: #6366f1; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block; margin: 20px 0;">Start Learning</a>
        </div>
      `
    });
  } catch (err) {
    console.error('Enrollment email error:', err.message);
  }
};
