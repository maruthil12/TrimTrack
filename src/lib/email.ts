import nodemailer from 'nodemailer';

// In a real app, these would be environment variables
const SMTP_HOST = process.env.SMTP_HOST || 'smtp.gmail.com';
const SMTP_PORT = parseInt(process.env.SMTP_PORT || '587');
const SMTP_USER = process.env.SMTP_USER || 'your-email@gmail.com';
const SMTP_PASS = process.env.SMTP_PASS || 'your-app-password';

export const sendEmail = async (to: string, subject: string, text: string, attachments?: any[]) => {
    // For demo purposes, if no credentials are set, we just log
    if (SMTP_USER === 'your-email@gmail.com') {
        console.log('Mock Email Send:');
        console.log(`To: ${to}`);
        console.log(`Subject: ${subject}`);
        console.log(`Attachments: ${attachments?.length} files`);
        return true;
    }

    const transporter = nodemailer.createTransport({
        host: SMTP_HOST,
        port: SMTP_PORT,
        secure: false,
        auth: {
            user: SMTP_USER,
            pass: SMTP_PASS,
        },
    });

    try {
        await transporter.sendMail({
            from: `"TrimTrack" <${SMTP_USER}>`,
            to,
            subject,
            text,
            attachments,
        });
        return true;
    } catch (error) {
        console.error('Email send error:', error);
        return false;
    }
};
