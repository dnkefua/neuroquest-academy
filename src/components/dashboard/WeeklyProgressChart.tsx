'use client';

import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend } from 'recharts';

interface DataPoint {
  week: string;
  math?: number;
  science?: number;
  english?: number;
  'social-skills'?: number;
}

const COLORS = { math: '#8B5CF6', science: '#14B8A6', english: '#3B82F6', 'social-skills': '#F97316' };

export default function WeeklyProgressChart({ data }: { data: DataPoint[] }) {
  if (!data.length) return <p className="text-gray-400 text-sm font-dmsans text-center py-6">No weekly data yet — complete some lessons!</p>;
  return (
    <ResponsiveContainer width="100%" height={200}>
      <AreaChart data={data} margin={{ top: 5, right: 10, left: -20, bottom: 5 }}>
        <defs>
          {Object.entries(COLORS).map(([k, c]) => (
            <linearGradient key={k} id={`grad-${k}`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor={c} stopOpacity={0.3} />
              <stop offset="95%" stopColor={c} stopOpacity={0} />
            </linearGradient>
          ))}
        </defs>
        <XAxis dataKey="week" tick={{ fontSize: 11, fontFamily: 'DM Sans' }} />
        <YAxis domain={[0, 100]} unit="%" tick={{ fontSize: 11, fontFamily: 'DM Sans' }} />
        <Tooltip formatter={(v) => [`${v}%`]} contentStyle={{ borderRadius: 12, fontFamily: 'DM Sans', fontSize: 12 }} />
        <Legend wrapperStyle={{ fontSize: 11, fontFamily: 'DM Sans' }} />
        {Object.entries(COLORS).map(([key, color]) => (
          <Area key={key} type="monotone" dataKey={key} stroke={color} strokeWidth={2} fill={`url(#grad-${key})`} dot={{ r: 3 }} />
        ))}
      </AreaChart>
    </ResponsiveContainer>
  );
}
