package com.mru.student.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@CrossOrigin(origins = "*")
public class DataController {

    @Autowired
    private JdbcTemplate jdbcTemplate;

    private List<Map<String, Object>> querySafely(String sql) {
        try {
            return jdbcTemplate.queryForList(sql);
        } catch (Exception e) {
            System.err.println("Query failed: " + sql + " | Error: " + e.getMessage());
            return new ArrayList<>();
        }
    }

    private Map<String, Object> querySingleSafely(String sql) {
        try {
            return jdbcTemplate.queryForMap(sql);
        } catch (Exception e) {
            System.err.println("Query single failed: " + sql + " | Error: " + e.getMessage());
            return new HashMap<>();
        }
    }

    @GetMapping("/debug-tables")
    public ResponseEntity<List<Map<String, Object>>> debugTables() {
        return ResponseEntity.ok(querySafely("SHOW TABLES"));
    }

    @GetMapping("/students")
    public ResponseEntity<List<Map<String, Object>>> getStudents() {
        List<Map<String, Object>> students = querySafely("SELECT * FROM student");
        System.out.println("GET /students hit - returning " + students.size() + " students");
        return ResponseEntity.ok(students);
    }

    @GetMapping("/courses")
    public ResponseEntity<List<Map<String, Object>>> getCourses() {
        List<Map<String, Object>> courses = querySafely("SELECT id, course_name AS courseName, course_code AS courseCode, attendance FROM course");
        System.out.println("GET /courses hit - returning " + courses.size() + " courses");
        return ResponseEntity.ok(courses);
    }

    @GetMapping("/sos")
    public ResponseEntity<List<Map<String, Object>>> getSos() {
        System.out.println("GET /sos hit");
        return ResponseEntity.ok(querySafely("SELECT * FROM sos_alerts ORDER BY created_at DESC"));
    }

    @GetMapping("/attendance")
    public ResponseEntity<List<Map<String, Object>>> getAttendance() {
        String sql = "SELECT a.id, a.student_id, s.name AS student_name, a.course_id, c.course_name, a.attendance_date, a.status " +
                     "FROM attendance a LEFT JOIN student s ON a.student_id = s.id LEFT JOIN course c ON a.course_id = c.id " +
                     "ORDER BY a.attendance_date DESC";
        return ResponseEntity.ok(querySafely(sql));
    }

    @GetMapping("/attendance/analytics")
    public ResponseEntity<List<Map<String, Object>>> getAttendanceAnalytics() {
        String sql = "SELECT s.id, s.name, s.email, COUNT(a.id) AS total_classes, " +
                     "SUM(CASE WHEN a.status = 'Present' THEN 1 ELSE 0 END) AS present_count, " +
                     "SUM(CASE WHEN a.status = 'Absent' THEN 1 ELSE 0 END) AS absent_count, " +
                     "ROUND(SUM(CASE WHEN a.status = 'Present' THEN 1 ELSE 0 END) * 100.0 / NULLIF(COUNT(a.id), 0), 1) AS attendance_percentage " +
                     "FROM student s LEFT JOIN attendance a ON s.id = a.student_id " +
                     "GROUP BY s.id, s.name, s.email ORDER BY attendance_percentage ASC";
        return ResponseEntity.ok(querySafely(sql));
    }

    @GetMapping("/attendance/at-risk")
    public ResponseEntity<List<Map<String, Object>>> getAttendanceAtRisk() {
        String sql = "SELECT s.id, s.name, s.email, s.phone, s.attendance, COUNT(a.id) AS total_classes, " +
                     "SUM(CASE WHEN a.status = 'Present' THEN 1 ELSE 0 END) AS present_count, " +
                     "ROUND(SUM(CASE WHEN a.status = 'Present' THEN 1 ELSE 0 END) * 100.0 / NULLIF(COUNT(a.id), 0), 1) AS calculated_percentage " +
                     "FROM student s LEFT JOIN attendance a ON s.id = a.student_id " +
                     "GROUP BY s.id HAVING s.attendance < 75 OR calculated_percentage < 75";
        return ResponseEntity.ok(querySafely(sql));
    }

    @GetMapping("/fees")
    public ResponseEntity<List<Map<String, Object>>> getFees() {
        String sql = "SELECT f.id, f.student_id, s.name AS student_name, s.email, f.amount, f.payment_date, f.status " +
                     "FROM fee f LEFT JOIN student s ON f.student_id = s.id ORDER BY f.status ASC, f.payment_date DESC";
        return ResponseEntity.ok(querySafely(sql));
    }

    @GetMapping("/fees/summary")
    public ResponseEntity<Map<String, Object>> getFeesSummary() {
        String sql = "SELECT COUNT(*) AS total_records, SUM(CASE WHEN status = 'Paid' THEN 1 ELSE 0 END) AS paid_count, " +
                     "SUM(CASE WHEN status = 'Unpaid' THEN 1 ELSE 0 END) AS unpaid_count, " +
                     "SUM(CASE WHEN status = 'Paid' THEN amount ELSE 0 END) AS total_collected, " +
                     "SUM(CASE WHEN status = 'Unpaid' THEN amount ELSE 0 END) AS total_pending FROM fee";
        return ResponseEntity.ok(querySingleSafely(sql));
    }

    @GetMapping("/library")
    public ResponseEntity<List<Map<String, Object>>> getLibrary() {
        return ResponseEntity.ok(querySafely("SELECT l.*, s.name AS student_name FROM library l LEFT JOIN student s ON l.student_id = s.id ORDER BY l.id"));
    }

    @GetMapping("/library/history")
    public ResponseEntity<List<Map<String, Object>>> getLibraryHistory() {
        String sql = "SELECT h.*, l.book_name, l.author, s.name AS student_name FROM library_history h " +
                     "JOIN library l ON h.book_id = l.id JOIN student s ON h.student_id = s.id ORDER BY h.borrow_date DESC";
        return ResponseEntity.ok(querySafely(sql));
    }

    @GetMapping("/library/reservations")
    public ResponseEntity<List<Map<String, Object>>> getLibraryReservations() {
        String sql = "SELECT r.*, l.book_name, s.name AS student_name FROM library_reservations r " +
                     "JOIN library l ON r.book_id = l.id JOIN student s ON r.student_id = s.id " +
                     "WHERE r.status = 'Pending' ORDER BY r.request_date ASC";
        return ResponseEntity.ok(querySafely(sql));
    }

    @GetMapping("/timetable")
    public ResponseEntity<List<Map<String, Object>>> getTimetable() {
        String sql = "SELECT t.*, c.course_name, c.course_code FROM timetable t " +
                     "LEFT JOIN course c ON t.course_id = c.id " +
                     "ORDER BY FIELD(t.day_of_week, 'MONDAY','TUESDAY','WEDNESDAY','THURSDAY','FRIDAY','SATURDAY','SUNDAY'), t.start_time";
        return ResponseEntity.ok(querySafely(sql));
    }

    @GetMapping("/enrollments")
    public ResponseEntity<List<Map<String, Object>>> getEnrollments() {
        String sql = "SELECT e.*, s.name AS student_name, c.course_name, c.course_code FROM enrollments e " +
                     "LEFT JOIN student s ON e.student_id = s.id LEFT JOIN course c ON e.course_id = c.id ORDER BY e.student_id";
        return ResponseEntity.ok(querySafely(sql));
    }

    private Object safeCount(String sql) {
        Map<String, Object> map = querySingleSafely(sql);
        System.out.println("safeCount result for [" + sql + "]: " + map);
        if (map.containsKey("count")) return map.get("count");
        if (map.containsKey("COUNT")) return map.get("COUNT");
        if (map.containsKey("total")) return map.get("total");
        return 0;
    }

    @GetMapping("/dashboard/stats")
    public ResponseEntity<Map<String, Object>> getDashboardStats() {
        System.out.println("GET /dashboard/stats hit");
        Map<String, Object> stats = new HashMap<>();
        stats.put("totalStudents", safeCount("SELECT COUNT(*) AS count FROM student"));
        stats.put("totalCourses", safeCount("SELECT COUNT(*) AS count FROM course"));
        stats.put("totalBooks", safeCount("SELECT COUNT(*) AS count FROM library"));
        stats.put("issuedBooks", safeCount("SELECT COUNT(*) AS count FROM library WHERE student_id IS NOT NULL"));
        stats.put("feePaid", safeCount("SELECT COALESCE(SUM(amount), 0) AS count FROM fee WHERE status = 'Paid'"));
        stats.put("feePending", safeCount("SELECT COALESCE(SUM(amount), 0) AS count FROM fee WHERE status = 'Unpaid'"));
        stats.put("totalEnrollments", safeCount("SELECT COUNT(*) AS count FROM enrollments"));
        stats.put("activeAlerts", safeCount("SELECT COUNT(*) AS count FROM sos_alerts WHERE status = 'active'"));
        stats.put("atRiskStudents", safeCount("SELECT COUNT(*) AS count FROM student WHERE attendance < 75"));
        stats.put("upcomingReturns", safeCount("SELECT COUNT(*) AS count FROM library WHERE student_id IS NOT NULL AND return_date <= DATE_ADD(CURDATE(), INTERVAL 3 DAY) AND return_date >= CURDATE()"));
        stats.put("overdueReturns", safeCount("SELECT COUNT(*) AS count FROM library WHERE student_id IS NOT NULL AND return_date < CURDATE()"));
        stats.put("placedStudents", safeCount("SELECT COUNT(*) AS count FROM placement_applications WHERE status = 'Selected'"));
        stats.put("activeDrives", safeCount("SELECT COUNT(*) AS count FROM placement_drives WHERE status = 'Active'"));
        return ResponseEntity.ok(stats);
    }
}
