import React, { useState, FormEvent, ChangeEvent, MouseEvent, useEffect } from 'react';
import { Button, TextField, Typography } from '@mui/material';
import { styled } from '@mui/system';
import axios from 'axios';
import { useUser } from './UserContext';

interface FormData {
    userId?: number;
    firstName?: string;
    lastName?: string;
    email?: string;
    passWord?: string;
    displayName?: string;
}

axios.defaults.withCredentials = true;

const Container = styled('div')({
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    height: '100vh',
    backgroundColor: '#f0f0f0',
});

const LoginCard = styled('div')({
    backgroundColor: '#fff',
    padding: '20px',
    borderRadius: '10px',
    boxShadow: '0 0 10px rgba(0,0,0,0.1)',
});

const LoginForm = () => {
    const { login, logout } = useUser();
    const [userInfo, setUserInfo] = useState<FormData>(
        {
            firstName: "",
            lastName: "",
            email: "",
            passWord: ""
        }
    )

    const [loginData, setLoginData] = useState<FormData>(
        {
            userId: undefined,
            passWord: ""
        }
    )

    const [userData, setUserData] = useState<FormData>({
        userId: undefined,
        displayName: ""
    })

    const [loginType, setLoginType] = useState(false);

    const endpoint = `${process.env.REACT_APP_RESIST_API_ENDPOINT}`;
    const loginEndpoint = `${process.env.REACT_APP_LOGIN_API_ENDPOINT}`;

    // ユーザー登録フォーム情報の取得
    const resistHandler = (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = event.target;
        setUserInfo(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    //　ログイン情報取得
    const loginHandler = (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = event.target;
        setLoginData(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    // ユーザー登録ハンドラー
    const onResist = async(event:FormEvent<HTMLFormElement> | MouseEvent<HTMLButtonElement>) => {
        event.preventDefault();
        const formData = new FormData();
        Object.entries(userInfo).forEach(([key, value]) => {
            formData.append(key,value);
        });

        try {
            const obj = await axios.post(
                endpoint,
                formData,
                {withCredentials: true}
            )
            setUserInfo({
                firstName: "",
                lastName: "",
                email: "",
                passWord: ""
            });
            // console.log(obj.data);
            setUserData({
                userId: obj.data.user.id as number,
                displayName: obj.data.user.name
            })
            alert("登録に成功しました。");
        } catch(error) {
            console.log("ユーザー登録に失敗しました。", error);
        }
    }

    // ログインとユーザー登録の画面切り替え
    const onSwitch = () => {
        setLoginType(!loginType);
    }

    // ログインハンドラー
    const onLogin = async(event:FormEvent<HTMLFormElement> | MouseEvent<HTMLButtonElement>) => {
        event.preventDefault();
        const formData = new FormData();
        Object.entries(loginData).forEach(([key, value]) => {
            formData.append(key,value);
        });

        try {
            const obj = await axios.post(
                loginEndpoint,
                formData,
                {withCredentials: true}
            )
            setLoginData({
                userId: undefined,
                passWord:""
            });
            // console.log(obj.data);
            setUserData({
                userId: obj.data.user.id as number,
                displayName: obj.data.user.name
            })
            if (obj.data.user && obj.data.user.id && obj.data.user.name) {
                login(obj.data.user.id, obj.data.user.name);
                alert("ログインに成功しました。");
            }
        } catch(error) {
            console.log("ログインに失敗しました。", error);
        }
    }

    useEffect(() => {
        if(userData.userId !== undefined && userData.displayName !== undefined){
            login(userData.userId, userData.displayName)
        }
    }, [userData, login]);

    return (
        <Container>
            {loginType ?
                // ユーザー登録フォーム
                <LoginCard>
                    {/* php側作成したら、ログインフォームも作成する */}
                    <Typography variant="h5" gutterBottom>
                        ユーザー登録
                    </Typography>
                    <TextField 
                        id="first_name"
                        name="firstName"
                        value={userInfo.firstName} 
                        label="性" 
                        variant="outlined" 
                        onChange={resistHandler}
                        margin="normal" 
                        fullWidth 
                    />
                    <TextField 
                        id="last_name"
                        name="lastName"
                        value={userInfo.lastName} 
                        label="名" 
                        variant="outlined" 
                        onChange={resistHandler}
                        margin="normal" 
                        fullWidth 
                    />
                    <TextField 
                        id="email"
                        name="email"
                        value={userInfo.email} 
                        label="メールアドレス" 
                        variant="outlined" 
                        onChange={resistHandler}
                        margin="normal" 
                        fullWidth 
                    />
                    <TextField
                        id="passWord"
                        name="passWord"
                        value={userInfo.passWord} 
                        label="パスワード" 
                        variant="outlined" 
                        onChange={resistHandler}
                        margin="normal" 
                        fullWidth 
                        type='password'
                    />
                    <div className="text-center cursor-pointer text-blue-500" onClick={onSwitch}>
                        ログインはこちら
                    </div>
                    <div className="my-5 flex justify-center">
                        <Button variant="contained" color="primary" onClick={onResist}>
                            登録
                        </Button>
                    </div>
                </LoginCard>
            : 
                // ログインフォーム
                <LoginCard>
                    {/* php側作成したら、ログインフォームも作成する */}
                    <Typography variant="h5" gutterBottom>
                        ログイン
                    </Typography>
                    <TextField 
                        id="userId"
                        name="userId"
                        value={loginData.userId} 
                        label="ID" 
                        variant="outlined" 
                        onChange={loginHandler}
                        margin="normal" 
                        fullWidth 
                    />
                    <TextField
                        id="passWord"
                        name="passWord"
                        value={loginData.passWord} 
                        label="パスワード" 
                        variant="outlined" 
                        onChange={loginHandler}
                        margin="normal" 
                        fullWidth 
                        type='password'
                    />
                    <div className="text-center cursor-pointer text-blue-500" onClick={onSwitch}>
                        アカウント登録はこちら
                    </div>
                    <div className="my-5 flex justify-center">
                        <Button variant="contained" color="primary" onClick={onLogin}>
                            ログイン
                        </Button>
                    </div>
                </LoginCard>
            }
            </Container>
    );
}

export default LoginForm