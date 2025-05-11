import React from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';

const SideBar = styled.div`
  width: 100%;
  height: 100%;
  background-color: #d9d9d9;
`;

const Layout = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  padding-left: 40px;

  & > h1 {
    margin-top: 30px;
    padding-top: 0px;
    color: black;
  }
`;

const StyledLink = styled(Link)`
  color: #626262;
  text-decoration: none;
  font-size: 18px;
  margin: 5px 0;

  &:hover {
    color: #8041ff;
    transition: 0.3s;
  }
`;

const AdminSidebar = () => {
  return (
    <SideBar>
      <Layout>
        <h1>패키지 관리</h1>
        <StyledLink to="./package/list">패키지 목록</StyledLink>
        <StyledLink to="./package/lodging/list">패키지 등록</StyledLink>

        <h1>사업장 관리</h1>
        <StyledLink to="/office/list">오피스 목록</StyledLink>
        {/* <StyledLink to="/lodging/list">숙소 목록</StyledLink> */}
        <StyledLink to="/program/list">프로그램 목록</StyledLink>
        <StyledLink to="/tourspot/list">관광지 목록</StyledLink>
        <StyledLink to="/request/list">등록 요청 목록</StyledLink>

        <h1>회원 관리</h1>
        <StyledLink to="/member/list">일반회원 목록</StyledLink>
        <StyledLink to="/member/enroll">예약내역 조회</StyledLink>

        <h1>호스트 관리</h1>
        <StyledLink to="/host/list">호스트 목록</StyledLink>
        <StyledLink to="/host/enroll">호스트 등록</StyledLink>

        {/* <h1>FAQ</h1>
        <StyledLink to="/faq/list">FAQ 목록</StyledLink>
        <StyledLink to="/faq/enroll">FAQ 등록</StyledLink> */}
      </Layout>
    </SideBar>
  );
};

export default AdminSidebar;
