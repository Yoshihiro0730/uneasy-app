import React, { useState, ChangeEvent, useEffect } from 'react';
import { TextField, Button, Paper, Typography } from '@mui/material';
import { useUser } from '../../components/UserContext';
import { styled } from '@mui/system';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

interface PostProps {
    userId?: number | null;
    context: string;
    resolveFlag: boolean;
}

const PostContainer = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(3),
  maxWidth: 600,
  margin: '0 auto',
}));

const Form = styled('form')(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  gap: theme.spacing(2),
}));

const PostPage: React.FC = () => {
  const [content, setContent] = useState<PostProps>(
    {
        userId: null,
        context: "",
        resolveFlag: false
    }
  );
  const { user } = useUser();
  const navigate = useNavigate();
  const endpoint = `${process.env.REACT_APP_POST_API_ENDPOINT}`;

  const contextHandler = (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = event.target;
    setContent(prevState => ({
        ...prevState,
        [name]: value,
        userId: user?.userId,
    }));
  }

  const handleSubmit = async(e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData();
    Object.entries(content).forEach(([key, value]) => {
        if (key === 'resolveFlag') {
        formData.append(key, value ? '1' : '0');
        } else if (value !== null && value !== undefined) {
        formData.append(key, value.toString());
        }
    });

    try {
        const obj = await axios.post(
            endpoint,
            formData
        )
        setContent({
            userId: null,
            context: "",
            resolveFlag: false
        })
        console.log("登録に成功しました", obj.data);
        navigate('/');
    } catch(error) {
        console.log("新規投稿に失敗しました。", error);
    }
    console.log('投稿内容:', content);
  };

  useEffect(() => {
    console.log(content);
  }, [content])

  return (
    <PostContainer>
      <Typography variant="h5" gutterBottom>
        新規投稿
      </Typography>
      <Form onSubmit={handleSubmit}>
        <TextField
          name="context"
          multiline
          rows={4}
          variant="outlined"
          placeholder="何を呟きますか？"
          value={content.context}
          onChange={contextHandler}
        />
        <Button variant="contained" color="primary" type="submit">
          投稿する 
        </Button>
      </Form>
    </PostContainer>
  );
};

export default PostPage;