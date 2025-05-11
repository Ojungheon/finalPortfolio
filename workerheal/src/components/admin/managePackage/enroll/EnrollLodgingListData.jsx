import React from 'react';
import styled from 'styled-components';
import Pagination from '../../../Pagination';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { setSelectedLodging } from '../../../../redux/packageSlice';

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

const EnrollLodgingListData = ({
  lodgings,
  totalPages,
  currentPage,
  setCurrentPage,
}) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleSelectLodging = (lodging) => {
    dispatch(setSelectedLodging(lodging)); // Redux에 선택한 숙소 저장
    navigate(`/manager/enroll/package/lodging/${lodging.no}`);
  };

  return (
    <TableWrapper>
      <StyledTable>
        <thead>
          <tr>
            <TableHeader>번호</TableHeader>
            <TableHeader>숙소 명</TableHeader>
            <TableHeader>지역</TableHeader>
            <TableHeader>등록일자</TableHeader>
            <TableHeader>사업자명</TableHeader>
          </tr>
        </thead>
        <tbody>
          {lodgings.length > 0 ? (
            lodgings.map((ldg) => (
              <tr key={ldg.no} onClick={() => handleSelectLodging(ldg)}>
                <TableCell>{ldg.no}</TableCell>
                <TableCell>{ldg.name}</TableCell>
                <TableCell>{ldg.regionName}</TableCell>
                <TableCell>{ldg.enrollDate}</TableCell>
                <TableCell>{ldg.hostName}</TableCell>
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

export default EnrollLodgingListData;
