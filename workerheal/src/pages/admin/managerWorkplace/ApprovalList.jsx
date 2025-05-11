import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import MenuTitle from '../../../components/admin/MenuTitle';
import ListTable from '../../../components/admin/ListTable';
import { getApprovalList } from '../../../services/approvalService';
import { Alert } from '../../../utils/toast';
import { useNavigate } from 'react-router-dom';
import useAuthorityCheck from '../../../hook/useAuthorityCheck';

/* ################################## 초기 데이터 start ################################## */
/* ##################### 테이블 헤더 ##################### */
const hearderList = [
  { no: 1, col: 'no', name: '번호', width: '7px' },
  { no: 2, col: 'regionName', name: '지역', width: '10px' },
  { no: 3, col: 'placeType', name: '사업장유형', width: '10px' },
  { no: 4, col: 'placeTypeName', name: '유형', width: '10px' },
  { no: 5, col: 'placeName', name: '사업장명', width: '20px' },
  { no: 6, col: 'hostName', name: '호스트', width: '15px' },
  { no: 7, col: 'statusName', name: '상태', width: '15px' },
  { no: 8, col: 'detail', name: '상세조회', width: '7px' },
  // { no: 7, col: 'delete', name: '삭제', width: '5px' },
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

/* ################################## ApprovalList components ################################## */
const ApprovalList = () => {
  const navi = useNavigate();
  /* ################### state 생성 ################### */
  const [approvalList, setApprovalList] = useState([]); // 목록 데이터 상태
  const [currentPage, setCurrentPage] = useState({ pno: 1 }); // 현재 페이지 상태
  const [totalPages, setTotalPages] = useState(); // 전체 페이지 수 상태
  const [isLoading, setIsLoading] = useState(true); // 로딩 상태
  const checkLogin = useAuthorityCheck('MANAGER', '/manager/login');
  const limit = 10;

  /* ################### pno 설정 ################### */
  const setPno = (no) => {
    setCurrentPage({ pno: no });
  };

  /* ################### 승인요청 목록 조회 ################### */
  const loadApprovalList = async () => {
    setIsLoading(true); // 데이터 요청 전 로딩 시작
    try {
      const getList = await getApprovalList(currentPage.pno, limit);
      setApprovalList(getList.approvalVoList);
      setTotalPages(getList.totalPages);
    } catch (error) {
      let title = '';
      let text = '';
      if (error.message == 403) {
        title = '로그인 세션이 만료되어 재접속이 필요합니다.';
        text = '로그인 화면으로 이동합니다.';
      } else {
        title = '서버와 통신 중 오류가 발생했습니다.';
        text = '관리자에게 문의 바랍니다.';
      }

      await Alert({
        icon: 'error',
        title: title,
        text: text,
        allowOutsideClick: false, // ✅ 바깥 클릭으로 닫히지 않음
        allowEscapeKey: false, // ✅ ESC 키로 닫히지 않음
        allowEnterKey: false, // ✅ 엔터 키로 닫히지 않음
      }).then((result) => {
        if (result.isConfirmed) {
          if (error.message == 403) {
            navi('/manager/login');
          }
        }
      });
    }
    setIsLoading(false); // 로딩 완료
  };

  /* ################### 목록 조회 동작 조건 ################### */
  useEffect(() => {
    // 로딩 중 중복 된 호출 방지
    // if (isLoading) {
    //   return;
    // }
    // loadApprovalList();
    /* ############## 로그인 검증 ############# */
    if (checkLogin()) {
      loadApprovalList();
    }
  }, [currentPage]); // currentPage가 바뀔 때마다 fetch

  return isLoading ? (
    <div></div>
  ) : (
    <Layout>
      <div>
        <MenuTitle title={'사업장 승인 요청 목록 '} />
      </div>
      <MainWrap>
        {/* <SearchBarContainer>
        <div>
        <h1>숙소 목록</h1>
        </div>
        </SearchBarContainer> */}
        {isLoading ? (
          <div>로딩 중...</div> // 로딩 중일 때 표시
        ) : (
          <ListTable
            type={'approval'}
            list={approvalList}
            totalPages={totalPages}
            currentPage={currentPage.pno}
            onPageChange={setPno}
            headerList={hearderList}
            detailLink={''}
            editLink={''}
            show={'hidden'}
          />
        )}
      </MainWrap>
    </Layout>
  );
};

export default ApprovalList;
