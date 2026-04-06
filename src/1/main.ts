import LinkedQueue from './linked-queue';
import VectorStack from './vector-stack';

const decimalToBinary = (num: number): string => Math.round(num).toString(2);

console.log('--- Task 1: Stack Based on Vector ---');

const stackDemo = new VectorStack<string>(['101', '111']);
console.log('Initial stack:', stackDemo.toString());

stackDemo.push('1001');
console.log("Stack after push('1001'):", stackDemo.toString());

const poppedValue = stackDemo.pop();
console.log('Popped value:', poppedValue);
console.log('Stack after pop():', stackDemo.toString());

console.log('\n--- Task 2: Queue Based on Linked List ---');

const queueDemo = new LinkedQueue<number>([5, 10, 15]);
console.log('Initial queue:', queueDemo.toString());

queueDemo.enqueue(20);
console.log('Queue after enqueue(20):', queueDemo.toString());

const dequeuedValue = queueDemo.dequeue();
console.log('Dequeued value:', dequeuedValue);
console.log('Queue after dequeue():', queueDemo.toString());

console.log('\n--- Task 3: Variant 13 ---');

const sourceQueue = new LinkedQueue<number>([10.2, -5, 7.8, -11.4, 3.01]);
const binaryStack = new VectorStack<string>();

console.log('Queue before processing:', sourceQueue.toString());
console.log('Stack before processing:', binaryStack.toString());

while (!sourceQueue.isEmpty()) {
  const item = sourceQueue.dequeue();

  if (item === undefined) {
    break;
  }

  if (item > 0) {
    const binaryValue = decimalToBinary(item);
    binaryStack.push(binaryValue);
    console.log(`${item} -> ${binaryValue} pushed to stack`);
  } else {
    console.log(`${item} is negative and removed from queue`);
  }
}

console.log('Queue after processing:', sourceQueue.toString());
console.log('Stack after processing:', binaryStack.toString());
