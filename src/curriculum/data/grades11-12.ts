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

  // ─── GRADE 11 · MATH: Differentiation ───────────────────────────────────
  {
    id: 'g11-math-2',
    grade: 11,
    programme: 'DP',
    subject: 'math',
    title: 'Differentiation',
    realmName: 'The Shifting Slopes',
    narrativeWorld:
      'The Shifting Slopes is a realm where the terrain changes continuously. Hills rise and valleys form as you walk. Only by mastering the derivative can you predict the landscape and find safe passage through the ever-changing world.',
    characterTeacher: 'Professor Derivus',
    teacherEmoji: '🧮',
    theme: 'wizard',
    coinReward: 250,
    boss: {
      id: 'g11-math-2-boss',
      title: 'The Inflection Demon',
      villain: 'Tangentius the Unstable',
      villainEmoji: '😈',
      narrative:
        'Tangentius the Unstable changes shape at every moment. Only calculus can pin him down. Solve his optimization challenge to defeat him.',
      question:
        'A farmer has 200 m of fencing to enclose a rectangular field against a straight river (no fencing needed on the river side). Let x be the width perpendicular to the river. (a) Express the area A in terms of x. (b) Find dA/dx. (c) Find the value of x that maximises the area, and state the maximum area.',
      answer:
        '(a) Length along river = 200 − 2x, so A = x(200 − 2x) = 200x − 2x². (b) dA/dx = 200 − 4x. (c) Set 200 − 4x = 0 → x = 50 m. A = 50(200 − 100) = 50 × 100 = 5000 m².',
      hints: [
        'The total fencing is for two widths and one length: 2x + L = 200.',
        'Differentiate the area function and set it equal to zero.',
        'Verify it is a maximum by checking the second derivative is negative.',
      ],
      coinReward: 150,
    },
    questions: [
      {
        id: 'g11-math-2-q1',
        narrative:
          'The path ahead requires knowing the slope at any point. Differentiate to proceed.',
        question: 'Find the derivative of f(x) = 3x⁴.',
        equation: "f'(x) = ?",
        options: ['12x³', '3x³', '4x³', '12x⁴'],
        correctIndex: 0,
        clue: {
          title: 'Power Rule',
          explanation:
            'The power rule states d/dx(xⁿ) = nxⁿ⁻¹. So d/dx(3x⁴) = 3 × 4x³ = 12x³.',
          visual: 'text',
          cost: 20,
        },
        coinsOnCorrect: 50,
      },
      {
        id: 'g11-math-2-q2',
        narrative:
          'A magical wave function describes the terrain. Find its rate of change.',
        question: 'Differentiate f(x) = 5x³ − 2x² + 7x − 4.',
        equation: "f'(x) = ?",
        options: ['15x² − 4x + 7', '15x² − 4x − 4', '5x² − 2x + 7', '15x³ − 4x²'],
        correctIndex: 0,
        clue: {
          title: 'Differentiating Polynomials',
          explanation:
            'Apply the power rule term by term: 15x² − 4x + 7. Constants differentiate to 0.',
          visual: 'text',
          cost: 20,
        },
        coinsOnCorrect: 50,
      },
      {
        id: 'g11-math-2-q3',
        narrative:
          'A hill\'s profile is given by a function. Where is the gradient zero?',
        question:
          'Find the x-values where the gradient of f(x) = x³ − 3x is zero.',
        equation: "f'(x) = 3x² − 3 = 0",
        options: ['x = 1 and x = −1', 'x = 0 and x = 3', 'x = 3 only', 'x = 1 only'],
        correctIndex: 0,
        clue: {
          title: 'Stationary Points',
          explanation:
            "f'(x) = 3x² − 3 = 0 → 3(x² − 1) = 0 → x² = 1 → x = ±1.",
          visual: 'diagram',
          cost: 20,
        },
        coinsOnCorrect: 50,
      },
      {
        id: 'g11-math-2-q4',
        narrative:
          'You must find the equation of the tangent line to a curve at a specific point.',
        question:
          'What is the gradient of y = x² + 3x at x = 2?',
        equation: "y' = 2x + 3, evaluate at x = 2",
        options: ['7', '10', '5', '4'],
        correctIndex: 0,
        clue: {
          title: 'Gradient at a Point',
          explanation:
            "y' = 2x + 3. At x = 2: y' = 2(2) + 3 = 7.",
          visual: 'numberLine',
          cost: 20,
        },
        coinsOnCorrect: 50,
      },
      {
        id: 'g11-math-2-q5',
        narrative:
          'The chain rule is needed to differentiate a composite function guarding the exit.',
        question:
          'Differentiate f(x) = (2x + 1)⁵ using the chain rule.',
        equation: "f'(x) = 5(2x + 1)⁴ × ?",
        options: ['10(2x + 1)⁴', '5(2x + 1)⁴', '10(2x + 1)⁵', '2(2x + 1)⁴'],
        correctIndex: 0,
        clue: {
          title: 'Chain Rule',
          explanation:
            "Let u = 2x + 1. Then f = u⁵, so f'= 5u⁴ × du/dx = 5(2x + 1)⁴ × 2 = 10(2x + 1)⁴.",
          visual: 'text',
          cost: 20,
        },
        coinsOnCorrect: 50,
      },
    ],
  },

  // ─── GRADE 11 · MATH: Probability & Statistics ──────────────────────────
  {
    id: 'g11-math-3',
    grade: 11,
    programme: 'DP',
    subject: 'math',
    title: 'Probability & Statistics',
    realmName: 'The Stochastic Sanctum',
    narrativeWorld:
      'The Stochastic Sanctum is a temple where every door leads to multiple possible futures. Probability distributions glow on the walls, and only those who can interpret distributions and calculate conditional probabilities may choose the correct path.',
    characterTeacher: 'High Priestess Bayesia',
    teacherEmoji: '🎭',
    theme: 'wizard',
    coinReward: 250,
    boss: {
      id: 'g11-math-3-boss',
      title: 'The Entropy Lord',
      villain: 'Randomius Maximus',
      villainEmoji: '🃏',
      narrative:
        'Randomius Maximus sits in a throne of shuffled cards and scattered dice. He challenges you with a conditional probability puzzle that combines multiple concepts.',
      question:
        'In a school, 60% of students study Mathematics (M) and 40% study Science (S). Of those who study Mathematics, 30% also study Science. (a) Find P(M and S). (b) Find P(M or S). (c) Given that a student studies Science, what is the probability they also study Mathematics?',
      answer:
        '(a) P(M and S) = P(M) × P(S|M) = 0.6 × 0.3 = 0.18. (b) P(M or S) = P(M) + P(S) − P(M and S) = 0.6 + 0.4 − 0.18 = 0.82. (c) P(M|S) = P(M and S) / P(S) = 0.18 / 0.4 = 0.45.',
      hints: [
        'Use the multiplication rule: P(A and B) = P(A) × P(B|A).',
        'Use the addition rule: P(A or B) = P(A) + P(B) − P(A and B).',
        'Conditional probability: P(A|B) = P(A and B) / P(B).',
      ],
      coinReward: 150,
    },
    questions: [
      {
        id: 'g11-math-3-q1',
        narrative:
          'The first chamber has a Venn diagram carved into the floor.',
        question:
          'Events A and B are independent with P(A) = 0.5 and P(B) = 0.3. What is P(A and B)?',
        equation: 'P(A and B) = P(A) × P(B)',
        options: ['0.15', '0.80', '0.20', '0.50'],
        correctIndex: 0,
        clue: {
          title: 'Independent Events',
          explanation:
            'For independent events, P(A and B) = P(A) × P(B) = 0.5 × 0.3 = 0.15.',
          visual: 'diagram',
          cost: 20,
        },
        coinsOnCorrect: 50,
      },
      {
        id: 'g11-math-3-q2',
        narrative:
          'A mystical urn contains coloured orbs. You draw two without replacement.',
        question:
          'An urn has 5 red and 3 blue orbs. Two are drawn without replacement. What is the probability both are red?',
        equation: 'P = (5/8) × (4/7)',
        options: ['5/14', '25/64', '10/56', '1/4'],
        correctIndex: 0,
        clue: {
          title: 'Without Replacement',
          explanation:
            'First draw: 5/8 chance of red. Second draw: 4/7 chance of red. P = (5/8) × (4/7) = 20/56 = 5/14.',
          visual: 'diagram',
          cost: 20,
        },
        coinsOnCorrect: 50,
      },
      {
        id: 'g11-math-3-q3',
        narrative:
          'A scroll shows a probability distribution table with a missing value.',
        question:
          'A discrete random variable X has P(X=1) = 0.2, P(X=2) = 0.35, P(X=3) = 0.25. What is P(X=4) if these are the only values?',
        equation: '0.2 + 0.35 + 0.25 + P(X=4) = 1',
        options: ['0.2', '0.15', '0.25', '0.1'],
        correctIndex: 0,
        clue: {
          title: 'Probability Distributions Sum to 1',
          explanation:
            'All probabilities must sum to 1. P(X=4) = 1 − 0.2 − 0.35 − 0.25 = 0.2.',
          visual: 'text',
          cost: 20,
        },
        coinsOnCorrect: 50,
      },
      {
        id: 'g11-math-3-q4',
        narrative:
          'The temple guardian asks about expected value from a game of chance.',
        question:
          'A game pays $10 with probability 0.3, $5 with probability 0.5, and $0 with probability 0.2. What is the expected payout?',
        equation: 'E(X) = 10(0.3) + 5(0.5) + 0(0.2)',
        options: ['$5.50', '$5.00', '$7.50', '$3.00'],
        correctIndex: 0,
        clue: {
          title: 'Expected Value',
          explanation:
            'E(X) = 10 × 0.3 + 5 × 0.5 + 0 × 0.2 = 3 + 2.5 + 0 = $5.50.',
          visual: 'text',
          cost: 20,
        },
        coinsOnCorrect: 50,
      },
      {
        id: 'g11-math-3-q5',
        narrative:
          'The exit door requires you to apply the normal distribution.',
        question:
          'In a normal distribution with mean 50 and standard deviation 10, what percentage of data falls between 40 and 60?',
        equation: '40 = mu − sigma, 60 = mu + sigma',
        options: ['About 68%', 'About 95%', 'About 50%', 'About 99.7%'],
        correctIndex: 0,
        clue: {
          title: 'The 68-95-99.7 Rule',
          explanation:
            '40 and 60 are each 1 standard deviation from the mean. By the empirical rule, approximately 68% of data falls within 1 standard deviation.',
          visual: 'diagram',
          cost: 20,
        },
        coinsOnCorrect: 50,
      },
    ],
  },

  // ─── GRADE 11 · SCIENCE: Thermodynamics ─────────────────────────────────
  {
    id: 'g11-science-2',
    grade: 11,
    programme: 'DP',
    subject: 'science',
    title: 'Thermodynamics',
    realmName: 'The Entropy Spire',
    narrativeWorld:
      'The Entropy Spire rises from a frozen wasteland, its interior a labyrinth of heat engines and perpetual-motion machines that never quite work. The Spire\'s guardian has gone mad, insisting that entropy can be reversed. You must prove your understanding of thermodynamic laws to restore sanity to the Spire.',
    characterTeacher: 'Professor Carnot',
    teacherEmoji: '🔥',
    theme: 'wizard',
    coinReward: 250,
    boss: {
      id: 'g11-science-2-boss',
      title: 'The Entropy Paradox',
      villain: 'Lord Perpetuum',
      villainEmoji: '♾️',
      narrative:
        'Lord Perpetuum cackles atop an impossible machine that he claims runs forever without fuel. Prove that the laws of thermodynamics cannot be broken.',
      question:
        'Lord Perpetuum challenges you: (A) State the First Law of Thermodynamics and explain why a perpetual motion machine of the first kind is impossible. (B) A gas is compressed adiabatically. Explain what happens to its temperature and why, referencing the First Law. (C) The entropy of an isolated system always increases. Explain what this means in practical terms and why a perfectly efficient heat engine is impossible.',
      answer:
        '(A) The First Law states that energy cannot be created or destroyed, only transferred or transformed (conservation of energy). A perpetual motion machine of the first kind would create energy from nothing, violating this law. (B) In an adiabatic process, no heat is exchanged with the surroundings (Q = 0). From the First Law, ΔU = Q − W. Since work is done ON the gas during compression, the internal energy increases, so the temperature rises. (C) The Second Law of Thermodynamics states that in any energy transfer, some energy becomes unavailable for work (increases in entropy). A perfectly efficient heat engine would convert 100% of heat into work, which would decrease entropy — this violates the Second Law. Some waste heat must always be produced.',
      hints: [
        'Energy is conserved — it cannot appear from nowhere.',
        'Adiabatic means Q = 0. Work done on the gas increases internal energy.',
        'The Second Law forbids 100% efficiency in heat engines.',
      ],
      coinReward: 150,
    },
    questions: [
      {
        id: 'g11-science-2-q1',
        narrative:
          'Professor Carnot shows you an isolated system — a perfectly insulated box containing a hot block and a cold block.',
        question: 'After a long time, what happens to the temperatures of the two blocks?',
        options: [
          'The hot block gets hotter and the cold block gets colder',
          'Both blocks reach the same intermediate temperature (thermal equilibrium)',
          'The cold block heats up but the hot block stays the same',
          'Nothing changes in an isolated system',
        ],
        correctIndex: 1,
        clue: {
          title: 'Thermal Equilibrium',
          explanation:
            'Heat flows spontaneously from the hotter body to the cooler body until both reach the same temperature. This is the Zeroth Law of Thermodynamics — thermal equilibrium. In an isolated system, total energy is conserved.',
          visual: 'diagram',
          cost: 20,
        },
        coinsOnCorrect: 50,
      },
      {
        id: 'g11-science-2-q2',
        narrative:
          'A gas in a sealed container is heated. The gas expands and pushes a piston outward, doing work.',
        question: 'According to the First Law of Thermodynamics (ΔU = Q − W), if 500 J of heat is added and the gas does 200 J of work, what is the change in internal energy?',
        options: ['700 J', '300 J', '-300 J', '200 J'],
        correctIndex: 1,
        clue: {
          title: 'First Law Calculation',
          explanation:
            'ΔU = Q − W = 500 J − 200 J = 300 J. The internal energy of the gas increases by 300 J. The rest of the heat energy was used to do work on the surroundings by pushing the piston.',
          visual: 'numberLine',
          cost: 20,
        },
        coinsOnCorrect: 50,
      },
      {
        id: 'g11-science-2-q3',
        narrative:
          'Professor Carnot describes a process where a gas expands while its temperature remains constant.',
        question: 'What is this type of thermodynamic process called?',
        options: ['Adiabatic', 'Isothermal', 'Isobaric', 'Isochoric'],
        correctIndex: 1,
        clue: {
          title: 'Isothermal Process',
          explanation:
            'An isothermal process occurs at constant temperature (iso = same, thermal = temperature). For an ideal gas at constant temperature, ΔU = 0, so Q = W — all heat added is converted to work done by the gas.',
          visual: 'text',
          cost: 20,
        },
        coinsOnCorrect: 50,
      },
      {
        id: 'g11-science-2-q4',
        narrative:
          'A heat engine operates between a hot reservoir at 600 K and a cold reservoir at 300 K.',
        question: 'What is the maximum theoretical (Carnot) efficiency of this engine?',
        options: ['25%', '50%', '75%', '100%'],
        correctIndex: 1,
        clue: {
          title: 'Carnot Efficiency',
          explanation:
            'The maximum efficiency of a heat engine is given by the Carnot efficiency: η = 1 − (T_cold / T_hot) = 1 − (300/600) = 1 − 0.5 = 0.5 = 50%. No real engine can exceed this.',
          visual: 'numberLine',
          cost: 20,
        },
        coinsOnCorrect: 50,
      },
      {
        id: 'g11-science-2-q5',
        narrative:
          'Professor Carnot places an ice cube on a warm table. It melts. He asks whether this process could spontaneously reverse.',
        question: 'Why does the melted water not spontaneously refreeze on the warm table?',
        options: [
          'Because energy is destroyed when ice melts',
          'Because the total entropy of the universe must increase in a spontaneous process',
          'Because water molecules stop moving when they melt',
          'Because the First Law prevents it',
        ],
        correctIndex: 1,
        clue: {
          title: 'Second Law and Entropy',
          explanation:
            'The Second Law of Thermodynamics states that the total entropy of an isolated system can only increase. Water spontaneously refreezing on a warm surface would decrease the total entropy, so it does not happen. Heat flows from hot to cold, not the reverse, without external work.',
          visual: 'text',
          cost: 20,
        },
        coinsOnCorrect: 50,
      },
    ],
  },

  // ─── GRADE 11 · SCIENCE: Organic Chemistry ──────────────────────────────
  {
    id: 'g11-science-3',
    grade: 11,
    programme: 'DP',
    subject: 'science',
    title: 'Organic Chemistry',
    realmName: 'The Carbon Labyrinth',
    narrativeWorld:
      'The Carbon Labyrinth is a vast maze built entirely from molecular models — chains of carbon atoms stretch into corridors, and functional groups form doorways and traps. A mad chemist has rearranged the molecules, creating dangerous isomers at every turn. Navigate the labyrinth using your knowledge of organic chemistry.',
    characterTeacher: 'Dr. Benzene',
    teacherEmoji: '⬡',
    theme: 'wizard',
    coinReward: 250,
    boss: {
      id: 'g11-science-3-boss',
      title: 'The Isomer Hydra',
      villain: 'Polymera the Shapeshifter',
      villainEmoji: '🐍',
      narrative:
        'Polymera the Shapeshifter lurks at the centre of the labyrinth, constantly rearranging her molecular structure. She claims organic chemistry is just random carbon chaos. Prove her wrong.',
      question:
        'Polymera demands three answers: (A) Draw or describe the structural difference between ethanol (C₂H₅OH) and methoxymethane (CH₃OCH₃). They have the same molecular formula — what is this relationship called? (B) Explain why alkanes are generally unreactive compared to alkenes, referencing their bonding. (C) Describe the process of addition polymerisation using ethene as the monomer, and name the polymer formed.',
      answer:
        '(A) Ethanol has an -OH group bonded to carbon (C₂H₅OH), while methoxymethane has an oxygen between two methyl groups (CH₃-O-CH₃). They are structural isomers — same molecular formula (C₂H₆O) but different structural arrangements. (B) Alkanes contain only single C-C bonds (saturated), making them relatively unreactive. Alkenes have at least one C=C double bond (unsaturated), and the double bond is a region of high electron density that readily undergoes addition reactions. (C) In addition polymerisation, the C=C double bonds in ethene monomers open up, and the molecules join together to form a long chain. Many ethene (CH₂=CH₂) monomers form poly(ethene) — commonly known as polyethylene.',
      hints: [
        'Same molecular formula but different structures = isomers.',
        'Single bonds are more stable; double bonds are more reactive.',
        'In addition polymerisation, double bonds open up to form a chain.',
      ],
      coinReward: 150,
    },
    questions: [
      {
        id: 'g11-science-3-q1',
        narrative:
          'Dr. Benzene points to a simple chain of carbon atoms, each bonded to hydrogen. No double bonds are present.',
        question: 'What is the name given to hydrocarbons that contain only single C–C bonds?',
        options: ['Alkenes', 'Alkanes', 'Alcohols', 'Carboxylic acids'],
        correctIndex: 1,
        clue: {
          title: 'Alkanes',
          explanation:
            'Alkanes are saturated hydrocarbons — they contain only single covalent bonds between carbon atoms. Their general formula is CₙH₂ₙ₊₂. Examples: methane (CH₄), ethane (C₂H₆), propane (C₃H₈).',
          visual: 'text',
          cost: 20,
        },
        coinsOnCorrect: 50,
      },
      {
        id: 'g11-science-3-q2',
        narrative:
          'A corridor forks into two paths, each labelled with a molecular structure: one has a C=C double bond and the other does not.',
        question: 'What functional group distinguishes an alkene from an alkane?',
        options: [
          'An -OH hydroxyl group',
          'A C=C carbon-carbon double bond',
          'A -COOH carboxyl group',
          'A C≡C triple bond',
        ],
        correctIndex: 1,
        clue: {
          title: 'Alkene Functional Group',
          explanation:
            'Alkenes are unsaturated hydrocarbons characterised by at least one C=C double bond. This double bond is more reactive than a single bond and readily undergoes addition reactions such as hydrogenation and bromination.',
          visual: 'diagram',
          cost: 20,
        },
        coinsOnCorrect: 50,
      },
      {
        id: 'g11-science-3-q3',
        narrative:
          'Dr. Benzene drops bromine water onto two samples. One decolourises the orange-brown bromine water immediately; the other does not change.',
        question: 'Which hydrocarbon decolourises bromine water?',
        options: [
          'An alkane — because it is saturated',
          'An alkene — because the C=C double bond reacts with bromine',
          'Both alkanes and alkenes decolourise bromine water',
          'Neither — bromine water cannot test for unsaturation',
        ],
        correctIndex: 1,
        clue: {
          title: 'Bromine Water Test',
          explanation:
            'The bromine water test distinguishes alkenes from alkanes. Alkenes decolourise bromine water (orange to colourless) because the C=C double bond undergoes an addition reaction with bromine (Br₂). Alkanes do not react.',
          visual: 'text',
          cost: 20,
        },
        coinsOnCorrect: 50,
      },
      {
        id: 'g11-science-3-q4',
        narrative:
          'A sign on the wall reads: "CH₃CH₂OH." Dr. Benzene asks you to identify the functional group.',
        question: 'What functional group does ethanol (CH₃CH₂OH) contain?',
        options: [
          'A carboxyl group (-COOH)',
          'A hydroxyl group (-OH)',
          'An amino group (-NH₂)',
          'A carbonyl group (C=O)',
        ],
        correctIndex: 1,
        clue: {
          title: 'Alcohols',
          explanation:
            'Ethanol contains a hydroxyl (-OH) functional group bonded to a carbon atom. The general formula for alcohols is CₙH₂ₙ₊₁OH. The -OH group gives alcohols their characteristic properties such as solubility in water.',
          visual: 'diagram',
          cost: 20,
        },
        coinsOnCorrect: 50,
      },
      {
        id: 'g11-science-3-q5',
        narrative:
          'Two molecules have the formula C₄H₁₀ but are drawn differently. One is a straight chain and the other is branched.',
        question: 'What is the relationship between these two molecules?',
        options: [
          'They are the same compound',
          'They are structural isomers',
          'They are different elements',
          'They are isotopes',
        ],
        correctIndex: 1,
        clue: {
          title: 'Structural Isomers',
          explanation:
            'Structural isomers have the same molecular formula but different structural arrangements of atoms. Butane (straight chain) and methylpropane (branched) both have the formula C₄H₁₀ but different structures and slightly different physical properties.',
          visual: 'diagram',
          cost: 20,
        },
        coinsOnCorrect: 50,
      },
    ],
  },

  // ─── GRADE 12 · MATH: Differential Equations ────────────────────────────
  {
    id: 'g12-math-2',
    grade: 12,
    programme: 'DP',
    subject: 'math',
    title: 'Differential Equations',
    realmName: 'The Temporal Rift',
    narrativeWorld:
      'The Temporal Rift is a fracture in time itself, where past, present, and future bleed together. Differential equations govern the flow of time here, and only by solving them can you stabilise the rift and restore order.',
    characterTeacher: 'Chronomancer Euler',
    teacherEmoji: '⏳',
    theme: 'wizard',
    coinReward: 250,
    boss: {
      id: 'g12-math-2-boss',
      title: 'The Singularity',
      villain: 'Lord Divergence',
      villainEmoji: '🕳️',
      narrative:
        'Lord Divergence threatens to collapse all timelines into one. Solve his differential equation to seal the rift permanently.',
      question:
        'A population P grows according to dP/dt = 0.05P. At time t = 0, the population is 1000. (a) Solve the differential equation for P(t). (b) Find the population at t = 10. (c) How long does it take for the population to double? (Give exact answers using ln.)',
      answer:
        '(a) dP/P = 0.05 dt → ln|P| = 0.05t + C. At t = 0, P = 1000: C = ln(1000). So P(t) = 1000e^(0.05t). (b) P(10) = 1000e^(0.5) ≈ 1000 × 1.6487 ≈ 1648.7. (c) 2000 = 1000e^(0.05t) → e^(0.05t) = 2 → 0.05t = ln 2 → t = 20 ln 2 ≈ 13.86.',
      hints: [
        'Separate variables: move all P terms to one side and t terms to the other.',
        'Integrate both sides and use the initial condition to find the constant.',
        'To find doubling time, set P(t) = 2P(0) and solve for t.',
      ],
      coinReward: 150,
    },
    questions: [
      {
        id: 'g12-math-2-q1',
        narrative:
          'The rift pulses with a simple rate of change. Identify the type of differential equation.',
        question:
          'What is the general solution of dy/dx = 3?',
        equation: 'dy/dx = 3',
        options: ['y = 3x + C', 'y = 3', 'y = x³ + C', 'y = 3x²'],
        correctIndex: 0,
        clue: {
          title: 'Direct Integration',
          explanation:
            'Integrate both sides: y = integral of 3 dx = 3x + C.',
          visual: 'text',
          cost: 20,
        },
        coinsOnCorrect: 50,
      },
      {
        id: 'g12-math-2-q2',
        narrative:
          'A time crystal decays at a rate proportional to its current mass.',
        question:
          'If dy/dx = 2y, what is the general solution?',
        equation: 'dy/dx = 2y',
        options: ['y = Ae^(2x)', 'y = 2e^x', 'y = e^(2x) + C', 'y = 2x + C'],
        correctIndex: 0,
        clue: {
          title: 'Separable Equations',
          explanation:
            'Separate: dy/y = 2 dx. Integrate: ln|y| = 2x + C. So y = Ae^(2x) where A = e^C.',
          visual: 'text',
          cost: 20,
        },
        coinsOnCorrect: 50,
      },
      {
        id: 'g12-math-2-q3',
        narrative:
          'You must solve a differential equation with an initial condition to stabilise a timeline.',
        question:
          'Solve dy/dx = x with y(0) = 5. What is y(4)?',
        equation: 'y = x²/2 + 5',
        options: ['13', '8', '21', '9'],
        correctIndex: 0,
        clue: {
          title: 'Initial Value Problems',
          explanation:
            'Integrate: y = x²/2 + C. Using y(0) = 5: 5 = 0 + C, so C = 5. y = x²/2 + 5. At x = 4: y = 16/2 + 5 = 8 + 5 = 13.',
          visual: 'numberLine',
          cost: 20,
        },
        coinsOnCorrect: 50,
      },
      {
        id: 'g12-math-2-q4',
        narrative:
          'A portal\'s energy follows a second-order pattern. Find the particular solution.',
        question:
          'If d²y/dx² = 6x and dy/dx = 0 when x = 0, what is dy/dx?',
        equation: 'dy/dx = integral of 6x dx',
        options: ['3x²', '6x² + C', '3x² + 6', '6x'],
        correctIndex: 0,
        clue: {
          title: 'Integrating Twice',
          explanation:
            'Integrate d²y/dx² = 6x: dy/dx = 3x² + C. Using dy/dx(0) = 0: C = 0. So dy/dx = 3x².',
          visual: 'text',
          cost: 20,
        },
        coinsOnCorrect: 50,
      },
      {
        id: 'g12-math-2-q5',
        narrative:
          'The final time lock requires solving a separable equation completely.',
        question:
          'Solve dy/dx = y/x for y > 0 and x > 0. What is the general solution?',
        equation: 'dy/y = dx/x',
        options: ['y = Ax', 'y = x + C', 'y = e^x', 'y = x²'],
        correctIndex: 0,
        clue: {
          title: 'Separable Variables',
          explanation:
            'Separate: dy/y = dx/x. Integrate: ln y = ln x + C. So y = e^(ln x + C) = e^C × x = Ax where A is a positive constant.',
          visual: 'text',
          cost: 20,
        },
        coinsOnCorrect: 50,
      },
    ],
  },

  // ─── GRADE 12 · MATH: Vectors & 3D Geometry ─────────────────────────────
  {
    id: 'g12-math-3',
    grade: 12,
    programme: 'DP',
    subject: 'math',
    title: 'Vectors & 3D Geometry',
    realmName: 'The Celestial Lattice',
    narrativeWorld:
      'Beyond the sky lies the Celestial Lattice, a three-dimensional web of starlight where every point has coordinates in space. Navigate this cosmic grid using vectors to reach the Astral Core and restore balance to the heavens.',
    characterTeacher: 'Astral Navigator Vectra',
    teacherEmoji: '🌌',
    theme: 'wizard',
    coinReward: 250,
    boss: {
      id: 'g12-math-3-boss',
      title: 'The Void Architect',
      villain: 'Nullspace the Infinite',
      villainEmoji: '🌑',
      narrative:
        'Nullspace the Infinite lurks at the centre of the lattice, bending space with vector fields. Solve his 3D geometry challenge to restore the Astral Core.',
      question:
        'Point A is at (1, 2, 3) and point B is at (4, 6, 3). Vector v = (2, −1, 2). (a) Find the vector AB. (b) Find the magnitude of AB. (c) Find the dot product of AB and v, and determine the angle between them to the nearest degree.',
      answer:
        '(a) AB = B − A = (3, 4, 0). (b) |AB| = sqrt(9 + 16 + 0) = sqrt(25) = 5. (c) AB · v = 3(2) + 4(−1) + 0(2) = 6 − 4 + 0 = 2. |v| = sqrt(4 + 1 + 4) = 3. cos(theta) = 2/(5 × 3) = 2/15. theta = arccos(2/15) ≈ 82°.',
      hints: [
        'To find vector AB, subtract coordinates: B − A.',
        'Magnitude = sqrt(x² + y² + z²).',
        'cos(theta) = (a · b) / (|a| × |b|).',
      ],
      coinReward: 150,
    },
    questions: [
      {
        id: 'g12-math-3-q1',
        narrative:
          'Two stars define a direction. Find the vector between them.',
        question:
          'If A = (2, 3, 1) and B = (5, 7, 4), what is the vector AB?',
        equation: 'AB = B − A',
        options: ['(3, 4, 3)', '(7, 10, 5)', '(−3, −4, −3)', '(3, 4, −3)'],
        correctIndex: 0,
        clue: {
          title: 'Position Vectors',
          explanation:
            'AB = B − A = (5−2, 7−3, 4−1) = (3, 4, 3).',
          visual: 'diagram',
          cost: 20,
        },
        coinsOnCorrect: 50,
      },
      {
        id: 'g12-math-3-q2',
        narrative:
          'A force vector acts on a celestial body. Find its magnitude.',
        question:
          'What is the magnitude of vector v = (1, −2, 2)?',
        equation: '|v| = sqrt(1 + 4 + 4)',
        options: ['3', 'sqrt(5)', '5', 'sqrt(8)'],
        correctIndex: 0,
        clue: {
          title: 'Magnitude of a 3D Vector',
          explanation:
            '|v| = sqrt(1² + (−2)² + 2²) = sqrt(1 + 4 + 4) = sqrt(9) = 3.',
          visual: 'text',
          cost: 20,
        },
        coinsOnCorrect: 50,
      },
      {
        id: 'g12-math-3-q3',
        narrative:
          'Two beams of light intersect. Find their dot product to determine the angle.',
        question:
          'Find the dot product of a = (3, −1, 2) and b = (1, 4, −2).',
        equation: 'a · b = 3(1) + (−1)(4) + 2(−2)',
        options: ['−5', '5', '−1', '3'],
        correctIndex: 0,
        clue: {
          title: 'Dot Product',
          explanation:
            'a · b = 3(1) + (−1)(4) + 2(−2) = 3 − 4 − 4 = −5.',
          visual: 'text',
          cost: 20,
        },
        coinsOnCorrect: 50,
      },
      {
        id: 'g12-math-3-q4',
        narrative:
          'A star traveller moves along a parametric path. Find the position at a given time.',
        question:
          'A line has equation r = (1, 0, 2) + t(2, 3, −1). What is the position when t = 3?',
        equation: 'r = (1+6, 0+9, 2−3)',
        options: ['(7, 9, −1)', '(3, 3, 1)', '(7, 9, 5)', '(2, 3, −1)'],
        correctIndex: 0,
        clue: {
          title: 'Vector Equation of a Line',
          explanation:
            'Substitute t = 3: r = (1 + 2×3, 0 + 3×3, 2 + (−1)×3) = (7, 9, −1).',
          visual: 'diagram',
          cost: 20,
        },
        coinsOnCorrect: 50,
      },
      {
        id: 'g12-math-3-q5',
        narrative:
          'Two vectors define a plane. Find their cross product to get the normal.',
        question:
          'Find the cross product of a = (1, 0, 0) and b = (0, 1, 0).',
        equation: 'a × b = ?',
        options: ['(0, 0, 1)', '(0, 0, −1)', '(1, 1, 0)', '(0, 0, 0)'],
        correctIndex: 0,
        clue: {
          title: 'Cross Product',
          explanation:
            'a × b = (0×0 − 0×1, 0×0 − 1×0, 1×1 − 0×0) = (0, 0, 1). This is the unit vector k, perpendicular to both i and j.',
          visual: 'diagram',
          cost: 20,
        },
        coinsOnCorrect: 50,
      },
    ],
  },

  // ─── GRADE 12 · SCIENCE: Evolution & Natural Selection ──────────────────
  {
    id: 'g12-science-2',
    grade: 12,
    programme: 'DP',
    subject: 'science',
    title: 'Evolution & Natural Selection',
    realmName: 'The Phylogen Tree',
    narrativeWorld:
      'The Phylogen Tree is a colossal living organism whose branches represent every lineage of life. Each branch holds fossilised memories of speciation events, adaptive radiations, and mass extinctions. A parasitic entity is severing branches, trying to erase the record of evolution. You must defend the tree with your knowledge.',
    characterTeacher: 'Professor Darwin',
    teacherEmoji: '🌳',
    theme: 'wizard',
    coinReward: 250,
    boss: {
      id: 'g12-science-2-boss',
      title: 'The Extinction Engine',
      villain: 'Oblivion Clade',
      villainEmoji: '☠️',
      narrative:
        'Oblivion Clade wraps around the trunk of the Phylogen Tree, draining its life force. He claims evolution is random and purposeless. Prove that natural selection is a non-random process that shapes populations.',
      question:
        'Oblivion Clade demands three explanations: (A) Distinguish between directional, stabilising, and disruptive selection, giving an example of each. (B) Explain how geographic isolation can lead to speciation (allopatric speciation). (C) What is the Hardy-Weinberg principle, and name two conditions that must be met for allele frequencies to remain constant in a population.',
      answer:
        '(A) Directional selection favours one extreme phenotype (e.g., darker fur in a darkening environment). Stabilising selection favours the intermediate phenotype (e.g., human birth weight — very large or very small babies have lower survival). Disruptive selection favours both extremes over the intermediate (e.g., beak size in seed-cracking birds where medium beaks are disadvantaged). (B) Geographic isolation (e.g., a river or mountain) splits a population. Each subpopulation experiences different selection pressures and random mutations. Over time, genetic differences accumulate until the groups can no longer interbreed — they become separate species. (C) The Hardy-Weinberg principle states that allele and genotype frequencies in a population remain constant from generation to generation in the absence of evolutionary influences. Conditions include: no mutations, no natural selection, no gene flow, random mating, and a large population size.',
      hints: [
        'Think about which phenotypes are favoured: one extreme, the middle, or both extremes.',
        'Allopatric = "other homeland." Physical barriers prevent gene flow.',
        'Hardy-Weinberg is an idealised model — real populations rarely meet all conditions.',
      ],
      coinReward: 150,
    },
    questions: [
      {
        id: 'g12-science-2-q1',
        narrative:
          'Professor Darwin points to a branch where a moth population darkened over time as industrial pollution covered tree bark in soot.',
        question: 'What type of natural selection is this an example of?',
        options: [
          'Stabilising selection',
          'Directional selection',
          'Disruptive selection',
          'Artificial selection',
        ],
        correctIndex: 1,
        clue: {
          title: 'Directional Selection',
          explanation:
            'Directional selection occurs when one extreme phenotype is favoured over others. In the peppered moth example, darker moths were better camouflaged on soot-covered trees, so they survived and reproduced more — shifting the population toward the darker phenotype.',
          visual: 'diagram',
          cost: 20,
        },
        coinsOnCorrect: 50,
      },
      {
        id: 'g12-science-2-q2',
        narrative:
          'A population of squirrels is split by a newly formed canyon. After thousands of years, the two groups can no longer interbreed.',
        question: 'What type of speciation has occurred?',
        options: [
          'Sympatric speciation',
          'Allopatric speciation',
          'Artificial speciation',
          'Parapatric speciation',
        ],
        correctIndex: 1,
        clue: {
          title: 'Allopatric Speciation',
          explanation:
            'Allopatric speciation occurs when a physical barrier (canyon, mountain range, body of water) geographically separates a population. Each group evolves independently under different selection pressures until they become reproductively isolated — forming new species.',
          visual: 'text',
          cost: 20,
        },
        coinsOnCorrect: 50,
      },
      {
        id: 'g12-science-2-q3',
        narrative:
          'Professor Darwin discusses how some traits appear similar in unrelated species, like the wings of bats and the wings of insects.',
        question: 'What is the term for similar structures that evolved independently in unrelated species due to similar environmental pressures?',
        options: [
          'Homologous structures',
          'Vestigial structures',
          'Analogous structures (convergent evolution)',
          'Divergent structures',
        ],
        correctIndex: 2,
        clue: {
          title: 'Convergent Evolution',
          explanation:
            'Analogous structures result from convergent evolution — unrelated species evolve similar features because they face similar environmental challenges. Bat wings and insect wings serve the same function but evolved independently and have different underlying anatomy.',
          visual: 'text',
          cost: 20,
        },
        coinsOnCorrect: 50,
      },
      {
        id: 'g12-science-2-q4',
        narrative:
          'A small group of birds is blown to a remote island during a storm. This founder population has different allele frequencies from the original population.',
        question: 'What is this an example of?',
        options: [
          'Natural selection',
          'The founder effect (genetic drift)',
          'Gene flow',
          'Stabilising selection',
        ],
        correctIndex: 1,
        clue: {
          title: 'Founder Effect',
          explanation:
            'The founder effect is a form of genetic drift where a small group separates from a larger population and establishes a new colony. The new population\'s allele frequencies may differ significantly from the original population by chance alone.',
          visual: 'text',
          cost: 20,
        },
        coinsOnCorrect: 50,
      },
      {
        id: 'g12-science-2-q5',
        narrative:
          'Professor Darwin writes two equations on the board: p + q = 1 and p² + 2pq + q² = 1.',
        question: 'What principle do these equations represent, and what does it predict about a population?',
        options: [
          'Mendel\'s Law — it predicts dominant and recessive traits in offspring',
          'Hardy-Weinberg equilibrium — it predicts allele and genotype frequencies remain constant without evolutionary forces',
          'Darwin\'s Law — it predicts which species will go extinct',
          'The Central Dogma — it predicts protein synthesis rates',
        ],
        correctIndex: 1,
        clue: {
          title: 'Hardy-Weinberg Principle',
          explanation:
            'The Hardy-Weinberg equations predict that allele frequencies (p, q) and genotype frequencies (p², 2pq, q²) remain constant in a population if five conditions are met: no mutation, no selection, no gene flow, random mating, and large population size. Deviations indicate evolution is occurring.',
          visual: 'numberLine',
          cost: 20,
        },
        coinsOnCorrect: 50,
      },
    ],
  },

  // ─── GRADE 12 · SCIENCE: Ecology & Environment ──────────────────────────
  {
    id: 'g12-science-3',
    grade: 12,
    programme: 'DP',
    subject: 'science',
    title: 'Ecology & Environment',
    realmName: 'The Biosphere Citadel',
    narrativeWorld:
      'The Biosphere Citadel is a sealed dome that contains miniature versions of Earth\'s major biomes — from tropical rainforest to arctic tundra. A saboteur has disrupted the nutrient cycles and introduced invasive species, throwing every biome into crisis. You must use your ecological expertise to restore the Citadel\'s delicate balance.',
    characterTeacher: 'Warden Gaia',
    teacherEmoji: '🌍',
    theme: 'wizard',
    coinReward: 250,
    boss: {
      id: 'g12-science-3-boss',
      title: 'The Collapse',
      villain: 'Entropa the Defiler',
      villainEmoji: '🏭',
      narrative:
        'Entropa the Defiler sits in the control room of the Citadel, pumping greenhouse gases into the dome and dumping toxins into the water cycle. She believes ecosystems are too fragile to survive. Prove that ecological knowledge can save the biosphere.',
      question:
        'Entropa demands three proofs: (A) Explain the greenhouse effect and distinguish between the natural greenhouse effect and enhanced (anthropogenic) greenhouse effect. (B) Describe the carbon cycle, including how carbon moves between the atmosphere, biosphere, and lithosphere. (C) An invasive species is introduced to a lake. Explain, using ecological principles, how this could lead to eutrophication and the collapse of the lake ecosystem.',
      answer:
        '(A) The natural greenhouse effect is essential for life: greenhouse gases (CO₂, CH₄, H₂O) trap some infrared radiation re-emitted by Earth\'s surface, keeping the planet warm enough to support life (~15°C average). The enhanced greenhouse effect is caused by human activities (burning fossil fuels, deforestation) increasing greenhouse gas concentrations, trapping more heat and causing global warming. (B) Carbon enters the atmosphere as CO₂ through respiration, combustion, and volcanic activity. Plants absorb CO₂ via photosynthesis (atmosphere → biosphere). Dead organisms may form fossil fuels over millions of years (biosphere → lithosphere). Burning fossil fuels releases stored carbon back to the atmosphere. Oceans also absorb and release CO₂. (C) An invasive species might outcompete native species, disrupting the food web. If excess nutrients also enter the lake (e.g., from the disruption), algae bloom on the surface, blocking light. When algae die, decomposing bacteria multiply and consume dissolved oxygen (biological oxygen demand increases). Oxygen depletion (hypoxia) kills fish and other aerobic organisms, collapsing the ecosystem — this is eutrophication.',
      hints: [
        'Natural greenhouse effect = good. Enhanced = too much of a good thing.',
        'Follow carbon: atmosphere ↔ biosphere ↔ lithosphere ↔ hydrosphere.',
        'Eutrophication: excess nutrients → algal bloom → decomposition → oxygen depletion.',
      ],
      coinReward: 150,
    },
    questions: [
      {
        id: 'g12-science-3-q1',
        narrative:
          'Warden Gaia shows you a diagram of energy flow in the Citadel\'s rainforest biome. Only about 10% of energy passes from one trophic level to the next.',
        question: 'What happens to the approximately 90% of energy that is not passed to the next trophic level?',
        options: [
          'It is stored as fat in organisms',
          'It is lost as heat through metabolic processes (respiration)',
          'It is recycled back to the producers',
          'It is converted into minerals in the soil',
        ],
        correctIndex: 1,
        clue: {
          title: 'Energy Loss Between Trophic Levels',
          explanation:
            'At each trophic level, organisms use most of the energy they consume for life processes (respiration), losing it as heat. Additional energy is lost in uneaten parts, faeces, and urine. Only about 10% is available to the next level, which limits food chain length.',
          visual: 'diagram',
          cost: 20,
        },
        coinsOnCorrect: 50,
      },
      {
        id: 'g12-science-3-q2',
        narrative:
          'The Citadel\'s atmosphere panel shows rising CO₂ levels. Warden Gaia explains this is caused by excessive burning of fossil fuels within the dome.',
        question: 'Which biogeochemical cycle is most directly disrupted by burning fossil fuels?',
        options: [
          'The water cycle',
          'The nitrogen cycle',
          'The carbon cycle',
          'The phosphorus cycle',
        ],
        correctIndex: 2,
        clue: {
          title: 'Carbon Cycle Disruption',
          explanation:
            'Burning fossil fuels releases carbon that was locked in the lithosphere for millions of years back into the atmosphere as CO₂. This disrupts the carbon cycle by adding carbon faster than natural sinks (photosynthesis, ocean absorption) can remove it, leading to increased atmospheric CO₂.',
          visual: 'diagram',
          cost: 20,
        },
        coinsOnCorrect: 50,
      },
      {
        id: 'g12-science-3-q3',
        narrative:
          'Warden Gaia points to the tundra biome where nitrogen-fixing bacteria in soil nodules are converting atmospheric nitrogen into usable forms.',
        question: 'What is the role of nitrogen-fixing bacteria in the nitrogen cycle?',
        options: [
          'They convert nitrates into nitrogen gas (denitrification)',
          'They convert atmospheric nitrogen (N₂) into ammonia or nitrates that plants can absorb',
          'They decompose dead organisms to release nitrogen',
          'They convert nitrogen into oxygen for respiration',
        ],
        correctIndex: 1,
        clue: {
          title: 'Nitrogen Fixation',
          explanation:
            'Nitrogen-fixing bacteria (e.g., Rhizobium in root nodules of legumes, and free-living Azotobacter) convert atmospheric N₂ into ammonia (NH₃) or ammonium (NH₄⁺), which can then be converted to nitrates by nitrifying bacteria. Plants absorb these as essential nutrients for making amino acids and proteins.',
          visual: 'text',
          cost: 20,
        },
        coinsOnCorrect: 50,
      },
      {
        id: 'g12-science-3-q4',
        narrative:
          'An invasive vine is rapidly spreading through the rainforest biome, outcompeting native plants for sunlight and nutrients.',
        question: 'What ecological term describes the interaction between the invasive vine and native plants competing for the same resources?',
        options: [
          'Mutualism',
          'Interspecific competition',
          'Commensalism',
          'Parasitism',
        ],
        correctIndex: 1,
        clue: {
          title: 'Interspecific Competition',
          explanation:
            'Interspecific competition occurs between individuals of different species competing for the same limited resources (light, water, nutrients, space). The competitive exclusion principle states that two species competing for identical resources cannot coexist indefinitely — one will outcompete the other.',
          visual: 'text',
          cost: 20,
        },
        coinsOnCorrect: 50,
      },
      {
        id: 'g12-science-3-q5',
        narrative:
          'Warden Gaia shows you a graph of a population that grew rapidly, overshot its carrying capacity, then crashed dramatically.',
        question: 'What is the carrying capacity of an ecosystem?',
        options: [
          'The total number of species in the ecosystem',
          'The maximum population size that an environment can sustain indefinitely given available resources',
          'The rate at which a population grows',
          'The minimum population needed to avoid extinction',
        ],
        correctIndex: 1,
        clue: {
          title: 'Carrying Capacity',
          explanation:
            'Carrying capacity (K) is the maximum population size that an environment can sustain indefinitely with its available resources (food, water, space, shelter). When a population exceeds K, resources become scarce, death rate increases, and the population declines. Overshooting K can lead to environmental degradation and population crashes.',
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
