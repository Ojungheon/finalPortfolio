import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import ButtonS from '../../components/ButtonS';
import { useDispatch, useSelector } from 'react-redux';
import { clearUserId } from '../../redux/userSlice';
import { setUserId } from '../../redux/userSlice';
import { Toast, Alert } from '../../utils/toast';

const API_SERVER = process.env.REACT_APP_SERVER_ROOT;

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
  font-family: 'Arial', sans-serif;
`;

const StyledInput = styled.input`
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

const ResetPassword = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const userId = useSelector((state) => state.user.userId);

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
    const storedUserId = sessionStorage.getItem('userId');
    console.log('📌 sessionStorage에서 불러온 userId:', storedUserId);
    console.log('📌 Redux의 userId 상태:', userId);

    if (!userId && storedUserId) {
      dispatch(setUserId(storedUserId));
    }
  }, [userId, dispatch]);

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

  const handleSubmit = async (e) => {
    e.preventDefault();

    console.log('핸들서브밋발생');
    console.log('🔍 Redux에서 가져온 userId:', userId); // 👉 디버깅 코드 추가
    console.log('🔑 입력된 비밀번호:', formData.password);

    if (!userId) {
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
      const response = await fetch(`http://${API_SERVER}/api/member/resetPw`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: userId,
          newPassword: formData.password,
        }),
      });

      if (response.ok) {
        Alert({
          icon: 'success',
          title: ' 비밀번호 변경 성공',
          text: '로그인 페이지로 이동합니다',
        }).then((result) => {
          if (result.isConfirmed) {
            navigate('/member/login');
          }
        });
        dispatch(clearUserId());
        sessionStorage.removeItem('userId'); // 🚀 sessionStorage에서도 제거
        navigate('/member/login');
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

          <StyledInput type="submit" value="비밀번호 변경" />
        </form>
      </FormWrapper>
    </Container>
  );
};

export default ResetPassword;
