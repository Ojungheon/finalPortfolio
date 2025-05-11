import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import HostHeader from '../../components/host/HostHeader';
import DetailsInput from '../../components/host/DetailsInput';
import ActionButtons from '../../components/host/ActionButtons';
import RoomtypeAndImageUpload from '../../components/host/RoomtypeAndImageUpload';
import RoomtypeFacility from '../../components/host/RoomtypeFacility';
import { useNavigate, useParams } from 'react-router-dom';
import { lodgingVo } from '../../redux/LodgingSlice';
import Swal from 'sweetalert2';
import ROrtAndImageUpload from '../../components/host/ROrtAndImageUpload';
import ROrtFacility from '../../components/host/ROrtFacility';
import ReadOnlyDetailsInput from '../../components/host/ReadOnlyDetailsInput';

const API_SERVER = process.env.REACT_APP_SERVER_ROOT;

const Layout = styled.div`
  display: grid;
  grid-template-columns: 1.1fr 0.9fr 1fr;
  grid-template-rows: minmax(0, 1fr) auto;
  gap: 20px; /* 요소 간격 */
  padding: 20px;
  height: 80vh;
`;

// 개별 요소 스타일
const AccommodationWrapper = styled.div`
  grid-row: 1; /* 첫 번째 열의 첫 번째 행 */
`;

const TagAndFacilityWrapper = styled.div`
  grid-column: 2;
  grid-row: 1; /* 첫 번째 열의 두 번째 행 */
  margin-left: 20px;
`;

const DetailsWrapper = styled.div`
  grid-column: 3;
  grid-row: 1; /* 두 번째 열을 두 개의 행에 걸쳐 배치 */
`;

const ActionButtonsWrapper = styled.div`
  grid-column: 1 / -1;
  grid-row: 2;
  margin-bottom: 20px;
`;

const Breadcrumb = styled.div`
  font-size: 1rem;
  font-weight: bold;
  margin-top: 20px;
  margin-left: 20px;
  margin-bottom: 20px;
`;

const DetailRoomtype = () => {
  const { no } = useParams();
  console.log('no : ', no);

  const { lodgingNo } = useParams();
  const navigate = useNavigate();

  // 이전으로 이동
  const handleGoBack = () => {
    navigate(-1);
  };

  const [detailData, setDetailData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      alert('인증 토큰이 없습니다. 다시 로그인하세요.');
      return;
    }
    fetch(`http://${API_SERVER}/api/host/tempRoomtype/detail?no=${no}`, {
      method: 'GET',
      headers: {
        token: `${token}`,
      },
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP 오류! 상태 코드: ${response.status}`);
        }
        return response.json();
      })
      .then((data) => {
        setDetailData(data);
        setLoading(false);
        console.log('Detail Data:', data);
      })
      .catch((err) => {
        console.error('데이터 불러오기 실패:', err);
        setError(err);
        setLoading(false);
      });
  }, [lodgingNo]);

  if (loading) {
    return <div>로딩 중...</div>;
  }
  if (error) {
    return <div>에러 발생: {error.message}</div>;
  }
  if (!detailData) {
    return <div>데이터가 없습니다.</div>;
  }

  return (
    <>
      <Breadcrumb>사업장 목록 &gt; 객실 목록 &gt; 객실 등록 &gt;</Breadcrumb>
      <Layout>
        <AccommodationWrapper>
          <ROrtAndImageUpload detailData={detailData} />
        </AccommodationWrapper>
        <TagAndFacilityWrapper>
          <ROrtFacility detailData={detailData} />
        </TagAndFacilityWrapper>
        <DetailsWrapper>
          <ReadOnlyDetailsInput detailData={detailData} />
        </DetailsWrapper>
        <ActionButtonsWrapper>
          <ActionButtons firstText="이전" onFirstButtonClick={handleGoBack} />
        </ActionButtonsWrapper>
      </Layout>
    </>
  );
};

export default DetailRoomtype;
