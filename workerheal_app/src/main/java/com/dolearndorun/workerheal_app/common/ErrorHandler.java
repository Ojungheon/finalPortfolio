package com.dolearndorun.workerheal_app.common;

import jakarta.servlet.http.HttpServletResponse;
import lombok.Getter;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;

@RestControllerAdvice  // 모든 컨트롤러에서 발생하는 예외를 처리하는 클래스
@Slf4j  // 로그를 기록하기 위한 Lombok 어노테이션
public class ErrorHandler {

    /**
     * 전역 예외 처리 메서드
     * @param e 발생한 예외 객체
     * @return ResponseEntity<ErrorRespVo> (에러 메시지와 HTTP 상태 코드 포함)
     */
    @ExceptionHandler(Exception.class)  // 모든 예외(Exception) 처리
    public ResponseEntity<ErrorRespVo> handleException(Exception e) {
        log.info(e.getMessage());  // 예외 메시지를 로그로 출력

        ErrorRespVo errorRespVo = new ErrorRespVo("에러 발생");  // 사용자에게 반환할 에러 메시지 객체 생성

        return ResponseEntity.status(500).body(errorRespVo);  // HTTP 500 응답과 함께 에러 메시지 반환
    }

    /**
     * 예외 응답 객체 (내부 클래스)
     */
    @Getter  // msg 필드의 Getter 자동 생성
    @RequiredArgsConstructor  // final 필드를 가진 생성자 자동 생성
    private class ErrorRespVo {
        private final String msg;  // 에러 메시지
    }
}
