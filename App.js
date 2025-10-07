import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import Header from './components/Header';
import PrivateRoute from './components/PrivateRoute';
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import ResetPasswordPage from './pages/ResetPasswordPage';
import NewPasswordPage from './pages/NewPasswordPage';
import ProfilePage from './pages/ProfilePage';
import TodoPage from './pages/TodoPage';
import DashBoardPage from './pages/DashBoardPage';
import BlogPage from './pages/BlogPage';
import NewPostPage from './pages/NewPostPage';
import TaskPage from './pages/TaskPage';
import VerifyEmail from './pages/VerifyEmail';
import Unauthorized from "./components/Unauthorized";
import Project from "./components/Project";
import ManageBlog from "./components/ManageBlog";
import BlogListByLabel from "./components/BlogListByLabel";
import BlogListByCategory from "./components/BlogListByCategory";
import BlogListBySearch from "./components/BlogListBySearch";
import AdminNotifications from "./components/AdminNotifications";
import { NotificationProvider } from "./components/NotificationContext";
import Resend_Verification_Email from "./components/Resend_Verification_Email";
import './App.css';

// ✅ New wrapper component to handle query parameters
function BlogRouter() {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);

  const category = searchParams.get('category');
  const search = searchParams.get('search');
  const label = searchParams.get('label');

  // Route based on query parameters
  if (category) {
    return <BlogListByCategory />;
  } else if (search) {
    return <BlogListBySearch />;
  } else if (label) {
    return <BlogListByLabel />;
  } else {
    return <BlogListByLabel />; // Default view
  }
}

function AppWrapper() {
  const location = useLocation();
  const hideHeaderRoutes = ['/']; // Hide header on landing page

  return (
    <>
      {!hideHeaderRoutes.includes(location.pathname) && <Header />}
      <div className="app-container">
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/unauthorized" element={<Unauthorized />} />
          <Route path="/resetpassword" element={<ResetPasswordPage />} />
          <Route path="/newpassword" element={<NewPasswordPage />} />
          <Route path="/resendverification" element={<Resend_Verification_Email />} />

          {/* ✅ Blog route with query parameter handling */}
          <Route path="/blog" element={<BlogRouter />} />
          <Route path="/blog/:id" element={<BlogPage />} />

          {/* Admin Routes */}
          <Route
            path="/newpost"
            element={
              <PrivateRoute requiredRole="ADMIN">
                <NewPostPage />
              </PrivateRoute>
            }
          />
          <Route
            path="/newpost/:id"
            element={
              <PrivateRoute requiredRole="ADMIN">
                <NewPostPage />
              </PrivateRoute>
            }
          />
          <Route
            path="/manageblog"
            element={
              <PrivateRoute requiredRole="ADMIN">
                <ManageBlog />
              </PrivateRoute>
            }
          />

          {/* Protected Routes */}
          <Route path="/profile" element={<PrivateRoute><ProfilePage /></PrivateRoute>} />
          <Route path="/dashboard" element={<PrivateRoute><DashBoardPage /></PrivateRoute>} />
          <Route path="/task" element={<PrivateRoute><TaskPage /></PrivateRoute>} />
          <Route path="/project" element={<PrivateRoute><Project /></PrivateRoute>} />
          <Route path="/todo" element={<PrivateRoute><TodoPage /></PrivateRoute>} />

          {/* Verification */}
          <Route path="/verify-email" element={<VerifyEmail />} />
        </Routes>
      </div>
    </>
  );
}

function App() {
  const role = localStorage.getItem("role");

  return (
    <NotificationProvider>
      <Router>
        {role === "ADMIN" && <AdminNotifications />}
        <AppWrapper />
      </Router>
    </NotificationProvider>
  );
}

export default App;
