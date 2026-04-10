import re

quest_str = r'''
  // ─── GRADE 8 · MATH: Number Systems & Operations ────────────────────────────
  {
    id: 'g8-math-numbers',
    grade: 8,
    programme: 'MYP',
    subject: 'math',
    title: 'The Vault of Values',
    realmName: 'Crystal Caverns',
    narrativeWorld: 'Deep in the Crystal Caverns, a giant vault door is locked. To open it, you must decipher numerical codes left by an ancient society using ratios, percentages, and scientific notation.',
    characterTeacher: 'Master Fractionus',
    teacherEmoji: '🧮',
    theme: 'dungeon',
    coinReward: 150,
    boss: {
      id: 'g8-math-numbers-boss',
      title: 'The Grand Vault Guardian',
      villain: 'Guardian Numeron',
      villainEmoji: '🛡️',
      narrative: 'Guardian Numeron places a scale before you. You must balance the scale by solving a compounding challenge and translating a microscopic mass into scientific notation.',
      question: 'A crystal grows by 10% each year. If it is 100g now, what will its mass be after 2 years? Also, write 0.0045 kg in scientific notation.',
      answer: 'After 1 year: 110g. After 2 years: 121g. Scientific notation: 4.5 × 10⁻³.',
      hints: [
        'Growth compounds: calculate Year 1 first (100 + 10% of 100), then apply 10% to THAT new number for Year 2.',
        'Scientific notation requires exactly one non-zero digit before the decimal point.',
        'Move the decimal point 3 places right for 0.0045, making the exponent negative.'
      ],
      coinReward: 75,
    },
    questions: [
      {
        id: 'g8-math-num-q1',
        narrative: 'A sparkling gem shrinks slightly when exposed to light. Its initial mass is 40 grams, but it decreases by 15%.',
        question: 'What is the new mass of the gem after a 15% decrease?',
        equation: '40 - (0.15 × 40)',
        options: ['34 g', '35 g', '25 g', '46 g'],
        correctIndex: 0,
        clue: { title: 'Percentage Decrease', explanation: 'Calculate 15% of 40: 0.15 × 40 = 6. Subtract this from the original mass: 40 - 6 = 34.', visual: 'text', cost: 10 },
        coinsOnCorrect: 30,
      },
      {
        id: 'g8-math-num-q2',
        narrative: 'An ancient scroll defines the mass of a magical dust particle as extremely small.',
        question: 'Write the number 0.00032 in scientific notation.',
        equation: '0.00032 = 3.2 × 10ⁿ',
        options: ['3.2 × 10⁻⁴', '3.2 × 10⁴', '32 × 10⁻⁵', '0.32 × 10⁻³'],
        correctIndex: 0,
        clue: { title: 'Scientific Notation', explanation: 'Move the decimal point 4 places to the right to place it after the 3. Because it is a small number, the exponent is negative 4.', visual: 'text', cost: 10 },
        coinsOnCorrect: 30,
      },
      {
        id: 'g8-math-num-q3',
        narrative: 'Two types of potions need to be mixed in a specific ratio of 3:5. You have a total of 40ml of the mixture.',
        question: 'How many milliliters of the first potion are in the 40ml mixture?',
        equation: 'Ratio 3:5, Total 40',
        options: ['15 ml', '25 ml', '24 ml', '12 ml'],
        correctIndex: 0,
        clue: { title: 'Dividing into Ratios', explanation: 'Add the ratio parts: 3 + 5 = 8 parts. Divide total by parts: 40 ÷ 8 = 5ml per part. Multiply by 3 for the first potion: 3 × 5 = 15ml.', visual: 'text', cost: 10 },
        coinsOnCorrect: 30,
      },
      {
        id: 'g8-math-num-q4',
        narrative: 'The merchant in the cavern sells a shield. Its price has doubled, and then increased by another £10. It is now £50.',
        question: 'Work backward! If doubling the price and adding 10 results in 50, what was the original price?',
        equation: '2x + 10 = 50',
        options: ['20', '30', '15', '40'],
        correctIndex: 0,
        clue: { title: 'Reverse Operations', explanation: 'Reverse the steps: subtract 10 (50 - 10 = 40), then halve it (40 ÷ 2 = 20).', visual: 'text', cost: 10 },
        coinsOnCorrect: 30,
      },
      {
        id: 'g8-math-num-q5',
        narrative: 'A giant cavern stretches for 1.4 × 10⁶ millimeters.',
        question: 'What is 1.4 × 10⁶ written as an ordinary number?',
        equation: '1.4 × 10⁶',
        options: ['1,400,000', '14,000,000', '140,000', '1,000,004'],
        correctIndex: 0,
        clue: { title: 'Expanding Scientific Notation', explanation: 'Move the decimal point 6 places to the right. 1.4 becomes 1,400,000.', visual: 'text', cost: 10 },
        coinsOnCorrect: 30,
      }
    ],
  },
  // ─── GRADE 8 · MATH: Algebra & Equations ──────────────────────────────────
  {
    id: 'g8-math-algebra',
    grade: 8,
    programme: 'MYP',
    subject: 'math',
    title: 'The Algebra Labyrinth',
    realmName: 'Crystal Caverns',
    narrativeWorld: 'A treacherous, twisting section of the caverns filled with mirrors. You must solve algebraic equations to find the correct path forward.',
    characterTeacher: 'Lady Algebris',
    teacherEmoji: '🕵️‍♀️',
    theme: 'dungeon',
    coinReward: 150,
    boss: {
      id: 'g8-math-algebra-boss',
      title: 'The Mirror Phantom',
      villain: 'Phantom of Variables',
      villainEmoji: '🪞',
      narrative: 'The Phantom traps you in a room filled with illusions. Only solving a multi-step equation will break the glass.',
      question: 'Solve for x:  3(x - 2) = 2x + 5',
      answer: 'Expand the bracket: 3x - 6 = 2x + 5. Subtract 2x from both sides: x - 6 = 5. Add 6 to both sides: x = 11.',
      hints: [
        'Start by expanding the bracket on the left side by multiplying the 3 with both x and -2.',
        'Collect all the x terms on one side by subtracting 2x from 3x.',
        'Isolate the x by moving the constant (-6) to the right side.'
      ],
      coinReward: 75,
    },
    questions: [
      {
        id: 'g8-math-alg-q1',
        narrative: 'A wall blocks your path, marked with an algebraic riddle.',
        question: 'Expand and simplify: 2(x + 4) + 3(x + 1)',
        equation: '2(x + 4) + 3(x + 1) = ?',
        options: ['5x + 5', '5x + 11', '6x + 8', '5x + 9'],
        correctIndex: 1,
        clue: { title: 'Expanding and Simplifying', explanation: 'Expand the first bracket: 2x + 8. Expand the second: 3x + 3. Add them together: (2x+3x) + (8+3) = 5x + 11.', visual: 'text', cost: 10 },
        coinsOnCorrect: 30,
      },
      {
        id: 'g8-math-alg-q2',
        narrative: 'You find a crystal tablet that needs factoring to decipher its true meaning.',
        question: 'Factorise fully: 12x + 18',
        equation: '12x + 18 = ?',
        options: ['2(6x + 9)', '6(2x + 3)', '3(4x + 6)', 'x(12 + 18)'],
        correctIndex: 1,
        clue: { title: 'Factorising Expressions', explanation: 'Find the Highest Common Factor (HCF) of 12 and 18, which is 6. Divide both terms by 6: 6(2x + 3).', visual: 'text', cost: 10 },
        coinsOnCorrect: 30,
      },
      {
        id: 'g8-math-alg-q3',
        narrative: 'A bridge demands a toll corresponding to the solution of an equation.',
        question: 'Solve: 5x - 7 = 18',
        equation: '5x - 7 = 18',
        options: ['x = 4', 'x = 3', 'x = 5', 'x = 25'],
        correctIndex: 2,
        clue: { title: 'Solving Linear Equations', explanation: 'Add 7 to both sides: 5x = 25. Then divide by 5: x = 5.', visual: 'text', cost: 10 },
        coinsOnCorrect: 30,
      },
      {
        id: 'g8-math-alg-q4',
        narrative: 'You stand on a pressure plate. The weight must satisfy an inequality.',
        question: 'Solve the inequality: 4y + 2 < 14',
        equation: '4y + 2 < 14',
        options: ['y < 3', 'y > 3', 'y < 4', 'y <= 3'],
        correctIndex: 0,
        clue: { title: 'Solving Inequalities', explanation: 'Treat it like a normal equation. Subtract 2 from both sides: 4y < 12. Divide by 4: y < 3.', visual: 'text', cost: 10 },
        coinsOnCorrect: 30,
      },
      {
        id: 'g8-math-alg-q5',
        narrative: 'A locked chest requires discovering the pattern in a sequence.',
        question: 'What is the nth term rule for this arithmetic sequence: 4, 7, 10, 13, ...',
        equation: 'Sequence: 4, 7, 10, 13...',
        options: ['n + 3', '3n + 1', '4n', '3n + 4'],
        correctIndex: 1,
        clue: { title: 'Nth Term of Sequences', explanation: 'The difference between terms is 3, so it starts with 3n. The 0th term (if we went back one step from 4) is 1. So the rule is 3n + 1.', visual: 'text', cost: 10 },
        coinsOnCorrect: 30,
      }
    ],
  },
  // ─── GRADE 8 · MATH: 3D Geometry & Pythagoras ─────────────────────────────
  {
    id: 'g8-math-adv-geometry',
    grade: 8,
    programme: 'MYP',
    subject: 'math',
    title: 'The 3D Prism Peaks',
    realmName: 'Crystal Caverns',
    narrativeWorld: 'In a huge geode chamber filled with three dimensional gemstone pillars, you must measure their massive volumes and traverse diagonals.',
    characterTeacher: 'Sir Pythagoras',
    teacherEmoji: '📐',
    theme: 'dungeon',
    coinReward: 150,
    boss: {
      id: 'g8-math-geo-boss',
      title: 'The Crystal Behemoth',
      villain: 'Goliath the Prism',
      villainEmoji: '💎',
      narrative: 'A massive rectangular crystal pillar blocks the cave exit. It wants you to determine its diagonal distance accurately.',
      question: 'A right-angled triangle forms the base of a crystal. The two shorter sides are 5cm and 12cm. What is the length of the hypotenuse?',
      answer: 'The hypotenuse is 13cm.',
      hints: [
        'Use Pythagorean Theorem: a² + b² = c².',
        'Square the shorter sides: 5² = 25 and 12² = 144.',
        'Add them together (169) and find the square root.'
      ],
      coinReward: 75,
    },
    questions: [
      {
        id: 'g8-math-geo-q1',
        narrative: 'You find a perfectly cylindrical geode. You need its volume to extract its power.',
        question: 'Find the volume of a cylinder with radius 3cm and height 10cm. (Use π = 3.14)',
        equation: 'V = π × r² × h',
        options: ['94.2 cm³', '282.6 cm³', '180 cm³', '60 cm³'],
        correctIndex: 1,
        clue: { title: 'Volume of Cylinder', explanation: 'Formula is Area of base × height. Base area = 3.14 × 3² = 28.26. Volume = 28.26 × 10 = 282.6 cm³.', visual: 'diagram', cost: 10 },
        coinsOnCorrect: 30,
      },
      {
        id: 'g8-math-geo-q2',
        narrative: 'A triangular prism sits on a pedestal. Determine its volume.',
        question: 'A triangular prism has a cross-sectional area of 15 cm² and is 8 cm long. What is its volume?',
        equation: 'V = Area × Length',
        options: ['120 cm³', '60 cm³', '24 cm³', '23 cm³'],
        correctIndex: 0,
        clue: { title: 'Volume of any Prism', explanation: 'The volume of a prism is simply its cross-sectional area multiplied by its length. 15 × 8 = 120 cm³.', visual: 'diagram', cost: 10 },
        coinsOnCorrect: 30,
      },
      {
        id: 'g8-math-geo-q3',
        narrative: 'To cross a chasm, you need a plank. You know the horizontal width and vertical height of the gap.',
        question: 'If a right-angled triangle has a hypotenuse of 10m and one side is 6m, what is the length of the other side?',
        equation: 'a² + b² = c²',
        options: ['4 m', '16 m', '8 m', '12 m'],
        correctIndex: 2,
        clue: { title: 'Finding a Shorter Side', explanation: 'Rearrange Pythagoras: a² = c² - b². So a² = 10² - 6² = 100 - 36 = 64. The square root of 64 is 8.', visual: 'diagram', cost: 10 },
        coinsOnCorrect: 30,
      },
      {
        id: 'g8-math-geo-q4',
        narrative: 'You must paint a magical glowing box to disguise it from enemies.',
        question: 'What is the total surface area of a cube where each edge is 4 cm long?',
        equation: 'Surface Area = 6 × (s²)',
        options: ['96 cm²', '64 cm²', '16 cm²', '24 cm²'],
        correctIndex: 0,
        clue: { title: 'Surface Area of a Cube', explanation: 'A cube has 6 identical square faces. Area of one face = 4 × 4 = 16 cm². Total area = 16 × 6 = 96 cm².', visual: 'diagram', cost: 10 },
        coinsOnCorrect: 30,
      },
      {
        id: 'g8-math-geo-q5',
        narrative: 'You are analyzing the dimensions of a gemstone embedded in the wall.',
        question: 'Which set of side lengths is a valid Pythagorean triple (a true right-angled triangle)?',
        options: ['3, 4, 6', '5, 8, 12', '7, 24, 25', '6, 9, 10'],
        correctIndex: 2,
        clue: { title: 'Pythagorean Triples', explanation: 'Check if a² + b² = c². For 7, 24, 25: 49 + 576 = 625. And 25² is 625. This matches perfectly.', visual: 'text', cost: 10 },
        coinsOnCorrect: 30,
      }
    ],
  },
  // ─── GRADE 8 · MATH: Statistics & Probability ─────────────────────────────
  {
    id: 'g8-math-statistics',
    grade: 8,
    programme: 'MYP',
    subject: 'math',
    title: 'The Oracle of Odds',
    realmName: 'Crystal Caverns',
    narrativeWorld: 'A mysterious cavern filled with shimmering orbs of varying sizes. The Oracle uses records from the past to predict the future and insists you do the same.',
    characterTeacher: 'Seer Statistica',
    teacherEmoji: '📊',
    theme: 'dungeon',
    coinReward: 150,
    boss: {
      id: 'g8-math-stat-boss',
      title: 'The Random Rogue',
      villain: 'Gambler Goblin',
      villainEmoji: '🎲',
      narrative: 'The Gambler Goblin challenges you to a test of compound probability. Win, and you keep your coins. Lose, and he takes them all!',
      question: 'A bag contains 3 red marbles and 2 blue marbles. You pick two marbles, replacing the first one before picking the second. What is the probability of picking red both times?',
      answer: 'Probability is 9/25.',
      hints: [
        'Find the probability of picking red on the first draw (3 out of 5, or 3/5).',
        'Since you put it back, the probability of picking red on the second draw is the exact same.',
        'Multiply independent probabilities together: (3/5) × (3/5).'
      ],
      coinReward: 75,
    },
    questions: [
      {
        id: 'g8-math-stat-q1',
        narrative: 'The Oracle hands you a scroll with the ages of five ancient spirits.',
        question: 'Find the mean of these ages: 12, 15, 12, 20, 16',
        equation: 'Mean = Sum / total count',
        options: ['12', '15', '14', '75'],
        correctIndex: 1,
        clue: { title: 'Calculating Mean', explanation: 'Add all values: 12 + 15 + 12 + 20 + 16 = 75. Divide by the amount of values (5): 75 ÷ 5 = 15.', visual: 'text', cost: 10 },
        coinsOnCorrect: 30,
      },
      {
        id: 'g8-math-stat-q2',
        narrative: 'To pass a door, you must identify its median frequency from a sequence.',
        question: 'Find the median of this data set: 8, 3, 10, 4, 7',
        equation: 'Order the numbers first.',
        options: ['10', '7', '6.4', '4'],
        correctIndex: 1,
        clue: { title: 'Calculating Median', explanation: 'Step 1: Order from smallest to largest: 3, 4, 7, 8, 10. Step 2: Pick the middle number, which is 7.', visual: 'text', cost: 10 },
        coinsOnCorrect: 30,
      },
      {
        id: 'g8-math-stat-q3',
        narrative: 'A six-sided die is rolled inside the cavern.',
        question: 'What is the theoretical probability of rolling a prime number on a fair standard 6-sided die?',
        equation: 'P(Prime) = ?',
        options: ['3/6 (or 1/2)', '2/6 (or 1/3)', '4/6 (or 2/3)', '1/6'],
        correctIndex: 0,
        clue: { title: 'Probability of an Event', explanation: 'The prime numbers on a die are 2, 3, and 5. There are 3 prime numbers out of 6 possible outcomes. So 3/6 simplifies to 1/2.', visual: 'text', cost: 10 },
        coinsOnCorrect: 30,
      },
      {
        id: 'g8-math-stat-q4',
        narrative: 'The seer shows you a scatter graph plotting temperature vs. number of bats seen.',
        question: 'As temperature increases, the number of bats decreases. What type of correlation is this?',
        options: ['Positive correlation', 'No correlation', 'Negative correlation', 'Zero median'],
        correctIndex: 2,
        clue: { title: 'Scatter Plots & Correlation', explanation: 'When one variable goes up and the other goes down, it is called a negative correlation. When both go up together, it is positive.', visual: 'diagram', cost: 10 },
        coinsOnCorrect: 30,
      },
      {
        id: 'g8-math-stat-q5',
        narrative: 'A spinner has 4 equal sections: Red, Blue, Green, Yellow.',
        question: 'If you spin the spinner 200 times, what is the expected frequency of landing on Green?',
        equation: 'Expected = Probability × total trials',
        options: ['50', '25', '100', '40'],
        correctIndex: 0,
        clue: { title: 'Expected Frequency', explanation: 'The probability of Green is 1/4. To find expected frequency, multiply this by the number of spins: (1/4) × 200 = 50.', visual: 'text', cost: 10 },
        coinsOnCorrect: 30,
      }
    ],
  },
'''

filepath = r"src\curriculum\data\grades6-10.ts"

with open(filepath, 'r', encoding='utf-8') as f:
    text = f.read()

pattern = r"(    ],\n  },\n\n)(\];\n\nexport const MYP_QUESTS_BY_GRADE)"

if re.search(pattern, text):
    new_text = re.sub(pattern, r"\g<1>" + quest_str + r"\n\g<2>", text)
    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(new_text)
    print("Successfully injected the new quests.")
else:
    print("Could not find the insertion point.")

