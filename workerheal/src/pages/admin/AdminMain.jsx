import React from 'react';
import { Route, Routes } from 'react-router-dom';
import styled from 'styled-components';
import SideBar from '../../common/components/admin/SideBar';
import Header from '../../common/components/admin/Header';

const LayOut = styled.main`
  display: flex;
`;

const AdminMain = () => {
  return (
    <>
      <Header />
      <LayOut>
        <SideBar />
        <Routes>
          <Route path="/package/list" element={<h1>패키지 목록</h1>} />
          <Route path="/package/enroll" element={<h1>패키지 등록</h1>} />
          <Route path="/office/list" element={<h1>오피스 관리</h1>} />
          <Route path="/lodging/list" element={<h1>숙소 관리</h1>} />
          <Route path="/tour/list" element={<h1>관광지 목록</h1>} />
          <Route path="/tour/enroll" element={<h1>관광지 등록</h1>} />
          <Route path="/member/list" element={<h1>회원 목록</h1>} />
          <Route path="/member/reservation" element={<h1>예약내역 조회</h1>} />
          <Route path="/host/list" element={<h1>호스트 목록</h1>} />
          <Route path="/host/enroll" element={<h1>호스트 계정생성</h1>} />
          <Route path="/faq/list" element={<h1>FAQ 목록</h1>} />
          <Route path="/faq/enroll" element={<h1>FAQ 등록</h1>} />
        </Routes>
      </LayOut>
    </>
  );
};

export default AdminMain;
