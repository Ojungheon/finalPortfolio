package com.dolearndorun.workerheal_app.jwt;


import com.dolearndorun.workerheal_app.security.SecurityUserDetails;
import com.dolearndorun.workerheal_app.security.UserVo;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.io.PrintWriter;

/**
 * Jwt 라이르버리를 사용해서 만든 토큰으로 인증 절차 진행하기 위한 class
 */
@RequiredArgsConstructor
@Slf4j
public class JwtFilter extends OncePerRequestFilter {

    private final JwtUtil jwtUtil;

    /**
     * 로그인 이후 클라이언트에서 서버로의 요청 발생 시 발급한 토큰으로 인증 진행 
     * @param request
     * @param response
     * @param filterChain
     * @throws ServletException
     * @throws IOException
     */
    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain) throws ServletException, IOException {

        // request header 에서 토큰 가져오기
        String token = request.getHeader("token");
        System.out.println("token = " + token);
        if(token == null || token.trim().isEmpty() || "NULL".equalsIgnoreCase(token)){ //"NULL".equalsIgnoreCase(token) : 대소문자 구분 없이 null 문자와 같은지 비교
            log.warn("token is null");
            filterChain.doFilter(request,response);
            return;
        }

        // 1. 토큰 만료 여부 검증 
        if(jwtUtil.isExpired(token)){
            log.warn("token is expired");
            filterChain.doFilter(request,response);
            return;
        }

        // 토큰에서 데이터 꺼내기 - no
        Long no = jwtUtil.getNo(token);
        // 토큰에서 데이터 꺼내기 - id
        String id = jwtUtil.getId(token);
        // 토큰에서 데이터 꺼내기 - name
        String name = jwtUtil.getName(token);
        // 토큰에서 데이터 꺼내기 - role
        String role = jwtUtil.getRole(token);

        // 꺼낸 데이터 객체로 저장
        UserVo vo = new UserVo();
        vo.setNo(no);
        vo.setId(id);
        vo.setName(name);

        // JWT 를 기반으로 인증처리
        SecurityUserDetails userDetails = new SecurityUserDetails(vo,role);
        Authentication authToken = new UsernamePasswordAuthenticationToken(userDetails,null,userDetails.getAuthorities());
        SecurityContextHolder.getContext().setAuthentication(authToken);

        // 검증 후 다음 동작으로 연결
        filterChain.doFilter(request,response);

    }//doFilterInternal

}//class
