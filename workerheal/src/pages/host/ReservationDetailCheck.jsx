import React, { useEffect, useState } from 'react';
import HostHeader from '../../components/host/HostHeader';
import styled from 'styled-components';
import { display } from '@mui/system';
import { data, useNavigate, useParams } from 'react-router-dom';

const API_SERVER = process.env.REACT_APP_SERVER_ROOT;

// 페이지 전체
const PageContainer = styled.div`
  min-height: 100vh;
`;

const Breadcrumb = styled.div`
  font-size: 1rem;
  font-weight: bold;
  margin: 20px;
  border-bottom: 2px solid #ffaa0c;
  padding-bottom: 10px;
`;

const DetailContainer = styled.div`
  padding: 24px;
`;

const InfoTable = styled.table`
  width: 60%;
  margin: 0 auto;
  border-collapse: collapse;

  td {
    vertical-align: middle;
    text-align: center;
    padding: 30px;
  }

  .label {
    font-weight: bold;
    width: 60px;
  }

  .value {
    width: 150px;
    border-bottom: 1px solid #ffaa0c;
  }

  tr {
    margin-bottom: 10px;
  }
`;

const ButtonWrapper = styled.div`
  display: flex;
  justify-content: center;
  margin-top: 70px;
`;

const BackButton = styled.button`
  background: #ffaa0c;
  color: white;
  padding: 10px 24px;
  border: none;
  border-radius: 20px;
  font-size: 1rem;
  cursor: pointer;
`;

const ReservationDetailCheck = () => {
  const navigate = useNavigate();
  const [reservationDetail, setReservationDetail] = useState(null);
  const { reservationNo } = useParams();
  console.log('reservationNo :', reservationNo);

  const handleBack = () => {
    navigate(-1);
  };
  useEffect(() => {
    fetch(
      `http://${API_SERVER}/api/host/workplace/officeReserveDetail?reservationNo=${reservationNo}`
    )
      .then((response) => response.json())
      .then((data) => {
        setReservationDetail(data);
      })
      .catch((error) => {
        console.error('Error fetching reservation detail:', error);
      });
  }, [reservationNo]);
  return (
    <PageContainer>
      <Breadcrumb>
        사업장 목록 &gt; 사업장 예약목록 &gt; 사업장 상세조회 &gt;
      </Breadcrumb>
      <DetailContainer>
        <InfoTable>
          <tbody>
            <tr>
              <td className="label">이름</td>
              <td className="value">김철수</td>
              <td className="label">닉네임</td>
              <td className="value">okelf</td>
            </tr>
            <tr>
              <td className="label">연락처</td>
              <td className="value">010-6541-5484</td>
              <td className="label">이메일</td>
              <td className="value">narlalajd@abc.co.kr</td>
            </tr>
            <tr>
              <td className="label">이용시작일</td>
              <td className="value">202305111</td>
              <td className="label">이용종료일</td>
              <td className="value">202305115</td>
            </tr>
            <tr>
              <td className="label">객실명</td>
              <td className="value">스탠다드</td>
              <td className="label">납부금액</td>
              <td className="value">40,000</td>
            </tr>
            <tr>
              <td className="label">신청인원</td>
              <td className="value">3</td>
              <td className="label">결제수단</td>
              <td className="value">카카오</td>
            </tr>
            <tr>
              <td className="label">예약번호</td>
              <td className="value">{reservationNo}</td>
              <td className="label">객실등록번호</td>
              <td className="value">L20230510052</td>
            </tr>
            <tr>
              <td className="label">예약일자</td>
              <td className="value">20250105</td>
            </tr>
          </tbody>
        </InfoTable>

        <ButtonWrapper>
          <BackButton onClick={handleBack}>이전</BackButton>
        </ButtonWrapper>
      </DetailContainer>
    </PageContainer>
  );
};

export default ReservationDetailCheck;
