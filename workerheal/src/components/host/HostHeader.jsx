import React, { useEffect, useRef, useState } from 'react';
import styled from 'styled-components';
import { Link, useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser } from '@fortawesome/free-solid-svg-icons';
import { Toast } from '../../utils/toast';

const StyledTopMenu = styled.div`
  background: linear-gradient(135deg, #ffaa0c, #8041ff);
  width: 100%;
  height: 85px;
  display: flex;
  justify-content: center;
  align-items: center;
  top: 0;
  position: sticky;
`;

const TopMenuArea = styled.div`
  width: 1420px;
  height: 100px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  position: sticky;
`;

const StyledLogo = styled.div`
  width: 200px;
  height: 100px;
  display: flex;
  justify-content: flex-start;
  align-items: center;
  font-family: 'IM FELL French Canon SC', serif;
  font-size: 30px;
  font-weight: bold;
  color: #20113f;
`;

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
  &:hover {
    text-decoration: underline;
  }
`;

const StyledIcon = styled.div`
  background: linear-gradient(to right, #56ccf2, #2f80ed);
  border-radius: 50%;
  width: 50px;
  height: 50px;
  display: flex;
  font-size: 1.5em;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  color: white;
  position: relative;
  z-index: 10;
`;

const DropdownMenu = styled.div`
  position: absolute;
  top: 60px;
  left: 50%;
  transform: translateX(-50%);
  width: 160px;
  background: white;
  box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.1);
  border-radius: 8px;
  display: flex;
  flex-direction: column;
  z-index: 20;
`;

const DropdownItem = styled.div`
  padding: 12px;
  font-size: 1rem;
  color: #333;
  cursor: pointer;
  &:hover {
    background-color: #f0f0f0;
    border-radius: 8px;
  }
`;

const HostHeader = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // ✅ 로그아웃 기능
  const handleLogout = () => {
    localStorage.removeItem('token'); // 토큰 삭제
    Toast.fire({
      icon: 'success',
      title: '로그아웃 되었습니다.',
    });
    navigate('/host/login'); // 로그인 페이지로 이동
  };

  return (
    <>
      <StyledTopMenu>
        <TopMenuArea>
          <StyledLogo>HOST PAGE</StyledLogo>
          <StyledNav>
            <StyledLink to="/host/workplace/list">사업장 목록조회</StyledLink>
            <StyledLink to="/host/workplace/state">사업장 등록현황</StyledLink>
          </StyledNav>
          <StyledIcon
            ref={dropdownRef}
            onClick={() => setIsDropdownOpen((prev) => !prev)}
          >
            <FontAwesomeIcon icon={faUser} />
            {isDropdownOpen && (
              <DropdownMenu>
                <DropdownItem onClick={() => navigate('/host/update')}>
                  개인정보 수정
                </DropdownItem>
                <DropdownItem onClick={handleLogout}>로그아웃</DropdownItem>
              </DropdownMenu>
            )}
          </StyledIcon>
        </TopMenuArea>
      </StyledTopMenu>
    </>
  );
};

export default HostHeader;
