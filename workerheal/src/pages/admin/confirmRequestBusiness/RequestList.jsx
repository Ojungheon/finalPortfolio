import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import RequestListData from '../../../components/admin/confirmRequestBusiness/RequestListData';

const API_SERVER = process.env.REACT_APP_SERVER_ROOT;

const MainWrap = styled.div`
  width: calc(100% - 40px);
  height: 100%;
  display: grid;
  grid-template-rows: 1fr 5fr;
  margin-left: 40px;
`;

const SearchBarContainer = styled.div`
  display: flex;
  align-items: flex-end; /* 요소들을 하단 정렬 */
  justify-content: space-between; /* 제목과 검색바를 양쪽 끝으로 배치 */
  width: calc(100% - 100px);
  padding-bottom: 10px;
  border-bottom: 1px solid gray;
`;

const RequestList = () => {
  const [currentPage, setCurrentPage] = useState(1); // 현재 페이지 상태
  const [totalPages, setTotalPages] = useState(1); // 전체 페이지 수 상태
  const [requests, setRequests] = useState([]); // 패키지 데이터 상태
  const [loading, setLoading] = useState(true); // 로딩 상태

  useEffect(() => {
    setLoading(true); // 데이터 요청 전 로딩 시작
    fetch(
      `http:/${API_SERVER}/admin/requsts/list?page=${currentPage}&pageSize=10`
    )
      .then((response) => response.json())
      .then((data) => {
        console.log(data); // 응답 구조 확인
        setRequests(data.content || []); // 실제 패키지 데이터는 content 안에 있음
        setTotalPages(data.totalPages || 1); // totalPages는 페이징 정보에서 가져옴
        setLoading(false); // 데이터 로딩 완료
      })
      .catch((error) => {
        console.error('Error fetching requests:', error);
        setLoading(false); // 오류 발생 시에도 로딩 완료 처리
      });
  }, [currentPage]); // currentPage가 바뀔 때마다 fetch

  return (
    <MainWrap>
      <SearchBarContainer>
        <div>
          <h1>사업장 요청 목록</h1>
        </div>
      </SearchBarContainer>

      {loading ? (
        <div>로딩 중...</div> // 로딩 중일 때 표시
      ) : (
        <RequestListData
          requests={requests}
          totalPages={totalPages}
          currentPage={currentPage}
          setCurrentPage={setCurrentPage}
        />
      )}
    </MainWrap>
  );
};

export default RequestList;
