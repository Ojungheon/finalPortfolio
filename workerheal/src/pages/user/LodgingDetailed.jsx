import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation } from 'react-router-dom';
import { setLodgingDetailed } from '../../redux/LodgingDetailedSlice';
import ImageSlider from './ImageSlider';
import LocationInfo from './LocationInfo';
import Description from './Description';
import Amenities from '../../components/Amenities';
import MapDetail from '../../common/api/MapDetail';
import Reviews from '../../components/Reviews';
import MoveButton from '../../components/MoveButton';
import ReviewMoreButton from '../../components/ReviewMoreButton';
import RoomType from '../../components/RoomType';
import RoomTypeModal from '../../pages/user/RoomTypeModal';
import styled from 'styled-components';
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

const RoomContainer = styled.div`
  display: flex;
  justify-content: center;
  margin: 50px;
  flex-direction: column;
  align-items: center;
  gap: 20px;
`;

const LodgingDetailed = () => {
  const dispatch = useDispatch();
  const location = useLocation();

  // url에서 데이터 얻어오기
  const queryParams = new URLSearchParams(location.search);
  const no = queryParams.get('no');

  const lodgingDetailed = useSelector((state) => state.lodgingDetailed || {});

  const lodgingInfo = lodgingDetailed.lodgingInfo || {};
  const facilitie = lodgingDetailed.facilitie || [];
  const attachments = lodgingDetailed.attachments || [];
  const rooms = lodgingDetailed.roomTypes || [];
  const roomAttachments = lodgingDetailed.roomAttachments || [];
  const reviews = lodgingDetailed.reviews || [];
  const reviewAttachments = lodgingDetailed.reviewAttachments || [];

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [selectedRoomImg, setSelectedRoomImg] = useState(null); // 태훈 수정
  const [facilityList, setFacilityList] = useState([]); // 태훈 추가
  const [roomFacilityList, setRoomFacilityList] = useState([]); // 태훈 추가
  const [selectedRoomFacility, setSelectedRoomFacility] = useState([]); // 태훈 추가

  useEffect(() => {
    if (!no) {
      console.error('❌ lodgingNo가 제공되지 않았습니다.');
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
          `http://${API_SERVER}/api/lodging/detail?no=${no}`,
          option
        );
        const data = await resp.json();
        console.log('🚀 서버에서 받은 데이터:', data);
        dispatch(setLodgingDetailed(data)); // Redux에 데이터 저장
      } catch (err) {
        console.error('❌ 숙소 상세 정보 가져오기 실패: ', err);
      }
    };

    fetchDetail();
  }, [dispatch, no]);

  useEffect(() => {
    console.log('Redux 업데이트됨! lodgingInfo:', lodgingInfo);
  }, [lodgingInfo]); //Redux 상태 변경 확인

  useEffect(() => {
    if (lodgingInfo.facilitieCode != undefined) {
      getFacilityNameList('lodging', lodgingInfo.facilitieCode).then((list) => {
        setFacilityList(list);
      });
    }
  }, [lodgingInfo]);

  useEffect(() => {
    if (rooms.length > 0) {
      rooms.map((roomInfo) => {
        getFacilityNameList('roomType', roomInfo.facilitieCode).then((list) => {
          setRoomFacilityList((prev) => [...prev, list]);
        });
      });
    }
  }, [rooms]);

  if (!lodgingInfo || Object.keys(lodgingInfo).length === 0) {
    return <h3>로딩중...</h3>;
  }

  // 시설 코드 변환 (문자열이면 쉼표로 분리, 배열이면 그대로) - 태훈 비활성화
  // const safeLodgingExtraCode =
  //   typeof lodgingInfo.facilitieCode === 'string'
  //     ? lodgingInfo.facilitieCode.split(',').map(Number)
  //     : Array.isArray(lodgingInfo.facilitieCode)
  //     ? lodgingInfo.facilitieCode
  //     : [];

  // 리뷰가 배열인지 확인 (단일 객체가 올 가능성 대비)
  const safeLodgingReview = Array.isArray(reviews) ? reviews : [reviews];

  return (
    <>
      <Container>
        {/* 여러 개의 이미지 출력 (배열 형태로 유지) */}
        <ImageSlider images={attachments.map((att) => att.path)} />

        <LocationDiv>
          <LocationInfo
            name={lodgingInfo.name}
            location={lodgingInfo.roadAddress}
            tags={lodgingInfo.tag}
          />
        </LocationDiv>

        {/* 예약 페이지 이동 버튼 */}
        <MoveButton
          type="navigate"
          label="예약하기"
          path="/lodging/reservation"
        />

        {/* 안내사항 */}
        <Description
          info={{
            // '객실 타입': `${lodgingInfo.roomTypeName}`,
            '숙소 유형': `${lodgingInfo.lodgingTypeName}`, // 태훈 수정
            // 시설: `${lodgingInfo.facilitieCode}`,
            시설: facilityList.join(' , '), // 태훈 수정
            // 소개: `${lodgingInfo.checkIn}`,
            소개: `${lodgingInfo.detail}`, // 태훈 수정
          }}
        />

        {/* 객실 타입 */}
        <RoomContainer>
          {rooms.map((room, index) => (
            <RoomType
              key={room.no}
              // typeImage={
              //   (
              //     roomAttachments.find(
              //       (ra) => ra.lodgingNo === room.lodgingNo
              //     ) || {}
              //   ).path || ''
              // }
              typeImage={roomAttachments[index][0].path} // 태훈 수정
              typeName={room.name}
              // bedType={room.bedOptionName}
              bedType={'싱글 ' + room.singleBed + '  더블 ' + room.doubleBed} // 태훈 수정
              // amenitie={room.facilitieCode}
              amenitie={roomFacilityList[index]} // 태훈 수정
              time={`${room.checkIn} - ${room.checkOut}`}
              price={room.price}
              onClick={() => {
                setSelectedRoom(room);
                setSelectedRoomImg(roomAttachments[index]); // 태훈 수정
                setSelectedRoomFacility(roomFacilityList[index]); // 태훈 추가
                setIsModalOpen(true);
              }}
            />
          ))}
        </RoomContainer>

        {/* 편의시설 */}
        {/* <Amenities selectedAmenities={safeLodgingExtraCode} /> 태훈 수정*/}
        <Amenities selectedAmenities={facilityList} />

        {/* 위치 */}
        <MapDetail address={lodgingInfo.roadAddress} name={lodgingInfo.name} />

        {/* 리뷰 */}
        <TitleLayout>
          <Title>리뷰</Title>
          <LineDiv />
        </TitleLayout>

        {/* 리뷰 상세 페이지로 이동하는 버튼 */}
        <ReviewMoreButton
          path={`/lodging/review?no=${lodgingInfo.no}`}
          label="전체보기 >"
        />

        {/* 리뷰가 있으면 Reviews 컴포넌트를 렌더링하고, 없으면 메시지를 출력 */}
        {safeLodgingReview.length > 0 ? (
          safeLodgingReview.slice(0, 5).map((review, index) => (
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

        {/* 모달 */}
        <RoomTypeModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          typeName={selectedRoom?.name}
          price={selectedRoom?.price}
          // amenities={selectedRoom?.facilitieCode}//태훈 수정
          amenities={selectedRoomFacility}
          // images={
          //   Array.isArray(selectedRoom?.reviewAttachments)
          //     ? selectedRoom.reviewAttachments.map((img) => img.path) // 배열이면 map() 사용
          //     : selectedRoom?.reviewAttachments?.path // 단일 객체이면 직접 path 사용
          //     ? [selectedRoom.reviewAttachments.path] // 단일 객체일 경우, 배열로 감싸기
          //     : []
          // }
          images={selectedRoomImg} // 태훈 수정
        />
      </Container>
    </>
  );
};

export default LodgingDetailed;
