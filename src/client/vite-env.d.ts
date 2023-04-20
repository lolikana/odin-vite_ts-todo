/// <reference types="vite/client" />
interface ImportMetaEnv {
  readonly VITE_MONGODB_URI: string;
  readonly VITE_MONGODB_DB: string;
  readonly VITE_PORT: string;
  readonly VITE_PATH: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
