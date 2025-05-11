import React from 'react';

const MemberLogin = () => {
  return (
    <>
      <form>
        <input type="text" name="id" placeholder="이메일"/>
        <br/>
        <input type="password" name="pw" placeholder="비밀번호"/>
        <br/>
        <input type="submit" value={'로그인'}/>
      </form>
    </>
  );
};

export default MemberLogin;