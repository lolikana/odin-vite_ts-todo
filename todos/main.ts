import '/src/client/main.ts';
import '/src/client/scripts/pages/todos-pages.ts';

import { fetchUser } from '@/client/api/user-api';

const isUserLoggedIn = async () => {
  const headerLogout = document.querySelector('.header--logout > form');
  try {
    const { user } = await fetchUser();

    if (user !== undefined) {
      const button = document.createElement('button');
      button.setAttribute('type', 'submit');
      button.classList.add('auth-links', 'logout');
      button.textContent = `Logout, ${user.username}`;
      headerLogout?.append(button);
    }
  } catch (err) {
    console.log('Something went wrong with the user: ', err);
  }
};

isUserLoggedIn().catch(err => console.log(err));
