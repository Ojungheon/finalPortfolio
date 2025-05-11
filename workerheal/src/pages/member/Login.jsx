import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { setMember } from '../../redux/MemberSlice';
import styled from 'styled-components';
import ButtonS from '../../components/ButtonS';
import { Link } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { jwtDecode } from 'jwt-decode';
import FindModal from '../../components/user/FindModal';
import { Alert, Toast } from '../../utils/toast';

const API_SERVER = process.env.REACT_APP_SERVER_ROOT;

const FullContainer = styled.div`
  display: flex;
  height: 866px;
  justify-content: center; // 수평 가운데 정렬
  align-items: center; // 수직 가운데 정렬
`;

// 로그인 컨테이너 스타일
const LoginContainer = styled.div`
  display: flex;
  width: 400px;
  padding: 40px;
  flex-direction: column;
  border: 1px solid #ccc;
  position: flex;
`;

// 제목 스타일
const Title = styled.h1`
  font-size: 28px;
  font-weight: bold;
  color: #241a50;
  margin-bottom: 5px;
  text-align: center;
`;

// 서브타이틀 스타일
const Subtitle = styled.p`
  font-size: 18px;
  color: gray;
  margin-bottom: 20px;
  text-align: center;
`;

// 입력 필드 스타일
const Input = styled.input`
  width: 95%;
  padding: 12px;
  margin: 10px 0;
  border: none;
  border-bottom: 1px solid #aaa;
  font-size: 16px;
  outline: none;
`;

// 링크 스타일
const Links = styled.div`
  display: flex;
  text-align: center;
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

// 에러 메시지 스타일
const ErrorMessage = styled.p`
  color: red;
  font-size: 14px;
  margin-top: 10px;
`;

const Login = ({ role }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const [isFindModalOpen, setIsFindModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState('findId');
  const token = sessionStorage.getItem('token'); // ✅ 로컬 스토리지에서 JWT 가져오기
  // 로그인 상태 관리
  const [id, setId] = useState('');
  const [pw, setPw] = useState('');
  const [error, setError] = useState('');

  // ✅ 모달 상태 관리
  const [isModalOpen, setIsModalOpen] = useState(false);

  // 🔐 로그인 요청 처리
  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch(`http://${API_SERVER}/api/member/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id, pw }),
      });

      const text = await response.text();
      console.log('서버 응답:', text);

      if (response.ok) {
        sessionStorage.setItem('token', text);
        let decoded = jwtDecode(text);
        console.log('디코딩된 JWT:', decoded);

        // Redux 상태에 저장할 데이터
        const memberData = {
          no: decoded.no,
          id: decoded.id,
          name: decoded.name,
          nick: decoded.nick,
          role: decoded.role,
          phone: decoded.phone || '미입력',
          jobNo: decoded.jobNo || '미입력',
          company: decoded.company || '미입력',
          createdAt: decoded.createdAt || '미입력',
          points: decoded.points || 0,
        };

        dispatch(setMember(memberData));

        // ✅ 로그인 성공 시 모달 표시

        Alert({
          icon: 'success',
          title: '로그인 성공',
          text: '메인페이지로 이동합니다.',
        }).then((result) => {
          if (result.isConfirmed) {
            navigate('/member/mypage');
          }
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
    <FullContainer>
      <LoginContainer>
        <Title>WORKERHEAL</Title>
        <Subtitle>{role} 페이지</Subtitle>

        {/* 로그인 입력 폼 */}
        <form onSubmit={handleLogin}>
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

        {/* 에러 메시지 표시 */}
        {error && <ErrorMessage>{error}</ErrorMessage>}

        {/* 회원가입, 아이디 찾기, 비밀번호 찾기 링크 */}
        <Links>
          {role === '회원' && (
            <Link to="/member/join">
              <span>회원가입</span>
            </Link>
          )}
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
        {isFindModalOpen && (
          <FindModal
            mode={modalMode}
            onClose={() => setIsFindModalOpen(false)}
          />
        )}
      </LoginContainer>
    </FullContainer>
  );
};

export default Login;
