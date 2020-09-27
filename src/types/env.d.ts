declare namespace NodeJS {
  interface ProcessEnv {
    readonly BOT_TOKEN: string;
    readonly DB_URL: string;
    readonly PREFIX: string;
  }
}
