export interface IBGradeContext {
  framework: string;
  unit: string;
  topics: string[];
  ibTopicKey: string;
  priorKnowledge: string;
  sampleProblems?: string[];
}

type IBCurriculumMap = {
  [subject: string]: {
    grades: { [grade: number]: IBGradeContext };
  };
};

export const IB_CURRICULUM: IBCurriculumMap = {
  math: {
    grades: {
      5: {
        framework: 'PYP',
        unit: 'Number & Place Value',
        topics: ['place value up to millions', 'rounding to nearest 10/100/1000', 'introduction to fractions (½, ¼, ⅓)', 'multiplication tables up to 12×12', 'division with remainders'],
        ibTopicKey: 'math-g5-number',
        priorKnowledge: 'Students can count to 10,000 and know basic addition/subtraction.',
        sampleProblems: ['Round 4,728 to the nearest hundred.', 'What is ¾ of 24?', '7 × 8 = ?'],
      },
      6: {
        framework: 'PYP',
        unit: 'Introduction to Algebra — Patterns & Variables',
        topics: ['what is a variable (letter as unknown)', 'writing algebraic expressions (e.g. 3x + 2)', 'substitution into expressions', 'finding the next term in a sequence', 'input-output tables'],
        ibTopicKey: 'math-g6-intro-algebra',
        priorKnowledge: 'Students know multiplication tables and basic fractions.',
        sampleProblems: ['If x = 4, find the value of 3x + 2.', 'Write an expression for "5 more than a number n".', 'Continue the pattern: 2, 5, 8, 11, ___'],
      },
      7: {
        framework: 'MYP Year 1',
        unit: 'Linear Equations & Inequalities',
        topics: ['solving one-step equations (x + 3 = 7)', 'solving two-step equations (2x + 1 = 9)', 'writing equations from word problems', 'graphing on a number line', 'introduction to inequalities (x > 5)'],
        ibTopicKey: 'math-g7-linear-eq',
        priorKnowledge: 'Students can substitute values into algebraic expressions.',
        sampleProblems: ['Solve: 2x + 5 = 13', 'Ahmed has 3 more marbles than twice Fatima\'s marbles. Write an equation if the total is 21.', 'Graph x ≥ 3 on a number line.'],
      },
      8: {
        framework: 'MYP Year 2',
        unit: 'Coordinate Geometry & Transformations',
        topics: ['plotting points on a Cartesian grid (4 quadrants)', 'gradient (slope) of a line: rise over run', 'y-intercept and equation of a line y = mx + c', 'reflection across axes', 'translation using vectors'],
        ibTopicKey: 'math-g8-coordinate-geom',
        priorKnowledge: 'Students can solve two-step linear equations.',
        sampleProblems: ['Find the gradient of the line through (0,2) and (3,8).', 'Write the equation of a line with gradient 2 and y-intercept −1.', 'Reflect the point (3, −4) across the x-axis.'],
      },
      9: {
        framework: 'MYP Year 3',
        unit: 'Statistics & Probability',
        topics: ['mean, median, mode, range from data sets', 'frequency tables and histograms', 'scatter graphs and correlation', 'theoretical probability (sample space)', 'probability of complementary events'],
        ibTopicKey: 'math-g9-statistics',
        priorKnowledge: 'Students can work with fractions and percentages.',
        sampleProblems: ['Find the mean of: 5, 8, 12, 7, 3', 'A bag has 3 red and 7 blue balls. What is P(red)?', 'Describe the correlation shown in a scatter graph.'],
      },
      10: {
        framework: 'MYP Year 4',
        unit: 'Quadratic Functions',
        topics: ['expanding brackets: (x+2)(x+3)', 'factorising quadratics: x² + 5x + 6', 'solving quadratic equations by factorisation', 'the quadratic formula: x = (−b ± √(b²−4ac)) / 2a', 'vertex form and the discriminant'],
        ibTopicKey: 'math-g10-quadratics',
        priorKnowledge: 'Students can graph linear functions and expand single brackets.',
        sampleProblems: ['Expand: (x + 3)(x − 2)', 'Solve: x² − 5x + 6 = 0 by factorising', 'Find the discriminant of 2x² − 4x + 1'],
      },
      11: {
        framework: 'DP Year 1',
        unit: 'Functions, Sequences & Series (SL/HL)',
        topics: ['domain and range of functions', 'inverse functions', 'arithmetic sequences: u_n = u_1 + (n−1)d', 'geometric sequences and series', 'binomial theorem (SL)'],
        ibTopicKey: 'math-g11-functions-sequences',
        priorKnowledge: 'Students can solve quadratic equations and work with algebraic fractions.',
        sampleProblems: ['Find the inverse of f(x) = 3x − 2.', 'The 3rd term of an arithmetic sequence is 11 and the 7th term is 23. Find the first term.', 'Expand (x + 2)⁴ using the binomial theorem.'],
      },
      12: {
        framework: 'DP Year 2',
        unit: 'Calculus — Differentiation & Integration (SL)',
        topics: ['limits and derivatives from first principles', 'power rule: d/dx(xⁿ) = nxⁿ⁻¹', 'chain rule, product rule', 'finding stationary points and nature', 'integration as reverse differentiation'],
        ibTopicKey: 'math-g12-calculus',
        priorKnowledge: 'Students understand functions, composite functions, and series.',
        sampleProblems: ['Differentiate f(x) = 3x⁴ − 2x² + 5.', 'Find the stationary points of y = x³ − 6x.', 'Integrate: ∫(2x + 3)dx'],
      },
    },
  },

  science: {
    grades: {
      5:  { framework: 'PYP', unit: 'Living Things & Their Habitats', topics: ['food chains and food webs', 'producers consumers and decomposers', 'adaptation in animals and plants', 'photosynthesis basics'], ibTopicKey: 'sci-g5-ecosystems', priorKnowledge: 'Students know basic plant and animal groups.' },
      6:  { framework: 'PYP', unit: 'Forces & Motion', topics: ['contact and non-contact forces', 'gravity and weight vs mass', 'friction and air resistance', 'simple machines (lever, pulley)'], ibTopicKey: 'sci-g6-forces', priorKnowledge: 'Students understand push and pull forces.' },
      7:  { framework: 'MYP Year 1', unit: 'Cells & Body Systems', topics: ['cell structure: nucleus, membrane, cytoplasm', 'plant vs animal cells', 'diffusion and osmosis', 'digestive and circulatory systems'], ibTopicKey: 'sci-g7-cells', priorKnowledge: 'Students know living organisms are made of cells.' },
      8:  { framework: 'MYP Year 2', unit: 'Chemical Reactions & The Periodic Table', topics: ['elements compounds and mixtures', 'the periodic table: groups and periods', 'chemical vs physical changes', 'acids and bases: pH scale'], ibTopicKey: 'sci-g8-chemistry', priorKnowledge: 'Students understand states of matter.' },
      9:  { framework: 'MYP Year 3', unit: 'Genetics & Evolution', topics: ['DNA structure and function', 'dominant and recessive alleles', 'Punnett squares', 'natural selection and adaptation', 'evidence for evolution'], ibTopicKey: 'sci-g9-genetics', priorKnowledge: 'Students know cell structure and reproduction.' },
      10: { framework: 'MYP Year 4', unit: 'Energy & Electromagnetism', topics: ['energy types and conservation', 'Ohm\'s Law: V = IR', 'series vs parallel circuits', 'electromagnetic spectrum', 'renewable energy sources'], ibTopicKey: 'sci-g10-energy', priorKnowledge: 'Students can calculate speed and understand waves.' },
      11: { framework: 'DP Year 1', unit: 'Atomic Physics & Thermodynamics', topics: ['Bohr model and atomic orbitals', 'radioactivity: alpha beta gamma', 'thermodynamics: entropy and enthalpy', 'Le Chatelier\'s principle'], ibTopicKey: 'sci-g11-atomic', priorKnowledge: 'Students understand periodic table and chemical bonding.' },
      12: { framework: 'DP Year 2', unit: 'Wave Optics & Quantum Physics', topics: ['wave-particle duality', 'photoelectric effect', 'diffraction and interference', 'Heisenberg uncertainty principle'], ibTopicKey: 'sci-g12-quantum', priorKnowledge: 'Students understand classical mechanics and electromagnetism.' },
    },
  },

  english: {
    grades: {
      5:  { framework: 'PYP', unit: 'Narrative Writing', topics: ['story structure: beginning, middle, end', 'character description using adjectives', 'dialogue punctuation', 'using adverbs for effect'], ibTopicKey: 'eng-g5-narrative', priorKnowledge: 'Students can write simple sentences with punctuation.' },
      6:  { framework: 'PYP', unit: 'Persuasive Writing', topics: ['thesis statement', 'point-evidence-explanation structure', 'emotive language and rhetorical questions', 'concluding arguments'], ibTopicKey: 'eng-g6-persuasive', priorKnowledge: 'Students can write paragraphs with a main idea.' },
      7:  { framework: 'MYP Year 1', unit: 'Text Analysis: Short Stories', topics: ['identifying themes in fiction', 'character motivation and conflict', 'simile, metaphor, personification', 'author\'s tone and purpose'], ibTopicKey: 'eng-g7-analysis', priorKnowledge: 'Students can identify main ideas and supporting details.' },
      8:  { framework: 'MYP Year 2', unit: 'Poetry & Language Devices', topics: ['rhythm, rhyme, and metre', 'imagery and symbolism', 'enjambment and caesura', 'comparing two poems'], ibTopicKey: 'eng-g8-poetry', priorKnowledge: 'Students can analyse character and theme in fiction.' },
      9:  { framework: 'MYP Year 3', unit: 'Non-Fiction & Media Literacy', topics: ['evaluating source reliability', 'bias and perspective in news media', 'formal vs informal register', 'writing a discursive essay'], ibTopicKey: 'eng-g9-nonfiction', priorKnowledge: 'Students can write structured analytical paragraphs.' },
      10: { framework: 'MYP Year 4', unit: 'Shakespeare & Classical Drama', topics: ['Shakespearean language and context', 'dramatic irony and soliloquy', 'themes of power and ambition', 'comparative literary analysis'], ibTopicKey: 'eng-g10-shakespeare', priorKnowledge: 'Students can analyse language, structure, and form.' },
      11: { framework: 'DP Year 1', unit: 'Language & Literature (Paper 1)', topics: ['unseen text commentary', 'global issues in literature', 'stylistic analysis: guiding question framework', 'World Literature overview'], ibTopicKey: 'eng-g11-lit-paper1', priorKnowledge: 'Students can write comparative analytical essays.' },
      12: { framework: 'DP Year 2', unit: 'Individual Oral & Written Tasks (DP)', topics: ['Higher Level essay structure', 'individual oral: extracts and global issue', 'intertextuality between texts', 'HL extension: translating culture in literature'], ibTopicKey: 'eng-g12-oral-hle', priorKnowledge: 'Students have studied at least 4 literary works from different cultures.' },
    },
  },

  'social-skills': {
    grades: {
      5:  { framework: 'PYP', unit: 'Empathy & Active Listening', topics: ['what empathy means', 'body language cues', 'how to listen without interrupting', 'taking turns in conversation'], ibTopicKey: 'ss-g5-empathy', priorKnowledge: 'Students understand basic emotions.' },
      7:  { framework: 'MYP Year 1', unit: 'Conflict Resolution', topics: ['recognising triggers', 'assertive vs aggressive communication', 'win-win problem solving', 'apology and repair'], ibTopicKey: 'ss-g7-conflict', priorKnowledge: 'Students can identify their own emotions.' },
      10: { framework: 'MYP Year 4', unit: 'Teamwork & Leadership', topics: ['roles in a team', 'giving constructive feedback', 'inclusive decision making', 'managing group disagreement'], ibTopicKey: 'ss-g10-leadership', priorKnowledge: 'Students can communicate assertively.' },
    },
  },

  'emotional-regulation': {
    grades: {
      5:  { framework: 'PYP', unit: 'Identifying Emotions', topics: ['naming 8 core emotions', 'body signals of each emotion', 'emotion vs reaction', 'calming strategies: STOP technique'], ibTopicKey: 'er-g5-identify', priorKnowledge: 'Students know happy, sad, angry.' },
      7:  { framework: 'MYP Year 1', unit: 'Managing Big Feelings', topics: ['emotional intensity scale (1-10)', 'cognitive reframing', 'grounding techniques (5-4-3-2-1)', 'self-compassion vs self-criticism'], ibTopicKey: 'er-g7-manage', priorKnowledge: 'Students can name their emotions.' },
      10: { framework: 'MYP Year 4', unit: 'Stress, Anxiety & Mindfulness', topics: ['fight-flight-freeze explained', 'mindfulness meditation basics', 'anxiety vs healthy stress', 'sleep and exercise as regulation tools'], ibTopicKey: 'er-g10-mindfulness', priorKnowledge: 'Students understand triggers and calming strategies.' },
    },
  },
};

export function getIBContext(subject: string, grade: number): IBGradeContext | null {
  const subjectData = IB_CURRICULUM[subject];
  if (!subjectData) return null;
  const grades = subjectData.grades;
  // Exact match first
  if (grades[grade]) return grades[grade];
  // Find nearest grade
  const available = Object.keys(grades).map(Number).sort((a, b) => a - b);
  const nearest = available.reduce((prev, curr) =>
    Math.abs(curr - grade) < Math.abs(prev - grade) ? curr : prev
  );
  return grades[nearest] ?? null;
}
