# fpts-monads

An implementation of the Result and the Optional FP monad in Typescript. This
library was inspired by the handling of these monads in the standard Rust library.
Asynchronous functions can be chained.

## Example

See the example folder in `src/example`.

### Optional Example

```typescript
function optionalExample(req?: string): string {
  const reqOrNone = Optional(req);
  return reqOrNone.match(
    (reqVal: string) => {
      return `Request value is: ${reqVal}`;
    },
    () => {
      return `Request value is: None`;
    }
  );
}
```

### Result Example

```typescript
class SimpleError {
  public name: string;
  public message: string;
  constructor(message: string) {
    name: `SimpleError`;
    this.message = message;
  }

  public pretty(): string {
    return `[${this.name}] ${this.message}`;
  }
  public throw(): void {
    throw new Error(this.pretty());
  }
}

function resultExample(req?: string): Result<string> {
  const reqOrNone = Optional(req);
  const reqOrErr = reqOrNone.okOr(new SimpleError(`Request doesn't exist`));
  return reqOrErr;
}

function resultExample2(req?: string): Result<string> {
  try {
    if (Optional(req).isNone()) throw new Error('Some error!');
    return Result.Ok(req);
  } catch (error) {
    return Result.Fail(new SimpleError(`Request doesn't exist`));
  }
}
```

## WIP

Implement a proxy to chain `async` functions without add async declaration in each
sentence.

## Optional methods

```typescript
  /*
   * Returns true if the option is a None value.
   *
   * @returns  {boolean}
   * @memberof Optional
   */
  isNone(): boolean;

  /**
   * Returns true if the option is a Some value.
   *
   * @returns  {boolean}
   * @memberof Optional
   */
  isSome(): boolean;

  /**
   * Returns the contained 'Some' value, if is 'None' throw an error with the
   * passed message.
   *
   * @param {string} msg
   * @returns  {A}
   * @memberof Optional
   */
  expect(msg: string): A;

  /**
   * Returns the contained 'Some' value, if is 'None' throw an error.
   *
   * @returns  {A}
   * @memberof Optional
   */
  unwrap(): A;

  /**
   * Returns the contained 'Some' value or a provided default. Arguments passed
   * to unwrapOr are eagerly evaluated; if you are passing the result of a
   * function call, it is recommended to use unwrapOrElse, which is lazily evaluated.
   *
   * @param {A} def
   * @returns  {A}
   * @memberof Optional
   */
  unwrapOr(def: A): A;

  /**
   * Returns the contained 'Some' value or computes it from a closure.
   *
   * @param {(() => A)} func
   * @returns  {(A)}
   * @memberof Optional
   */
  unwrapOrElse(func: () => A): A;

  /**
   * Returns the contained 'Some' value or computes it from a closure.
   *
   * @param {(() => Promise<A>)} func
   * @returns  {(Promise<A>)}
   * @memberof Optional
   */
  unwrapOrElseAsync(func: () => Promise<A>): Promise<A>;

  /**
   * Maps an Option<T> to Option<U> by applying a function to a contained value.
   *
   * @template B
   * @param {(a: A) => B} func
   * @returns  {Optional<B>}
   * @memberof Optional
   */
  map<B>(func: (a: A) => B): Optional<B>;

  /**
   * Maps an Option<T> to Option<U> by applying a function to a contained value.
   *
   * @template B
   * @param {(a: A) => Promise<B>} func
   * @returns  {Promise<Optional<B>>}
   * @memberof Optional
   */
  mapAsync<B>(func: (a: A) => Promise<B>): Promise<Optional<B>>;

  /**
   * Applies a function to the contained value (if any), or returns the provided
   * default (if not).  Arguments passed to mapOr are eagerly evaluated; if you
   * are passing the result of a function call, it is recommended to use
   * mapOrElse, which is lazily evaluated.
   *
   * @template B
   * @param {B} def
   * @param {(a: A) => B} func
   * @returns  {B}
   * @memberof Optional
   */
  mapOr<B>(def: B, func: (a: A) => B): B;

  /**
   * Applies a function to the contained value (if any), or returns the provided
   * default (if not).  Arguments passed to mapOr are eagerly evaluated; if you
   * are passing the result of a function call, it is recommended to use
   * mapOrElse, which is lazily evaluated.
   *
   * @template B
   * @param {B} def
   * @param {(a: A) => Promise<B>} func
   * @returns  {Promise<B>}
   * @memberof Optional
   */
  mapOrAsync<B>(def: B, func: (a: A) => Promise<B>): Promise<B>;

  /**
   * Applies a function to the contained value (if any), or computes a default
   * (if not).
   *
   * @template B
   * @param {() => B} def
   * @param {(a: A) => B} func
   * @returns  {B}
   * @memberof Optional
   */
  mapOrElse<B>(def: () => B, func: (a: A) => B): B;

  /**
   * Applies a function to the contained value (if any), or computes a default
   * (if not).
   *
   * @template B
   * @param {() => Promise<B>} def
   * @param {(a: A) => Promise<B>} func
   * @returns  {Promise<B>}
   * @memberof Optional
   */
  mapOrElseAsync<B>(
    def: () => Promise<B>,
    func: (a: A) => Promise<B>
  ): Promise<B>;

  /**
   * Transforms the Option<T> into a Result<T, E>, mapping 'Some(v)' to 'Ok(v)'
   * and 'None' to 'Error(err)'.  Arguments passed to okOr are eagerly
   * evaluated; if you are passing the result of a function call, it is
   * recommended to use okOrElse, which is lazily evaluated.
   *
   * @template E
   * @param {E} err
   * @returns  {Result<A>}
   * @memberof Optional
   */
  okOr<E extends IResultError>(err: E): Result<A>;

  /**
   * Transforms the Option<T> into a Result<T, E>, mapping 'Some(v)' to 'Ok(v)'
   * and 'None' to 'Err(func())'.
   *
   * @template E
   * @param {() => E} errFunc
   * @returns  {Result<A>}
   * @memberof Optional
   */
  okOrElse<E extends IResultError>(errFunc: () => E): Result<A>;

  /**
   * Transforms the Option<T> into a Result<T, E>, mapping 'Some(v)' to 'Ok(v)'
   * and 'None' to 'Err(func())'.
   *
   * @template E
   * @param {() => Promise<E>} errFunc
   * @returns  {Promise<Result<A>>}
   * @memberof Optional
   */
  okOrElseAsync<E extends IResultError>(
    errFunc: () => Promise<E>
  ): Promise<Result<A>>;

  /**
   * Applies the 'some' function if is 'Some(v)' and the 'none' function if is 'None'.
   *
   * @template S
   * @param {(a: A) => S} some
   * @param {() => S} none
   * @returns  {S}
   * @memberof Optional
   */
  match<S>(some: (a: A) => S, none: () => S): S;

  /**
   * Applies the 'some' function if is 'Some(v)' and the 'none' function if is 'None'.
   *
   * @template S
   * @param {(a: A) => Promise<S>} some
   * @param {() => Promise<S>} none
   * @returns  {Promise<S>}
   * @memberof Optional
   */
  matchAsync<S>(some: (a: A) => Promise<S>, none: () => Promise<S>): Promise<S>;

  /**
   * Returns 'None' if the option is 'None', otherwise returns 'optb'.
   *
   * @template U
   * @param {Optional<U>} optb
   * @returns  {Optional<U>}
   * @memberof Optional
   */
  and<U>(optb: Optional<U>): Optional<U>;

  /**
   * Returns 'None' if the option is 'None', otherwise calls 'func' with the 
   * wrapped value and returns the result. Some languages call this operation flatmap.
   *
   * @template U
   * @param {((val: A) => Optional<U> | Promise<Optional<U>>)} func
   * @returns  {(Optional<U> | Promise<Optional<U>>)}
   * @memberof Optional
   */
  andThen<U>(
    func: (val: A) => Optional<U> | Promise<Optional<U>>
  ): Optional<U> | Promise<Optional<U>>;

  /**
   * Returns 'None' if the option is 'None', otherwise calls 'func' with the
   * wrapped value and returns the result. Some languages call this operation flatmap.
   *
   * @template U
   * @param {(val: A) => Promise<Optional<U>>} func
   * @returns  {Promise<Optional<U>>}
   * @memberof Optional
   */
  andThenAsync<U>(func: (val: A) => Promise<Optional<U>>): Promise<Optional<U>>;

  /**
   * Returns the option if it contains a value, otherwise returns 'optb'. 
   * Arguments passed to or are eagerly evaluated; if you are passing the result
   * of a function call, it is recommended
   * to use orElse, which is lazily evaluated.
   *
   * @param {Optional<A>} optb
   * @returns  {Optional<A>}
   * @memberof Optional
   */
  or(optb: Optional<A>): Optional<A>;

  /**
   * Returns the option if it contains a value, otherwise calls 'func' and 
   * returns the result.
   *
   * @param {() => Optional<A>} func
   * @returns  {Optional<A>}
   * @memberof Optional
   */
  orElse(func: () => Optional<A>): Optional<A>;

  /**
   * Returns the option if it contains a value, otherwise calls 'func' and 
   * returns the result.
   *
   * @param {() => Promise<Optional<A>>} func
   * @returns  {Promise<Optional<A>>}
   * @memberof Optional
   */
  orElseAsync(func: () => Promise<Optional<A>>): Promise<Optional<A>>;

  /**
   * Returns 'Some' if exactly one of 'this', 'optb' is 'Some', otherwise returns
   * 'None'.
   *
   * @param {Optional<A>} optb
   * @returns  {Optional<A>}
   * @memberof Optional
   */
  xor(optb: Optional<A>): Optional<A>;
```

## Result methods

``` typescript
  /**
   * Converts from Result<R, E> to Optional<R>.
   *
   * @returns  {Optional<R>}
   * @memberof Result
   */
  public getValue(): Optional<R>;

  public errorValue(): Optional<E>; 

  /**
   * Maps a Result<R, E> to Result<T, E> by applying a function to a contained 
   * 'OK' value, leaving an 'Error' value untouched. This function can be used 
   * to compose the results of two functions.
   *
   * @template T
   * @param {(a: R) => T} func
   * @returns  {Result<T>}
   * @memberof Result
   */
  public map<T>(func: (a: R) => T): Result<T>;

  /**
   * Maps a Result<R, E> to Result<T, E> by applying a function to a contained 
   * 'OK' value, leaving an 'Error' value untouched. This function can be used 
   * to compose the results of two functions.
   *
   * @template T
   * @param {(a: R) => Promise<T>} func
   * @returns  {Promise<Result<T>>}
   * @memberof Result
   */
  public async mapAsync<T>(func: (a: R) => Promise<T>): Promise<Result<T>>;

  /**
   * Applies a function to the contained value (if Ok), or returns the provided 
   * default (if Error).
   * Arguments passed to mapOr are eagerly evaluated; if you are passing the 
   * result of a function call,
   * it is recommended to use mapOrElse, which is lazily evaluated.
   *
   * @template T
   * @param {T} def
   * @param {(a: R) => T} func
   * @returns  {T}
   * @memberof Result
   */
  public mapOr<T>(def: T, func: (a: R) => T): T;

  /**
   * Applies a function to the contained value (if Ok), or returns the provided 
   * default (if Error).
   * Arguments passed to mapOr are eagerly evaluated; if you are passing the 
   *  result of a function call,
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
  ): Promise<T>;

  /**
   * Maps a Result<R, E> to T by applying a function to a contained 'Ok' value, 
   * or a fallback function to
   * a contained 'Error' value. This function can be used to unpack a successful
   * result while handling an error.
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
  ): Promise<T>;

  /**
   * Maps a Result<R, E> to T by applying a function to a contained 'Ok' value, 
   * or a fallback function to
   * a contained 'Error' value. This function can be used to unpack a successful
   * result while handling an error.
   *
   * @template T
   * @param {(a: E) => T} def
   * @param {(a: R) => T} func
   * @returns  {T}
   * @memberof Result
   */
  public mapOrElse<T>(def: (a: E) => T, func: (a: R) => T): T;

  /**
   * Maps a Result<R, E> to Result<R, F> by applying a function to a contained
   * 'Error' value,
   * leaving an 'Ok' value untouched. This function can be used to pass through
   * a successful result while handling an error.
   *
   * @template F
   * @param {(a: E) => Promise<F>} func
   * @returns  {Promise<Result<R, F>>}
   * @memberof Result
   */
  public async mapOrErrorAsync<F extends IResultError = IResultError>(
    func: (a: E) => Promise<F>
  ): Promise<Result<R, F>>; 

  /**
   * Maps a Result<R, E> to Result<R, F> by applying a function to a contained 
   * 'Error' value, leaving an 'Ok' value untouched. This function can be used 
   * to pass through a successful result while handling an error.
   *
   * @template F
   * @param {(a: E) => F} func
   * @returns  {Result<R, F>}
   * @memberof Result
   */
  public mapOrError<F extends IResultError = IResultError>(
    func: (a: E) => F
  ): Result<R, F>;

  /**
   * Returns res if the result is 'Ok', otherwise returns the Err value of 'this'.
   *
   * @template U
   * @param {Result<U, E>} res
   * @returns  {Result<U, E>}
   * @memberof Result
   */
  public and<U>(res: Result<U, E>): Result<U, E>;

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
  ): Promise<Result<U, E>>;

  /**
   * Calls 'func' if the result is 'Ok', otherwise returns the 'Error' value of 'this'.
   * This function can be used for control flow based on Result values.
   *
   * @template U
   * @param {(val: R) => Result<U, E>} func
   * @returns  {Result<U, E>}
   * @memberof Result
   */
  public andThen<U>(func: (val: R) => Result<U, E>): Result<U, E>;

  /**
   * Returns 'res' if the result is 'Error', otherwise returns the 'Ok' value of
   * 'this'.  Arguments passed to 'or' are eagerly evaluated; if you are passing
   * the result of a function call, it is recommended to use orElse, which is 
   * lazily evaluated.
   *
   * @template F
   * @param {Result<R, F>} res
   * @returns  {Result<R, F>}
   * @memberof Result
   */
  public or<F extends IResultError = IResultError>(
    res: Result<R, F>
  ): Result<R, F>; 

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
  ): Promise<Result<R, F>>;

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
  ): Result<R, F>;

  /**
   * Returns the contained 'Ok' value. If the value is an 'Error' then throw an error
   * including the passed message.
   *
   * @param {string} msg
   * @returns  {R}
   * @memberof Result
   */
  public expect(msg: string): R;

  /**
   * Returns the contained 'Ok' value. If the value is an 'Error' then throw it.
   *
   * @returns  {R}
   * @memberof Result
   */
  public unwrap(): R;

  /**
   * Returns the contained 'Ok' value or a provided default. Arguments passed to
   * unwrapOr are eagerly evaluated; if you are passing the result of a 
   * function call, it is recommended to use unwrapOrElse, which is lazily evaluated.
   *
   * @param {R} def
   * @returns  {R}
   * @memberof Result
   */
  public unwrapOr(def: R): R;

  /**
   * Returns the contained 'Ok' value or computes it from a closure.
   *
   * @param {(err: E) => Promise<R>} func
   * @returns  {Promise<R>}
   * @memberof Result
   */
  public async unwrapOrElseAsync(func: (err: E) => R | Promise<R>): Promise<R>;

  /**
   * Returns the contained 'Ok' value or computes it from a closure.
   *
   * @param {(err: E) => R} func
   * @returns  {R}
   * @memberof Result
   */
  public unwrapOrElse(func: (err: E) => R): R;

  /**
   * Returns the contained 'Err' value, consuming the 'this' value.
   *
   * @returns  {E}
   * @memberof Result
   */
  public unwrapError(): E;

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
  ): Result<U, E>;

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
  ): Result<U, E>;
