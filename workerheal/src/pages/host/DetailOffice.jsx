import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import ROofficeAndImageUpload from '../../components/host/ROofficeAndImageUpload';
import ROofficeTagAndFacility from '../../components/host/ROofficeTagAndFacility';
import ActionButtons from '../../components/host/ActionButtons';
import { useNavigate, useParams } from 'react-router-dom';
import ROofficeDetailsInput from '../../components/host/ROofficeDetailsInput';

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
`;

const DetailsWrapper = styled.div`
  grid-column: 3;
  grid-row: 1; /* 두 번째 열을 두 개의 행에 걸쳐 배치 */
`;

const ActionButtonsWrapper = styled.div`
  grid-column: 1 / -1;
  grid-row: 2;
`;

const Breadcrumb = styled.div`
  font-size: 1rem;
  font-weight: bold;
  margin-top: 20px;
  margin-left: 20px;
  margin-bottom: 20px;
`;

const DetailOffice = () => {
  const navigate = useNavigate();
  const { businessNo } = useParams();

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
    fetch(`http://${API_SERVER}/api/host/office/detail?no=${businessNo}`, {
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
  }, [businessNo]);

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
      <Breadcrumb>사업장 등록현황 &gt; 오피스 상세조회 &gt; </Breadcrumb>
      <Layout>
        <AccommodationWrapper>
          <ROofficeAndImageUpload detailData={detailData} />
        </AccommodationWrapper>
        <TagAndFacilityWrapper>
          <ROofficeTagAndFacility detailData={detailData} />
        </TagAndFacilityWrapper>
        <DetailsWrapper>
          <ROofficeDetailsInput detailData={detailData} />
        </DetailsWrapper>
        <ActionButtonsWrapper>
          <ActionButtons firstText="이전" onFirstButtonClick={handleGoBack} />
        </ActionButtonsWrapper>
      </Layout>
    </>
  );
};

export default DetailOffice;
