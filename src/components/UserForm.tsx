import React, { ChangeEvent, FormEvent, useState, MouseEvent, useEffect } from "react";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import TextField from '@mui/material/TextField';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import FormButton from "./FormButton";
import axios from "axios";

interface FormProps {
    // onSubmit: (data: FormData) => void;
    initialData?: FormData;
    formType: string;
}

interface FormData {
    firstName?: string;
    lastName?: string;
    email?: string;
    userId?: number | string;
    year?: string;
    month?: string;
    day?: string;
    hour?: string;
    minutes?: string;
}

interface UserReserve {
    user_id: number;
    date: string;
}

const UserForm: React.FC<FormProps> = ({ formType }) => {
    // 登録フォームのデータセット
    const [registData, setResistData] = useState<FormData>({
        firstName: "",
        lastName: "",
        email: ""
    });
    // 予約フォームのデータセット
    const [reserveData, setReserveData] = useState<FormData>({
        userId: "",
        year: "",
        month: "",
        day: "",
        hour: "",
        minutes: ""
    });
    // 確認・変更・取消フォームのデータセット
    const [confirmData, setConfirmData] = useState<FormData>({
        userId: ""
    });

    // 予約確認トグル用
    const [isOpen, setIsOpen] = useState(false);
    // 予約情報格納用
    const [reservations, setReservations] = useState<UserReserve[]>([]);

    const currentYear = new Date().getFullYear();
    const years = Array.from({length: 4}, (_, i) => currentYear + i);
    const months = Array.from({length: 12}, (_, i) => i + 1);
    const days = Array.from({length: 31}, (_, i) => i + 1);
    const hours = Array.from({length: 10}, (_, i) => i + 9);
    const minutes = [0, 30];

    // apiエンドポイント指定
    const regist_endpoint = `${process.env.REACT_APP_RESIST_API_ENDPOINT}`;
    const reserve_endpoint = `${process.env.REACT_APP_RESERVE_API_ENDPOINT}`;
    const users_endpoint = `${process.env.REACT_APP_USER_API_ENDPOINT}`;

    // 登録フォーム入力時のデータ取得
    const resistHandler = (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = event.target;
        setResistData(prevState => ({
            ...prevState,
            [name]: value
        }))
    }

    // 予約フォーム入力時のデータ取得
    const reserveHandler = (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement> | SelectChangeEvent) => {
        const { name, value } = event.target;
        setReserveData(prevState => ({
            ...prevState,
            [name]: value
        }))
    }

    // 確認フォーム入力時のデータ取得
    const confirmHandler = (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = event.target;
        setConfirmData(prevState => ({
            ...prevState,
            [name]: value
        }))
    };

    // ユーザー登録用のハンドラー
    const onResist = async(event: FormEvent<HTMLFormElement> | MouseEvent<HTMLButtonElement>) => {
        event.preventDefault();
        const formData = new FormData();
        Object.entries(registData).forEach(([key, value]) => {
            formData.append(key,value);
        });

        try {
            const obj = await axios.post(
                regist_endpoint,
                formData
            )
            setResistData({
                firstName: "",
                lastName: "",
                email: ""
            })
            console.log(obj.data);
            alert("登録に成功しました。");
        } catch(error) {
            console.log("データ登録に失敗しました。", error);
        }
    }

    // 予約登録用のハンドラー
    const onReserve = async(event: FormEvent<HTMLFormElement> | MouseEvent<HTMLButtonElement>) => {
        event.preventDefault();
        const formData = new FormData();
        Object.entries(reserveData).forEach(([key, value]) => {
            formData.append(key,value);
        });

        try {
            const obj = await axios.post(
                reserve_endpoint,
                formData
            )
            setReserveData({
                userId: "",
                year: "",
                month: "",
                day: "",
                hour: "",
                minutes: ""
            })
            alert("登録に成功しました。");
        } catch(error) {
            console.log("データ登録に失敗しました。", error);
        }
    }

    // お客様番号検索クエリ
    const onUserData = async(confirmData: any) => {
        try {
            const obj = await axios.get(users_endpoint, {
                params: {
                    userId: confirmData.userId
                }
            });
            // console.log(confirmData.userId);
            setReservations(obj.data);
            console.log("検索に成功しました。", obj.data);
            setIsOpen(true);
        } catch (error) {
            console.log("お客様番号が見つかりませんでした。");
        }
    }

    // 再レンダリング時に予約確認リストを非表示
    useEffect(() => {
        setIsOpen(false);
        setConfirmData({
            userId : ""
        })
    }, [])

    // 呼び出し元のパラメータ指定によってフォームの出しわけ
    const renderContents = () => {
        switch (formType) {
            // 登録フォーム
            case "regist":
                return (
                    <div className="w-4/5 mt-2 mb-2 ml-auto mr-auto flex flex-col">
                        <Typography variant="h4" component="div" sx={{ flexGrow: 1 }}>始めての方はこちら</Typography>
                        <Box
                            component="form"
                            noValidate
                            autoComplete="off"
                            sx={{ boxShadow: 1 }}
                        >
                            <div className="m-3">
                                <Typography variant="h6" component="div">お名前</Typography>
                                <TextField 
                                    id="first_name"
                                    name="firstName"
                                    value={registData.firstName} 
                                    label="性" 
                                    variant="outlined" 
                                    onChange={resistHandler}
                                    sx={{ m:2 }} 
                                />
                                <TextField 
                                    id="last_name" 
                                    name="lastName"
                                    value={registData.lastName}
                                    label="名" 
                                    variant="outlined" 
                                    onChange={resistHandler}
                                    sx={{ m:2 }}
                                />
                            </div>
                            <div className="m-3">
                                <Typography variant="h6" component="div">email</Typography>
                                <TextField 
                                    id="email"
                                    name="email"
                                    value={registData.email} 
                                    label="メールアドレス" 
                                    variant="outlined" 
                                    onChange={resistHandler}
                                    sx={{ m:2, minWidth: "80%" }}
                                />
                            </div>
                            <FormButton element={"登録"} onClick={onResist} />
                        </Box>
                    </div>
                )
            // 予約フォーム
            case "reserve":
                return (
                    <div className="w-4/5 mt-2 mb-2 ml-auto mr-auto flex flex-col">
                        <Typography variant="h4" component="div" sx={{ flexGrow: 1 }}>ご予約</Typography>
                        <Box
                            component="form"
                            noValidate
                            autoComplete="off"
                            sx={{ boxShadow: 1 }}
                        >
                            <div className="m-3">
                                <Typography variant="h6" component="div">お客様番号</Typography>
                                <TextField 
                                    id="userId"
                                    name="userId"
                                    value={reserveData.userId as number} 
                                    label="お客様番号" 
                                    variant="outlined" 
                                    onChange={reserveHandler}
                                    sx={{ m:2 }} 
                                />
                            </div>
                            <div className="m-3">
                                <Typography variant="h6" component="div">予約日時</Typography>
                                <div className="m-2">
                                    <FormControl sx={{ minWidth: "20vw", m: 1 }}>
                                        <InputLabel id="year">年</InputLabel>
                                        <Select
                                        labelId="year"
                                        id="year"
                                        name="year"
                                        value={reserveData.year}
                                        label="年"
                                        onChange={reserveHandler}
                                        >
                                        {years.map((year) => (
                                            <MenuItem key={year} value={year}>{year}</MenuItem>
                                        ))}
                                        </Select>
                                    </FormControl>
                                    <FormControl sx={{ minWidth: "10vw", m: 1 }}>
                                        <InputLabel id="month">月</InputLabel>
                                        <Select
                                        labelId="month"
                                        id="month"
                                        name="month"
                                        value={reserveData.month}
                                        label="月"
                                        onChange={reserveHandler}
                                        >
                                        {months.map((month) => (
                                            <MenuItem key={month} value={month}>{month}</MenuItem>
                                        ))}
                                        </Select>
                                    </FormControl>
                                    <FormControl sx={{ minWidth: "10vw", m: 1}}>
                                        <InputLabel id="day">日</InputLabel>
                                        <Select
                                        labelId="day"
                                        id="day"
                                        name="day"
                                        value={reserveData.day}
                                        label="日"
                                        onChange={reserveHandler}
                                        >
                                        {days.map((day) => (
                                            <MenuItem key={day} value={day}>{day}</MenuItem>
                                        ))}
                                        </Select>
                                    </FormControl>
                                    <FormControl sx={{ minWidth: "10vw", m: 1}}>
                                        <InputLabel id="hour">時</InputLabel>
                                        <Select
                                        labelId="hour"
                                        id="hour"
                                        name="hour"
                                        value={reserveData.hour}
                                        label="時"
                                        onChange={reserveHandler}
                                        >
                                        {hours.map((hour) => (
                                            <MenuItem key={hour} value={hour}>{hour}</MenuItem>
                                        ))}
                                        </Select>
                                    </FormControl>
                                    <FormControl sx={{ minWidth: "10vw", m: 1}}>
                                        <InputLabel id="minutes">時</InputLabel>
                                        <Select
                                        labelId="minutes"
                                        id="minutes"
                                        name="minutes"
                                        value={reserveData.minutes}
                                        label="時"
                                        onChange={reserveHandler}
                                        >
                                        {minutes.map((minite) => (
                                            <MenuItem key={minite} value={minite}>{minite}</MenuItem>
                                        ))}
                                        </Select>
                                    </FormControl>
                                </div>
                            </div>
                            <FormButton element={"予約する"} onClick={onReserve} />
                        </Box>
                    </div>
                );
                // 確認フォーム
                case "confirm":
                    return(
                        <div className="w-4/5 mt-2 mb-2 ml-auto mr-auto flex flex-col">
                            <Typography variant="h4" component="div" sx={{ flexGrow: 1 }}>予約確認</Typography>
                            <Box
                                component="form"
                                noValidate
                                autoComplete="off"
                                sx={{ boxShadow: 1 }}
                            >
                                <div className="m-3">
                                    <Typography variant="h6" component="div">お客様番号</Typography>
                                    <TextField 
                                        id="userId"
                                        name="userId"
                                        value={confirmData.userId as number} 
                                        label="お客様番号" 
                                        variant="outlined" 
                                        onChange={confirmHandler}
                                        sx={{ m:2 }} 
                                    />  
                                </div>
                            {isOpen ? 
                                reservations.map((reservation: UserReserve, index) => (
                                    <Card key={index} sx={{ width:"80%", m: "auto" }}>
                                        <CardContent>
                                            <Typography variant="h6" component="div">予約日時</Typography>
                                            <Typography color="text.secondary">
                                                {new Date(reservation.date).toLocaleString()}
                                            </Typography>
                                        </CardContent>
                                    </Card>
                                ))
                                :
                                <></>
                            }
                            <FormButton element={"確認"} onClick={() => onUserData(confirmData)} />
                            </Box>
                        </div>
                    )
        }
    }
    

    return (
        <>
            {renderContents()}
        </>
    )
};

export default UserForm;