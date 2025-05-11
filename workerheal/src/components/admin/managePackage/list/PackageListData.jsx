import React, { useState } from 'react';
import styled from 'styled-components';
import Pagination from '../../../Pagination';
import ButtonS from '../../../ButtonS';
import { useDispatch } from 'react-redux';
import { setPackageNo } from '../../../../redux/packageSlice'; // Redux에서 setPackageNo 액션을 임포트
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
  table-layout: fixed;
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
  color: ${({ isSelected }) => (isSelected ? 'purple' : 'black')};
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
  gap: 20px;
`;

const ButtonContainer = styled.div`
  display: flex;
  gap: 10px;
`;

const PackageListData = ({
  packages = [],
  setPackages = [],
  totalPages,
  setTotalPages,
  currentPage,
  setCurrentPage,
}) => {
  const dispatch = useDispatch(); // Redux dispatch 사용
  const navigate = useNavigate(); // 페이지 이동을 위한 navigate 사용
  const [selectedPackages, setSelectedPackages] = useState([]);
  const [isSelectAll, setIsSelectAll] = useState(false);

  const handleSelectAll = () => {
    if (isSelectAll) {
      setSelectedPackages([]);
    } else {
      setSelectedPackages(packages.map((pkg) => pkg.no));
    }
    setIsSelectAll(!isSelectAll);
  };

  const handleNaviInNewtap = (pkgNo) => {
    navigate(`/package/detail?no=${pkgNo}`);
  };

  const handleEdit = (pkgNo) => {
    // 패키지 번호를 Redux에 저장
    dispatch(setPackageNo(pkgNo));
    // 수정 화면으로 이동
    navigate('/manager/edit/package/lodging/list');
  };

  const handleSelectPackage = (pkgNo) => {
    if (selectedPackages.includes(pkgNo)) {
      setSelectedPackages(selectedPackages.filter((no) => no !== pkgNo));
    } else {
      setSelectedPackages([...selectedPackages, pkgNo]);
    }
  };

  // ✅ 삭제 기능 (API 요청 포함)
  const handleDelete = async () => {
    try {
      if (selectedPackages.length === 0) {
        alert('삭제할 패키지를 선택하세요.');
        return;
      }

      const selectedNoList = selectedPackages.map((pkgNo) => pkgNo.toString());
      console.log('selectedNoList:', selectedNoList);

      const response = await fetch(
        `http://${API_SERVER}/api/manager/packages/delete`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            token: localStorage.getItem('token'),
          },
          body: JSON.stringify(selectedNoList),
        }
      );

      if (response.ok) {
        alert('삭제되었습니다.');
        // setSelectedPackages([]); // 선택된 항목 초기화
        // setCurrentPage(1);

        // 삭제 후 최신 패키지 리스트를 다시 불러옵니다.
        fetchUpdatedPackages(); // 최신 데이터를 가져오는 함수 호출
      } else {
        throw new Error('삭제 요청 실패');
      }
    } catch (error) {
      console.error('삭제 중 오류:', error);
      alert('삭제 중 문제가 발생했습니다.');
    }
  };

  // 최신 데이터 불러오는 함수
  const fetchUpdatedPackages = async () => {
    try {
      const response = await fetch(
        `http://${API_SERVER}/api/manager/packages/list?page=${currentPage}&pageSize=10`,
        {
          method: 'GET', // 기본적으로 GET 요청
          headers: {
            'Content-Type': 'application/json', // 서버에 JSON 데이터를 보낼 때 사용
            token: sessionStorage.getItem('token'),
          },
        }
      );

      if (response.ok) {
        const data = await response.json();
        console.log('data :: ', data);

        setPackages(data.content || []); // 최신 데이터를 화면에 반영
        setTotalPages(data.totalPages || []); // 최신 데이터를 화면에 반영
      } else {
        throw new Error('데이터 불러오기 실패');
      }
    } catch (error) {
      console.error('데이터 로드 중 오류:', error);
    }
  };

  return (
    <TableWrapper>
      <StyledTable>
        <thead>
          <tr>
            <TableHeader>번호</TableHeader>
            <TableHeader>패키지 명</TableHeader>
            <TableHeader>지역</TableHeader>
            <TableHeader>등록일자</TableHeader>
            <TableHeader>상태</TableHeader>
            <TableHeader>상세보기</TableHeader>
            <TableHeader>수정</TableHeader>
            <TableHeader>
              <SelectAllButton onClick={handleSelectAll}>
                {isSelectAll ? '전체 선택 해제' : '전체 선택'}
              </SelectAllButton>
            </TableHeader>
          </tr>
        </thead>
        <tbody>
          {packages.length > 0 ? (
            packages.map((pkg) => (
              <tr key={pkg.no}>
                <TableCell
                  isSelected={selectedPackages.includes(pkg.no)}
                  onClick={() => handleSelectPackage(pkg.no)}
                >
                  {pkg.no}
                </TableCell>
                <TableCell
                  isSelected={selectedPackages.includes(pkg.no)}
                  onClick={() => handleSelectPackage(pkg.no)}
                >
                  {pkg.name}
                </TableCell>
                <TableCell
                  isSelected={selectedPackages.includes(pkg.no)}
                  onClick={() => handleSelectPackage(pkg.no)}
                >
                  {pkg.regionName}
                </TableCell>
                <TableCell
                  isSelected={selectedPackages.includes(pkg.no)}
                  onClick={() => handleSelectPackage(pkg.no)}
                >
                  {pkg.enrollDate}
                </TableCell>
                <TableCell
                  isSelected={selectedPackages.includes(pkg.no)}
                  onClick={() => handleSelectPackage(pkg.no)}
                >
                  {pkg.finishYn === 'Y' ? '완료' : '진행중'}
                </TableCell>
                <TableCell>
                  <ButtonS
                    h={`30px`}
                    f={`0.9rem`}
                    r={`12px`}
                    onClick={() => {
                      handleNaviInNewtap(pkg.no);
                    }}
                  >
                    {' '}
                    상세보기
                  </ButtonS>
                </TableCell>
                <TableCell>
                  <ButtonS
                    h={`30px`}
                    f={`0.9rem`}
                    r={`12px`}
                    onClick={() => {
                      handleEdit(pkg.no); // 수정 버튼 클릭 시 패키지 번호 Redux에 저장 후 이동
                    }}
                  >
                    수정
                  </ButtonS>
                </TableCell>
                <TableCell>
                  <input
                    type="checkbox"
                    checked={selectedPackages.includes(pkg.no)}
                    onChange={() => handleSelectPackage(pkg.no)}
                  />
                </TableCell>
              </tr>
            ))
          ) : (
            <NoDataRow>
              <td colSpan={6}>등록된 패키지가 없습니다.</td>
            </NoDataRow>
          )}
        </tbody>
      </StyledTable>
      <FunctionBar>
        <ButtonContainer>
          <ButtonS
            onClick={() => {
              navigate('/manager/enroll/package/lodging/list');
            }}
          >
            등록
          </ButtonS>
        </ButtonContainer>

        <PaginationWrapper>
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
          />
        </PaginationWrapper>

        <ButtonContainer>
          <ButtonS onClick={handleDelete}>삭제</ButtonS>
        </ButtonContainer>
      </FunctionBar>
    </TableWrapper>
  );
};

export default PackageListData;
