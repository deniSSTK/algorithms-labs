import Student from './student';

export default class TreeNode {
  left: TreeNode | null = null;
  right: TreeNode | null = null;

  constructor(public data: Student) {}
}
