import { fetchCsrfToken } from '@/client/api/csrf-api';

export const setCsrfToken = async () => {
  const inputsCsrfToken = document.querySelectorAll('input[name="CSRFToken"]');
  try {
    const { CSRFToken } = await fetchCsrfToken();

    if (CSRFToken === undefined) return;

    inputsCsrfToken.forEach(input => {
      console.log(input);
      input.setAttribute('value', CSRFToken);
    });
  } catch (err) {
    console.log('Something went wrong with the user: ', err);
  }
};
