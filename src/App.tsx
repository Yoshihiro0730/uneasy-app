import './App.css';
import React, { useState, useEffect } from 'react';
import { useCookies } from 'react-cookie';

import Header from './components/Header';
import UserForm from './components/UserForm';
import ReserveCalendar from './components/ReserveCalendar';
import LoginForm from './components/LoginForm';
import { useUser } from './components/UserContext';

function App() {
  const [isCookie, setIsCookie] = useState(false);
  const [cookie] = useCookies(["PHPSESSID"]);
  const { user } = useUser();
  const handleLogin = (email: string, password: string) => {
    console.log('ログインされたメールアドレス:', email, 'とパスワード:', password);
  };

  console.log(user);
  // クッキー値が変更された時に監視
  // useEffect(() => {
  //   if(cookie.PHPSESSID && cookie.PHPSESSID !== "") {
  //     setIsCookie(true);
  //   } else {
  //     setIsCookie(false);
  //   }
  // }, [cookie.PHPSESSID])

  return (
    <div>
      <Header />
      {/* <UserForm formType="regist" /> */}
      {cookie.PHPSESSID && user ? (
        <>
          <p>こんにちは、{user?.displayName || 'ゲスト'}さん</p>
             <ReserveCalendar />
          </>
      ) : (
        <LoginForm />
      )
    }
      {/* <UserForm formType="reserve" /> */}
      {/* <UserForm formType="confirm" /> */}
    </div>
  );
}

export default App;
