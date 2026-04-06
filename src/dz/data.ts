import Edge from './edge';
import { Matrix, Vector } from './types';

export const EPSILON = 1e-12;
export const DEFAULT_START_VERTEX = 'Kyiv';

export const matrixA: Matrix = [
  [2, 10, 10],
  [1, 10, 3],
  [3, 10, 10],
];

export const vectorB: Vector = [164, 101, 129];

export const airlineEdges: Edge[] = [
  new Edge('Kyiv', 'Lviv'),
  new Edge('Kyiv', 'Odesa'),
  new Edge('Kyiv', 'Kharkiv'),
  new Edge('Dnipro', 'Lviv'),
  new Edge('Dnipro', 'Odesa'),
  new Edge('Dnipro', 'Kharkiv'),
];
