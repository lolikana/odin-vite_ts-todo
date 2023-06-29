export * from './labels-api';
export * from './todos-api';

export const isProduction = import.meta.env.MODE === 'production';

export const path = isProduction
  ? `${import.meta.env.VITE_PATH}${import.meta.env.VITE_PORT}`
  : `${import.meta.env.VITE_PATH}${import.meta.env.VITE_DEV_PORT}`;
