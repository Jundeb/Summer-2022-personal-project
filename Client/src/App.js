import './App.css'
import Register from "./Register";
import Login from "./Login";
import Main from './Main';
import { Routes, Route } from 'react-router-dom';

function App() {
  return (
    <main className="App">
      <Routes>
        <Route path="/login" element={<Login/>}/>
        <Route path="/register" element={<Register/>}/>
        <Route path='/main' element={<Main/>}/>
      </Routes>
    </main>
  );
}

export default App;
