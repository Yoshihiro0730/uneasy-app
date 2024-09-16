import { useCallback, ChangeEvent, FormEvent, MouseEvent } from 'react';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import jaLocale from '@fullcalendar/core/locales/ja';
import { useRef, useState, useEffect } from 'react';
import axios from 'axios';
import interactionPlugin, { DateClickArg } from '@fullcalendar/interaction';
import { EventClickArg } from '@fullcalendar/core';
import Modal from '@mui/material/Modal';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormButton from "./FormButton";

interface ResponceProps {
    reserve_id: number;
    user_id: number;
    date: string;
}

interface EventProps {
    title: string;
    start: string;
    allDay: boolean;
    extendedProps: {
        userId: number;
    };
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
    reserveId?:number | string;
}

// イベントクリック時の型指定
interface EventContents {
    reserveId?: number;
    userId?: number;
    year?: string;
    month?: string;
    day?: string;
    hour?: string;
    minutes?: string;
}

const style = {
    position: 'absolute' as 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: '50vw',
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,
};

const ReserveCalendar = () => {
    const [currentDate, setCurrentDate] = useState("");
    const [event, setEvent] = useState<EventProps[]>([]);
    const [isOpen, setIsOpen] = useState(false);
    const [isUpdate, setIsUpdate] = useState(false);
    const [editingEvent, setEditingEvent] = useState<EventContents | null>(null);
    const [reserveData, setReserveData] = useState<FormData>({
        userId: "",
        year: "",
        month: "",
        day: "",
        hour: "",
        minutes: ""
    });
    const [updateData, setUpdateData] = useState<FormData>({
        userId: "",
        year: "",
        month: "",
        day: "",
        hour: "",
        minutes: ""
    });

    const currentYear = new Date().getFullYear();
    const years = Array.from({length: 4}, (_, i) => currentYear + i);
    const months = Array.from({length: 12}, (_, i) => i + 1);
    const days = Array.from({length: 31}, (_, i) => i + 1);
    const hours = Array.from({length: 10}, (_, i) => i + 9);
    const minutes = [0, 30];

    const ref = useRef<FullCalendar>(null);
    const endpoint = `${process.env.REACT_APP_GET_RESERVE_API_ENDPOINT}`;
    const reserve_endpoint = `${process.env.REACT_APP_RESERVE_API_ENDPOINT}`;
    const update_endpoint = `${process.env.REACT_APP_UPDATE_API_ENDPOINT}`;
    const delete_endpoint = `${process.env.REACT_APP_DELETE_API_ENDPOINT}`;

    // FullCalendarAPIを用いて表示年月を取得
    const monthHandler = () => {
        if(ref.current) {
            const calendarApi = ref.current.getApi();
            const currentDate = calendarApi.getDate();

            const year = currentDate.getFullYear();
            const month = currentDate.getMonth() + 1;
            const formattedMonth = month < 10 ? "0" + month : month;
            const getDate = `${year}-${formattedMonth}`;
            setCurrentDate(getDate);
        }
    }

    // 表示付きの予約情報を取得
    const getCurrentDate = async() => {
        try {
            const res = await axios.get(endpoint, {
                params: {
                    currentDate: currentDate
                }
            });

            // カレンダーに予約情報を記載する
            const calendarEvent = res.data.map((item: ResponceProps) => {
                const [date, time] = item.date.split(' ');
                return {
                    title: `予約：${time.substring(0, 5)}`,
                    start: item.date,
                    allDay: false,
                    extendedProps: {
                        reserveId: item.reserve_id,
                        userId: item.user_id,
                        date: date,
                        time: time
                    }
                }
            })
            setEvent(calendarEvent);
        } catch(error) {
            console.log("予約情報が取得できませんでした。", error);
        }
    }

    // カレンダーの日付を押下したときのハンドラー
    const handleDateClick = useCallback((arg: DateClickArg) => {
        const clickDate = new Date(arg.date);
        setReserveData(prexState => ({
            ...prexState,
            year: clickDate.getFullYear().toString(),
            month: (clickDate.getMonth() + 1).toString().padStart(2, "0"),
            day: clickDate.getDate().toString().padStart(2, '0')
        }))
        setIsOpen(true);
	}, []);

    // 予約フォーム入力時のデータ取得
    const reserveHandler = (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement> | SelectChangeEvent) => {
        const { name, value } = event.target;
        setReserveData(prevState => ({
            ...prevState,
            [name]: value
        }))
    }

    // 予約更新時のデータ取得
    const updateHandler = (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement> | SelectChangeEvent) => {
        const { name, value } = event.target;
        setEditingEvent(prevState => ({
            ...prevState,
            [name]: value
        }))
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
            setIsOpen(false);
        } catch(error) {
            console.log("データ登録に失敗しました。", error);
        }
    }

    // 予約更新用のハンドラー
    const onUpdate = async(event: FormEvent<HTMLFormElement> | MouseEvent<HTMLButtonElement>) => {
        event.preventDefault();
        const formData = new FormData();
        if (!editingEvent) {
            console.log("更新するデータがありません。");
            return;
        }
        Object.entries(editingEvent).forEach(([key, value]) => {
            formData.append(key,value);
        });

        try {
            const obj = await axios.post(
                update_endpoint,
                formData
            )
            setUpdateData({
                reserveId: "",
                userId: "",
                year: "",
                month: "",
                day: "",
                hour: "",
                minutes: ""
            })
            alert("更新に成功しました。");
            setIsUpdate(false);
        } catch(error) {
            console.log("データ更新に失敗しました。", error);
        }
    }

    // 予約削除ハンドラー
    const onDelete = async(event: FormEvent<HTMLFormElement> | MouseEvent<HTMLButtonElement>) => {
        event.preventDefault();
        const formData = new FormData();
        if(!editingEvent || !editingEvent.reserveId) {
            console.log("削除データがありません。");
            return;
        }
        if(!window.confirm("本当に削除してよろしいでしょうか？")){
            return;
        }
        if (!editingEvent) {
            console.log("更新するデータがありません。");
            return;
        }
        Object.entries(editingEvent).forEach(([key, value]) => {
            formData.append(key,value);
        });
        try{
            const obj = await axios.post(
                delete_endpoint,
                formData
            );
            alert("削除に成功しました。");
            setIsUpdate(false);
            // getCurrentDate();
        } catch(error) {
            console.log("予約削除に失敗しました。", error);
        }
    }

    const handleEventClick = useCallback((clickInfo: EventClickArg) => {
        // 選択したイベントを登録したお客様番号と予約日時を取得
        const props = clickInfo.event.extendedProps;
        const dateTime = new Date(`${props.date}T${props.time}`);
        const parseEvent: EventContents = {
            reserveId: props.reserveId as number,
            userId: props.userId as number,
            year: dateTime.getFullYear().toString(),
            month: (dateTime.getMonth() + 1).toString().padStart(2, '0'),
            day: dateTime.getDate().toString().padStart(2, '0'),
            hour: dateTime.getHours().toString().padStart(2, '0'),
            minutes: dateTime.getMinutes().toString().padStart(2, '0')
        }
        if (parseEvent.minutes === '00') {
            parseEvent.minutes = '0';
        }
        setEditingEvent(parseEvent); 
        setIsUpdate(true);
    }, []);

    useEffect(() => {
        getCurrentDate();
    }, [currentDate])

    return (
       <div className='w-4/5 mx-auto my-10'>
            <Typography variant="h4" component="div" sx={{ flexGrow: 1 }}>予約カレンダー</Typography>
            <FullCalendar 
                ref={ref}
                plugins={[dayGridPlugin, interactionPlugin]} 
                initialView="dayGridMonth" 
                locales={[jaLocale]}
                locale='ja'
                events={event}
                datesSet={monthHandler}
                dateClick={handleDateClick}
                eventClick={handleEventClick}
                eventContent={(eventInfo) => {
                    const userId = eventInfo.event.extendedProps.userId;
                    let timeText = eventInfo.timeText;
                    // 時:分で統一して表示できるように変換
                    if(timeText && timeText.length <= 3){
                        timeText = timeText.replace('時', ':');
                        timeText += "00";
                    }
                    return (
                        <div className="flex flex-col items-start">
                            <div className="flex items-center">
                                <div className="w-2 h-2 rounded-full bg-blue-500 mr-1"></div>
                                <div className="text-sm">
                                    予約：{timeText}
                                </div>
                            </div>
                            <div className="text-xs mt-1">
                                お客様番号: {userId}
                            </div>
                        </div>
                    );
                }}
            /> 
            <Modal
                open={isOpen}
                onClose={() => setIsOpen(false)}
            >
                <Box 
                    sx={style}
                    component="form"
                    noValidate
                    autoComplete="off"
                            
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
                                    <MenuItem key={month} value={month.toString().padStart(2, "0")}>{month}</MenuItem>
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
                                    <MenuItem key={day} value={day.toString().padStart(2, "0")}>{day}</MenuItem>
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
                                <InputLabel id="minutes">分</InputLabel>
                                <Select
                                labelId="minutes"
                                id="minutes"
                                name="minutes"
                                value={reserveData.minutes}
                                label="分"
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
            </Modal>
            
            {/* 予約更新のモーダル */}
            <Modal
                open={isUpdate}
                onClose={() => setIsUpdate(false)}
            >
                <Box 
                    sx={style}
                    component="form"
                    noValidate
                    autoComplete="off"
                            
                >
                    <div className="m-3">
                        <Typography variant="h6" component="div">お客様番号</Typography>
                        <TextField 
                            id="userId"
                            name="userId"
                            value={editingEvent?.userId as number} 
                            label="お客様番号" 
                            variant="outlined" 
                            InputProps={{
                                readOnly: true,
                            }}
                            sx={{ m:2 }} 
                        />
                        <Typography variant="body2" style={{ color: 'red' }} component="div">
                            お客様番号のお間違いに十分ご注意ください
                        </Typography>
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
                                    value={editingEvent?.year}
                                    label="年"
                                    onChange={updateHandler}
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
                                value={editingEvent?.month}
                                label="月"
                                onChange={updateHandler}
                                >
                                {months.map((month) => (
                                    <MenuItem key={month} value={month.toString().padStart(2, "0")}>{month}</MenuItem>
                                ))}
                                </Select>
                            </FormControl>
                            <FormControl sx={{ minWidth: "10vw", m: 1}}>
                                <InputLabel id="day">日</InputLabel>
                                <Select
                                labelId="day"
                                id="day"
                                name="day"
                                value={editingEvent?.day}
                                label="日"
                                onChange={updateHandler}
                                >
                                {days.map((day) => (
                                    <MenuItem key={day} value={day.toString().padStart(2, "0")}>{day}</MenuItem>
                                ))}
                                </Select>
                            </FormControl>
                            <FormControl sx={{ minWidth: "10vw", m: 1}}>
                                <InputLabel id="hour">時</InputLabel>
                                <Select
                                labelId="hour"
                                id="hour"
                                name="hour"
                                value={editingEvent?.hour}
                                label="時"
                                onChange={updateHandler}
                                >
                                {hours.map((hour) => (
                                    <MenuItem key={hour} value={hour}>{hour}</MenuItem>
                                ))}
                                </Select>
                            </FormControl>
                            <FormControl sx={{ minWidth: "10vw", m: 1}}>
                                <InputLabel id="minutes">分</InputLabel>
                                <Select
                                labelId="minutes"
                                id="minutes"
                                name="minutes"
                                value={editingEvent?.minutes}
                                label="分"
                                onChange={updateHandler}
                                >
                                {minutes.map((minite) => (
                                    <MenuItem key={minite} value={minite}>{minite}</MenuItem>
                                ))}
                                </Select>
                            </FormControl>
                        </div>
                    </div>
                    <div className='flex'>
                        <FormButton element={"更新"} onClick={onUpdate} />
                        <FormButton element={"予約取消"} color='error' onClick={onDelete} />
                    </div>
                </Box>
            </Modal>
       </div>
       
    )
}

export default ReserveCalendar;