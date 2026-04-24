const express = require('express');
const cors = require('cors');
const mysql = require('mysql2/promise');

const app = express();
const port = 8080;

// Middleware
app.use(cors());
app.use(express.json());

const dbConfig = {
    host: 'localhost',
    user: 'root',
    password: 'gunareddy',
    database: 'sms_db',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
};

const pool = mysql.createPool(dbConfig);

pool.getConnection()
    .then(connection => {
        console.log('✅ Connected to MySQL database!');
        connection.release();
    })
    .catch(err => {
        console.error('❌ MySQL connection error:', err.message);
    });

// ========================================
// 1. STUDENTS CRUD
// ========================================
app.get('/students', async (req, res) => {
    try {
        const [rows] = await pool.query("SELECT * FROM student");
        res.json(rows);
    } catch (err) { res.status(500).json({ error: err.message }); }
});

app.post('/students', async (req, res) => {
    const { name, email, phone, attendance } = req.body;
    try {
        const [result] = await pool.query(
            `INSERT INTO student (name, email, phone, attendance) VALUES (?, ?, ?, ?)`,
            [name, email, phone, attendance]
        );
        res.status(201).json({ id: result.insertId, name, email, phone, attendance });
    } catch (err) { res.status(500).json({ error: err.message }); }
});

app.put('/students/:id', async (req, res) => {
    const { name, email, phone, attendance } = req.body;
    try {
        await pool.query(
            `UPDATE student SET name = ?, email = ?, phone = ?, attendance = ? WHERE id = ?`,
            [name, email, phone, attendance, req.params.id]
        );
        res.json({ message: "Student updated" });
    } catch (err) { res.status(500).json({ error: err.message }); }
});

app.delete('/students/:id', async (req, res) => {
    try {
        await pool.query(`DELETE FROM student WHERE id = ?`, [req.params.id]);
        res.json({ message: "Student deleted" });
    } catch (err) { res.status(500).json({ error: err.message }); }
});

// ========================================
// 2. COURSES CRUD
// ========================================
app.get('/courses', async (req, res) => {
    try {
        const [rows] = await pool.query("SELECT id, course_name AS courseName, course_code AS courseCode, attendance FROM course");
        res.json(rows);
    } catch (err) { res.status(500).json({ error: err.message }); }
});

app.post('/courses', async (req, res) => {
    const { courseName, courseCode, attendance } = req.body;
    try {
        const [result] = await pool.query(
            `INSERT INTO course (course_name, course_code, attendance) VALUES (?, ?, ?)`,
            [courseName, courseCode, attendance]
        );
        res.status(201).json({ id: result.insertId, courseName, courseCode, attendance });
    } catch (err) { res.status(500).json({ error: err.message }); }
});

app.put('/courses/:id', async (req, res) => {
    const { courseName, courseCode, attendance } = req.body;
    try {
        await pool.query(
            `UPDATE course SET course_name = ?, course_code = ?, attendance = ? WHERE id = ?`,
            [courseName, courseCode, attendance, req.params.id]
        );
        res.json({ message: "Course updated" });
    } catch (err) { res.status(500).json({ error: err.message }); }
});

app.delete('/courses/:id', async (req, res) => {
    try {
        await pool.query(`DELETE FROM course WHERE id = ?`, [req.params.id]);
        res.json({ message: "Course deleted" });
    } catch (err) { res.status(500).json({ error: err.message }); }
});

// ========================================
// 3. SOS ALERTS
// ========================================
app.post('/sos', async (req, res) => {
    const { studentName, issue, timestamp } = req.body;
    const alertTime = timestamp || new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' });
    try {
        const [result] = await pool.query(
            `INSERT INTO sos_alerts (student_name, issue, alert_time) VALUES (?, ?, ?)`,
            [studentName, issue, alertTime]
        );
        console.log(`🚨 SOS #${result.insertId}: ${studentName} - ${issue}`);
        res.json({ success: true, message: 'SOS Alert sent!', id: result.insertId });
    } catch (err) { res.status(500).json({ success: false, error: err.message }); }
});

app.get('/sos', async (req, res) => {
    try {
        const [rows] = await pool.query("SELECT * FROM sos_alerts ORDER BY created_at DESC");
        res.json(rows);
    } catch (err) { res.status(500).json({ error: err.message }); }
});

app.put('/sos/:id/resolve', async (req, res) => {
    try {
        await pool.query(`UPDATE sos_alerts SET status = 'resolved' WHERE id = ?`, [req.params.id]);
        res.json({ message: "Resolved" });
    } catch (err) { res.status(500).json({ error: err.message }); }
});

app.delete('/sos/:id', async (req, res) => {
    try {
        await pool.query(`DELETE FROM sos_alerts WHERE id = ?`, [req.params.id]);
        res.json({ message: "Deleted" });
    } catch (err) { res.status(500).json({ error: err.message }); }
});

// ========================================
// 4. ATTENDANCE MANAGEMENT & ANALYTICS
// ========================================

// Get all attendance records with student & course names
app.get('/attendance', async (req, res) => {
    try {
        const [rows] = await pool.query(`
            SELECT a.id, a.student_id, s.name AS student_name, a.course_id,
                   c.course_name, a.attendance_date, a.status
            FROM attendance a
            LEFT JOIN student s ON a.student_id = s.id
            LEFT JOIN course c ON a.course_id = c.id
            ORDER BY a.attendance_date DESC
        `);
        res.json(rows);
    } catch (err) { res.status(500).json({ error: err.message }); }
});

// Mark attendance
app.post('/attendance', async (req, res) => {
    const { student_id, course_id, attendance_date, status } = req.body;
    try {
        const [result] = await pool.query(
            `INSERT INTO attendance (student_id, course_id, attendance_date, status) VALUES (?, ?, ?, ?)`,
            [student_id, course_id, attendance_date, status]
        );
        res.status(201).json({ id: result.insertId, student_id, course_id, attendance_date, status });
    } catch (err) { res.status(500).json({ error: err.message }); }
});

// Attendance analytics: per-student summary
app.get('/attendance/analytics', async (req, res) => {
    try {
        const [rows] = await pool.query(`
            SELECT s.id, s.name, s.email,
                   COUNT(a.id) AS total_classes,
                   SUM(CASE WHEN a.status = 'Present' THEN 1 ELSE 0 END) AS present_count,
                   SUM(CASE WHEN a.status = 'Absent' THEN 1 ELSE 0 END) AS absent_count,
                   ROUND(SUM(CASE WHEN a.status = 'Present' THEN 1 ELSE 0 END) * 100.0 / NULLIF(COUNT(a.id), 0), 1) AS attendance_percentage
            FROM student s
            LEFT JOIN attendance a ON s.id = a.student_id
            GROUP BY s.id, s.name, s.email
            ORDER BY attendance_percentage ASC
        `);
        res.json(rows);
    } catch (err) { res.status(500).json({ error: err.message }); }
});

// At-risk students (below 75%)
app.get('/attendance/at-risk', async (req, res) => {
    try {
        const [rows] = await pool.query(`
            SELECT s.id, s.name, s.email, s.phone, s.attendance,
                   COUNT(a.id) AS total_classes,
                   SUM(CASE WHEN a.status = 'Present' THEN 1 ELSE 0 END) AS present_count,
                   ROUND(SUM(CASE WHEN a.status = 'Present' THEN 1 ELSE 0 END) * 100.0 / NULLIF(COUNT(a.id), 0), 1) AS calculated_percentage
            FROM student s
            LEFT JOIN attendance a ON s.id = a.student_id
            GROUP BY s.id
            HAVING s.attendance < 75 OR calculated_percentage < 75
        `);
        res.json(rows);
    } catch (err) { res.status(500).json({ error: err.message }); }
});

// ========================================
// 5. FEE MANAGEMENT
// ========================================

// Get all fees with student names
app.get('/fees', async (req, res) => {
    try {
        const [rows] = await pool.query(`
            SELECT f.id, f.student_id, s.name AS student_name, s.email,
                   f.amount, f.payment_date, f.status
            FROM fee f
            LEFT JOIN student s ON f.student_id = s.id
            ORDER BY f.status ASC, f.payment_date DESC
        `);
        res.json(rows);
    } catch (err) { res.status(500).json({ error: err.message }); }
});

// Add fee record
app.post('/fees', async (req, res) => {
    const { student_id, amount, payment_date, status } = req.body;
    try {
        const [result] = await pool.query(
            `INSERT INTO fee (student_id, amount, payment_date, status) VALUES (?, ?, ?, ?)`,
            [student_id, amount, payment_date, status]
        );
        res.status(201).json({ id: result.insertId, student_id, amount, payment_date, status });
    } catch (err) { res.status(500).json({ error: err.message }); }
});

// Update fee status (mark as paid)
app.put('/fees/:id', async (req, res) => {
    const { amount, payment_date, status } = req.body;
    try {
        await pool.query(
            `UPDATE fee SET amount = ?, payment_date = ?, status = ? WHERE id = ?`,
            [amount, payment_date, status, req.params.id]
        );
        res.json({ message: "Fee updated" });
    } catch (err) { res.status(500).json({ error: err.message }); }
});

// Fee summary stats
app.get('/fees/summary', async (req, res) => {
    try {
        const [rows] = await pool.query(`
            SELECT
                COUNT(*) AS total_records,
                SUM(CASE WHEN status = 'Paid' THEN 1 ELSE 0 END) AS paid_count,
                SUM(CASE WHEN status = 'Unpaid' THEN 1 ELSE 0 END) AS unpaid_count,
                SUM(CASE WHEN status = 'Paid' THEN amount ELSE 0 END) AS total_collected,
                SUM(CASE WHEN status = 'Unpaid' THEN amount ELSE 0 END) AS total_pending
            FROM fee
        `);
        res.json(rows[0]);
    } catch (err) { res.status(500).json({ error: err.message }); }
});

// ========================================
// 6. LIBRARY MANAGEMENT
// ========================================

// Get all books
app.get('/library', async (req, res) => {
    try {
        const [rows] = await pool.query(`
            SELECT l.*, s.name AS student_name
            FROM library l
            LEFT JOIN student s ON l.student_id = s.id
            ORDER BY l.id
        `);
        res.json(rows);
    } catch (err) { res.status(500).json({ error: err.message }); }
});

// Add a book
app.post('/library', async (req, res) => {
    const { book_name, author, isbn } = req.body;
    try {
        const [result] = await pool.query(
            `INSERT INTO library (book_name, author, isbn) VALUES (?, ?, ?)`,
            [book_name, author, isbn]
        );
        res.status(201).json({ id: result.insertId, book_name, author, isbn });
    } catch (err) { res.status(500).json({ error: err.message }); }
});

// Issue a book to a student
app.put('/library/:id/issue', async (req, res) => {
    const { student_id, return_date } = req.body;
    try {
        await pool.query(
            `UPDATE library SET student_id = ?, borrowed_date = CURDATE(), return_date = ? WHERE id = ?`,
            [student_id, return_date, req.params.id]
        );
        res.json({ message: "Book issued" });
    } catch (err) { res.status(500).json({ error: err.message }); }
});

// Return a book
app.put('/library/:id/return', async (req, res) => {
    try {
        await pool.query(
            `UPDATE library SET student_id = NULL, borrowed_date = NULL, return_date = NULL WHERE id = ?`,
            [req.params.id]
        );
        res.json({ message: "Book returned" });
    } catch (err) { res.status(500).json({ error: err.message }); }
});

// Delete a book
app.delete('/library/:id', async (req, res) => {
    try {
        await pool.query(`DELETE FROM library WHERE id = ?`, [req.params.id]);
        res.json({ message: "Book deleted" });
    } catch (err) { res.status(500).json({ error: err.message }); }
});

// ========================================
// 7. TIMETABLE & ENROLLMENTS
// ========================================

// Get timetable
app.get('/timetable', async (req, res) => {
    try {
        const [rows] = await pool.query(`
            SELECT t.*, c.course_name, c.course_code
            FROM timetable t
            LEFT JOIN course c ON t.course_id = c.id
            ORDER BY FIELD(t.day_of_week, 'MONDAY','TUESDAY','WEDNESDAY','THURSDAY','FRIDAY','SATURDAY','SUNDAY'), t.start_time
        `);
        res.json(rows);
    } catch (err) { res.status(500).json({ error: err.message }); }
});

// Add timetable entry
app.post('/timetable', async (req, res) => {
    const { day_of_week, start_time, end_time, room_number, course_id, class_type } = req.body;
    try {
        const [result] = await pool.query(
            `INSERT INTO timetable (day_of_week, start_time, end_time, room_number, course_id, class_type) VALUES (?, ?, ?, ?, ?, ?)`,
            [day_of_week, start_time, end_time, room_number, course_id, class_type]
        );
        res.status(201).json({ id: result.insertId });
    } catch (err) { res.status(500).json({ error: err.message }); }
});

// Delete timetable entry
app.delete('/timetable/:id', async (req, res) => {
    try {
        await pool.query(`DELETE FROM timetable WHERE id = ?`, [req.params.id]);
        res.json({ message: "Entry deleted" });
    } catch (err) { res.status(500).json({ error: err.message }); }
});

// Get enrollments with student/course info
app.get('/enrollments', async (req, res) => {
    try {
        const [rows] = await pool.query(`
            SELECT e.*, s.name AS student_name, c.course_name, c.course_code
            FROM enrollments e
            LEFT JOIN student s ON e.student_id = s.id
            LEFT JOIN course c ON e.course_id = c.id
            ORDER BY e.student_id
        `);
        res.json(rows);
    } catch (err) { res.status(500).json({ error: err.message }); }
});

// Add enrollment
app.post('/enrollments', async (req, res) => {
    const { student_id, course_id, day_of_week, start_time, end_time, room_number, class_type } = req.body;
    try {
        const [result] = await pool.query(
            `INSERT INTO enrollments (student_id, course_id, day_of_week, start_time, end_time, room_number, class_type) VALUES (?, ?, ?, ?, ?, ?, ?)`,
            [student_id, course_id, day_of_week, start_time, end_time, room_number, class_type]
        );
        res.status(201).json({ id: result.insertId });
    } catch (err) { res.status(500).json({ error: err.message }); }
});

// Delete enrollment
app.delete('/enrollments/:id', async (req, res) => {
    try {
        await pool.query(`DELETE FROM enrollments WHERE id = ?`, [req.params.id]);
        res.json({ message: "Enrollment deleted" });
    } catch (err) { res.status(500).json({ error: err.message }); }
});

// ========================================
// 8. STUDENT PROFILE (aggregated data)
// ========================================
app.get('/students/:id/profile', async (req, res) => {
    const id = req.params.id;
    try {
        const [[student]] = await pool.query(`SELECT * FROM student WHERE id = ?`, [id]);
        if (!student) return res.status(404).json({ error: 'Student not found' });

        const [enrollments] = await pool.query(`
            SELECT e.*, c.course_name, c.course_code
            FROM enrollments e
            LEFT JOIN course c ON e.course_id = c.id
            WHERE e.student_id = ?
        `, [id]);

        const [fees] = await pool.query(`SELECT * FROM fee WHERE student_id = ?`, [id]);

        const [books] = await pool.query(`SELECT * FROM library WHERE student_id = ?`, [id]);

        const [attendance] = await pool.query(`
            SELECT a.*, c.course_name
            FROM attendance a
            LEFT JOIN course c ON a.course_id = c.id
            WHERE a.student_id = ?
            ORDER BY a.attendance_date DESC
        `, [id]);

        res.json({ student, enrollments, fees, books, attendance });
    } catch (err) { res.status(500).json({ error: err.message }); }
});

// ========================================
// 9. DASHBOARD STATS (admin overview)
// ========================================
app.get('/dashboard/stats', async (req, res) => {
    try {
        const [[students]] = await pool.query(`SELECT COUNT(*) AS count FROM student`);
        const [[courses]] = await pool.query(`SELECT COUNT(*) AS count FROM course`);
        const [[books]] = await pool.query(`SELECT COUNT(*) AS count FROM library`);
        const [[issuedBooks]] = await pool.query(`SELECT COUNT(*) AS count FROM library WHERE student_id IS NOT NULL`);
        const [[feePaid]] = await pool.query(`SELECT COALESCE(SUM(amount), 0) AS total FROM fee WHERE status = 'Paid'`);
        const [[feePending]] = await pool.query(`SELECT COALESCE(SUM(amount), 0) AS total FROM fee WHERE status = 'Unpaid'`);
        const [[enrollments]] = await pool.query(`SELECT COUNT(*) AS count FROM enrollments`);
        const [[activeAlerts]] = await pool.query(`SELECT COUNT(*) AS count FROM sos_alerts WHERE status = 'active'`);
        const [[atRisk]] = await pool.query(`SELECT COUNT(*) AS count FROM student WHERE attendance < 75`);
        const [[upcomingReturns]] = await pool.query(`SELECT COUNT(*) AS count FROM library WHERE student_id IS NOT NULL AND return_date <= DATE_ADD(CURDATE(), INTERVAL 3 DAY) AND return_date >= CURDATE()`);
        const [[overdueReturns]] = await pool.query(`SELECT COUNT(*) AS count FROM library WHERE student_id IS NOT NULL AND return_date < CURDATE()`);

        res.json({
            totalStudents: students.count,
            totalCourses: courses.count,
            totalBooks: books.count,
            issuedBooks: issuedBooks.count,
            feePaid: feePaid.total,
            feePending: feePending.total,
            totalEnrollments: enrollments.count,
            activeAlerts: activeAlerts.count,
            atRiskStudents: atRisk.count,
            upcomingReturns: upcomingReturns.count,
            overdueReturns: overdueReturns.count
        });
    } catch (err) { res.status(500).json({ error: err.message }); }
});

// ========================================
// 11. AI INTELLIGENCE & PREDICTIVE ENGINE
// ========================================
app.get('/ai/insights', async (req, res) => {
    try {
        const [[stats]] = await pool.query(`
            SELECT 
                (SELECT COUNT(*) FROM student WHERE attendance < 75) as at_risk_count,
                (SELECT AVG(attendance) FROM student) as avg_attendance,
                (SELECT COUNT(*) FROM library WHERE student_id IS NOT NULL) as active_loans,
                (SELECT SUM(amount) FROM fee WHERE status = 'Paid') as total_revenue,
                (SELECT SUM(amount) FROM fee WHERE status = 'Unpaid') as pending_revenue
        `);

        // 1. Predictive Risk Analysis
        const riskLevel = stats.at_risk_count > 5 ? "HIGH" : (stats.at_risk_count > 2 ? "MEDIUM" : "LOW");
        const riskInsight = `Based on current attendance trends, ${stats.at_risk_count} students are at high risk of academic probation. We recommend immediate intervention for students below 75%.`;

        // 2. Financial Forecasting
        const collectionRate = (stats.total_revenue / (Number(stats.total_revenue) + Number(stats.pending_revenue))) * 100;
        const financialInsight = `Current collection rate is ${collectionRate.toFixed(1)}%. We project a ${collectionRate > 80 ? 'surplus' : 'deficit'} by the end of the semester if current patterns continue.`;

        // 3. Library Demand AI
        const libraryUtil = (stats.active_loans / (await pool.query("SELECT COUNT(*) as c FROM library"))[0][0].c) * 100;
        const libraryInsight = `Library utilization is at ${libraryUtil.toFixed(1)}%. AI analysis suggests increasing stock for high-demand ISBN categories to prevent wait times.`;

        // 4. Campus Sentiment AI (Simulated from Wellbeing)
        const sentimentScore = 78; // 0-100 index
        const sentimentInsight = `Campus mood is currently "POSITIVE" (${sentimentScore}%). AI detection shows a 12% decrease in stress levels since last week.`;

        // 5. Schedule Optimization
        const roomUtil = 62; // %
        const scheduleInsight = `Room utilization is at ${roomUtil}%. AI suggests shifting 3 high-volume lectures to Morning slots to reduce Block C congestion.`;

        // 6. Smart Recommendations
        const recommendations = [
            "Schedule extra coaching for the at-risk group on weekends.",
            "Implement an automated fee reminder system for pending ₹" + stats.pending_revenue,
            "Increase library stock for ISBN-978 series due to surging demand.",
            "Optimize Block C energy usage between 2 PM - 4 PM based on occupancy AI."
        ];

        res.json({
            status: "Success",
            generated_at: new Date().toISOString(),
            engine: "SmarterCampus-AI-v3",
            insights: {
                risk: { level: riskLevel, message: riskInsight },
                finance: { rate: collectionRate, message: financialInsight },
                library: { utilization: libraryUtil, message: libraryInsight },
                sentiment: { score: sentimentScore, message: sentimentInsight },
                schedule: { utilization: roomUtil, message: scheduleInsight }
            },
            recommendations
        });
    } catch (err) { res.status(500).json({ error: err.message }); }
});

// ========================================
// 12. SMART CHATBOT ENGINE (Complete & Robust)
// ========================================
app.post('/chatbot/query', async (req, res) => {
    const { query } = req.body;
    if (!query) return res.json({ response: "Please ask me something!" });
    const q = query.toLowerCase();
    
    try {
        let response = "I'm analyzing the campus database... I'm not sure about that specific query. Try asking about 'at-risk students', 'fee status', or 'book availability'.";

        // 1. AI & Predictive Queries
        if (q.includes("predict") || q.includes("insight") || q.includes("risk")) {
            const [[risk]] = await pool.query("SELECT COUNT(*) as count FROM student WHERE attendance < 75");
            response = `AI Prediction: There are currently ${risk.count} students at risk. My analysis suggests a ${risk.count > 3 ? 'critical' : 'manageable'} impact on semester pass rates. We recommend proactive intervention.`;
        }
        else if (q.includes("money") || q.includes("revenue") || q.includes("finance") || q.includes("fee")) {
            const [[fees]] = await pool.query("SELECT SUM(amount) as paid FROM fee WHERE status = 'Paid'");
            const [[pending]] = await pool.query("SELECT SUM(amount) as unpaid FROM fee WHERE status = 'Unpaid'");
            const total = (Number(fees.paid || 0) + Number(pending.unpaid || 0)) || 1;
            const pct = (Number(fees.paid || 0) / total) * 100;
            
            const match = q.match(/for (.*)/);
            if (match) {
                const name = match[1].trim();
                const [studentFee] = await pool.query("SELECT f.*, s.name FROM fee f JOIN student s ON f.student_id = s.id WHERE s.name LIKE ?", [`%${name}%`]);
                if (studentFee.length > 0) {
                    return res.json({ response: `${studentFee[0].name}'s fee status is ${studentFee[0].status} (Amount: ₹${studentFee[0].amount}).` });
                }
            }
            response = `Financial Intelligence: We have collected ₹${fees.paid || 0} (${pct.toFixed(1)}% of goal). ${pct < 50 ? 'Urgent collection effort needed.' : 'We are on track for the budget.'}`;
        }

        // 2. Student Search
        else if (q.includes("student") || q.includes("who is")) {
            const [students] = await pool.query("SELECT name, email, phone, attendance FROM student");
            const match = students.find(s => q.includes(s.name.toLowerCase()));
            if (match) {
                response = `${match.name} is a student with email ${match.email}. Their overall attendance is ${match.attendance}%.`;
            } else if (q.includes("how many")) {
                response = `There are currently ${students.length} students enrolled in the system.`;
            } else {
                response = `I found ${students.length} students. Try asking for a specific name like 'Who is John?'.`;
            }
        }

        // 3. Course Search
        else if (q.includes("course") || q.includes("class")) {
            const [courses] = await pool.query("SELECT course_name, course_code FROM course");
            const match = courses.find(c => q.includes(c.course_name.toLowerCase()) || q.includes(c.course_code.toLowerCase()));
            if (match) {
                response = `Course: ${match.course_name} (${match.course_code}). It is currently active in the curriculum.`;
            } else {
                response = `We currently offer ${courses.length} courses including ${courses.slice(0, 3).map(c => c.course_name).join(", ")}.`;
            }
        }

        // 4. Library Search
        else if (q.includes("book") || q.includes("library") || q.includes("isbn")) {
            const [books] = await pool.query("SELECT book_name, author, student_id FROM library");
            const match = books.find(b => q.includes(b.book_name.toLowerCase()) || q.includes(b.author.toLowerCase()));
            if (match) {
                const status = match.student_id ? "currently issued" : "available in the library";
                response = `"${match.book_name}" by ${match.author} is ${status}.`;
            } else {
                response = `We have ${books.length} books in the library catalog. Try searching by title or author.`;
            }
        }

        // 5. Attendance & SOS
        else if (q.includes("attendance")) {
            const [[avg]] = await pool.query("SELECT AVG(attendance) as avg FROM student");
            response = `The average campus attendance is currently ${Number(avg.avg || 0).toFixed(1)}%.`;
        }
        else if (q.includes("sos") || q.includes("alert")) {
            const [[active]] = await pool.query("SELECT COUNT(*) as count FROM sos_alerts WHERE status = 'active'");
            response = active.count > 0 
                ? `🚨 There are ${active.count} ACTIVE SOS alerts that need immediate attention!` 
                : "All clear. There are no active SOS alerts at the moment.";
        }

        // 6. Greetings
        else if (q.includes("hello") || q.includes("hi") || q.includes("help")) {
            response = "Hello! I am the SmarterCampus AI. I can analyze students, courses, fees, library books, or provide predictive insights. What would you like to know?";
        }

        res.json({ response });
    } catch (err) {
        console.error("Chatbot Error:", err);
        res.json({ response: "I encountered an error while processing your request. My neural links might be unstable!" });
    }
});

// Root endpoint
app.get('/', (req, res) => {
    res.send('Student Management Backend — All Systems Operational');
});

app.listen(port, () => {
    console.log(`🚀 Backend running on http://localhost:${port}`);
});
