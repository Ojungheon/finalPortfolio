import styled, { keyframes } from 'styled-components';

// 🔹 왼쪽 버튼 애니메이션
const moveUpLeft = keyframes`
  0% {
    transform: translate(0%, -330%);
  }
  50% {
    transform: translate(5%, -330%);
  }
  100% {
    transform: translate(0%, -330%);
  }
`;

// 🔹 오른쪽 버튼 애니메이션
const moveUpRight = keyframes`
  0% {
    transform: translate(0%, -330%);
  }
  50% {
    transform: translate(-5%, -330%);
  }
  100% {
    transform: translate(0%, -330%);
  }
`;

const Button = styled.div`
  position: absolute;
  z-index: 10;
  color: white;
  font-size: 40px;
  padding: 10px;
  border: none;
  cursor: pointer;
  transform: translateY(-390%);
  border-radius: 5px;
  display: flex;
  margin-top: 55px;
  align-items: center;
  justify-content: center;
`;

// 왼쪽 버튼 스타일
const LeftButton = styled(Button)`
  left: 20px;
  animation: ${moveUpLeft} 1s ease-in-out infinite;
`;

// 오른쪽 버튼 스타일
const RightButton = styled(Button)`
  right: 20px;
  animation: ${moveUpRight} 1s ease-in-out infinite;
`;

export { LeftButton, RightButton };
