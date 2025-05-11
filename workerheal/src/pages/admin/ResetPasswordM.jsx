import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { useDispatch, useSelector } from 'react-redux';
import { clearManagerId, setManagerId } from '../../redux/managerSlice';
import { Toast, Alert } from '../../utils/toast';

const API_SERVER = process.env.REACT_APP_SERVER_ROOT;

// ✅ 스타일 정의
const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
  font-family: 'Arial', sans-serif;
`;

const FormWrapper = styled.div`
  width: 350px;
  padding: 50px;
  text-align: center;
  border: 1px solid #ccc;
  display: grid;
  justify-content: center;
`;

const Title = styled.h2`
  font-size: 24px;
  font-weight: bold;
  margin-bottom: 10px;
`;

const InputWrapper = styled.div`
  position: relative;
  width: 100%;
`;

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

const Message = styled.span`
  position: absolute;
  right: 5px;
  top: 50%;
  transform: translateY(-50%);
  font-size: 12px;
  font-weight: bold;
  color: ${(props) => (props.valid ? 'green' : 'red')};
`;

const SubmitButton = styled.input`
  width: 370px;
  height: 40px;
  background-color: orange;
  border: none;
  border-radius: 3px;
  font-size: 1.1em;
  font-weight: bold;
  color: white;
  cursor: pointer;
  transition: all 0.3s ease-in-out;

  &:hover {
    opacity: 0.8;
  }
`;

const ResetPasswordM = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const managerId = useSelector((state) => state.manager.managerId); // ✅ Redux에서 managerId 가져오기

  // ✅ formData와 validation 상태 추가
  const [formData, setFormData] = useState({
    password: '',
    confirmPassword: '',
  });

  const [validation, setValidation] = useState({
    password: null,
    confirmPassword: null,
  });

  useEffect(() => {
    const storedManagerId = localStorage.getItem('managerId');
    console.log('📌 localStorage에서 불러온 managerId:', storedManagerId);
    console.log('📌 Redux의 managerId 상태:', managerId);

    if (!managerId && storedManagerId) {
      dispatch(setManagerId(storedManagerId));
    }
  }, [managerId, dispatch]);

  // ✅ 입력값 변경 핸들러
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });

    switch (name) {
      case 'password':
        setValidation({
          ...validation,
          password:
            value.length >= 8 ? '✅ 사용 가능' : '❌ 최소 8자 이상 입력하세요.',
        });
        break;

      case 'confirmPassword':
        setValidation({
          ...validation,
          confirmPassword:
            value === formData.password
              ? '✅ 비밀번호 일치'
              : '❌ 비밀번호가 다릅니다.',
        });
        break;

      default:
        break;
    }
  };

  // ✅ 비밀번호 변경 요청
  const handleSubmit = async (e) => {
    e.preventDefault();

    console.log('🔍 Redux에서 가져온 managerId:', managerId);
    console.log('🔑 입력된 비밀번호:', formData.password);

    if (!managerId) {
      Toast.fire({
        icon: 'error',
        title: '입력값을 확인해 주세요',
      });
      return;
    }

    // 🔹 새 비밀번호 유효성 검사
    if (formData.password.length < 8) {
      Toast.fire({
        icon: 'error',
        title: '새 비밀번호는 최소 8자 이상이어야 합니다',
      });
      return;
    }
    if (formData.password !== formData.confirmPassword) {
      Toast.fire({
        icon: 'error',
        title: '새 비밀번호와 비밀번호 확인이 일치하지 않습니다',
      });
      return;
    }

    try {
      const response = await fetch(`http://${API_SERVER}/api/manager/resetPw`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: managerId, // ✅ Redux에서 가져온 managerId 사용
          newPassword: formData.password,
        }),
      });

      if (response.ok) {
        Alert({
          icon: 'success',
          title: '비밀번호 변경 성공',
          text: '로그인 페이지로 이동합니다',
        }).then((result) => {
          if (result.isConfirmed) {
            dispatch(clearManagerId()); // ✅ Redux 상태 초기화
            sessionStorage.removeItem('managerId'); // ✅ localStorage에서도 제거
            navigate('/manager/login');
          }
        });
      } else {
        Toast.fire({
          icon: 'error',
          title: '비밀번호 변경 실패',
        });
      }
    } catch (error) {
      Toast.fire({
        icon: 'error',
        title: '서버 오류가 발생했습니다',
      });
    }
  };

  return (
    <Container>
      <FormWrapper>
        <Title>비밀번호 변경</Title>
        <form onSubmit={handleSubmit}>
          <InputWrapper>
            <Input
              type="password"
              name="password"
              placeholder="새 비밀번호"
              value={formData.password}
              onChange={handleChange}
              required
            />
            {validation.password && (
              <Message valid={validation.password.startsWith('✅')}>
                {validation.password}
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

          <SubmitButton type="submit" value="비밀번호 변경" />
        </form>
      </FormWrapper>
    </Container>
  );
};

export default ResetPasswordM;
