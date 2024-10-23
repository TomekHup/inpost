require('dotenv').config({path: './server/.env'});
const express = require('express');
const sgMail = require('@sendgrid/mail');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const port = 3000;

app.use(bodyParser.json());
app.use(cors());

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

app.post('/send-email', async (req, res) => {
    const { name, email, phone, nip } = req.body;

    const msgToRecipient = {
        to: process.env.RECIPIENT_MAIL,
        from: process.env.SENDER_MAIL,
        subject: 'Nowe zgłoszenie formularza',
        html: `
            <h1>InPost Paczka w Weekend</h1>
            <p><strong>Imię i nazwisko:</strong> ${name}</p>
            <p><strong>Email:</strong> ${email}</p>
            <p><strong>Telefon:</strong> ${phone}</p>
            <p><strong>NIP:</strong> ${nip}</p>
        `
    };

    const msgToSender = {
        to: email,
        from: process.env.SENDER_MAIL,
        subject: 'InPost Paczka w Weekend',
        text: 'Dziękujemy za wypełnienie formularza, skontaktujemy się wkrótce.'
    };

    try {
        await sgMail.send(msgToRecipient);
        await sgMail.send(msgToSender);
        console.log('Emails sent successfully!');
        res.status(200).send('Emails sent successfully!');
    } catch (error) {
        console.error('Failed to send email:', error);
        res.status(500).send('Failed to send email.');
    }
});

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
