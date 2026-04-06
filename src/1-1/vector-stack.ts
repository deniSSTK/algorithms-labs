class VectorStack<T> {
  private items: T[] = [];

  constructor(initialValues: T[] = []) {
    this.items = [...initialValues];
  }

  get size(): number {
    return this.items.length;
  }

  get value(): T[] {
    return [...this.items];
  }

  isEmpty(): boolean {
    return this.size === 0;
  }

  push(item: T): void {
    this.items.push(item);
  }

  pop(): T | undefined {
    return this.items.pop();
  }

  peek(): T | undefined {
    return this.items[this.size - 1];
  }

  toString(): string {
    return this.items.join(' | ');
  }
}

export default VectorStack;
