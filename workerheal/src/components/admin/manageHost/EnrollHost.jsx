import React, { useState } from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import ButtonS from '../../ButtonS';

const API_SERVER = process.env.REACT_APP_SERVER_ROOT;

//전체 컨테이너 (회원가입 페이지의 중앙 정렬)
const Container = styled.div`
  width: calc(100% - 100px);
  height: 100%;
  display: grid;
  grid-template-columns: 1fr;
  grid-template-rows: 1fr 5fr;
  margin-left: 100px;
  margin-right: 100px;
`;

//회원가입 폼을 감싸는 박스 (고정된 너비 사용)
const FormWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center; /* 가로 중앙 정렬 */
  padding: 20px;
  text-align: center;
`;

//제목 스타일 (회원가입)
const Title = styled.h2`
  width: 162px;
  font-size: 24px;
  font-weight: bold;
  margin-bottom: 10px;
  border-bottom: 4px solid #8041ff;
  & > h2 {
  }
`;

//각 입력 필드를 감싸는 컨테이너 (에러 메시지 위치를 위한 설정)
const InputWrapper = styled.div`
  position: relative;
  width: 100%;
`;

//입력 필드 스타일 (아래 라인 강조)
const Input = styled.input`
  width: 400px;
  margin: 24px 0;
  border: none;
  border-bottom: 2px solid #ccc;
  outline: none;
  font-size: 16px;
  &:focus {
    border-bottom: 2px solid #ffa500;
  }
`;

//입력값 유효성 검사를 위한 메시지 (오른쪽에 표시됨)
const Message = styled.span`
  position: absolute;
  right: 5px;
  top: 50%;
  transform: translateY(-50%);
  font-size: 12px;
  font-weight: bold;
  color: ${(props) => (props.valid ? 'green' : 'red')};
`;

const EnrollHost = () => {
  const navigate = useNavigate();

  //입력 데이터 저장 (useState)
  const [formData, setFormData] = useState({
    id: '',
    name: '',
    phone: '',
  });

  //유효성 검사 결과 저장 (useState)
  const [validation, setValidation] = useState({
    id: null,
    phone: null,
  });

  //입력값이 변경될 때 유효성 검사 실행
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });

    //각 입력 필드별 검증 로직
    switch (name) {
      case 'email':
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        setValidation({
          ...validation,
          email: emailRegex.test(value)
            ? '✅ 올바른 이메일'
            : '❌ 이메일 형식이 아닙니다.',
        });
        break;

      case 'phone':
        const phoneRegex = /^[0-9]+$/;
        if (!phoneRegex.test(value)) {
          setValidation({ ...validation, phone: '❌ 숫자만 입력해주세요.' });
        } else if (value.length !== 11) {
          setValidation({ ...validation, phone: '❌ 11자리 입력 필요' });
        } else {
          setValidation({ ...validation, phone: '✅ 올바른 연락처' });
        }
        break;

      default:
        break;
    }
  };

  //폼 제출 시 실행되는 함수
  const handleSubmit = (e) => {
    e.preventDefault();

    // 필수 입력값 체크
    if (!formData.id || !formData.name || !formData.phone) {
      alert('아이디, 이름, 연락처는 필수 항목입니다.');
      return; // 입력값이 부족하면 서버로 전송하지 않음
    }

    console.log(formData);

    // 서버로 전송
    fetch(`http://${API_SERVER}/api/manager/insertHost`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        token: sessionStorage.getItem('token'),
      },
      body: JSON.stringify(formData),
    })
      .then((response) => {
        console.log(response); // 응답 확인
        if (!response.ok) {
          throw new Error('서버 오류: ' + response.status);
        }
        return response.json();
      })
      .then((data) => {
        console.log(data); // 서버 응답 확인
        if (data.message === '등록 성공') {
          console.log('호스트 등록 성공:', formData);
          alert('호스트 등록이 완료되었습니다!');
          navigate('/manager/host/list');
        } else {
          alert(data.message);
        }
      })
      .catch((error) => {
        alert('서버와의 통신에 문제가 발생했습니다.');
        console.error('Error:', error);
      });
  };

  return (
    <Container>
      <div>
        <Title>호스트 계정생성</Title>
      </div>
      <FormWrapper>
        <form onSubmit={handleSubmit}>
          {/*이메일 입력 */}
          <InputWrapper>
            <Input
              type="email"
              name="id"
              placeholder="아이디 (이메일)"
              value={formData.id}
              onChange={handleChange}
              required
            />
            {validation.email && (
              <Message valid={validation.email.startsWith('✅')}>
                {validation.email}
              </Message>
            )}
          </InputWrapper>

          {/*기본 정보 입력 */}
          <Input
            type="text"
            name="name"
            placeholder="이름"
            value={formData.name}
            onChange={handleChange}
            required
          />

          {/*연락처 입력 */}
          <InputWrapper>
            <Input
              type="tel"
              name="phone"
              placeholder="연락처"
              value={formData.phone}
              onChange={handleChange}
              required
            />
            {validation.phone && (
              <Message valid={validation.phone.startsWith('✅')}>
                {validation.phone}
              </Message>
            )}
          </InputWrapper>

          {/*가입 버튼 */}
          <ButtonS type="submit" w="100%" r="3px">
            가입
          </ButtonS>
        </form>
      </FormWrapper>
    </Container>
  );
};

export default EnrollHost;
