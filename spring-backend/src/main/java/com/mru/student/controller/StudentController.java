package com.mru.student.controller;

import com.mru.student.model.Student;
import com.mru.student.repository.StudentRepository;
import com.mru.student.security.UserDetailsImpl;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/students")
public class StudentController {

    @Autowired
    private StudentRepository studentRepository;

    @GetMapping("/profile")
    public ResponseEntity<?> getProfile() {
        UserDetailsImpl userDetails = (UserDetailsImpl) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        Student student = studentRepository.findByEmail(userDetails.getEmail()).orElse(null);

        if (student == null) {
            Map<String, String> error = new HashMap<>();
            error.put("message", "Profile not found");
            return ResponseEntity.status(404).body(error);
        }

        Map<String, Object> response = new HashMap<>();
        response.put("name", student.getName());
        response.put("email", student.getEmail());
        response.put("phone", student.getPhone());
        response.put("attendance", student.getAttendance());
        response.put("idCardStatus", student.getIdCardStatus());

        return ResponseEntity.ok(response);
    }

    @PutMapping("/profile/update")
    public ResponseEntity<?> updateProfile(@RequestBody Map<String, Object> updates) {
        UserDetailsImpl userDetails = (UserDetailsImpl) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        Student student = studentRepository.findByEmail(userDetails.getEmail()).orElse(null);

        if (student == null) {
            Map<String, String> error = new HashMap<>();
            error.put("message", "Profile not found");
            return ResponseEntity.status(404).body(error);
        }

        if (updates.containsKey("name")) student.setName(updates.get("name").toString());
        if (updates.containsKey("phone")) student.setPhone(updates.get("phone").toString());

        studentRepository.save(student);

        Map<String, String> response = new HashMap<>();
        response.put("message", "Profile updated successfully");
        return ResponseEntity.ok(response);
    }
}
