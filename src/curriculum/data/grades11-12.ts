import type { CurriculumQuest } from '@/types';

export const DP_QUESTS: CurriculumQuest[] = [
  // ─── GRADE 11 · MATH: Functions & Limits ──────────────────────────────────
  {
    id: 'g11-math',
    grade: 11,
    programme: 'DP',
    subject: 'math',
    title: 'Functions & Limits',
    realmName: 'Celestial Observatory',
    narrativeWorld:
      'The Celestial Observatory floats above the clouds, its telescopes trained on infinite mathematical horizons. Time-travelling scholars who master functions and limits may read the future written in the stars.',
    characterTeacher: 'Astronomer Functionius',
    teacherEmoji: '🔭',
    theme: 'wizard',
    coinReward: 250,
    boss: {
      id: 'g11-math-boss',
      title: 'The Asymptote Lich',
      villain: 'Lich of Infinity',
      villainEmoji: '💀',
      narrative:
        'The Asymptote Lich exists at the edge of mathematical infinity, approaching but never arriving. Only someone who can evaluate limits at infinity and find the domain of a rational function may banish him.',
      question:
        'Let f(x) = (3x² − 2x) / (x² − 4). (a) State the domain of f(x). (b) Find the horizontal asymptote. (c) Evaluate lim(x→2) of (x² − 4)/(x − 2) by simplifying first.',
      answer:
        '(a) Domain: x² − 4 ≠ 0 → (x−2)(x+2) ≠ 0 → x ≠ 2 and x ≠ −2. Domain: ℝ \\ {−2, 2}. (b) Horizontal asymptote: as x→∞, leading terms dominate: 3x²/x² = 3. So y = 3. (c) Factor numerator: (x²−4)/(x−2) = (x−2)(x+2)/(x−2) = x+2 (for x ≠ 2). lim(x→2) (x+2) = 2+2 = 4.',
      hints: [
        'For the domain, set the denominator ≠ 0 and solve. Factor x² − 4 as a difference of two squares.',
        'For the horizontal asymptote, divide the leading coefficient of the numerator by the leading coefficient of the denominator (degrees are equal).',
        'For part (c), the expression is undefined at x = 2 due to 0/0 — factor and cancel the common factor (x − 2) first, then substitute.',
      ],
      coinReward: 150,
    },
    questions: [
      {
        id: 'g11-math-q1',
        narrative:
          'A star map shows the function f(x) = √(x − 3). The astronomer asks you to find all x values for which this function is defined.',
        question: 'What is the domain of f(x) = √(x − 3)?',
        options: ['x > 3', 'x ≥ 3', 'x ≤ 3', 'all real numbers'],
        correctIndex: 1,
        clue: {
          title: 'Domain of a Square Root Function',
          explanation:
            'The expression under a square root must be ≥ 0 (we cannot take the square root of a negative number in the reals). Set x − 3 ≥ 0 → x ≥ 3. The domain is [3, ∞). Note: x = 3 is included because √0 = 0 is defined.',
          visual: 'numberLine',
          cost: 20,
        },
        coinsOnCorrect: 50,
      },
      {
        id: 'g11-math-q2',
        narrative:
          'Two celestial functions are charted: f(x) = 2x + 1 and g(x) = x². The astronomer wants the composite function f(g(x)).',
        question: 'If f(x) = 2x + 1 and g(x) = x², what is f(g(x))?',
        equation: 'f(g(x)) = f(x²) = ?',
        options: ['2x² + 1', '(2x + 1)²', '2x + x²', '4x² + 1'],
        correctIndex: 0,
        clue: {
          title: 'Composite Functions',
          explanation:
            'For f(g(x)), substitute g(x) in place of x in f: f(g(x)) = f(x²) = 2(x²) + 1 = 2x² + 1. Read from inside out: apply g first (square x), then apply f to the result (multiply by 2 and add 1).',
          visual: 'text',
          cost: 20,
        },
        coinsOnCorrect: 50,
      },
      {
        id: 'g11-math-q3',
        narrative:
          'A time portal is shaped by the function f(x) = (x + 2) / (x − 5). The Lich warns: "Some x values destroy the portal!"',
        question: 'What value of x must be EXCLUDED from the domain of f(x) = (x + 2)/(x − 5)?',
        options: ['x = −2', 'x = 5', 'x = 0', 'x = −5'],
        correctIndex: 1,
        clue: {
          title: 'Domain of a Rational Function',
          explanation:
            'A rational function is undefined wherever its denominator equals zero. Set x − 5 = 0 → x = 5. So x = 5 must be excluded. The domain is all real numbers except x = 5.',
          visual: 'text',
          cost: 20,
        },
        coinsOnCorrect: 50,
      },
      {
        id: 'g11-math-q4',
        narrative:
          'The observatory telescope tracks a comet described by f(x) = 3x² − 12x + 9. Astronomers need its range.',
        question: 'The function f(x) = 3x² − 12x + 9 is a parabola. What is its minimum value (vertex)?',
        equation: 'x_vertex = -b/(2a) = 12/6 = 2; f(2) = ?',
        options: ['f(2) = −3', 'f(2) = 9', 'f(2) = 0', 'f(2) = 3'],
        correctIndex: 0,
        clue: {
          title: 'Vertex of a Parabola',
          explanation:
            'For f(x) = ax² + bx + c, x-coordinate of vertex = −b/(2a) = −(−12)/(2×3) = 12/6 = 2. Find f(2): 3(4) − 12(2) + 9 = 12 − 24 + 9 = −3. The minimum value is −3 (since a = 3 > 0, the parabola opens upward).',
          visual: 'diagram',
          cost: 20,
        },
        coinsOnCorrect: 50,
      },
      {
        id: 'g11-math-q5',
        narrative:
          'The Lich poses the limit challenge: a star path described by lim(x→3) of (x² − 9)/(x − 3). Evaluate it.',
        question: 'Evaluate: lim(x→3) (x² − 9)/(x − 3)',
        equation: 'lim(x→3) (x²-9)/(x-3) = ?',
        options: ['Undefined', '0', '3', '6'],
        correctIndex: 3,
        clue: {
          title: 'Evaluating a Limit by Factoring',
          explanation:
            'Direct substitution gives 0/0 (indeterminate). Factor the numerator: x² − 9 = (x−3)(x+3). Cancel the (x−3) factor: lim(x→3) (x+3) = 3 + 3 = 6. The limit exists even though f(3) is undefined.',
          visual: 'text',
          cost: 20,
        },
        coinsOnCorrect: 50,
      },
    ],
  },

  // ─── GRADE 11 · SCIENCE: Chemical Bonding ─────────────────────────────────
  {
    id: 'g11-science',
    grade: 11,
    programme: 'DP',
    subject: 'science',
    title: 'Chemical Bonding',
    realmName: 'Celestial Observatory',
    narrativeWorld:
      'In the Celestial Observatory, alchemists of the future study how atoms forge alliances — ionic bonds, covalent bonds — to create the molecules that power stars and life. Master Bond Wizard Electronus guards the secret of electronegativity.',
    characterTeacher: 'Bond Wizard Electronus',
    teacherEmoji: '🧲',
    theme: 'wizard',
    coinReward: 250,
    boss: {
      id: 'g11-science-boss',
      title: 'The Electronegativity Lich',
      villain: 'Baron Polarity',
      villainEmoji: '⚗️',
      narrative:
        'Baron Polarity has bonded the observatory gates with a molecule only you can decode. Identify the bond type, predict the shape, and determine the polarity of water (H₂O) to unlock the gate.',
      question:
        'For the water molecule (H₂O): (a) What type of bond forms between O and H, and why? (b) Using VSEPR theory, describe the molecular shape and bond angle. (c) Is the molecule polar or non-polar? Justify your answer.',
      answer:
        '(a) Covalent bonds form between O and H because both are non-metals sharing electrons. The bonds are polar covalent because oxygen (electronegativity ≈ 3.44) is much more electronegative than hydrogen (≈ 2.20), so electrons are pulled towards O. (b) Oxygen has 2 bonding pairs and 2 lone pairs → tetrahedral electron geometry → bent/V-shaped molecular geometry. Bond angle ≈ 104.5° (less than 109.5° due to lone pair repulsion). (c) Polar molecule: the two O-H dipoles do not cancel because of the bent shape. The net dipole points towards oxygen (partial negative charge on O, partial positive on H atoms).',
      hints: [
        'Both oxygen and hydrogen are non-metals, so they share electrons — forming a covalent bond. The difference in electronegativity (3.44 − 2.20 = 1.24) makes each O-H bond polar covalent.',
        'Use VSEPR: count electron pairs around the central atom (oxygen). 2 bonding pairs + 2 lone pairs = 4 electron pairs → tetrahedral base, but the shape name describes atom positions, not lone pairs.',
        'For polarity of the molecule: even if individual bonds are polar, the molecule can be non-polar if bond dipoles cancel by symmetry (like CO₂). In bent H₂O they do NOT cancel.',
      ],
      coinReward: 150,
    },
    questions: [
      {
        id: 'g11-science-q1',
        narrative:
          'Bond Wizard Electronus holds up two glowing orbs — one sodium, one chlorine. "An electron jumps!" he cries. What type of bond forms?',
        question:
          'Sodium (Na) has 1 valence electron and chlorine (Cl) has 7. When NaCl forms, Na gives its electron to Cl. What type of bond is this?',
        options: ['Covalent bond', 'Ionic bond', 'Metallic bond', 'Hydrogen bond'],
        correctIndex: 1,
        clue: {
          title: 'Ionic Bonding',
          explanation:
            'Ionic bonding involves the transfer of electrons from a metal to a non-metal. Na loses 1e⁻ to become Na⁺ (stable noble gas configuration). Cl gains 1e⁻ to become Cl⁻. The opposite charges attract, forming an ionic bond. NaCl is an ionic compound.',
          visual: 'diagram',
          cost: 20,
        },
        coinsOnCorrect: 50,
      },
      {
        id: 'g11-science-q2',
        narrative:
          'Two non-metal orbs (hydrogen and hydrogen) drift together, sharing their glowing electrons equally.',
        question: 'When two hydrogen atoms share a pair of electrons to form H₂, what type of bond is created?',
        options: ['Ionic bond', 'Metallic bond', 'Non-polar covalent bond', 'Polar covalent bond'],
        correctIndex: 2,
        clue: {
          title: 'Non-polar Covalent Bonding',
          explanation:
            'Covalent bonds form when atoms share electrons. In H₂, both atoms are identical, so the electronegativity difference is 0 — electrons are shared equally. This is a non-polar covalent bond. If atoms differ in electronegativity, the bond becomes polar covalent.',
          visual: 'diagram',
          cost: 20,
        },
        coinsOnCorrect: 50,
      },
      {
        id: 'g11-science-q3',
        narrative:
          'A cosmic scroll shows: HF, HCl, HBr, HI. Baron Polarity asks: "Which has the strongest bond polarity?"',
        question:
          'Which molecule has the MOST polar covalent bond, given that electronegativity decreases down Group 17 (F > Cl > Br > I)?',
        options: ['HI', 'HBr', 'HCl', 'HF'],
        correctIndex: 3,
        clue: {
          title: 'Bond Polarity and Electronegativity Difference',
          explanation:
            'Bond polarity increases with the electronegativity difference (Δ EN) between bonded atoms. F has the highest electronegativity (4.0), giving the largest Δ EN with H (H = 2.2): Δ EN for HF = 1.8, for HCl = 0.9, for HBr = 0.7, for HI = 0.4. HF is most polar.',
          visual: 'text',
          cost: 20,
        },
        coinsOnCorrect: 50,
      },
      {
        id: 'g11-science-q4',
        narrative:
          'The Bond Wizard draws dot-cross diagrams on his celestial whiteboard. He asks about the bonding in methane (CH₄).',
        question:
          'In methane (CH₄), carbon forms 4 bonds with hydrogen. How many shared electron pairs does carbon have, and what is the approximate bond angle?',
        options: [
          '2 shared pairs, 90°',
          '4 shared pairs, 109.5°',
          '4 shared pairs, 120°',
          '3 shared pairs, 107°',
        ],
        correctIndex: 1,
        clue: {
          title: 'VSEPR: Tetrahedral Geometry',
          explanation:
            'Carbon has 4 valence electrons and forms 4 bonds with H (4 shared pairs, 0 lone pairs). VSEPR: 4 bonding pairs repel to maximum distance → tetrahedral shape with bond angles of 109.5°. CH₄ is the classic tetrahedral molecule.',
          visual: 'diagram',
          cost: 20,
        },
        coinsOnCorrect: 50,
      },
      {
        id: 'g11-science-q5',
        narrative:
          'The wizard compares ionic NaCl with covalent H₂O. "Which has a higher melting point, and why?" he challenges.',
        question:
          'Why do ionic compounds (like NaCl, melting point 801 °C) generally have HIGHER melting points than simple covalent molecules (like H₂O, melting point 0 °C)?',
        options: [
          'Ionic compounds are lighter, making them easier to melt',
          'Ionic compounds have strong electrostatic attractions between oppositely charged ions throughout the lattice, requiring much more energy to break',
          'Covalent bonds within molecules are stronger than ionic bonds',
          'Ionic compounds have more electrons, generating more repulsion that holds them solid',
        ],
        correctIndex: 1,
        clue: {
          title: 'Ionic vs Covalent: Melting Points',
          explanation:
            'Ionic solids form giant lattice structures where every ion is surrounded by many oppositely charged ions — strong electrostatic forces exist in all directions, requiring large amounts of energy to break. Simple covalent molecules only have weak intermolecular forces (e.g., van der Waals) between molecules, so little energy breaks them apart. Note: covalent bonds WITHIN molecules are strong, but they are not broken on melting.',
          visual: 'text',
          cost: 20,
        },
        coinsOnCorrect: 50,
      },
    ],
  },

  // ─── GRADE 12 · MATH: Integration ─────────────────────────────────────────
  {
    id: 'g12-math',
    grade: 12,
    programme: 'DP',
    subject: 'math',
    title: 'Integration',
    realmName: 'Dimensional Rift',
    narrativeWorld:
      'The Dimensional Rift is a crack in the fabric of mathematical space-time where area exists beneath curves of impossible equations. Time travellers who master integration can close the rift and reshape reality.',
    characterTeacher: 'Chrono-Mage Integra',
    teacherEmoji: '∫',
    theme: 'wizard',
    coinReward: 250,
    boss: {
      id: 'g12-math-boss',
      title: 'The Integration Dragon',
      villain: 'The Integration Dragon',
      villainEmoji: '🐉',
      narrative:
        'The Integration Dragon guards the heart of the Dimensional Rift. Its chest scales are engraved with a definite integral. Evaluate it correctly to close the rift and banish the dragon.',
      question: 'Evaluate ∫₁⁴ (3x² − 2x + 1) dx. Show your working.',
      answer:
        '∫(3x² − 2x + 1) dx = [x³ − x² + x] + C. Evaluate from 1 to 4: F(4) = 4³ − 4² + 4 = 64 − 16 + 4 = 52. F(1) = 1³ − 1² + 1 = 1 − 1 + 1 = 1. Definite integral = F(4) − F(1) = 52 − 1 = 51.',
      hints: [
        'First find the indefinite integral (antiderivative) of each term: ∫3x² dx = x³, ∫2x dx = x², ∫1 dx = x. Write the result with square brackets and the limits 1 and 4.',
        'Evaluate the antiderivative at the upper limit x = 4: substitute 4 into x³ − x² + x and calculate.',
        'Evaluate the antiderivative at the lower limit x = 1: substitute 1. Then subtract: F(4) − F(1).',
      ],
      coinReward: 150,
    },
    questions: [
      {
        id: 'g12-math-q1',
        narrative:
          'Chrono-Mage Integra traces a glowing curve in the air. "What is the antiderivative of 4x³?" she asks.',
        question: 'Find ∫4x³ dx.',
        equation: '∫4x³ dx = ?',
        options: ['x⁴ + C', '12x² + C', '4x⁴ + C', 'x⁴/4 + C'],
        correctIndex: 0,
        clue: {
          title: 'Power Rule for Integration',
          explanation:
            'Power rule: ∫xⁿ dx = xⁿ⁺¹/(n+1) + C. For ∫4x³ dx: increase the power by 1 (3+1=4), divide by the new power (4), multiply by the coefficient 4: 4 × x⁴/4 = x⁴. Answer: x⁴ + C.',
          visual: 'text',
          cost: 20,
        },
        coinsOnCorrect: 50,
      },
      {
        id: 'g12-math-q2',
        narrative:
          'A time rift forms the shape of the area under the curve y = 2x between x = 0 and x = 3. Calculate it.',
        question: 'Evaluate the definite integral ∫₀³ 2x dx.',
        equation: '∫₀³ 2x dx = [x²]₀³ = ?',
        options: ['3', '6', '9', '18'],
        correctIndex: 2,
        clue: {
          title: 'Definite Integral',
          explanation:
            'Antiderivative of 2x = x². Evaluate from 0 to 3: [x²]₀³ = 3² − 0² = 9 − 0 = 9. This equals the area of the triangle with base 3 and height 6 = ½ × 3 × 6 = 9. ✓',
          visual: 'diagram',
          cost: 20,
        },
        coinsOnCorrect: 50,
      },
      {
        id: 'g12-math-q3',
        narrative:
          'The mage asks you to integrate a sum of terms: the anti-gravity spell ∫(6x² + 3x − 2) dx.',
        question: 'Find ∫(6x² + 3x − 2) dx.',
        equation: '∫(6x² + 3x - 2) dx = ?',
        options: [
          '2x³ + (3/2)x² − 2x + C',
          '12x + 3 + C',
          '3x³ + (3/2)x² + C',
          '2x³ + 3x² − 2x + C',
        ],
        correctIndex: 0,
        clue: {
          title: 'Integrating Polynomials Term by Term',
          explanation:
            'Integrate each term separately: ∫6x² dx = 6x³/3 = 2x³. ∫3x dx = 3x²/2. ∫−2 dx = −2x. Combine: 2x³ + (3/2)x² − 2x + C.',
          visual: 'text',
          cost: 20,
        },
        coinsOnCorrect: 50,
      },
      {
        id: 'g12-math-q4',
        narrative:
          'Two time corridors meet. One is described by y = x² + 1 and the other by y = 0. The rift exists between x = 1 and x = 2.',
        question: 'Calculate the area under the curve y = x² + 1 between x = 1 and x = 2.',
        equation: '∫₁² (x² + 1) dx = [x³/3 + x]₁²',
        options: ['7/3', '10/3', '4', '8/3'],
        correctIndex: 1,
        clue: {
          title: 'Area Under a Curve',
          explanation:
            'Antiderivative of (x² + 1) = x³/3 + x. Evaluate: F(2) = 8/3 + 2 = 8/3 + 6/3 = 14/3. F(1) = 1/3 + 1 = 1/3 + 3/3 = 4/3. Area = 14/3 − 4/3 = 10/3.',
          visual: 'diagram',
          cost: 20,
        },
        coinsOnCorrect: 50,
      },
      {
        id: 'g12-math-q5',
        narrative:
          'Chrono-Mage Integra shows two curves: y = x and y = x². The rift between them must be sealed by finding their enclosed area.',
        question:
          'The curves y = x and y = x² intersect at x = 0 and x = 1. Find the area BETWEEN the two curves for 0 ≤ x ≤ 1.',
        equation: '∫₀¹ (x - x²) dx = ?',
        options: ['1/2', '1/6', '1/3', '2/3'],
        correctIndex: 1,
        clue: {
          title: 'Area Between Two Curves',
          explanation:
            'Area = ∫₀¹ (top − bottom) dx = ∫₀¹ (x − x²) dx. Antiderivative: x²/2 − x³/3. Evaluate: F(1) = 1/2 − 1/3 = 3/6 − 2/6 = 1/6. F(0) = 0. Area = 1/6 − 0 = 1/6.',
          visual: 'diagram',
          cost: 20,
        },
        coinsOnCorrect: 50,
      },
    ],
  },

  // ─── GRADE 12 · SCIENCE: Genetics & DNA ───────────────────────────────────
  {
    id: 'g12-science',
    grade: 12,
    programme: 'DP',
    subject: 'science',
    title: 'Genetics & DNA',
    realmName: 'Dimensional Rift',
    narrativeWorld:
      'Deep in the Dimensional Rift, the very code of life — DNA — is unraveling. Only a genetics scholar who understands DNA replication, Mendelian inheritance, and Punnett squares can rewrite the genetic sequences and seal the rift.',
    characterTeacher: 'Gene Rift Oracle Helix',
    teacherEmoji: '🧬',
    theme: 'wizard',
    coinReward: 250,
    boss: {
      id: 'g12-science-boss',
      title: 'The Mutation Leviathan',
      villain: 'Leviathan Mutatix',
      villainEmoji: '🐲',
      narrative:
        'Leviathan Mutatix threatens to corrupt the gene pool of the dimensional rift. Only someone who can solve a dihybrid cross and explain DNA replication semi-conservatively may stop it.',
      question:
        'In pea plants, tall (T) is dominant over short (t), and round seeds (R) is dominant over wrinkled (r). Two plants both heterozygous for both traits (TtRr × TtRr) are crossed. (a) What fraction of offspring will be TALL with ROUND seeds? (b) What fraction will be SHORT with WRINKLED seeds? (c) Briefly explain semi-conservative DNA replication.',
      answer:
        '(a) Dihybrid cross TtRr × TtRr: Each trait independently follows a 3:1 ratio. P(tall) = 3/4, P(round) = 3/4. P(tall AND round) = 3/4 × 3/4 = 9/16. (b) P(short) = 1/4, P(wrinkled) = 1/4. P(short AND wrinkled) = 1/4 × 1/4 = 1/16. (c) Semi-conservative replication: the DNA double helix unwinds and each original strand acts as a template. DNA polymerase adds complementary bases (A-T, C-G) to each strand, producing two new double helices — each containing one original strand and one newly synthesised strand.',
      hints: [
        'For a dihybrid cross, each trait segregates independently (Mendel\'s Law of Independent Assortment). Work out the probability for each trait separately, then multiply.',
        'For a single monohybrid cross Tt × Tt: the ratio is 3 dominant : 1 recessive, so P(tall) = 3/4 and P(short) = 1/4. Apply the same logic to the Rr × Rr cross.',
        'Semi-conservative means each new DNA molecule keeps one OLD strand and gains one NEW complementary strand. The "semi" refers to keeping half (one strand) of the original.',
      ],
      coinReward: 150,
    },
    questions: [
      {
        id: 'g12-science-q1',
        narrative:
          'Oracle Helix uncoils a glowing double helix. "Tell me the four bases of DNA and the base-pairing rules!"',
        question:
          'In DNA, adenine (A) always pairs with _____, and cytosine (C) always pairs with _____.',
        options: [
          'A with C, C with G',
          'A with T, C with G',
          'A with G, C with T',
          'A with U, C with G',
        ],
        correctIndex: 1,
        clue: {
          title: 'Chargaff\'s Base Pairing Rules',
          explanation:
            'In DNA: A (adenine) pairs with T (thymine) via 2 hydrogen bonds. C (cytosine) pairs with G (guanine) via 3 hydrogen bonds. In RNA, thymine (T) is replaced by uracil (U), so A pairs with U in RNA. Remember: A-T and C-G (AT like 2, CG like 3).',
          visual: 'diagram',
          cost: 20,
        },
        coinsOnCorrect: 50,
      },
      {
        id: 'g12-science-q2',
        narrative:
          'In a Mendelian cross, a pure-breeding tall plant (TT) is crossed with a pure-breeding short plant (tt).',
        question: 'When TT is crossed with tt, what will be the genotype and phenotype of ALL F₁ offspring?',
        options: [
          'All tt — all short',
          'All Tt — all tall (T is dominant)',
          '50% TT and 50% tt — half tall, half short',
          'All TT — all tall',
        ],
        correctIndex: 1,
        clue: {
          title: 'Monohybrid Cross — F₁ Generation',
          explanation:
            'TT × tt: every offspring receives T from one parent and t from the other. All offspring are Tt (heterozygous). Since tall (T) is dominant, all F₁ plants are tall. Punnett square: T×t, T×t gives 4 Tt squares.',
          visual: 'diagram',
          cost: 20,
        },
        coinsOnCorrect: 50,
      },
      {
        id: 'g12-science-q3',
        narrative:
          'Two heterozygous tall plants (Tt × Tt) are crossed. What is the expected ratio in the F₂ generation?',
        question: 'In a Tt × Tt cross, what is the expected phenotype ratio of F₂ offspring?',
        options: [
          '1 tall : 1 short',
          '2 tall : 1 short',
          '3 tall : 1 short',
          '4 tall : 0 short',
        ],
        correctIndex: 2,
        clue: {
          title: 'F₂ Monohybrid Ratio',
          explanation:
            'Tt × Tt Punnett square: TT, Tt, Tt, tt. Genotypes: 1 TT : 2 Tt : 1 tt. Phenotypes: TT and Tt are both tall (T is dominant), only tt is short. Ratio = 3 tall : 1 short.',
          visual: 'diagram',
          cost: 20,
        },
        coinsOnCorrect: 50,
      },
      {
        id: 'g12-science-q4',
        narrative:
          'The Oracle traces the DNA strand 5′-ATCG-3′. She asks for the complementary DNA strand written in the correct antiparallel direction.',
        question:
          'What is the complementary DNA strand to 5′-ATCG-3′, written in the 3′ to 5′ direction (antiparallel)?',
        options: [
          '5′-TAGC-3′',
          '3′-TAGC-5′',
          '3′-UAGC-5′',
          '5′-CGAT-3′',
        ],
        correctIndex: 1,
        clue: {
          title: 'Antiparallel Complementary Strand',
          explanation:
            'Complementary bases: A↔T, T↔A, C↔G, G↔C. Original 5′-A-T-C-G-3′ pairs with 3′-T-A-G-C-5′ (written antiparallel). The complementary strand runs 3′→5′ alongside the template 5′→3′ strand.',
          visual: 'diagram',
          cost: 20,
        },
        coinsOnCorrect: 50,
      },
      {
        id: 'g12-science-q5',
        narrative:
          'Leviathan Mutatix reveals it carries the sickle-cell allele. In a population where both parents are carriers (Ss × Ss), what fraction of children will have sickle-cell disease?',
        question:
          'Sickle-cell disease (ss) is autosomal recessive. If both parents are carriers (Ss × Ss), what is the probability their child will have sickle-cell disease?',
        options: ['0% (1/0)', '25% (1/4)', '50% (1/2)', '75% (3/4)'],
        correctIndex: 1,
        clue: {
          title: 'Autosomal Recessive Inheritance',
          explanation:
            'Ss × Ss Punnett square: SS (25%) — unaffected, not carrier. Ss (50%) — carrier, unaffected. ss (25%) — sickle-cell disease. Only ss individuals are affected. Probability = 1/4 = 25%. Note: 2/4 = 50% are carriers.',
          visual: 'diagram',
          cost: 20,
        },
        coinsOnCorrect: 50,
      },
    ],
  },
];

export const DP_QUESTS_BY_GRADE: Record<number, CurriculumQuest[]> = {
  11: DP_QUESTS.filter(q => q.grade === 11),
  12: DP_QUESTS.filter(q => q.grade === 12),
};
