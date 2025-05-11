import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { setMember } from '../../redux/MemberSlice';
import styled from 'styled-components';
import ButtonS from '../../components/ButtonS';
import { useDispatch, useSelector } from 'react-redux';
import { jwtDecode } from 'jwt-decode';
import FindModalHost from '../../components/host/FindModalHost';
import { Toast, Alert } from '../../utils/toast';
import { setHost } from '../../redux/hostSlice';

const API_SERVER = process.env.REACT_APP_SERVER_ROOT;

const FullContainer = styled.div`
  display: flex;
  height: 866px;
  justify-content: center; // 수평 가운데 정렬
  align-items: center; // 수직 가운데 정렬
`;

// ✅ 호스트 로그인 컨테이너 스타일
const HostLoginContainer = styled.div`
  width: 400px;
  padding: 40px;
  border: 1px solid #ccc;
  text-align: center;
  position: absolute;
  top: 35%;
`;

// ✅ 제목 스타일
const Title = styled.h1`
  font-size: 28px;
  font-weight: bold;
  color: #241a50;
  margin-bottom: 5px;
`;

// ✅ 서브타이틀 스타일
const Subtitle = styled.p`
  font-size: 18px;
  color: gray;
  margin-bottom: 20px;
`;

// ✅ 입력 필드 스타일
const Input = styled.input`
  width: 95%;
  padding: 12px;
  margin: 10px 0;
  border: none;
  border-bottom: 1px solid #aaa;
  font-size: 16px;
  outline: none;
`;

// ✅ 링크 스타일
const Links = styled.div`
  display: flex;
  justify-content: space-between;
  margin-top: 15px;
  font-size: 14px;
  color: gray;
  cursor: pointer;
  a {
    text-decoration: none;
    color: inherit;
  }
`;

// ✅ 에러 메시지 스타일
const ErrorMessage = styled.p`
  color: red;
  font-size: 14px;
  margin-top: 10px;
`;

const HostLogin = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const hostData = useSelector((state) => state.host);
  const [isFindModalOpen, setIsFindModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState('findId');

  // ✅ 로그인 상태 관리
  const [id, setId] = useState('');
  const [pw, setPw] = useState('');
  const [error, setError] = useState('');

  // ✅ 모달 상태 관리
  const [isModalOpen, setIsModalOpen] = useState(false);

  // 🔐 호스트 로그인 요청 처리
  const handleHostLogin = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch(`http://${API_SERVER}/api/host/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, pw }),
      });

      const text = await response.text();
      console.log('서버 응답:', text);

      if (response.ok) {
        localStorage.setItem('token', text);
        let decoded = jwtDecode(text);
        console.log('디코딩된 JWT:', decoded);

        // ✅ Redux 상태에 저장할 데이터
        const hostData = {
          no: decoded.no,
          id: decoded.id,
          name: decoded.name,
          role: decoded.role, // 🔹 호스트 역할 구분
          phone: decoded.phone || '미입력',
          pw: decoded.pw,
        };

        dispatch(setHost(hostData));
        localStorage.setItem('hostData', JSON.stringify(hostData));
        console.log(hostData);

        // ✅ 로그인 성공 시 모달 표시
        setIsModalOpen(true);
      } else {
        Toast.fire({
          icon: 'error',
          title: '입력값을 확인해 주세요',
        });
      }
    } catch (error) {
      Toast.fire({
        icon: 'error',
        title: '서버 에러 : 추후 다시 이용해 주시길 바랍니다',
      });
    }
  };

  return (
    <FullContainer>
      <HostLoginContainer>
        <Title>WORKERHEAL</Title>
        <Subtitle>호스트 로그인</Subtitle>

        {/* 로그인 입력 폼 */}
        <form onSubmit={handleHostLogin}>
          <Input
            type="text"
            placeholder="아이디"
            value={id}
            onChange={(e) => setId(e.target.value)}
            required
          />
          <Input
            type="password"
            placeholder="비밀번호"
            value={pw}
            onChange={(e) => setPw(e.target.value)}
            required
          />
          <ButtonS w="405px" h="40px" r="2px" f="1.2em">
            로그인
          </ButtonS>
        </form>

        {/* 아이디 찾기 & 비밀번호 찾기 링크 */}
        <Links>
          <span
            onClick={() => {
              setModalMode('findId');
              setIsFindModalOpen(true);
            }}
          >
            아이디 찾기
          </span>
          <span
            onClick={() => {
              setModalMode('findPw');
              setIsFindModalOpen(true);
            }}
          >
            비밀번호 찾기
          </span>
        </Links>

        {/* ✅ 로그인 성공 모달 */}
        {isModalOpen &&
          Alert({
            icon: 'success',
            title: '로그인 성공',
            text: '호스트 페이지로 이동합니다',
          }).then((result) => {
            if (result.isConfirmed) {
              navigate('/host/workplace/list');
            }
          })}

        {isFindModalOpen && (
          <FindModalHost
            mode={modalMode}
            onClose={() => setIsFindModalOpen(false)}
          />
        )}
      </HostLoginContainer>
    </FullContainer>
  );
};

export default HostLogin;
