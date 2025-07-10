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
import Registrations from './views/admin/Registrations';
import Profil from './views/home/Profil';
import ProtectedRoute from './views/auth/ProtectedRoute';
import IsAdminProtectedRoute from './views/auth/IsAdminProtectedRoute';
import IsOrganizerProtectedRoute from './views/auth/IsOrganizerProtectedRoute';
import IsForbidden from './views/auth/IsForbidden';
import ForgotPassword from './views/ForgotPassword';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Auth Routes */}
        <Route path="/auth" element={<Auth />}>
              <Route path="/auth/login" element={<Login />} />
              <Route path="/auth/register" element={<Register />} />
              <Route path="/auth/forgot-password" element={<ForgotPassword />} />
              <Route path="/auth" element={<Navigate  to="/auth/login" />} />
        </Route>

        <Route path="/" element={<Main />}>
              <Route path="/index" element={
                <ProtectedRoute>
                  <Index />
                </ProtectedRoute>
              } />

              <Route path="/explore" element={
                <ProtectedRoute>
                  <Explore />
                </ProtectedRoute>
              } />

              <Route path="/profile" element={
                <ProtectedRoute>
                  <Profil />
                </ProtectedRoute>
                } />

              <Route path="/" element={<Navigate  to="/index" />} />
        </Route>

        <Route path="/admin" element={
            <ProtectedRoute>
              <Admin />
            </ProtectedRoute>
          }>

          <Route path="/admin/dashboard" element={<Dashboard />} />

          <Route path="/admin/users" element={
              <IsAdminProtectedRoute>
                <Users />
              </IsAdminProtectedRoute>
            } />

          <Route path="/admin/events" element={
            <IsOrganizerProtectedRoute>
              <EventsManagement />
            </IsOrganizerProtectedRoute>
            } />

          <Route path="/admin/categories" element={
            <IsAdminProtectedRoute>
              <Categories />
            </IsAdminProtectedRoute>
            } />

          <Route path="/admin/registrations" element={
            <IsOrganizerProtectedRoute>
              <Registrations />
            </IsOrganizerProtectedRoute>
          } />

          <Route path="/admin" element={<Navigate  to="/admin/dashboard" />} />
        </Route>
        
        <Route path="/403" element={<IsForbidden />} />
        
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
