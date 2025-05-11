import { useState } from "react";

// 📌 폼 데이터를 관리하는 커스텀 훅
const useFormData = (initState, submitCallback) => {
  // 🛠️ 상태(state) 관리: 입력된 폼 데이터를 저장
  const [formData, setFormData] = useState(initState);

  // 🛠️ 입력 필드 값이 변경될 때 실행되는 함수
  const handleInputChange = (e) => {
    setFormData((prev) => ({
      ...prev, // 기존 폼 데이터 유지
      [e.target.name]: e.target.value, // 새로운 입력 값 업데이트
    }));
  };

  // 🛠️ 폼 제출 시 실행되는 함수
  const handleSubmit = (e) => {
    e.preventDefault(); // 기본 폼 제출 이벤트 방지
    submitCallback(formData); // 부모 컴포넌트에서 넘겨받은 함수 실행 (API 요청 등)
    
  };

  // 🔄 위에서 만든 상태와 함수들을 반환
  return { formData, handleInputChange, handleSubmit };
};

export { useFormData };
