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

const ROofficeDetailsInput = ({ detailData }) => {
  const { officeInfo } = detailData;

  return <ReadOnlyTextarea value={officeInfo?.detail || ''} readOnly />;
};

export default ROofficeDetailsInput;
