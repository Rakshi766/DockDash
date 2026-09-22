import React from 'react';

export default function SearchFilterBar({ onSearchChange, onFilterChange, placeholder, filterOptions }) {
  return (
    <div className="search-filter-bar">
      <input
        type="text"
        placeholder={placeholder}
        className="search-input"
        onChange={(e) => onSearchChange(e.target.value)}
      />
      {filterOptions && (
        <select className="filter-select" onChange={(e) => onFilterChange(e.target.value)}>
          <option value="ALL">All Statuses</option>
          {filterOptions.map((opt) => (
            <option key={opt} value={opt}>
              {opt}
            </option>
          ))}
        </select>
      )}
    </div>
  );
}