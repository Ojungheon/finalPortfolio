import React from "react";
import styled from "styled-components";
import { Link, Route } from "react-router-dom";
import Button1 from "../../components/Button1";
import { useSelector } from "react-redux";
import { useEffect } from "react";

const API_SERVER = process.env.REACT_APP_SERVER_ROOT;

//전체 컨테이너 (너비 조정)
const Container = styled.div`
  max-width: 500px;
  margin: 50px auto;
  padding: 30px;
  font-family: "Arial", sans-serif;
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

//회원 정보 스타일
const UserInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: 25px;
`;

//라벨 스타일
const Label = styled.span`
  font-weight: bold;
  color: #333;
  width: 150px;
`;

//값 스타일 (우측 여백 추가)
const Value = styled.span`
  color: #555;
  flex-grow: 1;
  margin-right: 20px;
`;

//정보 줄 스타일
const InfoRow = styled.div`
  display: flex;
  align-items: center;
  font-size: 20px;
`;

//포인트 및 회원탈퇴 스타일
const Point = styled.div`
  font-weight: bold;
  color: #2f80ed;
  text-decoration: none;
  font-size: 18px;
`;

const DeleteAccount = styled(Link)`
  font-weight: bold;
  color: red;
  text-decoration: none;
  font-size: 18px;
`;

//버튼 컨테이너 (버튼 중앙 정렬)
const ButtonContainer = styled.div`
  display: flex;
  justify-content: center;
  gap: 20px;
  margin-top: 20px;
`;

//버튼 스타일
const StyledButton = styled(Link)`
  padding: 10px 20px;
  font-size: 18px;
  font-weight: bold;
  text-decoration: none;
  border-radius: 5px;
  text-align: center;
  width: 200px;
  display: inline-block;
  transition: all 0.3s ease-in-out;

  &:hover {
    opacity: 0.8;
  }
`;

const EditButton = styled(StyledButton)`
  background-color: #2f80ed;
  color: white;
`;

const PasswordButton = styled(StyledButton)`
  background-color: #ffa500;
  color: white;
`;

const Divider = styled.hr`
  border: none;
  height: 1px;
  background-color: #e0a96d;
  margin: 20px 0;
`;

// jobNo를 직무명으로 변환하는 함수
const getJobName = (jobNo) => {
  const jobMap = {
    1: "IT",
    2: "경영",
    3: "의료",
    4: "사무",
    5: "건설",
    6: "교육",
    7: "디자인",
    8: "금융",
    9: "법률",
    10: "문화",
    11: "서비스",
    12: "유통",
    13: "생산",
    14: "스포츠",
    15: "공공",
    16: "기타"
  };

  return jobMap[jobNo] || "미정"; // jobNo가 없거나 정의되지 않은 경우 "미정" 출력
};


const Mypage = () => {
const member = useSelector((state) => state.member.member); // Redux에서 회원 정보 가져오기



useEffect(() => {
  console.log("Redux에서 가져온 회원 정보:", member); // ✅ Redux에서 가져온 값 확인
}, [member]); // member 값이 변경될 때 실행

if (!member) {
  return <div>로그인이 필요합니다.</div>;
}

  return (
    <Container>
      {/*타이틀*/}
      <h2 style={{ fontSize: "24px", fontWeight: "bold" }}>나의 정보</h2>

      <UserInfo>
        <InfoRow>
          <Label>이름:</Label>
          <Value>{member.name}</Value>
        </InfoRow>

        <InfoRow>
          <Label>닉네임:</Label>
          <Value>{member.nick}</Value>
        </InfoRow>

        <InfoRow>
          <Label>이메일:</Label>
          <Value>{member.id}</Value>
        </InfoRow>

        <InfoRow>
          <Label>연락처:</Label>
          <Value>{member.phone}</Value>
        </InfoRow>

        <InfoRow>
          <Label>직무:</Label>
          <Value>{getJobName(member.jobNo)}</Value>
        </InfoRow>

        <InfoRow>
          <Label>회사:</Label>
          <Value>{member.company || "미입력"}</Value>
        </InfoRow>
      </UserInfo>

      {/*개인정보 수정 & 비밀번호 변경 버튼 추가 */}
      <ButtonContainer>
        <Button1 to="/member/mypage/edit" w='200px' h='50px' r='100px'>개인정보 수정</Button1>
        <Button1 to="/member/mypage/changepassword" w='200px' h='50px' r='100px' c='#b253ff'>비밀번호 변경</Button1>
      </ButtonContainer>

      <Divider />

      {/*계정 생성일을 선 아래로 이동 */}
      <InfoRow>
        <Label>계정 생성일:</Label>
        <Value>{member.createdAt}</Value>
      </InfoRow>

      {/*포인트 & 회원탈퇴 */}
      <InfoRow>
        <Label>포인트:</Label>
        <Point>{member.points}P</Point>
      </InfoRow>

      <InfoRow>
        <DeleteAccount to="deleteAccount">회원탈퇴 &gt;</DeleteAccount>
      </InfoRow>
    </Container>
  );
};

export default Mypage;
