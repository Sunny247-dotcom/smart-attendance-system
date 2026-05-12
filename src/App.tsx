/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { 
  Users, 
  QrCode, 
  LayoutDashboard, 
  ClipboardList, 
  LogOut, 
  Search,
  Download,
  Menu,
  X,
  UserPlus,
  CheckCircle2,
  AlertCircle,
  Loader2
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import Dashboard from './components/Dashboard';
import StudentRegister from './components/StudentRegister';
import QRScanner from './components/QRScanner';
import AttendanceRecords from './components/AttendanceRecords';
import Login from './components/Login';
import { cn } from './lib/utils';

export type View = 'dashboard' | 'register' | 'scanner' | 'records';

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [activeView, setActiveView] = useState<View>('dashboard');
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  // Persistence for demo purposes (simple local login)
  useEffect(() => {
    const auth = localStorage.getItem('iitp_auth');
    if (auth === 'true') setIsLoggedIn(true);
  }, []);

  const handleLogin = () => {
    localStorage.setItem('iitp_auth', 'true');
    setIsLoggedIn(true);
  };

  const handleLogout = () => {
    localStorage.removeItem('iitp_auth');
    setIsLoggedIn(false);
  };

  if (!isLoggedIn) {
    return <Login onLogin={handleLogin} />;
  }

  const navItems = [
    { id: 'dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { id: 'register', icon: UserPlus, label: 'Registration' },
    { id: 'scanner', icon: QrCode, label: 'Scan Attendance' },
    { id: 'records', icon: ClipboardList, label: 'Records' },
  ];

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      {/* Mobile Sidebar Overlay */}
      <AnimatePresence>
        {!isSidebarOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsSidebarOpen(true)}
            className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40 lg:hidden"
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <aside className={cn(
        "fixed inset-y-0 left-0 z-50 w-64 bg-slate-900 text-white transition-transform duration-300 transform lg:relative lg:translate-x-0",
        !isSidebarOpen && "-translate-x-full"
      )}>
        <div className="flex flex-col h-full">
          {/* Logo Section */}
          <div className="p-6 border-b-4 border-iitp-accent bg-blue-900">
            <div className="flex flex-col">
              <h1 className="text-3xl font-black tracking-tighter uppercase leading-none">IIT PATNA</h1>
              <p className="text-[10px] font-bold tracking-[0.2em] uppercase opacity-60 mt-1">Smart Attendance</p>
            </div>
          </div>

          {/* Navigation Items */}
          <nav className="flex-1 p-4 space-y-1 overflow-y-auto mt-4">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => {
                  setActiveView(item.id as View);
                  if (window.innerWidth < 1024) setIsSidebarOpen(false);
                }}
                className={cn(
                  "w-full flex items-center gap-3 px-4 py-3 rounded-none transition-all duration-200 group text-xs font-black uppercase tracking-widest",
                  activeView === item.id 
                    ? "bg-white text-slate-900 shadow-sm border-r-4 border-iitp-accent" 
                    : "text-white/40 hover:text-white hover:bg-white/5"
                )}
              >
                <item.icon className={cn(
                  "w-4 h-4",
                  activeView === item.id ? "text-iitp-blue" : "text-inherit"
                )} />
                {item.label}
              </button>
            ))}
          </nav>

          {/* User Info & Logout */}
          <div className="p-4 bg-slate-800">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-none bg-iitp-accent flex items-center justify-center font-black text-slate-900 text-xs">
                  AD
                </div>
                <div className="text-[10px] uppercase font-black tracking-widest">
                  <p className="text-white">Admin</p>
                  <p className="text-white/40">● Live</p>
                </div>
              </div>
              <button 
                onClick={handleLogout}
                className="p-2 text-white/40 hover:text-iitp-accent transition-colors"
                title="Logout"
              >
                <LogOut className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Header */}
        <header className="h-20 bg-white border-b border-slate-200 flex items-center justify-between px-8 shrink-0">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="p-2 text-slate-900 hover:bg-slate-50 rounded-none lg:hidden border border-slate-200"
            >
              {isSidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
            <h2 className="text-xl font-black uppercase tracking-tight italic text-slate-900">
              {activeView === 'records' ? 'Attendance History' : activeView}
            </h2>
          </div>
          
          <div className="flex items-center gap-8">
            <div className="hidden sm:block text-right">
              <p className="text-[10px] font-black uppercase text-slate-400">Current Date</p>
              <p className="font-black text-slate-900">{new Date().toLocaleDateString('en-US', { day: '2-digit', month: 'short', year: 'numeric' }).toUpperCase()}</p>
            </div>
            <div className="hidden sm:block text-right">
              <p className="text-[10px] font-black uppercase text-slate-400">System Status</p>
              <p className="font-mono text-sm font-bold text-green-600 uppercase tracking-tighter">● Online</p>
            </div>
          </div>
        </header>

        {/* Dynamic View Area */}
        <div className="flex-1 overflow-y-auto p-8">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeView}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.2 }}
              className="h-full"
            >
              {activeView === 'dashboard' && <Dashboard />}
              {activeView === 'register' && <StudentRegister />}
              {activeView === 'scanner' && <QRScanner />}
              {activeView === 'records' && <AttendanceRecords />}
            </motion.div>
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
}

