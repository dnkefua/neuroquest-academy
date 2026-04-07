'use client';
import Link from 'next/link';
import SocialHub from '@/components/social/SocialHub';

export default function SocialHubPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-950 via-gray-900 to-gray-950 text-white">
      <div className="max-w-3xl mx-auto px-4 py-6">
        <Link href="/dashboard" className="text-sm text-gray-400 hover:text-white transition-colors">
          ← Back to Dashboard
        </Link>
        <div className="mt-4">
          <SocialHub />
        </div>
      </div>
    </div>
  );
}
