package com.mru.student.model;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "courses")
@Data
@NoArgsConstructor
public class Course {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "course_code", unique = true, nullable = false, length = 20)
    private String courseCode;

    @Column(nullable = false, length = 100)
    private String name;

    @Column(columnDefinition = "integer default 3")
    private Integer credits = 3;

    @Column(name = "faculty_name", length = 100)
    private String facultyName;
}
