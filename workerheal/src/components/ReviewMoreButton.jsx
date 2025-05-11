import React from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';

const Layout = styled.div`
  display: flex;
  justify-content: flex-end;
  margin-bottom: 20px;
`;

const MoreBtn = styled.button`
  font-size: 15px;
  color: gray;
  font-weight: bold;
  border: none;
  background-color: white;
`;

const ReviewMoreButton = ({ path, label }) => {
  const navigate = useNavigate();

  return (
    <Layout>
      <MoreBtn
        onClick={() => {
          navigate(path);
        }}
      >
        {label}
      </MoreBtn>
    </Layout>
  );
};

export default ReviewMoreButton;
