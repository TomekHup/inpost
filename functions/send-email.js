const sgMail = require('@sendgrid/mail');
sgMail.setApiKey(process.env.NETLIFY_EMAILS_PROVIDER_API_KEY);

exports.handler = async (event, context) => {
    try {
        const { name, email, phone, nip } = JSON.parse(event.body);

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

        await sgMail.send(msgToRecipient);
        await sgMail.send(msgToSender);
        console.log('Emails sent successfully!');

        return {
            statusCode: 200,
            body: JSON.stringify({ message: 'Emails sent successfully!' })
        };

    } catch (error) {
        console.error('Failed to send email:', error);
        return {
            statusCode: 500,
            body: JSON.stringify({ message: 'Failed to send email.' })
        };
    }
};
