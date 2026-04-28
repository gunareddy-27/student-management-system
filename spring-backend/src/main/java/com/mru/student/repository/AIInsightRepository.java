package com.mru.student.repository;

import com.mru.student.model.AIInsight;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface AIInsightRepository extends JpaRepository<AIInsight, Long> {
    List<AIInsight> findByStudentIdAndAgentTypeOrderByCreatedAtDesc(Long studentId, String agentType);
}
