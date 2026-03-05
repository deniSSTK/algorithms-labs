class Vector {
  private vector: number[] = [];

  constructor(value: number[]) {
    this.vector = value;
  }

  get length() {
    return this.vector.length;
  }

  get value() {
    return this.vector;
  }

  add(el: number) {
    this.vector.push(el);
  }

  delete(el: number): number {
    const countBefore = this.length;

    this.vector = this.vector.filter((e) => e !== el);
    return countBefore - this.vector.length;
  }

  deleteByIndex(index: number) {
    if (index < 0 || index >= this.length) {
      throw new Error('Index out of range');
    }

    this.vector.splice(index, 1);
  }
}

export default Vector;
