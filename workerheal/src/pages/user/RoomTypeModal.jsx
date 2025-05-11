import React from 'react';
import styled from 'styled-components';
import ImageSlider from './ImageSlider';

const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.6);
  justify-content: center;
  align-items: center;
  z-index: 1000;

  /* 기본적으로 숨김 */
  display: none;

  /* modal-active 클래스가 추가되면 표시 */
  &.modal-active {
    display: flex;
  }
`;

const ModalContent = styled.div`
  background: white;
  width: 80%;
  max-width: 900px;
  padding: 20px;
  margin-top: 60px;
  border-radius: 10px;
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

const Title = styled.div`
  font-size: 25px;
  font-weight: bold;
  text-align: center;
`;

const TypeName = styled.div`
  display: flex;
  margin: 15px;
  font-size: 22px;
  font-weight: bold;
`;

const Price = styled.div`
  display: flex;
  justify-content: end;
  margin-right: 15px;
  font-size: 20px;
  font-weight: bold;
`;

const AmenitieTitle = styled.div`
  display: flex;
  margin: 15px;
  font-size: 15px;
  font-weight: bold;
`;

const AmenitieType = styled.div`
  display: flex;
  margin: 15px;
  color: gray;
`;

const RoomTypeModal = ({
  onClose,
  typeName,
  price,
  amenities,
  isOpen,
  images,
}) => {
  let pathList = [];
  if (images != null) {
    for (let i = 0; i < images.length; i++) {
      pathList.push(images[i].path);
    }
  }
  return (
    <ModalOverlay className={isOpen ? 'modal-active' : ''} onClick={onClose}>
      <ModalContent onClick={(e) => e.stopPropagation()}>
        <CloseButton onClick={onClose}>✖</CloseButton>
        <Title>객실 상세</Title>
        <ImageSlider images={pathList} />
        <TypeName>{typeName}</TypeName>
        <Price>{price}원</Price>
        <AmenitieTitle>시설/서비스</AmenitieTitle>
        <AmenitieType>
          {/* {amenities 태훈 수정 */}
          {amenities == null ? '' : amenities.join(' , ')}
        </AmenitieType>
      </ModalContent>
    </ModalOverlay>
  );
};
export default RoomTypeModal;
