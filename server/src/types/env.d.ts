declare namespace NodeJS {
  interface ProcessEnv {
    readonly JWT_TOKEN_SECRET: string;
  }
}
