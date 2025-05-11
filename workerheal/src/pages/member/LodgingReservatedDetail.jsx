import React, { useEffect, useState, useRef } from 'react';
import { useParams } from 'react-router-dom';
import styled from 'styled-components';
import GifState from '../../common/components/GifState';
import EmptyState from '../../common/components/EmptyState';
import { getFacilityList } from '../../services/optionService'; // ✅ 편의시설 API 가져오기
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPrint } from '@fortawesome/free-solid-svg-icons'; // ✅ 프린터 아이콘 가져오기

const API_SERVER = process.env.REACT_APP_SERVER_ROOT;

// ✅ PDF 저장 버튼 스타일
const PdfButton = styled.button`
  background-color: #9d6bff;
  color: white;
  border: none;
  padding: 10px 20px;
  margin-top: 20px;
  border-radius: 5px;
  font-size: 16px;
  cursor: pointer;
  &:hover {
    opacity: 0.8;
  }
`;

// ✅ 전체 컨테이너
const Container = styled.div`
  max-width: 600px;
  margin: 50px auto;
  font-family: 'Arial', sans-serif;
  padding: 20px;
  border: 1px solid #ddd;
  border-radius: 3px;
  box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.1);
`;

// ✅ 제목 스타일
const Title = styled.h2`
  font-size: 22px;
  font-weight: bold;
  margin-bottom: 15px;
`;

// ✅ 정보 행
const InfoRow = styled.div`
  display: flex;
  justify-content: space-between;
  padding: 8px 0;
  font-size: 16px;
  border-bottom: 1px solid #ddd;

  /* ✅ 첫 번째 span(제목)을 굵게 처리 */
  span:first-child {
    font-weight: bold;
  }
`;

// ✅ 가격 정보
const PriceInfo = styled.div`
  background: #f8f8f8;
  padding: 15px;
  border-radius: 5px;
  font-size: 16px;
  margin-top: 15px;
`;

// ✅ 날짜 형식 변환 함수 (YYYY-MM-DD 형태로 변환)
const formatDate = (dateString) => {
  return dateString ? dateString.split(' ')[0] : ''; // 🔹 시분초 제거
};

// ✅ 침대 타입 변환 객체
const bedTypes = {
  1: '싱글',
  2: '슈퍼싱글',
  3: '더블',
  4: '퀸',
  5: '킹',
  6: '라지킹',
};

const LodgingReservatedDetail = () => {
  const pdfRef = useRef();
  const { reservationId } = useParams(); // URL에서 예약 ID 가져오기
  const [reservation, setReservation] = useState(null);
  const [loading, setLoading] = useState(true);
  const [facilities, setFacilities] = useState([]); // ✅ 편의시설 리스트
  const [roomFacilities, setRoomFacilities] = useState([]); // ✅ 객실 편의시설 리스트

  // ✅ PDF 저장 기능
  const handlePrint = () => {
    window.print(); // ✅ 프린터 없이 PDF 저장
  };

  // ✅ 상세 정보 가져오기
  useEffect(() => {
    fetch(
      `http://${API_SERVER}/api/member/reservated/lodgingDetail/${reservationId}`,
      {
        method: 'GET',
        headers: {
          token: sessionStorage.getItem('token'),
          'Content-Type': 'application/json',
        },
      }
    )
      .then((res) => res.json())
      .then((data) => {
        console.log('🔍 숙소 예약 상세 정보:', data);
        setReservation(data);
        setLoading(false);

        // ✅ 편의시설 코드 -> 실제 이름 변환
        getFacilityList(data.lodgingNo).then((facilityData) => {
          const facilityNames = data.facilitieCode.split(',').map((code) => {
            const facility = facilityData.find((f) => f.code === code);
            return facility ? facility.name : `알 수 없음(${code})`;
          });
          setFacilities(facilityNames);
        });

        // ✅ 객실 편의시설 변환
        console.log(data.roomFaciliteCode);
        console.log(data.roomFaciliteCode);
        getFacilityList(data.roomNo).then((roomFacilityData) => {
          const roomFacilityNames = data.roomFaciliteCode
            .split(',')
            .map((code) => {
              const facility = roomFacilityData.find((f) => f.code === code);
              return facility ? facility.name : `알 수 없음(${code})`;
            });
          setRoomFacilities(roomFacilityNames);
        });
      })
      .catch((err) => {
        console.error('❌ 숙소 예약 상세 내역 불러오기 오류:', err);
        setLoading(false);
      });
  }, [reservationId]);

  if (loading) {
    return <GifState message="숙소 예약 상세 내역을 불러오는 중..." />;
  }

  if (!reservation) {
    return <EmptyState message="해당 숙소 예약 내역을 찾을 수 없습니다." />;
  }

  return (
    <Container ref={pdfRef} className="print-only">
      <Title>숙소 예약 상세 내역</Title>

      <InfoRow>
        <span>숙소명:</span> <span>{reservation.name}</span>
      </InfoRow>

      <InfoRow>
        <span>지역:</span> <span>{reservation.region}</span>
      </InfoRow>

      <InfoRow>
        <span>우편번호:</span> <span>{reservation.postcode}</span>
      </InfoRow>

      <InfoRow>
        <span>주소:</span>{' '}
        <span>
          {reservation.roadAddress} {reservation.detailAddress}
        </span>
      </InfoRow>

      {/* 태훈 비활성화
       <InfoRow>
        <span>사업자 등록번호:</span> <span>{reservation.businessNo}</span>
      </InfoRow> */}

      <br />
      <br />
      <InfoRow>
        <span>예약번호:</span> <span>{reservation.reservationNo}</span>
      </InfoRow>

      <InfoRow>
        <span>예약자명:</span> <span>{reservation.memberName}</span>
      </InfoRow>

      <InfoRow>
        <span>신청 인원:</span> <span>{reservation.reservateNum}명</span>
      </InfoRow>

      <InfoRow>
        <span>이용 기간:</span>{' '}
        <span>
          {formatDate(reservation.startDate)} ~{' '}
          {formatDate(reservation.endDate)}
        </span>
      </InfoRow>

      <InfoRow>
        <span>예약일:</span>{' '}
        <span>{formatDate(reservation.reservateDate)}</span>
      </InfoRow>
      {/*  태훈 비활성화
      <InfoRow>
        <span>편의시설:</span>
        <span>
          {facilities.length > 0 ? facilities.join(', ') : '정보 없음'}
        </span>
      </InfoRow> */}

      <InfoRow>
        <span>입실시간:</span> <span>{reservation.checkIn}</span>
      </InfoRow>

      <InfoRow>
        <span>퇴실시간:</span> <span>{reservation.checkOut}</span>
      </InfoRow>

      <br />

      <InfoRow>
        <span>객실명:</span> <span>{reservation.roomName}</span>
      </InfoRow>

      <InfoRow>
        <span>침대 유형:</span>{' '}
        <span>{bedTypes[reservation.bed] || '미정'}</span>
      </InfoRow>

      {/* 태훈 비활성화
      <InfoRow>
        <span>객실 편의시설:</span> 
        <span>{roomFacilities.length > 0 ? roomFacilities.join(", ") : "정보 없음"}</span>
      </InfoRow> */}

      <PriceInfo>
        <InfoRow>
          <span>가격:</span> <span>{reservation.price.toLocaleString()}원</span>
        </InfoRow>
      </PriceInfo>

      <PdfButton onClick={handlePrint}>
        <FontAwesomeIcon icon={faPrint} size="lg" />
      </PdfButton>
    </Container>
  );
};

export default LodgingReservatedDetail;
