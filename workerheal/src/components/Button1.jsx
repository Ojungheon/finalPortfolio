import React from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';

//스타일이 적용된 버튼 컴포넌트 (React Router `Link` 적용)
const Button = styled(Link)`
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
const Button1 = ({ children, to, w, h, r, f, c, ta }) => {
  return (
    <Button to={to} w={w} h={h} r={r} f={f} c={c} target={ta || '_self'}>
      {children}
    </Button>
  );
};

export default Button1;
