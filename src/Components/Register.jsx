import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import authService from '../services/authService';

export default function Register() {
const navigate = useNavigate();

const [formData, setFormData] = useState({
username: '',
email: '',
password: '',
role: 'CARRIER_PARTNER',
});

const [error, setError] = useState('');
const [loading, setLoading] = useState(false);

const handleChange = (e) => {
setFormData({
...formData,
[e.target.name]: e.target.value,
});
setError('');
};

const handleSubmit = async (e) => {
e.preventDefault();
setError('');
setLoading(true);


try {
  await authService.register(formData);
  navigate('/login');
} catch (err) {
  setError(
    err.response?.data?.message ||
    err.response?.data ||
    'Registration failed'
  );
} finally {
  setLoading(false);
}


};

return ( <div className="login-page"> <div className="login-card"> <h1>DockDash</h1> <p>Create your account</p>


    {error && <div className="error-box">{error}</div>}

    <form onSubmit={handleSubmit}>
      <input
        type="text"
        name="username"
        placeholder="Enter username"
        value={formData.username}
        onChange={handleChange}
        required
      />

      <input
        type="email"
        name="email"
        placeholder="Enter email"
        value={formData.email}
        onChange={handleChange}
        required
      />

      <input
        type="password"
        name="password"
        placeholder="Enter password"
        value={formData.password}
        onChange={handleChange}
        required
      />

      <select
        name="role"
        value={formData.role}
        onChange={handleChange}
        required
      >
        <option value="CARRIER_PARTNER">Carrier Partner</option>
        <option value="WAREHOUSE_OPERATIVE">Warehouse Operative</option>
        <option value="DOCK_MANAGER">Dock Manager</option>
        <option value="LOGISTICS_COORDINATOR">
          Logistics Coordinator
        </option>
      </select>

      <button
        type="submit"
        className="login-btn"
        disabled={loading}
      >
        {loading ? 'Creating Account...' : 'Register'}
      </button>
    </form>

    <div className="register-link">
      Already have an account?{' '}
      <button
        type="button"
        onClick={() => navigate('/login')}
      >
        Login
      </button>
    </div>
  </div>
</div>


);
}
