import nodemailer from 'nodemailer';
import jwt from 'jsonwebtoken';

export const sendConfirmationEmail = async (email: string, userId: string) => {

    const token = jwt.sign({ userId }, 'cicciopasticcio', { expiresIn: '1h' });

    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: 'meneghellogiovanni88@gmail.com',
            pass: 'vwec fkzp ocmr svfc'
        }
    });

    const mailOptions = {
        from: 'meneghellogiovanni88@gmail.com',
        to: email,
        subject: 'Email Confirmation',
        text: `Click this link to confirm your email: http://localhost:4200/email-confirmed?token=${token}`       //email-confirmed
    };

    await transporter.sendMail(mailOptions);
};
