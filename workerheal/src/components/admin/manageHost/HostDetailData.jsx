import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import styled from 'styled-components';
import Pagination from '../../../components/Pagination'; // 페이징 컴포넌트 import

const API_SERVER = process.env.REACT_APP_SERVER_ROOT;

const Layout = styled.div`
  width: calc(100% - 40px);
  height: 100%;
  display: grid;
  grid-template-columns: 1fr;
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

const DataArea = styled.div`
  width: calc(100% - 40px);
  display: grid;
  grid-template-columns: 1fr;
  margin-left: 40px;
`;

const HostData = styled.div`
  display: grid;
  grid-template-rows: 1fr 2fr;
  margin-bottom: 20px;
`;

const HostDataTitle = styled.div`
  background-color: #fff;
`;

const HostDataContent = styled.div`
  display: grid;
  height: 80px;
  width: calc(100% - 100px);
  grid-template-columns: 1fr 3fr 1fr 3fr;
  grid-template-rows: 1fr 1fr;
  padding: 2px;

  & > div {
    display: flex;
    justify-content: center;
    align-items: center;
  }

  & > div:nth-child(odd) > h4 {
    height: 95%;
    width: 100%;
    border: 1px solid gray;
    background-color: #d9d9d9;
    display: flex;
    justify-content: center;
    align-items: center;
  }

  & > div:nth-child(even) > h4 {
    height: 95%;
    width: 100%;
    border: 1px solid black;
    display: flex;
    justify-content: center;
    align-items: center;
  }
`;

const RegisteredBusiness = styled.div`
  width: calc(100% - 100px);
  padding-top: 20px;
`;

const TableWrapper = styled.div`
  width: 94%;
  margin-top: 20px;
`;

const StyledTable = styled.table`
  width: 100%;
  border-collapse: collapse;
  table-layout: fixed;
`;

const TableHeader = styled.th`
  background-color: #d9d9d9;
  padding: 12px;
  text-align: center;
  font-weight: bold;
  border-bottom: 1px solid #d9d9d9;
  width: 20%;
`;

const TableCell = styled.td`
  padding: 10px;
  text-align: center;
  border-bottom: 1px solid #d9d9d9;
  color: ${({ isSelected }) => (isSelected ? 'purple' : 'black')};
  width: 20%;
`;

const NoDataRow = styled.tr`
  text-align: center;
`;

const HostDetailData = () => {
  const { hostNo } = useParams(); // URL에서 hostNo 추출

  const [hostInfo, setHostInfo] = useState([]);
  const [hostPageVo, setHostPageVo] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // 페이징 관련 상태
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const pageSize = 5;

  useEffect(() => {
    if (hostNo) {
      setLoading(true);
      setError(null);

      fetch(
        `http://${API_SERVER}/api/manager/hostDetail/${hostNo}?page=${currentPage}&pageSize=${pageSize}`,
        {
          headers: {
            'Content-Type': 'application/json',
            token: sessionStorage.getItem('token'),
          },
        }
      )
        .then((res) => res.json())
        .then((data) => {
          console.log(data);
          setHostInfo(data.hostInfo); // 페이지네이션이 있을 경우 'content'를 사용
          if (data.pageVo.content.length > 0) {
            setHostPageVo(data.pageVo.content);
          }
          setTotalPages(data.pageVo.totalPages); // 전체 페이지 수
          setLoading(false);
        })
        .catch((err) => {
          setError('데이터를 불러오는 데 실패했습니다.');
          setLoading(false);
        });
    }
  }, [hostNo, currentPage]); // currentPage가 변경될 때마다 호출

  if (loading) {
    return (
      <Layout>
        <p>데이터를 불러오는 중...</p>
      </Layout>
    );
  }

  if (error) {
    return (
      <Layout>
        <p>{error}</p>
      </Layout>
    );
  }

  return (
    <Layout>
      <DataArea>
        {/* 호스트 정보는 항상 표시 */}
        <div>
          <HostData>
            <HostDataTitle>
              <h4>&gt; 호스트 정보</h4>
            </HostDataTitle>
            <HostDataContent>
              <div>
                <h4>호스트 아이디</h4>
              </div>
              <div>
                <h4>{hostInfo.id}</h4> {/* 첫 번째 데이터 사용 */}
              </div>
              <div>
                <h4>사업장 수</h4>
              </div>
              <div>
                <h4>{hostPageVo.length}</h4> {/* 데이터 개수 */}
              </div>
              <div>
                <h4>호스트 이름</h4>
              </div>
              <div>
                <h4>{hostInfo.name}</h4> {/* 첫 번째 데이터 사용 */}
              </div>
              <div>
                <h4>등록일</h4>
              </div>
              <div>
                <h4>{hostInfo.enrollDate}</h4> {/* 첫 번째 데이터 사용 */}
              </div>
            </HostDataContent>
          </HostData>
        </div>

        {/* 사업장 정보가 없을 때 메시지 */}

        <div>
          <RegisteredBusiness>
            <h4>&gt; 호스트 사업장 정보</h4>
          </RegisteredBusiness>

          <TableWrapper>
            <StyledTable>
              <thead>
                <tr>
                  <TableHeader>사업장 명</TableHeader>
                  <TableHeader>사업자 등록번호</TableHeader>
                  <TableHeader>유형</TableHeader>
                  <TableHeader>지역</TableHeader>
                </tr>
              </thead>
              <tbody>
                {hostPageVo?.length > 0 ? (
                  hostPageVo.map((business, index) => (
                    <tr key={index}>
                      <TableCell>{business.placeName}</TableCell>
                      <TableCell>{business.businessNo}</TableCell>
                      <TableCell>{business.placeType}</TableCell>
                      <TableCell>{business.regionName}</TableCell>
                    </tr>
                  ))
                ) : (
                  <NoDataRow>
                    <TableCell colSpan="4">등록된 사업장이 없습니다.</TableCell>
                  </NoDataRow>
                )}
              </tbody>
            </StyledTable>
          </TableWrapper>
        </div>

        {/* 페이지네이션 */}
        {hostPageVo?.length > 0 ? (
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
          />
        ) : (
          <div></div>
        )}
      </DataArea>
    </Layout>
  );
};

export default HostDetailData;
