'use client';
import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useCognitiveStore } from '@/store/cognitiveStore';

interface QuestGuideProps {
  currentSubject?: string;
  currentTopic?: string;
  onHintRequest?: (hint: string) => void;
}

interface ChatMessage {
  id: string;
  role: 'user' | 'guide';
  content: string;
  timestamp: number;
}

const QUICK_ACTIONS = [
  { label: 'Explain this', emoji: '💡', prompt: 'Can you explain this concept in a simpler way?' },
  { label: 'Give me an analogy', emoji: '🔗', prompt: 'Can you give me a real-world analogy for this?' },
  { label: 'Show me a visual', emoji: '🎨', prompt: 'Can you describe a visual way to understand this?' },
  { label: 'I am stuck', emoji: '😰', prompt: 'I am feeling stuck. Can you help me break this down?' },
  { label: 'Test me', emoji: '🧪', prompt: 'Can you give me a quick practice question?' },
];

const GREETINGS: Record<string, string> = {
  math: 'Ready to conquer some numbers? I am here to help you through every step!',
  science: 'Let us explore the wonders of science together! What catches your curiosity?',
  english: 'Words are our superpower today! How can I help you on this literary quest?',
  social: 'Let us discover the world together! What topic shall we explore?',
  socialSkills: 'Every interaction is a chance to grow! What would you like to practice?',
};

export default function QuestGuide({ currentSubject, currentTopic, onHintRequest }: QuestGuideProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [struggleCount, setStruggleCount] = useState(0);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { profile, getRecommendation, shouldSuggestBreak, isBaselineComplete } = useCognitiveStore();

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [messages]);

  useEffect(() => {
    if (isOpen && messages.length === 0) {
      const greeting = currentSubject
        ? GREETINGS[currentSubject] || 'Welcome! I am QuestGuide, your learning companion.'
        : 'Welcome! I am QuestGuide, your learning companion.';
      const topicText = currentTopic ? ` We are working on: ${currentTopic}.` : '';
      setMessages([
        {
          id: 'welcome',
          role: 'guide',
          content: greeting + topicText + ' Ask me anything or use the quick actions below!',
          timestamp: Date.now(),
        },
      ]);
    }
  }, [isOpen, currentSubject, currentTopic]);

  const generateResponse = (userMessage: string): string => {
    const lower = userMessage.toLowerCase();

    if (lower.includes('explain') || lower.includes('simpler')) {
      return `Here is a simpler way to think about it:\n\n1. Break the problem into small pieces\n2. Focus on one piece at a time\n3. Ask yourself: "What do I already know about this?"\n\n💡 Tip: ${getRecommendation()}`;
    }

    if (lower.includes('analogy')) {
      const analogies: Record<string, string> = {
        math: 'Think of math like building with blocks. Each concept is a block that supports the next one!',
        science: 'Science is like being a detective. You gather clues (evidence) to solve mysteries about the world!',
        english: 'Reading is like traveling without moving. Every word paints a picture in your mind!',
        social: 'Learning about the world is like exploring a giant map. Every fact is a new landmark!',
        socialSkills: 'Social skills are like a toolkit. Each skill is a different tool for different situations!',
      };
      return analogies[currentSubject || ''] || 'Think of learning like climbing a mountain. Each step takes you higher, even when it feels steep!';
    }

    if (lower.includes('visual')) {
      return `Try drawing a diagram or mind map! Here is a technique:\n\n📝 Draw the main idea in the center\n🔗 Branch out with related concepts\n🎨 Use colors to group similar ideas\n\nYour cognitive profile shows you learn best through ${profile.learningStyle} methods.`;
    }

    if (lower.includes('stuck') || lower.includes('help') || lower.includes('hard')) {
      const newStruggle = struggleCount + 1;
      setStruggleCount(newStruggle);

      if (newStruggle >= 3) {
        return `I notice this is challenging. That is totally okay! 🌟\n\nLet us try a different approach:\n1. Take a deep breath\n2. Let us look at what you DO know\n3. We will build from there step by step\n\nRemember: every expert was once a beginner!`;
      }

      return `No worries! Let us break this down together.\n\nWhat specific part feels confusing? I can explain it in a different way.`;
    }

    if (lower.includes('test') || lower.includes('practice') || lower.includes('question')) {
      return `Great idea! Practice makes progress! 💪\n\nHere is a quick challenge:\n\nThink about what you just learned and try to explain it back to me in your own words. Teaching is the best way to learn!`;
    }

    if (lower.includes('break') || lower.includes('tired')) {
      return `It sounds like you might need a Brain Break! 🧘\n\nTry one of these:\n• 🫁 Take 5 deep breaths\n• 🖐️ 5-4-3-2-1 grounding exercise\n• 🤸 Quick stretch break\n• 💧 Drink some water\n\nCome back when you are ready!`;
    }

    return `That is a great question! Let me think about the best way to help you.\n\n💡 Try one of the quick action buttons below, or ask me something more specific about what you are working on.`;
  };

  const sendMessage = (content: string) => {
    if (!content.trim()) return;

    const userMsg: ChatMessage = {
      id: `msg-${Date.now()}`,
      role: 'user',
      content: content.trim(),
      timestamp: Date.now(),
    };

    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsTyping(true);

    setTimeout(() => {
      const response = generateResponse(content);
      const guideMsg: ChatMessage = {
        id: `msg-${Date.now() + 1}`,
        role: 'guide',
        content: response,
        timestamp: Date.now(),
      };
      setMessages(prev => [...prev, guideMsg]);
      setIsTyping(false);
      onHintRequest?.(response);
    }, 800 + Math.random() * 700);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    sendMessage(input);
  };

  return (
    <>
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 z-40 w-14 h-14 rounded-full bg-gradient-to-br from-purple-600 to-blue-600 text-white shadow-lg flex items-center justify-center text-2xl"
      >
        {isOpen ? '✕' : '🧙'}
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="fixed bottom-24 right-6 z-40 w-80 sm:w-96 rounded-2xl border border-gray-700 bg-gray-900 shadow-2xl overflow-hidden"
          >
            <div className="p-4 border-b border-gray-800 bg-gradient-to-r from-purple-900/50 to-blue-900/50">
              <div className="flex items-center gap-3">
                <span className="text-2xl">🧙</span>
                <div>
                  <h3 className="font-bold text-white">QuestGuide</h3>
                  <p className="text-xs text-gray-400">Your AI Learning Companion</p>
                </div>
              </div>
              {isBaselineComplete && (
                <p className="text-xs text-purple-300 mt-2">
                  Learning style: {profile.learningStyle} | Pace: {profile.preferredPace}
                </p>
              )}
            </div>

            <div className="h-64 overflow-y-auto p-4 space-y-3">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[85%] rounded-xl px-3 py-2 text-sm whitespace-pre-wrap ${
                      msg.role === 'user'
                        ? 'bg-purple-600 text-white rounded-br-sm'
                        : 'bg-gray-800 text-gray-200 rounded-bl-sm'
                    }`}
                  >
                    {msg.role === 'guide' && <span className="mr-1">🧙</span>}
                    {msg.content}
                  </div>
                </div>
              ))}
              {isTyping && (
                <div className="flex justify-start">
                  <div className="bg-gray-800 rounded-xl px-3 py-2 rounded-bl-sm">
                    <div className="flex gap-1">
                      <motion.span
                        animate={{ opacity: [0.3, 1, 0.3] }}
                        transition={{ duration: 1, repeat: Infinity, delay: 0 }}
                        className="w-2 h-2 rounded-full bg-gray-500"
                      />
                      <motion.span
                        animate={{ opacity: [0.3, 1, 0.3] }}
                        transition={{ duration: 1, repeat: Infinity, delay: 0.2 }}
                        className="w-2 h-2 rounded-full bg-gray-500"
                      />
                      <motion.span
                        animate={{ opacity: [0.3, 1, 0.3] }}
                        transition={{ duration: 1, repeat: Infinity, delay: 0.4 }}
                        className="w-2 h-2 rounded-full bg-gray-500"
                      />
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            <div className="px-3 py-2 border-t border-gray-800">
              <div className="flex flex-wrap gap-1 mb-2">
                {QUICK_ACTIONS.map((action) => (
                  <button
                    key={action.label}
                    onClick={() => sendMessage(action.prompt)}
                    className="text-xs px-2 py-1 rounded-full bg-gray-800 text-gray-300 hover:bg-gray-700 hover:text-white transition-colors"
                  >
                    {action.emoji} {action.label}
                  </button>
                ))}
              </div>
              <form onSubmit={handleSubmit} className="flex gap-2">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Ask QuestGuide anything..."
                  className="flex-1 px-3 py-2 rounded-lg bg-gray-800 text-white text-sm placeholder-gray-500 border border-gray-700 focus:outline-none focus:border-purple-500"
                />
                <button
                  type="submit"
                  disabled={!input.trim() || isTyping}
                  className="px-4 py-2 rounded-lg bg-purple-600 text-white text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed hover:bg-purple-500 transition-colors"
                >
                  Send
                </button>
              </form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
