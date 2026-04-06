import PolarVector from './polar-vector';

export type CollisionMode = 'none' | 'separateChaining';

type TableEntry = {
  key: number;
  vector: PolarVector;
};

export type InsertResult = {
  success: boolean;
  index: number;
  message: string;
};

export class HashTable {
  private readonly buckets: TableEntry[][];

  constructor(
    private readonly size: number,
    private readonly collisionMode: CollisionMode,
  ) {
    this.buckets = Array.from({ length: this.size }, () => []);
  }

  insert(vector: PolarVector): InsertResult {
    const key = vector.getKey();
    const index = this.hash(key);
    const entry: TableEntry = { key, vector };

    if (this.collisionMode === 'none') {
      if (this.buckets[index].length > 0) {
        return {
          success: false,
          index,
          message: `Collision at index ${index}. Insert rejected.`,
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

  deleteByY(threshold: number): number {
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
    console.log('Index | Key (X) | Element (r, phi, x, y)');

    for (let index = 0; index < this.size; index += 1) {
      const bucket = this.buckets[index];

      if (bucket.length === 0) {
        console.log(`${index} | [empty] | [empty]`);
        continue;
      }

      bucket.forEach((entry, chainIndex) => {
        const prefix =
          this.collisionMode === 'separateChaining'
            ? `${index}[${chainIndex}]`
            : `${index}`;

        console.log(
          `${prefix} | ${entry.key} | ${entry.vector.toDisplayString()}`,
        );
      });
    }
  }

  private hash(key: number): number {
    return ((key % this.size) + this.size) % this.size;
  }
}
