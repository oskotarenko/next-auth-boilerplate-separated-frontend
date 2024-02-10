declare namespace NodeJS {
  export interface ProcessEnv {
    // BACKEND
    NEXT_PUBLIC_API_URL: string;

    // DB
    DATABASE_URL: string;
    DIRECT_URL: string;

    // AUTH CONFIG
    AUTH_SECRET: string;
    NEXT_PUBLIC_APP_URL: string;

    // GOOGLE AUTH
    GOOGLE_CLIENT_SECRET: string;
    GOOGLE_CLIENT_ID: string;

    // GITHUB AUTH
    GITHUB_CLIENT_SECRET: string;
    GITHUB_CLIENT_ID: string;

    // MAIL API
    RESEND_API_KEY: string;
    MAIL_DOMAIN: string;
  }
}
