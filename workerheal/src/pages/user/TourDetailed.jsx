import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import ImageSlider from './ImageSlider';
import LocationInfo from './LocationInfo';
import MapDetail from '../../common/api/MapDetail';
import Footer from '../../common/components/user/Footer';
import MoveButton from '../../components/MoveButton';
import { useDispatch, useSelector } from 'react-redux';
import { setTourDetailed } from '../../redux/tourDetailedSlice';
import { useLocation } from 'react-router-dom';
import DetaileIntro from './DetaileIntro';

const API_SERVER = process.env.REACT_APP_SERVER_ROOT;

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

const TourDetailed = () => {
  const dispatch = useDispatch();
  const location = useLocation();
  const { tourInfo } = useSelector((state) => state.tourDetailed);
  const [imgList, setImgList] = useState([]);

  console.log('Redux에서 가져온 데이터:', tourInfo);

  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const no = queryParams.get('no'); // ✅ URL에서 no 값 가져오기

    const fetchDetail = async () => {
      const option = {
        method: 'GET',
        headers: {
          'content-type': 'application/json',
        },
      };
      try {
        const resp = await fetch(
          `http://${API_SERVER}/api/tour/detail?no=${no}`,
          option
        );

        if (!resp.ok) {
          throw new Error('데이터 요청 실패');
        }

        const data = await resp.json(); // JSON 변환
        console.log('✅ API에서 가져온 데이터:', data);

        // dispatch(setTourDetailed(data)); // Redux에 저장
        dispatch(setTourDetailed(data.tourVo)); // 태훈 수정
        setImgList(data.imgList); // 태훈 수정
      } catch (error) {
        console.error('❌ 관광 상세 정보 불러오기 실패:', error);
      }
    };

    fetchDetail();
  }, [dispatch, location]);

  // 데이터가 없으면 로딩 표시
  if (!tourInfo || Object.keys(tourInfo).length === 0) {
    return <p>로딩 중...</p>;
  }

  return (
    <>
      <Container>
        {/* 이미지 */}
        <ImageSlider images={imgList || []} />
        {/* 장소명, 위치, 태그 */}
        <LocationDiv>
          <LocationInfo
            name={tourInfo.name}
            location={tourInfo.roadAddress}
            tags={tourInfo.tag}
          />
        </LocationDiv>
        {/* 사이트로 이동하는 버튼 */}
        <MoveButton
          label={data.label}
          path={tourInfo.linkPath}
          type={data.type}
        />
        {/* 소개 설명 */}
        <DetaileIntro intro={tourInfo.detail} code={tourInfo.facilitieCode} />
        {/* 지도 */}
        <MapDetail address={tourInfo.roadAddress} name={tourInfo.name} />
      </Container>
    </>
  );
};

export default TourDetailed;
