import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import styled from 'styled-components';
import { setSelectedLodging } from '../../../../redux/packageSlice';
import MapDetailForManager from '../../../../common/api/MapDetailForManager';
import ImageSliderForManager from '../../../../pages/user/ImageSliderForManager';
import useAuthorityCheck from '../../../../hook/useAuthorityCheck';

const API_SERVER = process.env.REACT_APP_SERVER_ROOT;

const WholeArea = styled.div``;

const Layout = styled.div`
  width: 95%;
  height: 85%;
  border: 1px solid gray;
  display: grid;
  grid-template-rows: 4fr 3fr;
`;

const InfoAreaOne = styled.div`
  display: grid;
  grid-template-columns: 2fr 1fr 1fr;
`;

const InfoAreaTwo = styled.div`
  display: grid;
  margin: 20px;
  grid-template-rows: 1fr 2fr;

  & div:nth-child(1) {
    font-size: 2rem;
    font-weight: 600;
  }
`;

const PackageImage = styled.div`
  border-radius: 15px;
  margin: 20px;

  & > img {
    width: 700px;
    height: 300px;
  }
`;

const Location = styled.div`
  margin: 20px;
`;

const RoomInfo = styled.div`
  margin: 20px;

  & p {
    color: gray;
  }
`;

const NaviButtons = styled.div`
  display: flex;
  justify-content: space-between;
  width: 95%;
`;

const PrevStep = styled.div`
  color: #8041ff;
  font-size: 1.5em;
  margin-top: 20px;
  border-radius: 15px;
  cursor: pointer;
`;

const NextStep = styled.div`
  color: #8041ff;
  font-size: 1.5em;
  margin-top: 20px;
  border-radius: 15px;
  cursor: pointer;
`;

const MapImage = styled.div`
  height: 200px;
  width: 300px;
  background-color: gray;
`;

const EnrollLodgingDetailData = ({ onSelect }) => {
  const { no } = useParams();
  const [lodging, setLodging] = useState(null);
  const [lodgingAttchment, setlodgingAttchment] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const dispatch = useDispatch(); // Redux dispatch 추가

  const checkLogin = useAuthorityCheck('MANAGER', '/manager/login');
  const [isChecking, setIsChecking] = useState(true);

  /* ################### 로그인 검증 ################### */
  useEffect(() => {
    if (checkLogin()) {
      setIsChecking(false);
    }
  }, []);

  useEffect(() => {
    fetch(`http://${API_SERVER}/api/manager/packages/lodgingDetail/${no}`, {
      method: 'GET', // 기본적으로 GET 요청
      headers: {
        'Content-Type': 'application/json', // 서버에 JSON 데이터를 보낼 때 사용
        token: sessionStorage.getItem('token'),
      },
    })
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP error! Status: ${res.status}`);
        return res.json();
      })
      .then((data) => {
        console.log('API 응답 데이터:', data);
        console.log('');

        setLodging(data.lodging);
        setlodgingAttchment(data.lodgingAttchment);
        setLoading(false);
      })
      .catch((error) => {
        console.error('데이터 로드 실패:', error);
        setLoading(false);
      });
  }, [no]);

  if (loading) return <p>숙소 정보를 불러오는 중...</p>;
  if (!lodging) return <p>숙소 정보를 찾을 수 없습니다.</p>;

  return isChecking ? (
    <div></div>
  ) : (
    <WholeArea>
      <Layout>
        <InfoAreaOne>
          <PackageImage>
            <ImageSliderForManager
              images={lodgingAttchment.map((att) => att.path)}
            />
          </PackageImage>
          <Location>
            <h3>위치</h3>
            <MapImage>
              <MapDetailForManager
                address={lodging[0]?.roadAddress}
                name={lodging[0]?.name}
              />
            </MapImage>
            <p>{lodging[0]?.roadAddress}</p>
          </Location>
          <RoomInfo>
            <h3>객실 정보</h3>
            {lodging.map((lodgingItem, index) =>
              lodgingItem.roomName ? (
                <p key={index}>
                  {lodgingItem.roomName} - [잔여:{lodgingItem.roomAmount}]
                  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                  {lodgingItem.roomPrice}원 / 1박
                </p>
              ) : null
            )}
            <h3>체크인/체크아웃</h3>
            <p>
              {lodging[0]?.checkIn} / {lodging[0]?.checkOut}
            </p>
          </RoomInfo>
        </InfoAreaOne>
        <InfoAreaTwo>
          <div>{lodging[0]?.name}</div>
          <div>{lodging[0]?.detail}</div>
        </InfoAreaTwo>
      </Layout>

      <NaviButtons>
        {/* 뒤로 가기: Redux 상태 초기화 + 이전 페이지 이동 */}
        <PrevStep
          onClick={() => {
            dispatch(setSelectedLodging(null)); // 선택된 숙소 초기화
            navigate('/manager/enroll/package/lodging/list'); // 이전 페이지 이동
          }}
        >
          뒤로
        </PrevStep>

        {/* 숙소 선택 후 다음 단계 */}
        <NextStep onClick={() => onSelect(lodging)}>
          해당 숙소 선택 후 프로그램 설정
        </NextStep>
      </NaviButtons>
    </WholeArea>
  );
};

export default EnrollLodgingDetailData;
