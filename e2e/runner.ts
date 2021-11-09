export class TestRunner<T, R> {
  constructor(
    private readonly _conditions: T[],
    private readonly _callback: (a: T) => Promise<R>
  ) {}

  async *[Symbol.asyncIterator]() {
    for (const args of this._conditions) {
      yield await this._run(args);
    }
  }

  private _run(a: T) {
    return this._callback(a);
  }
}
