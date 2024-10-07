import React from 'react';
import { useNavigate } from 'react-router-dom';
import { styled } from '@mui/system';
import { Fab } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import Timeline from '../../components/TimeLine';

const TweetButton = styled(Fab)({
  position: 'fixed',
  bottom: '20px',
  right: '20px',
});

interface Post {
  postId: number;
  username: string;
  content: string;
  timestamp: string;
}

function HomeContent() {
  const navigate = useNavigate();

  const handleTweetClick = () => {
    navigate('/post');
  };

  const posts: Post[] = [
    {
        postId: 1,
        username: "ユーザー1",
        content: "これは最初の投稿です。",
        timestamp: "2024-10-06 10:00:00"
      },
      {
        postId: 2,
        username: "ユーザー2",
        content: "こんにちは、みなさん！",
        timestamp: "2024-10-06 10:15:00"
      },
      {
        postId: 3,
        username: "ユーザー3",
        content: "素晴らしい天気ですね。",
        timestamp: "2024-10-06 10:30:00"
      }
  ];

  return (
    <>
      <Timeline posts={posts} />
      <TweetButton color="primary" aria-label="add" onClick={handleTweetClick}>
        <AddIcon />
      </TweetButton>
    </>
  );
}

export default HomeContent;