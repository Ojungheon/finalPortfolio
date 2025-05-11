import React from 'react';
import styled from 'styled-components';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faLocationDot } from '@fortawesome/free-solid-svg-icons';

const CardContainer = styled.div`
  display: flex;
  width: 600px;
  height: 250px;
  border: 1px solid #ccc;
  border-radius: 12px;
  overflow: hidden;
`;

const ImageWrapper = styled.div`
  width: 500px;
  height: 210px;
  margin-top: 20px;
  margin-left: 25px;

  img {
    display: flex;
    justify-content: center;
    width: 100%;
    height: 100%;
    object-fit: cover;
    border-radius: 5px;
  }
`;

const ContentWrapper = styled.div`
  display: flex;
  flex-direction: column;
  margin-left: 4px;
  margin-top: 15px;
  padding: 16px;
  width: 80%;
  position: relative;
`;

const Header = styled.div`
  display: flex;
  justify-content: center;
  align-items: flex-start;
`;

const Title = styled.h2`
  font-size: 24px;
  margin: 0;
`;

const LocationWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 8px 0;

  span {
    margin-left: 8px;
    color: #6a6b6c;
    font-size: 16px;
  }
`;

const Tag = styled.p`
  display: flex;
  justify-content: center;
  font-size: 16px;
  color: #747474;
  margin: 4px 0;
`;

const TourCardList = ({
  cardSrc,
  cardName,
  cardLocation,
  cardTag,
  onClick,
}) => {
  return (
    <CardContainer onClick={onClick}>
      <ImageWrapper>
        <img src={cardSrc} alt={cardName} />
      </ImageWrapper>
      <ContentWrapper>
        <Header>
          <Title>{cardName}</Title>
        </Header>

        <LocationWrapper>
          <FontAwesomeIcon icon={faLocationDot} color="#6a6b6c" />
          <span>{cardLocation}</span>
        </LocationWrapper>

        <Tag>#{cardTag}</Tag>
      </ContentWrapper>
    </CardContainer>
  );
};

export default TourCardList;
