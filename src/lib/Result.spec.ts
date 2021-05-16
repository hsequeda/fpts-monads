import { Result } from './Result';

class SimpleError {
  name: 'SimpleError';
  message: 'SimpleError: message';

  pretty(): string {
    return `[${this.name}] ${this.message}`;
  }
  throw(): void {
    throw new Error(this.pretty());
  }
}

class SimpleError2 {
  name: 'SimpleError2';
  message: `I'm other simple error.`;

  pretty(): string {
    return `[${this.name}] ${this.message}`;
  }
  throw(): void {
    throw new Error(this.pretty());
  }
}

describe('Result library test', () => {
  it('Test isSuccess function', () => {
    expect(Result.Ok(5).isSuccess).toBeTruthy();

    expect(Result.Fail(new SimpleError()).isSuccess).toBeFalsy();
  });
  it('Test isFailure function', () => {
    expect(Result.Ok(5).isFailure).toBeFalsy();

    expect(Result.Fail(new SimpleError()).isFailure).toBeTruthy();
  });
  it('Test unwrap function', () => {
    expect(Result.Ok(5).unwrap()).toEqual(5);
  });
  it('Test unwrapOr function', () => {
    expect(Result.Ok(5).unwrapOr(8)).toEqual(5);

    expect(Result.Fail(new SimpleError()).unwrapOr(8)).toEqual(8);
  });
  it('Test expect function', () => {
    expect(Result.Ok(5).expect('Message')).toEqual(5);

    try {
      Result.Fail(new SimpleError()).expect('Message');
      expect(false).toBeTruthy();
    } catch (error) {
      expect(error.message).toEqual('Message');
    }
  });
  it('Test unwrapError function', () => {
    try {
      expect(Result.Ok(5).unwrapError());
      expect(false).toBeTruthy();
    } catch (error) {
      expect(error instanceof Error).toBeTruthy();
      expect(error.message).toEqual(`Unwraping error in 'Ok' result`);
    }

    expect(
      Result.Fail(new SimpleError()).unwrapError() instanceof SimpleError
    ).toBeTruthy();
  });
  it('Test getValue function', () => {
    const value = Result.Ok(5).getValue();
    expect(value.isSome()).toBeTruthy();
    expect(value.unwrap() == 5).toBeTruthy();

    const value2 = Result.Fail(new SimpleError()).getValue();
    expect(value2.isNone()).toBeTruthy();
  });
  it('Test valueError function', () => {
    const valueError = Result.Ok(5).errorValue();
    expect(valueError.isNone()).toBeTruthy();

    const valueError2 = Result.Fail(new SimpleError()).errorValue();
    expect(valueError2.isSome()).toBeTruthy();
    expect(valueError2.unwrap() instanceof SimpleError).toBeTruthy();
  });
  it('Test map function', () => {
    const map = Result.Ok(5).map((a) => a * a);
    expect(map.isSuccess).toBeTruthy();
    expect(map.unwrap()).toEqual(25);

    expect(
      Result.Fail<number>(new SimpleError()).map((a) => a * a).isFailure
    ).toBeTruthy();
  });
  it('Test mapAsync function', async () => {
    const map = await Result.Ok(5).mapAsync(async (a) => a * a);
    expect(map.isSuccess).toBeTruthy();
    expect(map.unwrap()).toEqual(25);

    const map2 = await Result.Fail<number>(new SimpleError()).mapAsync(
      async (a) => a * a
    );
    expect(map2.isFailure).toBeTruthy();
  });
  it('Test mapOr function', () => {
    expect(Result.Ok(5).mapOr(8, (a) => a * a)).toEqual(25);

    expect(
      Result.Fail<number>(new SimpleError()).mapOr(8, (a) => a * a)
    ).toEqual(8);
  });
  it('Test mapOrAsync function', async () => {
    expect(await Result.Ok(5).mapOrAsync(8, async (a) => a * a)).toEqual(25);

    const num = await Result.Fail<number>(new SimpleError()).mapOrAsync(
      8,
      async (a) => a * a
    );
    expect(num).toEqual(8);
  });
  it('Test mapOrElse function', () => {
    const num = Result.Ok(5).mapOrElse(
      () => 8,
      (a) => a * a
    );
    expect(num).toEqual(25);

    const num2 = Result.Fail<number>(new SimpleError()).mapOrElse(
      () => 8,
      (a) => a * a
    );
    expect(num2).toEqual(8);
  });
  it('Test mapOrElseAsync function', async () => {
    const num = await Result.Ok(5).mapOrElseAsync(
      async () => 8,
      async (a) => a * a
    );
    expect(num).toEqual(25);

    const num2 = await Result.Fail<number>(new SimpleError()).mapOrElseAsync(
      async () => 8,
      async (a) => a * a
    );
    expect(num2).toEqual(8);
  });
  it('Test mapOrError function', () => {
    const result1 = Result.Ok(5).mapOrError(() => new SimpleError());
    expect(result1.isSuccess).toBeTruthy();
    expect(result1.unwrap()).toEqual(5);

    const result2 = Result.Fail<number>(new SimpleError()).mapOrError(
      () => new SimpleError()
    );
    expect(result2.isFailure).toBeTruthy();
  });
  it('Test mapOrErrorAsync function', async () => {
    const result1 = await Result.Ok(5).mapOrErrorAsync(
      async () => new SimpleError()
    );
    expect(result1.isSuccess).toBeTruthy();
    expect(result1.unwrap()).toEqual(5);

    const result2 = await Result.Fail<number>(
      new SimpleError()
    ).mapOrErrorAsync(async () => new SimpleError());
    expect(result2.isFailure).toBeTruthy();
  });
  it('Test and function', () => {
    const ok = Result.Ok(5);
    const fail = Result.Fail<number>(new SimpleError());
    const ok2 = Result.Ok(8);
    const fail2 = Result.Fail<number>(new SimpleError2());

    const ok_ok = ok.and(ok2);
    expect(ok_ok.isSuccess).toBeTruthy();
    expect(ok_ok.unwrap()).toEqual(8);

    const ok_fail = ok.and(fail2);
    expect(ok_fail.isFailure).toBeTruthy();
    expect(ok_fail.unwrapError() instanceof SimpleError2).toBeTruthy();

    const fail_ok = fail.and(ok2);
    expect(fail_ok.isFailure).toBeTruthy();
    expect(fail_ok.unwrapError() instanceof SimpleError).toBeTruthy();

    const fail_fail = fail.and(fail2);
    expect(fail_fail.isFailure).toBeTruthy();
    expect(fail_fail.unwrapError() instanceof SimpleError).toBeTruthy();
  });
  it('Test andThen function', () => {
    const r1 = Result.Ok(5).andThen((a) => Result.Ok(a * a));
    expect(r1.isSuccess).toBeTruthy();
    expect(r1.unwrap()).toEqual(25);

    const r2 = Result.Fail<number>(new SimpleError()).andThen((a) =>
      Result.Ok(a * a)
    );
    expect(r2.isFailure).toBeTruthy();
  });
  it('Test andThenAsync function', async () => {
    const r1 = await Result.Ok(5).andThenAsync(async (a) => Result.Ok(a * a));
    expect(r1.isSuccess).toBeTruthy();
    expect(r1.unwrap()).toEqual(25);

    const r2 = await Result.Fail<number>(new SimpleError()).andThenAsync(
      async (a) => Result.Ok(a * a)
    );
    expect(r2.isFailure).toBeTruthy();
  });
  it('Test or function', () => {
    const ok = Result.Ok(5);
    const fail = Result.Fail<number>(new SimpleError());
    const ok2 = Result.Ok(8);
    const fail2 = Result.Fail<number>(new SimpleError2());

    const ok_ok = ok.or(ok2);
    expect(ok_ok.isSuccess).toBeTruthy();
    expect(ok_ok.unwrap()).toEqual(5);

    const ok_fail = ok.or(fail2);
    expect(ok_fail.isSuccess).toBeTruthy();
    expect(ok_fail.unwrap()).toEqual(5);

    const fail_ok = fail.or(ok2);
    expect(fail_ok.isSuccess).toBeTruthy();
    expect(fail_ok.unwrap()).toEqual(8);

    const fail_fail = fail.or(fail2);
    expect(fail_fail.isFailure).toBeTruthy();
    expect(fail_fail.unwrapError() instanceof SimpleError2).toBeTruthy();
  });
  it('Test orElse function', () => {
    const ok = Result.Ok(5);
    const r1 = ok.orElse(() => Result.Fail(new SimpleError2()));
    expect(r1.isSuccess).toBeTruthy();
    expect(r1.unwrap()).toEqual(5);

    const fail = Result.Fail<number>(new SimpleError());
    const r2 = fail.orElse(() => Result.Fail(new SimpleError2()));
    expect(r2.isFailure).toBeTruthy();
    expect(r2.unwrapError() instanceof SimpleError2).toBeTruthy();
  });
  it('Test orElseAsync function', async () => {
    const ok = Result.Ok(5);
    const r1 = await ok.orElseAsync(async () =>
      Result.Fail(new SimpleError2())
    );
    expect(r1.isSuccess).toBeTruthy();
    expect(r1.unwrap()).toEqual(5);

    const fail = Result.Fail<number>(new SimpleError());
    const r2 = await fail.orElseAsync(async () =>
      Result.Fail(new SimpleError2())
    );
    expect(r2.isFailure).toBeTruthy();
    expect(r2.unwrapError() instanceof SimpleError2).toBeTruthy();
  });
});
