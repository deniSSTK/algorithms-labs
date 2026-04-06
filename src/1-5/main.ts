import RootInsertionBST from './root-insertion-bst';
import Student from './student';

const TARGET_CITY_CODE = 32;
const STUDENT_COUNT = 22;

const lastNames = [
  'Shevchenko',
  'Koval',
  'Bondar',
  'Tkachenko',
  'Melnyk',
  'Kravets',
  'Savchuk',
  'Romanenko',
  'Petrenko',
  'Boiko',
  'Marchenko',
  'Klymenko',
];

const firstNames = [
  'Andrii',
  'Olena',
  'Maksym',
  'Iryna',
  'Taras',
  'Sofiia',
  'Marta',
  'Denys',
  'Ivan',
  'Nadiia',
  'Oleh',
  'Kateryna',
];

const randomItem = <T>(items: T[]): T => {
  return items[Math.floor(Math.random() * items.length)];
};

const createOrderedStudents = (): Student[] => {
  const seededStudents: Student[] = [
    new Student('Lvivska', 'Anna', 1, TARGET_CITY_CODE, false),
    new Student('Lvivskyi', 'Maksym', 1, TARGET_CITY_CODE, false),
    new Student('Lvivenko', 'Ihor', 1, TARGET_CITY_CODE, true),
    new Student('Romanenko', 'Denys', 2, 118, true),
    new Student('Koval', 'Olena', 3, 145, false),
    new Student('Savchuk', 'Marta', 1, 167, true),
    new Student('Bondar', 'Iryna', 4, 201, true),
    new Student('Shevchenko', 'Taras', 2, 224, false),
  ];

  while (seededStudents.length < STUDENT_COUNT) {
    seededStudents.push(
      new Student(
        randomItem(lastNames),
        randomItem(firstNames),
        1 + Math.floor(Math.random() * 4),
        100 + Math.floor(Math.random() * 900),
        Math.random() < 0.65,
      ),
    );
  }

  return seededStudents.sort((first, second) => first.cityCode - second.cityCode);
};

const printHeader = (title: string): void => {
  console.log(`\n${'='.repeat(18)} ${title} ${'='.repeat(18)}`);
};

const printStudentsTable = (title: string, students: Student[]): void => {
  console.log(`\n${title}`);
  console.table(students.map((student) => student.toTableRow()));
};

const sequentialDelete = (students: Student[]): { result: Student[]; deleted: number } => {
  const result: Student[] = [];
  let deleted = 0;

  students.forEach((student) => {
    const shouldDelete =
      student.course === 1 &&
      student.cityCode === TARGET_CITY_CODE &&
      student.hasPhone === false;

    if (shouldDelete) {
      deleted += 1;
      return;
    }

    result.push(student);
  });

  return { result, deleted };
};

const printTreeState = (tree: RootInsertionBST, title: string): void => {
  console.log(`\n${title}`);

  const rows = tree.getBreadthFirstRows();

  if (rows.length === 0) {
    console.log('[empty]');
    return;
  }

  console.table(rows);
};

const level1Students = createOrderedStudents();

printHeader('Level 1: Sequential Search In Array');
printStudentsTable('Array before deletion:', level1Students);

const level1Result = sequentialDelete(level1Students);

console.log(
  `Deleted students where course === 1, cityCode === ${TARGET_CITY_CODE}, hasPhone === false: ${level1Result.deleted}`,
);
printStudentsTable('Array after deletion:', level1Result.result);

printHeader('Level 2: BST With Root Insertion');

const tree = new RootInsertionBST();
const treeStudents: Student[] = [
  new Student('Shevchenko', 'Olena', 2, 410, true),
  new Student('Koval', 'Andrii', 1, 190, false),
  new Student('Bondar', 'Iryna', 3, 560, true),
  new Student('Melnyk', 'Taras', 4, 120, true),
  new Student('Savchuk', 'Marta', 2, 330, false),
  new Student('Romanenko', 'Denys', 1, 470, true),
  new Student('Petrenko', 'Ivan', 4, 250, false),
];

treeStudents.forEach((student, index) => {
  tree.insertAtRoot(student);
  console.log(
    `After insertion ${index + 1}: ${student.fullName} with cityCode=${student.cityCode}`,
  );
  printTreeState(tree, 'Current tree (BFS):');
});

printHeader('Level 3: Tree Balancing');
printTreeState(tree, 'Tree before balancing:');

tree.balance();

printTreeState(tree, 'Balanced tree (BFS):');

const searchCityCode = 330;
const searchResult = tree.searchByCityCode(searchCityCode);

console.log(`\nSearch in balanced tree by cityCode=${searchCityCode}:`);

if (searchResult.length === 0) {
  console.log('Not found');
} else {
  console.table(searchResult.map((student) => student.toTableRow()));
}
