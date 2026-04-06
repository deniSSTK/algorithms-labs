import * as fs from 'fs';
import * as path from 'path';
import { validateWithSwitch, validateWithTransitionTable } from './fsm';

const level1Pattern = /^\^[A-Z]+\^\*\^[A-Z]+\^$/;

const getArgumentValue = (name: string, fallback: string): string => {
  const argument = process.argv.find((item: string) =>
    item.startsWith(`--${name}=`),
  );

  if (!argument) {
    return fallback;
  }

  return argument.split('=')[1];
};

const level1FilePath = getArgumentValue(
  'level1File',
  path.join(process.cwd(), 'src/2-2/level1-words.txt'),
);
const level3FilePath = getArgumentValue(
  'level3File',
  path.join(process.cwd(), 'src/2-2/level3-text.txt'),
);
const keyboardWord = getArgumentValue('word', '^ABC^*^test^');

const printHeader = (title: string): void => {
  console.log(`\n${'='.repeat(18)} ${title} ${'='.repeat(18)}`);
};

const printStatusRows = (
  title: string,
  rows: Array<{ word: string; status: string }>,
): void => {
  console.log(`\n${title}`);
  console.log('Word | Status');

  rows.forEach((row) => {
    console.log(`${row.word} | ${row.status}`);
  });
};

const readWordsForLevel1 = (filePath: string): string[] => {
  const content = fs.readFileSync(filePath, 'utf-8');

  return content
    .split(/\s+/)
    .map((word: string) => word.trim())
    .filter((word: string) => word.length > 0);
};

const readWordsForLevel3 = (filePath: string): string[] => {
  const content = fs.readFileSync(filePath, 'utf-8');

  return content
    .split(/[{}!\s]+/)
    .map((word: string) => word.trim())
    .filter((word: string) => word.length > 0);
};

const runLevel1 = (): void => {
  printHeader('Level 1: Regex Search');
  console.log(`Source file: ${level1FilePath}`);
  console.log(`Pattern: ${level1Pattern}`);

  const words = readWordsForLevel1(level1FilePath);
  const rows = words.map((word) => ({
    word,
    status: level1Pattern.test(word) ? 'Valid' : 'Invalid',
  }));

  printStatusRows('Regex analysis result:', rows);
};

const runLevel2 = (): void => {
  printHeader('Level 2: Finite Automaton With Switch');
  console.log(`Input word: ${keyboardWord}`);
  console.log(
    'States: START -> FIRST_PART -> AFTER_FIRST_PART -> AFTER_ASTERISK -> SECOND_PART -> ACCEPT',
  );

  const isValid = validateWithSwitch(keyboardWord);
  printStatusRows('FSM result for entered word:', [
    { word: keyboardWord, status: isValid ? 'Valid' : 'Invalid' },
  ]);
};

const runLevel3 = (): void => {
  printHeader('Level 3: Transition Table');
  console.log(`Source file: ${level3FilePath}`);
  console.log('Separators for file splitting: {, }, !');

  const words = readWordsForLevel3(level3FilePath);
  const rows = words.map((word) => ({
    word,
    status: validateWithTransitionTable(word) ? 'Valid' : 'Invalid',
  }));

  printStatusRows('Transition table analysis result:', rows);
};

console.log('Laboratory Work 2.2, Variant 13');
console.log(
  'Run with custom parameters: npm run run:2-2 -- --word="^ABC^*^test^" --level1File=/path/file.txt --level3File=/path/file.txt',
);

runLevel1();
runLevel2();
runLevel3();
