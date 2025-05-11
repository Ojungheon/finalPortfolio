import React from 'react';
import styled from 'styled-components';
import Pagination from '../../../Pagination';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { setSelectedProgram } from '../../../../redux/packageSlice';

const API_SERVER = process.env.REACT_APP_SERVER_ROOT;

const TableWrapper = styled.div`
  width: 94%;
  margin-top: 20px;
  padding-top: 20px;
`;

const StyledTable = styled.table`
  width: 100%;
  border-collapse: collapse;
  table-layout: fixed;
`;

const TableHeader = styled.th`
  background-color: #f4f4f4;
  padding: 12px;
  text-align: center;
  font-weight: bold;
  border-bottom: 1px solid #ddd;
`;

const TableCell = styled.td`
  padding: 10px;
  text-align: center;
  border-bottom: 1px solid #ddd;
  cursor: pointer;
  color: ${({ isSelected }) => (isSelected ? 'purple' : 'black')};
`;

const NoDataRow = styled.tr`
  text-align: center;
`;

const PaginationWrapper = styled.div`
  display: flex;
  justify-content: center;
  margin-top: 20px;
`;

const EnrollProgramListData = ({
  programs,
  totalPages,
  currentPage,
  setCurrentPage,
}) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleSelectProgram = (program) => {
    dispatch(setSelectedProgram(program)); // Redux에 선택한 숙소 저장
    navigate(`/manager/edit/package/program/${program.no}`); // 상세 페이지로 이동
  };

  return (
    <TableWrapper>
      <StyledTable>
        <thead>
          <tr>
            <TableHeader>번호</TableHeader>
            <TableHeader>프로그램 명</TableHeader>
            <TableHeader>지역</TableHeader>
            <TableHeader>등록일자</TableHeader>
            <TableHeader>가격 (1인)</TableHeader>
          </tr>
        </thead>
        <tbody>
          {programs.length > 0 ? (
            programs.map((prg) => (
              <tr key={prg.no} onClick={() => handleSelectProgram(prg)}>
                <TableCell>{prg.no}</TableCell>
                <TableCell>{prg.name}</TableCell>
                <TableCell>{prg.regionName}</TableCell>
                <TableCell>{prg.enrollDate}</TableCell>
                <TableCell>{prg.price}원 (1인)</TableCell>
              </tr>
            ))
          ) : (
            <NoDataRow>
              <TableCell colSpan="5">데이터가 없습니다.</TableCell>
            </NoDataRow>
          )}
        </tbody>
      </StyledTable>

      <PaginationWrapper>
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
        />
      </PaginationWrapper>
    </TableWrapper>
  );
};

export default EnrollProgramListData;
