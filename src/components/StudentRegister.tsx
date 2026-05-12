import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { UserPlus, User, Hash, GraduationCap, ArrowRight, CheckCircle, QrCode, Download, RefreshCcw } from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';

export default function StudentRegister() {
  const [formData, setFormData] = useState({
    name: '',
    rollNo: '',
    branch: ''
  });
  const [loading, setLoading] = useState(false);
  const [registeredStudent, setRegisteredStudent] = useState<any>(null);
  const [error, setError] = useState('');

  const branches = [
    'Computer Science & Engineering',
    'Electrical Engineering',
    'Mechanical Engineering',
    'Civil Engineering',
    'Chemical Engineering',
    'Metallurgical Engineering',
    'Artificial Intelligence',
    'Mathematics & Computing'
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      const res = await fetch('/api/students', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      
      const data = await res.json();
      
      if (!res.ok) throw new Error(data.error || 'Registration failed');
      
      setRegisteredStudent(data);
      setFormData({ name: '', rollNo: '', branch: '' });
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const downloadQR = () => {
    const svg = document.getElementById('student-qr');
    if (!svg) return;
    
    const svgData = new XMLSerializer().serializeToString(svg);
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const img = new Image();
    
    img.onload = () => {
      canvas.width = img.width;
      canvas.height = img.height;
      if (ctx) {
        ctx.fillStyle = "white";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(img, 0, 0);
        const pngFile = canvas.toDataURL('image/png');
        const downloadLink = document.createElement('a');
        downloadLink.download = `${registeredStudent.rollNo}_QR.png`;
        downloadLink.href = pngFile;
        downloadLink.click();
      }
    };
    
    img.src = 'data:image/svg+xml;base64,' + btoa(svgData);
  };

  return (
    <div className="max-w-4xl mx-auto">
      <AnimatePresence mode="wait">
        {!registeredStudent ? (
          <motion.div
            key="form"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="bg-white rounded-none shadow-[20px_20px_0px_rgba(0,0,0,0.05)] border border-slate-200 overflow-hidden"
          >
            <div className="grid grid-cols-1 md:grid-cols-5 h-full">
              {/* Info Column */}
              <div className="md:col-span-2 bg-slate-900 p-8 text-white flex flex-col justify-between border-r border-slate-800">
                <div>
                  <div className="w-12 h-12 bg-iitp-accent rounded-none flex items-center justify-center mb-6 shadow-lg shadow-iitp-accent/20">
                    <UserPlus className="w-6 h-6 text-slate-900" />
                  </div>
                  <h2 className="text-3xl font-black uppercase tracking-tighter leading-8 italic">New Student Enrollment</h2>
                  <p className="text-white/40 mt-6 text-xs font-bold uppercase tracking-widest leading-relaxed">
                    Generate unique QR identities for secure campus access control.
                  </p>
                </div>
                
                <div className="space-y-4 pt-10">
                  <div className="flex items-center gap-3 text-[10px] font-black uppercase tracking-widest text-white/60">
                    <div className="w-1.5 h-1.5 bg-iitp-accent rounded-none" />
                    <span>Instant ID Forge</span>
                  </div>
                  <div className="flex items-center gap-3 text-[10px] font-black uppercase tracking-widest text-white/60">
                    <div className="w-1.5 h-1.5 bg-iitp-accent rounded-none" />
                    <span>Central Registry</span>
                  </div>
                </div>
              </div>

              {/* Form Column */}
              <div className="md:col-span-3 p-8">
                <form onSubmit={handleSubmit} className="space-y-6">
                  {error && (
                    <div className="p-4 bg-red-50 text-red-700 border-l-4 border-red-500 text-[10px] font-black uppercase tracking-widest">
                      SYSTEM ERROR: {error}
                    </div>
                  )}

                  <div className="space-y-1">
                    <label className="text-[10px] font-black uppercase text-slate-400">Full Academic Name</label>
                    <div className="relative">
                      <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                      <input 
                        type="text"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        placeholder="EX: RAJESH KUMAR"
                        className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-none focus:bg-white focus:border-slate-900 transition-all outline-none font-bold text-sm"
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] font-black uppercase text-slate-400">Unique Roll Number</label>
                    <div className="relative">
                      <Hash className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                      <input 
                        type="text"
                        value={formData.rollNo}
                        onChange={(e) => setFormData({ ...formData, rollNo: e.target.value })}
                        placeholder="EX: 2301CS01"
                        className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-none focus:bg-white focus:border-slate-900 transition-all outline-none font-mono text-sm font-bold"
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] font-black uppercase text-slate-400">Academic Department</label>
                    <div className="relative">
                      <GraduationCap className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                      <select 
                        value={formData.branch}
                        onChange={(e) => setFormData({ ...formData, branch: e.target.value })}
                        className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-none focus:bg-white focus:border-slate-900 transition-all outline-none appearance-none font-bold text-sm"
                        required
                      >
                        <option value="">SELECT BRANCH</option>
                        {branches.map(b => <option key={b} value={b}>{b.toUpperCase()}</option>)}
                      </select>
                    </div>
                  </div>

                  <button 
                    type="submit"
                    disabled={loading}
                    className="w-full py-4 bg-iitp-accent text-slate-900 font-black uppercase tracking-[0.2em] text-xs flex items-center justify-center gap-3 hover:bg-slate-900 hover:text-white transition-all disabled:opacity-50 shadow-lg"
                  >
                    {loading ? <RefreshCcw className="w-4 h-4 animate-spin" /> : <><ArrowRight className="w-4 h-4" /> CREATE IDENTITY</>}
                  </button>
                </form>
              </div>
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="success"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex flex-col items-center text-center py-10"
          >
            <div className="w-20 h-20 bg-green-500 text-white rounded-none flex items-center justify-center mb-6 shadow-xl">
              <CheckCircle className="w-10 h-10" />
            </div>
            <h2 className="text-4xl font-black uppercase tracking-tighter italic text-slate-900 leading-none">Identity Forged</h2>
            <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest mt-4">Student has been integrated into the central registry</p>

            <motion.div 
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="mt-12 bg-white p-10 rounded-none shadow-[30px_30px_0px_rgba(0,0,0,0.05)] border border-slate-200 flex flex-col items-center border-b-8 border-iitp-accent"
            >
              <div className="bg-white p-4 rounded-none border-4 border-slate-900 shadow-inner">
                <QRCodeSVG 
                  id="student-qr"
                  value={registeredStudent.qrCode}
                  size={220}
                  level="H"
                  includeMargin={false}
                />
              </div>
              <div className="mt-8 text-center">
                <p className="text-2xl font-black uppercase tracking-tight text-slate-900 leading-none">{registeredStudent.name}</p>
                <p className="text-sm font-mono text-slate-500 mt-2 font-bold">{registeredStudent.rollNo}</p>
                <div className="mt-4 px-4 py-1.5 bg-slate-900 text-white text-[10px] font-black uppercase tracking-widest inline-block">
                  {registeredStudent.branch}
                </div>
              </div>

              <div className="flex gap-4 mt-10 w-full">
                <button 
                  onClick={downloadQR}
                  className="flex-1 flex items-center justify-center gap-2 py-4 bg-iitp-blue text-white font-black uppercase text-xs tracking-widest hover:opacity-90 transition-all shadow-md"
                >
                  <Download className="w-4 h-4" />
                  EXPORT PNG
                </button>
                <button 
                  onClick={() => setRegisteredStudent(null)}
                  className="flex-1 flex items-center justify-center gap-2 py-4 bg-slate-100 text-slate-600 font-black uppercase text-xs tracking-widest hover:bg-slate-200 transition-all"
                >
                  <RefreshCcw className="w-4 h-4" />
                  NEW REGISTRY
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
