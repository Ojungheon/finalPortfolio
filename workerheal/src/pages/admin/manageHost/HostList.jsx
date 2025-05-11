import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import RegionDropdown from '../../../common/components/RegionDropdown';
import SearchBox from '../../../common/components/SearchBox';
import HostListData from '../../../components/admin/manageHost/HostListData';
import useAuthorityCheck from '../../../hook/useAuthorityCheck';

const API_SERVER = process.env.REACT_APP_SERVER_ROOT;

const MainWrap = styled.div`
  width: calc(100% - 40px);
  height: 100%;
  display: grid;
  grid-template-columns: 1fr;
  grid-template-rows: 1fr 5fr;
  margin-left: 40px;
`;

const TitleContent = styled.div`
  display: flex;
  align-items: flex-end; /* 세로 가운데 정렬 */
  gap: 20px; /* 요소 간격 조정 */
`;

const SearchBarContainer = styled.div`
  display: flex;
  align-items: flex-end; /* 요소들을 하단 정렬 */
  justify-content: space-between; /* 제목과 검색바를 양쪽 끝으로 배치 */
  width: calc(100% - 100px);
  padding-bottom: 10px;
  border-bottom: 1px solid gray;
`;

const SearchBar = styled.div`
  display: flex;
  align-items: flex-end; /* 내부 요소들 하단 정렬 */
  gap: 20px; /* 요소 간격 조정 */
`;

const HostList = () => {
  const [currentPage, setCurrentPage] = useState(1); // 현재 페이지 상태
  const [totalPages, setTotalPages] = useState(1); // 전체 페이지 수 상태
  const [hosts, setHosts] = useState([]); // 패키지 데이터 상태
  const [loading, setLoading] = useState(true); // 로딩 상태

  const checkLogin = useAuthorityCheck('MANAGER', '/manager/login');
  const [isChecking, setIsChecking] = useState(true);

  /* ################### 로그인 검증 ################### */
  useEffect(() => {
    if (checkLogin()) {
      setIsChecking(false);
    }
  }, []);

  useEffect(() => {
    setLoading(true);
    fetch(
      `http://${API_SERVER}/api/manager/host/list?page=${currentPage}&pageSize=10`,
      {
        headers: {
          token: sessionStorage.getItem('token'),
        },
      }
    )
      .then((response) => response.json())
      .then((data) => {
        console.log(data); // 응답 데이터 확인
        setHosts(data.content || []);
        setTotalPages(data.totalPages || 1);
        setLoading(false);
      })
      .catch((error) => {
        console.error('Error fetching hosts:', error);
        setLoading(false);
      });
  }, [currentPage]);

  return isChecking ? (
    <div></div>
  ) : (
    <MainWrap>
      <SearchBarContainer>
        <div>
          <TitleContent>
            <h1>호스트 목록조회</h1>
          </TitleContent>
        </div>
        <div>
          <SearchBar>
            {/* <RegionDropdown></RegionDropdown>
            <SearchBox></SearchBox> */}
          </SearchBar>
        </div>
      </SearchBarContainer>

      {loading ? (
        <div>로딩 중...</div> // 로딩 중일 때 표시
      ) : (
        <HostListData
          hosts={hosts}
          totalPages={totalPages}
          currentPage={currentPage}
          setCurrentPage={setCurrentPage}
        />
      )}
    </MainWrap>
  );
};

export default HostList;
