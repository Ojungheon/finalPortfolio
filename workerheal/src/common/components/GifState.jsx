// src/common/components/GifState.jsx
import React from "react";
import styled from "styled-components";

const StateContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  padding: 20px;
  gap: 10px;

  img {
    width: ${({ size }) => size || "120px"}; // 크기 조절 가능
    height: auto;
    opacity: 0.8;
  }

  p {
    font-size: 16px;
    font-weight: bold;
    color: #555;
  }
`;

const GifState = ({ message, imageUrl, size }) => {
  return (
    <StateContainer size={size}>
      <img
        src={imageUrl || "https://cdn-icons-gif.flaticon.com/17905/17905753.gif"}
        alt="상태 표시"
      />
      <p>{message}</p>
    </StateContainer>
  );
};

export default GifState;
