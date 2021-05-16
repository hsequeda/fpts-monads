import Optional from './Optional';
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

describe('Optional test', () => {
  it('Test isNone function', () => {
    expect(!Optional(2).isNone()).toBeTruthy();

    expect(Optional(null).isNone()).toBeTruthy();
  });
  it('Test isSome function', () => {
    expect(Optional(2).isSome()).toBeTruthy();

    expect(Optional(null).isSome()).toBeFalsy();
  });
  it('Test expect function', () => {
    const testNumber = 5;
    expect(Optional(testNumber).expect('Message') == testNumber).toBeTruthy();

    try {
      Optional(null).expect('Message');
      expect(false).toBeTruthy();
    } catch (error) {
      expect(error.message).toBe('Message');
    }
  });
  it('Test unwrap function', () => {
    const testNumber = 5;
    expect(Optional(testNumber).unwrap() == testNumber).toBeTruthy();

    try {
      Optional(null).unwrap();
      expect(false).toBeTruthy();
    } catch (error) {
      expect(error.message).toBe("Error unwraping 'None' value");
    }
  });
  it('Test unwrapOr function', () => {
    const testNumber = 5;
    expect(Optional(testNumber).unwrapOr(8) == testNumber).toBeTruthy();

    expect(Optional(null).unwrapOr(6) == 6).toBeTruthy();
  });
  it('Test okOr function', () => {
    const testNumber = 5;
    const error = new SimpleError();
    const r1 = Optional(testNumber).okOr(error);
    expect(r1 instanceof Result).toBeTruthy();
    expect(r1.isSuccess).toBeTruthy();
    expect(r1.unwrap()).toEqual(testNumber);

    const r2 = Optional(null).okOr(error);
    expect(r2 instanceof Result).toBeTruthy();
    expect(r2.isFailure).toBeTruthy();
    expect(r2.unwrapError() instanceof SimpleError).toBeTruthy();
  });
  it('Test okOrElse function', () => {
    const testNumber = 5;
    const error = new SimpleError();
    const r1 = Optional(testNumber).okOrElse(() => error);
    expect(r1 instanceof Result).toBeTruthy();
    expect(r1.isSuccess).toBeTruthy();

    const r2 = Optional(null).okOrElse(() => error);
    expect(r2 instanceof Result).toBeTruthy();
    expect(r2.isFailure).toBeTruthy();
    expect(r2.unwrapError() instanceof SimpleError).toBeTruthy();
  });
  it('Test okOrElseAsync function', async () => {
    const testNumber = 5;
    const r1 = await Optional(testNumber).okOrElseAsync(
      async () => new SimpleError()
    );
    expect(r1 instanceof Result).toBeTruthy();
    expect(r1.isSuccess).toBeTruthy();
    expect(r1.unwrap()).toEqual(testNumber);

    const r2 = await Optional(null).okOrElseAsync(
      async () => new SimpleError()
    );
    expect(r2 instanceof Result).toBeTruthy();
    expect(r2.isFailure).toBeTruthy();
    expect(r2.unwrapError() instanceof SimpleError).toBeTruthy();
  });
  it('Test match function', () => {
    const testNumber = 5;
    const match1 = Optional(testNumber).match<{
      status: boolean;
      testNumber: number;
    }>(
      (testNumberX) => {
        return { status: true, testNumber: testNumberX };
      },
      () => {
        return { status: false, testNumber: null };
      }
    );
    expect(match1.status).toBeTruthy();
    expect(match1.testNumber == testNumber).toBeTruthy();

    const match2 = Optional(null).match<{
      status: boolean;
      testNumber: number;
    }>(
      (testNumberX) => {
        return { status: true, testNumber: testNumberX };
      },
      () => {
        return { status: false, testNumber: null };
      }
    );
    expect(!match2.status).toBeTruthy();
  });
  it('Test matchAsync function', async () => {
    const testNumber = 5;
    const matchAsync1 = await Optional(testNumber).matchAsync<{
      status: boolean;
      testNumber: number;
    }>(
      async (testNumberX) => {
        return { status: true, testNumber: testNumberX };
      },
      async () => {
        return { status: false, testNumber: null };
      }
    );
    expect(matchAsync1.status).toBeTruthy();
    expect(matchAsync1.testNumber == testNumber).toBeTruthy();

    const matchAsync2 = await Optional(null).matchAsync<{
      status: boolean;
      testNumber: number;
    }>(
      async (testNumberX) => {
        return { status: true, testNumber: testNumberX };
      },
      async () => {
        return { status: false, testNumber: null };
      }
    );
    expect(!matchAsync2.status).toBeTruthy();
  });
  it('Test and function', () => {
    const someA = Optional(1);
    const someB = Optional(2);
    const none = Optional(null);

    const s_s = someA.and(someB);
    expect(s_s == someB).toBeTruthy();

    const s_n = someA.and(none);
    expect(s_n == none).toBeTruthy();

    const n_s = none.and(someA);
    expect(n_s == none).toBeTruthy();

    const n_n = none.and(none);
    expect(n_n == none).toBeTruthy();
  });
  it('Test andThen function', async () => {
    const someA = Optional(1);
    const r1 = await someA.andThen<number>((a) => Optional(a));
    expect(r1.isSome()).toBeTruthy();
    expect(r1.unwrap() == someA.unwrap()).toBeTruthy();

    const none = Optional(null);
    const r2 = await none.andThen<number>((a) => Optional(a));
    expect(r2.isNone()).toBeTruthy();
  });
  it('Test andThenAsync function', async () => {
    const someA = Optional(1);
    const r1 = await someA.andThenAsync<number>(async (a) => Optional(a));
    expect(r1.isSome()).toBeTruthy();
    expect(r1.unwrap() == someA.unwrap()).toBeTruthy();

    const none = Optional(null);
    const r2 = await none.andThenAsync<number>(async (a) => Optional(a));
    expect(r2.isNone()).toBeTruthy();
  });
  it('Test map function', () => {
    const map1 = Optional(5).map<number>((a) => {
      return a * 3;
    });
    expect(map1.isSome()).toBeTruthy();
    expect(map1.unwrap() == 15).toBeTruthy();

    const map2 = Optional(null).map<number>((a) => {
      return a * 3;
    });
    expect(map2.isNone()).toBeTruthy();
  });
  it('Test mapAsync function', async () => {
    const map1 = await Optional(5).mapAsync<number>(async (a) => a * 3);
    expect(map1.isSome()).toBeTruthy();
    expect(map1.unwrap()).toEqual(15);

    const map2 = await Optional(null).mapAsync<number>(async (a) => a * 3);
    expect(map2.isNone()).toBeTruthy();
  });
  it('Test mapOr function', () => {
    const r1 = Optional(5).mapOr<number>(8, (a) => a * 3);
    expect(r1).toEqual(15);

    const r2 = Optional(null).mapOr<number>(8, (a) => a * 3);
    expect(r2).toEqual(8);
  });
  it('Test mapOrAsync function', async () => {
    const r1 = await Optional(5).mapOrAsync<number>(8, async (a) => a * 3);
    expect(r1).toEqual(15);

    const r2 = await Optional(null).mapOrAsync<number>(8, async (a) => a * 3);
    expect(r2).toEqual(8);
  });
  it('Test mapOrElse function', () => {
    const r1 = Optional(5).mapOr<number>(8, (a) => a * 3);
    expect(r1).toEqual(15);

    const r2 = Optional(null).mapOr<number>(8, (a) => a * 3);
    expect(r2).toEqual(8);
  });
  it('Test mapOrElseAsync function', async () => {
    const r1 = await Optional(5).mapOrElseAsync<number>(
      async () => 8,
      async (a) => a * 3
    );
    expect(r1).toEqual(15);

    const r2 = await Optional(null).mapOrElseAsync<number>(
      async () => 8,
      async (a) => a * 3
    );
    expect(r2).toEqual(8);
  });
  it('Test or function', () => {
    const someA1 = Optional(5);
    const someA2 = Optional(8);
    const none = Optional(null);

    const s_s = someA1.or(someA2);
    expect(s_s.isSome).toBeTruthy();
    expect(s_s.unwrap()).toEqual(5);

    const s_n = someA1.or(none);
    expect(s_n.isSome).toBeTruthy();
    expect(s_n.unwrap()).toEqual(5);

    const n_s = none.or(someA1);
    expect(n_s.isSome).toBeTruthy();
    expect(n_s.unwrap()).toEqual(5);

    const n_n = none.or(none);
    expect(n_n.isNone).toBeTruthy();
  });
  it('Test orElse function', () => {
    const someA1 = Optional(5);
    const someA2 = Optional(8);
    const none = Optional(null);

    const s_s = someA1.orElse(() => someA2);
    expect(s_s.isSome).toBeTruthy();
    expect(s_s.unwrap()).toEqual(5);

    const s_n = someA1.orElse(() => none);
    expect(s_n.isSome).toBeTruthy();
    expect(s_n.unwrap()).toEqual(5);

    const n_s = none.orElse(() => someA1);
    expect(n_s.isSome).toBeTruthy();
    expect(n_s.unwrap()).toEqual(5);

    const n_n = none.orElse(() => none);
    expect(n_n.isNone).toBeTruthy();
  });
  it('Test orElseAsync function', async () => {
    const someA1 = Optional(5);
    const someA2 = Optional(8);
    const none = Optional(null);

    const s_s = await someA1.orElseAsync(async () => someA2);
    expect(s_s.isSome).toBeTruthy();
    expect(s_s.unwrap()).toEqual(5);

    const s_n = await someA1.orElseAsync(async () => none);
    expect(s_n.isSome).toBeTruthy();
    expect(s_n.unwrap()).toEqual(5);

    const n_s = await none.orElseAsync(async () => someA1);
    expect(n_s.isSome).toBeTruthy();
    expect(n_s.unwrap()).toEqual(5);

    const n_n = await none.orElseAsync(async () => none);
    expect(n_n.isNone).toBeTruthy();
  });
  it('Test xor function', () => {
    const some1 = Optional(5);
    const some2 = Optional(8);
    const none = Optional(null);

    const s_s = some1.xor(some2);
    expect(s_s.isNone()).toBeTruthy();

    const s_n = some1.xor(none);
    expect(s_n.isSome()).toBeTruthy();
    expect(s_n.unwrap()).toEqual(5);

    const n_s = none.xor(some1);
    expect(n_s.isSome()).toBeTruthy();
    expect(n_s.unwrap()).toEqual(5);

    const n_n = none.xor(none);
    expect(n_n.isNone()).toBeTruthy();
  });
});
