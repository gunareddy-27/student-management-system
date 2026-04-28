package com.mru.student.controller;

import com.mru.student.model.AIInsight;
import com.mru.student.model.AutomationLog;
import com.mru.student.model.Student;
import com.mru.student.repository.AIInsightRepository;
import com.mru.student.repository.AutomationLogRepository;
import com.mru.student.repository.StudentRepository;
import com.mru.student.security.UserDetailsImpl;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/agents")
public class AgentController {

    @Autowired
    private StudentRepository studentRepository;

    @Autowired
    private AIInsightRepository aiInsightRepository;

    @Autowired
    private AutomationLogRepository automationLogRepository;

    @PostMapping("/insights")
    public ResponseEntity<?> logInsight(@RequestBody Map<String, Object> requestBody) {
        UserDetailsImpl userDetails = (UserDetailsImpl) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        Student student = studentRepository.findByEmail(userDetails.getEmail()).orElse(null);

        if (student == null) {
            Map<String, String> error = new HashMap<>();
            error.put("message", "Student profile not found");
            return ResponseEntity.status(404).body(error);
        }

        AIInsight insight = new AIInsight();
        insight.setStudentId(student.getId());
        insight.setAgentType((String) requestBody.get("agent_type"));
        insight.setInsightData((Map<String, Object>) requestBody.get("data"));

        aiInsightRepository.save(insight);

        Map<String, String> response = new HashMap<>();
        response.put("message", "Intelligence synchronized");
        response.put("status", "success");
        return ResponseEntity.status(201).body(response);
    }

    @GetMapping("/insights/{agentType}")
    public ResponseEntity<?> getAgentInsights(@PathVariable String agentType) {
        UserDetailsImpl userDetails = (UserDetailsImpl) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        Student student = studentRepository.findByEmail(userDetails.getEmail()).orElse(null);

        if (student == null) {
            return ResponseEntity.ok(List.of());
        }

        List<AIInsight> insights = aiInsightRepository.findByStudentIdAndAgentTypeOrderByCreatedAtDesc(student.getId(), agentType);

        List<Map<String, Object>> response = insights.stream().map(i -> {
            Map<String, Object> map = new HashMap<>();
            map.put("data", i.getInsightData());
            map.put("timestamp", i.getCreatedAt());
            return map;
        }).collect(Collectors.toList());

        return ResponseEntity.ok(response);
    }

    @PostMapping("/automate")
    public ResponseEntity<?> logAutomation(@RequestBody Map<String, Object> requestBody) {
        UserDetailsImpl userDetails = (UserDetailsImpl) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        Student student = studentRepository.findByEmail(userDetails.getEmail()).orElse(null);

        if (student == null) {
            Map<String, String> error = new HashMap<>();
            error.put("message", "Student profile not found");
            return ResponseEntity.status(404).body(error);
        }

        AutomationLog log = new AutomationLog();
        log.setStudentId(student.getId());
        log.setActionName((String) requestBody.get("action"));
        log.setImpactScore(requestBody.containsKey("impact") ? (String) requestBody.get("impact") : "Moderate");

        automationLogRepository.save(log);

        Map<String, String> response = new HashMap<>();
        response.put("message", "Autonomous action recorded");
        return ResponseEntity.status(201).body(response);
    }
}
