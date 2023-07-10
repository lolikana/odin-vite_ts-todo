import { fetchCsrfToken } from '@/client/api/csrf-api';

export const getCsrfToken = async (): Promise<string | void> => {
  try {
    const { CSRFToken } = await fetchCsrfToken();

    if (CSRFToken === undefined) return;

    return CSRFToken;
  } catch (err) {
    console.log('Something went wrong with the user: ', err);
  }
};

export const setCsrfToken = async () => {
  try {
    const { CSRFToken } = await fetchCsrfToken();

    const inputsCsrfToken = document.querySelectorAll('input[name="CSRFToken"]');
    inputsCsrfToken.forEach(input => {
      input.setAttribute('value', CSRFToken);
    });
  } catch (err) {
    console.log('Something went wrong with the user: ', err);
  }
};
