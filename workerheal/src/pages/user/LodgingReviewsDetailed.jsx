import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation } from 'react-router-dom';
import styled from 'styled-components';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faStar } from '@fortawesome/free-solid-svg-icons';
import Reviews from '../../components/Reviews';
import InfiniteScroll from '../../common/components/InfiniteScroll';
import ImageModal from './ImageModal';
import { reviewsByLodgingeNo } from '../../redux/lodgingReviewSlice';

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

const LodgingReviewsDetailed = () => {
  const location = useLocation();
  const dispatch = useDispatch();
  const queryParams = new URLSearchParams(location.search);
  const lodgingNo = queryParams.get('no');

  // Redux에서 데이터를 가져오고, undefined인 경우 빈 배열로 초기화
  const {
    data: reviews = [],
    status,
    error,
  } = useSelector((state) => state.lodgingReview);

  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    if (lodgingNo) {
      dispatch(reviewsByLodgingeNo(lodgingNo));
    }
  }, [dispatch, lodgingNo]);

  if (status === 'loading') return <h3>로딩중...</h3>;
  if (status === 'failed')
    return <h3>리뷰를 불러오는 데 실패했습니다: {error}</h3>;

  // 리뷰 이미지 가져오기 (리뷰 첨부파일이 있는 경우)
  const allImages = reviews
    .filter((review) => review.path) // VO에서 `path` 직접 사용
    .map((review) => review.path); // 이미지 URL 리스트

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
              image={review.path || ''} // VO 구조에 맞게 `path` 직접 사용
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

export default LodgingReviewsDetailed;
