import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { setMember } from '../../redux/MemberSlice';
import ButtonS from '../../components/ButtonS';
import { Alert, Toast } from '../../utils/toast';

const API_SERVER = process.env.REACT_APP_SERVER_ROOT;

// ✅ 페이지 컨테이너
const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 800px;
  font-family: 'Arial', sans-serif;
`;

// ✅ 폼 컨테이너
const FormWrapper = styled.div`
  width: 350px;
  padding: 20px;
  text-align: center;
`;

// ✅ 입력 필드 스타일
const InputWrapper = styled.div`
  position: relative;
  width: 100%;
`;

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

// ✅ 유효성 검사 메시지
const Message = styled.span`
  position: absolute;
  right: 5px;
  top: 50%;
  transform: translateY(-50%);
  font-size: 12px;
  font-weight: bold;
  color: ${(props) => (props.valid ? 'green' : 'red')};
`;

// ✅ 드롭다운 스타일
const DropdownContainer = styled.div`
  position: relative;
  width: 100%;
`;

const DropdownButton = styled.div`
  width: 100%;
  padding: 10px;
  border: none;
  border-bottom: 2px solid #ccc;
  font-size: 16px;
  background: transparent;
  cursor: pointer;
  display: flex;
  justify-content: space-between;
  align-items: center;

  &:focus {
    border-bottom: 2px solid #ffa500;
  }
`;

const DropdownMenu = styled.div`
  position: absolute;
  width: 106%;
  background: white;
  border-radius: 3px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  display: ${({ isOpen }) => (isOpen ? 'block' : 'none')};
  z-index: 10;
`;

const DropdownItem = styled.div`
  padding: 12px 15px;
  font-size: 1em;
  font-weight: bold;
  color: #333;
  cursor: pointer;
  &:hover {
    color: white;
    background: #9257ff;
  }
`;
// ✅ 직업 번호 변환 함수
const jobMap = {
  1: 'IT',
  2: '경영',
  3: '의료',
  4: '사무',
  5: '건설',
  6: '교육',
  7: '디자인',
  8: '금융',
  9: '법률',
  10: '문화',
  11: '서비스',
  12: '유통',
  13: '생산',
  14: '스포츠',
  15: '공공',
  16: '기타',
};

const getJobNo = (jobName) =>
  Object.keys(jobMap).find((key) => jobMap[key] === jobName) || null;
const getJobName = (jobNo) => jobMap[jobNo] || '미정';

const Edit = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const member = useSelector((state) => state.member.member);

  // ✅ 폼 상태 관리
  const [formData, setFormData] = useState({
    name: '',
    nickname: '',
    phone: '',
    job: '',
    company: '',
  });

  useEffect(() => {
    if (member) {
      setFormData({
        name: member.name || '',
        nickname: member.nick || '',
        phone: member.phone || '',
        job: getJobName(member.jobNo) || '',
        company: member.company || '',
      });
    }
  }, [member]);

  const [validation, setValidation] = useState({ phone: null });
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isError, setIsError] = useState(false);

  // ✅ 입력값 변경 핸들러
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });

    if (name === 'phone') {
      const phoneRegex = /^[0-9]{11}$/;
      setValidation({
        ...validation,
        phone: phoneRegex.test(value)
          ? '✅ 올바른 연락처'
          : '❌ 11자리 숫자 입력 필요',
      });
    }
  };

  // ✅ 직업 선택 핸들러
  const handleJobSelect = (job) => {
    setFormData({ ...formData, job });
    setIsDropdownOpen(false);
  };

  // ✅ 개인정보 수정 요청
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (Object.values(validation).some((msg) => msg.startsWith('❌'))) {
      setIsError(true);
      return;
    }

    try {
      const token = sessionStorage.getItem('token');
      const response = await fetch(`http://${API_SERVER}/api/member/update`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          token: sessionStorage.getItem('token'),
        },
        body: JSON.stringify({
          id: member.id,
          name: formData.name,
          nick: formData.nickname,
          phone: formData.phone,
          jobNo: getJobNo(formData.job),
          company: formData.company,
        }),
      });

      if (response.ok) {
        const updatedMember = {
          ...member,
          name: formData.name,
          nick: formData.nickname,
          phone: formData.phone,
          jobNo: getJobNo(formData.job),
          company: formData.company,
        };

        dispatch(setMember(updatedMember)); // ✅ Redux 상태 즉시 업데이트
        setFormData(updatedMember); // ✅ 로컬 상태도 즉시 반영

        Alert({
          icon: 'success',
          title: '개인정보 수정 성공',
          text: '개인정보 조회로 이동합니다.',
        }).then(() => {
          navigate('/member/mypage');
        });
      } else {
        Toast.fire({
          icon: 'error',
          title: '입력값을 확인해 주세요',
        });
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
        <h2>개인정보 수정</h2>
        <form onSubmit={handleSubmit}>
          <InputWrapper>
            <Input
              type="text"
              name="name"
              placeholder="이름"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </InputWrapper>

          <InputWrapper>
            <Input
              type="text"
              name="nickname"
              placeholder="닉네임"
              value={formData.nickname}
              onChange={handleChange}
              required
            />
          </InputWrapper>

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

          <DropdownContainer>
            <DropdownButton onClick={() => setIsDropdownOpen(!isDropdownOpen)}>
              {formData.job || '직업 선택'}
            </DropdownButton>
            <DropdownMenu isOpen={isDropdownOpen}>
              {Object.values(jobMap).map((job) => (
                <DropdownItem key={job} onClick={() => handleJobSelect(job)}>
                  {job}
                </DropdownItem>
              ))}
            </DropdownMenu>
          </DropdownContainer>

          <InputWrapper>
            <Input
              type="text"
              name="company"
              placeholder="회사 (선택 사항)"
              value={formData.company}
              onChange={handleChange}
            />
          </InputWrapper>

          <ButtonS w="370px" r="3px">
            수정 완료
          </ButtonS>
        </form>
      </FormWrapper>

      {isError &&
        Toast.fire({
          icon: 'error',
          title: '입력값을 확인해 주세요',
        })}
    </Container>
  );
};

export default Edit;
