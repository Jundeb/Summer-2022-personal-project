import './css/App.css'
import Register from "./Register";
import Login from "./Login";
import Main from './Main';
import { Routes, Route } from 'react-router-dom';
import UpdateInfo from './UpdateInfo';
import NotFound from './NotFound';

function App() {
  return (
    <main className="App">
      <Routes>
        <Route path="/login" element={<Login/>}/>
        <Route path="/register" element={<Register/>}/>
        <Route path='/main' element={<Main/>}/>
        <Route path="/updateinfo" element={<UpdateInfo/>}/>
        <Route path="*" element={<NotFound/>}/>
      </Routes>
    </main>
  );
}

export default App;
