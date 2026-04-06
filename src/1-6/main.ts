type SizeBenchmarkRow = {
  size: number;
  quickSortBasicNs: number;
  quickSortMedianNs: number;
  runs: number;
};

type InputBenchmarkRow = {
  inputType: string;
  quickSortBasicNs: number;
  quickSortMedianNs: number;
};

type BenchmarkPairResult = {
  quickSortBasicNs: number;
  quickSortMedianNs: number;
};

const PREFERRED_LARGE_SIZE = 1_000_000;
const FALLBACK_LARGE_SIZE = 100_000;
const INPUT_ANALYSIS_SIZE = 10_000;

const getTimeNs = (): number => {
  return Number(process.hrtime.bigint());
};

const swap = (
  array: number[],
  firstIndex: number,
  secondIndex: number,
): void => {
  const temp = array[firstIndex];
  array[firstIndex] = array[secondIndex];
  array[secondIndex] = temp;
};

const partitionWithLastPivot = (
  array: number[],
  low: number,
  high: number,
): number => {
  const pivot = array[high];
  let smallerIndex = low - 1;

  for (let current = low; current < high; current += 1) {
    if (array[current] <= pivot) {
      smallerIndex += 1;
      swap(array, smallerIndex, current);
    }
  }

  swap(array, smallerIndex + 1, high);
  return smallerIndex + 1;
};

const chooseMedianOfThreePivotIndex = (
  array: number[],
  low: number,
  high: number,
): number => {
  const middle = Math.floor((low + high) / 2);
  const first = array[low];
  const second = array[middle];
  const third = array[high];

  if (
    (first <= second && second <= third) ||
    (third <= second && second <= first)
  ) {
    return middle;
  }

  if (
    (second <= first && first <= third) ||
    (third <= first && first <= second)
  ) {
    return low;
  }

  return high;
};

const partitionWithMedianPivot = (
  array: number[],
  low: number,
  high: number,
): number => {
  const pivotIndex = chooseMedianOfThreePivotIndex(array, low, high);
  swap(array, pivotIndex, high);

  return partitionWithLastPivot(array, low, high);
};

const quickSortIterative = (
  sourceArray: number[],
  partition: (array: number[], low: number, high: number) => number,
): number[] => {
  const array = [...sourceArray];

  if (array.length <= 1) {
    return array;
  }

  const stack: Array<[number, number]> = [[0, array.length - 1]];

  while (stack.length > 0) {
    const currentRange = stack.pop();

    if (!currentRange) {
      continue;
    }

    const [low, high] = currentRange;

    if (low >= high) {
      continue;
    }

    const pivotIndex = partition(array, low, high);
    const leftSize = pivotIndex - 1 - low;
    const rightSize = high - (pivotIndex + 1);

    if (leftSize > rightSize) {
      stack.push([low, pivotIndex - 1]);
      stack.push([pivotIndex + 1, high]);
    } else {
      stack.push([pivotIndex + 1, high]);
      stack.push([low, pivotIndex - 1]);
    }
  }

  return array;
};

const quickSortBasic = (array: number[]): number[] => {
  return quickSortIterative(array, partitionWithLastPivot);
};

const quickSortMedian = (array: number[]): number[] => {
  return quickSortIterative(array, partitionWithMedianPivot);
};

const generateRandomArray = (size: number): number[] => {
  return Array.from({ length: size }, () =>
    Math.floor(Math.random() * 1_000_000),
  );
};

const generateSortedArray = (size: number): number[] => {
  return Array.from({ length: size }, (_, index) => index);
};

const generateReverseSortedArray = (size: number): number[] => {
  return Array.from({ length: size }, (_, index) => size - index);
};

const benchmarkSortPair = (
  generator: () => number[],
  runs: number,
): BenchmarkPairResult => {
  let basicTotalTime = 0;
  let medianTotalTime = 0;

  for (let run = 0; run < runs; run += 1) {
    const source = generator();

    const basicStart = getTimeNs();
    quickSortBasic(source);
    const basicEnd = getTimeNs();
    basicTotalTime += basicEnd - basicStart;

    const medianStart = getTimeNs();
    quickSortMedian(source);
    const medianEnd = getTimeNs();
    medianTotalTime += medianEnd - medianStart;
  }

  return {
    quickSortBasicNs: Math.round(basicTotalTime / runs),
    quickSortMedianNs: Math.round(medianTotalTime / runs),
  };
};

const benchmarkSizes = (sizes: number[]): SizeBenchmarkRow[] => {
  return sizes.map((size) => {
    const runs =
      size >= 1_000_000 ? 1 : size >= 100_000 ? 3 : size >= 10_000 ? 5 : 20;
    const benchmark = benchmarkSortPair(() => generateRandomArray(size), runs);

    return {
      size,
      quickSortBasicNs: benchmark.quickSortBasicNs,
      quickSortMedianNs: benchmark.quickSortMedianNs,
      runs,
    };
  });
};

const benchmarkInputTypes = (size: number): InputBenchmarkRow[] => {
  const scenarios = [
    { inputType: 'Sorted', generator: () => generateSortedArray(size) },
    {
      inputType: 'Reverse Sorted',
      generator: () => generateReverseSortedArray(size),
    },
    { inputType: 'Random', generator: () => generateRandomArray(size) },
  ];

  return scenarios.map((scenario) => {
    const benchmark = benchmarkSortPair(scenario.generator, 3);

    return {
      inputType: scenario.inputType,
      quickSortBasicNs: benchmark.quickSortBasicNs,
      quickSortMedianNs: benchmark.quickSortMedianNs,
    };
  });
};

const printHeader = (title: string): void => {
  console.log(`\n${'='.repeat(18)} ${title} ${'='.repeat(18)}`);
};

const printSizeResults = (rows: SizeBenchmarkRow[]): void => {
  console.table(
    rows.map((row) => ({
      Size: row.size,
      'QuickSortBasic (ns)': row.quickSortBasicNs,
      'QuickSortMedian (ns)': row.quickSortMedianNs,
      Runs: row.runs,
    })),
  );
};

const printInputResults = (rows: InputBenchmarkRow[]): void => {
  console.table(
    rows.map((row) => ({
      Input: row.inputType,
      'QuickSortBasic (ns)': row.quickSortBasicNs,
      'QuickSortMedian (ns)': row.quickSortMedianNs,
    })),
  );
};

const printExcelRowsForSizes = (rows: SizeBenchmarkRow[]): void => {
  console.log('Size\tQuickSortBasic (ns)\tQuickSortMedian (ns)');

  rows.forEach((row) => {
    console.log(
      `${row.size}\t${row.quickSortBasicNs}\t${row.quickSortMedianNs}`,
    );
  });
};

const printExcelRowsForInputs = (rows: InputBenchmarkRow[]): void => {
  console.log('Input Type\tQuickSortBasic (ns)\tQuickSortMedian (ns)');

  rows.forEach((row) => {
    console.log(
      `${row.inputType}\t${row.quickSortBasicNs}\t${row.quickSortMedianNs}`,
    );
  });
};

const determineLargeSize = (): number => {
  try {
    generateRandomArray(PREFERRED_LARGE_SIZE);
    return PREFERRED_LARGE_SIZE;
  } catch {
    return FALLBACK_LARGE_SIZE;
  }
};

const largeSize = determineLargeSize();
const level1Sizes = [100, 10_000, largeSize];
const level1Results = benchmarkSizes(level1Sizes);
const level3Results = benchmarkInputTypes(INPUT_ANALYSIS_SIZE);

printHeader('Level 1: Average Time By Array Size');
printSizeResults(level1Results);

printHeader('Level 2: Excel Output For Size Benchmarks');
printExcelRowsForSizes(level1Results);

printHeader('Level 3: Input Structure Analysis');
printInputResults(level3Results);
console.log('\nExcel-friendly rows for Level 3:');
printExcelRowsForInputs(level3Results);
