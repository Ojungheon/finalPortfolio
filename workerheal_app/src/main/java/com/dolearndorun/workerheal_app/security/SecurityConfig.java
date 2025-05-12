package com.dolearndorun.workerheal_app.security;

import com.dolearndorun.workerheal_app.jwt.JwtFilter;
import com.dolearndorun.workerheal_app.jwt.JwtUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.security.web.context.request.async.WebAsyncManagerIntegrationFilter;
import org.springframework.web.cors.CorsConfiguration;

@Configuration  // 이 클래스가 Spring의 설정 파일임을 나타냄
@RequiredArgsConstructor
public class SecurityConfig {

    private final JwtUtil jwtUtil;

    /**
     * Spring Security 기본 설정
     * @param httpSecurity HTTP 보안 설정을 위한 객체
     * @return SecurityFilterChain (Spring Security 필터 체인)
     * @throws Exception 설정 중 예외 발생 시 처리
     */
    @Bean  // Spring Security의 보안 설정을 Bean으로 등록
    public SecurityFilterChain securityFilterChain(HttpSecurity httpSecurity) throws Exception {

        // CSRF(Cross-Site Request Forgery) 보호 기능 비활성화
        httpSecurity.csrf(AbstractHttpConfigurer::disable);

        // 클라이언트 요청에 대한 권한 및 인증 조건
        httpSecurity.authorizeHttpRequests(auth -> auth
                .requestMatchers("/","api/member/join","api/*/login","api/*/findId","api/*/findPw","api/*/resetPw").permitAll() // 일반 회원가입 및 각 페이지로의 로그인 경우 인증 없이 통과
                .requestMatchers("api/member/**","api/*/reservation").hasRole("MEMBER") // 해당 경로의 요청의 경우 MEMBER 권한을 가져야 통과
                .requestMatchers("api/host/**").hasRole("HOST") // 해당 경로의 요청의 경우 host 권한을 가져야 통과
                .requestMatchers("api/manager/**").hasRole("MANAGER") // 해당 경로의 요청의 경우 manager 권한을 가져야 통과
                .anyRequest().permitAll()); // 그 외 요청의 경우 인증 없이 사용 가능

        // CORS (Cross-Origin Resource Sharing) 설정
        httpSecurity.cors(corsConfig -> corsConfig.configurationSource(request -> {
            CorsConfiguration conf = new CorsConfiguration();
            conf.addAllowedOrigin("*");  // 모든 도메인에서 접근 허용
            conf.addAllowedMethod("*");  // 모든 HTTP 메서드(GET, POST, PUT 등) 허용
            conf.addAllowedHeader("*");  // 모든 요청 헤더 허용
            return conf;
        }));

        // filter 추가 (기존 UsernamePasswordAuthenticationFilter 를 내가 만든 필터로 변경)
        httpSecurity.addFilterAt(new JwtFilter(jwtUtil), UsernamePasswordAuthenticationFilter.class);
//        httpSecurity.addFilterAt(new ResponseFilter(), WebAsyncManagerIntegrationFilter.class);

        return httpSecurity.build();  // 보안 설정을 적용한 SecurityFilterChain 반환
    }

}//class

