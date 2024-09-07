import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import reportWebVitals from './reportWebVitals';
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import Login from './components/login/login';
import Navigation from './components/Navigation/navigation';
import Dashboard from './components/Dashboard/dashboard';
import AuthWrapper from './components/AuthWrapper/AuthWrapper'; 

const router = createBrowserRouter([
  {
    path: "/",
    element:<Login />
  },
  {
    path: "/dashboard",
    // element: <AuthWrapper><div><Navigation /> <Dashboard/></div></AuthWrapper>
    element: <div> <Dashboard/></div>
  },
  {
    path: "*",
    element: <div>404 not found</div>
  },
]);

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);

reportWebVitals();