// IB Curriculum Framework Engine - Comprehensive G1-G12
// Based on publicly available IB subject guides and curriculum standards

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
      1: {
        framework: 'PYP',
        unit: 'Number Sense & Counting',
        topics: ['counting 1-100', 'reading and writing numerals', 'comparing numbers', 'place value tens and ones', 'basic addition within 10'],
        ibTopicKey: 'math-g1-numbers',
        priorKnowledge: 'Students can count to 20.',
        sampleProblems: ['Count from 1 to 100.', 'Which is bigger: 45 or 54?', '3 + 2 = ?'],
      },
      2: {
        framework: 'PYP',
        unit: 'Addition, Subtraction & Money',
        topics: ['addition and subtraction within 100', 'skip counting by 5s 10s 100s', 'place value hundreds', 'identifying coins and counting money', 'telling time to half-hour'],
        ibTopicKey: 'math-g2-operations',
        priorKnowledge: 'Students can add and subtract within 20.',
        sampleProblems: ['47 + 25 = ?', 'Count by 10s from 10 to 100.', 'How much is 2 quarters and 3 dimes?'],
      },
      3: {
        framework: 'PYP',
        unit: 'Multiplication, Division & Fractions',
        topics: ['multiplication as equal groups', 'division as sharing equally', 'multiplication tables to 10', 'introduction to fractions', 'area and perimeter of rectangles'],
        ibTopicKey: 'math-g3-multiplication',
        priorKnowledge: 'Students can add and subtract within 100.',
        sampleProblems: ['4 × 6 = ?', 'Share 12 cookies among 3 friends.', 'What fraction is shaded?'],
      },
      4: {
        framework: 'PYP',
        unit: 'Multi-Digit Operations & Geometry',
        topics: ['multi-digit multiplication', 'long division with remainders', 'fractions with like denominators', 'angles and lines of symmetry', 'decimals introduction'],
        ibTopicKey: 'math-g4-multi-digit',
        priorKnowledge: 'Students know multiplication tables and basic fractions.',
        sampleProblems: ['23 × 14 = ?', '156 ÷ 6 = ?', 'Add: 2/5 + 1/5'],
      },
      5: {
        framework: 'PYP',
        unit: 'Decimals, Fractions & Volume',
        topics: ['decimal operations to hundredths', 'fraction operations with unlike denominators', 'volume of rectangular prisms', 'coordinate plane introduction', 'order of operations'],
        ibTopicKey: 'math-g5-decimals',
        priorKnowledge: 'Students can multiply and divide multi-digit numbers.',
        sampleProblems: ['3.45 + 2.7 = ?', '1/3 + 1/4 = ?', 'Find the volume of a box 5 × 3 × 2.'],
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
      1:  { framework: 'PYP', unit: 'Living Things Around Us', topics: ['basic needs of plants and animals', 'life cycle of a plant', 'observing changes in living things', 'sorting animals by features'], ibTopicKey: 'sci-g1-living', priorKnowledge: 'Students can name common animals and plants.', sampleProblems: ['What do plants need to grow?', 'Draw the life cycle of a butterfly.'] },
      2:  { framework: 'PYP', unit: 'Habitats & Communities', topics: ['different types of habitats', 'how animals are adapted', 'simple food chains', 'human impact on habitats'], ibTopicKey: 'sci-g2-habitats', priorKnowledge: 'Students know basic needs of living things.', sampleProblems: ['Why do polar bears have thick fur?', 'Draw a food chain with 3 links.'] },
      3:  { framework: 'PYP', unit: 'Forces & Motion / Life Cycles', topics: ['pushes and pulls as forces', 'how forces affect motion', 'friction and its effects', 'life cycles of plants and animals'], ibTopicKey: 'sci-g3-forces', priorKnowledge: 'Students understand habitats and adaptations.', sampleProblems: ['What force slows down a rolling ball?', 'Compare the life cycle of a frog and a butterfly.'] },
      4:  { framework: 'PYP', unit: 'Energy & Earth Processes', topics: ['forms of energy: light sound heat electrical', 'energy transfer and transformation', 'rock types: igneous sedimentary metamorphic', 'weathering erosion and the rock cycle'], ibTopicKey: 'sci-g4-energy', priorKnowledge: 'Students understand forces and motion.', sampleProblems: ['How does sound energy travel?', 'How is sedimentary rock formed?'] },
      5:  { framework: 'PYP', unit: 'Matter & Human Body Systems', topics: ['three states of matter', 'physical and chemical changes', 'mixtures and solutions', 'major body systems and their functions'], ibTopicKey: 'sci-g5-matter', priorKnowledge: 'Students know energy forms and rock types.', sampleProblems: ['Is melting ice a physical or chemical change?', 'What does the circulatory system do?'] },
      6:  { framework: 'PYP', unit: 'Forces & Motion', topics: ['contact and non-contact forces', 'gravity and weight vs mass', 'friction and air resistance', 'simple machines (lever, pulley)'], ibTopicKey: 'sci-g6-forces', priorKnowledge: 'Students understand push and pull forces.', sampleProblems: ['What is the difference between mass and weight?', 'How does a pulley make work easier?'] },
      7:  { framework: 'MYP Year 1', unit: 'Cells & Body Systems', topics: ['cell structure: nucleus, membrane, cytoplasm', 'plant vs animal cells', 'diffusion and osmosis', 'digestive and circulatory systems'], ibTopicKey: 'sci-g7-cells', priorKnowledge: 'Students know living organisms are made of cells.', sampleProblems: ['Label the parts of a plant cell.', 'Explain how diffusion works.'] },
      8:  { framework: 'MYP Year 2', unit: 'Chemical Reactions & The Periodic Table', topics: ['elements compounds and mixtures', 'the periodic table: groups and periods', 'chemical vs physical changes', 'acids and bases: pH scale'], ibTopicKey: 'sci-g8-chemistry', priorKnowledge: 'Students understand states of matter.', sampleProblems: ['Is salt water an element compound or mixture?', 'What is the pH of a strong acid?'] },
      9:  { framework: 'MYP Year 3', unit: 'Genetics & Evolution', topics: ['DNA structure and function', 'dominant and recessive alleles', 'Punnett squares', 'natural selection and adaptation', 'evidence for evolution'], ibTopicKey: 'sci-g9-genetics', priorKnowledge: 'Students know cell structure and reproduction.', sampleProblems: ['Complete a Punnett square for Bb × Bb.', 'What evidence supports evolution?'] },
      10: { framework: 'MYP Year 4', unit: 'Energy & Electromagnetism', topics: ['energy types and conservation', 'Ohm\'s Law: V = IR', 'series vs parallel circuits', 'electromagnetic spectrum', 'renewable energy sources'], ibTopicKey: 'sci-g10-energy', priorKnowledge: 'Students can calculate speed and understand waves.', sampleProblems: ['Calculate voltage if I = 2A and R = 6Ω.', 'Compare series and parallel circuits.'] },
      11: { framework: 'DP Year 1', unit: 'Atomic Physics & Thermodynamics', topics: ['Bohr model and atomic orbitals', 'radioactivity: alpha beta gamma', 'thermodynamics: entropy and enthalpy', 'Le Chatelier\'s principle'], ibTopicKey: 'sci-g11-atomic', priorKnowledge: 'Students understand periodic table and chemical bonding.', sampleProblems: ['Describe the Bohr model of the atom.', 'What happens to equilibrium when temperature increases?'] },
      12: { framework: 'DP Year 2', unit: 'Wave Optics & Quantum Physics', topics: ['wave-particle duality', 'photoelectric effect', 'diffraction and interference', 'Heisenberg uncertainty principle'], ibTopicKey: 'sci-g12-quantum', priorKnowledge: 'Students understand classical mechanics and electromagnetism.', sampleProblems: ['Explain the photoelectric effect.', 'What does the uncertainty principle state?'] },
    },
  },

  english: {
    grades: {
      1:  { framework: 'PYP', unit: 'Phonics & Early Reading', topics: ['letter-sound relationships', 'blending sounds to read words', 'high-frequency sight words', 'retelling stories with details'], ibTopicKey: 'eng-g1-phonics', priorKnowledge: 'Students know the alphabet.', sampleProblems: ['Sound out the word: c-a-t.', 'What sound does "sh" make?'] },
      2:  { framework: 'PYP', unit: 'Reading Comprehension', topics: ['reading with fluency', 'using context clues', 'story elements: characters setting plot', 'comparing fiction and non-fiction'], ibTopicKey: 'eng-g2-reading', priorKnowledge: 'Students can decode simple words.', sampleProblems: ['Who is the main character?', 'What is the problem in the story?'] },
      3:  { framework: 'PYP', unit: 'Paragraph Writing', topics: ['topic sentences', 'supporting details', 'transition words', 'revising and editing'], ibTopicKey: 'eng-g3-paragraphs', priorKnowledge: 'Students can write complete sentences.', sampleProblems: ['Write a topic sentence about your favourite animal.', 'Add three supporting details.'] },
      4:  { framework: 'PYP', unit: 'Literary Genres', topics: ['characteristics of different genres', 'theme and message in stories', 'figurative language: simile metaphor personification', 'writing in different genres'], ibTopicKey: 'eng-g4-genres', priorKnowledge: 'Students can write organized paragraphs.', sampleProblems: ['Identify the simile: "Her smile was like sunshine."', 'What is the theme of the story?'] },
      5:  { framework: 'PYP', unit: 'Research & Report Writing', topics: ['formulating research questions', 'using multiple sources', 'taking notes and citing sources', 'writing multi-paragraph reports'], ibTopicKey: 'eng-g5-research', priorKnowledge: 'Students can write in different genres.', sampleProblems: ['Write a research question about dolphins.', 'Cite your source using the author\'s name.'] },
      6:  { framework: 'PYP', unit: 'Persuasive Writing', topics: ['thesis statement', 'point-evidence-explanation structure', 'emotive language and rhetorical questions', 'concluding arguments'], ibTopicKey: 'eng-g6-persuasive', priorKnowledge: 'Students can write paragraphs with a main idea.', sampleProblems: ['Write a thesis statement for "School uniforms should be mandatory."', 'Give evidence to support your argument.'] },
      7:  { framework: 'MYP Year 1', unit: 'Text Analysis: Short Stories', topics: ['identifying themes in fiction', 'character motivation and conflict', 'simile, metaphor, personification', 'author\'s tone and purpose'], ibTopicKey: 'eng-g7-analysis', priorKnowledge: 'Students can identify main ideas and supporting details.', sampleProblems: ['What is the theme of the story?', 'How does the author create tension?'] },
      8:  { framework: 'MYP Year 2', unit: 'Poetry & Language Devices', topics: ['rhythm, rhyme, and metre', 'imagery and symbolism', 'enjambment and caesura', 'comparing two poems'], ibTopicKey: 'eng-g8-poetry', priorKnowledge: 'Students can analyse character and theme in fiction.', sampleProblems: ['What imagery does the poet use?', 'Compare the tone of two poems.'] },
      9:  { framework: 'MYP Year 3', unit: 'Non-Fiction & Media Literacy', topics: ['evaluating source reliability', 'bias and perspective in news media', 'formal vs informal register', 'writing a discursive essay'], ibTopicKey: 'eng-g9-nonfiction', priorKnowledge: 'Students can write structured analytical paragraphs.', sampleProblems: ['Is this source reliable? Why?', 'Identify bias in this news article.'] },
      10: { framework: 'MYP Year 4', unit: 'Shakespeare & Classical Drama', topics: ['Shakespearean language and context', 'dramatic irony and soliloquy', 'themes of power and ambition', 'comparative literary analysis'], ibTopicKey: 'eng-g10-shakespeare', priorKnowledge: 'Students can analyse language, structure, and form.', sampleProblems: ['What is a soliloquy?', 'How does Shakespeare show Macbeth\'s ambition?'] },
      11: { framework: 'DP Year 1', unit: 'Language & Literature (Paper 1)', topics: ['unseen text commentary', 'global issues in literature', 'stylistic analysis: guiding question framework', 'World Literature overview'], ibTopicKey: 'eng-g11-lit-paper1', priorKnowledge: 'Students can write comparative analytical essays.', sampleProblems: ['Analyse the author\'s use of imagery in this extract.', 'How does this text explore a global issue?'] },
      12: { framework: 'DP Year 2', unit: 'Individual Oral & Written Tasks (DP)', topics: ['Higher Level essay structure', 'individual oral: extracts and global issue', 'intertextuality between texts', 'HL extension: translating culture in literature'], ibTopicKey: 'eng-g12-oral-hle', priorKnowledge: 'Students have studied at least 4 literary works from different cultures.', sampleProblems: ['Prepare your individual oral extract.', 'Compare how two texts explore the same global issue.'] },
    },
  },

  'social-studies': {
    grades: {
      1:  { framework: 'PYP', unit: 'My Family and Community', topics: ['family roles', 'community helpers', 'rules and responsibilities', 'how people help each other'], ibTopicKey: 'ss-g1-community', priorKnowledge: 'Students know their family members.', sampleProblems: ['Name three community helpers.', 'Why do we have rules?'] },
      2:  { framework: 'PYP', unit: 'Maps, Globes & Our World', topics: ['reading simple maps', 'continents and oceans', 'cardinal directions', 'locating places on a map'], ibTopicKey: 'ss-g2-maps', priorKnowledge: 'Students understand their community.', sampleProblems: ['Name all 7 continents.', 'Which direction is the sun in the morning?'] },
      3:  { framework: 'PYP', unit: 'Traditions & Cultures', topics: ['cultural traditions from different regions', 'celebrations across cultures', 'cultural diversity', 'respecting different cultures'], ibTopicKey: 'ss-g3-cultures', priorKnowledge: 'Students can read maps and locate places.', sampleProblems: ['How do people celebrate New Year in different countries?', 'Why is cultural diversity important?'] },
      4:  { framework: 'PYP', unit: 'Government & Citizenship', topics: ['purpose of government', 'rights and responsibilities', 'types of government', 'role of laws in society'], ibTopicKey: 'ss-g4-government', priorKnowledge: 'Students understand communities and cultures.', sampleProblems: ['What is the purpose of laws?', 'Name a right and a responsibility of citizens.'] },
      5:  { framework: 'PYP', unit: 'Goods, Services & Economics', topics: ['goods vs services', 'supply and demand', 'entrepreneurship', 'trade connecting communities'], ibTopicKey: 'ss-g5-economics', priorKnowledge: 'Students understand government and citizenship.', sampleProblems: ['Is a haircut a good or a service?', 'What happens when demand increases?'] },
      6:  { framework: 'PYP', unit: 'Ancient Civilizations', topics: ['Mesopotamia Egypt Greece Rome', 'governance systems', 'ancient innovations', 'legacy of ancient civilizations'], ibTopicKey: 'ss-g6-ancient', priorKnowledge: 'Students understand basic economics and government.', sampleProblems: ['What did the Ancient Egyptians build?', 'How did Greek democracy influence modern government?'] },
      7:  { framework: 'MYP Year 1', unit: 'Medieval & Renaissance World', topics: ['feudal systems', 'the Renaissance', 'religion in medieval life', 'the printing press'], ibTopicKey: 'ss-g7-medieval', priorKnowledge: 'Students know about ancient civilizations.', sampleProblems: ['What was the feudal system?', 'How did the Renaissance change Europe?'] },
      8:  { framework: 'MYP Year 2', unit: 'Revolutions & the Modern World', topics: ['American and French Revolutions', 'democratic ideals', 'industrialization', 'connecting history to modern issues'], ibTopicKey: 'ss-g8-revolution', priorKnowledge: 'Students understand medieval and Renaissance history.', sampleProblems: ['What caused the French Revolution?', 'How did industrialization change society?'] },
      9:  { framework: 'MYP Year 3', unit: 'The 20th Century: Wars & Global Change', topics: ['World Wars causes and consequences', 'the Cold War', 'decolonization movements', 'international organizations'], ibTopicKey: 'ss-g9-20th-century', priorKnowledge: 'Students understand revolutions and modern history.', sampleProblems: ['What caused World War I?', 'What was the Cold War?'] },
      10: { framework: 'MYP Year 4', unit: 'Globalization & Contemporary Issues', topics: ['impacts of globalization', 'climate change responses', 'migration patterns', 'solutions to global challenges'], ibTopicKey: 'ss-g10-global', priorKnowledge: 'Students understand 20th century history.', sampleProblems: ['How has globalization changed the world?', 'What are the causes of migration?'] },
      11: { framework: 'DP Year 1', unit: 'Microeconomics & Market Systems', topics: ['supply and demand models', 'market structures', 'market failures and externalities', 'government intervention policies'], ibTopicKey: 'ss-g11-economics', priorKnowledge: 'Students understand globalization and contemporary issues.', sampleProblems: ['Draw a supply and demand graph.', 'What is a market failure?'] },
      12: { framework: 'DP Year 2', unit: 'Political Systems & International Relations', topics: ['democratic vs authoritarian systems', 'international organizations', 'theories of international relations', 'responses to global challenges'], ibTopicKey: 'ss-g12-politics', priorKnowledge: 'Students understand microeconomics.', sampleProblems: ['Compare two political systems.', 'How does the UN address global challenges?'] },
    },
  },

  'social-skills': {
    grades: {
      1:  { framework: 'PYP', unit: 'Understanding My Feelings', topics: ['identifying basic emotions', 'naming feelings', 'healthy expression of emotions', 'recognizing emotions in others'], ibTopicKey: 'ss-g1-emotions', priorKnowledge: 'Students can name happy and sad.', sampleProblems: ['How does your body feel when you are angry?', 'What can you do when you feel sad?'] },
      2:  { framework: 'PYP', unit: 'Making and Keeping Friends', topics: ['sharing and taking turns', 'active listening', 'resolving simple conflicts', 'empathy and kindness'], ibTopicKey: 'ss-g2-friendship', priorKnowledge: 'Students can identify basic emotions.', sampleProblems: ['What does active listening look like?', 'How can you show kindness?'] },
      3:  { framework: 'PYP', unit: 'Working Together as a Team', topics: ['cooperation in groups', 'different team roles', 'valuing different opinions', 'group problem-solving'], ibTopicKey: 'ss-g3-teamwork', priorKnowledge: 'Students can make and keep friends.', sampleProblems: ['What makes a good team member?', 'How do you handle disagreement in a group?'] },
      4:  { framework: 'PYP', unit: 'Standing Up to Bullying', topics: ['types of bullying', 'assertive communication', 'being an upstander', 'seeking help'], ibTopicKey: 'ss-g4-bullying', priorKnowledge: 'Students understand teamwork.', sampleProblems: ['What is the difference between teasing and bullying?', 'What would you do if you saw someone being bullied?'] },
      5:  { framework: 'PYP', unit: 'Digital Citizenship', topics: ['digital footprint and online privacy', 'cyberbullying recognition and response', 'responsible technology use', 'screen time balance'], ibTopicKey: 'ss-g5-digital', priorKnowledge: 'Students understand bullying and assertiveness.', sampleProblems: ['What is a digital footprint?', 'What should you do if someone is mean to you online?'] },
      6:  { framework: 'PYP', unit: 'Navigating Middle School Transitions', topics: ['organizational systems', 'time management', 'self-advocacy', 'managing stress'], ibTopicKey: 'ss-g6-transition', priorKnowledge: 'Students understand digital citizenship.', sampleProblems: ['How will you organize your homework?', 'What do you do when you feel overwhelmed?'] },
      7:  { framework: 'MYP Year 1', unit: 'Conflict Resolution & Mediation', topics: ['conflict styles', 'active listening and empathy', 'mediation techniques', 'real-world conflict resolution'], ibTopicKey: 'ss-g7-conflict', priorKnowledge: 'Students can manage middle school transitions.', sampleProblems: ['What is your conflict style?', 'Practice active listening with a partner.'] },
      8:  { framework: 'MYP Year 2', unit: 'Identity & Self-Awareness', topics: ['personal identity and values', 'strengths and growth areas', 'positive self-concept', 'peer pressure influence'], ibTopicKey: 'ss-g8-identity', priorKnowledge: 'Students can resolve conflicts.', sampleProblems: ['What are your top 3 values?', 'How does peer pressure affect decisions?'] },
      9:  { framework: 'MYP Year 3', unit: 'Leadership & Community Impact', topics: ['leadership styles', 'project planning', 'public speaking', 'community service project'], ibTopicKey: 'ss-g9-leadership', priorKnowledge: 'Students understand their identity and strengths.', sampleProblems: ['What leadership style suits you?', 'Design a community service project.'] },
      10: { framework: 'MYP Year 4', unit: 'Career Exploration & Future Planning', topics: ['career options aligned with interests', 'SMART goals', 'interview and networking skills', 'personal development plan'], ibTopicKey: 'ss-g10-future', priorKnowledge: 'Students have leadership experience.', sampleProblems: ['What career interests you and why?', 'Write a SMART goal for next year.'] },
      11: { framework: 'DP Year 1', unit: 'Mental Health & Wellbeing in DP', topics: ['recognizing stress and burnout', 'personalized coping strategies', 'mindfulness and self-care', 'building support networks'], ibTopicKey: 'ss-g11-wellbeing', priorKnowledge: 'Students have future planning skills.', sampleProblems: ['What are your signs of stress?', 'Create a self-care plan.'] },
      12: { framework: 'DP Year 2', unit: 'University & Life Beyond School', topics: ['university applications', 'independent living skills', 'financial literacy', 'personal transition plan'], ibTopicKey: 'ss-g12-transition', priorKnowledge: 'Students manage DP wellbeing.', sampleProblems: ['What universities interest you?', 'Create a budget for living independently.'] },
    },
  },

  'emotional-regulation': {
    grades: {
      1:  { framework: 'PYP', unit: 'Identifying Emotions', topics: ['naming 8 core emotions', 'body signals of each emotion', 'emotion vs reaction', 'calming strategies: STOP technique'], ibTopicKey: 'er-g1-identify', priorKnowledge: 'Students know happy sad angry.', sampleProblems: ['Where do you feel anger in your body?', 'Practice the STOP technique.'] },
      2:  { framework: 'PYP', unit: 'Calm Down Strategies', topics: ['deep breathing exercises', 'counting to 10', 'safe space visualization', 'using words for feelings'], ibTopicKey: 'er-g2-calm', priorKnowledge: 'Students can name core emotions.', sampleProblems: ['Practice 4-7-8 breathing.', 'Draw your safe space.'] },
      3:  { framework: 'PYP', unit: 'Empathy & Perspective Taking', topics: ['walking in someone else\'s shoes', 'reading facial expressions', 'kind words and actions', 'helping others feel better'], ibTopicKey: 'er-g3-empathy', priorKnowledge: 'Students can use calm down strategies.', sampleProblems: ['How would you feel if...?', 'What could you say to help a sad friend?'] },
      4:  { framework: 'PYP', unit: 'Self-Regulation & Impulse Control', topics: ['thinking before acting', 'delaying gratification', 'managing frustration', 'positive self-talk'], ibTopicKey: 'er-g4-regulation', priorKnowledge: 'Students understand empathy.', sampleProblems: ['What can you say to yourself when frustrated?', 'Practice waiting 10 seconds before responding.'] },
      5:  { framework: 'PYP', unit: 'Stress Management & Resilience', topics: ['identifying stressors', 'healthy vs unhealthy coping', 'growth mindset', 'bouncing back from setbacks'], ibTopicKey: 'er-g5-resilience', priorKnowledge: 'Students can regulate impulses.', sampleProblems: ['List 3 healthy coping strategies.', 'What does "yet" mean in a growth mindset?'] },
      7:  { framework: 'MYP Year 1', unit: 'Managing Big Feelings', topics: ['emotional intensity scale (1-10)', 'cognitive reframing', 'grounding techniques (5-4-3-2-1)', 'self-compassion vs self-criticism'], ibTopicKey: 'er-g7-manage', priorKnowledge: 'Students can name their emotions.', sampleProblems: ['Rate your current emotion 1-10.', 'Reframe: "I can\'t do this" → ?'] },
      10: { framework: 'MYP Year 4', unit: 'Stress, Anxiety & Mindfulness', topics: ['fight-flight-freeze explained', 'mindfulness meditation basics', 'anxiety vs healthy stress', 'sleep and exercise as regulation tools'], ibTopicKey: 'er-g10-mindfulness', priorKnowledge: 'Students understand triggers and calming strategies.', sampleProblems: ['What is your fight-flight-freeze response?', 'Practice a 3-minute mindfulness exercise.'] },
      12: { framework: 'DP Year 2', unit: 'Advanced Wellbeing & Life Transitions', topics: ['managing exam stress', 'imposter syndrome', 'building long-term resilience', 'transition anxiety and coping'], ibTopicKey: 'er-g12-advanced', priorKnowledge: 'Students practice mindfulness and stress management.', sampleProblems: ['What is your exam stress plan?', 'How do you handle imposter syndrome?'] },
    },
  },
};

export function getIBContext(subject: string, grade: number): IBGradeContext | null {
  const subjectData = IB_CURRICULUM[subject];
  if (!subjectData) return null;
  const grades = subjectData.grades;
  if (grades[grade]) return grades[grade];
  const available = Object.keys(grades).map(Number).sort((a, b) => a - b);
  const nearest = available.reduce((prev, curr) =>
    Math.abs(curr - grade) < Math.abs(prev - grade) ? curr : prev
  );
  return grades[nearest] ?? null;
}

export function getAllSubjects(): string[] {
  return Object.keys(IB_CURRICULUM);
}

export function getAvailableGrades(subject: string): number[] {
  const subjectData = IB_CURRICULUM[subject];
  if (!subjectData) return [];
  return Object.keys(subjectData.grades).map(Number).sort((a, b) => a - b);
}

export function getTopicsForSubjectAndGrade(subject: string, grade: number): string[] {
  const context = getIBContext(subject, grade);
  return context?.topics || [];
}
