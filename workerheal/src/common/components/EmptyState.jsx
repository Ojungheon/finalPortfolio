// src/common/components/EmptyState.jsx
import React from "react";
import styled from "styled-components";

const EmptyContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  padding: 20px;
  gap: 10px;

  img {
    width: 100px;
    height: auto;
    opacity: 0.8;
  }

  p {
    font-size: 16px;
    font-weight: bold;
    color: #555;
  }
`;

const EmptyState = ({ message = "조회되는 항목이 없어요", imageUrl }) => {
  return (
    <EmptyContainer>
      <img
        src={imageUrl || "https://cdn-icons-png.flaticon.com/512/2748/2748558.png"}
        alt="빈 목록"
      />
      <p>{message}</p>
    </EmptyContainer>
  );
};

export default EmptyState;
