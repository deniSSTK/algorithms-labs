const roundTo = (value: number, digits = 2): number => {
  const factor = 10 ** digits;
  return Math.round(value * factor) / factor;
};

const randomBetween = (min: number, max: number): number => {
  return roundTo(min + Math.random() * (max - min));
};

export default class PolarVector {
  readonly radius: number;
  readonly phi: number;

  constructor(radius?: number, phi?: number) {
    this.radius = radius ?? randomBetween(1, 30);
    this.phi = phi ?? randomBetween(0, 2 * Math.PI);
  }

  getX(): number {
    return roundTo(this.radius * Math.cos(this.phi));
  }

  getY(): number {
    return roundTo(this.radius * Math.sin(this.phi));
  }

  getKey(): number {
    return Math.trunc(this.getX());
  }

  toDisplayString(): string {
    return `r=${this.radius.toFixed(2)}, phi=${this.phi.toFixed(2)} rad, x=${this.getX().toFixed(2)}, y=${this.getY().toFixed(2)}`;
  }
}

export const createRandomPolarVector = (): PolarVector => {
  return new PolarVector();
};
