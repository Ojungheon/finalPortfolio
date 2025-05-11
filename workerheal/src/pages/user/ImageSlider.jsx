import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import styled from 'styled-components';

const SliderContainer = styled.div`
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
  margin-top: 50px;
`;

const StyledSwiper = styled(Swiper)`
  width: 100%;
  max-width: 1500px;
  position: relative;

  .swiper-button-prev,
  .swiper-button-next {
    position: absolute;
    transform: translateY(-20%);
    color: #d8d8d8;
    width: 80px;
    height: 110px;
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: rgba(0, 0, 0, 0.4);
    z-index: 10;
  }

  .swiper-button-prev::after,
  .swiper-button-next::after {
    font-size: 35px;
    font-weight: bold;
  }

  .swiper-button-prev:hover,
  .swiper-button-next:hover {
    background-color: rgba(104, 104, 104, 0.8);
  }
`;

const SlideImage = styled.img`
  width: 100%;
  max-width: 1070px;
  height: 470px;
  object-fit: cover;
  border-radius: 10px;
`;

const ImageSlider = ({ images }) => {
  // images가 문자열이면 배열로 변환, null 또는 undefined면 빈 배열로 변환
  const safeImages = !images
    ? [] // null, undefined 처리
    : Array.isArray(images)
    ? images // 배열이면 그대로 사용
    : [images]; // 문자열이면 배열로 변환

  return (
    <SliderContainer>
      {safeImages.length > 0 ? (
        <StyledSwiper navigation={true} modules={[Navigation]}>
          {safeImages.map((image, index) => (
            <SwiperSlide
              key={index}
              style={{ display: 'flex', justifyContent: 'center' }}
            >
              <SlideImage src={image} alt={`Slide ${index}`} />
            </SwiperSlide>
          ))}
        </StyledSwiper>
      ) : (
        <p>이미지가 없습니다.</p> // 이미지가 없을 경우 대비
      )}
    </SliderContainer>
  );
};

export default ImageSlider;
