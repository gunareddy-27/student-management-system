package com.mru.student.controller;

import com.mru.student.model.Student;
import com.mru.student.repository.StudentRepository;
import com.mru.student.security.UserDetailsImpl;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/resume")
public class ResumeController {

    @Autowired
    private StudentRepository studentRepository;

    @GetMapping("/generate")
    public ResponseEntity<?> generateResumeData() {
        UserDetailsImpl userDetails = (UserDetailsImpl) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        Student student = studentRepository.findByEmail(userDetails.getEmail()).orElseThrow();

        Map<String, Object> resume = new HashMap<>();
        resume.put("personalInfo", student);
        resume.put("education", "Malla Reddy University - B.Tech CSE");
        resume.put("achievements", "Top 10% in academic performance");
        resume.put("certifications", List.of("AWS Certified Cloud Practitioner", "Java Professional"));
        
        return ResponseEntity.ok(resume);
    }
}
