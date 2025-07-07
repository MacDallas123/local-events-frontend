import './App.css'
import Auth from './layouts/Auth';
import Login from './views/auth/Login';
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import Register from './views/auth/Register';
import Index from './views/home/Index';
import Main from './layouts/Main';
import Events from './views/Explore';
import Admin from './layouts/Admin';
import Users from './views/admin/Users';
import Dashboard from './views/admin/Dashboard';
import EventsManagement from './views/admin/EventsManagement';
import Categories from './views/admin/Categories';
import Explore from './views/Explore';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Auth Routes */}
        <Route path="/auth" element={<Auth />}>
              <Route path="/auth/login" element={<Login />} />
              <Route path="/auth/register" element={<Register />} />
              <Route path="/auth" element={<Navigate  to="/auth/login" />} />
        </Route>

        <Route path="/" element={<Main />}>
              <Route path="/index" element={<Index />} />
              <Route path="/explore" element={<Explore />} />

              <Route path="/" element={<Navigate  to="/index" />} />
        </Route>

        <Route path="/admin" element={<Admin />}>
          <Route path="/admin/dashboard" element={<Dashboard />} />
          <Route path="/admin/users" element={<Users />} />
          <Route path="/admin/events" element={<EventsManagement />} />
          <Route path="/admin/categories" element={<Categories />} />
          <Route path="/admin" element={<Navigate  to="/admin/dashboard" />} />
        </Route>

        {/* <Route path="/" element={
          <ProtectedRoute>
            <Index />
          </ProtectedRoute>
        } /> */}

        {/* <Route path="/403" element={
          <IsForbidden />
        } /> */}

      </Routes>
    </BrowserRouter>
  );
}

export default App
