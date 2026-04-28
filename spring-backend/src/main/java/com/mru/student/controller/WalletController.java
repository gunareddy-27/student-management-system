package com.mru.student.controller;

import com.mru.student.model.Wallet;
import com.mru.student.repository.WalletRepository;
import com.mru.student.security.UserDetailsImpl;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/wallet")
public class WalletController {

    @Autowired
    private WalletRepository walletRepository;

    @GetMapping("/balance")
    public ResponseEntity<?> getBalance() {
        UserDetailsImpl userDetails = (UserDetailsImpl) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        Wallet wallet = walletRepository.findByEmail(userDetails.getEmail())
                .orElseGet(() -> {
                    Wallet newWallet = new Wallet();
                    newWallet.setEmail(userDetails.getEmail());
                    newWallet.setBalance(BigDecimal.ZERO);
                    return walletRepository.save(newWallet);
                });
        return ResponseEntity.ok(wallet);
    }

    @PostMapping("/topup")
    public ResponseEntity<?> topup(@RequestBody Map<String, Object> request) {
        UserDetailsImpl userDetails = (UserDetailsImpl) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        BigDecimal amount = new BigDecimal(request.get("amount").toString());
        
        Wallet wallet = walletRepository.findByEmail(userDetails.getEmail()).orElseThrow();
        wallet.setBalance(wallet.getBalance().add(amount));
        wallet.setLastUpdated(LocalDateTime.now());
        
        walletRepository.save(wallet);
        return ResponseEntity.ok(wallet);
    }

    @PostMapping("/pay")
    public ResponseEntity<?> pay(@RequestBody Map<String, Object> request) {
        UserDetailsImpl userDetails = (UserDetailsImpl) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        BigDecimal amount = new BigDecimal(request.get("amount").toString());
        
        Wallet wallet = walletRepository.findByEmail(userDetails.getEmail()).orElseThrow();
        
        if (wallet.getBalance().compareTo(amount) < 0) {
            Map<String, String> error = new HashMap<>();
            error.put("message", "Insufficient balance");
            return ResponseEntity.status(400).body(error);
        }
        
        wallet.setBalance(wallet.getBalance().subtract(amount));
        wallet.setLastUpdated(LocalDateTime.now());
        
        walletRepository.save(wallet);
        return ResponseEntity.ok(wallet);
    }
}
