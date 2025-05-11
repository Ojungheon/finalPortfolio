import React from 'react';
import Button1 from '../Button1';
import styled from 'styled-components';
import ButtonS from '../ButtonS';

const ButtonDiv = styled.div`
  display: flex;
  justify-content: space-between;
  max-width: 1800px;
  margin: 0 auto;
`;

const ActionButtons = ({
  firstText,
  secondText,
  onFirstButtonClick,
  onSecondButtonClick,
}) => {
  return (
    <ButtonDiv>
      <ButtonS onClick={onFirstButtonClick}>{firstText}</ButtonS>
      {secondText && (
        <ButtonS onClick={onSecondButtonClick}>{secondText}</ButtonS>
      )}
    </ButtonDiv>
  );
};

export default ActionButtons;
