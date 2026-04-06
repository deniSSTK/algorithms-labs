import Student from './student';
import TreeNode from './tree-node';

export default class BinaryTree {
  private root: TreeNode | null = null;

  insert(student: Student): boolean {
    if (!this.root) {
      this.root = new TreeNode(student);
      return true;
    }

    let current = this.root;

    while (current) {
      if (student.studentId === current.data.studentId) {
        return false;
      }

      if (student.studentId < current.data.studentId) {
        if (!current.left) {
          current.left = new TreeNode(student);
          return true;
        }

        current = current.left;
        continue;
      }

      if (!current.right) {
        current.right = new TreeNode(student);
        return true;
      }

      current = current.right;
    }

    return false;
  }

  printInOrder(title: string): void {
    console.log(`\n${title}`);
    console.log('ID | Full Name | Course | Scholarship');

    const students = this.getInOrderStudents();

    if (students.length === 0) {
      console.log('[empty]');
      return;
    }

    students.forEach((student) => {
      console.log(
        `${student.studentId} | ${student.fullName} | ${student.course} | ${student.scholarship}`,
      );
    });
  }

  searchByCriterion(): Student[] {
    const matches: Student[] = [];

    this.traverseInOrder(this.root, (student) => {
      if (student.matchesCriterion()) {
        matches.push(student);
      }
    });

    return matches;
  }

  deleteByCriterion(): Student[] {
    const studentsToDelete = this.searchByCriterion();

    studentsToDelete.forEach((student) => {
      this.root = this.deleteNode(this.root, student.studentId);
    });

    return studentsToDelete;
  }

  private getInOrderStudents(): Student[] {
    const students: Student[] = [];

    this.traverseInOrder(this.root, (student) => {
      students.push(student);
    });

    return students;
  }

  private traverseInOrder(
    node: TreeNode | null,
    callback: (student: Student) => void,
  ): void {
    if (!node) {
      return;
    }

    this.traverseInOrder(node.left, callback);
    callback(node.data);
    this.traverseInOrder(node.right, callback);
  }

  private deleteNode(
    node: TreeNode | null,
    studentId: number,
  ): TreeNode | null {
    if (!node) {
      return null;
    }

    if (studentId < node.data.studentId) {
      node.left = this.deleteNode(node.left, studentId);
      return node;
    }

    if (studentId > node.data.studentId) {
      node.right = this.deleteNode(node.right, studentId);
      return node;
    }

    if (!node.left && !node.right) {
      return null;
    }

    if (!node.left) {
      return node.right;
    }

    if (!node.right) {
      return node.left;
    }

    const successor = this.findMin(node.right);
    node.data = successor.data;
    node.right = this.deleteNode(node.right, successor.data.studentId);

    return node;
  }

  private findMin(node: TreeNode): TreeNode {
    let current = node;

    while (current.left) {
      current = current.left;
    }

    return current;
  }
}
