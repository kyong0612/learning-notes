import React, { useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import { Amplify } from 'aws-amplify';
import { awsConfig } from './aws-config';
import Login from './components/Login';
import SignUp from './components/SignUp';
import Home from './components/Home';
import PrivateRoute from './components/PrivateRoute';
import './App.css';

// Amplifyの設定
Amplify.configure(awsConfig);

function App() {
  useEffect(() => {
    // Amplifyの初期化確認
    console.log('AWS Amplify configured');
  }, []);

  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<SignUp />} />
          <Route
            path="/home"
            element={
              <PrivateRoute>
                <Home />
              </PrivateRoute>
            }
          />
          <Route path="/" element={<Navigate to="/home" replace />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
