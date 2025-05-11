import { BASE_URL } from './config';

/* ######################## 승인요청 목록 조회 ######################## */
// async : 해당 함수는 promise 를 반환한다
const getApprovalList = async (pno, limit) => {
  // fetch 함수 호출에 필요한 매개 변수 선언
  const url = `${BASE_URL}/api/manager/approval/list?pno=${pno}&limit=${limit}`;
  const option = {
    method: 'GET',
    headers: {
      'content-type': 'application/json',
      token: sessionStorage.getItem('token'),
    },
  };
  const resp = await fetch(url, option);
  // const result = await resp.json();

  if (!resp.ok) {
    throw new Error(resp.status);
  }

  return resp.json();
};

/* ######################## 승인요청 상세정보 조회 ######################## */
// async : 해당 함수는 promise 를 반환한다
const getApprovalDetail = async (no, place) => {
  // fetch 함수 호출에 필요한 매개 변수 선언
  const url = `${BASE_URL}/api/manager/approval/${place}/detail?no=${no}`;
  const option = {
    method: 'GET',
    headers: {
      'content-type': 'application/json',
      token: sessionStorage.getItem('token'),
    },
  };
  const resp = await fetch(url, option);

  if (!resp.ok) {
    throw new Error(`HTTP 오류로 통신 실패!!!(상태코드 : ${resp.status})`);
  }

  return resp.json();
};

/* ######################## 승인요청 승인 처리 ######################## */
/*const acceptApprove = async (no, place, type) => {
  // fetch 함수에 담아 전달한 데이터 생성
  const formData = new FormData();
  formData.append('no', no);
  formData.append('place', place);
  formData.append('type', type);

  // fetch 함수 호출에 필요한 매개 변수 선언
  const url = `${BASE_URL}/api/manager/approval/accept`;
  const option = {
    method: 'POST',
    headers: {
      // 'content-type': 'application/json',
      token: sessionStorage.getItem('token'),
    },
    body: formData,
  };
  const resp = await fetch(url, option);
  const resultMessage = await resp.text(); // 처리결과 문구 추출

  if (!resp.ok) {
    throw new Error(resultMessage);
  }

  return resultMessage;
};*/

/* ######################## 승인요청 반려 처리 ######################## */
/*const denyApprove = async (no, place) => {
  // fetch 함수에 담아 전달한 데이터 생성
  const formData = new FormData();
  formData.append('no', no);
  formData.append('place', place);

  // fetch 함수 호출에 필요한 매개 변수 선언
  const url = `${BASE_URL}/api/manager/approval/deny`;
  const option = {
    method: 'POST',
    headers: {
      token: sessionStorage.getItem('token'),
    },
    body: formData,
  };
  const resp = await fetch(url, option);
  const resultMessage = await resp.text(); // 처리결과 문구 추출

  if (!resp.ok) {
    throw new Error(resultMessage);
  }

  return resultMessage;
};*/

/* ######################## 승인요청 승인 및 반려 처리 ######################## */
const requesthandle = async (submitType, placeInfo, placeType) => {
  // fetch 함수에 담아 전달한 데이터 생성
  const formData = new FormData();
  formData.append('no', placeInfo.no);
  formData.append('place', placeType);
  if (submitType == 'accept') {
    formData.append('type', placeInfo.statusNo);
  }

  // fetch 함수 호출에 필요한 매개 변수 선언
  const url = `${BASE_URL}/api/manager/approval/${submitType}`;
  const option = {
    method: 'POST',
    headers: {
      token: sessionStorage.getItem('token'),
    },
    body: formData,
  };
  const resp = await fetch(url, option);
  const resultMessage = await resp.text(); // 처리결과 문구 추출

  if (!resp.ok) {
    throw new Error(resultMessage);
  }

  return resultMessage;
};

export { getApprovalList, getApprovalDetail, requesthandle };
