package com.mru.student.controller;

import com.mru.student.dto.JwtResponse;
import com.mru.student.dto.LoginRequest;
import com.mru.student.dto.MessageResponse;
import com.mru.student.dto.SignupRequest;
import com.mru.student.model.Student;
import com.mru.student.model.User;
import com.mru.student.repository.StudentRepository;
import com.mru.student.repository.UserRepository;
import com.mru.student.security.JwtUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private StudentRepository studentRepository;

    @Autowired
    private PasswordEncoder encoder;

    @Autowired
    private JwtUtils jwtUtils;

    @PostMapping("/signup")
    public ResponseEntity<?> registerUser(@RequestBody SignupRequest signUpRequest) {
        if (userRepository.findByEmail(signUpRequest.getEmail()).isPresent()) {
            return ResponseEntity.badRequest().body(new MessageResponse("Error: Email is already in use!", "error"));
        }

        User user = new User();
        user.setUsername(signUpRequest.getUsername());
        user.setEmail(signUpRequest.getEmail());
        user.setPassword(encoder.encode(signUpRequest.getPassword()));
        
        String role = signUpRequest.getRole() != null ? signUpRequest.getRole() : "student";
        user.setRole(role);

        userRepository.save(user);

        if ("student".equals(role)) {
            Student student = new Student();
            student.setName(user.getUsername());
            student.setEmail(user.getEmail());
            student.setPhone(signUpRequest.getPhone() != null ? signUpRequest.getPhone() : "");
            student.setAttendance(0.0);
            student.setIdCardStatus("Valid");
            studentRepository.save(student);
        }

        return ResponseEntity.ok(new MessageResponse("User registered successfully", "success"));
    }

    @PostMapping("/login")
    public ResponseEntity<?> authenticateUser(@RequestBody LoginRequest loginRequest) {
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(loginRequest.getEmail(), loginRequest.getPassword()));

        User user = userRepository.findByEmail(loginRequest.getEmail()).orElseThrow();
        String jwt = jwtUtils.generateJwtToken(authentication, user.getId(), user.getRole());

        return ResponseEntity.ok(new JwtResponse(jwt, user.getRole(), user.getUsername(), user.getId()));
    }
}
