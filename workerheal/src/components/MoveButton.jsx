import React from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';

const ButtonContainer = styled.div`
  display: flex;
  justify-content: flex-end;
  width: 100%;
`;

const ButtonLay = styled.div`
  display: flex;
  justify-content: flex-end;
  width: 100%;
  margin: -30px 30px 30px 0;
`;

const ReserveButton = styled.button`
  display: flex;
  background-color: #8041ff;
  color: white;
  padding: 10px 16px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-size: 15px;
  font-weight: bold;
  max-width: 150px;
  justify-content: center;

  &:hover {
    background-color: #4500b5;
  }
`;

const StyledLink = styled.a`
  display: inline-block;
  text-decoration: none;
`;

const MoveButton = ({ path, type, label }) => {
  const navigate = useNavigate();

  if (type === 'navigate') {
    return (
      <ButtonLay>
        <ReserveButton onClick={() => navigate(path)}>{label}</ReserveButton>
      </ButtonLay>
    );
  } else if (type === 'link') {
    return (
      <StyledLink href={path} target="_blank" rel="noopener noreferrer">
        <ButtonLay>
          <ReserveButton as="div">{label}</ReserveButton>{' '}
        </ButtonLay>
      </StyledLink>
    );
  }
  return (
    <>
      <ButtonContainer>
        <ButtonLay>
          <ReserveButton type={type} path={path}>
            {label}
          </ReserveButton>
        </ButtonLay>
      </ButtonContainer>
    </>
  );
};

export default MoveButton;
