export class NoTokenError extends Error {
  constructor(method: string) {
    super(`${method} requires token to be set`);
  }
}
