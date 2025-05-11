import React from 'react';
import styled from 'styled-components';

const StyledFooter = styled.div`
  background-color: #ffffff;
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
`;

const FooterArea = styled.div`
  background-color: #e9e9e9;
  width: 100%;
  height: 300px;
  margin-top: 200px;
  z-index: 100;
`;

const TextArea = styled.footer`
  margin: 20px;
`;

const Footer = () => {
  return (
    <>
      {/* <Line /> */}
      <StyledFooter>
        <FooterArea>
          <TextArea>
            <h4>(주)WorkerHeal</h4>
            주소 : 서울시 강남구 역삼동 823-23, 호산빌딩 6 | 대표이사: 왕두수 |
            사업자등록번호 : 111-22-33333 | 사업자정보확인 전자우편주소 :
            dolearndorun@kh.com
            <br />
            통신판매번호 : 2025-00321 | 관광사업자 등록번호 : 제1026-24호 |
            전화번호 : 1577-1577 (주)WorkerHeal은 통신판매중개자로서 통신판매의
            당사자가 아니며, 상품의 예약, 이용 및 환불 등과 관련한 의무와 책임은
            각 판매자에게 있습니다.
            <br />
            이용약관 개인정보처리방침 소비자 분쟁해결 기준 콘텐츠산업진흥법에
            의한 표시 Copyright GC COMPANY Corp.All rights reserved.
          </TextArea>
        </FooterArea>
      </StyledFooter>
    </>
  );
};

export default Footer;
