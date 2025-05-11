import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowUp, faRobot } from '@fortawesome/free-solid-svg-icons';
import Chatbot from '../pages/user/Chatbot';

const FloatingContainer = styled.div`
  position: fixed;
  bottom: 20px;
  right: 20px;
  display: flex;
  flex-direction: column;
  gap: 10px;
  z-index: 1000;
`;

const FloatingButton = styled.button`
  width: 60px;
  height: 60px;
  border-radius: 50%;
  border: none;
  background-color: ${(props) => props.bg || '#007BFF'};
  color: white;
  font-size: 18px;
  font-weight: bold;
  cursor: pointer;
  box-shadow: 2px 2px 10px rgba(0, 0, 0, 0.2);
  display: flex;
  align-items: center;
  justify-content: center;
`;

const ChatbotModal = styled.div`
  position: fixed;
  bottom: 161px;
  right: 20px;
  width: 350px;
  height: 550px;
  background-color: white;
  border-radius: 10px;
  box-shadow: 2px 2px 10px rgba(0, 0, 0, 0.3);
  display: ${(props) => (props.visible ? 'block' : 'none')};
  padding: 15px;
  z-index: 1000000;
`;

const Header = styled.div`
  display: flex;
  align-items: center;
  width: 98%;
  height: 50px;
  border-bottom: 1px solid gray;
  margin-bottom: 30px;

  & > p {
    margin-left: 15px;
    font-size: 20px;
    font-weight: bold;
    color: #626262;
  }
`;

const CloseButton = styled.button`
  position: absolute;
  top: 10px;
  right: 10px;
  background: none;
  border: none;
  font-size: 20px;
  cursor: pointer;
`;

const FloatingButtons = () => {
  const [showChat, setShowChat] = useState(false);
  const [scrollVisible, setScrollVisible] = useState(false);

  // 스크롤 감지해서 최상단 버튼 보이기
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 0) {
        setScrollVisible(true);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // 최상단 이동 함수
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // 챗봇 버튼 클릭 시 모달 열기/닫기
  const toggleChat = () => {
    setShowChat(!showChat);
  };

  return (
    <>
      <FloatingContainer>
        {/* 최상단 이동 버튼 */}
        {scrollVisible && (
          <FloatingButton onClick={scrollToTop} bg="#FF5733">
            <FontAwesomeIcon icon={faArrowUp} size="lg" />{' '}
            {/* 🔥 FontAwesome 아이콘 적용 */}
          </FloatingButton>
        )}

        {/* 챗봇 버튼 */}
        <FloatingButton onClick={toggleChat} bg="#b746f8">
          <FontAwesomeIcon icon={faRobot} size="lg" />
        </FloatingButton>
      </FloatingContainer>

      {/* 챗봇 모달 */}
      <ChatbotModal visible={showChat}>
        <CloseButton onClick={toggleChat}>✖</CloseButton>
        <Header>
          <FontAwesomeIcon
            icon={faRobot}
            style={{ color: '#424243', width: '40px', height: '40px' }}
          />
          <p>ChatBot</p>
        </Header>
        <Chatbot />
      </ChatbotModal>
    </>
  );
};

export default FloatingButtons;
