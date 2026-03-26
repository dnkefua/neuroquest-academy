import type { CurriculumQuest, CurriculumSubject } from '@/types';

export const SOCIAL_QUESTS: CurriculumQuest[] = [
  // ==================== PYP — Grades 1-5 ====================
  {
    id: 'g1-social',
    grade: 1,
    programme: 'PYP',
    subject: 'social' as CurriculumSubject,
    title: 'My Family & Community',
    realmName: 'Village of Belonging',
    narrativeWorld: 'A cozy village where young explorers learn about families, homes, and the people who help their community.',
    characterTeacher: 'Mayor Luna',
    teacherEmoji: '👩‍💼',
    theme: 'Family roles, community helpers, and belonging',
    questions: [
      {
        id: 'g1-s-1',
        spirit: 'Helper Spirit',
        spiritEmoji: '🤝',
        spiritColor: '#22C55E',
        narrative: 'Mayor Luna shows you around the Village of Belonging. "Every person in our village has an important job!"',
        question: 'Who helps keep our community safe by directing traffic and helping people cross the street?',
        options: ['Teacher', 'Police Officer', 'Baker', 'Doctor'],
        correctIndex: 1,
        reward: 'Community Helper Badge',
      },
      {
        id: 'g1-s-2',
        spirit: 'Family Spirit',
        spiritEmoji: '👨‍👩‍👧',
        spiritColor: '#F97316',
        narrative: 'At the Family Tree House, you see many different kinds of families.',
        question: 'What do we call the people who love us, care for us, and live with us?',
        options: ['Neighbors', 'Family', 'Teachers', 'Strangers'],
        correctIndex: 1,
        reward: 'Family Love Heart',
      },
      {
        id: 'g1-s-3',
        spirit: 'Home Spirit',
        spiritEmoji: '🏠',
        spiritColor: '#8B5CF6',
        narrative: 'You visit the Home Gallery, where different homes from around the world are displayed.',
        question: 'What do all homes provide for the people who live in them?',
        options: ['Video games', 'Shelter and safety', 'Movies', 'Ice cream'],
        correctIndex: 1,
        reward: 'Home Builder Star',
      },
      {
        id: 'g1-s-4',
        spirit: 'Community Spirit',
        spiritEmoji: '🏘️',
        spiritColor: '#0EA5E9',
        narrative: 'The Community Circle gathers to discuss how everyone works together.',
        question: 'What makes a community a good place to live?',
        options: ['No people at all', 'People helping each other', 'Only tall buildings', 'Lots of cars'],
        correctIndex: 1,
        reward: 'Community Hero Medal',
      },
      {
        id: 'g1-s-5',
        spirit: 'Tradition Spirit',
        spiritEmoji: '🎉',
        spiritColor: '#EC4899',
        narrative: 'At the Festival Grounds, you see celebrations from many cultures.',
        question: 'What are traditions?',
        options: ['Things we do only once', 'Special activities we repeat to celebrate', 'Things we buy at stores', 'Places we visit'],
        correctIndex: 1,
        reward: 'Tradition Keeper Badge',
      },
    ],
    bossChallenge: {
      question: 'You are now the Junior Mayor! What THREE things make a strong community?',
      answer: ['People helping each other', 'Safe homes and neighborhoods', 'Celebrating traditions together'],
      reward: 'Junior Mayor Certificate',
    },
  },
  {
    id: 'g2-social',
    grade: 2,
    programme: 'PYP',
    subject: 'social' as CurriculumSubject,
    title: 'Our Community & Rules',
    realmName: 'Council of Citizens',
    narrativeWorld: 'A democratic village where citizens learn about rules, laws, and working together for the common good.',
    characterTeacher: 'Councilor Sage',
    teacherEmoji: '🏛️',
    theme: 'Community rules, citizenship, and cooperation',
    questions: [
      {
        id: 'g2-s-1',
        spirit: 'Rule Spirit',
        spiritEmoji: '📋',
        spiritColor: '#3B82F6',
        narrative: 'Councilor Sage explains, "Rules are like the instructions for playing together fairly."',
        question: 'Why do communities have rules?',
        options: ['To make things confusing', 'To keep everyone safe and fair', 'To make people unhappy', 'Just for fun'],
        correctIndex: 1,
        reward: 'Rule Follower Badge',
      },
      {
        id: 'g2-s-2',
        spirit: 'Citizen Spirit',
        spiritEmoji: '🤝',
        spiritColor: '#22C55E',
        narrative: 'At the Citizenship Center, you learn what good citizens do.',
        question: 'What is a citizen?',
        options: ['Someone who lives in and belongs to a community', 'A type of car', 'A kind of animal', 'A special toy'],
        correctIndex: 0,
        reward: 'Citizen Star',
      },
      {
        id: 'g2-s-3',
        spirit: 'Cooperation Spirit',
        spiritEmoji: '🤲',
        spiritColor: '#F59E0B',
        narrative: 'The Cooperation Bridge shows how people work together.',
        question: 'What does cooperation mean?',
        options: ['Working alone', 'Working together to achieve a goal', 'Ignoring others', 'Fighting'],
        correctIndex: 1,
        reward: 'Team Player Medal',
      },
      {
        id: 'g2-s-4',
        spirit: 'Respect Spirit',
        spiritEmoji: '💎',
        spiritColor: '#A855F7',
        narrative: 'At the Respect Garden, flowers bloom when people show kindness.',
        question: 'What is the best way to show respect to others?',
        options: ['Being rude', 'Listening and treating them kindly', 'Ignoring them', 'Taking their things'],
        correctIndex: 1,
        reward: 'Respect Heart',
      },
      {
        id: 'g2-s-5',
        spirit: 'Responsibility Spirit',
        spiritEmoji: '⚖️',
        spiritColor: '#EF4444',
        narrative: 'The Responsibility Tower teaches about doing your part.',
        question: 'What does responsibility mean?',
        options: ['Blaming others', 'Doing your job and taking care of things', 'Waiting for someone else', 'Forgetting tasks'],
        correctIndex: 1,
        reward: 'Responsibility Badge',
      },
    ],
    bossChallenge: {
      question: 'Councilor Sage asks: "What makes you a GOOD citizen?" Share THREE ways!',
      answer: ['Follow community rules', 'Help others', 'Take responsibility for your actions'],
      reward: 'Good Citizen Award',
    },
  },
  {
    id: 'g3-social',
    grade: 3,
    programme: 'PYP',
    subject: 'social' as CurriculumSubject,
    title: 'Places & Maps',
    realmName: 'Atlas Kingdom',
    narrativeWorld: 'A magical kingdom where young cartographers learn to read maps and understand different places around the world.',
    characterTeacher: 'Cartographer Kai',
    teacherEmoji: '🗺️',
    theme: 'Geography, maps, and understanding place',
    questions: [
      {
        id: 'g3-s-1',
        spirit: 'Map Spirit',
        spiritEmoji: '🧭',
        spiritColor: '#10B981',
        narrative: 'Cartographer Kai unrolls an ancient map. "Maps show us the way!"',
        question: 'What is a map?',
        options: ['A type of song', 'A drawing that shows where places are', 'A kind of food', 'A game'],
        correctIndex: 1,
        reward: 'Map Reader Badge',
      },
      {
        id: 'g3-s-2',
        spirit: 'Direction Spirit',
        spiritEmoji: '🧭',
        spiritColor: '#3B82F6',
        narrative: 'The Compass Tower points in all directions.',
        question: 'Which direction does the sun rise?',
        options: ['West', 'East', 'North', 'South'],
        correctIndex: 1,
        reward: 'Direction Finder',
      },
      {
        id: 'g3-s-3',
        spirit: 'Landform Spirit',
        spiritEmoji: '🏔️',
        spiritColor: '#78350F',
        narrative: 'At the Mountain View, you see different landforms.',
        question: 'What do we call a very tall landform that reaches high into the sky?',
        options: ['Ocean', 'Mountain', 'River', 'Valley'],
        correctIndex: 1,
        reward: 'Landform Explorer',
      },
      {
        id: 'g3-s-4',
        spirit: 'Water Spirit',
        spiritEmoji: '🌊',
        spiritColor: '#0EA5E9',
        narrative: 'The Water Wing shows bodies of water.',
        question: 'What is the largest body of water on Earth?',
        options: ['Lake', 'River', 'Ocean', 'Pond'],
        correctIndex: 2,
        reward: 'Water Wisdom Star',
      },
      {
        id: 'g3-s-5',
        spirit: 'Climate Spirit',
        spiritEmoji: '🌤️',
        spiritColor: '#F59E0B',
        narrative: 'The Climate Station shows different weather patterns.',
        question: 'What is climate?',
        options: ['Today\'s weather', 'The usual weather of a place over many years', 'A type of clothes', 'A season'],
        correctIndex: 1,
        reward: 'Climate Detective',
      },
    ],
    bossChallenge: {
      question: 'Cartographer Kai challenges: "Draw a simple map! What THREE things should every map have?"',
      answer: ['Title', 'Symbols/legend', 'Direction compass (North)'],
      reward: 'Junior Cartographer Certificate',
    },
  },
  {
    id: 'g4-social',
    grade: 4,
    programme: 'PYP',
    subject: 'social' as CurriculumSubject,
    title: 'Regions & Cultures',
    realmName: 'Cultural Crossroads',
    narrativeWorld: 'A bustling marketplace where travelers from different regions and cultures share their stories and traditions.',
    characterTeacher: 'Ambassador Zara',
    teacherEmoji: '🌍',
    theme: 'World regions, cultural diversity, and human migration',
    questions: [
      {
        id: 'g4-s-1',
        spirit: 'Region Spirit',
        spiritEmoji: '🗺️',
        spiritColor: '#8B5CF6',
        narrative: 'Ambassador Zara shows you the World Map Room. "Regions are areas with similar features!"',
        question: 'What is a region?',
        options: ['A single country', 'An area with similar features like climate or culture', 'A type of animal', 'A small village'],
        correctIndex: 1,
        reward: 'Region Expert Badge',
      },
      {
        id: 'g4-s-2',
        spirit: 'Culture Spirit',
        spiritEmoji: '🎭',
        spiritColor: '#EC4899',
        narrative: 'At the Cultural Pavilion, you see clothing, food, and traditions from around the world.',
        question: 'What does culture include?',
        options: ['Only food', 'Language, traditions, food, clothing, and beliefs', 'Only music', 'Only holidays'],
        correctIndex: 1,
        reward: 'Culture Explorer',
      },
      {
        id: 'g4-s-3',
        spirit: 'Migration Spirit',
        spiritEmoji: '🚶',
        spiritColor: '#F97316',
        narrative: 'The Migration Museum tells stories of people moving across the world.',
        question: 'Why do people move from one place to another?',
        options: ['For fun only', 'For jobs, safety, education, or to be with family', 'To find treasure', 'To buy souvenirs'],
        correctIndex: 1,
        reward: 'Migration Scholar',
      },
      {
        id: 'g4-s-4',
        spirit: 'Language Spirit',
        spiritEmoji: '🗣️',
        spiritColor: '#06B6D4',
        narrative: 'The Language Library is filled with books in hundreds of languages.',
        question: 'Why are there many different languages in the world?',
        options: ['People created them over time in different places', 'They appeared magically', 'There is only one language', 'Languages are all the same'],
        correctIndex: 0,
        reward: 'Language Lover Badge',
      },
      {
        id: 'g4-s-5',
        spirit: 'Diversity Spirit',
        spiritEmoji: '🌈',
        spiritColor: '#22C55E',
        narrative: 'At the Diversity Garden, many flowers bloom together.',
        question: 'Why is diversity important in a community?',
        options: ['It makes everyone the same', 'It brings different ideas, perspectives, and richness', 'It is not important', 'It causes problems'],
        correctIndex: 1,
        reward: 'Diversity Champion',
      },
    ],
    bossChallenge: {
      question: 'Ambassador Zara asks: "Explain THREE reasons why understanding different cultures is important!"',
      answer: ['To respect and appreciate others', 'To learn new ideas and perspectives', 'To communicate better with people from different backgrounds'],
      reward: 'Cultural Ambassador Award',
    },
  },
  {
    id: 'g5-social',
    grade: 5,
    programme: 'PYP',
    subject: 'social' as CurriculumSubject,
    title: 'Ancient Civilizations',
    realmName: 'Temple of Time',
    narrativeWorld: 'An ancient temple where young historians journey through time to discover great civilizations of the past.',
    characterTeacher: 'Professor Atlas',
    teacherEmoji: '📜',
    theme: 'Ancient civilizations, achievements, and legacies',
    questions: [
      {
        id: 'g5-s-1',
        spirit: 'Egypt Spirit',
        spiritEmoji: '🏺',
        spiritColor: '#D97706',
        narrative: 'Professor Atlas opens the Egyptian portal. "The Nile River gave life to ancient Egypt!"',
        question: 'Why was the Nile River so important to ancient Egyptians?',
        options: ['It was used for swimming only', 'It provided water, fertile soil, and transportation', 'It was used for ice skating', 'It had no importance'],
        correctIndex: 1,
        reward: 'Nile Navigator',
      },
      {
        id: 'g5-s-2',
        spirit: 'Pyramid Spirit',
        spiritEmoji: '🔺',
        spiritColor: '#FBBF24',
        narrative: 'At the Great Pyramid, you learn about engineering marvels.',
        question: 'What were the pyramids built for?',
        options: ['As shopping malls', 'As tombs for the pharaohs', 'As schools', 'As playgrounds'],
        correctIndex: 1,
        reward: 'Pyramid Scholar',
      },
      {
        id: 'g5-s-3',
        spirit: 'Writing Spirit',
        spiritEmoji: '✍️',
        spiritColor: '#7C3AED',
        narrative: 'The Writing Chamber shows ancient scripts.',
        question: 'What did ancient Egyptians write on?',
        options: ['Paper like today', 'Papyrus reeds and stone', 'Computers', 'Leather books'],
        correctIndex: 1,
        reward: 'Hieroglyph Hunter',
      },
      {
        id: 'g5-s-4',
        spirit: 'Greece Spirit',
        spiritEmoji: '🏛️',
        spiritColor: '#3B82F6',
        narrative: 'The Greek Temple teaches about democracy.',
        question: 'What form of government began in ancient Greece?',
        options: ['Dictatorship', 'Democracy', 'Monarchy only', 'Anarchy'],
        correctIndex: 1,
        reward: 'Democracy Disciple',
      },
      {
        id: 'g5-s-5',
        spirit: 'Legacy Spirit',
        spiritEmoji: '⏳',
        spiritColor: '#059669',
        narrative: 'At the Legacy Hall, you see how the past connects to today.',
        question: 'What does legacy mean?',
        options: ['Something that costs money', 'Something handed down from the past', 'A type of building', 'A game'],
        correctIndex: 1,
        reward: 'Legacy Learner',
      },
    ],
    bossChallenge: {
      question: 'Professor Atlas challenges: "Name THREE achievements of ancient civilizations that we still use today!"',
      answer: ['Writing systems', 'Mathematics and numbers', 'Architecture and building techniques'],
      reward: 'Time Traveler Certificate',
    },
  },

  // ==================== MYP — Grades 6-10 ====================
  {
    id: 'g6-social',
    grade: 6,
    programme: 'MYP',
    subject: 'social' as CurriculumSubject,
    title: 'World Geography',
    realmName: 'Planetary Observatory',
    narrativeWorld: 'A space station orbiting Earth where young geographers study continents, countries, and global connections.',
    characterTeacher: 'Commander Terra',
    teacherEmoji: '🌏',
    theme: 'Continents, countries, physical geography, and human systems',
    questions: [
      {
        id: 'g6-s-1',
        spirit: 'Continent Spirit',
        spiritEmoji: '🌍',
        spiritColor: '#10B981',
        narrative: 'Commander Terra shows you the holographic globe. "Earth has seven major landmasses!"',
        question: 'How many continents are there on Earth?',
        options: ['4', '5', '7', '10'],
        correctIndex: 2,
        reward: 'Continent Counter',
      },
      {
        id: 'g6-s-2',
        spirit: 'Ocean Spirit',
        spiritEmoji: '🌊',
        spiritColor: '#0EA5E9',
        narrative: 'At the Ocean Observatory, you study bodies of water.',
        question: 'What is the largest ocean on Earth?',
        options: ['Atlantic Ocean', 'Indian Ocean', 'Pacific Ocean', 'Arctic Ocean'],
        correctIndex: 2,
        reward: 'Ocean Expert',
      },
      {
        id: 'g6-s-3',
        spirit: 'Population Spirit',
        spiritEmoji: '👥',
        spiritColor: '#F59E0B',
        narrative: 'The Population Monitor shows where people live.',
        question: 'What is the most populated country in the world?',
        options: ['United States', 'India', 'China', 'Brazil'],
        correctIndex: 2,
        reward: 'Population Scholar',
      },
      {
        id: 'g6-s-4',
        spirit: 'Climate Spirit',
        spiritEmoji: '🌡️',
        spiritColor: '#EF4444',
        narrative: 'In the Climate Lab, you study Earth\'s climate zones.',
        question: 'Which climate zone is found at the equator?',
        options: ['Polar', 'Temperate', 'Tropical', 'Desert'],
        correctIndex: 2,
        reward: 'Climate Champion',
      },
      {
        id: 'g6-s-5',
        spirit: 'Resources Spirit',
        spiritEmoji: '⛏️',
        spiritColor: '#78350F',
        narrative: 'The Resource Center displays natural resources from around the world.',
        question: 'What are natural resources?',
        options: ['Things made in factories', 'Materials from nature that humans use', 'Man-made objects', 'Computers and phones'],
        correctIndex: 1,
        reward: 'Resource Ranger',
      },
    ],
    bossChallenge: {
      question: 'Commander Terra asks: "Explain THREE ways that geography affects how people live!"',
      answer: ['Climate affects what crops can grow', 'Mountains and rivers affect transportation', 'Natural resources affect jobs and economy'],
      reward: 'Global Geographer Badge',
    },
  },
  {
    id: 'g7-social',
    grade: 7,
    programme: 'MYP',
    subject: 'social' as CurriculumSubject,
    title: 'Ancient & Medieval History',
    realmName: 'Chronicle Citadel',
    narrativeWorld: 'A fortress of ancient scrolls where historians piece together the story of human civilization.',
    characterTeacher: 'Historian Hera',
    teacherEmoji: '📚',
    theme: 'Ancient empires, medieval societies, and historical analysis',
    questions: [
      {
        id: 'g7-s-1',
        spirit: 'Rome Spirit',
        spiritEmoji: '🏛️',
        spiritColor: '#DC2626',
        narrative: 'Historian Hera opens the Roman Chronicles. "The Roman Empire changed the world!"',
        question: 'What was one major achievement of the Roman Empire?',
        options: ['Inventing the internet', 'Building roads and aqueducts', 'Creating video games', 'Building skyscrapers'],
        correctIndex: 1,
        reward: 'Roman Scholar',
      },
      {
        id: 'g7-s-2',
        spirit: 'China Spirit',
        spiritEmoji: '🐉',
        spiritColor: '#F59E0B',
        narrative: 'The Chinese Dynasty Hall displays ancient inventions.',
        question: 'Which of these was invented in ancient China?',
        options: ['Cars', 'Paper and printing', 'Television', 'Computers'],
        correctIndex: 1,
        reward: 'Dynasty Detective',
      },
      {
        id: 'g7-s-3',
        spirit: 'Medieval Spirit',
        spiritEmoji: '🏰',
        spiritColor: '#6B7280',
        narrative: 'The Medieval Gallery shows castles and knights.',
        question: 'What was the feudal system in medieval Europe?',
        options: ['A type of government where everyone was equal', 'A system where land was exchanged for service and loyalty', 'A democracy', 'A modern republic'],
        correctIndex: 1,
        reward: 'Feudal Expert',
      },
      {
        id: 'g7-s-4',
        spirit: 'Trade Spirit',
        spiritEmoji: '🛤️',
        spiritColor: '#8B5CF6',
        narrative: 'The Silk Road map room shows ancient trade routes.',
        question: 'Why was the Silk Road important?',
        options: ['It was a single road made of silk', 'It connected civilizations for trade and cultural exchange', 'It was used for racing', 'It was a military path only'],
        correctIndex: 1,
        reward: 'Trade Trailblazer',
      },
      {
        id: 'g7-s-5',
        spirit: 'Evidence Spirit',
        spiritEmoji: '🔍',
        spiritColor: '#14B8A6',
        narrative: 'The Evidence Room teaches how historians learn about the past.',
        question: 'What is a primary source in history?',
        options: ['A textbook written today', 'An original document or artifact from the time period', 'A movie about history', 'A website'],
        correctIndex: 1,
        reward: 'History Hunter',
      },
    ],
    bossChallenge: {
      question: 'Historian Hera asks: "What THREE things do historians examine to understand the past?"',
      answer: ['Primary sources like documents and artifacts', 'Secondary sources like textbooks', 'Archaeological evidence'],
      reward: 'Time Detective Award',
    },
  },
  {
    id: 'g8-social',
    grade: 8,
    programme: 'MYP',
    subject: 'social' as CurriculumSubject,
    title: 'Civics & Government',
    realmName: 'Democracy Dome',
    narrativeWorld: 'A grand building where citizens learn about government systems, rights, and responsibilities.',
    characterTeacher: 'Senator Civis',
    teacherEmoji: '⚖️',
    theme: 'Government systems, rights, responsibilities, and civic participation',
    questions: [
      {
        id: 'g8-s-1',
        spirit: 'Government Spirit',
        spiritEmoji: '🏛️',
        spiritColor: '#3B82F6',
        narrative: 'Senator Civis welcomes you. "Government is how people organize themselves!"',
        question: 'What is the purpose of government?',
        options: ['To make all decisions for fun', 'To provide order, protection, and services', 'To control people unfairly', 'To create chaos'],
        correctIndex: 1,
        reward: 'Government Guide',
      },
      {
        id: 'g8-s-2',
        spirit: 'Democracy Spirit',
        spiritEmoji: '🗳️',
        spiritColor: '#10B981',
        narrative: 'The Democracy Chamber shows different voting systems.',
        question: 'What is a democracy?',
        options: ['Rule by one person', 'Government where citizens have the power through voting', 'Military rule', 'No government at all'],
        correctIndex: 1,
        reward: 'Democracy Defender',
      },
      {
        id: 'g8-s-3',
        spirit: 'Rights Spirit',
        spiritEmoji: '📜',
        spiritColor: '#F59E0B',
        narrative: 'The Rights Hall displays important documents.',
        question: 'What are human rights?',
        options: ['Rights that only some people have', 'Basic rights that all humans deserve', 'Rights that governments can take away', 'Laws about property'],
        correctIndex: 1,
        reward: 'Rights Champion',
      },
      {
        id: 'g8-s-4',
        spirit: 'Constitution Spirit',
        spiritEmoji: '📋',
        spiritColor: '#7C3AED',
        narrative: 'The Constitution Library houses founding documents.',
        question: 'What is a constitution?',
        options: ['A type of book', 'A document that sets up government and protects rights', 'A song', 'A building'],
        correctIndex: 1,
        reward: 'Constitution Scholar',
      },
      {
        id: 'g8-s-5',
        spirit: 'Responsibility Spirit',
        spiritEmoji: '🤝',
        spiritColor: '#EC4899',
        narrative: 'The Responsibility Center teaches civic duties.',
        question: 'What is a responsibility of a good citizen?',
        options: ['Breaking laws', 'Voting and participating in community', 'Ignoring problems', 'Avoiding taxes'],
        correctIndex: 1,
        reward: 'Civic Star',
      },
    ],
    bossChallenge: {
      question: 'Senator Civis challenges: "Name THREE rights citizens have AND THREE responsibilities citizens should fulfill!"',
      answer: ['Rights: Freedom of speech, Right to vote, Right to education', 'Responsibilities: Obey laws, Vote in elections, Serve on jury if called'],
      reward: 'Civic Leader Certificate',
    },
  },
  {
    id: 'g9-social',
    grade: 9,
    programme: 'MYP',
    subject: 'social' as CurriculumSubject,
    title: 'Economics & Trade',
    realmName: 'Marketplace of Nations',
    narrativeWorld: 'A bustling international market where young economists learn about money, trade, and global economies.',
    characterTeacher: 'Merchant Monroe',
    teacherEmoji: '💹',
    theme: 'Economic systems, trade, supply and demand, and global markets',
    questions: [
      {
        id: 'g9-s-1',
        spirit: 'Economy Spirit',
        spiritEmoji: '📊',
        spiritColor: '#22C55E',
        narrative: 'Merchant Monroe explains, "Economics is about how people make, sell, and buy things!"',
        question: 'What is economics?',
        options: ['The study of plants', 'The study of how people use resources to meet needs', 'The study of space', 'The study of animals'],
        correctIndex: 1,
        reward: 'Economics Explorer',
      },
      {
        id: 'g9-s-2',
        spirit: 'Supply Spirit',
        spiritEmoji: '📦',
        spiritColor: '#3B82F6',
        narrative: 'The Supply Warehouse shows how producers create goods.',
        question: 'What happens to price when supply is low and demand is high?',
        options: ['Price goes down', 'Price goes up', 'Price stays the same', 'Price disappears'],
        correctIndex: 1,
        reward: 'Supply Scholar',
      },
      {
        id: 'g9-s-3',
        spirit: 'Trade Spirit',
        spiritEmoji: '🚢',
        spiritColor: '#0EA5E9',
        narrative: 'The Trade Port displays goods from around the world.',
        question: 'Why do countries trade with each other?',
        options: ['To waste resources', 'To get goods they cannot produce efficiently themselves', 'To make enemies', 'To create pollution'],
        correctIndex: 1,
        reward: 'Trade Navigator',
      },
      {
        id: 'g9-s-4',
        spirit: 'Money Spirit',
        spiritEmoji: '💰',
        spiritColor: '#FBBF24',
        narrative: 'The Currency Exchange shows different types of money.',
        question: 'What is the purpose of money?',
        options: ['To make people unhappy', 'To serve as a medium of exchange for goods and services', 'To be thrown away', 'To create confusion'],
        correctIndex: 1,
        reward: 'Money Master',
      },
      {
        id: 'g9-s-5',
        spirit: 'Market Spirit',
        spiritEmoji: '📈',
        spiritColor: '#EF4444',
        narrative: 'The Market Monitor shows how prices change.',
        question: 'What is competition in a market?',
        options: ['When businesses work together to fix prices', 'When businesses try to offer better products or prices', 'When there is only one seller', 'When people stop buying'],
        correctIndex: 1,
        reward: 'Market Maven',
      },
    ],
    bossChallenge: {
      question: 'Merchant Monroe asks: "Explain THREE factors that affect the price of a product!"',
      answer: ['Supply (how much is available)', 'Demand (how much people want it)', 'Production costs'],
      reward: 'Junior Economist Badge',
    },
  },
  {
    id: 'g10-social',
    grade: 10,
    programme: 'MYP',
    subject: 'social' as CurriculumSubject,
    title: 'Modern World History',
    realmName: 'Modern Era Museum',
    narrativeWorld: 'A contemporary museum documenting the major events and changes of the 19th and 20th centuries.',
    characterTeacher: 'Curator Chronos',
    teacherEmoji: '🕰️',
    theme: 'Industrial Revolution, World Wars, decolonization, and globalization',
    questions: [
      {
        id: 'g10-s-1',
        spirit: 'Industry Spirit',
        spiritEmoji: '🏭',
        spiritColor: '#78350F',
        narrative: 'Curator Chronos shows you the Industrial Revolution exhibit.',
        question: 'What was the Industrial Revolution?',
        options: ['A war between countries', 'A period when machines changed how goods were made', 'A type of government', 'A religious movement'],
        correctIndex: 1,
        reward: 'Industrial Expert',
      },
      {
        id: 'g10-s-2',
        spirit: 'War Spirit',
        spiritEmoji: '⚔️',
        spiritColor: '#7F1D1D',
        narrative: 'The World War Hall documents global conflicts.',
        question: 'What was one major cause of World War I?',
        options: ['A single assassination', 'Competition for colonies and military buildup', 'A soccer match', 'A disagreement about food'],
        correctIndex: 1,
        reward: 'History Scholar',
      },
      {
        id: 'g10-s-3',
        spirit: 'Freedom Spirit',
        spiritEmoji: '🗽',
        spiritColor: '#059669',
        narrative: 'The Decolonization Wing shows independence movements.',
        question: 'What is decolonization?',
        options: ['Building more colonies', 'When colonies gain independence from colonial powers', 'Creating new colonies', 'Forgetting history'],
        correctIndex: 1,
        reward: 'Freedom Fighter',
      },
      {
        id: 'g10-s-4',
        spirit: 'Global Spirit',
        spiritEmoji: '🌐',
        spiritColor: '#3B82F6',
        narrative: 'The Globalization Gallery shows our connected world.',
        question: 'What is globalization?',
        options: ['Isolating countries from each other', 'Countries becoming more connected through trade and technology', 'Closing borders', 'Stopping communication'],
        correctIndex: 1,
        reward: 'Global Citizen',
      },
      {
        id: 'g10-s-5',
        spirit: 'Perspective Spirit',
        spiritEmoji: '👁️',
        spiritColor: '#8B5CF6',
        narrative: 'The Perspective Room teaches historical thinking.',
        question: 'Why is it important to study history from multiple perspectives?',
        options: ['To memorize dates', 'To understand the full story and avoid bias', 'To judge people', 'To prove one side is always right'],
        correctIndex: 1,
        reward: 'Perspective Master',
      },
    ],
    bossChallenge: {
      question: 'Curator Chronos challenges: "Explain THREE ways the Industrial Revolution changed society!"',
      answer: ['Changed from farm work to factory work', 'Created new social classes (working class vs owners)', 'Led to urbanization (people moved to cities)'],
      reward: 'Modern History Award',
    },
  },

  // ==================== DP — Grades 11-12 ====================
  {
    id: 'g11-social',
    grade: 11,
    programme: 'DP',
    subject: 'social' as CurriculumSubject,
    title: 'IB History HL',
    realmName: 'Archives of Empires',
    narrativeWorld: 'A vast archive containing records of empires, revolutions, and the forces that shaped the modern world.',
    characterTeacher: 'Archivist Athena',
    teacherEmoji: '📖',
    theme: 'Authoritarian states, causes and effects of wars, and the Cold War',
    questions: [
      {
        id: 'g11-s-1',
        spirit: 'Authoritarian Spirit',
        spiritEmoji: '👑',
        spiritColor: '#991B1B',
        narrative: 'Archivist Athena opens the Authoritarian States collection.',
        question: 'What is an authoritarian government?',
        options: ['A democracy with free elections', 'A government with unlimited power, limited freedoms', 'A government with no leader', 'A student council'],
        correctIndex: 1,
        reward: 'Political Analyst',
      },
      {
        id: 'g11-s-2',
        spirit: 'War Spirit',
        spiritEmoji: '⚔️',
        spiritColor: '#7F1D1D',
        narrative: 'The War Causes section examines conflicts.',
        question: 'Which of these is a long-term cause of World War I?',
        options: ['A single event', 'Militarism, alliances, imperialism, nationalism', 'A peaceful agreement', 'Economic prosperity'],
        correctIndex: 1,
        reward: 'War Historian',
      },
      {
        id: 'g11-s-3',
        spirit: 'Cold War Spirit',
        spiritEmoji: '❄️',
        spiritColor: '#1D4ED8',
        narrative: 'The Cold War Archive documents ideological conflict.',
        question: 'What was the main ideological conflict of the Cold War?',
        options: ['Religion vs science', 'Democracy/capitalism vs communism', 'Sports teams', 'Food preferences'],
        correctIndex: 1,
        reward: 'Cold War Scholar',
      },
      {
        id: 'g11-s-4',
        spirit: 'Evidence Spirit',
        spiritEmoji: '🔍',
        spiritColor: '#14B8A6',
        narrative: 'The Source Analysis Lab teaches critical evaluation.',
        question: 'What is the difference between a primary and secondary source?',
        options: ['There is no difference', 'Primary is from the time period; secondary is analysis later', 'Primary is always better', 'Secondary is always wrong'],
        correctIndex: 1,
        reward: 'Source Expert',
      },
      {
        id: 'g11-s-5',
        spirit: 'Perspective Spirit',
        spiritEmoji: '👁️',
        spiritColor: '#A855F7',
        narrative: 'The Historiography Hall shows different historical interpretations.',
        question: 'Why do historians have different interpretations of the same event?',
        options: ['History is confusing', 'They use different sources, perspectives, and frameworks', 'They are always wrong', 'They do not study enough'],
        correctIndex: 1,
        reward: 'Perspective Master',
      },
    ],
    bossChallenge: {
      question: 'Archivist Athena challenges: "Analyze ONE authoritarian state. Explain THREE methods used to maintain power!"',
      answer: ['Propaganda and control of media', 'Secret police and fear', 'Limiting opposition and controlling education'],
      reward: 'IB History Analyst Certificate',
    },
  },
  {
    id: 'g12-social',
    grade: 12,
    programme: 'DP',
    subject: 'social' as CurriculumSubject,
    title: 'IB Global Politics',
    realmName: 'United Nations Simulation',
    narrativeWorld: 'A model United Nations where students engage with complex global issues and international relations.',
    characterTeacher: 'Ambassador Pax',
    teacherEmoji: '🕊️',
    theme: 'International relations, human rights, development, and global challenges',
    questions: [
      {
        id: 'g12-s-1',
        spirit: 'Sovereignty Spirit',
        spiritEmoji: '🏛️',
        spiritColor: '#1E40AF',
        narrative: 'Ambassador Pax introduces the concept of sovereignty.',
        question: 'What is state sovereignty?',
        options: ['When a state has no power', 'The authority of a state to govern itself without interference', 'A type of economy', 'A form of entertainment'],
        correctIndex: 1,
        reward: 'Sovereignty Scholar',
      },
      {
        id: 'g12-s-2',
        spirit: 'Rights Spirit',
        spiritEmoji: '✊',
        spiritColor: '#059669',
        narrative: 'The Human Rights Council examines global challenges.',
        question: 'What is the Universal Declaration of Human Rights?',
        options: ['A law that must be followed', 'A document outlining basic rights all humans deserve', 'A song', 'A map'],
        correctIndex: 1,
        reward: 'Human Rights Advocate',
      },
      {
        id: 'g12-s-3',
        spirit: 'Development Spirit',
        spiritEmoji: '📈',
        spiritColor: '#F59E0B',
        narrative: 'The Development Center studies economic progress.',
        question: 'What does GDP measure?',
        options: ['Population growth', 'The total value of goods and services produced by a country', 'Education levels', 'Military strength'],
        correctIndex: 1,
        reward: 'Development Expert',
      },
      {
        id: 'g12-s-4',
        spirit: 'Cooperation Spirit',
        spiritEmoji: '🤝',
        spiritColor: '#3B82F6',
        narrative: 'The International Cooperation Room shows how nations work together.',
        question: 'What is the purpose of the United Nations?',
        options: ['To create wars', 'To promote international cooperation and peace', 'To control all countries', 'To make money'],
        correctIndex: 1,
        reward: 'Global Diplomat',
      },
      {
        id: 'g12-s-5',
        spirit: 'Challenge Spirit',
        spiritEmoji: '🌍',
        spiritColor: '#DC2626',
        narrative: 'The Global Challenges Forum addresses current issues.',
        question: 'Which of these is a global challenge that requires international cooperation?',
        options: ['A single country\'s election', 'Climate change', 'A local sports event', 'A neighborhood party'],
        correctIndex: 1,
        reward: 'Global Problem Solver',
      },
    ],
    bossChallenge: {
      question: "Ambassador Pax asks: 'Discuss ONE global challenge. Analyze THREE reasons why international cooperation is difficult AND suggest solutions!'",
      answer: ['Different national interests', 'Economic inequality between nations', 'Sovereignty concerns'],
      reward: 'Global Politics Analyst Award',
    },
  },

  // ===================== GRADE 6 MYP =====================

  // Quest 2: Human & Environment Interaction
  {
    id: 'g6-social-2',
    grade: 6,
    programme: 'MYP',
    subject: 'social',
    title: 'Human & Environment Interaction',
    realmName: 'The Verdant Nexus',
    narrativeWorld:
      'Deep within the Verdant Nexus, ancient forests whisper of a time when humans and nature lived in harmony. The balance has been disrupted, and elemental spirits cry out for a champion who understands the bond between people and the land they inhabit.',
    characterTeacher: 'Warden Thornleaf',
    teacherEmoji: '🌍',
    theme: 'Environment, sustainability, and human impact on the natural world',
    questions: [
      {
        id: 'g6-social-2-q1',
        spirit: 'Harvest Spirit',
        spiritEmoji: '🌾',
        spiritColor: '#EAB308',
        narrative:
          'The Harvest Spirit appears in golden fields that stretch to the horizon. It speaks of ancient civilizations that learned to grow food from the earth.',
        question:
          'What was the most significant change that the Agricultural Revolution brought to early human societies?',
        options: [
          'People shifted from nomadic lifestyles to settled communities',
          'People began using metal tools for the first time',
          'People started trading with distant civilizations',
          'People developed written language systems',
        ],
        correctIndex: 0,
        reward: 'Harvest Scholar Badge',
      },
      {
        id: 'g6-social-2-q2',
        spirit: 'River Guardian',
        spiritEmoji: '🏞️',
        spiritColor: '#3B82F6',
        narrative:
          'A shimmering River Guardian rises from the waters of an ancient delta, reminding you that the greatest civilizations were born along mighty rivers.',
        question:
          'Why did many early civilizations develop near rivers like the Nile, Tigris, and Euphrates?',
        options: [
          'Rivers provided natural defenses against invaders',
          'Rivers offered fertile soil for farming, fresh water, and transportation routes',
          'Rivers were considered sacred by all ancient religions',
          'Rivers were the only source of building materials',
        ],
        correctIndex: 1,
        reward: 'River Keeper Badge',
      },
      {
        id: 'g6-social-2-q3',
        spirit: 'Dust Wanderer',
        spiritEmoji: '🏜️',
        spiritColor: '#D97706',
        narrative:
          'The Dust Wanderer drifts across barren landscapes, showing visions of lands that were once green and thriving before human actions changed them forever.',
        question:
          'What is deforestation, and why is it a concern for human-environment interaction?',
        options: [
          'It is the planting of new forests to replace old ones',
          'It is the clearing of forests, which can lead to soil erosion, habitat loss, and climate change',
          'It is a natural process where forests regenerate after fires',
          'It is the process of forests expanding into grasslands',
        ],
        correctIndex: 1,
        reward: 'Land Protector Badge',
      },
      {
        id: 'g6-social-2-q4',
        spirit: 'Coral Sentinel',
        spiritEmoji: '🐚',
        spiritColor: '#EC4899',
        narrative:
          'Beneath crystalline waves, the Coral Sentinel guards the reef kingdoms. It warns that the balance of the oceans is shifting dangerously.',
        question:
          'How does pollution from human activities most directly affect ocean ecosystems?',
        options: [
          'It makes the ocean water warmer everywhere equally',
          'It can harm marine life through toxic chemicals, plastic waste, and oil spills',
          'It causes the ocean to produce more oxygen',
          'It only affects freshwater lakes, not oceans',
        ],
        correctIndex: 1,
        reward: 'Ocean Guardian Badge',
      },
      {
        id: 'g6-social-2-q5',
        spirit: 'Canopy Keeper',
        spiritEmoji: '🌱',
        spiritColor: '#22C55E',
        narrative:
          'High in the ancient treetops, the Canopy Keeper shows you a vision of two possible futures — one of destruction and one of renewal through sustainable choices.',
        question:
          'Which of the following is the best example of sustainable resource use?',
        options: [
          'Cutting down all trees in a forest for quick profit',
          'Using only fossil fuels because they are cheap',
          'Replanting trees after harvesting and using renewable energy sources',
          'Dumping waste into rivers to save disposal costs',
        ],
        correctIndex: 2,
        reward: 'Sustainability Champion Badge',
      },
    ],
    bossChallenge: {
      question:
        'Reflect on the relationship between humans and the environment throughout history. How have human actions both helped and harmed the natural world? What steps can communities take today to create a more sustainable future?',
      answer: [
        'Humans have shaped the environment through agriculture, urbanization, and industrialization — some positive (irrigation, conservation efforts) and some harmful (deforestation, pollution).',
        'Historical examples show that overuse of resources, like soil depletion in ancient Mesopotamia, can lead to the decline of civilizations.',
        'Communities today can promote sustainability through renewable energy, reforestation, responsible consumption, and environmental education.',
      ],
      reward: 'Verdant Nexus Master Certificate',
    },
  },

  // Quest 3: Cultural Exchange & Migration
  {
    id: 'g6-social-3',
    grade: 6,
    programme: 'MYP',
    subject: 'social',
    title: 'Cultural Exchange & Migration',
    realmName: 'The Crossroads of Winds',
    narrativeWorld:
      'At the Crossroads of Winds, ancient trade routes converge beneath swirling auroras. Travelers from every corner of the world have left their mark here, blending languages, foods, and traditions into a tapestry of shared humanity.',
    characterTeacher: 'Navigator Zephyra',
    teacherEmoji: '🧭',
    theme: 'Cultural exchange, migration patterns, and the blending of civilizations',
    questions: [
      {
        id: 'g6-social-3-q1',
        spirit: 'Caravan Spirit',
        spiritEmoji: '🐪',
        spiritColor: '#F59E0B',
        narrative:
          'The Caravan Spirit materializes from desert sands, carrying echoes of merchants who once traversed thousands of miles to exchange goods and ideas.',
        question:
          'What was the Silk Road, and why was it important for cultural exchange?',
        options: [
          'A single paved road connecting Rome to Beijing',
          'A network of trade routes connecting East Asia to the Mediterranean, spreading goods, ideas, and cultures',
          'A river route used only for transporting silk fabric',
          'A modern highway built in the 20th century',
        ],
        correctIndex: 1,
        reward: 'Trade Route Explorer Badge',
      },
      {
        id: 'g6-social-3-q2',
        spirit: 'Tide Voyager',
        spiritEmoji: '⛵',
        spiritColor: '#0EA5E9',
        narrative:
          'The Tide Voyager rises from the ocean spray, telling tales of Polynesian navigators who crossed vast stretches of the Pacific using only the stars and ocean currents.',
        question:
          'What is a "push factor" in the study of human migration?',
        options: [
          'An attractive feature of a new destination',
          'A condition that drives people to leave their homeland, such as war, famine, or persecution',
          'A government policy that encourages immigration',
          'A type of transportation used during migration',
        ],
        correctIndex: 1,
        reward: 'Migration Scholar Badge',
      },
      {
        id: 'g6-social-3-q3',
        spirit: 'Loom Weaver',
        spiritEmoji: '🎭',
        spiritColor: '#8B5CF6',
        narrative:
          'The Loom Weaver sits at an enormous tapestry, weaving threads of different colors together. Each thread represents a culture that has shared its traditions with others.',
        question:
          'What does "cultural diffusion" mean?',
        options: [
          'The deliberate destruction of one culture by another',
          'When a culture completely isolates itself from all others',
          'The spread of cultural beliefs, practices, and ideas from one group to another',
          'The process of a culture remaining unchanged over centuries',
        ],
        correctIndex: 2,
        reward: 'Cultural Bridge Badge',
      },
      {
        id: 'g6-social-3-q4',
        spirit: 'Feast Herald',
        spiritEmoji: '🍜',
        spiritColor: '#EF4444',
        narrative:
          'The Feast Herald sets a grand table filled with dishes from every continent, showing how food traditions travel across borders and become part of new cultures.',
        question:
          'Which of the following is an example of cultural exchange through food?',
        options: [
          'A country banning all foreign food imports',
          'Tomatoes, originally from the Americas, becoming a staple ingredient in Italian cuisine after the Columbian Exchange',
          'A culture eating only locally grown food with no outside influence',
          'Replacing all traditional dishes with fast food',
        ],
        correctIndex: 1,
        reward: 'Global Palate Badge',
      },
      {
        id: 'g6-social-3-q5',
        spirit: 'Echo Sage',
        spiritEmoji: '📜',
        spiritColor: '#14B8A6',
        narrative:
          'The Echo Sage sits in a vast library where scrolls from every civilization are preserved. It speaks of how languages evolve when cultures meet and mingle.',
        question:
          'How has migration historically affected language development?',
        options: [
          'Migration has had no effect on languages',
          'Migration always causes languages to disappear completely',
          'When people migrate and interact, languages often borrow words and sometimes new blended languages emerge',
          'Migration only affects written language, not spoken language',
        ],
        correctIndex: 2,
        reward: 'Linguist Explorer Badge',
      },
    ],
    bossChallenge: {
      question:
        'Consider the role of migration and cultural exchange throughout human history. How have the movement of people and the sharing of ideas shaped the world we live in today? Use specific examples to support your reflection.',
      answer: [
        'Migration has led to the blending of cultures, as seen in the Silk Road exchanges that spread religions like Buddhism and Islam, along with technologies like papermaking and gunpowder.',
        'Cultural exchange through food, language, and art has enriched societies — for example, the Columbian Exchange transformed diets worldwide by introducing crops like potatoes and tomatoes to new continents.',
        'Today, migration continues to shape multicultural societies where diverse traditions coexist, contributing to innovation, cuisine, music, and global understanding.',
      ],
      reward: 'Crossroads of Winds Master Certificate',
    },
  },

  // ===================== GRADE 7 MYP =====================

  // Quest 2: Renaissance & Scientific Revolution
  {
    id: 'g7-social-2',
    grade: 7,
    programme: 'MYP',
    subject: 'social',
    title: 'Renaissance & Scientific Revolution',
    realmName: 'The Luminary Atheneum',
    narrativeWorld:
      'Within the Luminary Atheneum, towering marble halls house the greatest inventions and artworks ever conceived. Mechanical devices whir alongside painted masterpieces, and the spirits of visionary thinkers beckon you to rediscover the age of enlightenment.',
    characterTeacher: 'Maestro Solari',
    teacherEmoji: '🔭',
    theme: 'Renaissance art, science, humanism, and the birth of modern thinking',
    questions: [
      {
        id: 'g7-social-2-q1',
        spirit: 'Muse of Invention',
        spiritEmoji: '💡',
        spiritColor: '#FBBF24',
        narrative:
          'The Muse of Invention hovers above a workshop filled with sketches of flying machines and anatomical drawings, whispering of a genius who mastered both art and science.',
        question:
          'What intellectual movement fueled the Renaissance and shifted focus from purely religious thinking to human potential and achievement?',
        options: [
          'Feudalism',
          'Humanism',
          'Imperialism',
          'Mercantilism',
        ],
        correctIndex: 1,
        reward: 'Humanist Scholar Badge',
      },
      {
        id: 'g7-social-2-q2',
        spirit: 'Star Gazer',
        spiritEmoji: '🌟',
        spiritColor: '#6366F1',
        narrative:
          'The Star Gazer spirit points a telescope toward the heavens, revealing the movements of planets that once challenged everything people believed about the universe.',
        question:
          'What was revolutionary about Copernicus\'s heliocentric theory?',
        options: [
          'It proposed that the Earth was flat',
          'It claimed that the Sun, not the Earth, was at the center of the solar system',
          'It stated that all planets move in square orbits',
          'It proved that stars are actually nearby objects',
        ],
        correctIndex: 1,
        reward: 'Celestial Thinker Badge',
      },
      {
        id: 'g7-social-2-q3',
        spirit: 'Canvas Phantom',
        spiritEmoji: '🎨',
        spiritColor: '#EC4899',
        narrative:
          'The Canvas Phantom drifts through a grand gallery where paintings seem to leap from their frames with startling realism and depth.',
        question:
          'Which artistic technique, developed during the Renaissance, created the illusion of depth and distance on a flat surface?',
        options: [
          'Calligraphy',
          'Mosaic tiling',
          'Linear perspective',
          'Pointillism',
        ],
        correctIndex: 2,
        reward: 'Artistic Visionary Badge',
      },
      {
        id: 'g7-social-2-q4',
        spirit: 'Press Guardian',
        spiritEmoji: '📖',
        spiritColor: '#10B981',
        narrative:
          'The Press Guardian stands beside a great mechanical device that clacks and hums, producing pages of text at a speed never before imagined.',
        question:
          'How did Gutenberg\'s printing press (c. 1440) contribute to the spread of Renaissance ideas?',
        options: [
          'It made books cheaper and more widely available, allowing ideas to spread faster',
          'It was only used to print religious texts approved by the Church',
          'It slowed down the spread of knowledge by creating censorship',
          'It was too expensive for anyone to use',
        ],
        correctIndex: 0,
        reward: 'Knowledge Spreader Badge',
      },
      {
        id: 'g7-social-2-q5',
        spirit: 'Method Keeper',
        spiritEmoji: '🔬',
        spiritColor: '#3B82F6',
        narrative:
          'The Method Keeper holds a set of glowing instruments — a telescope, a microscope, and a compass — symbols of a new way of understanding the world through observation and experiment.',
        question:
          'What is the scientific method, and why was it important during the Scientific Revolution?',
        options: [
          'A religious process for interpreting sacred texts',
          'A systematic approach of observation, hypothesis, experimentation, and conclusion that replaced reliance on ancient authorities',
          'A mathematical formula invented by Isaac Newton',
          'A method of artistic painting developed in Florence',
        ],
        correctIndex: 1,
        reward: 'Empirical Mind Badge',
      },
    ],
    bossChallenge: {
      question:
        'Explain how the Renaissance and Scientific Revolution transformed European society. How did new ways of thinking about art, science, and humanity challenge existing authorities and lay the groundwork for the modern world?',
      answer: [
        'The Renaissance revived interest in classical learning and humanism, encouraging individuals to question tradition and celebrate human creativity, as seen in the works of Leonardo da Vinci and Michelangelo.',
        'The Scientific Revolution introduced the scientific method, with thinkers like Copernicus, Galileo, and Newton challenging the Church\'s authority by using observation and evidence to explain the natural world.',
        'Together, these movements shifted European society toward reason, individualism, and inquiry — laying the foundations for the Enlightenment, modern democracy, and contemporary science.',
      ],
      reward: 'Luminary Atheneum Master Certificate',
    },
  },

  // Quest 3: Trade, Exploration & Colonization
  {
    id: 'g7-social-3',
    grade: 7,
    programme: 'MYP',
    subject: 'social',
    title: 'Trade, Exploration & Colonization',
    realmName: 'The Voyager\'s Expanse',
    narrativeWorld:
      'The Voyager\'s Expanse is a realm of endless oceans and uncharted lands. Ghostly galleons sail beneath twin moons, and the echoes of explorers, traders, and colonizers reveal stories of ambition, wealth, and devastating consequences for indigenous peoples.',
    characterTeacher: 'Captain Marisol',
    teacherEmoji: '🗺️',
    theme: 'Age of Exploration, global trade networks, colonization, and its impact on indigenous peoples',
    questions: [
      {
        id: 'g7-social-3-q1',
        spirit: 'Compass Wraith',
        spiritEmoji: '🧭',
        spiritColor: '#F97316',
        narrative:
          'The Compass Wraith appears in a swirl of sea mist, spinning its spectral compass toward distant lands that European explorers sought in the 15th century.',
        question:
          'What was the primary motivation for European exploration during the Age of Exploration (15th-17th centuries)?',
        options: [
          'To spread democracy around the world',
          'To find new trade routes to Asia for spices and luxury goods, along with gaining wealth, land, and spreading Christianity',
          'To escape the Black Plague in Europe',
          'To study ocean currents for scientific purposes',
        ],
        correctIndex: 1,
        reward: 'Explorer\'s Compass Badge',
      },
      {
        id: 'g7-social-3-q2',
        spirit: 'Exchange Specter',
        spiritEmoji: '🌎',
        spiritColor: '#EF4444',
        narrative:
          'The Exchange Specter reveals two hemispheres connected by glowing threads — plants, animals, diseases, and people flowing between them in a massive global transfer.',
        question:
          'What was the Columbian Exchange?',
        options: [
          'A stock market created by Christopher Columbus',
          'The widespread transfer of plants, animals, diseases, and people between the Americas and the Old World after 1492',
          'A peace treaty between Spain and Portugal',
          'A type of currency used in colonial America',
        ],
        correctIndex: 1,
        reward: 'Global Exchange Badge',
      },
      {
        id: 'g7-social-3-q3',
        spirit: 'Chain Breaker',
        spiritEmoji: '⛓️',
        spiritColor: '#7C3AED',
        narrative:
          'The Chain Breaker spirit appears with broken shackles, its voice heavy with sorrow as it recalls one of the darkest chapters in human history.',
        question:
          'What was the triangular trade, and what role did the transatlantic slave trade play in it?',
        options: [
          'A trade route between three European countries exchanging luxury goods',
          'A triangular-shaped building where goods were stored',
          'A trade network connecting Europe, Africa, and the Americas, in which enslaved Africans were forcibly transported to work on colonial plantations',
          'A system of fair trade between indigenous peoples and European settlers',
        ],
        correctIndex: 2,
        reward: 'Justice Seeker Badge',
      },
      {
        id: 'g7-social-3-q4',
        spirit: 'Heritage Flame',
        spiritEmoji: '🏛️',
        spiritColor: '#0891B2',
        narrative:
          'The Heritage Flame burns above the ruins of a great indigenous city, illuminating the civilization that thrived there before colonizers arrived.',
        question:
          'How did European colonization most significantly impact indigenous peoples in the Americas?',
        options: [
          'It had very little impact on their daily lives',
          'It brought widespread disease, loss of land, destruction of cultures, and forced labor that devastated indigenous populations',
          'It helped indigenous peoples build stronger economies',
          'It only affected indigenous peoples in North America',
        ],
        correctIndex: 1,
        reward: 'Indigenous Heritage Badge',
      },
      {
        id: 'g7-social-3-q5',
        spirit: 'Spice Sentinel',
        spiritEmoji: '🏴‍☠️',
        spiritColor: '#DC2626',
        narrative:
          'The Spice Sentinel guards a vault of precious cargo — cinnamon, pepper, cloves — treasures that once drove entire nations to war and conquest.',
        question:
          'Which European nations were the earliest major colonial powers during the Age of Exploration?',
        options: [
          'Germany and Russia',
          'Spain and Portugal',
          'Sweden and Norway',
          'Italy and Greece',
        ],
        correctIndex: 1,
        reward: 'Colonial Historian Badge',
      },
    ],
    bossChallenge: {
      question:
        'Analyze the impact of the Age of Exploration on both European and indigenous societies. Consider the motivations of explorers, the consequences of colonization, and the lasting effects that are still felt today.',
      answer: [
        'European nations were motivated by the desire for wealth, new trade routes, territorial expansion, and spreading Christianity — leading to the colonization of the Americas, Africa, and parts of Asia.',
        'Colonization devastated indigenous populations through disease, forced labor, cultural destruction, and land dispossession, as seen in the near-collapse of the Aztec and Inca empires.',
        'The lasting effects include global economic inequalities, cultural legacies of colonialism, the African diaspora resulting from the slave trade, and ongoing debates about reparations and indigenous rights.',
      ],
      reward: 'Voyager\'s Expanse Master Certificate',
    },
  },

  // ===================== GRADE 8 MYP =====================

  // Quest 2: Political Ideologies
  {
    id: 'g8-social-2',
    grade: 8,
    programme: 'MYP',
    subject: 'social',
    title: 'Political Ideologies',
    realmName: 'The Parliament of Shadows',
    narrativeWorld:
      'In the Parliament of Shadows, great statues of political thinkers stand frozen in eternal debate. Their ideologies echo through cavernous halls, each one offering a different vision of how society should be governed. You must understand their arguments to navigate this realm.',
    characterTeacher: 'Chancellor Voltaire',
    teacherEmoji: '⚖️',
    theme: 'Political ideologies, governance systems, and the philosophy of power',
    questions: [
      {
        id: 'g8-social-2-q1',
        spirit: 'Liberty Flame',
        spiritEmoji: '🗽',
        spiritColor: '#3B82F6',
        narrative:
          'The Liberty Flame blazes atop an ancient monument, representing the ideals of individual freedom and limited government that shaped revolutions across the world.',
        question:
          'What are the core principles of liberalism as a political ideology?',
        options: [
          'Strong central government control over all aspects of life',
          'Individual rights, personal freedoms, rule of law, and limited government',
          'Complete government ownership of all property',
          'Rule by a hereditary monarch with absolute power',
        ],
        correctIndex: 1,
        reward: 'Political Philosopher Badge',
      },
      {
        id: 'g8-social-2-q2',
        spirit: 'Commune Spirit',
        spiritEmoji: '🔴',
        spiritColor: '#DC2626',
        narrative:
          'The Commune Spirit rises from factory smokestacks, carrying pamphlets about workers\' rights and the unequal distribution of wealth during the Industrial Revolution.',
        question:
          'What did Karl Marx argue was the fundamental problem with capitalist societies?',
        options: [
          'That there were too many political parties',
          'That the working class (proletariat) was exploited by the ruling class (bourgeoisie) who owned the means of production',
          'That governments spent too much on military defense',
          'That education was too widely available',
        ],
        correctIndex: 1,
        reward: 'Economic Thinker Badge',
      },
      {
        id: 'g8-social-2-q3',
        spirit: 'Crown Sentinel',
        spiritEmoji: '👑',
        spiritColor: '#A855F7',
        narrative:
          'The Crown Sentinel guards a throne room where the principles of traditional authority and social hierarchy are etched into golden walls.',
        question:
          'What does conservatism as a political ideology generally emphasize?',
        options: [
          'Rapid revolutionary change to transform society',
          'Abolishing all forms of government',
          'Tradition, social stability, established institutions, and gradual change',
          'Equal distribution of all wealth by the government',
        ],
        correctIndex: 2,
        reward: 'Governance Scholar Badge',
      },
      {
        id: 'g8-social-2-q4',
        spirit: 'Ballot Guardian',
        spiritEmoji: '🗳️',
        spiritColor: '#10B981',
        narrative:
          'The Ballot Guardian stands at a crossroads where citizens line up to cast their votes, each one contributing to the collective decision of how they will be governed.',
        question:
          'What is the key difference between a direct democracy and a representative democracy?',
        options: [
          'There is no difference; they are the same system',
          'In a direct democracy, citizens vote on laws themselves; in a representative democracy, they elect officials to make decisions on their behalf',
          'A direct democracy has no elections at all',
          'A representative democracy does not allow citizens to vote',
        ],
        correctIndex: 1,
        reward: 'Democracy Champion Badge',
      },
      {
        id: 'g8-social-2-q5',
        spirit: 'Iron Veil',
        spiritEmoji: '🏴',
        spiritColor: '#6B7280',
        narrative:
          'The Iron Veil descends over a darkened city where propaganda posters cover every wall and a single party controls every aspect of citizens\' lives.',
        question:
          'What characterizes a totalitarian government?',
        options: [
          'Power is shared equally among all citizens',
          'The government has limited powers and respects individual rights',
          'A single party or leader exercises absolute control over all aspects of public and private life, often using propaganda and censorship',
          'Multiple political parties compete freely in regular elections',
        ],
        correctIndex: 2,
        reward: 'Critical Thinker Badge',
      },
    ],
    bossChallenge: {
      question:
        'Compare and contrast at least two political ideologies you have studied. How do they differ in their views on government power, individual rights, and economic organization? Why is it important to understand different political perspectives?',
      answer: [
        'Liberalism emphasizes individual rights, personal freedoms, and limited government, while socialism focuses on collective ownership and reducing economic inequality through government intervention.',
        'Conservatism values tradition and gradual change, whereas more radical ideologies like communism advocate for revolutionary transformation of society\'s economic structure.',
        'Understanding different political ideologies is essential for informed citizenship, critical thinking about governance, and recognizing how these ideas continue to shape political debates and policies worldwide.',
      ],
      reward: 'Parliament of Shadows Master Certificate',
    },
  },

  // Quest 3: Social Movements & Change
  {
    id: 'g8-social-3',
    grade: 8,
    programme: 'MYP',
    subject: 'social',
    title: 'Social Movements & Change',
    realmName: 'The March of Echoes',
    narrativeWorld:
      'Along the March of Echoes, the voices of those who fought for justice reverberate through time. Banners flutter in a phantom wind, carried by the spirits of activists, organizers, and ordinary people who changed the course of history through collective action.',
    characterTeacher: 'Herald Mandela',
    teacherEmoji: '✊',
    theme: 'Social movements, civil rights, activism, and the power of collective action',
    questions: [
      {
        id: 'g8-social-3-q1',
        spirit: 'March Spirit',
        spiritEmoji: '🪧',
        spiritColor: '#F59E0B',
        narrative:
          'The March Spirit carries a glowing banner that reads "We Shall Overcome," echoing the determination of people who refused to accept injustice.',
        question:
          'What was the primary goal of the American Civil Rights Movement of the 1950s and 1960s?',
        options: [
          'To gain independence from British colonial rule',
          'To end racial segregation and discrimination and secure equal rights for African Americans',
          'To establish a new political party',
          'To promote international trade agreements',
        ],
        correctIndex: 1,
        reward: 'Civil Rights Scholar Badge',
      },
      {
        id: 'g8-social-3-q2',
        spirit: 'Suffrage Phoenix',
        spiritEmoji: '🕊️',
        spiritColor: '#8B5CF6',
        narrative:
          'The Suffrage Phoenix rises from the ashes of inequality, its wings bearing the names of women who fought for decades to win the right to vote.',
        question:
          'What was the suffragette movement fighting for?',
        options: [
          'The right of women to own land',
          'The right of women to vote and participate in political life',
          'The right of workers to form labor unions',
          'The right of children to attend school',
        ],
        correctIndex: 1,
        reward: 'Equality Advocate Badge',
      },
      {
        id: 'g8-social-3-q3',
        spirit: 'Peace Weaver',
        spiritEmoji: '☮️',
        spiritColor: '#14B8A6',
        narrative:
          'The Peace Weaver sits spinning threads of nonviolent resistance, showing how powerful change can come without the use of force.',
        question:
          'How did Mahatma Gandhi use nonviolent resistance to challenge British colonial rule in India?',
        options: [
          'By organizing armed rebellions against British forces',
          'Through tactics like boycotts, peaceful protests, civil disobedience, and hunger strikes',
          'By negotiating secret trade deals with other colonial powers',
          'By encouraging Indians to leave the country',
        ],
        correctIndex: 1,
        reward: 'Nonviolence Champion Badge',
      },
      {
        id: 'g8-social-3-q4',
        spirit: 'Unity Beacon',
        spiritEmoji: '🌈',
        spiritColor: '#EC4899',
        narrative:
          'The Unity Beacon shines with many colors, representing the diverse groups of people who have organized together to demand recognition and equal treatment.',
        question:
          'Why are social movements often most effective when they build broad coalitions of supporters?',
        options: [
          'Because having fewer people involved makes movements stronger',
          'Because governments only listen to single-issue groups',
          'Because broad coalitions increase visibility, political pressure, and public support, making it harder for authorities to ignore their demands',
          'Because social movements only need one charismatic leader to succeed',
        ],
        correctIndex: 2,
        reward: 'Coalition Builder Badge',
      },
      {
        id: 'g8-social-3-q5',
        spirit: 'Digital Spark',
        spiritEmoji: '📱',
        spiritColor: '#3B82F6',
        narrative:
          'The Digital Spark crackles with energy, showing how modern technology has transformed the way people organize, protest, and demand change.',
        question:
          'How has social media changed the nature of social movements in the 21st century?',
        options: [
          'Social media has made social movements completely unnecessary',
          'It allows movements to organize quickly, spread information globally, raise awareness, and mobilize supporters across borders',
          'Social media only benefits governments trying to suppress movements',
          'It has had no significant impact on social movements',
        ],
        correctIndex: 1,
        reward: 'Digital Activist Badge',
      },
    ],
    bossChallenge: {
      question:
        'Choose a social movement from history and analyze its methods, challenges, and lasting impact. How did ordinary people create extraordinary change, and what lessons can we learn from their efforts for addressing injustice today?',
      answer: [
        'Social movements like the Civil Rights Movement used strategies including nonviolent protest, civil disobedience, legal challenges, and grassroots organizing to challenge deeply entrenched systems of discrimination.',
        'These movements faced significant challenges including violent opposition, imprisonment of leaders, internal disagreements, and slow progress — yet persistence and broad coalition-building eventually led to landmark legislation like the Civil Rights Act of 1964.',
        'The lessons from historical social movements — the power of collective action, the importance of nonviolent strategy, and the need for sustained commitment — continue to inspire modern movements for environmental justice, gender equality, and human rights.',
      ],
      reward: 'March of Echoes Master Certificate',
    },
  },

  // ===================== GRADE 9 MYP =====================

  // Quest 2: Development & Inequality
  {
    id: 'g9-social-2',
    grade: 9,
    programme: 'MYP',
    subject: 'social',
    title: 'Development & Inequality',
    realmName: 'The Fractured Meridian',
    narrativeWorld:
      'The Fractured Meridian is a realm split by a vast chasm — on one side, towering cities of glass and steel gleam with prosperity; on the other, communities struggle with poverty and limited resources. The spirits here seek a hero who can understand why such divides exist and envision a more equitable world.',
    characterTeacher: 'Arbiter Nyoko',
    teacherEmoji: '📊',
    theme: 'Global development, economic inequality, and the factors that shape prosperity and poverty',
    questions: [
      {
        id: 'g9-social-2-q1',
        spirit: 'Index Oracle',
        spiritEmoji: '📈',
        spiritColor: '#10B981',
        narrative:
          'The Index Oracle floats above a holographic globe, projecting numbers and charts that reveal the vast differences in quality of life between nations.',
        question:
          'What does the Human Development Index (HDI) measure, and why is it considered more comprehensive than GDP alone?',
        options: [
          'It only measures a country\'s military strength',
          'It combines indicators of life expectancy, education, and income per capita, providing a broader picture of human well-being than economic output alone',
          'It measures only the number of hospitals in a country',
          'It ranks countries based on their population size',
        ],
        correctIndex: 1,
        reward: 'Development Analyst Badge',
      },
      {
        id: 'g9-social-2-q2',
        spirit: 'Trade Phantom',
        spiritEmoji: '🏭',
        spiritColor: '#F59E0B',
        narrative:
          'The Trade Phantom haunts old colonial trading posts, revealing how historical exploitation continues to shape global economic patterns today.',
        question:
          'How did colonialism contribute to global economic inequality that persists today?',
        options: [
          'Colonialism had no lasting economic effects',
          'Colonial powers extracted resources and wealth from colonized regions, established economic structures that benefited the colonizers, and left formerly colonized nations with weakened institutions and economies',
          'Colonialism equally benefited both colonizers and the colonized',
          'Colonial economies were completely rebuilt after independence',
        ],
        correctIndex: 1,
        reward: 'Historical Economist Badge',
      },
      {
        id: 'g9-social-2-q3',
        spirit: 'Debt Wraith',
        spiritEmoji: '💰',
        spiritColor: '#EF4444',
        narrative:
          'The Debt Wraith rattles chains made of golden coins, symbolizing the cycle of debt that traps developing nations in poverty despite their best efforts.',
        question:
          'What is the "debt trap" that many developing countries face?',
        options: [
          'A situation where countries become too wealthy from borrowing',
          'When countries borrow heavily to fund development but struggle to repay loans, often needing to cut social services or borrow more, perpetuating a cycle of poverty',
          'A type of savings account used by developing nations',
          'A trade agreement that eliminates all national debt',
        ],
        correctIndex: 1,
        reward: 'Economic Justice Badge',
      },
      {
        id: 'g9-social-2-q4',
        spirit: 'Disparity Seer',
        spiritEmoji: '🔍',
        spiritColor: '#8B5CF6',
        narrative:
          'The Disparity Seer peers through a magical lens that reveals hidden inequalities within seemingly prosperous societies — gaps between rich and poor, urban and rural, men and women.',
        question:
          'What does the term "income inequality" refer to, and why is it a concern even within wealthy nations?',
        options: [
          'It means everyone in a country earns the same amount',
          'It refers to the uneven distribution of income across a population; high inequality can lead to social instability, reduced economic mobility, and poorer health outcomes even in rich countries',
          'It only exists in developing countries',
          'It is a temporary problem that always resolves itself naturally',
        ],
        correctIndex: 1,
        reward: 'Inequality Awareness Badge',
      },
      {
        id: 'g9-social-2-q5',
        spirit: 'Aid Architect',
        spiritEmoji: '🏗️',
        spiritColor: '#0EA5E9',
        narrative:
          'The Aid Architect drafts blueprints for bridges between the divided halves of the Fractured Meridian, debating the best approaches to closing the development gap.',
        question:
          'What is a major criticism of foreign aid as a solution to global poverty?',
        options: [
          'Foreign aid always works perfectly and has no downsides',
          'Aid can create dependency, may not address root causes of poverty, and can sometimes be mismanaged or used to serve donor countries\' political interests rather than recipients\' needs',
          'Foreign aid has never been attempted',
          'All countries refuse to accept foreign aid',
        ],
        correctIndex: 1,
        reward: 'Development Strategist Badge',
      },
    ],
    bossChallenge: {
      question:
        'Analyze the causes and consequences of global inequality. Why do some nations remain trapped in poverty while others prosper? What approaches — local, national, or international — could be most effective in reducing the development gap?',
      answer: [
        'Global inequality stems from historical factors like colonialism, unfair trade structures, and resource exploitation, as well as ongoing issues like corruption, conflict, and unequal access to education and healthcare.',
        'The consequences include cycles of poverty, brain drain from developing nations, political instability, and health crises that disproportionately affect the world\'s poorest populations.',
        'Effective approaches may include fair trade policies, debt relief, investment in education and infrastructure, strengthening local governance, and ensuring that international aid empowers communities rather than creating dependency.',
      ],
      reward: 'Fractured Meridian Master Certificate',
    },
  },

  // Quest 3: Migration & Refugees
  {
    id: 'g9-social-3',
    grade: 9,
    programme: 'MYP',
    subject: 'social',
    title: 'Migration & Refugees',
    realmName: 'The Passage of Lost Horizons',
    narrativeWorld:
      'The Passage of Lost Horizons is a liminal realm between worlds — a place where displaced spirits wander, seeking safety and belonging. Their stories of courage, loss, and resilience fill the air, urging you to understand the forces that drive people from their homes.',
    characterTeacher: 'Guide Amara',
    teacherEmoji: '🏕️',
    theme: 'Forced and voluntary migration, refugee crises, asylum, and human displacement',
    questions: [
      {
        id: 'g9-social-3-q1',
        spirit: 'Exodus Spirit',
        spiritEmoji: '🚶',
        spiritColor: '#F97316',
        narrative:
          'The Exodus Spirit walks an endless road, carrying only a small bundle of belongings. Its eyes hold the stories of millions who have been forced to flee their homes.',
        question:
          'According to the 1951 UN Refugee Convention, what defines a "refugee"?',
        options: [
          'Anyone who travels to another country for vacation',
          'A person who has fled their country due to a well-founded fear of persecution based on race, religion, nationality, political opinion, or membership in a particular social group',
          'A person who moves to another country for better job opportunities',
          'Anyone who lives outside their country of birth',
        ],
        correctIndex: 1,
        reward: 'Refugee Rights Badge',
      },
      {
        id: 'g9-social-3-q2',
        spirit: 'Border Phantom',
        spiritEmoji: '🚧',
        spiritColor: '#DC2626',
        narrative:
          'The Border Phantom materializes at a towering wall, where desperate families are turned away. It asks you to consider the tension between national sovereignty and human compassion.',
        question:
          'What is the difference between a refugee and an internally displaced person (IDP)?',
        options: [
          'There is no difference between the two',
          'Refugees have crossed an international border to seek safety, while IDPs have been forced from their homes but remain within their own country\'s borders',
          'IDPs have better legal protections than refugees',
          'Refugees choose to leave voluntarily, while IDPs are forced to leave',
        ],
        correctIndex: 1,
        reward: 'Displacement Scholar Badge',
      },
      {
        id: 'g9-social-3-q3',
        spirit: 'Haven Keeper',
        spiritEmoji: '🏠',
        spiritColor: '#22C55E',
        narrative:
          'The Haven Keeper opens the door to a shelter, where displaced families find temporary safety. But the question of long-term solutions weighs heavily.',
        question:
          'What are the three "durable solutions" for refugees recognized by the UNHCR?',
        options: [
          'Education, employment, and healthcare',
          'Voluntary repatriation (returning home), local integration (settling in the host country), and resettlement (moving to a third country)',
          'Military intervention, economic sanctions, and diplomacy',
          'Building walls, deportation, and detention',
        ],
        correctIndex: 1,
        reward: 'Haven Builder Badge',
      },
      {
        id: 'g9-social-3-q4',
        spirit: 'Tide Turner',
        spiritEmoji: '🌊',
        spiritColor: '#6366F1',
        narrative:
          'The Tide Turner shows visions of overcrowded boats on dangerous seas — desperate journeys undertaken by people with no other option.',
        question:
          'Why do many refugees risk dangerous journeys across seas or through hostile territories?',
        options: [
          'Because they enjoy traveling and seeking adventure',
          'Because they face immediate threats to their lives and have no safe or legal pathways to protection, leaving dangerous routes as their only option',
          'Because they want to take jobs from people in other countries',
          'Because they are unaware of the dangers involved',
        ],
        correctIndex: 1,
        reward: 'Empathy Guardian Badge',
      },
      {
        id: 'g9-social-3-q5',
        spirit: 'Integration Weaver',
        spiritEmoji: '🤝',
        spiritColor: '#EC4899',
        narrative:
          'The Integration Weaver stitches together two pieces of fabric — one representing a host community and one representing newcomers — creating a stronger whole.',
        question:
          'What challenges do refugees commonly face when integrating into a new host country?',
        options: [
          'Refugees face no challenges and integrate immediately',
          'Language barriers, cultural differences, discrimination, difficulty accessing education and employment, legal barriers, and psychological trauma from displacement',
          'The only challenge is finding housing',
          'Host countries always provide everything refugees need immediately',
        ],
        correctIndex: 1,
        reward: 'Integration Advocate Badge',
      },
    ],
    bossChallenge: {
      question:
        'Examine the global refugee crisis from multiple perspectives — those of refugees, host communities, and the international community. What responsibilities do nations have toward displaced people, and how can the world better respond to forced migration?',
      answer: [
        'Refugees flee life-threatening situations including war, persecution, and environmental disasters; they deserve protection under international law, and their experiences of trauma and loss must be acknowledged.',
        'Host communities face real challenges including resource strain and cultural adjustment, but evidence shows that refugees also contribute economically and culturally; balanced policies can address concerns while upholding humanitarian obligations.',
        'The international community must share responsibility more equitably, invest in addressing root causes of displacement, create safer legal pathways for asylum, and support both refugees and host communities through funding, resettlement programs, and long-term integration support.',
      ],
      reward: 'Passage of Lost Horizons Master Certificate',
    },
  },

  // ===================== GRADE 10 MYP =====================

  // Quest 2: Cold War
  {
    id: 'g10-social-2',
    grade: 10,
    programme: 'MYP',
    subject: 'social',
    title: 'Cold War',
    realmName: 'The Iron Divide',
    narrativeWorld:
      'The Iron Divide splits a once-unified realm into two hostile territories — one draped in red banners, the other in blue. Nuclear shadows loom overhead as spies, diplomats, and soldiers navigate a conflict fought through ideology, proxy wars, and the ever-present threat of mutual destruction.',
    characterTeacher: 'Strategist Volkov',
    teacherEmoji: '🪖',
    theme: 'Cold War tensions, superpower rivalry, proxy conflicts, and the nuclear age',
    questions: [
      {
        id: 'g10-social-2-q1',
        spirit: 'Curtain Specter',
        spiritEmoji: '🪨',
        spiritColor: '#6B7280',
        narrative:
          'The Curtain Specter materializes at a massive wall dividing a great city, symbolizing the ideological split that defined a generation.',
        question:
          'What was the "Iron Curtain," and what did Winston Churchill mean when he used this term in 1946?',
        options: [
          'A literal metal wall built across Europe',
          'The ideological and physical boundary dividing Western democratic/capitalist Europe from Eastern communist Soviet-controlled Europe',
          'A type of military weapon developed during World War II',
          'A trade agreement between the United States and the Soviet Union',
        ],
        correctIndex: 1,
        reward: 'Cold War Historian Badge',
      },
      {
        id: 'g10-social-2-q2',
        spirit: 'Atomic Shade',
        spiritEmoji: '☢️',
        spiritColor: '#EAB308',
        narrative:
          'The Atomic Shade glows with an ominous light, its form flickering like a mushroom cloud. It speaks of a time when the world stood on the brink of annihilation.',
        question:
          'What was the doctrine of Mutually Assured Destruction (MAD), and how did it influence Cold War strategy?',
        options: [
          'A plan for one side to win a nuclear war decisively',
          'The concept that both superpowers had enough nuclear weapons to destroy each other completely, which paradoxically deterred direct military conflict between the US and USSR',
          'A military alliance between NATO and the Warsaw Pact',
          'A treaty that banned all nuclear weapons',
        ],
        correctIndex: 1,
        reward: 'Nuclear Age Scholar Badge',
      },
      {
        id: 'g10-social-2-q3',
        spirit: 'Proxy Flame',
        spiritEmoji: '🔥',
        spiritColor: '#EF4444',
        narrative:
          'The Proxy Flame burns in distant lands — Korea, Vietnam, Afghanistan — where superpowers fought through other nations rather than confronting each other directly.',
        question:
          'What is a "proxy war," and why did the US and USSR rely on them during the Cold War?',
        options: [
          'A war fought directly between two superpowers on their own soil',
          'A conflict in which superpowers supported opposing sides in a third country\'s war, allowing them to compete for influence without risking direct nuclear confrontation',
          'A type of economic competition between trading partners',
          'A war fought entirely through diplomatic negotiations',
        ],
        correctIndex: 1,
        reward: 'Geopolitics Expert Badge',
      },
      {
        id: 'g10-social-2-q4',
        spirit: 'Space Pioneer',
        spiritEmoji: '🚀',
        spiritColor: '#3B82F6',
        narrative:
          'The Space Pioneer floats in zero gravity, surrounded by satellites and spacecraft. The race to the stars was also a race for ideological supremacy.',
        question:
          'How was the Space Race connected to Cold War rivalry between the US and the Soviet Union?',
        options: [
          'It had no connection to the Cold War',
          'Both superpowers viewed space achievements as demonstrations of technological and ideological superiority, with the Soviets launching Sputnik first and the US landing on the Moon in 1969',
          'Only the United States participated in the Space Race',
          'The Space Race was a cooperative effort between the two superpowers',
        ],
        correctIndex: 1,
        reward: 'Space Age Badge',
      },
      {
        id: 'g10-social-2-q5',
        spirit: 'Wall Breaker',
        spiritEmoji: '🧱',
        spiritColor: '#A855F7',
        narrative:
          'The Wall Breaker stands before a crumbling barrier as crowds surge through, celebrating a moment that signaled the beginning of the end of the Cold War.',
        question:
          'What were the key factors that led to the end of the Cold War and the collapse of the Soviet Union?',
        options: [
          'The United States invaded and conquered the Soviet Union',
          'Economic stagnation in the USSR, Gorbachev\'s reforms (glasnost and perestroika), the fall of the Berlin Wall in 1989, and the desire for self-determination among Soviet satellite states',
          'The Cold War ended because both sides signed a peace treaty in 1975',
          'The Soviet Union voluntarily disbanded because communism was too successful',
        ],
        correctIndex: 1,
        reward: 'End of an Era Badge',
      },
    ],
    bossChallenge: {
      question:
        'Evaluate the legacy of the Cold War. How did the ideological confrontation between the US and the USSR shape global politics, regional conflicts, and international institutions? What Cold War-era dynamics continue to influence geopolitics today?',
      answer: [
        'The Cold War divided the world into competing blocs and fueled proxy wars in Korea, Vietnam, Latin America, Africa, and the Middle East, leaving lasting instability and political divisions in many regions.',
        'It shaped international institutions like NATO, the UN Security Council, and the European Union, and spurred the nuclear arms race, the Space Race, and massive investment in military technology.',
        'Cold War legacies persist today in tensions between Russia and the West, the continued existence of nuclear arsenals, unresolved conflicts rooted in proxy wars, and ongoing debates about the role of superpowers in global governance.',
      ],
      reward: 'Iron Divide Master Certificate',
    },
  },

  // Quest 3: Environmental Issues & Sustainability
  {
    id: 'g10-social-3',
    grade: 10,
    programme: 'MYP',
    subject: 'social',
    title: 'Environmental Issues & Sustainability',
    realmName: 'The Scorched Canopy',
    narrativeWorld:
      'The Scorched Canopy was once a paradise of lush forests and crystal rivers. Now, withered trees and polluted waters tell a cautionary tale. The elemental spirits that remain are fading fast, and only someone who understands the causes and solutions can restore the balance.',
    characterTeacher: 'Sage Gaia',
    teacherEmoji: '♻️',
    theme: 'Climate change, environmental degradation, sustainability, and global cooperation',
    questions: [
      {
        id: 'g10-social-3-q1',
        spirit: 'Carbon Sentinel',
        spiritEmoji: '🌡️',
        spiritColor: '#EF4444',
        narrative:
          'The Carbon Sentinel appears as a shimmering heat mirage, carrying data about rising global temperatures and their devastating consequences.',
        question:
          'What is the greenhouse effect, and how do human activities intensify it?',
        options: [
          'It is the process by which plants grow in greenhouses',
          'It is the natural trapping of heat by atmospheric gases, which human activities like burning fossil fuels intensify by releasing excess CO₂ and methane, leading to global warming',
          'It is a theory with no scientific evidence',
          'It only affects countries near the equator',
        ],
        correctIndex: 1,
        reward: 'Climate Science Badge',
      },
      {
        id: 'g10-social-3-q2',
        spirit: 'Coral Requiem',
        spiritEmoji: '🪸',
        spiritColor: '#F97316',
        narrative:
          'The Coral Requiem mourns beneath warming seas, where once-vibrant reefs are bleaching white and marine ecosystems are collapsing.',
        question:
          'What is the relationship between climate change and biodiversity loss?',
        options: [
          'Climate change has no effect on biodiversity',
          'Rising temperatures, ocean acidification, and changing weather patterns destroy habitats, disrupt ecosystems, and push species toward extinction faster than they can adapt',
          'Climate change only affects plant species, not animals',
          'Biodiversity actually increases with higher temperatures',
        ],
        correctIndex: 1,
        reward: 'Biodiversity Guardian Badge',
      },
      {
        id: 'g10-social-3-q3',
        spirit: 'Accord Keeper',
        spiritEmoji: '📜',
        spiritColor: '#22C55E',
        narrative:
          'The Accord Keeper holds a glowing scroll — the Paris Agreement — representing humanity\'s collective promise to address climate change.',
        question:
          'What was the main goal established by the 2015 Paris Agreement?',
        options: [
          'To completely eliminate all fossil fuel use by 2020',
          'To limit global temperature rise to well below 2°C above pre-industrial levels, with efforts to limit it to 1.5°C',
          'To build nuclear power plants in every country',
          'To ban all international trade to reduce carbon emissions',
        ],
        correctIndex: 1,
        reward: 'Global Accord Badge',
      },
      {
        id: 'g10-social-3-q4',
        spirit: 'Justice Ember',
        spiritEmoji: '⚡',
        spiritColor: '#8B5CF6',
        narrative:
          'The Justice Ember flickers between images of wealthy nations with high emissions and vulnerable communities bearing the worst consequences of climate change.',
        question:
          'What is "climate justice," and why is it an important concept in environmental discussions?',
        options: [
          'It means all countries produce the same amount of pollution',
          'It recognizes that those least responsible for climate change — often poorer nations and marginalized communities — suffer its worst impacts, and calls for equitable solutions',
          'It is a court system for punishing polluters',
          'It only applies to industrialized countries',
        ],
        correctIndex: 1,
        reward: 'Climate Justice Badge',
      },
      {
        id: 'g10-social-3-q5',
        spirit: 'Renewal Spirit',
        spiritEmoji: '🌿',
        spiritColor: '#14B8A6',
        narrative:
          'The Renewal Spirit plants seeds in scorched earth, demonstrating that with the right knowledge and commitment, damaged ecosystems and societies can recover.',
        question:
          'What is "sustainable development," and how does it differ from traditional economic growth?',
        options: [
          'It means stopping all economic growth entirely',
          'Development that meets the needs of the present without compromising the ability of future generations to meet their own needs, balancing economic, social, and environmental goals',
          'It is the same as traditional economic growth but with a different name',
          'It only focuses on environmental protection and ignores economic needs',
        ],
        correctIndex: 1,
        reward: 'Sustainability Pioneer Badge',
      },
    ],
    bossChallenge: {
      question:
        'Evaluate the challenges of achieving environmental sustainability on a global scale. Why is international cooperation essential, and what obstacles make it difficult? Propose a multi-faceted approach that balances economic development with environmental protection.',
      answer: [
        'Environmental challenges like climate change, deforestation, and ocean pollution cross national borders and require collective action; no single country can solve these problems alone, making international agreements like the Paris Accord essential.',
        'Obstacles include competing economic interests, disagreements over responsibility between developed and developing nations, short-term political thinking, corporate lobbying against environmental regulations, and the difficulty of enforcing international agreements.',
        'An effective approach must combine renewable energy investment, circular economy practices, climate finance for vulnerable nations, strong environmental regulations, public education, and equitable burden-sharing that acknowledges historical responsibility while supporting developing nations\' growth.',
      ],
      reward: 'Scorched Canopy Master Certificate',
    },
  },

  // ===================== GRADE 11 DP =====================

  // Quest 2: Authoritarian Case Studies
  {
    id: 'g11-social-2',
    grade: 11,
    programme: 'DP',
    subject: 'social',
    title: 'Authoritarian Case Studies',
    realmName: 'The Obsidian Tribunal',
    narrativeWorld:
      'The Obsidian Tribunal is a grim realm of towering monoliths inscribed with propaganda and decrees. Once-free peoples now march in lockstep under watchful eyes. The spirits imprisoned here hold the keys to understanding how authoritarian regimes rise, maintain power, and eventually fall.',
    characterTeacher: 'Archivist Orwell',
    teacherEmoji: '👁️',
    theme: 'Rise and rule of authoritarian states, propaganda, control mechanisms, and resistance',
    questions: [
      {
        id: 'g11-social-2-q1',
        spirit: 'Propaganda Shade',
        spiritEmoji: '📢',
        spiritColor: '#DC2626',
        narrative:
          'The Propaganda Shade projects distorted images across the sky — a master of manipulation showing how authoritarian regimes control information to control people.',
        question:
          'How did totalitarian regimes like Nazi Germany and Stalinist Russia use propaganda to consolidate power?',
        options: [
          'They allowed free press and open debate to win support naturally',
          'They controlled media, education, and public messaging to create a cult of personality around the leader, demonize opposition, and promote a single ideological narrative',
          'They relied solely on military force without any use of propaganda',
          'They used propaganda only during wartime',
        ],
        correctIndex: 1,
        reward: 'Media Literacy Badge',
      },
      {
        id: 'g11-social-2-q2',
        spirit: 'Crisis Specter',
        spiritEmoji: '📉',
        spiritColor: '#F59E0B',
        narrative:
          'The Crisis Specter takes the form of economic collapse and social upheaval — the conditions that authoritarian leaders exploit to seize power.',
        question:
          'What conditions commonly enable the rise of authoritarian leaders? Consider the examples of Hitler in Germany and Mussolini in Italy.',
        options: [
          'Strong democratic institutions and economic prosperity',
          'Economic crisis, political instability, public fear, national humiliation, and a weak or divided democratic opposition',
          'High levels of education and media freedom',
          'Strong international alliances and peaceful foreign relations',
        ],
        correctIndex: 1,
        reward: 'Political Analyst Badge',
      },
      {
        id: 'g11-social-2-q3',
        spirit: 'Secret Eye',
        spiritEmoji: '🕵️',
        spiritColor: '#7C3AED',
        narrative:
          'The Secret Eye watches from every shadow — a spirit embodying the surveillance states that authoritarian regimes build to eliminate dissent.',
        question:
          'How did Stalin\'s use of the secret police (NKVD) and purges serve to maintain his authoritarian rule in the Soviet Union?',
        options: [
          'The secret police protected citizens\' rights and freedoms',
          'The NKVD enforced loyalty through fear by conducting surveillance, arresting perceived enemies, running forced labor camps (gulags), and executing political opponents — eliminating any potential threats to Stalin\'s power',
          'Stalin used the secret police only to fight external enemies',
          'The purges targeted only military officials and had no political purpose',
        ],
        correctIndex: 1,
        reward: 'Totalitarianism Scholar Badge',
      },
      {
        id: 'g11-social-2-q4',
        spirit: 'Ideology Forge',
        spiritEmoji: '⚒️',
        spiritColor: '#EF4444',
        narrative:
          'The Ideology Forge burns hot, molding the beliefs of an entire population. In its flames, individual thought is reshaped into collective obedience.',
        question:
          'Compare the ideological foundations of fascism and communism. How were they similar and different in practice?',
        options: [
          'They were identical ideologies with the same goals',
          'Both were authoritarian and used single-party states with secret police, but fascism emphasized nationalism, racial hierarchy, and corporate-state alliances, while communism claimed to pursue classless equality through state control of the economy',
          'Fascism was democratic while communism was authoritarian',
          'Neither ideology ever gained power in any country',
        ],
        correctIndex: 1,
        reward: 'Ideology Analyst Badge',
      },
      {
        id: 'g11-social-2-q5',
        spirit: 'Resistance Ember',
        spiritEmoji: '🕯️',
        spiritColor: '#14B8A6',
        narrative:
          'The Resistance Ember flickers defiantly in the darkness — a small but powerful light representing those who dared to oppose authoritarian rule at great personal risk.',
        question:
          'Why do authoritarian regimes ultimately tend to be unstable despite their apparent strength?',
        options: [
          'Because they have too many political parties competing for power',
          'Because they rely on coercion rather than genuine consent; suppressed opposition, economic mismanagement, succession crises, and the inability to adapt to changing conditions create internal contradictions that can lead to collapse',
          'Because they are always overthrown by foreign invasions',
          'Authoritarian regimes are actually the most stable form of government',
        ],
        correctIndex: 1,
        reward: 'Resistance Historian Badge',
      },
    ],
    bossChallenge: {
      question:
        'Using at least two specific authoritarian case studies, analyze how authoritarian regimes rise to power, maintain control, and eventually decline. What patterns emerge, and what lessons do these cases offer for safeguarding democratic institutions today?',
      answer: [
        'Authoritarian regimes like Nazi Germany and Stalinist Russia rose by exploiting economic crises, social fear, and political instability — using charismatic leadership, scapegoating, and promises of national restoration to gain popular support before dismantling democratic institutions.',
        'They maintained control through propaganda, censorship, secret police, cult of personality, control of education, and elimination of political opposition — creating systems where dissent was dangerous and compliance was rewarded.',
        'These regimes ultimately declined due to overextension (Nazi military defeat), economic stagnation (Soviet collapse), or internal contradictions — teaching us that protecting free press, independent judiciary, civil liberties, and democratic accountability is essential to preventing authoritarian resurgence.',
      ],
      reward: 'Obsidian Tribunal Master Certificate',
    },
  },

  // Quest 3: Independence Movements
  {
    id: 'g11-social-3',
    grade: 11,
    programme: 'DP',
    subject: 'social',
    title: 'Independence Movements',
    realmName: 'The Sovereign Dawn',
    narrativeWorld:
      'At the Sovereign Dawn, chains of colonial rule shatter as oppressed peoples rise to reclaim their land, culture, and self-determination. From the streets of Delhi to the savannahs of Africa, the spirits of freedom fighters call upon you to understand their struggles and triumphs.',
    characterTeacher: 'Liberator Kwame',
    teacherEmoji: '🏴',
    theme: 'Decolonization, national liberation, self-determination, and post-colonial challenges',
    questions: [
      {
        id: 'g11-social-3-q1',
        spirit: 'Salt March Spirit',
        spiritEmoji: '🧂',
        spiritColor: '#F97316',
        narrative:
          'The Salt March Spirit walks barefoot along a dusty road, leading thousands in a peaceful act of defiance against an empire that controlled even the most basic resources.',
        question:
          'How did Gandhi\'s Salt March of 1930 serve as a catalyst for Indian independence?',
        options: [
          'It was a violent uprising that forced the British to leave immediately',
          'It was a 240-mile march to protest the British salt tax, demonstrating the power of nonviolent civil disobedience, gaining international attention, and galvanizing mass participation in the independence movement',
          'It was a trade mission to establish new salt routes',
          'It had no significant impact on the independence movement',
        ],
        correctIndex: 1,
        reward: 'Civil Disobedience Badge',
      },
      {
        id: 'g11-social-3-q2',
        spirit: 'Pan-African Flame',
        spiritEmoji: '🌍',
        spiritColor: '#22C55E',
        narrative:
          'The Pan-African Flame burns across the continent, igniting movements for self-rule as African nations throw off the chains of European colonialism.',
        question:
          'What role did Pan-Africanism play in the decolonization of Africa during the mid-20th century?',
        options: [
          'It discouraged African nations from seeking independence',
          'Pan-Africanism promoted African unity, solidarity, and self-determination, inspiring leaders like Kwame Nkrumah and Julius Nyerere to lead independence movements and envision a united, self-governing Africa',
          'It was a European movement that supported continued colonization',
          'It only affected North African countries',
        ],
        correctIndex: 1,
        reward: 'Pan-African Scholar Badge',
      },
      {
        id: 'g11-social-3-q3',
        spirit: 'Partition Ghost',
        spiritEmoji: '💔',
        spiritColor: '#DC2626',
        narrative:
          'The Partition Ghost carries the weight of borders drawn hastily on maps — lines that divided communities, sparked violence, and created lasting wounds.',
        question:
          'What were the consequences of the partition of British India into India and Pakistan in 1947?',
        options: [
          'It was a peaceful and orderly process with no negative consequences',
          'It triggered massive communal violence, one of the largest mass migrations in history (10-15 million displaced), an estimated 1-2 million deaths, and created lasting tensions between India and Pakistan including disputes over Kashmir',
          'It only affected the ruling classes and had no impact on ordinary people',
          'Both countries immediately became stable and prosperous',
        ],
        correctIndex: 1,
        reward: 'Partition Historian Badge',
      },
      {
        id: 'g11-social-3-q4',
        spirit: 'Revolution Spark',
        spiritEmoji: '✨',
        spiritColor: '#8B5CF6',
        narrative:
          'The Revolution Spark dances between two paths — peaceful negotiation and armed struggle — reflecting the difficult choices faced by independence movements.',
        question:
          'Compare the approaches to independence used by Jomo Kenyatta in Kenya and Ho Chi Minh in Vietnam. What factors influenced their different strategies?',
        options: [
          'Both used identical nonviolent strategies',
          'Kenyatta combined political organizing with the Mau Mau uprising\'s pressure, while Ho Chi Minh led a prolonged armed struggle against France and later the US; their strategies reflected different colonial contexts, levels of repression, available international support, and ideological alignments',
          'Neither leader played any significant role in their country\'s independence',
          'Both relied solely on international diplomatic pressure',
        ],
        correctIndex: 1,
        reward: 'Liberation Strategy Badge',
      },
      {
        id: 'g11-social-3-q5',
        spirit: 'Neo-Colonial Shade',
        spiritEmoji: '🔗',
        spiritColor: '#6B7280',
        narrative:
          'The Neo-Colonial Shade reveals that even after flags were changed and anthems rewritten, invisible chains of economic and political influence remained.',
        question:
          'What is neo-colonialism, and how does it affect formerly colonized nations?',
        options: [
          'It is the re-establishment of direct colonial rule over former colonies',
          'It refers to the continued economic, political, and cultural influence that former colonial powers and multinational corporations exert over newly independent nations — through unfair trade terms, debt dependency, political interference, and cultural dominance',
          'It is a positive development program that helps former colonies modernize',
          'It does not exist; all former colonies are fully independent in every way',
        ],
        correctIndex: 1,
        reward: 'Post-Colonial Analyst Badge',
      },
    ],
    bossChallenge: {
      question:
        'Analyze the process of decolonization using specific case studies. How did different independence movements achieve their goals, what challenges did newly independent nations face, and to what extent have the legacies of colonialism been overcome?',
      answer: [
        'Independence movements employed diverse strategies — from Gandhi\'s nonviolent resistance in India to armed struggles in Algeria and Vietnam — shaped by the specific colonial context, level of settler presence, Cold War dynamics, and the intensity of colonial repression.',
        'Newly independent nations faced enormous challenges including arbitrary colonial borders grouping rival ethnic groups, underdeveloped economies structured to serve colonial interests, lack of trained administrators, Cold War interference, and internal power struggles.',
        'Colonial legacies persist through economic dependencies, political instability rooted in artificial borders, linguistic and cultural impacts, and neo-colonial influence by former powers and multinational corporations — though many nations have also built strong national identities and made significant development progress.',
      ],
      reward: 'Sovereign Dawn Master Certificate',
    },
  },

  // ===================== GRADE 12 DP =====================

  // Quest 2: Refugee Crises & Human Rights
  {
    id: 'g12-social-2',
    grade: 12,
    programme: 'DP',
    subject: 'social',
    title: 'Refugee Crises & Human Rights',
    realmName: 'The Asylum Threshold',
    narrativeWorld:
      'The Asylum Threshold exists between safety and danger — a shimmering borderland where displaced spirits plead for protection. The hall of human rights looms ahead, its doors guarded by ancient charters and modern conventions. Only those who truly understand the intersection of justice and compassion can enter.',
    characterTeacher: 'Advocate Noor',
    teacherEmoji: '🕊️',
    theme: 'Refugee crises, international humanitarian law, human rights frameworks, and global responsibility',
    questions: [
      {
        id: 'g12-social-2-q1',
        spirit: 'Charter Guardian',
        spiritEmoji: '📜',
        spiritColor: '#3B82F6',
        narrative:
          'The Charter Guardian holds a luminous scroll — the Universal Declaration of Human Rights — its articles glowing as they affirm the dignity of every person.',
        question:
          'How does the principle of non-refoulement protect refugees under international law, and what challenges exist in its enforcement?',
        options: [
          'Non-refoulement allows countries to return refugees to any country they choose',
          'It prohibits states from returning refugees to countries where they face serious threats, but enforcement is challenged by states using border externalization, safe third-country agreements, and narrow interpretations to circumvent their obligations',
          'It is a non-binding suggestion that countries can freely ignore',
          'It only applies during declared wars',
        ],
        correctIndex: 1,
        reward: 'International Law Badge',
      },
      {
        id: 'g12-social-2-q2',
        spirit: 'Conflict Phantom',
        spiritEmoji: '💥',
        spiritColor: '#EF4444',
        narrative:
          'The Conflict Phantom shows a map where crisis zones glow red — Syria, South Sudan, Myanmar, Afghanistan — each one generating millions of displaced people.',
        question:
          'Analyze the Syrian refugee crisis as a case study. What factors created one of the largest displacement crises in modern history?',
        options: [
          'A single natural disaster caused all Syrians to leave',
          'The combination of civil war, government repression, ISIS extremism, foreign military intervention, destruction of infrastructure, and economic collapse created a multi-layered crisis displacing over 13 million people internally and externally',
          'Only economic factors caused the Syrian refugee crisis',
          'The crisis was resolved quickly through international intervention',
        ],
        correctIndex: 1,
        reward: 'Crisis Analyst Badge',
      },
      {
        id: 'g12-social-2-q3',
        spirit: 'Stateless Whisper',
        spiritEmoji: '👤',
        spiritColor: '#6B7280',
        narrative:
          'The Stateless Whisper drifts without form or belonging — invisible to legal systems, denied the rights that citizenship provides.',
        question:
          'What is statelessness, and why does it represent a severe human rights crisis?',
        options: [
          'Statelessness simply means living in a rural area without a mailing address',
          'Statelessness occurs when a person is not recognized as a citizen by any country, leaving them without legal protections, access to education, healthcare, employment, or the ability to travel — effectively rendering them invisible to the international system',
          'Stateless people choose not to have citizenship',
          'Statelessness only affects a handful of people worldwide',
        ],
        correctIndex: 1,
        reward: 'Statelessness Awareness Badge',
      },
      {
        id: 'g12-social-2-q4',
        spirit: 'Burden Scale',
        spiritEmoji: '⚖️',
        spiritColor: '#A855F7',
        narrative:
          'The Burden Scale tips heavily to one side — developing nations hosting the vast majority of the world\'s refugees while wealthy nations debate their responsibilities.',
        question:
          'Evaluate the concept of "responsibility-sharing" in the global refugee regime. Why has it been difficult to achieve?',
        options: [
          'All countries share refugee hosting responsibilities equally already',
          'Responsibility-sharing is hindered by national self-interest, rising populism and anti-immigrant sentiment, sovereignty concerns, disagreements over fair distribution criteria, and the political costs of accepting refugees — resulting in developing nations hosting 85% of the world\'s refugees',
          'Wealthy nations host the majority of refugees',
          'The concept of responsibility-sharing has never been proposed',
        ],
        correctIndex: 1,
        reward: 'Global Equity Badge',
      },
      {
        id: 'g12-social-2-q5',
        spirit: 'Dignity Beacon',
        spiritEmoji: '🌟',
        spiritColor: '#10B981',
        narrative:
          'The Dignity Beacon shines through the darkness, illuminating stories of resilience — refugees who rebuild their lives, contribute to their host communities, and refuse to be defined by their displacement.',
        question:
          'How can the international community move beyond a purely humanitarian response to refugee crises toward more sustainable, rights-based approaches?',
        options: [
          'By building more refugee camps and increasing food aid',
          'By shifting focus to include refugees\' rights to work, education, and self-sufficiency; addressing root causes of displacement; creating legal pathways for migration; and involving refugees in policy decisions that affect their lives',
          'By closing all borders to prevent refugee movements',
          'By leaving the issue entirely to the UNHCR without government involvement',
        ],
        correctIndex: 1,
        reward: 'Rights-Based Approach Badge',
      },
    ],
    bossChallenge: {
      question:
        'Critically evaluate the international refugee protection system. Is it fit for purpose in the 21st century? Consider the 1951 Convention, current crises, emerging challenges like climate displacement, and propose reforms that could better protect displaced populations while addressing the legitimate concerns of host states.',
      answer: [
        'The 1951 Refugee Convention was designed for post-WWII European displacement and does not adequately address modern challenges including climate-induced displacement, protracted crises, mixed migration flows, and the scale of current displacement (over 100 million people worldwide).',
        'The system suffers from enforcement gaps, unequal burden-sharing (with developing nations hosting the vast majority of refugees), politicization of asylum, the exclusion of climate refugees from legal protection, and the tension between state sovereignty and humanitarian obligations.',
        'Reforms should include expanding the definition of refugees to include climate-displaced persons, creating binding responsibility-sharing mechanisms, investing in root-cause prevention, establishing more legal migration pathways, and empowering refugees through rights to work, education, and participation in decisions affecting their lives.',
      ],
      reward: 'Asylum Threshold Master Certificate',
    },
  },

  // Quest 3: Climate Change & Global Cooperation
  {
    id: 'g12-social-3',
    grade: 12,
    programme: 'DP',
    subject: 'social',
    title: 'Climate Change & Global Cooperation',
    realmName: 'The Ember Accord',
    narrativeWorld:
      'The Ember Accord is a realm teetering on the edge — rising seas lap at crumbling cities, fires rage across withered forests, and yet in the center stands a great council hall where nations must find the will to act together. The fate of this world depends on cooperation, sacrifice, and visionary leadership.',
    characterTeacher: 'Envoy Solara',
    teacherEmoji: '🌏',
    theme: 'Climate change science and policy, international cooperation, environmental governance, and global equity',
    questions: [
      {
        id: 'g12-social-3-q1',
        spirit: 'Tipping Point Oracle',
        spiritEmoji: '⏳',
        spiritColor: '#EF4444',
        narrative:
          'The Tipping Point Oracle counts down with grim precision, showing how interconnected climate systems can reach irreversible thresholds that cascade into catastrophic change.',
        question:
          'What are climate "tipping points," and why do scientists consider them particularly dangerous?',
        options: [
          'Minor weather fluctuations that have no long-term impact',
          'Critical thresholds in the climate system — such as the collapse of ice sheets, Amazon rainforest dieback, or permafrost thaw — beyond which changes become self-reinforcing and potentially irreversible, even if emissions are reduced',
          'Points at which climate change begins to reverse naturally',
          'Political deadlines set by governments for climate action',
        ],
        correctIndex: 1,
        reward: 'Climate Systems Badge',
      },
      {
        id: 'g12-social-3-q2',
        spirit: 'Equity Flame',
        spiritEmoji: '🔥',
        spiritColor: '#F59E0B',
        narrative:
          'The Equity Flame burns between a coal-powered factory and a drought-stricken village, illuminating the moral dimensions of climate change.',
        question:
          'Explain the principle of "common but differentiated responsibilities" (CBDR) in international climate negotiations. Why is it contentious?',
        options: [
          'It means all countries must reduce emissions by the same amount',
          'CBDR acknowledges that all nations share responsibility for climate change but that industrialized nations, having contributed most historical emissions, should bear greater costs; it is contentious because emerging economies like China and India resist binding targets while developed nations argue that current major emitters must also act aggressively',
          'It is a principle that exempts all developing countries from any climate action',
          'It was a concept rejected at all international climate conferences',
        ],
        correctIndex: 1,
        reward: 'Climate Equity Badge',
      },
      {
        id: 'g12-social-3-q3',
        spirit: 'Market Architect',
        spiritEmoji: '💹',
        spiritColor: '#10B981',
        narrative:
          'The Market Architect designs economic mechanisms that put a price on pollution — attempting to use market forces to drive the transition to a low-carbon economy.',
        question:
          'Evaluate carbon pricing mechanisms (carbon taxes and cap-and-trade systems) as tools for reducing emissions. What are their strengths and limitations?',
        options: [
          'Carbon pricing has been universally rejected as ineffective',
          'Carbon taxes provide price certainty and simplicity while cap-and-trade guarantees emission limits; both incentivize emission reductions, but face challenges including political opposition, potential economic impacts on vulnerable populations, carbon leakage to unregulated jurisdictions, and difficulties in setting the right price or cap level',
          'Carbon pricing only benefits fossil fuel companies',
          'These mechanisms have never been implemented anywhere',
        ],
        correctIndex: 1,
        reward: 'Economic Policy Badge',
      },
      {
        id: 'g12-social-3-q4',
        spirit: 'Adaptation Weaver',
        spiritEmoji: '🛡️',
        spiritColor: '#6366F1',
        narrative:
          'The Adaptation Weaver constructs shields against floods, drought, and storms — recognizing that some climate impacts are now unavoidable and communities must prepare.',
        question:
          'Why must climate policy address both mitigation (reducing emissions) and adaptation (preparing for impacts), and how do the needs of developed and developing nations differ?',
        options: [
          'Only mitigation matters; adaptation is unnecessary',
          'Even with aggressive emission cuts, some warming is locked in, making adaptation essential; developing nations often need more adaptation support because they are more vulnerable to climate impacts yet have fewer resources, while developed nations must lead on mitigation given their higher per-capita emissions and historical responsibility',
          'Developed nations need more adaptation support than developing nations',
          'Adaptation and mitigation are the same thing',
        ],
        correctIndex: 1,
        reward: 'Adaptation Strategist Badge',
      },
      {
        id: 'g12-social-3-q5',
        spirit: 'Youth Vanguard',
        spiritEmoji: '🌱',
        spiritColor: '#22C55E',
        narrative:
          'The Youth Vanguard marches forward — a new generation demanding that leaders act on climate before it is too late, using activism, legal challenges, and innovation to force change.',
        question:
          'Assess the role of youth climate activism (such as Fridays for Future) and climate litigation in driving policy change. How effective have these approaches been?',
        options: [
          'Youth activism has had no impact on climate policy',
          'Youth movements have raised global awareness, influenced public opinion, and pressured governments to declare climate emergencies; climate litigation has achieved landmark rulings (like Urgenda v. Netherlands) forcing governments to strengthen emission targets — though translating awareness into binding policy and actual emission reductions remains an ongoing challenge',
          'Only governments and corporations can influence climate policy',
          'Legal challenges against climate inaction have all been dismissed by courts',
        ],
        correctIndex: 1,
        reward: 'Climate Action Badge',
      },
    ],
    bossChallenge: {
      question:
        'Design a comprehensive global climate cooperation framework that addresses the failures of existing approaches. Your framework should consider equity between nations, enforcement mechanisms, financing, the role of non-state actors, and how to achieve the ambitious targets needed to avoid the worst climate scenarios.',
      answer: [
        'An effective framework must move beyond voluntary national pledges to include binding emission targets with transparent monitoring and meaningful consequences for non-compliance, while respecting CBDR by requiring steeper cuts from historically high-emitting nations and providing financial and technological support to developing nations through mechanisms like a reformed Green Climate Fund.',
        'Financing must be scaled dramatically through carbon border adjustment mechanisms, redirecting fossil fuel subsidies, innovative instruments like climate debt swaps, and ensuring that the $100 billion annual pledge to developing nations is not only met but increased to reflect actual adaptation and mitigation needs.',
        'Non-state actors — cities, corporations, indigenous communities, youth movements, and scientific institutions — must be formally integrated into governance structures, and frameworks must address climate justice by centering the voices of most-affected communities, protecting climate migrants, and ensuring that the transition to clean energy does not deepen existing inequalities.',
      ],
      reward: 'Ember Accord Master Certificate',
    },
  },
];

export default SOCIAL_QUESTS;