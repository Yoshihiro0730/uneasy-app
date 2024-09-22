import { useCallback, ChangeEvent, FormEvent, MouseEvent, useMemo } from 'react';
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
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormButton from "./FormButton";
import { useUser } from './UserContext';

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
    previousReserve?:string;
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
    previousReserve?:string;
}

interface ReserveData {
    year: string;
    month: string;
    day: string;
    hour: string;
    T_1?: number | null;
    T_2?: number | null;
    T_3?: number | null;
    T_4?: number | null;
    T_5?: number | null;
    T_6?: number | null;
    T_7?: number | null;
    T_8?: number | null;
    T_9?: number | null;
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
    const { user } = useUser();
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
        minutes: "00"
    });
    const [updateData, setUpdateData] = useState<FormData>({
        userId: "",
        year: "",
        month: "",
        day: "",
        hour: "",
        
    });
    const [apiData, setApiData] = useState<ReserveData | null>(null); 

    const currentYear = new Date().getFullYear();
    const hours =  Array.from({length: 10}, (_, i) => i + 9); 

    const ref = useRef<FullCalendar>(null);
    const endpoint = `${process.env.REACT_APP_GET_RESERVE_API_ENDPOINT}`;
    const reserve_endpoint = `${process.env.REACT_APP_RESERVE_API_ENDPOINT}`;
    const update_endpoint = `${process.env.REACT_APP_UPDATE_API_ENDPOINT}`;
    const delete_endpoint = `${process.env.REACT_APP_DELETE_API_ENDPOINT}`;
    const reserve_date_endpoint = `${process.env.REACT_APP_RESERVE_DATE_API_ENDPOINT}`;

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
            const calendarEvent = res.data.flatMap((item: ResponceProps) => {
                const date = item.date;
                return Object.entries(item)
                    .filter(([key, value]) => key.startsWith('T_') && value !== null)
                    .map(([key, value]) => {
                        const hour = parseInt(key.substring(2)) + 8; // T_1 は 9時、T_2 は 10時 ...
                        const startTime = `${hour.toString().padStart(2, '0')}:00`;
                        const endTime = `${(hour + 1).toString().padStart(2, '0')}:00`;
                        return {
                            title: `X(${startTime}-${endTime})`,
                            start: `${date}T${startTime}`,
                            end: `${date}T${endTime}`,
                            allDay: false,
                            extendedProps: {
                                reserveId: item.reserve_id,
                                userId: value,
                                date: date,
                                time: `${startTime}-${endTime}`,
                                startTime: startTime
                            }
                        };
                    });
            });
            
            setEvent(calendarEvent);
        } catch(error) {
            console.log("予約情報が取得できませんでした。", error);
        }
    }

    // カレンダーの日付を押下したときのハンドラー
    const handleDateClick = useCallback((arg: DateClickArg) => {
        const clickDate = new Date(arg.date);
        setReserveData({
            year: clickDate.getFullYear().toString(),
            month: (clickDate.getMonth() + 1).toString().padStart(2, "0"),
            day: clickDate.getDate().toString().padStart(2, '0')
        });
        setIsOpen(true);
	}, []);

    // 日付押下時に該当年月日の情報をフェッチしてくる
    // デバッグ用にコメント残しているので、後で削除
    useEffect(() => {
        const fetchData = async () => {
            if (reserveData.year && reserveData.month && reserveData.day) {
                try {
                    const res = await axios.get(reserve_date_endpoint, {
                        params: reserveData
                    });
                    // レスポンスデータから不要な文字列を削除
                    const cleanedData = res.data.replace(/^Received parameters:.*?\[/, '[');
                    setApiData(JSON.parse(cleanedData));
                } catch (error) {
                    console.error('データ取得に失敗しました。:', error);
                }
            }
        };
        fetchData();
    }, [reserveData.year, reserveData.month, reserveData.day]);

    const getReservedHours = (apiData: any): { [key: number]: number | null } => {
        const reservedHours: { [key: number]: number | null } = {};
        
        let dataArray;
        if (typeof apiData === 'string') {
            // 文字列から JSON 部分を抽出
            const jsonString = apiData.substring(apiData.indexOf('['));
            try {
                dataArray = JSON.parse(jsonString);
            } catch (error) {
                console.error('Failed to parse JSON from string:', error);
                return reservedHours;
            }
        } else if (Array.isArray(apiData)) {
            dataArray = apiData;
        } else {
            return reservedHours;
        }
    
        dataArray.forEach((item: ReserveData, index: number) => {
            for (let i = 1; i <= 9; i++) {
                const key = `T_${i}` as keyof ReserveData;
                if (item[key] !== null && item[key] !== undefined && item[key] !== '') {
                    reservedHours[i + 8] = item[key] as number;
                }
            }
        });
    
        return reservedHours;
    };
    
    
    const reservedHours = useMemo(() => getReservedHours(apiData), [apiData]);

    // 予約フォーム入力時のデータ取得
    const reserveHandler = (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement> | SelectChangeEvent) => {
        const { name, value } = event.target;
        setReserveData(prevState => ({
            ...prevState,
            [name]: value,
            userId: user?.userId
        }))
    }

    // 予約更新時のデータ取得
    const updateHandler = (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement> | SelectChangeEvent) => {
        const { name, value } = event.target;
        setEditingEvent(prevState => ({
            ...prevState,
            [name]: value,
            userId: user?.userId
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
        if (!editingEvent) {
            console.log("更新するデータがありません。");
            return;
        }
    
        const formData = new FormData();
        Object.entries(editingEvent).forEach(([key, value]) => {
            if (value !== undefined && value !== null) {
                formData.append(key, value.toString());
            }
        });
    
        try {
            const response = await axios.post(update_endpoint, formData);
            console.log("更新レスポンス:", response.data);
            setUpdateData({
                reserveId: "",
                userId: "",
                year: "",
                month: "",
                day: "",
                hour: "",
                previousReserve: ""
            });
            alert("更新に成功しました。");
            setIsUpdate(false);
        } catch(error) {
            console.error("データ更新に失敗しました。", error);
        }
    };

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
            console.log(obj.data);
            alert("削除に成功しました。");
            setIsUpdate(false);
            // getCurrentDate();
        } catch(error) {
            console.log("予約削除に失敗しました。", error);
        }
    }

    const handleEventClick = useCallback(async(clickInfo: EventClickArg) => {
        // 選択したイベントを登録したお客様番号と予約日時を取得
        const props = clickInfo.event.extendedProps;
        const [year, month, day] = props.date.split('-');
        const hour = props.startTime.split(':')[0];
        const eventUserId = props.userId as number;
        console.log(editingEvent);

        // 現在のユーザーIDと比較
        if (eventUserId !== Number(user?.userId)) {
            alert("この予約は別のユーザーによって作成されました。編集できません。");
            return;
        }
        const fetchNewData = async () => {
            try {
                const params = {
                    year,
                    month,
                    day
                };
                const res = await axios.get(reserve_date_endpoint, { params });
                setApiData(res.data);
            } catch (error) {
                console.error('データ取得に失敗しました。:', error);
            }
        };
    
        await fetchNewData();
    
        const parseEvent: EventContents = {
            reserveId: props.reserveId as number,
            userId: props.userId as number,
            year,
            month,
            day,
            hour,
            previousReserve: props.startTime
        };
        
        setEditingEvent(parseEvent); 
        setIsUpdate(true);
    }, [user, reserve_date_endpoint]);

    
    useEffect(() => {
        getCurrentDate();
    }, [currentDate])

    // useEffect(() => {
    //     const calculatedReservedHours = getReservedHours(apiData);
    //     console.log('Calculated reservedHours:', calculatedReservedHours);
    //     setReservedHours(calculatedReservedHours);
    // }, [apiData]);

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
                slotDuration="01:00:00"
                slotMinTime="09:00:00"
                slotMaxTime="18:00:00"
                eventContent={(eventInfo) => {
                    const { extendedProps } = eventInfo.event;
                    const userId = extendedProps.userId;
                    const time = extendedProps.time;                    
                    return (
                        <div className="flex flex-col items-start">
                            <div className="flex items-center">
                                <div className="w-2 h-2 rounded-full bg-red-500 mr-1"></div>
                                <div className="text-sm">
                                    ×({time})
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
                        <Typography variant="h6" component="div">{user?.userId}</Typography>
                    </div>
                    <div className="m-3">
                        <Typography variant="h6" component="div">予約日時</Typography>
                        <div>
                            <Typography variant="h6" component="div">{`${reserveData.year}年${reserveData.month}月${reserveData.day}日`}</Typography>
                            <FormControl sx={{ minWidth: "10vw", m: 1}}>
                                <InputLabel id="date_hour">時間</InputLabel>
                                <Select
                                    labelId="hour"
                                    id="hour"
                                    name="hour"
                                    value={reserveData.hour || ''}
                                    label="時"
                                    onChange={reserveHandler}
                                >
                                    {hours.map((hour) => {
                                        const isReserved = reservedHours[hour] !== undefined;
                                        return (
                                            <MenuItem 
                                                key={hour} 
                                                value={hour.toString()}
                                                disabled={isReserved}
                                            >
                                                {hour}:00 {isReserved ? '×' : ''}
                                            </MenuItem>
                                        );
                                    })}
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
                        <Typography variant="h6" component="div">{user?.userId}</Typography>
                    </div>
                    <div className="m-3">
                        <Typography variant="h6" component="div">予約日時</Typography>
                        <div className="m-2">
                            <FormControl sx={{ minWidth: "20vw", m: 1 }}>
                            <InputLabel id="date_hour">時間</InputLabel>
                                <Select
                                    labelId="hour"
                                    id="hour"
                                    name="hour"
                                    value={editingEvent?.hour}
                                    label="時"
                                    onChange={updateHandler}
                                >
                                    {hours.map((hour) => {
                                        const isReserved = reservedHours[hour] !== undefined;
                                        const isOwnReservation = isReserved && reservedHours[hour] === Number(user?.userId);
                                        return (
                                            <MenuItem 
                                                key={hour} 
                                                value={hour.toString()}
                                                disabled={isReserved && !isOwnReservation}
                                            >
                                                {hour}:00 
                                                {isReserved ? (isOwnReservation ? '(予約済)' : '×') : ''}
                                            </MenuItem>
                                        );
                                    })}
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