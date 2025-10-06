package com.project.blog.security;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jws;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.SecurityException;
import org.springframework.stereotype.Component;

import java.security.PublicKey;
import java.util.Date;

@Component
public class JwtTokenUtil {

    /**
     * Extract all claims from a JWT using the provided public key.
     */
    public Claims extractAllClaims(String token, PublicKey publicKey) {
        try {
            Jws<Claims> jws = Jwts.parserBuilder()
                    .setSigningKey(publicKey)  // verify RSA signature
                    .build()
                    .parseClaimsJws(token);

            return jws.getBody();
        } catch (SecurityException e) {
            throw new RuntimeException("Invalid JWT signature", e);
        } catch (Exception e) {
            throw new RuntimeException("Failed to parse JWT token", e);
        }
    }

    /**
     * Extract username (subject) from token.
     */
    public String extractUsername(String token, PublicKey publicKey) {
        return extractAllClaims(token, publicKey).getSubject();
    }

    /**
     * Check if the token is expired.
     */
    public boolean isTokenExpired(String token, PublicKey publicKey) {
        Date expiration = extractAllClaims(token, publicKey).getExpiration();
        return expiration.before(new Date());
    }

    /**
     * Validate token signature + expiration.
     */
    public boolean validateToken(String token, PublicKey publicKey) {
        try {
            return !isTokenExpired(token, publicKey);
        } catch (Exception e) {
            return false;
        }
    }
}
