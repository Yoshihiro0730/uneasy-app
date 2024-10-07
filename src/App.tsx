import './App.css';
import React from 'react';
import { useCookies } from 'react-cookie';
import { styled } from '@mui/system';
import Header from './components/Header';
import LoginForm from './components/LoginForm';
import { useUser } from './components/UserContext';
import HomeContent from './components/HomeContent';

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
    backgroundPosition: 'center top -100px',
    backgroundAttachment: 'fixed',
    zIndex: -1,
  }
});

function App() {
  const [cookie] = useCookies(["PHPSESSID"]);
  const { user } = useUser();

  return (
    <AppContainer>
      <Header />
      <ContentContainer>
        {cookie.PHPSESSID && user ? (
          <>
            <p>こんにちは、{user?.displayName || 'ゲスト'}さん</p>
            <HomeContent />
          </>
        ) : (
          <LoginForm />
        )}
      </ContentContainer>
    </AppContainer>
  );
}

export default App;