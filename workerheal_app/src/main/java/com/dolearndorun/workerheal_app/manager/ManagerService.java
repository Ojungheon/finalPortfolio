package com.dolearndorun.workerheal_app.manager;

import com.dolearndorun.workerheal_app.common.PageVo;
import com.dolearndorun.workerheal_app.host.BusinessVo;
import com.dolearndorun.workerheal_app.host.HostMapper;
import com.dolearndorun.workerheal_app.host.HostVo;
import com.dolearndorun.workerheal_app.jwt.JwtUtil;
import com.dolearndorun.workerheal_app.lodging.LodgingVo;
import com.dolearndorun.workerheal_app.lodging.user.LodgingMapper;
import com.dolearndorun.workerheal_app.member.MemberVo;
import com.dolearndorun.workerheal_app.member.reservated.LodgingReservatedVo;
import com.dolearndorun.workerheal_app.member.reservated.OfficeReservatedVo;
import com.dolearndorun.workerheal_app.member.reservated.ReservatedVo;
import com.dolearndorun.workerheal_app.office.AttachmentOfficeVo;
import com.dolearndorun.workerheal_app.office.OfficeMapper;
import com.dolearndorun.workerheal_app.office.OfficeVo;
import com.dolearndorun.workerheal_app.packages.PackagesVo;
import com.dolearndorun.workerheal_app.packages.ReservationPackageVo;
import com.dolearndorun.workerheal_app.packages.ReservationTourVo;
import com.dolearndorun.workerheal_app.tour.TourVo;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
@Transactional
@RequiredArgsConstructor
public class ManagerService {

    private final BCryptPasswordEncoder encoder;
    private final ManagerMapper managerMapper;
    private final JwtUtil jwtUtil;


    public void join(ManagerVo vo) {
        String encodedPw = encoder.encode(vo.getPw());
        vo.setPw(encodedPw);
        managerMapper.join(vo);
    }


    public ManagerVo findManagerById(String id) {
        return managerMapper.findManagerById(id);
    }
    public String login(ManagerVo vo) {
        ManagerVo dbVo = findManagerById(vo.getId());

        if (dbVo == null){
            throw new IllegalStateException("해당 ID의 매니저는 존재하지않습니다");
        }

        boolean isMatch = encoder.matches(vo.getPw(),dbVo.getPw());
        if (!isMatch){
            throw new IllegalStateException("비밀번호가 일치하지 않습니다");
        }

        return jwtUtil.createSecurityJwtToken(
                dbVo.getNo(),
                dbVo.getId(),
                dbVo.getName(),
                "ROLE_MANAGER"
        );
    }

    //아이디 찾기
    public ManagerVo findHostByNameAndPhone(String name, String phone) {
        return managerMapper.findHostByNameAndPhone(name, phone);
    }

    // ✅ 사용자가 입력한 정보가 맞는지 검증 (비밀번호 찾기)
    public boolean validateHostForPasswordReset(String id, String name, String phone) {
        return managerMapper.findHostByIdNamePhone(id, name, phone) != null;
    }
    // ✅ 비밀번호 변경 로직
    public void updatePassword(String id, String newPassword) {
        if (newPassword.length() < 8) {
            throw new IllegalArgumentException("비밀번호는 8자 이상이어야 합니다.");
        }

        // ✅ 해당 ID의 계정이 존재하는지 확인
        ManagerVo manager = managerMapper.findManagerById(id);
        if (manager == null) {
            throw new IllegalArgumentException("해당 계정이 존재하지 않습니다.");
        }

        // ✅ 새 비밀번호를 암호화하여 저장
        String encryptedPassword = encoder.encode(newPassword);
        managerMapper.updatePassword(id, encryptedPassword);
    }


    //호스트 리스트
    public PageVo<HostVo> listHost(int page, int pageSize) {
        // Total number of hosts (for pagination)
        long totalElements = managerMapper.countHosts();
        int offset = (page - 1) * pageSize;

        // Get the paginated list of hosts
        List<HostVo> hosts = managerMapper.listHosts(offset, pageSize);

        int totalPages = (int) Math.ceil((double) totalElements / pageSize);

        // Return PageVo with paginated data
        PageVo<HostVo> pageVo = new PageVo<>();
        pageVo.setContent(hosts);
        pageVo.setTotalElements(totalElements);
        pageVo.setTotalPages(totalPages);
        pageVo.setCurrentPage(page);
        pageVo.setPageSize(pageSize);


        return pageVo;
    }

    //호스트 디테일
    public Map getHostDetailsWithPagination(Long no, int page, int pageSize) {
        // 총 항목 수를 가져옵니다 (필요시 총 데이터 개수 조회)
        long totalElements = managerMapper.countHostDetails(no);

        Map resultSet = new HashMap<>();
        // OFFSET 계산 (0부터 시작하므로)
        int offset = (page - 1) * pageSize;

        // 매퍼에서 페이징된 데이터 가져오기
        List<BusinessVo> businessList = managerMapper.getHostDetailsWithLodgingAndOffice(no, offset, pageSize);
        HostVo hostInfo = managerMapper.getHostDetails(no);

        // 전체 페이지 수 계산
        int totalPages = (int) Math.ceil((double) totalElements / pageSize);

        // PageVo 객체에 데이터를 설정
        PageVo<BusinessVo> pageVo = new PageVo<>();
        pageVo.setContent(businessList);
        pageVo.setTotalElements(totalElements);
        pageVo.setTotalPages(totalPages);
        pageVo.setCurrentPage(page);
        pageVo.setPageSize(pageSize);

        resultSet.put("pageVo",pageVo);
        resultSet.put("hostInfo",hostInfo);


        System.out.println("pageVo = " + pageVo);
        return resultSet;
    }

    //호스트 추가
    public void insertHost(HostVo vo) {
        // 고정된 비밀번호 '12341234'를 암호화하여 사용
        String encodedPw = encoder.encode("12341234");
        vo.setPw(encodedPw); // 암호화된 비밀번호를 vo에 설정
        managerMapper.insertHost(vo); // DB에 호스트 정보 삽입
    }

    //멤버 리스트
    public PageVo<MemberVo> getMemberList(int page, int pageSize) {

        // Total number of packages (for pagination)
        long totalElements = managerMapper.countMember();
        System.out.println("totalElements = " + totalElements);
        int offset = (page-1) * pageSize;
        // Get the paginated list of packages
        List<MemberVo> members = managerMapper.getMemberList(offset, pageSize);

        int totalPages = (int) Math.ceil((double) totalElements / pageSize);

        // Return PageVo with paginated data
        PageVo<MemberVo> pageVo = new PageVo<>();
        pageVo.setContent(members);
        pageVo.setTotalElements(totalElements);
        pageVo.setTotalPages(totalPages);
        pageVo.setCurrentPage(page);
        pageVo.setPageSize(pageSize);

        return pageVo;
    }


    public ReservatedVo getReservationDetails(String searchKeyword) {
        if (searchKeyword.startsWith("LO")) {
            return managerMapper.getLodgingReservationDetailByNo(searchKeyword); // LO인 경우 숙소 정보 조회
        } else if (searchKeyword.startsWith("OF")) {
            return managerMapper.getOfficeReservationDetailByNo(searchKeyword); // OF인 경우 오피스 정보 조회
        } else if (searchKeyword.startsWith("PA")) {
            return managerMapper.getPackageReservationDetailByNo(searchKeyword); // PA인 경우 패키지 정보 조회
        } else {
            throw new IllegalArgumentException("유효하지 않은 검색어입니다.");
        }
    }



}
