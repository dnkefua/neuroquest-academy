import type { ScienceQuestion } from '../store/gameStore';

export interface ScienceQuest {
  id: string;
  title: string;
  subtitle: string;
  emoji: string;
  locationName: string;
  locationType: 'hut' | 'village' | 'city' | 'castle' | 'boss';
  color: string;
  glowColor: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced' | 'Boss';
  briefingTitle: string;
  briefingDescription: string;
  teacherName: string;
  teacherEmoji: string;
  questions: ScienceQuestion[];
}

// ── Quest 1: Water Cycle Basics (Beginner) ───────────────────────────────────
const QUEST_1_QUESTIONS: ScienceQuestion[] = [
  {
    id: 1,
    spirit: 'Evie Evaporation', spiritEmoji: '☀️', spiritColor: '#F59E0B',
    narrative: "Evie points to the oasis pool shimmering in the hot UAE sun. 'Omar, watch! The sun is heating the water in this pool. Look what happens next!'",
    question: "What happens to water when the sun heats it?",
    options: [
      "It turns into water vapor and rises into the sky",
      "It turns into ice and sinks to the bottom",
      "It turns into sand and disappears",
      "It stays exactly the same",
    ],
    correct: 0,
    activeStage: 'evaporation',
    reward: 'Crystal Vial 1 💧',
    clue: {
      title: "What is Evaporation?",
      example: "EVAPORATION = liquid water → water vapor (invisible gas)\n\nThe SUN provides heat energy.\nHeat makes water molecules move FASTER.\nThey move so fast they escape into the AIR!\nThis is why puddles disappear after rain! ☀️",
      highlightStage: 'evaporation',
    },
  },
  {
    id: 2,
    spirit: 'Coco Condensation', spiritEmoji: '☁️', spiritColor: '#93C5FD',
    narrative: "Coco swirls around a cold glass of water. Tiny droplets are forming on the OUTSIDE of the glass. 'See, Omar? This is my power!'",
    question: "Why do water droplets form on the outside of a cold glass?",
    options: [
      "The cold glass cools the warm air around it, turning vapor into droplets",
      "Water leaks through the glass from inside",
      "The glass is sweating because it is nervous",
      "Hot air makes water appear from nowhere",
    ],
    correct: 0,
    activeStage: 'condensation',
    reward: 'Crystal Vial 2 💧',
    clue: {
      title: "What is Condensation?",
      example: "CONDENSATION = water vapor (gas) → liquid droplets\n\nWarm air holds invisible water vapor.\nWhen warm air touches something COLD...\nThe vapor cools and turns back into tiny droplets!\nThis is exactly how CLOUDS form high in the sky! ☁️",
      highlightStage: 'condensation',
    },
  },
  {
    id: 3,
    spirit: 'Petra Precipitation', spiritEmoji: '🌧️', spiritColor: '#3B82F6',
    narrative: "Petra puffs up dramatically, turning dark gray. 'Omar! Look at me — I am VERY heavy with water today. Something is about to happen...'",
    question: "What causes a cloud to release water as rain?",
    options: [
      "The cloud collects so many droplets it becomes too heavy to hold them",
      "The cloud gets bored and wants to throw water",
      "The sun tells the cloud exactly when to rain",
      "Clouds only rain during nighttime",
    ],
    correct: 0,
    activeStage: 'precipitation',
    reward: 'Crystal Vial 3 💧',
    clue: {
      title: "What is Precipitation?",
      example: "PRECIPITATION = water falling from clouds to Earth\n\nClouds are made of MILLIONS of tiny droplets.\nAs more vapor condenses, droplets get BIGGER.\nWhen too heavy to float → they FALL as rain! 🌧️\nIn cold places: snow ❄️, sleet, or hail fall instead!",
      highlightStage: 'precipitation',
    },
  },
  {
    id: 4,
    spirit: 'Colly Collection', spiritEmoji: '💧', spiritColor: '#14B8A6',
    narrative: "After the rain, Colly points to a tiny stream forming in the sand, flowing toward the oasis. 'Watch where the water goes, Omar! It knows the way home.'",
    question: "After rain falls on land, where does most of the water go?",
    options: [
      "It flows into rivers, lakes, and oceans, or soaks into the ground",
      "It immediately evaporates straight back into the sky",
      "It turns into sand",
      "It floats back up to the clouds instantly",
    ],
    correct: 0,
    activeStage: 'collection',
    reward: 'Crystal Vial 4 💧',
    clue: {
      title: "What is Collection?",
      example: "COLLECTION = water gathers on Earth's surface\n\nRain flows DOWNHILL (gravity pulls it).\nIt collects in: rivers 🏞️, lakes, and oceans 🌊\nSome soaks INTO the ground → GROUNDWATER\nThis stored water waits for the sun to start again!\nThe cycle never ends! ♾️",
      highlightStage: 'collection',
    },
  },
  {
    id: 5,
    spirit: 'ALL FOUR SPIRITS', spiritEmoji: '🌀', spiritColor: '#A78BFA',
    narrative: "All four Cloud Spirits join hands and spin around Omar in a glowing circle. 'FINAL CHALLENGE, young scientist! Put the whole cycle in the correct order!'",
    question: "What is the CORRECT order of the water cycle?",
    options: [
      "Evaporation → Condensation → Precipitation → Collection",
      "Precipitation → Evaporation → Collection → Condensation",
      "Collection → Precipitation → Condensation → Evaporation",
      "Condensation → Collection → Evaporation → Precipitation",
    ],
    correct: 0,
    activeStage: 'all',
    reward: 'FOUNTAIN RESTORED! 🎉',
    clue: {
      title: "The Complete Water Cycle Order",
      example: "Remember with: 'Every Cat Plays Carefully'\n\n☀️ E-vaporation  → water rises as vapor\n☁️ C-ondensation → vapor cools, clouds form\n🌧️ P-recipitation → rain/snow falls down\n💧 C-ollection   → water fills rivers & oceans\n\nThen the sun heats it again → repeat forever! ♾️",
      highlightStage: 'all',
    },
  },
];

// ── Quest 2: Clouds & Precipitation (Intermediate) ────────────────────────────
const QUEST_2_QUESTIONS: ScienceQuestion[] = [
  {
    id: 1,
    spirit: 'Cloud Whisperer', spiritEmoji: '☁️', spiritColor: '#94A3B8',
    narrative: "Cloud Whisperer floats beside different cloud formations. 'Omar, not all clouds are the same! Each type brings different weather. Let me show you...'",
    question: "Which type of cloud is fluffy, white, and usually means fair weather?",
    options: [
      "Cumulus clouds",
      "Stratus clouds",
      "Cirrus clouds",
      "Nimbus clouds",
    ],
    correct: 0,
    activeStage: 'evaporation',
    reward: 'Cloud Vial 1 ☁️',
    clue: {
      title: "Cumulus Clouds",
      example: "CUMULUS = fluffy, white, cotton-ball clouds\n\nThey look like sheep floating in the sky! 🐑\nUsually mean FAIR weather (sunny days).\nIf they grow tall → can become thunderstorms!\nName comes from Latin 'cumulare' = to heap",
      highlightStage: 'evaporation',
    },
  },
  {
    id: 2,
    spirit: 'Storm Chaser', spiritEmoji: '⛈️', spiritColor: '#7C3AED',
    narrative: "Storm Chaser points to dark, towering clouds on the horizon. 'Those are cumulonimbus clouds, Omar. They are the giants of the sky!'",
    question: "What type of cloud produces thunderstorms and heavy rain?",
    options: [
      "Cumulonimbus clouds",
      "Cirrus clouds",
      "Stratus clouds",
      "Fair weather cumulus clouds",
    ],
    correct: 0,
    activeStage: 'condensation',
    reward: 'Cloud Vial 2 ⛈️',
    clue: {
      title: "Cumulonimbus Clouds",
      example: "CUMULONIMBUS = thunderstorm clouds\n\nTall, dark, tower-like shape!\nCan reach 12km high into the sky.\nProduce: heavy rain ⛈️, lightning ⚡, thunder!\nName: 'cumulo' (heap) + 'nimbus' (rain)",
      highlightStage: 'condensation',
    },
  },
  {
    id: 3,
    spirit: 'Frost Guardian', spiritEmoji: '❄️', spiritColor: '#67E8F9',
    narrative: "Frost Guardian shows Omar tiny ice crystals falling from gray clouds. 'When clouds get very cold, the water doesn't fall as rain. Watch...'",
    question: "What happens when cloud droplets freeze before falling to Earth?",
    options: [
      "They fall as snow, sleet, or hail instead of rain",
      "They turn into fog and stay in the air",
      "They turn back into water vapor",
      "They disappear completely",
    ],
    correct: 0,
    activeStage: 'precipitation',
    reward: 'Cloud Vial 3 ❄️',
    clue: {
      title: "Frozen Precipitation",
      example: "When clouds are below 0°C:\n\n❄️ SNOW = ice crystals form beautiful patterns\n🌨️ SLEET = rain freezes on the way down\n🎾 HAIL = ice balls bounce up and down in storms!\n\nTemperature determines what falls from the sky!",
      highlightStage: 'precipitation',
    },
  },
  {
    id: 4,
    spirit: 'Rain Tracker', spiritEmoji: '🌧️', spiritColor: '#3B82F6',
    narrative: "Rain Tracker holds a measuring cup. 'Omar, scientists measure how much rain falls. Different places get different amounts!'",
    question: "Which of these correctly describes rain and snow?",
    options: [
      "Rain is liquid precipitation; snow is frozen precipitation",
      "Rain and snow are both gases",
      "Snow evaporates before reaching the ground",
      "Rain only falls at night",
    ],
    correct: 0,
    activeStage: 'precipitation',
    reward: 'Cloud Vial 4 🌧️',
    clue: {
      title: "Types of Precipitation",
      example: "PRECIPITATION = water falling from clouds\n\n🌧️ RAIN = liquid droplets (above 0°C)\n❄️ SNOW = frozen crystals (below 0°C)\n🌨️ SLEET = frozen raindrops\n🎾 HAIL = ice balls from thunderstorms\n\nAll come from clouds, but temperature decides the form!",
      highlightStage: 'precipitation',
    },
  },
  {
    id: 5,
    spirit: 'SKY MASTER', spiritEmoji: '🌈', spiritColor: '#F59E0B',
    narrative: "All the spirits gather for the final challenge. 'Omar, show us you understand clouds and precipitation! Answer correctly to earn the Rainbow Badge!'",
    question: "Which cloud type and precipitation pair is CORRECT?",
    options: [
      "Cirrus clouds are thin and wispy; cumulonimbus produce thunderstorms",
      "Cirrus clouds produce heavy rain; cumulus are always storm clouds",
      "Nimbus means fair weather; stratus are tall and fluffy",
      "Cumulus clouds freeze into snow; cirrus are the tallest clouds",
    ],
    correct: 0,
    activeStage: 'all',
    reward: 'RAINBADGE EARNED! 🌈',
    clue: {
      title: "Cloud Types Summary",
      example: "Remember the cloud families:\n\n☁️ CUMULUS = fluffy, fair weather\n⛈️ CUMULONIMBUS = thunderstorm giants\n🌫️ STRATUS = flat gray blanket\n🌤️ CIRRUS = thin, wispy, very high\n🌧️ NIMBUS = rain-bearing clouds\n\n'Cumulo' = heap, 'Strato' = layer, 'Cirro' = curl",
      highlightStage: 'all',
    },
  },
];

// ── Quest 3: Groundwater & Runoff (Advanced) ──────────────────────────────────
const QUEST_3_QUESTIONS: ScienceQuestion[] = [
  {
    id: 1,
    spirit: 'Drip Explorer', spiritEmoji: '💧', spiritColor: '#0EA5E9',
    narrative: "Drip Explorer points to a hole in the ground. 'Omar, this is a well! Water hides underground. Let me show you how it gets there...'",
    question: "What is groundwater?",
    options: [
      "Water that has soaked into the ground and fills spaces in soil and rock",
      "Water that flows on top of the ground in rivers",
      "Water that comes from melting ice in mountains",
      "Water that is pumped into the ground by humans",
    ],
    correct: 0,
    activeStage: 'collection',
    reward: 'Groundwater Vial 1 💧',
    clue: {
      title: "What is Groundwater?",
      example: "GROUNDWATER = water stored underground\n\nWhen rain falls, some water soaks IN.\nIt fills tiny spaces between soil particles.\nLike a sponge soaking up water!\n💧 The underground layer holding water = AQUIFER\nWells dig down to reach this hidden water!",
      highlightStage: 'collection',
    },
  },
  {
    id: 2,
    spirit: 'Stream Guide', spiritEmoji: '🏞️', spiritColor: '#10B981',
    narrative: "Stream Guide shows Omar water flowing downhill after rain. 'This is runoff! Watch how water always finds the lowest path...'",
    question: "What is runoff and why does it happen?",
    options: [
      "Water flowing over the ground when soil cannot absorb more water",
      "Water evaporating from puddles",
      "Water turning into ice underground",
      "Water moving upward through plants",
    ],
    correct: 0,
    activeStage: 'collection',
    reward: 'Groundwater Vial 2 🏞️',
    clue: {
      title: "What is Runoff?",
      example: "RUNOFF = water that flows OVER the ground\n\nWhen soil is SATURATED (full), water can't soak in.\nGravity pulls water DOWNHILL.\nRunoff forms: streams → rivers → oceans 🌊\n\nMore runoff happens when:\n- Heavy rain falls fast\n- Ground is already wet\n- Surface is paved (roads, parking lots)",
      highlightStage: 'collection',
    },
  },
  {
    id: 3,
    spirit: 'Aquifer Keeper', spiritEmoji: '🌊', spiritColor: '#6366F1',
    narrative: "Aquifer Keeper guides Omar deep underground. 'Beneath us lies an aquifer — a vast underground water reservoir. Cities depend on it!'",
    question: "What is an aquifer?",
    options: [
      "A layer of rock or sediment that stores and transmits water",
      "A man-made water tank",
      "A type of cloud that stores rain",
      "A surface lake that feeds rivers",
    ],
    correct: 0,
    activeStage: 'collection',
    reward: 'Groundwater Vial 3 🌊',
    clue: {
      title: "What is an Aquifer?",
      example: "AQUIFER = underground water storage\n\nMade of porous rock or sediment.\nLike a giant underground sponge!\nWater can be pumped out through wells.\n\nExamples:\n🪨 Sandstone aquifers\n🕳️ Limestone aquifers\n\n⚠️ Aquifers can run DRY if we pump too fast!",
      highlightStage: 'collection',
    },
  },
  {
    id: 4,
    spirit: 'Spring Finder', spiritEmoji: '🌿', spiritColor: '#22C55E',
    narrative: "Spring Finder shows Omar water bubbling up from the ground. 'Sometimes groundwater finds its way back to the surface! This is a natural spring.'",
    question: "How does groundwater return to the surface naturally?",
    options: [
      "Through springs where the water table meets the ground surface",
      "By evaporating directly from underground",
      "Through animal burrows",
      "It never returns to the surface naturally",
    ],
    correct: 0,
    activeStage: 'collection',
    reward: 'Groundwater Vial 4 🌿',
    clue: {
      title: "Springs and Water Tables",
      example: "WATER TABLE = top level of groundwater\n\nWhen ground slopes down...\nThe water table reaches the surface →\n💧 SPRINGS appear!\n\nSprings feed streams and wetlands.\nSome springs are hot (geothermal)!\nOthers are cold and crystal clear.",
      highlightStage: 'collection',
    },
  },
  {
    id: 5,
    spirit: 'WATER CYCLE GUARDIAN', spiritEmoji: '🌀', spiritColor: '#14B8A6',
    narrative: "All the spirits gather for the advanced challenge. 'Omar, now you understand the hidden world of groundwater! Prove your mastery!'",
    question: "Which statement correctly describes the relationship between groundwater, runoff, and aquifers?",
    options: [
      "Runoff can replenish aquifers; aquifers store groundwater; wells access aquifers",
      "Aquifers produce runoff; groundwater flows uphill; wells create water",
      "Runoff evaporates from aquifers; groundwater is surface water; springs are man-made",
      "Aquifers are found in clouds; runoff becomes groundwater instantly; wells store water",
    ],
    correct: 0,
    activeStage: 'all',
    reward: 'GROUNDWATER BADGE! 🌊',
    clue: {
      title: "Groundwater System Summary",
      example: "The Hidden Water Journey:\n\n🌧️ Rain falls → some soaks IN (infiltration)\n💧 Groundwater fills spaces underground\n🪨 Aquifers store this water\n🏞️ Runoff = water that flows OVER ground\n🌊 Springs = groundwater returning to surface\n\nHumans dig wells to access aquifer water!\nProtect groundwater — it can take YEARS to refill!",
      highlightStage: 'all',
    },
  },
];

// ── Quest 4: The Water Guardian (Boss) ────────────────────────────────────────
const QUEST_4_QUESTIONS: ScienceQuestion[] = [
  {
    id: 1,
    spirit: 'WATER GUARDIAN', spiritEmoji: '🌊', spiritColor: '#3B82F6',
    narrative: "The Water Guardian rises from the depths, a massive spirit combining all water forms. 'Omar, you have learned much. Now show me the complete water cycle!'",
    question: "Which is the CORRECT sequence of water cycle stages?",
    options: [
      "Evaporation → Condensation → Precipitation → Collection/Runoff",
      "Precipitation → Evaporation → Collection → Condensation",
      "Collection → Evaporation → Condensation → Precipitation",
      "Condensation → Collection → Runoff → Evaporation",
    ],
    correct: 0,
    activeStage: 'all',
    reward: 'Guardian Vial 1 🌊',
    clue: {
      title: "The Complete Water Cycle",
      example: "Remember the journey:\n\n☀️ EVAPORATION: Sun heats water → vapor rises\n☁️ CONDENSATION: Vapor cools → clouds form\n🌧️ PRECIPITATION: Clouds release water → rain/snow\n💧 COLLECTION: Water flows to rivers/oceans/ground\n\nThen the sun heats it again → CYCLE REPEATS! ♾️",
      highlightStage: 'all',
    },
  },
  {
    id: 2,
    spirit: 'Water Guardian', spiritEmoji: '🌀', spiritColor: '#6366F1',
    narrative: "The Guardian shows Omar clouds forming over mountains. 'High altitude changes everything. What happens when clouds reach cold mountain peaks?'",
    question: "What happens to precipitation at high elevations or cold temperatures?",
    options: [
      "It falls as snow or ice instead of rain",
      "It evaporates before reaching the ground",
      "It turns into groundwater immediately",
      "It becomes invisible",
    ],
    correct: 0,
    activeStage: 'precipitation',
    reward: 'Guardian Vial 2 🌀',
    clue: {
      title: "Cold Weather Precipitation",
      example: "Temperature determines the form:\n\n🌡️ WARM: Rain (liquid droplets)\n❄️ COLD: Snow (ice crystals)\n🌨️ VERY COLD: Sleet (frozen raindrops)\n🎾 STORMS: Hail (bouncing ice balls)\n\nHigher elevation = colder = frozen precipitation!",
      highlightStage: 'precipitation',
    },
  },
  {
    id: 3,
    spirit: 'Water Guardian', spiritEmoji: '🌍', spiritColor: '#22C55E',
    narrative: "The Guardian shows two landscapes: a forest and a paved city. 'Same rain, different outcomes. What is the difference in runoff?'",
    question: "Why does a city have more runoff than a forest?",
    options: [
      "Cities have paved surfaces that water cannot soak into, while forests have soil that absorbs water",
      "Cities receive more rain than forests",
      "Forests have more groundwater stored underground",
      "Cities have fewer clouds than forests",
    ],
    correct: 0,
    activeStage: 'collection',
    reward: 'Guardian Vial 3 🌍',
    clue: {
      title: "Surface Types and Runoff",
      example: "SURFACE determines runoff amount:\n\n🌲 FOREST: Soil absorbs water → LESS runoff\n🏙️ CITY: Pavement blocks water → MORE runoff\n\nCities need STORM DRAINS to prevent flooding!\n\nUrban planning must consider:\n- Permeable surfaces (let water through)\n- Retention ponds\n- Green spaces to absorb rain",
      highlightStage: 'collection',
    },
  },
  {
    id: 4,
    spirit: 'Water Guardian', spiritEmoji: '☀️', spiritColor: '#F59E0B',
    narrative: "The Guardian asks about the invisible parts of the cycle. 'The sun is the engine of the water cycle. How does it drive evaporation?'",
    question: "How does the sun drive the water cycle?",
    options: [
      "The sun provides heat energy that causes water to evaporate, starting the cycle",
      "The sun physically pushes water into the sky",
      "The sun creates groundwater directly",
      "The sun freezes water in clouds",
    ],
    correct: 0,
    activeStage: 'evaporation',
    reward: 'Guardian Vial 4 ☀️',
    clue: {
      title: "The Sun's Role",
      example: "The SUN is the WATER CYCLE'S ENGINE!\n\n☀️ Solar energy HEATS water molecules\n💨 Molecules move faster and ESCAPE as vapor\n☁️ Vapor rises, cools, forms clouds\n\nWithout the sun:\n❌ No evaporation\n❌ No clouds\n❌ No precipitation\n\nThe sun powers the ENTIRE cycle!",
      highlightStage: 'evaporation',
    },
  },
  {
    id: 5,
    spirit: 'WATER GUARDIAN FINAL', spiritEmoji: '🏆', spiritColor: '#A78BFA',
    narrative: "The Guardian stands tall for the final challenge. 'Omar, you have mastered the water cycle, clouds, and groundwater. One last question to become a Water Master!'",
    question: "Which BEST describes the water cycle as a closed system?",
    options: [
      "Water continuously cycles through evaporation, condensation, and precipitation, never leaving Earth",
      "Water is created new each time it rains",
      "Water disappears when it evaporates and new water arrives from space",
      "The water cycle only happens in deserts",
    ],
    correct: 0,
    activeStage: 'all',
    reward: 'WATER MASTER ACHIEVED! 🏆',
    clue: {
      title: "The Water Cycle is a Closed System",
      example: "CLOSED SYSTEM = same water cycles forever!\n\nThe water you drink today could be:\n💧 Dinosaur drinking water!\n🌊 From an ancient ocean!\n❄️ From an ice age glacier!\n\nWater is RECYCLED on Earth:\n- Same water for billions of years\n- Never created or destroyed\n- Just changes form: liquid ↔ gas ↔ solid\n\nThis is why protecting water quality matters!",
      highlightStage: 'all',
    },
  },
];

// ── Quest registry ───────────────────────────────────────────────────────────
export const SCIENCE_QUESTS: ScienceQuest[] = [
  {
    id: 'g6-science-q1',
    title: 'Oasis Springs',
    subtitle: 'Water Cycle Basics',
    emoji: '💧',
    locationName: 'Desert Oasis',
    locationType: 'hut',
    color: '#0EA5E9',
    glowColor: 'rgba(14,165,233,0.5)',
    difficulty: 'Beginner',
    briefingTitle: 'The Water Cycle Expedition',
    briefingDescription: 'Learn the four stages of the water cycle with the Cloud Spirits! Begin your journey at a mysterious desert oasis.',
    teacherName: 'Aqua Specter',
    teacherEmoji: '🌊',
    questions: QUEST_1_QUESTIONS,
  },
  {
    id: 'g6-science-q2',
    title: 'Cloud Kingdom',
    subtitle: 'Clouds & Precipitation',
    emoji: '☁️',
    locationName: 'Cloud Village',
    locationType: 'village',
    color: '#6366F1',
    glowColor: 'rgba(99,102,241,0.5)',
    difficulty: 'Intermediate',
    briefingTitle: 'Cloud Types and Precipitation',
    briefingDescription: 'Master the different types of clouds and understand how rain, snow, and hail form in the atmosphere!',
    teacherName: 'Cloud Whisperer',
    teacherEmoji: '☁️',
    questions: QUEST_2_QUESTIONS,
  },
  {
    id: 'g6-science-q3',
    title: 'Aquifer Depths',
    subtitle: 'Groundwater & Runoff',
    emoji: '🌊',
    locationName: 'Underground City',
    locationType: 'city',
    color: '#10B981',
    glowColor: 'rgba(16,185,129,0.5)',
    difficulty: 'Advanced',
    briefingTitle: 'Journey into the Ground',
    briefingDescription: 'Explore the hidden world of groundwater! Learn about aquifers, runoff, and how water moves beneath our feet.',
    teacherName: 'Aquifer Keeper',
    teacherEmoji: '🪨',
    questions: QUEST_3_QUESTIONS,
  },
  {
    id: 'g6-science-q4',
    title: 'The Water Guardian',
    subtitle: 'BOSS BATTLE — Master the Water Cycle',
    emoji: '🌀',
    locationName: "Guardian's Domain",
    locationType: 'boss',
    color: '#F97316',
    glowColor: 'rgba(249,115,22,0.6)',
    difficulty: 'Boss',
    briefingTitle: 'BOSS: Face the Water Guardian!',
    briefingDescription: 'Prove your mastery of the complete water cycle in this ultimate challenge! Combine everything you have learned.',
    teacherName: 'Water Guardian',
    teacherEmoji: '🏆',
    questions: QUEST_4_QUESTIONS,
  },
];

export const getQuestById = (id: string) => SCIENCE_QUESTS.find(q => q.id === id);
export const getNextQuest = (currentId: string) => {
  const idx = SCIENCE_QUESTS.findIndex(q => q.id === currentId);
  return idx >= 0 && idx < SCIENCE_QUESTS.length - 1 ? SCIENCE_QUESTS[idx + 1] : null;
};