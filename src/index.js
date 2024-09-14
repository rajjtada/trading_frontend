import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import reportWebVitals from './reportWebVitals';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import Login from './components/login/login';
import Navigation from './components/Navigation/navigation';
import Dashboard from './components/Dashboard/dashboard';
import AuthWrapper from './components/AuthWrapper/AuthWrapper'; 
import StockWatchlist from './components/Websocket/Shoonya/AddRemoveWatchlist';
import WebSocketComponent from './components/Websocket/Shoonya/temp';

const router = createBrowserRouter([
  {
    path: "/",
    element:<Login />
  },
  {
    path: "/temp",
    element:<WebSocketComponent />
  },
  {
    path: "/dashboard",
    // element: <AuthWrapper><div> <Dashboard/></div></AuthWrapper>
    element: <div> <Dashboard/></div>
  },
  {
    path: "/watchlist",
    // element: <AuthWrapper><div><Navigation/> <StockWatchlist/></div></AuthWrapper>
    element: <div><Navigation/> <StockWatchlist/></div>
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