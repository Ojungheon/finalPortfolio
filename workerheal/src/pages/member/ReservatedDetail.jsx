import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import styled from 'styled-components';
import GifState from '../../common/components/GifState';
import EmptyState from '../../common/components/EmptyState';

const API_SERVER = process.env.REACT_APP_SERVER_ROOT;

// 전체 컨테이너
const Container = styled.div`
  max-width: 800px;
  margin: 50px auto;
  font-family: 'Arial', sans-serif;
  padding: 20px;
  border: 1px solid #ddd;
  border-radius: 3px;
  box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.1);
`;

// 제목 스타일
const Title = styled.h2`
  font-size: 22px;
  font-weight: bold;
  margin-bottom: 15px;
`;

// 정보 행
const InfoRow = styled.div`
  display: flex;
  justify-content: space-between;
  padding: 8px 0;
  font-size: 16px;
  border-bottom: 1px solid #ddd;
`;

// 가격 정보
const PriceInfo = styled.div`
  background: #f8f8f8;
  padding: 15px;
  border-radius: 5px;
  font-size: 16px;
  margin-top: 15px;
`;

const ReservatedDetail = () => {
  const { productType, reservationId } = useParams(); // ✅ URL에서 상품 유형과 예약번호 가져오기
  const [reservation, setReservation] = useState(null);
  const [loading, setLoading] = useState(true);

  // ✅ API 요청할 URL을 상품 유형에 따라 다르게 설정
  const apiUrl = `http://${API_SERVER}/api/member/reservated/detail/${productType}/${reservationId}`;

  useEffect(() => {
    fetch(apiUrl, {
      method: 'GET',
      headers: {
        token: localStorage.getItem('token'),
        'Content-Type': 'application/json',
      },
    })
      .then((res) => res.json())
      .then((data) => {
        console.log('🔍 예약 상세 정보:', data);
        setReservation(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error('❌ 예약 상세 내역 불러오기 오류:', err);
        setLoading(false);
      });
  }, [apiUrl]);

  if (loading) {
    return <GifState message="예약 상세 내역을 불러오는 중..." />;
  }

  if (!reservation) {
    return <EmptyState message="해당 예약 내역을 찾을 수 없습니다." />;
  }

  return (
    <Container>
      <Title>예약 상세 내역</Title>

      <InfoRow>
        <span>예약번호:</span> <span>{reservation.reservationNo}</span>
      </InfoRow>

      <InfoRow>
        <span>이름:</span> <span>{reservation.name}</span>
      </InfoRow>

      <InfoRow>
        <span>지역:</span> <span>{reservation.region}</span>
      </InfoRow>

      <InfoRow>
        <span>상태:</span> <span>{reservation.status}</span>
      </InfoRow>

      <InfoRow>
        <span>신청 인원:</span> <span>{reservation.reservateNum}명</span>
      </InfoRow>

      <InfoRow>
        <span>이용 기간:</span>{' '}
        <span>
          {reservation.startDate} ~ {reservation.endDate}
        </span>
      </InfoRow>

      <PriceInfo>
        <InfoRow>
          <span>가격:</span> <span>{reservation.price.toLocaleString()}원</span>
        </InfoRow>
      </PriceInfo>
    </Container>
  );
};

export default ReservatedDetail;
