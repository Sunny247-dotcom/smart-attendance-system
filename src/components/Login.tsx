import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Lock, User, AlertCircle } from 'lucide-react';

interface LoginProps {
  onLogin: () => void;
}

export default function Login({ onLogin }: LoginProps) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Simple demo login
    if (username === 'admin' && password === 'admin123') {
      onLogin();
    } else {
      setError('Invalid username or password (try admin/admin123)');
    }
  };

  return (
    <div className="min-h-screen bg-blue-900 flex items-center justify-center p-4">
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-md bg-white rounded-none shadow-[20px_20px_0px_rgba(0,0,0,0.2)] overflow-hidden border-b-8 border-iitp-accent"
      >
        <div className="p-8 text-center bg-slate-900 text-white">
          <h1 className="text-4xl font-black tracking-tighter uppercase leading-none">IIT PATNA</h1>
          <p className="text-[10px] font-bold tracking-[0.3em] uppercase opacity-60 mt-2">Smart Attendance System</p>
        </div>

        <form onSubmit={handleSubmit} className="p-8 space-y-6">
          {error && (
            <motion.div 
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-3 bg-red-50 text-red-600 border-l-4 border-red-500 text-xs font-black uppercase tracking-widest"
            >
              {error}
            </motion.div>
          )}

          <div className="space-y-1">
            <label className="text-[10px] font-black uppercase text-slate-400">Username</label>
            <div className="relative">
              <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input 
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="admin"
                className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-none focus:bg-white focus:border-iitp-blue transition-all outline-none text-sm font-bold"
                required
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-[10px] font-black uppercase text-slate-400">Password</label>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input 
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-none focus:bg-white focus:border-iitp-blue transition-all outline-none text-sm font-bold"
                required
              />
            </div>
          </div>

          <button 
            type="submit"
            className="w-full py-4 bg-iitp-accent text-slate-900 font-black uppercase tracking-widest text-xs hover:bg-opacity-90 active:scale-[0.98] transition-all shadow-lg"
          >
            Authenticate User
          </button>

          <p className="text-center font-mono text-[10px] text-slate-400 uppercase">
            Default: admin / admin123
          </p>
        </form>
      </motion.div>
    </div>
  );
}
