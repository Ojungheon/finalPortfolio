import React, { useState } from "react";
import styled from "styled-components";

const Overlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
`;

const ModalContent = styled.div`
  background: white;
  padding: 20px;
  height: 430px;
  width: 700px;
  border-radius: 5px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2);
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-template-rows: 1fr 1fr;
  gap: 15px;
  align-items: start;
  grid-template-areas:
    "left right"
    "bottom bottom";
`;

const LeftSection = styled.div`
  grid-area: left;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  margin-left: 20px;
`;

const RightSection = styled.div`
  grid-area: right;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const BottomSection = styled.div`
  grid-area: bottom;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 10px;
`;

const StarContainer = styled.div`
  display: flex;
  margin-top: 10px;
`;

const Star = styled.span`
  font-size: 36px;
  color: ${({ active }) => (active ? "#FFD700" : "#ccc")};
`;

const ReviewText = styled.div`
  width: 97%;
  height: 170px;
  border: 1px solid #ddd;
  border-radius: 5px;
  background: #f5f5f5;
  overflow-y: auto;
  text-align: left;
  white-space: pre-wrap;
  padding: 10px;
`;

const FileUploadContainer = styled.div`
  width: 150px;
  height: 150px;
  border: ${({ hasFile }) => (hasFile ? "none" : "2px dashed #ddd")};
  display: flex;
  justify-content: center;
  align-items: center;
  background: #f9f9f9;
  cursor: pointer;
  margin-top: 10px;
  position: relative;
`;
// 🔹 모달 스타일 추가
const ImageModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.8);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 2100;
`;
const ImageModalContent = styled.div`
  position: relative;
  max-width: 80%;
  max-height: 80%;
`;
const ImagePreview = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 5px;
`;

const ButtonGroup = styled.div`
  display: flex;
  justify-content: flex-end;
  margin-top: 10px;
  width: 100%;
  gap: 10px;
`;

const Button = styled.button`
  padding: 8px 12px;
  border: none;
  cursor: pointer;
  border-radius: 5px;
  font-weight: bold;
  color: white;
  background: #FF6B6B;

  &:hover {
    opacity: 0.8;
  }
`;

const LargeImage = styled.img`
  width: 100%;
  height: auto;
  max-height: 90vh;
  border-radius: 10px;
`;

// 닫기 버튼 스타일
const CloseButton = styled.button`
  position: absolute;
  top: -10px;
  right: -10px;
  background: red;
  color: white;
  border: none;
  border-radius: 50%;
  width: 30px;
  height: 30px;
  font-size: 18px;
  font-weight: bold;
  cursor: pointer;
  display: flex;
  justify-content: center;
  align-items: center;

  &:hover {
    background: darkred;
  }
`;

const ReviewConfirmModal = ({ reviewData, onClose }) => {
  const [isImageModalOpen, setIsImageModalOpen] = useState(false);

  return (
    <>
    <Overlay>
      <ModalContent>
        {/* 왼쪽 - 리뷰 별점 */}
        <LeftSection>
          <h2>리뷰 확인</h2>
          <StarContainer>
            {[1, 2, 3, 4, 5].map((star) => (
              <Star key={star} active={star <= (reviewData?.score || 0)}>
                ★
              </Star>
            ))}
          </StarContainer>
        </LeftSection>

        {/* 오른쪽 - 이미지 미리보기 */}
        <RightSection>
          <FileUploadContainer hasFile={!!reviewData?.path}>
            {reviewData?.path ? (
              <ImagePreview
                src={reviewData.path}
                alt="리뷰 이미지"
                onClick={() => setIsImageModalOpen(true)} // 🔹 클릭 시 모달 열기
               />
            ) : (
              <span>첨부된 이미지 없음</span>
            )}
          </FileUploadContainer>
        </RightSection>

        {/* 아래 - 리뷰 내용 */}
        <BottomSection>
          <ReviewText>{reviewData?.content || "내용이 없습니다."}</ReviewText>
          <ButtonGroup>
            <Button onClick={onClose}>닫기</Button>
          </ButtonGroup>
        </BottomSection>
      </ModalContent>
    </Overlay>
    {/* 이미지 확대 모달 */}
      {isImageModalOpen && (
        <ImageModalOverlay onClick={() => setIsImageModalOpen(false)}>
          <ImageModalContent>
            <CloseButton onClick={() => setIsImageModalOpen(false)}>✕</CloseButton>
            <LargeImage src={reviewData?.path} alt="확대된 리뷰 이미지" />
          </ImageModalContent>
        </ImageModalOverlay>
      )}
    </>
  );
};

export default ReviewConfirmModal;
