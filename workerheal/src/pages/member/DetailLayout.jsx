import React from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import { Alert } from "../../utils/toast";

// 스타일 정의
const Container = styled.div`
  max-width: 800px;
  margin: 50px auto;
  font-family: "Arial", sans-serif;
  padding: 20px;
  border: 1px solid #ddd;
  border-radius: 3px;
  box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.1);
`;

const Title = styled.h2`
  font-size: 22px;
  font-weight: bold;
  margin-bottom: 15px;
`;

const InfoRow = styled.div`
  display: flex;
  justify-content: space-between;
  padding: 8px 0;
  font-size: 16px;
  border-bottom: 1px solid #ddd;
`;

const BusinessName = styled.span`
  color: blue;
  text-decoration: underline;
  cursor: pointer;
  &:hover {
    color: darkblue;
  }
`;

const PriceInfo = styled.div`
  background: #f8f8f8;
  padding: 15px;
  border-radius: 5px;
  font-size: 16px;
  margin-top: 15px;
`;

const ButtonContainer = styled.div`
  display: flex;
  justify-content: space-between;
  margin-top: 20px;
`;

const ActionButton = styled.button`
  padding: 10px 20px;
  font-size: 16px;
  font-weight: bold;
  border: none;
  border-radius: 3px;
  cursor: pointer;
  ${({ status }) =>
    status === "refund"
      ? `background-color: red; color: white;`
      : `background-color: #8041FF; color: white;`}

  &:hover {
    opacity: 0.8;
  }
`;

const DetailLayout = ({ reservation, title, businessLabel }) => {
  const navigate = useNavigate();

  // 오늘 날짜
  const today = new Date().toISOString().split("T")[0];

  // 버튼 상태 결정
  const showRefundButton = reservation.startDate > today;
  const showReviewButton = reservation.endDate < today && !reservation.reviewed;
  const showReviewCheckButton = reservation.endDate < today && reservation.reviewed;

  // 환불 요청
  const handleRefund = () => {
    Alert({
      icon: "success",
      title: "환불 완료",
      text: "메인페이지로 이동합니다.",
    });
  };

  // 리뷰 작성
  const handleWriteReview = () => {
    navigate(`/review/write/${reservation.id}`);
  };

  // 리뷰 확인
  const handleCheckReview = () => {
    navigate(`/review/check/${reservation.id}`);
  };

  return (
    <Container>
      <Title>{title}</Title>

      <InfoRow>
        <span>예약번호:</span> <span>{reservation.id}</span>
      </InfoRow>

      <InfoRow>
        <span>{businessLabel}:</span>
        <BusinessName onClick={() => navigate(`/product/${reservation.id}`)}>
          {reservation.businessName}
        </BusinessName>
      </InfoRow>

      <InfoRow>
        <span>상태:</span> <span>{reservation.statusCode}</span>
      </InfoRow>

      <PriceInfo>
        <InfoRow>
          <span>가격:</span> <span>{reservation.price.toLocaleString()}원</span>
        </InfoRow>
      </PriceInfo>

      <ButtonContainer>
        {showRefundButton && <ActionButton status="refund" onClick={handleRefund}>환불하기</ActionButton>}
        {showReviewButton && <ActionButton onClick={handleWriteReview}>리뷰 작성</ActionButton>}
        {showReviewCheckButton && <ActionButton onClick={handleCheckReview}>리뷰 확인</ActionButton>}
      </ButtonContainer>
    </Container>
  );
};

export default DetailLayout;
