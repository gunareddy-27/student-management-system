package com.mru.student.model;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.type.SqlTypes;
import java.time.LocalDateTime;
import java.util.Map;

@Entity
@Table(name = "ai_insights")
@Data
@NoArgsConstructor
public class AIInsight {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "student_id", nullable = false)
    private Long studentId;

    @Column(name = "agent_type", nullable = false, length = 50)
    private String agentType;

    @JdbcTypeCode(SqlTypes.JSON)
    @Column(name = "insight_data", nullable = false, columnDefinition = "json")
    private Map<String, Object> insightData;

    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt = LocalDateTime.now();
}
