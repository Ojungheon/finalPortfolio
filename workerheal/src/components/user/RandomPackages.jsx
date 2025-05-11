import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Slider from 'react-slick';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import { setPackageList } from '../../redux/mainPackageList';

const API_SERVER = process.env.REACT_APP_SERVER_ROOT;

const SlideContainer = styled.div`
  width: 100%;
  max-width: 1300px;
  margin: 0px auto;
  padding: 20px;
`;

const CustomSlider = styled(Slider)`
  .slick-list {
    //overflow: hidden; /* 양쪽 잘리는 문제 해결 */
    padding: 0 20px; /* 좌우 여백을 줘서 잘리는 걸 방지 */
  }

  .slick-slide {
    display: flex !important; /* 슬라이드 가로 정렬 강제 적용 */
    justify-content: center;
  }

  .slick-track {
    display: flex; /* 개별 요소도 가로 정렬 */
  }
`;

const Pcard = styled.div`
  width: 640px;
  height: 260px;
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-template-rows: 1fr 1fr;
  position: relative;
  border-radius: 15px;
  overflow: hidden;
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-image: url(${(props) => props.backgroundImage});
    background-size: cover;
    background-position: center;
    transition: transform 0.3s ease-in-out;
  }

  &:hover::before {
    transform: scale(1.1);
  }
`;

const Overlay = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  border-radius: 15px;
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-template-rows: 1fr 1fr;
`;

const Ptext = styled.div`
  display: flex;
  color: white;
  padding: 10px;
`;

const TopLeft = styled(Ptext)`
  justify-content: flex-start;
  align-items: flex-start;
  display: flex;
  flex-direction: column;
  display: grid;
  grid-template-rows: 50px 5fr;
  margin-left: 15px;
  width: 500px;
`;

const TopRight = styled(Ptext)`
  justify-content: flex-end;
  align-items: flex-start;
  margin-top: 20px;
  margin-right: 15px;
`;

const BottomLeft = styled(Ptext)`
  justify-content: flex-start;
  align-items: flex-end;
  margin-left: 20px;
  gap: 10px;
  width: 239px;
`;

const BottomRight = styled(Ptext)`
  justify-content: flex-end;
  align-items: flex-end;
  text-align: right;
  display: grid;
  grid-template-rows: 5fr 30px;
  margin-right: 15px;
  width: 300px;
  margin-left: -230px;
`;

const RandomPackages = ({ sliderRef }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const packageList = useSelector((state) => state.mainPackage.packageList);
  const [packageData, setPackageData] = useState([]);

  const getPackageList = async () => {
    try {
      const resp = await fetch(`http://${API_SERVER}/api/package/mainList`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      const list = await resp.json();
      dispatch(setPackageData(list));
    } catch (error) {
      console.error('패키지 데이터를 가져오는 중 오류 발생:', error);
    }
  };

  useEffect(() => {
    getPackageList();
  }, []);

  useEffect(() => {
    dispatch(setPackageList(packageData));
  }, [packageData]);

  const settings = {
    dots: false, // 페이지네이션 제거거
    infinite: false,
    speed: 500,
    slidesToShow: 2, // 한 번에 2개씩 표시
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
    arrows: false, // 기기본 좌우 버튼 활성화
    centerMode: false, // 슬라이드가 좌우에 걸쳐 보이는 현상 방지
  };

  return (
    <SlideContainer>
      <CustomSlider ref={sliderRef} {...settings}>
        {packageList.map((data) => (
          <div key={data.no}>
            <Pcard
              key={data.no}
              backgroundImage={data.attachmentPath}
              onClick={() => navigate(`/package/detail?no=${data.no}`)}
            >
              <Overlay>
                <TopLeft>
                  <h1>{data.name}</h1>
                  <h3>
                    {new Date(data.openDate).toLocaleDateString('ko-KR')} ~
                    {new Date(data.closeDate).toLocaleDateString('ko-KR')}
                  </h3>
                </TopLeft>
                <TopRight></TopRight>
                <BottomLeft></BottomLeft>
                <BottomRight>
                  <h1>{data.discount}%</h1>
                  <h3>#{data.tag}</h3>
                </BottomRight>
              </Overlay>
            </Pcard>
          </div>
        ))}
      </CustomSlider>
    </SlideContainer>
  );
};

export default RandomPackages;
