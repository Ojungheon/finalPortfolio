package com.dolearndorun.workerheal_app.jwt;

import io.jsonwebtoken.*;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import javax.crypto.SecretKey;
import javax.crypto.spec.SecretKeySpec;
import java.nio.charset.StandardCharsets;
import java.util.Date;

@Component
public class JwtUtil {

    private SecretKey secretKey;

    public JwtUtil(@Value("${dolearndorun.jwt.secret}") String str) {
        byte[] bytes = str.getBytes(StandardCharsets.UTF_8);
        this.secretKey = new SecretKeySpec(bytes, "HmacSHA256");
    }

    public String createJwtToken(Long no, String id, String name, String nick, String role, String phone, String jobNo, String company, String createdAt, Long points) {
        return Jwts.builder()
                .claim("no", no)
                .claim("id", id)  // 사용자 ID
                .claim("name",name) //사용자 이름
                .claim("nick", nick)  // 사용자 닉네임
                .claim("role", role)  // 사용자 역할
                .claim("phone", phone)  // 사용자 연락처 추가
                .claim("jobNo", jobNo)  // 사용자 직업 추가
                .claim("company", company)  // 회사명 추가
                .claim("createdAt", createdAt)  // 가입일 추가
                .claim("points", points)  // 보유 포인트 추가
                .issuedAt(new Date(System.currentTimeMillis()))  // 발행 시간
                .expiration(new Date(System.currentTimeMillis() + (1000 * 60 * 150000)))  // 15분 후 만료
                .signWith(secretKey)  // 서명
                .compact();  // JWT 문자열 반환
    }

    /**
     * 일반 유저 외 운영자, 호스트 로그인에 사용되는 token 생성 메서드
     * @param no
     * @param id
     * @param name
     * @param role
     * @return jwtToken
     */
    public String createSecurityJwtToken(Long no, String id, String name, String role) {
        return Jwts.builder()
                .claim("no", no)
                .claim("id", id)  // 사용자 ID
                .claim("name",name) //사용자 이름
                .claim("role", role)  // 사용자 역할
                .issuedAt(new Date(System.currentTimeMillis()))  // 발행 시간
                .expiration(new Date(System.currentTimeMillis() + (1000 * 60 * 150)))  // 15분 후 만료
                .signWith(secretKey)  // 서명
                .compact();  // JWT 문자열 반환
    }

    public String extractUserId(String token) {
        try {
            Claims claims = Jwts.parser()  // ✅ 최신 방식 적용
                    .verifyWith(secretKey)  // ✅ 기존 setSigningKey 대신 verifyWith 사용
                    .build()
                    .parseSignedClaims(token)  // ✅ 최신 메서드 적용
                    .getPayload();

            return claims.get("id", String.class); // ✅ JWT에서 ID 추출
        } catch (JwtException e) {
            return null; // 유효하지 않은 토큰일 경우 null 반환
        }
    }

    // 토큰 만료 여부 검증
    public Boolean isExpired(String token){
        return Jwts.parser().verifyWith(secretKey).build()
                .parseSignedClaims(token)
                .getPayload()
                .getExpiration()
                .before(new Date());
    } //isExpired

    // 토큰에서 데이터 꺼내기 - no
    public Long getNo(String token){
        return Jwts.parser().verifyWith(secretKey).build()
                .parseSignedClaims(token)
                .getPayload()
                .get("no", Long.class);
    }//getNo

    // 토큰에서 데이터 꺼내기 - id
    public String getId(String token){
        return Jwts.parser().verifyWith(secretKey).build()
                .parseSignedClaims(token)
                .getPayload()
                .get("id", String.class);
    }// getId

    // 토큰에서 데이터 꺼내기 - name
    public String getName(String token){
        return Jwts.parser().verifyWith(secretKey).build()
                .parseSignedClaims(token)
                .getPayload()
                .get("name", String.class);
    }// getName

    // 토큰에서 데이터 꺼내기 - role
    public String getRole(String token){
        return Jwts.parser().verifyWith(secretKey).build()
                .parseSignedClaims(token)
                .getPayload()
                .get("role", String.class);
    }// getRole

}//class
