import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { getApprovalDetail } from '../../../services/approvalService';
import MapDetail from '../../../common/api/MapDetail';
import ImageSlider from '../../user/ImageSlider';
import LocationInfo from '../../user/LocationInfo';
import DetaileIntro from '../../user/DetaileIntro';
import Amenities from '../../../components/Amenities';
import Description from '../../user/Description';
import Footer from '../../../common/components/user/Footer';
import Header from '../../../common/components/user/Header';
import ApproveArea from '../../../components/admin/manageWorkplace/ApproveArea';
import { getFacilityNameList } from '../../../services/optionService';

/* ################################## styled components start ################################## */

const MainLayout = styled.div`
  background-color: #ffffff;
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const StyledWorkspace = styled.div`
  background-color: white;
  width: 1420px;
  height: 100%;
`;

const Container = styled.div`
  width: 80%;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
`;

const LocationDiv = styled.div``;

// const ContentArea = styled.div`
//   display: grid;
//   grid-template-rows: 180px 85px 1fr 300px;
//   width: 100%;
//   margin: 0 auto;
// `;

const ContentArea = styled.div`
  display: grid;
  grid-template-rows: 220px 1fr;
  width: 100%;
  margin: 0 auto;
`;

const BlankSpace = styled.div`
  height: 100px;
`;

/* ################################## styled components end ################################## */

/* ################################## TempOfficeDetail start ################################## */
const TempOfficeDetail = () => {
  const location = useLocation();
  /* ################### state 생성 ################### */
  const [officeInfo, setOfficeInfo] = useState({});
  const [officeAttachments, setofficeAttachments] = useState([]);
  const [facilityList, setFacilityList] = useState([]);

  const infoData = {
    수용인원: `${officeInfo.capacity}명`,
    '사용 시간': `${officeInfo.open} - ${officeInfo.close}`,
    '시설 / 장비': facilityList.join(' , '),
    연락처: `${officeInfo.phone}`,
  };

  /* ################### fetch 함수 ################### */
  // 승인요청 상세정보 호출
  const getOfficeDetail = async () => {
    const queryParams = new URLSearchParams(location.search);
    const no = queryParams.get('no');
    try {
      const data = await getApprovalDetail(no, 'office');
      setOfficeInfo(data.tempOfficeVo);
      setofficeAttachments(data.imgList);
    } catch (error) {
      console.log('Error 발생~~~ ', error);
      alert(error);
    }
  };

  /* ################### 화면 로드 시 데이터 불러오기 ################### */
  useEffect(() => {
    getOfficeDetail();
  }, []);

  useEffect(() => {
    if (officeInfo.facilitieCode != undefined) {
      getFacilityNameList('office', officeInfo.facilitieCode).then((list) => {
        setFacilityList(list);
      });
    }
  }, [officeInfo]);

  if (!officeInfo || Object.keys(officeInfo).length === 0) {
    return <h3>로딩중...</h3>; // 데이터가 비어있으면 로딩 표시
  }

  return (
    <>
      <ContentArea>
        {/* 승인처리 */}
        <ApproveArea workplaceInfo={officeInfo} type={'office'} />
        <MainLayout>
          <StyledWorkspace>
            {/* <Header /> */}
            <Container>
              {/* 이미지 슬라이더 */}
              <ImageSlider
                images={officeAttachments.map((item) => item.path)}
              />

              {/* 위치 정보 */}
              <LocationDiv>
                <LocationInfo
                  name={officeInfo.name}
                  location={officeInfo.roadAddress}
                  tags={officeInfo.tag}
                />
              </LocationDiv>

              {/* 안내사항 */}
              <Description info={infoData} />

              {/* 오피스 소개 */}
              <DetaileIntro intro={officeInfo.detail} />

              {/* 편의시설 */}
              <Amenities selectedAmenities={facilityList} />

              {/* 지도 정보 */}
              <MapDetail
                address={officeInfo.roadAddress}
                name={officeInfo.name}
              />

              <BlankSpace />
            </Container>
          </StyledWorkspace>
        </MainLayout>
        {/* <Footer /> */}
      </ContentArea>
    </>
  );
};
/* ################################## TempOfficeDetail end ################################## */

export default TempOfficeDetail;
