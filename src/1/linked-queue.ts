import QueueNode from './queue-node';

class LinkedQueue<T> {
  private head: QueueNode<T> | null = null;
  private tail: QueueNode<T> | null = null;
  private length = 0;

  constructor(initialValues: T[] = []) {
    initialValues.forEach((value) => this.enqueue(value));
  }

  get size(): number {
    return this.length;
  }

  isEmpty(): boolean {
    return this.length === 0;
  }

  enqueue(value: T): void {
    const newNode = new QueueNode(value);

    if (!this.tail) {
      this.head = newNode;
      this.tail = newNode;
      this.length += 1;
      return;
    }

    this.tail.next = newNode;
    this.tail = newNode;
    this.length += 1;
  }

  dequeue(): T | undefined {
    if (!this.head) {
      return undefined;
    }

    const value = this.head.value;
    this.head = this.head.next;

    if (!this.head) {
      this.tail = null;
    }

    this.length -= 1;
    return value;
  }

  peek(): T | undefined {
    return this.head?.value;
  }

  toArray(): T[] {
    const items: T[] = [];
    let current = this.head;

    while (current) {
      items.push(current.value);
      current = current.next;
    }

    return items;
  }

  toString(): string {
    return this.toArray().join(' -> ');
  }
}

export default LinkedQueue;
