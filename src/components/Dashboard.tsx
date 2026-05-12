import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { 
  Users, 
  CheckCircle, 
  GraduationCap, 
  TrendingUp,
  Clock,
  Calendar
} from 'lucide-react';
import { formatDate, cn } from '../lib/utils';

export default function Dashboard() {
  const [stats, setStats] = useState({
    totalStudents: 0,
    presentToday: 0,
    branches: 0
  });
  const [recentAttendance, setRecentAttendance] = useState<any[]>([]);

  useEffect(() => {
    fetchStats();
    fetchRecentAttendance();
    
    // Auto-refresh every minute
    const interval = setInterval(() => {
      fetchStats();
      fetchRecentAttendance();
    }, 60000);
    
    return () => clearInterval(interval);
  }, []);

  const fetchStats = async () => {
    try {
      const res = await fetch('/api/stats');
      const data = await res.json();
      setStats(data);
    } catch (err) {
      console.error("Failed to fetch stats", err);
    }
  };

  const fetchRecentAttendance = async () => {
    try {
      const res = await fetch('/api/attendance');
      const data = await res.json();
      setRecentAttendance(data.slice(0, 5)); // Only top 5
    } catch (err) {
      console.error("Failed to fetch recent attendance", err);
    }
  };

  const attendanceRate = stats.totalStudents > 0 
    ? Math.round((stats.presentToday / stats.totalStudents) * 100) 
    : 0;

  const statCards = [
    { label: 'Total Enrolled', value: stats.totalStudents, icon: Users, borderColor: 'border-blue-600' },
    { label: 'Present Today', value: stats.presentToday, icon: CheckCircle, borderColor: 'border-green-500' },
    { label: 'Attendance Rate', value: `${attendanceRate}%`, icon: TrendingUp, borderColor: 'border-amber-500' },
    { label: 'Total Branches', value: stats.branches, icon: GraduationCap, borderColor: 'border-purple-600' },
  ];

  return (
    <div className="space-y-8 pb-10">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className={cn(
              "bg-white p-5 shadow-sm border-l-4",
              stat.borderColor
            )}
          >
            <p className="text-[10px] font-black uppercase text-slate-400 mb-1">{stat.label}</p>
            <p className="text-5xl font-black text-slate-900 tracking-tighter">{stat.value}</p>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recent Activity Table */}
        <div className="lg:col-span-2 bg-white border border-slate-200 overflow-hidden">
          <div className="p-4 border-b border-slate-100 flex justify-between items-center">
            <h2 className="text-lg font-black uppercase tracking-tight italic">Recent Activity</h2>
            <div className="flex gap-2">
              <span className="bg-blue-50 text-blue-900 text-[10px] font-black px-3 py-1.5 uppercase tracking-widest">Live Updates</span>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200">
                  <th className="p-4 text-[10px] font-black uppercase text-slate-500">Name</th>
                  <th className="p-4 text-[10px] font-black uppercase text-slate-500">Roll No</th>
                  <th className="p-4 text-[10px] font-black uppercase text-slate-500">Timestamp</th>
                  <th className="p-4 text-[10px] font-black uppercase text-slate-500 text-right">Status</th>
                </tr>
              </thead>
              <tbody className="text-sm font-medium">
                {recentAttendance.length > 0 ? (
                  recentAttendance.map((record, i) => (
                    <tr key={record.id} className={cn(
                      "border-b border-slate-50 hover:bg-slate-50 transition-colors",
                      i % 2 === 1 && "bg-slate-50/30"
                    )}>
                      <td className="p-4 font-bold text-slate-900">{record.studentName}</td>
                      <td className="p-4 font-mono text-slate-600">{record.rollNo}</td>
                      <td className="p-4 text-slate-500">{new Date(record.timestamp).toLocaleTimeString()}</td>
                      <td className="p-4 text-right">
                        <span className="text-green-600 font-black uppercase text-xs">Present</span>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={4} className="p-8 text-center text-slate-400 italic">No records yet.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Quick Info Card */}
        <div className="flex flex-col gap-6">
          <div className="bg-slate-900 text-white p-6 rounded-sm shadow-xl flex flex-col gap-4">
            <h3 className="text-sm font-black uppercase tracking-widest text-amber-500">Campus Status</h3>
            <div className="space-y-4">
              <div className="flex justify-between items-end border-b border-slate-800 pb-2">
                <p className="text-[10px] font-black uppercase text-slate-500">Location</p>
                <p className="text-xs font-bold uppercase tracking-tight">Bihta, Patna</p>
              </div>
              <div className="flex justify-between items-end border-b border-slate-800 pb-2">
                <p className="text-[10px] font-black uppercase text-slate-500">Semester</p>
                <p className="text-xs font-bold uppercase tracking-tight">Spring 2024</p>
              </div>
              <div className="flex justify-between items-end border-b border-slate-800 pb-2">
                <p className="text-[10px] font-black uppercase text-slate-500">Gateway</p>
                <p className="text-xs font-bold uppercase tracking-tight text-green-400">Main Hall A</p>
              </div>
            </div>
            <button className="w-full mt-2 py-3 bg-white text-slate-900 font-black uppercase text-xs tracking-widest hover:bg-opacity-90 transition-colors">
              Session Details
            </button>
          </div>

          <div className="bg-white p-6 border border-slate-200">
            <h3 className="text-sm font-black uppercase mb-4 tracking-tighter">Branch Stats</h3>
            <div className="space-y-4">
              {['CSE', 'EE', 'ME'].map((branch) => (
                <div key={branch} className="space-y-1">
                  <div className="flex justify-between text-[10px] font-black uppercase italic">
                    <span className="text-slate-500">{branch}</span>
                    <span className="text-slate-900">High</span>
                  </div>
                  <div className="h-2 bg-slate-100 overflow-hidden rounded-none">
                    <div className="h-full bg-slate-900" style={{ width: '70%' }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
