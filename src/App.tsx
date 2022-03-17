import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import './App.css';
import { isAtheticated } from './auth/auth';
import { jwtInterceptor } from './auth/auth.intercepts';
import Ac from './pages/Ac/ac';
import Events from './pages/events/events';
import Home from './pages/home/home';
import Login from './pages/login';
import Template from './template/template';

function PrivateRoute({ children }: any) {
  const auth = isAtheticated();
  return auth ? children : <Navigate to="/login" />;
}
function App(): JSX.Element {
  jwtInterceptor();
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={
          <PrivateRoute>
            <Template key="1" componentName="Dashboad">
              <Home />
            </Template>
          </PrivateRoute>
        } />
        <Route path="/login" element={
          <Login />
        } />
        <Route path="/dashboad" element={
          <PrivateRoute>
            <Template key="2" componentName="Dashboad">
              <Home />
            </Template>
          </PrivateRoute>
        } />
        <Route path="/Add-Ac" element={
          <PrivateRoute>
            <Template key="3" componentName="Adicionar Novo Ar">
              <Ac />
            </Template>
          </PrivateRoute>
        } />
        <Route path="/Events" element={
          <PrivateRoute>
            <Template key="4" componentName="Eventos">
              <Events />
            </Template>
          </PrivateRoute>
        } />
      </Routes>
    </BrowserRouter>
  )
}
export default App;

// function PrivateRoute({ children }: any) {
//   const auth = isAtheticated();
//   return auth ? children : <Navigate to="/login" />;
// }

// function App(): JSX.Element {
//   jwtInterceptor();
//   return (
//     <BrowserRouter>
//       <Routes>
//         <PrivateRoute>
//           <Template key="1" componentName="Dashboad">
//             <Route path="/" element={<Home />} />
//             <Route path="/login" element={<Login />} />
//             <Route path="/dashboad" element={<Home />} />
//             <Route path="/Add-Ac" element={<Ac />} />
//             <Route path="/Events" element={<Events />} />
//           </Template>
//         </PrivateRoute>
//       </Routes>
//     </BrowserRouter>
//   )
// }

// export default App;