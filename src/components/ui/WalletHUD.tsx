'use client';
import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useEconomyStore } from '@/store/economyStore';

interface WalletHUDProps {
  compact?: boolean;
}

export default function WalletHUD({ compact = false }: WalletHUDProps) {
  const walletCoins = useEconomyStore(s => s.walletCoins);
  const totalCoins  = useEconomyStore(s => s.totalCoins);
  const [prev, setPrev] = useState(walletCoins);
  const [flash, setFlash] = useState<'earn' | 'spend' | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => { setMounted(true); }, []);

  useEffect(() => {
    if (!mounted) return;
    if (walletCoins > prev) {
      setFlash('earn');
      setTimeout(() => setFlash(null), 900);
    } else if (walletCoins < prev) {
      setFlash('spend');
      setTimeout(() => setFlash(null), 600);
    }
    setPrev(walletCoins);
  }, [walletCoins, mounted]); // eslint-disable-line react-hooks/exhaustive-deps

  // Always render a placeholder shell on server/before hydration to avoid layout shift
  if (!mounted) return (
    <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl opacity-0"
      style={{ background: 'rgba(255,215,0,0.12)', border: '1px solid rgba(255,215,0,0.3)' }}>
      <span className="text-base">💰</span>
      <span className="font-black text-sm" style={{ color: '#FFD700' }}>0</span>
    </div>
  );

  if (compact) {
    return (
      <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl"
        style={{ background: 'rgba(255,215,0,0.12)', border: '1px solid rgba(255,215,0,0.3)' }}>
        <span className="text-base">💰</span>
        <motion.span
          key={walletCoins}
          initial={{ scale: 1.3 }}
          animate={{ scale: 1 }}
          className="font-black text-sm"
          style={{ color: '#FFD700' }}>
          {walletCoins.toLocaleString()}
        </motion.span>
      </div>
    );
  }

  return (
    <motion.div
      className="relative flex items-center gap-2 px-4 py-2 rounded-2xl cursor-default select-none"
      style={{
        background: flash === 'earn'  ? 'rgba(255,215,0,0.25)' :
                    flash === 'spend' ? 'rgba(255,100,0,0.2)'   :
                    'rgba(255,215,0,0.12)',
        border: `1.5px solid ${flash === 'spend' ? 'rgba(255,100,0,0.5)' : 'rgba(255,215,0,0.4)'}`,
        transition: 'background 0.3s, border 0.3s',
      }}>
      {/* Coin icon */}
      <motion.span
        className="text-xl"
        animate={flash === 'earn' ? { rotate: [0, -15, 15, 0], scale: [1, 1.3, 1] } : {}}
        transition={{ duration: 0.5 }}>
        💰
      </motion.span>

      <div>
        <motion.p
          key={walletCoins}
          initial={{ y: flash === 'earn' ? -8 : flash === 'spend' ? 8 : 0, opacity: 0.5 }}
          animate={{ y: 0, opacity: 1 }}
          className="font-black text-base leading-none"
          style={{ color: '#FFD700' }}>
          {walletCoins.toLocaleString()}
        </motion.p>
        <p className="text-xs leading-none mt-0.5" style={{ color: 'rgba(255,215,0,0.6)' }}>
          coins
        </p>
      </div>

      {/* +/- flash indicator */}
      <AnimatePresence>
        {flash && (
          <motion.span
            initial={{ opacity: 0, y: 0 }}
            animate={{ opacity: 1, y: flash === 'earn' ? -20 : 20 }}
            exit={{ opacity: 0 }}
            className="absolute -top-5 right-2 font-black text-sm pointer-events-none"
            style={{ color: flash === 'earn' ? '#FFD700' : '#FF6400' }}>
            {flash === 'earn' ? '+ earned!' : '- spent'}
          </motion.span>
        )}
      </AnimatePresence>

      {/* Lifetime total tooltip on hover */}
      <div className="absolute -bottom-7 left-1/2 -translate-x-1/2 whitespace-nowrap px-2 py-0.5 rounded-lg text-xs opacity-0 hover:opacity-100 pointer-events-none"
        style={{ background: 'rgba(0,0,0,0.7)', color: '#FFD700' }}>
        Total earned: {totalCoins.toLocaleString()}
      </div>
    </motion.div>
  );
}
