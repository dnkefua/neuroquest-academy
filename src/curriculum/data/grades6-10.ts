import type { CurriculumQuest } from '@/types';

export const MYP_QUESTS: CurriculumQuest[] = [
  // ─── GRADE 6 · MATH: Integers & Number Line ───────────────────────────────
  {
    id: 'g6-math',
    grade: 6,
    programme: 'MYP',
    subject: 'math',
    title: 'Integers & the Number Line',
    realmName: 'Dungeon Catacombs',
    narrativeWorld:
      'Deep beneath the Dungeon Catacombs, torches flicker along a stone corridor whose floor is carved with a giant number line. Brave explorers must master positive and negative numbers to unlock each iron gate.',
    characterTeacher: 'Crypt Keeper Numerus',
    teacherEmoji: '💀',
    theme: 'dungeon',
    coinReward: 150,
    boss: {
      id: 'g6-math-boss',
      title: 'The Negative Necromancer',
      villain: 'Lord Minuskar',
      villainEmoji: '🧟',
      narrative:
        'Lord Minuskar guards the final vault. He has frozen the drawbridge at a temperature of −8 °C. Every hour the temperature drops by 3 °C. You must calculate the temperature after 4 hours to speak the unlock word.',
      question:
        'The temperature starts at −8 °C and drops 3 °C every hour. What is the temperature after 4 hours? Then find the difference between that temperature and +10 °C.',
      answer:
        'After 4 hours: −8 + (4 × −3) = −8 − 12 = −20 °C. Difference from +10 °C: 10 − (−20) = 10 + 20 = 30 °C.',
      hints: [
        'Dropping 3 °C each hour means adding −3 each time. Multiply: 4 × (−3) = −12.',
        'Add that change to the starting temperature: −8 + (−12) = −20 °C.',
        'To find the difference between two numbers on a number line, subtract the smaller from the larger, remembering that subtracting a negative is the same as adding.',
      ],
      coinReward: 75,
    },
    questions: [
      {
        id: 'g6-math-q1',
        narrative:
          'You enter the first catacomb chamber. A stone tablet shows a number line with a gem at position −3.',
        question: 'Which number is 5 steps to the RIGHT of −3 on the number line?',
        equation: '-3 + 5 = ?',
        options: ['−8', '−2', '2', '8'],
        correctIndex: 2,
        clue: {
          title: 'Stepping Right on the Number Line',
          explanation:
            'Moving right on a number line means adding. Start at −3. Count 5 steps right: −3 → −2 → −1 → 0 → 1 → 2. The answer is 2.',
          visual: 'numberLine',
          cost: 10,
        },
        coinsOnCorrect: 30,
      },
      {
        id: 'g6-math-q2',
        narrative:
          'A dungeon goblin stole 7 gold coins from your pouch, which had only 4 coins. You now owe the goblin.',
        question: 'What integer represents having 4 coins and losing 7?',
        equation: '4 - 7 = ?',
        options: ['3', '−3', '11', '−11'],
        correctIndex: 1,
        clue: {
          title: 'Subtraction into Negatives',
          explanation:
            'Start at 4 on the number line. Subtract 7 means moving 7 steps left: 4 → 3 → 2 → 1 → 0 → −1 → −2 → −3. Result is −3.',
          visual: 'numberLine',
          cost: 10,
        },
        coinsOnCorrect: 30,
      },
      {
        id: 'g6-math-q3',
        narrative:
          'Two rival wizards stand on opposite sides of a number line. Wizard A is at −6 and Wizard B is at +4.',
        question: 'What is the distance between −6 and +4 on the number line?',
        equation: '|4 - (-6)| = ?',
        options: ['2', '10', '−10', '8'],
        correctIndex: 1,
        clue: {
          title: 'Distance on the Number Line',
          explanation:
            'Distance is always positive. Subtract the smaller from the larger, or use absolute value: 4 − (−6) = 4 + 6 = 10. Count from −6 to 4: that is 10 steps.',
          visual: 'numberLine',
          cost: 10,
        },
        coinsOnCorrect: 30,
      },
      {
        id: 'g6-math-q4',
        narrative:
          'The dungeon lift descends 5 floors from floor 2 to find a hidden treasure vault.',
        question: 'Which floor does the lift reach if it starts at floor 2 and goes down 5 floors?',
        equation: '2 - 5 = ?',
        options: ['Floor 3', 'Floor −3', 'Floor 7', 'Floor −7'],
        correctIndex: 1,
        clue: {
          title: 'Going Below Zero',
          explanation:
            'Floors below ground are negative. Start at 2, go down 5: 2 − 5 = −3. Floor −3 is 3 floors underground.',
          visual: 'numberLine',
          cost: 10,
        },
        coinsOnCorrect: 30,
      },
      {
        id: 'g6-math-q5',
        narrative:
          'The crypt scoreboard shows a knight who scored −4 points and then earned +9 points in the next round.',
        question: 'What is the knight\'s total score after both rounds?',
        equation: '-4 + 9 = ?',
        options: ['13', '−13', '5', '−5'],
        correctIndex: 2,
        clue: {
          title: 'Adding Integers with Different Signs',
          explanation:
            'When signs differ, subtract the smaller absolute value from the larger: |9| − |−4| = 9 − 4 = 5. The larger absolute value (9) is positive, so the answer is +5.',
          visual: 'numberLine',
          cost: 10,
        },
        coinsOnCorrect: 30,
      },
    ],
  },

  // ─── GRADE 6 · SCIENCE: Water Cycle ───────────────────────────────────────
  {
    id: 'g6-science',
    grade: 6,
    programme: 'MYP',
    subject: 'science',
    title: 'The Water Cycle',
    realmName: 'Dungeon Catacombs',
    narrativeWorld:
      'Beneath the Dungeon Catacombs lies a hidden underground sea where ancient water spirits govern the endless journey of water from ocean to cloud and back again.',
    characterTeacher: 'Aqua Specter Hydra',
    teacherEmoji: '💧',
    theme: 'dungeon',
    coinReward: 150,
    boss: {
      id: 'g6-science-boss',
      title: 'The Storm Wraith',
      villain: 'Tempestus the Cloud Titan',
      villainEmoji: '🌪️',
      narrative:
        'Tempestus has scrambled the water cycle, causing endless drought in the catacombs. Explain the full journey of a single water droplet from ocean surface to mountain stream to defeat him.',
      question:
        'Describe in order the THREE main stages of the water cycle a water droplet from the ocean undergoes before falling as rain. Name the energy source that drives the first stage.',
      answer:
        '1. Evaporation — liquid water absorbs solar energy (heat from the Sun) and becomes water vapour. 2. Condensation — water vapour cools high in the atmosphere and forms tiny droplets around dust particles, creating clouds. 3. Precipitation — droplets combine and fall as rain (or snow) when they become too heavy. The Sun (solar energy) drives evaporation.',
      hints: [
        'Think about what happens to water in a puddle on a sunny day — it disappears into the air. What is that process called, and what energy source causes it?',
        'High in the cold atmosphere, water vapour turns back into liquid droplets. This is the opposite of the first stage. What is it called, and what does it form?',
        'Eventually the cloud droplets become heavy enough to fall. What do we call water falling from clouds, and in what forms can it occur?',
      ],
      coinReward: 75,
    },
    questions: [
      {
        id: 'g6-science-q1',
        narrative:
          'A water spirit explains how liquid water from the underground lake vanishes into the air on warm days.',
        question: 'What is the process called when liquid water changes into water vapour due to heat?',
        options: ['Condensation', 'Precipitation', 'Evaporation', 'Transpiration'],
        correctIndex: 2,
        clue: {
          title: 'Evaporation',
          explanation:
            'Evaporation occurs when liquid water gains enough energy (heat) for molecules to escape into the air as water vapour (gas). It happens from oceans, lakes, and puddles. Condensation is the reverse — gas turning back to liquid.',
          visual: 'diagram',
          cost: 10,
        },
        coinsOnCorrect: 30,
      },
      {
        id: 'g6-science-q2',
        narrative:
          'High above the catacombs, you see white fluffy shapes forming as warm moist air rises into cooler regions.',
        question: 'What process forms clouds when water vapour cools and turns back into liquid droplets?',
        options: ['Evaporation', 'Condensation', 'Precipitation', 'Runoff'],
        correctIndex: 1,
        clue: {
          title: 'Condensation',
          explanation:
            'Condensation is the change from gas (water vapour) to liquid. As warm moist air rises, it cools. The cooled vapour condenses around tiny dust particles, forming cloud droplets. You see condensation on a cold glass on a humid day.',
          visual: 'diagram',
          cost: 10,
        },
        coinsOnCorrect: 30,
      },
      {
        id: 'g6-science-q3',
        narrative:
          'The storm clouds above the catacombs grow heavy and the water spirits cheer as the sky opens up.',
        question: 'What term describes water falling from clouds in the form of rain, snow, sleet, or hail?',
        options: ['Condensation', 'Evaporation', 'Infiltration', 'Precipitation'],
        correctIndex: 3,
        clue: {
          title: 'Precipitation',
          explanation:
            'Precipitation is any form of water that falls from clouds to Earth\'s surface. When cloud droplets combine and grow heavy enough, gravity pulls them down. Rain, snow, sleet, and hail are all types of precipitation.',
          visual: 'diagram',
          cost: 10,
        },
        coinsOnCorrect: 30,
      },
      {
        id: 'g6-science-q4',
        narrative:
          'An ancient dungeon inscription reads: "Plants breathe water through their leaves, returning it to the sky."',
        question: 'What is the process called when plants release water vapour through their leaves?',
        options: ['Evaporation', 'Transpiration', 'Condensation', 'Percolation'],
        correctIndex: 1,
        clue: {
          title: 'Transpiration',
          explanation:
            'Transpiration is evaporation from plant leaves through tiny pores called stomata. Plants absorb water through roots, use some in photosynthesis, and release the rest as vapour. Together, evaporation and transpiration are called evapotranspiration.',
          visual: 'diagram',
          cost: 10,
        },
        coinsOnCorrect: 30,
      },
      {
        id: 'g6-science-q5',
        narrative:
          'The water spirit points to the Sun, saying it is the engine that powers the whole water cycle.',
        question: 'What is the PRIMARY energy source that drives the water cycle?',
        options: ['The Moon\'s gravity', 'Geothermal energy', 'The Sun\'s heat energy', 'Wind'],
        correctIndex: 2,
        clue: {
          title: 'Energy Source of the Water Cycle',
          explanation:
            'The Sun provides the heat energy that evaporates water from oceans and lakes, driving the entire water cycle. Gravity then pulls precipitation back to Earth. While the Moon drives tides and wind moves moisture, solar energy is the primary driver of evaporation.',
          visual: 'text',
          cost: 10,
        },
        coinsOnCorrect: 30,
      },
    ],
  },

  // ─── GRADE 7 · MATH: Algebra Expressions ──────────────────────────────────
  {
    id: 'g7-math',
    grade: 7,
    programme: 'MYP',
    subject: 'math',
    title: 'Algebra Expressions',
    realmName: 'Enchanted Forest',
    narrativeWorld:
      'In the Enchanted Forest, ancient trees inscribe algebraic runes on their bark. Only those who can simplify and substitute expressions may communicate with the forest spirits and open the hidden glade.',
    characterTeacher: 'Lord Algebros the Wise',
    teacherEmoji: '🧙',
    theme: 'wizard',
    coinReward: 150,
    boss: {
      id: 'g7-math-boss',
      title: 'The Rune Golem',
      villain: 'Golem of Variables',
      villainEmoji: '🗿',
      narrative:
        'The Golem of Variables blocks the path to the sacred glade. Its stone chest is sealed by an expression that must be simplified and then evaluated to reveal the magic number.',
      question:
        'Simplify: 3(2x + 4) − 2(x − 3). Then evaluate your simplified expression when x = 5.',
      answer:
        'Expand: 6x + 12 − 2x + 6. Collect like terms: (6x − 2x) + (12 + 6) = 4x + 18. Evaluate at x = 5: 4(5) + 18 = 20 + 18 = 38.',
      hints: [
        'Use the distributive law first: multiply 3 by each term inside the first bracket, and −2 by each term inside the second bracket. Be careful with signs when multiplying by −2.',
        'After expanding, identify the like terms — terms with x and constant terms — and add them separately.',
        'Once you have the simplified expression 4x + 18, substitute x = 5: replace x with 5 and calculate.',
      ],
      coinReward: 75,
    },
    questions: [
      {
        id: 'g7-math-q1',
        narrative:
          'An elf hands you a bark tablet reading "5x + 3x". She says combining these runes unlocks the first gate.',
        question: 'Simplify: 5x + 3x',
        equation: '5x + 3x = ?',
        options: ['8x²', '8x', '15x', '2x'],
        correctIndex: 1,
        clue: {
          title: 'Collecting Like Terms',
          explanation:
            'Like terms have the same variable to the same power. 5x and 3x both have x¹. Add the coefficients: 5 + 3 = 8. Keep the variable: answer is 8x. Do NOT add the exponents.',
          visual: 'text',
          cost: 10,
        },
        coinsOnCorrect: 30,
      },
      {
        id: 'g7-math-q2',
        narrative:
          'A forest wizard presents a scroll: "Find the value when the unknown rune x equals 4."',
        question: 'Evaluate 3x − 7 when x = 4.',
        equation: '3(4) - 7 = ?',
        options: ['5', '12', '7', '19'],
        correctIndex: 0,
        clue: {
          title: 'Substitution',
          explanation:
            'Replace x with 4: 3(4) − 7. Multiply first (order of operations): 12 − 7 = 5. The answer is 5.',
          visual: 'text',
          cost: 10,
        },
        coinsOnCorrect: 30,
      },
      {
        id: 'g7-math-q3',
        narrative:
          'Two enchanted potions have values 2x + 5 and x − 3. The wizard wants their combined power.',
        question: 'Add the expressions: (2x + 5) + (x − 3)',
        equation: '(2x + 5) + (x - 3) = ?',
        options: ['3x + 2', '3x + 8', 'x + 2', '3x − 2'],
        correctIndex: 0,
        clue: {
          title: 'Adding Expressions',
          explanation:
            'Remove the brackets (no sign change needed for addition): 2x + 5 + x − 3. Combine x terms: 2x + x = 3x. Combine constants: 5 − 3 = 2. Answer: 3x + 2.',
          visual: 'text',
          cost: 10,
        },
        coinsOnCorrect: 30,
      },
      {
        id: 'g7-math-q4',
        narrative:
          'A mischievous sprite hides behind a tree and says: "Expand my spell — 4(x + 3) — to reveal my name!"',
        question: 'Expand: 4(x + 3)',
        equation: '4(x + 3) = ?',
        options: ['4x + 3', 'x + 12', '4x + 12', '4x + 7'],
        correctIndex: 2,
        clue: {
          title: 'Distributive Law',
          explanation:
            'Multiply 4 by EACH term inside the bracket: 4 × x = 4x and 4 × 3 = 12. Write them together: 4x + 12.',
          visual: 'text',
          cost: 10,
        },
        coinsOnCorrect: 30,
      },
      {
        id: 'g7-math-q5',
        narrative:
          'The forest elder challenges you: "Which expression is equivalent to 6y − 2y + 4 − 9?"',
        question: 'Simplify: 6y − 2y + 4 − 9',
        equation: '6y - 2y + 4 - 9 = ?',
        options: ['4y − 5', '8y − 5', '4y + 13', '4y + 5'],
        correctIndex: 0,
        clue: {
          title: 'Simplifying with Multiple Terms',
          explanation:
            'Combine the y terms: 6y − 2y = 4y. Combine the constants: 4 − 9 = −5. Final answer: 4y − 5.',
          visual: 'text',
          cost: 10,
        },
        coinsOnCorrect: 30,
      },
    ],
  },

  // ─── GRADE 7 · SCIENCE: Cells & Life ──────────────────────────────────────
  {
    id: 'g7-science',
    grade: 7,
    programme: 'MYP',
    subject: 'science',
    title: 'Cells & Life',
    realmName: 'Enchanted Forest',
    narrativeWorld:
      'The Enchanted Forest is home to microscopic life in every dewdrop and leaf. Forest sages guard the secrets of the cell — the basic unit of all living things — and reward those who understand its structure.',
    characterTeacher: 'Sage Cytus the Tiny',
    teacherEmoji: '🔬',
    theme: 'wizard',
    coinReward: 150,
    boss: {
      id: 'g7-science-boss',
      title: 'The Membrane Minotaur',
      villain: 'Minotaur Membranix',
      villainEmoji: '🐂',
      narrative:
        'Minotaur Membranix has confused animal and plant cells, causing chaos in the forest. You must identify the key differences to restore order.',
      question:
        'List THREE structures found in a plant cell that are NOT found in a typical animal cell, and state the function of each.',
      answer:
        '1. Cell wall (made of cellulose) — provides rigid support and shape to the cell. 2. Chloroplasts — contain chlorophyll and carry out photosynthesis to make glucose from sunlight, CO₂, and water. 3. Large central vacuole — stores water and maintains turgor pressure, keeping the plant upright.',
      hints: [
        'Think about how a plant cell keeps its firm shape even without a skeleton — there is a structure outside the cell membrane that animal cells lack.',
        'Plants make their own food using sunlight. Which organelle contains the green pigment that captures light energy?',
        'Plants can stand upright even when they are soft. This is because one organelle stores water and pushes against the cell wall. What is it called?',
      ],
      coinReward: 75,
    },
    questions: [
      {
        id: 'g7-science-q1',
        narrative:
          'A forest sprite peers through a magic lens and announces: "Every living thing is made of these tiny units!"',
        question: 'What is the basic structural and functional unit of all living organisms?',
        options: ['Atom', 'Tissue', 'Cell', 'Organ'],
        correctIndex: 2,
        clue: {
          title: 'The Cell Theory',
          explanation:
            'Cell theory states: (1) all living things are made of cells, (2) the cell is the basic unit of life, and (3) all cells come from pre-existing cells. Atoms are not alive; tissues and organs are made of many cells.',
          visual: 'text',
          cost: 10,
        },
        coinsOnCorrect: 30,
      },
      {
        id: 'g7-science-q2',
        narrative:
          'The sage points to a glowing blue orb inside a cell diagram. "This controls everything the cell does!"',
        question: 'Which organelle controls the activities of the cell and contains DNA?',
        options: ['Mitochondria', 'Nucleus', 'Ribosome', 'Vacuole'],
        correctIndex: 1,
        clue: {
          title: 'The Nucleus',
          explanation:
            'The nucleus is the control centre of the cell. It contains chromosomes (DNA) that carry genetic instructions. These instructions direct all cell activities. The nuclear membrane separates it from the cytoplasm.',
          visual: 'diagram',
          cost: 10,
        },
        coinsOnCorrect: 30,
      },
      {
        id: 'g7-science-q3',
        narrative:
          'An elf warrior whispers: "These little power stations keep me energised for every forest battle."',
        question: 'Which organelle is known as the "powerhouse of the cell" and produces ATP energy through respiration?',
        options: ['Chloroplast', 'Golgi body', 'Mitochondria', 'Lysosome'],
        correctIndex: 2,
        clue: {
          title: 'Mitochondria',
          explanation:
            'Mitochondria carry out aerobic respiration: glucose + oxygen → carbon dioxide + water + ATP energy. All cells that need energy have mitochondria. The more active a cell, the more mitochondria it has (e.g., muscle cells).',
          visual: 'diagram',
          cost: 10,
        },
        coinsOnCorrect: 30,
      },
      {
        id: 'g7-science-q4',
        narrative:
          'A forest botanist shows you two cells under a lens. One has rigid green structures and a box-like shape.',
        question: 'Which structure gives a plant cell its rigid, box-like shape and is NOT found in animal cells?',
        options: ['Cell membrane', 'Cell wall', 'Nucleus', 'Cytoplasm'],
        correctIndex: 1,
        clue: {
          title: 'Cell Wall',
          explanation:
            'The cell wall is made of cellulose (a strong carbohydrate). It surrounds the cell membrane in plant cells, giving them a fixed rectangular shape. Animal cells have only a flexible cell membrane and are usually rounded.',
          visual: 'diagram',
          cost: 10,
        },
        coinsOnCorrect: 30,
      },
      {
        id: 'g7-science-q5',
        narrative:
          'The sage Cytus asks you to prove you know the difference between living and non-living things.',
        question: 'Which of the following is a characteristic shared by ALL living organisms?',
        options: [
          'They all have a cell wall',
          'They all carry out photosynthesis',
          'They all reproduce and respond to stimuli',
          'They all have a nucleus',
        ],
        correctIndex: 2,
        clue: {
          title: 'Characteristics of Living Things (MRS GREN)',
          explanation:
            'All living things share: Movement, Respiration, Sensitivity (respond to stimuli), Growth, Reproduction, Excretion, Nutrition. Not all have a nucleus (bacteria have none), cell wall (animal cells lack one), or perform photosynthesis (only plants and some bacteria).',
          visual: 'text',
          cost: 10,
        },
        coinsOnCorrect: 30,
      },
    ],
  },

  // ─── GRADE 8 · MATH: Geometry & Area ──────────────────────────────────────
  {
    id: 'g8-math',
    grade: 8,
    programme: 'MYP',
    subject: 'math',
    title: 'Geometry & Area',
    realmName: 'Crystal Caverns',
    narrativeWorld:
      'The Crystal Caverns are filled with perfectly shaped gems — triangles, circles, and quadrilaterals — each holding a magical charge proportional to its area and perimeter. A geometer knight guards the deepest chamber.',
    characterTeacher: 'Sir Perimeter the Precise',
    teacherEmoji: '📐',
    theme: 'dungeon',
    coinReward: 150,
    boss: {
      id: 'g8-math-boss',
      title: 'The Circle Sorcerer',
      villain: 'Archmage Circulus',
      villainEmoji: '🔮',
      narrative:
        'Archmage Circulus seals the crystal vault with a circular lock. To open it you must calculate both the area and the circumference of the lock, whose radius is 7 cm.',
      question:
        'A circle has a radius of 7 cm. Calculate: (a) its area, and (b) its circumference. Use π ≈ 3.14 and give answers to 2 decimal places.',
      answer:
        '(a) Area = πr² = 3.14 × 7² = 3.14 × 49 = 153.86 cm². (b) Circumference = 2πr = 2 × 3.14 × 7 = 43.96 cm.',
      hints: [
        'For the area, use the formula A = πr². First square the radius (7² = 49), then multiply by π ≈ 3.14.',
        'For the circumference, use C = 2πr. Multiply 2 × π × r. The circumference is the distance all the way around the circle.',
        'Check your units: area is in cm² (square centimetres) and circumference is in cm (centimetres).',
      ],
      coinReward: 75,
    },
    questions: [
      {
        id: 'g8-math-q1',
        narrative:
          'A glowing rectangular crystal is 8 cm long and 5 cm wide. You need its area to activate it.',
        question: 'What is the area of a rectangle with length 8 cm and width 5 cm?',
        equation: 'A = l × w = 8 × 5',
        options: ['26 cm²', '40 cm²', '13 cm²', '30 cm²'],
        correctIndex: 1,
        clue: {
          title: 'Area of a Rectangle',
          explanation:
            'Area of a rectangle = length × width = 8 × 5 = 40 cm². Area measures the space inside the shape. The unit is always squared (cm², m², etc.).',
          visual: 'diagram',
          cost: 10,
        },
        coinsOnCorrect: 30,
      },
      {
        id: 'g8-math-q2',
        narrative:
          'A triangular crystal shard has a base of 10 cm and a height of 6 cm. Calculate its magical area.',
        question: 'What is the area of a triangle with base 10 cm and height 6 cm?',
        equation: 'A = ½ × b × h = ½ × 10 × 6',
        options: ['60 cm²', '16 cm²', '30 cm²', '120 cm²'],
        correctIndex: 2,
        clue: {
          title: 'Area of a Triangle',
          explanation:
            'Area of a triangle = ½ × base × height = ½ × 10 × 6 = ½ × 60 = 30 cm². The height must be perpendicular (at 90°) to the base.',
          visual: 'diagram',
          cost: 10,
        },
        coinsOnCorrect: 30,
      },
      {
        id: 'g8-math-q3',
        narrative:
          'A circular portal in the cavern has a radius of 5 cm. Calculate the area to unlock it. Use π ≈ 3.14.',
        question: 'What is the area of a circle with radius 5 cm? (Use π = 3.14)',
        equation: 'A = π × r² = 3.14 × 5²',
        options: ['31.4 cm²', '78.5 cm²', '15.7 cm²', '25 cm²'],
        correctIndex: 1,
        clue: {
          title: 'Area of a Circle',
          explanation:
            'Area of a circle = πr². Square the radius first: 5² = 25. Then multiply by π: 3.14 × 25 = 78.5 cm².',
          visual: 'diagram',
          cost: 10,
        },
        coinsOnCorrect: 30,
      },
      {
        id: 'g8-math-q4',
        narrative:
          'A crystal fence surrounds a rectangular gem display that is 9 cm × 4 cm. How much fencing is needed?',
        question: 'What is the perimeter of a rectangle with length 9 cm and width 4 cm?',
        equation: 'P = 2(l + w) = 2(9 + 4)',
        options: ['36 cm', '26 cm', '52 cm', '13 cm'],
        correctIndex: 1,
        clue: {
          title: 'Perimeter of a Rectangle',
          explanation:
            'Perimeter = 2 × (length + width) = 2 × (9 + 4) = 2 × 13 = 26 cm. Perimeter is the total distance around the outside of a shape.',
          visual: 'diagram',
          cost: 10,
        },
        coinsOnCorrect: 30,
      },
      {
        id: 'g8-math-q5',
        narrative:
          'Sir Perimeter shows you a composite shape: a rectangle (6 cm × 4 cm) with a triangle (base 6 cm, height 3 cm) sitting on top.',
        question: 'What is the TOTAL area of the composite shape (rectangle + triangle)?',
        equation: 'A = (6×4) + (½×6×3)',
        options: ['33 cm²', '24 cm²', '9 cm²', '42 cm²'],
        correctIndex: 0,
        clue: {
          title: 'Area of Composite Shapes',
          explanation:
            'Split into parts. Rectangle: 6 × 4 = 24 cm². Triangle: ½ × 6 × 3 = 9 cm². Total: 24 + 9 = 33 cm².',
          visual: 'diagram',
          cost: 10,
        },
        coinsOnCorrect: 30,
      },
    ],
  },

  // ─── GRADE 8 · SCIENCE: Elements & Atoms ──────────────────────────────────
  {
    id: 'g8-science',
    grade: 8,
    programme: 'MYP',
    subject: 'science',
    title: 'Elements & Atoms',
    realmName: 'Crystal Caverns',
    narrativeWorld:
      'Deep in the Crystal Caverns, each crystal is a pure element — gold, carbon, iron. An ancient alchemist guards the Periodic Table of Mystical Elements and will only reveal the secrets of atomic structure to worthy scholars.',
    characterTeacher: 'Alchemist Atomikos',
    teacherEmoji: '⚗️',
    theme: 'dungeon',
    coinReward: 150,
    boss: {
      id: 'g8-science-boss',
      title: 'The Electron Wraith',
      villain: 'Baron Nucleus von Atom',
      villainEmoji: '⚛️',
      narrative:
        'Baron Nucleus has disrupted the electron shells of carbon and oxygen. Restore the atomic structures by answering his challenge about electronic configuration.',
      question:
        'Carbon has atomic number 6 and mass number 12. (a) How many protons, neutrons, and electrons does a neutral carbon atom have? (b) Draw the electron shell configuration of carbon.',
      answer:
        '(a) Protons = atomic number = 6. Electrons = protons (neutral atom) = 6. Neutrons = mass number − atomic number = 12 − 6 = 6. (b) Electron configuration: Shell 1 (innermost) holds 2 electrons; Shell 2 holds the remaining 4 electrons. Written as 2, 4.',
      hints: [
        'The atomic number tells you the number of protons. In a neutral atom, the number of electrons equals the number of protons.',
        'To find neutrons: subtract the atomic number from the mass number. Mass number = protons + neutrons.',
        'Electrons fill shells from the inside out. The first shell holds a maximum of 2 electrons. The second shell holds up to 8. Fill shell 1 first, then place remaining electrons in shell 2.',
      ],
      coinReward: 75,
    },
    questions: [
      {
        id: 'g8-science-q1',
        narrative:
          'Alchemist Atomikos holds up a glowing crystal and says: "All matter is made of these indivisible building blocks!"',
        question: 'What is the smallest unit of an element that retains the chemical properties of that element?',
        options: ['Molecule', 'Atom', 'Electron', 'Compound'],
        correctIndex: 1,
        clue: {
          title: 'The Atom',
          explanation:
            'An atom is the smallest particle of an element that has the chemical properties of that element. It contains a nucleus (protons + neutrons) surrounded by electrons. Molecules are groups of atoms bonded together.',
          visual: 'diagram',
          cost: 10,
        },
        coinsOnCorrect: 30,
      },
      {
        id: 'g8-science-q2',
        narrative:
          'A periodic table inscription glows on the cavern wall. The number at the top of each box is highlighted.',
        question: 'What does the atomic number of an element tell you?',
        options: [
          'The number of neutrons in the nucleus',
          'The total mass of the atom',
          'The number of protons in the nucleus',
          'The number of electron shells',
        ],
        correctIndex: 2,
        clue: {
          title: 'Atomic Number',
          explanation:
            'The atomic number is the number of protons in the nucleus. It defines what element it is — no two elements have the same atomic number. In a neutral atom, it also equals the number of electrons.',
          visual: 'diagram',
          cost: 10,
        },
        coinsOnCorrect: 30,
      },
      {
        id: 'g8-science-q3',
        narrative:
          'The alchemist writes on his scroll: "Sodium has atomic number 11 and mass number 23. How many neutrons?"',
        question: 'How many neutrons does a sodium atom (atomic number 11, mass number 23) have?',
        equation: 'Neutrons = mass number - atomic number',
        options: ['11', '23', '12', '34'],
        correctIndex: 2,
        clue: {
          title: 'Calculating Neutrons',
          explanation:
            'Neutrons = mass number − atomic number = 23 − 11 = 12. The mass number is the total count of protons + neutrons in the nucleus. Electrons are not included in mass number because they have negligible mass.',
          visual: 'text',
          cost: 10,
        },
        coinsOnCorrect: 30,
      },
      {
        id: 'g8-science-q4',
        narrative:
          'Baron Nucleus challenges a young apprentice: "What are elements in the same GROUP of the periodic table known for?"',
        question: 'Elements in the same GROUP (vertical column) of the periodic table have:',
        options: [
          'The same number of protons',
          'The same number of electron shells',
          'The same number of electrons in their outer shell',
          'The same mass number',
        ],
        correctIndex: 2,
        clue: {
          title: 'Groups in the Periodic Table',
          explanation:
            'Elements in the same group have the same number of valence electrons (electrons in their outer shell). This gives them similar chemical properties. For example, all Group 1 elements (Li, Na, K) have 1 valence electron and react similarly with water.',
          visual: 'diagram',
          cost: 10,
        },
        coinsOnCorrect: 30,
      },
      {
        id: 'g8-science-q5',
        narrative:
          'A crystal glows red. Alchemist Atomikos identifies it as a metal. The alchemist asks you to identify a property of metals.',
        question: 'Which of the following is a physical property of most metals?',
        options: [
          'They are brittle and dull',
          'They are good conductors of heat and electricity',
          'They have low melting points',
          'They are transparent to light',
        ],
        correctIndex: 1,
        clue: {
          title: 'Properties of Metals',
          explanation:
            'Metals are generally: good conductors of heat and electricity (free electrons), shiny (lustrous), malleable (can be hammered into sheets), ductile (can be drawn into wires), and have high melting points. Non-metals tend to be poor conductors and brittle.',
          visual: 'text',
          cost: 10,
        },
        coinsOnCorrect: 30,
      },
    ],
  },

  // ─── GRADE 9 · MATH: Linear Equations ─────────────────────────────────────
  {
    id: 'g9-math',
    grade: 9,
    programme: 'MYP',
    subject: 'math',
    title: 'Linear Equations',
    realmName: 'Pirate Archipelago',
    narrativeWorld:
      'In the Pirate Archipelago, every treasure map uses linear equations to mark X. Captains who cannot solve for x are doomed to sail forever without finding gold. The legendary Captain Equatus guards the biggest prize.',
    characterTeacher: 'Captain Equatus',
    teacherEmoji: '🏴‍☠️',
    theme: 'pirate',
    coinReward: 150,
    boss: {
      id: 'g9-math-boss',
      title: 'The Kraken of Unknowns',
      villain: 'Kraken Variablex',
      villainEmoji: '🦑',
      narrative:
        'The Kraken wraps its tentacles around the treasure chest, sealed with a simultaneous equation. Solve the system to make it release the gold.',
      question:
        'Solve the simultaneous equations: 2x + y = 10 and x − y = 2. Find both x and y.',
      answer:
        'Add the two equations to eliminate y: (2x + y) + (x − y) = 10 + 2 → 3x = 12 → x = 4. Substitute x = 4 into x − y = 2: 4 − y = 2 → y = 2.',
      hints: [
        'Notice that one equation has +y and the other has −y. If you add the two equations together, the y terms cancel out.',
        'After adding: 2x + x = 3x on the left, and 10 + 2 = 12 on the right. Solve 3x = 12.',
        'Once you know x, substitute it into either original equation to find y. Check your answer in both equations.',
      ],
      coinReward: 75,
    },
    questions: [
      {
        id: 'g9-math-q1',
        narrative:
          'A treasure map says "x paces north plus 3 equals 11 paces total". Solve for x to find the landing point.',
        question: 'Solve: x + 3 = 11',
        equation: 'x + 3 = 11',
        options: ['x = 7', 'x = 8', 'x = 14', 'x = 33'],
        correctIndex: 1,
        clue: {
          title: 'Solving One-Step Equations',
          explanation:
            'To isolate x, perform the inverse operation. The +3 on the left becomes −3 on both sides: x = 11 − 3 = 8. Check: 8 + 3 = 11 ✓',
          visual: 'text',
          cost: 10,
        },
        coinsOnCorrect: 30,
      },
      {
        id: 'g9-math-q2',
        narrative:
          'Captain Equatus draws a map clue: "Three times the unknown equals 21 paces to the buried chest."',
        question: 'Solve: 3x = 21',
        equation: '3x = 21',
        options: ['x = 63', 'x = 18', 'x = 7', 'x = 24'],
        correctIndex: 2,
        clue: {
          title: 'Solving by Division',
          explanation:
            'Divide both sides by 3 to isolate x: x = 21 ÷ 3 = 7. Check: 3 × 7 = 21 ✓',
          visual: 'text',
          cost: 10,
        },
        coinsOnCorrect: 30,
      },
      {
        id: 'g9-math-q3',
        narrative:
          'A pirate scroll reads: "Two times the hidden value, minus five, equals thirteen." Decode the value.',
        question: 'Solve: 2x − 5 = 13',
        equation: '2x - 5 = 13',
        options: ['x = 4', 'x = 9', 'x = 18', 'x = 6'],
        correctIndex: 1,
        clue: {
          title: 'Two-Step Equations',
          explanation:
            'Step 1 — add 5 to both sides: 2x = 18. Step 2 — divide both sides by 2: x = 9. Check: 2(9) − 5 = 18 − 5 = 13 ✓',
          visual: 'text',
          cost: 10,
        },
        coinsOnCorrect: 30,
      },
      {
        id: 'g9-math-q4',
        narrative:
          'The ship\'s log says: "I have 5 more gold coins than my first mate. Together we have 37 coins. How many do I have?"',
        question:
          'If the first mate has x coins and the captain has (x + 5) coins, and together they have 37, solve for x and state how many the captain has.',
        equation: 'x + (x + 5) = 37',
        options: [
          'x = 16, captain has 21',
          'x = 21, captain has 26',
          'x = 18, captain has 23',
          'x = 14, captain has 19',
        ],
        correctIndex: 0,
        clue: {
          title: 'Word Problems with Linear Equations',
          explanation:
            'Combine like terms: 2x + 5 = 37. Subtract 5: 2x = 32. Divide by 2: x = 16. Captain = 16 + 5 = 21. Check: 16 + 21 = 37 ✓',
          visual: 'text',
          cost: 10,
        },
        coinsOnCorrect: 30,
      },
      {
        id: 'g9-math-q5',
        narrative:
          'The treasure map shows an equation with x on both sides: "4x − 2 = 2x + 8". Solve it to find the final coordinates.',
        question: 'Solve: 4x − 2 = 2x + 8',
        equation: '4x - 2 = 2x + 8',
        options: ['x = 3', 'x = 5', 'x = 10', 'x = 2'],
        correctIndex: 1,
        clue: {
          title: 'Equations with Variables on Both Sides',
          explanation:
            'Subtract 2x from both sides: 2x − 2 = 8. Add 2 to both sides: 2x = 10. Divide by 2: x = 5. Check: 4(5) − 2 = 18, and 2(5) + 8 = 18 ✓',
          visual: 'text',
          cost: 10,
        },
        coinsOnCorrect: 30,
      },
    ],
  },

  // ─── GRADE 9 · SCIENCE: Electricity ───────────────────────────────────────
  {
    id: 'g9-science',
    grade: 9,
    programme: 'MYP',
    subject: 'science',
    title: 'Electricity',
    realmName: 'Pirate Archipelago',
    narrativeWorld:
      'In the Pirate Archipelago, every ship runs on lightning-harnessed circuits. The Circuit Knight patrols the electrical waters, teaching brave pirates to tame voltage, current, and resistance using Ohm\'s law.',
    characterTeacher: 'Circuit Knight Volta',
    teacherEmoji: '⚡',
    theme: 'pirate',
    coinReward: 150,
    boss: {
      id: 'g9-science-boss',
      title: 'The Resistance Reef',
      villain: 'Admiral Ohm the Obstructor',
      villainEmoji: '🔌',
      narrative:
        'Admiral Ohm has wired the harbour in a parallel circuit and refuses to let any ship pass until you calculate the total resistance and current of his circuit.',
      question:
        'Two resistors R₁ = 6 Ω and R₂ = 3 Ω are connected in PARALLEL across a 12 V battery. (a) Calculate the total resistance. (b) Calculate the total current from the battery.',
      answer:
        '(a) For parallel: 1/R_total = 1/R₁ + 1/R₂ = 1/6 + 1/3 = 1/6 + 2/6 = 3/6 = 1/2, so R_total = 2 Ω. (b) I = V/R = 12/2 = 6 A.',
      hints: [
        'For resistors in parallel, use the formula: 1/R_total = 1/R₁ + 1/R₂. Find a common denominator to add the fractions.',
        'After finding 1/R_total as a fraction, flip it to get R_total.',
        'Once you have R_total, apply Ohm\'s law: I = V/R, where V = 12 V.',
      ],
      coinReward: 75,
    },
    questions: [
      {
        id: 'g9-science-q1',
        narrative:
          'Circuit Knight Volta shows you a glowing lantern powered by a battery. "What drives the electric charges through the wire?" she asks.',
        question: 'What is VOLTAGE (potential difference) in an electric circuit?',
        options: [
          'The rate of flow of electric charge',
          'The opposition to current flow',
          'The energy transferred per unit charge (driving force)',
          'The total charge stored in the battery',
        ],
        correctIndex: 2,
        clue: {
          title: 'Voltage (Potential Difference)',
          explanation:
            'Voltage (V) is the energy transferred per unit of electric charge — it is the "push" that drives current through a circuit. Measured in volts (V). Current is the rate of flow of charge. Resistance is opposition to current.',
          visual: 'text',
          cost: 10,
        },
        coinsOnCorrect: 30,
      },
      {
        id: 'g9-science-q2',
        narrative:
          'A ship\'s lantern has a resistance of 10 Ω and the battery provides 20 V. "What current flows?" asks the knight.',
        question: 'Using Ohm\'s Law (V = IR), what is the current when V = 20 V and R = 10 Ω?',
        equation: 'I = V ÷ R = 20 ÷ 10',
        options: ['0.5 A', '200 A', '2 A', '30 A'],
        correctIndex: 2,
        clue: {
          title: 'Ohm\'s Law',
          explanation:
            'Ohm\'s Law: V = I × R. Rearrange to find current: I = V/R = 20/10 = 2 A. Voltage is in volts (V), current in amperes (A), resistance in ohms (Ω).',
          visual: 'text',
          cost: 10,
        },
        coinsOnCorrect: 30,
      },
      {
        id: 'g9-science-q3',
        narrative:
          'Two cannon ports are wired in SERIES. "How does the total resistance compare to each individual resistance?" the knight asks.',
        question: 'In a SERIES circuit with two resistors R₁ = 4 Ω and R₂ = 6 Ω, what is the total resistance?',
        equation: 'R_total = R₁ + R₂ = 4 + 6',
        options: ['2.4 Ω', '24 Ω', '10 Ω', '5 Ω'],
        correctIndex: 2,
        clue: {
          title: 'Series Resistance',
          explanation:
            'In a series circuit, resistors are added directly: R_total = R₁ + R₂ = 4 + 6 = 10 Ω. Current has only one path, so it must pass through all resistors one by one.',
          visual: 'diagram',
          cost: 10,
        },
        coinsOnCorrect: 30,
      },
      {
        id: 'g9-science-q4',
        narrative:
          'A pirate ship\'s electrical map shows lights wired so that when one light breaks, the others stay on.',
        question: 'In which type of circuit do components have MULTIPLE paths for current to flow, so one broken component does not stop others?',
        options: ['Series circuit', 'Parallel circuit', 'Open circuit', 'Short circuit'],
        correctIndex: 1,
        clue: {
          title: 'Parallel Circuits',
          explanation:
            'In a parallel circuit, each component is connected across the same voltage source with its own branch. If one branch breaks, current can still flow through the others. This is why household lights are wired in parallel.',
          visual: 'diagram',
          cost: 10,
        },
        coinsOnCorrect: 30,
      },
      {
        id: 'g9-science-q5',
        narrative:
          'Circuit Knight Volta points to a cable that gets warm when current flows. "What converts electrical energy to heat?" she asks.',
        question: 'What is electrical RESISTANCE, and what does a higher resistance do to current (at constant voltage)?',
        options: [
          'Resistance increases current flow; higher resistance means more current',
          'Resistance opposes current; higher resistance means less current (I = V/R)',
          'Resistance stores charge; it has no effect on current',
          'Resistance measures voltage; it is unrelated to current',
        ],
        correctIndex: 1,
        clue: {
          title: 'Resistance and Current',
          explanation:
            'Resistance (R, measured in ohms Ω) opposes the flow of current. From Ohm\'s law, I = V/R: if R increases and V stays the same, I decreases. Higher resistance → less current. Materials like rubber have high resistance; metals like copper have low resistance.',
          visual: 'text',
          cost: 10,
        },
        coinsOnCorrect: 30,
      },
    ],
  },

  // ─── GRADE 10 · MATH: Trigonometry ────────────────────────────────────────
  {
    id: 'g10-math',
    grade: 10,
    programme: 'MYP',
    subject: 'math',
    title: 'Trigonometry',
    realmName: 'Sky Fortress',
    narrativeWorld:
      'High in the clouds, the Sky Fortress is built on triangular platforms whose angles hold magical power. The Trigonometry Titan guards the highest spire, challenging all climbers to master sin, cos, and tan before they can ascend.',
    characterTeacher: 'Trigon the Sky Titan',
    teacherEmoji: '📏',
    theme: 'pirate',
    coinReward: 150,
    boss: {
      id: 'g10-math-boss',
      title: 'The Hypotenuse Hydra',
      villain: 'Hydra Angularis',
      villainEmoji: '🐍',
      narrative:
        'Hydra Angularis coils around the sky spire. Its weak point can only be struck if you calculate the exact height of the spire using trigonometry.',
      question:
        'A rope stretches from the ground to the top of the sky spire at an angle of 35° from the ground. The rope is 50 m long. Calculate: (a) the height of the spire (opposite side), and (b) the horizontal distance from the base (adjacent side). Use sin 35° ≈ 0.574 and cos 35° ≈ 0.819.',
      answer:
        '(a) Height = hypotenuse × sin θ = 50 × 0.574 = 28.7 m. (b) Horizontal distance = hypotenuse × cos θ = 50 × 0.819 = 40.95 m ≈ 41.0 m.',
      hints: [
        'Identify the sides relative to the 35° angle: the rope is the hypotenuse. The height (spire) is opposite the angle. The ground distance is adjacent to the angle.',
        'To find the opposite side, use sin: sin θ = opposite/hypotenuse. Rearrange: opposite = hypotenuse × sin θ.',
        'To find the adjacent side, use cos: cos θ = adjacent/hypotenuse. Rearrange: adjacent = hypotenuse × cos θ.',
      ],
      coinReward: 75,
    },
    questions: [
      {
        id: 'g10-math-q1',
        narrative:
          'Trigon the Sky Titan stands atop the fortress. "Name the three basic trigonometric ratios for a right triangle, young climber!"',
        question:
          'In a right triangle, if θ is one of the non-right angles, which of the following correctly defines sin θ?',
        options: [
          'sin θ = adjacent / hypotenuse',
          'sin θ = opposite / hypotenuse',
          'sin θ = opposite / adjacent',
          'sin θ = hypotenuse / opposite',
        ],
        correctIndex: 1,
        clue: {
          title: 'SOH CAH TOA',
          explanation:
            'Remember SOH-CAH-TOA: Sin = Opposite/Hypotenuse, Cos = Adjacent/Hypotenuse, Tan = Opposite/Adjacent. The hypotenuse is always the longest side, opposite the right angle.',
          visual: 'diagram',
          cost: 10,
        },
        coinsOnCorrect: 30,
      },
      {
        id: 'g10-math-q2',
        narrative:
          'A bridge from one cloud platform to another makes a right triangle. The adjacent side is 12 m and the hypotenuse is 13 m.',
        question: 'What is cos θ if adjacent = 12 m and hypotenuse = 13 m?',
        equation: 'cos θ = adjacent / hypotenuse = 12/13',
        options: ['12/13 ≈ 0.923', '5/13 ≈ 0.385', '12/5 = 2.4', '13/12 ≈ 1.083'],
        correctIndex: 0,
        clue: {
          title: 'Cosine Ratio',
          explanation:
            'cos θ = adjacent/hypotenuse = 12/13 ≈ 0.923. The adjacent side is next to the angle θ (but not the hypotenuse). The hypotenuse is always opposite the right angle.',
          visual: 'diagram',
          cost: 10,
        },
        coinsOnCorrect: 30,
      },
      {
        id: 'g10-math-q3',
        narrative:
          'The Titan points to a sky ramp: opposite side = 7 m, adjacent side = 7 m. "What is tan θ?" he bellows.',
        question: 'What is tan θ if opposite = 7 m and adjacent = 7 m?',
        equation: 'tan θ = opposite / adjacent = 7/7',
        options: ['0', '2', '1', '49'],
        correctIndex: 2,
        clue: {
          title: 'Tangent Ratio',
          explanation:
            'tan θ = opposite/adjacent = 7/7 = 1. When tan θ = 1, the angle θ = 45°. This is a special right triangle where the two legs are equal.',
          visual: 'diagram',
          cost: 10,
        },
        coinsOnCorrect: 30,
      },
      {
        id: 'g10-math-q4',
        narrative:
          'A sky ladder leans against a wall. The angle from the ground is 60°. The ladder is 10 m long. Use sin 60° ≈ 0.866.',
        question: 'How high up the wall does the 10 m ladder reach? (angle = 60° from the ground)',
        equation: 'height = hypotenuse × sin 60° = 10 × 0.866',
        options: ['8.66 m', '5.00 m', '11.55 m', '6.00 m'],
        correctIndex: 0,
        clue: {
          title: 'Finding the Opposite Side',
          explanation:
            'The height is opposite to 60°, and the ladder (10 m) is the hypotenuse. sin θ = opposite/hypotenuse → opposite = hypotenuse × sin θ = 10 × 0.866 = 8.66 m.',
          visual: 'diagram',
          cost: 10,
        },
        coinsOnCorrect: 30,
      },
      {
        id: 'g10-math-q5',
        narrative:
          'The Titan sets a final test: a triangular turret whose height is 9 m and base (adjacent) is 12 m. "Find the angle at the base!"',
        question:
          'In a right triangle, opposite = 9 m and adjacent = 12 m. What is the value of tan θ, and which angle does tan θ = 0.75 correspond to (use inverse tan)?',
        equation: 'tan θ = 9/12 = 0.75, θ = tan⁻¹(0.75)',
        options: [
          'tan θ = 1.33, θ ≈ 53°',
          'tan θ = 0.75, θ ≈ 36.87°',
          'tan θ = 0.75, θ ≈ 45°',
          'tan θ = 0.75, θ ≈ 60°',
        ],
        correctIndex: 1,
        clue: {
          title: 'Finding an Angle with Inverse Tan',
          explanation:
            'tan θ = opposite/adjacent = 9/12 = 0.75. To find θ, use the inverse tangent: θ = tan⁻¹(0.75) ≈ 36.87°. This is one of the standard angles in a 3-4-5 right triangle scaled up (9-12-15).',
          visual: 'diagram',
          cost: 10,
        },
        coinsOnCorrect: 30,
      },
    ],
  },

  // ─── GRADE 10 · SCIENCE: Human Body ───────────────────────────────────────
  {
    id: 'g10-science',
    grade: 10,
    programme: 'MYP',
    subject: 'science',
    title: 'Human Body',
    realmName: 'Sky Fortress',
    narrativeWorld:
      'At the pinnacle of the Sky Fortress, the Body Warden — an ancient guardian who built her fortress in the shape of the human body — tests all who seek the secrets of organ systems and the delicate balance called homeostasis.',
    characterTeacher: 'Body Warden Soma',
    teacherEmoji: '🫀',
    theme: 'dungeon',
    coinReward: 150,
    boss: {
      id: 'g10-science-boss',
      title: 'The Homeostasis Hydra',
      villain: 'Hydra Thermoregulus',
      villainEmoji: '🌡️',
      narrative:
        'Hydra Thermoregulus has disrupted the body\'s temperature control. Explain the negative feedback mechanism that returns body temperature to normal when it rises above 37 °C.',
      question:
        'Describe the negative feedback process your body uses to reduce body temperature when it rises above normal (37 °C). Name the detector, the control centre, the effectors, and the response.',
      answer:
        'Detector: thermoreceptors in the skin and hypothalamus detect the temperature rise. Control centre: the hypothalamus (in the brain) processes the signal. Effectors: sweat glands and blood vessels in the skin. Response: (1) sweat glands produce sweat — evaporation cools the skin; (2) vasodilation — blood vessels near the skin surface widen, increasing blood flow and heat loss by radiation. These responses lower temperature back to 37 °C, completing the negative feedback loop.',
      hints: [
        'Negative feedback means the response opposes the change — if temperature goes up, the body acts to bring it back down. What structure in the brain acts as the body\'s thermostat?',
        'The skin has two main ways to lose heat. One involves a liquid that evaporates from the skin surface. The other involves blood vessels changing diameter.',
        'Think about vasodilation vs vasoconstriction. Which one brings more blood to the skin surface to release heat?',
      ],
      coinReward: 75,
    },
    questions: [
      {
        id: 'g10-science-q1',
        narrative:
          'Body Warden Soma welcomes you to the fortress shaped like a giant body. "First lesson — which system pumps life throughout every corridor?"',
        question: 'Which organ system pumps blood and distributes oxygen and nutrients to all body cells?',
        options: ['Respiratory system', 'Circulatory system', 'Digestive system', 'Nervous system'],
        correctIndex: 1,
        clue: {
          title: 'The Circulatory System',
          explanation:
            'The circulatory system consists of the heart, blood vessels (arteries, veins, capillaries), and blood. The heart pumps blood carrying oxygen (from lungs) and nutrients (from digestion) to all cells, and collects carbon dioxide and waste for removal.',
          visual: 'diagram',
          cost: 10,
        },
        coinsOnCorrect: 30,
      },
      {
        id: 'g10-science-q2',
        narrative:
          'The Warden points to a corridor lined with millions of tiny air sacs. "Gas exchange happens here, in these structures!"',
        question: 'What are the tiny air sacs in the lungs where oxygen enters the blood and carbon dioxide leaves?',
        options: ['Bronchioles', 'Trachea', 'Alveoli', 'Bronchi'],
        correctIndex: 2,
        clue: {
          title: 'Alveoli',
          explanation:
            'Alveoli (singular: alveolus) are tiny, thin-walled air sacs in the lungs surrounded by capillaries. Their large surface area and thin walls allow rapid diffusion: O₂ moves into blood, CO₂ moves into alveoli to be exhaled.',
          visual: 'diagram',
          cost: 10,
        },
        coinsOnCorrect: 30,
      },
      {
        id: 'g10-science-q3',
        narrative:
          'A sky sentinel controls the fortress\'s temperature perfectly, always returning to exactly 37 °C no matter the weather.',
        question: 'What is the term for the body\'s ability to maintain a stable internal environment despite external changes?',
        options: ['Metabolism', 'Homeostasis', 'Osmoregulation', 'Thermoregulation'],
        correctIndex: 1,
        clue: {
          title: 'Homeostasis',
          explanation:
            'Homeostasis is the process of maintaining a constant internal environment. Examples include regulating body temperature (37 °C), blood glucose level, blood pH, and water balance. It uses negative feedback mechanisms via the nervous and endocrine systems.',
          visual: 'text',
          cost: 10,
        },
        coinsOnCorrect: 30,
      },
      {
        id: 'g10-science-q4',
        narrative:
          'After a long battle, a warrior\'s muscles ache. "Your muscles need glucose," the Warden says. Which system brought it to them?',
        question: 'Which organ is responsible for producing digestive enzymes that break down carbohydrates, proteins, and fats in the small intestine?',
        options: ['Stomach', 'Liver', 'Pancreas', 'Kidney'],
        correctIndex: 2,
        clue: {
          title: 'The Pancreas',
          explanation:
            'The pancreas produces digestive enzymes (lipase for fats, protease for proteins, amylase for carbohydrates) released into the small intestine. It also produces insulin and glucagon to regulate blood glucose — an endocrine function.',
          visual: 'diagram',
          cost: 10,
        },
        coinsOnCorrect: 30,
      },
      {
        id: 'g10-science-q5',
        narrative:
          'Body Warden Soma challenges you with a final question about the master control system of the body\'s fortress.',
        question: 'Which organ system coordinates the body\'s rapid responses to stimuli using electrical impulses?',
        options: ['Endocrine system', 'Immune system', 'Nervous system', 'Lymphatic system'],
        correctIndex: 2,
        clue: {
          title: 'Nervous System vs Endocrine System',
          explanation:
            'The nervous system uses electrical impulses (nerve signals) for fast, short-duration responses. It includes the brain, spinal cord, and nerves. The endocrine system uses chemical hormones for slower, longer-lasting responses. For rapid reactions (e.g., pulling your hand from heat), the nervous system acts.',
          visual: 'text',
          cost: 10,
        },
        coinsOnCorrect: 30,
      },
    ],
  },
];

export const MYP_QUESTS_BY_GRADE: Record<number, CurriculumQuest[]> = {
  6:  MYP_QUESTS.filter(q => q.grade === 6),
  7:  MYP_QUESTS.filter(q => q.grade === 7),
  8:  MYP_QUESTS.filter(q => q.grade === 8),
  9:  MYP_QUESTS.filter(q => q.grade === 9),
  10: MYP_QUESTS.filter(q => q.grade === 10),
};
