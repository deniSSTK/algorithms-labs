import Student from './student';

const lastNames = [
  'Shevchenko',
  'Koval',
  'Bondar',
  'Tkachenko',
  'Melnyk',
  'Kravets',
  'Savchuk',
  'Romanenko',
  'Petrenko',
  'Tymoshenko',
  'Boiko',
  'Marchenko',
];

const firstNames = [
  'Andrii',
  'Olena',
  'Maksym',
  'Iryna',
  'Taras',
  'Sofiia',
  'Marta',
  'Denys',
  'Ivan',
  'Nadiia',
  'Oleh',
  'Kateryna',
];

const reusableCityCodes = [101, 205, 333, 404, 512, 640, 777, 888];

const randomItem = <T>(items: T[]): T => {
  return items[Math.floor(Math.random() * items.length)];
};

const randomDigit = (): string => {
  return `${Math.floor(Math.random() * 10)}`;
};

const createPhoneNumber = (): string => {
  return `+380${randomDigit()}${randomDigit()}${randomDigit()}${randomDigit()}${randomDigit()}${randomDigit()}${randomDigit()}${randomDigit()}${randomDigit()}`;
};

const createCityCode = (): number => {
  if (Math.random() < 0.45) {
    return randomItem(reusableCityCodes);
  }

  return 100 + Math.floor(Math.random() * 900);
};

export const createRandomStudents = (count: number): Student[] => {
  return Array.from({ length: count }, () => {
    return new Student(
      randomItem(lastNames),
      randomItem(firstNames),
      createCityCode(),
      createPhoneNumber(),
    );
  });
};
