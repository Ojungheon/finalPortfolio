import { width } from '@mui/system';
import React, { useEffect, useState } from 'react';
import HostHeader from '../../components/host/HostHeader';
import { List } from '@mui/material';
import ListCheck from '../../common/components/ListCheck';
import Button1 from '../../components/Button1';
import styled from 'styled-components';
import { useNavigate, useParams } from 'react-router-dom';
import ActionButtons from '../../components/host/ActionButtons';

const API_SERVER = process.env.REACT_APP_SERVER_ROOT;

const ButtonArea = styled.div`
  display: flex;
`;

const columns = [
  { label: '객실명', key: 'name', width: '15%' },
  { label: '1박 가격(원)', key: 'price', width: '15%' },
  {
    label: '침대유형',
    key: 'bedType',
    width: '30%',
    render: (item) => (
      <span>
        싱글 {item.singleBed} / 더블 {item.doubleBed}
      </span>
    ),
  },
  { label: '수용인원', key: 'sleeps', width: '15%' },
  { label: '객실 수', key: 'amount', width: '15%' },
  {
    labal: '작업',
    key: 'action',
    width: '10%',
    render: (item) => (
      <ButtonArea>
        <Button1>상세보기</Button1>
      </ButtonArea>
    ),
  },
];

const ApprovalRoomType = () => {
  const navigate = useNavigate();
  const { lodgingNo } = useParams();
  console.log('lodging 값:', lodgingNo);

  const [fetchUrl, setFetchUrl] = useState('');

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      alert('로그인이 필요합니다.');
      navigate('/host/login');
      return;
    }

    setFetchUrl(
      `http://${API_SERVER}/api/host/roomtype/list?lodgingNo=${lodgingNo}`
    );
  }, [lodgingNo, navigate]);

  return (
    <div>
      <ListCheck
        title="사업장 목록 &gt; 숙소명 &gt; 객실 목록 조회"
        columns={columns}
        fetchUrl={fetchUrl}
      />
    </div>
  );
};

export default ApprovalRoomType;
