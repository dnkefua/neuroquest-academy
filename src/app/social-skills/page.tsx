'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { onAuthStateChanged } from 'firebase/auth';
import { motion, AnimatePresence } from 'framer-motion';
import { auth } from '@/lib/firebase';
import { getUserProfile, updateXP, logSocialSkillScore } from '@/lib/firestore';
import type { UserProfile } from '@/types';
import toast from 'react-hot-toast';
import BrainBreakModal from '@/components/BrainBreakModal';

interface Scenario {
  id: number;
  npcName: string;
  npcEmoji: string;
  npcNeutral: string;
  npcHappy: string;
  npcSad: string;
  situation: string;
  situationAR: string;
  question: string;
  questionAR: string;
  options: { text: string; textAR: string; correct: boolean }[];
}

const SCENARIOS: Scenario[] = [
  {
    id: 1,
    npcName: 'Omar',
    npcEmoji: '😟',
    npcNeutral: '😐',
    npcHappy: '😊',
    npcSad: '😔',
    situation: "It's lunchtime at school. Omar is sitting alone and looks sad — he opened his bag and can't find his lunch box.",
    situationAR: 'وقت الغداء في المدرسة. عمر يجلس وحيداً ويبدو حزيناً — فتح حقيبته ولم يجد علبة غدائه.',
    question: 'Omar forgot his lunch. What do you say?',
    questionAR: 'عمر نسي غداءه. ماذا تقول؟',
    options: [
      { text: 'Laugh and walk away', textAR: 'تضحك وتمشي بعيداً', correct: false },
      { text: '"Would you like to share my lunch, Omar? 😊"', textAR: '"هل تريد أن تشارك غدائي يا عمر؟ 😊"', correct: true },
      { text: 'Ignore him and keep eating', textAR: 'تتجاهله وتكمل أكلك', correct: false },
    ],
  },
  {
    id: 2,
    npcName: 'Fatima',
    npcEmoji: '😢',
    npcNeutral: '😶',
    npcHappy: '🥰',
    npcSad: '😭',
    situation: "You see Fatima sitting by herself, crying quietly. Her drawing fell and got crumpled. She worked on it all morning.",
    situationAR: 'ترين فاطمة جالسة وحدها تبكي بهدوء. سقطت رسمتها وتجعّدت. عملت عليها طوال الصباح.',
    question: 'Fatima is upset about her drawing. How do you help?',
    questionAR: 'فاطمة منزعجة بسبب رسمتها. كيف تساعدها؟',
    options: [
      { text: 'Tell her to stop crying', textAR: 'تخبرها أن تتوقف عن البكاء', correct: false },
      { text: 'Walk over and help fix the drawing together', textAR: 'تذهبين إليها وتساعدانها في إصلاح الرسمة معاً', correct: true },
      { text: '"It\'s just a drawing, no big deal"', textAR: '"إنها مجرد رسمة، لا يهم"', correct: false },
    ],
  },
  {
    id: 3,
    npcName: 'Group',
    npcEmoji: '👥',
    npcNeutral: '👥',
    npcHappy: '🎉',
    npcSad: '😶‍🌫️',
    situation: 'Your class is in a circle sharing ideas. Everyone takes a turn speaking. Now the teacher looks at you.',
    situationAR: 'صفك في دائرة يتشارك الأفكار. كل شخص يأخذ دوره للكلام. الآن المعلمة تنظر إليك.',
    question: "It's your turn to speak. What do you do?",
    questionAR: 'حان دورك للكلام. ماذا تفعل؟',
    options: [
      { text: 'Stay silent and look at the floor', textAR: 'تبقى صامتاً وتنظر إلى الأرض', correct: false },
      { text: 'Talk over someone who is still speaking', textAR: 'تتكلم فوق شخص لا يزال يتحدث', correct: false },
      { text: 'Take a breath and share your idea clearly', textAR: 'تأخذ نفساً وتشارك فكرتك بوضوح', correct: true },
    ],
  },
  {
    id: 4,
    npcName: 'Khalid',
    npcEmoji: '😤',
    npcNeutral: '😤',
    npcHappy: '😌',
    npcSad: '😠',
    situation: "During a group project, Khalid disagrees with your idea strongly and crosses his arms. The group goes quiet.",
    situationAR: 'خلال مشروع جماعي، خالد يختلف مع فكرتك بشدة ويضم ذراعيه. المجموعة تصمت.',
    question: 'Khalid disagrees with you. What is the best response?',
    questionAR: 'خالد يختلف معك. ما هو أفضل رد؟',
    options: [
      { text: 'Shout that your idea is better', textAR: 'تصرخ أن فكرتك أفضل', correct: false },
      { text: '"I hear you, Khalid. Can you explain your thinking?"', textAR: '"أسمعك يا خالد. هل يمكنك شرح تفكيرك؟"', correct: true },
      { text: 'Sulk and refuse to work', textAR: 'تتذمر وترفض العمل', correct: false },
    ],
  },
  {
    id: 5,
    npcName: 'Sara',
    npcEmoji: '😰',
    npcNeutral: '😰',
    npcHappy: '😊',
    npcSad: '😥',
    situation: "New student Sara looks lost in the school corridor. She holds a map upside down and seems very anxious.",
    situationAR: 'الطالبة الجديدة سارة تبدو ضائعة في الممر. تمسك خريطة مقلوبة وتبدو قلقة جداً.',
    question: 'Sara is lost and anxious. What do you do?',
    questionAR: 'سارة ضائعة وقلقة. ماذا تفعل؟',
    options: [
      { text: 'Walk past quickly — you\'re in a hurry', textAR: 'تمر بسرعة — أنت مستعجل', correct: false },
      { text: 'Point vaguely and keep walking', textAR: 'تشير بشكل غامض وتكمل المشي', correct: false },
      { text: '"Hi Sara! I\'m going that way — want me to walk with you?"', textAR: '"مرحباً سارة! أنا ذاهب في نفس الاتجاه — هل تريدين أن أمشي معك؟"', correct: true },
    ],
  },
  {
    id: 6,
    npcName: 'Yousef',
    npcEmoji: '😳',
    npcNeutral: '😳',
    npcHappy: '😄',
    npcSad: '😞',
    situation: "Yousef tells a joke at lunch. Nobody laughs. He looks embarrassed and goes quiet, staring at his food.",
    situationAR: 'يوسف يحكي نكتة وقت الغداء. لا أحد يضحك. يبدو محرجاً ويصمت، ينظر إلى طعامه.',
    question: 'Yousef is embarrassed. How do you respond?',
    questionAR: 'يوسف محرج. كيف تتجاوب؟',
    options: [
      { text: 'Join others in laughing at him', textAR: 'تنضم للآخرين في الضحك عليه', correct: false },
      { text: 'Smile and say "I liked it! Tell us another one"', textAR: 'تبتسم وتقول "أعجبني! أخبرنا بنكتة أخرى"', correct: true },
      { text: 'Pretend you didn\'t notice', textAR: 'تتظاهر أنك لم تلاحظ', correct: false },
    ],
  },
];

type Phase = 'intro' | 'playing' | 'complete';

export default function SocialSkillsPage() {
  const router = useRouter();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [phase, setPhase] = useState<Phase>('intro');
  const [currentScenario, setCurrentScenario] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [scores, setScores] = useState<boolean[]>([]);
  const [npcExpression, setNpcExpression] = useState<'neutral' | 'happy' | 'sad'>('neutral');
  const [npcReaction, setNpcReaction] = useState<string | null>(null);
  const [loadingReaction, setLoadingReaction] = useState(false);
  const [showBrainBreak, setShowBrainBreak] = useState(false);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (user) => {
      if (!user) { router.replace('/auth'); return; }
      const p = await getUserProfile(user.uid);
      if (!p?.name) { router.replace('/onboarding'); return; }
      setProfile(p);
      setLoading(false);
    });
    return () => unsub();
  }, [router]);

  const scenario = SCENARIOS[currentScenario];
  const answered = selected !== null;
  const isCorrect = answered && scenario.options[selected].correct;
  const isRTL = profile?.language === 'AR';

  async function handleSelect(i: number) {
    if (answered) return;
    setSelected(i);
    const correct = scenario.options[i].correct;
    setNpcExpression(correct ? 'happy' : 'sad');
    if (correct) {
      toast.success('+10 XP! 🌟', { duration: 1500 });
    }

    // Fetch AI NPC reaction
    if (profile) {
      setLoadingReaction(true);
      try {
        const res = await fetch('/api/npc-reaction', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            npcName: scenario.npcName,
            situation: scenario.situation,
            studentChoice: scenario.options[i].text,
            wasCorrect: correct,
            studentName: profile.name,
            grade: profile.grade,
            language: profile.language,
          }),
        });
        const data = await res.json();
        if (data.reaction) setNpcReaction(data.reaction);
      } catch {
        // Use static fallback
        setNpcReaction(correct
          ? `${scenario.npcName} smiles warmly. "Thank you so much — that really means a lot to me!" 💜`
          : `${scenario.npcName} looks a little uncertain. "Oh… I'm not sure what to think, but I hope we can still be friends."`
        );
      } finally {
        setLoadingReaction(false);
      }
    }
  }

  async function handleNext() {
    const newScores = [...scores, isCorrect ?? false];
    if (currentScenario < SCENARIOS.length - 1) {
      setScores(newScores);
      setCurrentScenario((c) => c + 1);
      setSelected(null);
      setNpcExpression('neutral');
      setNpcReaction(null);
    } else {
      setScores(newScores);
      const correctCount = newScores.filter(Boolean).length;
      if (profile) {
        const xpEarned = correctCount * 10;
        await updateXP(profile.uid, xpEarned, profile.xp);
        await logSocialSkillScore(profile.uid, correctCount, SCENARIOS.length);
      }
      setPhase('complete');
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-6xl animate-bounce">🤝</div>
      </div>
    );
  }

  if (phase === 'intro') {
    return (
      <div className="min-h-screen flex items-center justify-center px-4"
        style={{ background: 'linear-gradient(160deg, #FFF7ED 0%, #FFFBEB 50%, #FEF3C7 100%)' }}
        dir={isRTL ? 'rtl' : 'ltr'}>
        <div className="max-w-md w-full text-center">
          <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}>
            <div className="text-8xl mb-4">🤝</div>
            <h1 className="font-nunito text-3xl font-black text-gray-800 mb-2">
              {isRTL ? 'لعبة المهارات الاجتماعية' : 'Social Skills Game'}
            </h1>
            <p className="font-dmsans text-gray-600 mb-6 leading-relaxed text-sm">
              {isRTL
                ? 'قابل أصدقاء يحتاجون مساعدتك! اختر الرد الأكثر لطفاً في كل موقف وكسب XP! 🌟'
                : 'Meet friends who need your help! Choose the kindest response in each situation and earn XP! 🌟'}
            </p>
          </motion.div>

          <div className="card mb-6 text-left space-y-3">
            {SCENARIOS.map((s, i) => (
              <div key={s.id} className="flex items-center gap-3">
                <span className="text-2xl">{s.npcEmoji}</span>
                <div>
                  <span className="font-bold font-nunito text-gray-800 text-sm">{s.npcName}</span>
                  <p className="text-xs text-gray-500 font-dmsans">{isRTL ? s.questionAR : s.question}</p>
                </div>
              </div>
            ))}
          </div>

          <button
            onClick={() => setPhase('playing')}
            className="w-full bg-orange-500 text-white font-nunito font-black py-3.5 rounded-2xl hover:bg-orange-600 active:scale-95 transition-all"
          >
            {isRTL ? 'هيا نلعب! 🚀' : "Let's Play! 🚀"}
          </button>
          <button onClick={() => router.push('/dashboard')} className="mt-3 text-sm text-gray-500 font-dmsans">
            {isRTL ? '→ لوحة التحكم' : '← Back to Dashboard'}
          </button>
        </div>
      </div>
    );
  }

  if (phase === 'complete') {
    const correctCount = scores.filter(Boolean).length;
    const pct = Math.round((correctCount / SCENARIOS.length) * 100);
    return (
      <div className="min-h-screen flex items-center justify-center px-4"
        style={{ background: 'linear-gradient(160deg, #FFF7ED 0%, #FFFBEB 50%, #FEF3C7 100%)' }}
        dir={isRTL ? 'rtl' : 'ltr'}>
        <div className="max-w-md w-full text-center">
          <motion.div initial={{ scale: 0.5, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ type: 'spring' }}>
            <div className="text-8xl mb-4">
              {pct === 100 ? '🏆' : pct >= 66 ? '🌟' : '💪'}
            </div>
            <h1 className="font-nunito text-3xl font-black text-gray-800 mb-2">
              {pct === 100 ? (isRTL ? 'درجة كاملة!' : 'Perfect Score!') : (isRTL ? 'أحسنت!' : 'Well Done!')}
            </h1>
            <p className="font-dmsans text-gray-600 mb-2">
              {isRTL
                ? `أجبت على ${correctCount} من ${SCENARIOS.length} بشكل صحيح!`
                : `You got ${correctCount} out of ${SCENARIOS.length} right!`}
            </p>
            <p className="font-dmsans text-gray-500 text-sm mb-6">
              {isRTL ? 'لطفك يزيد كل يوم 💜' : 'Your kindness is growing every day 💜'}
            </p>
          </motion.div>

          {/* Score breakdown */}
          <div className="card mb-6">
            <div className="grid grid-cols-3 gap-2">
              {scores.map((s, i) => (
                <div key={i} className={`rounded-2xl p-3 text-center ${s ? 'bg-teal-50' : 'bg-red-50'}`}>
                  <div className="text-2xl">{s ? '✅' : '💡'}</div>
                  <div className={`text-xs font-nunito font-bold mt-1 ${s ? 'text-teal-700' : 'text-red-600'}`}>
                    {SCENARIOS[i]?.npcName ?? `Scenario ${i + 1}`}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* XP earned */}
          <div className="card mb-6 bg-yellow-50 border-yellow-100">
            <p className="font-nunito font-black text-yellow-700 text-lg">
              +{correctCount * 10} XP {isRTL ? 'مكتسب! ⭐' : 'Earned! ⭐'}
            </p>
          </div>

          <div className="flex gap-3">
            <button onClick={() => router.push('/dashboard')}
              className="flex-1 border-2 border-purple-500 text-purple-600 font-nunito font-black py-3.5 rounded-2xl hover:bg-purple-50 transition-all">
              {isRTL ? '← لوحة التحكم' : '← Dashboard'}
            </button>
            <button
              onClick={() => { setPhase('playing'); setCurrentScenario(0); setSelected(null); setScores([]); setNpcExpression('neutral'); setNpcReaction(null); }}
              className="flex-1 bg-orange-500 text-white font-nunito font-black py-3.5 rounded-2xl hover:bg-orange-600 transition-all">
              {isRTL ? 'العب مجدداً 🔄' : 'Play Again 🔄'}
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Playing phase
  const npcEmoji = {
    neutral: scenario.npcNeutral,
    happy: scenario.npcHappy,
    sad: scenario.npcSad,
  }[npcExpression];

  const progress = ((currentScenario) / SCENARIOS.length) * 100;

  return (
    <div className="min-h-screen pb-12" dir={isRTL ? 'rtl' : 'ltr'}
      style={{ background: 'linear-gradient(160deg, #FFF7ED 0%, #FFFBEB 50%, #FEF3C7 100%)' }}>
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-md border-b border-orange-100 sticky top-0 z-10">
        <div className="max-w-2xl mx-auto px-4 py-3">
          <div className="flex items-center gap-3 mb-2">
            <button onClick={() => router.push('/dashboard')} className="text-gray-400 text-lg">←</button>
            <span className="text-xl">🤝</span>
            <span className="font-nunito font-black text-gray-800">
              {isRTL ? 'المهارات الاجتماعية' : 'Social Skills'}
            </span>
            <span className="ml-auto text-sm text-orange-600 font-nunito font-bold">
              {currentScenario + 1}/{SCENARIOS.length}
            </span>
          </div>
          {/* Progress bar */}
          <div className="w-full bg-orange-100 rounded-full h-2">
            <motion.div className="h-2 rounded-full bg-orange-400"
              animate={{ width: `${progress}%` }} transition={{ duration: 0.5 }} />
          </div>
        </div>
      </header>

      <div className="max-w-2xl mx-auto px-4 py-6 space-y-4">
        {/* NPC Character Card */}
        <AnimatePresence mode="wait">
          <motion.div key={currentScenario}
            initial={{ opacity: 0, x: 40 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -40 }}
            className="card bg-orange-50 border-orange-100 text-center">
            <motion.div
              className="text-7xl mb-2 inline-block"
              animate={
                npcExpression === 'happy' ? { scale: [1, 1.3, 1.15], rotate: [0, -10, 10, 0] } :
                npcExpression === 'sad' ? { scale: [1, 0.85], y: [0, 4] } :
                { scale: 1 }
              }
              transition={{ duration: 0.5 }}>
              {npcEmoji}
            </motion.div>
            <p className="font-nunito font-black text-orange-800 text-lg">{scenario.npcName}</p>
            <p className="font-dmsans text-orange-700 text-sm mt-2 leading-relaxed">
              {isRTL ? scenario.situationAR : scenario.situation}
            </p>

            {/* AI NPC Reaction */}
            <AnimatePresence>
              {answered && (
                <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }}
                  className={`mt-4 p-3 rounded-xl text-sm font-dmsans italic ${isCorrect ? 'bg-green-50 text-green-800' : 'bg-amber-50 text-amber-800'}`}>
                  {loadingReaction ? (
                    <span className="animate-pulse">💭 {scenario.npcName} is reacting...</span>
                  ) : npcReaction ? (
                    <span>💬 {npcReaction}</span>
                  ) : null}
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </AnimatePresence>

        {/* Question + Options */}
        <div className="card">
          <p className="font-nunito font-black text-gray-800 text-lg mb-4">
            ❓ {isRTL ? scenario.questionAR : scenario.question}
          </p>
          <div className="space-y-3">
            {scenario.options.map((opt, i) => {
              let style = 'border-gray-100 hover:border-orange-200 text-gray-700';
              if (answered) {
                if (opt.correct) style = 'border-green-400 bg-green-50 text-green-800';
                else if (i === selected && !opt.correct) style = 'border-red-400 bg-red-50 text-red-800';
                else style = 'border-gray-100 text-gray-300';
              }
              return (
                <motion.button key={i}
                  initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.08 }}
                  onClick={() => handleSelect(i)}
                  disabled={answered}
                  className={`w-full text-left px-4 py-3.5 rounded-xl border-2 font-dmsans text-sm transition-all duration-200 ${style}`}>
                  {isRTL ? opt.textAR : opt.text}
                </motion.button>
              );
            })}
          </div>

          {/* Result feedback */}
          <AnimatePresence>
            {answered && (
              <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
                className={`mt-4 p-4 rounded-2xl ${isCorrect ? 'bg-green-50' : 'bg-amber-50'}`}>
                <p className={`font-nunito font-bold text-sm ${isCorrect ? 'text-green-700' : 'text-amber-700'}`}>
                  {isCorrect
                    ? (isRTL ? '✅ ممتاز! لقد اخترت الرد الأكثر تعاطفاً.' : '✅ Excellent! That was the most empathetic response.')
                    : (isRTL ? '💡 ليس تماماً — انظر إلى كيفية شعور الآخر وحاول مرة أخرى في المرة القادمة!' : "💡 Not quite — consider how the other person feels, and try again next time!")}
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Brain Break shortcut */}
        {answered && !isCorrect && (
          <motion.button initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            onClick={() => setShowBrainBreak(true)}
            className="w-full text-center text-sm text-teal-600 font-dmsans py-2 hover:text-teal-800 transition-colors">
            😤 {isRTL ? 'هل تشعر بالإحباط؟ خذ استراحة دماغية' : 'Feeling frustrated? Take a Brain Break 🧘'}
          </motion.button>
        )}

        {answered && (
          <motion.button initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
            onClick={handleNext}
            className="w-full bg-orange-500 text-white font-nunito font-black py-3.5 rounded-2xl hover:bg-orange-600 active:scale-95 transition-all">
            {currentScenario < SCENARIOS.length - 1
              ? (isRTL ? 'السيناريو التالي ←' : 'Next Scenario →')
              : (isRTL ? 'اعرض نتائجي 🎉' : 'See My Results 🎉')}
          </motion.button>
        )}
      </div>

      {showBrainBreak && <BrainBreakModal onClose={() => setShowBrainBreak(false)} />}
    </div>
  );
}
