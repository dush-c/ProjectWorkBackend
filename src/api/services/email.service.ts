import nodemailer from 'nodemailer';

export const sendConfirmationEmail = async (email: string) => {

    console.log("email: ", email);

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
        text: 'Link alla pagina Angular per la conferma'
        //email-confirmed
    };

    await transporter.sendMail(mailOptions);
};
