import React from "react";
import styled from "styled-components";

// 모달 배경
const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
`;

// 모달 컨테이너
const ModalContainer = styled.div`
  background: white;
  padding: 30px;
  border-radius: 3px;
  text-align: center;
  width: 350px;
  box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.1);
  position: relative;
`;

// 닫기 버튼 스타일 (X 버튼)
const CloseButton = styled.button`
  position: absolute;
  top: 10px;
  right: 10px;
  background: none;
  border: none;
  font-size: 18px;
  font-weight: bold;
  cursor: pointer;
  color: #888;
  transition: 0.3s;

  &:hover {
    color: black;
  }
`;

// 제목 스타일
const ModalTitle = styled.h3`
  font-size: 20px;
  font-weight: bold;
  margin-bottom: 15px;
  color: #333;
`;

// 설명 스타일
const ModalMessage = styled.p`
  font-size: 16px;
  color: #666;
  margin-bottom: 20px;
`;

// 버튼 컨테이너
const ButtonContainer = styled.div`
  display: flex;
  justify-content: center;
  gap: 10px;
`;

// 버튼 스타일
const ConfirmButton = styled.button`
  width: 300px;
  padding: 10px;
  font-size: 16px;
  font-weight: bold;
  color: white;
  background-color: orange;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  transition: 0.3s;

  &:hover {
    opacity: 0.8;
  }
`;

const NoticeModal = ({ title, message, onClose, onConfirm }) => {
  return (
    <ModalOverlay>
      <ModalContainer>
        <CloseButton onClick={onClose}>×</CloseButton>
        <ModalTitle>{title}</ModalTitle>
        <ModalMessage>{message}</ModalMessage>
        <ButtonContainer>
          <ConfirmButton onClick={onConfirm}>확인</ConfirmButton>
        </ButtonContainer>
      </ModalContainer>
    </ModalOverlay>
  );
};

export default NoticeModal;
