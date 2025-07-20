import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import Header from './components/Header';
import PrivateRoute from './components/PrivateRoute';
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import TodoPage from './pages/TodoPage';
import VerifyEmail from './pages/VerifyEmail';
import './App.css';

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
          <Route path="/verify-email" element={<VerifyEmail />} />
          <Route
            path="/todo"
            element={
              <PrivateRoute>
                <TodoPage />
              </PrivateRoute>
            }
          />
        </Routes>
      </div>
    </>
  );
}

function App() {
  return (
    <Router>
      <AppWrapper />
    </Router>
  );
}

export default App;
