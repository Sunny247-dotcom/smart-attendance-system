import React, { useState, useEffect } from 'react';
import { 
  Search, 
  Download, 
  Filter, 
  MoreVertical, 
  Calendar as CalendarIcon,
  User,
  Hash,
  Clock,
  CheckCircle2,
  AlertCircle,
  FileText
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { formatDate, cn } from '../lib/utils';

export default function AttendanceRecords() {
  const [records, setRecords] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRecords();
  }, []);

  const fetchRecords = async () => {
    try {
      const res = await fetch('/api/attendance');
      const data = await res.json();
      setRecords(data);
    } catch (err) {
      console.error("Failed to fetch records", err);
    } finally {
      setLoading(false);
    }
  };

  const downloadCSV = () => {
    window.location.href = '/api/attendance/export';
  };

  const filteredRecords = records.filter(record => 
    record.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    record.rollNo.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6 pb-20">
      {/* Search & Export Bar */}
      <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
        <div className="relative w-full sm:w-96">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input 
            type="text"
            placeholder="SEARCH RECORDS..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-12 pr-4 py-3 bg-white border border-slate-200 rounded-none focus:bg-slate-50 outline-none transition-all shadow-sm font-bold text-xs"
          />
        </div>
        
        <div className="flex gap-3 w-full sm:w-auto">
          <button 
            onClick={downloadCSV}
            className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-6 py-3 bg-slate-900 border border-slate-900 text-white rounded-none font-black text-xs uppercase tracking-widest hover:bg-white hover:text-slate-900 transition-all"
          >
            <Download className="w-4 h-4" />
            Export CSV
          </button>
        </div>
      </div>

      {/* Table Container */}
      <div className="bg-white rounded-none border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200">
                <th className="px-8 py-4 text-[10px] font-black uppercase text-slate-500 tracking-widest">Name</th>
                <th className="px-8 py-4 text-[10px] font-black uppercase text-slate-500 tracking-widest text-center">Roll Number</th>
                <th className="px-8 py-4 text-[10px] font-black uppercase text-slate-500 tracking-widest text-center">Timestamp</th>
                <th className="px-8 py-4 text-[10px] font-black uppercase text-slate-500 tracking-widest text-right">Verification</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {loading ? (
                <tr>
                  <td colSpan={5} className="px-8 py-20 text-center">
                    <p className="text-slate-400 font-black uppercase text-xs tracking-widest animate-pulse">Synchronizing Data...</p>
                  </td>
                </tr>
              ) : filteredRecords.length > 0 ? (
                filteredRecords.map((record, i) => (
                  <motion.tr 
                    key={record.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: i * 0.05 }}
                    className={cn(
                      "hover:bg-slate-50 transition-colors group",
                      i % 2 === 1 && "bg-slate-50/20"
                    )}
                  >
                    <td className="px-8 py-4">
                      <span className="font-black text-slate-900 uppercase text-sm tracking-tight">{record.studentName}</span>
                    </td>
                    <td className="px-8 py-4 text-center">
                      <span className="font-mono text-xs font-bold text-slate-600">
                        {record.rollNo}
                      </span>
                    </td>
                    <td className="px-8 py-4 text-center">
                      <span className="text-[11px] font-bold text-slate-500">
                        {new Date(record.timestamp).toLocaleString()}
                      </span>
                    </td>
                    <td className="px-8 py-4 text-right">
                      <span className="inline-block px-2 py-1 bg-green-50 text-green-700 text-[10px] font-black uppercase tracking-tighter border border-green-200">
                        Verified Access
                      </span>
                    </td>
                  </motion.tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="px-8 py-32 text-center">
                    <p className="text-xl font-black text-slate-200 uppercase tracking-tighter">No Access Logs Found</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
