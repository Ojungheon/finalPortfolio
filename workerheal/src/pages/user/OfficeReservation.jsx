import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import AddPeople from '../../components/member/AddPeople';
import DateSelector from '../../common/components/DateSelector';
import ReservationInfo from '../../components/member/ReservationInfo';
import { Alert } from '../../utils/toast';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import AddProduct from '../../components/member/AddProduct';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCalendarDays } from '@fortawesome/free-solid-svg-icons';
import OfficePayment from '../../components/member/OfficePayment';
import useAuthorityCheck from '../../hook/useAuthorityCheck';
import { callPaySystem } from '../../services/paymentService';
import PaymentButton from '../../common/api/PaymentButton';

const API_SERVER = process.env.REACT_APP_SERVER_ROOT;

const reservation = {
  reservationNo: null,
  memberNo: null,
  officeReservateNo: null,
  lodgingReservateNo: null,
  tourReservateNo: null,
  packageNo: null,
  reservateStatus: null,
  reservateNum: null,
  price: null,
  startDate: null,
  endDate: null,
  reservateDate: null,
  officeReservateNo: null,
  faciliteCode: null,
  amount: null,
};

const Title = styled.div`
  display: flex;
  font-size: 25px;
  font-weight: bold;
  color: #8041ff;
  justify-content: center;
  margin-top: 20px;
`;

const Layout = styled.div`
  gap: 15px;
`;

const TitleLayout = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: -48px;
`;

const CalenderTitle = styled.div`
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

const Date = styled.div`
  margin-top: 50px;
`;

const BtnLayout = styled.div`
  display: flex;
  margin: 0px auto;
  justify-content: center;
  margin-top: 60px;
  gap: 100px;
`;

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

const CancelBtn = styled.button`
  width: 120px;
  height: 40px;
  font-size: 20px;
  font-weight: bold;
  color: white;
  background-color: #979797;
  border-radius: 10px;
  border: transparent;
  &:hover {
    cursor: pointer;
    background-color: #4e4e4eeb;
  }
`;

const OfficeReservation = () => {
  const navigate = useNavigate();
  const { officeInfo } = useSelector((state) => state.officeDetailed);
  const [payType, setPayType] = useState(''); // 태훈 추가
  const [payData, setPayData] = useState({
    name: officeInfo.name,
    payType: '',
    price: 0,
    type: 'OFFICE',
  }); // 결제정보 - 태훈 추가

  // ###################### 로그인 검증 ###########################
  const checkLogin = useAuthorityCheck('MEMBER', '/member/login');
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    if (checkLogin()) {
      setIsChecking(false);
    }
  }, []);

  // swal
  const handlePayment = () => {
    Alert({
      icon: 'success',
      title: '결제가 완료되었습니다.',
      // text: '메인페이지로 이동합니다',
      text: '예약내역 화면으로 이동합니다.', // 태훈 수정
    }).then((result) => {
      if (result.isConfirmed) {
        // navigate('/');
        navigate('/member/reservated'); // 태훈 수정
      }
    });
  };

  const handelCancel = () => {
    Alert({
      icon: 'warning',
      title: '결제를 취소하시겠습니까?',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: '승인',
      cancelButtonText: '취소',
      reverseButtons: true,
    }).then((result) => {
      if (result.isConfirmed) {
        Alert({
          icon: 'success',
          title: '결제가 취소되었습니다.',
          text: '메인페이지로 이동합니다',
        }).then(() => {
          navigate('/');
        });
      }
    });
  };

  const { startDate, endDate } = useSelector((state) => state.date);

  // 상세 정보 상태
  const [officeReservation, setOfficeReservation] = useState(reservation);

  // 로컬스토리지에 저장된 데이터 가져오기
  const [userInfo, setUserInfo] = useState({
    name: '',
    phone: '',
    no: '',
    points: 0, // 태훈 추가
  });

  useEffect(() => {
    // local에서 member가져오고 JSON 파싱해줌
    const memberData = sessionStorage.getItem('member'); // 태훈 수정
    const member = memberData ? JSON.parse(memberData) : {};

    setUserInfo({
      name: member.name || '',
      phone: member.phone || '',
      no: member.no || '',
      points: member.points || 0, // 태훈 추가
    });
  }, []);

  // 예약 함수만 분리 - 태훈 수정
  // const fetchDetail = async () => { // 태훈 수정
  const fetchDetail = async (payInfo) => {
    const option = {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        token: sessionStorage.getItem('token'),
      },
      // body: formData,
      body: JSON.stringify({
        info: officeInfo,
        reservation: officeReservation,
        payVo: payInfo, // 태훈 추가
      }),
    };

    console.log('요청 데이터:', {
      info: officeInfo,
      reservation: officeReservation,
    });

    const resp = await fetch(
      `http://${API_SERVER}/api/office/reservation`,
      option
    );
    // 결과 반환
    return resp;
  };

  const handleReservation = async () => {
    if (!officeInfo || !officeReservation) {
      console.error('❌ officeInfo 또는 officeReservation이 존재하지 않음.');
      Alert({
        icon: 'error',
        title: '예약 정보를 확인해주세요!',
        text: '예약할 데이터를 다시 입력해주세요.',
      });
      return;
    }

    try {
      const resp = await callPaySystem(payData, fetchDetail);
      // 성공 실패 예외처리
      if (resp) {
        handlePayment();
      } else {
        throw new Error(resp);
      }
    } catch (error) {
      // 사용자의 결제 취소 요청 시 화면 유지
      if (error.message == '결제 취소') {
        return;
      }
      console.error('❌ 결재 실패: ', error);
      Alert({
        icon: 'error',
        title: '상품 예약 중 오류가 발생했습니다.',
        text: error.message,
      }).then((result) => {
        if (result.isConfirmed) {
          navigate('/');
        }
      });
    }
  };

  useEffect(() => {
    setOfficeReservation((prev) => {
      return {
        ...prev,
        startDate: startDate,
        endDate: endDate,
      };
    });
  }, [startDate, endDate]);

  useEffect(() => {
    if (userInfo.no) {
      setOfficeReservation((prev) => ({
        ...prev,
        memberNo: userInfo.no,
      }));
    }
  }, [userInfo.no]);

  const [selectedProducts, setSelectedProducts] = useState([]); // 선택한 물품 리스트 상태

  useEffect(() => {
    if (selectedProducts.length > 0) {
      setOfficeReservation((prev) => ({
        ...prev,
        faciliteCode: selectedProducts.map((p) => p.faciliteCode).join(','), // 여러 개일 경우 ,로 연결
        amount: selectedProducts.map((p) => p.amount).join(','), // 수량도 같은 방식으로 저장
      }));
    }
  }, [selectedProducts]);

  // state 변경 시 결제정보에 반영 - 태훈 추가
  useEffect(() => {
    setPayData((prev) => ({
      ...prev,
      payType: payType,
      price: officeReservation.price,
    }));
  }, [payType, officeReservation.price]);

  return isChecking ? (
    <div></div>
  ) : (
    <>
      <Layout>
        <Title>예약 </Title>
        <TitleLayout>
          <CalenderTitle>
            <FontAwesomeIcon
              icon={faCalendarDays}
              style={{ color: '#747474' }}
            />
            날짜 선택
          </CalenderTitle>
          <Line />
        </TitleLayout>

        {/* 캘린더 */}
        <Date>
          <DateSelector calfontsize={'25px'} getReservateList={() => {}} />
        </Date>

        {/* 인원 선택 */}
        {/* <AddPeople setPackageReservation={setOfficeReservation} /> */}
        {/* 태훈 수정 */}
        <AddPeople
          setPackageReservation={setOfficeReservation}
          officePrice={officeInfo.price}
        />

        {/* 추가물품 */}
        <AddProduct
          code={officeInfo.extraCode}
          setSelectedProducts={setSelectedProducts}
        />

        {/* 사용자의 정보 */}
        <ReservationInfo name={userInfo.name} phone={userInfo.phone} />

        {/* 가격정보와 결제수단 */}
        {/* <OfficePayment availableMileage={5000} price={officeInfo.price} /> */}
        {/* 태훈 수정 */}
        <OfficePayment
          availableMileage={userInfo.points}
          // price={officeInfo.price}
          price={officeReservation.price}
          setPayType={setPayType} // 태훈 추가
        />

        {/* 버튼 */}
        <BtnLayout>
          {/* <PaymentBtn onClick={fetchDetail}>결제</PaymentBtn> */}
          {/* <PaymentButton payData={payData} handleSubmit={fetchDetail}>
            결제
            </PaymentButton> */}
          <PaymentBtn onClick={handleReservation}>결제</PaymentBtn>
          <CancelBtn onClick={handelCancel}>취소</CancelBtn>
        </BtnLayout>
      </Layout>
    </>
  );
};

export default OfficeReservation;
