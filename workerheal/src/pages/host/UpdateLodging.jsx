import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import HostHeader from '../../components/host/HostHeader';
import TagAndFacility from '../../components/host/TagAndFacility';
import DetailsInput from '../../components/host/DetailsInput';
import ActionButtons from '../../components/host/ActionButtons';
import AccommodationAndImageUpload from '../../components/host/AccommodationAndImageUpload';
import { useNavigate, useParams } from 'react-router-dom';
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
  margin-top: 20px;
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
`;

const UpdateLodging = () => {
  const navigate = useNavigate();
  const { businessNo } = useParams();
  console.log('businessNo : ', businessNo);

  const [formData, setFormData] = useState({
    no: '',
    hostNo: '',
    lodgingNo: businessNo || '',
    regionNo: '',
    typeNo: '',
    statusNo: '2',
    businessNo: '',
    name: '',
    phone: '',
    facilitieCode: '',
    tag: '',
    score: '5',
    postCode: '',
    roadAddress: '',
    detailAddress: '',
    detail: '',
  });

  // 대표 이미지 상태
  const [repImage, setRepImage] = useState({ file: null, preview: null });

  // 추가 이미지 상태
  const [additionalImages, setAdditionalImages] = useState([]);

  // 이전으로 이동
  const handleGoBack = () => {
    navigate(-1);
  };

  // 수정할 데이터 불러오기
  // useEffect(() => {
  //   const fetchLodgingData = async () => {
  //     try {
  //       const token = localStorage.getItem('token');
  //       if (!token) {
  //         alert('인증 토큰이 없습니다.');
  //         return;
  //       }

  //       const response = await fetch(
  //         `http://127.0.0.1:8080/api/host/lodging/detail?no=${no}`,
  //         {
  //           method: 'GET',
  //           headers: {
  //             'Content-Type': 'application/json',
  //             token: `${token}`,
  //           },
  //         }
  //       );
  //       if (!response.ok)
  //         throw new Error(`HTTP error! Status: ${response.status}`);
  //       const data = await response.json();
  //       setFormData(data);
  //     } catch (error) {
  //       console.error('데이터 불러오기 실패:', error);
  //     }
  //   };
  //   fetchLodgingData();
  // }, [no]);

  // 입력 값 변경 핸들러
  const updateField = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  // 수정 요청 API 호출
  const handleRegister = async () => {
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
        `http://${API_SERVER}/api/host/lodging/insert`,
        {
          method: 'POST',
          headers: {
            token: `${token}`,
          },
          body: formDataToSend,
        }
      );
      Swal.fire({
        title: '수정 등록',
        text: '수정이 등록되었습니다.',
        icon: 'success',
        confirmButtonText: '확인',
      }).then(() => {
        navigate('/host/workplace/state');
      });
    } catch (error) {
      Swal.fire({
        title: '수정 등록 오류',
        text: '수정 등록 중 오류가 발생했습니다. 다시 시도해주세요.',
        icon: 'error',
        confirmButtonText: '확인',
      });
    }
  };

  return (
    <>
      <Breadcrumb>사업장 목록 &gt; 숙소 명명 &gt; 수정요청 &gt;</Breadcrumb>
      <Layout>
        <AccommodationWrapper>
          <AccommodationAndImageUpload
            formData={formData}
            updateField={updateField}
            repImage={repImage}
            setRepImage={setRepImage}
            additionalImages={additionalImages}
            setAdditionalImages={setAdditionalImages}
          />
        </AccommodationWrapper>
        <TagAndFacilityWrapper>
          <TagAndFacility formData={formData} updateField={updateField} />
        </TagAndFacilityWrapper>
        <DetailsWrapper>
          <DetailsInput formData={formData} updateField={updateField} />
        </DetailsWrapper>
        <ActionButtonsWrapper>
          <ActionButtons
            firstText="이전"
            secondText="수정"
            onFirstButtonClick={handleGoBack}
            onSecondButtonClick={handleRegister}
          />
        </ActionButtonsWrapper>
      </Layout>
    </>
  );
};

export default UpdateLodging;
