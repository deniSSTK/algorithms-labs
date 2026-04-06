import Edge from './edge';

export default class Graph {
  private readonly adjacency = new Map<string, string[]>();

  constructor(private readonly edges: Edge[]) {
    for (const edge of edges) {
      this.addEdge(edge.from, edge.to);
      this.addEdge(edge.to, edge.from);
    }

    this.validateDegreeConstraint();
    this.validateTransferConstraint();
  }

  getVertices(): string[] {
    return Array.from(this.adjacency.keys()).sort();
  }

  printEdgeList(): void {
    console.log('Edge list:');
    this.edges.forEach((edge, index) => {
      console.log(`${index + 1}. ${edge.from} <-> ${edge.to}`);
    });
  }

  bfs(startVertex: string): string[] {
    if (!this.adjacency.has(startVertex)) {
      throw new Error(`Unknown start vertex: ${startVertex}`);
    }

    const visited = new Set<string>([startVertex]);
    const queue: string[] = [startVertex];
    const order: string[] = [];

    while (queue.length > 0) {
      const current = queue.shift();

      if (current === undefined) {
        continue;
      }

      order.push(current);

      for (const neighbor of this.adjacency.get(current) ?? []) {
        if (visited.has(neighbor)) {
          continue;
        }

        visited.add(neighbor);
        queue.push(neighbor);
      }
    }

    return order;
  }

  private addEdge(from: string, to: string): void {
    const neighbors = this.adjacency.get(from) ?? [];

    neighbors.push(to);
    neighbors.sort();
    this.adjacency.set(from, neighbors);
  }

  private validateDegreeConstraint(): void {
    for (const [vertex, neighbors] of this.adjacency.entries()) {
      if (neighbors.length > 3) {
        throw new Error(
          `Vertex ${vertex} violates the assignment constraint: degree ${neighbors.length} > 3.`,
        );
      }
    }
  }

  private validateTransferConstraint(): void {
    for (const vertex of this.getVertices()) {
      const distances = this.getDistancesFrom(vertex);

      for (const [target, distance] of distances.entries()) {
        if (vertex !== target && distance > 2) {
          throw new Error(
            `Vertices ${vertex} and ${target} require more than one transfer.`,
          );
        }
      }

      if (distances.size !== this.adjacency.size) {
        throw new Error(`Graph is disconnected from start vertex ${vertex}.`);
      }
    }
  }

  private getDistancesFrom(startVertex: string): Map<string, number> {
    const distances = new Map<string, number>([[startVertex, 0]]);
    const queue: string[] = [startVertex];

    while (queue.length > 0) {
      const current = queue.shift();

      if (current === undefined) {
        continue;
      }

      const currentDistance = distances.get(current) ?? 0;

      for (const neighbor of this.adjacency.get(current) ?? []) {
        if (distances.has(neighbor)) {
          continue;
        }

        distances.set(neighbor, currentDistance + 1);
        queue.push(neighbor);
      }
    }

    return distances;
  }
}
