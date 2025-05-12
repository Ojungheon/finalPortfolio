package com.dolearndorun.workerheal_app.host;

import com.dolearndorun.workerheal_app.jwt.JwtUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@Transactional
@RequiredArgsConstructor
public class HostService {

    private final BCryptPasswordEncoder encoder;
    private final HostMapper hostMapper;
    private final JwtUtil jwtUtil;

    public void join(HostVo vo) {
        String encodedPw=encoder.encode(vo.getPw());
        vo.setPw(encodedPw);
        hostMapper.join(vo);
    }

    // ✅ 호스트 정보 조회
    public HostVo findHostById(String id) {
        return hostMapper.findHostById(id);
    }

    // ✅ 호스트 로그인 처리
    public String login(HostVo vo) {
        HostVo dbVo = findHostById(vo.getId());
        System.out.println("dbVo = " + dbVo);

        // 🔹 `dbVo`가 `null`인 경우 예외 처리 추가
        if (dbVo == null) {
            throw new IllegalStateException("해당 ID의 호스트가 존재하지 않습니다.");
        }

        // 🔹 비밀번호 검증
        boolean isMatch = encoder.matches(vo.getPw(), dbVo.getPw());
        if (!isMatch) {
            throw new IllegalStateException("비밀번호가 일치하지 않습니다.");
        }

        // ✅ JWT 토큰 생성 후 반환
        String token = jwtUtil.createSecurityJwtToken(
                dbVo.getNo(),
                dbVo.getId(),
                dbVo.getName(),
                "ROLE_HOST"
        );

        System.out.println("token : " +token);

        return token;

    }

    // ✅ 아이디 찾기
    public HostVo findHostByNameAndPhone(String name, String phone) {
        return hostMapper.findHostByNameAndPhone(name, phone);
    }

    // ✅ 사용자가 입력한 정보가 맞는지 검증 (비밀번호 찾기)
    public boolean validateHostForPasswordReset(String id, String name, String phone) {
        return hostMapper.findHostByIdNamePhone(id, name, phone) != null;
    }

    // ✅ 비밀번호 변경 로직
    public void updatePassword(String id, String newPassword) {
        if (newPassword.length() < 8) {
            throw new IllegalArgumentException("비밀번호는 8자 이상이어야 합니다.");
        }

        // ✅ 해당 ID의 계정이 존재하는지 확인
        HostVo host = hostMapper.findHostById(id);
        if (host == null) {
            throw new IllegalArgumentException("해당 계정이 존재하지 않습니다.");
        }

        // ✅ 새 비밀번호를 암호화하여 저장
        String encryptedPassword = encoder.encode(newPassword);
        hostMapper.updatePassword(id, encryptedPassword);
    }

    public List<HostVo> select(int no) {
        List<HostVo> voList = hostMapper.sellect(no);
        return voList;
    }
}
