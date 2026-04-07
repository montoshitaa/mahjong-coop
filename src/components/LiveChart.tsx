import React, { useMemo } from 'react';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer 
} from 'recharts';
import { ScoreSnapshot, Player } from '../types';

interface LiveChartProps {
  scoreHistory: ScoreSnapshot[];
  players: Player[];
}

const COLORS = [
  '#ef4444', // red-500
  '#3b82f6', // blue-500
  '#10b981', // emerald-500
  '#f59e0b', // amber-500
  '#8b5cf6', // violet-500
  '#ec4899', // pink-500
  '#06b6d4', // cyan-500
  '#f97316', // orange-500
];

const LiveChart: React.FC<LiveChartProps> = ({ scoreHistory, players }) => {
  const chartData = useMemo(() => {
    if (scoreHistory.length === 0) return [];

    const firstTimestamp = scoreHistory[0].timestamp;

    return scoreHistory.map((snapshot) => {
      const dataPoint: any = {
        time: Math.round((snapshot.timestamp - firstTimestamp) / 1000), // elapsed seconds
      };

      // Map player IDs to names for the chart
      players.forEach((player) => {
        dataPoint[player.name] = snapshot.scores[player.id] || 0;
      });

      return dataPoint;
    });
  }, [scoreHistory, players]);

  if (scoreHistory.length < 2) {
    return (
      <div className="w-full h-full flex items-center justify-center rounded-xl border italic text-xs"
           style={{ backgroundColor: 'var(--chart-bg)', borderColor: 'var(--chart-border)', color: 'var(--chart-text)' }}>
        Waiting for score updates...
      </div>
    );
  }

  return (
    <div className="w-full h-full rounded-xl border p-3 shadow-2xl flex flex-col"
         style={{ backgroundColor: 'var(--chart-bg)', borderColor: 'var(--chart-border)' }}>
      <div className="flex justify-between items-center mb-2">
        <h2 className="text-[10px] font-bold uppercase tracking-widest" style={{ color: 'var(--chart-text)' }}>Score Progression</h2>
      </div>
      <div className="flex-1 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chartData} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--chart-grid)" vertical={false} />
            <XAxis 
              dataKey="time" 
              stroke="var(--chart-text)" 
              fontSize={10} 
              tickLine={false} 
              axisLine={false}
            />
            <YAxis 
              stroke="var(--chart-text)" 
              fontSize={10} 
              tickLine={false} 
              axisLine={false}
              allowDecimals={false}
            />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: 'var(--chart-bg)', 
                border: '1px solid var(--chart-border)', 
                borderRadius: '4px', 
                color: 'var(--chart-text)', 
                fontSize: '10px' 
              }}
              itemStyle={{ padding: '0px' }}
            />
            {players.map((player, index) => (
              <Line
                key={player.id}
                type="monotone"
                dataKey={player.name}
                stroke={COLORS[index % COLORS.length]}
                strokeWidth={2}
                dot={false}
                activeDot={{ r: 4, strokeWidth: 0 }}
                animationDuration={500}
              />
            ))}
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default LiveChart;
