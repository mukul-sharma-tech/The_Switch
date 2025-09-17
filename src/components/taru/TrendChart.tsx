'use client';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface TrendData {
  timestamp: string;
  mood: number;
  energy: number;
}

export function TrendChart({ data }: { data: TrendData[] }) {
  const formattedData = data.map(item => ({
    ...item,
    date: new Date(item.timestamp).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
  }));

  return (
    <div className="h-48 w-full mt-4">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={formattedData}>
          <CartesianGrid strokeDasharray="3 3" strokeOpacity={0.2} />
          <XAxis dataKey="date" fontSize={12} tickLine={false} axisLine={false} />
          <YAxis fontSize={12} tickLine={false} axisLine={false} domain={[0, 10]} />
          <Tooltip contentStyle={{
            backgroundColor: 'hsl(var(--card))',
            borderColor: 'hsl(var(--border))'
          }}/>
          <Legend />
          <Line type="monotone" dataKey="mood" stroke="#8884d8" strokeWidth={2} />
          <Line type="monotone" dataKey="energy" stroke="#82ca9d" strokeWidth={2} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}