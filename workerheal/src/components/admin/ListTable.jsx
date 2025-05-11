import React, { useState } from 'react';
import styled from 'styled-components';
import Pagination from '../Pagination';
import Button1 from '../Button1';
import ButtonS from '../ButtonS';
import { deleteTourList } from '../../services/tourService';
import { deleteOfficeList } from '../../services/officeService';
import { deleteLodgingList } from '../../services/lodgingService';
import WindowOpenBtn from './WindowOpenBtn';
import { Alert, BlockAlert, Check, Toast, Toast2 } from '../../utils/toast';

/* ################################## styled components start ################################## */
const TableWrapper = styled.div`
  width: 94%;
  /* margin-top: 20px; */
  /* padding-top: 20px; */
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
  cursor: default;
`;

const TableCell = styled.td`
  padding: 10px;
  text-align: center;
  justify-items: center;
  border-bottom: 1px solid #ddd;
  color: ${({ checked }) => (checked ? 'white' : 'black')}; /* 글자색 보라색 */
  background-color: ${({ checked }) =>
    checked ? `var(--secondary-main)` : 'white'}; /* 글자색 보라색 */
`;

const NoDataRow = styled.tr`
  text-align: center;
`;

const PaginationWrapper = styled.div`
  display: flex;
  justify-content: center;
  /* margin-top: 5px; */
`;

const SelectAllButton = styled.button`
  background-color: transparent;
  border: none;
  // color: #6200ea;
  color: var(--secondary-main);
  font-weight: bold;
  cursor: pointer;
`;

const FunctionBar = styled.div`
  margin-top: 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 20px; /* 버튼 사이 간격 추가 */
`;

const ButtonContainer = styled.div`
  display: flex;
  visibility: ${(props) => (props.show ? props.show : 'visible')};
  gap: 10px; /* 버튼들 간격 추가 */
`;

/* ################################## styled components end ################################## */

const ListTable = ({
  type,
  list,
  totalPages,
  currentPage,
  onPageChange,
  headerList,
  detailLink,
  editLink,
  show,
}) => {
  const [selecteditems, setSelecteditems] = useState([]);
  const [isSelectAll, setIsSelectAll] = useState(false);

  /* ################### 전체 선택/해제 처리  ################### */
  const handleSelectAll = () => {
    if (isSelectAll) {
      setSelecteditems([]);
    } else {
      setSelecteditems(list.map((data) => data.no)); // 모든 패키지 선택 // 이미 선택 후 전체 선택 누르면 중복?
    }
    setIsSelectAll(!isSelectAll);
  };

  /* ################### 개별 항목 선택/해제 처리  ################### */
  const handleSelectItem = (selectNo) => {
    if (selecteditems.includes(selectNo)) {
      setSelecteditems(selecteditems.filter((no) => no !== selectNo));
    } else {
      setSelecteditems([...selecteditems, selectNo]);
    }
  };

  /* ################### 항목 정보 삭제 ################### */
  const handleDelete = async () => {
    const isCheck = await Check({
      icon: 'question',
      title: '정말 삭제하시겠습니까?',
      text: '',
    });

    if (!isCheck.isConfirmed) {
      return;
    }

    try {
      if (type == 'tour') {
        await deleteTourList(selecteditems);
      } else if (type == 'office') {
        await deleteOfficeList(selecteditems);
      } else {
        await deleteLodgingList(selecteditems);
      }

      await BlockAlert({
        icon: 'success',
        title: '삭제되었습니다.',
        text: '',
      }).then((resp) => {
        if (resp.isConfirmed) {
          onPageChange(currentPage);
        }
      });
    } catch (error) {
      Toast2.fire({
        icon: 'error',
        title: error.message,
      });
    }
  };

  return (
    <TableWrapper>
      <StyledTable>
        <colgroup>
          {headerList
            .filter((header) => header.col !== 'placeType')
            .map((header) => {
              return (
                <col
                  key={header.no}
                  style={{
                    width: header.width != '' ? header.width : '7px',
                  }}
                />
              );
            })}
        </colgroup>
        <thead>
          <tr>
            {headerList
              .filter((header) => header.col !== 'placeType')
              .map((header) => {
                return (
                  <TableHeader key={header.no} width={header.width}>
                    {header.col == 'delete' ? (
                      <SelectAllButton
                        onClick={handleSelectAll}
                        style={{ cursor: 'pointer' }}
                      >
                        {isSelectAll ? '선택 해제' : '전체 선택'}
                      </SelectAllButton>
                    ) : (
                      header.name
                    )}
                  </TableHeader>
                );
              })}
          </tr>
        </thead>
        <tbody>
          {list.length > 0 ? (
            list.map((data) => (
              <tr key={data.no}>
                {headerList
                  .filter((header) => header.col !== 'placeType')
                  .map((header) => {
                    return (
                      <TableCell
                        key={header.no}
                        checked={selecteditems.includes(data.no)}
                      >
                        {header.col == 'detail' ? (
                          <WindowOpenBtn
                            h={'30px'}
                            f={'0.9rem'}
                            r={'10px'}
                            to={
                              '/' +
                              (type == 'approval'
                                ? 'manager/approval/' + data.placeType
                                : type) +
                              '/detail?no=' +
                              data.no
                            }
                          >
                            상세조회
                          </WindowOpenBtn>
                        ) : header.col == 'edit' ? (
                          <Button1
                            h={'30px'}
                            w={'70px'}
                            f={'0.9rem'}
                            r={'10px'}
                            to={editLink + data.no}
                          >
                            수정
                          </Button1>
                        ) : header.col == 'delete' ? (
                          <input
                            type="checkbox"
                            style={{ cursor: 'pointer' }}
                            checked={selecteditems.includes(data.no)}
                            onChange={() => handleSelectItem(data.no)}
                          />
                        ) : (
                          data[header.col]
                        )}
                      </TableCell>
                    );
                  })}
              </tr>
            ))
          ) : (
            <NoDataRow>
              <TableCell colSpan={headerList.length}>
                데이터가 없습니다.
              </TableCell>
            </NoDataRow>
          )}
        </tbody>
      </StyledTable>

      <FunctionBar>
        <ButtonContainer>
          <button style={{ visibility: 'hidden', width: '80px' }}></button>
        </ButtonContainer>

        <PaginationWrapper>
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={onPageChange}
          />
        </PaginationWrapper>

        <ButtonContainer show={show}>
          <ButtonS onClick={handleDelete}>삭제</ButtonS>
        </ButtonContainer>
      </FunctionBar>
    </TableWrapper>
  );
};
export default ListTable;
