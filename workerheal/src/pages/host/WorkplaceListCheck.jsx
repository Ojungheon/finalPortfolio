import React, { useState } from 'react';
import ListCheck from '../../common/components/ListCheck';
import Button1 from '../../components/Button1';
import styled from 'styled-components';
import HostHeader from '../../components/host/HostHeader';
import { useNavigate, useParams } from 'react-router-dom';
import { Button, Modal, Typography } from '@mui/material';
import ButtonS from '../../components/ButtonS';
import ActionButtons from '../../components/host/ActionButtons';
import { Box } from '@mui/system';
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

const WorkplaceListCheck = () => {
  const navigate = useNavigate();
  const [modalOpen, setModalOpen] = useState(false);

  const handleRoomView = (businessNo) => {
    console.log('########### businessNo :' + businessNo);
    navigate(`/host/roomtype/list/${businessNo}`);
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

  const handleUpdateOffice = (businessNo) => {
    navigate(`/host/office/update/${businessNo}`);
  };

  const handleUpdateLodging = (businessNo) => {
    navigate(`/host/lodging/update/${businessNo}`);
  };

  const handleReserveOffice = (businessNo) => {
    navigate(`/host/workplace/officeReserve/${businessNo}`);
  };

  const handleReserveLodging = (businessNo) => {
    navigate(`/host/workplace/lodgingReserve/${businessNo}`);
  };

  const columns = [
    { label: '사업장명', key: 'businessName', width: '15%' },
    { label: '유형', key: 'businessType', width: '10%' },
    {
      label: '주소',
      key: 'businessAddress',
      width: '30%',
      render: (item) => (
        <span>
          {item.businessAddress} {item.businessAddressDetail}
        </span>
      ),
    },
    { label: '지역', key: 'businessRegion', width: '10%' },
    { label: '수용인원', key: 'businessCapacity', width: '10%' },
    {
      label: '작업',
      key: 'action',
      width: '15%',
      render: (item) => (
        <ButtonArea>
          <ButtonS
            onClick={() => {
              if (item.businessType === '오피스') {
                navigate(`/office/detail?no=${item.businessNo}`);
              } else if (item.businessType === '숙소') {
                navigate(`/lodging/detail?no=${item.businessNo}`);
              }
            }}
          >
            상세보기
          </ButtonS>
          <ButtonS
            onClick={() => {
              if (item.businessType === '숙소') {
                handleReserveLodging(item.businessNo);
              } else if (item.businessType === '오피스') {
                handleReserveOffice(item.businessNo);
              }
            }}
          >
            예약보기
          </ButtonS>
          {item.businessType === '숙소' && (
            <>
              <ButtonS
                onClick={() => {
                  handleRoomView(item.businessNo);
                }}
              >
                객실보기
              </ButtonS>
              <IconArea>
                <FontAwesomeIcon
                  icon={faEdit}
                  onClick={() => handleUpdateLodging(item.businessNo)}
                  style={{ fontSize: '1.5em', cursor: 'pointer' }}
                />
              </IconArea>
            </>
          )}
          {item.businessType === '오피스' && (
            <IconArea>
              <FontAwesomeIcon
                icon={faEdit}
                onClick={() => {
                  handleUpdateOffice(item.businessNo);
                }}
                style={{ fontSize: '1.5em', cursor: 'pointer' }}
              />
            </IconArea>
          )}
        </ButtonArea>
      ),
    },
  ];
  const fetchUrl = `http://${API_SERVER}/api/host/workplace/list`;
  return (
    <div>
      <ListCheck title="사업장 목록" columns={columns} fetchUrl={fetchUrl} />

      <ActionButtons
        firstText="삭제"
        secondText="등록"
        onSecondButtonClick={() => setModalOpen(true)}
      />
      <RegistrationModal
        open={modalOpen}
        onclose={() => setModalOpen(false)}
        onSelectOffice={handleSelectOffice}
        onSelectLodging={handleSelectLodging}
      />
    </div>
  );
};

export default WorkplaceListCheck;
