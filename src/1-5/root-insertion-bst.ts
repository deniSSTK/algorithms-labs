import Student from './student';
import TreeNode from './tree-node';

type BfsRow = {
  level: number;
  position: string;
  cityCode: number;
  fullName: string;
  course: number;
  hasPhone: boolean;
};

export default class RootInsertionBST {
  private root: TreeNode | null = null;

  getRoot(): TreeNode | null {
    return this.root;
  }

  insertAtRoot(student: Student): void {
    this.root = this.insertNodeAtRoot(this.root, student);
  }

  rotateLeft(node: TreeNode): TreeNode {
    const newRoot = node.right;

    if (!newRoot) {
      return node;
    }

    node.right = newRoot.left;
    newRoot.left = node;

    return newRoot;
  }

  rotateRight(node: TreeNode): TreeNode {
    const newRoot = node.left;

    if (!newRoot) {
      return node;
    }

    node.left = newRoot.right;
    newRoot.right = node;

    return newRoot;
  }

  searchByCityCode(cityCode: number): Student[] {
    const matches: Student[] = [];

    this.collectByCityCode(this.root, cityCode, matches);

    return matches;
  }

  balance(): void {
    const students = this.inOrderTraversal();
    this.root = this.buildBalancedTree(students, 0, students.length - 1);
  }

  getBreadthFirstRows(): BfsRow[] {
    if (!this.root) {
      return [];
    }

    const rows: BfsRow[] = [];
    const queue: Array<{ node: TreeNode; level: number; position: string }> = [
      { node: this.root, level: 0, position: 'root' },
    ];

    while (queue.length > 0) {
      const current = queue.shift();

      if (!current) {
        continue;
      }

      rows.push({
        level: current.level,
        position: current.position,
        cityCode: current.node.data.cityCode,
        fullName: current.node.data.fullName,
        course: current.node.data.course,
        hasPhone: current.node.data.hasPhone,
      });

      if (current.node.left) {
        queue.push({
          node: current.node.left,
          level: current.level + 1,
          position: `${current.position}.L`,
        });
      }

      if (current.node.right) {
        queue.push({
          node: current.node.right,
          level: current.level + 1,
          position: `${current.position}.R`,
        });
      }
    }

    return rows;
  }

  private insertNodeAtRoot(node: TreeNode | null, student: Student): TreeNode {
    if (!node) {
      return new TreeNode(student);
    }

    if (student.cityCode < node.data.cityCode) {
      node.left = this.insertNodeAtRoot(node.left, student);
      return this.rotateRight(node);
    }

    node.right = this.insertNodeAtRoot(node.right, student);
    return this.rotateLeft(node);
  }

  private collectByCityCode(
    node: TreeNode | null,
    cityCode: number,
    matches: Student[],
  ): void {
    if (!node) {
      return;
    }

    if (cityCode < node.data.cityCode) {
      this.collectByCityCode(node.left, cityCode, matches);
      return;
    }

    if (cityCode > node.data.cityCode) {
      this.collectByCityCode(node.right, cityCode, matches);
      return;
    }

    matches.push(node.data);
    this.collectByCityCode(node.left, cityCode, matches);
    this.collectByCityCode(node.right, cityCode, matches);
  }

  private inOrderTraversal(): Student[] {
    const result: Student[] = [];

    const traverse = (node: TreeNode | null): void => {
      if (!node) {
        return;
      }

      traverse(node.left);
      result.push(node.data);
      traverse(node.right);
    };

    traverse(this.root);

    return result;
  }

  private buildBalancedTree(
    students: Student[],
    start: number,
    end: number,
  ): TreeNode | null {
    if (start > end) {
      return null;
    }

    const middle = Math.floor((start + end) / 2);
    const node = new TreeNode(students[middle]);

    node.left = this.buildBalancedTree(students, start, middle - 1);
    node.right = this.buildBalancedTree(students, middle + 1, end);

    return node;
  }
}
