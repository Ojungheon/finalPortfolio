import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import ImageSlider from './ImageSlider';
import LocationInfo from './LocationInfo';
import Description from './Description';
import DetaileIntro from './DetaileIntro';
import Amenities from '../../components/Amenities';
import MapDetail from '../../common/api/MapDetail';
import Reviews from '../../components/Reviews';
import MoveButton from '../../components/MoveButton';
import ReviewMoreButton from '../../components/ReviewMoreButton';
import { useDispatch, useSelector } from 'react-redux';
import { setOfficeDetailed } from '../../redux/officeDetailedSlice';
import { useLocation, useNavigate } from 'react-router-dom';
import { getFacilityNameList } from '../../services/optionService';

const API_SERVER = process.env.REACT_APP_SERVER_ROOT;

const Container = styled.div`
  width: 80%;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
`;

const LocationDiv = styled.div``;

// 제목 스타일
const TitleLayout = styled.div`
  width: 75px;
  display: flex;
  flex-direction: column;
  text-align: center;
  margin-top: 100px;
`;

// 제목 텍스트
const Title = styled.div`
  font-size: 18px;
  font-weight: bold;
  margin: 5px;
`;

// 타이틀 아래 라인
const LineDiv = styled.div`
  width: 74px;
  height: 5px;
  background-color: #8041ff;
  margin-bottom: 20px;
`;

const OfficeDetailed = () => {
  const dispatch = useDispatch();
  const location = useLocation();
  const [facilityList, setFacilityList] = useState([]);
  //Redux가 아닌 URL에서 가져오기
  const queryParams = new URLSearchParams(location.search);
  const no = queryParams.get('no');

  const officeDetailed = useSelector((state) => state.officeDetailed) || {};
  const officeInfo = officeDetailed.officeInfo || {};
  const officeAttachments = officeDetailed.officeAttachments || [];
  const reviews = officeDetailed.reviews || [];
  const reviewAttachments = officeDetailed.reviewAttachments || [];

  // 만약 첨부파일 이미지가 단일이여도 오류 안나도록 반환
  const safeReviewAttachments = Array.isArray(reviewAttachments)
    ? reviewAttachments
    : [reviewAttachments]; // 객체라면 배열로 변환

  useEffect(() => {
    if (!no) {
      console.error('❌ Redux에서 officeNo가 제공되지 않았습니다.');
      return;
    }

    const fetchDetail = async () => {
      const option = {
        method: 'GET',
        headers: {
          'content-type': 'application/json',
        },
      };
      try {
        const resp = await fetch(
          `http://${API_SERVER}/api/office/detail?no=${no}`,
          option
        );
        const data = await resp.json();
        console.log('🚀 서버에서 받은 데이터:', data); // 응답 데이터 확인
        dispatch(setOfficeDetailed(data)); // Redux에 데이터 저장
      } catch (err) {
        console.error('❌ 오피스 상세 정보 가져오기 실패: ', err);
      }
    };
    fetchDetail();
  }, [dispatch, no]);

  useEffect(() => {
    if (officeInfo.facilitieCode != undefined) {
      getFacilityNameList('office', officeInfo.facilitieCode).then((list) => {
        setFacilityList(list);
      });
    }
  }, [officeInfo]);

  if (!officeDetailed || Object.keys(officeDetailed).length === 0) {
    return <h3>로딩중...</h3>; // 데이터가 비어있으면 로딩 표시
  }

  // const safeOfficeFacilitieCode = 태훈 비활성화
  //   typeof officeInfo.facilitieCode === 'string'
  //     ? officeInfo.facilitieCode.split(',').map(Number) // 쉼표로 분리 후 숫자로 변환
  //     : Array.isArray(officeInfo.facilitieCode)
  //     ? officeInfo.facilitieCode
  //     : [];

  const safeOfficeInfo = Array.isArray(reviews) ? reviews : [reviews];

  const infoData = {
    수용인원: `${officeInfo.capacity}명`,
    '사용 시간': `${officeInfo.open} - ${officeInfo.close}`,
    // '시설 / 장비': `${officeInfo.facilitieCode}`, 태훈 수정
    '시설 / 장비': facilityList.join(' , '),
    연락처: `${officeInfo.phone}`,
  };

  return (
    <>
      <Container>
        {/* 이미지 슬라이더 */}
        <ImageSlider images={officeAttachments.map((item) => item.path)} />

        {/* 위치 정보 */}
        <LocationDiv>
          <LocationInfo
            name={officeInfo.name}
            location={officeInfo.roadAddress}
            tags={officeInfo.tag}
          />
        </LocationDiv>

        {/* 예약페이지로 이동하는 버튼 */}
        <MoveButton
          type="navigate"
          label="예약하기"
          path={`/office/reservation?no=${officeInfo.no}`}
        />

        {/* 안내사항 */}
        <Description info={infoData} />

        {/* 오피스 소개 */}
        <DetaileIntro intro={officeInfo.detail} />

        {/* 편의시설 */}
        {/* <Amenities selectedAmenities={safeOfficeFacilitieCode} /> 태훈 수정 */}
        <Amenities selectedAmenities={facilityList} />

        {/* 지도 정보 */}
        <MapDetail address={officeInfo.roadAddress} name={officeInfo.name} />

        {/* 리뷰 섹션 */}
        <TitleLayout>
          <Title>리뷰</Title>
          <LineDiv />
        </TitleLayout>

        {/* 리뷰 상세 페이지로 이동 */}
        <ReviewMoreButton
          path={`/office/review?no=${officeInfo.no}`}
          label="전체보기 >"
        />

        {/* 리뷰 목록 출력 */}
        {safeOfficeInfo.length > 0 ? (
          safeOfficeInfo.slice(0, 5).map((review, index) => (
            <Reviews
              key={review.no}
              nick={review.memberName}
              // 여러 데이터를 불러오기 위함
              image={
                // (reviewAttachments.find((ra) => ra.no === review.no) || {})
                (reviewAttachments[index][0] || {}).path || '' // 태훈 재수정
              }
              reviewDetail={review.content}
              scope={review.score}
            />
          ))
        ) : (
          <p>아직 등록된 리뷰가 없습니다.</p>
        )}
      </Container>
    </>
  );
};

export default OfficeDetailed;
