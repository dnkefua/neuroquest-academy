'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { getUserProfile } from '@/lib/firestore';

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    // Fallback: if Firebase doesn't respond in 5s, go to /auth
    const timeout = setTimeout(() => router.replace('/auth'), 5000);

    let unsub: (() => void) | undefined;
    try {
      unsub = onAuthStateChanged(
        auth,
        async (user) => {
          clearTimeout(timeout);
          if (!user) {
            router.replace('/auth');
            return;
          }
          try {
            const profile = await getUserProfile(user.uid);
            router.replace(!profile?.name ? '/onboarding' : '/dashboard');
          } catch {
            router.replace('/dashboard');
          }
        },
        () => {
          // Auth error — go to sign in
          clearTimeout(timeout);
          router.replace('/auth');
        }
      );
    } catch {
      clearTimeout(timeout);
      router.replace('/auth');
    }

    return () => {
      clearTimeout(timeout);
      unsub?.();
    };
  }, [router]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <div className="text-6xl mb-4 animate-bounce">🧠</div>
        <p className="font-nunito text-xl text-brand-purple font-bold">Loading NeuroQuest...</p>
      </div>
    </div>
  );
}
