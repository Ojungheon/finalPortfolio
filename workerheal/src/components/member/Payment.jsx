import React, { useState } from 'react';
import styled from 'styled-components';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMoneyCheckDollar } from '@fortawesome/free-solid-svg-icons';

const Layout = styled.div``;
const TitleLayout = styled.div`
  margin-top: 30px;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const Title = styled.div`
  display: flex;
  justify-content: center;
  font-size: 20px;
  color: #747474;
  align-items: center;
  flex-direction: row;
  margin: 20px;
`;

const Line = styled.div`
  width: 1030px;
  height: 1px;
  background-color: #747474;
`;

const Section = styled.div`
  display: flex;
  flex-direction: column;
  margin: 15px;
  width: 300px;
  margin-left: 232px;
`;

const Label = styled.div`
  font-size: 16px;
  font-weight: bold;
  margin-bottom: 5px;
`;

const Select = styled.select`
  width: 100%;
  padding: 8px;
  border: 1px solid #ccc;
  border-radius: 5px;
  font-size: 16px;
`;

const BankInfo = styled.div`
  display: flex;
  margin-left: 260px;
  font-size: 14px;
  color: #333;
  font-weight: bold;
  width: 300px;
`;

const Input = styled.input`
  width: 100%;
  padding: 8px;
  border: 1px solid #ccc;
  border-radius: 5px;
  font-size: 16px;
`;

const MileageText = styled.div`
  margin-top: 5px;
  font-size: 14px;
  color: #747474;
  text-align: left;
`;

const TotalAmountContainer = styled.div`
  display: flex;
  flex-direction: column;
  margin: 0px auto;
  margin-right: 150px;
  text-align: right;
`;

const OriginalPrice = styled.div`
  font-size: 18px;
  font-weight: bold;
  color: #333;
`;

const StrikeThrough = styled.span`
  text-decoration: line-through;
  color: #666;
  margin-right: 8px;
`;

const DiscountRate = styled.span`
  color: red;
  font-weight: bold;
`;

const FinalPrice = styled.div`
  font-size: 28px;
  font-weight: bold;
  color: black;
  margin-top: 5px;
`;

const MileageInfo = styled.div`
  font-size: 14px;
  color: #666;
  margin-top: 3px;
`;

const Payment = ({
  availableMileage,
  originalPrice,
  discountRate,
  finalPrice,
}) => {
  const [selectedPayment, setSelectedPayment] = useState('bankTransfer');
  const [mileage, setMileage] = useState('');

  return (
    <>
      <Layout>
        <TitleLayout>
          <Title>
            <FontAwesomeIcon
              icon={faMoneyCheckDollar}
              style={{ color: '#747474' }}
            />
            결제
          </Title>
          <Line />
        </TitleLayout>

        {/* 결제 수단 선택 */}
        <Section>
          <Label>결제 수단</Label>
          <Select
            value={selectedPayment}
            onChange={(e) => setSelectedPayment(e.target.value)}
          >
            <option value="bankTransfer">무통장 입금</option>
            <option value="creditCard">신용카드</option>
            <option value="kakakoPay">카카오페이</option>
          </Select>
        </Section>

        {/* 무통장 입금일 경우 계좌 정보 표시 */}
        {selectedPayment === 'bankTransfer' && (
          <BankInfo>국민은행 090502-04-203103 김유진</BankInfo>
        )}

        {/* 마일리지 입력 */}
        <Section>
          <Label>포인트</Label>
          <Input
            type="number"
            value={mileage}
            onChange={(e) => setMileage(e.target.value)}
            placeholder="사용할 포인트 입력"
          />
          <MileageText>현재 보유 포인트: {availableMileage}P</MileageText>
        </Section>

        {/* 총액 */}
        <TotalAmountContainer>
          {/* 원래 가격 + 할인율 */}
          <OriginalPrice>
            <StrikeThrough>{originalPrice.toLocaleString()}원</StrikeThrough>
            <DiscountRate> -{discountRate}%</DiscountRate>
          </OriginalPrice>

          {/* 할인된 가격 */}
          <FinalPrice>총액 {finalPrice.toLocaleString()}원</FinalPrice>

          {/* 마일리지 적립 정보 */}
          <MileageInfo>포인트 적립 5%</MileageInfo>
        </TotalAmountContainer>
      </Layout>
    </>
  );
};

export default Payment;
