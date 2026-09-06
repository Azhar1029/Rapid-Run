package com.rapidrun.execution.security;
import io.jsonwebtoken.*;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import javax.crypto.SecretKey;
import java.util.Base64;

@Service
public class JwtService {
    @Value("${jwt.secret}") private String secret;

    private SecretKey getKey() {
        return Keys.hmacShaKeyFor(Base64.getDecoder().decode(secret));
    }
    public String extractUserId(String token) {
        return Jwts.parser().verifyWith(getKey()).build().parseSignedClaims(token).getPayload().getSubject();
    }
    public boolean isTokenValid(String token) {
        try { Jwts.parser().verifyWith(getKey()).build().parseSignedClaims(token); return true; }
        catch (Exception e) { return false; }
    }
}
