import React from 'react';
import { useMemo } from 'react';
import styled from 'styled-components';
import ReactQuill from 'react-quill-new';
import ReactModule from './ReactModule.tsx';
import 'react-quill-new/dist/quill.snow.css';

/* ################################## styled components start ################################## */
const CustomQuillEditorView = styled.div<{ w: number; h: number }>`
  display: flex;
  flex-direction: column;
  align-items: center;
  /* margin-top: 100px; */

  #toolBar {
    box-sizing: border-box;
    /* height: 40px; */
    /* width: 1120px; */
    width: ${(props) => props.w}px;
    border: 2px solid black;
    color: black;
    font-size: 32px;
    margin-top: 10px;

    .ql-formats {
      display: inline-block;
      position: relative;
      top: -10px;

      .image-btn {
        font-size: 18px;
        cursor: pointer;

        .icon-custom {
          margin-right: 5px;
          font-size: 24px;
        }
      }
    }
  }

  #quillContent {
    border: 2px solid black;
    background-color: white;
    /* width: 1120px; */
    width: ${(props) => props.w}px;
    /* height: 500px; */
    height: ${(props) => props.h}px;

    display: flex;
    justify-content: center;
    box-sizing: border-box;

    .ql-container {
      box-sizing: border-box;
      height: 100%;
      width: 100%;
      border: none;

      .ql-editor {
        &::-webkit-scrollbar {
          width: 5px;
        }

        &::-webkit-scrollbar-thumb {
          background: gray; /* 스크롤바의 색상 */
          border-radius: 15px;
        }

        &::-webkit-scrollbar-track {
          background: rgba(200, 200, 200, 0.1);
        }
      }
    }
  }
`;

const TitleH3 = styled.h3`
  display: block;
  width: 100%;
  margin: 0;
`;
/* ################################## styled components end ################################## */

/* ################################## editor components start ################################## */
const Editor = ({ state, stateName, titleName, handler, w, h }) => {
  /* ################### format 생성 ################### */
  const formats: string[] = [
    'header',
    'size',
    'font',
    'bold',
    'italic',
    'underline',
    'strike',
    'blockquote',
    'list',
    'bullet',
    'indent',
    'link',
    // 'image',
    'color',
    'background',
    'align',
    'script',
    'code-block',
    'clean',
  ];

  /* ################### toolbar 생성 ################### */
  const modules: {} = useMemo(
    () => ({
      toolbar: {
        container: '#toolBar',
      },
    }),
    []
  );

  /* ################### state 변경 내용 반영 ################### */
  const setState = (e) => {
    handler((prev) => {
      return { ...prev, [stateName]: e };
    });
  };

  return (
    <CustomQuillEditorView w={w} h={h}>
      {/* ################### 제목 영역 start ################### */}
      <TitleH3>{titleName}</TitleH3>
      {/* ################### 제목 영역 end ################### */}

      {/* ################### toolbar 영역 start ################### */}
      <div id="toolBar">
        <ReactModule />
      </div>
      {/* ################### toolbar 영역 start ################### */}

      {/* ################### 내용 입력 영역 start ################### */}
      <ReactQuill
        theme="snow"
        modules={modules}
        formats={formats}
        id="quillContent"
        value={state}
        onChange={setState}
      />
      {/* ################### 내용 입력 영역 end ################### */}
    </CustomQuillEditorView>
  );
};
/* ################################## editor components end ################################## */

export default Editor;
