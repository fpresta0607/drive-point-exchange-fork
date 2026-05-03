'use client';
 
import React, { useState, useMemo } from 'react';
import { motion, useReducedMotion } from 'framer-motion';

export interface FilterConfig {
  key: string;
  label: string;
  type: 'boolean' | 'select' | 'text';
  options?: Array<{ value: string; label: string }>;
}

interface LeadsTableProps {
  data: Record<string, unknown>[];
  columns: Array<{
    key: string;
    label: string;
    render?: (value: unknown, row: Record<string, unknown>) => React.ReactNode;
  }>;
  searchPlaceholder?: string;
  onExport?: () => void;
  filters?: FilterConfig[];
}

export default function LeadsTable({ 
  data, 
  columns, 
  searchPlaceholder = "Search...",
  onExport,
  filters = []
}: LeadsTableProps) {
  const prefersReducedMotion = useReducedMotion();
  const [searchTerm, setSearchTerm] = useState('');
  const [sortField, setSortField] = useState<string | null>(null);
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  
  // Compute initial filter values from filters prop
  const initialFilterValues = useMemo(() => {
    const initial: Record<string, string> = {};
    filters.forEach(filter => {
      if (filter.type === 'boolean') {
        initial[filter.key] = 'all';
      } else {
        initial[filter.key] = '';
      }
    });
    return initial;
  }, [filters]);
  
  const [filterValues, setFilterValues] = useState<Record<string, string>>(initialFilterValues);

  // Reset filters when filters prop changes (e.g., when switching tabs)
  // Use a key based on filter keys to detect actual changes
  const filterKey = filters.map(f => f.key).join(',');
  const [prevFilterKey, setPrevFilterKey] = useState(filterKey);
  
  if (filterKey !== prevFilterKey) {
    setPrevFilterKey(filterKey);
    setFilterValues(initialFilterValues);
  }

  // Apply field filters first
  const fieldFilteredData = data.filter(row => {
    return filters.every(filter => {
      const filterValue = filterValues[filter.key];
      
      // Skip if no filter is applied
      if (!filterValue || filterValue === '' || filterValue === 'all') {
        return true;
      }

      const rowValue = row[filter.key];

      if (filter.type === 'boolean') {
        if (filterValue === 'true') {
          return rowValue === true;
        } else if (filterValue === 'false') {
          return rowValue === false || rowValue === null || rowValue === undefined;
        }
        return true;
      }

      // For other filter types, extend as needed
      return true;
    });
  });

  // Filter data based on search term (applied after field filters)
  const filteredData = fieldFilteredData.filter(row =>
    columns.some(col => {
      const value = row[col.key];
      return value && value.toString().toLowerCase().includes(searchTerm.toLowerCase());
    })
  );

  // Sort data
  const sortedData = [...filteredData].sort((a, b) => {
    if (!sortField) return 0;
    
    const aValue = a[sortField];
    const bValue = b[sortField];
    
    // Handle null/undefined values
    if (aValue == null && bValue == null) return 0;
    if (aValue == null) return sortDirection === 'asc' ? -1 : 1;
    if (bValue == null) return sortDirection === 'asc' ? 1 : -1;
    
    // Convert to strings for comparison
    const aStr = String(aValue);
    const bStr = String(bValue);
    
    if (aStr < bStr) return sortDirection === 'asc' ? -1 : 1;
    if (aStr > bStr) return sortDirection === 'asc' ? 1 : -1;
    return 0;
  });

  const handleSort = (field: string) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const handleFilterChange = (filterKey: string, value: string) => {
    setFilterValues(prev => ({
      ...prev,
      [filterKey]: value
    }));
  };

  const clearAllFilters = () => {
    const clearedFilters: Record<string, string> = {};
    filters.forEach(filter => {
      if (filter.type === 'boolean') {
        clearedFilters[filter.key] = 'all';
      } else {
        clearedFilters[filter.key] = '';
      }
    });
    setFilterValues(clearedFilters);
    setSearchTerm('');
  };

  const activeFilterCount = filters.reduce((count, filter) => {
    const value = filterValues[filter.key];
    if (filter.type === 'boolean' && value && value !== 'all') {
      return count + 1;
    } else if (filter.type !== 'boolean' && value && value !== '') {
      return count + 1;
    }
    return count;
  }, 0) + (searchTerm ? 1 : 0);

  return (
    <div className="bg-white shadow-lg rounded-lg overflow-hidden">
      {/* Header with filters, search and export */}
      <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
        {/* Filters */}
        {filters.length > 0 && (
          <div className="mb-4 pb-4 border-b border-gray-200">
            <div className="flex flex-wrap items-center gap-4">
              <span className="text-sm font-medium text-gray-700">Filters:</span>
              {filters.map((filter) => (
                <div key={filter.key} className="flex items-center gap-2">
                  <label className="text-sm text-gray-600 whitespace-nowrap">
                    {filter.label}:
                  </label>
                  {filter.type === 'boolean' ? (
                    <select
                      value={filterValues[filter.key] || 'all'}
                      onChange={(e) => handleFilterChange(filter.key, e.target.value)}
                      className="px-3 py-1.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent text-sm"
                    >
                      <option value="all">All</option>
                      <option value="true">Agent</option>
                      <option value="false">Not Agent</option>
                    </select>
                  ) : (
                    <input
                      type="text"
                      value={filterValues[filter.key] || ''}
                      onChange={(e) => handleFilterChange(filter.key, e.target.value)}
                      placeholder={`Filter by ${filter.label}...`}
                      className="px-3 py-1.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent text-sm"
                    />
                  )}
                </div>
              ))}
              {(activeFilterCount > 0 || searchTerm) && (
                <button
                  onClick={clearAllFilters}
                  className="px-3 py-1.5 text-sm text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-lg transition-colors duration-200"
                >
                  Clear All ({activeFilterCount})
                </button>
              )}
            </div>
          </div>
        )}
        
        {/* Search and Export */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex-1">
            <input
              type="text"
              placeholder={searchPlaceholder}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent"
            />
          </div>
          {onExport && (
            <button
              onClick={onExport}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 flex items-center gap-2"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              Export CSV
            </button>
          )}
        </div>
        <div className="mt-2 text-sm text-gray-600">
          Showing {sortedData.length} of {data.length} leads
          {activeFilterCount > 0 && (
            <span className="ml-2 text-blue-600">
              ({activeFilterCount} filter{activeFilterCount !== 1 ? 's' : ''} active)
            </span>
          )}
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              {columns.map((column) => (
                <th
                  key={column.key}
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                  onClick={() => handleSort(column.key)}
                >
                  <div className="flex items-center gap-2">
                    {column.label}
                    {sortField === column.key && (
                      <span className="text-blue-600">
                        {sortDirection === 'asc' ? '↑' : '↓'}
                      </span>
                    )}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {sortedData.map((row, index) => (
              <motion.tr
                key={String(row.id ?? index)}
                initial={prefersReducedMotion ? false : { opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={prefersReducedMotion ? { duration: 0 } : { duration: 0.2, delay: index * 0.05 }}
                className="hover:bg-gray-50"
              >
                {columns.map((column) => (
                  <td key={column.key} className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {column.render ? column.render(row[column.key], row) : String(row[column.key] ?? '')}
                  </td>
                ))}
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>

      {sortedData.length === 0 && (
        <div className="text-center py-12">
          <div className="text-gray-500 text-lg">No leads found</div>
          <div className="text-gray-400 text-sm mt-2">
            {searchTerm ? 'Try adjusting your search terms' : 'No data available'}
          </div>
        </div>
      )}
    </div>
  );
}
