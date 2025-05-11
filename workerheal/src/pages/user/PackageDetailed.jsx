import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import styled from 'styled-components';
import MoveButton from '../../components/MoveButton';
import { useLocation, useNavigate } from 'react-router-dom';
import { setPackageDetailed } from '../../redux/PackageDetailSlice';
import PackageOffice from './PackageOffice';
import PackageLodging from './PackageLodging';
import PackageTour from './PackageTour';
import Reviews from '../../components/Reviews';
import ReviewMoreButton from '../../components/ReviewMoreButton';
import { getFacilityNameList } from '../../services/optionService';

const API_SERVER = process.env.REACT_APP_SERVER_ROOT;

const Layout = styled.div`
  display: flex;
  flex-direction: column;
  margin: 0px auto;
`;

const MainImage = styled.div`
  text-align: center;
  align-items: center;
  margin-top: 20px;
`;

const Line = styled.div`
  width: 1300px;
  border: 1px solid #b8b8b8;
  margin: 30px auto;
`;

const TitleLayout = styled.div`
  width: 150px;
  display: flex;
  flex-direction: column;
  text-align: center;
  margin-left: -20px;
`;

const Title = styled.div`
  font-size: 18px;
  font-weight: bold;
  margin: 5px;
`;

const LineDiv = styled.div`
  width: 100px;
  height: 5px;
  background-color: #8041ff;
  margin-bottom: 20px;
  margin-left: 25px;
`;

const Info = styled.div`
  display: flex;
  width: 1000px;
  flex-direction: column;
  margin: 0px auto;
`;

const Dates = styled.div`
  display: flex;
  width: 1050px;
  color: gray;
  margin: 0px auto;
  justify-content: flex-end;
  margin-top: -10px;
  gap: 5px;
`;

const Detail = styled.div`
  color: gray;
`;

const Button = styled.div`
  display: flex;
  width: 1100px;
  margin: 60px auto 0 auto;
  justify-content: flex-end;
`;

const SelectBar = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 1100px;
  height: 45px;
  border: 2px solid #8041ff;
  border-radius: 5px;
  overflow: hidden;
  margin: 50px auto;
`;

const TabItem = styled.div`
  flex: 1;
  text-align: center;
  font-size: 20px;
  font-weight: bold;
  padding: 15px 0;
  cursor: pointer;
  background-color: ${({ active }) => (active ? '#8041FF' : 'white')};
  color: ${({ active }) => (active ? 'white' : '#8041FF')};
  border-right: ${({ isLast }) => (isLast ? 'none' : '2px solid #8041FF')};

  &:hover {
    background-color: ${({ active }) => (active ? '#8041FF' : '#EDE7F6')};
  }
`;

const TabContainer = styled.div`
  width: 100%;
  margin-top: 20px;
`;

const ReviewContainer = styled.div`
  width: 1300px;
  margin: 0px auto;
  margin-top: 150px;
`;

const PackageDetailed = () => {
  // url에서 데이터 얻어오기
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const no = queryParams.get('no');

  const dispatch = useDispatch();

  // Redux에서 패키지 정보 가져오기
  const packageDetail = useSelector((state) => state.packageDetail) || {};

  // 상세 정보 상태
  const packageInfo = packageDetail.packageInfo || {};
  const packAttach = packageDetail.packAttach || [];
  const reviewVo = packageDetail.reviewVo || [];
  const reviewAttach = packageDetail.reviewAttach || [];

  const officeDetail = packageDetail.officeDetail || {};
  const officeAttach = packageDetail.officeAttach || [];

  const lodgingDetail = packageDetail.lodgingDetail || {};
  const lodgingAttach = packageDetail.lodgingAttach || [];
  const roomTypeVo = packageDetail.roomTypeVo || [];
  const roomTypeAttach = packageDetail.roomTypeAttach || [];

  const tourDetail = packageDetail.tourDetail || {};

  console.log('roomTypeAttach:::::::::::', roomTypeAttach);

  // 선택된 탭 상태
  const [selectedTab, setSelectedTab] = useState('오피스');
  const [officeFacility, setOfficeFacility] = useState([]); // 태훈 추가
  const [lodgingFacility, setLodgingFacility] = useState([]); // 태훈 추가
  const [roomFacility, setRoomFacility] = useState([]); // 태훈 추가

  useEffect(() => {
    const fetchDetail = async () => {
      const option = {
        method: 'GET',
        headers: {
          'content-type': 'application/json',
        },
      };
      try {
        const resp = await fetch(
          `http://${API_SERVER}/api/package/detail?no=${no}`,
          option
        );
        const data = await resp.json();
        dispatch(setPackageDetailed(data)); // Redux에 데이터 저장
      } catch (err) {
        console.error('❌ 숙소 상세 정보 가져오기 실패: ', err);
      }
    };

    fetchDetail();
  }, [dispatch, no]);

  useEffect(() => {
    console.log('📌 Redux 상태 변경 감지됨, UI 갱신됨:', packageDetail);
    console.log(
      '📌 Redux 상태 변경 감지됨, UI 갱신됨:',
      packageDetail.lodgingDetail
    );
    console.log('📌 Redux 상태 변경 감지됨, UI 갱신됨:', lodgingDetail);
    console.log('📌 Redux 상태 변경 감지됨, UI 갱신됨:', roomTypeVo);
    if (!(Object.keys(lodgingDetail).length === 0))
      getFacilityNameList('lodging', lodgingDetail.facilitieCode).then(
        (list) => {
          setLodgingFacility(list);
        }
      );
    if (!(Object.keys(officeDetail).length === 0))
      getFacilityNameList('office', officeDetail.facilitieCode).then((list) => {
        setOfficeFacility(list);
      });
    if (!(Object.keys(officeDetail).length === 0))
      getFacilityNameList('office', officeDetail.facilitieCode).then((list) => {
        setOfficeFacility(list);
      });
    if (!(Object.keys(roomTypeVo).length === 0)) {
      roomTypeVo.map((roomInfo) => {
        getFacilityNameList('roomType', roomInfo.facilitieCode).then((list) => {
          setRoomFacility((prev) => [...prev, list]);
        });
      });
    }
  }, [packageDetail]); // ✅ Redux 상태가 변경되면 다시 렌더링됨

  // 리뷰가 배열인지 확인 (단일 객체가 올 가능성 대비)
  const safePackageReview = Array.isArray(reviewVo) ? reviewVo : [reviewVo];

  return (
    <Layout>
      <MainImage>
        <img
          width={1200}
          height={350}
          // packAttach가 배열일 경우 첫 번째 이미지를 가져옴 packAttach가 비어 있을 경우 기본 이미지 사용
          src={
            packAttach.length > 0
              ? packAttach[0].path
              : 'https://via.placeholder.com/1200x350'
          }
          alt="메인 이미지"
        />
      </MainImage>
      <Line />
      <Dates>
        {new Date(packageInfo.openDate).toLocaleDateString('ko-KR')} ~
        {new Date(packageInfo.closeDate).toLocaleDateString('ko-KR')}
      </Dates>

      <Info>
        <TitleLayout>
          <Title>패키지 소개</Title>
          <LineDiv />
        </TitleLayout>

        <Detail>{packageInfo.detail}</Detail>
      </Info>
      <Button>
        <MoveButton
          type="navigate"
          label="예약하기"
          path={`/package/reservation?no=${packageInfo.no}`}
        />
      </Button>

      {/* 탭 */}
      <SelectBar>
        {['오피스', '숙소', '관광'].map((tab, index, arr) => (
          <TabItem
            key={tab}
            active={selectedTab === tab}
            onClick={() => setSelectedTab(tab)}
            isLast={index === arr.length - 1}
          >
            {tab}
          </TabItem>
        ))}
      </SelectBar>

      {/* 선택된 탭에 따라 해당 상세 컴포넌트 렌더링*/}
      <TabContainer>
        {selectedTab === '오피스' && (
          <PackageOffice
            detail={officeDetail}
            attach={officeAttach}
            facilityList={officeFacility} // 태훈 추가
          />
        )}

        {selectedTab === '숙소' && (
          <PackageLodging
            detail={lodgingDetail}
            attach={lodgingAttach}
            roomType={roomTypeVo}
            roomAttach={roomTypeAttach}
            lodgingFacility={lodgingFacility}
            roomFacililty={roomFacility}
          />
        )}

        {selectedTab === '관광' && <PackageTour detail={tourDetail} />}
      </TabContainer>

      {/* 리뷰 */}
      <ReviewContainer>
        <TitleLayout>
          <Title>리뷰</Title>
          <LineDiv />
        </TitleLayout>

        {/* 리뷰 상세 페이지로 이동하는 버튼 */}
        <ReviewMoreButton
          path={`/package/review?no=${packageInfo.no}`}
          label="전체보기 >"
        />

        {/* 리뷰가 있으면 Reviews 컴포넌트를 렌더링하고, 없으면 메시지를 출력 */}
        {safePackageReview.length > 0 ? (
          safePackageReview.slice(0, 5).map((review) => (
            <Reviews
              key={review.no}
              nick={review.memberName}
              // 여러 데이터를 불러오기 위함
              image={
                reviewAttach[review.no] && reviewAttach[review.no].length > 0
                  ? reviewAttach[review.no][0].path // 첫 번째 이미지 가져오기
                  : ''
              }
              reviewDetail={review.content}
              scope={review.score}
            />
          ))
        ) : (
          <p>아직 등록된 리뷰가 없습니다.</p>
        )}
      </ReviewContainer>
    </Layout>
  );
};

export default PackageDetailed;
