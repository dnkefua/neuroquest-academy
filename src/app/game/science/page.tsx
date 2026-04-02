'use client'
import { useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import dynamic from 'next/dynamic'
import GameSkeleton from '../shared/components/GameSkeleton'
import { useScienceStore, hasQuestsForGrade } from './store/gameStore'
import { useProgressStore } from '@/store/progressStore'

const ScienceGameApp = dynamic(() => import('./GameApp'), {
  ssr: false,
  loading: () => <GameSkeleton />,
})

export default function ScienceGamePage() {
  const searchParams = useSearchParams()
  const setGrade = useScienceStore(s => s.setGrade)
  const userGrade = useProgressStore(s => s.currentGrade)

  // Read grade from URL or use user's grade
  const urlGrade = searchParams?.get('grade')
  const grade = urlGrade ? parseInt(urlGrade, 10) : userGrade

  useEffect(() => {
    if (grade && hasQuestsForGrade(grade)) {
      setGrade(grade)
    }
  }, [grade, setGrade])

  return <ScienceGameApp />
}