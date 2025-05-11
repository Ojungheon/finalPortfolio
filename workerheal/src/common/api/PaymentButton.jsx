import React, { useEffect } from 'react';
import styled from 'styled-components';
import { impUid, payInfo } from '../../services/config';
import { setReservationNo } from '../../services/paymentService';

const PaymentBtn = styled.button`
  width: 120px;
  height: 40px;
  font-size: 20px;
  font-weight: bold;
  color: white;
  background-color: #8041ff;
  border-radius: 10px;
  border: transparent;
  &:hover {
    cursor: pointer;
    background-color: #4409bbec;
  }
`;

const PaymentButton = ({ payData, handleSubmit }) => {
  // 클릭 시 동작할 내용
  const onclickPay = async (payData, handleSubmit) => {
    console.log('@@@@@@@@@@@@@@@@@@@ 함수 시작 @@@@@@@@@@@@@@@@@@@@');
    console.log('payData :::::::::::: ', payData);

    // 결제사 정보 수집
    const pgInfo = payInfo[payData.payType];

    // 고객사 정보 등록
    const { IMP } = window;
    IMP.init(impUid);

    const reservationNo = await setReservationNo(payData.type);
    console.log('aaaaaaaaaa ::::::::::::::::: ', reservationNo);

    // 결제 정보 생성
    const data = {
      // param
      pg: pgInfo.pgValue, //PG사구분코드.{사이트코드},
      pay_method: pgInfo.payMethod, // card
      merchant_uid: reservationNo, // 상점 고유 주문번호
      name: payData.name, // 상품명
      amount: payData.price, // 금액
      m_redirect_url: 'http://localhost:3000/member/reservated',
    };

    console.log('결재 요청 내용 ::::::::::::::: ', data);

    window.IMP.request_pay(data, (rsp) => {
      // callback
      if (rsp.success) {
        console.log('결제 성공 했다');
        const resp = handleSubmit();
        console.log('결제 정보 서버 등록 결과 ::::::::::::: ', resp);
      } else {
        console.log('결제 실패 했다');
        console.log('실패 내용 ::::::::::: ', rsp);
      }
    });
    return;

    //     window.IMP.request_pay(data, async (rsp) => {
    //       if (rsp.success) {
    //         const success = await verifyPayment(data.merchant_uid, impUid);
    //         if (success) {
    //           console.log('결제 성공');
    //         } else {
    //           console.log('결제 검증 실패');
    //         }
    //       } else {
    //         console.log('결제 실패');
    //       }
    //     });
    //   };

    //   const verifyPayment = async (merchantUid, impUid) => {
    //     try {
    //       const response = await axios.post(
    //         `/verify/${merchantUid}/${userId}/${impUid}`
    //       );
    //       return response.data.success;
    //     } catch (error) {
    //       console.error('결제 검증 요청 에러:', error);
    //       return false;
    //     }
  };

  // js import
  // useEffect(() => {
  //   const portOneUrl = 'https://cdn.iamport.kr/v1/iamport.js';
  //   let script = document.querySelector(`script[src="${portOneUrl}"]`);

  //   if (!script) {
  //     script = document.createElement('script');
  //     script.src = portOneUrl;
  //     script.async = true;
  //     document.body.appendChild(script);
  //   }
  // }, []);

  return (
    <>
      <PaymentBtn onClick={onclickPay}>결제</PaymentBtn>
    </>
  );
};

export default PaymentButton;
