import Optional from '../lib/Optional';

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
