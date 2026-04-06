import { Matrix, Vector } from './types';

export const formatNumber = (value: number): string => value.toFixed(2);

export const printSection = (title: string): void => {
  console.log(`\n${'='.repeat(16)} ${title} ${'='.repeat(16)}`);
};

export const printMatrix = (name: string, matrix: Matrix): void => {
  console.log(`${name}:`);

  matrix.forEach((row) => {
    console.log(row.map((value) => formatNumber(value).padStart(8)).join(' '));
  });
};

export const printVector = (name: string, vector: Vector): void => {
  console.log(`${name}: [${vector.map(formatNumber).join(', ')}]`);
};

export const formatEquation = (
  coefficients: Vector,
  value: number,
): string => {
  return coefficients
    .map((coefficient, index) => {
      const variable = `x${index + 1}`;
      const absoluteValue = formatNumber(Math.abs(coefficient));

      if (index === 0) {
        return `${formatNumber(coefficient)}${variable}`;
      }

      const sign = coefficient >= 0 ? '+' : '-';

      return ` ${sign} ${absoluteValue}${variable}`;
    })
    .join('')
    .concat(` = ${formatNumber(value)}`);
};
