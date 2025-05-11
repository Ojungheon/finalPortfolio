import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { Button } from '@mui/material';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';

/* ################################## styled components start ################################## */
const CompWrap = styled.div`
  width: ${(props) => props.width};
  height: ${(props) => props.height};
`;

const PreviewContainer = styled.div`
  width: 100%;
  height: 100%;
  margin-top: 10px;
  background-color: #d5d5d5;
`;

const ImgContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(90px, 1fr));
  justify-items: space-between;
  align-items: center;
  gap: 15px;
  padding-left: 15px;
  padding-right: 15px;
  padding-bottom: 15px;
  margin-top: 10px;
  background-color: #d5d5d5;
`;

const ImgWrap = styled.div`
  position: relative;

  width: 90px;
  height: 90px;
`;

const PreviewImg = styled.img`
  width: 100%;
  height: 100%;
`;

const PreviewDeleteBtn = styled.button`
  position: absolute;
  right: 0;
  width: 20px;
  height: 20px;
  font-size: 10px;
  text-align: center;
  align-content: center;
  padding: 0;
`;

const SubContent = styled.div`
  width: 100%;
  margin-bottom: 0px;
  margin-left: 20px;
  padding-top: 8px;
  font-size: 13px;
`;

const VisuallyHiddenInput = styled('input')({
  clip: 'rect(0 0 0 0)',
  clipPath: 'inset(50%)',
  height: 1,
  overflow: 'hidden',
  position: 'absolute',
  bottom: 0,
  left: 0,
  whiteSpace: 'nowrap',
  width: 1,
});
/* ################################## styled components end ################################## */

const UpdateImgFiles = ({
  state,
  beforeList,
  deleteList,
  deleteFetch,
  fetch,
  width,
  height,
}) => {
  /* ################### state 선언 ################### */
  const [previewList, setPreviewList] = useState([]);

  /* ################### 첨부파일 및 preview 추가 ################### */
  const addImgFile = (e) => {
    const files = e.target.files;

    if (files.length === 0) return; // 파일 없으면 return

    const newImages = [...state];
    const newPreviews = [...previewList];

    for (const file of files) {
      newImages.push(file);
      // newPreviews.push(URL.createObjectURL(file));
      newPreviews.push({ no: 'x', path: URL.createObjectURL(file) });
    }

    setPreviewList(newPreviews); // 프리뷰 파일 저장
    fetch(newImages); // 이미지 파일 저장
  };

  /* ################### 첨부파일 및 preview 삭제 ################### */
  const handleDeletePreview = (e) => {
    const index = e.target.getAttribute('index');

    const newImages = [...state];
    const newPreviews = [...previewList];

    console.log('avvv :; ', newPreviews[index]);
    const target = newPreviews[index];
    if (target.no != 'x') {
      deleteFetch((prev) => {
        {
          return [...prev, target.no];
        }
      });
    } else {
      newImages.splice(index, 1);
      fetch(newImages);
    }
    newPreviews.splice(index, 1);
    setPreviewList(newPreviews);
    console.log(deleteList);
  };

  useEffect(() => {
    setPreviewList(beforeList);
  }, [beforeList]);

  return (
    <CompWrap width={width} height={height}>
      <Button
        component="label"
        role={undefined}
        variant="contained"
        size="small"
        tabIndex={-1}
        startIcon={<CloudUploadIcon />}
      >
        이미지 추가
        <VisuallyHiddenInput type="file" onChange={addImgFile} multiple />
      </Button>
      <PreviewContainer>
        <SubContent className="subTitle">
          * 사진은 최대 10장까지 첨부할 수 있습니다.
        </SubContent>
        <ImgContainer>
          {previewList.map((preview, index = 0) => {
            return (
              <ImgWrap key={preview.no}>
                <PreviewDeleteBtn onClick={handleDeletePreview} index={index++}>
                  X
                </PreviewDeleteBtn>

                <PreviewImg src={preview.path}></PreviewImg>
              </ImgWrap>
            );
          })}
        </ImgContainer>
      </PreviewContainer>
    </CompWrap>
  );
};

export default UpdateImgFiles;
