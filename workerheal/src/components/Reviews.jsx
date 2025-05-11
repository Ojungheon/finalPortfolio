import React, { useEffect } from 'react';
import styled from 'styled-components';
import Scope from '../common/components/Scope';

// 리뷰 전체 레이아웃
const ReviewLayout = styled.div`
  display: flex;
  align-items: center;
  border-bottom: 1px solid gray;
  padding: 20px 0;
`;

// 텍스트 정보 (닉네임, 리뷰, 별점) 감싸는 박스
const ReviewContent = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

// 리뷰 이미지 스타일
const ImageStyle = styled.img`
  width: 250px;
  height: 180px;
  border-radius: 10px;
  object-fit: cover;
`;

// 닉네임 스타일
const Nick = styled.div`
  font-size: 16px;
  color: #626262;
  font-weight: bold;
`;

// 리뷰 텍스트 스타일
const TextDiv = styled.div`
  font-size: 15px;
  margin-top: 20px;
  color: #626262;
  width: 600px;
  overflow: hidden; // 글자가 지정한 너비에 벗어나면 숨김처리해줌
  white-space: nowrap; // 줄바꿈 없이 한줄에 다 들어옴
  text-overflow: ellipsis; // 글자 길이가 길어지면... 처리해줌
`;

const Reviews = ({ nick, image, reviewDetail, scope }) => {
  console.log('aa ::::::::::: ', image);

  return (
    <>
      <ReviewLayout>
        <ReviewContent>
          <Nick>{nick}</Nick>
          <Scope scope={scope} />
          <TextDiv>{reviewDetail}</TextDiv>
        </ReviewContent>
        <ImageStyle src={image} alt="리뷰 이미지" />
      </ReviewLayout>
    </>
  );
};

export default Reviews;
