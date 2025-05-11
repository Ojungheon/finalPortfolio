import React, { useState } from 'react';
import styled from 'styled-components';
import HostHeader from '../../components/host/HostHeader';
import TagAndFacility from '../../components/host/TagAndFacility';
import DetailsInput from '../../components/host/DetailsInput';
import ActionButtons from '../../components/host/ActionButtons';
import AccommodationAndImageUpload from '../../components/host/AccommodationAndImageUpload';
import OfficeAndImageUpload from '../../components/host/OfficeAndImageUpload';
import OfficeTagAndFacility from '../../components/host/OfficeTagAndFacility';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';

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

// 모달 상태 관리
// const [isModalOpen , setIsModalOpen] = useState(false);

const InsertOffice = () => {
  const navigate = useNavigate();

  // 이전으로 이동
  const handleGoBack = () => {
    navigate(-1);
  };

  const hostDataString = localStorage.getItem('hostData');

  const hostData = hostDataString ? JSON.parse(hostDataString) : null;
  // 입력 받은 값
  const [formData, setFormData] = useState({
    hostNo: hostData ? hostData.no : '',
    regionNo: '',
    typeNo: '',
    statusNo: '1',
    businessNo: '',
    detail: '',
    name: '',
    phone: '',
    facilitieCode: '',
    tag: '',
    score: '5',
    extracode: '5',
    postCode: '',
    roadAddress: '',
    detailAddress: '',
  });

  // 대표 이미지 상태
  const [repImage, setRepImage] = useState({ file: null, preview: null });

  // 추가 이미지 상태
  const [additionalImages, setAdditionalImages] = useState([]);

  // updateField
  const updateField = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  // 유효성 검사 후 데이터 전송
  const handleRegister = async () => {
    if (!formData.name) {
      alert('오피스스명을 입력하세요.');
      return;
    }
    if (!formData.businessNo) {
      alert('사업장 등록번호를 입력하세요.');
      return;
    }

    const token = localStorage.getItem('token');
    if (!token) {
      alert('인증 토큰이 없습니다. 다시 로그인하세요.');
      return;
    }

    // FormData 객체 생성
    const formDataToSend = new FormData();
    console.log('formDataToSend', formDataToSend);
    // 텍스트 데이터 추가
    Object.entries(formData).forEach(([key, value]) => {
      formDataToSend.append(key, value);
    });

    // 대표 이미지 추가
    if (repImage.file) {
      formDataToSend.append('repImage', repImage.file);
    }
    console.log('repImage', repImage);

    // 추가 이미지들 추가
    if (additionalImages.length > 0) {
      additionalImages.forEach((img) => {
        if (img.file) {
          formDataToSend.append('additionalFiles', img.file);
        }
      });
    }

    try {
      const response = await fetch(
        `http://${API_SERVER}/api/host/office/insert`,
        {
          method: 'POST',
          headers: {
            token: `${token}`,
          },
          body: formDataToSend,
        }
      );
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      Swal.fire({
        title: '등록 완료',
        text: '등록이 완료되었습니다.',
        icon: 'success',
        confirmButtonText: '확인',
      }).then(() => {
        navigate('/host/workplace/state');
      });
    } catch (error) {
      Swal.fire({
        title: '등록 오류',
        text: '등록 중 오류가 발생했습니다. 다시 시도해주세요.',
        icon: 'error',
        confirmButtonText: '확인',
      });
    }
  };

  return (
    <>
      <Breadcrumb>
        사업장 목록 &gt; 사업장 등록 &gt; 오피스 등록 &gt;
      </Breadcrumb>
      <Layout>
        <AccommodationWrapper>
          <OfficeAndImageUpload
            formData={formData}
            updateField={updateField}
            repImage={repImage}
            setRepImage={setRepImage}
            additionalImages={additionalImages}
            setAdditionalImages={setAdditionalImages}
          />
        </AccommodationWrapper>
        <TagAndFacilityWrapper>
          <OfficeTagAndFacility formData={formData} updateField={updateField} />
        </TagAndFacilityWrapper>
        <DetailsWrapper>
          <DetailsInput formData={formData} updateField={updateField} />
        </DetailsWrapper>
        <ActionButtonsWrapper>
          <ActionButtons
            firstText="이전"
            secondText="등록"
            onFirstButtonClick={handleGoBack}
            onSecondButtonClick={handleRegister}
          />
        </ActionButtonsWrapper>
      </Layout>
    </>
  );
};

export default InsertOffice;
