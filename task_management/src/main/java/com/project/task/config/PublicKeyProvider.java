package com.project.task.config; // make sure this matches your project structure

import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.annotation.PostConstruct;
import org.springframework.stereotype.Component;

import java.io.BufferedReader;
import java.io.InputStreamReader;
import java.net.URL;
import java.security.KeyFactory;
import java.security.PublicKey;
import java.security.spec.X509EncodedKeySpec;
import java.util.Base64;
import java.util.Map;

@Component
public class PublicKeyProvider {

    private PublicKey publicKey;

    @PostConstruct
    public void fetchPublicKey() {
        try {
            // Replace with your User Management service URL
            URL url = new URL("http://localhost:8081/auth/publicKey");
            BufferedReader reader = new BufferedReader(new InputStreamReader(url.openStream()));
            StringBuilder responseBuilder = new StringBuilder();

            String line;
            while ((line = reader.readLine()) != null) {
                responseBuilder.append(line);
            }
            reader.close();

            // Parse JSON response
            ObjectMapper mapper = new ObjectMapper();
            Map<String, String> response = mapper.readValue(responseBuilder.toString(), Map.class);
            String publicKeyBase64 = response.get("publicKey");

            // Decode and generate PublicKey
            byte[] decoded = Base64.getDecoder().decode(publicKeyBase64);
            X509EncodedKeySpec keySpec = new X509EncodedKeySpec(decoded);
            KeyFactory keyFactory = KeyFactory.getInstance("RSA");
            this.publicKey = keyFactory.generatePublic(keySpec);

            System.out.println("✅ Public key successfully fetched and loaded.");

        } catch (Exception e) {
            throw new RuntimeException("❌ Failed to fetch public key", e);
        }
    }

    public PublicKey getPublicKey() {
        return publicKey;
    }
}
