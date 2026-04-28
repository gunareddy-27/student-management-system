package com.mru.student.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class JwtResponse {
    private String access_token;
    private String role;
    private String username;
    private Long user_id;
}
