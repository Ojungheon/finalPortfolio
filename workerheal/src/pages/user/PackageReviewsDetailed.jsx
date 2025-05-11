import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation } from 'react-router-dom';
import styled from 'styled-components';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faStar } from '@fortawesome/free-solid-svg-icons';
import Reviews from '../../components/Reviews';
import InfiniteScroll from '../../common/components/InfiniteScroll';
import ImageModal from './ImageModal';
import { setReview } from '../../redux/packageReviewSlice';

const API_SERVER = process.env.REACT_APP_SERVER_ROOT;

const Layout = styled.div`
  display: grid;
  justify-items: center;
  justify-content: center;
`;

const Title = styled.div`
  margin: 20px;
  font-size: 20px;
  font-weight: bold;
`;

const Average = styled.div`
  display: flex;
  font-size: 20px;
  font-weight: bold;
  height: 100px;
  width: 900px;
  justify-content: flex-start;
  align-items: center;
  margin-bottom: 30px;

  & > h1 {
    display: flex;
    width: 200px;
    text-align: center;
    align-items: center;
    justify-content: center;
    font-size: 24px;
  }
`;

const ImageTitle = styled.div`
  width: 900px;
  display: flex;
  justify-content: flex-start;
  font-weight: bold;
  font-size: 20px;
  margin-bottom: 25px;
`;

const ImageSection = styled.div`
  width: 900px;
  overflow-x: auto;
  white-space: nowrap;
  display: flex;
  gap: 10px;
  padding-bottom: 10px;
  margin-bottom: 50px;

  &::-webkit-scrollbar {
    height: 8px;
  }

  &::-webkit-scrollbar-thumb {
    background: #ccc;
    border-radius: 4px;
  }

  img {
    width: 150px;
    height: 150px;
    object-fit: cover;
    border-radius: 8px;
  }
`;

const MoreButton = styled.button`
  display: flex;
  right: 0;
  bottom: 5px;
  background: no-repeat;
  color: gray;
  border: none;
  width: 900px;
  margin-bottom: 15px;
  cursor: pointer;
  justify-content: flex-end;
`;

const ImageLayout = styled.div`
  display: flex;
  width: 900px;
  flex-direction: column;
`;

const PackageReviewsDetailed = () => {
  const location = useLocation();
  const dispatch = useDispatch();
  const queryParams = new URLSearchParams(location.search);
  const packageNo = queryParams.get('no');

  // Redux에서 데이터를 가져오고, undefined인 경우 빈 배열로 초기화
  const { reviews, reviewAttachment } = useSelector(
    (state) => state.packageReview
  );

  const [isModalOpen, setIsModalOpen] = useState(false);
  useEffect(() => {
    const fetchDetail = async () => {
      const option = {
        method: 'GET',
        headers: {
          'content-type': 'application/json',
        },
      };
      try {
        console.log(
          `🚀 Fetch 요청 시작: https://${API_SERVER}/api/package/review?no=${packageNo}`
        );
        const resp = await fetch(
          `http://${API_SERVER}/api/package/review?no=${packageNo}`,
          option
        );
        const data = await resp.json();
        console.log('🚀 서버에서 받은 데이터:', data);
        dispatch(setReview(data)); // Redux에 데이터 저장
      } catch (err) {
        console.error('❌ 숙소 상세 정보 가져오기 실패: ', err);
      }
    };

    fetchDetail();
  }, [dispatch, packageNo]);

  // reviewAttachment가 undefined일 경우 빈 객체로 설정하여 오류 방지
  // flat()은 중첩된 배열을 하나의 배열로 평탄화(Flatten)해줌
  const reviewAttachArray = Object.values(reviewAttachment || {}).flat(); // 객체 → 배열 변환

  // 모든 리뷰 이미지 가져오기
  const allImages = reviewAttachArray
    .filter((attachment) => attachment.path) // path가 존재하는 것만 필터링
    .map((attachment) => attachment.path); // 이미지 URL 리스트

  const previewImages = allImages.slice(0, 20);

  return (
    <Layout>
      <Title>리뷰 ({reviews.length})</Title>
      <Average>
        <p>리뷰 평점</p>
        <h1>
          <FontAwesomeIcon icon={faStar} color="#FFD43B" />
          {reviews.length > 0
            ? (
                reviews
                  .map((r) => Number(r.score) || 0)
                  .reduce((acc, score) => acc + score, 0) / reviews.length
              ).toFixed(1)
            : '0.0'}
        </h1>
      </Average>

      <ImageLayout>
        <ImageTitle>후기사진</ImageTitle>
        {allImages.length > 10 && (
          <MoreButton onClick={() => setIsModalOpen(true)}>전체보기</MoreButton>
        )}
        <ImageSection>
          {previewImages.map((img, index) => (
            <img key={index} src={img} alt="숙소 리뷰 이미지" />
          ))}
        </ImageSection>
      </ImageLayout>

      <InfiniteScroll hasMore={false}>
        {reviews.length > 0 ? (
          reviews.map((review) => (
            <Reviews
              key={review.no}
              nick={review.memberName}
              image={
                reviewAttachment[review.no] &&
                reviewAttachment[review.no].length > 0
                  ? reviewAttachment[review.no][0].path // 첫 번째 이미지 가져오기
                  : ''
              }
              reviewDetail={review.content}
              scope={review.score}
            />
          ))
        ) : (
          <p>아직 등록된 리뷰가 없습니다.</p>
        )}
      </InfiniteScroll>

      {/* 모달 오픈 시 해당 이미지들을 모두 prop으로 전달해준다. */}
      {isModalOpen && (
        <ImageModal images={allImages} onClose={() => setIsModalOpen(false)} />
      )}
    </Layout>
  );
};

export default PackageReviewsDetailed;
