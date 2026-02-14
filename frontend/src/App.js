 
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from 'react-hot-toast';
import Login from './pages/Login';
import AdminDashboard from './pages/AdminDashboard';
import MemberDashboard from './pages/MemberDashboard';
import MemberStore from './pages/MemberStore';
import StorePage from './pages/StorePage';

const queryClient = new QueryClient();

function App() {
  const user = JSON.parse(localStorage.getItem('user'));

  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <Toaster position="top-right" />
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/store/:slug" element={<StorePage />} />
          
          <Route path="/admin/*" element={user?.role === 'admin' ? <AdminDashboard /> : <Navigate to="/login" />} />
          <Route path="/member/*" element={user?.role === 'member' ? <MemberDashboard /> : <Navigate to="/login" />} />
          <Route path="/member/store" element={user?.role === 'member' ? <MemberStore /> : <Navigate to="/login" />} />
          
          <Route path="/" element={<Navigate to="/login" />} />
        </Routes>
      </Router>
    </QueryClientProvider>
  );
}

export default App;