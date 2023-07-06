import { isProduction, path } from '.';

export const fetchCsrfToken = async (): Promise<{ CSRFToken: string }> => {
  const res = await fetch(`${!isProduction ? path : ''}/api/crsf-token`);
  if (!res.ok) {
    throw new Error('No user found from server');
  }
  return res.json() as unknown as { CSRFToken: string };
};
