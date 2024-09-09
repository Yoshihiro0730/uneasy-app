import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import jaLocale from '@fullcalendar/core/locales/ja';
import { useRef, useState, useEffect } from 'react';
import axios from 'axios';

interface ResponceProps {
    date: string;
}

interface EventProps {
    title: string;
    start: string;
    allDay: boolean;
}

const ReserveCalendar = () => {
    const [currentDate, setCurrentDate] = useState("");
    const [event, setEvent] = useState<EventProps[]>([]);
    const ref = useRef<FullCalendar>(null);
    const endpoint = `${process.env.REACT_APP_GET_RESERVE_API_ENDPOINT}`;

    // FullCalendarAPIを用いて表示年月を取得
    const monthHandler = () => {
        if(ref.current) {
            const calendarApi = ref.current.getApi();
            const currentDate = calendarApi.getDate();

            const year = currentDate.getFullYear();
            const month = currentDate.getMonth() + 1;
            const formattedMonth = month < 10 ? "0" + month : month;
            console.log(`現在表示中の年月: ${year}年${month}月`);
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
            console.log(res.data);

            // カレンダーに予約情報を記載する
            const calendarEvent = res.data.map((item: ResponceProps) => {
                const [date, time] = item.date.split(' ');
                return {
                    title: `予約：${time.substring(0, 5)}`,
                    start: item.date,
                    allDay: false
                }
            })
            setEvent(calendarEvent);
        } catch(error) {
            console.log("予約情報が取得できませんでした。", error);
        }
    }

    useEffect(() => {
        getCurrentDate();
    }, [currentDate])

    return (
       <div className='w-4/5 mx-auto my-5'>
            <FullCalendar 
                ref={ref}
                plugins={[dayGridPlugin]} 
                initialView="dayGridMonth" 
                locales={[jaLocale]}
                locale='ja'
                events={event}
                datesSet={monthHandler}
                eventContent={(eventInfo) => (
                    <div className="flex items-center">
                        <div className="w-2 h-2 rounded-full bg-blue-500 mr-1"></div>
                        <div className="text-sm">
                            予約：{eventInfo.timeText}
                        </div>
                    </div>
                )}
            /> 
       </div>
       
    )
}

export default ReserveCalendar;