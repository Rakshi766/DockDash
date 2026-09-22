import React, { useState } from 'react';
import bayService from '../../services/bayService';

export default function BayForm({ onClose, onRefresh }) {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    bayNumber: '',
    bayType: 'INBOUND',
    maxWeightCapacity: '',
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await bayService.create(formData);
      onRefresh();
      onClose();
    } catch (err) {
      alert('Failed to create bay. Check if bay number is unique.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>Register New Loading Bay</h2>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            name="bayNumber"
            placeholder="e.g., BAY-101"
            value={formData.bayNumber}
            onChange={handleChange}
            required
          />

          <select name="bayType" value={formData.bayType} onChange={handleChange}>
            <option value="INBOUND">Inbound (Receiving)</option>
            <option value="OUTBOUND">Outbound (Shipping)</option>
            <option value="COLD_STORAGE">Cold Storage</option>
          </select>

          <input
            type="number"
            name="maxWeightCapacity"
            placeholder="e.g., 10000"
            value={formData.maxWeightCapacity}
            onChange={handleChange}
            required
          />

          <button type="submit" className="btn-primary" disabled={loading}>
            {loading ? 'Processing...' : 'Register Bay'}
          </button>
          <button type="button" className="btn-secondary" onClick={onClose}>
            Cancel
          </button>
        </form>
      </div>
    </div>
  );
}