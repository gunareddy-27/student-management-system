package com.mru.student.controller;

import com.mru.student.model.Student;
import com.mru.student.repository.StudentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/attendance")
public class AttendanceController {

    @Autowired
    private StudentRepository studentRepository;

    @PostMapping("/verify")
    public ResponseEntity<?> verifyAttendance(@RequestBody Map<String, Object> scanData) {
        // Example scanData: { "studentId": 1, "token": "XYZ", "timestamp": 123456 }
        Long studentId = Long.valueOf(scanData.get("studentId").toString());
        
        Student student = studentRepository.findById(studentId).orElse(null);
        if (student == null) {
            return ResponseEntity.status(404).body(Map.of("message", "Student not found"));
        }

        // Increment attendance by 1% for demo purposes
        student.setAttendance(Math.min(100.0, student.getAttendance() + 1.0));
        studentRepository.save(student);

        Map<String, Object> response = new HashMap<>();
        response.put("status", "success");
        response.put("newAttendance", student.getAttendance());
        response.put("message", "Attendance marked for " + student.getName());
        
        return ResponseEntity.ok(response);
    }
}
