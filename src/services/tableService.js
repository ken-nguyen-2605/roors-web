import apiService from './api';

// ==================== DINING TABLE SERVICES ====================

/**
 * Get available dining tables for a specific date, time, and guest count
 * Endpoint: GET /api/tables/availability
 * @param {string} date - Date in format yyyy-MM-dd
 * @param {string} time - Time in format HH:mm:ss
 * @param {number} numberOfGuests - Number of guests
 */
export const getAvailableDiningTables = async (date, time, numberOfGuests) => {
  const query = new URLSearchParams({ date, time, numberOfGuests }).toString();
  try {
    const response = await apiService.get(`/api/tables/availability?${query}`);
    return response;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

/**
 * Get all dining tables (ADMIN, STAFF only)
 * Endpoint: GET /api/tables
 */
export const getAllDiningTables = async () => {
  try {
    const response = await apiService.get('/api/tables');
    return response;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

/**
 * Get dining table by ID (ADMIN, STAFF only)
 * Endpoint: GET /api/tables/{id}
 * @param {number} id - Table ID
 */
export const getDiningTableById = async (id) => {
  try {
    const response = await apiService.get(`/api/tables/${id}`);
    return response;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

/**
 * Create a new dining table (ADMIN, STAFF only)
 * Endpoint: POST /api/tables
 * @param {Object} tableData - Table details
 * @param {string} tableData.tableName - Table name
 * @param {number} tableData.capacity - Table capacity
 * @param {string} tableData.location - Table location (optional)
 * @param {string} tableData.description - Table description (optional)
 */
export const createDiningTable = async (tableData) => {
  try {
    const response = await apiService.post('/api/tables', tableData);
    return response;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

/**
 * Update a dining table (ADMIN, STAFF only)
 * Endpoint: PATCH /api/tables/{id}
 * @param {number} id - Table ID
 * @param {Object} updateData - Updated table details
 * @param {string} updateData.tableName - Updated table name (optional)
 * @param {number} updateData.capacity - Updated capacity (optional)
 * @param {string} updateData.location - Updated location (optional)
 * @param {string} updateData.description - Updated description (optional)
 * @param {boolean} updateData.isAvailable - Updated availability status (optional)
 */
export const updateDiningTable = async (id, updateData) => {
  try {
    const response = await apiService.patch(`/api/tables/${id}`, updateData);
    return response;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

/**
 * Delete a dining table (ADMIN, STAFF only)
 * Endpoint: DELETE /api/tables/{id}
 * @param {number} id - Table ID
 */
export const deleteDiningTable = async (id) => {
  try {
    const response = await apiService.delete(`/api/tables/${id}`);
    return response;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

// ==================== UTILITY FUNCTIONS ====================

/**
 * Format table capacity
 * @param {number} capacity - Table capacity
 */
export const formatTableCapacity = (capacity) => {
  if (!capacity) return 'N/A';
  return `${capacity} ${capacity === 1 ? 'person' : 'people'}`;
};

/**
 * Get table capacity icon/emoji
 * @param {number} capacity - Table capacity
 */
export const getTableCapacityIcon = (capacity) => {
  if (capacity <= 2) return '👥'; // Small table
  if (capacity <= 4) return '👨‍👩‍👧‍👦'; // Medium table
  if (capacity <= 6) return '👨‍👩‍👧‍👦👨‍👩‍👧‍👦'; // Large table
  return '🏛️'; // Very large table / banquet
};

/**
 * Get table size category
 * @param {number} capacity - Table capacity
 */
export const getTableSizeCategory = (capacity) => {
  if (capacity <= 2) return 'Small';
  if (capacity <= 4) return 'Medium';
  if (capacity <= 6) return 'Large';
  if (capacity <= 8) return 'Extra Large';
  return 'Banquet';
};

/**
 * Get table availability status color
 * @param {boolean} isAvailable - Availability status
 */
export const getTableAvailabilityColor = (isAvailable) => {
  return isAvailable ? 'success' : 'danger';
};

/**
 * Get table availability status text
 * @param {boolean} isAvailable - Availability status
 */
export const getTableAvailabilityText = (isAvailable) => {
  return isAvailable ? 'Available' : 'Unavailable';
};

/**
 * Sort tables by capacity
 * @param {Array} tables - Array of tables
 * @param {string} order - 'asc' or 'desc'
 */
export const sortTablesByCapacity = (tables, order = 'asc') => {
  return [...tables].sort((a, b) => {
    return order === 'asc' ? a.capacity - b.capacity : b.capacity - a.capacity;
  });
};

/**
 * Sort tables by name
 * @param {Array} tables - Array of tables
 * @param {string} order - 'asc' or 'desc'
 */
export const sortTablesByName = (tables, order = 'asc') => {
  return [...tables].sort((a, b) => {
    return order === 'asc'
      ? a.tableName.localeCompare(b.tableName)
      : b.tableName.localeCompare(a.tableName);
  });
};

/**
 * Filter tables by capacity range
 * @param {Array} tables - Array of tables
 * @param {number} minCapacity - Minimum capacity
 * @param {number} maxCapacity - Maximum capacity
 */
export const filterTablesByCapacity = (tables, minCapacity = 0, maxCapacity = Infinity) => {
  return tables.filter(
    (table) => table.capacity >= minCapacity && table.capacity <= maxCapacity
  );
};

/**
 * Filter tables by availability
 * @param {Array} tables - Array of tables
 * @param {boolean} isAvailable - Availability status to filter by
 */
export const filterTablesByAvailability = (tables, isAvailable = true) => {
  return tables.filter((table) => table.isAvailable === isAvailable);
};

/**
 * Filter tables by location
 * @param {Array} tables - Array of tables
 * @param {string} location - Location to filter by
 */
export const filterTablesByLocation = (tables, location) => {
  if (!location) return tables;
  return tables.filter(
    (table) => table.location?.toLowerCase() === location.toLowerCase()
  );
};

/**
 * Get table suitable for guest count
 * @param {Array} tables - Array of tables
 * @param {number} guestCount - Number of guests
 * @param {boolean} exactMatch - Whether to find exact match or minimum capacity
 */
export const getTablesForGuestCount = (tables, guestCount, exactMatch = false) => {
  if (exactMatch) {
    return tables.filter((table) => table.capacity === guestCount);
  }
  return tables.filter((table) => table.capacity >= guestCount);
};

/**
 * Group tables by location
 * @param {Array} tables - Array of tables
 */
export const groupTablesByLocation = (tables) => {
  return tables.reduce((groups, table) => {
    const location = table.location || 'Unspecified';
    if (!groups[location]) {
      groups[location] = [];
    }
    groups[location].push(table);
    return groups;
  }, {});
};

/**
 * Group tables by capacity category
 * @param {Array} tables - Array of tables
 */
export const groupTablesByCapacityCategory = (tables) => {
  return tables.reduce((groups, table) => {
    const category = getTableSizeCategory(table.capacity);
    if (!groups[category]) {
      groups[category] = [];
    }
    groups[category].push(table);
    return groups;
  }, {});
};

/**
 * Get total seating capacity
 * @param {Array} tables - Array of tables
 */
export const getTotalSeatingCapacity = (tables) => {
  return tables.reduce((total, table) => total + (table.capacity || 0), 0);
};

/**
 * Get available seating capacity
 * @param {Array} tables - Array of tables
 */
export const getAvailableSeatingCapacity = (tables) => {
  return tables
    .filter((table) => table.isAvailable)
    .reduce((total, table) => total + (table.capacity || 0), 0);
};

/**
 * Format table location
 * @param {string} location - Table location
 */
export const formatTableLocation = (location) => {
  if (!location) return 'Main Dining Area';
  return location
    .split('_')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ');
};

/**
 * Get table location icon
 * @param {string} location - Table location
 */
export const getTableLocationIcon = (location) => {
  const locationIcons = {
    INDOOR: '🏠',
    OUTDOOR: '🌳',
    PATIO: '☀️',
    TERRACE: '🌆',
    BAR: '🍺',
    PRIVATE_ROOM: '🚪',
    WINDOW: '🪟',
    CORNER: '📐',
  };
  return locationIcons[location?.toUpperCase()] || '🍽️';
};

/**
 * Validate table capacity for guest count
 * @param {number} tableCapacity - Table capacity
 * @param {number} guestCount - Number of guests
 */
export const isTableSuitableForGuests = (tableCapacity, guestCount) => {
  // Allow some flexibility (table can accommodate +/- 1 person)
  return tableCapacity >= guestCount && tableCapacity <= guestCount + 1;
};

// Export default object
const tableService = {
  // API Calls
  getAvailableDiningTables,
  getAllDiningTables,
  getDiningTableById,
  createDiningTable,
  updateDiningTable,
  deleteDiningTable,

  // Utilities
  formatTableCapacity,
  getTableCapacityIcon,
  getTableSizeCategory,
  getTableAvailabilityColor,
  getTableAvailabilityText,
  sortTablesByCapacity,
  sortTablesByName,
  filterTablesByCapacity,
  filterTablesByAvailability,
  filterTablesByLocation,
  getTablesForGuestCount,
  groupTablesByLocation,
  groupTablesByCapacityCategory,
  getTotalSeatingCapacity,
  getAvailableSeatingCapacity,
  formatTableLocation,
  getTableLocationIcon,
  isTableSuitableForGuests,
};

export default tableService;