import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './App.css';
import ManagerPage from './pages/admin/ManagerPage';
import HostPage from './pages/host/HostPage';
import Main from './pages/user/Main';

function App() {
  return (
    <BrowserRouter>
      <div />
      <Routes>
        <Route path="/host/*" element={<HostPage />} />
        <Route path="/manager/*" element={<ManagerPage />} />
        <Route path="/*" element={<Main />} />
      </Routes>
      <div />
    </BrowserRouter>
  );
}

export default App;
