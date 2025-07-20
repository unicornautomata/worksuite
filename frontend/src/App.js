import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import PrivateRoute from './components/PrivateRoute';

import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import TodoPage from './pages/TodoPage';
import VerifyEmail from './pages/VerifyEmail'; // ✅ Add this line
import './App.css';

function App() {
  return (
    <Router>
      <Header />
      <div className="app-container">
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/verify-email" element={<VerifyEmail />} />
          <Route
            path="/"
            element={
              <PrivateRoute>
                <TodoPage />
              </PrivateRoute>
            }
          />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
