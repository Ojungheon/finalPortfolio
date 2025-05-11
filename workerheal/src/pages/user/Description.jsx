import React from 'react';
import styled from 'styled-components';

const Container = styled.div`
  width: 100%;
  max-width: 1070px;
  padding: 20px;
  border: 1px solid #ddd;
  border-radius: 10px;
`;

const Title = styled.p`
  font-size: 20px;
  font-weight: bold;
  margin-bottom: 30px;
  margin-top: -10px;
`;

const InfoList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

const InfoItem = styled.div`
  display: flex;
  gap: 10px;
  font-size: 16px;
  align-items: center;
`;

const InfoLabel = styled.span`
  color: #8041ff;
  min-width: 120px;
`;

const InfoValue = styled.span`
  color: #747474;
`;

const Description = ({ info }) => {
  return (
    <Container>
      <Title>📌 안내사항</Title>
      <InfoList>
        {info
          ? Object.entries(info).map(([key, value]) => (
              <InfoItem key={key}>
                <InfoLabel>{key}</InfoLabel>
                <InfoValue>{value}</InfoValue>
              </InfoItem>
            ))
          : null}
      </InfoList>
    </Container>
  );
};

export default Description;
