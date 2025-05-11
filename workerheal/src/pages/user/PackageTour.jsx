import React from 'react';
import styled from 'styled-components';
import ImageSlider from './ImageSlider';
import LocationInfo from './LocationInfo';
import MoveButton from '../../components/MoveButton';
import DetaileIntro from './DetaileIntro';
import MapDetail from '../../common/api/MapDetail';

const Container = styled.div`
  width: 80%;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
`;

const LocationDiv = styled.div``;

const data = {
  type: 'link',
  label: '사이트로 이동',
};

const PackageTour = ({ detail }) => {
  return (
    <>
      <Container>
        {/* 이미지 */}
        <ImageSlider images={detail.tourVo.path || []} />

        {/* 장소명, 위치, 태그 */}
        <LocationDiv>
          <LocationInfo
            name={detail.tourVo.name}
            location={detail.tourVo.roadAddress}
            tags={detail.tourVo.tag}
          />
        </LocationDiv>

        {/* 사이트로 이동하는 버튼 */}
        <MoveButton
          label={data.label}
          path={detail.tourVo.linkPath}
          type={data.type}
        />

        {/* 소개 설명 */}
        <DetaileIntro intro={detail.tourVo.detail} />

        {/* 지도 */}
        <MapDetail
          address={detail.tourVo.roadAddress}
          name={detail.tourVo.name}
        />
      </Container>
    </>
  );
};
export default PackageTour;
