import {getValidationMessages, validateForm} from './validation';

const sendEmail = async (data: { name: string; phone: string; email: string; nip: string }): Promise<string> => {
  const url = process.env.NODE_ENV === 'production'
   ? '/functions/send-email'
  : 'http://localhost:3000/send-email';

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    throw new Error('Failed to send email.');
  }

  return response.text();
};

document.addEventListener('DOMContentLoaded', () => {
  const form = document.querySelector('.contact__form');
  form?.addEventListener('submit', async (event) => {
    event.preventDefault();

    const messages = await getValidationMessages();
    const errors: string[] = await validateForm();

    const messageElement: HTMLElement | null = document.getElementById('message');
    if (messageElement) {
      if (errors.length > 0) {
        messageElement.innerHTML = errors.join('<br>');
        messageElement.style.color = "red";
      } else {
        try {
          const data = {
            name: (document.getElementById('name') as HTMLInputElement).value,
            phone: (document.getElementById('phone') as HTMLInputElement).value,
            email: (document.getElementById('email') as HTMLInputElement).value,
            nip: (document.getElementById('nip') as HTMLInputElement).value,
          };

          await sendEmail(data);
          messageElement.innerHTML = messages?.formSubmitSuccess;
          messageElement.style.color = "green";
          console.log('Email sent successfully!');
        } catch (error) {
          messageElement.innerHTML = messages?.formSendError;
          messageElement.style.color = "red";
          console.error('Error sending email:', error);
        }
      }
    }
  })
});
