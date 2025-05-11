import React, { useState } from "react";
import { Toast,Alert } from "../../utils/toast";
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
  grid-template-columns: 1fr 1fr; /* 왼쪽(제목 & 별점) 1칸, 오른쪽(리뷰 & 이미지 업로드) 3칸 */
  grid-template-rows: 1fr 1fr; /* 첫 번째 줄: 리뷰 & 파일 업로드, 두 번째 줄: 입력칸 & 버튼 */
  gap: 15px;
  align-items: start;
  grid-template-areas:
    "left right"
    "bottom bottom"; /* 아래 칸을 하나로 합침 */
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
  cursor: pointer;
  color: ${({ active }) => (active ? "#FFD700" : "#ccc")};
`;

const TextArea = styled.textarea`
  width: 97%;
  height: 170px;
  border: 1px solid #ddd;
  border-radius: 5px;
  resize: none;
  padding: 10px;
`;

const FileUploadContainer = styled.div`
  width: 150px;
  height: 150px;
  border: ${({ hasFile }) => (hasFile ? "none" : "2px dashed #ddd")}; /* 파일 있으면 border 제거 */
  display: flex;
  justify-content: center;
  align-items: center;
  background: #f9f9f9;
  cursor: pointer;
  margin-top: 10px;
  position: relative;
`;

const ImagePreview = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 5px;
`;
const RemoveButton = styled.button`
  position: absolute;
  top: -5px;
  right: -5px;
  background: red;
  color: white;
  border: none;
  border-radius: 50%;
  width: 20px;
  height: 20px;
  font-size: 14px;
  font-weight: bold;
  cursor: pointer;
  display: flex;
  justify-content: center;
  align-items: center;

  &:hover {
    background: darkred;
  }
`;
const HiddenFileInput = styled.input`
  display: none;
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
  background: ${({ color }) => color || "#007BFF"};

  &:hover {
    opacity: 0.8;
  }
`;

const ReviewModal = ({ onClose, onSubmit }) => {
  const [score, setScore] = useState(0);
  const [content, setContent] = useState("");
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleImageClick = () => {
    document.getElementById("fileInput").click();
  };
  const handleRemoveImage = (e) => {
    e.stopPropagation(); // 부모 div 클릭 방지
    setImageFile(null);
    setImagePreview(null);
  };
  const handleSubmit = () => {
    if (!score || !content.trim()) {
      Alert({
        title: "예약 취소 실패",
        text: "별점, 리뷰내용, 사진첨부 확인필요!",
        icon: "error",
      });      
      return;
    }

    const formData = new FormData();
    formData.append("score", score);
    formData.append("content", content);
    if (imageFile) {
      formData.append("image", imageFile);
    }

    onSubmit(formData);
  };

  return (
    <Overlay>
      <ModalContent>
        {/* 왼쪽 - 리뷰 제목 & 별점 */}
        <LeftSection>
          <h2>리뷰 작성</h2>
          <StarContainer>
            {[1, 2, 3, 4, 5].map((star) => (
              <Star
                key={star}
                active={star <= score}
                onClick={() => setScore(star)}
              >
                ★
              </Star>
            ))}
          </StarContainer>
        </LeftSection>

        {/* 오른쪽 - 파일 업로드 */}
        <RightSection>
          <FileUploadContainer hasFile={!!imagePreview} onClick={handleImageClick}>
            {imagePreview ? (
              <>
                <ImagePreview src={imagePreview} alt="이미지 미리보기" />
                <RemoveButton onClick={handleRemoveImage}>✕</RemoveButton>
              </>
            ) : (
              <span>사진 추가</span>
            )}
            <HiddenFileInput
              id="fileInput"
              type="file"
              accept="image/*"
              onChange={handleFileChange}
            />
          </FileUploadContainer>
        </RightSection>

        {/* 아래 - 텍스트 입력 & 버튼 */}
        <BottomSection>
          <TextArea
            placeholder="리뷰 내용을 입력하세요..."
            value={content}
            onChange={(e) => setContent(e.target.value)}
          />
          <ButtonGroup>
            <Button color="#FF6B6B" onClick={onClose}>취소</Button>
            <Button color="#4CAF50" onClick={handleSubmit}>등록</Button>
          </ButtonGroup>
        </BottomSection>
      </ModalContent>
    </Overlay>
  );
};

export default ReviewModal;
