package com.mru.student.model;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;

@Entity
@Table(name = "users")
@Data
@NoArgsConstructor
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(unique = true, nullable = false, length = 80)
    private String username;

    @Column(unique = true, nullable = false, length = 120)
    private String email;

    @Column(nullable = false, length = 200)
    private String password;

    @Column(length = 20)
    private String role = "student"; // student, admin, faculty

    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt = LocalDateTime.now();
}
