import nodemailer from 'nodemailer';

export const sendConfirmationEmail = async (email: string) => {
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: 'your-email@gmail.com',
            pass: 'your-password'
        }
    });

    const mailOptions = {
        from: 'your-email@gmail.com',
        to: email,
        subject: 'Email Confirmation',
        text: 'Link alla pagina Angular per la conferma'
    };

    await transporter.sendMail(mailOptions);
};
