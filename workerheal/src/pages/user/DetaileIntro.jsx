import React from 'react';
import styled from 'styled-components';

const TitleLayout = styled.div`
  width: 74px;
  display: flex;
  flex-direction: column;
  text-align: center;
  margin-top: 30px;
`;
const Title = styled.div`
  font-size: 17px;
  font-weight: bold;
  margin: 5px;
`;
const LineDiv = styled.div`
  width: 74px;
  height: 5px;
  background-color: #8041ff;
`;

const DetailEx = styled.div`
  margin-top: 20px;
  max-width: 1100px;
  margin-left: 15px;

  & > p {
    color: gray;
    font-size: 17px;
    margin-top: 15px;
    line-height: 2;
  }
`;

const DetaileIntro = ({ intro, code }) => {
  return (
    <>
      <TitleLayout>
        <Title>소개</Title>
        <LineDiv />
      </TitleLayout>
      <DetailEx>
        {/* {intro ? <p>{intro}</p> : null} */}
        {intro ? <div dangerouslySetInnerHTML={{ __html: intro }} /> : null}
        {/* {code ? <p>{code}</p> : null} */}
      </DetailEx>
    </>
  );
};

export default DetaileIntro;
