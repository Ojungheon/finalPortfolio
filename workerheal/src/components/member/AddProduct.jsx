import React, { useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHouseMedical } from '@fortawesome/free-solid-svg-icons';
import styled from 'styled-components';
import { getFacilityList } from '../../services/optionService';

const TitleLayout = styled.div`
  margin-top: 30px;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const Title = styled.div`
  display: flex;
  justify-content: center;
  font-size: 20px;
  color: #747474;
  align-items: center;
  flex-direction: row;
  margin: 20px;
`;

const Line = styled.div`
  width: 950px;
  height: 1px;
  background-color: #747474;
`;

const SelectContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: 954px;
  height: auto;
  border: 1px solid #747474;
  border-radius: 15px;
  overflow: hidden;
  margin: 0px auto;
`;

const TitleDiv = styled.div`
  display: flex;
  height: 60px;
  width: 100%;
  align-items: center;
  background-color: #8041ff;
  border-top-left-radius: 15px;
  border-top-right-radius: 15px;
`;

const Text = styled.div`
  color: white;
  font-size: 20px;
  font-weight: bold;
  margin-left: 25px;
`;

const RoomList = styled.div`
  display: flex;
  flex-direction: column;
  flex-wrap: wrap;
  width: 100%;
  padding: 15px;
  gap: 10px;
`;

const RoomItem = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 15px;
  border: 1px solid #ddd;
  border-radius: 10px;
  font-size: 16px;
  font-weight: bold;
  width: 93%;
`;

const Counter = styled.div`
  display: flex;
  align-items: center;
`;

const Button = styled.button`
  background-color: white;
  border: 1px solid #aaa;
  padding: 5px 10px;
  font-size: 16px;
  cursor: pointer;
  &:hover {
    background-color: #eee;
  }
  &:disabled {
    cursor: not-allowed;
    opacity: 0.5;
  }
`;

const Count = styled.span`
  margin: 0 10px;
  font-size: 16px;
`;

const SubInfo = styled.div`
  display: flex;
  justify-content: flex-start;
  width: 954px;
  color: #747474;
  font-size: 14px;
  margin: 0px auto;
  margin-top: 5px;
`;

const AddProduct = ({ code, setSelectedProducts }) => {
  console.log('전달된 code 데이터:', code);
  console.log('🔍 전달된 code 값:', code, typeof code);

  // code가 배열이면 그대로 사용, 문자열이면 `.split(",")`로 배열 변환, 없으면 빈 배열
  const normalizedCode = Array.isArray(code)
    ? code.filter(Boolean) // 배열이면 빈 값 제거
    : typeof code === 'string'
    ? code.split(',').map((item) => item.trim()) // 문자열이면 배열로 변환
    : []; // 그 외의 경우 빈 배열

  const [productCnt, setProductCnt] = useState({});
  const [facilityList, setFacilityList] = useState([]);

  useEffect(() => {
    if (normalizedCode && normalizedCode.length > 0) {
      const initialCounts = {};
      normalizedCode.forEach((item) => {
        initialCounts[item] = 0;
      });
      setProductCnt(initialCounts);
    }
  }, []);

  const handlePlus = (product) => {
    if (!product) return;
    setProductCnt((prevCounts) => ({
      ...prevCounts,
      [product]: (prevCounts[product] ?? 0) + 1,
    }));
  };

  const handleMinus = (product) => {
    if (!product) return;
    setProductCnt((prevCounts) => {
      const updatedCounts = {
        ...prevCounts,
        [product]: Math.max(0, (prevCounts[product] ?? 0) - 1),
      };
      updateSelectedProducts(updatedCounts);
      return updatedCounts;
    });
  };

  /////// 세션에서 facilityList 가져오기 및 설정
  const addOptionList = async (type) => {
    const tempList = JSON.parse(sessionStorage.getItem(type));
    if (tempList) {
      setFacilityList(tempList);
    } else {
      try {
        const resp = await getFacilityList('office');
        setFacilityList(resp);
        sessionStorage.setItem(type, JSON.stringify(resp));
      } catch (error) {
        console.log('Error 발생~~~ ', error);
        alert(error);
      }
    }
  };

  useEffect(() => {
    addOptionList('facilityList_office');
  }, []);

  // 물품 코드에 해당하는 name 가져오기
  const getFacilityName = (code) => {
    const foundItem = facilityList.find((item) => item.code === code);
    return foundItem ? foundItem.name : '알 수 없는 물품';
  };

  // 선택한 물품 정보를 `setSelectedProducts`로 전달하는 함수
  const updateSelectedProducts = (counts) => {
    const selected = Object.keys(counts)
      .filter((key) => counts[key] > 0) // 1개 이상 선택한 물품만 포함
      .map((key) => ({ faciliteCode: key, amount: counts[key] }));
    setSelectedProducts(selected);
  };

  // productCnt가 변경될 때마다 selectedProducts 업데이트
  useEffect(() => {
    updateSelectedProducts(productCnt);
  }, [productCnt]);

  return (
    <>
      <TitleLayout>
        <Title>
          <FontAwesomeIcon icon={faHouseMedical} style={{ color: '#747474' }} />
          물품 추가
        </Title>
        <Line />
      </TitleLayout>

      <SelectContainer>
        <TitleDiv>
          <Text>물품 추가하기</Text>
        </TitleDiv>

        <RoomList>
          {normalizedCode.length > 0 ? (
            normalizedCode.map((product, index) => (
              <RoomItem key={product || index}>
                {getFacilityName(product)}
                <Counter>
                  <Button
                    onClick={() => handleMinus(product)}
                    disabled={productCnt[product] === 0}
                  >
                    -
                  </Button>
                  <Count>{productCnt[product] ?? 0}</Count>
                  <Button onClick={() => handlePlus(product)}>+</Button>
                </Counter>
              </RoomItem>
            ))
          ) : (
            <div>추가할 물품이 없습니다.</div>
          )}
        </RoomList>
      </SelectContainer>
      <SubInfo>*필수가 아닌 추가 옵션입니다.</SubInfo>
    </>
  );
};

export default AddProduct;
