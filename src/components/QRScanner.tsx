import React, { useEffect, useState, useRef } from 'react';
import { Html5QrcodeScanner } from 'html5-qrcode';
import { motion, AnimatePresence } from 'motion/react';
import { QrCode, ShieldCheck, AlertCircle, CheckCircle2, User, RefreshCw, X, Camera } from 'lucide-react';
import { formatDate } from '../lib/utils';

export default function QRScanner() {
  const [scanResult, setScanResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [scanning, setScanning] = useState(true);
  const scannerRef = useRef<Html5QrcodeScanner | null>(null);

  useEffect(() => {
    // Only initialize scanner if we are in "scanning" mode
    if (scanning) {
      const scanner = new Html5QrcodeScanner(
        "reader",
        { 
          fps: 10, 
          qrbox: { width: 250, height: 250 },
          aspectRatio: 1.0,
          showTorchButtonIfSupported: true
        },
        /* verbose= */ false
      );

      scanner.render(onScanSuccess, onScanFailure);
      scannerRef.current = scanner;
    }

    return () => {
      if (scannerRef.current) {
        scannerRef.current.clear().catch(err => console.error("Failed to clear scanner", err));
      }
    };
  }, [scanning]);

  const onScanSuccess = async (decodedText: string) => {
    // Stop scanning once we get a result to process it
    if (scannerRef.current) {
      await scannerRef.current.clear();
      setScanning(false);
    }

    try {
      const res = await fetch('/api/attendance/mark', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ qrData: decodedText })
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.error || 'Failed to mark attendance');

      setScanResult(data);
      setError(null);
      
      // Play a success sound if desired (omitted for compatibility)
      
    } catch (err: any) {
      setError(err.message);
      setScanResult(null);
    }
  };

  const onScanFailure = (err: any) => {
    // Silently ignore failures - they happen constantly when no QR is in view
  };

  const resetScanner = () => {
    setScanResult(null);
    setError(null);
    setScanning(true);
  };

  return (
    <div className="max-w-2xl mx-auto space-y-8 pb-20">
      <div className="text-center">
        <h1 className="text-4xl font-black tracking-tighter uppercase leading-none text-slate-900 border-b-4 border-iitp-accent inline-block pb-2">
          LIVE SCANNER
        </h1>
        <p className="text-[10px] font-black uppercase text-slate-400 tracking-[0.2em] mt-4">Position QR code inside the capture frame</p>
      </div>

      <div className="relative">
        <AnimatePresence mode="wait">
          {scanning ? (
            <motion.div
              key="scanner"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="bg-white p-6 rounded-none shadow-[10px_10px_0px_rgba(0,0,0,0.1)] border border-slate-200 overflow-hidden"
            >
              <div id="reader" className="w-full rounded-none overflow-hidden border-2 border-slate-900" />
              
              <div className="mt-6 flex items-center justify-center gap-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-none animate-pulse" />
                  OPTIC ACTIVE
                </div>
                <span>/</span>
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-3 h-3" />
                  ENCRYPTED
                </div>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="result"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-white p-8 rounded-none shadow-[15px_15px_0px_rgba(0,0,0,0.1)] border border-slate-200 flex flex-col items-center text-center"
            >
              {scanResult ? (
                <>
                  <div className="w-16 h-16 bg-green-500 text-white rounded-none flex items-center justify-center mb-6 shadow-lg">
                    <CheckCircle2 className="w-8 h-8" />
                  </div>
                  <h2 className="text-2xl font-black uppercase tracking-tight text-slate-900 italic">Access Granted</h2>
                  <div className="mt-6 p-6 bg-slate-50 border-l-4 border-iitp-blue w-full space-y-3">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-slate-900 text-white flex items-center justify-center font-black">
                        {scanResult.studentName.charAt(0)}
                      </div>
                      <div className="text-left">
                        <p className="font-black text-slate-900 uppercase text-sm">{scanResult.studentName}</p>
                        <p className="text-xs font-mono text-slate-500 tracking-tighter">{scanResult.rollNo}</p>
                      </div>
                    </div>
                    <div className="h-0.5 bg-slate-200 my-2" />
                    <div className="flex justify-between items-end">
                      <span className="text-[9px] font-black uppercase text-slate-400 tracking-widest leading-none">Timestamp</span>
                      <span className="text-xs font-black text-slate-900 uppercase leading-none">{new Date(scanResult.timestamp).toLocaleString()}</span>
                    </div>
                  </div>
                </>
              ) : (
                <>
                  <div className="w-16 h-16 bg-red-600 text-white rounded-none flex items-center justify-center mb-6 shadow-lg">
                    <AlertCircle className="w-8 h-8" />
                  </div>
                  <h2 className="text-2xl font-black uppercase tracking-tight text-slate-900 italic">Scan Terminated</h2>
                  <p className="text-red-700 font-black uppercase text-[10px] mt-4 p-3 bg-red-50 border border-red-100 w-full tracking-widest leading-relaxed">
                    ERROR: {error}
                  </p>
                </>
              )}

              <button
                onClick={resetScanner}
                className="mt-8 w-full py-4 bg-slate-900 text-white font-black uppercase text-xs tracking-[0.2em] hover:bg-iitp-blue transition-all"
              >
                Reset Scanner
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
