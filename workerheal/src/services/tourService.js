import { Toast2 } from '../utils/toast';
import { BASE_URL } from './config';

/* ######################## 관광정보 등록 ######################## */
// async : 해당 함수는 promise 를 반환한다
const tourEnroll = async (formData) => {
  // fetch 함수 호출에 필요한 매개 변수 선언
  const url = `${BASE_URL}/api/manager/tour/enroll`;
  const option = {
    method: 'POST',
    headers: {
      // 'content-type': 'application/json',
      token: sessionStorage.getItem('token'),
    },
    body: formData,
  };

  const resp = await fetch(url, option);
  const result = await resp.text();

  // 예외처리
  if (!resp.ok) {
    throw new Error(result);
  }
  return result;
};

/* ######################## 관광정보 목록 조회 ######################## */
// async : 해당 함수는 promise 를 반환한다
const getTourList = async (pno, limit, categoryNo, regionNo, keyWord) => {
  // fetch 함수 호출에 필요한 매개 변수 선언
  const url = `${BASE_URL}/api/manager/tour/list?pno=${pno}&limit=${limit}&categoryNo=${categoryNo}&regionNo=${regionNo}&searchKey=${keyWord}`;
  const option = {
    method: 'GET',
    headers: {
      'content-type': 'application/json',
      token: sessionStorage.getItem('token'),
    },
  };

  const resp = await fetch(url, option);
  const result = await resp.json();

  // 예외처리
  if (!resp.ok) {
    throw new Error(result.message);
  }
  return result;
};

/* ######################## 관광정보 목록 삭제 ######################## */
// async : 해당 함수는 promise 를 반환한다
const deleteTourList = async (noList) => {
  // 선택항목 없으면 알림
  if (noList.length < 1) {
    throw new Error('삭제할 항목을 먼저 선택해주세요.');
  }

  // fetch 함수 호출에 필요한 매개 변수 선언
  const url = `${BASE_URL}/api/manager/tour/delete`;
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

/* ######################## 관광정보 상세조회 ######################## */
// async : 해당 함수는 promise 를 반환한다
const getTourDetail = async (no) => {
  // fetch 함수 호출에 필요한 매개 변수 선언
  const url = `${BASE_URL}/api/manager/tour/detail/${no}`;
  const option = {
    method: 'GET',
    headers: {
      'content-type': 'application/json',
      token: sessionStorage.getItem('token'),
    },
  };

  const resp = await fetch(url, option);
  const result = await resp.json();

  // 예외처리
  if (!resp.ok) {
    throw new Error(result.message);
  }
  return result;
};

/* ######################## 관광정보 수정 ######################## */
// async : 해당 함수는 promise 를 반환한다
const editTour = async (formData) => {
  // fetch 함수 호출에 필요한 매개 변수 선언
  const url = `${BASE_URL}/api/manager/tour/edit`;
  const option = {
    method: 'POST',
    headers: {
      // 'content-type': 'application/json',
      token: sessionStorage.getItem('token'),
    },
    body: formData,
  };

  const resp = await fetch(url, option);
  const result = await resp.text();

  // 예외처리
  if (!resp.ok) {
    throw new Error(result);
  }
  return result;
};

/* 숫자 여부 검증 */
function isNumber(value) {
  return !isNaN(value) && value.trim() !== '';
}

/* ######################## Business 로직 검증 ######################## */
const BusinessCheck = (fd, formData, facilityList, errorMsg, setErrorMsg) => {
  // FormData에 vo 데이터 추가
  for (const [key, value] of Object.entries(formData)) {
    console.log('key :::::::::: ', key, ' /// value :::::::::::: ', value);
    if (key == 'name' && value.length < 1) {
      setErrorMsg((prev) => ({
        ...prev,
        item: key,
        msg: '관광정보명은 필수 입력 항목입니다.',
      }));
      return;
    } else if (key == 'regionNo' && value == '') {
      setErrorMsg((prev) => ({
        ...prev,
        item: key,
        msg: '지역 선택은 필수입니다.',
      }));
      Toast2.fire({
        icon: 'error',
        title: '지역 선택은 필수입니다.',
      });
      return;
    } else if (key == 'categoryNo' && value == '') {
      setErrorMsg((prev) => ({
        ...prev,
        item: key,
        msg: '카테고리 선택은 필수입니다.',
      }));
      Toast2.fire({
        icon: 'error',
        title: '카테고리 선택은 필수입니다.',
      });
      return;
    } else if (
      key == 'phone' &&
      !/^(01[0-9]|02|0[3-9][0-9])-?\d{3,4}-?\d{4}$/.test(value)
    ) {
      setErrorMsg((prev) => ({
        ...prev,
        item: key,
        msg: '최대 12자리의 전화번호 형식의 데이터로 입력해 주세요.',
      }));
      return;
    } else if (key == 'price' && value != '' && !/^[1-9]\d*$/.test(value)) {
      setErrorMsg((prev) => ({
        ...prev,
        item: key,
        msg: '가격은 정수 숫자로만 입력 가능합니다.',
      }));
      return;
    } else if ((key == 'postcode' || key == 'roadAddress') && value == '') {
      setErrorMsg((prev) => ({
        ...prev,
        item: key,
        msg: '주소 정보는 필수 입력 정보입니다.',
      }));
      Toast2.fire({
        icon: 'error',
        title: '주소 정보는 필수 입력 정보입니다.',
      });
      return;
    } else if (key == 'facilitieCode') {
      fd.append(key, facilityList.join([',']));
    } else if (key == 'tag') {
      console.log(value);

      fd.append(key, value.join([',']));
    } else if (key == 'detail' && value == '') {
      setErrorMsg((prev) => ({
        ...prev,
        item: key,
        msg: '상세 내용을 입력해 주세요',
      }));
      Toast2.fire({
        icon: 'error',
        title: '상세 내용을 입력해 주세요',
      });
      return;
    } else {
      fd.append(key, value);
      if (errorMsg.item == key) {
        setErrorMsg((prev) => ({ ...prev, item: '', msg: '' }));
      }
    }
  }

  // 예외처리
  if (errorMsg.msg != '') {
    return false;
  }

  return true;
};

export {
  tourEnroll,
  getTourList,
  getTourDetail,
  deleteTourList,
  editTour,
  BusinessCheck,
};
