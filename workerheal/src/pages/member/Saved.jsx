import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import SavedCard from '../../common/components/SavedCard';
import { useSelector } from 'react-redux';
import GifState from '../../common/components/GifState';
import EmptyState from '../../common/components/EmptyState';
import Dropdown from '../../common/components/Dropdown';

const API_SERVER = process.env.REACT_APP_SERVER_ROOT;

// 전체 컨테이너
const Container = styled.div`
  max-width: 1200px;
  margin: 50px auto;
  font-family: 'Arial', sans-serif;
`;

// 필터 컨테이너
const FilterContainer = styled.div`
  display: flex;
  justify-content: flex-start;
  gap: 30px;
  margin-bottom: 20px;
`;

// 카드 레이아웃
const CardGrid = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: flex-start;
  justify-content: flex-start;
  gap: 30px;
`;

const Saved = () => {
  const member = useSelector((state) => state.member.member);
  const [savedItems, setSavedItems] = useState([]);
  const [filteredItems, setFilteredItems] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedRegion, setSelectedRegion] = useState('');
  const [isCategoryOpen, setIsCategoryOpen] = useState(false);
  const [isRegionOpen, setIsRegionOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  // ✅ 서버에서 찜한 상품 불러오기
  useEffect(() => {
    const token = sessionStorage.getItem('token');

    if (!member?.no || !token) {
      console.warn('🚨 토큰이 없거나 회원 정보가 없음:', member);
      setLoading(false);
      return;
    }

    fetch(`http://${API_SERVER}/api/member/saved/${member.no}`, {
      method: 'GET', // 🚨 기존 코드에서 "POST" → "GET"으로 변경
      headers: {
        token: sessionStorage.getItem('token'), // ✅ Authorization 헤더 추가
        'Content-Type': 'application/json',
      },
    })
      .then((res) => {
        if (!res.ok) {
          throw new Error(`서버 응답 오류: ${res.status}`);
        }
        return res.json();
      })
      .then((data) => {
        console.log('✅ 서버 응답:', data);
        if (Array.isArray(data) && data.length > 0) {
          setSavedItems(data);
          setFilteredItems(data);
        } else {
          console.warn('⚠️ 찜한 상품 없음:', data);
          setSavedItems([]);
          setFilteredItems([]);
        }
        setLoading(false);
      })
      .catch((err) => {
        console.error('❌ 찜한 상품 불러오기 오류:', err);
        setLoading(false);
      });
  }, [member]); // ✅ member 값이 변경될 때만 실행

  // ✅ 찜 해제 처리
  const handleRemove = (name, productType) => {
    setSavedItems((prev) =>
      prev.filter(
        (item) => !(item.name === name && item.productType === productType)
      )
    );
    setFilteredItems((prev) =>
      prev.filter(
        (item) => !(item.name === name && item.productType === productType)
      )
    );
  };

  // ✅ 필터 적용 (카테고리 & 지역)
  useEffect(() => {
    if (!Array.isArray(savedItems)) return;

    setFilteredItems(
      savedItems.filter((item) => {
        return (
          (selectedCategory ? item.productType === selectedCategory : true) &&
          (selectedRegion ? item.region === selectedRegion : true)
        );
      })
    );
  }, [selectedCategory, selectedRegion, savedItems]);

  return (
    <Container>
      <h2>찜한 상품</h2>

      {loading ? (
        <GifState message="찜 내역 불러오는중..." />
      ) : (
        <>
          <FilterContainer>
            {/* 카테고리 필터 */}
            <Dropdown
              options={['', '숙소', '오피스', '패키지']}
              selected={selectedCategory}
              onSelect={setSelectedCategory}
              placeholder="유형"
            />

            {/* 지역 필터 */}
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

          <CardGrid>
            {filteredItems.length > 0 ? (
              filteredItems.map((item, index) => (
                <SavedCard
                  key={`${item.name}-${index}`}
                  item={{
                    no: item.no,
                    title: item.name,
                    score: item.score,
                    location: item.region,
                    tag: item.tag,
                    img:
                      item.imagePath ||
                      'https://picsum.photos/1200/900?random=5',
                    category: item.productType,
                    favorite: true,
                  }}
                  onRemove={() => handleRemove(item.name, item.productType)}
                />
              ))
            ) : (
              <EmptyState
                imageUrl="https://cdn-icons-png.flaticon.com/128/1376/1376786.png"
                message="예약된 내역이 없어요!"
              />
            )}
          </CardGrid>
        </>
      )}
    </Container>
  );
};

export default Saved;
