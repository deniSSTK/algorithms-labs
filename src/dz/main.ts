import {
  createInterface,
  Interface as ReadlineInterface,
} from 'readline/promises';
import { stdin as input, stdout as output } from 'process';
import {
  airlineEdges,
  DEFAULT_START_VERTEX,
  matrixA,
  vectorB,
} from './data';
import Graph from './graph';
import LUPDecomposition from './lup-decomposition';
import {
  formatEquation,
  printMatrix,
  printSection,
  printVector,
} from './output';

const readStartVertex = async (
  readline: ReadlineInterface,
  availableVertices: string[],
): Promise<string> => {
  const prompt =
    `Enter the BFS start vertex [default: ${DEFAULT_START_VERTEX}] ` +
    `from ${availableVertices.join(', ')}: `;

  const answer = await readline.question(prompt);
  const candidate =
    answer.trim() === '' ? DEFAULT_START_VERTEX : answer.trim();

  const normalizedMatch = availableVertices.find(
    (vertex) => vertex.toLowerCase() === candidate.toLowerCase(),
  );

  if (normalizedMatch === undefined) {
    throw new Error(
      `Start vertex must be one of: ${availableVertices.join(', ')}.`,
    );
  }

  return normalizedMatch;
};

const runSlaeLevel = (): void => {
  printSection('Level 1: SLAE via LUP');
  console.log('Initial system:');
  matrixA.forEach((row, index) => {
    console.log(formatEquation(row, vectorB[index]));
  });

  const lup = new LUPDecomposition(matrixA);
  lup.decompose();

  printMatrix('A', lup.getOriginalMatrix());
  printVector('B', vectorB);
  printMatrix('L', lup.getL());
  printMatrix('U', lup.getU());
  printMatrix('P', lup.getP());
  printVector('Solution x', lup.solve(vectorB));
};

const runGraphLevel = async (): Promise<void> => {
  printSection('Level 2: Graph BFS');
  console.log(
    'Airline network: each city is connected to no more than 3 others, and every city is reachable with at most one transfer.',
  );

  const graph = new Graph(airlineEdges);
  graph.printEdgeList();

  const readline = createInterface({ input, output });

  try {
    const startVertex = await readStartVertex(readline, graph.getVertices());
    const traversal = graph.bfs(startVertex);

    console.log(`Start vertex: ${startVertex}`);
    console.log(`BFS traversal order: ${traversal.join(' -> ')}`);
  } finally {
    readline.close();
  }
};

const main = async (): Promise<void> => {
  console.log('Homework Assignment, Variant 13');

  runSlaeLevel();
  await runGraphLevel();
};

void main().catch((error: unknown) => {
  const message = error instanceof Error ? error.message : String(error);
  console.error(`Error: ${message}`);
  process.exitCode = 1;
});
