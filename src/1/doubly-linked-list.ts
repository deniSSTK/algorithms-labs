import DoubleNode from './double-node';

class DoublyLinkedList {
  private head: DoubleNode | null = null;
  private tail: DoubleNode | null = null;

  insert(val: string): void {
    const newNode = new DoubleNode(val);
    if (!this.head) {
      this.head = this.tail = newNode;
    } else if (this.tail) {
      newNode.prev = this.tail;
      this.tail.next = newNode;
      this.tail = newNode;
    }
  }

  delete(val: string): void {
    let current = this.head;

    while (current) {
      if (current.value === val) {
        if (current.prev) current.prev.next = current.next;
        if (current.next) current.next.prev = current.prev;

        if (current === this.head) this.head = current.next;
        if (current === this.tail) this.tail = current.prev;

        return;
      }
      current = current.next;
    }
  }

  toString(): string {
    const elements: string[] = [];
    let current = this.head;
    while (current) {
      elements.push(current.value);
      current = current.next;
    }

    return elements.join(' <-> ');
  }

  insertSorted(val: number): void {
    const newNode = new DoubleNode(val.toString());

    if (!this.head) {
      this.head = this.tail = newNode;
      return;
    }

    if (val < parseInt(this.head.value)) {
      newNode.next = this.head;
      this.head.prev = newNode;
      this.head = newNode;
      return;
    }

    let current = this.head;
    while (current.next && parseInt(current.next.value) < val) {
      current = current.next;
    }

    newNode.next = current.next;
    newNode.prev = current;

    if (current.next) {
      current.next.prev = newNode;
    } else {
      this.tail = newNode;
    }
    current.next = newNode;
  }
}

export default DoublyLinkedList;
