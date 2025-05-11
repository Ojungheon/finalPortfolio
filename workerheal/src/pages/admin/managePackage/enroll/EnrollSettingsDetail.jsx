import React, { useState } from 'react';
import styled from 'styled-components';
import EnrollSettingsDetailData from '../../../../components/admin/managePackage/enroll/EnrollSettingsDetailData';
import { useSelector } from 'react-redux';

const MainWrap = styled.div`
  width: calc(100% - 100px);
  height: 100%;
  display: grid;
  grid-template-columns: 1fr;
  grid-template-rows: 1fr 5fr;
  margin-left: 100px;
`;

const TitleContent = styled.div`
  display: flex;
  width: 1000px;
  align-items: flex-end; /* 세로 가운데 정렬 */
  gap: 20px; /* 요소 간격 조정 */
`;

const SearchBarContainer = styled.div`
  display: grid;
  grid-template-rows: 1fr;
  width: 95%;
  grid-template-columns: 1fr 3fr;
  align-items: end; /* 아래쪽으로 정렬 */
  padding-bottom: 10px; /* 약간의 여백 추가 */
`;

const SearchBar = styled.div`
  display: grid;
  grid-template-rows: 1fr;
  grid-template-columns: 1fr 1fr 1fr;
`;

const EnrollSettingsDetail = () => {
  const [selectedSettings, setSelectedSettings] = useState(null);

  return (
    <MainWrap>
      <SearchBarContainer>
        <TitleContent>
          <h1>패키지 등록</h1>
          <p>숙소 설정&gt;오피스 설정&gt;프로그램 설정&gt;패키지 세부설정</p>
        </TitleContent>
        <div>
          <SearchBar></SearchBar>
        </div>
      </SearchBarContainer>

      <EnrollSettingsDetailData program={selectedSettings} />
    </MainWrap>
  );
};

export default EnrollSettingsDetail;
