import React from "react";
import styled from "styled-components";

const StyledButton = styled.button`
  width: ${(props) => props.w || "80px"};
  height: ${(props) => props.h || "40px"};
  background-color: ${(props) => props.c || "orange"};
  border: none;
  border-radius: ${(props) => props.r || "15px"};
  font-size: ${(props) => props.f || "1.1em"};
  font-weight: bold;
  color: white;
  cursor: pointer;
  transition: all 0.3s ease-in-out;

  &:hover {
    opacity: 0.8;
  }
`;

const ButtonS = ({ children, type = "submit", w, h, r, f, c, onClick }) => {
  return (
    <StyledButton type={type} w={w} h={h} r={r} f={f} c={c} onClick={onClick}>
      {children}
    </StyledButton>
  );
};

export default ButtonS;
