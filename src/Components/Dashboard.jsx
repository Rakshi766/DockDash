import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, Navigate } from 'react-router-dom';
import { fetchAppointments } from '../store/slices/appointmentSlice';
import StatCards from './dashboard/StatCards';

export default function Dashboard() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useSelector((state) => state.auth.user);

  useEffect(() => {
    if (user) {
      dispatch(fetchAppointments());
    }
  }, [dispatch, user]);

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="dashboard-page">
      <h1>Operational Overview</h1>

      <div className="welcome-banner">
        <p>Welcome back, {user?.username}</p>
        <p>Logged in as: {user?.role.replace('_', ' ')}</p>
      </div>

      {user.role !== 'CARRIER_PARTNER' && <StatCards />}

      <div className="dashboard-grid">
        <button className="btn-primary" onClick={() => navigate('/appointments')}>
          View Appointments
        </button>
        <button className="btn-secondary" onClick={() => navigate('/bays')}>
          Monitor Bays
        </button>
      </div>
    </div>
  );
}