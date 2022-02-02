/* eslint-disable @typescript-eslint/no-explicit-any */
import { Result } from './Result';

class Some<A> implements Optional<A> {
  constructor(private a: A) {}

  expect(_: string): A {
    return this.a;
  }

  unwrap(): A {
    return this.a;
  }

  unwrapOr(_: A): A {
    return this.a;
  }

  unwrapOrElse(_: () => A): A {
    return this.a;
  }

  async unwrapOrElseAsync(_: () => Promise<A>): Promise<A> {
    return this.a;
  }

  map<B>(func: (a: A) => B): Optional<B> {
    return Optional(func(this.a));
  }

  async mapAsync<B>(func: (a: A) => Promise<B>): Promise<Optional<B>> {
    return Optional(await func(this.a));
  }

  mapOr<B>(_: B, func: (a: A) => B): B {
    return func(this.a);
  }

  async mapOrAsync<B>(_: B, func: (a: A) => Promise<B>): Promise<B> {
    return func(this.a);
  }

  mapOrElse<B>(_: () => B, func: (a: A) => B): B {
    return func(this.a);
  }

  async mapOrElseAsync<B>(
    _: () => Promise<B>,
    func: (a: A) => Promise<B>
  ): Promise<B> {
    return func(this.a);
  }

  okOr<E extends Error>(_: E): Result<A> {
    return Result.Ok(this.a);
  }

  okOrElse<E extends Error>(_: () => E): Result<A, Error> {
    return Result.Ok(this.a);
  }

  async okOrElseAsync<E extends Error>(
    _: () => Promise<E>
  ): Promise<Result<A, Error>> {
    return Result.Ok(this.a);
  }

  match<S>(some: (a: A) => S, _: () => S): S {
    return some(this.a);
  }

  async matchAsync<S>(
    some: (a: A) => Promise<S>,
    _: () => Promise<S>
  ): Promise<S> {
    return some(this.a);
  }

  and<U>(optb: Optional<U>): Optional<U> {
    return optb;
  }

  andThen<U>(func: (val: A) => Optional<U>): Optional<U> {
    return func(this.a);
  }

  andThenAsync<U>(
    func: (val: A) => Promise<Optional<U>>
  ): Promise<Optional<U>> {
    return func(this.a);
  }

  or(_: Optional<A>): Optional<A> {
    return this;
  }

  orElse(_: () => Optional<A>): Optional<A> {
    return this;
  }

  async orElseAsync(_: () => Promise<Optional<A>>): Promise<Optional<A>> {
    return this;
  }

  xor(optb: Optional<A>): Optional<A> {
    return optb.isSome() ? None : this;
  }

  isNone(): boolean {
    return false;
  }

  isSome(): boolean {
    return true;
  }
}

const None: Optional<any> = {
  expect(msg: string) {
    throw new Error(msg);
  },

  unwrap() {
    throw new Error(`Error unwraping 'None' value`);
  },

  unwrapOr(def: any): any {
    return def;
  },

  unwrapOrElse(func: () => any): any {
    return func();
  },

  async unwrapOrElseAsync(func: () => Promise<any>): Promise<any> {
    return func();
  },

  map<B>(_: (_: any) => B) {
    return this;
  },

  async mapAsync<B>(_: (_: any) => Promise<B>): Promise<Optional<B>> {
    return this;
  },

  mapOr<B>(def: B, _: (_: any) => B): B {
    return def;
  },

  async mapOrAsync<B>(def: B, _: (_: any) => Promise<B>): Promise<B> {
    return def;
  },

  mapOrElse<B>(defFunc: () => B, _: (_: any) => B): B {
    return defFunc();
  },

  async mapOrElseAsync<B>(
    defFunc: () => Promise<B>,
    _: (_: any) => Promise<B>
  ): Promise<B> {
    return defFunc();
  },

  okOr<E extends Error>(err: E): Result<any> {
    return Result.Fail(err);
  },

  okOrElse<E extends Error>(errFunc: () => E): Result<any, Error> {
    return Result.Fail(errFunc());
  },

  async okOrElseAsync<E extends Error>(
    errFunc: () => Promise<E>
  ): Promise<Result<any, Error>> {
    return Result.Fail(await errFunc());
  },

  match<S>(_: (_: any) => S, func: () => S): S {
    return func();
  },

  async matchAsync<S>(
    _: (_: any) => Promise<S>,
    func: () => Promise<S>
  ): Promise<S> {
    return func();
  },

  and<U>(_: Optional<U>): Optional<U> {
    return this;
  },

  andThen<U>(_: (_: any) => Optional<U>): Optional<U> {
    return this;
  },

  async andThenAsync<U>(
    _: (_: any) => Promise<Optional<U>>
  ): Promise<Optional<U>> {
    return this;
  },

  or(optb: Optional<any>): Optional<any> {
    return optb;
  },

  orElse(func: () => Optional<any>): Optional<any> {
    return func();
  },

  async orElseAsync(
    func: () => Promise<Optional<any>>
  ): Promise<Optional<any>> {
    return func();
  },

  xor(optb: Optional<any>): Optional<any> {
    return optb.isSome() ? optb : this;
  },

  isNone(): boolean {
    return true;
  },

  isSome(): boolean {
    return false;
  },
};

// eslint-disable-next-line @typescript-eslint/naming-convention
interface Optional<A> {
  /**
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
   * Returns the contained 'Some' value, if is 'None' throw an error with the passed message.
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
   * Returns the contained 'Some' value or a provided default. Arguments passed to unwrapOr
   * are eagerly evaluated; if you are passing the result of a function call, it is recommended
   * to use unwrapOrElse, which is lazily evaluated.
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
   * Applies a function to the contained value (if any), or returns the provided default (if not).
   * Arguments passed to mapOr are eagerly evaluated; if you are passing the result of a function call,
   * it is recommended to use mapOrElse, which is lazily evaluated.
   *
   * @template B
   * @param {B} def
   * @param {(a: A) => B} func
   * @returns  {B}
   * @memberof Optional
   */
  mapOr<B>(def: B, func: (a: A) => B): B;

  /**
   * Applies a function to the contained value (if any), or returns the provided default (if not).
   * Arguments passed to mapOr are eagerly evaluated; if you are passing the result of a function call,
   * it is recommended to use mapOrElse, which is lazily evaluated.
   *
   * @template B
   * @param {B} def
   * @param {(a: A) => Promise<B>} func
   * @returns  {Promise<B>}
   * @memberof Optional
   */
  mapOrAsync<B>(def: B, func: (a: A) => Promise<B>): Promise<B>;

  /**
   * Applies a function to the contained value (if any), or computes a default (if not).
   *
   * @template B
   * @param {() => B} def
   * @param {(a: A) => B} func
   * @returns  {B}
   * @memberof Optional
   */
  mapOrElse<B>(def: () => B, func: (a: A) => B): B;

  /**
   * Applies a function to the contained value (if any), or computes a default (if not).
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
   * Transforms the Option<T> into a Result<T, E>, mapping 'Some(v)' to 'Ok(v)' and 'None' to 'Error(err)'.
   * Arguments passed to okOr are eagerly evaluated; if you are passing the result of a function call, it is
   * recommended to use okOrElse, which is lazily evaluated.
   *
   * @template E
   * @param {E} err
   * @returns  {Result<A>}
   * @memberof Optional
   */
  okOr<E extends Error>(err: E): Result<A>;

  /**
   * Transforms the Option<T> into a Result<T, E>, mapping 'Some(v)' to 'Ok(v)' and 'None' to 'Err(func())'.
   *
   * @template E
   * @param {() => E} errFunc
   * @returns  {Result<A>}
   * @memberof Optional
   */
  okOrElse<E extends Error>(errFunc: () => E): Result<A>;

  /**
   * Transforms the Option<T> into a Result<T, E>, mapping 'Some(v)' to 'Ok(v)' and 'None' to 'Err(func())'.
   *
   * @template E
   * @param {() => Promise<E>} errFunc
   * @returns  {Promise<Result<A>>}
   * @memberof Optional
   */
  okOrElseAsync<E extends Error>(errFunc: () => Promise<E>): Promise<Result<A>>;

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
   * Returns 'None' if the option is 'None', otherwise calls 'func' with the wrapped value and
   * returns the result. Some languages call this operation flatmap.
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
   * Returns 'None' if the option is 'None', otherwise calls 'func' with the wrapped value and
   * returns the result. Some languages call this operation flatmap.
   *
   * @template U
   * @param {(val: A) => Promise<Optional<U>>} func
   * @returns  {Promise<Optional<U>>}
   * @memberof Optional
   */
  andThenAsync<U>(func: (val: A) => Promise<Optional<U>>): Promise<Optional<U>>;

  /**
   * Returns the option if it contains a value, otherwise returns 'optb'. Arguments passed to
   * or are eagerly evaluated; if you are passing the result of a function call, it is recommended
   * to use orElse, which is lazily evaluated.
   *
   * @param {Optional<A>} optb
   * @returns  {Optional<A>}
   * @memberof Optional
   */
  or(optb: Optional<A>): Optional<A>;

  /**
   * Returns the option if it contains a value, otherwise calls 'func' and returns the result.
   *
   * @param {() => Optional<A>} func
   * @returns  {Optional<A>}
   * @memberof Optional
   */
  orElse(func: () => Optional<A>): Optional<A>;

  /**
   * Returns the option if it contains a value, otherwise calls 'func' and returns the result.
   *
   * @param {() => Promise<Optional<A>>} func
   * @returns  {Promise<Optional<A>>}
   * @memberof Optional
   */
  orElseAsync(func: () => Promise<Optional<A>>): Promise<Optional<A>>;

  /**
   * Returns 'Some' if exactly one of 'this', 'optb' is 'Some', otherwise returns 'None'.
   *
   * @param {Optional<A>} optb
   * @returns  {Optional<A>}
   * @memberof Optional
   */
  xor(optb: Optional<A>): Optional<A>;
}

function Optional<A>(a: A): Optional<A> {
  if (a === undefined || a === null) {
    return None;
  } else {
    return new Some(a);
  }
}

export default Optional;
