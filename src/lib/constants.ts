import type { Emotion, Subject } from '@/types';

export const EMOTIONS: Emotion[] = [
  { key: 'happy', label: 'Happy', emoji: '😊', color: 'text-yellow-600', bg: 'bg-yellow-50 border-yellow-200' },
  { key: 'neutral', label: 'Neutral', emoji: '😐', color: 'text-blue-600', bg: 'bg-blue-50 border-blue-200' },
  { key: 'frustrated', label: 'Frustrated', emoji: '😤', color: 'text-red-600', bg: 'bg-red-50 border-red-200' },
  { key: 'anxious', label: 'Anxious', emoji: '😰', color: 'text-purple-600', bg: 'bg-purple-50 border-purple-200' },
];

export const SUBJECTS: Subject[] = [
  {
    id: 'math',
    label: 'Math',
    emoji: '🔢',
    color: 'text-brand-purple',
    bg: 'bg-brand-purple-light',
    description: 'Numbers, patterns & problem solving',
  },
  {
    id: 'science',
    label: 'Science',
    emoji: '🔬',
    color: 'text-brand-teal',
    bg: 'bg-brand-teal-light',
    description: 'Explore the world around you',
  },
  {
    id: 'english',
    label: 'English',
    emoji: '📚',
    color: 'text-brand-blue',
    bg: 'bg-brand-blue-light',
    description: 'Reading, writing & expression',
  },
  {
    id: 'social-skills',
    label: 'Social Skills',
    emoji: '🤝',
    color: 'text-brand-orange',
    bg: 'bg-brand-orange-light',
    description: 'Friendships, empathy & communication',
  },
  {
    id: 'emotional-regulation',
    label: 'Emotional Regulation',
    emoji: '🧠',
    color: 'text-brand-pink',
    bg: 'bg-brand-pink-light',
    description: 'Understanding & managing feelings',
  },
];

export const BRAIN_BREAK_ACTIVITIES = [
  { name: 'Box Breathing', emoji: '🫧', instruction: 'Breathe in for 4 counts, hold for 4, out for 4, hold for 4. Repeat 3 times.' },
  { name: '5-4-3-2-1 Grounding', emoji: '🌟', instruction: 'Name 5 things you see, 4 you can touch, 3 you hear, 2 you smell, 1 you taste.' },
  { name: 'Shake It Out', emoji: '🕺', instruction: 'Stand up and shake your hands, then your arms, then your whole body for 30 seconds!' },
  { name: 'Mindful Stretch', emoji: '🧘', instruction: 'Reach your arms up high, then slowly bend to each side. Take 3 deep breaths.' },
  { name: 'Positive Affirmations', emoji: '💪', instruction: 'Repeat: "I am smart. I am capable. I can do hard things. I am proud of myself."' },
];
