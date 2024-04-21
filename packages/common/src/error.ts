export class QueryParamError extends Error {
  readonly message: string;

  // eslint-disable-next-line tseslint/no-explicit-any
  constructor(message: string) {
    super(message);
    this.message = message;
  }
}
