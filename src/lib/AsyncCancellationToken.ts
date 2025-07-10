export const CANCEL_TOKEN: unique symbol = Symbol('CANCEL_TOKEN');

export default class AsyncCancellationToken {
  private promise;
  private callback: () => void;

  constructor() {
    this.callback = () => {
      throw new Error(
        'cancel token called before the promise could be initialised, probably a race condition, oops',
      );
    };

    this.promise = new Promise<typeof CANCEL_TOKEN>(
      (resolve, _reject) => (this.callback = () => resolve(CANCEL_TOKEN)),
    );
  }

  public cancel() {
    this.callback();
  }

  public cancelled() {
    return this.promise;
  }
}
