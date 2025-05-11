import React from 'react';
import styled from 'styled-components';

// 모달 창 바깥 영역
const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.6);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
`;

// 모달 영역
const ModalContent = styled.div`
  background: white;
  width: 80%;
  max-width: 900px;
  padding: 20px;
  border-radius: 10px;
  margin-top: 100px;
  max-height: 80vh;
  overflow-y: auto;
  position: relative;

  &::-webkit-scrollbar {
    display: none;
  }
`;

const CloseButton = styled.button`
  position: absolute;
  top: 10px;
  right: 10px;
  background: none;
  border: none;
  font-size: 20px;
  cursor: pointer;
`;

const ImageGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
  gap: 10px;
  padding-top: 20px;

  img {
    width: 100%;
    height: 150px;
    object-fit: cover;
    border-radius: 5px;
    cursor: pointer;
  }
`;

// 후기에 등록된 이미지를 배열로 받아옴 , 모달을 닫는 함수
// 이미지를 배열로 받아오고 map을 이용해서 여러 이미지를 출력해줌
const ImageModal = ({ images = [], onClose }) => {
  return (
    // 모달창 밖의 영역 클릭 시 모달 닫힘
    <ModalOverlay onClick={onClose}>
      {/* 모달 content를 클릭해도 모달이 닫히지 않도록 이벤트 전파를 차단한다. */}
      <ModalContent onClick={(e) => e.stopPropagation()}>
        {/* 모달 창 닫는 버튼 */}
        <CloseButton onClick={onClose}>✖</CloseButton>
        <h2>모든 후기 사진</h2>
        <ImageGrid>
          {images.map((img, index) => (
            <img key={index} src={img} alt={`숙소 이미지 ${index + 1}`} />
          ))}
        </ImageGrid>
      </ModalContent>
    </ModalOverlay>
  );
};

export default ImageModal;
