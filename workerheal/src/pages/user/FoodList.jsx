import React, { useState } from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { foodVo, plusPno } from '../../redux/foodSlice';
import SearchBox from '../../common/components/SearchBox';
import CardList from '../../common/components/CardList';
import InfiniteScroll from '../../common/components/InfiniteScroll';

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

const FoodList = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const foodList = useSelector((state) => state.food.foodList);
  const pno = useSelector((state) => state.office.pno);

  const [hasMore, setHasMore] = useState(true);

  // 서버에서 오피스 목록 가져오기
  const fetchData = async () => {
    console.log(`Fetching more data... (Current Page: ${pno})`);

    try {
      const response = await fetch(
        `http://localhost:8080/api/food/list?page=${pno}&size=20`
      );

      if (!response.ok) throw new Error('Failed to fetch office data');

      const data = await response.json();

      // 데이터가 없을 경우 무한 스크롤 중단
      if (!data || data.length === 0) {
        setHasMore(false);
        return;
      }

      // 기존 데이터와 중복되지 않도록 필터링
      const newFoodList = data.filter(
        (newItem) =>
          !foodList.some(
            (existingItem) => existingItem.foodNo === newItem.foodNo
          )
      );

      if (newFoodList.length === 0) {
        setHasMore(false); //중복된 데이터만 있다면 스크롤 중단
        return;
      }

      // Redux 상태 업데이트 (기존 데이터 + 새로운 데이터 추가)
      dispatch(foodVo([...foodList, ...newFoodList]));

      // 데이터가 있는 경우에만 페이지 증가
      dispatch(plusPno());
    } catch (error) {
      console.error('❌ Fetch error:', error);
      setHasMore(false);
    }
  };

  return (
    <>
      <Layout>
        <Search>
          <SearchBox />
        </Search>
        <InfiniteScroll
          fetchData={fetchData}
          hasMore={hasMore}
          threshold={[0.5]}
        >
          <CardContainer>
            {foodList.map((food) => (
              <CardList
                key={food.no} // 오피스 고유 ID
                cardSrc={
                  food.path ||
                  'https://cdn.pixabay.com/photo/2016/11/19/13/06/bed-1839183_1280.jpg'
                } // 대표 이미지 (없을 경우 기본 이미지)
                cardName={food.name} // 오피스 이름
                cardLocation={food.roadAddress} // 도로명 주소
                cardTag={food.tag} // 태그 정보
                // cardScope={food.score} // 평균 별점
                cardCount={'122'} // 리뷰 개수 (쿼리에서 제공되지 않음, 나중에 추가)
                cardLimitPeople={food.capacity} // 수용 가능 인원
                onClick={(no) => navigate(`/food/detail?no=${food.no}`)} // ✅ 클릭하면 상세 페이지로 이동
              />
            ))}
          </CardContainer>
        </InfiniteScroll>
      </Layout>
    </>
  );
};

export default FoodList;
