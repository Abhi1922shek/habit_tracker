'use client';

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell
} from 'recharts';

interface Habit {
  id: number;
  title: string;
  logs: { id: number; completed_date: string }[];
}

export default function HabitStats({ habits }: { habits: Habit[] }) {
  
  // 1. Calculate Data for the Last 7 Days
  const data = [];
  const today = new Date();

  for (let i = 6; i >= 0; i--) {
    const d = new Date();
    d.setDate(today.getDate() - i);
    const dateStr = d.toLocaleDateString('en-CA'); // YYYY-MM-DD
    
    // Count total completions across ALL habits for this specific date
    let count = 0;
    habits.forEach(habit => {
      if (habit.logs.some(log => log.completed_date === dateStr)) {
        count++;
      }
    });

    data.push({
      day: d.toLocaleDateString('en-US', { weekday: 'short' }), // "Mon", "Tue"
      count: count,
      fullDate: dateStr
    });
  }

  // 2. Calculate Total All-Time Completions
  const totalCompletions = habits.reduce((acc, curr) => acc + curr.logs.length, 0);

  // 3. Find Best Streak (Simple version: Highest completion count habit)
  const bestHabit = [...habits].sort((a, b) => b.logs.length - a.logs.length)[0];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
      
      {/* Chart Section */}
      <div className="md:col-span-2 bg-gray-900 p-6 rounded-2xl border border-gray-800">
        <h3 className="text-gray-400 text-sm font-bold mb-4 uppercase tracking-wider">Weekly Activity</h3>
        <div className="h-48 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data}>
              <XAxis 
                dataKey="day" 
                stroke="#6b7280" 
                tickLine={false} 
                axisLine={false} 
                fontSize={12}
              />
              <Tooltip 
                contentStyle={{ backgroundColor: '#000', borderRadius: '8px', border: '1px solid #333' }}
                cursor={{ fill: '#1f2937' }}
              />
              <Bar dataKey="count" radius={[4, 4, 0, 0]}>
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.count > 0 ? '#8b5cf6' : '#374151'} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Mini Stats Cards */}
      <div className="flex flex-col gap-4">
        
        <div className="bg-gradient-to-br from-gray-900 to-black p-6 rounded-2xl border border-gray-800 flex-1 flex flex-col justify-center">
          <p className="text-gray-400 text-sm font-bold uppercase">Total Check-ins</p>
          <p className="text-4xl font-bold text-white mt-2">{totalCompletions}</p>
        </div>

        <div className="bg-gradient-to-br from-purple-900/20 to-black p-6 rounded-2xl border border-purple-900/30 flex-1 flex flex-col justify-center">
          <p className="text-purple-400 text-sm font-bold uppercase">Top Habit</p>
          <p className="text-xl font-bold text-white mt-2 truncate">
            {bestHabit ? bestHabit.title : "No data yet"}
          </p>
          <p className="text-xs text-gray-500 mt-1">
            {bestHabit ? `${bestHabit.logs.length} completions` : "Start tracking!"}
          </p>
        </div>

      </div>
    </div>
  );
}