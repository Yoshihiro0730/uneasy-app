import React from 'react';
import logo from './logo.svg';
import './App.css';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';

import Header from './components/Header';
import UserForm from './components/UserForm';

function App() {
  return (
    <div>
      <Header />
      <UserForm formType="regist" />
      <UserForm formType="reserve" />
      <UserForm formType="confirm" />
      {/* <FullCalendar plugins={[dayGridPlugin]} initialView="dayGridMonth" /> */}
    </div>
  );
}

export default App;
