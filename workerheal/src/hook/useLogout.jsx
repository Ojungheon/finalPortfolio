import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Check } from '../utils/toast';

const useLogout = (url) => {
  const navi = useNavigate();

  const alertLogout = async () => {
    Check({
      icon: 'question',
      title: '',
      text: '로그아웃 하시겠습니까?',
      allowOutsideClick: false, // ✅ 바깥 클릭으로 닫히지 않음
      allowEscapeKey: false, // ✅ ESC 키로 닫히지 않음
      allowEnterKey: false, // ✅ 엔터 키로 닫히지 않음
    }).then((result) => {
      if (result.isConfirmed) {
        sessionStorage.removeItem('token');
        sessionStorage.removeItem('member');
        navi(url);
      } else {
        return;
      }
    });
  };

  return () => {
    alertLogout();
  };
};

export default useLogout;
