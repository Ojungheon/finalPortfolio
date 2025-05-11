import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import styled from 'styled-components';
import { LeftButton, RightButton } from '../../common/components/user/LRButton';
import RandomPackages from '../../components/user/RandomPackages';
import MainTour from '../../components/user/MainTour';
import MainOffice from '../../components/user/MainOffice';
import MainLodging from '../../components/user/MainLodging';

const API_SERVER = process.env.REACT_APP_SERVER_ROOT;

const FullContainer = styled.div`
  display: grid;
  height: 100%;
  grid-template-rows: ${({ isVisible }) =>
    isVisible ? '100px' : '5px'}; /* 하나의 열로 설정 (세로로 배치) */
  gap: 20px; /* 각 항목 사이에 간격 추가 */
  justify-items: center; /* 항목을 수평 중앙으로 정렬 */
  align-items: center; /* 항목을 수직 중앙으로 정렬 */
  padding: 20px; /* 여백 추가 */
`;
// 이미지 영역 스타일링
const ImageContainer = styled.div`
  position: absolute;
  top: 0;
  width: 100%;
  z-index: 1000;
  padding-bottom: 35%; /* 16:9 비율 */
  height: 100px;
  visibility: ${({ isVisible }) => (isVisible ? 'visible' : 'hidden')};
  opacity: ${({ isVisible }) => (isVisible ? '1' : '0')};
  background-image: linear-gradient(
      to bottom,
      rgba(0, 0, 0, 0) 0%,
      #ffffff 100%
    ),
    url('https://fredericgonzalo.com/app/uploads/2022/03/optimizada_benefits-of-workation.jpg');
  background-size: cover; /* 이미지를 컨테이너를 덮도록 설정 */
  background-position: center; /* 이미지를 중앙에 배치 */
  background-repeat: no-repeat; /* 이미지 반복 방지 */
`;

const OverlayText = styled.div`
  position: absolute;
  width: 100%;
  height: 100%;
  visibility: ${({ isVisible }) =>
    isVisible ? 'visible' : 'hidden'}; /* 보이거나 숨기기 */
  background: linear-gradient(
    to bottom,
    rgba(0, 0, 0, 0.5) 70%,
    rgba(0, 0, 0, 0) 100%
  ); /* 상단은 어두운 색, 하단은 투명 */
  color: white;
  font-size: 30px;
  transition: all 0.5s ease;
  overflow: hidden;
  display: flex;
  justify-content: center; /* 수평 중앙 정렬 */
  align-items: center; /* 수직 중앙 정렬 */
  text-align: center;
  text-overflow: ellipsis; /* 넘치는 텍스트 잘라내기 */
  white-space: nowrap; /* 한 줄로 유지 */
  line-height: 50px;
`;

const MainContainer = styled.div`
  display: grid;
  grid-template-rows: 100px 1fr 100px 1fr 100px 1fr;
  position: relative;
  width: 100%;
  /* height: 100%; */
  /* background-color: #df7a7a; */
  padding: 10px;
  top: 100px;
  margin-top: ${({ isVisible }) =>
    isVisible ? '600px' : '-50px'}; /* 이미지가 보일 때만 이미지 아래로 밀림 */
`;

const ToggleButton = styled.div`
  width: 50px;
  height: 20px;
  display: flex;
  position: grid; /* 절대 위치로 설정 */
  top: 210px; /* 메인 컨텐츠 위쪽에 배치 */
  left: 50%; /* 화면의 가로 중앙에 배치 */
  transform: translateX(-50%); /* 정확히 중앙에 맞추기 */
  border: none;
  color: ${({ isVisible }) => (isVisible ? '#ffffff' : '#000000')};
  font-size: 20px;
  padding: 10px 20px;
  cursor: pointer;
  border-radius: 5px;
  justify-content: center;
  align-items: center;

  animation: moveUpDown 1s ease-in-out infinite;

  @keyframes moveUpDown {
    0% {
      transform: translate(-50%, 0);
    }
    50% {
      transform: translate(-50%, -5px); /* 살짝 위로 */
    }
    100% {
      transform: translate(-50%, 0);
    }
  }
`;

const FirstDiv = styled.div`
  width: 100%;
  height: 100%;
  justify-content: center;
  align-items: center;
  margin-bottom: 100px;
`;
const SecondDiv = styled.div`
  display: flex;
  width: 100%;
  height: 100%;
  justify-content: center;
  gap: 70px;
  margin-bottom: 100px;
`;

const ThirdDiv = styled.div`
  display: flex;
  width: 100%;
  height: 100%;
  justify-content: center;
  gap: 70px;
  margin-bottom: 100px;
`;

// 스타일링
const PackageAdContainer = styled.div`
  display: flex;
  transition: transform 0.5s ease;
  width: ${({ count }) => `${count * 100}%`}; /* ✅ 패키지 개수에 맞게 조정 */

  overflow: hidden;
  z-index: 1000;
`;

const PackageTag = styled.div`
  position: absolute;
  bottom: 50px;
  left: 10px;
  padding: 20px;
  color: white;
  font-size: 20px;
  font-weight: bold;
  border-radius: 10px;
  z-index: 50;
  opacity: 0; /* 처음에는 투명 */
  transition: opacity 0.3s ease-in-out;
`;

const PackageAd = styled.div`
  width: 50%;
  height: 400px;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-shrink: 0;
  gap: 20px;
  position: relative;
  &:hover ${PackageTag} {
    opacity: 1;
  }
`;

const ButtonLayout = styled.div``;

const Home = () => {
  const [isVisible, setIsVisible] = useState(true); // 이미지의 표시 상태
  const [currentIndex, setCurrentIndex] = useState(0);
  const [randomPackages, setRandomPackages] = useState([]);

  useEffect(() => {
    axios
      .get(`http://${API_SERVER}/api/home/random`)
      .then((response) => {
        setRandomPackages(response.data);
      })
      .catch((error) => {
        console.error('패키지를 불러오지 못하였습니다', error);
      });
  }, []);

  useEffect(() => {
    if (randomPackages.length > 0) {
      const interval = setInterval(() => {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % randomPackages.length);
      }, 5000);
      return () => clearInterval(interval);
    }
  }, [randomPackages]); // randomPackages가 있을 때만 실행되도록 수정

  const handleToggle = () => {
    setIsVisible(!isVisible); // 클릭 시 이미지를 숨기거나 나타내기
  };
  const sliderRef = useRef(null); // 슬라이더 제어를 위한 ref 추가

  const handlePrevClick = () => {
    if (sliderRef.current) {
      sliderRef.current.slickPrev(); // 이전 슬라이드 이동
    }
  };

  const handleNextClick = () => {
    if (sliderRef.current) {
      sliderRef.current.slickNext(); // 다음 슬라이드 이동
    }
  };

  return (
    <FullContainer>
      <ImageContainer isVisible={isVisible}>
        <OverlayText isVisible={isVisible}>
          <p>
            워케이션(workation)은 ‘Work(일)’과 ‘Vacation(휴가)’의 합성어로
            <br /> 일과 여행을 동시에 할 수 있는 새로운 근무 형태를 말합니다.
            <br /> 워케이션은 보통 장기 출장이나 휴가를 떠나면서 업무를 병행하는
            방식을 말하며
            <br /> 최근 유연한 근무 형태가 확산되면서 점점 더 많은 사람들이
            워케이션을 즐기고 있습니다.
          </p>
        </OverlayText>
      </ImageContainer>
      {/* 토글 버튼 */}
      <ToggleButton isVisible={isVisible} onClick={handleToggle}>
        {isVisible ? '▼' : '▲'}
      </ToggleButton>
      {/* 메인 컨텐츠 */}
      <MainContainer isVisible={isVisible}>
        <h1>오늘의 패키지</h1>
        <FirstDiv>
          {/* 랜덤 패키지 광고 */}
          <PackageAdContainer>
            <RandomPackages sliderRef={sliderRef} />
          </PackageAdContainer>

          {/* 좌우 버튼 */}
          <ButtonLayout>
            <LeftButton onClick={handlePrevClick}>◀</LeftButton>
            <RightButton onClick={handleNextClick}>▶</RightButton>
          </ButtonLayout>
        </FirstDiv>
        <h1>숙소 추천</h1>
        <ThirdDiv>
          <MainLodging />
        </ThirdDiv>
        <h1>오피스 추천</h1>
        <ThirdDiv>
          <MainOffice />
        </ThirdDiv>
        <h1>어디가 좋을까?</h1>
        <SecondDiv>
          <MainTour
            src="https://cdn.skkuw.com/news/photo/202305/30182_20136_3154.jpg"
            alt="맛집 이미지"
            name="맛집"
            navi="/tour/list?cateNo=1"
          />
          <MainTour
            src="https://blog-static.kkday.com/ko/blog/wp-content/uploads/korea_seoul_jongno_tung_2.jpg"
            alt="카페 이미지"
            name="카페"
            navi="/tour/list?cateNo=2"
          />
          <MainTour
            src="https://image6.yanolja.com/leisure/RJvZF5fKU36KsnOt"
            alt="명소 이미지"
            name="명소"
            navi="/tour/list?cateNo=3"
          />
          <MainTour
            src="https://cdn.travie.com/news/photo/202209/50619_23449_3834.jpg"
            alt="축제 이미지"
            name="축제"
            navi="/tour/list?cateNo=4"
          />
        </SecondDiv>
      </MainContainer>
    </FullContainer>
  );
};

export default Home;
