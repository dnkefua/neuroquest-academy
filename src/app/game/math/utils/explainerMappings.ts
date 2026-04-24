'use client';

import type { MathExplainerConcept } from '@/components/explainer/MathExplainer';
import type { Question } from '../store/gameStore';

type MathExplainerValues = {
  startValue?: number;
  moveValue?: number;
  moveValue2?: number;
  numerator?: number;
  denominator?: number;
  operands?: [number, number];
  ratioParts?: [number, number];
  total?: number;
  sideA?: number;
  sideB?: number;
  sideC?: number;
  coefficient?: number;
  constant?: number;
  result?: number;
  solution?: number;
  displayValue?: string;
  exponent?: number;
};

function getQuestionText(question: Question): string {
  return [
    question.question,
    question.narrative,
    question.equation,
    question.options.join(' '),
    question.clue.title,
    question.clue.example,
  ]
    .filter(Boolean)
    .join(' ')
    .toLowerCase();
}

function extractNumbers(input: string): number[] {
  return (input.match(/-?\d+(?:\.\d+)?/g) || [])
    .map(Number)
    .filter((value) => Number.isFinite(value));
}

function asOperandPair(values: number[], fallback: [number, number] = [0, 0]): [number, number] {
  return [values[0] ?? fallback[0], values[1] ?? fallback[1]];
}

function getOperands(question: Question): [number, number] {
  const values = extractNumbers(`${question.equation || ''} ${question.question}`);
  const first = values[0] ?? 0;
  const second = values[1] ?? (question.clue.moveValue ?? 0);
  return [first, second === 0 && (question.equation || '').includes('/') ? 1 : second];
}

function parseCoefficient(raw: string | undefined): number {
  if (!raw || raw === '+') return 1;
  if (raw === '-') return -1;
  const parsed = Number(raw);
  return Number.isFinite(parsed) ? parsed : 1;
}

function inferRatioValues(question: Question): MathExplainerValues {
  const source = `${question.question} ${question.narrative} ${question.equation || ''} ${question.clue.example}`;
  const ratioMatch = source.match(/(\d+(?:\.\d+)?)\s*:\s*(\d+(?:\.\d+)?)/);
  const numbers = extractNumbers(source).filter((value) => value > 0);
  const first = ratioMatch ? Number(ratioMatch[1]) : numbers[0] ?? 3;
  const second = ratioMatch ? Number(ratioMatch[2]) : numbers[1] ?? 5;
  const totalMatch = source.match(/total\D{0,16}(\d+(?:\.\d+)?)/i);
  const total = Number(totalMatch?.[1] ?? numbers.find((value) => value > first + second) ?? 40);

  return {
    ratioParts: [first, second],
    total,
    operands: [first, second],
  };
}

function inferEquationValues(question: Question): MathExplainerValues {
  const source = `${question.equation || ''} ${question.question} ${question.clue.example}`;
  const compact = (question.equation || question.question)
    .replace(/\s+/g, '')
    .replace(/\*/g, '');
  const equationMatch = compact.match(/([+-]?\d*)[a-z]([+-]\d+(?:\.\d+)?)?(?:=|<|>)([+-]?\d+(?:\.\d+)?)/i);

  if (equationMatch) {
    const coefficient = parseCoefficient(equationMatch[1]);
    const constant = Number(equationMatch[2] ?? 0);
    const result = Number(equationMatch[3]);
    const solution = coefficient === 0 ? 0 : (result - constant) / coefficient;
    return {
      coefficient,
      constant,
      result,
      solution,
      operands: [coefficient, result],
    };
  }

  const numbers = extractNumbers(source);
  const coefficient = numbers[0] ?? 2;
  const constant = numbers[1] ?? 0;
  const result = numbers[2] ?? numbers[1] ?? 10;
  const solution = coefficient === 0 ? 0 : (result - constant) / coefficient;

  return {
    coefficient,
    constant,
    result,
    solution,
    operands: [coefficient, result],
  };
}

function inferPythagoreanValues(question: Question): MathExplainerValues {
  const promptText = `${question.question} ${question.narrative}`;
  const clueText = `${question.clue.example} ${question.options.join(' ')}`;
  const promptNumbers = extractNumbers(promptText).filter((value) => value > 0);
  const clueNumbers = extractNumbers(clueText).filter((value) => value > 0);
  const hypotenuseMatch = promptText.match(/hypotenuse\D{0,18}(\d+(?:\.\d+)?)/i);

  if (hypotenuseMatch && promptNumbers.length >= 2) {
    const sideC = Number(hypotenuseMatch[1]);
    const knownLeg = promptNumbers.find((value) => value !== sideC) ?? 6;
    const missingLeg = Math.sqrt(Math.max(0, sideC * sideC - knownLeg * knownLeg));
    return {
      sideA: knownLeg,
      sideB: missingLeg,
      sideC,
      operands: [knownLeg, missingLeg],
    };
  }

  const numbers = promptNumbers.length >= 2 ? promptNumbers : clueNumbers;
  const firstThree = numbers.slice(0, 3);
  if (firstThree.length >= 3) {
    const sorted = [...firstThree].sort((a, b) => a - b);
    return {
      sideA: sorted[0],
      sideB: sorted[1],
      sideC: sorted[2],
      operands: [sorted[0], sorted[1]],
    };
  }

  const sideA = firstThree[0] ?? 3;
  const sideB = firstThree[1] ?? 4;
  return {
    sideA,
    sideB,
    sideC: Math.sqrt(sideA * sideA + sideB * sideB),
    operands: [sideA, sideB],
  };
}

function inferScientificValues(question: Question): MathExplainerValues {
  const source = `${question.question} ${question.equation || ''} ${question.clue.example}`;
  const decimalMatch = source.match(/\b0\.\d+/);
  const placesMatch = source.match(/(\d+)\s+places?/i);
  const numbers = extractNumbers(source);
  let exponent = Number(placesMatch?.[1] ?? 0);

  if (decimalMatch) {
    const fractional = decimalMatch[0].split('.')[1] || '';
    const firstNonZero = fractional.search(/[1-9]/);
    exponent = firstNonZero >= 0 ? -(firstNonZero + 1) : -1;
  } else if (!exponent) {
    exponent = numbers.find((value) => Number.isInteger(value) && value > 1 && value <= 12) ?? 3;
  }

  return {
    displayValue: decimalMatch?.[0] ?? String(numbers[0] ?? 1.4),
    exponent,
    operands: asOperandPair(numbers, [1.4, exponent]),
  };
}

function inferFractionValues(question: Question): MathExplainerValues {
  const params = question.clue.simulationParams || {};
  if (typeof params.numerator === 'number' && typeof params.denominator === 'number') {
    return {
      numerator: params.numerator,
      denominator: params.denominator,
    };
  }

  const percentMatch = getQuestionText(question).match(/(\d+(?:\.\d+)?)\s*%/);
  if (percentMatch) {
    const percent = Number(percentMatch[1]);
    const denominator = 100;
    return {
      numerator: percent,
      denominator,
    };
  }

  return {
    numerator: 3,
    denominator: 4,
  };
}

export function inferMathExplainer(question: Question): {
  concept: MathExplainerConcept;
  values: MathExplainerValues;
} {
  const text = getQuestionText(question);
  const equation = question.equation || '';

  if (question.clue.startValue !== undefined && question.clue.moveValue !== undefined) {
    return {
      concept: 'number-line',
      values: {
        startValue: question.clue.startValue,
        moveValue: question.clue.moveValue,
        moveValue2: question.clue.moveValue2,
      },
    };
  }

  if (
    text.includes('pythagorean') ||
    text.includes('pythagoras') ||
    text.includes('hypotenuse') ||
    text.includes('right-angled') ||
    text.includes('right triangle')
  ) {
    return {
      concept: 'pythagorean',
      values: inferPythagoreanValues(question),
    };
  }

  if (text.includes('ratio') || text.includes('proportion') || text.includes('parts')) {
    return {
      concept: 'ratio',
      values: inferRatioValues(question),
    };
  }

  if (text.includes('scientific notation') || text.includes('ordinary number') || text.includes('power of ten')) {
    return {
      concept: 'scientific',
      values: inferScientificValues(question),
    };
  }

  if (
    text.includes('solve') ||
    text.includes('equation') ||
    text.includes('inequality') ||
    text.includes('work backward') ||
    text.includes('reverse operations') ||
    /[a-z]/i.test(equation)
  ) {
    return {
      concept: 'equation',
      values: inferEquationValues(question),
    };
  }

  if (question.clue.simulationType === 'fraction' || text.includes('fraction') || text.includes('percent')) {
    return {
      concept: 'fraction',
      values: inferFractionValues(question),
    };
  }

  if (equation.includes('/') || text.includes('quotient') || text.includes('divide') || text.includes('divided')) {
    return {
      concept: 'division',
      values: { operands: getOperands(question) },
    };
  }

  if (equation.includes('-') || text.includes('subtract') || text.includes('difference') || text.includes('decrease')) {
    return {
      concept: 'subtraction',
      values: { operands: getOperands(question) },
    };
  }

  if (
    equation.includes('*') ||
    text.includes(' x ') ||
    text.includes('^') ||
    text.includes('power') ||
    text.includes('indices') ||
    text.includes('prime factor') ||
    text.includes('highest common factor') ||
    text.includes('hcf') ||
    text.includes('product') ||
    text.includes('multiply') ||
    text.includes('times') ||
    text.includes('volume') ||
    text.includes('area')
  ) {
    return {
      concept: 'multiplication',
      values: { operands: getOperands(question) },
    };
  }

  return {
    concept: 'addition',
    values: { operands: getOperands(question) },
  };
}
