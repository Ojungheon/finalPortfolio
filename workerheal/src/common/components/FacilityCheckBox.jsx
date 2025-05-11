import React, { useEffect, useState } from 'react';
import { getFacilityList } from '../../services/optionService';
import { Checkbox, FormControlLabel, FormGroup } from '@mui/material';

const FacilityCheckBox = ({ state, handler, groupSx }) => {
  const [facilityList, setFacilityList] = useState([]);

  /* ################### 편의시설 추가 & 삭제 ################### */
  const handleCheckBox = (e) => {
    const prevList = [...state];
    const { value, checked } = e.target; // 선택 된 체크박스 데이터 수집

    if (checked) {
      prevList.push(value);
      handler(prevList);
    } else {
      const tempList = prevList.filter((code) => code !== value);
      handler(tempList);
    }
  };

  // 선택 조건 호출
  const addOptionList = async (type) => {
    const tempList = JSON.parse(sessionStorage.getItem(type));
    if (tempList) {
      setFacilityList(tempList);
    } else {
      try {
        const resp = await getFacilityList('tour');
        setFacilityList(resp);
        sessionStorage.setItem(type, JSON.stringify(resp));
      } catch (error) {
        console.log('Error 발생~~~ ', error);
        alert(error);
      }
    }
  };

  /* ################### 선택 조건 설정 ################### */
  useEffect(() => {
    addOptionList('facilityList_tour');
  }, []);

  return (
    <FormGroup row sx={groupSx}>
      {facilityList.map((data) => {
        return (
          <FormControlLabel
            key={Object.entries(data)[0][1]}
            control={
              <Checkbox
                value={Object.entries(data)[0][1]}
                checked={state.includes(Object.entries(data)[0][1])}
                onClick={handleCheckBox}
              />
            }
            label={Object.entries(data)[1][1]}
          />
        );
      })}
    </FormGroup>
  );
};

export default FacilityCheckBox;
