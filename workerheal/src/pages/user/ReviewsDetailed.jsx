import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation } from 'react-router-dom';
import styled from 'styled-components';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faStar } from '@fortawesome/free-solid-svg-icons';
import Reviews from '../../components/Reviews';
import InfiniteScroll from '../../common/components/InfiniteScroll';
import ImageModal from './ImageModal';
import { fetchReviewsByOfficeNo } from '../../redux/reviewSlice';

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

const ReviewsDetailed = () => {
  const location = useLocation();
  const dispatch = useDispatch();
  const queryParams = new URLSearchParams(location.search);
  const officeNo = queryParams.get('no'); // URL에서 오피스 번호 가져오기

  const { data: reviews, status } = useSelector((state) => state.review);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    if (officeNo) {
      dispatch(fetchReviewsByOfficeNo(officeNo));
    }
  }, [dispatch, officeNo]);

  if (status === 'loading') return <h3>로딩중...</h3>;
  if (status === 'failed') return <h3>리뷰를 불러오는 데 실패했습니다.</h3>;

  const allImages = reviews
    .filter((r) => r.reviewAttachmentPath)
    .map((r) => r.reviewAttachmentPath);
  const previewImages = allImages.slice(0, 20);

  return (
    <Layout>
      <Title>리뷰 ({reviews.length})</Title>
      <Average>
        <p>리뷰 평점</p>
        <h1>
          <FontAwesomeIcon icon={faStar} color="#FFD43B" />
          {(
            reviews
              .map((r) => Number(r.score) || 0)
              .reduce((acc, score) => acc + score, 0) / reviews.length
          ).toFixed(1)}
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
        {reviews.map((review) => (
          <Reviews
            key={review.id}
            nick={review.memberName}
            scope={review.score}
            image={review.reviewAttachmentPath}
            reviewDetail={review.content}
          />
        ))}
      </InfiniteScroll>

      {/* 모달 오픈 시 해당 이미지들을 모두 prop으로 전달해준다. */}
      {isModalOpen && (
        <ImageModal images={allImages} onClose={() => setIsModalOpen(false)} />
      )}
    </Layout>
  );
};

export default ReviewsDetailed;
