export const SCIENCE_MISSION_DIALOGUE = [
  "Welcome to the Rub' al Khali — the Empty Quarter! 🏜️",
  "The village fountain has run dry. The people are thirsty!",
  "To fix it, you must collect 4 Crystal Vials of pure water.",
  "But look up... those clouds are ALIVE! 👆",
  "The Cloud Spirits control all the water in the sky!",
  "They say: 'Prove you know the Water Cycle... or stay THIRSTY!'",
  "You'll need to understand how water travels through our world.",
  "Are you ready to become a Water Cycle expert? 💧",
];

export interface TeachingPanel {
  character: string;
  color: string;
  emoji: string;
  title: string;
  content: string;
  visual: 'cycle_diagram' | 'evaporation' | 'condensation' | 'precipitation' | 'collection' | 'full_cycle' | null;
  highlightStage?: string;
}

export const CLOUD_PANELS: TeachingPanel[] = [
  {
    character: 'All Cloud Spirits',
    color: '#A78BFA',
    emoji: '🌀',
    title: 'We are the CLOUD SPIRITS — Guardians of Water!',
    content: 'Water never disappears. It travels in an endless loop!\nWe call it... THE WATER CYCLE 🌀\n\nIt has four stages: Evaporation, Condensation,\nPrecipitation, and Collection.\n\nLearn them all... and we set you FREE! 🗝️',
    visual: 'cycle_diagram',
    highlightStage: 'all',
  },
  {
    character: 'Evie Evaporation',
    color: '#F59E0B',
    emoji: '☀️',
    title: 'I am EVAPORATION! Heat is my superpower!',
    content: 'The SUN heats water in oceans, rivers, and lakes.\nThe water turns into WATER VAPOR — an invisible gas!\nIt rises HIGH into the sky to find the clouds. ⬆️\n\nIn the UAE, the hot desert sun evaporates water\nfrom the Persian Gulf every single day!',
    visual: 'evaporation',
    highlightStage: 'evaporation',
  },
  {
    character: 'Coco Condensation',
    color: '#93C5FD',
    emoji: '☁️',
    title: 'I am CONDENSATION! I turn invisible into visible!',
    content: 'High in the sky, the air is very COLD.\nCold air cannot hold as much water vapor.\nSo the vapor COOLS DOWN and turns back into tiny droplets.\nThose droplets cluster together to form CLOUDS! ☁️\n\nHave you seen a cold glass "sweat"? That\'s me!',
    visual: 'condensation',
    highlightStage: 'condensation',
  },
  {
    character: 'Petra Precipitation',
    color: '#3B82F6',
    emoji: '🌧️',
    title: 'I am PRECIPITATION! I am the Giver of Water!',
    content: 'When clouds collect TOO MUCH water, they release it!\nIt falls to Earth as RAIN, SNOW, SLEET, or HAIL.\n\nIn the UAE, we mostly see RAIN 🌧️\nIn cold mountains, it falls as SNOW ❄️\n\nWater droplets merge until they\'re too heavy to float!',
    visual: 'precipitation',
    highlightStage: 'precipitation',
  },
  {
    character: 'Colly Collection',
    color: '#14B8A6',
    emoji: '💧',
    title: 'I am COLLECTION! I am patient. I wait below.',
    content: 'Water collects in rivers, lakes, and OCEANS.\nSome soaks INTO the ground — we call it GROUNDWATER.\nAll rivers eventually flow back to the sea.\n\nThen the Sun heats the ocean water again...\nand the cycle REPEATS FOREVER! ♾️',
    visual: 'collection',
    highlightStage: 'collection',
  },
  {
    character: 'All Cloud Spirits',
    color: '#A78BFA',
    emoji: '🌊',
    title: 'THE COMPLETE WATER CYCLE — Now you know it all!',
    content: '☀️ EVAPORATION  → water vapor rises from surfaces\n☁️ CONDENSATION → vapor cools, forms clouds\n🌧️ PRECIPITATION → water falls as rain or snow\n💧 COLLECTION   → water gathers in rivers & oceans\n         ↑____________________________|\n              (repeats forever!)\n\n"Answer our 5 questions... and we free you! 🗝️"',
    visual: 'full_cycle',
    highlightStage: 'all',
  },
];
