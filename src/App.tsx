import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import './App.css';
import { isAtheticated } from './auth/auth';
import { jwtInterceptor } from './auth/auth.intercepts';
import Ac from './pages/Ac/ac';
import Login from './pages/login';
import Template from './template/template';

function PrivateRoute({ children }: any) {
  const auth = isAtheticated();
  console.log(auth);

  return auth ? children : <Navigate to="/login" />;
}

function App(): JSX.Element {
  jwtInterceptor();
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={
          <PrivateRoute>
            <Template>

            </Template>
          </PrivateRoute>
        } />
        <Route path="/login" element={
          <Login />
        } />
        <Route path="/dashboad" element={
          <PrivateRoute>
            <Template>

            </Template>
          </PrivateRoute>
        } />
        <Route path="/Add-Ac" element={
          <Template>
            <PrivateRoute>
              <Ac />
            </PrivateRoute>
          </Template>
        } />
        <Route path="/Events" element={
          <Template>
            <PrivateRoute>

            </PrivateRoute>
          </Template>
        } />
      </Routes>
    </BrowserRouter>
  )
}

export default App;