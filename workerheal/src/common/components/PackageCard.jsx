import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { plusPno, setPackageList } from '../../redux/packageListSlice';
import SearchBox from './SearchBox';

const API_SERVER = process.env.REACT_APP_SERVER_ROOT;

const Pcard = styled.div`
  width: 640px;
  height: 260px;
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-template-rows: 1fr 1fr;
  position: relative;
  border-radius: 15px;
  overflow: hidden;
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-image: url(${(props) => props.backgroundImage});
    background-size: cover;
    background-position: center;
    transition: transform 0.3s ease-in-out;
  }

  &:hover::before {
    transform: scale(1.1);
  }
`;

const Search = styled.div`
  margin: 20px;
  margin-left: 55px;
`;

const CardContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 20px;
  width: 100%;
  max-width: 1300px;
  margin: 0 auto;
  justify-content: center;
`;

const Overlay = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  border-radius: 15px;
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-template-rows: 1fr 1fr;
`;

const Ptext = styled.div`
  display: flex;
  color: white;
  padding: 10px;
`;

const TopLeft = styled(Ptext)`
  justify-content: flex-start;
  align-items: flex-start;
  display: flex;
  flex-direction: column;
  display: grid;
  grid-template-rows: 50px 5fr;
  margin-left: 15px;
`;

const TopRight = styled(Ptext)`
  justify-content: flex-end;
  align-items: flex-start;
  margin-right: 15px;
`;

const BottomLeft = styled(Ptext)`
  justify-content: flex-start;
  align-items: flex-end;
  margin-left: 15px;
`;

const BottomRight = styled(Ptext)`
  justify-content: flex-end;
  align-items: flex-end;
  text-align: right;
  display: grid;
  grid-template-rows: 5fr 30px;
  margin-right: 15px;
`;

const PackageCard = ({ no }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const packageInfo = useSelector((state) => state.packageList.packageInfo);
  const pno = useSelector((state) => state.packageList.pno);

  const [hasMore, setHasMore] = useState(true);

  // 서버에서 오피스 목록 가져오기
  const fetchData = async () => {
    console.log(`Fetching more data... (Current Page: ${pno})`);
    const option = {
      method: 'GET',
      headers: {
        'content-type': 'application/json',
      },
    };
    try {
      const response = await fetch(
        `http://${API_SERVER}/api/package/list?page=${pno}&size=20`,
        option
      );

      if (!response.ok) throw new Error('Failed to fetch package data');

      const data = await response.json();

      // 데이터가 없을 경우 무한 스크롤 중단
      if (!data || data.length === 0) {
        setHasMore(false);
        return;
      }

      // 기존 데이터와 중복되지 않도록 필터링
      const newPackageList = data.filter(
        (newItem) =>
          !packageInfo.some((existingItem) => existingItem.no === newItem.no)
      );

      if (newPackageList.length === 0) {
        setHasMore(false); //중복된 데이터만 있다면 스크롤 중단
        return;
      }

      // Redux 상태 업데이트 (기존 데이터 + 새로운 데이터 추가)
      dispatch(setPackageList([...packageInfo, ...newPackageList]));

      // 데이터가 있는 경우에만 페이지 증가
      dispatch(plusPno());
    } catch (error) {
      console.error('❌ Fetch error:', error);
      setHasMore(false);
    }
  };

  return (
    <>
      <Search>
        <SearchBox />
      </Search>
      <CardContainer>
        {packageInfo.map((data) => (
          <Pcard
            backgroundImage={
              packageInfo.image ||
              'https://cdn.pixabay.com/photo/2016/11/19/13/06/bed-1839183_1280.jpg'
            }
          >
            <Overlay>
              <TopLeft>
                <h1>{packageInfo.title}</h1>
                <h3>{packageInfo.date}</h3>
              </TopLeft>
              <TopRight>
                <h3>{packageInfo.favorite}</h3>
              </TopRight>
              <BottomLeft>
                <h3>{packageInfo.rating}</h3>
              </BottomLeft>
              <BottomRight>
                <h1>{packageInfo.discount}</h1>
                <h3>{packageInfo.details}</h3>
              </BottomRight>
            </Overlay>
          </Pcard>
        ))}
      </CardContainer>
    </>
  );
};

export default PackageCard;
