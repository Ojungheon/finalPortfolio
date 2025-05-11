import React, { useState } from 'react';
import styled from 'styled-components';
import Pagination from '../../Pagination';
import ButtonS from '../../ButtonS';
import { useNavigate } from 'react-router-dom';

const API_SERVER = process.env.REACT_APP_SERVER_ROOT;

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

const MemberListData = ({
  members,
  totalPages,
  currentPage,
  setCurrentPage,
}) => {
  const navigate = useNavigate();

  return (
    <TableWrapper>
      <StyledTable>
        <thead>
          <tr>
            <TableHeader>회원 명</TableHeader>
            <TableHeader>이메일</TableHeader>
            <TableHeader>연락처</TableHeader>
            <TableHeader>가입일자</TableHeader>
            <TableHeader>회원상태</TableHeader>
          </tr>
        </thead>
        <tbody>
          {members.length > 0 ? (
            members.map((member) => (
              <tr key={member.no}>
                <TableCell
                  style={{
                    color:
                      member.delYn?.toLowerCase() === 'y' ? 'red' : 'black',
                  }}
                >
                  {member.name}
                </TableCell>
                <TableCell
                  style={{
                    color:
                      member.delYn?.toLowerCase() === 'y' ? 'red' : 'black',
                  }}
                >
                  {member.id}
                </TableCell>
                <TableCell
                  style={{
                    color:
                      member.delYn?.toLowerCase() === 'y' ? 'red' : 'black',
                  }}
                >
                  {member.phone}
                </TableCell>
                <TableCell
                  style={{
                    color:
                      member.delYn?.toLowerCase() === 'y' ? 'red' : 'black',
                  }}
                >
                  {member.enrollDate}
                </TableCell>
                <TableCell
                  style={{
                    color:
                      member.delYn?.toLowerCase() === 'y' ? 'red' : 'black',
                  }}
                >
                  {member.delYn === 'N' ? '회원' : '탈퇴'}
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
export default MemberListData;
