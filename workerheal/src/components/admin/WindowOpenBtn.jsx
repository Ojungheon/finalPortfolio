import React from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';

//스타일이 적용된 버튼 컴포넌트 (React Router `Link` 적용)
const Button = styled.button`
  display: flex;
  justify-content: center;
  align-items: center;
  text-decoration: none;
  width: ${(props) => props.w || '80px'};
  height: ${(props) => props.h || '40px'};
  background-color: ${(props) => props.c || 'orange'};
  border: none;
  border-radius: ${(props) => props.r || '15px'};
  font-size: ${(props) => props.f || '1.1em'};
  font-weight: bold;
  color: white;
  cursor: pointer;
  transition: all 0.3s ease-in-out;

  &:hover {
    opacity: 0.8;
  }
`;

//버튼 컴포넌트
const WindowOpenBtn = ({ children, to, w, h, r, f, c }) => {
  /* ################### 새창으로 열기 ################### */
  const openWindow = () => {
    const newWindow = window.open(
      to,
      '_blank',
      'width=1920,height=1080,menubar=yes,titlebar=yes,toolbar=yes'
    );
    if (newWindow) {
      newWindow.focus();
    }
  };

  /* ################### 화면 새로고침 ################### */
  const refreshCurrent = () => {
    window.location.reload();
  };

  /* ################### 화면 로드 시 데이터 불러오기 ################### */
  window.addEventListener('message', (e) => {
    if (e.data === 'windowClosed') {
      refreshCurrent();
    }
  });

  return (
    <Button to={to} w={w} h={h} r={r} f={f} c={c} onClick={openWindow}>
      {children}
    </Button>
  );
};

export default WindowOpenBtn;
