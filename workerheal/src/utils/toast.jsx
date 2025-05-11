import Swal from 'sweetalert2';
import './toast.css'; // ✅ CSS 파일 import

// ✅ Toast 알림 (작은 팝업)
export const Toast = Swal.mixin({
  toast: true,
  position: 'bottom-left',
  showConfirmButton: false,
  timer: 1500,
  timerProgressBar: true,
  customClass: {
    popup: 'my-toast',
    title: 'my-toast-title',
    confirmButton: 'my-toast-button', // ✅ 버튼 클래스 추가
  },
});

// ✅ 일반 Alert (버튼 있는 알림)
export const Alert = (options) => {
  return Swal.fire({
    confirmButtonText: '확인', // 기본 확인 버튼 텍스트
    customClass: {
      popup: 'my-alert',
      title: 'my-alert-title',
      confirmButton: 'my-alert-button', // ✅ 버튼 스타일 추가
    },
    ...options, // 추가 옵션 (유동적으로 설정 가능)
  });
};

// ✅ 체크 Alert (확인, 취소 버튼 있는 알림) - 태훈
export const Check = (options) => {
  return Swal.fire({
    showCancelButton: true,
    confirmButtonText: '예',
    cancelButtonText: '아니오',
    allowOutsideClick: false, // ✅ 바깥 클릭으로 닫히지 않음
    allowEscapeKey: false, // ✅ ESC 키로 닫히지 않음
    allowEnterKey: false, // ✅ 엔터 키로 닫히지 않음
    customClass: {
      popup: 'my-alert',
      title: 'my-alert-title',
      confirmButton: 'my-check-button', // ✅ 버튼 스타일 추가
    },
    ...options, // 추가 옵션 (유동적으로 설정 가능)
  });
};

// ✅ 알림창 외 클릭 막은 Alert (버튼 있는 알림)
export const BlockAlert = (options) => {
  return Swal.fire({
    confirmButtonText: '확인', // 기본 확인 버튼 텍스트
    allowOutsideClick: false, // ✅ 바깥 클릭으로 닫히지 않음
    allowEscapeKey: false, // ✅ ESC 키로 닫히지 않음
    allowEnterKey: false, // ✅ 엔터 키로 닫히지 않음
    customClass: {
      popup: 'my-alert',
      title: 'my-alert-title',
      confirmButton: 'my-alert-button', // ✅ 버튼 스타일 추가
    },
    ...options, // 추가 옵션 (유동적으로 설정 가능)
  });
};

// ✅ Toast 알림 (작은 팝업)
export const Toast2 = Swal.mixin({
  toast: true,
  position: 'bottom',
  showConfirmButton: false,
  timer: 2500,
  timerProgressBar: true,
  customClass: {
    popup: 'my-toast',
    title: 'my-toast-title',
    confirmButton: 'my-toast-button', // ✅ 버튼 클래스 추가
  },
});
