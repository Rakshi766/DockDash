import React, { useEffect, useState } from 'react';
import bayService from '../../services/bayService';
import shipmentService from '../../services/shipmentService';
import appointmentService from '../../services/appointmentService';

export default function AppointmentForm({ onClose, onRefresh }) {
const [bays, setBays] = useState([]);
const [shipments, setShipments] = useState([]);
const [error, setError] = useState('');
const [loading, setLoading] = useState(true);

const [formData, setFormData] = useState({
shipmentId: '',
bayId: '',
scheduledStart: '',
scheduledEnd: '',
});

useEffect(() => {
const loadData = async () => {
setLoading(true);


  try {
    const bayData = await bayService.getAll();

    setBays(
      (Array.isArray(bayData) ? bayData : []).filter(
        (b) =>
          b.status !== 'MAINTENANCE' &&
          Number(b.currentWeight || 0) <
            Number(b.maxWeightCapacity || 0)
      )
    );
  } catch (err) {
    console.error('Bay API error:', err);
    setError('Failed to load loading bays');
  }

  try {
    const shipmentData = await shipmentService.getAll({ available: true });

    setShipments(
      Array.isArray(shipmentData) ? shipmentData : []
    );
  } catch (err) {
    console.error('Shipment API error:', err);
    setError('Failed to load shipments');
  }

  setLoading(false);
};

loadData();


}, []);

const handleChange = (e) => {
setFormData({
...formData,
[e.target.name]: e.target.value,
});


setError('');


};

const handleSubmit = async (e) => {
e.preventDefault();


if (
  !formData.shipmentId ||
  !formData.bayId ||
  !formData.scheduledStart ||
  !formData.scheduledEnd
) {
  setError('Please fill in all required fields');
  return;
}

try {
  await appointmentService.book(formData);

  if (typeof onRefresh === 'function') {
    onRefresh();
  }

  onClose();
} catch (err) {
  setError(
    err.response?.data?.message ||
    err.response?.data ||
    'Failed to schedule appointment'
  );
}


};

return ( <div className="modal-overlay"> <div className="modal-content"> <h2>Schedule New Appointment</h2>


    {error && <div className="error-msg">{error}</div>}

    {loading && <p>Loading shipments and loading bays...</p>}

    <form onSubmit={handleSubmit}>
      <label htmlFor="shipmentId">
        Carrier Shipment *
      </label>

      <select
        id="shipmentId"
        name="shipmentId"
        value={formData.shipmentId}
        onChange={handleChange}
        required
      >
        <option value="">Select Shipment</option>

        {shipments.map((s) => (
          <option key={s.id} value={s.id}>
            {s.carrierName} - {s.shipmentNumber}
          </option>
        ))}
      </select>

      {!loading && shipments.length === 0 && (
        <p className="error-msg">
          No shipments available. Please create a shipment first.
        </p>
      )}

      <label htmlFor="bayId">
        Loading Bay *
      </label>

      <select
        id="bayId"
        name="bayId"
        value={formData.bayId}
        onChange={handleChange}
        required
      >
        <option value="">Select Loading Bay</option>

        {bays.map((b) => (
          <option key={b.id} value={b.id}>
            {b.bayNumber} ({b.bayType})
          </option>
        ))}
      </select>

      {!loading && bays.length === 0 && (
        <p className="error-msg">
          No available loading bays.
        </p>
      )}

      <label htmlFor="scheduledStart">
        Scheduled Start *
      </label>

      <input
        id="scheduledStart"
        name="scheduledStart"
        type="datetime-local"
        value={formData.scheduledStart}
        onChange={handleChange}
        required
      />

      <label htmlFor="scheduledEnd">
        Scheduled End *
      </label>

      <input
        id="scheduledEnd"
        name="scheduledEnd"
        type="datetime-local"
        value={formData.scheduledEnd}
        onChange={handleChange}
        required
      />

      <button type="submit">
        Confirm Schedule
      </button>

      <button
        type="button"
        className="btn-secondary"
        onClick={onClose}
      >
        Cancel
      </button>
    </form>
  </div>
</div>


);
}
