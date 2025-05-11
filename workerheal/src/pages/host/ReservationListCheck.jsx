import React from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import ListCheck from '../../common/components/ListCheck';
import { width } from '@mui/system';
import styled from 'styled-components';
import ButtonS from '../../components/ButtonS';

const API_SERVER = process.env.REACT_APP_SERVER_ROOT;

const ButtonArea = styled.div`
  display: flex;
  gap: 5px;
`;

const formatPhone = (phone) => {
  if (!phone) return '';
  const phoneStr = phone.toString().replace(/\D/g, '');
  return phoneStr.length === 11
    ? `${phoneStr.substring(0, 3)}-${phoneStr.substring(
        3,
        7
      )}-${phoneStr.substring(7, 11)}`
    : phone;
};

const BackButton = styled.button`
  background: #ffaa0c;
  color: white;
  padding: 10px 24px;
  border: none;
  border-radius: 20px;
  font-size: 1rem;
  cursor: pointer;
`;

const ButtonWrapper = styled.div`
  display: flex;
  justify-content: flex-start;
  margin-top: 70px;
`;

const ReservationListCheck = () => {
  const navigate = useNavigate();
  const { businessNo } = useParams();
  const location = useLocation();

  const handleBack = () => {
    navigate(-1);
  };
  const columns = [
    { label: '번호', key: 'reservationNo', width: '10%' },
    { label: '예약자명', key: 'name', width: '20%' },
    {
      label: '연락처',
      key: 'phone',
      width: '20%',
      render: (item) => formatPhone(item.phone),
    },
    { label: '예약일자', key: 'reservateDate', width: '15%' },
    {
      label: '기간',
      key: 'period',
      width: '25%',
      render: (item) => `${item.startDate} ~ ${item.endDate}`,
    },
    {
      label: '',
      key: 'action',
      width: '10%',
      render: (item) => (
        <ButtonArea>
          <ButtonS
            onClick={() =>
              navigate(
                `/host/workplace/officeReserveDetail/${item.reservationNo}`
              )
            }
          >
            상세보기
          </ButtonS>
        </ButtonArea>
      ),
    },
  ];

  // 현재 경로에 따라 적절한 API 엔드포인트를 설정
  let fetchUrl = '';
  if (location.pathname.includes('lodgingReserve')) {
    fetchUrl = `http://${API_SERVER}/api/host/workplace/lodgingReserve?lodgingNo=${businessNo}`;
  } else if (location.pathname.includes('officeReserve')) {
    fetchUrl = `http://${API_SERVER}/api/host/workplace/officeReserve?officeNo=${businessNo}`;
  }
  return (
    <div>
      <ListCheck
        title="사업장 예약목록"
        columns={columns}
        fetchUrl={fetchUrl}
      />
    </div>
  );
};

export default ReservationListCheck;
