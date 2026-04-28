package com.mru.student.model;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;

@Entity
@Table(name = "automation_logs")
@Data
@NoArgsConstructor
public class AutomationLog {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "student_id", nullable = false)
    private Long studentId;

    @Column(name = "action_name", nullable = false, length = 100)
    private String actionName;

    @Column(name = "impact_score", length = 50)
    private String impactScore;

    @Column(name = "executed_at", updatable = false)
    private LocalDateTime executedAt = LocalDateTime.now();
}
