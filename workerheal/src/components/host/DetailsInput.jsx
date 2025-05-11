import React from 'react';
import styled from 'styled-components';

const Textarea = styled.textarea`
  width: 100%;
  height: 600px;
  margin-top: 20px;

  &::placeholder {
    font-size: 20px;
    padding: 10px;
  }
`;

const DetailsInput = ({ formData, updateField }) => {
  return (
    <Textarea
      placeholder="세부내용을 입력하세요."
      value={formData.detail || ''}
      onChange={(e) => updateField('detail', e.target.value)}
    />
  );
};

export default DetailsInput;
