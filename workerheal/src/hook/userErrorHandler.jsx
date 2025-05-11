import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Alert } from '../utils/toast';

const useErrorHandler = (error, url) => {
  const navi = useNavigate();
  const alert = async (title, text) => {
    Alert({
      icon: 'error',
      title: title,
      text: text,
      allowOutsideClick: false, // ✅ 바깥 클릭으로 닫히지 않음
      allowEscapeKey: false, // ✅ ESC 키로 닫히지 않음
      allowEnterKey: false, // ✅ 엔터 키로 닫히지 않음
    }).then((result) => {
      if (result.isConfirmed) {
        if (error == 403) {
          navi(url);
        }
      }
    });
  };

  return () => {
    if (error == 403) {
      sessionStorage.removeItem('token');
      sessionStorage.removeItem('member');
      alert(
        '로그인 세션이 만료되어 재접속이 필요합니다.',
        '로그인 페이지로 이동합니다.'
      );
    } else {
      alert(
        '서버와 연결 중 오류가 발생했습니다.',
        '자세한 내용은 관리자에게 문의 바랍니다.'
      );
    }
  };
};

export default useErrorHandler;
