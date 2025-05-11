import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import ReservatedCard from '../../common/components/ReservatedCard';
import { useSelector } from 'react-redux';
import EmptyState from '../../common/components/EmptyState';
import GifState from '../../common/components/GifState';
import Dropdown from '../../common/components/Dropdown';

const API_SERVER = process.env.REACT_APP_SERVER_ROOT;

// 전체 컨테이너
const Container = styled.div`
  max-width: 1200px;
  margin: 50px auto;
  font-family: 'Arial', sans-serif;
`;

// 필터 드롭다운 컨테이너
const FilterContainer = styled.div`
  display: flex;
  gap: 32px;
  margin-bottom: 20px;
  flex-wrap: wrap;
`;

// 카드 레이아웃
const CardGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(
    auto-fill,
    minmax(275px, 1fr)
  ); /* ✅ 최소 275px 유지 */
  gap: 30px;
  max-width: 1200px;
  margin: 0 auto;
`;

const Reservated = () => {
  const member = useSelector((state) => state.member.member);
  const [reservatedItems, setReservatedItems] = useState([]);
  const [loading, setLoading] = useState(true);

  // 필터 상태
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedRegion, setSelectedRegion] = useState('');
  const [selectedYear, setSelectedYear] = useState('');
  const [selectedMonth, setSelectedMonth] = useState('');

  const token = useSelector((state) => state.member.token); // ✅ Redux에서 token 가져오기

  // ✅ 서버에서 예약 내역 불러오기 (useEffect 내부에서 실행)
  useEffect(() => {
    const token = sessionStorage.getItem('token'); // ✅ 로컬 스토리지에서 JWT 가져오기
    console.log('토큰 :', token);
    // 🔹 예외 처리: member.no가 없거나 토큰이 없으면 요청을 보내지 않음
    if (!member?.no || !token) {
      setLoading(false);
      return;
    }

    fetch(`http://${API_SERVER}/api/member/reservated/${member.no}`, {
      method: 'GET',
      headers: {
        token: sessionStorage.getItem('token'),
        'Content-Type': 'application/json',
      },
    })
      .then((res) => res.json())
      .then((data) => {
        console.log('서버 응답 데이터:', data); // 🔹 데이터 구조 확인
        if (Array.isArray(data)) {
          // 🔹 배열인지 체크
          setReservatedItems(data);
        } else {
          setReservatedItems([]); // 🔹 배열이 아니라면 빈 배열 설정
        }
        setLoading(false);
      })
      .catch((err) => {
        console.error('예약 내역 불러오기 오류:', err);
        setLoading(false);
      });
  }, [member.no]); // 🔹 의존성 배열: member.no 값이 변경될 때만 요청

  // ✅ 필터링된 리스트
  const filteredItems = reservatedItems.filter((item) => {
    if (!item.startDate) return false; // 🔹 startDate가 없는 경우 예외 처리
    console.log('item', item);
    const [year, month] = item.startDate.split('-');

    return (
      (selectedCategory ? item.productType === selectedCategory : true) &&
      (selectedRegion ? item.region === selectedRegion : true) &&
      (selectedYear ? year === selectedYear : true) &&
      (selectedMonth ? month === selectedMonth : true)
    );
  });

  return (
    <Container>
      <h2>예약 내역</h2>

      {/* 로딩 상태 표시 */}
      {loading ? (
        <GifState message="예약 내역을 불러오는 중..." />
      ) : (
        <>
          {/* 필터 */}
          <FilterContainer>
            {/* 카테고리 필터 */}
            <Dropdown
              options={['', '숙소', '오피스', '패키지', '관광']}
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

            {/* 년도 필터 */}
            <Dropdown
              options={['', '2025', '2024', '2023']}
              selected={selectedYear}
              onSelect={setSelectedYear}
              placeholder="년도"
            />

            {/* 월 필터 */}
            <Dropdown
              options={[
                '',
                ...new Set(
                  reservatedItems.map((item) => item.startDate?.split('-')[1])
                ),
              ]}
              selected={selectedMonth}
              onSelect={setSelectedMonth}
              placeholder="월"
            />
          </FilterContainer>

          {/* 예약 상품 목록 */}
          <CardGrid>
            {filteredItems.length > 0 ? (
              filteredItems.map((item, index) => (
                <ReservatedCard
                  key={index}
                  item={{
                    id: item.reservationNo ?? '', // ✅ 예약번호를 명확히 설정
                    title: item.name,
                    location: item.region,
                    reservateNum: item.reservateNum,
                    startDate: item.startDate.split(' ')[0], // ✅ 날짜만 추출
                    endDate: item.endDate.split(' ')[0], // ✅ 날짜만 추출
                    price: item.price,
                    productType: item.productType,
                    img:
                      item.imagePath ||
                      'https://picsum.photos/1200/900?random=5',
                    reviewed: false, // 리뷰 기능을 추가하려면 서버에서 받아오도록 수정 가능
                  }}
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

export default Reservated;
