export default class Student {
  constructor(
    public readonly lastName: string,
    public readonly firstName: string,
    public readonly course: number,
    public readonly cityCode: number,
    public readonly hasPhone: boolean,
  ) {}

  get fullName(): string {
    return `${this.lastName} ${this.firstName}`;
  }

  toTableRow() {
    return {
      cityCode: this.cityCode,
      fullName: this.fullName,
      course: this.course,
      hasPhone: this.hasPhone,
    };
  }
}
