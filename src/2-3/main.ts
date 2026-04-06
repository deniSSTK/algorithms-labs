import * as fs from 'fs';
import * as path from 'path';
import {
  createInterface,
  Interface as ReadlineInterface,
} from 'readline/promises';
import { stdin as input, stdout as output } from 'process';

const DEFAULT_TOTAL_BOOKS = 12;
const DEFAULT_GROUPED_BOOKS = 3;
const ODD_DIGIT_COUNT = 5;
const ARRAY_SIZE = 15;
const GENERATION_TOTAL_BOOKS = 4;
const GENERATION_GROUPED_BOOKS = 2;
const OUTPUT_FILE_PATH = path.join(process.cwd(), 'src/2-3/output.txt');

const factorial = (value: number): bigint => {
  let result = BigInt(1);

  for (let current = 2; current <= value; current += 1) {
    result *= BigInt(current);
  }

  return result;
};

const powerBigInt = (base: number, exponent: number): bigint => {
  let result = BigInt(1);

  for (let current = 0; current < exponent; current += 1) {
    result *= BigInt(base);
  }

  return result;
};

const countGroupedBookArrangements = (
  totalBooks: number,
  groupedBooks: number,
): bigint => {
  const unitCount = totalBooks - groupedBooks + 1;

  return factorial(unitCount) * factorial(groupedBooks);
};

const countArrayFillingsWithRepetition = (
  elementCount: number,
  arraySize: number,
): bigint => {
  return powerBigInt(elementCount, arraySize);
};

const generatePermutations = (items: string[]): string[][] => {
  const result: string[][] = [];
  const used = new Array(items.length).fill(false);
  const current: string[] = [];

  const backtrack = (): void => {
    if (current.length === items.length) {
      result.push([...current]);
      return;
    }

    for (let index = 0; index < items.length; index += 1) {
      if (used[index]) {
        continue;
      }

      used[index] = true;
      current.push(items[index]);
      backtrack();
      current.pop();
      used[index] = false;
    }
  };

  backtrack();

  return result;
};

const generateLevel3Arrangements = (
  totalBooks: number,
  groupedBooks: number,
): string[][] => {
  const grouped = Array.from(
    { length: groupedBooks },
    (_, index) => `Book${index + 1}`,
  );
  const others = Array.from(
    { length: totalBooks - groupedBooks },
    (_, index) => `Book${groupedBooks + index + 1}`,
  );

  const blockPermutations = generatePermutations(grouped);
  const arrangements: string[][] = [];

  blockPermutations.forEach((blockPermutation) => {
    const units = ['__GROUP__', ...others];
    const unitPermutations = generatePermutations(units);

    unitPermutations.forEach((unitPermutation) => {
      const expanded: string[] = [];

      unitPermutation.forEach((unit) => {
        if (unit === '__GROUP__') {
          expanded.push(...blockPermutation);
          return;
        }

        expanded.push(unit);
      });

      arrangements.push(expanded);
    });
  });

  return arrangements;
};

const saveLevel3Arrangements = (
  filePath: string,
  arrangements: string[][],
): void => {
  const lines = arrangements.map((arrangement, index) => {
    return `${index + 1}. ${arrangement.join(' | ')}`;
  });

  fs.writeFileSync(filePath, lines.join('\n'), 'utf-8');
};

const printHeader = (title: string): void => {
  console.log(`\n${'='.repeat(18)} ${title} ${'='.repeat(18)}`);
};

const readInteger = async (
  readline: ReadlineInterface,
  promptText: string,
  defaultValue: number,
): Promise<number> => {
  const answer = await readline.question(
    `${promptText} [default: ${defaultValue}]: `,
  );

  if (answer.trim() === '') {
    return defaultValue;
  }

  const parsed = Number(answer.trim());

  if (!Number.isInteger(parsed) || parsed <= 0) {
    throw new Error(`Invalid integer value: ${answer}`);
  }

  return parsed;
};

const main = async (): Promise<void> => {
  console.log('Laboratory Work 2.3, Variant 13');

  printHeader('Level 1: Permutations Without Repetition');

  const readline = createInterface({ input, output });

  try {
    const totalBooks = await readInteger(
      readline,
      'Enter total number of books',
      DEFAULT_TOTAL_BOOKS,
    );
    const groupedBooks = await readInteger(
      readline,
      'Enter number of books that must stay together',
      DEFAULT_GROUPED_BOOKS,
    );

    if (groupedBooks > totalBooks) {
      throw new Error(
        'Grouped books count cannot be greater than total books count.',
      );
    }

    const level1Result = countGroupedBookArrangements(totalBooks, groupedBooks);

    console.log(`Total books: ${totalBooks}`);
    console.log(`Grouped books: ${groupedBooks}`);
    console.log(
      `Formula: (${totalBooks} - ${groupedBooks} + 1)! * ${groupedBooks}!`,
    );
    console.log(`Result: ${level1Result.toString()}`);

    printHeader('Level 2: Arrangements With Repetition');
    const level2Result = countArrayFillingsWithRepetition(
      ODD_DIGIT_COUNT,
      ARRAY_SIZE,
    );
    console.log(`Available odd digits: ${ODD_DIGIT_COUNT}`);
    console.log(`Array size: ${ARRAY_SIZE}`);
    console.log(`Formula: ${ODD_DIGIT_COUNT}^${ARRAY_SIZE}`);
    console.log(`Result: ${level2Result.toString()}`);

    printHeader('Level 3: Generation');
    console.log(
      `Generation uses a reduced example: ${GENERATION_TOTAL_BOOKS} books, ${GENERATION_GROUPED_BOOKS} grouped books.`,
    );
    console.log(
      'This reduction is used because generating all variants for 12 books would be too large.',
    );

    const level3Arrangements = generateLevel3Arrangements(
      GENERATION_TOTAL_BOOKS,
      GENERATION_GROUPED_BOOKS,
    );

    saveLevel3Arrangements(OUTPUT_FILE_PATH, level3Arrangements);

    console.log(`Generated arrangements: ${level3Arrangements.length}`);
    console.log(`Saved to: ${OUTPUT_FILE_PATH}`);
  } finally {
    readline.close();
  }
};

main().catch((error: Error) => {
  console.error(`Error: ${error.message}`);
  process.exitCode = 1;
});
