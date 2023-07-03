import '/src/client/main.ts';
import '/src/client/scripts/pages/todos-pages.ts';

import { fetchUser } from '@/client/api/user-api';

const headerLogout = document.querySelector('.header--logout');

const isUserLoggedIn = async () => {
  try {
    const user = await fetchUser();

    if (user !== undefined) {
      const a = document.createElement('a');
      a.setAttribute('href', '/logout');
      a.classList.add('auth-links', 'logout');
      a.textContent = `Logout, ${user.username}`;
      headerLogout?.append(a);
    }
  } catch (err) {
    console.log('Something went wrong with the user: ', err);
  }
};

isUserLoggedIn().catch(err => console.log(err));
