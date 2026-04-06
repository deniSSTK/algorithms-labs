export default class Student {
  constructor(
    public readonly lastName: string,
    public readonly firstName: string,
    public readonly cityCode: number,
    public readonly phoneNumber: string,
  ) {}

  toDisplayString(): string {
    return `${this.cityCode} | ${this.lastName} | ${this.firstName} | ${this.phoneNumber}`;
  }
}
