import React, { useEffect, useState } from 'react';
import CardList from '../../common/components/CardList';
import SearchBox from '../../common/components/SearchBox';
import InfiniteScroll from '../../common/components/InfiniteScroll';
import styled from 'styled-components';
import { useDispatch, useSelector } from 'react-redux';
import {
  plusPno,
  setSelectedCategory,
  appendTours,
  tourVo,
} from '../../redux/tourSlice';
import { useNavigate } from 'react-router-dom';
import TourCardList from '../../common/components/TourCardList';

const API_SERVER = process.env.REACT_APP_SERVER_ROOT;

const Layout = styled.div`
  display: inline-block;
  margin-left: 60px;
`;

const Search = styled.div`
  margin: 20px;
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
`;

const TourList = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const tourList = useSelector((state) => state.tour.tourList);
  const pno = useSelector((state) => state.tour.pno);
  const selectedCategory = useSelector((state) => state.tour.selectedCategory);
  const [hasMore, setHasMore] = useState(true);
  // 현재 Redux 상태에서 tourList 가져오기
  const currentTourList = useSelector((state) => state.tour.tourList);

  // 관광 리스트 검색을 위한 코드임 #####################################
  const keyword = useSelector((state) => state.search.keyword); //  Redux Store에서 keyword 값을 가져옴
  const [filteredTourList, setFilteredTourList] = useState([]);

  useEffect(() => {
    if (!keyword.trim()) {
      setFilteredTourList(tourList); // 검색어가 없으면 전체 리스트
      return;
    }

    const results = tourList.filter((tour) =>
      tour.name.toLowerCase().includes(keyword.toLowerCase())
    );

    setFilteredTourList(results);
  }, [keyword, tourList]);

  // 서버에서 투어 목록 가져오기
  const fetchData = async () => {
    console.log(
      `Fetching data... (Category: ${selectedCategory}, Page: ${pno})`
    );
    const option = {
      method: 'GET',
      headers: {
        'content-type': 'application/json',
      },
    };

    console.log(`fetch 함수 호추루루루루루루루ㅜ ::::::::::::: ${API_SERVER}`);
    try {
      console.log(
        `fetch 함수 호추루루루루루루루ㅜ ::::::::::::: ${API_SERVER}`
      );

      const response = await fetch(
        `http://${API_SERVER}/api/tour/list?cateNo=${selectedCategory}&page=${pno}&size=20`,
        option
      );

      if (!response.ok) throw new Error('Failed to fetch tour data');
      const data = await response.json();

      if (!data || data.length === 0) {
        setHasMore(false); // 데이터가 없으면 스크롤 중단
        return;
      }

      // Set을 사용한 중복 제거
      const existingIds = new Set(currentTourList.map((item) => item.no));
      const newTourList = data.filter((item) => !existingIds.has(item.no));

      if (newTourList.length === 0) {
        setHasMore(false);
        return;
      }

      // Redux 상태 업데이트
      // dispatch(appendTours(newTourList));
      dispatch(tourVo(newTourList));
      dispatch(plusPno());
    } catch (error) {
      console.error('❌ Fetch error:', error);
      setHasMore(false);
    }
  };

  // `selectedCategory`가 변경될 때 데이터를 새로 불러오기
  useEffect(() => {
    dispatch(setSelectedCategory(selectedCategory)); // Redux 상태 업데이트
    dispatch(appendTours([])); // 기존 데이터 초기화
    setHasMore(true);
    // fetchData(); // 새 데이터 불러오기
  }, [selectedCategory, dispatch]);

  return (
    <Layout>
      <Search>
        <SearchBox category="tour" />
      </Search>
      <InfiniteScroll fetchData={fetchData} hasMore={hasMore} threshold={[0.5]}>
        <CardContainer>
          {keyword && filteredTourList.length === 0 ? (
            <NoResults>검색 결과가 없습니다.</NoResults>
          ) : (
            filteredTourList.map((tour) => (
              <TourCardList
                key={tour.no}
                cardSrc={
                  tour.path ||
                  'https://cdn.pixabay.com/photo/2016/11/19/13/06/bed-1839183_1280.jpg'
                }
                cardName={tour.name}
                cardLocation={tour.roadAddress}
                cardTag={tour.tag}
                onClick={() => navigate(`/tour/detail?no=${tour.no}`)}
              />
            ))
          )}
        </CardContainer>
      </InfiniteScroll>
    </Layout>
  );
};

export default TourList;
