import { fetchUser } from '@/client/api/user-api';

export const setFlashMsg = async () => {
  const { flashMsg } = await fetchUser();

  if (!flashMsg) return;

  const divFlash = document.getElementById('connect-flash') as HTMLDivElement;
  console.log(flashMsg);
  const flashClass =
    flashMsg.type === 'error' ? 'user-message--error' : 'user-message--success';

  divFlash.setAttribute('aria-hidden', 'false');
  divFlash.classList.add(flashClass);
  divFlash.textContent = flashMsg.msg;
};
