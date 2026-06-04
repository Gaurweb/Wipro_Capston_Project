package com.myfin.admin.security;

import io.jsonwebtoken.*;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Component;
import java.security.Key;
import java.util.Date;

/**
 * Utility class for handling JSON Web Tokens (JWT).
 * Responsible for token generation, parsing, and validation.
 */
@Component
public class JwtUtil {

    // Injects the signing secret from application.properties
    @Value("${jwt.secret}")
    private String secret;

    // Injects the token lifespan (in milliseconds) from application.properties
    @Value("${jwt.expiration}")
    private Long expiration;

    /**
     * Converts the plain-text secret string into a secure cryptographic Key.
     */
    private Key getKey() {
        return Keys.hmacShaKeyFor(secret.getBytes());
    }

    /**
     * Generates a new JWT for a authenticated user.
     * @param username The identifier of the logged-in user.
     * @return A signed, compact JWT string.
     */
    public String generateToken(String username) {
        return Jwts.builder()
                .setSubject(username) // Stores username inside the token payload
                .setIssuedAt(new Date()) // Sets creation timestamp
                .setExpiration(new Date(System.currentTimeMillis() + expiration)) // Sets expiry date
                .signWith(getKey(), SignatureAlgorithm.HS256) // Signs token using HMAC-SHA256
                .compact(); // Serializes token into its final string format
    }

    /**
     * Decrypts the token and reads the username stored inside it.
     * @param token The incoming JWT string.
     */
    public String extractUsername(String token) {
        return Jwts.parserBuilder()
                .setSigningKey(getKey()).build() // Verifies signature integrity
                .parseClaimsJws(token).getBody().getSubject(); // Retrieves the subject field
    }

    /**
     * Checks if the incoming token matches the user details and is still valid.
     */
    public boolean validateToken(String token, UserDetails ud) {
        try {
            // Token is valid if username matches and token has not expired
            return extractUsername(token).equals(ud.getUsername()) && !isExpired(token);
        } catch (Exception e) { 
            // Catches tampered, malformed, or expired token exceptions
            return false; 
        }
    }

    /**
     * Checks if the token's expiration date has passed the current system time.
     */
    private boolean isExpired(String token) {
        return Jwts.parserBuilder().setSigningKey(getKey()).build()
                .parseClaimsJws(token).getBody().getExpiration().before(new Date());
    }
}
