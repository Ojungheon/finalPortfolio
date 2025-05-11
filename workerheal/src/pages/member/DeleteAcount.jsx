import React, { useState } from 'react';
import styled from 'styled-components';
import NoticeModal from '../../common/components/user/NoticeModal';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { resetMemberState } from '../../redux/MemberSlice';
import { Toast, Alert } from '../../utils/toast';
import { useSelector } from 'react-redux';

const API_SERVER = process.env.REACT_APP_SERVER_ROOT;

// ✅ 페이지 컨테이너
const Container = styled.div`
  max-width: 600px;
  margin: 50px auto;
  padding: 30px;
  font-family: 'Arial', sans-serif;
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

// ✅ 안내 문구 스타일
const NoticeText = styled.p`
  font-size: 16px;
  color: ${(props) => props.color || '#333'};
  line-height: 1.5;
  font-weight: ${(props) => (props.bold ? 'bold' : 'normal')};
`;

// ✅ 포인트 & 코인 컨테이너
const BalanceContainer = styled.div`
  background: #f8f8f8;
  padding: 15px;
  border-radius: 5px;
  display: flex;
  justify-content: space-between;
  font-size: 16px;
  font-weight: bold;
`;

// ✅ 포인트 & 코인 스타일
const BalanceLabel = styled.span`
  color: #333;
`;
const BalanceValue = styled.span`
  color: #555;
`;

// ✅ 체크박스 컨테이너
const CheckboxContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 14px;
  color: #333;
`;

// ✅ 체크박스 스타일
const Checkbox = styled.input`
  width: 18px;
  height: 18px;
  cursor: pointer;
`;

// ✅ 회원 탈퇴 버튼 스타일
const DeleteButton = styled.button`
  width: 600px;
  background: ${(props) => (props.disabled ? '#ccc' : 'orange')};
  color: ${(props) => (props.disabled ? '#666' : 'white')};
  cursor: ${(props) => (props.disabled ? 'not-allowed' : 'pointer')};
  font-weight: bold;
  font-size: 16px;
  padding: 12px;
  border: none;
  border-radius: 5px;
  margin-top: 15px;
`;

const DeleteAccount = () => {
  const [isChecked, setIsChecked] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const member = useSelector((state) => state.member.member);

  // ✅ 사용자 정보 (백엔드 연동 예정)
  const userData = {
    points: 0, // 보유 포인트
    reservations: 0, // 예약된 상품 개수
    del_Yn: 'N', // 탈퇴 여부
  };

  // ✅ 체크박스 핸들러
  const handleCheckboxChange = () => setIsChecked(!isChecked);

  // ✅ 회원 탈퇴 확인 모달 열기
  const handleDeleteConfirm = () => setIsModalOpen(true);

  // ✅ 회원 탈퇴 요청
  const handleDeleteAccount = async () => {
    try {
      const token = sessionStorage.getItem('token');
      if (!token) {
        Alert({
          icon: 'warning',
          title: '토큰 만료',
          text: '로그인 페이지로 이동합니다',
        }).then((result) => {
          if (result.isConfirmed) {
            navigate('/member/login');
          }
        });
        return;
      }

      const response = await fetch(
        `http://${API_SERVER}/api/member/deleteAccount`,
        {
          method: 'PUT',
          headers: {
            token: sessionStorage.getItem('token'),
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ userId: member.id }), // ✅ `body`에 JSON 데이터 포함
        }
      );

      const result = await response.text();
      if (response.ok) {
        dispatch(resetMemberState()); // Redux 상태 초기화
        Alert({
          icon: 'success',
          title: '회원탈퇴 성공',
          text: '메인페이지로 이동합니다.',
        }).then((result) => {
          if (result.isConfirmed) {
            navigate('/member/login');
          }
        });
      } else {
        Toast.fire({
          icon: 'error',
          title: '회원탈퇴 오류',
        });
      }
    } catch (error) {
      Toast.fire({
        icon: 'error',
        title: '회원탈퇴 실패:( 잠시후 이용해주세요',
      });
    }
  };

  return (
    <Container>
      {/* ✅ 안내 문구 */}
      <h1 font-weight="bold">주의!</h1>
      <NoticeText>
        1. 현재 사용 중인 계정 정보가 삭제되면 복구할 수 없습니다.
      </NoticeText>
      <NoticeText>2. 작성하신 리뷰 내역은 유지됩니다.</NoticeText>
      <NoticeText>3. 보유 중인 모든 혜택(포인트)이 소멸됩니다.</NoticeText>

      {/* ✅ 보유 포인트 표시 */}
      <BalanceContainer>
        <BalanceLabel>잔여 WorkerHeal 포인트</BalanceLabel>
        <BalanceValue>{member ? `${member.points} P` : '0 P'}</BalanceValue>
      </BalanceContainer>

      {/* ✅ 예약된 상품 안내 */}
      {userData.reservations > 0 ? (
        <NoticeText color="red" bold>
          {userData.reservations}건의 예정된 상품이 존재합니다.
          <br />
          환불 혹은 사용 후 회원탈퇴가 가능합니다.
        </NoticeText>
      ) : (
        <NoticeText color="red" bold>
          * 탈퇴 후 로그인이 제한됩니다. 이점 유의 바랍니다.
        </NoticeText>
      )}

      {/* ✅ 탈퇴 동의 체크박스 */}
      <CheckboxContainer>
        <Checkbox
          type="checkbox"
          checked={isChecked}
          onChange={handleCheckboxChange}
          disabled={userData.reservations > 0}
        />
        위 내용을 확인하였으며 동의합니다.
      </CheckboxContainer>

      {/* ✅ 회원 탈퇴 버튼 (조건부 활성화) */}
      <DeleteButton
        disabled={!isChecked || userData.reservations > 0}
        onClick={handleDeleteConfirm}
      >
        회원 탈퇴
      </DeleteButton>

      {/* ✅ 탈퇴 확인 모달 */}
      {isModalOpen && (
        <NoticeModal
          title="회원 탈퇴 확인"
          message="정말로 회원 탈퇴를 진행하시겠습니까?"
          onClose={() => setIsModalOpen(false)}
          onConfirm={handleDeleteAccount}
        />
      )}
    </Container>
  );
};

export default DeleteAccount;
