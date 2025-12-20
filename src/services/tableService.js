import apiService from './api';

// ==================== DINING TABLE SERVICES ====================

export const getAvailableDiningTables = async (date, time, numberOfGuests) => {
  // Axios automatically serializes params, no need for URLSearchParams
  return apiService.get('/api/tables/availability', {
    params: { date, time, numberOfGuests }
  });
};

export const getAllDiningTables = async () => {
  return apiService.get('/api/tables');
};

export const getDiningTableById = async (id) => {
  return apiService.get(`/api/tables/${id}`);
};

export const createDiningTable = async (tableData) => {
  return apiService.post('/api/tables', tableData);
};

export const updateDiningTable = async (id, updateData) => {
  return apiService.patch(`/api/tables/${id}`, updateData);
};

export const deleteDiningTable = async (id) => {
  return apiService.delete(`/api/tables/${id}`);
};

// ==================== UTILITY FUNCTIONS (Unchanged) ====================

export const formatTableCapacity = (capacity) => {
  if (!capacity) return 'N/A';
  return `${capacity} ${capacity === 1 ? 'person' : 'people'}`;
};

export const getTableCapacityIcon = (capacity) => {
  if (capacity <= 2) return '👥';
  if (capacity <= 4) return '👨‍👩‍👧‍👦';
  if (capacity <= 6) return '👨‍👩‍👧‍👦👨‍👩‍👧‍👦';
  return '🏛️';
};

export const getTableSizeCategory = (capacity) => {
  if (capacity <= 2) return 'Small';
  if (capacity <= 4) return 'Medium';
  if (capacity <= 6) return 'Large';
  if (capacity <= 8) return 'Extra Large';
  return 'Banquet';
};

export const getTableAvailabilityColor = (isAvailable) => {
  return isAvailable ? 'success' : 'danger';
};

export const getTableAvailabilityText = (isAvailable) => {
  return isAvailable ? 'Available' : 'Unavailable';
};

export const sortTablesByCapacity = (tables, order = 'asc') => {
  return [...tables].sort((a, b) => {
    return order === 'asc' ? a.capacity - b.capacity : b.capacity - a.capacity;
  });
};

export const sortTablesByName = (tables, order = 'asc') => {
  return [...tables].sort((a, b) => {
    return order === 'asc'
      ? a.tableName.localeCompare(b.tableName)
      : b.tableName.localeCompare(a.tableName);
  });
};

export const filterTablesByCapacity = (tables, minCapacity = 0, maxCapacity = Infinity) => {
  return tables.filter(
    (table) => table.capacity >= minCapacity && table.capacity <= maxCapacity
  );
};

export const filterTablesByAvailability = (tables, isAvailable = true) => {
  return tables.filter((table) => table.isAvailable === isAvailable);
};

export const filterTablesByLocation = (tables, location) => {
  if (!location) return tables;
  return tables.filter(
    (table) => table.location?.toLowerCase() === location.toLowerCase()
  );
};

export const getTablesForGuestCount = (tables, guestCount, exactMatch = false) => {
  if (exactMatch) {
    return tables.filter((table) => table.capacity === guestCount);
  }
  return tables.filter((table) => table.capacity >= guestCount);
};

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

export const getTotalSeatingCapacity = (tables) => {
  return tables.reduce((total, table) => total + (table.capacity || 0), 0);
};

export const getAvailableSeatingCapacity = (tables) => {
  return tables
    .filter((table) => table.isAvailable)
    .reduce((total, table) => total + (table.capacity || 0), 0);
};

export const formatTableLocation = (location) => {
  if (!location) return 'Main Dining Area';
  return location
    .split('_')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ');
};

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

export const isTableSuitableForGuests = (tableCapacity, guestCount) => {
  return tableCapacity >= guestCount && tableCapacity <= guestCount + 1;
};

const tableService = {
  getAvailableDiningTables,
  getAllDiningTables,
  getDiningTableById,
  createDiningTable,
  updateDiningTable,
  deleteDiningTable,
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