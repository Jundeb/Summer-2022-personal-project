import './css/App.css'
import Register from "./Register";
import Login from "./Login";
import Main from './Main';
import Accounts from './Accounts';
import UpdateInfo from './UpdateInfo';
import NotFound from './NotFound';
import { Routes, Route, useParams } from 'react-router-dom';


function App() {
  return (
    <main className="App">
      <Routes>
        <Route path="/login" element={<Login />}></Route>
        <Route path="/register" element={<Register />} />
        <Route path='/main' element={<Main />} />
        <Route path='/accounts/:accountNum' element={<Accounts accountNum = "0" />} />
        <Route path="/updateinfo" element={<UpdateInfo />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </main>
  );
}

export default App;