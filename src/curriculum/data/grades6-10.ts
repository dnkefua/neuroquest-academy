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

  // ========================================================
  // GRADE 6 MYP — Quest 2: Fractions & Decimals
  // ========================================================
  {
    id: 'g6-math-2',
    grade: 6,
    programme: 'MYP',
    subject: 'math',
    title: 'Fractions & Decimals',
    realmName: 'The Fractured Isles',
    narrativeWorld:
      'The Fractured Isles float above an endless ocean, each island split into uneven pieces by an ancient curse. Only a hero who can reunite fractions and decode decimals can restore the bridges between them.',
    characterTeacher: 'Captain Halvora',
    teacherEmoji: '🧭',
    theme: 'dungeon',
    coinReward: 150,
    boss: {
      id: 'g6-math-2-boss',
      title: 'The Shard Colossus',
      villain: 'Divisor the Uneven',
      villainEmoji: '🗿',
      narrative:
        'Divisor the Uneven rises from the fractured ground, his body made of mismatched stone slabs. He challenges you to prove your mastery of fractions and decimals to pass.',
      question:
        'A treasure chest contains coins worth 3/4 of a gold bar. You find two more chests: one worth 2/5 of a gold bar and another worth 0.35 of a gold bar. (a) Convert all amounts to decimals. (b) Find the total value in decimal form. (c) Express the total as a simplified fraction.',
      answer:
        '(a) 3/4 = 0.75, 2/5 = 0.40, and 0.35 stays as 0.35. (b) Total = 0.75 + 0.40 + 0.35 = 1.50. (c) 1.50 = 150/100 = 3/2.',
      hints: [
        'To convert a fraction to a decimal, divide the numerator by the denominator.',
        'Line up the decimal points before adding.',
        'To convert a decimal to a fraction, write it over the appropriate power of 10 and simplify.',
      ],
      coinReward: 75,
    },
    questions: [
      {
        id: 'g6-math-2-q1',
        narrative:
          'The first bridge requires a fraction keystone. Captain Halvora asks you to combine two pieces.',
        question: 'What is 1/3 + 1/6?',
        equation: '1/3 + 1/6 = ?',
        options: ['1/2', '2/9', '1/6', '2/6'],
        correctIndex: 0,
        clue: {
          title: 'Finding Common Denominators',
          explanation:
            'To add fractions with different denominators, find the least common denominator. The LCD of 3 and 6 is 6. Convert 1/3 to 2/6, then add: 2/6 + 1/6 = 3/6 = 1/2.',
          visual: 'diagram',
          cost: 10,
        },
        coinsOnCorrect: 30,
      },
      {
        id: 'g6-math-2-q2',
        narrative:
          'A locked gate displays a decimal puzzle. You must convert to proceed.',
        question: 'Convert 5/8 to a decimal.',
        equation: '5/8 = ?',
        options: ['0.625', '0.58', '0.525', '0.85'],
        correctIndex: 0,
        clue: {
          title: 'Fraction to Decimal',
          explanation:
            'Divide the numerator by the denominator: 5 ÷ 8 = 0.625. You can do long division: 50 ÷ 8 = 6 remainder 2, then 20 ÷ 8 = 2 remainder 4, then 40 ÷ 8 = 5.',
          visual: 'numberLine',
          cost: 10,
        },
        coinsOnCorrect: 30,
      },
      {
        id: 'g6-math-2-q3',
        narrative:
          'A merchant on the isle offers a trade, but you must subtract fractions to know the fair price.',
        question: 'What is 7/10 − 2/5?',
        equation: '7/10 − 2/5 = ?',
        options: ['3/10', '5/5', '5/10', '1/2'],
        correctIndex: 0,
        clue: {
          title: 'Subtracting Fractions',
          explanation:
            'Convert 2/5 to 4/10 so both fractions share the same denominator. Then 7/10 − 4/10 = 3/10.',
          visual: 'numberLine',
          cost: 10,
        },
        coinsOnCorrect: 30,
      },
      {
        id: 'g6-math-2-q4',
        narrative:
          'A riddle carved in stone asks you to multiply fractions to reveal a hidden path.',
        question: 'What is 2/3 × 3/4?',
        equation: '2/3 × 3/4 = ?',
        options: ['1/2', '6/7', '5/12', '2/4'],
        correctIndex: 0,
        clue: {
          title: 'Multiplying Fractions',
          explanation:
            'Multiply numerators: 2 × 3 = 6. Multiply denominators: 3 × 4 = 12. Result: 6/12 = 1/2.',
          visual: 'diagram',
          cost: 10,
        },
        coinsOnCorrect: 30,
      },
      {
        id: 'g6-math-2-q5',
        narrative:
          'The final island gate requires ordering values from least to greatest to unlock.',
        question: 'Which list is in order from least to greatest?',
        equation: '0.3, 1/4, 0.45, 1/2',
        options: [
          '1/4, 0.3, 0.45, 1/2',
          '0.3, 1/4, 1/2, 0.45',
          '1/2, 0.45, 0.3, 1/4',
          '0.45, 0.3, 1/4, 1/2',
        ],
        correctIndex: 0,
        clue: {
          title: 'Comparing Fractions and Decimals',
          explanation:
            'Convert everything to decimals: 1/4 = 0.25, 0.3 = 0.3, 0.45 = 0.45, 1/2 = 0.5. Ordering: 0.25, 0.3, 0.45, 0.5.',
          visual: 'numberLine',
          cost: 10,
        },
        coinsOnCorrect: 30,
      },
    ],
  },

  // ========================================================
  // GRADE 6 MYP — Quest 3: Ratios & Percentages
  // ========================================================
  {
    id: 'g6-math-3',
    grade: 6,
    programme: 'MYP',
    subject: 'math',
    title: 'Ratios & Percentages',
    realmName: 'The Bazaar of Balances',
    narrativeWorld:
      'Deep in the desert lies the Bazaar of Balances, where every trade must be perfectly proportioned. The market stalls shimmer with enchanted goods, but only those who master ratios and percentages can strike fair deals.',
    characterTeacher: 'Merchant Ratika',
    teacherEmoji: '⚖️',
    theme: 'dungeon',
    coinReward: 150,
    boss: {
      id: 'g6-math-3-boss',
      title: 'The Grand Haggle',
      villain: 'Baron Markup',
      villainEmoji: '🤑',
      narrative:
        'Baron Markup controls the Bazaar with unfair prices. Defeat him by calculating the true costs and exposing his tricks.',
      question:
        'Baron Markup sells a shield originally priced at $80. He marks it up by 25%, then offers a "generous" 20% discount on the new price. (a) What is the marked-up price? (b) What is the final price after the discount? (c) Is the final price more or less than the original $80, and by how much?',
      answer:
        '(a) 25% of $80 = $20, so marked-up price = $80 + $20 = $100. (b) 20% of $100 = $20, so final price = $100 − $20 = $80. (c) The final price equals the original price of $80, so there is no net change.',
      hints: [
        'A 25% markup means you add 25% of the original price.',
        'Apply the discount to the new (marked-up) price, not the original.',
        'Compare the final price back to the original $80.',
      ],
      coinReward: 75,
    },
    questions: [
      {
        id: 'g6-math-3-q1',
        narrative:
          'A spice trader mixes red and yellow saffron. You must figure out the ratio.',
        question:
          'A mixture contains 12 grams of red saffron and 8 grams of yellow saffron. What is the ratio of red to yellow in simplest form?',
        equation: '12 : 8 = ?',
        options: ['3 : 2', '4 : 3', '6 : 4', '2 : 3'],
        correctIndex: 0,
        clue: {
          title: 'Simplifying Ratios',
          explanation:
            'Divide both parts by their GCD. The GCD of 12 and 8 is 4. So 12 ÷ 4 = 3 and 8 ÷ 4 = 2. The ratio is 3 : 2.',
          visual: 'diagram',
          cost: 10,
        },
        coinsOnCorrect: 30,
      },
      {
        id: 'g6-math-3-q2',
        narrative:
          'A potion recipe says for every 2 parts moonwater, use 5 parts starlight. You need 20 parts moonwater total.',
        question:
          'If the ratio of moonwater to starlight is 2 : 5, how many parts starlight do you need for 20 parts moonwater?',
        equation: '2 : 5 = 20 : ?',
        options: ['50', '40', '25', '10'],
        correctIndex: 0,
        clue: {
          title: 'Equivalent Ratios',
          explanation:
            '20 is 10 times 2, so multiply the starlight part by the same factor: 5 × 10 = 50.',
          visual: 'text',
          cost: 10,
        },
        coinsOnCorrect: 30,
      },
      {
        id: 'g6-math-3-q3',
        narrative:
          'A jewel merchant claims 35% of a bag of 200 gems are rubies. How many rubies?',
        question: 'What is 35% of 200?',
        equation: '35% × 200 = ?',
        options: ['70', '65', '75', '35'],
        correctIndex: 0,
        clue: {
          title: 'Finding a Percentage of a Number',
          explanation:
            'Convert the percentage to a decimal: 35% = 0.35. Then multiply: 0.35 × 200 = 70.',
          visual: 'text',
          cost: 10,
        },
        coinsOnCorrect: 30,
      },
      {
        id: 'g6-math-3-q4',
        narrative:
          'You buy an enchanted cloak for $60 and sell it for $75. What is your percentage profit?',
        question:
          'What is the percentage increase from $60 to $75?',
        equation: '(75 − 60) / 60 × 100 = ?',
        options: ['25%', '20%', '15%', '30%'],
        correctIndex: 0,
        clue: {
          title: 'Percentage Increase',
          explanation:
            'Increase = $75 − $60 = $15. Percentage increase = (15 / 60) × 100 = 25%.',
          visual: 'text',
          cost: 10,
        },
        coinsOnCorrect: 30,
      },
      {
        id: 'g6-math-3-q5',
        narrative:
          'A tapestry is on sale for 15% off its original price of $120. What do you pay?',
        question: 'What is $120 after a 15% discount?',
        equation: '120 − (15% × 120) = ?',
        options: ['$102', '$105', '$100', '$108'],
        correctIndex: 0,
        clue: {
          title: 'Percentage Decrease',
          explanation:
            '15% of $120 = 0.15 × 120 = $18. Final price = $120 − $18 = $102.',
          visual: 'numberLine',
          cost: 10,
        },
        coinsOnCorrect: 30,
      },
    ],
  },

  // ========================================================
  // GRADE 7 MYP — Quest 2: Solving Equations
  // ========================================================
  {
    id: 'g7-math-2',
    grade: 7,
    programme: 'MYP',
    subject: 'math',
    title: 'Solving Equations',
    realmName: 'The Balancing Citadel',
    narrativeWorld:
      'The Balancing Citadel hovers between two mountain peaks, held aloft by enormous golden scales. When the scales tip, the citadel shakes. You must solve equations to keep everything in perfect equilibrium.',
    characterTeacher: 'Sage Equilon',
    teacherEmoji: '🏛️',
    theme: 'dungeon',
    coinReward: 150,
    boss: {
      id: 'g7-math-2-boss',
      title: 'The Unbalanced Throne',
      villain: 'Lord Inequalis',
      villainEmoji: '👑',
      narrative:
        'Lord Inequalis sits on a crooked throne, surrounded by floating equations. He claims no one can solve his multi-step challenge.',
      question:
        'Lord Inequalis presents this riddle: "I think of a number, multiply it by 3, then subtract 7, and get 20. Then I take the same number, add 5, and divide by 2." (a) Find the number. (b) What is the result of the second operation?',
      answer:
        '(a) 3x − 7 = 20 → 3x = 27 → x = 9. (b) (9 + 5) / 2 = 14 / 2 = 7.',
      hints: [
        'Set up the equation: 3x − 7 = 20.',
        'Add 7 to both sides first, then divide by 3.',
        'Once you know x, substitute into the second expression.',
      ],
      coinReward: 75,
    },
    questions: [
      {
        id: 'g7-math-2-q1',
        narrative:
          'The citadel gate displays a simple equation. Solve it to enter.',
        question: 'Solve for x: x + 14 = 30',
        equation: 'x + 14 = 30',
        options: ['16', '44', '14', '20'],
        correctIndex: 0,
        clue: {
          title: 'One-Step Equations (Addition)',
          explanation:
            'Subtract 14 from both sides: x = 30 − 14 = 16.',
          visual: 'numberLine',
          cost: 10,
        },
        coinsOnCorrect: 30,
      },
      {
        id: 'g7-math-2-q2',
        narrative:
          'A pressure plate in the hallway requires you to solve a multiplication equation.',
        question: 'Solve for x: 5x = 45',
        equation: '5x = 45',
        options: ['9', '40', '50', '225'],
        correctIndex: 0,
        clue: {
          title: 'One-Step Equations (Multiplication)',
          explanation:
            'Divide both sides by 5: x = 45 ÷ 5 = 9.',
          visual: 'text',
          cost: 10,
        },
        coinsOnCorrect: 30,
      },
      {
        id: 'g7-math-2-q3',
        narrative:
          'The library guardian poses a two-step equation before granting access.',
        question: 'Solve for x: 2x + 7 = 19',
        equation: '2x + 7 = 19',
        options: ['6', '13', '5', '8'],
        correctIndex: 0,
        clue: {
          title: 'Two-Step Equations',
          explanation:
            'Step 1: Subtract 7 from both sides → 2x = 12. Step 2: Divide both sides by 2 → x = 6.',
          visual: 'text',
          cost: 10,
        },
        coinsOnCorrect: 30,
      },
      {
        id: 'g7-math-2-q4',
        narrative:
          'An enchanted mirror shows an equation with the variable on both sides.',
        question: 'Solve for x: 4x − 3 = 2x + 9',
        equation: '4x − 3 = 2x + 9',
        options: ['6', '3', '4', '12'],
        correctIndex: 0,
        clue: {
          title: 'Variables on Both Sides',
          explanation:
            'Subtract 2x from both sides: 2x − 3 = 9. Add 3 to both sides: 2x = 12. Divide by 2: x = 6.',
          visual: 'diagram',
          cost: 10,
        },
        coinsOnCorrect: 30,
      },
      {
        id: 'g7-math-2-q5',
        narrative:
          'The final scale needs balancing with an equation involving negative numbers.',
        question: 'Solve for x: 3(x − 2) = 15',
        equation: '3(x − 2) = 15',
        options: ['7', '5', '3', '9'],
        correctIndex: 0,
        clue: {
          title: 'Equations with Brackets',
          explanation:
            'Divide both sides by 3: x − 2 = 5. Add 2 to both sides: x = 7. Alternatively, expand first: 3x − 6 = 15, so 3x = 21, x = 7.',
          visual: 'text',
          cost: 10,
        },
        coinsOnCorrect: 30,
      },
    ],
  },

  // ========================================================
  // GRADE 7 MYP — Quest 3: Rates & Proportions
  // ========================================================
  {
    id: 'g7-math-3',
    grade: 7,
    programme: 'MYP',
    subject: 'math',
    title: 'Rates & Proportions',
    realmName: 'The Clockwork Caverns',
    narrativeWorld:
      'Beneath the mountains lies the Clockwork Caverns, where gears and pistons run on precise ratios. The ancient machinery is failing, and only someone who understands rates and proportions can recalibrate the engines.',
    characterTeacher: 'Engineer Gilda',
    teacherEmoji: '⚙️',
    theme: 'dungeon',
    coinReward: 150,
    boss: {
      id: 'g7-math-3-boss',
      title: 'The Gear Tyrant',
      villain: 'Overclock the Relentless',
      villainEmoji: '🤖',
      narrative:
        'Overclock the Relentless controls the master gearbox. His gears spin at impossible rates. Solve his proportion puzzle to shut him down.',
      question:
        'A train travels 240 km in 3 hours. A second train travels at 90 km/h. (a) What is the speed of the first train? (b) If both trains start at the same time, how far apart are they after 5 hours? (c) How long would the first train take to travel 640 km?',
      answer:
        '(a) Speed = 240 ÷ 3 = 80 km/h. (b) After 5 hours: first train = 80 × 5 = 400 km, second train = 90 × 5 = 450 km. Difference = 450 − 400 = 50 km. (c) Time = 640 ÷ 80 = 8 hours.',
      hints: [
        'Speed = distance ÷ time.',
        'Calculate how far each train travels in 5 hours separately, then find the difference.',
        'Use time = distance ÷ speed for the last part.',
      ],
      coinReward: 75,
    },
    questions: [
      {
        id: 'g7-math-3-q1',
        narrative:
          'A water pump fills a tank. Engineer Gilda needs you to calculate the rate.',
        question:
          'A pump fills 60 litres in 4 minutes. What is the rate in litres per minute?',
        equation: '60 ÷ 4 = ?',
        options: ['15 L/min', '20 L/min', '12 L/min', '10 L/min'],
        correctIndex: 0,
        clue: {
          title: 'Unit Rates',
          explanation:
            'A unit rate is the amount per one unit. Divide 60 litres by 4 minutes to get 15 litres per minute.',
          visual: 'text',
          cost: 10,
        },
        coinsOnCorrect: 30,
      },
      {
        id: 'g7-math-3-q2',
        narrative:
          'Two gears are linked by a proportion. If one turns faster, you must find the other\'s speed.',
        question:
          'If 3/5 = x/25, what is the value of x?',
        equation: '3/5 = x/25',
        options: ['15', '12', '20', '10'],
        correctIndex: 0,
        clue: {
          title: 'Solving Proportions',
          explanation:
            'Cross-multiply: 3 × 25 = 5 × x → 75 = 5x → x = 15.',
          visual: 'diagram',
          cost: 10,
        },
        coinsOnCorrect: 30,
      },
      {
        id: 'g7-math-3-q3',
        narrative:
          'A conveyor belt moves crates. You need to work out how many crates it moves in one hour.',
        question:
          'A conveyor moves 48 crates in 20 minutes. How many crates does it move in 1 hour?',
        equation: '48/20 × 60 = ?',
        options: ['144', '120', '96', '160'],
        correctIndex: 0,
        clue: {
          title: 'Scaling Rates',
          explanation:
            'Rate = 48 ÷ 20 = 2.4 crates per minute. In 60 minutes: 2.4 × 60 = 144 crates.',
          visual: 'text',
          cost: 10,
        },
        coinsOnCorrect: 30,
      },
      {
        id: 'g7-math-3-q4',
        narrative:
          'A recipe for healing potion needs scaling up. The original serves 4 but you need to serve 10.',
        question:
          'A recipe uses 6 cups of herbs for 4 servings. How many cups are needed for 10 servings?',
        equation: '6/4 = x/10',
        options: ['15', '12', '24', '8'],
        correctIndex: 0,
        clue: {
          title: 'Proportional Reasoning',
          explanation:
            'Set up the proportion: 6/4 = x/10. Cross-multiply: 6 × 10 = 4x → 60 = 4x → x = 15.',
          visual: 'diagram',
          cost: 10,
        },
        coinsOnCorrect: 30,
      },
      {
        id: 'g7-math-3-q5',
        narrative:
          'A cart travels at constant speed. You spot it pass two markers and need to predict when it arrives.',
        question:
          'A cart travels 90 km in 1.5 hours. How long will it take to travel 210 km at the same speed?',
        equation: '90/1.5 = 210/x',
        options: ['3.5 hours', '3 hours', '4 hours', '2.5 hours'],
        correctIndex: 0,
        clue: {
          title: 'Speed, Distance, Time',
          explanation:
            'Speed = 90 ÷ 1.5 = 60 km/h. Time = 210 ÷ 60 = 3.5 hours.',
          visual: 'numberLine',
          cost: 10,
        },
        coinsOnCorrect: 30,
      },
    ],
  },

  // ========================================================
  // GRADE 8 MYP — Quest 2: Pythagorean Theorem
  // ========================================================
  {
    id: 'g8-math-2',
    grade: 8,
    programme: 'MYP',
    subject: 'math',
    title: 'Pythagorean Theorem',
    realmName: 'The Triangle Spire',
    narrativeWorld:
      'The Triangle Spire is a colossal tower built entirely from right-angled triangles. Its architect vanished centuries ago, leaving puzzles on every floor. You must use the Pythagorean theorem to ascend to the summit.',
    characterTeacher: 'Architect Pythia',
    teacherEmoji: '📐',
    theme: 'dungeon',
    coinReward: 150,
    boss: {
      id: 'g8-math-2-boss',
      title: 'The Apex Guardian',
      villain: 'Hypotenax',
      villainEmoji: '🔺',
      narrative:
        'At the top of the spire, Hypotenax blocks your path. His triangular shield can only be shattered by solving a multi-part Pythagorean challenge.',
      question:
        'A ladder leans against a wall. The ladder is 13 m long and its base is 5 m from the wall. (a) How high up the wall does the ladder reach? (b) If the base is moved 2 m further from the wall (now 7 m away), how high does the ladder now reach? (c) How much lower is the ladder on the wall compared to part (a)? Round to 2 decimal places.',
      answer:
        '(a) h = sqrt(13² − 5²) = sqrt(169 − 25) = sqrt(144) = 12 m. (b) h = sqrt(13² − 7²) = sqrt(169 − 49) = sqrt(120) ≈ 10.95 m. (c) Difference = 12 − 10.95 = 1.05 m lower.',
      hints: [
        'Use a² + b² = c² where c is the hypotenuse (the ladder).',
        'Rearrange to find the height: h = sqrt(c² − b²).',
        'Subtract the two heights to find how much lower the ladder reaches.',
      ],
      coinReward: 75,
    },
    questions: [
      {
        id: 'g8-math-2-q1',
        narrative:
          'The first floor has a right triangle drawn on the ground with two sides labelled.',
        question:
          'A right triangle has legs of length 3 and 4. What is the hypotenuse?',
        equation: 'c = sqrt(3² + 4²)',
        options: ['5', '7', '6', '12'],
        correctIndex: 0,
        clue: {
          title: 'Pythagorean Theorem Basics',
          explanation:
            'a² + b² = c². So 9 + 16 = 25. c = sqrt(25) = 5.',
          visual: 'diagram',
          cost: 10,
        },
        coinsOnCorrect: 30,
      },
      {
        id: 'g8-math-2-q2',
        narrative:
          'A drawbridge forms a right triangle. You know the hypotenuse and one leg.',
        question:
          'A right triangle has a hypotenuse of 10 and one leg of 6. What is the other leg?',
        equation: 'b = sqrt(10² − 6²)',
        options: ['8', '4', '7', '64'],
        correctIndex: 0,
        clue: {
          title: 'Finding a Missing Leg',
          explanation:
            'Rearrange: b² = c² − a² = 100 − 36 = 64. b = sqrt(64) = 8.',
          visual: 'diagram',
          cost: 10,
        },
        coinsOnCorrect: 30,
      },
      {
        id: 'g8-math-2-q3',
        narrative:
          'You need to check whether a triangular panel is a right triangle.',
        question:
          'Is a triangle with sides 5, 12, and 13 a right triangle?',
        equation: '5² + 12² = 13²?',
        options: [
          'Yes, because 25 + 144 = 169',
          'No, because 25 + 144 ≠ 169',
          'Yes, because 5 + 12 = 17',
          'No, because 13 is too large',
        ],
        correctIndex: 0,
        clue: {
          title: 'Checking for Right Triangles',
          explanation:
            'Check if a² + b² = c² for the longest side as c. 5² + 12² = 25 + 144 = 169 = 13². Yes, it is a right triangle.',
          visual: 'text',
          cost: 10,
        },
        coinsOnCorrect: 30,
      },
      {
        id: 'g8-math-2-q4',
        narrative:
          'A diagonal brace across a rectangular doorway needs measuring.',
        question:
          'A rectangle is 8 m wide and 6 m tall. What is the length of its diagonal?',
        equation: 'd = sqrt(8² + 6²)',
        options: ['10 m', '14 m', '12 m', '100 m'],
        correctIndex: 0,
        clue: {
          title: 'Diagonals of Rectangles',
          explanation:
            'The diagonal of a rectangle forms a right triangle with the width and height. d = sqrt(64 + 36) = sqrt(100) = 10 m.',
          visual: 'diagram',
          cost: 10,
        },
        coinsOnCorrect: 30,
      },
      {
        id: 'g8-math-2-q5',
        narrative:
          'Two explorers start at the same point. One walks 9 m north and the other walks 12 m east. How far apart are they?',
        question:
          'What is the straight-line distance between points that are 9 m north and 12 m east of a common starting point?',
        equation: 'd = sqrt(9² + 12²)',
        options: ['15 m', '21 m', '18 m', '225 m'],
        correctIndex: 0,
        clue: {
          title: 'Distance Using Pythagorean Theorem',
          explanation:
            'The paths form a right angle. d = sqrt(81 + 144) = sqrt(225) = 15 m.',
          visual: 'numberLine',
          cost: 10,
        },
        coinsOnCorrect: 30,
      },
    ],
  },

  // ========================================================
  // GRADE 8 MYP — Quest 3: Volume & Surface Area
  // ========================================================
  {
    id: 'g8-math-3',
    grade: 8,
    programme: 'MYP',
    subject: 'math',
    title: 'Volume & Surface Area',
    realmName: 'The Sculptor\'s Forge',
    narrativeWorld:
      'In the heart of a dormant volcano lies the Sculptor\'s Forge, where enormous 3D shapes are carved from enchanted stone. You must calculate volumes and surface areas to unlock each chamber and reach the hidden forge master.',
    characterTeacher: 'Forgemaster Solida',
    teacherEmoji: '🔶',
    theme: 'dungeon',
    coinReward: 150,
    boss: {
      id: 'g8-math-3-boss',
      title: 'The Molten Core',
      villain: 'Prismus the Unyielding',
      villainEmoji: '🌋',
      narrative:
        'Prismus the Unyielding guards the deepest chamber with shapes that shift and grow. Only precise calculations will contain his power.',
      question:
        'A cylindrical water tank has a radius of 3 m and height of 7 m. (a) Calculate the volume of the tank (use pi = 3.14). (b) Calculate the total surface area. (c) If the tank is only 60% full, what volume of water is inside?',
      answer:
        '(a) V = pi × r² × h = 3.14 × 9 × 7 = 197.82 m³. (b) SA = 2 × pi × r² + 2 × pi × r × h = 2 × 3.14 × 9 + 2 × 3.14 × 3 × 7 = 56.52 + 131.88 = 188.4 m². (c) 60% of 197.82 = 0.6 × 197.82 = 118.69 m³.',
      hints: [
        'Volume of a cylinder: V = pi × r² × h.',
        'Total surface area of a cylinder: SA = 2 × pi × r² + 2 × pi × r × h.',
        'Multiply the full volume by 0.6 for the 60% capacity.',
      ],
      coinReward: 75,
    },
    questions: [
      {
        id: 'g8-math-3-q1',
        narrative:
          'The first chamber holds a giant rectangular prism. Measure it to proceed.',
        question:
          'What is the volume of a rectangular prism with length 5 cm, width 4 cm, and height 3 cm?',
        equation: 'V = 5 × 4 × 3',
        options: ['60 cm³', '12 cm³', '24 cm³', '50 cm³'],
        correctIndex: 0,
        clue: {
          title: 'Volume of a Rectangular Prism',
          explanation:
            'Volume = length × width × height = 5 × 4 × 3 = 60 cm³.',
          visual: 'diagram',
          cost: 10,
        },
        coinsOnCorrect: 30,
      },
      {
        id: 'g8-math-3-q2',
        narrative:
          'A spherical boulder blocks the path. You must know its volume to determine the force needed.',
        question:
          'What is the volume of a sphere with radius 6 cm? (Use pi = 3.14)',
        equation: 'V = (4/3) × pi × 6³',
        options: ['904.32 cm³', '753.6 cm³', '452.16 cm³', '1130.4 cm³'],
        correctIndex: 0,
        clue: {
          title: 'Volume of a Sphere',
          explanation:
            'V = (4/3) × pi × r³ = (4/3) × 3.14 × 216 = 4 × 3.14 × 72 = 904.32 cm³.',
          visual: 'diagram',
          cost: 10,
        },
        coinsOnCorrect: 30,
      },
      {
        id: 'g8-math-3-q3',
        narrative:
          'A cube-shaped chest sits on a pedestal. How much material covers it?',
        question:
          'What is the total surface area of a cube with side length 5 cm?',
        equation: 'SA = 6 × 5²',
        options: ['150 cm²', '125 cm²', '25 cm²', '100 cm²'],
        correctIndex: 0,
        clue: {
          title: 'Surface Area of a Cube',
          explanation:
            'A cube has 6 equal faces, each with area s². SA = 6 × 25 = 150 cm².',
          visual: 'diagram',
          cost: 10,
        },
        coinsOnCorrect: 30,
      },
      {
        id: 'g8-math-3-q4',
        narrative:
          'A triangular prism tunnel leads deeper into the forge. Calculate its volume.',
        question:
          'A triangular prism has a triangle base with base 6 cm and height 4 cm, and the prism length is 10 cm. What is its volume?',
        equation: 'V = (1/2 × 6 × 4) × 10',
        options: ['120 cm³', '240 cm³', '60 cm³', '80 cm³'],
        correctIndex: 0,
        clue: {
          title: 'Volume of a Triangular Prism',
          explanation:
            'First find the area of the triangular base: (1/2) × 6 × 4 = 12 cm². Then multiply by the length: 12 × 10 = 120 cm³.',
          visual: 'text',
          cost: 10,
        },
        coinsOnCorrect: 30,
      },
      {
        id: 'g8-math-3-q5',
        narrative:
          'The forge master\'s cone-shaped helmet must be replicated. What volume of metal is needed?',
        question:
          'What is the volume of a cone with radius 3 cm and height 8 cm? (Use pi = 3.14)',
        equation: 'V = (1/3) × pi × 3² × 8',
        options: ['75.36 cm³', '226.08 cm³', '150.72 cm³', '37.68 cm³'],
        correctIndex: 0,
        clue: {
          title: 'Volume of a Cone',
          explanation:
            'V = (1/3) × pi × r² × h = (1/3) × 3.14 × 9 × 8 = (1/3) × 226.08 = 75.36 cm³.',
          visual: 'diagram',
          cost: 10,
        },
        coinsOnCorrect: 30,
      },
    ],
  },

  // ========================================================
  // GRADE 9 MYP — Quest 2: Graphing Linear Functions
  // ========================================================
  {
    id: 'g9-math-2',
    grade: 9,
    programme: 'MYP',
    subject: 'math',
    title: 'Graphing Linear Functions',
    realmName: 'The Grid Expanse',
    narrativeWorld:
      'The Grid Expanse is a vast plane etched with glowing coordinate lines that stretch to infinity. Ancient waypoints are hidden at intersections, and only those who can read slopes and intercepts can navigate this luminous terrain.',
    characterTeacher: 'Navigator Linara',
    teacherEmoji: '📈',
    theme: 'dungeon',
    coinReward: 150,
    boss: {
      id: 'g9-math-2-boss',
      title: 'The Origin Overlord',
      villain: 'Slopebane',
      villainEmoji: '🕸️',
      narrative:
        'Slopebane lurks at the origin, tangling all the lines of the Grid. Untangle his web by mastering linear functions.',
      question:
        'Line A passes through (1, 3) and (4, 9). Line B has equation y = −x + 10. (a) Find the equation of Line A in slope-intercept form. (b) Find the point where Line A and Line B intersect. (c) Is the intersection point in the first quadrant? Explain.',
      answer:
        '(a) Slope of A = (9 − 3)/(4 − 1) = 6/3 = 2. Using point (1, 3): y − 3 = 2(x − 1) → y = 2x + 1. (b) Set 2x + 1 = −x + 10 → 3x = 9 → x = 3. y = 2(3) + 1 = 7. Intersection: (3, 7). (c) Yes, both x = 3 and y = 7 are positive, so the point is in the first quadrant.',
      hints: [
        'Slope = (y2 − y1) / (x2 − x1).',
        'Set the two equations equal to each other to find x.',
        'The first quadrant has both x > 0 and y > 0.',
      ],
      coinReward: 75,
    },
    questions: [
      {
        id: 'g9-math-2-q1',
        narrative:
          'Navigator Linara points to two waypoints and asks for the slope between them.',
        question:
          'What is the slope of the line through (2, 5) and (6, 13)?',
        equation: 'm = (13 − 5) / (6 − 2)',
        options: ['2', '4', '8', '1/2'],
        correctIndex: 0,
        clue: {
          title: 'Calculating Slope',
          explanation:
            'Slope = (y2 − y1) / (x2 − x1) = (13 − 5) / (6 − 2) = 8 / 4 = 2.',
          visual: 'diagram',
          cost: 10,
        },
        coinsOnCorrect: 30,
      },
      {
        id: 'g9-math-2-q2',
        narrative:
          'A beacon line is described as y = 3x − 4. Where does it cross the y-axis?',
        question: 'What is the y-intercept of y = 3x − 4?',
        equation: 'y = 3x − 4',
        options: ['(0, −4)', '(0, 3)', '(−4, 0)', '(4, 0)'],
        correctIndex: 0,
        clue: {
          title: 'Y-Intercept',
          explanation:
            'The y-intercept is where x = 0. Substitute: y = 3(0) − 4 = −4. The point is (0, −4).',
          visual: 'numberLine',
          cost: 10,
        },
        coinsOnCorrect: 30,
      },
      {
        id: 'g9-math-2-q3',
        narrative:
          'You need to write the equation of a line from a slope and a point.',
        question:
          'A line has slope 4 and passes through (1, 7). What is the equation in slope-intercept form?',
        equation: 'y − 7 = 4(x − 1)',
        options: ['y = 4x + 3', 'y = 4x + 7', 'y = 4x − 3', 'y = 7x + 4'],
        correctIndex: 0,
        clue: {
          title: 'Point-Slope to Slope-Intercept',
          explanation:
            'y − 7 = 4(x − 1) → y = 4x − 4 + 7 → y = 4x + 3.',
          visual: 'text',
          cost: 10,
        },
        coinsOnCorrect: 30,
      },
      {
        id: 'g9-math-2-q4',
        narrative:
          'Two parallel paths run across the grid. You need to identify which equation is parallel.',
        question:
          'Which line is parallel to y = 2x + 5?',
        equation: 'Parallel lines have the same slope',
        options: ['y = 2x − 3', 'y = −2x + 5', 'y = 0.5x + 5', 'y = 3x + 5'],
        correctIndex: 0,
        clue: {
          title: 'Parallel Lines',
          explanation:
            'Parallel lines have identical slopes. y = 2x + 5 has slope 2. Only y = 2x − 3 also has slope 2.',
          visual: 'diagram',
          cost: 10,
        },
        coinsOnCorrect: 30,
      },
      {
        id: 'g9-math-2-q5',
        narrative:
          'A grid lock requires the x-intercept of a line to open.',
        question:
          'What is the x-intercept of y = −3x + 9?',
        equation: '0 = −3x + 9',
        options: ['(3, 0)', '(9, 0)', '(−3, 0)', '(0, 9)'],
        correctIndex: 0,
        clue: {
          title: 'Finding X-Intercepts',
          explanation:
            'Set y = 0: 0 = −3x + 9 → 3x = 9 → x = 3. The x-intercept is (3, 0).',
          visual: 'numberLine',
          cost: 10,
        },
        coinsOnCorrect: 30,
      },
    ],
  },

  // ========================================================
  // GRADE 9 MYP — Quest 3: Inequalities & Systems
  // ========================================================
  {
    id: 'g9-math-3',
    grade: 9,
    programme: 'MYP',
    subject: 'math',
    title: 'Inequalities & Systems',
    realmName: 'The Dual Kingdoms',
    narrativeWorld:
      'Two rival kingdoms share a border defined by equations and inequalities. To broker peace, you must find where their territories overlap and solve the systems that govern the boundary lines.',
    characterTeacher: 'Diplomat Dualyn',
    teacherEmoji: '🤝',
    theme: 'dungeon',
    coinReward: 150,
    boss: {
      id: 'g9-math-3-boss',
      title: 'The Border Warlord',
      villain: 'Contradictus',
      villainEmoji: '⚔️',
      narrative:
        'Contradictus claims the two kingdoms can never agree. Prove him wrong by solving a system of equations and inequalities.',
      question:
        'Kingdom A produces swords (s) and shields (h) with constraints: s + h <= 100, s >= 20, h >= 30. Each sword earns 5 gold and each shield earns 3 gold. (a) Solve the system: s + h = 100 with s = 20 to find h. (b) Solve s + h = 100 with h = 30 to find s. (c) Which combination gives more gold: (20, 80) or (70, 30)?',
      answer:
        '(a) 20 + h = 100 → h = 80. (b) s + 30 = 100 → s = 70. (c) Gold at (20, 80): 5(20) + 3(80) = 100 + 240 = 340. Gold at (70, 30): 5(70) + 3(30) = 350 + 90 = 440. (70, 30) gives more gold.',
      hints: [
        'Substitute the known value into the equation to solve for the unknown.',
        'Check that each solution satisfies all the constraints.',
        'Calculate total gold for each combination: 5s + 3h.',
      ],
      coinReward: 75,
    },
    questions: [
      {
        id: 'g9-math-3-q1',
        narrative:
          'A guard says you need at least 18 gold coins to cross the bridge.',
        question:
          'Solve: x + 7 >= 18',
        equation: 'x + 7 >= 18',
        options: ['x >= 11', 'x >= 25', 'x <= 11', 'x >= 7'],
        correctIndex: 0,
        clue: {
          title: 'Solving Linear Inequalities',
          explanation:
            'Subtract 7 from both sides: x >= 18 − 7 = 11.',
          visual: 'numberLine',
          cost: 10,
        },
        coinsOnCorrect: 30,
      },
      {
        id: 'g9-math-3-q2',
        narrative:
          'A locked chest opens only when you solve a system of two equations.',
        question:
          'Solve the system: x + y = 10 and x − y = 4. What is x?',
        equation: 'x + y = 10, x − y = 4',
        options: ['7', '3', '6', '5'],
        correctIndex: 0,
        clue: {
          title: 'Solving by Elimination',
          explanation:
            'Add the equations: (x + y) + (x − y) = 10 + 4 → 2x = 14 → x = 7.',
          visual: 'text',
          cost: 10,
        },
        coinsOnCorrect: 30,
      },
      {
        id: 'g9-math-3-q3',
        narrative:
          'The kingdom boundary is defined by an inequality. Which region is safe?',
        question:
          'Which point satisfies y < 2x + 1?',
        equation: 'y < 2x + 1',
        options: ['(3, 5)', '(0, 2)', '(1, 4)', '(−1, 0)'],
        correctIndex: 0,
        clue: {
          title: 'Testing Points in Inequalities',
          explanation:
            'Test (3, 5): Is 5 < 2(3) + 1 = 7? Yes, 5 < 7. Test (0, 2): Is 2 < 1? No. So (3, 5) works.',
          visual: 'diagram',
          cost: 10,
        },
        coinsOnCorrect: 30,
      },
      {
        id: 'g9-math-3-q4',
        narrative:
          'You and an ally split resources. Use substitution to find each person\'s share.',
        question:
          'Solve: y = 2x and x + y = 12. What is y?',
        equation: 'y = 2x, x + y = 12',
        options: ['8', '4', '6', '10'],
        correctIndex: 0,
        clue: {
          title: 'Solving by Substitution',
          explanation:
            'Substitute y = 2x into x + y = 12: x + 2x = 12 → 3x = 12 → x = 4. So y = 2(4) = 8.',
          visual: 'text',
          cost: 10,
        },
        coinsOnCorrect: 30,
      },
      {
        id: 'g9-math-3-q5',
        narrative:
          'A treaty requires solving an inequality involving multiplication by a negative.',
        question:
          'Solve: −3x > 12',
        equation: '−3x > 12',
        options: ['x < −4', 'x > −4', 'x < 4', 'x > 4'],
        correctIndex: 0,
        clue: {
          title: 'Inequalities with Negatives',
          explanation:
            'Divide both sides by −3 and flip the inequality sign: x < −4.',
          visual: 'numberLine',
          cost: 10,
        },
        coinsOnCorrect: 30,
      },
    ],
  },

  // ========================================================
  // GRADE 10 MYP — Quest 2: Quadratic Equations
  // ========================================================
  {
    id: 'g10-math-2',
    grade: 10,
    programme: 'MYP',
    subject: 'math',
    title: 'Quadratic Equations',
    realmName: 'The Parabolic Abyss',
    narrativeWorld:
      'The Parabolic Abyss is a canyon whose walls curve in perfect parabolas. Ancient catapults line the rim, and only someone who understands quadratic equations can aim them to hit distant targets across the void.',
    characterTeacher: 'Ballista Master Paraben',
    teacherEmoji: '🎯',
    theme: 'dungeon',
    coinReward: 150,
    boss: {
      id: 'g10-math-2-boss',
      title: 'The Vertex Vortex',
      villain: 'Discriminox',
      villainEmoji: '🌀',
      narrative:
        'Discriminox swirls at the deepest point of the abyss, feeding on unsolved equations. Defeat him with the quadratic formula.',
      question:
        'A projectile follows the path h(t) = −5t² + 30t + 10, where h is height in metres and t is time in seconds. (a) What is the initial height (at t = 0)? (b) At what time does it reach maximum height? (c) What is the maximum height?',
      answer:
        '(a) h(0) = −5(0)² + 30(0) + 10 = 10 m. (b) t = −b/(2a) = −30/(2 × −5) = −30/−10 = 3 seconds. (c) h(3) = −5(9) + 30(3) + 10 = −45 + 90 + 10 = 55 m.',
      hints: [
        'Substitute t = 0 into the equation for initial height.',
        'The vertex of y = ax² + bx + c occurs at t = −b/(2a).',
        'Substitute the vertex t-value back into the equation for max height.',
      ],
      coinReward: 75,
    },
    questions: [
      {
        id: 'g10-math-2-q1',
        narrative:
          'A catapult equation needs factoring to find where the projectile lands.',
        question: 'Solve x² − 5x + 6 = 0 by factoring.',
        equation: 'x² − 5x + 6 = 0',
        options: ['x = 2 and x = 3', 'x = −2 and x = −3', 'x = 1 and x = 6', 'x = −1 and x = −6'],
        correctIndex: 0,
        clue: {
          title: 'Factoring Quadratics',
          explanation:
            'Find two numbers that multiply to 6 and add to −5: −2 and −3. So (x − 2)(x − 3) = 0, giving x = 2 or x = 3.',
          visual: 'text',
          cost: 10,
        },
        coinsOnCorrect: 30,
      },
      {
        id: 'g10-math-2-q2',
        narrative:
          'A stone bridge has a parabolic arch. You need the vertex to find the highest point.',
        question: 'What is the vertex of y = x² − 6x + 8?',
        equation: 'x = −b/(2a) = 6/2 = 3',
        options: ['(3, −1)', '(3, 1)', '(−3, −1)', '(6, 8)'],
        correctIndex: 0,
        clue: {
          title: 'Vertex of a Parabola',
          explanation:
            'x-coordinate: −b/(2a) = 6/2 = 3. y-coordinate: (3)² − 6(3) + 8 = 9 − 18 + 8 = −1. Vertex: (3, −1).',
          visual: 'diagram',
          cost: 10,
        },
        coinsOnCorrect: 30,
      },
      {
        id: 'g10-math-2-q3',
        narrative:
          'The discriminant of an equation tells you how many solutions exist.',
        question:
          'What is the discriminant of 2x² + 3x − 5 = 0?',
        equation: 'D = b² − 4ac = 9 − 4(2)(−5)',
        options: ['49', '−31', '19', '1'],
        correctIndex: 0,
        clue: {
          title: 'The Discriminant',
          explanation:
            'D = b² − 4ac = 3² − 4(2)(−5) = 9 + 40 = 49. Since D > 0, there are two real solutions.',
          visual: 'text',
          cost: 10,
        },
        coinsOnCorrect: 30,
      },
      {
        id: 'g10-math-2-q4',
        narrative:
          'Use the quadratic formula to aim the final catapult shot.',
        question:
          'Solve x² + 2x − 8 = 0 using the quadratic formula.',
        equation: 'x = (−2 ± sqrt(4 + 32)) / 2',
        options: ['x = 2 and x = −4', 'x = −2 and x = 4', 'x = 8 and x = −1', 'x = 1 and x = −8'],
        correctIndex: 0,
        clue: {
          title: 'Quadratic Formula',
          explanation:
            'x = (−2 ± sqrt(4 + 32)) / 2 = (−2 ± sqrt(36)) / 2 = (−2 ± 6) / 2. So x = 4/2 = 2 or x = −8/2 = −4.',
          visual: 'text',
          cost: 10,
        },
        coinsOnCorrect: 30,
      },
      {
        id: 'g10-math-2-q5',
        narrative:
          'A parabolic shield deflects attacks. You must determine if it opens up or down.',
        question:
          'Does the parabola y = −2x² + 4x + 1 open upward or downward, and what is the y-intercept?',
        equation: 'a = −2, c = 1',
        options: [
          'Downward, y-intercept is (0, 1)',
          'Upward, y-intercept is (0, 1)',
          'Downward, y-intercept is (0, −2)',
          'Upward, y-intercept is (0, 4)',
        ],
        correctIndex: 0,
        clue: {
          title: 'Direction and Y-Intercept',
          explanation:
            'Since a = −2 < 0, the parabola opens downward. The y-intercept is the constant term c = 1, giving the point (0, 1).',
          visual: 'diagram',
          cost: 10,
        },
        coinsOnCorrect: 30,
      },
    ],
  },

  // ========================================================
  // GRADE 10 MYP — Quest 3: Statistics & Probability
  // ========================================================
  {
    id: 'g10-math-3',
    grade: 10,
    programme: 'MYP',
    subject: 'math',
    title: 'Statistics & Probability',
    realmName: 'The Oracle\'s Chamber',
    narrativeWorld:
      'The Oracle\'s Chamber is filled with crystal spheres that predict the future through data patterns. To gain the Oracle\'s wisdom, you must interpret statistics and calculate probabilities from the swirling numbers within the crystals.',
    characterTeacher: 'Oracle Stazia',
    teacherEmoji: '🔮',
    theme: 'dungeon',
    coinReward: 150,
    boss: {
      id: 'g10-math-3-boss',
      title: 'The Chaos Predictor',
      villain: 'Varian the Random',
      villainEmoji: '🎲',
      narrative:
        'Varian the Random thrives on chaos and uncertainty. He claims nothing can be predicted. Prove him wrong with statistics and probability.',
      question:
        'A class of 20 students scored the following on a test: 45, 50, 55, 55, 60, 60, 60, 65, 65, 70, 70, 70, 75, 75, 80, 80, 85, 85, 90, 95. (a) Find the median. (b) Find the interquartile range (IQR). (c) If a student is chosen at random, what is the probability they scored above 75?',
      answer:
        '(a) With 20 values, median = average of 10th and 11th values = (70 + 70)/2 = 70. (b) Q1 = average of 5th and 6th = (60 + 60)/2 = 60. Q3 = average of 15th and 16th = (80 + 80)/2 = 80. IQR = 80 − 60 = 20. (c) Scores above 75: 80, 80, 85, 85, 90, 95 = 6 students. P = 6/20 = 3/10 = 0.3.',
      hints: [
        'The median of an even number of values is the average of the two middle values.',
        'Q1 is the median of the lower half, Q3 is the median of the upper half.',
        'Count how many scores are strictly greater than 75.',
      ],
      coinReward: 75,
    },
    questions: [
      {
        id: 'g10-math-3-q1',
        narrative:
          'A crystal sphere shows five numbers. You must calculate the mean.',
        question:
          'What is the mean of: 12, 18, 24, 30, 16?',
        equation: '(12 + 18 + 24 + 30 + 16) / 5',
        options: ['20', '24', '18', '22'],
        correctIndex: 0,
        clue: {
          title: 'Calculating the Mean',
          explanation:
            'Sum = 12 + 18 + 24 + 30 + 16 = 100. Mean = 100 / 5 = 20.',
          visual: 'text',
          cost: 10,
        },
        coinsOnCorrect: 30,
      },
      {
        id: 'g10-math-3-q2',
        narrative:
          'An ancient scroll shows a data set and asks for the median.',
        question:
          'What is the median of: 3, 7, 9, 12, 15, 18, 21?',
        equation: 'Median = middle value of 7 ordered numbers',
        options: ['12', '9', '15', '11'],
        correctIndex: 0,
        clue: {
          title: 'Finding the Median',
          explanation:
            'With 7 values in order, the median is the 4th value: 12.',
          visual: 'numberLine',
          cost: 10,
        },
        coinsOnCorrect: 30,
      },
      {
        id: 'g10-math-3-q3',
        narrative:
          'A bag of enchanted marbles contains different colours. What is the chance of drawing a blue one?',
        question:
          'A bag has 4 red, 6 blue, and 5 green marbles. What is the probability of drawing a blue marble?',
        equation: 'P(blue) = 6/15',
        options: ['2/5', '6/15', '1/3', '2/3'],
        correctIndex: 0,
        clue: {
          title: 'Basic Probability',
          explanation:
            'Total marbles = 4 + 6 + 5 = 15. P(blue) = 6/15 = 2/5.',
          visual: 'diagram',
          cost: 10,
        },
        coinsOnCorrect: 30,
      },
      {
        id: 'g10-math-3-q4',
        narrative:
          'Two dice are rolled. The Oracle asks about their combined outcome.',
        question:
          'What is the probability of rolling a sum of 7 with two standard dice?',
        equation: 'Favourable outcomes / 36',
        options: ['1/6', '1/7', '5/36', '7/36'],
        correctIndex: 0,
        clue: {
          title: 'Probability with Two Dice',
          explanation:
            'Combinations that sum to 7: (1,6), (2,5), (3,4), (4,3), (5,2), (6,1) = 6 outcomes. P = 6/36 = 1/6.',
          visual: 'diagram',
          cost: 10,
        },
        coinsOnCorrect: 30,
      },
      {
        id: 'g10-math-3-q5',
        narrative:
          'The Oracle shows two data sets and asks which has greater spread.',
        question:
          'Data set A: {2, 4, 6, 8, 10}. What is the standard deviation? (Round to 2 decimal places.)',
        equation: 'SD = sqrt(mean of squared deviations)',
        options: ['2.83', '3.16', '2.00', '4.00'],
        correctIndex: 0,
        clue: {
          title: 'Standard Deviation',
          explanation:
            'Mean = 6. Deviations: −4, −2, 0, 2, 4. Squared: 16, 4, 0, 4, 16. Mean of squares = 40/5 = 8. SD = sqrt(8) ≈ 2.83.',
          visual: 'text',
          cost: 10,
        },
        coinsOnCorrect: 30,
      },
    ],
  },

  // ============================================================
  // GRADE 6 MYP — Quest 2: Ecosystems & Food Chains
  // ============================================================
  {
    id: 'g6-science-2',
    grade: 6,
    programme: 'MYP',
    subject: 'science',
    title: 'Ecosystems & Food Chains',
    realmName: 'The Verdant Wilds',
    narrativeWorld:
      'You have entered the Verdant Wilds, a sprawling enchanted forest where every creature is connected by invisible threads of energy. The ancient Balance Keeper who once maintained harmony has vanished, and the food chains are unravelling. Only a true Naturalist can restore order.',
    characterTeacher: 'Sage Fernleaf',
    teacherEmoji: '🌿',
    theme: 'dungeon',
    coinReward: 150,
    boss: {
      id: 'g6-science-2-boss',
      title: 'The Chain Breaker',
      villain: 'Lord Famine',
      villainEmoji: '🦴',
      narrative:
        'At the heart of the Verdant Wilds, Lord Famine hovers above a dying grove. He feeds on broken food chains and grows stronger with every collapsed ecosystem. You must prove your understanding of energy flow to defeat him.',
      question:
        'Lord Famine has severed three links in the forest food chain. (A) Explain what happens to a population of hawks if the frog population is suddenly wiped out by disease. (B) Describe how energy is lost at each trophic level and why there are fewer top predators than producers. (C) Suggest one way the ecosystem could recover naturally over time.',
      answer:
        '(A) If frogs are wiped out, hawks lose a food source, so their population will decline. Organisms that frogs ate (insects) may increase without that predator. (B) At each trophic level roughly 90% of energy is lost as heat through respiration, so less energy is available to support organisms at higher levels — this is why top predators are rare. (C) The ecosystem could recover if another organism fills the frog\'s niche, or if surviving frogs reproduce and rebuild the population, gradually restoring balance.',
      hints: [
        'Think about what frogs eat and what eats frogs.',
        'Remember the 10% rule of energy transfer.',
        'Consider ecological succession and how populations bounce back.',
      ],
      coinReward: 75,
    },
    questions: [
      {
        id: 'g6-science-2-q1',
        narrative:
          'Sage Fernleaf points to a sunlit meadow where grasses sway. "All energy in this ecosystem begins here," she says.',
        question: 'What is the original source of energy for most ecosystems on Earth?',
        options: ['Soil nutrients', 'The Sun', 'Water', 'Wind'],
        correctIndex: 1,
        clue: {
          title: 'Energy Source',
          explanation:
            'The Sun provides light energy that producers (plants) convert into chemical energy through photosynthesis. This energy then flows through the food chain to herbivores and carnivores.',
          visual: 'text',
          cost: 10,
        },
        coinsOnCorrect: 30,
      },
      {
        id: 'g6-science-2-q2',
        narrative:
          'You discover a pond where algae cover the surface, small fish dart below, and a heron watches from the bank.',
        question:
          'In the food chain: algae → small fish → heron, what role does the small fish play?',
        options: ['Producer', 'Primary consumer', 'Secondary consumer', 'Decomposer'],
        correctIndex: 2,
        clue: {
          title: 'Trophic Roles',
          explanation:
            'Algae are the producer. The small fish eat algae, making them primary consumers. The heron eats the fish, making it a secondary consumer. Wait — the small fish eat algae directly, so they are primary consumers, and the heron is the secondary consumer.',
          visual: 'diagram',
          cost: 10,
        },
        coinsOnCorrect: 30,
      },
      {
        id: 'g6-science-2-q3',
        narrative:
          'Fallen logs litter the forest floor. Sage Fernleaf kneels beside one covered in fungi. "Without these workers, the forest would drown in its own waste," she warns.',
        question: 'What is the primary role of decomposers in an ecosystem?',
        options: [
          'To produce oxygen for animals',
          'To break down dead organisms and recycle nutrients back into the soil',
          'To provide food for predators',
          'To control the population of herbivores',
        ],
        correctIndex: 1,
        clue: {
          title: 'Decomposers',
          explanation:
            'Decomposers such as fungi and bacteria break down dead plants and animals, returning essential nutrients like nitrogen and phosphorus to the soil so producers can use them again.',
          visual: 'text',
          cost: 10,
        },
        coinsOnCorrect: 30,
      },
      {
        id: 'g6-science-2-q4',
        narrative:
          'A food web diagram carved into an ancient stone shows arrows connecting dozens of species. Some arrows point in unexpected directions.',
        question: 'In a food chain diagram, what do the arrows represent?',
        options: [
          'The direction an animal moves',
          'The flow of energy from one organism to the next',
          'The size of each organism',
          'The speed at which organisms grow',
        ],
        correctIndex: 1,
        clue: {
          title: 'Arrow Direction',
          explanation:
            'Arrows in a food chain point from the organism being eaten to the organism doing the eating. They show the direction energy flows — from prey to predator.',
          visual: 'diagram',
          cost: 10,
        },
        coinsOnCorrect: 30,
      },
      {
        id: 'g6-science-2-q5',
        narrative:
          'Sage Fernleaf shows you two ecosystems: a coral reef teeming with life and a desert with only a few species. "One is far more fragile than you might think," she says.',
        question:
          'Why is an ecosystem with greater biodiversity generally more stable than one with fewer species?',
        options: [
          'Because larger ecosystems have more sunlight',
          'Because if one species declines, others can fill its role in the food web',
          'Because more species produce more carbon dioxide',
          'Because biodiversity makes the weather more predictable',
        ],
        correctIndex: 1,
        clue: {
          title: 'Biodiversity & Stability',
          explanation:
            'High biodiversity means more connections in the food web. If one species is lost, other species can compensate, preventing the whole system from collapsing. Low-diversity ecosystems are more vulnerable.',
          visual: 'text',
          cost: 10,
        },
        coinsOnCorrect: 30,
      },
    ],
  },

  // ============================================================
  // GRADE 6 MYP — Quest 3: Forces & Motion
  // ============================================================
  {
    id: 'g6-science-3',
    grade: 6,
    programme: 'MYP',
    subject: 'science',
    title: 'Forces & Motion',
    realmName: 'The Iron Colosseum',
    narrativeWorld:
      'Welcome to the Iron Colosseum, a floating arena held aloft by ancient force fields. Gladiator constructs battle using pushes, pulls, and gravity itself. The Arena Master has rigged the trials so only those who understand forces can survive.',
    characterTeacher: 'Commander Torque',
    teacherEmoji: '⚙️',
    theme: 'dungeon',
    coinReward: 150,
    boss: {
      id: 'g6-science-3-boss',
      title: 'The Gravity Tyrant',
      villain: 'General Inertia',
      villainEmoji: '🗿',
      narrative:
        'General Inertia stands immovable at the centre of the arena, a colossal stone warrior who refuses to budge. He claims no force in the realm can move him. Prove him wrong with your knowledge of forces and motion.',
      question:
        'General Inertia challenges you with three puzzles: (A) A 10 N force pushes a box to the right and a 6 N force pushes it to the left. What is the net force and which direction does the box move? (B) Why does a ball eventually stop rolling on grass but rolls much further on a smooth floor? (C) Explain why passengers lurch forward when a bus suddenly stops.',
      answer:
        '(A) Net force = 10 N − 6 N = 4 N to the right, so the box accelerates to the right. (B) Grass exerts more friction on the ball than a smooth floor, converting kinetic energy to heat and slowing it down faster. (C) When the bus stops, passengers\' bodies continue moving forward due to inertia — the tendency of an object in motion to stay in motion unless acted on by an external force.',
      hints: [
        'Subtract opposing forces to find the net force.',
        'Friction is a force that opposes motion.',
        'Inertia is the resistance of an object to changes in its state of motion.',
      ],
      coinReward: 75,
    },
    questions: [
      {
        id: 'g6-science-3-q1',
        narrative:
          'Commander Torque rolls a heavy iron sphere across the arena floor. It slows and stops before reaching the wall.',
        question: 'What force causes the rolling sphere to slow down and eventually stop?',
        options: ['Gravity', 'Magnetism', 'Friction', 'Air pressure'],
        correctIndex: 2,
        clue: {
          title: 'Friction',
          explanation:
            'Friction is a contact force that opposes the motion of an object. When the sphere rolls on the floor, friction between the sphere and the surface gradually converts its kinetic energy into heat, slowing it down.',
          visual: 'text',
          cost: 10,
        },
        coinsOnCorrect: 30,
      },
      {
        id: 'g6-science-3-q2',
        narrative:
          'Two gladiator constructs push a boulder from opposite sides. One pushes with 20 N to the left and the other with 15 N to the right.',
        question: 'What is the net force on the boulder?',
        options: [
          '35 N to the left',
          '5 N to the left',
          '5 N to the right',
          '35 N to the right',
        ],
        correctIndex: 1,
        clue: {
          title: 'Net Force',
          explanation:
            'When forces act in opposite directions, subtract the smaller from the larger: 20 N − 15 N = 5 N. The net force is in the direction of the larger force, which is to the left.',
          visual: 'numberLine',
          cost: 10,
        },
        coinsOnCorrect: 30,
      },
      {
        id: 'g6-science-3-q3',
        narrative:
          'A hovering platform floats perfectly still in the arena. Commander Torque says it is in a state of equilibrium.',
        question: 'What does it mean when an object is in equilibrium?',
        options: [
          'It is moving at the speed of light',
          'All forces acting on it are balanced so the net force is zero',
          'No forces are acting on it at all',
          'It is getting heavier over time',
        ],
        correctIndex: 1,
        clue: {
          title: 'Equilibrium',
          explanation:
            'An object is in equilibrium when all forces acting on it cancel out, resulting in a net force of zero. The object can be stationary or moving at constant velocity.',
          visual: 'diagram',
          cost: 10,
        },
        coinsOnCorrect: 30,
      },
      {
        id: 'g6-science-3-q4',
        narrative:
          'Commander Torque drops a feather and a steel ball from the same height inside a vacuum chamber where there is no air.',
        question:
          'In a vacuum (no air resistance), which object hits the ground first?',
        options: [
          'The steel ball, because it is heavier',
          'The feather, because it is lighter',
          'They hit the ground at the same time',
          'Neither falls — there is no gravity in a vacuum',
        ],
        correctIndex: 2,
        clue: {
          title: 'Gravity in a Vacuum',
          explanation:
            'In a vacuum, there is no air resistance. Gravity accelerates all objects at the same rate (about 9.8 m/s² on Earth) regardless of their mass, so both hit the ground simultaneously.',
          visual: 'text',
          cost: 10,
        },
        coinsOnCorrect: 30,
      },
      {
        id: 'g6-science-3-q5',
        narrative:
          'A magnetic rail launches a small cart along a track. The cart speeds up as long as the magnetic force is applied.',
        question: 'What happens to the speed of an object when an unbalanced force acts on it?',
        options: [
          'Its speed stays the same',
          'It immediately stops',
          'Its speed changes — it accelerates or decelerates',
          'It reverses direction instantly',
        ],
        correctIndex: 2,
        clue: {
          title: 'Unbalanced Forces',
          explanation:
            'An unbalanced (net) force causes an object to accelerate — its speed or direction changes. If the force is in the direction of motion, the object speeds up. If opposite, it slows down.',
          visual: 'text',
          cost: 10,
        },
        coinsOnCorrect: 30,
      },
    ],
  },

  // ============================================================
  // GRADE 7 MYP — Quest 2: Photosynthesis & Respiration
  // ============================================================
  {
    id: 'g7-science-2',
    grade: 7,
    programme: 'MYP',
    subject: 'science',
    title: 'Photosynthesis & Respiration',
    realmName: 'The Emerald Canopy',
    narrativeWorld:
      'Deep within the Emerald Canopy, colossal trees stretch to the sky and the air hums with life energy. But a creeping shadow called the Grey Blight is suffocating the forest, blocking sunlight and poisoning the air. You must master the secrets of photosynthesis and respiration to heal the land.',
    characterTeacher: 'Druid Chlora',
    teacherEmoji: '🍃',
    theme: 'dungeon',
    coinReward: 150,
    boss: {
      id: 'g7-science-2-boss',
      title: 'The Breath Stealer',
      villain: 'The Grey Blight',
      villainEmoji: '🌫️',
      narrative:
        'The Grey Blight manifests as a swirling cloud of toxic fog at the forest\'s heart. It claims to have made photosynthesis obsolete. Prove it wrong and restore the balance of gases in the Emerald Canopy.',
      question:
        'The Grey Blight poses three challenges: (A) Write the word equation for photosynthesis and explain where each reactant comes from. (B) Explain how photosynthesis and aerobic respiration are opposite processes in terms of their reactants and products. (C) Why would blocking all sunlight eventually kill both plants AND animals in the forest?',
      answer:
        '(A) Carbon dioxide + water → glucose + oxygen. Carbon dioxide comes from the air, water is absorbed through the roots, and light energy from the Sun drives the reaction. (B) Photosynthesis uses CO₂ and water to produce glucose and O₂, while aerobic respiration uses glucose and O₂ to produce CO₂ and water — they are essentially reverse reactions. (C) Without sunlight, plants cannot photosynthesize, so they stop producing glucose (food) and oxygen. Plants die first, then animals lose both their food source and their oxygen supply.',
      hints: [
        'Photosynthesis needs light, CO₂, and water.',
        'Compare the inputs and outputs of each process.',
        'Think about what animals depend on plants for.',
      ],
      coinReward: 75,
    },
    questions: [
      {
        id: 'g7-science-2-q1',
        narrative:
          'Druid Chlora holds a glowing leaf up to the light. Green pigments shimmer inside its cells.',
        question: 'Which pigment in plant cells absorbs light energy for photosynthesis?',
        options: ['Haemoglobin', 'Chlorophyll', 'Melanin', 'Carotene'],
        correctIndex: 1,
        clue: {
          title: 'Chlorophyll',
          explanation:
            'Chlorophyll is the green pigment found in chloroplasts. It absorbs red and blue light and reflects green light, which is why leaves appear green. It captures light energy to power photosynthesis.',
          visual: 'text',
          cost: 10,
        },
        coinsOnCorrect: 30,
      },
      {
        id: 'g7-science-2-q2',
        narrative:
          'You enter a sealed crystal chamber. Druid Chlora places a plant inside and asks you to predict what gas it will release in bright light.',
        question: 'What gas is released by plants during photosynthesis?',
        options: ['Carbon dioxide', 'Nitrogen', 'Oxygen', 'Hydrogen'],
        correctIndex: 2,
        clue: {
          title: 'Products of Photosynthesis',
          explanation:
            'During photosynthesis, plants take in carbon dioxide and water, using light energy to produce glucose and oxygen. The oxygen is released as a by-product through the stomata.',
          visual: 'diagram',
          cost: 10,
        },
        coinsOnCorrect: 30,
      },
      {
        id: 'g7-science-2-q3',
        narrative:
          'At night, the forest still hums with activity. Druid Chlora explains that plants don\'t stop all chemical processes when the Sun goes down.',
        question: 'Do plants carry out respiration at night?',
        options: [
          'No, plants only photosynthesize',
          'Yes, plants respire all the time — day and night',
          'Only dead plants respire',
          'Plants respire only in winter',
        ],
        correctIndex: 1,
        clue: {
          title: 'Plant Respiration',
          explanation:
            'Plants respire 24 hours a day, breaking down glucose to release energy. During the day, photosynthesis produces more oxygen than respiration uses, so net oxygen is released. At night, only respiration occurs.',
          visual: 'text',
          cost: 10,
        },
        coinsOnCorrect: 30,
      },
      {
        id: 'g7-science-2-q4',
        narrative:
          'A wilting flower sits in a dark corner of the forest. Its leaves are pale and thin.',
        question:
          'What are the THREE main things a plant needs for photosynthesis?',
        options: [
          'Oxygen, glucose, and soil',
          'Carbon dioxide, water, and light energy',
          'Nitrogen, minerals, and heat',
          'Oxygen, water, and darkness',
        ],
        correctIndex: 1,
        clue: {
          title: 'Reactants of Photosynthesis',
          explanation:
            'Photosynthesis requires carbon dioxide (from air), water (from soil via roots), and light energy (from the Sun). These combine in the chloroplasts to produce glucose and oxygen.',
          visual: 'diagram',
          cost: 10,
        },
        coinsOnCorrect: 30,
      },
      {
        id: 'g7-science-2-q5',
        narrative:
          'Druid Chlora shows you a diagram of a cell with tiny oval structures scattered throughout.',
        question: 'In which organelle does aerobic respiration mainly take place?',
        options: ['Chloroplast', 'Nucleus', 'Mitochondria', 'Cell wall'],
        correctIndex: 2,
        clue: {
          title: 'Mitochondria',
          explanation:
            'Mitochondria are known as the "powerhouses of the cell." They are the organelles where aerobic respiration occurs, breaking down glucose with oxygen to release energy (ATP), carbon dioxide, and water.',
          visual: 'diagram',
          cost: 10,
        },
        coinsOnCorrect: 30,
      },
    ],
  },

  // ============================================================
  // GRADE 7 MYP — Quest 3: Speed, Velocity & Forces
  // ============================================================
  {
    id: 'g7-science-3',
    grade: 7,
    programme: 'MYP',
    subject: 'science',
    title: 'Speed, Velocity & Forces',
    realmName: 'The Stormrider Circuit',
    narrativeWorld:
      'The Stormrider Circuit is a legendary racecourse woven through thunderclouds and mountain passes. Riders harness the power of speed, velocity, and force to navigate treacherous turns. The course has been sabotaged by a rogue engineer, and only physics can set things right.',
    characterTeacher: 'Pilot Vex',
    teacherEmoji: '🏎️',
    theme: 'dungeon',
    coinReward: 150,
    boss: {
      id: 'g7-science-3-boss',
      title: 'The Velocity Phantom',
      villain: 'Phantom Drift',
      villainEmoji: '👻',
      narrative:
        'Phantom Drift materializes on the final stretch of the circuit, a ghostly racer who warps speed and direction. To outrun him, you must master the difference between speed and velocity, and understand the forces at play.',
      question:
        'Phantom Drift poses three riddles: (A) A car travels 150 km north in 3 hours, then 150 km south in 3 hours. Calculate its average speed and its average velocity. (B) Explain why a car going around a circular track at a constant speed is still accelerating. (C) What force keeps the car moving in a circle rather than flying off in a straight line?',
      answer:
        '(A) Average speed = total distance ÷ total time = 300 km ÷ 6 h = 50 km/h. Average velocity = total displacement ÷ total time = 0 km ÷ 6 h = 0 km/h (it returned to the start). (B) Acceleration is a change in velocity, and velocity includes direction. Even at constant speed, the car\'s direction constantly changes on the circular track, so it is accelerating. (C) Centripetal force (provided by friction between the tyres and the road) acts towards the centre of the circle, keeping the car on its curved path.',
      hints: [
        'Speed uses distance; velocity uses displacement.',
        'Velocity is a vector — it has both magnitude and direction.',
        'Think about what force points toward the centre of a circle.',
      ],
      coinReward: 75,
    },
    questions: [
      {
        id: 'g7-science-3-q1',
        narrative:
          'Pilot Vex clocks your training run. You cover 200 metres in 25 seconds along a straight track.',
        question: 'What is your average speed?',
        options: ['5 m/s', '8 m/s', '25 m/s', '175 m/s'],
        correctIndex: 1,
        clue: {
          title: 'Speed Calculation',
          explanation:
            'Average speed = total distance ÷ total time. So 200 m ÷ 25 s = 8 m/s. Speed tells you how fast you are going but not which direction.',
          visual: 'numberLine',
          cost: 10,
        },
        coinsOnCorrect: 30,
      },
      {
        id: 'g7-science-3-q2',
        narrative:
          'Two racers leave the starting line. Racer A goes 100 m east. Racer B goes 60 m east then 40 m west.',
        question:
          'What is Racer B\'s total displacement?',
        options: ['100 m east', '20 m east', '60 m west', '40 m west'],
        correctIndex: 1,
        clue: {
          title: 'Displacement vs Distance',
          explanation:
            'Displacement is the straight-line distance from start to finish with direction. Racer B went 60 m east then 40 m west, so displacement = 60 − 40 = 20 m east. Total distance travelled was 100 m, but displacement only cares about the net change in position.',
          visual: 'numberLine',
          cost: 10,
        },
        coinsOnCorrect: 30,
      },
      {
        id: 'g7-science-3-q3',
        narrative:
          'A distance–time graph on the control screen shows a straight line going upward at a steep angle.',
        question: 'What does a straight diagonal line on a distance–time graph indicate?',
        options: [
          'The object is stationary',
          'The object is moving at a constant speed',
          'The object is accelerating',
          'The object is decelerating',
        ],
        correctIndex: 1,
        clue: {
          title: 'Distance–Time Graphs',
          explanation:
            'On a distance–time graph, a straight diagonal line means constant speed. The steeper the line, the faster the speed. A flat horizontal line means the object is not moving. A curved line means the speed is changing.',
          visual: 'diagram',
          cost: 10,
        },
        coinsOnCorrect: 30,
      },
      {
        id: 'g7-science-3-q4',
        narrative:
          'Pilot Vex explains the difference between two measurements: one has direction, one does not.',
        question: 'What is the key difference between speed and velocity?',
        options: [
          'Speed is faster than velocity',
          'Velocity includes direction, speed does not',
          'Speed is measured in km and velocity in metres',
          'There is no difference',
        ],
        correctIndex: 1,
        clue: {
          title: 'Scalars vs Vectors',
          explanation:
            'Speed is a scalar quantity — it only has magnitude (e.g., 30 m/s). Velocity is a vector — it has both magnitude and direction (e.g., 30 m/s north). Two objects can have the same speed but different velocities if they travel in different directions.',
          visual: 'text',
          cost: 10,
        },
        coinsOnCorrect: 30,
      },
      {
        id: 'g7-science-3-q5',
        narrative:
          'Your racer approaches a sharp turn. Pilot Vex warns that taking the turn too fast could send you flying off the track.',
        question: 'What happens to an object moving in a straight line if no force acts on it?',
        options: [
          'It stops immediately',
          'It continues in a straight line at the same speed',
          'It gradually speeds up',
          'It changes direction randomly',
        ],
        correctIndex: 1,
        clue: {
          title: 'Newton\'s First Law',
          explanation:
            'An object in motion stays in motion in a straight line at constant speed unless acted on by an unbalanced force. This is Newton\'s First Law (the law of inertia). A force is needed to change speed or direction.',
          visual: 'text',
          cost: 10,
        },
        coinsOnCorrect: 30,
      },
    ],
  },

  // ============================================================
  // GRADE 8 MYP — Quest 2: Chemical Reactions
  // ============================================================
  {
    id: 'g8-science-2',
    grade: 8,
    programme: 'MYP',
    subject: 'science',
    title: 'Chemical Reactions',
    realmName: 'The Alchemist\'s Crucible',
    narrativeWorld:
      'You descend into the Alchemist\'s Crucible, a vast underground laboratory carved from crystalline rock. Bubbling cauldrons, glowing flasks, and strange vapours fill every chamber. A rogue alchemist has destabilized the reactions below the surface, and only someone who understands chemistry can prevent a catastrophic meltdown.',
    characterTeacher: 'Alchemist Pyra',
    teacherEmoji: '🧪',
    theme: 'dungeon',
    coinReward: 150,
    boss: {
      id: 'g8-science-2-boss',
      title: 'The Reaction Master',
      villain: 'Baron Combustion',
      villainEmoji: '🔥',
      narrative:
        'Baron Combustion stands before a towering furnace, cackling as unstable reactions rage out of control. He believes chemistry is chaos. Prove him wrong by showing that chemical reactions follow precise rules.',
      question:
        'Baron Combustion demands answers: (A) What is the law of conservation of mass and how does it apply to chemical reactions? (B) Give two signs that a chemical reaction has taken place. (C) In the reaction between hydrochloric acid and sodium hydroxide, what type of reaction is this and what are the products?',
      answer:
        '(A) The law of conservation of mass states that matter cannot be created or destroyed in a chemical reaction — the total mass of reactants equals the total mass of products. Atoms are rearranged, not lost. (B) Signs include: colour change, gas production (bubbles), temperature change, formation of a precipitate, or production of light/sound. (C) It is a neutralisation reaction. The products are sodium chloride (salt) and water: HCl + NaOH → NaCl + H₂O.',
      hints: [
        'Atoms are rearranged in reactions, not created or destroyed.',
        'Think about what you can see, feel, or smell when a reaction happens.',
        'Acid + alkali = salt + water.',
      ],
      coinReward: 75,
    },
    questions: [
      {
        id: 'g8-science-2-q1',
        narrative:
          'Alchemist Pyra mixes two clear liquids in a flask. A bright yellow solid suddenly appears at the bottom.',
        question: 'What is the yellow solid that forms called?',
        options: ['A solvent', 'A precipitate', 'A catalyst', 'An electrode'],
        correctIndex: 1,
        clue: {
          title: 'Precipitates',
          explanation:
            'A precipitate is an insoluble solid that forms when two solutions react. It appears as a solid settling out of the liquid. This is one sign that a chemical reaction has occurred.',
          visual: 'text',
          cost: 10,
        },
        coinsOnCorrect: 30,
      },
      {
        id: 'g8-science-2-q2',
        narrative:
          'Alchemist Pyra places magnesium ribbon in a flame. It burns with a brilliant white light, leaving a white powder behind.',
        question:
          'When magnesium burns in air, it combines with oxygen. What type of reaction is this?',
        options: ['Decomposition', 'Neutralisation', 'Oxidation (combustion)', 'Displacement'],
        correctIndex: 2,
        clue: {
          title: 'Combustion / Oxidation',
          explanation:
            'When a substance reacts with oxygen it is called oxidation. Burning magnesium in air is a combustion reaction: 2Mg + O₂ → 2MgO. The magnesium oxide (white powder) is the product.',
          visual: 'text',
          cost: 10,
        },
        coinsOnCorrect: 30,
      },
      {
        id: 'g8-science-2-q3',
        narrative:
          'A sealed flask contains exactly 50 g of reactants. After the reaction finishes, Alchemist Pyra asks you to predict the mass of the products.',
        question:
          'According to the law of conservation of mass, what is the total mass of the products?',
        options: ['Less than 50 g', 'Exactly 50 g', 'More than 50 g', 'It depends on the reaction type'],
        correctIndex: 1,
        clue: {
          title: 'Conservation of Mass',
          explanation:
            'In a chemical reaction, atoms are rearranged but never created or destroyed. Therefore the total mass of the products must equal the total mass of the reactants: 50 g in = 50 g out.',
          visual: 'numberLine',
          cost: 10,
        },
        coinsOnCorrect: 30,
      },
      {
        id: 'g8-science-2-q4',
        narrative:
          'Alchemist Pyra drops a piece of zinc into copper sulfate solution. The blue colour slowly fades and a reddish coating appears on the zinc.',
        question: 'What type of reaction is occurring?',
        options: [
          'Neutralisation',
          'Displacement',
          'Decomposition',
          'Photosynthesis',
        ],
        correctIndex: 1,
        clue: {
          title: 'Displacement Reactions',
          explanation:
            'A more reactive metal can displace a less reactive metal from its compound. Zinc is more reactive than copper, so zinc displaces copper from copper sulfate: Zn + CuSO₄ → ZnSO₄ + Cu.',
          visual: 'diagram',
          cost: 10,
        },
        coinsOnCorrect: 30,
      },
      {
        id: 'g8-science-2-q5',
        narrative:
          'A reaction is happening very slowly. Alchemist Pyra adds a mysterious powder and the reaction speeds up dramatically, but the powder itself remains unchanged.',
        question: 'What is the mysterious powder most likely to be?',
        options: [
          'A reactant',
          'A product',
          'A catalyst',
          'A precipitate',
        ],
        correctIndex: 2,
        clue: {
          title: 'Catalysts',
          explanation:
            'A catalyst is a substance that speeds up a chemical reaction without being used up itself. It lowers the activation energy needed for the reaction to occur. Enzymes are biological catalysts.',
          visual: 'text',
          cost: 10,
        },
        coinsOnCorrect: 30,
      },
    ],
  },

  // ============================================================
  // GRADE 8 MYP — Quest 3: Waves (Sound & Light)
  // ============================================================
  {
    id: 'g8-science-3',
    grade: 8,
    programme: 'MYP',
    subject: 'science',
    title: 'Waves (Sound & Light)',
    realmName: 'The Resonance Caverns',
    narrativeWorld:
      'The Resonance Caverns echo with the sound of dripping crystals and shimmering light beams. Once a place of harmony, the caverns have been thrown into dissonance by a creature that warps sound and bends light. You must master wave science to restore the symphony of the deep.',
    characterTeacher: 'Echo Mistress Lyra',
    teacherEmoji: '🔔',
    theme: 'dungeon',
    coinReward: 150,
    boss: {
      id: 'g8-science-3-boss',
      title: 'The Dissonance',
      villain: 'Warden Shatter',
      villainEmoji: '💎',
      narrative:
        'Warden Shatter sits atop a throne of fractured crystals, bending sound waves into painful screeches and splitting light into blinding chaos. Only a master of wave science can silence him.',
      question:
        'Warden Shatter demands you solve three puzzles: (A) Explain the difference between transverse and longitudinal waves, giving one example of each. (B) A sound wave has a frequency of 500 Hz and a wavelength of 0.68 m. Calculate the speed of sound in this medium. (C) Why can light travel through space but sound cannot?',
      answer:
        '(A) In transverse waves, the vibrations are perpendicular to the direction of energy transfer (e.g., light waves, water ripples). In longitudinal waves, the vibrations are parallel to the direction of energy transfer (e.g., sound waves). (B) Speed = frequency × wavelength = 500 × 0.68 = 340 m/s. (C) Sound is a mechanical wave that needs a medium (particles) to travel through. Space is a vacuum with no particles, so sound cannot travel. Light is an electromagnetic wave that does not need a medium.',
      hints: [
        'Think about the direction of vibration relative to wave travel.',
        'Use the wave equation: v = f × λ.',
        'Consider what medium means — does space have particles?',
      ],
      coinReward: 75,
    },
    questions: [
      {
        id: 'g8-science-3-q1',
        narrative:
          'Echo Mistress Lyra plucks a crystal string. The vibration ripples outward like a wave on water.',
        question: 'What type of wave has vibrations perpendicular to the direction of energy transfer?',
        options: [
          'Longitudinal wave',
          'Transverse wave',
          'Sound wave',
          'Compression wave',
        ],
        correctIndex: 1,
        clue: {
          title: 'Transverse Waves',
          explanation:
            'Transverse waves have vibrations (oscillations) at right angles to the direction the wave travels. Examples include light waves, water surface waves, and waves on a string.',
          visual: 'diagram',
          cost: 10,
        },
        coinsOnCorrect: 30,
      },
      {
        id: 'g8-science-3-q2',
        narrative:
          'You clap your hands in the cavern and hear the echo 2 seconds later. The cavern wall is 340 metres away.',
        question: 'Why do we hear an echo?',
        options: [
          'Sound is absorbed by the wall',
          'Sound is reflected off the wall back to our ears',
          'Sound speeds up near walls',
          'The wall creates its own sound',
        ],
        correctIndex: 1,
        clue: {
          title: 'Echoes and Reflection',
          explanation:
            'An echo occurs when sound waves hit a hard surface and are reflected back. We hear the reflected sound after a short delay because it takes time for the sound to travel to the surface and back.',
          visual: 'text',
          cost: 10,
        },
        coinsOnCorrect: 30,
      },
      {
        id: 'g8-science-3-q3',
        narrative:
          'Echo Mistress Lyra shines a beam of white light through a glass prism. A rainbow of colours fans out on the other side.',
        question: 'What is happening to the white light as it passes through the prism?',
        options: [
          'The light is being reflected',
          'The light is being absorbed',
          'The light is being dispersed into its component colours',
          'The light is being destroyed',
        ],
        correctIndex: 2,
        clue: {
          title: 'Dispersion',
          explanation:
            'White light is made up of all colours of the visible spectrum. When it passes through a prism, each colour refracts (bends) by a slightly different amount, spreading them out into a spectrum — this is called dispersion.',
          visual: 'diagram',
          cost: 10,
        },
        coinsOnCorrect: 30,
      },
      {
        id: 'g8-science-3-q4',
        narrative:
          'A tuning fork vibrates 256 times per second, producing a musical note.',
        question: 'What is the frequency of this tuning fork?',
        options: ['256 m/s', '256 Hz', '256 N', '256 J'],
        correctIndex: 1,
        clue: {
          title: 'Frequency',
          explanation:
            'Frequency is the number of complete waves (vibrations) per second, measured in Hertz (Hz). If a tuning fork vibrates 256 times per second, its frequency is 256 Hz.',
          visual: 'numberLine',
          cost: 10,
        },
        coinsOnCorrect: 30,
      },
      {
        id: 'g8-science-3-q5',
        narrative:
          'Two notes are played: one with a high pitch and one with a low pitch. Echo Mistress Lyra asks what physical property differs between them.',
        question: 'What property of a sound wave determines its pitch?',
        options: ['Amplitude', 'Frequency', 'Wavelength only', 'Speed'],
        correctIndex: 1,
        clue: {
          title: 'Pitch and Frequency',
          explanation:
            'Pitch is determined by frequency. A high-frequency sound wave produces a high-pitched note, while a low-frequency wave produces a low-pitched note. Amplitude determines loudness, not pitch.',
          visual: 'text',
          cost: 10,
        },
        coinsOnCorrect: 30,
      },
    ],
  },

  // ============================================================
  // GRADE 9 MYP — Quest 2: Newton's Laws
  // ============================================================
  {
    id: 'g9-science-2',
    grade: 9,
    programme: 'MYP',
    subject: 'science',
    title: "Newton's Laws",
    realmName: 'The Graviton Fortress',
    narrativeWorld:
      'The Graviton Fortress floats above a shattered planet, held aloft by ancient engines that obey Newton\'s Laws. A warlord has seized control, using gravity and force to trap anyone who enters. You must master the three laws of motion to reclaim the fortress.',
    characterTeacher: 'Captain Newton',
    teacherEmoji: '🍎',
    theme: 'dungeon',
    coinReward: 150,
    boss: {
      id: 'g9-science-2-boss',
      title: 'The Force Warden',
      villain: 'Warlord Momentum',
      villainEmoji: '⚔️',
      narrative:
        'Warlord Momentum stands in the gravity chamber, surrounded by floating debris. He boasts that no one can overcome his force field. Prove your mastery of Newton\'s Laws to shatter his defences.',
      question:
        'Warlord Momentum challenges you: (A) State Newton\'s Second Law and use it to calculate the acceleration of a 5 kg object when a net force of 20 N is applied. (B) A cannon fires a cannonball forward. Explain, using Newton\'s Third Law, why the cannon recoils backward. (C) An astronaut floating in space throws a wrench. Explain what happens to the astronaut and why, referring to Newton\'s Laws.',
      answer:
        '(A) Newton\'s Second Law: F = ma (force equals mass times acceleration). a = F/m = 20 N / 5 kg = 4 m/s². (B) Newton\'s Third Law states that every action has an equal and opposite reaction. The cannon exerts a forward force on the cannonball, and the cannonball exerts an equal backward force on the cannon, causing it to recoil. (C) When the astronaut throws the wrench forward, by Newton\'s Third Law, the wrench pushes back on the astronaut with an equal and opposite force. The astronaut moves backward. By Newton\'s First Law, both will continue moving in their respective directions since there are no friction forces in space.',
      hints: [
        'F = ma — rearrange for acceleration.',
        'Third Law: forces come in action-reaction pairs on different objects.',
        'In space there is no friction to slow things down.',
      ],
      coinReward: 75,
    },
    questions: [
      {
        id: 'g9-science-2-q1',
        narrative:
          'Captain Newton places a book on a perfectly smooth table. He gives it a gentle push and it slides across without stopping.',
        question: 'Which of Newton\'s Laws explains why the book keeps moving on a frictionless surface?',
        options: [
          'Newton\'s First Law (Law of Inertia)',
          'Newton\'s Second Law',
          'Newton\'s Third Law',
          'The Law of Gravity',
        ],
        correctIndex: 0,
        clue: {
          title: 'Newton\'s First Law',
          explanation:
            'Newton\'s First Law states that an object at rest stays at rest, and an object in motion stays in motion at constant velocity, unless acted upon by an unbalanced force. On a frictionless surface, no force opposes the motion.',
          visual: 'text',
          cost: 10,
        },
        coinsOnCorrect: 30,
      },
      {
        id: 'g9-science-2-q2',
        narrative:
          'A training droid accelerates across the fortress floor. Captain Newton tells you its mass is 10 kg and the net force on it is 30 N.',
        question: 'What is the droid\'s acceleration?',
        options: ['0.3 m/s²', '3 m/s²', '20 m/s²', '300 m/s²'],
        correctIndex: 1,
        clue: {
          title: 'F = ma',
          explanation:
            'Newton\'s Second Law: F = ma. Rearranging for acceleration: a = F/m = 30 N / 10 kg = 3 m/s². A larger force or smaller mass means greater acceleration.',
          visual: 'numberLine',
          cost: 10,
        },
        coinsOnCorrect: 30,
      },
      {
        id: 'g9-science-2-q3',
        narrative:
          'You stand on a hoverboard and push against a wall. Instead of the wall moving, you glide backward.',
        question: 'Which law explains why you move backward when you push the wall?',
        options: [
          'Newton\'s First Law',
          'Newton\'s Second Law',
          'Newton\'s Third Law',
          'The law of conservation of energy',
        ],
        correctIndex: 2,
        clue: {
          title: 'Newton\'s Third Law',
          explanation:
            'Newton\'s Third Law states that for every action there is an equal and opposite reaction. You push the wall (action), and the wall pushes you back (reaction). Since you are on a hoverboard with little friction, you move backward.',
          visual: 'diagram',
          cost: 10,
        },
        coinsOnCorrect: 30,
      },
      {
        id: 'g9-science-2-q4',
        narrative:
          'Two objects have different masses: a 2 kg ball and a 10 kg ball. The same 20 N force is applied to each.',
        question: 'Which ball has the greater acceleration and why?',
        options: [
          'The 10 kg ball — heavier objects accelerate faster',
          'The 2 kg ball — less mass means more acceleration for the same force',
          'They accelerate equally — force is the same',
          'Neither accelerates — 20 N is not enough force',
        ],
        correctIndex: 1,
        clue: {
          title: 'Mass and Acceleration',
          explanation:
            'From F = ma, a = F/m. For the 2 kg ball: a = 20/2 = 10 m/s². For the 10 kg ball: a = 20/10 = 2 m/s². The smaller mass has the larger acceleration when the same force is applied.',
          visual: 'numberLine',
          cost: 10,
        },
        coinsOnCorrect: 30,
      },
      {
        id: 'g9-science-2-q5',
        narrative:
          'Captain Newton shows you a video of a hammer and a feather being dropped on the Moon by an Apollo astronaut. Both hit the ground at the same time.',
        question: 'Why do the hammer and feather land at the same time on the Moon?',
        options: [
          'The Moon has no gravity',
          'The Moon has no air resistance, so only gravity acts on both objects equally',
          'The feather is heavier on the Moon',
          'The hammer falls slower on the Moon',
        ],
        correctIndex: 1,
        clue: {
          title: 'Gravity Without Air Resistance',
          explanation:
            'The Moon has no atmosphere, so there is no air resistance. Gravity accelerates all objects equally regardless of mass (about 1.6 m/s² on the Moon). On Earth, air resistance makes the feather fall slower.',
          visual: 'text',
          cost: 10,
        },
        coinsOnCorrect: 30,
      },
    ],
  },

  // ============================================================
  // GRADE 9 MYP — Quest 3: Periodic Table & Reactivity
  // ============================================================
  {
    id: 'g9-science-3',
    grade: 9,
    programme: 'MYP',
    subject: 'science',
    title: 'Periodic Table & Reactivity',
    realmName: 'The Elemental Vault',
    narrativeWorld:
      'The Elemental Vault is a grand library where every element is stored as a glowing crystal orb, arranged in rows and columns just like the periodic table. A thief has scrambled the orbs, mixing reactive metals with noble gases. You must restore order using your knowledge of periodicity and reactivity.',
    characterTeacher: 'Curator Mendel',
    teacherEmoji: '⚗️',
    theme: 'dungeon',
    coinReward: 150,
    boss: {
      id: 'g9-science-3-boss',
      title: 'The Element Thief',
      villain: 'Isotope Rex',
      villainEmoji: '🧬',
      narrative:
        'Isotope Rex lurks in the deepest chamber of the vault, clutching stolen element orbs. He claims the periodic table is meaningless. Show him that patterns in the table predict chemical behaviour.',
      question:
        'Isotope Rex demands three proofs: (A) Explain why elements in the same group of the periodic table have similar chemical properties. (B) Arrange these metals in order of reactivity from most to least reactive: copper, potassium, iron, gold. (C) Potassium reacts vigorously with water. Write a word equation for this reaction and describe what you would observe.',
      answer:
        '(A) Elements in the same group have the same number of electrons in their outer shell, and it is the outer electrons that determine how an element reacts. So elements in the same group react in similar ways. (B) Most to least reactive: potassium, iron, copper, gold. (C) Potassium + water → potassium hydroxide + hydrogen. You would see the potassium fizzing vigorously on the water surface, producing hydrogen gas, and it may catch fire with a lilac flame. The solution becomes alkaline.',
      hints: [
        'Chemical properties depend on outer shell electrons.',
        'Use the reactivity series: K > Na > Ca > Mg > Al > Zn > Fe > Cu > Ag > Au.',
        'Group 1 metals react with water to form a metal hydroxide and hydrogen gas.',
      ],
      coinReward: 75,
    },
    questions: [
      {
        id: 'g9-science-3-q1',
        narrative:
          'Curator Mendel points to a column of glowing orbs on the left side of the vault. "These are the most reactive metals," she says.',
        question: 'Which group of the periodic table contains the alkali metals?',
        options: ['Group 1', 'Group 7', 'Group 0', 'Group 4'],
        correctIndex: 0,
        clue: {
          title: 'Alkali Metals',
          explanation:
            'Group 1 contains the alkali metals: lithium, sodium, potassium, rubidium, caesium, and francium. They all have one electron in their outer shell, making them highly reactive metals.',
          visual: 'diagram',
          cost: 10,
        },
        coinsOnCorrect: 30,
      },
      {
        id: 'g9-science-3-q2',
        narrative:
          'A series of orbs on the far right of the vault glow softly but refuse to react with anything Curator Mendel offers them.',
        question: 'Why are noble gases (Group 0) unreactive?',
        options: [
          'They are too heavy to react',
          'They have full outer electron shells',
          'They are radioactive',
          'They only exist in space',
        ],
        correctIndex: 1,
        clue: {
          title: 'Noble Gases',
          explanation:
            'Noble gases have full outer electron shells (e.g., helium has 2, neon has 8). Since they have a stable electron configuration, they do not need to gain, lose, or share electrons, making them chemically inert.',
          visual: 'diagram',
          cost: 10,
        },
        coinsOnCorrect: 30,
      },
      {
        id: 'g9-science-3-q3',
        narrative:
          'Curator Mendel places a piece of sodium in water. It fizzes rapidly, darting across the surface.',
        question: 'What gas is produced when an alkali metal reacts with water?',
        options: ['Oxygen', 'Carbon dioxide', 'Hydrogen', 'Nitrogen'],
        correctIndex: 2,
        clue: {
          title: 'Alkali Metals + Water',
          explanation:
            'When alkali metals react with water they produce a metal hydroxide and hydrogen gas. The hydrogen gas causes the fizzing. The "pop test" with a lit splint can confirm hydrogen is present.',
          visual: 'text',
          cost: 10,
        },
        coinsOnCorrect: 30,
      },
      {
        id: 'g9-science-3-q4',
        narrative:
          'Curator Mendel shows you four metals: magnesium, zinc, copper, and gold. She asks you to rank them by reactivity.',
        question: 'Which of the following metals is the MOST reactive?',
        options: ['Gold', 'Copper', 'Zinc', 'Magnesium'],
        correctIndex: 3,
        clue: {
          title: 'Reactivity Series',
          explanation:
            'The reactivity series ranks metals from most to least reactive. The order here is: magnesium > zinc > copper > gold. More reactive metals lose their outer electrons more easily.',
          visual: 'numberLine',
          cost: 10,
        },
        coinsOnCorrect: 30,
      },
      {
        id: 'g9-science-3-q5',
        narrative:
          'Two orbs sit side by side: fluorine (top of Group 7) and iodine (further down Group 7). Curator Mendel says their reactivity differs greatly.',
        question: 'How does reactivity change as you go DOWN Group 7 (the halogens)?',
        options: [
          'Reactivity increases going down',
          'Reactivity decreases going down',
          'Reactivity stays the same',
          'Halogens are not reactive',
        ],
        correctIndex: 1,
        clue: {
          title: 'Halogen Reactivity',
          explanation:
            'In Group 7, reactivity decreases going down. Fluorine is the most reactive halogen. As atoms get larger, the outer shell is further from the nucleus, so it is harder to attract an extra electron to complete the shell.',
          visual: 'text',
          cost: 10,
        },
        coinsOnCorrect: 30,
      },
    ],
  },

  // ============================================================
  // GRADE 10 MYP — Quest 2: Reproduction & Evolution
  // ============================================================
  {
    id: 'g10-science-2',
    grade: 10,
    programme: 'MYP',
    subject: 'science',
    title: 'Reproduction & Evolution',
    realmName: 'The Genesis Archive',
    narrativeWorld:
      'The Genesis Archive is a living museum where ancient creatures are preserved in crystallised amber and holograms of DNA spiral upward through towering halls. A corrupting force has begun rewriting the genetic records, threatening to erase millions of years of evolutionary history. You must defend the archive with your knowledge of reproduction and evolution.',
    characterTeacher: 'Archivist Gena',
    teacherEmoji: '🧬',
    theme: 'dungeon',
    coinReward: 150,
    boss: {
      id: 'g10-science-2-boss',
      title: 'The Genome Corruptor',
      villain: 'Muton the Unraveller',
      villainEmoji: '🦠',
      narrative:
        'Muton the Unraveller sits in the core of the archive, pulling strands of DNA apart and splicing them at random. He believes evolution has no logic. Show him that natural selection follows clear principles.',
      question:
        'Muton poses three challenges: (A) Explain the difference between mitosis and meiosis in terms of purpose and chromosome number. (B) Describe how natural selection leads to the evolution of antibiotic-resistant bacteria. (C) Why is genetic variation important for the survival of a species?',
      answer:
        '(A) Mitosis produces two genetically identical daughter cells with the same chromosome number as the parent — it is used for growth and repair. Meiosis produces four genetically different cells with half the chromosome number — it is used to produce gametes (sex cells). (B) In a bacterial population, some bacteria may have random mutations that make them resistant to an antibiotic. When the antibiotic is applied, non-resistant bacteria die, but resistant ones survive and reproduce, passing on the resistance gene. Over time, the population becomes mostly resistant. (C) Genetic variation means individuals have different traits. If the environment changes, some individuals may have traits better suited to survive. Without variation, an entire species could be wiped out by a single disease or environmental change.',
      hints: [
        'Mitosis = 2 identical cells. Meiosis = 4 different cells with half the chromosomes.',
        'Think about survival of the fittest in a population exposed to antibiotics.',
        'Variation provides a "safety net" for changing environments.',
      ],
      coinReward: 75,
    },
    questions: [
      {
        id: 'g10-science-2-q1',
        narrative:
          'Archivist Gena activates a hologram showing a cell dividing into two identical copies.',
        question: 'What type of cell division produces two genetically identical daughter cells?',
        options: ['Meiosis', 'Mitosis', 'Fertilisation', 'Binary fusion'],
        correctIndex: 1,
        clue: {
          title: 'Mitosis',
          explanation:
            'Mitosis is cell division that produces two genetically identical daughter cells, each with the same number of chromosomes as the parent cell. It is used for growth, repair, and asexual reproduction.',
          visual: 'diagram',
          cost: 10,
        },
        coinsOnCorrect: 30,
      },
      {
        id: 'g10-science-2-q2',
        narrative:
          'A display shows the human chromosome count: 46 in body cells, but a different number in egg and sperm cells.',
        question: 'How many chromosomes are in a human gamete (sex cell)?',
        options: ['46', '23', '92', '12'],
        correctIndex: 1,
        clue: {
          title: 'Gametes and Meiosis',
          explanation:
            'Meiosis halves the chromosome number. Human body cells have 46 chromosomes (23 pairs). Gametes (eggs and sperm) have 23 chromosomes. When fertilisation occurs, the full 46 is restored.',
          visual: 'numberLine',
          cost: 10,
        },
        coinsOnCorrect: 30,
      },
      {
        id: 'g10-science-2-q3',
        narrative:
          'Archivist Gena shows fossils of finches from different islands. Each has a differently shaped beak.',
        question: 'What is the best explanation for the different beak shapes among these finches?',
        options: [
          'The finches chose to change their beaks',
          'Natural selection favoured beak shapes suited to available food on each island',
          'All birds eventually grow the same beak',
          'The beaks changed due to temperature differences only',
        ],
        correctIndex: 1,
        clue: {
          title: 'Natural Selection',
          explanation:
            'Darwin\'s finches are a classic example of natural selection. On each island, finches with beak shapes best suited to the available food sources were more likely to survive and reproduce, passing on those traits.',
          visual: 'text',
          cost: 10,
        },
        coinsOnCorrect: 30,
      },
      {
        id: 'g10-science-2-q4',
        narrative:
          'A strand of DNA is displayed, and one base pair has been randomly changed.',
        question: 'What is a random change in the DNA base sequence called?',
        options: ['Natural selection', 'A mutation', 'Mitosis', 'Fertilisation'],
        correctIndex: 1,
        clue: {
          title: 'Mutations',
          explanation:
            'A mutation is a random change in the DNA base sequence. Mutations can be harmful, beneficial, or neutral. They are a source of genetic variation in a population and can drive evolution if they affect survival.',
          visual: 'text',
          cost: 10,
        },
        coinsOnCorrect: 30,
      },
      {
        id: 'g10-science-2-q5',
        narrative:
          'Archivist Gena explains that some organisms reproduce without a mate, producing identical offspring.',
        question: 'What is reproduction that involves only one parent and produces genetically identical offspring called?',
        options: [
          'Sexual reproduction',
          'Asexual reproduction',
          'Cross-pollination',
          'Selective breeding',
        ],
        correctIndex: 1,
        clue: {
          title: 'Asexual Reproduction',
          explanation:
            'Asexual reproduction involves only one parent and produces genetically identical offspring (clones) through mitosis. Examples include bacterial binary fission, budding in yeast, and runners in strawberry plants.',
          visual: 'text',
          cost: 10,
        },
        coinsOnCorrect: 30,
      },
    ],
  },

  // ============================================================
  // GRADE 10 MYP — Quest 3: Chemical Reactions & Energy
  // ============================================================
  {
    id: 'g10-science-3',
    grade: 10,
    programme: 'MYP',
    subject: 'science',
    title: 'Chemical Reactions & Energy',
    realmName: 'The Pyroclasm Foundry',
    narrativeWorld:
      'Deep beneath a volcanic mountain lies the Pyroclasm Foundry, where rivers of molten metal flow alongside freezing chambers. The balance between exothermic and endothermic processes keeps the foundry stable. A rogue engineer has disrupted this balance, and explosions rock the chambers. You must master energy changes in reactions to restore order.',
    characterTeacher: 'Forge Master Kelvin',
    teacherEmoji: '🌋',
    theme: 'dungeon',
    coinReward: 150,
    boss: {
      id: 'g10-science-3-boss',
      title: 'The Entropy Engine',
      villain: 'Thermion the Unstable',
      villainEmoji: '💥',
      narrative:
        'Thermion the Unstable stands before the foundry\'s core reactor, feeding it random substances and watching explosions with glee. Prove that energy changes in reactions are predictable, not chaotic.',
      question:
        'Thermion demands three answers: (A) Define exothermic and endothermic reactions and give one example of each. (B) In an exothermic reaction, is the energy of the products higher or lower than the energy of the reactants? Explain using the concept of bond energies. (C) Calculate the overall energy change for a reaction if the total energy needed to break bonds in the reactants is 800 kJ and the total energy released forming bonds in the products is 1050 kJ. Is this exothermic or endothermic?',
      answer:
        '(A) Exothermic reactions release energy to the surroundings (temperature rises), e.g., combustion of methane. Endothermic reactions absorb energy from the surroundings (temperature drops), e.g., thermal decomposition of calcium carbonate. (B) In exothermic reactions, the products have lower energy than the reactants because more energy is released forming new bonds than is used breaking old bonds. (C) Energy change = energy to break bonds − energy released forming bonds = 800 − 1050 = −250 kJ. The negative value means the reaction is exothermic (energy is released).',
      hints: [
        'Exo = exit (energy leaves). Endo = enter (energy goes in).',
        'Bond breaking requires energy; bond making releases energy.',
        'If more energy is released than absorbed, the reaction is exothermic.',
      ],
      coinReward: 75,
    },
    questions: [
      {
        id: 'g10-science-3-q1',
        narrative:
          'Forge Master Kelvin holds a beaker. After mixing two chemicals, the beaker becomes very hot to the touch.',
        question: 'What type of reaction releases energy and causes the surroundings to heat up?',
        options: ['Endothermic', 'Exothermic', 'Catalytic', 'Displacement'],
        correctIndex: 1,
        clue: {
          title: 'Exothermic Reactions',
          explanation:
            'Exothermic reactions transfer energy to the surroundings, causing a temperature increase. The energy released comes from the formation of new chemical bonds in the products. Examples include combustion and neutralisation.',
          visual: 'text',
          cost: 10,
        },
        coinsOnCorrect: 30,
      },
      {
        id: 'g10-science-3-q2',
        narrative:
          'In the freezing chamber, Kelvin dissolves ammonium nitrate in water. The beaker feels ice cold.',
        question: 'What type of reaction absorbs energy from the surroundings?',
        options: ['Exothermic', 'Endothermic', 'Neutralisation', 'Oxidation'],
        correctIndex: 1,
        clue: {
          title: 'Endothermic Reactions',
          explanation:
            'Endothermic reactions absorb energy from the surroundings, causing a temperature decrease. The energy is needed to break chemical bonds in the reactants. Examples include thermal decomposition and dissolving certain salts.',
          visual: 'text',
          cost: 10,
        },
        coinsOnCorrect: 30,
      },
      {
        id: 'g10-science-3-q3',
        narrative:
          'Forge Master Kelvin draws an energy profile diagram showing the reactants at a high energy level and products at a lower energy level.',
        question: 'What does this energy profile diagram represent?',
        options: [
          'An endothermic reaction',
          'An exothermic reaction',
          'A reaction that does not involve energy',
          'A physical change, not a chemical reaction',
        ],
        correctIndex: 1,
        clue: {
          title: 'Energy Profile Diagrams',
          explanation:
            'In an energy profile diagram, if the products are at a lower energy level than the reactants, the reaction is exothermic — the difference in energy has been released to the surroundings.',
          visual: 'diagram',
          cost: 10,
        },
        coinsOnCorrect: 30,
      },
      {
        id: 'g10-science-3-q4',
        narrative:
          'Kelvin explains that starting a fire requires a match, even though combustion itself releases energy.',
        question: 'What is the minimum energy required to start a chemical reaction called?',
        options: ['Kinetic energy', 'Activation energy', 'Thermal energy', 'Bond energy'],
        correctIndex: 1,
        clue: {
          title: 'Activation Energy',
          explanation:
            'Activation energy is the minimum amount of energy reactant particles must have to collide successfully and start a reaction. Even exothermic reactions need activation energy to get started (e.g., a match to light a fire).',
          visual: 'diagram',
          cost: 10,
        },
        coinsOnCorrect: 30,
      },
      {
        id: 'g10-science-3-q5',
        narrative:
          'A reaction breaks bonds worth 600 kJ and forms new bonds releasing 900 kJ. Kelvin asks for the overall energy change.',
        question: 'What is the overall energy change of this reaction?',
        options: [
          '+300 kJ (endothermic)',
          '-300 kJ (exothermic)',
          '+1500 kJ (endothermic)',
          '0 kJ (no change)',
        ],
        correctIndex: 1,
        clue: {
          title: 'Calculating Energy Change',
          explanation:
            'Energy change = energy to break bonds − energy released forming bonds = 600 − 900 = −300 kJ. The negative sign indicates an exothermic reaction — more energy is released than absorbed.',
          visual: 'numberLine',
          cost: 10,
        },
        coinsOnCorrect: 30,
      },
    ],
  },

  // ─── GRADE 8 · MATH: ALGEBRA EQUATIONS ───────────────────────────────────────
  {
    id: 'g8-math-equations',
    grade: 8,
    programme: 'MYP',
    subject: 'math',
    title: 'The Equation Solver Quest',
    realmName: 'Equation Empire',
    narrativeWorld: 'An empire where algebraic equations guard the treasures of logic',
    characterTeacher: 'Algebra Alice',
    teacherEmoji: '🔢',
    theme: 'linear equations, variables on both sides, multi-step equations',
    coinReward: 120,
    boss: {
      id: 'g8-math-eq-boss',
      title: 'The Equation Emperor',
      villain: 'Equation Emperor',
      villainEmoji: '👑',
      narrative: 'Solve for x: 3(x - 2) = 2x + 9 AND write a word problem for 2x + 5 = 15',
      question: 'Solve: 3(x - 2) = 2x + 9 AND write a word problem for 2x + 5 = 15',
      answer: 'x = 15. Word problem example: "Ahmed has 5 more than twice Sara\'s candies. He has 15 total. How many does Sara have?"',
      hints: ['Expand: 3x - 6 = 2x + 9', 'Subtract 2x from both sides', 'Add 6 to both sides'],
      coinReward: 60,
    },
    questions: [
      { id: 'g8-math-eq-q1', narrative: 'Solve: x + 7 = 12', question: 'What is x?', options: ['5', '19', '84', '7'], correctIndex: 0, clue: { title: 'Simple Equation', explanation: 'x + 7 = 12. Subtract 7: x = 12 - 7 = 5!', visual: 'text', cost: 5 }, coinsOnCorrect: 20 },
      { id: 'g8-math-eq-q2', narrative: 'Solve: 2x = 18', question: 'What is x?', options: ['9', '36', '16', '20'], correctIndex: 0, clue: { title: 'Division Property', explanation: '2x = 18. Divide by 2: x = 18 ÷ 2 = 9!', visual: 'text', cost: 5 }, coinsOnCorrect: 20 },
      { id: 'g8-math-eq-q3', narrative: 'Solve: x - 4 = 10', question: 'What is x?', options: ['6', '14', '40', '2.5'], correctIndex: 1, clue: { title: 'Addition Property', explanation: 'x - 4 = 10. Add 4 to both sides: x = 10 + 4 = 14!', visual: 'text', cost: 5 }, coinsOnCorrect: 20 },
      { id: 'g8-math-eq-q4', narrative: 'Solve: 3x + 2 = 14', question: 'What is x?', options: ['4', '12', '16', '3'], correctIndex: 0, clue: { title: 'Two-Step Equation', explanation: '3x + 2 = 14. Subtract 2: 3x = 12. Divide by 3: x = 4!', visual: 'text', cost: 5 }, coinsOnCorrect: 20 },
      { id: 'g8-math-eq-q5', narrative: 'Solve: 2(x + 3) = 16', question: 'What is x?', options: ['5', '8', '10', '13'], correctIndex: 0, clue: { title: 'Distributive Property', explanation: '2(x+3)=16. Divide by 2: x+3 = 8. Subtract 3: x = 5!', visual: 'text', cost: 5 }, coinsOnCorrect: 20 },
    ],
  },

  // ─── GRADE 8 · MATH: PYTHAGOREAN THEOREM ─────────────────────────────────────
  {
    id: 'g8-math-pythagoras',
    grade: 8,
    programme: 'MYP',
    subject: 'math',
    title: 'The Right Triangle Quest',
    realmName: 'Triangle Territory',
    narrativeWorld: 'A territory where right triangles hold ancient geometric secrets',
    characterTeacher: 'Pythagoras Pete',
    teacherEmoji: '📐',
    theme: 'Pythagorean theorem, finding hypotenuse, distance formula',
    coinReward: 120,
    boss: {
      id: 'g8-math-pyth-boss',
      title: 'The Triangle Master',
      villain: 'Triangle Master',
      villainEmoji: '🔺',
      narrative: 'A ladder leans against a wall, reaching 12m up. The base is 5m from the wall. Find ladder length. Then: Find distance between (2,3) and (6,7).',
      question: 'Find ladder length AND distance between (2,3) and (6,7)',
      answer: 'Ladder = 13m (5-12-13 triple). Distance = √32 ≈ 5.66 units.',
      hints: ['Use a² + b² = c²', 'Distance formula: √[(x2-x1)² + (y2-y1)²]'],
      coinReward: 60,
    },
    questions: [
      { id: 'g8-math-pyth-q1', narrative: 'A right triangle has legs 3 and 4. Find hypotenuse.', question: 'What is c?', options: ['5', '7', '25', '12'], correctIndex: 0, clue: { title: 'Pythagorean Theorem', explanation: '3² + 4² = c². 9 + 16 = 25. c = √25 = 5!', visual: 'text', cost: 5 }, coinsOnCorrect: 20 },
      { id: 'g8-math-pyth-q2', narrative: 'Find the missing leg if hypotenuse = 10, one leg = 6', question: 'What is the other leg?', options: ['8', '4', '16', '√136'], correctIndex: 0, clue: { title: 'Finding Missing Leg', explanation: '6² + b² = 10². 36 + b² = 100. b² = 64. b = 8!', visual: 'text', cost: 5 }, coinsOnCorrect: 20 },
      { id: 'g8-math-pyth-q3', narrative: 'Distance between (0,0) and (3,4)', question: 'What is the distance?', options: ['5', '7', '25', '12'], correctIndex: 0, clue: { title: 'Distance Formula', explanation: '√[(3-0)² + (4-0)²] = √[9 + 16] = √25 = 5!', visual: 'text', cost: 5 }, coinsOnCorrect: 20 },
      { id: 'g8-math-pyth-q4', narrative: 'Which set is a Pythagorean triple?', question: 'Identify the triple', options: ['3,4,5', '2,3,4', '5,6,7', '1,2,3'], correctIndex: 0, clue: { title: 'Pythagorean Triple', explanation: '3² + 4² = 5². 9 + 16 = 25. Yes! 3,4,5 is a classic triple!', visual: 'text', cost: 5 }, coinsOnCorrect: 20 },
      { id: 'g8-math-pyth-q5', narrative: 'A 5-12-__ triangle exists. Find the missing side.', question: 'What is the missing side?', options: ['13', '17', '60', '√119'], correctIndex: 0, clue: { title: 'Complete the Triple', explanation: '5² + 12² = c². 25 + 144 = 169. c = √169 = 13!', visual: 'text', cost: 5 }, coinsOnCorrect: 20 },
    ],
  },

  // ─── GRADE 8 · MATH: COORDINATE GEOMETRY ─────────────────────────────────────
  {
    id: 'g8-math-coords',
    grade: 8,
    programme: 'MYP',
    subject: 'math',
    title: 'The Coordinate Grid Quest',
    realmName: 'Grid Galaxy',
    narrativeWorld: 'A galaxy where points, lines, and slopes chart the course to discovery',
    characterTeacher: 'Graph Gary',
    teacherEmoji: '📊',
    theme: 'gradient, equation of line, plotting points, transformations',
    coinReward: 120,
    boss: {
      id: 'g8-math-coord-boss',
      title: 'The Grid Guardian',
      villain: 'Grid Guardian',
      villainEmoji: '🛡️',
      narrative: 'Find gradient of line through (2,5) and (6,17). Then write equation of line with gradient 2 passing through (1,3).',
      question: 'Find gradient AND write equation',
      answer: 'Gradient = 3 (17-5)/(6-2) = 12/4 = 3. Equation: y = 3x',
      hints: ['Gradient = rise/run = (y2-y1)/(x2-x1)', 'Use y = mx + c format'],
      coinReward: 60,
    },
    questions: [
      { id: 'g8-math-coord-q1', narrative: 'Find gradient between (0,0) and (4,8)', question: 'What is the gradient?', options: ['2', '4', '0.5', '8'], correctIndex: 0, clue: { title: 'Gradient Formula', explanation: 'Gradient = (8-0)/(4-0) = 8/4 = 2!', visual: 'text', cost: 5 }, coinsOnCorrect: 20 },
      { id: 'g8-math-coord-q2', narrative: 'Line has gradient 3, passes through (0,2). Equation?', question: 'What is y when x=1?', options: ['5', '3', '6', '2'], correctIndex: 0, clue: { title: 'y = mx + c', explanation: 'y = 3x + c. When x=0, y=2, so c=2. y = 3x + 2. At x=1: y = 3(1)+2 = 5!', visual: 'text', cost: 5 }, coinsOnCorrect: 20 },
      { id: 'g8-math-coord-q3', narrative: 'Point (3,-4) reflected in x-axis', question: 'New coordinates?', options: ['(3,4)', '(-3,-4)', '(-3,4)', '(3,-4)'], correctIndex: 0, clue: { title: 'Reflection', explanation: 'Reflect in x-axis: x stays same, y changes sign. (3,-4) → (3,4)!', visual: 'text', cost: 5 }, coinsOnCorrect: 20 },
      { id: 'g8-math-coord-q4', narrative: 'Translate point (2,3) by vector (4,-1)', question: 'New coordinates?', options: ['(6,2)', '(6,4)', '(2,2)', '(4,3)'], correctIndex: 0, clue: { title: 'Translation', explanation: 'Add vector: (2+4, 3+(-1)) = (6,2)!', visual: 'text', cost: 5 }, coinsOnCorrect: 20 },
      { id: 'g8-math-coord-q5', narrative: 'Line y = 2x passes through origin with gradient?', question: 'What is the gradient?', options: ['2', 'x', 'y', '1'], correctIndex: 0, clue: { title: 'Gradient-Intercept Form', explanation: 'In y = mx + c, m is the gradient. Here m = 2!', visual: 'text', cost: 5 }, coinsOnCorrect: 20 },
    ],
  },

  // ─── GRADE 8 · MATH: STATISTICS & PROBABILITY ────────────────────────────────
  {
    id: 'g8-math-stats',
    grade: 8,
    programme: 'MYP',
    subject: 'math',
    title: 'The Data & Chance Quest',
    realmName: 'Probability Palace',
    narrativeWorld: 'A palace where data speaks and chance rules',
    characterTeacher: 'Probability Paula',
    teacherEmoji: '🎲',
    theme: 'mean, median, mode, probability, tree diagrams',
    coinReward: 120,
    boss: {
      id: 'g8-math-stats-boss',
      title: 'The Data Duke',
      villain: 'Data Duke',
      villainEmoji: '🎭',
      narrative: 'Data: 12, 15, 12, 18, 20, 15. Find mean, median, mode. Then: Bag has 3 red, 2 blue. P(red then blue with replacement)?',
      question: 'Find mean, median, mode AND probability',
      answer: 'Mean = 15.33, Median = 15, Mode = 12,15. P(R then B) = 3/5 × 2/5 = 6/25 = 0.24',
      hints: ['Mean = sum/6', 'Median = middle of sorted', 'Probability with replacement: multiply'],
      coinReward: 60,
    },
    questions: [
      { id: 'g8-math-stats-q1', narrative: 'Data: 2, 5, 8, 9, 11', question: 'What is the MEAN?', options: ['7', '5', '8', '35'], correctIndex: 0, clue: { title: 'Mean', explanation: 'Mean = sum ÷ count. 2+5+8+9+11 = 35. 35 ÷ 5 = 7!', visual: 'text', cost: 5 }, coinsOnCorrect: 20 },
      { id: 'g8-math-stats-q2', narrative: 'Data: 3, 7, 7, 8, 9, 12', question: 'What is the MEDIAN?', options: ['7', '7.5', '8', '46'], correctIndex: 1, clue: { title: 'Median', explanation: 'Median = middle. With 6 numbers, average of 3rd and 4th: (7+8)/2 = 7.5!', visual: 'text', cost: 5 }, coinsOnCorrect: 20 },
      { id: 'g8-math-stats-q3', narrative: 'Data: 4, 4, 5, 6, 4, 7', question: 'What is the MODE?', options: ['4', '5', '6', '4 and 5'], correctIndex: 0, clue: { title: 'Mode', explanation: 'Mode = most frequent. 4 appears 3 times - most common!', visual: 'text', cost: 5 }, coinsOnCorrect: 20 },
      { id: 'g8-math-stats-q4', narrative: 'Coin flip: P(Heads)', question: 'What is the probability?', options: ['0', '1', '½', '1/4'], correctIndex: 2, clue: { title: 'Simple Probability', explanation: 'P(Heads) = favorable/total = 1/2 = 0.5 = ½!', visual: 'text', cost: 5 }, coinsOnCorrect: 20 },
      { id: 'g8-math-stats-q5', narrative: 'Bag has 2 red, 3 blue. P(red) on one draw?', question: 'What is the probability?', options: ['2/5', '3/5', '1/5', '1'], correctIndex: 0, clue: { title: 'Probability Fraction', explanation: 'P(red) = red/total = 2/(2+3) = 2/5!', visual: 'text', cost: 5 }, coinsOnCorrect: 20 },
    ],
  },

  // ─── GRADE 8 · SCIENCE: CHEMISTRY ───────────────────────────────────────────
  {
    id: 'g8-science-chem',
    grade: 8,
    programme: 'MYP',
    subject: 'science',
    title: 'The Chemical World Quest',
    realmName: 'Atom Alley',
    narrativeWorld: 'An alley where atoms dance, elements combine, and reactions create new substances',
    characterTeacher: 'Chemist Chloe',
    teacherEmoji: '⚗️',
    theme: 'atomic structure, periodic table, chemical bonding, acids and bases',
    coinReward: 120,
    boss: {
      id: 'g8-sci-chem-boss',
      title: 'The Element Emperor',
      villain: 'Element Emperor',
      villainEmoji: '⚛️',
      narrative: 'What is the atomic number of Carbon? Why does Na (sodium) react violently? What is pH of strong acid?',
      question: 'Answer all three questions about atoms, reactions, and pH',
      answer: 'Carbon atomic number = 6. Na is reactive because it has 1 valence electron (easily lost). Strong acid pH = 1-2.',
      hints: ['Atomic number = protons', 'Group 1 metals are reactive', 'pH scale: 1-2 strong acid, 7 neutral'],
      coinReward: 60,
    },
    questions: [
      { id: 'g8-sci-chem-q1', narrative: 'An atom has 6 protons. What is the atomic number?', question: 'What is the atomic number?', options: ['6', '12', '3', '18'], correctIndex: 0, clue: { title: 'Atomic Number', explanation: 'ATOMIC NUMBER = number of PROTONS. If 6 protons, atomic number = 6!', visual: 'text', cost: 5 }, coinsOnCorrect: 20 },
      { id: 'g8-sci-chem-q2', narrative: 'Elements in the same group have similar...', question: 'What property is similar?', options: ['Atomic mass', 'Physical state', 'Chemical properties', 'Color'], correctIndex: 2, clue: { title: 'Periodic Table Groups', explanation: 'Elements in same GROUP have similar CHEMICAL PROPERTIES (same valence electrons)!', visual: 'text', cost: 5 }, coinsOnCorrect: 20 },
      { id: 'g8-sci-chem-q3', narrative: 'NaCl is formed by what type of bond?', question: 'Identify the bond type', options: ['Covalent', 'Ionic', 'Metallic', 'Hydrogen'], correctIndex: 1, clue: { title: 'Ionic Bonding', explanation: 'NaCl (table salt): Na (metal) gives electron to Cl (non-metal). This is IONIC bonding!', visual: 'text', cost: 5 }, coinsOnCorrect: 20 },
      { id: 'g8-sci-chem-q4', narrative: 'Lemon juice has pH 2. This is...', question: 'Classify the substance', options: ['Neutral', 'Acid', 'Base', 'Salt'], correctIndex: 1, clue: { title: 'Acids and pH', explanation: 'pH < 7 = ACID. Lemon juice (pH 2) is a strong acid!', visual: 'text', cost: 5 }, coinsOnCorrect: 20 },
      { id: 'g8-sci-chem-q5', narrative: 'Soap has pH 10. This is...', question: 'Classify the substance', options: ['Acid', 'Neutral', 'Base', 'Salt'], correctIndex: 2, clue: { title: 'Bases', explanation: 'pH > 7 = BASE. Soap (pH 10) is basic/alkaline!', visual: 'text', cost: 5 }, coinsOnCorrect: 20 },
    ],
  },

  // ─── GRADE 8 · SCIENCE: PHYSICS ──────────────────────────────────────────────
  {
    id: 'g8-science-physics',
    grade: 8,
    programme: 'MYP',
    subject: 'science',
    title: 'The Force & Motion Quest',
    realmName: 'Motion Metropolis',
    narrativeWorld: 'A metropolis where forces push, pull, and shape the motion of everything',
    characterTeacher: 'Newton Nick',
    teacherEmoji: '🚀',
    theme: 'Newton\'s laws, force, mass, acceleration, momentum',
    coinReward: 120,
    boss: {
      id: 'g8-sci-phys-boss',
      title: 'The Physics Professor',
      villain: 'Physics Professor',
      villainEmoji: '🎓',
      narrative: 'A 2kg object accelerates at 5m/s². What force? Then: Explain Newton\'s First Law. Finally: Calculate momentum of 10kg object at 3m/s.',
      question: 'Calculate force, explain First Law, calculate momentum',
      answer: 'Force = 10N (F=ma=2×5). First Law: object at rest stays at rest, moving stays moving unless acted by force. Momentum = 30kg·m/s',
      hints: ['F = ma', 'First Law: inertia', 'Momentum = mass × velocity'],
      coinReward: 60,
    },
    questions: [
      { id: 'g8-sci-phys-q1', narrative: 'F = ma. If m=2kg, a=3m/s², what is F?', question: 'Calculate the force', options: ['6N', '5N', '1.5N', '0.67N'], correctIndex: 0, clue: { title: 'Force Formula', explanation: 'F = ma = 2 × 3 = 6 Newtons!', visual: 'text', cost: 5 }, coinsOnCorrect: 20 },
      { id: 'g8-sci-phys-q2', narrative: 'A soccer ball rolls on grass and slows down. Why?', question: 'What causes the slowdown?', options: ['No force applied', 'Friction', 'Gravity', 'Magnetism'], correctIndex: 1, clue: { title: 'Friction', explanation: 'FRICTION is a force that opposes motion. It slows down the ball!', visual: 'text', cost: 5 }, coinsOnCorrect: 20 },
      { id: 'g8-sci-phys-q3', narrative: 'An object at rest stays at rest. This is Newton\'s...', question: 'Which law?', options: ['First Law', 'Second Law', 'Third Law', 'Law of Gravity'], correctIndex: 0, clue: { title: 'Newton\'s First Law', explanation: 'First Law (Law of Inertia): object at rest stays at rest unless acted by force!', visual: 'text', cost: 5 }, coinsOnCorrect: 20 },
      { id: 'g8-sci-phys-q4', narrative: 'For every action, there is an equal and opposite...', question: 'Complete Newton\'s Third Law', options: ['Reaction', 'Force', 'Motion', 'Energy'], correctIndex: 0, clue: { title: 'Newton\'s Third Law', explanation: 'Third Law: for EVERY ACTION, there is an equal and opposite REACTION!', visual: 'text', cost: 5 }, coinsOnCorrect: 20 },
      { id: 'g8-sci-phys-q5', narrative: 'Momentum = mass × velocity. 5kg at 4m/s', question: 'What is the momentum?', options: ['20 kg·m/s', '9 kg·m/s', '1.25 kg·m/s', '0.8 kg·m/s'], correctIndex: 0, clue: { title: 'Momentum', explanation: 'p = mv = 5 × 4 = 20 kg·m/s!', visual: 'text', cost: 5 }, coinsOnCorrect: 20 },
    ],
  },

  // ─── GRADE 8 · SCIENCE: BIOLOGY ──────────────────────────────────────────────
  {
    id: 'g8-science-biology',
    grade: 8,
    programme: 'MYP',
    subject: 'science',
    title: 'The Living Systems Quest',
    realmName: 'Cell City',
    narrativeWorld: 'A city where cells are the buildings and systems work together',
    characterTeacher: 'Biologist Ben',
    teacherEmoji: '🧬',
    theme: 'cells, tissues, organs, body systems, inheritance',
    coinReward: 120,
    boss: {
      id: 'g8-sci-bio-boss',
      title: 'The Cell Chief',
      villain: 'Cell Chief',
      villainEmoji: '🧫',
      narrative: 'Name the function of the nucleus. Explain the difference between prokaryotic and eukaryotic cells. What is DNA?',
      question: 'Answer all three about cells',
      answer: 'Nucleus: controls cell activities. Prokaryotic: no nucleus (bacteria). Eukaryotic: has nucleus (plants, animals). DNA: genetic material.',
      hints: ['Nucleus contains DNA', 'Prokaryote = no membrane-bound nucleus', 'DNA carries genetic code'],
      coinReward: 60,
    },
    questions: [
      { id: 'g8-sci-bio-q1', narrative: 'Which organelle is the "powerhouse" of the cell?', question: 'Identify the organelle', options: ['Nucleus', 'Mitochondria', 'Ribosome', 'Cell membrane'], correctIndex: 1, clue: { title: 'Mitochondria', explanation: 'MITOCHONDRIA produce energy (ATP) - called the "powerhouse"!', visual: 'text', cost: 5 }, coinsOnCorrect: 20 },
      { id: 'g8-sci-bio-q2', narrative: 'Which cell type has a nucleus?', question: 'Identify the type', options: ['Bacteria', 'Plant cell', 'Both plant and bacteria', 'Neither'], correctIndex: 1, clue: { title: 'Eukaryotic Cells', explanation: 'PLANT cells are eukaryotic - they have a nucleus! Bacteria are prokaryotic (no nucleus).', visual: 'text', cost: 5 }, coinsOnCorrect: 20 },
      { id: 'g8-sci-bio-q3', narrative: 'What is the function of red blood cells?', question: 'What do they do?', options: ['Fight infection', 'Carry oxygen', 'Clot blood', 'Produce hormones'], correctIndex: 1, clue: { title: 'Blood Cells', explanation: 'RED BLOOD CELLS carry OXYGEN from lungs to body!', visual: 'text', cost: 5 }, coinsOnCorrect: 20 },
      { id: 'g8-sci-bio-q4', narrative: 'Which system breaks down food?', question: 'Identify the system', options: ['Circulatory', 'Respiratory', 'Digestive', 'Nervous'], correctIndex: 2, clue: { title: 'Digestive System', explanation: 'DIGESTIVE system breaks down food into nutrients the body can use!', visual: 'text', cost: 5 }, coinsOnCorrect: 20 },
      { id: 'g8-sci-bio-q5', narrative: 'DNA carries...', question: 'What does DNA carry?', options: ['Water', 'Energy', 'Genetic information', 'Oxygen'], correctIndex: 2, clue: { title: 'DNA', explanation: 'DNA carries GENETIC INFORMATION (instructions for building and running your body)!', visual: 'text', cost: 5 }, coinsOnCorrect: 20 },
    ],
  },

  // ─── GRADE 8 · SCIENCE: EARTH SCIENCE ───────────────────────────────────────
  {
    id: 'g8-science-earth',
    grade: 8,
    programme: 'MYP',
    subject: 'science',
    title: 'The Dynamic Earth Quest',
    realmName: 'Tectonic Territory',
    narrativeWorld: 'A territory where Earth\'s surface constantly changes through tectonic forces',
    characterTeacher: 'Geologist Gary',
    teacherEmoji: '🌋',
    theme: 'plate tectonics, earthquakes, volcanoes, rock cycle, weathering',
    coinReward: 120,
    boss: {
      id: 'g8-sci-earth-boss',
      title: 'The Earth Chief',
      villain: 'Earth Chief',
      villainEmoji: '🌍',
      narrative: 'Explain what causes earthquakes. What is the difference between magma and lava? How do volcanoes form at divergent boundaries?',
      question: 'Answer all three about Earth processes',
      answer: 'Earthquakes: sudden energy release from tectonic plates. Magma: underground lava. Lava: above ground. Divergent: plates separate, magma rises.',
      hints: ['Tectonic plate movement causes earthquakes', 'Magma below, lava above ground', 'Plate separation creates volcanic activity'],
      coinReward: 60,
    },
    questions: [
      { id: 'g8-sci-earth-q1', narrative: 'What causes most earthquakes?', question: 'Identify the cause', options: ['Volcanoes', 'Tectonic plate movement', 'Weather', 'Moon'], correctIndex: 1, clue: { title: 'Earthquake Cause', explanation: 'Earthquakes are caused by sudden movement of TECTONIC PLATES!', visual: 'text', cost: 5 }, coinsOnCorrect: 20 },
      { id: 'g8-sci-earth-q2', narrative: 'Volcano formed where plates separate. This is...', question: 'Identify the boundary', options: ['Convergent', 'Divergent', 'Transform', 'Static'], correctIndex: 1, clue: { title: 'Plate Boundaries', explanation: 'DIVERGENT boundary: plates separate, magma rises, creates volcanoes!', visual: 'text', cost: 5 }, coinsOnCorrect: 20 },
      { id: 'g8-sci-earth-q3', narrative: 'The outermost layer of Earth is called...', question: 'Identify the layer', options: ['Mantle', 'Core', 'Crust', 'Lithosphere'], correctIndex: 2, clue: { title: 'Earth\'s Layers', explanation: 'CRUST is the outermost layer of Earth - we live on it!', visual: 'text', cost: 5 }, coinsOnCorrect: 20 },
      { id: 'g8-sci-earth-q4', narrative: 'Wegener proposed that continents...', question: 'What was his theory?', options: ['Float randomly', 'Were once joined (continental drift)', 'Stay stationary', 'Move vertically'], correctIndex: 1, clue: { title: 'Continental Drift', explanation: 'Wegener proposed CONTINENTAL DRIFT - continents were once joined and moved apart!', visual: 'text', cost: 5 }, coinsOnCorrect: 20 },
      { id: 'g8-sci-earth-q5', narrative: 'P waves and S waves are types of...', question: 'Identify the type', options: ['Ocean waves', 'Seismic waves', 'Light waves', 'Sound waves'], correctIndex: 1, clue: { title: 'Seismic Waves', explanation: 'SEISMIC WAVES are earthquake waves that travel through Earth!', visual: 'text', cost: 5 }, coinsOnCorrect: 20 },
    ],
  },


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

];

export const MYP_QUESTS_BY_GRADE: Record<number, CurriculumQuest[]> = {
  6:  MYP_QUESTS.filter(q => q.grade === 6),
  7:  MYP_QUESTS.filter(q => q.grade === 7),
  8:  MYP_QUESTS.filter(q => q.grade === 8),
  9:  MYP_QUESTS.filter(q => q.grade === 9),
  10: MYP_QUESTS.filter(q => q.grade === 10),
};
