import React, { useEffect, useState } from 'react';
import MuiSelect from './MuiSelect';
import { getRegionList } from '../../services/optionService';

const RegionSelect = ({
  name,
  size,
  color,
  value,
  handler,
  labelSx,
  SelectSx,
}) => {
  const [regionList, setRegionList] = useState([]);

  // 선택 조건 호출
  const addOptionList = async (type) => {
    const tempList = JSON.parse(sessionStorage.getItem(type));
    if (tempList) {
      setRegionList(tempList);
    } else {
      try {
        const resp = await getRegionList();
        setRegionList(resp);
        sessionStorage.setItem(type, JSON.stringify(resp));
      } catch (error) {
        console.log('Error 발생~~~ ', error);
        alert(error);
      }
    }
  };

  /* ################### 선잭 조건 설정 ################### */
  useEffect(() => {
    addOptionList('region');
  }, []);

  return (
    <MuiSelect
      menuList={regionList} // 표시할 아이템 목록
      labelName={'지역'} // 라벨에 표시할 이름
      name={name} // select tag name 속성
      size={size} // select 사이즈 (smallm,medium,lagre) , '' 로하면 기본 사이즈
      color={color} // select 테마 컬러 (primary , secondary)
      value={value} // state 값
      handler={handler} // state 처리할 함수
      labelSx={labelSx} // 라벨 css
      SelectSx={SelectSx} // select css
    />
  );
};

export default RegionSelect;
