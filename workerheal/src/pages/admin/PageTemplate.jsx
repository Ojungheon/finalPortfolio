import React from 'react';
import styled from 'styled-components';
import MenuTitle from '../../components/admin/MenuTitle';

const Layout = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  grid-template-rows: 1fr 9fr;
  width: 100%;
  height: 100;
`;

const TitleWrap = styled.div`
  padding-left: 7em;
  padding-top: 5px;
  align-content: center;
`;

const ContentWrap = styled.div`
  display: grid;
  grid-template-columns: 1fr 11fr 1fr;
`;

const PageTemplate = () => {
  return (
    <Layout>
      <TitleWrap>
        <MenuTitle title={'메뉴 이름'} />
      </TitleWrap>
      <ContentWrap>
        <div></div>
        <div>데이터 영역</div>
        <div></div>
      </ContentWrap>
    </Layout>
  );
};

export default PageTemplate;
