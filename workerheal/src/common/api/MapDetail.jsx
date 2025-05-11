import React, { useEffect } from 'react';
import styled from 'styled-components';

// 제목 스타일
const TitleLayout = styled.div`
  width: 75px;
  display: flex;
  flex-direction: column;
  text-align: center;
  margin-top: 100px;
`;

// 제목 텍스트
const Title = styled.div`
  font-size: 17px;
  font-weight: bold;
  margin: 5px;
`;

// 타이틀 아래 라인
const LineDiv = styled.div`
  width: 74px;
  height: 5px;
  background-color: #8041ff;
  margin-bottom: 30px;
`;

const MapDiv = styled.div`
  margin: 0px auto;
`;

const MapDetail = ({ address, name }) => {
  console.log('🚀 MapDetail 컴포넌트에서 받은 address:', address);
  console.log('🚀 address 데이터 타입:', typeof address);
  console.log('🚀 address가 비어 있는지:', !address || address.trim() === '');

  useEffect(() => {
    if (!address) {
      console.warn('❌ 주소가 제공되지 않았습니다.');
      return;
    }

    if (window.kakao && window.kakao.maps) {
      console.log('🚀 Kakao Maps API 로드됨, 주소 검색 시작:', address);

      const container = document.getElementById('map');
      const options = {
        center: new window.kakao.maps.LatLng(37.5665, 126.978), // ✅ 기본 위치 (서울 시청)
        level: 3, // 지도 확대 레벨
      };

      const map = new window.kakao.maps.Map(container, options); // 지도 생성
      const geocoder = new window.kakao.maps.services.Geocoder();

      geocoder.addressSearch(address, function (result, status) {
        // ✅ props로 받은 주소 사용
        console.log('🚀 Geocoder 결과:', result, status);

        if (status === window.kakao.maps.services.Status.OK) {
          const coords = new window.kakao.maps.LatLng(result[0].y, result[0].x);

          const marker = new window.kakao.maps.Marker({
            map: map,
            position: coords,
          });

          const infowindow = new window.kakao.maps.InfoWindow({
            content: `<div style="width:150px;text-align:center;padding:6px 0;">${name}</div>`, // ✅ 주소 표시
          });
          infowindow.open(map, marker);

          map.setCenter(coords);
        } else {
          console.error('❌ 주소 검색에 실패했습니다. 상태 코드:', status);
        }
      });
    } else {
      console.error('❌ Kakao Maps API가 로드되지 않았습니다.');
    }
  }, [address]); // ✅ address가 변경될 때마다 실행

  return (
    <>
      <TitleLayout>
        <Title>위치</Title>
        <LineDiv />
      </TitleLayout>
      <MapDiv
        id="map"
        style={{
          width: '700px',
          height: '400px',
        }}
      ></MapDiv>
    </>
  );
};

export default MapDetail;
