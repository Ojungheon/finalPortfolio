import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import styled from 'styled-components';
import { getApprovalDetail } from '../../../services/approvalService';
import RoomTypeModal from '../../user/RoomTypeModal';
import MapDetail from '../../../common/api/MapDetail';
import Amenities from '../../../components/Amenities';
import RoomType from '../../../components/RoomType';
import Description from '../../user/Description';
import ImageSlider from '../../user/ImageSlider';
import LocationInfo from '../../user/LocationInfo';
import { useEffect } from 'react';
import Footer from '../../../common/components/user/Footer';
import ApproveArea from '../../../components/admin/manageWorkplace/ApproveArea';
import { getFacilityNameList } from '../../../services/optionService';
/* ################################## styled components start ################################## */

const MainLayout = styled.div`
  background-color: #ffffff;
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const StyledWorkspace = styled.div`
  background-color: white;
  width: 1420px;
  height: 100%;
`;

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

const ContentArea = styled.div`
  display: grid;
  grid-template-rows: 220px 1fr;
  width: 100%;
  margin: 0 auto;
`;

const BlankSpace = styled.div`
  height: 100px;
`;

/* ################################## styled components end ################################## */

/* ################################## TempLodgingDetail start ################################## */
const TempLodgingDetail = () => {
  const location = useLocation();
  /* ################### state 생성 ################### */
  const [lodgingInfo, setLodgingInfo] = useState({});
  const [lodgingAttachment, setLodgingAttachment] = useState([]);
  const [rooms, setRooms] = useState([]);
  const [roomAttachment, setRoomAttachment] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [selectedRoomImg, setSelectedRoomImg] = useState(null);
  const [facilityList, setFacilityList] = useState([]);
  const [roomFacilityList, setRoomFacilityList] = useState([]); // 태훈 추가
  const [selectedRoomFacility, setSelectedRoomFacility] = useState([]); // 태훈 추가

  /* ################### fetch 함수 ################### */
  // 승인요청 상세정보 호출
  const getLodgingDetail = async () => {
    const queryParams = new URLSearchParams(location.search);
    const no = queryParams.get('no');
    try {
      const data = await getApprovalDetail(no, 'lodging');
      setLodgingInfo(data.tempLodgingVo);
      setLodgingAttachment(data.lodgingImgList);
      setRooms(data.tempRoomVoList);
      setRoomAttachment(data.roomImgList);

      console.log(roomAttachment);
    } catch (error) {
      console.log('Error 발생~~~ ', error);
      alert(error);
    }
  };

  /* ################### 화면 로드 시 데이터 불러오기 ################### */
  useEffect(() => {
    getLodgingDetail();
  }, []);

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

  return (
    <ContentArea>
      {/* 승인처리 */}
      <ApproveArea workplaceInfo={lodgingInfo} type={'lodging'} />
      <MainLayout>
        <StyledWorkspace>
          <Container>
            {/* 여러 개의 이미지 출력 (배열 형태로 유지) */}
            <ImageSlider images={lodgingAttachment.map((att) => att.path)} />

            {/* 위치 안내 */}
            <LocationDiv>
              <LocationInfo
                name={lodgingInfo.name}
                location={lodgingInfo.roadAddress}
                tags={lodgingInfo.tag}
              />
            </LocationDiv>

            {/* 안내사항 */}
            <Description
              info={{
                '숙소 유형형': `${lodgingInfo.typeName}`,
                시설: facilityList.join(' , '),
                소개: `${lodgingInfo.detail}`,
              }}
            />

            {/* 객실 타입 */}
            <RoomContainer>
              {rooms.map((room, index) => (
                <RoomType
                  key={room.no}
                  typeImage={roomAttachment?.[index]?.[0]?.path || ''}
                  typeName={room.name}
                  bedType={room.bedOptionName}
                  // amenitie={room.facilitieCode}
                  amenitie={roomFacilityList[index]}
                  time={`${room.checkIn} - ${room.checkOut}`}
                  price={room.price}
                  onClick={() => {
                    setSelectedRoom(room);
                    setSelectedRoomImg(roomAttachment[index]);
                    setSelectedRoomFacility(roomFacilityList[index]); // 태훈 추가
                    setIsModalOpen(true);
                  }}
                />
              ))}
            </RoomContainer>

            {/* 편의시설 */}
            <Amenities selectedAmenities={facilityList} />

            {/* 위치 */}
            <MapDetail
              address={lodgingInfo.roadAddress}
              name={lodgingInfo.name}
            />

            {/* <Footer /> */}
            <BlankSpace />

            {/* 모달 */}
            <RoomTypeModal
              isOpen={isModalOpen}
              onClose={() => setIsModalOpen(false)}
              typeName={selectedRoom?.name}
              price={selectedRoom?.price}
              // amenities={selectedRoom?.facilitieCode}
              amenities={selectedRoomFacility}
              images={selectedRoomImg}
            />
          </Container>
        </StyledWorkspace>
      </MainLayout>
    </ContentArea>
  );
};
/* ################################## TempLodgingDetail end ################################## */

export default TempLodgingDetail;
