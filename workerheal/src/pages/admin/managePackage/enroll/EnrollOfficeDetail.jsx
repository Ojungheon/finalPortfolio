import React from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { setSelectedOffice } from '../../../../redux/packageSlice';
import EnrollOfficeDetailData from '../../../../components/admin/managePackage/enroll/EnrollOfficeDetailData';

const MainWrap = styled.div`
  width: calc(100% - 100px);
  height: 100%;
  display: grid;
  grid-template-columns: 1fr;
  grid-template-rows: 1fr 5fr;
  margin-left: 100px;
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

const EnrollOfficeDetail = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // 오피스 선택 후, Redux 상태에 저장하고, 다음 페이지로 네비게이션
  const handleSelectAndNext = (office) => {
    if (office) {
      dispatch(setSelectedOffice(office)); // Redux에 오피스 정보 저장
      navigate('/manager/enroll/package/program/list'); // 프로그램 설정 페이지로 이동
    }
  };

  return (
    <MainWrap>
      <SearchBarContainer>
        <div>
          <h1>오피스 목록</h1>
        </div>
        <div>
          <SearchBar></SearchBar>
        </div>
      </SearchBarContainer>

      <EnrollOfficeDetailData onSelect={handleSelectAndNext} />
    </MainWrap>
  );
};

export default EnrollOfficeDetail;
