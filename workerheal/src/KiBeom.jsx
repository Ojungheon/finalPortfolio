import React from 'react';
import { Routes, Route, Link } from 'react-router-dom';
import Login from './pages/member/Login';
import FloatingButtons from './components/FloatingButton';
import styled from 'styled-components';
import Header from './common/components/user/Header';
import Join from './pages/member/Join';
import ResetPassword from './pages/member/ResetPassword';
import Mypage from './pages/member/Mypage';
import Edit from './pages/member/Edit';
import ChangePassword from './pages/member/ChangePassword';
import DeleteAccount from './pages/member/DeleteAcount';
import Points from './pages/member/Points';
import Saved from './pages/member/Saved';
import Reservated from './pages/member/Reservated';
import ReservatedDetail from './pages/member/ReservatedDetail';

const ScrollContainer = styled.div`
  height: 100vh;
  width: 100vw; 
  display: grid;
  grid-template-columns: 230px 1460px 230px;
`;

const MainContent = styled.div`
  grid-column: 2; /* 가운데 영역에 위치 */
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;

const KiBeom = () => {
  return (
    <>
      <Header />
      <ScrollContainer>
        <MainContent>
          <Routes>
            <Route path="member/login" element={<Login role={"회원"} />} />
            <Route path="admin/login" element={<Login role={"운영자"} />} />
            <Route path="host/login" element={<Login role={"호스트"} />} />
            <Route path="member/join" element={<Join/>} />
            <Route path="member/mypage" element={<Mypage/>} />
            <Route path="member/mypage/edit" element={<Edit/>} />
            <Route path="member/mypage/points" element={<Points/>} />
            <Route path="member/saved" element={<Saved/>} />
            <Route path="member/reservated" element={<Reservated/>} />
            <Route path="member/reservated/detail/*" element={<ReservatedDetail/>} />
            <Route path="member/mypage/deleteAccount" element={<DeleteAccount/>} />
            <Route path="member/mypage/changepassword" element={<ChangePassword/>} />
            <Route path="member/resetpassword" element={<ResetPassword/>} />
          </Routes>
          <FloatingButtons />
        </MainContent>
      </ScrollContainer>
    </>
  );
};

export default KiBeom;
