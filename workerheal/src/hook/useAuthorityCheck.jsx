import React from 'react';
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import { Alert } from '../utils/toast';

const useAuthorityCheck = (role, url) => {
  const navi = useNavigate();
  const token = sessionStorage.getItem('token');

  const alertLogin = async (icon, title) => {
    Alert({
      icon: icon,
      title: title,
      text: '로그인 페이지로 이동합니다.',
      allowOutsideClick: false, // ✅ 바깥 클릭으로 닫히지 않음
      allowEscapeKey: false, // ✅ ESC 키로 닫히지 않음
      allowEnterKey: false, // ✅ 엔터 키로 닫히지 않음
    }).then((result) => {
      if (result.isConfirmed) {
        navi(url);
      }
    });
  };

  return () => {
    if (!token) {
      // 토큰 여부 확인
      alertLogin('warning', '로그인 정보를 확인할 수 없습니다.');
    } else {
      const decodedToken = jwtDecode(token);
      if (!decodedToken.role.includes(role)) {
        // 토큰 권한여부 확인
        sessionStorage.removeItem('token');
        sessionStorage.removeItem('member');
        alertLogin('error', '접급 권한이 없는 계정입니다.');
      } else if (new Date() > new Date(decodedToken.exp * 1000)) {
        // 토큰 만료여부 확인
        sessionStorage.removeItem('token');
        sessionStorage.removeItem('member');
        alertLogin('warning', '로그인 세션이 만료되어 재접속이 필요합니다.');
      } else {
        return true;
      }
    }
  };
};

export default useAuthorityCheck;
