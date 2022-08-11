import './css/App.css'

import Register from "./Register";
import Login from "./Login";
import ChangePassword from './ChangePassword';
import Main from './Main';
import Accounts from './Accounts';
import UpdateInfo from './UpdateInfo';
import NotFound from './NotFound';
import LogOut from './LogOut';

import { Routes, Route } from 'react-router-dom';



function App() {
  return (
    <main className="App">
      <Routes>
        <Route path="/login" element={<Login />}></Route>
        <Route path="/changepassword" element={<ChangePassword />}></Route>
        <Route path="/register" element={<Register />} />
        <Route path='/main' element={<Main />} />
        <Route path='/accounts/:accountNum' element={<Accounts />} />
        <Route path="/updateinfo" element={<UpdateInfo />} />
        <Route path="/logout" element={<LogOut />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </main>
  );
}

export default App;