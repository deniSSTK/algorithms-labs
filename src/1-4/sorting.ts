import Student from './student';

const MIN_CITY_CODE = 100;
const MAX_CITY_CODE = 999;

export const countingSortByCityCode = (students: Student[]): Student[] => {
  const counts = new Array(MAX_CITY_CODE + 1).fill(0);
  const result = new Array<Student>(students.length);

  students.forEach((student) => {
    counts[student.cityCode] += 1;
  });

  for (let code = MIN_CITY_CODE + 1; code <= MAX_CITY_CODE; code += 1) {
    counts[code] += counts[code - 1];
  }

  for (let index = students.length - 1; index >= 0; index -= 1) {
    const student = students[index];
    counts[student.cityCode] -= 1;
    result[counts[student.cityCode]] = student;
  }

  return result;
};

const countingSortByDigit = (
  students: Student[],
  placeValue: number,
): Student[] => {
  const counts = new Array(10).fill(0);
  const result = new Array<Student>(students.length);

  students.forEach((student) => {
    const digit = Math.floor(student.cityCode / placeValue) % 10;
    counts[digit] += 1;
  });

  for (let digit = 1; digit < 10; digit += 1) {
    counts[digit] += counts[digit - 1];
  }

  for (let index = students.length - 1; index >= 0; index -= 1) {
    const student = students[index];
    const digit = Math.floor(student.cityCode / placeValue) % 10;
    counts[digit] -= 1;
    result[counts[digit]] = student;
  }

  return result;
};

export const radixSortByCityCode = (students: Student[]): Student[] => {
  let result = [...students];

  [1, 10, 100].forEach((placeValue) => {
    result = countingSortByDigit(result, placeValue);
  });

  return result;
};

const quickSortRecursive = (students: Student[]): Student[] => {
  if (students.length <= 1) {
    return [...students];
  }

  const pivot = students[students.length - 1];
  const left: Student[] = [];
  const equal: Student[] = [];
  const right: Student[] = [];

  students.forEach((student) => {
    if (student.cityCode < pivot.cityCode) {
      left.push(student);
      return;
    }

    if (student.cityCode > pivot.cityCode) {
      right.push(student);
      return;
    }

    equal.push(student);
  });

  return [
    ...quickSortRecursive(left),
    ...equal,
    ...quickSortRecursive(right),
  ];
};

export const quickSortByCityCode = (students: Student[]): Student[] => {
  return quickSortRecursive([...students]);
};
