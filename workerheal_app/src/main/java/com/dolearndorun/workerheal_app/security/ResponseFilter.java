package com.dolearndorun.workerheal_app.security;

import jakarta.servlet.*;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

import java.io.IOException;
import java.io.PrintWriter;

public class ResponseFilter implements Filter {


    @Override
    public void doFilter(ServletRequest servletRequest, ServletResponse servletResponse, FilterChain filterChain) throws IOException, ServletException {
        System.out.println("ResponseFilter.doFilter");
        filterChain.doFilter(servletRequest,servletResponse);
        HttpServletResponse resp = (HttpServletResponse) servletResponse;
        HttpServletRequest req = (HttpServletRequest) servletRequest;
        System.out.println("ResponseFilter.doFilter22222222222222222222");

        if(req.getMethod().equals("OPTIONS")){
            System.out.println("option req--------");
            return;
        }

        System.out.println("aaaaaaaaaaaaaa ::::::::"+resp.getStatus());
        if (resp.getStatus()==403) {
            System.out.println("*****************************************");
            // 403 Forbidden 응답을 JSON 형태로 직접 반환
            resp.setStatus(HttpServletResponse.SC_FORBIDDEN);
            resp.setContentType("application/json; charset=UTF-8");
            resp.setCharacterEncoding("UTF-8");
            ServletOutputStream os = resp.getOutputStream();
            os.println("{\"error\": \"Forbidden\", \"message\": \"login errrrrr\"}");

//            throw new ServletException("{\"error\": \"Forbidden\", \"message\": \"로그인 정보를 확인할 수 없습니다.\"}");
//            PrintWriter writer = resp.getWriter();
//            writer.write("{\"error\": \"Forbidden\", \"message\": \"로그인 정보를 확인할 수 없습니다.\"}");
//            writer.flush();
        }

    }

}
