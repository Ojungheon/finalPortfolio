import React from 'react';
import styled from 'styled-components';
import MapDetail from '../../common/api/MapDetail';
import Amenities from '../../components/Amenities';
import DetaileIntro from './DetaileIntro';
import Description from './Description';
import LocationInfo from './LocationInfo';
import ImageSlider from './ImageSlider';

const Container = styled.div`
  width: 80%;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
`;

const LocationDiv = styled.div``;

const PackageOffice = ({ detail, attach, facilityList }) => {
  // const safeOfficeFacilitieCode = 태훈 비활성화
  //   typeof detail.facilitieCode === 'string'
  //     ? detail.facilitieCode.split(',').map(Number) // 쉼표로 분리 후 숫자로 변환
  //     : Array.isArray(detail.facilitieCode)
  //     ? detail.facilitieCode
  //     : [];

  const infoData = {
    수용인원: `${detail.capacity}명`,
    '사용 시간': `${detail.open} - ${detail.close}`,
    // '시설 / 장비': `${detail.facilitieCode}`,
    '시설 / 장비': facilityList.join(' , '),
    연락처: `${detail.phone}`,
  };

  return (
    <>
      <Container>
        {/* 이미지 슬라이더 */}
        <ImageSlider
          images={Array.isArray(attach) ? attach.map((item) => item.path) : []}
        />
        {/* 위치 정보 */}
        <LocationDiv>
          <LocationInfo
            name={detail.name}
            location={detail.roadAddress}
            tags={detail.tag}
          />
        </LocationDiv>
        {/* 안내사항 */}
        <Description info={infoData} />
        {/* 오피스 소개 */}
        <DetaileIntro intro={detail.detail} />
        {/* 편의시설 */}
        {/* <Amenities selectedAmenities={safeOfficeFacilitieCode} /> 태훈 수정 */}
        <Amenities selectedAmenities={facilityList} />
        {/* 지도 정보 */}
        <MapDetail address={detail.roadAddress} name={detail.name} />
      </Container>
    </>
  );
};

export default PackageOffice;
