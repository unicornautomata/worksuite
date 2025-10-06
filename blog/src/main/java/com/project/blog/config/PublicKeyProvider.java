package com.project.blog.config;

import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestTemplate;

import java.security.KeyFactory;
import java.security.PublicKey;
import java.security.spec.X509EncodedKeySpec;
import java.util.Base64;
import java.util.Map;

@Component
public class PublicKeyProvider {

    private final RestTemplate restTemplate = new RestTemplate();
    private PublicKey cachedKey;

    public PublicKey getPublicKey() {
        if (cachedKey == null) {
            try {
                // Fetch JSON response
                String response = restTemplate.getForObject("http://localhost:8081/auth/publicKey", String.class);

                // Parse JSON
                ObjectMapper mapper = new ObjectMapper();
                Map<String, String> map = mapper.readValue(response, Map.class);
                String publicKeyBase64 = map.get("publicKey");

                // Decode and generate key
                byte[] decoded = Base64.getDecoder().decode(publicKeyBase64);
                X509EncodedKeySpec keySpec = new X509EncodedKeySpec(decoded);
                KeyFactory keyFactory = KeyFactory.getInstance("RSA");
                cachedKey = keyFactory.generatePublic(keySpec);

                System.out.println("[SYSTEM OUT]: ✅ Public key successfully fetched and loaded for Blog.");

            } catch (Exception e) {
                throw new RuntimeException("❌ Failed to fetch public key from Auth server", e);
            }
        }
        return cachedKey;
    }
}
