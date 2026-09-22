import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchShipments } from '../../store/slices/shipmentSlice';
import userService from '../../services/userService';
import shipmentService from '../../services/shipmentService';
import EmptyState from '../common/EmptyState';
import Pagination from '../common/Pagination';

const ITEMS_PER_PAGE = 5;

function ShipmentForm({ carriers, onClose, onRefresh }) {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    shipmentNumber: '',
    carrierName: '',
    totalUnits: '',
    estimatedWeight: '',
    hazardousMaterial: false,
  });

  const handleChange = (e) => {
    const { name, type, checked, value } = e.target;
    setFormData({ ...formData, [name]: type === 'checkbox' ? checked : value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await shipmentService.create(formData);
      onRefresh();
      onClose();
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>Register New Shipment</h2>
        <form onSubmit={handleSubmit}>
          <label htmlFor="shipmentNumber">Shipment Number *</label>
          <input
            id="shipmentNumber"
            name="shipmentNumber"
            type="text"
            placeholder="e.g. SHIP-12345"
            value={formData.shipmentNumber}
            onChange={handleChange}
            required
          />

          <label htmlFor="carrierName">Carrier Name *</label>
          <select
            id="carrierName"
            name="carrierName"
            value={formData.carrierName}
            onChange={handleChange}
            required
          >
            <option value="">Select Carrier</option>
            {carriers.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>

          <label htmlFor="totalUnits">Total Units *</label>
          <input
            id="totalUnits"
            name="totalUnits"
            type="number"
            value={formData.totalUnits}
            onChange={handleChange}
            required
          />

          <label htmlFor="estimatedWeight">Estimated Weight (kg)*</label>
          <input
            id="estimatedWeight"
            name="estimatedWeight"
            type="number"
            placeholder="e.g. 500.00"
            value={formData.estimatedWeight}
            onChange={handleChange}
          />

          <label>
            <input
              type="checkbox"
              name="hazardousMaterial"
              checked={formData.hazardousMaterial}
              onChange={handleChange}
            />
            Contains Hazardous Material
          </label>

          <button type="submit" className="btn-primary" disabled={loading}>
            Register Shipment
          </button>
          <button type="button" className="btn-secondary" onClick={onClose}>
            Cancel
          </button>
        </form>
      </div>
    </div>
  );
}

export default function ShipmentList() {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.user);
  const { items } = useSelector((state) => state.shipments);
  const [carriers, setCarriers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    dispatch(fetchShipments());
    userService.getCarriers().then(setCarriers);
  }, [dispatch]);

  const filteredItems = items.filter((s) => {
    const term = searchTerm.toLowerCase();
    return (
      s.shipmentNumber.toLowerCase().includes(term) || s.carrierName.toLowerCase().includes(term)
    );
  });

  const paginatedItems = filteredItems.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  return (
    <div className="shipment-list-page">
      <h1>Shipment Registry</h1>

      {user.role === 'LOGISTICS_COORDINATOR' && (
        <button className="btn-primary" onClick={() => setShowForm(true)}>
          + Register Shipment
        </button>
      )}

      <input
        type="text"
        placeholder="Search by shipment # or carrier..."
        className="search-input"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />

      {items.length === 0 ? (
        <EmptyState message="No shipments registered." />
      ) : (
        <>
          <table>
            <thead>
              <tr>
                <th>Shipment #</th>
                <th>Carrier</th>
                <th>Units</th>
                <th>Priority</th>
                <th>Hazmat</th>
              </tr>
            </thead>
            <tbody>
              {paginatedItems.map((s) => (
                <tr key={s.id}>
                  <td>
                    <strong>{s.shipmentNumber}</strong>
                  </td>
                  <td>{s.carrierName}</td>
                  <td>{s.totalUnits}</td>
                  <td>
                    <span className={`priority-pill ${s.priority.toLowerCase()}`}>{s.priority}</span>
                  </td>
                  <td>{s.hazardousMaterial ? 'Yes' : 'No'}</td>
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
        <ShipmentForm
          carriers={carriers}
          onClose={() => setShowForm(false)}
          onRefresh={() => dispatch(fetchShipments())}
        />
      )}
    </div>
  );
}