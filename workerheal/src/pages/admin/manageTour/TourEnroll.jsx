import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { Button, Stack, Paper, IconButton } from '@mui/material';
import RemoveOutlinedIcon from '@mui/icons-material/RemoveOutlined';
import useFormData from '../../../hook/useFormData';
import MenuTitle from '../../../components/admin/MenuTitle';
import MuiTextField from '../../../common/components/MuiTexFiled';
import RegionSelect from '../../../common/components/RegionSelect.jsx';
import TourCategorySelect from '../../../common/components/TourCategorySelect.jsx';
import MuiAddress from '../../../common/components/MuiAddress';
import AddImgFiles from '../../../common/components/AddImgFiles';
import { BusinessCheck, tourEnroll } from '../../../services/tourService';
import Editor from '../../../common/api/Editor.tsx';
import FacilityCheckBox from '../../../common/components/FacilityCheckBox.jsx';
import useAuthorityCheck from '../../../hook/useAuthorityCheck.jsx';
import { BlockAlert, Toast2 } from '../../../utils/toast.jsx';

/* ################################## 초기 데이터 start ################################## */

/* ################################## 관광지Vo 초기값 설정 ################################## */
const initState = {
  managerNo: '',
  name: '',
  regionNo: '',
  categoryNo: '',
  phone: '',
  price: '',
  linkPath: '',
  postcode: '',
  roadAddress: '',
  detailAddress: '',
  tag: [],
  facilitieCode: [],
  detail: '',
};
/* ################################## 관광지Vo 초기값 설정 ################################## */

/* ################################## 초기 데이터 end ################################## */

/* ################################## styled components start ################################## */
const Layout = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  grid-template-rows: 1fr 6fr;
  width: 100%;
`;

const TitleWrap = styled.div`
  padding-left: 7em;
  padding-top: 5px;
  align-content: center;
`;

const ContentWrap = styled.form`
  display: grid;
  grid-template-columns: 1fr 23fr 1fr;
`;

const InputArea = styled.div`
  display: grid;
  grid-template-columns: 8fr 7fr 8fr;
  gap: 20px;
`;

const TagArea = styled.div`
  display: grid;
  grid-template-rows: 1fr 1.5fr;
`;

const TextArea = styled.div`
  display: grid;
  grid-template-columns: 6fr;
`;

const AlignCenter = styled.div`
  display: flex;
  align-items: center;
`;

const SpaceBetween = styled.div`
  display: flex;
  justify-content: space-between;
  width: 100%;
  /* background-color: aqua; */
`;

// const LineWrap = styled.form`
const LineWrap = styled.div`
  display: flex;
  width: 100%;
`;

const ButtonArea = styled.div`
  display: grid;
  justify-items: flex-end;
`;

const Item = styled(Paper)(() => ({
  backgroundColor: '#FFAA0C',
  paddingLeft: '20px',
  textAlign: 'center',
  color: 'coral',
}));
/* ################################## styled components end ################################## */

/* ################################## TourEnroll components ################################## */
const TourEnroll = () => {
  const navi = useNavigate();
  /* ################### state 생성 ################### */
  const [errorMsg, setErrorMsg] = useState({
    item: '',
    msg: '',
  });
  const [imgList, setImgList] = useState([]); // 첨부파일 state
  const [facilityList, setFacilityList] = useState([]);
  const checkLogin = useAuthorityCheck('MANAGER', '/manager/login');
  const [isChecking, setIsChecking] = useState(true);

  /* ################### 로그인 검증 ################### */
  useEffect(() => {
    if (checkLogin()) {
      setIsChecking(false);
    }
  }, []);

  /* ################### tag 추가 ################### */
  const addTagList = () => {
    const tagInputTag = document.getElementById('tourTag'); // useRef 수정하자
    const newTag = tagInputTag.value; // input란 데이터 수집
    tagInputTag.value = null; // input란 초기화

    if (newTag.length <= 0) {
      setErrorMsg({ item: 'tourTag', msg: '태그에 빈값은 넣을 수 없습니다.' });
      return;
    } else {
      if (errorMsg.item == 'tourTag') {
        setErrorMsg({ item: '', msg: '' });
      }
      let changeTag = [...formData.tag];
      changeTag.push(newTag);

      setFormData((prev) => {
        return { ...prev, tag: changeTag };
      });
    }
  };

  /* ################### tag 삭제 ################### */
  const deleteTag = (e) => {
    const getTagList = [...formData.tag];
    setFormData((prev) => {
      return {
        ...prev,
        tag: getTagList.filter((tag) => tag !== e.target.value),
      };
    });
  };

  /* ################### 우편번호, 도로명 주소 등록 ################### */
  const setState = (data1, data2) => {
    setFormData((prev) => {
      return {
        ...prev,
        postcode: data1,
        roadAddress: data2,
      };
    });
  };

  /* ################### fetch 함수 ################### */
  // 관광정보 제출 처리
  const handleSubmit = async (e) => {
    e.preventDefault();

    console.log('submit 시작!!!!!!!!!!!!!!!!!');

    const fd = new FormData(); // FormData 객체 생성
    // FormData에 vo 데이터 추가
    const result = BusinessCheck(
      fd,
      formData,
      facilityList,
      errorMsg,
      setErrorMsg
    );

    if (!result) {
      return;
    }

    // 첨부 된 이미지 파일 있으면 formData 추가
    if (imgList.length > 0) {
      // FormData에 imgList 파일 추가
      imgList.forEach((file, index) => {
        fd.append('imgList', file); // 같은 key(imgList)로 여러 파일 추가해야 하나의 List로 인식함
        fd.append('order[]', index);
      });
    } else {
      Toast2.fire({
        icon: 'error',
        title: '최소 1장의 이미지 파일을 등록해야 합니다.',
      });
      return false;
    }

    try {
      // 서버에 데이터 등록 요청
      await tourEnroll(fd);

      // 성공 알림
      await BlockAlert({
        icon: 'success',
        title: '관광정보가 등록되었습니다.',
        text: '',
      }).then((resp) => {
        if (resp.isConfirmed) {
          navi('/manager/tour/list');
        }
      });
    } catch (error) {
      Toast2.fire({
        icon: 'error',
        title: error.message,
      });
    }
  };

  /* ################### formData 처리 ################### */
  const { formData, handleInputChange, setFormData } = useFormData(initState);

  return isChecking ? (
    <div></div>
  ) : (
    <Layout>
      {/* ############################### 화면 메뉴명 Area start ############################### */}
      {/* <TitleWrap>
      </TitleWrap> */}
      <MenuTitle title={'관광지 등록'} />
      <ContentWrap>
        {/* ############################### 화면 메뉴명 Area end ############################### */}

        {/* ############################### 좌측 여백 start ############################### */}
        <div></div>
        {/* ############################### 좌측 여백 end ############################### */}

        {/* ############################### 데이터 입력 Area start ############################### */}

        <InputArea>
          <div>
            <LineWrap>
              {/* ##################### 관광지명 입력란 start ##################### */}
              <MuiTextField
                id={'name'}
                name={'name'}
                label={'관광지명'}
                type={'required'}
                variant={'filled'}
                color={'primary'}
                isFocused={true}
                isError={errorMsg.item == 'name'}
                helper={errorMsg.item == 'name' ? errorMsg.msg : null}
                handler={handleInputChange}
                sx={{
                  width: '100%',
                  mt: 2,
                  '.MuiInputBase-input': { fontSize: '1rem' },
                  '#tourName-label': {
                    fontSize: '1.1rem',
                    fontWeight: 'bold',
                  },
                }}
              />
              {/* ##################### 관광지명 입력란 end ##################### */}

              {/* ##################### 지역 선택 start ##################### */}
              <RegionSelect
                name={'regionNo'}
                size={''}
                color={'primary'}
                value={formData.regionNo}
                handler={handleInputChange}
                labelSx={{ fontSize: 16, mt: 2, ml: 3 }}
                SelectSx={{ width: 100, mt: 2, ml: 3 }}
              />
              {/* ##################### 지역 선택 end ##################### */}

              {/* ##################### 카테고리 선택 start ##################### */}
              <TourCategorySelect
                name={'categoryNo'}
                size={''}
                color={'primary'}
                value={formData.categoryNo}
                handler={handleInputChange}
                labelSx={{ fontSize: 16, mt: 2, ml: 3 }}
                SelectSx={{ width: 120, mt: 2, ml: 3 }}
              />
              {/* ##################### 카테고리 선택 end ##################### */}
            </LineWrap>
            <br />
            <LineWrap>
              {/* ##################### 대표 연락처 입력란 start ##################### */}
              <MuiTextField
                id={'phone'}
                name={'phone'}
                label={'연락처'}
                type={'required'}
                variant={'filled'}
                color={'primary'}
                isFocused={true}
                isError={errorMsg.item == 'phone'}
                helper={errorMsg.item == 'phone' ? errorMsg.msg : null}
                handler={handleInputChange}
                sx={{
                  width: '100%',
                  mt: 2,
                  '.MuiInputBase-input': { fontSize: '1rem' },
                  '#tourPhone-label': {
                    fontSize: '1.1rem',
                    fontWeight: 'bold',
                  },
                }}
              />
              {/* ##################### 대표 연락처 입력란 end ##################### */}

              {/* ##################### 가격 입력란 start ##################### */}
              <MuiTextField
                id={'price'}
                name={'price'}
                label={'인당 가격'}
                type={'required'}
                variant={'filled'}
                color={'primary'}
                isFocused={true}
                isError={errorMsg.item == 'price'}
                helper={errorMsg.item == 'price' ? errorMsg.msg : null}
                handler={handleInputChange}
                sx={{
                  width: '100%',
                  mt: 2,
                  ml: 3,
                  '.MuiInputBase-input': { fontSize: '1rem' },
                  '#tourPrice-label': {
                    fontSize: '1.1rem',
                    fontWeight: 'bold',
                  },
                }}
              />
              {/* ##################### 가격 입력란 end ##################### */}
            </LineWrap>
            <br />
            <SpaceBetween>
              {/* ##################### 사이트 주소 입력란 start ##################### */}
              <MuiTextField
                id={'linkPath'} // id 속성 값
                name={'linkPath'} // name 속성 값
                label={'URL'} // label 이름
                type={'required'} //
                variant={'filled'}
                color={'primary'}
                isFocused={true}
                isError={errorMsg.item == 'linkPath'}
                helper={errorMsg.item == 'linkPath' ? errorMsg.msg : null}
                handler={handleInputChange}
                sx={{
                  width: '150%',
                  mt: 2,
                  '.MuiInputBase-input': { fontSize: '1rem' },
                  '#tourLink-label': {
                    fontSize: '1.1rem',
                    fontWeight: 'bold',
                  },
                }}
              />
              {/* ##################### 사이트 주소 입력란 end ##################### */}
            </SpaceBetween>
            <br />
            <SpaceBetween>
              {/* ##################### 주소 검색 end ##################### */}
              <MuiAddress
                titleName={'주소'}
                state={formData}
                setState={setState}
                handler={handleInputChange}
              />
              {/* ##################### 주소 검색 end ##################### */}
            </SpaceBetween>
            <br />
            <SpaceBetween>
              {/* ##################### 이미지 추가 start ##################### */}
              <AddImgFiles
                state={imgList}
                fetch={setImgList}
                width={'100%'}
                height={'150px'}
              />
              {/* ##################### 이미지 추가 end ##################### */}
            </SpaceBetween>
          </div>

          <TagArea>
            <div>
              {/* ##################### 태그 입력 start ##################### */}
              <AlignCenter>
                <MuiTextField
                  id={'tourTag'}
                  name={'tag'}
                  label={'태그'}
                  type={formData.tag.length >= 5 ? 'disabled' : false}
                  variant={'standard'}
                  color={'primary'}
                  isFocused={true}
                  isError={errorMsg.item == 'tourTag'}
                  helper={
                    errorMsg.item == 'tourTag'
                      ? errorMsg.msg
                      : formData.tag.length >= 5
                      ? '태그 값은 최대 5개까지 입니다.'
                      : null
                  }
                  sx={{
                    width: 300,
                    mt: 2,
                    ml: 8,
                    mb: 3,
                    '.MuiInputBase-input': { fontSize: '1rem' },
                    '#tourTag-label': { fontSize: '1.1rem' },
                  }}
                />
                <Button sx={{ width: 10 }} onClick={addTagList} width={'500px'}>
                  +
                </Button>
              </AlignCenter>
              {/* ##################### 태그 입력 end ##################### */}
              {/* ##################### 태그 표시 start ##################### */}
              <Stack spacing={0.5}>
                {formData.tag.length != 0
                  ? formData.tag.map((data) => {
                      return (
                        <AlignCenter>
                          <Item
                            sx={{
                              ml: 2,
                              pb: 0.5,
                              pt: 0.5,
                              bgcolor: 'primary.light',
                              width: 400,
                            }}
                            key={data}
                          >
                            {'#' + data}
                          </Item>
                          <IconButton
                            // sx={{ p: 0 }}
                            value={data}
                            onClick={deleteTag}
                            variant="text"
                          >
                            <RemoveOutlinedIcon
                              style={{ pointerEvents: 'none' }}
                              fontSize="small"
                            />
                          </IconButton>
                        </AlignCenter>
                      );
                    })
                  : null}
              </Stack>
              {/* ##################### 태그 표시 end ##################### */}
            </div>

            <div>
              {/* ##################### 편의시설 선택 start ##################### */}
              <h3>편의 시설</h3>
              <FacilityCheckBox
                state={facilityList}
                handler={setFacilityList}
                groupSx={{ ml: 3, width: '100%' }}
              />
              {/* ##################### 편의시설 선택 end ##################### */}
            </div>
          </TagArea>

          <div>
            {/* ##################### 소개 입력란 start ##################### */}
            {/* <h3>상세 내용</h3> */}
            <Editor
              titleName={'상세 내용'}
              stateName={'detail'}
              w={500}
              h={500}
              state={formData.detail}
              handler={setFormData}
            />
            {/* ##################### 소개 입력란 end ##################### */}
            <br />
            {/* ##################### 제출  ##################### */}
          </div>
        </InputArea>
        {/* </Box> */}
        {/* ############################### 데이터 입력 Area end ############################### */}

        {/* ############################### 우측 여백 start ############################### */}
        <div></div>
        <div></div>
        <ButtonArea>
          <Button
            sx={{ fontSize: 20, height: '70%' }}
            // type="submit"
            type="button"
            color="primary"
            variant="contained"
            onClick={handleSubmit}
          >
            신규 등록
          </Button>
          {/* ##################### 제출  ##################### */}
        </ButtonArea>
        {/* ############################### 우측 여백 end ############################### */}
      </ContentWrap>
    </Layout>
  );
};

export default TourEnroll;
/* ################################## TourEnroll components ################################## */
