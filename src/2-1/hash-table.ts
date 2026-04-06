import PolarVector from './polar-vector';

export type CollisionMode = 'noCollisionHandling' | 'separateChaining';

type TableEntry = {
  key: number;
  vector: PolarVector;
};

export type InsertResult = {
  success: boolean;
  index: number;
  message: string;
};

const padCell = (value: string, width: number): string => {
  return value.padEnd(width, ' ');
};

export default class HashTable {
  private buckets: TableEntry[][];

  constructor(private readonly size: number, private readonly mode: CollisionMode) {
    this.buckets = Array.from({ length: this.size }, () => []);
  }

  insert(vector: PolarVector): InsertResult {
    const key = vector.getX();
    const index = this.hash(key);
    const entry: TableEntry = { key, vector };

    if (this.mode === 'noCollisionHandling') {
      if (this.buckets[index].length > 0) {
        return {
          success: false,
          index,
          message: `Collision at index ${index}. Insertion rejected.`,
        };
      }

      this.buckets[index] = [entry];

      return {
        success: true,
        index,
        message: `Inserted at index ${index}.`,
      };
    }

    this.buckets[index].push(entry);

    return {
      success: true,
      index,
      message: `Inserted into chain at index ${index}. Chain length: ${this.buckets[index].length}.`,
    };
  }

  removeWhereYLessThan(threshold: number): number {
    let deletedCount = 0;

    for (let index = 0; index < this.size; index += 1) {
      const originalLength = this.buckets[index].length;
      this.buckets[index] = this.buckets[index].filter(
        (entry) => entry.vector.getY() >= threshold,
      );
      deletedCount += originalLength - this.buckets[index].length;
    }

    return deletedCount;
  }

  printTable(title: string): void {
    console.log(`\n${title}`);
    console.log(
      `${padCell('Index', 12)}| ${padCell('Key (X)', 14)}| Vector`,
    );
    console.log('-'.repeat(90));

    for (let index = 0; index < this.size; index += 1) {
      const bucket = this.buckets[index];

      if (bucket.length === 0) {
        console.log(
          `${padCell(String(index), 12)}| ${padCell('[empty]', 14)}| [empty]`,
        );
        continue;
      }

      if (this.mode === 'separateChaining') {
        const keys = bucket
          .map((entry) => entry.key.toFixed(2))
          .join(' -> ');
        const vectors = bucket
          .map((entry) => `[${entry.vector.getPrintableDetails()}]`)
          .join(' -> ');

        console.log(
          `${padCell(String(index), 12)}| ${padCell(keys, 14)}| ${vectors}`,
        );
        continue;
      }

      const entry = bucket[0];
      console.log(
        `${padCell(String(index), 12)}| ${padCell(entry.key.toFixed(2), 14)}| ${entry.vector.getPrintableDetails()}`,
      );
    }
  }

  private hash(key: number): number {
    return Math.abs(Math.floor(key)) % this.size;
  }
}
