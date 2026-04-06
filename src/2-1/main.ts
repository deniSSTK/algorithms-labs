import HashTable from './hash-table';
import PolarVector, { createRandomPolarVectors } from './polar-vector';

const DEFAULT_TABLE_SIZE = 10;
const DEFAULT_THRESHOLD = 0;
const DEFAULT_VECTOR_COUNT = 18;

const getNumericArgument = (name: string, defaultValue: number): number => {
  const argument = process.argv.find((item) => item.startsWith(`--${name}=`));

  if (!argument) {
    return defaultValue;
  }

  const parsed = Number(argument.split('=')[1]);

  if (!Number.isFinite(parsed)) {
    return defaultValue;
  }

  return parsed;
};

const tableSize = Math.max(1, Math.floor(getNumericArgument('size', DEFAULT_TABLE_SIZE)));
const threshold = getNumericArgument('threshold', DEFAULT_THRESHOLD);
const vectorCount = Math.max(
  1,
  Math.floor(getNumericArgument('count', DEFAULT_VECTOR_COUNT)),
);

const printHeader = (title: string): void => {
  console.log(`\n${'='.repeat(18)} ${title} ${'='.repeat(18)}`);
};

const printInsertionLog = (
  table: HashTable,
  vectors: PolarVector[],
): void => {
  vectors.forEach((vector, index) => {
    const result = table.insert(vector);
    console.log(
      `Attempt ${index + 1}: x=${vector.getX().toFixed(2)}, y=${vector.getY().toFixed(2)} -> ${result.message}`,
    );
  });
};

const printConfiguration = (): void => {
  console.log('Laboratory Work 2.1, Variant 13');
  console.log('Entity class: PolarVector');
  console.log('Hash key: X coordinate');
  console.log('Hash function: h(k) = abs(floor(k)) mod m');
  console.log('Collision resolution: Separate Chaining (Level 2 and 3)');
  console.log(`Table size: ${tableSize}`);
  console.log(`Generated vectors: ${vectorCount}`);
  console.log(`Deletion criterion: Y < ${threshold}`);
  console.log(
    'Run with custom values: npm run run:2-1 -- --size=12 --threshold=0 --count=20',
  );
};

const sourceVectors = createRandomPolarVectors(vectorCount);

printConfiguration();

printHeader('Level 1: No Collision Handling');
const level1Table = new HashTable(tableSize, 'noCollisionHandling');
printInsertionLog(level1Table, sourceVectors);
level1Table.printTable('Table after insertion:');

printHeader('Level 2: Separate Chaining');
const level2Table = new HashTable(tableSize, 'separateChaining');
printInsertionLog(level2Table, sourceVectors);
level2Table.printTable('Table after insertion:');

printHeader('Level 3: Deletion By Criterion');
const level3Table = new HashTable(tableSize, 'separateChaining');
printInsertionLog(level3Table, sourceVectors);
level3Table.printTable('Table before deletion:');

const deletedCount = level3Table.removeWhereYLessThan(threshold);
console.log(`\nRemoved elements where Y < ${threshold}: ${deletedCount}`);
level3Table.printTable('Table after deletion:');
