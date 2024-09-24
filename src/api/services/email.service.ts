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
        text: "errore",
        html: `<!DOCTYPE html>
<html lang="it">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Conferma la tua email</title>
    <style>
      body {
        font-family: Arial, sans-serif;
        background-color: #f4f4f7;
        color: #333;
        margin: 0;
        padding: 0;
      }
      .email-container {
        max-width: 600px;
        margin: 0 auto;
        background-color: #ffffff;
        padding: 20px;
        border: 1px solid #ddd;
        border-radius: 8px;
        box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
      }
      h1 {
        font-size: 24px;
        color: #333;
        text-align: center;
      }
      p {
        font-size: 16px;
        line-height: 1.5;
        color: #666;
      }
      .btn-confirm {
        display: inline-block;
        margin: 20px auto;
        padding: 10px 20px;
        font-size: 18px;
        color: #fff;
        background-color: #999;
        text-decoration: none;
        border-radius: 5px;
        text-align: center;
        font-weight: bold;
      }
      .btn-confirm:hover {
        background-color: rgb(31, 31, 31);
      }
      .footer {
        text-align: center;
        font-size: 14px;
        color: #999;
        margin-top: 20px;
      }
    </style>
  </head>
  <body>
    <div class="email-container">
      <h1>Conferma la tua email</h1>

      <p>Ciao,</p>

      <p>
        Grazie per esserti registrato al nostro servizio. Per completare la tua
        registrazione e attivare il tuo account, ti preghiamo di confermare il
        tuo indirizzo email cliccando sul pulsante qui sotto.
      </p>

      <a href="http://localhost:4200/email-confirmed?token=${token}" class="btn-confirm"
        >Completa Registrazione</a
      >

      <p>Se non hai richiesto questo account, puoi ignorare questa email.</p>

      <div class="footer">
        <p>Grazie,<br />Il Team di BatBank</p>
      </div>
    </div>
  </body>
</html>`
        
        //email-confirmed
    };

    await transporter.sendMail(mailOptions);
};
