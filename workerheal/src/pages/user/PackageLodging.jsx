import React, { useState } from 'react';
import ImageSlider from './ImageSlider';
import LocationInfo from './LocationInfo';
import Description from './Description';
import RoomType from '../../components/RoomType';
import Amenities from '../../components/Amenities';
import MapDetail from '../../common/api/MapDetail';
import RoomTypeModal from './RoomTypeModal';
import styled from 'styled-components';

const Container = styled.div`
  width: 80%;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
`;

const LocationDiv = styled.div``;

const RoomContainer = styled.div`
  display: flex;
  justify-content: center;
  margin: 50px;
  flex-direction: column;
  align-items: center;
  gap: 20px;
`;

const PackageLodging = ({
  detail,
  attach,
  roomType,
  roomAttach,
  lodgingFacility,
  roomFacililty,
}) => {
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [selectedRoomAmenities, setSelectedRoomAmenities] = useState(null); //태훈 추가
  const [isModalOpen, setIsModalOpen] = useState(false);

  // 시설 코드 변환 (문자열이면 쉼표로 분리, 배열이면 그대로)
  // const safeLodgingExtraCode = 태훈 비활성화
  //   typeof detail?.facilitieCode === 'string'
  //     ? detail.facilitieCode.split(',').map(Number)
  //     : Array.isArray(detail?.facilitieCode)
  //     ? detail.facilitieCode
  //     : [];

  return (
    <Container>
      {/* 여러 개의 이미지 출력 (배열 형태 유지) */}
      {attach?.length > 0 && (
        <ImageSlider images={attach.map((att) => att.path)} />
      )}

      {/* 위치 정보 */}
      <LocationDiv>
        <LocationInfo
          name={detail?.name}
          location={detail?.roadAddress}
          tags={detail?.tag}
        />
      </LocationDiv>

      {/* 안내사항 */}
      <Description
        info={{
          '객실 타입': detail?.roomTypeName || '정보 없음',
          // 시설: detail?.facilitieCode || '정보 없음', 태훈 수정
          시설: lodgingFacility.join(' , ') || '정보 없음',
          소개: detail?.checkIn || '정보 없음',
        }}
      />

      {/* 객실 타입 */}
      <RoomContainer>
        {Array.isArray(roomType)
          ? roomType.map((room, index) => (
              <RoomType
                key={room.no}
                typeImage={roomAttach[index][0].path}
                typeName={room?.name || '객실명 없음'}
                amenitie={roomFacililty[index] || '시설 정보 없음'}
                bedType={'싱글 ' + room.singleBed + '  더블 ' + room.doubleBed}
                time={`${room?.checkIn || '체크인 정보 없음'} - ${
                  room?.checkOut || '체크아웃 정보 없음'
                }`}
                price={room?.price || '가격 정보 없음'}
                onClick={() => {
                  if (room) {
                    setSelectedRoom(room);
                    setSelectedRoomAmenities(roomFacililty[index]);
                    setIsModalOpen(true);
                  }
                }}
              />
            ))
          : null}
      </RoomContainer>

      {/* 편의시설 */}
      {/* <Amenities selectedAmenities={safeLodgingExtraCode} /> 태훈 수정*/}
      <Amenities selectedAmenities={lodgingFacility} />

      {/* 위치 */}
      <MapDetail address={detail?.roadAddress} name={detail?.name} />

      {/* 모달 */}
      <RoomTypeModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        typeName={selectedRoom?.name}
        price={selectedRoom?.price}
        // amenities={selectedRoom?.facilitieCode} 태훈 수정
        amenities={selectedRoomAmenities}
        images={
          Array.isArray(selectedRoom?.roomAttach)
            ? selectedRoom.roomAttach.map((img) => img.path) // 배열이면 map() 사용
            : selectedRoom?.roomAttach?.path // 단일 객체이면 직접 path 사용
            ? [selectedRoom.roomAttach.path] // 단일 객체일 경우, 배열로 감싸기
            : []
        }
      />
    </Container>
  );
};

export default PackageLodging;
