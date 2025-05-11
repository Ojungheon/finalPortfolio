import React, { useState } from 'react';
import styled from 'styled-components';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHeart } from '@fortawesome/free-solid-svg-icons';
import NoticeModal from './user/NoticeModal';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { Toast, Alert } from '../../utils/toast';

const API_SERVER = process.env.REACT_APP_SERVER_ROOT;

// 카드 스타일 유지
const Card = styled.div`
  position: relative;
  width: 275px;
  border-radius: 10px;
  overflow: hidden;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.15);
  transition: transform 0.3s ease-in-out;
  &:hover {
    transform: scale(1.03);
  }
`;

// 이미지 컨테이너 유지
const ImageWrapper = styled.div`
  position: relative;
  width: 100%;
  height: 200px;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`;

// 카테고리 태그 유지
const CategoryTag = styled.div`
  position: absolute;
  top: 10px;
  left: 10px;
  background: ${({ category }) =>
    category === '숙소'
      ? '#9ddcff'
      : category === '오피스'
      ? '#FFD28F'
      : category === '패키지'
      ? '#E2B6FF'
      : '#F7B267'};
  color: black;
  padding: 5px 10px;
  border-radius: 5px;
  font-weight: bold;
`;

// 찜 버튼 유지
const HeartButton = styled.button`
  position: absolute;
  top: 10px;
  right: 10px;
  background: none;
  border: none;
  font-size: 24px;
  cursor: pointer;
  color: red;
`;

// 카드 정보 유지
const CardInfo = styled.div`
  background: ${({ category }) =>
    category === '숙소'
      ? 'linear-gradient(135deg, #9ddcff, white)'
      : category === '오피스'
      ? 'linear-gradient(135deg, #FFD28F, white)'
      : category === '패키지'
      ? 'linear-gradient(135deg, #E2B6FF, white)'
      : 'linear-gradient(135deg, #f5860f, white)'};
  padding: 15px;
  font-size: 13px;
`;

// 상품명 유지
const ItemTitle = styled.p`
  font-weight: bold;
  font-size: 15px;
  margin-bottom: 5px;
`;
const StarContainer = styled.div`
  font-size: 20px;
  color: gold; /* ⭐ 노란색 */
  letter-spacing: 2px;
`;

const StyledLink = styled(Link)`
  text-decoration: none;
  color: inherit;
`;
const openWithSession = (url) => {
  const sessionData = JSON.stringify(sessionStorage);
  const newWindow = window.open(url, '_blank');

  newWindow.onload = () => {
    newWindow.sessionStorage.setItem('sessionData', sessionData);
  };
};
// 🔹 평점(숫자)을 별(★) 문자열로 변환하는 함수
const renderStars = (score) => {
  const fullStars = Math.floor(score); // ⭐ 꽉 찬 별 개수
  const halfStar = score % 1 !== 0; // ⭐ 반쪽짜리 별이 있는지 확인
  const emptyStars = 5 - fullStars - (halfStar ? 1 : 0); // ⭐ 빈 별 개수

  return (
    <>
      {'★'.repeat(fullStars)} {/* ✅ 꽉 찬 별 */}
      {halfStar && '☆'} {/* ✅ 반쪽짜리 별 */}
      {'☆'.repeat(emptyStars)} {/* ✅ 빈 별 */}
    </>
  );
};

const SavedCard = ({ item, onRemove }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const member = useSelector((state) => state.member.member);

  const handleUnsave = () => {
    fetch(`http://${API_SERVER}/api/member/saved/${member.no}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        token: sessionStorage.getItem('token'),
      },
      body: JSON.stringify({
        name: item.title,
        productType: item.category,
      }),
    })
      .then((res) => {
        if (res.ok) {
          Toast.fire({
            icon: 'success',
            title: '찜 삭제가 완료 되었습니다.',
          });
          onRemove(item.title, item.category);
        } else {
          Toast.fire({
            icon: 'error',
            title: '찜 해제 실패 : 잠시후 이용해주세요',
          });
        }
      })
      .catch((err) => {
        console.error('찜 해제 오류:', err);
        Toast.fire({
          icon: 'error',
          title: '찜 해제 실패 : 잠시후 이용해주세요',
        });
      });
  };

  // 상품 상세 페이지 URL 생성
  const getDetailUrl = () => {
    console.log(item.no);

    switch (item.category) {
      case '숙소':
        return `/lodging/detail/?no=${encodeURIComponent(item.no)}`;
      case '오피스':
        return `/office/detail/?no=${encodeURIComponent(item.no)}`;
      case '패키지':
        return `/package/detail/?no=${encodeURIComponent(item.no)}`;
      default:
        return '/';
    }
  };

  return (
    <>
      <Card>
        <StyledLink onClick={() => openWithSession(getDetailUrl())}>
          <ImageWrapper>
            <img src={item.img} alt={item.title} />
            <CategoryTag category={item.category}>{item.category}</CategoryTag>
          </ImageWrapper>
          <CardInfo category={item.category}>
            <ItemTitle>{item.title}</ItemTitle>
            <p>{item.location}</p>
            <p>{item.tag}</p>
            <p>평점: {renderStars(item.score)}</p>
          </CardInfo>
        </StyledLink>

        <HeartButton onClick={() => setIsModalOpen(true)}>
          <FontAwesomeIcon icon={faHeart} />
        </HeartButton>
      </Card>

      {isModalOpen &&
        Alert({
          icon: 'question',
          title: '찜 해제를 하시겠습니까?',
          showCancelButton: true,
          confirmButtonText: '네', // 확인 버튼
          cancelButtonText: '아니요', // 취소 버튼
        }).then((result) => {
          if (result.isConfirmed) {
            handleUnsave();
            setIsModalOpen(false);
          } else if (result.isDismissed) {
            setIsModalOpen(false);
          }
        })}
    </>
  );
};

export default SavedCard;
