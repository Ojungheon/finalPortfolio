import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser } from '@fortawesome/free-solid-svg-icons';
import { useSelector, useDispatch } from 'react-redux';
import { logoutMember } from '../../../redux/MemberSlice';
import { setSelectedCategory } from '../../../redux/tourSlice';

// 상단 메뉴 바 스타일
const StyledTopMenu = styled.div`
  background: linear-gradient(135deg, #ffaa0c, #8041ff);
  width: 100%;
  height: 85px;
  display: flex;
  justify-content: center;
  align-items: center;
  top: 0;
  position: sticky;
  z-index: 2000;
`;

// 네비게이션 메뉴 영역
const TopMenuArea = styled.div`
  width: 1420px;
  height: 100px;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

// 로고 스타일
const StyledLogo = styled(Link)`
  width: 200px;
  height: 100px;
  display: flex;
  justify-content: flex-start;
  align-items: center;
  font-size: 30px;
  font-weight: bold;
  color: #20113f;
  text-decoration: none;
`;

// 네비게이션 링크 스타일
const StyledNav = styled.nav`
  display: flex;
  gap: 100px;
  margin-left: 350px;
`;

const StyledLink = styled(Link)`
  font-size: 1.1em;
  color: white;
  text-decoration: none;
  font-weight: bold;
`;

// 관광 메뉴 관련 스타일
const TourContainer = styled.div`
  position: relative;
  display: inline-block;
`;

const StyledNavLink = styled.span`
  font-size: 1.1em;
  color: white;
  font-weight: bold;
  cursor: pointer;
`;

const TourDropdownMenu = styled.div`
  position: absolute;
  top: 30px;
  left: -65px;
  width: 180px;
  background: white;
  border-radius: 3px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  display: ${({ isOpen }) => (isOpen ? 'block' : 'none')};
  z-index: 10000;
`;

// 드롭다운 메뉴 공통 스타일
const DropdownItem = styled(Link)`
  display: block;
  padding: 12px 15px;
  font-size: 1em;
  font-weight: bold;
  color: #333;
  text-decoration: none;
  &:hover {
    background: #9257ff;
    color: white;
  }
`;

// 로그인 버튼 스타일
const LoginButton = styled(Link)`
  font-size: 1.1em;
  color: white;
  text-decoration: none;
  font-weight: bold;
  padding: 8px 12px;
`;

// 로그인 / 유저 정보 스타일
const UserContainer = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  cursor: pointer;
`;

const UserName = styled.div`
  font-size: 1.1em;
  font-weight: bold;
  color: white;
  margin-right: 10px;
`;

// 유저 드롭다운 메뉴 스타일 (위와 동일)
const DropdownMenu = styled.div`
  position: absolute;
  top: 60px;
  right: 0;
  width: 180px;
  background: white;
  border-radius: 3px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  display: ${({ isOpen }) => (isOpen ? 'block' : 'none')};
`;

const Header = () => {
  const dispatch = useDispatch();
  const member = useSelector((state) => state.member.member); // Redux에서 유저 정보 가져오기
  const isLoggedIn = !!member; // 로그인 여부
  const userNickname = member?.nick || '사용자'; // 유저 닉네임 (없으면 기본값)
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isTourDropdownOpen, setIsTourDropdownOpen] = useState(false);

  const tour = useSelector((state) => state.tour.tourList);

  // 카테고리 클릭 핸들러
  const handleCategoryClick = (cateNo) => {
    // Redux에 선택된 카테고리 번호 저장
    dispatch(setSelectedCategory(cateNo));
    // 메뉴 닫기 (필요시)
    setIsTourDropdownOpen(false);
  };

  // 로그인 상태 변경 감지
  useEffect(() => {
    console.log('헤더 로그인 상태 변경:', isLoggedIn);
  }, [isLoggedIn]);

  return (
    <StyledTopMenu>
      <TopMenuArea>
        <StyledLogo to={'/'}>WORKERHEAL</StyledLogo>
        <StyledNav>
          {/* 관광 메뉴 드롭다운 */}
          <TourContainer>
            <StyledNavLink
              onClick={() => setIsTourDropdownOpen(!isTourDropdownOpen)}
            >
              관광
            </StyledNavLink>
            <TourDropdownMenu isOpen={isTourDropdownOpen}>
              <DropdownItem
                to="/tour/list?cateNo=1"
                onClick={() => handleCategoryClick(1)}
              >
                맛집
              </DropdownItem>
              <DropdownItem
                to="/tour/list?cateNo=2"
                onClick={() => handleCategoryClick(2)}
              >
                카페
              </DropdownItem>
              <DropdownItem
                to="/tour/list?cateNo=3"
                onClick={() => handleCategoryClick(3)}
              >
                명소
              </DropdownItem>
              <DropdownItem
                to="/tour/list?cateNo=4"
                onClick={() => handleCategoryClick(4)}
              >
                축제
              </DropdownItem>
            </TourDropdownMenu>
          </TourContainer>

          <StyledLink to="/lodging/list">숙소</StyledLink>
          <StyledLink to="/office/list">오피스</StyledLink>
          <StyledLink to="/package/list">패키지</StyledLink>
        </StyledNav>

        {/* 로그인되지 않은 경우 -> 로그인 버튼 */}
        {!isLoggedIn ? (
          <LoginButton to="/member/login">로그인</LoginButton>
        ) : (
          <UserContainer onClick={() => setIsDropdownOpen(!isDropdownOpen)}>
            <FontAwesomeIcon
              icon={faUser}
              style={{ color: '#ffffff', fontSize: '1.5em' }}
            />
            {/* 드롭다운 메뉴 */}
            <DropdownMenu isOpen={isDropdownOpen}>
              <DropdownItem to="/member/mypage">개인정보 조회</DropdownItem>
              <DropdownItem to="/member/reservated">예약내역</DropdownItem>
              <DropdownItem to="/member/saved">찜한상품</DropdownItem>
              <DropdownItem
                to="/member/login"
                onClick={() => dispatch(logoutMember())}
              >
                로그아웃
              </DropdownItem>
            </DropdownMenu>
          </UserContainer>
        )}
      </TopMenuArea>
    </StyledTopMenu>
  );
};

export default Header;
