import React from 'react';
import styled from 'styled-components';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faDollarSign,
  faBuilding,
  faBed,
  faMountainSun,
} from '@fortawesome/free-solid-svg-icons';

const TitleLayout = styled.div`
  margin-top: 30px;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const Title = styled.div`
  display: flex;
  justify-content: center;
  font-size: 20px;
  color: #747474;
  align-items: center;
  flex-direction: row;
  margin: 20px;
`;

const Line = styled.div`
  width: 1030px;
  height: 1px;
  background-color: #747474;
`;

const Info = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 60%;
  padding: 10px;
  margin: 0px auto;
`;

const NameContainer = styled.div`
  display: flex;
  align-items: center;
`;

const Name = styled.div`
  margin-left: 10px; /* ✅ 아이콘과 Name 사이 간격 조정 */
  font-weight: bold;
  color: #8041ff;
  font-size: 18px;
`;

const Price = styled.div`
  margin-left: 0px auto;
  font-weight: bold;
`;

const Charge = ({
  officeName,
  officePrice,
  lodgingName,
  tourName,
  tourPrice,
  lodgingPrice,
}) => {
  return (
    <>
      <TitleLayout>
        <Title>
          <FontAwesomeIcon icon={faDollarSign} style={{ color: '#747474' }} />
          요금
        </Title>
        <Line />
      </TitleLayout>

      <Info>
        <NameContainer>
          <FontAwesomeIcon
            icon={faBuilding}
            size="2x"
            style={{ color: '#8041ff' }}
          />
          <Name>{officeName}</Name>
        </NameContainer>
        <Price>{officePrice}원</Price>
      </Info>

      <Info>
        <NameContainer>
          <FontAwesomeIcon
            icon={faBed}
            size="2x"
            style={{ color: '#8041ff' }}
          />
          <Name>{lodgingName}</Name>
        </NameContainer>
        <Price>{lodgingPrice}원</Price>
      </Info>

      <Info>
        <NameContainer>
          <FontAwesomeIcon
            icon={faMountainSun}
            size="2x"
            style={{ color: '#8041ff' }}
          />
          <Name>{tourName}</Name>
        </NameContainer>
        <Price>{tourPrice}원</Price>
      </Info>
    </>
  );
};

export default Charge;
