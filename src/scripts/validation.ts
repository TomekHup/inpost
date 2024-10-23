export const getValidationMessages = async () => {
  try {
    const response = await fetch('/messages.json');
    return await response.json();
  } catch (error) {
    return console.error('Błąd podczas wczytywania komunikatów walidacji:', error);
  }
}

export const validateForm = async (): Promise<string[]> => {
  const messages = await getValidationMessages();
  const errors: string[] = [];

  const name: string = (document.getElementById('name') as HTMLInputElement).value;
  if (!name) {
    errors.push(messages?.nameError);
  }

  const phone: string = (document.getElementById('phone') as HTMLInputElement).value;
  const phonePattern: RegExp = /^(\+\d{11}|\d{9})$/;
  if (!phonePattern.test(phone)) {
    errors.push(messages?.phoneError);
  }

  const email: string = (document.getElementById('email') as HTMLInputElement).value;
  const emailPattern: RegExp = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailPattern.test(email)) {
    errors.push(messages?.emailError);
  }

  const nip: string = (document.getElementById('nip') as HTMLInputElement).value;
  if (nip.length !== 10 || isNaN(Number(nip))) {
    errors.push(messages?.nipError);
  }

  return errors;
};