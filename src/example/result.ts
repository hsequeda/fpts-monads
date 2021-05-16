import Optional from '../lib/Optional';
import { Result } from '../lib/Result';

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
