import { Routes, Route } from 'react-router-dom';
import Budget from './pages/Budget.tsx';
import Dashboard from './pages/Dashboard.tsx';
import Expenses from './pages/Expenses.tsx';
import Login from './pages/Login.tsx';
import Register from './pages/Register.tsx';

function App() {
  return (
    <Routes>
      {/* Set Dashboard as the default root page */}
      <Route path="/" element={<Dashboard />} />
      <Route path="/budget" element={<Budget />} />
      <Route path="/expenses" element={<Expenses />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      {/* Optional: Add a catch-all route for 404 pages */}
      <Route path="*" element={<div>404 Not Found</div>} />
    </Routes>
  );
}

export default App;
