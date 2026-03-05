import Vector from './vector';
import DoublyLinkedList from './doubly-linked-list';

console.log('--- Level 1: Vector Operations ---');

const myVector = new Vector([10, 5, 8, 3, 12]);
console.log('Initial Vector:', myVector.value);

myVector.delete(5);
console.log("Vector after deleting '5':", myVector.value);

console.log('\n--- Level 2: Doubly Linked List Operations ---');

const myList = new DoublyLinkedList();
myList.insert('Apple');
myList.insert('Banana');
myList.insert('Cherry');
console.log('Initial List:', myList.toString());

myList.delete('Banana');
console.log("List after deleting 'Banana':", myList.toString());

console.log('\n--- Level 3: Option 5 Execution ---');

const sourceVector = new Vector([14, 7, 2, 9, 20, 6, 1]);
const targetList = new DoublyLinkedList();

console.log('Source Vector before transfer:', sourceVector.value);

const elementsToProcess = [...sourceVector.value];

elementsToProcess.forEach((num) => {
  if (num % 2 === 0) {
    targetList.insertSorted(num);

    sourceVector.delete(num);
  }
});

console.log('Source Vector after (only odd numbers left):', sourceVector.value);
console.log(
  'Target List after (even numbers, sorted as strings):',
  targetList.toString(),
);
