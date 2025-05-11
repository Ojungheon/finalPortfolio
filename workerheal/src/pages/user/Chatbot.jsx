import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import {
  setFaqCategories,
  setFaqCategoryVo,
} from '../../redux/faqCategorySlice';
import { useDispatch, useSelector } from 'react-redux';
import { setFaqVo, setSelectedFaq } from '../../redux/faqSlice';

const API_SERVER = process.env.REACT_APP_SERVER_ROOT;

const ModalContent = styled.div`
  display: flex;
  width: 100%;
  max-width: 1000px;
  border-radius: 10px;
  max-height: 80vh;
  position: relative;
  display: flex;
  flex-direction: column;
  margin-top: -30px;

  &::-webkit-scrollbar {
    display: flex;
  }
`;

const ChatContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 10px;
  padding: 10px;
  overflow-y: scroll; /* 스크롤은 동작하지만, 숨김 */
  margin-top: 10px;
  height: 470px;

  /* 스크롤바 숨기기 */
  &::-webkit-scrollbar {
    display: none;
  }
  scrollbar-width: none; /* Firefox */
  -ms-overflow-style: none; /* IE, Edge */
`;

const SelectChat = styled.div`
  display: flex;
  padding: 10px 15px;
  background-color: #efefef;
  border-radius: 20px;
  cursor: pointer;
  justify-content: center;
  align-items: center;
  text-align: center;
  transition: 0.3s;
  max-width: 80%;
  word-break: break-word;

  &:hover {
    background-color: #4500b5;
    color: white;
  }
`;

/** 챗봇 메시지 (왼쪽 정렬) */
const BotMessage = styled.div`
  align-self: flex-start;
  background-color: #f1f0f0;
  color: black;
  padding: 10px 15px;
  border-radius: 15px;
  max-width: 60%;
  word-break: break-word;
  text-align: left;
  position: relative;
  margin-top: 10px;
  animation: fadeIn 0.3s ease-in-out;

  &:after {
    content: '';
    position: absolute;
    left: -10px;
    top: 50%;
    transform: translateY(-50%);
    border-width: 5px;
    border-style: solid;
    border-color: transparent #f1f0f0 transparent transparent;
  }
`;

/** 사용자 메시지 (오른쪽 정렬) */
const UserMessage = styled.div`
  align-self: flex-end;
  background-color: #4500b5;
  color: white;
  padding: 10px 15px;
  border-radius: 15px;
  max-width: 60%;
  word-break: break-word;
  text-align: left;
  position: relative;
  margin-top: 5px;
  animation: fadeIn 0.3s ease-in-out;

  &:after {
    position: absolute;
    right: -10px;
    top: 50%;
    transform: translateY(-50%);
    border-width: 5px;
    border-style: solid;
    border-color: transparent transparent transparent #4500b5;
  }
`;

const Chatbot = () => {
  const dispatch = useDispatch();
  const [messages, setMessages] = useState([
    { text: '환영합니다! 무엇을 도와드릴까요?', sender: 'bot' },
  ]);
  const [showCategories, setShowCategories] = useState(true);
  const [showQuestions, setShowQuestions] = useState(false);

  // Redux 상태 가져오기
  const faqCategoryState = useSelector((state) => state.faqCategory);
  // console.log('삐뽀삐뽀  상태확인!!!! :', faqCategoryState);

  const faqState = useSelector((state) => state.faq);

  const categories = faqCategoryState?.categories || [];
  const faqList = faqState?.faqList || [];

  useEffect(() => {
    const option = {
      method: 'GET',
      headers: {
        'content-type': 'application/json',
      },
    };

    fetch(`http://${API_SERVER}/api/faq/category`, option)
      .then((resp) => resp.json())
      .then((data) => {
        dispatch(setFaqCategories(data)); // Redux에 카테고리 목록 저장
      })
      .catch((error) => console.error('카테고리 불러오기 실패....', error));
  }, [dispatch]);

  // 카테고리 선택 핸들러
  const handleCategorySelect = (category) => {
    if (!category.no) {
      console.error('카테고리 번호가 없습니다.');
      return;
    }

    dispatch(setFaqCategoryVo(category)); // Redux에 선택한 카테고리 저장

    //  해당 카테고리의 FAQ 목록 가져오기
    const option = {
      method: 'GET',
      headers: {
        'content-type': 'application/json',
      },
    };
    fetch(`http://${API_SERVER}/api/faq/list?categoryNo=${category.no}`, option)
      .then((resp) => {
        // console.log('📢 상태 확인:', resp);
        return resp.json();
      })
      .then((data) => {
        dispatch(setFaqVo(data)); // Redux에 FAQ 목록 저장
        setShowCategories(false); // 카테고리 숨기기
        setShowQuestions(true); // 질문 리스트 보이기
      })
      .catch((error) => console.error('FAQ 불러오기 실패...:', error));
  };

  // 질문 선택 핸들러
  const handleQuestionSelect = (faq) => {
    dispatch(setSelectedFaq(faq)); // Redux에 선택한 질문 저장

    // 사용자 선택 메시지 추가
    setMessages((prev) => [
      ...prev,
      { text: `Q: ${faq.question}`, sender: 'user' },
    ]);

    // 1초 후 챗봇의 답변 출력
    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        { text: `A: ${faq.detail}`, sender: 'bot' },
      ]);
    }, 1000);

    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        {
          text: '더 궁금한 것이 있나요? 다시 카테고리를 선택해 주세요.',
          sender: 'bot',
        },
      ]);

      // 기존 질문 목록 숨기고 카테고리 선택 화면 다시 활성화
      setShowCategories(true);
      setShowQuestions(false); // 새로운 질문 리스트는 표시되지 않도록 설정
    }, 2500); // 답변이 나온 후 1.5초 후에 실행 (총 2.5초 대기)
  };

  return (
    <ModalContent>
      <ChatContainer>
        {/* 기존 메시지 출력 */}
        {messages.length > 0
          ? messages.map((msg, index) =>
              msg.sender === 'bot' ? (
                <BotMessage key={index}>{msg.text}</BotMessage>
              ) : (
                <UserMessage key={index}>{msg.text}</UserMessage>
              )
            )
          : null}
        {/* 카테고리 선택 화면 */}
        {showCategories &&
          categories.map((category, index) => (
            <SelectChat
              key={index}
              onClick={() => handleCategorySelect(category)}
            >
              {category.name}
            </SelectChat>
          ))}

        {/* 질문 리스트 출력 */}
        {showQuestions &&
          faqList.length > 0 &&
          faqList.map((faq, index) => (
            <SelectChat key={index} onClick={() => handleQuestionSelect(faq)}>
              {faq.question}
            </SelectChat>
          ))}
      </ChatContainer>
    </ModalContent>
  );
};

export default Chatbot;
