import React from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'; // 폰트 어썸 쓸거다
import { faRightFromBracket } from '@fortawesome/free-solid-svg-icons';
import { useTheme } from '@mui/material/styles';
import { Button } from '@mui/material';
import useLogout from '../../../hook/useLogout';

const StyledHeader = styled.div`
  background: ${(props) => {
    return props.color;
  }};
  width: 100%;
  height: 85px;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const TitleH1 = styled.h1`
  padding-left: 200px;
  &:hover {
    cursor: pointer;
  }
`;

const Header = () => {
  const theme = useTheme(); // theme 호출
  const logOut = useLogout('/manager/login'); // logout 훅 호출
  const navigate = useNavigate(); // navigate 훅 호출

  const toMain = () => {
    navigate('/manager'); // Main 화면으로 이동
  };

  return (
    <>
      <StyledHeader color={theme.palette.primary.main}>
        <TitleH1 onClick={toMain}>Manager</TitleH1>
        {sessionStorage.getItem('token') ? (
          <Button
            size="small"
            startIcon={<FontAwesomeIcon icon={faRightFromBracket} />}
            variant="contained"
            color="secondary"
            sx={{ mr: 15 }}
            onClick={logOut}
          >
            Logout
          </Button>
        ) : null}
      </StyledHeader>
    </>
  );
};

export default Header;
