import React from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';

const Card = styled.div`
  width: 280px;
  height: 350px;
  border-radius: 20px;
  overflow: hidden;
  position: relative;
`;

const Image = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
`;

const Label = styled.div`
  display: flex;
  position: absolute;
  width: 160px;
  height: 80px;
  bottom: 0px;
  left: 0px;
  background: rgb(255 255 255 / 80%);
  color: #1b1b1b;
  font-size: 25px;
  font-weight: bold;
  padding: 5px 10px;
  text-align: center;
  align-items: center;
  justify-content: center;
  flex-direction: column;

  /* 기존 border-radius 유지 */
  border-radius: 0px 25px 0px 0px;
`;

const MainTour = ({ src, alt, name, navi }) => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(navi);
  };

  return (
    <Card onClick={handleClick}>
      <Image src={src} alt={alt} />
      <Label>{name}</Label>
    </Card>
  );
};

export default MainTour;
