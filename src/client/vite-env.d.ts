/// <reference types="vite/client" />
interface ImportMetaEnv {
  readonly VITE_MONGODB_URI: string;
  readonly VITE_MONGODB_DB: string;
  readonly VITE_PORT: string;
  readonly VITE_PATH: string;
  readonly VITE_API_LABELS: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
