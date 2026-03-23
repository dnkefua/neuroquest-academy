'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithRedirect,
  getRedirectResult,
} from 'firebase/auth';
import { auth, googleProvider } from '@/lib/firebase';
import { getUserProfile } from '@/lib/firestore';
import { gameAudio } from '@/app/game/shared/audio';
import toast from 'react-hot-toast';

export default function AuthPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    getRedirectResult(auth)
      .then(async (result) => {
        if (result?.user) {
          const profile = await getUserProfile(result.user.uid);
          router.push(profile?.name ? '/dashboard' : '/onboarding');
        }
      })
      .catch(() => {});
  }, [router]);

  async function handleSignIn(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    console.log('Attempting sign in with email:', email);
    try {
      const cred = await signInWithEmailAndPassword(auth, email, password);
      console.log('Sign in success, uid:', cred.user.uid);
      gameAudio.playSignIn();
      const profile = await getUserProfile(cred.user.uid);
      router.push(profile?.name ? '/dashboard' : '/onboarding');
    } catch (err: unknown) {
      const code = (err as { code?: string }).code ?? 'unknown';
      console.error('Sign in error:', code, err);
      const friendlyMessages: Record<string, string> = {
        'auth/user-not-found': 'No account found with this email.',
        'auth/wrong-password': 'Incorrect password.',
        'auth/invalid-email': 'Please enter a valid email address.',
        'auth/network-request-failed': 'Network error. Please check your connection.',
        'auth/too-many-requests': 'Too many attempts. Please try again later.',
        'auth/invalid-credential': 'Invalid email or password.',
      };
      const friendly = friendlyMessages[code] ?? `Error: ${code}`;
      toast.error(friendly, { duration: 10000 });
      setLoading(false);
    }
  }

  async function handleSignUp(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    console.log('Attempting sign up with email:', email);
    try {
      const cred = await createUserWithEmailAndPassword(auth, email, password);
      console.log('Sign up success, uid:', cred.user.uid);
      gameAudio.playSignIn();
      // Wait for Firebase Auth to persist the session before navigating
      // On static exports, auth state may not be available immediately
      await new Promise((resolve) => setTimeout(resolve, 500));
      router.push('/onboarding');
    } catch (err: unknown) {
      const code = (err as { code?: string }).code ?? 'unknown';
      const message = (err as { message?: string }).message ?? '';
      console.error('Sign up error:', code, message, err);
      // Show user-friendly messages for common errors
      const friendlyMessages: Record<string, string> = {
        'auth/operation-not-allowed': 'Email/password sign-up is disabled. Please enable it in Firebase Console > Authentication > Sign-in method.',
        'auth/email-already-in-use': 'An account with this email already exists. Try signing in instead.',
        'auth/invalid-email': 'Please enter a valid email address.',
        'auth/weak-password': 'Password must be at least 6 characters.',
        'auth/network-request-failed': 'Network error. Please check your connection.',
        'auth/too-many-requests': 'Too many attempts. Please try again later.',
      };
      const friendly = friendlyMessages[code] ?? `Error: ${code}`;
      toast.error(friendly, { duration: 10000 });
      setLoading(false);
    }
  }

  async function handleGoogle() {
    setLoading(true);
    await signInWithRedirect(auth, googleProvider);
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="text-7xl mb-3">🧠</div>
          <h1 className="font-nunito text-3xl font-black text-gray-800">NeuroQuest Academy</h1>
          <p className="text-gray-500 mt-1" style={{ fontFamily: 'DM Sans, sans-serif' }}>Where every mind is a universe ✨</p>
        </div>

        <div className="bg-white rounded-3xl p-6 border border-purple-50" style={{ boxShadow: '0 4px 24px rgba(108,99,255,0.12)' }}>
          <form className="space-y-4">
            <div>
              <label className="block font-bold text-gray-700 mb-1.5 text-sm">Email</label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                required
                className="w-full px-4 py-3 rounded-2xl border-2 border-purple-100 focus:border-purple-500 focus:outline-none text-gray-700"
              />
            </div>
            <div>
              <label className="block font-bold text-gray-700 mb-1.5 text-sm">Password</label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                minLength={6}
                className="w-full px-4 py-3 rounded-2xl border-2 border-purple-100 focus:border-purple-500 focus:outline-none text-gray-700"
              />
            </div>

            {/* Two explicit buttons — no tab confusion */}
            <div className="grid grid-cols-2 gap-3 pt-1">
              <button
                type="submit"
                onClick={handleSignIn}
                disabled={loading}
                className="bg-purple-600 text-white font-black py-3.5 rounded-2xl hover:bg-purple-700 active:scale-95 transition-all disabled:opacity-60"
                style={{ fontFamily: 'Nunito, sans-serif' }}
              >
                {loading ? '⏳' : '🚀 Sign In'}
              </button>
              <button
                type="button"
                onClick={handleSignUp}
                disabled={loading}
                className="border-2 border-purple-600 text-purple-600 font-black py-3.5 rounded-2xl hover:bg-purple-50 active:scale-95 transition-all disabled:opacity-60"
                style={{ fontFamily: 'Nunito, sans-serif' }}
              >
                {loading ? '⏳' : '🌟 Sign Up'}
              </button>
            </div>
          </form>

          <div className="relative my-5">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-purple-100" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="bg-white px-3 text-gray-400">or</span>
            </div>
          </div>

          <button
            onClick={handleGoogle}
            disabled={loading}
            className="w-full flex items-center justify-center gap-3 border-2 border-purple-100 rounded-2xl py-3 font-bold text-gray-700 hover:bg-purple-50 active:scale-95 transition-all disabled:opacity-60"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
            </svg>
            Continue with Google
          </button>
        </div>

        <p className="text-center text-xs text-gray-400 mt-6">
          Safe, secure & designed for neurodiverse learners 💜
        </p>
      </div>
    </div>
  );
}
