package com.project.todo.controller;

import com.project.todo.config.KeyManager;
import org.springframework.web.bind.annotation.*;

import java.util.Base64;
import java.util.Map;

@RestController
@RequestMapping("/auth")
public class PublicKeyController {

    private final KeyManager keyManager;

    public PublicKeyController(KeyManager keyManager) {
        this.keyManager = keyManager;
    }

    /**
     * Expose the RSA public key as a Base64 string.
     * Task Management service will fetch this to verify JWTs.
     */
    @GetMapping("/publicKey")
    public Map<String, String> getPublicKey() {
        String publicKeyBase64 =
                Base64.getEncoder().encodeToString(keyManager.getPublicKey().getEncoded());
        return Map.of("publicKey", publicKeyBase64);
    }
}
