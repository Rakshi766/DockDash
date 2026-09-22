import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchBays, setSearchQuery } from '../../store/slices/baySlice';
import bayService from '../../services/bayService';
import SearchFilterBar from '../common/SearchFilterBar';
import EmptyState from '../common/EmptyState';
import Pagination from '../common/Pagination';
import BayForm from './BayForm';

const BAY_STATUSES = ['AVAILABLE', 'OCCUPIED', 'MAINTENANCE', 'RESERVED'];
const ITEMS_PER_PAGE = 5;

export default function BayList() {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.user);
  const { items, searchQuery } = useSelector((state) => state.bays);
  const [showForm, setShowForm] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    dispatch(fetchBays());
  }, [dispatch]);

  const filteredItems = items.filter((bay) =>
    bay.bayNumber.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const paginatedItems = filteredItems.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const handleStatusChange = async (id, status) => {
    await bayService.updateStatus(id, status);
    dispatch(fetchBays());
  };

  const canManage = user.role === 'LOGISTICS_COORDINATOR' || user.role === 'DOCK_MANAGER';

  return (
    <div className="bay-list-page">
      <h1>Bay Management</h1>

      {user.role === 'LOGISTICS_COORDINATOR' && (
        <button className="btn-primary" onClick={() => setShowForm(true)}>
          + Register Bay
        </button>
      )}

      <SearchFilterBar
        placeholder="Filter by bay identifier..."
        onSearchChange={(val) => dispatch(setSearchQuery(val))}
      />

      {filteredItems.length === 0 ? (
        <EmptyState message="No loading bays registered in the system." />
      ) : (
        <>
          <table>
            <thead>
              <tr>
                <th>Bay Identifier</th>
                <th>Classification</th>
                <th>Utilization (Weight)</th>
                <th>Status</th>
                <th>Controls</th>
              </tr>
            </thead>
            <tbody>
              {paginatedItems.map((bay) => {
                const pct = Math.min(100, (bay.currentWeight / bay.maxWeightCapacity) * 100);
                return (
                  <tr key={bay.id}>
                    <td>
                      <span className="bay-name">{bay.bayNumber}</span>
                    </td>
                    <td>{bay.bayType}</td>
                    <td>
                      <div className="capacity-monitor">
                        <div className="fill-bar" style={{ width: `${pct}%` }} />
                        <span className="capacity-label">
                          {bay.currentWeight} / {bay.maxWeightCapacity} kg
                        </span>
                      </div>
                    </td>
                    <td>
                      <span className={`status-pill ${bay.status.toLowerCase()}`}>{bay.status}</span>
                    </td>
                    <td>
                      {canManage && (
                        <select
                          value={bay.status}
                          onChange={(e) => handleStatusChange(bay.id, e.target.value)}
                        >
                          {BAY_STATUSES.map((s) => (
                            <option key={s} value={s}>
                              {s}
                            </option>
                          ))}
                        </select>
                      )}
                    </td>
                  </tr>
                );
              })}
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
        <BayForm onClose={() => setShowForm(false)} onRefresh={() => dispatch(fetchBays())} />
      )}
    </div>
  );
}