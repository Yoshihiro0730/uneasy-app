import React, { useState } from 'react';
import { styled } from '@mui/system';
import { Fab, Modal, Box } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import Timeline from './TimeLine';
import PostPage from './PostPage';

const TweetButton = styled(Fab)({
  position: 'fixed',
  bottom: '20px',
  right: '20px',
});

const ModalStyle = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: '90%',
  maxWidth: 600,
  bgcolor: 'background.paper',
  boxShadow: 24,
  p: 4,
  maxHeight: '90vh',
  overflowY: 'auto',
};

interface Post {
  postId: number;
  username: string;
  content: string;
  timestamp: string;
}

function HomeContent() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleTweetClick = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
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
      <Modal
        open={isModalOpen}
        onClose={handleCloseModal}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
    >
        <Box sx={ModalStyle}>
            <PostPage onClose={handleCloseModal} />
        </Box>
    </Modal>
    </>
  );
}

export default HomeContent;