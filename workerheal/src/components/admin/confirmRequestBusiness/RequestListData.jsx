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

const RequestListData = ({
  requests = [],
  totalPages,
  currentPage,
  setCurrentPage,
}) => {
  const [selectedRequests, setSelectedRequests] = useState([]);
  const [isSelectAll, setIsSelectAll] = useState(false);

  // 전체 선택/해제 처리
  const handleSelectAll = () => {
    if (isSelectAll) {
      setSelectedRequests([]);
    } else {
      setSelectedRequests(requests.map((request) => request.no)); // 모든 패키지 선택
    }
    setIsSelectAll(!isSelectAll);
  };

  // 개별 항목 선택/해제 처리
  const handleSelectRequest = (requestNo) => {
    if (selectedRequests.includes(requestNo)) {
      setSelectedRequests(selectedRequests.filter((no) => no !== requestNo));
    } else {
      setSelectedRequests([...selectedRequests, requestNo]);
    }
  };

  return (
    <TableWrapper>
      <StyledTable>
        <thead>
          <tr>
            <TableHeader>번호</TableHeader>
            <TableHeader>사업장 명</TableHeader>
            <TableHeader>유형</TableHeader>
            <TableHeader>요청일자</TableHeader>
            <TableHeader>호스트 명</TableHeader>
            <TableHeader>상태</TableHeader>
            <TableHeader>
              <SelectAllButton onClick={handleSelectAll}>
                {isSelectAll ? '전체 선택 해제' : '전체 선택'}
              </SelectAllButton>
            </TableHeader>
          </tr>
        </thead>
        <tbody>
          {requests.length > 0 ? (
            requests.map((request) => (
              <tr key={request.no}>
                <TableCell
                  isSelected={selectedRequests.includes(request.no)}
                  onClick={() => handleSelectRequest(request.no)}
                >
                  {request.no}
                </TableCell>
                <TableCell
                  isSelected={selectedRequests.includes(request.no)}
                  onClick={() => handleSelectRequest(request.no)}
                >
                  {request.name}
                </TableCell>
                <TableCell
                  isSelected={selectedRequests.includes(request.no)}
                  onClick={() => handleSelectRequest(request.no)}
                >
                  {request.type}
                </TableCell>
                <TableCell
                  isSelected={selectedRequests.includes(request.no)}
                  onClick={() => handleSelectRequest(request.no)}
                >
                  {request.enrollDate}
                </TableCell>
                <TableCell
                  isSelected={selectedRequests.includes(request.no)}
                  onClick={() => handleSelectRequest(request.no)}
                >
                  {request.finishYn}
                </TableCell>
                <TableCell>
                  <input
                    type="checkbox"
                    checked={selectedRequests.includes(request.no)}
                    onChange={() => handleSelectTour(request.no)}
                  />
                </TableCell>
              </tr>
            ))
          ) : (
            <NoDataRow>
              <TableCell colSpan="7">데이터가 없습니다.</TableCell>
            </NoDataRow>
          )}
        </tbody>
      </StyledTable>

      <FunctionBar>
        <PaginationWrapper>
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
          />
        </PaginationWrapper>
      </FunctionBar>
    </TableWrapper>
  );
};
export default RequestListData;
