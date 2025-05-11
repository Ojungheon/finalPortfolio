import React, { useState, useEffect } from 'react';
import CardList from '../../common/components/CardList';
import SearchBox from '../../common/components/SearchBox';
import InfiniteScroll from '../../common/components/InfiniteScroll';
import styled from 'styled-components';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { lodgingVo, plusPno } from '../../redux/LodgingSlice';
import Dropdown from '../../common/components/Dropdown';

const API_SERVER = process.env.REACT_APP_SERVER_ROOT;

const Layout = styled.div`
  display: inline-block;
  margin-left: 60px;
`;

const Search = styled.div`
  margin: 20px;
`;

// 필터 컨테이너
const FilterContainer = styled.div`
  display: flex;
  justify-content: flex-start;
  gap: 30px;
  margin-bottom: 20px;
  margin-left: 22px;
`;

const CardContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 30px;
  margin-left: 20px;
`;

const NoResults = styled.p`
  text-align: center;
  color: #999;
  font-size: 16px;
  display: grid;
  gap: 30px;
  margin-left: 20px;
  width: 1300px;
  height: 500px;
  gap: 30px;
  margin: 11px auto;
  align-items: center;
`;

const LodgingList = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const lodgingList = useSelector((state) => state.lodging.lodgingList);
  const pno = useSelector((state) => state.lodging.pno);
  const [selectedRegion, setSelectedRegion] = useState('');
  const [hasMore, setHasMore] = useState(true);

  console.log('lodgingList::::::', lodgingList);

  // 검색 결과를 저장하는 상태
  const [filteredLodgingList, setFilteredLodgingList] = useState([]);
  const keyword = useSelector((state) => state.search.keyword);

  useEffect(() => {
    let results = lodgingList;

    // 검색어 필터링
    if (keyword.trim()) {
      results = results.filter((lodging) =>
        lodging.name.toLowerCase().includes(keyword.toLowerCase())
      );
    }

    // 지역 필터링
    if (selectedRegion) {
      results = results.filter(
        (lodging) => lodging.regionName === selectedRegion
      );
    }

    setFilteredLodgingList(results);
  }, [keyword, selectedRegion, lodgingList]);

  const fetchData = async () => {
    console.log(`Fetching more data... (Current Page: ${pno})`);
    try {
      const option = {
        method: 'GET',
        headers: {
          'content-type': 'application/json',
        },
      };

      const response = await fetch(
        `http://${API_SERVER}/api/lodging/list?pno=${pno}`,
        option
      );

      if (!response.ok) throw new Error('Failed to fetch lodging data');

      const data = await response.json();
      console.log('get Data ::::::::::::::::: ', data);

      // 데이터가 없을 경우 무한 스크롤 중단
      if (!data || data.length === 0) {
        console.log('중단함??????????? 왜?????????????');
        setHasMore(false);
        return;
      }

      // 기존 데이터와 중복되지 않도록 필터링
      const newLodgingList = data.filter((newItem) => {
        console.log('newItem :::::::::::::', newItem);
        return !lodgingList.some(
          // (existingItem) => existingItem.no === newItem.no
          (existingItem) => existingItem.no === newItem.no
        ); // 태훈 수정
      });

      console.log('newLodgingList :::::::::::::::: ', newLodgingList);

      if (newLodgingList.length == 0) {
        console.log('데이터 추가 안함 @@@@@@@@@@@@@@@@@@@@');
        setHasMore(false); //중복된 데이터만 있다면 스크롤 중단
        return;
      }

      // Redux 상태 업데이트 (기존 데이터 + 새로운 데이터 추가)
      dispatch(lodgingVo([...lodgingList, ...newLodgingList]));

      // 데이터가 있는 경우에만 페이지 증가
      dispatch(plusPno());
    } catch (error) {
      console.error('❌ Fetch error:', error);
      setHasMore(false);
    }
  };

  // useEffect(() => {
  //   fetchData();
  // }, []); // 태훈 수정 - 비활성화

  return (
    <>
      <Layout>
        <Search>
          <SearchBox category="lodging" />
        </Search>

        {/* 지역 필터 */}
        <FilterContainer>
          <Dropdown
            options={[
              '',
              '서울',
              '경기',
              '인천',
              '강원',
              '대전',
              '충북',
              '충남',
              '전남',
              '전북',
              '광주',
              '경북',
              '경남',
              '대구',
              '울산',
              '부산',
              '제주',
            ]}
            selected={selectedRegion}
            onSelect={setSelectedRegion}
            placeholder="지역"
          />
        </FilterContainer>

        <InfiniteScroll
          fetchData={fetchData}
          hasMore={hasMore}
          threshold={[0.5]}
        >
          <CardContainer>
            {filteredLodgingList.length === 0 ? (
              <NoResults>검색 결과가 없습니다.</NoResults>
            ) : (
              filteredLodgingList.map((lodging) => (
                <CardList
                  key={lodging.no}
                  no={lodging.no}
                  type="lodging"
                  cardSrc={
                    lodging.path ||
                    'https://cdn.pixabay.com/photo/2016/11/19/13/06/bed-1839183_1280.jpg'
                  }
                  cardName={lodging.name}
                  cardLocation={lodging.roadAddress}
                  cardTag={lodging.tag}
                  cardPrice={`${lodging.lowestPrice} ~`
                    .toString()
                    .replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                  cardScope={lodging.averageScore}
                  cardCount={lodging.count}
                  cardLimitPeople={lodging.sleeps}
                  onClick={() => navigate(`/lodging/detail?no=${lodging.no}`)}
                />
              ))
            )}
          </CardContainer>
        </InfiniteScroll>
      </Layout>
    </>
  );
};

export default LodgingList;
