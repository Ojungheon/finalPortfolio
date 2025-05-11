// 공통으로 사용되는 기본 url 주소 변수
const API_SERVER = process.env.REACT_APP_SERVER_ROOT;
const BASE_URL = `https://${API_SERVER}`;

// 결제에 사용되는 고객사 식별 코드
const impUid = 'imp21162378';

// 결제에 사용되는 결제사 정보
const payInfo = {
  // 카카오페이 간편결제 연동 정보
  kakao: {
    pgValue: 'kakaopay.TC0ONETIME',
    payMethod: 'kakaopay',
  },
  // 토스페이 간편결제 연동 정보
  toss: {
    pgValue: 'tosspay.tosstest',
    payMethod: 'tosspay',
  },
  // 토스페이 일반결제 연동 정보
  tossCard: {
    pgValue: 'uplus',
    payMethod: 'card',
  },
};

export { BASE_URL, impUid, payInfo };
