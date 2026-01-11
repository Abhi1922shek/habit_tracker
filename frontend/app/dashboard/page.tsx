'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import api from '@/utils/api';
import { Plus, Check, LogOut, X, Trash2, Pencil } from 'lucide-react';
import HabitStats from '@/components/HabitStats';

interface Habit {
  id: number;
  title: string;
  description: string;
  logs: { id: number; completed_date: string }[];
}

// Helper: Calculate Streak
const calculateStreak = (logs: { completed_date: string }[]) => {
  if (!logs || logs.length === 0) return 0;

  // 1. Sort logs by date (newest first)
  const sortedLogs = [...logs].sort((a, b) => 
    new Date(b.completed_date).getTime() - new Date(a.completed_date).getTime()
  );

  let streak = 0;
  const today = new Date();
  const todayStr = today.toLocaleDateString('en-CA'); // YYYY-MM-DD
  
  // Create a date object for "Yesterday"
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  const yesterdayStr = yesterday.toLocaleDateString('en-CA');

  // Check if the most recent log is Today or Yesterday.
  // If the last log was 2 days ago, the streak is broken (0).
  const lastLogDate = sortedLogs[0].completed_date;
  
  if (lastLogDate !== todayStr && lastLogDate !== yesterdayStr) {
    return 0;
  }

  // 2. Count backwards
  // We start checking from Today (or Yesterday if not done today yet)
  let checkDate = new Date();
  
  // If not done today yet, start checking from yesterday
  if (lastLogDate !== todayStr) {
    checkDate.setDate(checkDate.getDate() - 1);
  }

  for (const log of sortedLogs) {
    const checkStr = checkDate.toLocaleDateString('en-CA');
    
    if (log.completed_date === checkStr) {
      streak++;
      // Move checkDate back 1 day
      checkDate.setDate(checkDate.getDate() - 1);
    } else {
      // Gap found, streak ends
      break;
    }
  }

  return streak;
};

export default function Dashboard() {
  const router = useRouter();
  const [habits, setHabits] = useState<Habit[]>([]);
  const [loading, setLoading] = useState(true);
  const [todayStr, setTodayStr] = useState('');

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingHabitId, setEditingHabitId] = useState<number | null>(null); // Track if we are editing
  const [habitTitle, setHabitTitle] = useState('');
  const [habitDesc, setHabitDesc] = useState('');

  useEffect(() => {
    // Set date to YYYY-MM-DD
    setTodayStr(new Date().toLocaleDateString('en-CA'));
    
    const token = localStorage.getItem('access_token');
    if (!token) {
      router.replace('/login');
    } else {
      fetchHabits();
    }
  }, [router]);

  const fetchHabits = async () => {
    try {
      const response = await api.get('habits/');
      setHabits(response.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // --- CRUD OPERATIONS ---

  // 1. TOGGLE (Check / Uncheck)
  const toggleHabit = async (habit: Habit) => {
    try {
      // Find if there is a log for today
      const todayLog = habit.logs.find(log => log.completed_date === todayStr);

      if (todayLog) {
        // UNCHECK: If log exists, delete it
        await api.delete(`logs/${todayLog.id}/`);
      } else {
        // CHECK: If log doesn't exist, create it
        await api.post('logs/', {
          habit: habit.id,
          completed_date: todayStr
        });
      }
      // Refresh UI
      fetchHabits(); 
    } catch (err) {
      console.error("Toggle error", err);
      alert("Something went wrong updating the habit.");
    }
  };

  // 2. DELETE HABIT
  const deleteHabit = async (id: number) => {
    if (!confirm('Are you sure you want to delete this habit?')) return;
    
    try {
      await api.delete(`habits/${id}/`);
      setHabits(habits.filter(h => h.id !== id)); // Optimistic update
    } catch (err) {
      console.error(err);
      alert("Failed to delete habit");
    }
  };

  // 3. EDIT HABIT (Open Modal)
  const openEditModal = (habit: Habit) => {
    setEditingHabitId(habit.id);
    setHabitTitle(habit.title);
    setHabitDesc(habit.description);
    setIsModalOpen(true);
  };

  // 4. CREATE / UPDATE SUBMIT
  const handleHabitSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!habitTitle) return;

    try {
      if (editingHabitId) {
        // UPDATE existing
        await api.put(`habits/${editingHabitId}/`, {
          title: habitTitle,
          description: habitDesc
        });
      } else {
        // CREATE new
        await api.post('habits/', {
          title: habitTitle,
          description: habitDesc
        });
      }
      
      // Cleanup
      closeModal();
      fetchHabits();
    } catch (err) {
      console.error('Failed to save habit', err);
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingHabitId(null);
    setHabitTitle('');
    setHabitDesc('');
  };

  const handleLogout = () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    router.replace('/login');
  };

  if (loading) return <div className="min-h-screen bg-black text-white flex items-center justify-center">Loading...</div>;

  return (
    <main className="min-h-screen bg-black text-white p-6 pb-24 relative">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-pink-600 text-transparent bg-clip-text">
            My Habits
          </h1>
          <p className="text-gray-400 text-sm">{todayStr}</p>
        </div>
        <button onClick={handleLogout} className="p-2 bg-gray-900 rounded-full hover:bg-gray-800 transition">
          <LogOut size={20} className="text-gray-400" />
        </button>
      </div>

      {/* Statistics Section (Only show if habits exist) */}
      {habits.length > 0 && <HabitStats habits={habits} />}

      {/* Habits Grid */}
      <div className="grid gap-4">
        {habits.length === 0 ? (
          <div className="text-center text-gray-500 mt-10">
            <p>No habits yet. Click + to add one!</p>
          </div>
        ) : (
          habits.map((habit) => {
            const isCompletedToday = habit.logs.some(log => log.completed_date === todayStr);
            return (
              <div 
                key={habit.id} 
                className={`p-5 rounded-2xl border transition-all flex justify-between items-center group
                  ${isCompletedToday ? 'bg-gray-900 border-purple-900/50' : 'bg-black border-gray-800'}`}
              >
                <div className="flex-1">
                  <h3 className={`font-bold text-xl ${isCompletedToday ? 'text-gray-400 line-through' : 'text-white'}`}>
                    {habit.title}
                  </h3>
                  <p className="text-gray-500 text-sm">{habit.description}</p>
                  
                  {/* Action Buttons (Visible on mobile, or hover on desktop) */}
                  <div className="flex gap-4 mt-3">
                     {/* Streak Badge */}
                      <div className="flex items-center gap-1 mt-2">
                        <div className={`flex items-center gap-1 px-2 py-1 rounded-md text-xs font-bold transition-colors
                          ${calculateStreak(habit.logs) > 0 
                            ? 'bg-orange-500/20 text-orange-500 border border-orange-500/30' // Active
                            : 'bg-gray-800 text-gray-500 border border-gray-700'             // Inactive
                          }`}
                        >
                          <span>🔥 {calculateStreak(habit.logs)} Day Streak</span>
                        </div>
                      </div>
                     
                     {/* Edit Button */}
                     <button 
                       onClick={() => openEditModal(habit)}
                       className="text-gray-500 hover:text-blue-400 transition"
                     >
                        <Pencil size={16} />
                     </button>

                     {/* Delete Button */}
                     <button 
                       onClick={() => deleteHabit(habit.id)}
                       className="text-gray-500 hover:text-red-500 transition"
                     >
                        <Trash2 size={16} />
                     </button>
                  </div>
                </div>

                {/* Toggle Checkbox */}
                <button
                  onClick={() => toggleHabit(habit)}
                  className={`p-4 rounded-xl transition-all shadow-lg ml-4
                    ${isCompletedToday 
                      ? 'bg-green-500/20 text-green-500' 
                      : 'bg-white text-black hover:bg-gray-200 active:scale-95'}`}
                >
                  {isCompletedToday ? <Check size={24} /> : <div className="w-6 h-6 border-2 border-black rounded-full" />}
                </button>
              </div>
            );
          })
        )}
      </div>

      {/* Floating Add Button */}
      <button 
        onClick={() => setIsModalOpen(true)}
        className="fixed bottom-6 right-6 bg-gradient-to-r from-purple-500 to-pink-600 text-white p-4 rounded-full shadow-lg hover:scale-110 transition shadow-purple-900/50 z-10"
      >
        <Plus size={32} />
      </button>

      {/* Shared Modal (Create & Edit) */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-gray-900 border border-gray-800 p-6 rounded-2xl w-full max-w-sm shadow-2xl">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-white">
                {editingHabitId ? 'Edit Habit' : 'New Habit'}
              </h2>
              <button onClick={closeModal} className="text-gray-400 hover:text-white">
                <X size={24} />
              </button>
            </div>

            <form onSubmit={handleHabitSubmit} className="flex flex-col gap-4">
              <input
                type="text"
                placeholder="Habit Title (e.g. Read 10 mins)"
                value={habitTitle}
                onChange={(e) => setHabitTitle(e.target.value)}
                className="w-full p-4 rounded-xl bg-black border border-gray-700 text-white focus:outline-none focus:border-purple-500"
                autoFocus
              />
              <textarea
                placeholder="Description (Optional)"
                value={habitDesc}
                onChange={(e) => setHabitDesc(e.target.value)}
                className="w-full p-4 rounded-xl bg-black border border-gray-700 text-white focus:outline-none focus:border-purple-500"
                rows={3}
              />
              <button
                type="submit"
                className="w-full bg-white text-black font-bold py-4 rounded-xl hover:bg-gray-200 transition mt-2"
              >
                {editingHabitId ? 'Save Changes' : 'Create Habit'}
              </button>
            </form>
          </div>
        </div>
      )}
    </main>
  );
}