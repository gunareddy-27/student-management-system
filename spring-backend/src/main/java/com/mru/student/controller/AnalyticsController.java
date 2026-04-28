package com.mru.student.controller;

import com.mru.student.repository.StudentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/analytics")
public class AnalyticsController {

    @Autowired
    private StudentRepository studentRepository;

    @GetMapping("/risk-report")
    public ResponseEntity<?> getRiskReport() {
        List<Map<String, Object>> riskList = new ArrayList<>();
        
        studentRepository.findAll().forEach(student -> {
            if (student.getAttendance() < 75.0) {
                Map<String, Object> risk = new HashMap<>();
                risk.put("studentName", student.getName());
                risk.put("attendance", student.getAttendance());
                risk.put("riskLevel", student.getAttendance() < 60.0 ? "HIGH" : "MODERATE");
                risk.put("recommendation", "Immediate faculty mentoring required");
                riskList.add(risk);
            }
        });

        Map<String, Object> response = new HashMap<>();
        response.put("totalAtRisk", riskList.size());
        response.put("students", riskList);
        response.put("timestamp", System.currentTimeMillis());

        return ResponseEntity.ok(response);
    }
}
