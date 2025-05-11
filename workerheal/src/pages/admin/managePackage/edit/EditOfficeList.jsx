import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import EditOfficeListData from '../../../../components/admin/managePackage/edit/EditOfficeListData';
import RegionDropdown from '../../../../common/components/RegionDropdown';
import SearchBox from '../../../../common/components/SearchBox';
import useAuthorityCheck from '../../../../hook/useAuthorityCheck';

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

const EditOfficeList = () => {
  const [currentPage, setCurrentPage] = useState(1); // 현재 페이지 상태
  const [totalPages, setTotalPages] = useState(1); // 전체 페이지 수 상태
  const [offices, setOffices] = useState([]); // 패키지 데이터 상태
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
    setLoading(true); // 데이터 요청 전 로딩 시작
    fetch(
      `http://${API_SERVER}/api/manager/packages/list/office?page=${currentPage}&pageSize=10`,
      {
        method: 'GET', // 기본적으로 GET 요청
        headers: {
          'Content-Type': 'application/json', // 서버에 JSON 데이터를 보낼 때 사용
          token: sessionStorage.getItem('token'),
        },
      }
    )
      .then((response) => response.json())
      .then((data) => {
        setOffices(data.content || []); // 실제 패키지 데이터는 content 안에 있음
        setTotalPages(data.totalPages || 1); // totalPages는 페이징 정보에서 가져옴
        setLoading(false); // 데이터 로딩 완료
      })
      .catch((error) => {
        console.error('Error fetching offices:', error);
        setLoading(false); // 오류 발생 시에도 로딩 완료 처리
      });
  }, [currentPage]); // currentPage가 바뀔 때마다 fetch

  return isChecking ? (
    <div></div>
  ) : (
    <MainWrap>
      <SearchBarContainer>
        <div>
          <TitleContent>
            <h1>오피스 목록</h1>
            <p>숙소 설정&gt;오피스 설정&gt;프로그램 설정&gt;패키지 세부설정</p>
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
        <EditOfficeListData
          offices={offices}
          setOffices={setOffices}
          totalPages={totalPages}
          setTotalPages={setTotalPages}
          currentPage={currentPage}
          setCurrentPage={setCurrentPage}
        />
      )}
    </MainWrap>
  );
};

export default EditOfficeList;
