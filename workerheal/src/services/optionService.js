import { BASE_URL } from './config';

/* ######################## 지역 코드 조회 ######################## */
// async : 해당 함수는 promise 를 반환한다
const getRegionList = async () => {
  // fetch 함수 호출에 필요한 매개 변수 선언
  const url = `${BASE_URL}/api/common/option/region`;

  const resp = await fetch(url);

  if (!resp.ok) {
    throw new Error(`HTTP 오류로 통신 실패!!!(상태코드 : ${resp.status})`);
  }

  return resp.json();
};

/* ######################## 편의시설 코드 조회 ######################## */
// async : 해당 함수는 promise 를 반환한다
const getFacilityList = async (type) => {
  // fetch 함수 호출에 필요한 매개 변수 선언
  const url = `${BASE_URL}/api/common/option/facility?productName=${type}`;

  const resp = await fetch(url);

  if (!resp.ok) {
    throw new Error(`HTTP 오류로 통신 실패!!!(상태코드 : ${resp.status})`);
  }

  return resp.json();
};

/* ######################## 관광정보 카테고리 조회 ######################## */
// async : 해당 함수는 promise 를 반환한다
const getTourCategoryList = async () => {
  // fetch 함수 호출에 필요한 매개 변수 선언
  const url = `${BASE_URL}/api/common/option/tourCategory`;

  const resp = await fetch(url);

  if (!resp.ok) {
    throw new Error(`HTTP 오류로 통신 실패!!!(상태코드 : ${resp.status})`);
  }

  return resp.json();
};

const getFacilityNameList = async (type, list) => {
  const listName = `facility_${type}`;
  let tempList = JSON.parse(sessionStorage.getItem(listName));
  if (!tempList) {
    tempList = await getFacilityList(type);
    sessionStorage.setItem(listName, JSON.stringify(tempList));
  }

  const nameList = [];
  const codeList = String(list).split(',');

  console.log(type, '--------- ', list);

  codeList.map((item) => {
    console.log('item :::: ', item);
    const extra = tempList.find((f) => f.code === item);
    console.log('extra :::: ', extra);

    nameList.push(`${extra.name}`);
  });

  return nameList;
};

export {
  getRegionList,
  getFacilityList,
  getTourCategoryList,
  getFacilityNameList,
};
