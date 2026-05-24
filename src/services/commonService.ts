import nodemailer from 'nodemailer';

const senderEmail = async (to: string, subject: string, text: string) => {
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.EMAIL || "shkh1601@gmail.com",
            pass: process.env.PASSWORD || "vcni fmet kblx catq"
        }
    });

    const mailOptions = {
        from: process.env.EMAIL,
        to,
        subject,
        text
    };

    try {
        await transporter.sendMail(mailOptions);
        console.log('Email sent successfully');
    }
    catch (error) {
        console.error('Error sending email:', error);
    }
};

export default {
    senderEmail
}