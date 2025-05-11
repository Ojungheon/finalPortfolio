import React, { useState, useEffect } from 'react';
import CardList from '../../common/components/CardList';
import SearchBox from '../../common/components/SearchBox';
import InfiniteScroll from '../../common/components/InfiniteScroll';
import styled from 'styled-components';
import { useDispatch, useSelector } from 'react-redux';
import { officeVo, plusPno } from '../../redux/officeSlice';
import { useNavigate } from 'react-router-dom';
import { setKeyword } from '../../redux/searchSlice';
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

const OfficeList = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const officeList = useSelector((state) => state.office.officeList);
  const pno = useSelector((state) => state.office.pno);
  const [selectedRegion, setSelectedRegion] = useState('');

  // 오피스 리스트 검색을 위한 코드임 #####################################
  const keyword = useSelector((state) => state.search.keyword);
  const [filteredOfficeList, setFilteredOfficeList] = useState([]);

  useEffect(() => {
    let results = officeList;

    // 검색어 필터링
    if (keyword.trim()) {
      results = results.filter((office) =>
        office.officeName.toLowerCase().includes(keyword.toLowerCase())
      );
    }

    // 지역 필터링
    if (selectedRegion) {
      results = results.filter(
        (office) => office.regionName === selectedRegion
      );
    }

    setFilteredOfficeList(results);
  }, [keyword, selectedRegion, officeList]);

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
        `http://${API_SERVER}/api/office/list?pno=${pno}`,
        option
      );

      if (!response.ok) throw new Error('Failed to fetch office data');

      const data = await response.json();
      console.log('get Data ::::::::::::::::: ', data);

      // 데이터가 없을 경우 무한 스크롤 중단
      if (!data || data.length === 0) {
        console.log('중단함??????????? 왜?????????????');

        setHasMore(false);
        return;
      }

      console.log('officeList ::::: ', officeList);

      // 기존 데이터와 중복되지 않도록 필터링
      const newOfficeList = data.filter((newItem) => {
        console.log('newItem :::::::::::::', newItem);
        return !officeList.some(
          // (existingItem) => existingItem.officeNo === newItem.officeNo
          (existingItem) => existingItem.no === newItem.no // 태훈 수정
        );
      });

      console.log('newOfficeList :::::::::::::::: ', newOfficeList);

      if (newOfficeList.length === 0) {
        console.log('데이터 추가 안함 @@@@@@@@@@@@@@@@@@@@');
        setHasMore(false); //중복된 데이터만 있다면 스크롤 중단
        return;
      }

      // Redux 상태 업데이트 (기존 데이터 + 새로운 데이터 추가)
      dispatch(officeVo([...officeList, ...newOfficeList]));

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
          <SearchBox category="office" />
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
            {filteredOfficeList.length === 0 ? (
              <NoResults>검색 결과가 없습니다.</NoResults>
            ) : (
              filteredOfficeList.map((office) => (
                <CardList
                  key={office.no} // 오피스 고유 ID
                  legion={office.regionName}
                  no={office.no}
                  type="office"
                  cardSrc={
                    office.attachmentPath || // 태훈 수정
                    'https://cdn.pixabay.com/photo/2016/11/19/13/06/bed-1839183_1280.jpg'
                  } // 대표 이미지 (없을 경우 기본 이미지)
                  cardName={office.officeName} // 오피스 이름
                  cardLocation={office.officeAddress} // 도로명 주소
                  cardTag={office.officeTag} // 태그 정보
                  cardPrice={office.officePrice
                    .toString()
                    .replace(/\B(?=(\d{3})+(?!\d))/g, ',')} // 가격
                  cardScope={office.averageScore} // 평균 별점
                  cardCount={office.reviewCount} // 리뷰 개수
                  cardLimitPeople={office.capacity} // 수용 가능 인원
                  onClick={(no) => navigate(`/office/detail?no=${office.no}`)} // 클릭하면 상세 페이지로 이동
                />
              ))
            )}
          </CardContainer>
        </InfiniteScroll>
      </Layout>
    </>
  );
};

export default OfficeList;
