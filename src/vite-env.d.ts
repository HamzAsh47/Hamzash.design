/// <reference types="vite/client" />

interface ImportMetaEnv {
  /** POST endpoint for the contact form. See `.env.example`. */
  readonly VITE_CONTACT_ENDPOINT?: string
  /** Mailto fallback address for the contact form. See `.env.example`. */
  readonly VITE_CONTACT_EMAIL?: string
  /** Absolute site origin for canonical tags, Open Graph and the sitemap. */
  readonly VITE_SITE_URL?: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
