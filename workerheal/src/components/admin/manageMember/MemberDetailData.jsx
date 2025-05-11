import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import styled from 'styled-components';
import useAuthorityCheck from '../../../hook/useAuthorityCheck';

const API_SERVER = process.env.REACT_APP_SERVER_ROOT;

const Layout = styled.div`
  width: calc(100% - 40px);
  height: 100%;
  display: grid;
  grid-template-columns: 1fr;
  grid-template-rows: 1fr 10fr;
  margin-left: 40px;
`;

const PageHeader = styled.div`
  width: calc(100% - 40px);
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-template-rows: 1fr;
  background-color: gray;
  margin-left: 40px;
`;

const MemberDataTitle = styled.div`
  background-color: blue;
`;

const SearchBarContainer = styled.div`
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  width: calc(100% - 100px);
  padding-bottom: 10px;
  border-bottom: 1px solid gray;
`;

const PageMain = styled.div`
  background-color: gray;
  border: 1px solid red;
  display: grid;
  grid-template-columns: 1fr;
  grid-template-rows: 1fr 1fr 1fr;
`;

const One = styled.div`
  background-color: gray;
  border: 1px solid red;
  display: grid;
  grid-template-columns: 1fr;
  grid-template-rows: 1fr 3fr;
`;

const OneTitle = styled.div`
  background-color: gray;
  border: 1px solid red;
  display: grid;
  grid-template-columns: 1fr;
  grid-template-rows: 1fr;
`;

const OneContent = styled.div`
  background-color: gray;
  border: 1px solid red;

  & > div {
    display: grid;
    grid-template-columns: 1fr 3fr 1fr 3fr;
    grid-template-rows: 1fr;
  }
`;

const Two = styled.div`
  background-color: gray;
  border: 1px solid red;

  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  grid-template-rows: 1fr;
`;

const Lodging = styled.div`
  background-color: gray;
  border: 1px solid red;

  display: grid;
  grid-template-rows: 1fr 3fr;
`;

const LodgingTitle = styled.div`
  background-color: gray;
  border: 1px solid red;

  display: grid;
  grid-template-columns: 1fr;
`;

const LodgingContent = styled.div`
  background-color: gray;
  border: 1px solid red;

  display: grid;
  grid-template-rows: 1fr 1fr 1fr;

  & > div {
    display: grid;
    grid-template-columns: 1fr 2fr;
  }
`;

const Office = styled.div`
  background-color: gray;
  border: 1px solid red;

  display: grid;
  grid-template-rows: 1fr 3fr;
`;

const OfficeTitle = styled.div`
  background-color: gray;
  border: 1px solid red;

  display: grid;
  grid-template-columns: 1fr;
`;

const OfficeContent = styled.div`
  background-color: gray;
  border: 1px solid red;

  display: grid;
  grid-template-rows: 1fr 1fr 1fr;

  & > div {
    display: grid;
    grid-template-columns: 1fr 2fr;
  }
`;

const Program = styled.div`
  background-color: gray;
  border: 1px solid red;

  display: grid;
  grid-template-rows: 1fr 3fr;
`;

const ProgramTitle = styled.div`
  background-color: gray;
  border: 1px solid red;

  display: grid;
  grid-template-columns: 1fr;
`;

const ProgramContent = styled.div`
  background-color: gray;
  border: 1px solid red;

  display: grid;
  grid-template-rows: 1fr 1fr 1fr;

  & > div {
    display: grid;
    grid-template-columns: 1fr 2fr;
  }
`;

const Three = styled.div`
  background-color: gray;
  border: 1px solid red;

  display: grid;
  grid-template-rows: 1fr 2fr;
`;

const ThreeTitle = styled.div`
  background-color: gray;
  border: 1px solid red;
`;

const ThreeContent = styled.div`
  background-color: gray;
  border: 1px solid red;

  display: grid;
  grid-template-columns: 1fr 3fr 1fr 3fr;
  grid-template-rows: 1fr 1fr;
`;

const FirstLine = styled.div`
  background-color: gray;
  border: 1px solid red;
`;

const SecondLine = styled.div`
  background-color: gray;
  border: 1px solid red;
`;

const MemberDetailData = ({ memberData: propMemberData }) => {
  const { no } = useParams();
  const [memberData, setMemberData] = useState(null);
  const [lodgingData, setLodgingData] = useState(null);
  const [officeData, setOfficeData] = useState(null);
  const [programData, setProgramData] = useState(null);
  const [packageData, setPackageData] = useState(null); // 패키지 데이터 추가
  const [reservatedInfo, setReservatedInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  const checkLogin = useAuthorityCheck('MANAGER', '/manager/login');
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    if (checkLogin()) {
      setIsChecking(false);
    }
  }, []);

  useEffect(() => {
    if (no) {
      setLoading(true);
      setError(null);

      fetch(`http://${API_SERVER}/api/manager/memberDetail/${no}`, {
        headers: {
          'Content-Type': 'application/json',
          token: sessionStorage.getItem('token'),
        },
      })
        .then((res) => res.json())
        .then((data) => {
          setMemberData(data);
          setLodgingData(data.lodgingReserv);
          setOfficeData(data.officeReserv);
          setProgramData(data.programReserv);
          setPackageData(data.packageReserv); // 패키지 데이터 세팅
          setReservatedInfo(data.reservatedInfo);
          setLoading(false);
        })
        .catch((err) => {
          setError('데이터를 불러오는 데 실패했습니다.');
          setLoading(false);
        });
    }
  }, [no]);

  // 패키지 데이터가 있으면 숙소, 오피스, 프로그램 데이터를 채워주는 함수
  const fillWithPackageData = (data, type) => {
    if (!packageData) return '-'; // 패키지 데이터가 없으면 '-' 반환
    switch (type) {
      case 'lodging':
        return packageData.lodgingName || '-'; // 패키지에서 숙소명
      case 'office':
        return packageData.officeName || '-'; // 패키지에서 오피스명
      case 'program':
        return packageData.programName || '-'; // 패키지에서 프로그램명
      default:
        return '-';
    }
  };

  if (loading) {
    return <div>데이터를 불러오는 중...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return isChecking ? (
    <div></div>
  ) : (
    <Layout>
      <PageHeader>
        <MemberDataTitle>
          <h4>&gt; 예약 내역</h4>
        </MemberDataTitle>
        <SearchBarContainer>
          <input
            type="text"
            placeholder="검색어를 입력하세요"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </SearchBarContainer>
      </PageHeader>
      <PageMain>
        <One>
          <OneTitle>
            <div>공통내역1</div>
          </OneTitle>
          <OneContent>
            <div>
              <div>예약자</div>
              <div>
                <h4>{reservatedInfo[0]?.memberName || '-'}</h4>
              </div>
              <div>이용기간</div>
              <div>
                <h4>
                  {programData[0]?.startDate || '-'} ~{' '}
                  {programData[0]?.endDate || '-'}
                </h4>
              </div>
            </div>
            <div>
              <div>예약번호</div>
              <div>
                <h4>{reservatedInfo[0]?.reservationNo || '-'}</h4>
              </div>
              <div>인원</div>
              <div>{reservatedInfo[0]?.reservateNum || '-'}</div>
            </div>
            <div>
              <div>상품유형</div>
              <div>{reservatedInfo[0]?.productType || '-'}</div>
              <div>상품명</div>
              <div>{reservatedInfo[0]?.name || '-'}</div>
            </div>
          </OneContent>
        </One>
        <Two>
          <Lodging>
            <LodgingTitle>
              <div>숙소내역</div>
            </LodgingTitle>
            <LodgingContent>
              <div>
                <div>숙소명</div>
                <div>{fillWithPackageData(lodgingData, 'lodging')}</div>
              </div>
              <div>
                <div>체크인/아웃</div>
                <div>{lodgingData?.checkInOut || '-'}</div>
              </div>
              <div>
                <div>객실유형</div>
                <div>{lodgingData?.roomType || '-'}</div>
              </div>
            </LodgingContent>
          </Lodging>
          <Office>
            <OfficeTitle>
              <div>오피스내역</div>
            </OfficeTitle>
            <OfficeContent>
              <div>
                <div>오피스명</div>
                <div>{fillWithPackageData(officeData, 'office')}</div>
              </div>
              <div>
                <div>운영시간</div>
                <div>{officeData?.operationTime || '-'}</div>
              </div>
              <div>
                <div>물품추가</div>
                <div>{officeData?.extraItems || '-'}</div>
              </div>
            </OfficeContent>
          </Office>
          <Program>
            <ProgramTitle>
              <div>프로그램내역</div>
            </ProgramTitle>
            <ProgramContent>
              <div>
                <div>프로그램명</div>
                <div>{fillWithPackageData(programData, 'program')}</div>
              </div>
              <div>
                <div>참여기간</div>
                <div>
                  {programData?.startDate} ~ {programData?.endDate}
                </div>
              </div>
            </ProgramContent>
          </Program>
        </Two>
        <Three>
          <ThreeTitle>결제내역</ThreeTitle>
          <ThreeContent>
            <div>결제일</div>
            <div>{reservatedInfo[0]?.paymentDate || '-'}</div>
            <div>현재상태</div>
            <div>{reservatedInfo[0]?.status || '-'}</div>
            <div>결제수단</div>
            <div>{reservatedInfo[0]?.paymentMethod || '-'}</div>
            <div>금액</div>
            <div>{reservatedInfo[0]?.amount || '-'}</div>
          </ThreeContent>
        </Three>
      </PageMain>
    </Layout>
  );
};

export default MemberDetailData;
