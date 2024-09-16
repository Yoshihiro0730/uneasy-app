import './App.css';

import Header from './components/Header';
import UserForm from './components/UserForm';
import ReserveCalendar from './components/ReserveCalendar';

function App() {
  return (
    <div>
      <Header />
      <UserForm formType="regist" />
      {/* <UserForm formType="reserve" /> */}
      {/* <UserForm formType="confirm" /> */}
      <ReserveCalendar />
    </div>
  );
}

export default App;
