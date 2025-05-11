import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import styled from 'styled-components';
import HostDetailData from '../../../components/admin/manageHost/HostDetailData';
import useAuthorityCheck from '../../../hook/useAuthorityCheck';
import MemberDetailData from '../../../components/admin/manageMember/MemberDetailData';

const API_SERVER = process.env.REACT_APP_SERVER_ROOT;

const MainWrap = styled.div`
  width: calc(100% - 40px);
  height: 100%;
  display: grid;
  grid-template-columns: 1fr;
  margin-left: 40px;
`;

const TitleContent = styled.div`
  display: flex;
  align-items: flex-end;
  gap: 20px;
`;

const SearchBarContainer = styled.div`
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  width: calc(100% - 100px);
  padding-bottom: 10px;
  border-bottom: 1px solid gray;
`;

const MemberDetail = () => {
  const { no } = useParams();
  const [memberData, setMemberData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const checkLogin = useAuthorityCheck('MANAGER', '/manager/login');
  const [isChecking, setIsChecking] = useState(true);

  /* ################### 로그인 검증 ################### */
  useEffect(() => {
    if (checkLogin()) {
      setIsChecking(false);
    }
  }, []);

  // 호스트 데이터 요청
  useEffect(() => {
    fetch(`http://${API_SERVER}/api/manager/memberDetail/${no}`, {
      headers: {
        'Content-Type': 'application/json',
        token: sessionStorage.getItem('token'),
      },
    })
      .then((res) => {
        if (!res.ok) {
          throw new Error('서버에서 데이터를 가져오지 못했습니다.');
        }
        return res.json();
      })
      .then((data) => {
        setMemberData(data);
        setLoading(false);
        console.log(data);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, [no]);

  if (loading) {
    return <div>로딩 중...</div>;
  }

  if (error) {
    return <div>{`에러 발생: ${error}`}</div>;
  }

  return isChecking ? (
    <div></div>
  ) : (
    <MainWrap>
      <SearchBarContainer>
        <div>
          <h1>호스트 상세 조회</h1>
        </div>
      </SearchBarContainer>
      <MemberDetailData memberData={memberData} />
    </MainWrap>
  );
};

export default MemberDetail;
