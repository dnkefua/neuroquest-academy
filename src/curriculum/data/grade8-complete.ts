import type { CurriculumQuest, CurriculumQuestion } from '@/types';

type ClueVisual = NonNullable<CurriculumQuestion['clue']>['visual'];

type QuestionInput = {
  id: string;
  narrative: string;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
  equation?: string;
  visual?: ClueVisual;
  startValue?: number;
  moveValue?: number;
};

function question(input: QuestionInput): CurriculumQuestion {
  return {
    id: input.id,
    narrative: input.narrative,
    question: input.question,
    equation: input.equation,
    options: input.options,
    correctIndex: input.correctIndex,
    clue: {
      title: 'School Textbook Hint',
      explanation: input.explanation,
      visual: input.visual ?? 'text',
      cost: 10,
      startValue: input.startValue,
      moveValue: input.moveValue,
    },
    coinsOnCorrect: 30,
  };
}

function mathQuest({
  id,
  title,
  theme,
  narrativeWorld,
  bossQuestion,
  bossAnswer,
  questions,
}: {
  id: string;
  title: string;
  theme: string;
  narrativeWorld: string;
  bossQuestion: string;
  bossAnswer: string;
  questions: CurriculumQuestion[];
}): CurriculumQuest {
  return {
    id,
    grade: 8,
    programme: 'MYP',
    subject: 'math',
    title,
    realmName: 'EIS Nexus Grade 8',
    narrativeWorld,
    characterTeacher: 'Professor Vector',
    teacherEmoji: '8',
    theme,
    coinReward: 180,
    boss: {
      id: `${id}-boss`,
      title: `${title} Mastery Gate`,
      villain: 'The Error Engine',
      villainEmoji: 'B',
      narrative: 'The Error Engine only opens when each step is justified from the school textbook method.',
      question: bossQuestion,
      answer: bossAnswer,
      hints: [
        'Write the known facts first.',
        'Choose the relevant rule or formula.',
        'Show the calculation line by line and check that the answer is reasonable.',
      ],
      coinReward: 90,
    },
    questions,
  };
}

function scienceQuest({
  id,
  title,
  theme,
  narrativeWorld,
  bossQuestion,
  bossAnswer,
  questions,
}: {
  id: string;
  title: string;
  theme: string;
  narrativeWorld: string;
  bossQuestion: string;
  bossAnswer: string;
  questions: CurriculumQuestion[];
}): CurriculumQuest {
  return {
    id,
    grade: 8,
    programme: 'MYP',
    subject: 'science',
    title,
    realmName: 'MYP Integrated Science Lab',
    narrativeWorld,
    characterTeacher: 'Dr. Inquiry',
    teacherEmoji: 'S',
    theme,
    coinReward: 180,
    boss: {
      id: `${id}-boss`,
      title: `${title} Investigation`,
      villain: 'The False Claim',
      villainEmoji: '!',
      narrative: 'A claim has appeared in the lab without evidence. Use the MYP inquiry method to test and correct it.',
      question: bossQuestion,
      answer: bossAnswer,
      hints: [
        'Identify the scientific concept being tested.',
        'Use evidence or a calculation, not a guess.',
        'Connect the result to the real-world system.',
      ],
      coinReward: 90,
    },
    questions,
  };
}

const CORE_GRADE_8_COMPLETE_QUESTS: CurriculumQuest[] = [
  mathQuest({
    id: 'g8-school-math-number',
    title: 'Unit 1 Number',
    theme: 'EIS Year 8 Unit 1: negative integers, prime factors, indices, and order of operations',
    narrativeWorld:
      'A high-speed number arena where every gate is powered by the Year 8 number rules from the EIS curriculum.',
    bossQuestion:
      'Calculate -6 + 4 x 3^2, then write 84 as a product of prime factors.',
    bossAnswer:
      'Use priority of operations first: 3^2 = 9, 4 x 9 = 36, so -6 + 36 = 30. Prime factor decomposition: 84 = 2 x 2 x 3 x 7 = 2^2 x 3 x 7.',
    questions: [
      question({
        id: 'g8-number-q1',
        narrative: 'The race board shows 5 - 10 as you enter the first turn.',
        question: 'What is 5 - 10?',
        equation: '5 - 10 = ?',
        options: ['-5', '5', '-15', '15'],
        correctIndex: 0,
        explanation: 'Subtracting 10 from 5 moves 10 spaces left on the number line. 5 to 0 is 5 spaces, then 5 more spaces reaches -5.',
        visual: 'numberLine',
        startValue: 5,
        moveValue: -10,
      }),
      question({
        id: 'g8-number-q2',
        narrative: 'A vault requires the prime factor decomposition of 60.',
        question: 'Which is the prime factor decomposition of 60?',
        options: ['2 x 2 x 3 x 5', '2 x 3 x 10', '4 x 15', '6 x 10'],
        correctIndex: 0,
        explanation: 'Prime factors must all be prime. 60 = 2 x 30 = 2 x 2 x 15 = 2 x 2 x 3 x 5.',
      }),
      question({
        id: 'g8-number-q3',
        narrative: 'The lab console asks you to simplify a power calculation.',
        question: 'Simplify 2^3 x 2^4.',
        options: ['2^7', '2^12', '4^7', '2^1'],
        correctIndex: 0,
        explanation: 'When multiplying powers with the same base, add the indices: 2^3 x 2^4 = 2^(3+4) = 2^7.',
      }),
      question({
        id: 'g8-number-q4',
        narrative: 'A calculation lock uses brackets and powers.',
        question: 'Calculate 4 + 3 x (8 - 5)^2.',
        options: ['31', '45', '25', '17'],
        correctIndex: 0,
        explanation: 'Brackets first: 8 - 5 = 3. Powers next: 3^2 = 9. Multiply: 3 x 9 = 27. Add: 4 + 27 = 31.',
      }),
      question({
        id: 'g8-number-q5',
        narrative: 'A coded panel asks for the highest common factor of two numbers.',
        question: 'What is the HCF of 36 and 48?',
        options: ['12', '6', '18', '24'],
        correctIndex: 0,
        explanation: '36 = 2^2 x 3^2 and 48 = 2^4 x 3. The common prime factors with the smallest powers are 2^2 x 3 = 12.',
      }),
    ],
  }),

  mathQuest({
    id: 'g8-school-math-equations',
    title: 'Unit 2 Equations and Formulae',
    theme: 'EIS Year 8 Unit 2: one-step, two-step, complex equations, and formulae',
    narrativeWorld:
      'A formula control room where every door unlocks only when both sides of an equation stay balanced.',
    bossQuestion:
      'Solve 3(2x - 1) = 27, then rearrange A = lw to make w the subject.',
    bossAnswer:
      'Expand or divide first: 3(2x - 1) = 27 means 2x - 1 = 9, so 2x = 10 and x = 5. For A = lw, divide both sides by l, so w = A / l.',
    questions: [
      question({
        id: 'g8-equations-q1',
        narrative: 'A simple equation appears on a floating screen.',
        question: 'Solve x + 7 = 19.',
        options: ['12', '26', '7', '19'],
        correctIndex: 0,
        explanation: 'Subtract 7 from both sides: x = 19 - 7 = 12.',
      }),
      question({
        id: 'g8-equations-q2',
        narrative: 'A bridge calibration uses a two-step equation.',
        question: 'Solve 4x - 3 = 21.',
        options: ['6', '4.5', '7', '96'],
        correctIndex: 0,
        explanation: 'Add 3 to both sides: 4x = 24. Divide by 4: x = 6.',
      }),
      question({
        id: 'g8-equations-q3',
        narrative: 'The system hides x on both sides of the equation.',
        question: 'Solve 5x + 2 = 2x + 17.',
        options: ['5', '15', '3', '19'],
        correctIndex: 0,
        explanation: 'Subtract 2x from both sides: 3x + 2 = 17. Subtract 2: 3x = 15. Divide by 3: x = 5.',
      }),
      question({
        id: 'g8-equations-q4',
        narrative: 'A formula chip stores the relationship speed = distance / time.',
        question: 'If s = d / t, which formula makes d the subject?',
        options: ['d = st', 'd = s / t', 'd = t / s', 'd = s + t'],
        correctIndex: 0,
        explanation: 'Multiply both sides by t: st = d, so d = st.',
      }),
      question({
        id: 'g8-equations-q5',
        narrative: 'A fractional equation controls the final gate.',
        question: 'Solve x / 3 + 4 = 9.',
        options: ['15', '5', '39', '1.67'],
        correctIndex: 0,
        explanation: 'Subtract 4 from both sides: x / 3 = 5. Multiply by 3: x = 15.',
      }),
    ],
  }),

  mathQuest({
    id: 'g8-school-math-powers-algebra',
    title: 'Unit 3 Working with Powers',
    theme: 'EIS Year 8 Unit 3: simplifying, factorising, expanding, substituting, and solving',
    narrativeWorld:
      'An algebra forge where expressions are expanded, factorised, and tested under pressure.',
    bossQuestion:
      'Expand and simplify 3(x + 4) - 2(x - 5), then evaluate the result when x = 6.',
    bossAnswer:
      'Expand: 3x + 12 - 2x + 10. Simplify: x + 22. Substitute x = 6: 6 + 22 = 28.',
    questions: [
      question({
        id: 'g8-powers-q1',
        narrative: 'The forge asks you to collect like terms.',
        question: 'Simplify 7a + 3a - 2a.',
        options: ['8a', '12a', '8a^3', '6a'],
        correctIndex: 0,
        explanation: 'All terms are like terms with a. Add coefficients: 7 + 3 - 2 = 8, so the result is 8a.',
      }),
      question({
        id: 'g8-powers-q2',
        narrative: 'A factorisation lever shows 6x + 12.',
        question: 'Factorise 6x + 12.',
        options: ['6(x + 2)', '6(x + 12)', 'x(6 + 12)', '12(x + 6)'],
        correctIndex: 0,
        explanation: 'The highest common factor is 6. Divide each term by 6: 6x/6 = x and 12/6 = 2. So 6x + 12 = 6(x + 2).',
      }),
      question({
        id: 'g8-powers-q3',
        narrative: 'A bracket gate must be expanded.',
        question: 'Expand 4(2y - 3).',
        options: ['8y - 12', '8y - 3', '6y - 12', '4y - 12'],
        correctIndex: 0,
        explanation: 'Multiply every term inside the bracket by 4: 4 x 2y = 8y and 4 x -3 = -12.',
      }),
      question({
        id: 'g8-powers-q4',
        narrative: 'A substitution engine has x = -2.',
        question: 'Evaluate 3x^2 + 5 when x = -2.',
        options: ['17', '-7', '11', '29'],
        correctIndex: 0,
        explanation: 'Square first: (-2)^2 = 4. Then 3 x 4 + 5 = 12 + 5 = 17.',
      }),
      question({
        id: 'g8-powers-q5',
        narrative: 'The forge asks you to identify an identity.',
        question: 'Which expression is equivalent to 2(3x + 1) + x?',
        options: ['7x + 2', '6x + 1', '8x + 2', '7x + 1'],
        correctIndex: 0,
        explanation: 'Expand: 2(3x + 1) = 6x + 2. Add x to get 7x + 2.',
      }),
    ],
  }),

  mathQuest({
    id: 'g8-school-math-geometry-solids',
    title: 'Unit 4 2D Shapes and 3D Solids',
    theme: 'EIS Year 8 Unit 4: area, surface area, volume, plans, and elevations',
    narrativeWorld:
      'A design lab where every blueprint becomes a 3D object only when its measurements are correct.',
    bossQuestion:
      'A rectangular prism is 8 cm long, 5 cm wide, and 3 cm high. Find its volume and total surface area.',
    bossAnswer:
      'Volume = lwh = 8 x 5 x 3 = 120 cm^3. Surface area = 2(lw + lh + wh) = 2(40 + 24 + 15) = 158 cm^2.',
    questions: [
      question({
        id: 'g8-geometry-q1',
        narrative: 'A triangle blueprint has base 12 cm and height 7 cm.',
        question: 'What is the area of the triangle?',
        equation: 'Area = 1/2 x base x height',
        options: ['42 cm^2', '84 cm^2', '19 cm^2', '38 cm^2'],
        correctIndex: 0,
        explanation: 'Area of a triangle is 1/2 x base x height. 1/2 x 12 x 7 = 6 x 7 = 42 cm^2.',
        visual: 'diagram',
      }),
      question({
        id: 'g8-geometry-q2',
        narrative: 'A parallelogram panel has base 9 m and perpendicular height 4 m.',
        question: 'What is its area?',
        options: ['36 m^2', '26 m^2', '18 m^2', '13 m^2'],
        correctIndex: 0,
        explanation: 'Area of a parallelogram is base x perpendicular height: 9 x 4 = 36 m^2.',
      }),
      question({
        id: 'g8-geometry-q3',
        narrative: 'A compound shape is made from rectangles of area 24 cm^2 and 15 cm^2.',
        question: 'What is the total area?',
        options: ['39 cm^2', '9 cm^2', '360 cm^2', '78 cm^2'],
        correctIndex: 0,
        explanation: 'For non-overlapping compound shapes, add the parts: 24 + 15 = 39 cm^2.',
      }),
      question({
        id: 'g8-geometry-q4',
        narrative: 'A cuboid has dimensions 6 cm, 4 cm, and 5 cm.',
        question: 'What is its volume?',
        options: ['120 cm^3', '15 cm^3', '60 cm^3', '148 cm^3'],
        correctIndex: 0,
        explanation: 'Volume of a cuboid is length x width x height: 6 x 4 x 5 = 120 cm^3.',
        visual: '3d-simulation',
      }),
      question({
        id: 'g8-geometry-q5',
        narrative: 'A plan view shows a solid from above.',
        question: 'What does a plan view represent?',
        options: ['The view from above', 'The front elevation', 'The side elevation', 'A net of the solid'],
        correctIndex: 0,
        explanation: 'In plans and elevations, the plan is the top-down view. Elevations show front or side views.',
      }),
    ],
  }),

  mathQuest({
    id: 'g8-school-math-graphs',
    title: 'Unit 5 Graphs',
    theme: 'EIS Year 8 Unit 5: direct proportion, interpreting graphs, distance-time graphs, rates, and misleading graphs',
    narrativeWorld:
      'A graph command deck where motion, proportion, and data displays control the route through the academy.',
    bossQuestion:
      'A runner travels 240 m in 30 s. Find the speed, then explain what a horizontal section on a distance-time graph means.',
    bossAnswer:
      'Speed = distance / time = 240 / 30 = 8 m/s. A horizontal section on a distance-time graph means distance is not changing, so the object is stationary.',
    questions: [
      question({
        id: 'g8-graphs-q1',
        narrative: 'A fuel graph shows cost is directly proportional to litres bought.',
        question: 'If 4 litres cost 18 AED, what do 10 litres cost?',
        options: ['45 AED', '28 AED', '40 AED', '72 AED'],
        correctIndex: 0,
        explanation: 'Find the unit cost: 18 / 4 = 4.5 AED per litre. For 10 litres: 10 x 4.5 = 45 AED.',
      }),
      question({
        id: 'g8-graphs-q2',
        narrative: 'A distance-time graph rises in a straight line.',
        question: 'What does a straight rising line usually show?',
        options: ['Constant speed', 'Standing still', 'Moving backwards only', 'Changing units'],
        correctIndex: 0,
        explanation: 'On a distance-time graph, a straight rising line means distance increases at a constant rate, so speed is constant.',
        visual: 'diagram',
      }),
      question({
        id: 'g8-graphs-q3',
        narrative: 'A cart travels 90 m in 15 s.',
        question: 'What is the average speed?',
        equation: 'speed = distance / time',
        options: ['6 m/s', '75 m/s', '105 m/s', '1.5 m/s'],
        correctIndex: 0,
        explanation: 'Speed = distance / time = 90 / 15 = 6 m/s.',
      }),
      question({
        id: 'g8-graphs-q4',
        narrative: 'A news chart starts its vertical axis at 90 instead of 0.',
        question: 'Why might this graph be misleading?',
        options: ['It can exaggerate small differences', 'It always shows direct proportion', 'It removes all data', 'It changes mean into median'],
        correctIndex: 0,
        explanation: 'A truncated axis can make small changes look much larger than they really are.',
      }),
      question({
        id: 'g8-graphs-q5',
        narrative: 'The graph of y = 3x passes through the origin.',
        question: 'Which statement is true?',
        options: ['y is directly proportional to x', 'x is always 3', 'y is inversely proportional to x', 'the gradient is 0'],
        correctIndex: 0,
        explanation: 'A direct proportion graph has form y = kx and passes through the origin. Here k = 3.',
      }),
    ],
  }),

  scienceQuest({
    id: 'g8-school-science-atoms',
    title: 'Atomic Structure and the Periodic Table',
    theme: 'MYP integrated science: atoms, elements, compounds, mixtures, groups, periods, and particle evidence',
    narrativeWorld:
      'A holographic periodic table lab where atoms can be opened, compared, and rebuilt.',
    bossQuestion:
      'An atom has 11 protons, 12 neutrons, and 11 electrons. Identify the element, its atomic number, mass number, and charge.',
    bossAnswer:
      'The atomic number is 11, so the element is sodium. Mass number = protons + neutrons = 11 + 12 = 23. It has 11 protons and 11 electrons, so the charge is 0.',
    questions: [
      question({
        id: 'g8-atoms-q1',
        narrative: 'A particle scanner counts 6 protons in an atom.',
        question: 'What is the atomic number?',
        options: ['6', '12', '3', '18'],
        correctIndex: 0,
        explanation: 'Atomic number equals the number of protons. With 6 protons, the atomic number is 6.',
      }),
      question({
        id: 'g8-atoms-q2',
        narrative: 'A nucleus contains 8 protons and 8 neutrons.',
        question: 'What is the mass number?',
        options: ['16', '8', '0', '64'],
        correctIndex: 0,
        explanation: 'Mass number = protons + neutrons = 8 + 8 = 16.',
      }),
      question({
        id: 'g8-atoms-q3',
        narrative: 'Two substances are compared: oxygen gas and water.',
        question: 'Which statement is correct?',
        options: ['Water is a compound', 'Water is an element', 'Oxygen is a mixture', 'Oxygen is a compound'],
        correctIndex: 0,
        explanation: 'Water contains hydrogen and oxygen chemically bonded, so it is a compound. Oxygen contains only oxygen atoms, so it is an element.',
      }),
      question({
        id: 'g8-atoms-q4',
        narrative: 'The periodic table highlights Group 1.',
        question: 'Elements in the same group usually have similar chemical properties because they have the same number of what?',
        options: ['Outer-shell electrons', 'Neutrons', 'Nuclei', 'Isotopes'],
        correctIndex: 0,
        explanation: 'Elements in the same group have the same number of outer-shell electrons, which largely controls chemical properties.',
      }),
      question({
        id: 'g8-atoms-q5',
        narrative: 'A beaker contains salt dissolved in water.',
        question: 'How should salt water be classified?',
        options: ['A mixture', 'An element', 'A single atom', 'A pure compound only'],
        correctIndex: 0,
        explanation: 'Salt water is a mixture because salt and water are physically combined and can be separated by evaporation.',
      }),
    ],
  }),

  scienceQuest({
    id: 'g8-school-science-reactions',
    title: 'Chemical Reactions, Acids and pH',
    theme: 'MYP integrated science: chemical reactions, conservation, acids, bases, indicators, and neutralisation',
    narrativeWorld:
      'A reaction chamber where indicators glow and equations balance before chemicals are released.',
    bossQuestion:
      'An acid reacts with sodium hydroxide. Name the type of reaction and the two products.',
    bossAnswer:
      'This is neutralisation. Acid + base -> salt + water.',
    questions: [
      question({
        id: 'g8-reactions-q1',
        narrative: 'Iron is left outside and forms rust.',
        question: 'Why is rusting a chemical change?',
        options: ['A new substance forms', 'The iron only changes shape', 'The iron melts', 'No particles change'],
        correctIndex: 0,
        explanation: 'Rusting produces iron oxide, a new substance, so it is a chemical change.',
      }),
      question({
        id: 'g8-reactions-q2',
        narrative: 'Universal indicator turns red in a solution.',
        question: 'What does red usually show?',
        options: ['Strong acid', 'Neutral solution', 'Strong alkali', 'Pure water only'],
        correctIndex: 0,
        explanation: 'Universal indicator is red in strongly acidic solutions, green near neutral, and blue or purple in alkaline solutions.',
      }),
      question({
        id: 'g8-reactions-q3',
        narrative: 'A solution has pH 10.',
        question: 'How is it classified?',
        options: ['Alkali', 'Acid', 'Neutral', 'Element'],
        correctIndex: 0,
        explanation: 'pH values above 7 are alkaline. pH 10 is an alkali.',
      }),
      question({
        id: 'g8-reactions-q4',
        narrative: 'Hydrochloric acid reacts with sodium hydroxide.',
        question: 'What are the products of acid + base?',
        options: ['Salt and water', 'Oxygen and water', 'Carbon dioxide only', 'Metal and hydrogen'],
        correctIndex: 0,
        explanation: 'Neutralisation follows the pattern: acid + base -> salt + water.',
      }),
      question({
        id: 'g8-reactions-q5',
        narrative: 'A carbonate is added to an acid and bubbles appear.',
        question: 'Which gas is produced?',
        options: ['Carbon dioxide', 'Oxygen', 'Nitrogen', 'Chlorine'],
        correctIndex: 0,
        explanation: 'Acid + carbonate -> salt + water + carbon dioxide. The bubbles are carbon dioxide gas.',
      }),
    ],
  }),

  scienceQuest({
    id: 'g8-school-science-forces-energy',
    title: 'Motion, Forces and Energy',
    theme: 'MYP integrated science: speed, acceleration, Newton laws, F=ma, work, power, kinetic and potential energy',
    narrativeWorld:
      'A kinetic test track where learners calculate motion before machines move.',
    bossQuestion:
      'A 4 kg cart accelerates at 3 m/s^2 for 5 s from rest. Find the force and final speed.',
    bossAnswer:
      'Force = ma = 4 x 3 = 12 N. From rest, final speed = acceleration x time = 3 x 5 = 15 m/s.',
    questions: [
      question({
        id: 'g8-forces-q1',
        narrative: 'A cart travels 60 m in 12 s.',
        question: 'What is its average speed?',
        equation: 'speed = distance / time',
        options: ['5 m/s', '72 m/s', '0.2 m/s', '12 m/s'],
        correctIndex: 0,
        explanation: 'Speed = distance / time = 60 / 12 = 5 m/s.',
      }),
      question({
        id: 'g8-forces-q2',
        narrative: 'A force is applied to a 2 kg object at 3 m/s^2.',
        question: 'What is the force?',
        equation: 'F = ma',
        options: ['6 N', '5 N', '1.5 N', '0.67 N'],
        correctIndex: 0,
        explanation: 'F = ma = 2 x 3 = 6 N.',
        visual: '3d-simulation',
      }),
      question({
        id: 'g8-forces-q3',
        narrative: 'A book remains still on a table until pushed.',
        question: 'Which Newton law explains this inertia?',
        options: ['First law', 'Second law', 'Third law', 'Hooke law'],
        correctIndex: 0,
        explanation: 'Newton first law says an object stays at rest or keeps moving at constant velocity unless acted on by a resultant force.',
      }),
      question({
        id: 'g8-forces-q4',
        narrative: 'A pendulum reaches the top of its swing.',
        question: 'Which energy store is greatest at the top?',
        options: ['Gravitational potential', 'Kinetic', 'Chemical', 'Thermal only'],
        correctIndex: 0,
        explanation: 'At the highest point, height is greatest and speed is lowest, so gravitational potential energy is greatest.',
      }),
      question({
        id: 'g8-forces-q5',
        narrative: 'A machine transfers 300 J of energy in 10 s.',
        question: 'What is its power?',
        equation: 'power = energy / time',
        options: ['30 W', '3000 W', '10 W', '290 W'],
        correctIndex: 0,
        explanation: 'Power = energy transferred / time = 300 / 10 = 30 W.',
      }),
    ],
  }),

  scienceQuest({
    id: 'g8-school-science-waves',
    title: 'Waves, Light and Sound',
    theme: 'MYP integrated science: frequency, wavelength, amplitude, reflection, refraction, sound, and the electromagnetic spectrum',
    narrativeWorld:
      'A wave studio where light beams split, sound pulses travel, and frequencies unlock doors.',
    bossQuestion:
      'A wave has frequency 5 Hz and wavelength 2 m. Calculate wave speed and explain what amplitude changes.',
    bossAnswer:
      'Wave speed = frequency x wavelength = 5 x 2 = 10 m/s. Amplitude changes the energy or intensity of the wave; for sound this affects loudness.',
    questions: [
      question({
        id: 'g8-waves-q1',
        narrative: 'A sound wave vibrates 20 times each second.',
        question: 'What does frequency measure?',
        options: ['Vibrations per second', 'Wave height only', 'Distance travelled only', 'Mass of the medium'],
        correctIndex: 0,
        explanation: 'Frequency is the number of complete vibrations or waves per second, measured in hertz (Hz).',
      }),
      question({
        id: 'g8-waves-q2',
        narrative: 'A wave has frequency 4 Hz and wavelength 3 m.',
        question: 'What is the wave speed?',
        equation: 'v = f x lambda',
        options: ['12 m/s', '7 m/s', '1.33 m/s', '0.75 m/s'],
        correctIndex: 0,
        explanation: 'Wave speed = frequency x wavelength = 4 x 3 = 12 m/s.',
      }),
      question({
        id: 'g8-waves-q3',
        narrative: 'A light ray bounces off a mirror.',
        question: 'What is this process called?',
        options: ['Reflection', 'Refraction', 'Absorption', 'Dispersion'],
        correctIndex: 0,
        explanation: 'Reflection is when a wave bounces off a surface. Mirrors reflect light in a regular way.',
      }),
      question({
        id: 'g8-waves-q4',
        narrative: 'White light passes through a prism and separates into colours.',
        question: 'What is the splitting of white light called?',
        options: ['Dispersion', 'Echo', 'Insulation', 'Conduction'],
        correctIndex: 0,
        explanation: 'Dispersion occurs because different colours refract by different amounts in the prism.',
      }),
      question({
        id: 'g8-waves-q5',
        narrative: 'A learner tries to hear sound in a vacuum chamber.',
        question: 'Why can sound not travel through a vacuum?',
        options: ['Sound needs a material medium', 'Sound is made of light', 'Sound only travels through metal', 'Frequency becomes zero always'],
        correctIndex: 0,
        explanation: 'Sound is a mechanical wave, so it needs particles in a solid, liquid, or gas to vibrate. A vacuum has no material medium.',
      }),
    ],
  }),

  scienceQuest({
    id: 'g8-school-science-earth',
    title: 'Earth Systems and Plate Tectonics',
    theme: 'MYP integrated science: Earth structure, plate boundaries, earthquakes, volcanoes, weathering, erosion, and deposition',
    narrativeWorld:
      'A planetary simulation lab where crustal plates move beneath a projected Earth.',
    bossQuestion:
      'Explain how plate movement can cause earthquakes and name one feature formed at a divergent plate boundary.',
    bossAnswer:
      'Plates can lock due to friction. Stress builds until rocks suddenly slip, releasing energy as seismic waves and causing an earthquake. At divergent boundaries, plates move apart and magma rises to form new crust, such as a mid-ocean ridge or rift valley.',
    questions: [
      question({
        id: 'g8-earth-q1',
        narrative: 'A cross-section of Earth labels the outermost solid layer.',
        question: 'What is the outermost layer of Earth called?',
        options: ['Crust', 'Outer core', 'Inner core', 'Lower mantle'],
        correctIndex: 0,
        explanation: 'The crust is the thin, outermost solid layer of Earth.',
      }),
      question({
        id: 'g8-earth-q2',
        narrative: 'Two plates move apart under the ocean.',
        question: 'What type of boundary is this?',
        options: ['Divergent', 'Convergent', 'Transform', 'Static'],
        correctIndex: 0,
        explanation: 'At a divergent boundary, plates move away from each other and new crust can form.',
      }),
      question({
        id: 'g8-earth-q3',
        narrative: 'A fault suddenly slips after stress builds up.',
        question: 'What does this usually cause?',
        options: ['Earthquake', 'Tide', 'Rainbow', 'Frost'],
        correctIndex: 0,
        explanation: 'Sudden slip along a fault releases energy as seismic waves, causing an earthquake.',
      }),
      question({
        id: 'g8-earth-q4',
        narrative: 'Wind and water carry broken rock particles away.',
        question: 'What is this process called?',
        options: ['Erosion', 'Condensation', 'Neutralisation', 'Magnetisation'],
        correctIndex: 0,
        explanation: 'Weathering breaks rock down; erosion transports the broken material away.',
      }),
      question({
        id: 'g8-earth-q5',
        narrative: 'A river drops sediment when it slows down.',
        question: 'What is this process called?',
        options: ['Deposition', 'Subduction', 'Refraction', 'Combustion'],
        correctIndex: 0,
        explanation: 'Deposition is when transported sediment is laid down, often because water or wind slows.',
      }),
    ],
  }),
];

const compatibilityQuestMap = [
  ['g8-math', 'g8-school-math-number', 'Unit 1 Number'],
  ['g8-math-numbers', 'g8-school-math-number', 'Number Systems and Indices'],
  ['g8-math-2', 'g8-school-math-equations', 'Unit 2 Equations and Formulae'],
  ['g8-math-equations', 'g8-school-math-equations', 'Equations and Formulae'],
  ['g8-math-3', 'g8-school-math-powers-algebra', 'Unit 3 Working with Powers'],
  ['g8-math-algebra', 'g8-school-math-powers-algebra', 'Algebra and Powers'],
  ['g8-math-pythagoras', 'g8-school-math-geometry-solids', 'Pythagoras, Area and Solids'],
  ['g8-math-adv-geometry', 'g8-school-math-geometry-solids', 'Advanced Geometry and 3D Solids'],
  ['g8-math-coords', 'g8-school-math-graphs', 'Coordinates, Rates and Graphs'],
  ['g8-math-stats', 'g8-school-math-graphs', 'Graphs and Data Reasoning'],
  ['g8-math-statistics', 'g8-school-math-graphs', 'Statistics, Graphs and Interpretation'],
  ['g8-science', 'g8-school-science-atoms', 'Matter and Periodic Table'],
  ['g8-science-chem', 'g8-school-science-reactions', 'Chemical Reactions and pH'],
  ['g8-science-chemistry', 'g8-school-science-reactions', 'Chemistry: Reactions, Acids and Alkalis'],
  ['g8-science-2', 'g8-school-science-forces-energy', 'Forces and Motion'],
  ['g8-science-physics', 'g8-school-science-forces-energy', 'Physics: Forces, Motion and Energy'],
  ['g8-science-physics-2', 'g8-school-science-forces-energy', 'The Kinetic Core'],
  ['g8-science-3', 'g8-school-science-waves', 'Cells, Signals and Waves'],
  ['g8-science-biology', 'g8-school-science-atoms', 'Biology: Cells and Body Systems'],
  ['g8-science-biology-2', 'g8-school-science-atoms', 'The Bio-Dome'],
  ['g8-science-earth', 'g8-school-science-earth', 'Earth Systems and Plate Tectonics'],
  ['g8-science-ecology', 'g8-school-science-earth', 'Ecology and Earth Systems'],
] as const;

function cloneQuestForCompatibility(id: string, baseId: string, title: string): CurriculumQuest {
  const base = CORE_GRADE_8_COMPLETE_QUESTS.find((quest) => quest.id === baseId);
  if (!base) {
    throw new Error(`Missing Grade 8 source quest: ${baseId}`);
  }

  return {
    ...base,
    id,
    title,
    boss: base.boss
      ? {
          ...base.boss,
          id: `${id}-boss`,
          title: `${title} Mastery Gate`,
          hints: [...base.boss.hints],
        }
      : undefined,
    questions: base.questions.map((item, index) => ({
      ...item,
      id: `${id}-q${index + 1}`,
      clue: item.clue ? { ...item.clue } : undefined,
    })),
  };
}

export const GRADE_8_COMPLETE_QUESTS: CurriculumQuest[] = compatibilityQuestMap.map(([id, baseId, title]) =>
  cloneQuestForCompatibility(id, baseId, title)
);
