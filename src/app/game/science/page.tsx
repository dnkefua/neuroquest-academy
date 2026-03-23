'use client'
import dynamic from 'next/dynamic'
import GameSkeleton from '../shared/components/GameSkeleton'

const ScienceGameApp = dynamic(() => import('./GameApp'), {
  ssr: false,
  loading: () => <GameSkeleton />,
})

export default function ScienceGamePage() {
  return <ScienceGameApp />
}
