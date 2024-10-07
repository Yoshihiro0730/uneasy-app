import './App.css';
import React, { useState, useEffect } from 'react';
import { useCookies } from 'react-cookie';
import { styled } from '@mui/system';
import { Fab } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import { Route, Routes } from 'react-router-dom';
import Header from './components/Header';
import LoginForm from './components/LoginForm';
import { useUser } from './components/UserContext';
import PostPage from './pages/Post';
import HomeContent from './pages/Home';

interface Post {
  postId: number;
  username: string;
  content: string;
  timestamp: string;
}

const AppContainer = styled('div')({
  display: 'flex',
  flexDirection: 'column',
  height: '100vh',
});

const ContentContainer = styled('div')({
  flexGrow: 1,
  overflowY: 'auto',
  position: 'relative',
  '&::before': {
    content: '""',
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundImage: 'url("/main_backgraound.jpg")',
    backgroundSize: 'cover',
    backgroundPosition: 'center top -100px',  // 上部から100px下に移動
    backgroundAttachment: 'fixed',
    zIndex: -1,
  }
});

const TweetButton = styled(Fab)({
  position: 'fixed',
  bottom: '20px',
  right: '20px',
});


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
      <AppContainer>
        <Header />
        <ContentContainer>
          {/* <UserForm formType="regist" /> */}
          {cookie.PHPSESSID && user ? (
            <>
              <p>こんにちは、{user?.displayName || 'ゲスト'}さん</p>
              <Routes>
                <Route path="/" element={<HomeContent />} />
                <Route path="/post" element={<PostPage />} />
              </Routes>
            </>
          ) : (
            <LoginForm />
          )
          }
         </ContentContainer>
      </AppContainer>
  );
}

export default App;
