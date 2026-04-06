import { HashTable } from './hash-table';
import PolarVector, { createRandomPolarVector } from './polar-vector';
import variant13Config from './variant-config';

const createVectors = (count: number): PolarVector[] => {
  return Array.from({ length: count }, () => createRandomPolarVector());
};

const printHeader = (title: string): void => {
  console.log(`\n${'='.repeat(18)} ${title} ${'='.repeat(18)}`);
};

const printVariantSummary = (): void => {
  console.log(`Variant: ${variant13Config.variantNumber}`);
  console.log(`Entity class: ${variant13Config.entityClass}`);
  console.log(`Key: ${variant13Config.keyDescription}`);
  console.log(`Hash function: ${variant13Config.hashMethod}`);
  console.log(`Collision resolution: ${variant13Config.collisionResolution}`);
  console.log(`Table size: ${variant13Config.tableSize}`);
  console.log(`Generated vectors: ${variant13Config.vectorCount}`);
  console.log(
    `Deletion criterion: delete all vectors where Y < ${variant13Config.deletionThreshold}`,
  );
};

const printInsertionLog = (table: HashTable, vectors: PolarVector[]): void => {
  vectors.forEach((vector, index) => {
    const result = table.insert(vector);
    console.log(
      `Attempt ${index + 1}: key=${vector.getKey()}, ${vector.toDisplayString()} -> ${result.message}`,
    );
  });
};

const runLevel1 = (vectors: PolarVector[]): void => {
  printHeader('Level 1');

  const table = new HashTable(variant13Config.tableSize, 'none');

  printInsertionLog(table, vectors);
  table.printTable('Final table state:');
};

const runLevel2 = (vectors: PolarVector[]): void => {
  printHeader('Level 2');

  const table = new HashTable(variant13Config.tableSize, 'separateChaining');

  printInsertionLog(table, vectors);
  table.printTable('Final table state:');
};

const runLevel3 = (vectors: PolarVector[]): void => {
  printHeader('Level 3');

  const table = new HashTable(variant13Config.tableSize, 'separateChaining');

  printInsertionLog(table, vectors);
  table.printTable('Table before deletion:');

  const deletedCount = table.deleteByY(variant13Config.deletionThreshold);
  console.log(
    `\nDeleted vectors where Y < ${variant13Config.deletionThreshold}: ${deletedCount}`,
  );

  table.printTable('Table after deletion:');
};

const vectors = createVectors(variant13Config.vectorCount);

printVariantSummary();
runLevel1(vectors);
runLevel2(vectors);
runLevel3(vectors);
