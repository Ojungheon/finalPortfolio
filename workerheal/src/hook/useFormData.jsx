import { useState } from 'react';

//
const useFormData = (initState) => {
  const [formData, setFormData] = useState(initState);

  // form tag 안의 데이터 변경 시 state에 반영하는 함수
  const handleInputChange = (e) => {
    setFormData((prev) => {
      return { ...prev, [e.target.name]: e.target.value };
    });
  };

  // state , handleInputChange, handleSubmit 가 담긴 객체 반환
  return {
    formData,
    handleInputChange,
    setFormData,
  };
};

export default useFormData;
