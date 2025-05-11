import React, { useState } from 'react';
import ListCheck from '../../common/components/ListCheck';
import Button1 from '../../components/Button1';
import styled from 'styled-components';
import HostHeader from '../../components/host/HostHeader';
import { useNavigate, useParams } from 'react-router-dom';
import { Button, Modal, Typography } from '@mui/material';
import ButtonS from '../../components/ButtonS';
import ActionButtons from '../../components/host/ActionButtons';
import { Box, width } from '@mui/system';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Edit from '../member/Edit';
import { faEdit } from '@fortawesome/free-solid-svg-icons';
// import Button1 from '../../components/user/Button1';

const API_SERVER = process.env.REACT_APP_SERVER_ROOT;

const ButtonArea = styled.div`
  display: flex;
  gap: 5px;
`;

const IconArea = styled.div`
  margin-left: 20px;
  display: flex;
  align-items: center;
`;

const RegistrationModal = ({
  open,
  onClose,
  onSelectOffice,
  onSelectLodging,
}) => {
  return (
    <Modal open={open} onClose={onClose}>
      <Box
        sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: 300,
          bgcolor: 'background.paper',
          borderRadius: '4px',
          p: 4,
          boxShadow: 24,
        }}
      >
        <Button
          fullWidth
          variant="contained"
          color="primary"
          sx={{ mb: 2 }}
          onClick={onSelectOffice}
        >
          오피스 등록
        </Button>
        <Button
          fullWidth
          variant="contained"
          color="secondary"
          onClick={onSelectLodging}
        >
          숙소 등록
        </Button>
      </Box>
    </Modal>
  );
};

const MyH1 = styled.h1``;

const WorkplaceStateCheck = () => {
  const navigate = useNavigate();
  const [modalOpen, setModalOpen] = useState(false);

  const handleRoomView = (businessNo) => {
    console.log('########### businessNo :' + businessNo);
    navigate(`/host/tempRoomtype/list/${businessNo}`);
  };

  // 모달 내 버튼 클릭 시 처리할 이벤트
  const handleSelectOffice = () => {
    setModalOpen(false);
    navigate('/host/office/insert'); // 오피스 등록 페이지 경로
  };

  const handleSelectLodging = () => {
    setModalOpen(false);
    navigate('/host/lodging/insert'); // 숙소 등록 페이지 경로
  };

  const handleUpdateOffice = () => {
    navigate('/host/office/update');
  };

  const handleUpdateLodging = () => {
    navigate('/host/lodging/update');
  };

  const handleLodgingDetail = (businessNo) => {
    navigate(`/host/lodging/detail/${businessNo}`);
  };

  const handleOfficeDetail = (businessNo) => {
    navigate(`/host/office/detail/${businessNo}`);
  };

  const columns = [
    { label: '번호', key: 'businessNo', window: '10%' },
    { label: '사업장명', key: 'businessName', width: '20%' },
    { label: '유형', key: 'businessType', width: '10%' },
    { label: '지역', key: 'businessRegion', width: '10%' },
    {
      label: '주소',
      key: 'businessAddress',
      width: '25%',
      render: (item) => (
        <span>
          {item.businessAddress} {item.businessAddressDetail}
        </span>
      ),
    },
    {
      label: '상태',
      key: 'businessRequestStatus',
      width: '10%',
      render: (item) => {
        let textColor = '';
        let statusText = '';
        switch (item.businessRequestStatus) {
          case '등록':
            textColor = 'blue';
            statusText = '등록';
            break;
          case '수정':
            textColor = '#2ecc71';
            statusText = '수정';
            break;
          case '반려':
            textColor = 'red';
            statusText = '반려';
            break;
          default:
            textColor = 'black';
            statusText = '대기';
        }
        return (
          <span style={{ color: textColor, fontWeight: 'bold' }}>
            {statusText}
          </span>
        );
      },
    },
    {
      label: '',
      key: 'action',
      width: '15%',
      render: (item) => (
        <ButtonArea>
          {/* <ButtonS>상세보기</ButtonS> */}
          {item.businessType === '숙소' && (
            <>
              <ButtonS
                onClick={() => {
                  handleLodgingDetail(item.businessNo);
                }}
              >
                상세보기
              </ButtonS>
              <ButtonS
                onClick={() => {
                  handleRoomView(item.businessNo);
                }}
              >
                객실보기
              </ButtonS>
            </>
          )}
          {item.businessType === '오피스' && (
            <>
              <ButtonS
                onClick={() => {
                  handleOfficeDetail(item.businessNo);
                }}
              >
                상세보기
              </ButtonS>
            </>
          )}
        </ButtonArea>
      ),
    },
  ];
  console.log(API_SERVER);

  const fetchUrl = `http://${API_SERVER}/api/host/workplace/tempList`;
  return (
    <div>
      <ListCheck
        title="사업장 등록 현황"
        columns={columns}
        fetchUrl={fetchUrl}
      />
    </div>
  );
};

export default WorkplaceStateCheck;
