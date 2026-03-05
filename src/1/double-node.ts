class DoubleNode {
  value: string;
  next: DoubleNode | null = null;
  prev: DoubleNode | null = null;

  constructor(val: string) {
    this.value = val;
  }
}

export default DoubleNode;
