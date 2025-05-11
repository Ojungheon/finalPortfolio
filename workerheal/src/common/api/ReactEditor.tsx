import { useMemo, useState } from 'react';
import ReactQuill from 'react-quill-new';
import 'react-quill-new/dist/quill.snow.css';

import styled from 'styled-components';
import ReactModule from './ReactModule.tsx';
import React from 'react';

const CustomQuillEditorView = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 100px;

  #titleBar {
    width: 1120px;
    height: 50px;
    background-color: #f1f1f1;
    display: flex;
    align-items: center;
    justify-content: center;
    border: 2px solid black;
    font-size: 20px;
    font-weight: bold;
    color: #333;
    box-sizing: border-box;
    margin-bottom: 10px;
  }

  #toolBar {
    box-sizing: border-box;
    height: 40px;
    width: 1120px;
    border: 2px solid black;
    color: black;
    font-size: 32px;

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
    width: 1120px;
    height: 500px;
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

const ReactEditor = () => {
  const [content, setContent] = useState<string>('');
  const [title, setTitle] = useState<string>(''); // title 상태 추가

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
    'image',
    'color',
    'background',
    'align',
    'script',
    'code-block',
    'clean',
  ];

  const modules: {} = useMemo(
    () => ({
      toolbar: {
        container: '#toolBar',
      },
    }),
    []
  );

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(e.target.value);
  };

  return (
    <CustomQuillEditorView>
      <input
        type="text"
        id="titleBar"
        value={title}
        onChange={handleTitleChange}
      />
      <div id="toolBar">
        <ReactModule />
      </div>
      <ReactQuill
        theme="snow"
        modules={modules}
        formats={formats}
        id="quillContent"
        value={content}
        onChange={setContent}
      />
    </CustomQuillEditorView>
  );
};

export default ReactEditor;
