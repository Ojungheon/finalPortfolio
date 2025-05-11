import React from 'react';
import styled from 'styled-components';
import { Button } from '@mui/material';
import { requesthandle } from '../../../services/approvalService';
import { Check, Alert } from '../../../utils/toast';

/* ################################## styled components start ################################## */
const SelectArea = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  grid-template-rows: 1fr 90px;
  justify-self: center;
  align-items: center;
  justify-content: center;
  width: 80%;
  height: 100%;
  background-color: #e6e6e6;
`;

const TextArea = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
  /* background-color: #8041ff; */
`;

const ButtonArea = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
  /* background-color: #8041ff; */
`;

const SubSpan = styled.span`
  font-size: 25px;
  font-weight: 800;
  margin-bottom: 10px;
  margin-top: 10px;
`;

const MainSpan = styled.span`
  font-size: 48px;
  font-weight: 900;
`;
/* ################################## styled components end ################################## */

/* ################################## ApproveArea start ################################## */
const ApproveArea = ({ workplaceInfo, type }) => {
  /* ################### 결과 Alert ################### */
  const resultAlert = async (icon, title) => {
    Alert({
      icon: icon,
      title: title,
      text: '',
      allowOutsideClick: false, // ✅ 바깥 클릭으로 닫히지 않음
      allowEscapeKey: false, // ✅ ESC 키로 닫히지 않음
      allowEnterKey: false, // ✅ 엔터 키로 닫히지 않음
    }).then((result) => {
      if (result.isConfirmed) {
        // 부모창에 현재창이 닫혔다는 메시지 전달
        window.opener?.postMessage('windowClosed', '*');
        // 현재 창 닫기
        window.close();
      }
    });
  };

  /* ################### fetch 함수 ################### */
  const handleSubmit = (submitType) => {
    Check({
      icon: 'warning',
      title:
        submitType == 'accept' ? '승인 하시겠습니까?' : '반려 하시겠습니까?',
      text:
        submitType == 'accept'
          ? '승인된 내용은 바로 화면에 반영됩니다.'
          : '반련된 요청은 호스트의 수정 후 재승인 가능합니다.',

      allowOutsideClick: false, // ✅ 바깥 클릭으로 닫히지 않음
      allowEscapeKey: false, // ✅ ESC 키로 닫히지 않음
      allowEnterKey: false, // ✅ 엔터 키로 닫히지 않음
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const result = await requesthandle(submitType, workplaceInfo, type);
          resultAlert('success', result);
        } catch (error) {
          resultAlert('error', error.message);
        }
      } else {
        return;
      }
    });
  };

  return (
    <>
      <SelectArea>
        {/* ################### 안내문구 영역 start ################### */}
        <TextArea>
          {workplaceInfo.statusNo != 3 ? (
            <>
              <SubSpan>아래 표시되는 내용대로 고객 화면에 반영됩니다.</SubSpan>
              <MainSpan>해당 요청을 승인하시겠습니까?</MainSpan>
            </>
          ) : (
            <SubSpan>반려처리된 항목입니다.</SubSpan>
          )}
        </TextArea>
        {/* ################### 안내문구 영역 end ################### */}

        {/* ################### 버튼 영역 start ################### */}
        <ButtonArea>
          {/* ############### 승인 버튼 ############### */}
          <Button
            sx={{ fontSize: 20, height: '55%', mr: 3 }}
            type="submit"
            color="secondary"
            variant="contained"
            disabled={workplaceInfo.statusNo == 3 ? true : false}
            // onClick={approveAccept}
            onClick={() => {
              handleSubmit('accept');
            }}
          >
            승인
          </Button>

          {/* ############### 반려 버튼 ############### */}
          <Button
            sx={{ fontSize: 20, height: '55%', ml: 3 }}
            type="submit"
            color="error"
            variant="contained"
            disabled={workplaceInfo.statusNo == 3 ? true : false}
            // onClick={approveDeny}
            onClick={() => {
              handleSubmit('deny');
            }}
          >
            반려
          </Button>
        </ButtonArea>
        {/* ################### 버튼 영역 end ################### */}
      </SelectArea>
    </>
  );
};
/* ################################## ApproveArea end ################################## */

export default ApproveArea;
