export default class Student {
  constructor(
    public readonly lastName: string,
    public readonly firstName: string,
    public readonly course: number,
    public readonly studentId: number,
    public readonly scholarship: number,
  ) {}

  get fullName(): string {
    return `${this.lastName} ${this.firstName}`;
  }

  matchesCriterion(): boolean {
    return this.course === 4 && this.scholarship === 0;
  }
}
