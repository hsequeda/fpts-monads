export interface IResultError {
  name: string;
  message: string;

  /**
   * Return error in format [ErrorName]: [ErrorMsg]
   *
   * @returns  {string}
   * @memberof IResultError
   */
  pretty(): string;
  /**
   * Throw the contained error
   *
   * @memberof IResultError
   */
  throw(): void;
}
