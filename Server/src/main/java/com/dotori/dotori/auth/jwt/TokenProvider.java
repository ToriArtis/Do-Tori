package com.dotori.dotori.auth.jwt;

import com.dotori.dotori.auth.entity.Auth;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.security.Keys;
import org.springframework.stereotype.Component;

import java.security.Key;
import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.Date;

@Component
public class TokenProvider {
    private final Key accessKey;
    private final Key refreshKey;

    public TokenProvider() {
        this.accessKey = Keys.secretKeyFor(SignatureAlgorithm.HS512);
        this.refreshKey = Keys.secretKeyFor(SignatureAlgorithm.HS512);
    }

    // create 메서드에서 key 사용
    public String createAccessToken(Auth authEntity) {
        Date expiryDate = Date.from(Instant.now().plus(1, ChronoUnit.DAYS));  // 하룻동안

        return Jwts.builder()
                .setSubject(authEntity.getEmail())
                .setIssuer("demo app")
                .setIssuedAt(new Date())
                .setExpiration(expiryDate)
                .signWith(accessKey, SignatureAlgorithm.HS512)
                .compact();
    }

    public String createRefreshToken(Auth authEntity) {
        Date expiryDate = Date.from(Instant.now().plus(7, ChronoUnit.DAYS));

        return Jwts.builder()
                .setSubject(authEntity.getEmail())
                .setIssuer("demo app")
                .setIssuedAt(new Date())
                .setExpiration(expiryDate)
                .signWith(refreshKey, SignatureAlgorithm.HS512)
                .compact();
    }

    // validateAndGetUserId 메서드에서도 key 사용
    public String validateAndGetUserId(String token) {
        Claims claims = Jwts.parserBuilder()
                .setSigningKey(accessKey)
                .build()
                .parseClaimsJws(token)
                .getBody();

        return claims.getSubject();
    }
    public String validateAndGetUserIdFromRefreshToken(String token) {
        Claims claims = Jwts.parserBuilder()
                .setSigningKey(refreshKey)
                .build()
                .parseClaimsJws(token)
                .getBody();

        return claims.getSubject();
    }

    public boolean isTokenExpired(String token) {
        try {
            Claims claims = Jwts.parserBuilder()
                    .setSigningKey(accessKey)
                    .build()
                    .parseClaimsJws(token)
                    .getBody();
            return claims.getExpiration().before(new Date());
        } catch (Exception e) {
            return true;
        }
    }
}