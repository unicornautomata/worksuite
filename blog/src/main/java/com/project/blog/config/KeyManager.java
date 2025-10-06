package com.project.blog.config;

import org.springframework.stereotype.Component;

import java.nio.file.*;
import java.security.*;
import java.security.spec.*;
import java.util.Base64;

@Component
public class KeyManager {

    private static final String PRIVATE_KEY_FILE = "private_key.pem";
    private static final String PUBLIC_KEY_FILE = "public_key.pem";

    private final KeyPair keyPair;

    public KeyManager() {
        try {
            if (Files.exists(Path.of(PRIVATE_KEY_FILE)) && Files.exists(Path.of(PUBLIC_KEY_FILE))) {
                this.keyPair = loadKeyPair();
                System.out.println("✅ Loaded existing RSA keypair from disk");
            } else {
                this.keyPair = generateAndSaveKeyPair();
                System.out.println("🔑 Generated new RSA keypair and saved to files");
            }
        } catch (Exception e) {
            throw new RuntimeException("Failed to initialize RSA keypair", e);
        }
    }

    // Generate new RSA keypair and save them to files
    private KeyPair generateAndSaveKeyPair() throws Exception {
        KeyPairGenerator keyGen = KeyPairGenerator.getInstance("RSA");
        keyGen.initialize(2048);
        KeyPair kp = keyGen.generateKeyPair();

        // Save private key as PEM
        String privPem = "-----BEGIN PRIVATE KEY-----\n"
                + Base64.getMimeEncoder(64, "\n".getBytes())
                        .encodeToString(kp.getPrivate().getEncoded())
                + "\n-----END PRIVATE KEY-----\n";
        Files.writeString(Path.of(PRIVATE_KEY_FILE), privPem);

        // Save public key as PEM
        String pubPem = "-----BEGIN PUBLIC KEY-----\n"
                + Base64.getMimeEncoder(64, "\n".getBytes())
                        .encodeToString(kp.getPublic().getEncoded())
                + "\n-----END PUBLIC KEY-----\n";
        Files.writeString(Path.of(PUBLIC_KEY_FILE), pubPem);

        return kp;
    }

    // Load RSA keypair from files
    private KeyPair loadKeyPair() throws Exception {
        String privPem = Files.readString(Path.of(PRIVATE_KEY_FILE))
                .replaceAll("-----.*-----", "")
                .replaceAll("\\s", "");
        String pubPem = Files.readString(Path.of(PUBLIC_KEY_FILE))
                .replaceAll("-----.*-----", "")
                .replaceAll("\\s", "");

        byte[] privBytes = Base64.getDecoder().decode(privPem);
        byte[] pubBytes = Base64.getDecoder().decode(pubPem);

        KeyFactory kf = KeyFactory.getInstance("RSA");
        PrivateKey privateKey = kf.generatePrivate(new PKCS8EncodedKeySpec(privBytes));
        PublicKey publicKey = kf.generatePublic(new X509EncodedKeySpec(pubBytes));

        return new KeyPair(publicKey, privateKey);
    }

    // Expose private key for signing JWTs
    public PrivateKey getPrivateKey() {
        return keyPair.getPrivate();
    }

    // Expose public key for verification
    public PublicKey getPublicKey() {
        return keyPair.getPublic();
    }
}
