import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import styled from 'styled-components';
import { setOfficeList } from '../../redux/mainOfficeList';
import { useNavigate } from 'react-router-dom';

const API_SERVER = process.env.REACT_APP_SERVER_ROOT;

const CarouselContainer = styled.div`
  display: flex;
  overflow-x: auto;
  scroll-snap-type: x mandatory;
  gap: 50px;
  padding: 10px;
  scrollbar-width: none;
  -ms-overflow-style: none;

  &::-webkit-scrollbar {
    display: none;
  }
`;

const Slide = styled.div`
  flex: 0 0 auto;
  width: 280px;
  height: 350px;
  border-radius: 20px;
  overflow: hidden;
  position: relative;
  scroll-snap-align: start;
`;

const Layout = styled.div`
  width: 280px;
  height: 350px;
  border-radius: 20px;
  overflow: hidden;
  position: relative;
`;

const Image = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
`;

const Label = styled.div`
  display: flex;
  position: absolute;
  width: 160px;
  height: 80px;
  bottom: 0px;
  left: 0px;
  background: rgb(255 255 255 / 71%);
  color: #1b1b1b;
  font-size: 18px;
  font-weight: bold;
  padding: 5px 10px;
  border-radius: 1px 16px;
  text-align: center;
  align-items: center;
  justify-content: center;
  flex-direction: column;

  & p {
    width: 100%; /* 부모(Label)의 너비를 따라감 */
    font-size: 13px;
    color: #333333;
    text-align: right; /* 오른쪽 정렬 */
    padding-right: 10px; /* 오른쪽으로 살짝 띄우기 */
  }
`;

const MainOffice = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const officeList = useSelector((state) => state.mainOffice.officeList);
  const [officeData, setOfficeData] = useState([]);

  const getOfficeList = async () => {
    const option = {
      method: 'GET',
      headers: {
        'content-type': 'application/json',
      },
    };
    const resp = await fetch(
      `http://${API_SERVER}/api/office/mainList`,
      option
    );
    const list = await resp.json();
    setOfficeData(list);
  };

  useEffect(() => {
    getOfficeList();
  }, []);

  useEffect(() => {
    dispatch(setOfficeList(officeData));
  }, [officeData]);

  return (
    <CarouselContainer>
      {officeList.length > 0 ? (
        officeList.map((office) => (
          <Slide key={office.no}>
            <Layout onClick={() => navigate(`/office/detail?no=${office.no}`)}>
              <Image src={office.attachmentPath} />
              <Label>
                {office.officeName}
                <p>
                  {office.officePrice
                    .toString()
                    .replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                  원
                </p>
              </Label>
            </Layout>
          </Slide>
        ))
      ) : (
        <p>데이터가 없습니다.</p>
      )}
    </CarouselContainer>
  );
};

export default MainOffice;
