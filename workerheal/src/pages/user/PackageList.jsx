import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { plusPno, setPackageList } from '../../redux/packageListSlice';
import SearchBox from '../../common/components/SearchBox';
import InfiniteScroll from '../../common/components/InfiniteScroll';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faStar } from '@fortawesome/free-solid-svg-icons';
import { faHeart } from '@fortawesome/free-regular-svg-icons';

const API_SERVER = process.env.REACT_APP_SERVER_ROOT;

const Pcard = styled.div`
  width: 640px;
  height: 260px;
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-template-rows: 1fr 1fr;
  position: relative;
  border-radius: 15px;
  overflow: hidden;
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-image: url(${(props) => props.backgroundImage});
    background-size: cover;
    background-position: center;
    transition: transform 0.3s ease-in-out;
  }

  &:hover::before {
    transform: scale(1.1);
  }
`;

const Search = styled.div`
  margin: 20px;
  margin-left: 55px;
`;

const CardContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 20px;
  width: 100%;
  max-width: 1300px;
  margin: 0 auto;
  justify-content: center;
`;

const Overlay = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  border-radius: 15px;
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-template-rows: 1fr 1fr;
`;

const Ptext = styled.div`
  display: flex;
  color: white;
  padding: 10px;
`;

const Score = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
`;

const TopLeft = styled(Ptext)`
  justify-content: flex-start;
  align-items: flex-start;
  display: flex;
  flex-direction: column;
  display: grid;
  grid-template-rows: 50px 5fr;
  margin-left: 15px;
  width: 500px;
`;

const TopRight = styled(Ptext)`
  justify-content: flex-end;
  align-items: flex-start;
  margin-top: 20px;
  margin-right: 15px;
`;

const BottomLeft = styled(Ptext)`
  justify-content: flex-start;
  align-items: flex-end;
  margin-left: 20px;
  gap: 10px;
  width: 239px;
`;

const BottomRight = styled(Ptext)`
  justify-content: flex-end;
  align-items: flex-end;
  text-align: right;
  display: grid;
  grid-template-rows: 5fr 30px;
  margin-right: 15px;
  width: 300px;
  margin-left: -230px;
`;

const PackageCard = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const packageInfo = useSelector((state) => state.packageList.packageInfo);
  const pno = useSelector((state) => state.packageList.pno);
  const [hasMore, setHasMore] = useState(true);

  // 서버에서 데이터 가져오기
  const fetchData = async () => {
    console.log(`Fetching more data... (Current Page: ${pno})`);
    try {
      const response = await fetch(
        `http://${API_SERVER}/api/package/list?page=${pno}&size=20`
      );
      if (!response.ok) throw new Error('Failed to fetch package data');

      const data = await response.json();
      if (!data || data.length === 0) {
        setHasMore(false);
        return;
      }

      // 기존 데이터와 중복된 항목 제거 후 추가
      const newPackageList = data.filter(
        (newItem) =>
          // !packageInfo.some((existingItem) => existingItem.no === newItem.no)
          !packageInfo.some((existingItem) => existingItem.no !== newItem.no) // 태훈 수정
      );

      if (newPackageList.length === 0) {
        setHasMore(false);
        return;
      }

      // Redux 상태 업데이트 (기존 데이터 + 새로운 데이터 추가)
      dispatch(setPackageList([...packageInfo, ...newPackageList]));

      // 데이터가 있는 경우에만 페이지 증가
      dispatch(plusPno());
    } catch (error) {
      console.error('❌ Fetch error:', error);
      setHasMore(false);
    }
  };

  // 첫 렌더링 시 데이터 가져오기
  useEffect(() => {
    if (packageInfo.length === 0) {
      fetchData();
    }
  }, []);

  if (!packageInfo || packageInfo.length === 0) {
    return <div>패키지 데이터를 불러오는 중...</div>;
  }

  return (
    <>
      <Search>
        <SearchBox />
      </Search>
      <InfiniteScroll fetchData={fetchData} hasMore={hasMore} threshold={[0.5]}>
        <CardContainer>
          {packageInfo.map((data) => (
            <Pcard
              key={data.no}
              backgroundImage={data.attachmentPath}
              onClick={() => navigate(`/package/detail?no=${data.no}`)}
            >
              <Overlay>
                <TopLeft>
                  <h1>{data.name}</h1>
                  <h3>
                    {new Date(data.openDate).toLocaleDateString('ko-KR')} ~
                    {new Date(data.closeDate).toLocaleDateString('ko-KR')}
                  </h3>
                </TopLeft>
                <TopRight>
                  <FontAwesomeIcon
                    icon={faHeart}
                    size="2x"
                    style={{ color: '#ffffff' }}
                  >
                    <h3>{data.favorite}</h3>
                  </FontAwesomeIcon>
                </TopRight>
                <BottomLeft>
                  <h3>
                    <Score>
                      <FontAwesomeIcon icon={faStar} color="#FFD43B" />
                      {data.reviewScore} ({data.reviewCount})
                    </Score>
                  </h3>
                </BottomLeft>
                <BottomRight>
                  <h1>{data.discount}%</h1>
                  <h3>#{data.tag}</h3>
                </BottomRight>
              </Overlay>
            </Pcard>
          ))}
        </CardContainer>
      </InfiniteScroll>
    </>
  );
};

export default PackageCard;
