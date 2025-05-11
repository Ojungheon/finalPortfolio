import React, { useEffect } from 'react';
import styled from 'styled-components';
import { Button } from '@mui/material';

/* ################################## styled components start ################################## */
const LayOut = styled.div`
  display: block;
  width: 100%;
  height: 100%;
`;

const TitleH3 = styled.h3`
  display: block;
  width: 100%;
  margin: 0;
`;

const ContentWrap = styled.div`
  display: flex;
  width: 100%;
`;

const FormGroup = styled.div`
  width: 100%;
  margin-top: 5px;
`;

const InputTag = styled.input`
  width: ${(props) => props.width};
`;
/* ################################## styled components start ################################## */

/* ################################## MuiAddress components ################################## */
const MuiAddress = ({ state, setState, handler, titleName }) => {
  /* ################### 카카오주소 api 호출 ################### */
  useEffect(() => {
    const script = document.createElement('script');
    script.src =
      '//t1.daumcdn.net/mapjsapi/bundle/postcode/prod/postcode.v2.js';
    script.async = true;
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  /* ################### 우편주소 검색 호출 ################### */
  const handlePostcode = () => {
    new window.daum.Postcode({
      oncomplete: function (data) {
        setState(data.zonecode, data.roadAddress);
      },
    }).open();
  };

  return (
    <LayOut>
      {/* ############################### 제목 Area start ############################### */}
      <TitleH3>{titleName}</TitleH3>
      {/* ############################### 제목 Area start ############################### */}

      {/* ############################### 주소 입력 Area start ############################### */}
      {/* ##################### 우편주소 검색 start ##################### */}
      <ContentWrap>
        <FormGroup className="form-group">
          <InputTag
            type="text"
            name="postcode"
            width={'70%'}
            className="form-control"
            value={state.postcode}
            placeholder="우편번호"
            onChange={handler}
          />
          <Button
            sx={{ pl: 1, pr: 1, pt: 0, pb: 0, ml: 2 }}
            // type="submit"
            type="button"
            color="primary"
            variant="contained"
            onClick={handlePostcode}
          >
            주소 검색
          </Button>
        </FormGroup>
      </ContentWrap>
      {/* ##################### 우편주소 검색 end ##################### */}

      {/* ##################### 도로명 주소 입력란 start ##################### */}
      <ContentWrap>
        <FormGroup className="form-group">
          <InputTag
            type="text"
            name="roadAddress"
            width={'87%'}
            className="form-control"
            value={state.roadAddress}
            placeholder="도로명 주소"
            onChange={handler}
          />
        </FormGroup>
      </ContentWrap>
      {/* ##################### 도로명 주소 입력란 end ##################### */}

      {/* ##################### 상세 주소 입력란 start ##################### */}
      <ContentWrap>
        <FormGroup className="form-group">
          <InputTag
            type="text"
            name="detailAddress"
            width={'87%'}
            className="form-control"
            value={state.detailAddress}
            placeholder="상세 주소"
            onChange={handler}
          />
        </FormGroup>
      </ContentWrap>
      {/* ##################### 상세 주소 입력란 end ##################### */}
      {/* ############################### 주소 입력 Area end ############################### */}
    </LayOut>
  );
};
/* ################################## MuiAddress components ################################## */

export default MuiAddress;
