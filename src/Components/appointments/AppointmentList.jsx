import React, { useCallback, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
fetchAppointments,
setFilterStatus,
} from '../../store/slices/appointmentSlice';
import appointmentService from '../../services/appointmentService';
import SearchFilterBar from '../common/SearchFilterBar';
import EmptyState from '../common/EmptyState';
import Pagination from '../common/Pagination';
import AppointmentForm from './AppointmentForm';
import ActivityLogModal from './ActivityLogModal';

const STATUS_OPTIONS = [
'SCHEDULED',
'CHECKED_IN',
'LOADING',
'COMPLETED',
'CANCELLED',
];

const ITEMS_PER_PAGE = 5;

export default function AppointmentList() {
const dispatch = useDispatch();

const user = useSelector((state) => state.auth.user);

const {
items,
filterStatus,
loading,
} = useSelector((state) => state.appointments);

const [searchTerm, setSearchTerm] = useState('');
const [showForm, setShowForm] = useState(false);
const [activeLogAppointment, setActiveLogAppointment] = useState(null);
const [currentPage, setCurrentPage] = useState(1);

const refreshAppointments = useCallback(async () => {
try {
await dispatch(fetchAppointments()).unwrap();
} catch (err) {
console.error('Failed to refresh appointments:', err);
}
}, [dispatch]);

useEffect(() => {
refreshAppointments();
}, [refreshAppointments]);

useEffect(() => {
setCurrentPage(1);
}, [searchTerm, filterStatus]);

const filteredItems = (Array.isArray(items) ? items : []).filter(
(app) => {
const matchesStatus =
filterStatus === 'ALL' ||
app.status === filterStatus;


  const term = searchTerm.toLowerCase();

  const carrierName =
    app.shipment?.carrierName?.toLowerCase() || '';

  const shipmentNumber =
    app.shipment?.shipmentNumber?.toLowerCase() || '';

  const matchesSearch =
    carrierName.includes(term) ||
    shipmentNumber.includes(term);

  return matchesStatus && matchesSearch;
}


);

const paginatedItems = filteredItems.slice(
(currentPage - 1) * ITEMS_PER_PAGE,
currentPage * ITEMS_PER_PAGE
);

const handleCheckIn = async (id) => {
try {
await appointmentService.checkIn(id);
await refreshAppointments();
} catch (err) {
console.error('Check-in failed:', err);
}
};

const handleComplete = async (id) => {
try {
await appointmentService.complete(id);
await refreshAppointments();
} catch (err) {
console.error('Complete appointment failed:', err);
}
};

return ( <div className="appointment-list-page"> <h1>Scheduling & Check-In</h1>


  {(user?.role === 'LOGISTICS_COORDINATOR' ||
    user?.role === 'CARRIER_PARTNER') && (
    <button
      className="btn-primary"
      onClick={() => setShowForm(true)}
    >
      + New Appointment
    </button>
  )}

  <SearchFilterBar
    placeholder="Search by carrier or shipment #..."
    filterOptions={STATUS_OPTIONS}
    onSearchChange={setSearchTerm}
    onFilterChange={(val) =>
      dispatch(setFilterStatus(val))
    }
  />

  {loading ? (
    <p>Loading appointments...</p>
  ) : filteredItems.length === 0 ? (
    <EmptyState message="No appointments scheduled." />
  ) : (
    <>
      <table>
        <thead>
          <tr>
            <th>Carrier</th>
            <th>Bay</th>
            <th>Scheduled</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>

        <tbody>
          {paginatedItems.map((app) => (
            <tr key={app.id}>
              <td>
                {app.shipment?.carrierName} (#
                {app.shipment?.shipmentNumber})
              </td>

              <td>
                {app.bay?.bayNumber}
              </td>

              <td>
                {new Date(
                  app.scheduledStart
                ).toLocaleString()}
              </td>

              <td>
                <span
                  className={`status-pill ${app.status?.toLowerCase()}`}
                >
                  {app.status}
                </span>
              </td>

              <td>
                {app.status === 'SCHEDULED' &&
                  (user?.role === 'CARRIER_PARTNER' ||
                    user?.role === 'DOCK_MANAGER') && (
                    <button
                      className="btn-small btn-primary"
                      onClick={() =>
                        handleCheckIn(app.id)
                      }
                    >
                      Check In
                    </button>
                  )}

                {(app.status === 'CHECKED_IN' ||
                  app.status === 'LOADING') &&
                  (user?.role === 'DOCK_MANAGER' ||
                    user?.role === 'WAREHOUSE_OPERATIVE') && (
                    <button
                      className="btn-small btn-success"
                      onClick={() =>
                        handleComplete(app.id)
                      }
                    >
                      Complete
                    </button>
                  )}

                <button
                  className="btn-small btn-secondary"
                  onClick={() =>
                    setActiveLogAppointment(app)
                  }
                >
                  View Log
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <Pagination
        currentPage={currentPage}
        totalItems={filteredItems.length}
        itemsPerPage={ITEMS_PER_PAGE}
        onPageChange={setCurrentPage}
      />
    </>
  )}

  {showForm && (
    <AppointmentForm
      onClose={() => setShowForm(false)}
      onRefresh={refreshAppointments}
    />
  )}

  {activeLogAppointment && (
    <ActivityLogModal
      appointment={activeLogAppointment}
      onClose={() =>
        setActiveLogAppointment(null)
      }
    />
  )}
</div>


);
}
