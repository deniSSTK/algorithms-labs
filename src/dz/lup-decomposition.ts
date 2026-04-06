import { EPSILON } from './data';
import { Matrix, Vector } from './types';

export default class LUPDecomposition {
  private readonly sourceMatrix: Matrix;

  private readonly permutation: number[];

  private readonly luMatrix: Matrix;

  constructor(matrix: Matrix) {
    if (
      matrix.length === 0 ||
      matrix.some((row) => row.length !== matrix.length)
    ) {
      throw new Error('LUP decomposition requires a non-empty square matrix.');
    }

    this.sourceMatrix = matrix.map((row) => [...row]);
    this.luMatrix = matrix.map((row) => [...row]);
    this.permutation = Array.from(
      { length: matrix.length },
      (_, index) => index,
    );
  }

  decompose(): void {
    const size = this.luMatrix.length;

    for (let column = 0; column < size; column += 1) {
      let pivotRow = column;
      let pivotValue = Math.abs(this.luMatrix[column][column]);

      for (let row = column + 1; row < size; row += 1) {
        const candidate = Math.abs(this.luMatrix[row][column]);

        if (candidate > pivotValue) {
          pivotValue = candidate;
          pivotRow = row;
        }
      }

      if (pivotValue <= EPSILON) {
        throw new Error(
          'Matrix is singular. Division by zero was avoided by pivoting, but no valid pivot exists.',
        );
      }

      if (pivotRow !== column) {
        [this.luMatrix[column], this.luMatrix[pivotRow]] = [
          this.luMatrix[pivotRow],
          this.luMatrix[column],
        ];
        [this.permutation[column], this.permutation[pivotRow]] = [
          this.permutation[pivotRow],
          this.permutation[column],
        ];
      }

      for (let row = column + 1; row < size; row += 1) {
        this.luMatrix[row][column] /= this.luMatrix[column][column];

        for (
          let innerColumn = column + 1;
          innerColumn < size;
          innerColumn += 1
        ) {
          this.luMatrix[row][innerColumn] -=
            this.luMatrix[row][column] * this.luMatrix[column][innerColumn];
        }
      }
    }
  }

  getL(): Matrix {
    const size = this.luMatrix.length;

    return Array.from({ length: size }, (_, row) =>
      Array.from({ length: size }, (_, column) => {
        if (row === column) {
          return 1;
        }

        if (row > column) {
          return this.luMatrix[row][column];
        }

        return 0;
      }),
    );
  }

  getU(): Matrix {
    const size = this.luMatrix.length;

    return Array.from({ length: size }, (_, row) =>
      Array.from({ length: size }, (_, column) => {
        if (row <= column) {
          return this.luMatrix[row][column];
        }

        return 0;
      }),
    );
  }

  getP(): Matrix {
    const size = this.permutation.length;
    const permutationMatrix = Array.from({ length: size }, () =>
      Array.from({ length: size }, () => 0),
    );

    this.permutation.forEach((column, row) => {
      permutationMatrix[row][column] = 1;
    });

    return permutationMatrix;
  }

  solve(vector: Vector): Vector {
    const size = this.luMatrix.length;

    if (vector.length !== size) {
      throw new Error('Vector size must match matrix dimensions.');
    }

    const permutedVector = this.permutation.map((index) => vector[index]);
    const y = new Array<number>(size).fill(0);
    const x = new Array<number>(size).fill(0);

    for (let row = 0; row < size; row += 1) {
      let sum = permutedVector[row];

      for (let column = 0; column < row; column += 1) {
        sum -= this.luMatrix[row][column] * y[column];
      }

      y[row] = sum;
    }

    for (let row = size - 1; row >= 0; row -= 1) {
      let sum = y[row];

      for (let column = row + 1; column < size; column += 1) {
        sum -= this.luMatrix[row][column] * x[column];
      }

      const pivot = this.luMatrix[row][row];

      if (Math.abs(pivot) <= EPSILON) {
        throw new Error('Matrix is singular during back substitution.');
      }

      x[row] = sum / pivot;
    }

    return x;
  }

  getOriginalMatrix(): Matrix {
    return this.sourceMatrix.map((row) => [...row]);
  }
}
