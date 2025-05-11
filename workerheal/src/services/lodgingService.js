import { BASE_URL } from './config';

/* ######################## 숙소 목록 조회 ######################## */
// async : 해당 함수는 promise 를 반환한다
const getLodgingList = async (pno, limit) => {
  // fetch 함수 호출에 필요한 매개 변수 선언
  const url = `${BASE_URL}/api/manager/lodging/list?pno=${pno}&limit=${limit}`;
  const option = {
    method: 'GET',
    headers: {
      token: sessionStorage.getItem('token'),
    },
  };
  const resp = await fetch(url, option);

  if (!resp.ok) {
    throw new Error(`HTTP 오류로 통신 실패!!!(상태코드 : ${resp.status})`);
  }

  return resp.json();
};

/* ######################## 숙소 목록 삭제 ######################## */
// async : 해당 함수는 promise 를 반환한다
const deleteLodgingList = async (noList) => {
  // 선택항목 없으면 알림
  if (noList.length < 1) {
    throw new Error('삭제할 항목을 먼저 선택해주세요.');
  }

  // fetch 함수 호출에 필요한 매개 변수 선언
  const url = `${BASE_URL}/api/manager/lodging/delete`;
  const option = {
    method: 'DELETE',
    headers: {
      'content-type': 'application/json',
      token: sessionStorage.getItem('token'),
    },
    body: JSON.stringify(noList),
  };

  // 서버에 삭제 요청
  const resp = await fetch(url, option);
  const result = await resp.text();

  // 예외처리
  if (!resp.ok) {
    throw new Error(result);
  } else if (result != 'success') {
    throw new Error(`예약내역이 존재하여 삭제할 수 없습니다(${result})`);
  }
  return result;
};

export { getLodgingList, deleteLodgingList };
