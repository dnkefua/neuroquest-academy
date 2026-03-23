'use client'
import dynamic from 'next/dynamic'
import GameSkeleton from '../shared/components/GameSkeleton'

const GameApp = dynamic(() => import('./GameApp'), {
  ssr: false,
  loading: () => <GameSkeleton />,
})

export default function MathGamePage() {
  return <GameApp />
}
