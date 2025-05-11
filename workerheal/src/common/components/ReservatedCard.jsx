import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { Toast, Alert } from '../../utils/toast';
import ReviewModal from '../../components/member/ReviewModal';
import ReviewConfirmModal from '../../components/member/ReviewConfirmModal';

const API_SERVER = process.env.REACT_APP_SERVER_ROOT;

// 카드 스타일
const Card = styled.div`
  position: relative;
  border-radius: 10px;
  overflow: hidden;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.15);
  transition: transform 0.3s ease-in-out;
  &:hover {
    transform: scale(1.01);
  }
`;

// 이미지 컨테이너
const ImageWrapper = styled.div`
  position: relative;
  width: 100%;
  height: 200px;
  cursor: pointer;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`;

// 카테고리 태그
const CategoryTag = styled.div`
  position: absolute;
  top: 10px;
  left: 10px;
  background: ${({ productType }) =>
    productType === '숙소'
      ? '#9ddcff'
      : productType === '오피스'
      ? '#FFD28F'
      : productType === '패키지'
      ? '#E2B6FF'
      : '#ccc'};
  color: black;
  padding: 5px 10px;
  border-radius: 5px;
  font-weight: bold;
`;

// 카드 정보
const CardInfo = styled.div`
  background: ${({ productType }) =>
    productType === '숙소'
      ? 'linear-gradient(135deg, #9ddcff, white)'
      : productType === '오피스'
      ? 'linear-gradient(135deg, #FFD28F, white)'
      : productType === '패키지'
      ? 'linear-gradient(135deg, #E2B6FF, white)'
      : 'white'};
  padding: 15px;
  font-size: 13px;
`;

// 버튼 스타일
const ButtonContainer = styled.div`
  display: flex;
  gap: 10px;
  margin-top: 10px;
`;

const ActionButton = styled.button`
  padding: 8px 12px;
  font-size: 14px;
  font-weight: bold;
  border-radius: 5px;
  width: 100%;
  border: none;
  cursor: pointer;
  color: white;
  background: ${({ type }) =>
    type === 'refund'
      ? '#FF6B6B'
      : type === 'writeReview'
      ? '#FFA500'
      : type === 'viewReview'
      ? '#2F80ED'
      : '#ccc'};

  &:hover {
    opacity: 0.8;
  }
`;

const ReservatedCard = ({ item, onRemove }) => {
  const navigate = useNavigate();
  const currentDate = new Date(); // 현재 날짜
  const startDate = new Date(item.startDate); // 이용 시작일
  const endDate = new Date(item.endDate); // 이용 종료일
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [showConfirmReviewModal, setShowConfirmReviewModal] = useState(false);
  const [isDeleted, setIsDeleted] = useState(false);
  const [reviewed, setReviewed] = useState(false);
  const [reviewData, setReviewData] = useState(null); // 📌 서버에서 가져온 리뷰 데이터

  useEffect(() => {
    // 예약번호 공백 제거 후 안전한 형식으로 인코딩
    const trimmedReservationNo = encodeURIComponent(item.id.trim());
    const encodedProductType = encodeURIComponent(item.productType.trim());

    console.log(
      `🔍 [DEBUG] 요청 URL: /api/member/reservated/reviewed/${trimmedReservationNo}/${encodedProductType}`
    );

    fetch(
      `http://${API_SERVER}/api/member/reservated/reviewed/${trimmedReservationNo}/${encodedProductType}`,
      {
        headers: { token: sessionStorage.getItem('token') },
      }
    )
      .then((res) => res.json())
      .then((data) => {
        console.log(
          `✅ [DEBUG] 리뷰 여부 확인 - 예약번호: ${trimmedReservationNo}, 상품 타입: ${item.productType} 응답 데이터:`,
          data
        );
        setReviewed(data);
      })
      .catch((error) => console.error('🚨 리뷰 여부 조회 실패:', error));
  }, [item.id, item.productType]);

  // 날짜를 "YYYY-MM-DD" 형식으로 변환하는 함수
  const formatDate = (date) => {
    if (!date) return '';
    return date.toISOString().split('T')[0]; // "YYYY-MM-DD" 형식만 반환
  };

  // 버튼 상태 결정
  const showRefundButton = startDate > currentDate; // 환불 가능 여부

  // 예약 취소 처리 함수
  const handleRefundClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    const reservationNo = item.id;
    console.log('reservationNo :', reservationNo);

    // 경고창 띄우기 (예약 취소 여부 확인)
    Alert({
      title: '정말로 예약을 취소하시겠습니까?',
      text: '예약 취소 후에는 되돌릴 수 없습니다.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: '확인',
      cancelButtonText: '취소',
    }).then((result) => {
      if (result.isConfirmed) {
        // 취소 버튼 클릭 후 처리 (여기서 실제 API 호출)
        fetch(`http://${API_SERVER}/api/member/reservated/cancel/${item.id}`, {
          method: 'DELETE',
          headers: {
            token: sessionStorage.getItem('token'),
            'Content-Type': 'application/json',
          },
        })
          .then((data) => {
            Alert({
              title: '예약 취소 완료',
              text: '예약이 성공적으로 취소되었습니다.',
              icon: 'success',
            }).then(() => {
              setIsDeleted(true);
              if (onRemove) onRemove(item.id); // 부모 컴포넌트에도 삭제 요청
            });
          })
          .catch((error) => {
            console.error('예약 취소 실패:', error);
            Alert({
              title: '예약 취소 실패',
              text: '예상치 못한 오류가 발생했습니다. 다시 시도해주세요.',
              icon: 'error',
            });
          });
      }
    });
  };

  if (isDeleted) return null;
  // 리뷰쓰기 처리 함수
  const handleWriteReviewClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setShowReviewModal(true);

    // 리뷰 쓰기 모달 (사진 첨부 1개, 별점 , 내용 )
  };
  // 리뷰 제출 API 요청
  const handleReviewSubmit = (formData) => {
    const member = JSON.parse(sessionStorage.getItem('member')); //서버에서 빼오기

    // ✅ FormData → JSON 변환
    const reviewData = {
      memberNo: member?.no,
      productType: item?.productType, // 오피스, 숙소, 패키지
      reservationNo: item?.id.trim(),
      content: formData.get('content'),
      score: Number(formData.get('score')),
    };

    formData.append('memberNo', member?.no);
    formData.append('productType', item?.productType);
    formData.append('reservationNo', item?.id.trim());

    console.log('✅ 리뷰 요청 데이터 확인', formData);

    fetch(`http://${API_SERVER}/api/member/reservated/review`, {
      method: 'POST',
      headers: {
        token: sessionStorage.getItem('token'),
        // "Content-Type": "application/json",
      },
      body: formData,
    })
      .then(async (res) => {
        if (!res.ok) {
          const error = await res.json();
          throw new Error(error.error || '리뷰 등록 실패');
        }
        return res.json(); // ✅ JSON 데이터 변환
      })
      .then((data) => {
        Alert({
          icon: 'success',
          title: '리뷰 등록 완료!',
          text: data.message,
        }).then(() => {
          setShowReviewModal(false);
          // ✅ 리뷰가 작성되었는지 다시 확인
          fetch(
            `http://${API_SERVER}/api/member/reservated/${item.id}/${item.productType}`,
            {
              headers: { token: sessionStorage.getItem('token') },
            }
          )
            .then((res) => res.json())
            .then((updatedReviewed) => {
              setReviewed(updatedReviewed); // ✅ 최신 리뷰 여부 업데이트
            });
        });
      })
      .catch((error) => {
        console.error('리뷰 등록 실패:', error);
        Alert({
          icon: 'error',
          title: '리뷰 등록 실패',
          text: error.message,
        });
      });
  };

  // 📌 리뷰 확인 버튼 클릭 → 서버에서 리뷰 정보 가져옴
  const handleConfirmReviewClick = (e) => {
    e.preventDefault();
    e.stopPropagation();

    fetch(
      `http://${API_SERVER}/api/member/reservated/review/${item.id}/${item.productType}`,
      {
        headers: { token: sessionStorage.getItem('token') },
      }
    )
      .then((res) => res.json())
      .then((data) => {
        setReviewData(data);
        setShowConfirmReviewModal(true);
      })
      .catch((err) => {
        console.error('리뷰 데이터 불러오기 오류:', err);
        Alert({
          icon: 'error',
          title: '리뷰 불러오기 실패',
          text: '리뷰 정보를 불러오는 데 실패했습니다.',
        });
      });
  };

  return (
    <>
      <Card
        onClick={() => {
          console.log(item);
          console.log(
            '🔗 이동할 예약번호:',
            item.id,
            '상품 유형:',
            item.productType
          );

          if (item.id) {
            if (item.productType === '오피스') {
              navigate(`/member/reservated/officeDetail/${item.id}`);
            } else if (item.productType === '숙소') {
              navigate(`/member/reservated/lodgingDetail/${item.id}`);
            } else if (item.productType === '패키지') {
              navigate(`/member/reservated/packageDetail/${item.id}`);
            } else {
              console.warn('🚨 처리되지 않은 상품 유형:', item.productType);
            }
          } else {
            console.warn('🚨 예약번호가 없습니다!');
          }
        }}
      >
        <ImageWrapper>
          <img src={item.img} alt={item.title} />
          <CategoryTag productType={item.productType}>
            {item.productType}
          </CategoryTag>
        </ImageWrapper>

        <CardInfo productType={item.productType}>
          <h3>{item.title}</h3>
          <p>{item.location}</p>
          <p>
            {formatDate(startDate)} ~ {formatDate(endDate)}
          </p>{' '}
          {/* ✅ 날짜 형식 변경 */}
          <p>가격: {item.price.toLocaleString()}원</p>
          {/* 버튼 영역 */}
          <ButtonContainer>
            {showRefundButton ? (
              <ActionButton type="refund" onClick={handleRefundClick}>
                예약 취소
              </ActionButton>
            ) : (
              <>
                {!reviewed ? (
                  <ActionButton
                    type="writeReview"
                    onClick={handleWriteReviewClick}
                  >
                    리뷰 쓰기
                  </ActionButton>
                ) : (
                  <ActionButton
                    type="viewReview"
                    onClick={(e) => handleConfirmReviewClick(e)}
                  >
                    리뷰 확인
                  </ActionButton>
                )}
              </>
            )}
          </ButtonContainer>
        </CardInfo>
      </Card>
      {showReviewModal && (
        <ReviewModal
          onClose={() => setShowReviewModal(false)}
          onSubmit={handleReviewSubmit}
        />
      )}

      {/* 리뷰 확인 모달 */}
      {showConfirmReviewModal && reviewData && (
        <ReviewConfirmModal
          reviewData={reviewData}
          isReadOnly={true} // 📌 읽기 전용 모드로 설정
          onClose={() => setShowConfirmReviewModal(false)}
        />
      )}
    </>
  );
};

export default ReservatedCard;
