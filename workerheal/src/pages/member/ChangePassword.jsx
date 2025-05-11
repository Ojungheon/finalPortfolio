import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import Button1 from '../../components/Button1';
import ButtonS from '../../components/ButtonS';
import NoticeModal from '../../common/components/user/NoticeModal';
import { jwtDecode } from 'jwt-decode';
import { Toast, Alert } from '../../utils/toast';

const API_SERVER = process.env.REACT_APP_SERVER_ROOT;

// ✅ 전체 페이지 컨테이너
const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
  font-family: 'Arial', sans-serif;
`;

// ✅ 폼 컨테이너
const FormWrapper = styled.div`
  width: 400px;
  padding: 50px;
  text-align: center;
  border: 1px solid #ccc;
  background: #fff;
  display: flex;
  flex-direction: column;
  gap: 15px;
`;

// ✅ 제목 스타일
const Title = styled.h2`
  font-size: 24px;
  font-weight: bold;
  margin-bottom: 10px;
`;

// ✅ 입력 필드 컨테이너
const InputWrapper = styled.div`
  position: relative;
  width: 100%;
`;

// ✅ 입력 필드 스타일
const Input = styled.input`
  width: 95%;
  padding: 10px;
  margin: 8px 0;
  border: none;
  border-bottom: 1px solid #ccc;
  outline: none;
  font-size: 16px;
  &:focus {
    border-bottom: 1px solid #ffa500;
  }
`;

// ✅ 유효성 검사 메시지 스타일
const Message = styled.span`
  position: absolute;
  right: 5px;
  top: 50%;
  transform: translateY(-50%);
  font-size: 12px;
  font-weight: bold;
  color: ${(props) => (props.valid ? 'green' : 'red')};
`;

// ✅ 버튼 컨테이너
const ButtonContainer = styled.div`
  display: flex;
  justify-content: space-between;
  margin-top: 20px;
`;

const ChangePassword = () => {
  const navigate = useNavigate();
  const [token, setToken] = useState(sessionStorage.getItem('token'));
  const [userId, setUserId] = useState(null);

  // ✅ 로그인 여부 확인 및 토큰 검증
  useEffect(() => {
    if (!token) {
      Toast.fire({
        icon: 'error',
        title: '로그인이 필요합니다',
      });
      navigate('/member/login');
    }

    try {
      const decodedToken = jwtDecode(token);
      setUserId(decodedToken.id);
    } catch (error) {
      console.error('토큰 해독 오류:', error);
      sessionStorage.removeItem('token');
      navigate('/member/login');
    }
  }, [token, navigate]);

  // ✅ 입력값 상태 관리
  const [formData, setFormData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  // ✅ 유효성 검사 상태 관리
  const [validation, setValidation] = useState({
    newPassword: null,
    confirmPassword: null,
  });

  // ✅ 모달 상태 관리
  const [isErrorModalOpen, setIsErrorModalOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  // ✅ 입력값 변경 핸들러
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // 🔹 비밀번호 길이 검사
    if (name === 'newPassword') {
      setValidation((prev) => ({
        ...prev,
        newPassword:
          value.length >= 8 ? '✅ 사용 가능' : '❌ 최소 8자 이상 입력하세요.',
      }));
    }

    // 🔹 비밀번호 확인 검사
    if (name === 'confirmPassword') {
      setValidation((prev) => ({
        ...prev,
        confirmPassword:
          value === formData.newPassword
            ? '✅ 비밀번호 일치'
            : '❌ 비밀번호가 다릅니다.',
      }));
    }
  };

  // ✅ 비밀번호 변경 요청
  const handlePasswordChange = async () => {
    // 🔹 현재 비밀번호 검증 요청
    try {
      const verifyResponse = await fetch(
        `http://${API_SERVER}/api/member/verifyPassword`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            token: sessionStorage.getItem('token'),
          },
          body: JSON.stringify({
            id: userId,
            currentPassword: formData.currentPassword,
          }),
        }
      );

      const verifyResult = await verifyResponse.json();
      if (!verifyResponse.ok || !verifyResult.isValid) {
        Toast.fire({
          icon: 'error',
          title: '현재 비밀번호가 일치하지 않습니다',
        });
        return;
      }
    } catch (error) {
      console.error('비밀번호 검증 오류:', error);
      Toast.fire({
        icon: 'error',
        title: '현재 비밀번호 검증에 실패했습니다',
      });
      return;
    }

    // 🔹 새 비밀번호 유효성 검사
    if (formData.newPassword.length < 8) {
      Toast.fire({
        icon: 'error',
        title: '새 비밀번호는 최소 8자 이상이어야 합니다',
      });
      return;
    }
    if (formData.newPassword !== formData.confirmPassword) {
      Toast.fire({
        icon: 'error',
        title: '새 비밀번호와 비밀번호 확인이 일치하지 않습니다',
      });
      return;
    }

    // 🔹 비밀번호 변경 요청
    try {
      const response = await fetch(
        `http://${API_SERVER}/api/member/changePassword`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            token: sessionStorage.getItem('token'),
          },
          body: JSON.stringify({
            id: userId,
            currentPassword: formData.currentPassword,
            newPassword: formData.newPassword,
            confirmPassword: formData.confirmPassword,
          }),
        }
      );

      const result = await response.text();
      if (response.ok) {
        sessionStorage.removeItem('token');
        Alert({
          icon: 'success',
          title: '비밀번호 변경 성공',
          text: '로그인 페이지로 이동합니다',
        }).then((result) => {
          if (result.isConfirmed) {
            navigate('/member/login');
          }
        });
      } else {
        setErrorMessage(result);
        setIsErrorModalOpen(true);
      }
    } catch (error) {
      console.error('비밀번호 변경 오류:', error);
      Toast.fire({
        icon: 'error',
        title: '비밀번호 변경에 실패하였습니다.',
      });
    }
  };

  return (
    <Container>
      <FormWrapper>
        <Title>비밀번호 변경</Title>
        <form onSubmit={(e) => e.preventDefault()}>
          <InputWrapper>
            <Input
              type="password"
              name="currentPassword"
              placeholder="현재 비밀번호"
              value={formData.currentPassword}
              onChange={handleChange}
              required
            />
          </InputWrapper>

          <InputWrapper>
            <Input
              type="password"
              name="newPassword"
              placeholder="새 비밀번호"
              value={formData.newPassword}
              onChange={handleChange}
              required
            />
            {validation.newPassword && (
              <Message valid={validation.newPassword.startsWith('✅')}>
                {validation.newPassword}
              </Message>
            )}
          </InputWrapper>

          <InputWrapper>
            <Input
              type="password"
              name="confirmPassword"
              placeholder="비밀번호 확인"
              value={formData.confirmPassword}
              onChange={handleChange}
              required
            />
            {validation.confirmPassword && (
              <Message valid={validation.confirmPassword.startsWith('✅')}>
                {validation.confirmPassword}
              </Message>
            )}
          </InputWrapper>

          <ButtonContainer>
            <Button1 to="/member/mypage" w="45%" r="3px">
              이전
            </Button1>
            <ButtonS onClick={handlePasswordChange} w="45%" r="3px">
              확인
            </ButtonS>
          </ButtonContainer>
        </form>
      </FormWrapper>

      {isErrorModalOpen && (
        <NoticeModal
          title="비밀번호 변경 실패"
          message={errorMessage}
          onClose={() => setIsErrorModalOpen(false)}
        />
      )}
    </Container>
  );
};

export default ChangePassword;
