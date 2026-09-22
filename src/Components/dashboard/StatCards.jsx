import React, { useEffect, useState } from 'react';
import analyticsService from '../../services/analyticsService';

export default function StatCards() {
  const [stats, setStats] = useState(null);

  useEffect(() => {
    analyticsService.getDashboardStats().then(setStats);
  }, []);

  if (!stats) {
    return <div className="loading-stats">Loading metrics...</div>;
  }

  return (
    <div className="stat-cards-row">
      <div className="stat-card">
        <span className="stat-label">Total Appointments</span>
        <span className="stat-value">{stats.totalAppointments}</span>
      </div>
      <div className="stat-card">
        <span className="stat-label">Active Loadings</span>
        <span className="stat-value">{stats.activeLoadings}</span>
      </div>
      <div className="stat-card">
        <span className="stat-label">Pending Review</span>
        <span className="stat-value">{stats.pendingLogs}</span>
      </div>
      <div className="stat-card">
        <span className="stat-label">Available Bays</span>
        <span className="stat-value">{stats.availableBays}</span>
      </div>
    </div>
  );
}