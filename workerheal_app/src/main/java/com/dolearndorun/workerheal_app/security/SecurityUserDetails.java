package com.dolearndorun.workerheal_app.security;

import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.util.Collection;
import java.util.List;

/* UserDetail 객체 설정을 위한 class */
public class SecurityUserDetails implements UserDetails {

    private Long no;
    private String id;
    private String pw;
    private String name;
    private String role;

    // 생성자
    public SecurityUserDetails(UserVo vo, String role) {
        this.no = vo.getNo();
        this.id = vo.getId();
        this.pw = vo.getPw();
        this.name = vo.getName();
        this.role = role;
    }//SecurityUserDetails

    // 값 가져오기 - role
    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return List.of(new SimpleGrantedAuthority(role));
    }//getAuthorities

    // 값 가져오기 - id
    @Override
    public String getUsername() {
        return this.id;
    }//getUsername

    // 값 가져오기 - pw
    @Override
    public String getPassword() {
        return this.pw;
    }//getPassword

    // 값 가져오기 - no
    public Long getNo() {
        return this.no;
    }//getNo

    // 값 가져오기 - name
    public String getName() {
        return this.name;
    }//getName

}//class
