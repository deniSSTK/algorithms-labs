import Student from './student';
import { createRandomStudents } from './student-generator';
import {
  countingSortByCityCode,
  quickSortByCityCode,
  radixSortByCityCode,
} from './sorting';

const STUDENT_COUNT = 15;

const printHeader = (title: string): void => {
  console.log(`\n${'='.repeat(18)} ${title} ${'='.repeat(18)}`);
};

const printStudents = (label: string, students: Student[]): void => {
  console.log(`\n${label}`);
  console.log('City Code | Last Name | First Name | Phone');

  students.forEach((student) => {
    console.log(student.toDisplayString());
  });
};

const demonstrateSort = (
  title: string,
  sourceStudents: Student[],
  sortFunction: (students: Student[]) => Student[],
): void => {
  printHeader(title);
  printStudents('Before:', sourceStudents);
  printStudents('After:', sortFunction(sourceStudents));
};

const students = createRandomStudents(STUDENT_COUNT);

demonstrateSort('Level 1: Counting Sort', students, countingSortByCityCode);
demonstrateSort('Level 2: Radix Sort', students, radixSortByCityCode);
demonstrateSort('Level 3: Quick Sort', students, quickSortByCityCode);
