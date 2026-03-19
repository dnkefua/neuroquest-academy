'use client';

import { RadarChart, Radar, PolarGrid, PolarAngleAxis, ResponsiveContainer, Tooltip } from 'recharts';

interface Props {
  data: { subject: string; value: number }[];
}

export default function SubjectRadarChart({ data }: Props) {
  if (!data.length) return <p className="text-gray-400 text-sm font-dmsans text-center py-6">Complete lessons to see subject mastery!</p>;
  return (
    <ResponsiveContainer width="100%" height={220}>
      <RadarChart data={data} margin={{ top: 10, right: 20, bottom: 10, left: 20 }}>
        <PolarGrid stroke="#E9D5FF" />
        <PolarAngleAxis dataKey="subject" tick={{ fontSize: 11, fontFamily: 'DM Sans', fill: '#6B7280' }} />
        <Tooltip formatter={(v) => [`${v}%`, 'Mastery']} contentStyle={{ borderRadius: 12, fontFamily: 'DM Sans', fontSize: 12 }} />
        <Radar name="Mastery" dataKey="value" stroke="#8B5CF6" fill="#8B5CF6" fillOpacity={0.25} strokeWidth={2} dot={{ r: 4, fill: '#8B5CF6' }} />
      </RadarChart>
    </ResponsiveContainer>
  );
}
