import { IResultError } from './IResultError';
import Optional from './Optional';

export class Result<R, E extends IResultError = IResultError> {
  public isSuccess: boolean;
  public isFailure: boolean;
  private _error: E;
  private _value: R;

  protected constructor(isSuccess: boolean, error?: E, value?: R) {
    if (isSuccess && error) {
      throw new Error(
        `InvalidOperation: A result cannot be succesful and contain an error`
      );
    }

    if (!isSuccess && !error) {
      throw new Error(
        `InvalidOperation: A failing result needs to contain an error message`
      );
    }

    this.isSuccess = isSuccess;
    this.isFailure = !isSuccess;
    this._error = error;
    this._value = value;

    Object.freeze(this);
  }

  /**
   * Converts from Result<R, E> to Optional<R>.
   *
   * @returns  {Optional<R>}
   * @memberof Result
   */
  public getValue(): Optional<R> {
    return Optional(this.isSuccess ? this._value : null);
  }

  /**
   * Converts from Result<R, E> to Option<E>.
   *
   * @returns  {Optional<E>}
   * @memberof Result
   */
  public errorValue(): Optional<E> {
    return Optional(this.isFailure ? this._error : null);
  }

  /**
   * Maps a Result<R, E> to Result<T, E> by applying a function to a contained 'OK' value,
   * leaving an 'Error' value untouched. This function can be used to compose the results of two functions.
   *
   * @template T
   * @param {(a: R) => T} func
   * @returns  {Result<T>}
   * @memberof Result
   */
  public map<T>(func: (a: R) => T): Result<T> {
    return this.isSuccess
      ? Result.Ok(func(this._value))
      : Result.Fail(this._error);
  }

  /**
   * Maps a Result<R, E> to Result<T, E> by applying a function to a contained 'OK' value,
   * leaving an 'Error' value untouched. This function can be used to compose the results of two functions.
   *
   * @template T
   * @param {(a: R) => Promise<T>} func
   * @returns  {Promise<Result<T>>}
   * @memberof Result
   */
  public async mapAsync<T>(func: (a: R) => Promise<T>): Promise<Result<T>> {
    return this.isSuccess
      ? Result.Ok(await func(this._value))
      : Result.Fail(this._error);
  }

  /**
   * Applies a function to the contained value (if Ok), or returns the provided default (if Error).
   * Arguments passed to mapOr are eagerly evaluated; if you are passing the result of a function call,
   * it is recommended to use mapOrElse, which is lazily evaluated.
   *
   * @template T
   * @param {T} def
   * @param {(a: R) => T} func
   * @returns  {T}
   * @memberof Result
   */
  public mapOr<T>(def: T, func: (a: R) => T): T {
    return this.isSuccess ? func(this._value) : def;
  }

  /**
   * Applies a function to the contained value (if Ok), or returns the provided default (if Error).
   * Arguments passed to mapOr are eagerly evaluated; if you are passing the result of a function call,
   * it is recommended to use mapOrElse, which is lazily evaluated.
   *
   * @template T
   * @param {T} def
   * @param {(a: R) => Promise<T>} func
   * @returns  {Promise<T>}
   * @memberof Result
   */
  public async mapOrAsync<T>(
    def: T,
    func: (a: R) => T | Promise<T>
  ): Promise<T> {
    return this.isSuccess ? func(this._value) : def;
  }

  /**
   * Maps a Result<R, E> to T by applying a function to a contained 'Ok' value, or a fallback function to
   * a contained 'Error' value. This function can be used to unpack a successful result while handling an error.
   *
   * @template T
   * @param {(a: E) => Promise<T>} def
   * @param {(a: R) => Promise<T>} func
   * @returns  {Promise<T>}
   * @memberof Result
   */
  public async mapOrElseAsync<T>(
    def: (a: E) => Promise<T>,
    func: (a: R) => Promise<T>
  ): Promise<T> {
    return this.isSuccess ? func(this._value) : def(this._error);
  }

  /**
   * Maps a Result<R, E> to T by applying a function to a contained 'Ok' value, or a fallback function to
   * a contained 'Error' value. This function can be used to unpack a successful result while handling an error.
   *
   * @template T
   * @param {(a: E) => T} def
   * @param {(a: R) => T} func
   * @returns  {T}
   * @memberof Result
   */
  public mapOrElse<T>(def: (a: E) => T, func: (a: R) => T): T {
    return this.isSuccess ? func(this._value) : def(this._error);
  }

  /**
   * Maps a Result<R, E> to Result<R, F> by applying a function to a contained 'Error' value,
   * leaving an 'Ok' value untouched. This function can be used to pass through a successful
   * result while handling an error.
   *
   * @template F
   * @param {(a: E) => Promise<F>} func
   * @returns  {Promise<Result<R, F>>}
   * @memberof Result
   */
  public async mapOrErrorAsync<F extends IResultError = IResultError>(
    func: (a: E) => Promise<F>
  ): Promise<Result<R, F>> {
    return this.isFailure
      ? Result.Fail<R, F>(await func(this._error))
      : Result.Ok<R, F>(this._value);
  }

  /**
   * Maps a Result<R, E> to Result<R, F> by applying a function to a contained 'Error' value,
   * leaving an 'Ok' value untouched. This function can be used to pass through a successful
   * result while handling an error.
   *
   * @template F
   * @param {(a: E) => F} func
   * @returns  {Result<R, F>}
   * @memberof Result
   */
  public mapOrError<F extends IResultError = IResultError>(
    func: (a: E) => F
  ): Result<R, F> {
    return this.isFailure
      ? Result.Fail<R, F>(func(this._error))
      : Result.Ok<R, F>(this._value);
  }

  /**
   * Returns res if the result is 'Ok', otherwise returns the Err value of 'this'.
   *
   * @template U
   * @param {Result<U, E>} res
   * @returns  {Result<U, E>}
   * @memberof Result
   */
  public and<U>(res: Result<U, E>): Result<U, E> {
    return this.isSuccess ? res : Result.Fail(this._error);
  }

  /**
   * Calls 'func' if the result is 'Ok', otherwise returns the 'Error' value of 'this'.
   * This function can be used for control flow based on Result values.
   *
   * @template U
   * @param {((val: R) => Promise<Result<U, E>>)} func
   * @returns  {Promise<Result<U, E>>}
   * @memberof Result
   */
  public async andThenAsync<U>(
    func: (val: R) => Promise<Result<U, E>>
  ): Promise<Result<U, E>> {
    return this.isSuccess ? await func(this._value) : Result.Fail(this._error);
  }

  /**
   * Calls 'func' if the result is 'Ok', otherwise returns the 'Error' value of 'this'.
   * This function can be used for control flow based on Result values.
   *
   * @template U
   * @param {(val: R) => Result<U, E>} func
   * @returns  {Result<U, E>}
   * @memberof Result
   */
  public andThen<U>(func: (val: R) => Result<U, E>): Result<U, E> {
    return this.isSuccess ? func(this._value) : Result.Fail(this._error);
  }

  /**
   * Returns 'res' if the result is 'Error', otherwise returns the 'Ok' value of 'this'.
   * Arguments passed to 'or' are eagerly evaluated; if you are passing the result of a function call,
   * it is recommended to use orElse, which is lazily evaluated.
   *
   * @template F
   * @param {Result<R, F>} res
   * @returns  {Result<R, F>}
   * @memberof Result
   */
  public or<F extends IResultError = IResultError>(
    res: Result<R, F>
  ): Result<R, F> {
    return this.isSuccess ? Result.Ok<R, F>(this._value) : res;
  }

  /**
   * Calls 'func' if the result is 'Error', otherwise returns the 'Ok' value of 'this'.
   * This function can be used for control flow based on result values.
   *
   * @template F
   * @param {(err: E) => Promise<Result<R, F>>} func
   * @returns  {Promise<Result<R, F>>}
   * @memberof Result
   */
  public async orElseAsync<F extends IResultError = IResultError>(
    func: (err: E) => Promise<Result<R, F>>
  ): Promise<Result<R, F>> {
    return this.isSuccess ? Result.Ok<R, F>(this._value) : func(this._error);
  }

  /**
   * Calls 'func' if the result is 'Error', otherwise returns the 'Ok' value of 'this'.
   * This function can be used for control flow based on result values.
   *
   * @template F
   * @param {(err: E) => Result<R, F>} func
   * @returns  {Result<R, F>}
   * @memberof Result
   */
  public orElse<F extends IResultError = IResultError>(
    func: (err: E) => Result<R, F>
  ): Result<R, F> {
    return this.isSuccess ? Result.Ok<R, F>(this._value) : func(this._error);
  }
  /**
   * Returns the contained 'Ok' value. If the value is an 'Error' then throw an error
   * including the passed message.
   *
   * @param {string} msg
   * @returns  {R}
   * @memberof Result
   */
  public expect(msg: string): R {
    if (this.isFailure) throw new Error(msg);
    return this._value;
  }

  /**
   * Returns the contained 'Ok' value. If the value is an 'Error' then throw it.
   *
   * @returns  {R}
   * @memberof Result
   */
  public unwrap(): R {
    if (this.isFailure) this._error.throw();
    return this._value;
  }

  /**
   * Returns the contained 'Ok' value or a provided default. Arguments passed to unwrapOr
   * are eagerly evaluated; if you are passing the result of a function call, it is recommended
   * to use unwrapOrElse, which is lazily evaluated.
   *
   * @param {R} def
   * @returns  {R}
   * @memberof Result
   */
  public unwrapOr(def: R): R {
    return this.isSuccess ? this._value : def;
  }

  /**
   * Returns the contained 'Ok' value or computes it from a closure.
   *
   * @param {(err: E) => Promise<R>} func
   * @returns  {Promise<R>}
   * @memberof Result
   */
  public async unwrapOrElseAsync(func: (err: E) => R | Promise<R>): Promise<R> {
    return this.isSuccess ? this._value : func(this._error);
  }

  /**
   * Returns the contained 'Ok' value or computes it from a closure.
   *
   * @param {(err: E) => R} func
   * @returns  {R}
   * @memberof Result
   */
  public unwrapOrElse(func: (err: E) => R): R {
    return this.isSuccess ? this._value : func(this._error);
  }

  /**
   * Returns the contained 'Err' value, consuming the 'this' value.
   *
   * @returns  {E}
   * @memberof Result
   */
  public unwrapError(): E {
    if (this.isSuccess) throw new Error(`Unwraping error in 'Ok' result`);
    return this._error;
  }

  /**
   * Create a success Result value. IsSuccess returns true.
   *
   * @static
   * @template U
   * @template E
   * @param {U} [value]
   * @returns  {Result<U, E>}
   * @memberof Result
   */
  public static Ok<U, E extends IResultError = IResultError>(
    value?: U
  ): Result<U, E> {
    return new Result<U, E>(true, null, value);
  }

  /**
   * Create a failure Result value. IsFailure returns true.
   *
   * @static
   * @template U
   * @template E
   * @param {E} error
   * @returns  {Result<U, E>}
   * @memberof Result
   */
  public static Fail<U, E extends IResultError = IResultError>(
    error: E
  ): Result<U, E> {
    return new Result<U, E>(false, error);
  }

  // public static combine<T>(results: Result<any>[]): Result<T> {
  //   for (const result of results) if (result.isFailure) return result;
  //   return Result.Ok<T>();
  // }
}
