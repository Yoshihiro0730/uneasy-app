import React, { useEffect, useState } from 'react';
import {
  List,
  ListItem,
  Typography,
  Paper,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';
import { styled } from '@mui/system';
import axios from 'axios';

interface Post {
  postId: number;
  username: string;
  content: string;
  timestamp: string;
}

interface ApiResponse {
  post_id: number;
  user_id: number;
  user_name: string;
  posts: string;
  created_at: string;
}

const PostContainer = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(2),
  marginBottom: theme.spacing(2),
  backgroundColor: 'rgba(255, 255, 255, 0.8)',
  width: '100%',
  boxSizing: 'border-box',
}));

const TimelineContainer = styled('div')(({ theme }) => ({
  maxWidth: '600px',
  margin: '0 auto',
  padding: theme.spacing(2),
  width: '100%', 
  boxSizing: 'border-box',
}));

const PostHeader = styled('div')(({ theme }) => ({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  marginBottom: theme.spacing(1),
}));

const StyledListItem = styled(ListItem)(({ theme }) => ({
  padding: 0, 
  width: '100%', 
}));

const endpoint = `${process.env.REACT_APP_GET_POSTS_API_ENDPOINT}`;


const Timeline: React.FC<{ posts: Post[] }> = ({ posts }) => {
  const [selectedPost, setSelectedPost] = useState<Post | null>(null);
  const [replyDialogOpen, setReplyDialogOpen] = useState(false);
  const [getPosts, setGetPosts] = useState<Post[]>([]);

  const handleReplyClick = (post: Post) => {
    setSelectedPost(post);
    setReplyDialogOpen(true);
  };

  const handleCloseReplyDialog = () => {
    setReplyDialogOpen(false);
    setSelectedPost(null);
  };

  const getPostsData = async() => {
    try {
      const obj = await axios.get(endpoint);
      const postsItems: Post[] = obj.data.map((item: ApiResponse) => ({
        postId: item.post_id,
        username: item.user_name,
        content: item.posts,
        timestamp: item.created_at
      }));
      console.log(obj.data);
      setGetPosts(postsItems);
    } catch (error){
      console.log("ポストデータの取得に失敗しました。", error);
    }
  }

  useEffect(() => {
    getPostsData();
  }, []);
  
  return (
    <TimelineContainer>
      <List>
        {getPosts.map((post) => (
          <StyledListItem key={post.postId}>
            <PostContainer elevation={1}>
              <PostHeader>
                <Typography variant="subtitle1" fontWeight="bold">
                  {post.username}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {post.timestamp}
                </Typography>
              </PostHeader>
              <Typography variant="body1" paragraph>
                {post.content}
              </Typography>
              <Button variant="outlined" size="small" onClick={() => handleReplyClick(post)}>
                返信
              </Button>
            </PostContainer>
          </StyledListItem>
        ))}
      </List>

      <Dialog open={replyDialogOpen} onClose={handleCloseReplyDialog}>
        <DialogTitle>返信</DialogTitle>
        <DialogContent>
          {selectedPost && (
            <>
              <Typography variant="body1">{selectedPost.content}</Typography>
              {/* 返信フォーム作りたい */}
            </>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseReplyDialog}>閉じる</Button>
        </DialogActions>
      </Dialog>
    </TimelineContainer>
  );
};

export default Timeline;