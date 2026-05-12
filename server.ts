import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import { fileURLToPath } from "url";
import fs from "fs";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// In-memory data store for the demo
// In a real application, you would use a database like Firestore or PostgreSQL
interface Student {
  id: string;
  name: string;
  rollNo: string;
  branch: string;
  qrCode: string; // The data contained in the QR code
}

interface AttendanceRecord {
  id: string;
  studentId: string;
  studentName: string;
  rollNo: string;
  timestamp: string;
  status: "Present";
}

let students: Student[] = [];
let attendance: AttendanceRecord[] = [];

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // API Routes
  
  // Register a new student
  app.post("/api/students", (req, res) => {
    const { name, rollNo, branch } = req.body;
    
    if (!name || !rollNo || !branch) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    // Check if student already exists
    if (students.find(s => s.rollNo === rollNo)) {
      return res.status(400).json({ error: "Student with this Roll No already exists" });
    }

    const newStudent: Student = {
      id: Math.random().toString(36).substr(2, 9),
      name,
      rollNo,
      branch,
      qrCode: `IITP-STU-${rollNo}` // Unique identifier for the QR code
    };

    students.push(newStudent);
    res.status(201).json(newStudent);
  });

  // Get all students
  app.get("/api/students", (req, res) => {
    res.json(students);
  });

  // Mark attendance
  app.post("/api/attendance/mark", (req, res) => {
    const { qrData } = req.body;

    if (!qrData) {
      return res.status(400).json({ error: "No QR data provided" });
    }

    // Find student by QR data
    const student = students.find(s => s.qrCode === qrData);
    if (!student) {
      return res.status(404).json({ error: "Invalid QR Code or Student not registered" });
    }

    // Check if attendance already marked for today
    const today = new Date().toISOString().split('T')[0];
    const existing = attendance.find(a => 
      a.studentId === student.id && 
      a.timestamp.startsWith(today)
    );

    if (existing) {
      return res.status(400).json({ error: `${student.name} already marked present today` });
    }

    const record: AttendanceRecord = {
      id: Math.random().toString(36).substr(2, 9),
      studentId: student.id,
      studentName: student.name,
      rollNo: student.rollNo,
      timestamp: new Date().toISOString(),
      status: "Present"
    };

    attendance.unshift(record); // Add to beginning
    res.status(201).json(record);
  });

  // Get attendance records
  app.get("/api/attendance", (req, res) => {
    res.json(attendance);
  });

  // Get stats for dashboard
  app.get("/api/stats", (req, res) => {
    const today = new Date().toISOString().split('T')[0];
    const presentToday = attendance.filter(a => a.timestamp.startsWith(today)).length;
    
    res.json({
      totalStudents: students.length,
      presentToday: presentToday,
      branches: Array.from(new Set(students.map(s => s.branch))).length
    });
  });

  // Export Attendance to CSV
  app.get("/api/attendance/export", (req, res) => {
    if (attendance.length === 0) {
      return res.status(400).json({ error: "No attendance records to export" });
    }
    
    const header = "Student Name,Roll No,Timestamp,Status\n";
    const rows = attendance.map(a => 
      `${a.studentName},${a.rollNo},${new Date(a.timestamp).toLocaleString()},${a.status}`
    ).join("\n");
    
    res.setHeader("Content-Type", "text/csv");
    res.setHeader("Content-Disposition", "attachment; filename=attendance.csv");
    res.send(header + rows);
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`IIT Patna Attendance Server running on http://localhost:${PORT}`);
  });
}

startServer();
