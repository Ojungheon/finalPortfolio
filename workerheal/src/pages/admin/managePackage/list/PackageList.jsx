import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import PackageListData from '../../../../components/admin/managePackage/list/PackageListData';
import RegionDropdown from '../../../../common/components/RegionDropdown';
import SearchBox from '../../../../common/components/SearchBox';
import { Navigate, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { setPackageNo } from '../../../../redux/packageSlice';
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

const SearchBarContainer = styled.div`
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  width: calc(100% - 100px);
  padding-bottom: 10px;
  border-bottom: 1px solid gray;
`;

const SearchBar = styled.div`
  display: flex;
  align-items: flex-end;
  gap: 20px;
`;

const PackageList = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [packages, setPackages] = useState([]);
  const [loading, setLoading] = useState(true);
  const dispatch = useDispatch();

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
      `http://${API_SERVER}/api/manager/packages/list?page=${currentPage}&pageSize=10`,
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
        setPackages(data.content || []);
        setTotalPages(data.totalPages || 1);
        setLoading(false);
      })
      .catch((error) => {
        console.error('Error fetching packages:', error);
        setLoading(false);
      });
  }, [currentPage]);

  const handleEditPackage = (pkgNo) => {
    dispatch(setPackageNo(pkgNo)); // 패키지 번호 Redux 상태에 저장
    Navigate('/enroll/package/lodging/list'); // 수정 페이지로 이동
  };

  return isChecking ? (
    <div></div>
  ) : (
    <MainWrap>
      <SearchBarContainer>
        <div>
          <h1>패키지 목록</h1>
        </div>
        <div>
          <SearchBar>
            <RegionDropdown />
            <RegionDropdown />
            <SearchBox />
          </SearchBar>
        </div>
      </SearchBarContainer>

      {loading ? (
        <div>로딩 중...</div>
      ) : (
        <PackageListData
          packages={packages}
          setPackages={setPackages}
          totalPages={totalPages}
          setTotalPages={setTotalPages}
          currentPage={currentPage}
          setCurrentPage={setCurrentPage}
          handleEditPackage={handleEditPackage}
        />
      )}
    </MainWrap>
  );
};

export default PackageList;
