export default class PriorityQueue<T> {
  protected waitPromise: Promise<void> | null;
  protected waitResolve: (() => void) | null;
  protected queue: Map<number, Array<T>>;

  public constructor(
    protected compFunc: (a: T, b: T) => boolean = (a: T, b: T) => a === b,
  ) {
    this.queue = new Map();
    this.waitPromise = null;
    this.waitResolve = null;
  }

  public getHighestPriority(): number {
    return Math.min(...this.queue.keys());
  }

  public get length() {
    let total = 0;
    this.queue.forEach((q) => (total += q.length));
    return total;
  }

  public push(priority: number, item: T) {
    if (!this.queue.has(priority)) {
      this.queue.set(priority, []);
    }

    this.queue.get(priority)!.push(item);
    this.onPush();
  }

  public pushReplace(priority: number, item: T) {
    this.queue.forEach((q, p) => {
      q.forEach((qItem, idx) => {
        if (this.compFunc(qItem, item)) {
          if (p != priority) {
            q.splice(idx, 1);
            if (q.length == 0) {
              this.queue.delete(p);
            }
          }
        }
      });
    });

    this.push(priority, item);
  }

  protected onPush() {
    if (this.waitPromise && this.waitResolve) {
      this.waitResolve();

      this.waitPromise = null;
      this.waitResolve = null;
    }
  }
  public async wait(): Promise<void> {
    if (this.length > 0) {
      return;
    }

    if (!this.waitPromise) {
      this.waitPromise = new Promise((resolve) => (this.waitResolve = resolve));
    }

    return this.waitPromise;
  }

  public async waitPop(): Promise<T> {
    await this.wait();
    return this.pop()!;
  }

  public peek(): T | undefined {
    if (this.length == 0) {
      return;
    }

    return this.queue.get(this.getHighestPriority())!.at(-1);
  }

  public pop(): T | undefined {
    if (this.length == 0) {
      return;
    }

    const highestPrio = this.getHighestPriority();
    const queue = this.queue.get(highestPrio)!;
    const item = queue.shift();
    if (queue.length == 0) {
      this.queue.delete(highestPrio);
    }
    return item;
  }
}
