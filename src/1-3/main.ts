import BinaryTree from './binary-tree';
import Student from './student';

const students: Student[] = [
  new Student('Koval', 'Andrii', 3, 50, 1400),
  new Student('Shevchenko', 'Olena', 4, 30, 0),
  new Student('Melnyk', 'Taras', 2, 70, 1200),
  new Student('Bondar', 'Iryna', 4, 20, 0),
  new Student('Tkachenko', 'Maksym', 4, 40, 1600),
  new Student('Kravets', 'Sofiia', 4, 60, 0),
  new Student('Romanenko', 'Denys', 2, 65, 1300),
  new Student('Savchuk', 'Marta', 1, 80, 900),
];

const duplicateStudent = new Student('Duplicate', 'Student', 1, 50, 1000);

const printMatches = (title: string, matches: Student[]): void => {
  console.log(`\n${title}`);
  console.log('ID | Full Name | Course | Scholarship');

  if (matches.length === 0) {
    console.log('Not found');
    return;
  }

  matches.forEach((student) => {
    console.log(
      `${student.studentId} | ${student.fullName} | ${student.course} | ${student.scholarship}`,
    );
  });
};

const printDivider = (title: string): void => {
  console.log(`\n${'='.repeat(18)} ${title} ${'='.repeat(18)}`);
};

const tree = new BinaryTree();

printDivider('Level 1');

students.forEach((student) => {
  const inserted = tree.insert(student);

  console.log(
    `Insert ID=${student.studentId}, ${student.fullName}: ${inserted ? 'success' : 'failed'}`,
  );
});

const duplicateInserted = tree.insert(duplicateStudent);
console.log(
  `Insert duplicate ID=${duplicateStudent.studentId}, ${duplicateStudent.fullName}: ${duplicateInserted ? 'success' : 'failed'}`,
);

tree.printInOrder('Tree after insertion (in-order traversal):');

printDivider('Level 2');

const foundStudents = tree.searchByCriterion();
printMatches(
  'Students from 4th course with zero scholarship:',
  foundStudents,
);

printDivider('Level 3');

tree.printInOrder('Tree before deletion:');

const deletedStudents = tree.deleteByCriterion();
printMatches('Deleted students:', deletedStudents);

tree.printInOrder('Tree after deletion:');
