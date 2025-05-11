import React, { useState } from 'react';
import styled from 'styled-components';
import Pagination from '../../Pagination';
import Button1 from '../../Button1';

const TableWrapper = styled.div`
  width: 94%;
  margin-top: 20px;
  padding-top: 20px;
`;

const StyledTable = styled.table`
  width: 100%;
  border-collapse: collapse;
  table-layout: fixed; /* 테이블 레이아웃 고정 */
`;

const TableHeader = styled.th`
  background-color: #f4f4f4;
  padding: 12px;
  text-align: center;
  font-weight: bold;
  border-bottom: 1px solid #ddd;
  cursor: pointer;
  width: 20%;
`;

const TableCell = styled.td`
  padding: 10px;
  text-align: center;
  border-bottom: 1px solid #ddd;
  color: ${({ isSelected }) =>
    isSelected ? 'purple' : 'black'}; /* 글자색 보라색 */
  width: 20%;
`;

const NoDataRow = styled.tr`
  text-align: center;
`;

const PaginationWrapper = styled.div`
  display: flex;
  justify-content: center;
  margin-top: 20px;
`;

const SelectAllButton = styled.button`
  background-color: transparent;
  border: none;
  color: #6200ea;
  font-weight: bold;
  cursor: pointer;
`;

const FunctionBar = styled.div`
  margin-top: 20px;
  display: flex;
  justify-content: space-evenly;
  align-items: center;
  gap: 20px; /* 버튼 사이 간격 추가 */
`;

const ButtonContainer = styled.div`
  display: flex;
  gap: 10px; /* 버튼들 간격 추가 */
`;

const TourListData = ({
  tours = [],
  totalPages,
  currentPage,
  setCurrentPage,
}) => {
  const [selectedTours, setSelectedTours] = useState([]);
  const [isSelectAll, setIsSelectAll] = useState(false);

  // 전체 선택/해제 처리
  const handleSelectAll = () => {
    if (isSelectAll) {
      setSelectedTours([]);
    } else {
      setSelectedTours(tours.map((tour) => tour.no)); // 모든 패키지 선택
    }
    setIsSelectAll(!isSelectAll);
  };

  // 개별 항목 선택/해제 처리
  const handleSelectTour = (tourNo) => {
    if (selectedTours.includes(tourNo)) {
      setSelectedTours(selectedTours.filter((no) => no !== tourNo));
    } else {
      setSelectedTours([...selectedTours, tourNo]);
    }
  };

  return (
    <TableWrapper>
      <StyledTable>
        <thead>
          <tr>
            <TableHeader>번호</TableHeader>
            <TableHeader>관광지 명</TableHeader>
            <TableHeader>지역</TableHeader>
            <TableHeader>카테고리</TableHeader>
            <TableHeader>
              <SelectAllButton onClick={handleSelectAll}>
                {isSelectAll ? '전체 선택 해제' : '전체 선택'}
              </SelectAllButton>
            </TableHeader>
          </tr>
        </thead>
        <tbody>
          {tours.length > 0 ? (
            tours.map((tour) => (
              <tr key={tour.no}>
                <TableCell
                  isSelected={selectedTours.includes(tour.no)}
                  onClick={() => handleSelectTour(tour.no)}
                >
                  {tour.no}
                </TableCell>
                <TableCell
                  isSelected={selectedTours.includes(tour.no)}
                  onClick={() => handleSelectTour(tour.no)}
                >
                  {tour.name}
                </TableCell>
                <TableCell
                  isSelected={selectedTours.includes(tour.no)}
                  onClick={() => handleSelectTour(tour.no)}
                >
                  {tour.regionNo}
                </TableCell>
                <TableCell
                  isSelected={selectedTours.includes(tour.no)}
                  onClick={() => handleSelectTour(tour.no)}
                >
                  {tour.category}
                </TableCell>
                <TableCell>
                  <input
                    type="checkbox"
                    checked={selectedTours.includes(tour.no)}
                    onChange={() => handleSelectTour(tour.no)}
                  />
                </TableCell>
              </tr>
            ))
          ) : (
            <NoDataRow>
              <TableCell colSpan="5">데이터가 없습니다.</TableCell>
            </NoDataRow>
          )}
        </tbody>
      </StyledTable>

      <FunctionBar>
        <ButtonContainer>
          <Button1>등록</Button1>
          <Button1>수정</Button1>
        </ButtonContainer>

        <PaginationWrapper>
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
          />
        </PaginationWrapper>

        <ButtonContainer>
          <Button1>삭제</Button1>
        </ButtonContainer>
      </FunctionBar>
    </TableWrapper>
  );
};
export default TourListData;
