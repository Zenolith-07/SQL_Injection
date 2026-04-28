import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';

// Auth
import Login from './pages/Login';

// User pages
import Dashboard       from './pages/Dashboard';
import ProfilePage     from './pages/ProfilePage';
import RequestsPage    from './pages/RequestsPage';
import NotificationsPage from './pages/NotificationsPage';
import SettingsPage    from './pages/SettingsPage';

// Admin pages
import AdminPanel         from './pages/AdminPanel';
import AdminEmployeesPage from './pages/AdminEmployeesPage';
import AdminAnalyticsPage from './pages/AdminAnalyticsPage';
import AdminSecurityPage  from './pages/AdminSecurityPage';

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          {/* Public */}
          <Route path="/login" element={<Login />} />

          {/* User routes */}
          <Route path="/dashboard" element={
            <ProtectedRoute><Dashboard /></ProtectedRoute>
          } />
          <Route path="/dashboard/profile" element={
            <ProtectedRoute><ProfilePage /></ProtectedRoute>
          } />
          <Route path="/dashboard/requests" element={
            <ProtectedRoute><RequestsPage /></ProtectedRoute>
          } />
          <Route path="/dashboard/notifications" element={
            <ProtectedRoute><NotificationsPage /></ProtectedRoute>
          } />
          <Route path="/dashboard/settings" element={
            <ProtectedRoute><SettingsPage /></ProtectedRoute>
          } />

          {/* Admin routes */}
          <Route path="/admin" element={
            <ProtectedRoute adminOnly><AdminPanel /></ProtectedRoute>
          } />
          <Route path="/admin/employees" element={
            <ProtectedRoute adminOnly><AdminEmployeesPage /></ProtectedRoute>
          } />
          <Route path="/admin/reports" element={
            <ProtectedRoute adminOnly><AdminAnalyticsPage /></ProtectedRoute>
          } />
          <Route path="/admin/security" element={
            <ProtectedRoute adminOnly><AdminSecurityPage /></ProtectedRoute>
          } />
          <Route path="/admin/settings" element={
            <ProtectedRoute adminOnly><SettingsPage /></ProtectedRoute>
          } />
          
          {/* Admin views of user profiles */}
          <Route path="/admin/users/:id/profile" element={
            <ProtectedRoute adminOnly><ProfilePage /></ProtectedRoute>
          } />
          <Route path="/admin/users/:id/requests" element={
            <ProtectedRoute adminOnly><RequestsPage /></ProtectedRoute>
          } />
          <Route path="/admin/users/:id/notifications" element={
            <ProtectedRoute adminOnly><NotificationsPage /></ProtectedRoute>
          } />
          <Route path="/admin/users/:id/settings" element={
            <ProtectedRoute adminOnly><SettingsPage /></ProtectedRoute>
          } />

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}
