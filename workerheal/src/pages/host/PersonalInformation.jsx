import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { useSelector } from 'react-redux';
import PersonIcon from '@mui/icons-material/Person';
import PhoneIcon from '@mui/icons-material/Phone';
import VerifiedUserIcon from '@mui/icons-material/VerifiedUser';
import LockIcon from '@mui/icons-material/Lock';
import Button1 from '../../components/Button1';
import ButtonS from '../../components/ButtonS';
import { Toast } from '../../utils/toast';

const API_SERVER = process.env.REACT_APP_SERVER_ROOT;

const Container = styled.div`
  width: 100%;
  height: 100%;
  max-width: 1920px;
  max-height: 892px;
  margin: 0 auto;
`;

const Title = styled.div`
  font-size: 1.5rem;
  font-weight: bold;
  text-align: center;
  margin: 40px;
  border-bottom: 2px solid #ffaa0c;
  margin-left: 260px;
  padding-bottom: 10px;
  display: inline-block;
`;

const InfoContainer = styled.div`
  width: 60%;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  gap: 50px;
`;

const Row = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: stretch;
  gap: 20px;
  width: 90%;
  height: 100%;
`;

const Field = styled.div`
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 140px;
  gap: 10px;
  position: relative;
`;

const IconWrapper = styled.div`
  position: absolute;
  left: 10px;
  font-size: 1.2rem;
`;

const Input = styled.input`
  flex: 1;
  font-size: 1rem;
  border: none;
  outline: none;
  border-bottom: 2px solid #ffaa0c;
  margin-left: 20px;
  display: table;
  text-indent: 20px;
`;

const EditButton = styled(Button1).attrs({ as: 'button' })`
  background-color: white;
  color: #8041ff;
  border: none;
  font-weight: bold;
  cursor: pointer;
  transition: 0.3s ease;
`;

const ButtonContainer = styled.div`
  display: flex;
  justify-content: end;
  margin-top: 140px;
  margin-right: 380px;
`;

const PersonalInformation = () => {
  const hostData = useSelector((state) => state.host);
  const token = localStorage.getItem('token');

  console.log('hostData :', hostData.host);
  console.log('저장된 토큰:', token);

  const [userInfo, setUserInfo] = useState({
    id: '',
    phone: '',
    pw: '',
    confirmPw: '',
  });

  const [isEditing, setIsEditing] = useState({
    id: false,
    phone: false,
    pw: false,
  });

  // ✅ 서버에서 데이터 가져오기
  useEffect(() => {
    if (hostData.host?.no) {
      fetch(`http://${API_SERVER}/api/host/detail?no=${hostData.host.no}`, {
        headers: {
          'Content-Type': 'application/json',
          token: `${token}`,
        },
      })
        .then((res) => res.json())
        .then((data) => {
          console.log('서버에서 받아온 데이터:', data);

          const hostInfo = Array.isArray(data) ? data[0] : data;
          setUserInfo({
            id: hostInfo?.id || '',
            phone: hostInfo?.phone || '',
            pw: '',
          });
        })
        .catch((error) => console.error('Error fetching user info:', error));
    }
  }, [hostData.host.no, token]);

  // ✅ 입력값 변경 핸들러
  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserInfo((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // ✅ 수정 버튼 클릭 시 readonly 해제
  const handleEdit = (field) => {
    setIsEditing((prev) => ({ ...prev, [field]: !prev[field] }));
  };

  // ✅ 저장 버튼 클릭 시 서버로 업데이트 요청
  const handleSave = () => {
    if (userInfo.pw !== userInfo.confirmPw) {
      Toast.fire({
        icon: 'error',
        title: '비밀번호가 일치하지 않습니다.',
      });
      return;
    }

    console.log(hostData.host.no);
    fetch(`http://${API_SERVER}/api/host/resetPw`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        token: `${token}`,
      },

      body: JSON.stringify({
        no: hostData.host.no,
        id: userInfo.id,
        phone: userInfo.phone,
        newPassword: userInfo.pw,
      }),
    })
      .then((res) => res.text()) // ✅ 응답을 JSON이 아닌 텍스트로 받아오기
      .then((text) => {
        console.log('서버 응답:', text);

        // JSON 응답인지 확인 후 JSON으로 파싱, 아니라면 그대로 사용
        let responseData;
        try {
          responseData = JSON.parse(text);
        } catch (error) {
          responseData = text;
        }

        Toast.fire({
          icon: 'success',
          title: '비밀번호가 성공적으로 변경되었습니다.',
        });

        setIsEditing({ id: false, phone: false, pw: false });
      })
      .catch((error) => console.error('Error updating user info:', error));
  };

  return (
    <Container>
      <Title>개인정보 수정</Title>
      <InfoContainer>
        <Row>
          <Field>
            <IconWrapper>
              <PersonIcon />
            </IconWrapper>
            <Input
              type="email"
              name="id"
              value={userInfo.id}
              onChange={handleChange}
              readOnly={!isEditing.id}
            />
            <EditButton onClick={() => handleEdit('id')}>
              {isEditing.id ? '저장' : '수정'}
            </EditButton>
          </Field>

          <Field>
            <IconWrapper>
              <PhoneIcon />
            </IconWrapper>
            <Input
              type="text"
              name="phone"
              value={userInfo.phone}
              onChange={handleChange}
              readOnly={!isEditing.phone}
            />
            <EditButton onClick={() => handleEdit('phone')}>
              {isEditing.phone ? '저장' : '수정'}
            </EditButton>
          </Field>
        </Row>
        <Row>
          <Field>
            <IconWrapper>
              <LockIcon />
            </IconWrapper>
            <Input
              type="password"
              name="pw"
              value={userInfo.pw}
              onChange={handleChange}
              readOnly={!isEditing.pw}
              placeholder="비밀번호"
            />
            <EditButton onClick={() => handleEdit('pw')}>
              {isEditing.pw ? '저장' : '수정'}
            </EditButton>
          </Field>

          <Field>
            <IconWrapper>
              <VerifiedUserIcon />
            </IconWrapper>
            <Input
              type="password"
              name="confirmPw"
              value={userInfo.confirmPw}
              onChange={handleChange}
              placeholder="비밀번호 체크"
            />
          </Field>
        </Row>
      </InfoContainer>

      <ButtonContainer>
        <ButtonS onClick={handleSave}>확인</ButtonS>
      </ButtonContainer>
    </Container>
  );
};

export default PersonalInformation;
