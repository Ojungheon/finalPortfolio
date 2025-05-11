import React from 'react';
import styled from 'styled-components';

const MainWrap = styled.div`
  width: calc(100% - 60px);
  height: 100%;
  display: grid;
  margin-left: 60px;
`;

const TitleContent = styled.div`
  display: flex;
  align-items: flex-end; /* 세로 가운데 정렬 */
  gap: 20px; /* 요소 간격 조정 */
`;

const TitleContainer = styled.div`
  display: flex;
  align-items: flex-end; /* 요소들을 하단 정렬 */
  justify-content: space-between; /* 제목과 검색바를 양쪽 끝으로 배치 */
  width: calc(100% - 60px);
  padding-bottom: 10px;
  border-bottom: 1px solid gray;
  margin-bottom: 30px;
`;

const SubTitle = styled.h1`
  display: table;
  padding-left: 20px;
  padding-right: 20px;
  margin-bottom: 15px;
`;

const MenuTitle = ({ title }) => {
  return (
    <MainWrap>
      <TitleContainer>
        <TitleContent>
          <SubTitle>{title}</SubTitle>
        </TitleContent>
      </TitleContainer>
    </MainWrap>
  );
};

export default MenuTitle;
