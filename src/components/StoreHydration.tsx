'use client';
import { useEffect } from 'react';
import { useEconomyStore } from '@/store/economyStore';
import { useProgressStore } from '@/store/progressStore';

export default function StoreHydration() {
  useEffect(() => {
    // Rehydrate persisted stores on client mount only
    useEconomyStore.persist.rehydrate();
    useProgressStore.persist.rehydrate();
  }, []);
  return null;
}
