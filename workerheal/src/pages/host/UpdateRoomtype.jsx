import React from 'react';
import styled from 'styled-components';
import HostHeader from '../../components/host/HostHeader';
import TagAndFacility from '../../components/host/TagAndFacility';
import DetailsInput from '../../components/host/DetailsInput';
import ActionButtons from '../../components/host/ActionButtons';
import AccommodationAndImageUpload from '../../components/host/AccommodationAndImageUpload';
import OfficeAndImageUpload from '../../components/host/OfficeAndImageUpload';
import OfficeTagAndFacility from '../../components/host/OfficeTagAndFacility';
import RoomtypeAndImageUpload from '../../components/host/RoomtypeAndImageUpload';
import RoomtypeFacility from '../../components/host/RoomtypeFacility';
import { useNavigate } from 'react-router-dom';

const API_SERVER = process.env.REACT_APP_SERVER_ROOT;

const Layout = styled.div`
  display: grid;
  grid-template-columns: 1.1fr 0.9fr 1fr;
  grid-template-rows: minmax(0, 1fr) auto;
  gap: 20px; /* 요소 간격 */
  padding: 20px;
  height: 80vh;
`;

// 개별 요소 스타일
const AccommodationWrapper = styled.div`
  grid-row: 1; /* 첫 번째 열의 첫 번째 행 */
`;

const TagAndFacilityWrapper = styled.div`
  grid-column: 2;
  grid-row: 1; /* 첫 번째 열의 두 번째 행 */
  margin-left: 20px;
`;

const DetailsWrapper = styled.div`
  grid-column: 3;
  grid-row: 1; /* 두 번째 열을 두 개의 행에 걸쳐 배치 */
`;

const ActionButtonsWrapper = styled.div`
  grid-column: 1 / -1;
  grid-row: 2;
  margin-bottom: 20px;
`;

const Breadcrumb = styled.div`
  font-size: 1rem;
  font-weight: bold;
  margin-top: 20px;
  margin-left: 20px;
  margin-bottom: 20px;
`;

const UpdateRoomtype = () => {
  const navigate = useNavigate();

  // 이전으로 이동
  const handleGoBack = () => {
    navigate(-1);
  };

  return (
    <>
      <Breadcrumb>
        사업장 목록 &gt; 강릉 리프레쉬 리조트 &gt; 객실 수정 &gt;
      </Breadcrumb>
      <Layout>
        <AccommodationWrapper>
          <RoomtypeAndImageUpload />
        </AccommodationWrapper>
        <TagAndFacilityWrapper>
          <RoomtypeFacility />
        </TagAndFacilityWrapper>
        <DetailsWrapper>
          <DetailsInput />
        </DetailsWrapper>
        <ActionButtonsWrapper>
          <ActionButtons
            firstText="이전"
            secondText="수정"
            onFirstButtonClick={handleGoBack}
          />
        </ActionButtonsWrapper>
      </Layout>
    </>
  );
};

export default UpdateRoomtype;
