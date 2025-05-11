import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import PackageRoomSelect from '../../components/member/PackageRoomSelect';
import AddPeople from '../../components/member/AddPeople';
import DateSelector from '../../common/components/DateSelector';
import LinkedProgram from '../../components/member/LinkedProgram';
import ReservationInfo from '../../components/member/ReservationInfo';
import Charge from '../../components/member/Charge';
import Payment from '../../components/member/Payment';
import { Alert } from '../../utils/toast';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import AddProduct from '../../components/member/AddProduct';
import useAuthorityCheck from '../../hook/useAuthorityCheck';

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

const tour = {
  reservationNo: null,
  memberNo: null,
  tourNo: null,
  reservateStatus: null,
  reservateNum: null,
  price: null,
  startDate: null,
  endDate: null,
  reservateDate: null,
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

const PackageReservation = () => {
  const navigate = useNavigate();

  // ###################### 로그인 검증 ###########################
  const checkLogin = useAuthorityCheck('MEMBER', '/member/login');
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    if (checkLogin()) {
      setIsChecking(false);
    }
  }, []);

  const handlePayment = () => {
    console.log('Aaaaaaa');

    Alert({
      icon: 'success',
      title: '결제가 완료되었습니다.',
      text: '메인페이지로 이동합니다',
    }).then((result) => {
      if (result.isConfirmed) {
        navigate('/');
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

  const packageDetail = useSelector((state) => state.packageDetail) || {};

  const { startDate, endDate } = useSelector((state) => state.date);

  // 상세 정보 상태
  const packageInfo = packageDetail.packageInfo || {};
  const officeDetail = packageDetail.officeDetail || {};
  const lodgingDetail = packageDetail.lodgingDetail || {};
  const roomTypeVo = packageDetail.roomTypeVo || [];
  const tourDetail = packageDetail.tourDetail || {};
  const lodgingReservation = packageDetail.packageDetail || {};

  const [packReservation, setPackageReservation] = useState(reservation);
  const [tourInfo, setTourInfo] = useState(tour);

  // 로컬스토리지에 저장된 데이터 가져오기
  const [userInfo, setUserInfo] = useState({
    name: '',
    phone: '',
    no: '',
  });

  useEffect(() => {
    // local에서 member가져오고 JSON 파싱해줌
    const memberData = localStorage.getItem('member');
    const member = memberData ? JSON.parse(memberData) : {};

    setUserInfo({
      name: member.name || '',
      phone: member.phone || '',
      no: member.no || '',
    });
  }, []);

  const fetchDetail = async () => {
    const option = {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        token: sessionStorage.getItem('token'),
      },
      // body: formData,
      body: JSON.stringify({
        a: packageInfo,
        b: officeDetail,
        c: lodgingDetail,
        d: roomTypeVo,
        e: tourDetail.tourVo,
        f: packReservation,
        g: tourInfo,
        h: lodgingReservation,
      }),
    };
    try {
      console.log(
        `🚀 Fetch 요청 시작: https://${API_SERVER}/api/package/reservation`
      );
      const resp = await fetch(
        `http://${API_SERVER}/api/package/reservation`,
        option
      );
      // const data = await resp.json();
      handlePayment();
    } catch (err) {
      console.error('❌ 숙소 상세 정보 가져오기 실패: ', err);
    }
  };
  console.log('tourDetail ::::::', tourDetail);
  console.log('tourInfo ::::::', tourInfo);
  console.log('roomTypeVo:::::', roomTypeVo);
  console.log('officeDetail::::::', officeDetail);

  const originalPrice =
    Number(officeDetail.price ?? 0) +
    Number(lodgingDetail.price ?? 0) +
    Number(tourInfo.price ?? 0);

  // 할인율 적용 (숫자로 변환)
  const discountRate = Number(packageInfo.discount ?? 0); // 할인율 없으면 0%
  const discountAmount = (originalPrice * discountRate) / 100; // 할인 금액
  const finalPrice = originalPrice - discountAmount; // 최종 결제 가격

  useEffect(() => {
    setPackageReservation((prev) => {
      return {
        ...prev,
        startDate: startDate,
        endDate: endDate,
      };
    });
  }, [startDate, endDate]);

  // ############### 오피스 물품 선택 ############################
  const [selectedProducts, setSelectedProducts] = useState([]); // 선택한 물품 리스트 상태

  useEffect(() => {
    if (selectedProducts.length > 0) {
      setPackageReservation((prev) => ({
        ...prev,
        faciliteCode: selectedProducts.map((p) => p.faciliteCode).join(','), // 여러 개일 경우 ,로 연결
        amount: selectedProducts.map((p) => p.amount).join(','), // 수량도 같은 방식으로 저장
      }));
    }
  }, [selectedProducts]);

  useEffect(() => {
    if (userInfo.no) {
      setPackageReservation((prev) => ({
        ...prev,
        memberNo: userInfo.no,
      }));
    }
  }, [userInfo.no]);

  return isChecking ? (
    <div></div>
  ) : (
    <>
      <Layout>
        <Title>예약 </Title>
        <PackageRoomSelect rooms={roomTypeVo} />
        <Date>
          <DateSelector calfontsize={'25px'} getReservateList={() => {}} />
        </Date>
        {/* <AddPeople setPackageReservation={setPackageReservation} /> */}
        {/* 태훈 수정 */}
        <AddPeople
          setPackageReservation={setPackageReservation}
          officePrice={officeDetail.price}
        />
        <AddProduct
          code={officeDetail.extraCode}
          setSelectedProducts={setSelectedProducts}
        />
        <LinkedProgram name={tourDetail.name} setTourInfo={setTourInfo} />
        <ReservationInfo name={userInfo.name} phone={userInfo.phone} />
        <Charge
          officeName={officeDetail.name}
          officePrice={
            officeDetail.price
              ? officeDetail.price
                  .toString()
                  .replace(/\B(?=(\d{3})+(?!\d))/g, ',')
              : '0'
          }
          lodgingName={lodgingDetail.name}
          lodgingPrice={
            lodgingDetail.price
              ? lodgingDetail.price
                  .toString()
                  .replace(/\B(?=(\d{3})+(?!\d))/g, ',')
              : '0'
          }
          tourName={tourDetail.tourVo.name}
          tourPrice={
            tourInfo.price
              ? tourInfo.price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')
              : '0'
          }
        />
        <Payment
          availableMileage={5000}
          const
          originalPrice={originalPrice}
          discountRate={discountRate}
          finalPrice={finalPrice}
        />
        <BtnLayout>
          <PaymentBtn onClick={fetchDetail}>결제</PaymentBtn>
          <CancelBtn onClick={handelCancel}>취소</CancelBtn>
        </BtnLayout>
      </Layout>
    </>
  );
};

export default PackageReservation;
