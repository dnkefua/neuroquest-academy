'use client';

import { EMOTIONS } from '@/lib/constants';

interface Cell { day: string; emotion: string; count: number }

const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

export default function EmotionHeatmap({ data }: { data: Cell[] }) {
  const getCell = (day: string, emotionKey: string) =>
    data.find((c) => c.day === day && c.emotion === emotionKey);

  return (
    <div className="overflow-x-auto">
      <div className="min-w-[320px]">
        {/* Day headers */}
        <div className="grid grid-cols-8 gap-1 mb-1">
          <div />
          {DAYS.map((d) => (
            <div key={d} className="text-center text-xs text-gray-400 font-dmsans">{d}</div>
          ))}
        </div>
        {/* Emotion rows */}
        {EMOTIONS.map((em) => (
          <div key={em.key} className="grid grid-cols-8 gap-1 mb-1">
            <div className="flex items-center gap-1 text-xs text-gray-500 font-dmsans pr-1">
              <span>{em.emoji}</span>
            </div>
            {DAYS.map((day) => {
              const cell = getCell(day, em.key);
              const count = cell?.count ?? 0;
              const opacity = count === 0 ? 0.08 : Math.min(0.2 + count * 0.25, 1);
              return (
                <div
                  key={day}
                  title={count ? `${day}: ${count}× ${em.label}` : `${day}: no data`}
                  className="h-7 rounded-lg transition-all"
                  style={{
                    background: count === 0 ? '#E5E7EB' : (
                      em.key === 'happy' ? '#FEF3C7' :
                      em.key === 'neutral' ? '#DBEAFE' :
                      em.key === 'frustrated' ? '#FEE2E2' :
                      '#EDE9FE'
                    ),
                    opacity,
                    border: count > 0 ? '1px solid rgba(0,0,0,0.08)' : 'none',
                  }}
                />
              );
            })}
          </div>
        ))}
        <p className="text-xs text-gray-400 font-dmsans mt-2">Darker = more frequent emotion that day</p>
      </div>
    </div>
  );
}
