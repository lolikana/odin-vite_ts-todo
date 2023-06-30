import { IUser } from '@/libs/types';

import { isProduction, path } from '.';

export const fetchUser = async (): Promise<IUser> => {
  const res = await fetch(`${!isProduction ? path : ''}/current-user`);
  if (!res.ok) {
    throw new Error('Failed to retrieve todos from server');
  }
  return res.json() as unknown as IUser;
};
