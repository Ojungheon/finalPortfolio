import React, { useEffect, useState, useRef } from 'react';
import { useParams } from 'react-router-dom';
import styled from 'styled-components';
import GifState from '../../common/components/GifState';
import EmptyState from '../../common/components/EmptyState';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPrint } from '@fortawesome/free-solid-svg-icons'; // ✅ 프린터 아이콘 가져오기
import { getFacilityList } from '../../services/optionService'; // ✅ 편의시설 API 가져오기

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

const PackageReservatedDetail = () => {
  const pdfRef = useRef();
  const { reservationNo } = useParams(); // 🔹 URL에서 예약번호 가져오기
  const [reservation, setReservation] = useState(null);
  const [loading, setLoading] = useState(true);
  const [officeFacilities, setOfficeFacilities] = useState([]); // ✅ 오피스 편의시설
  const [lodgingFacilities, setLodgingFacilities] = useState([]); // ✅ 숙소 편의시설

  const handlePrint = () => {
    window.print();
  };

  // ✅ 백엔드에서 데이터 불러오기
  useEffect(() => {
    console.log('🚨 예약번호 확인:', reservationNo); // 여기서 reservationNo가 제대로 전달되었는지 확인
    fetch(
      `http://${API_SERVER}/api/member/reservated/packageDetail/${reservationNo}`,
      {
        method: 'GET',
        headers: {
          token: sessionStorage.getItem('token'),
          'Content-Type': 'application/json',
        },
      }
    )
      .then((res) => {
        if (!res.ok) {
          console.warn('🚨 응답 오류:', res.status);
          return null;
        }
        return res.json();
      })
      .then((data) => {
        console.log('🔍 패키지 예약 상세 정보:', data);
        // setReservation(data);
        setReservation(data.packageInfo); // 태훈 수정
        setLoading(false);

        // ✅ 오피스 편의시설 코드 변환 - 태훈 비활성화
        // getFacilityList(data.officeNo).then((facilityData) => {
        //   const officeFacilityNames = data.officeFacilitie
        //     .split(',')
        //     .map((code) => {
        //       const facility = facilityData.find((f) => f.code === code);
        //       return facility ? facility.name : `알 수 없음(${code})`;
        //     });
        //   setOfficeFacilities(officeFacilityNames);
        // });
        // 태훈 수정
        getFacilityList(3).then((facilityData) => {
          const tempList = [];
          const extraNames = data.extraInfo.map((item) => {
            const extra = facilityData.find(
              (f) => f.code === item.faciliteCode
            );
            tempList.push(`${extra.name}(${item.amount})`);
          });

          setOfficeFacilities(tempList);
        });

        // ✅ 숙소 편의시설 코드 변환 - 태훈 비활성화
        // getFacilityList(data.lodgingNo).then((facilityData) => {
        //   const lodgingFacilityNames = data.lodgingFacilitie
        //     .split(',')
        //     .map((code) => {
        //       const facility = facilityData.find((f) => f.code === code);
        //       return facility ? facility.name : `알 수 없음(${code})`;
        //     });
        //   setLodgingFacilities(lodgingFacilityNames);
        // });
      })
      .catch((err) => {
        console.error('❌ 예약 상세 내역 불러오기 오류:', err);
        setLoading(false);
      });
  }, [reservationNo]);

  // ✅ 로딩 중일 때 스피너 표시
  if (loading) {
    return <GifState message="예약 상세 내역을 불러오는 중..." />;
  }

  // ✅ 데이터가 없는 경우 (예약번호가 잘못되었거나 데이터 없음)
  if (!reservation) {
    return <EmptyState message="해당 예약 내역을 찾을 수 없습니다." />;
  }

  return (
    <Container ref={pdfRef} className="print-only">
      <Title>패키지 예약 상세 내역</Title>

      <InfoRow>
        <span>예약번호:</span> <span>{reservation.reservationNo}</span>
      </InfoRow>
      <InfoRow>
        <span>패키지명:</span> <span>{reservation.packageName}</span>
      </InfoRow>

      <InfoRow>
        <span>상세 설명:</span> <span>{reservation.detail}</span>
      </InfoRow>

      <InfoRow>
        <span>태그:</span> <span>{reservation.tag}</span>
      </InfoRow>

      <InfoRow>
        <span>패키지 기간:</span>{' '}
        <span>
          {formatDate(reservation.packageStart)} ~{' '}
          {formatDate(reservation.packageEnd)}
        </span>
      </InfoRow>

      <br />

      <InfoRow>
        <span>오피스명:</span> <span>{reservation.officeName}</span>
      </InfoRow>

      <InfoRow>
        <span>오피스 전화번호:</span> <span>{reservation.officePhone}</span>
      </InfoRow>

      <InfoRow>
        <span>오피스 주소:</span>{' '}
        <span>
          {reservation.officeAddress1} {reservation.officeAddress2}{' '}
          {reservation.officeAddress3}
        </span>
      </InfoRow>
      {/* 태훈 비활성화
      <InfoRow>
        <span>오피스 이용 기간:</span>{' '}
        <span>
          {formatDate(reservation.officeStart)} ~{' '}
          {formatDate(reservation.officeEnd)}
        </span>
      </InfoRow> */}

      {/*  태훈 비활성화
      <InfoRow>
        <span>오피스 편의시설:</span>
        <span>
          {officeFacilities.length > 0
            ? officeFacilities.join(', ')
            : '정보 없음'}
        </span>
      </InfoRow> */}

      <InfoRow>
        <span>오피스 추가옵션:</span>
        <span>
          {officeFacilities.length > 0
            ? officeFacilities.join(', ')
            : '정보 없음'}
        </span>
      </InfoRow>

      <br />

      <InfoRow>
        <span>숙소명:</span> <span>{reservation.lodgingName}</span>
      </InfoRow>

      <InfoRow>
        <span>숙소 전화번호:</span> <span>{reservation.lodgingPhone}</span>
      </InfoRow>

      <InfoRow>
        <span>숙소 주소:</span>{' '}
        <span>
          {reservation.lodgingAddress1} {reservation.lodgingAddress2}{' '}
          {reservation.lodgingAddress3}
        </span>
      </InfoRow>

      {/*   태훈 비활성화
      <InfoRow>
        <span>숙소 편의시설:</span> 
        <span>{lodgingFacilities.length > 0 ? lodgingFacilities.join(", ") : "정보 없음"}</span>
      </InfoRow> */}

      {/* 태훈 비활성화
      <InfoRow>
        <span>숙소 이용 기간:</span>{' '}
        <span>
          {formatDate(reservation.lodgingStart)} ~{' '}
          {formatDate(reservation.lodgingEnd)}
        </span>
      </InfoRow> */}

      <br />

      <InfoRow>
        <span>관광명:</span> <span>{reservation.tourSpotName}</span>
      </InfoRow>

      <InfoRow>
        <span>관광 주소:</span>{' '}
        <span>
          {reservation.tourSpotAddress} {reservation.tourSpotDetailAddress}
        </span>
      </InfoRow>

      <InfoRow>
        <span>관광 이용기간:</span>{' '}
        <span>
          {formatDate(reservation.tourStart)} ~{' '}
          {formatDate(reservation.tourEnd)}
        </span>
      </InfoRow>

      <InfoRow>
        <span>관광 인원:</span> <span>{reservation.amount}</span>
      </InfoRow>

      <PriceInfo>
        <InfoRow>
          <span>총 가격:</span>{' '}
          <span>{reservation.packagePrice.toLocaleString()}원</span>
        </InfoRow>
      </PriceInfo>

      <PdfButton onClick={handlePrint}>
        <FontAwesomeIcon icon={faPrint} size="lg" />
      </PdfButton>
    </Container>
  );
};

export default PackageReservatedDetail;
