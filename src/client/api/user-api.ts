import { IUser } from '@/libs/types';

import { isProduction, path } from '.';

export const fetchUser = async (): Promise<{
  user: IUser;
  flashMsg: { type: 'error' | 'success'; msg: string } | null;
}> => {
  const res = await fetch(`${!isProduction ? path : ''}/api/user`);
  if (!res.ok) {
    throw new Error('No user found from server');
  }
  return res.json() as unknown as {
    user: IUser;
    flashMsg: { type: 'error' | 'success'; msg: string } | null;
  };
};
