import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import MenuTitle from '../../../components/admin/MenuTitle';
import ListTable from '../../../components/admin/ListTable';
import { getOfficeList } from '../../../services/officeService';

/* ################################## 초기 데이터 start ################################## */
/* ##################### 테이블 헤더 ##################### */
const hearderList = [
  { no: 1, col: 'no', name: '번호', width: '7px' },
  { no: 2, col: 'regionName', name: '지역', width: '10px' },
  { no: 4, col: 'officeName', name: '오피스명', width: '20px' },
  { no: 5, col: 'hostName', name: '호스트', width: '15px' },
  { no: 6, col: 'score', name: '평점', width: '15px' },
  { no: 7, col: 'detail', name: '상세조회', width: '7px' },
  { no: 8, col: 'delete', name: '삭제', width: '5px' },
];
/* ################################## 초기 데이터 end ################################## */

/* ################################## styled components start ################################## */
const Layout = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  grid-template-rows: 1fr 6fr;
  width: 100%;
  /* height: calc(100%-85px); */
`;

const MainWrap = styled.div`
  display: flex;
  justify-content: center;
  width: 100%;
  height: 100%;
`;

const SearchBarContainer = styled.div`
  display: flex;
  align-items: flex-end; /* 요소들을 하단 정렬 */
  justify-content: space-between; /* 제목과 검색바를 양쪽 끝으로 배치 */
  width: calc(100% - 60px);
  padding-bottom: 10px;
  border-bottom: 1px solid gray;
`;

const SearchBar = styled.div`
  display: flex;
  align-items: flex-end; /* 내부 요소들 하단 정렬 */
  gap: 20px; /* 요소 간격 조정 */
`;
/* ################################## styled components end ################################## */

/* ################################## OfficeList components ################################## */
const OfficeList = () => {
  /* ################### state 생성 ################### */
  const [officeList, setOfficeList] = useState([]); // 패키지 데이터 상태
  const [currentPage, setCurrentPage] = useState({ pno: 1 }); // 현재 페이지 상태
  const [totalPages, setTotalPages] = useState(); // 전체 페이지 수 상태
  const [isLoading, setIsLoading] = useState(false); // 로딩 상태
  const limit = 10;

  /* ################### pno 설정 ################### */
  const setPno = (no) => {
    setCurrentPage({ pno: no });
  };

  /* ################### 오피스 목록 조회 ################### */
  const loadOfficeList = async () => {
    setIsLoading(true); // 데이터 요청 전 로딩 시작
    try {
      const getList = await getOfficeList(currentPage.pno, limit);
      console.log(getList);

      setOfficeList(getList.officeVoList);
      setTotalPages(getList.totalPages);
    } catch (error) {
      console.log('Error 발생~~~ ', error);
      alert(error);
    }
    setIsLoading(false); // 로딩 완료
  };

  /* ################### 오피스 조회 동작 조건 ################### */
  useEffect(() => {
    // 로딩 중 중복 된 호출 방지
    if (isLoading) {
      return;
    }
    loadOfficeList();
  }, [currentPage]); // currentPage가 바뀔 때마다 fetch

  return (
    <Layout>
      <div>
        <MenuTitle title={'오피스 목록'} />
      </div>
      <MainWrap>
        {/* <SearchBarContainer>
        <div>
        <h1>오피스 목록</h1>
        </div>
        </SearchBarContainer> */}
        {isLoading ? (
          <div>로딩 중...</div> // 로딩 중일 때 표시
        ) : (
          <ListTable
            type={'office'}
            list={officeList}
            totalPages={totalPages}
            currentPage={currentPage.pno}
            onPageChange={setPno}
            headerList={hearderList}
            detailLink={'/office/detail?no='}
            editLink={''}
          />
        )}
      </MainWrap>
    </Layout>
  );
};

export default OfficeList;
