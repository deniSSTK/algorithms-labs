export enum State {
  START = 'START',
  FIRST_PART = 'FIRST_PART',
  AFTER_FIRST_PART = 'AFTER_FIRST_PART',
  AFTER_ASTERISK = 'AFTER_ASTERISK',
  SECOND_PART = 'SECOND_PART',
  ACCEPT = 'ACCEPT',
  ERROR = 'ERROR',
}

enum CharType {
  CARET = 'CARET',
  ASTERISK = 'ASTERISK',
  UPPERCASE = 'UPPERCASE',
  SECOND_PART_CHAR = 'SECOND_PART_CHAR',
  OTHER = 'OTHER',
}

const isUppercaseLetter = (char: string): boolean => {
  return /^[A-Z]$/.test(char);
};

const isDigit = (char: string): boolean => {
  return /^\d$/.test(char);
};

const isSecondPartChar = (char: string): boolean => {
  return !isUppercaseLetter(char) && !isDigit(char) && char !== '^';
};

const getCharType = (char: string): CharType => {
  if (char === '^') {
    return CharType.CARET;
  }

  if (char === '*') {
    return CharType.ASTERISK;
  }

  if (isUppercaseLetter(char)) {
    return CharType.UPPERCASE;
  }

  if (isSecondPartChar(char)) {
    return CharType.SECOND_PART_CHAR;
  }

  return CharType.OTHER;
};

const transitionTable: Record<State, Partial<Record<CharType, State>>> = {
  [State.START]: {
    [CharType.CARET]: State.FIRST_PART,
  },
  [State.FIRST_PART]: {
    [CharType.UPPERCASE]: State.FIRST_PART,
    [CharType.CARET]: State.AFTER_FIRST_PART,
  },
  [State.AFTER_FIRST_PART]: {
    [CharType.ASTERISK]: State.AFTER_ASTERISK,
  },
  [State.AFTER_ASTERISK]: {
    [CharType.CARET]: State.SECOND_PART,
  },
  [State.SECOND_PART]: {
    [CharType.SECOND_PART_CHAR]: State.SECOND_PART,
    [CharType.ASTERISK]: State.SECOND_PART,
    [CharType.CARET]: State.ACCEPT,
  },
  [State.ACCEPT]: {},
  [State.ERROR]: {},
};

export const validateWithSwitch = (word: string): boolean => {
  let state = State.START;
  let firstPartLength = 0;
  let secondPartLength = 0;

  for (const char of word) {
    switch (state) {
      // START: the word must begin with '^'
      case State.START:
        state = char === '^' ? State.FIRST_PART : State.ERROR;
        break;

      // FIRST_PART: read one or more uppercase letters from the first part
      case State.FIRST_PART:
        if (isUppercaseLetter(char)) {
          firstPartLength += 1;
        } else if (char === '^' && firstPartLength > 0) {
          state = State.AFTER_FIRST_PART;
        } else {
          state = State.ERROR;
        }
        break;

      // AFTER_FIRST_PART: only '*' is allowed after the closing caret
      case State.AFTER_FIRST_PART:
        state = char === '*' ? State.AFTER_ASTERISK : State.ERROR;
        break;

      // AFTER_ASTERISK: the second part must start with '^'
      case State.AFTER_ASTERISK:
        state = char === '^' ? State.SECOND_PART : State.ERROR;
        break;

      // SECOND_PART: read one or more non-uppercase, non-digit, non-caret chars
      case State.SECOND_PART:
        if (isSecondPartChar(char)) {
          secondPartLength += 1;
        } else if (char === '*' && secondPartLength > 0) {
          secondPartLength += 1;
        } else if (char === '^' && secondPartLength > 0) {
          state = State.ACCEPT;
        } else {
          state = State.ERROR;
        }
        break;

      case State.ACCEPT:
        state = State.ERROR;
        break;

      default:
        state = State.ERROR;
        break;
    }

    if (state === State.ERROR) {
      return false;
    }
  }

  return state === State.ACCEPT;
};

export const validateWithTransitionTable = (word: string): boolean => {
  let state = State.START;
  let firstPartLength = 0;
  let secondPartLength = 0;

  for (const char of word) {
    const charType = getCharType(char);

    if (state === State.FIRST_PART && charType === CharType.UPPERCASE) {
      firstPartLength += 1;
    }

    if (
      state === State.SECOND_PART &&
      (charType === CharType.SECOND_PART_CHAR || charType === CharType.ASTERISK)
    ) {
      secondPartLength += 1;
    }

    if (
      state === State.FIRST_PART &&
      charType === CharType.CARET &&
      firstPartLength === 0
    ) {
      return false;
    }

    if (
      state === State.SECOND_PART &&
      charType === CharType.CARET &&
      secondPartLength === 0
    ) {
      return false;
    }

    state = transitionTable[state][charType] ?? State.ERROR;

    if (state === State.ERROR) {
      return false;
    }
  }

  return state === State.ACCEPT;
};
