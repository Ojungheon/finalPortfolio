import React from 'react';
import styled from 'styled-components';

const ReadOnlyTextarea = styled.textarea`
  width: 90%;
  height: 600px;
  margin-top: 20px;
  background-color: #f9f9f9;
  border: 1px solid #ccc;
  font-size: 20px;
  padding: 10px;

  &::placeholder {
    font-size: 20px;
    padding: 10px;
  }
`;

const ReadOnlyDetailsInput = ({ detailData }) => {
  const { lodgingInfo } = detailData;

  return <ReadOnlyTextarea value={lodgingInfo?.detail || ''} readOnly />;
};

export default ReadOnlyDetailsInput;
