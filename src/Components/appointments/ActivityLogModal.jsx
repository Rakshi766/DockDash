import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import activityService from '../../services/activityService';

const OPERATIVE_OPTIONS = [
  { value: 'LOADING_PROGRESS', label: 'Loading Progress' },
  { value: 'UNLOADING_PROGRESS', label: 'Unloading Progress' },
  { value: 'SCANNING_PALLETS', label: 'Scanning Pallets' },
];

const MANAGER_OPTIONS = [
  { value: 'INSPECTION_PASSED', label: 'Inspection Passed' },
  { value: 'INSPECTION_FAILED', label: 'Inspection Failed' },
  { value: 'ISSUE_REPORTED', label: 'Issue Reported' },
  { value: 'CANCEL_APPOINTMENT', label: 'Cancel Appointment' },
];

export default function ActivityLogModal({ appointment, onClose }) {
  const user = useSelector((state) => state.auth.user);
  const [logs, setLogs] = useState([]);
  const [activityType, setActivityType] = useState('');
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(false);

  const options = user.role === 'WAREHOUSE_OPERATIVE' ? OPERATIVE_OPTIONS : MANAGER_OPTIONS;
  const isLocked = appointment.status === 'COMPLETED' || appointment.status === 'CANCELLED';
  const canApprove = user.role === 'DOCK_MANAGER' || user.role === 'LOGISTICS_COORDINATOR';

  const loadLogs = () => {
    activityService.getLogs(appointment.id).then(setLogs);
  };

  useEffect(() => {
    loadLogs();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [appointment.id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await activityService.logActivity({
        appointmentId: appointment.id,
        activityType,
        notes,
      });
      setNotes('');
      setActivityType('');
      loadLogs();
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (logId) => {
    await activityService.approveLog(logId);
    loadLogs();
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>Activity Log: #{appointment.shipment.shipmentNumber}</h2>

        {isLocked ? (
          <div className="locked-banner">
            🔒 This appointment is {appointment.status}. Logging is disabled.
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            <select value={activityType} onChange={(e) => setActivityType(e.target.value)} required>
              <option value="">Select Activity Type</option>
              {options.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
            <textarea
              placeholder="Details of the activity..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              required
            />
            <button type="submit" className="btn-submit" disabled={loading}>
              {loading ? 'Logging...' : 'Add Log Entry'}
            </button>
          </form>
        )}

        <h3>Recent History</h3>
        <div className="logs-feed">
          {logs.map((log) => (
            <div className="feed-item" key={log.id}>
              <span>{log.activityType.replace(/_/g, ' ')}</span>
              <span>{new Date(log.timestamp).toLocaleTimeString()}</span>
              <p>{log.notes}</p>
              <span>{log.performedBy?.username}</span>
              <span className={log.approved ? 'badge-approved' : 'badge-pending'}>
                {log.approved ? 'Approved' : 'Pending Review'}
              </span>
              {canApprove && !log.approved && (
                <button className="btn-approve" onClick={() => handleApprove(log.id)}>
                  Accept Log
                </button>
              )}
            </div>
          ))}
        </div>

        <button className="btn-secondary" onClick={onClose}>
          Close
        </button>
      </div>
    </div>
  );
}