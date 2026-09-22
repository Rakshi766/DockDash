import React from 'react';
import { useSelector } from 'react-redux';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './App.css';

import Navbar from './Components/layout/NavBar';
import Dashboard from './Components/Dashboard';
import Login from './Components/Login';
import Register from './Components/Register';
import AppointmentList from './Components/appointments/AppointmentList';
import BayList from './Components/bays/BayList';
import ShipmentList from './Components/shipments/ShipmentList';

function AppShell() {
  const user = useSelector((state) => state.auth.user);

  return (
    <BrowserRouter>
      {user && <Navbar />}

      <main className="main-content">
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/appointments" element={<AppointmentList />} />
          <Route path="/bays" element={<BayList />} />
          <Route path="/shipments" element={<ShipmentList />} />
        </Routes>
      </main>
    </BrowserRouter>
  );
}

export default function App() {
  return <AppShell />;
}