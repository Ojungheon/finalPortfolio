import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { Link, useNavigate } from 'react-router-dom';
import ButtonS from '../../components/ButtonS';
import { Alert, Toast } from '../../utils/toast';

const API_SERVER = process.env.REACT_APP_SERVER_ROOT;

// 전체 컨테이너
const Container = styled.div`
  display: flex;
  width: 100%;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
  font-family: 'Arial', sans-serif;
`;

// 폼 박스
const FormWrapper = styled.div`
  width: 370px;
  padding: 20px;
  text-align: center;
`;

// 제목 스타일
const Title = styled.h2`
  font-size: 24px;
  font-weight: bold;
  margin-bottom: 10px;
`;

// 입력 필드 컨테이너
const InputWrapper = styled.div`
  position: relative;
  width: 100%;
`;

// 입력 필드 스타일
const Input = styled.input`
  width: 100%;
  padding: 10px;
  margin: 8px 0;
  border: none;
  border-bottom: 2px solid #ccc;
  outline: none;
  font-size: 16px;
  &:focus {
    border-bottom: 2px solid #ffa500;
  }
`;

// 유효성 검사 메시지 스타일
const Message = styled.span`
  position: absolute;
  right: 5px;
  top: 50%;
  transform: translateY(-50%);
  font-size: 12px;
  font-weight: bold;
  color: ${(props) => (props.valid ? 'green' : 'red')};
`;

// 직업 선택 드롭다운 스타일
const Select = styled.select`
  width: 390px;
  padding: 10px;
  margin: 8px 0;
  border: none;
  border-bottom: 2px solid #ccc;
  font-size: 16px;
  cursor: pointer;
  transition: all 0.3s ease-in-out;
  &:focus {
    border: 1px solid #ffa500;
    background: #fff;
  }
`;

const Join = () => {
  const navigate = useNavigate();

  const jobs = [
    { id: 1, name: 'IT' },
    { id: 2, name: '경영' },
    { id: 3, name: '의료' },
    { id: 4, name: '사무' },
    { id: 5, name: '건설' },
    { id: 6, name: '교육' },
    { id: 7, name: '디자인' },
    { id: 8, name: '금융' },
    { id: 9, name: '법률' },
    { id: 10, name: '문화' },
    { id: 11, name: '서비스' },
    { id: 12, name: '유통' },
    { id: 13, name: '생산' },
    { id: 14, name: '스포츠' },
    { id: 15, name: '공공' },
    { id: 16, name: '기타' },
  ];

  // **📌 폼 데이터 상태**
  const [formData, setFormData] = useState({
    id: '',
    pw: '',
    confirmPassword: '',
    name: '',
    nickname: '',
    phone: '',
    company: '',
    job: '',
  });

  // **📌 유효성 검사 상태**
  const [validation, setValidation] = useState({
    id: '',
    pw: '',
    confirmPassword: '',
    phone: '',
  });

  // **📌 입력값 변경 이벤트**
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // **📌 유효성 검사 (useEffect 활용)**
  useEffect(() => {
    const validateField = (name, value) => {
      let message = '';

      switch (name) {
        case 'id':
          const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
          message = emailRegex.test(value)
            ? '✅ 올바른 이메일'
            : '❌ 이메일 형식이 아닙니다.';
          break;
        case 'pw':
          message =
            value.length >= 8 ? '✅ 사용 가능' : '❌ 최소 8자 이상 입력하세요.';
          break;
        case 'confirmPassword':
          message =
            value === formData.pw
              ? '✅ 비밀번호 일치'
              : '❌ 비밀번호가 다릅니다.';
          break;
        case 'phone':
          const phoneRegex = /^[0-9]{11}$/;
          message = phoneRegex.test(value)
            ? '✅ 올바른 연락처'
            : '❌ 11자리 숫자만 입력해주세요.';
          break;
        default:
          break;
      }

      setValidation((prev) => ({
        ...prev,
        [name]: message,
      }));
    };

    Object.keys(formData).forEach((key) => {
      if (formData[key]) validateField(key, formData[key]);
    });
  }, [formData]);

  // **📌 폼 제출 이벤트**
  // **📌 폼 제출 이벤트**
  const handleSubmit = async (e) => {
    e.preventDefault();

    // ❌ 유효성 검사 실패 여부 확인
    if (
      !validation.id.startsWith('✅') ||
      !validation.pw.startsWith('✅') ||
      !validation.confirmPassword.startsWith('✅') ||
      !validation.phone.startsWith('✅')
    ) {
      Toast.fire({
        icon: 'error',
        title: '입력값을 확인해 주세요',
      });
      return; // ❌ `fetch` 실행하지 않음
    }

    try {
      const response = await fetch(`http://${API_SERVER}/api/member/join`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id: formData.id,
          pw: formData.pw,
          name: formData.name,
          nick: formData.nickname || '',
          phone: formData.phone,
          company: formData.company || '',
          jobNo: formData.job ? parseInt(formData.job, 10) : 0, // NULL이면 기본값 0
        }),
      });

      const text = await response.text(); // 응답을 텍스트로 가져옴

      let result;
      try {
        result = JSON.parse(text); // JSON 변환 시도
      } catch (error) {
        result = text; // JSON 변환 실패 시, 원본 텍스트 저장
      }

      if (response.ok) {
        Alert({
          icon: 'success',
          title: '회원가입 성공',
          text: '로그인 페이지로 이동합니다.',
        }).then((result) => {
          if (result.isConfirmed) {
            navigate('/member/login');
          }
        });
      } else {
        alert(`회원가입 실패: ${result.message || result}`);
      }
    } catch (error) {
      Toast.fire({
        icon: 'error',
        title: '입력값을 확인해 주세요',
      });
    }
  };

  return (
    <Container>
      <FormWrapper>
        <Title>회원가입</Title>
        <form onSubmit={handleSubmit}>
          {['id', 'pw', 'confirmPassword', 'phone'].map((field) => (
            <InputWrapper key={field}>
              <Input
                type={
                  field === 'pw' || field === 'confirmPassword'
                    ? 'password'
                    : 'text'
                }
                name={field}
                placeholder={
                  field === 'id'
                    ? '아이디 (이메일)'
                    : field === 'pw'
                    ? '비밀번호'
                    : field === 'confirmPassword'
                    ? '비밀번호 확인'
                    : '연락처 (숫자만 입력)'
                }
                onChange={handleInputChange}
              />
              {validation[field] && (
                <Message valid={validation[field].startsWith('✅')}>
                  {validation[field]}
                </Message>
              )}
            </InputWrapper>
          ))}

          <Input
            type="text"
            name="name"
            placeholder="이름"
            onChange={handleInputChange}
          />
          <Input
            type="text"
            name="nickname"
            placeholder="닉네임"
            onChange={handleInputChange}
          />
          <Input
            type="text"
            name="company"
            placeholder="회사 (선택 사항)"
            onChange={handleInputChange}
          />

          <Select name="job" value={formData.job} onChange={handleInputChange}>
            <option value="">직업 선택</option>
            {jobs.map((job) => (
              <option key={job.id} value={job.id}>
                {job.name}
              </option>
            ))}
          </Select>
          <ButtonS type="submit" w="390px" r="3px">
            가입
          </ButtonS>
        </form>
      </FormWrapper>
    </Container>
  );
};

export default Join;
