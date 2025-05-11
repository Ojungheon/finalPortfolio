import { BASE_URL } from './config';
import { impUid, payInfo } from './config';

/* ######################## 결제 및 예약 진행 ######################## */
const callPaySystem = async (payData, insertToDB) => {
  // 결제사 정보 수집
  const pgInfo = payInfo[payData.payType];

  // 고객사 정보 등록
  const { IMP } = window;
  IMP.init(impUid);

  try {
    // 서버에서 예약번호 생성하여 받아오기
    const resp = await setReservationNo(payData.type);
    const result = await resp.text(); // 결과 문자열 변수 저장
    // 예약번호 생성 중 오류 발생 시 예외처리
    if (!resp.ok) {
      throw new Error(result);
    }
    const x =
      payData.type == 'OFFICE' ? 'OF' : payData.type == 'LODGING' ? 'LO' : '';
    const reservationNo = x + result; // 예약번호 생성

    // 결제 정보 생성
    const data = {
      // param
      pg: pgInfo.pgValue, //PG사구분코드.{사이트코드},
      pay_method: pgInfo.payMethod, // card
      merchant_uid: reservationNo, // 상점 고유 주문번호
      name: payData.name, // 상품명
      amount: payData.price, // 금액
      m_redirect_url: `${BASE_URL}/member/reservated`,
    };

    // 결제 api 호출
    await new Promise((resolve, reject) => {
      window.IMP.request_pay(data, async (rsp) => {
        // 결제정보 객체 생성
        const payInfo = {
          no: '',
          memberNo: '',
          reservationNo: reservationNo,
          price: payData.price,
          payDate: '',
          payType: pgInfo.payMethod,
        };

        // callback
        if (rsp.success) {
          // 결제내역 및 예약정보 서버에 저장
          const resp = await insertToDB(payInfo);
          // 서버 저장 실패 시 예외처리
          if (!resp.ok) {
            const result = await resp.text();
            reject(new Error(result)); // 서버 저장 실패하면 reject 호출
          } else {
            resolve(true); // 서버 저장 성공하면 resolve 호출
          }
        } else {
          if (rsp.error_msg.includes('취소')) {
            reject(new Error('결제 취소'));
          }
          reject(new Error(rsp.error_msg)); // 결제가 실패하면 reject 호출
        }
      });
    });
    return true;
  } catch (error) {
    throw new Error(error.message);
  }
};

/* ######################## 예약번호 생성 ######################## */
const setReservationNo = async (type) => {
  // fetch 함수 호출에 필요한 매개 변수 선언
  const url = `${BASE_URL}/api/pay/reserveNo/${type}`;

  const resp = await fetch(url);

  return resp;
};

export { callPaySystem, setReservationNo };
