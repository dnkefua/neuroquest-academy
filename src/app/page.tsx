'use client';

import dynamic from 'next/dynamic';
import Link from 'next/link';
import {
  ArrowRight,
  BookOpen,
  BrainCircuit,
  CheckCircle2,
  FlaskConical,
  Gamepad2,
  Gauge,
  GraduationCap,
  Route,
  School,
  ShieldCheck,
  Sparkles,
  Trophy,
  Zap,
} from 'lucide-react';

const NeuroQuest3DShowcase = dynamic(() => import('@/components/landing/NeuroQuest3DShowcase'), {
  ssr: false,
  loading: () => <div className="absolute inset-0 bg-[#061018]" />,
});

const experienceEngines = [
  {
    title: '3D Learning Campus',
    copy: 'A classroom, lab, race track, and maze concept rendered as one living learning world.',
    icon: School,
    tone: 'text-cyan-300',
  },
  {
    title: 'Grade 8 Complete',
    copy: 'The flagship Grade 8 scope is rebuilt from the school PDF materials and ready for lessons and games.',
    icon: GraduationCap,
    tone: 'text-emerald-300',
  },
  {
    title: 'Question-Driven Games',
    copy: 'Speed, coins, teleport powers, and level progression are earned through correct learning decisions.',
    icon: Gamepad2,
    tone: 'text-amber-300',
  },
  {
    title: 'IB Scaffold',
    copy: 'Grades 1-12 remain scaffolded across the IB journey, with Grade 8 now the completed reference track.',
    icon: BookOpen,
    tone: 'text-rose-300',
  },
];

const gameConcepts = [
  {
    title: 'Velocity Quest 3D',
    copy: 'A Grade 8 math racer where correct road-sign answers increase speed, multiplier, and race position.',
    href: '/games/math-racer-3d',
    icon: Gauge,
    accent: '#f59e0b',
  },
  {
    title: 'Maze Pursuit 3D',
    copy: 'A learning maze where correct answers unlock blink powers before the pursuer drains coins.',
    href: '/games/maze-pursuit-3d',
    icon: Route,
    accent: '#fb7185',
  },
];

const proofPoints = [
  'School PDF source tracking',
  'Completed Grade 8 math and science quest set',
  '3D explainer-ready classroom and lab environment',
  'Playable learning-game prototypes',
  'IB scaffold across primary, MYP, and DP',
  'Neurodiverse-friendly short loops and immediate feedback',
];

export default function Home() {
  return (
    <main className="min-h-screen bg-[#f5f7f2] text-slate-950">
      <section className="relative min-h-[92vh] overflow-hidden bg-[#061018] text-white">
        <NeuroQuest3DShowcase />

        <header className="relative z-10 mx-auto flex w-full max-w-7xl items-center justify-between px-5 py-5 sm:px-8">
          <Link href="/" className="flex items-center gap-3">
            <img src="/logo.png" alt="NeuroQuest Academy" className="h-10 w-10 object-contain" />
            <span className="font-nunito text-lg font-black tracking-normal">NeuroQuest Academy</span>
          </Link>
          <nav className="hidden items-center gap-2 text-sm text-slate-300 md:flex">
            <Link href="/curriculum" className="px-3 py-2 transition hover:text-white">Curriculum</Link>
            <Link href="/game-market" className="px-3 py-2 transition hover:text-white">Game Market</Link>
            <Link href="/auth" className="border border-white/[0.18] px-4 py-2 font-bold text-white transition hover:border-cyan-300 hover:text-cyan-200">
              Sign in
            </Link>
          </nav>
        </header>

        <div className="relative z-10 mx-auto grid min-h-[calc(92vh-88px)] max-w-7xl items-center px-5 pb-16 pt-10 sm:px-8 lg:grid-cols-[0.92fr_1.08fr]">
          <div className="max-w-3xl">
            <div className="mb-5 inline-flex items-center gap-2 border border-cyan-300/30 bg-cyan-300/10 px-3 py-2 text-xs font-bold uppercase tracking-[0.18em] text-cyan-100">
              <Sparkles className="h-4 w-4" />
              IB learning worlds for builders
            </div>
            <h1 className="font-nunito text-5xl font-black leading-[0.96] tracking-normal text-white sm:text-7xl lg:text-8xl">
              NeuroQuest Academy
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-200 sm:text-xl">
              A premium 3D learning platform where IB curriculum, adaptive AI, and game mechanics turn Grade 8 mastery into classroom labs, racing challenges, and pursuit worlds.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link href="/auth" className="inline-flex items-center justify-center gap-2 bg-white px-5 py-3 font-black text-slate-950 transition hover:bg-cyan-100">
                Enter Academy <ArrowRight className="h-5 w-5" />
              </Link>
              <Link href="/games/math-racer-3d" className="inline-flex items-center justify-center gap-2 border border-white/[0.24] bg-white/[0.08] px-5 py-3 font-black text-white backdrop-blur transition hover:border-amber-300 hover:text-amber-100">
                Play 3D Racer <Zap className="h-5 w-5" />
              </Link>
            </div>
            <div className="mt-10 grid max-w-2xl grid-cols-3 border-y border-white/[0.14] py-5 text-sm text-slate-300">
              <div>
                <div className="font-nunito text-2xl font-black text-white">G8</div>
                Completed track
              </div>
              <div>
                <div className="font-nunito text-2xl font-black text-white">50</div>
                New core questions
              </div>
              <div>
                <div className="font-nunito text-2xl font-black text-white">2</div>
                Playable 3D concepts
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="border-b border-slate-200 bg-white">
        <div className="mx-auto grid max-w-7xl gap-4 px-5 py-8 sm:px-8 md:grid-cols-4">
          {experienceEngines.map((item) => {
            const Icon = item.icon;
            return (
              <article key={item.title} className="border border-slate-200 p-5">
                <Icon className={`mb-5 h-7 w-7 ${item.tone}`} />
                <h2 className="font-nunito text-lg font-black text-slate-950">{item.title}</h2>
                <p className="mt-2 text-sm leading-6 text-slate-600">{item.copy}</p>
              </article>
            );
          })}
        </div>
      </section>

      <section className="bg-[#f5f7f2]">
        <div className="mx-auto grid max-w-7xl gap-10 px-5 py-16 sm:px-8 lg:grid-cols-[0.8fr_1.2fr]">
          <div>
            <div className="mb-4 inline-flex items-center gap-2 bg-slate-950 px-3 py-2 text-xs font-bold uppercase tracking-[0.16em] text-white">
              <BrainCircuit className="h-4 w-4 text-emerald-300" />
              Recommendations implemented
            </div>
            <h2 className="font-nunito text-4xl font-black leading-tight text-slate-950 sm:text-5xl">
              From redirect screen to flagship learning product.
            </h2>
            <p className="mt-5 leading-7 text-slate-700">
              The public entry now shows the real product promise immediately: high-fidelity 3D, school-sourced IB curriculum, and playable learning worlds. Grade 8 becomes the completed benchmark for the rest of the scaffold.
            </p>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            {proofPoints.map((point) => (
              <div key={point} className="flex items-start gap-3 border border-slate-200 bg-white p-4">
                <CheckCircle2 className="mt-0.5 h-5 w-5 flex-none text-emerald-600" />
                <span className="text-sm font-semibold leading-6 text-slate-700">{point}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-slate-950 text-white">
        <div className="mx-auto max-w-7xl px-5 py-16 sm:px-8">
          <div className="mb-8 flex flex-col justify-between gap-5 md:flex-row md:items-end">
            <div>
              <div className="mb-4 inline-flex items-center gap-2 border border-amber-300/30 bg-amber-300/10 px-3 py-2 text-xs font-bold uppercase tracking-[0.16em] text-amber-100">
                <Trophy className="h-4 w-4" />
                Learning game concepts
              </div>
              <h2 className="font-nunito text-4xl font-black">Games that teach by changing the outcome.</h2>
            </div>
            <Link href="/game-market" className="inline-flex items-center justify-center gap-2 border border-white/20 px-4 py-3 text-sm font-black transition hover:border-cyan-300 hover:text-cyan-200">
              Open Game Market <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          <div className="grid gap-5 md:grid-cols-2">
            {gameConcepts.map((game) => {
              const Icon = game.icon;
              return (
                <Link
                  key={game.title}
                  href={game.href}
                  className="group relative overflow-hidden border border-white/[0.12] bg-white/[0.04] p-6 transition hover:border-white/30"
                >
                  <div className="absolute right-0 top-0 h-full w-24 opacity-40" style={{ background: `linear-gradient(180deg, ${game.accent}, transparent)` }} />
                  <Icon className="relative z-10 mb-8 h-9 w-9" style={{ color: game.accent }} />
                  <h3 className="relative z-10 font-nunito text-3xl font-black">{game.title}</h3>
                  <p className="relative z-10 mt-3 max-w-xl leading-7 text-slate-300">{game.copy}</p>
                  <span className="relative z-10 mt-6 inline-flex items-center gap-2 text-sm font-black text-white">
                    Launch demo <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" />
                  </span>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      <section className="bg-white">
        <div className="mx-auto grid max-w-7xl gap-8 px-5 py-16 sm:px-8 lg:grid-cols-3">
          <div className="border border-slate-200 p-6">
            <ShieldCheck className="mb-5 h-8 w-8 text-emerald-600" />
            <h2 className="font-nunito text-2xl font-black">School-Sourced</h2>
            <p className="mt-3 leading-7 text-slate-600">
              Curriculum metadata now points to the supplied EIS IB documents in `textbook-folder`.
            </p>
          </div>
          <div className="border border-slate-200 p-6">
            <FlaskConical className="mb-5 h-8 w-8 text-cyan-600" />
            <h2 className="font-nunito text-2xl font-black">Explainer-Ready</h2>
            <p className="mt-3 leading-7 text-slate-600">
              The 3D campus establishes the visual language for classroom, lab, simulation, and game explanations.
            </p>
          </div>
          <div className="border border-slate-200 p-6">
            <Gamepad2 className="mb-5 h-8 w-8 text-rose-600" />
            <h2 className="font-nunito text-2xl font-black">Game-First</h2>
            <p className="mt-3 leading-7 text-slate-600">
              The new games make learning performance alter gameplay, not just show a quiz after the action.
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}
