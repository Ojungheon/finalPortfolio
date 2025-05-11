import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { useDispatch } from 'react-redux';
import { setManagerId } from '../../redux/managerSlice'; // ✅ 매니저 ID 저장 액션
import { Toast, Alert } from '../../utils/toast';

const API_SERVER = process.env.REACT_APP_SERVER_ROOT;

// ✅ 모달 전체 화면 배경
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
`;

// ✅ 모달 창 스타일
const ModalContent = styled.div`
  background: white;
  padding: 40px;
  border-radius: 5px;
  width: 350px;
  text-align: center;
  position: relative;
`;

// ✅ 닫기 버튼 스타일
const CloseButton = styled.button`
  position: absolute;
  top: 10px;
  right: 10px;
  border: none;
  background: none;
  font-size: 20px;
  cursor: pointer;
`;

// ✅ 입력 필드 스타일
const Input = styled.input`
  width: 90%;
  padding: 10px;
  margin: 8px 0;
  border: 1px solid #ccc;
  font-size: 16px;
  outline: none;
`;

// ✅ 버튼 스타일
const Button = styled.button`
  width: 100%;
  padding: 10px;
  margin-top: 15px;
  background-color: orange;
  color: white;
  border: none;
  font-size: 16px;
  cursor: pointer;
  border-radius: 3px;

  &:hover {
    opacity: 0.8;
  }
`;

const FindModalManager = ({ mode, onClose }) => {
  const [formData, setFormData] = useState({
    id: '',
    name: '',
    phone: '',
  });
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // ✅ 입력값 변경 핸들러
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // ✅ 매니저 아이디 찾기 함수
  const handleFindId = async (event) => {
    event.preventDefault();

    try {
      const response = await fetch(`http://${API_SERVER}/api/manager/findId`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.name,
          phone: formData.phone,
        }),
      });

      const result = await response.text();

      if (response.ok) {
        Alert({
          icon: 'success',
          text: `매니저님의 아이디는: ${result} 입니다`,
        }).then((result) => {
          if (result.isConfirmed) {
            navigate('/manager/login');
          }
        });
      } else {
        Toast.fire({
          icon: 'error',
          title: '일치하는 아이디가 없습니다',
        });
      }
    } catch (error) {
      Toast.fire({
        icon: 'error',
        title: '서버오류가 발생하였습니다',
      });
    }
  };

  // ✅ 매니저 비밀번호 찾기 함수
  const handleFindPw = async (event) => {
    event.preventDefault();

    try {
      const response = await fetch(`http://${API_SERVER}/api/manager/findPw`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: formData.id,
          name: formData.name,
          phone: formData.phone,
        }),
      });

      if (response.ok) {
        console.log('✅ ID 확인:', formData.id);
        dispatch(setManagerId(formData.id)); // ✅ Redux로 ID 저장
        sessionStorage.setItem('managerId', formData.id);
        navigate('/manager/resetpassword');
      } else {
        Toast.fire({
          icon: 'error',
          title: '일치하는 계정 정보가 없습니다',
        });
      }
    } catch (error) {
      Toast.fire({
        icon: 'error',
        title: '서버 오류가 발생하였습니다',
      });
    }
  };

  return (
    <ModalOverlay>
      <ModalContent>
        <CloseButton onClick={onClose}>×</CloseButton>
        <h3>
          {mode === 'findId' ? '매니저 아이디 찾기' : '매니저 비밀번호 찾기'}
        </h3>

        {/* ✅ mode에 따라 다른 `onSubmit` 실행 */}
        <form onSubmit={mode === 'findId' ? handleFindId : handleFindPw}>
          {mode === 'findPw' && (
            <Input
              type="text"
              name="id"
              placeholder="아이디 입력"
              value={formData.id}
              onChange={handleChange}
              required
            />
          )}
          <Input
            type="text"
            name="name"
            placeholder="이름 입력"
            value={formData.name}
            onChange={handleChange}
            required
          />
          <Input
            type="text"
            name="phone"
            placeholder="전화번호 입력"
            value={formData.phone}
            onChange={handleChange}
            required
          />

          <Button type="submit">
            {mode === 'findId' ? '아이디 찾기' : '비밀번호 찾기'}
          </Button>
        </form>
      </ModalContent>
    </ModalOverlay>
  );
};

export default FindModalManager;
