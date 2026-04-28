package com.mru.student.repository;

import com.mru.student.model.AutomationLog;
import org.springframework.data.jpa.repository.JpaRepository;

public interface AutomationLogRepository extends JpaRepository<AutomationLog, Long> {
}
