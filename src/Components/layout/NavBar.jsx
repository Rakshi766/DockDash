import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import { logout } from '../../store/slices/authSlice';

export default function Navbar() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useSelector((state) => state.auth.user);

  if (!user) return null;

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  return (
    <nav className="navbar" role="navigation">
      <div className="nav-container">
        <div className="nav-brand">DockDash</div>

        <div className="nav-links">
          <Link to="/">Dashboard</Link>
          <Link to="/appointments">Appointments</Link>
          {user.role !== 'CARRIER_PARTNER' && <Link to="/bays">Bays</Link>}
          {user.role === 'LOGISTICS_COORDINATOR' && <Link to="/shipments">Shipments</Link>}
        </div>

        <div className="nav-user">
          <span>Welcome, {user.username}</span>
          <button className="logout-btn" onClick={handleLogout}>
            Logout
          </button>
        </div>
      </div>
    </nav>
  );
}