import React, { useState } from "react";
import styled from "styled-components";
import Pagination from "../../components/Pagination";

// 전체 컨테이너
const Container = styled.div`
  max-width: 1100px; /* 전체 너비 증가 */
  margin: 50px auto;
  padding: 30px;
  font-family: "Arial", sans-serif;
`;

// 테이블 스타일
const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  text-align: center;
  font-size: 1.1rem; /* 폰트 크기 살짝 증가 */
`;

// 테이블 헤더
const TableHeader = styled.thead`
  background: white;
  border-bottom: 3px solid orange;
  font-weight: bold;
`;

// 테이블 행 스타일 (행 간격 증가)
const TableRow = styled.tr`
  border-bottom: 1px solid #ddd;
  height: 100px; /* 행 높이 증가 */
`;

// 테이블 셀 스타일 (열 간격 증가)
const TableCell = styled.td`
  padding: 30px 50px; /* 셀 간격 증가 */
  color: ${({ type }) =>
    type === "earned" ? "#0044FF" : type === "used" ? "red" : "black"};
  font-weight: ${({ type }) => (type ? "bold" : "normal")};
  text-align: center; /* 텍스트 중앙 정렬 */
`;

// 페이지네이션 컨테이너
const PaginationContainer = styled.div`
  margin-top: 30px;
  display: flex;
  justify-content: center;
`;

const Points = () => {
  // 샘플 데이터 (실제 백엔드 연동 시 API 데이터로 대체 가능)
  const pointHistory = [
    { id: 8, target: "수원 워크오피스", date: "2025.01.25", reason: "예약적립", points: 1000, balance: 5300, type: "earned" },
    { id: 7, target: "원주 워크오피스", date: "2025.01.19", reason: "예약적립", points: 1000, balance: 4300, type: "earned" },
    { id: 6, target: "속초 워크오피스", date: "2025.01.15", reason: "예약취소", points: 1800, balance: 3300, type: "earned" },
    { id: 5, target: "속초 워크오피스", date: "2025.01.13", reason: "예약적립", points: 200, balance: 1500, type: "earned" },
    { id: 4, target: "속초 워크오피스", date: "2025.01.13", reason: "포인트사용", points: 2000, balance: 1300, type: "used" },
    { id: 3, target: "강릉 리프레쉬 리조트", date: "2025.01.15", reason: "리뷰작성", points: 100, balance: 3300, type: "earned" },
    { id: 2, target: "강릉 리프레쉬 리조트", date: "2025.01.03", reason: "예약적립", points: 200, balance: 3200, type: "earned" },
    { id: 1, target: "웰컴 포인트 적립", date: "2025.01.01", reason: "기타", points: 3000, balance: 3000, type: "earned" }
  ];

  // 페이지네이션 상태
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;
  const totalPages = Math.ceil(pointHistory.length / itemsPerPage);

  // 현재 페이지 데이터 계산
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = pointHistory.slice(indexOfFirstItem, indexOfLastItem);

  return (
    <Container>
      <Table>
        <TableHeader>
          <TableRow>
            <th style={{ padding: "15px 20px" }}>번호</th>
            <th style={{ padding: "15px 20px" }}>대상</th>
            <th style={{ padding: "15px 20px" }}>일자</th>
            <th style={{ padding: "15px 20px" }}>사유</th>
            <th style={{ padding: "15px 20px" }}>처리포인트</th>
            <th style={{ padding: "15px 20px" }}>적용포인트</th>
          </TableRow>
        </TableHeader>
        <tbody>
          {currentItems.map((item) => (
            <TableRow key={item.id}>
              <TableCell>{item.id}</TableCell>
              <TableCell>{item.target}</TableCell>
              <TableCell>{item.date}</TableCell>
              <TableCell>{item.reason}</TableCell>
              <TableCell type={item.type}>
                {item.type === "used" ? `-${item.points}P` : `+${item.points}P`}
              </TableCell>
              <TableCell>{item.balance}P</TableCell>
            </TableRow>
          ))}
        </tbody>
      </Table>

      {/* 페이지네이션 */}
      <PaginationContainer>
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
        />
      </PaginationContainer>
    </Container>
  );
};

export default Points;
