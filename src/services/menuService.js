import axios from 'axios';

import apiService from './api';
// ==================== CATEGORY SERVICES ====================

/**
 * Get all active categories
 * Endpoint: GET /api/categories/active
 */
export const getActiveCategories = async () => {
  try {
    const response = await apiService.get('/api/categories/active');    
    return response;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

/**
 * Get category by ID
 * Endpoint: GET /api/categories/{id}
 */
export const getCategoryById = async (id) => {
  try {
    const response = await apiService.get(`/api/categories/${id}`);
    return response;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

/**
 * Get category by slug
 * Endpoint: GET /api/categories/slug/{slug}
 */
export const getCategoryBySlug = async (slug) => {
  try {
    const response = await apiService.get(`/api/categories/slug/${slug}`);
    return response;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

// ==================== MENU ITEM SERVICES ====================

/**
 * Get all menu items with pagination and sorting
 * Endpoint: GET /api/menu
 */
export const getAllMenuItems = async (params = {}) => {
  try {
    const { page = 0, size = 12, sortBy = 'name', sortDir = 'asc' } = params;
    const response = await apiService.get('/api/menu', {
      params: { page, size, sortBy, sortDir },
    });
    console.log("API Response:", response);
    return response;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

/**
 * Get menu items by category
 * Endpoint: GET /api/menu/category/{categoryId}
 */
export const getMenuItemsByCategory = async (categoryId, params = {}) => {
  try {
    const { page = 0, size = 12 } = params;
    const response = await apiService.get(`/api/menu/category/${categoryId}`, {
      params: { page, size },
    });
    return response;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

/**
 * Get menu item by ID
 * Endpoint: GET /api/menu/{id}
 */
export const getMenuItemById = async (id) => {
  try {
    const response = await apiService.get(`/api/menu/${id}`);
    return response;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

/**
 * Get menu item by slug
 * Endpoint: GET /api/menu/slug/{slug}
 */
export const getMenuItemBySlug = async (slug) => {
  try {
    const response = await apiService.get(`/api/menu/slug/${slug}`);
    return response;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

/**
 * Search menu items by keyword
 * Endpoint: GET /api/menu/search
 */
export const searchMenuItems = async (keyword, params = {}) => {
  try {
    const { page = 0, size = 12 } = params;
    const response = await apiService.get('/api/menu/search', {
      params: { keyword, page, size },
    });
    return response;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

/**
 * Filter menu items by price range
 * Endpoint: GET /api/menu/filter/price
 */
export const filterMenuItemsByPrice = async (minPrice, maxPrice, params = {}) => {
  try {
    const { page = 0, size = 12 } = params;
    const response = await apiService.get('/api/menu/filter/price', {
      params: { minPrice, maxPrice, page, size },
    });
    return response;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

/**
 * COMBINED FILTER - Client-side filtering since backend doesn't have combined endpoint
 * This is a workaround until backend adds a /api/menu/filter endpoint
 * 
 * @param {Object} filters - Combined filter object
 * @param {number} filters.categoryId - Category ID (null for all)
 * @param {string} filters.keyword - Search keyword
 * @param {number} filters.minPrice - Minimum price
 * @param {number} filters.maxPrice - Maximum price
 * @param {number} filters.minRating - Minimum rating (client-side filter)
 * @param {number} filters.page - Page number
 * @param {number} filters.size - Page size
 */
export const getFilteredMenuItems = async (filters = {}) => {
  try {
    const {
      categoryId = null,
      keyword = '',
      minPrice = null,
      maxPrice = null,
      minRating = 0,
      page = 0,
      size = 100, // Get more items for client-side filtering
      sortBy = 'name',
      sortDir = 'asc',
    } = filters;

    let items = [];

    // Priority order of filtering:
    // 1. Category + Search (if both provided)
    // 2. Category only
    // 3. Search only
    // 4. All items

    if (categoryId && keyword) {
      // Get items by category first, then filter by keyword client-side
      const categoryResponse = await getMenuItemsByCategory(categoryId, { page: 0, size: 100 });
      items = categoryResponse.content || [];
      items = items.filter(item =>
        item.name.toLowerCase().includes(keyword.toLowerCase())
      );
    } else if (categoryId) {
      // Get items by category
      const categoryResponse = await getMenuItemsByCategory(categoryId, { page: 0, size: 100 });
      items = categoryResponse.content || [];
    } else if (keyword) {
      // Search by keyword
      const searchResponse = await searchMenuItems(keyword, { page: 0, size: 100 });
      items = searchResponse.content || [];
    } else {
      // Get all items
      const allResponse = await getAllMenuItems({ page: 0, size: 100, sortBy, sortDir });
      items = allResponse.content || [];
    }

    // Client-side filtering for price and rating
    let filteredItems = items;

    if (minPrice !== null || maxPrice !== null) {
      filteredItems = filteredItems.filter(item => {
        const price = item.price;
        const meetsMin = minPrice === null || price >= minPrice;
        const meetsMax = maxPrice === null || price <= maxPrice;
        return meetsMin && meetsMax;
      });
    }

    if (minRating > 0) {
      filteredItems = filteredItems.filter(item => item.rating >= minRating);
    }

    // Sort items
    if (sortBy === 'price') {
      filteredItems.sort((a, b) =>
        sortDir === 'asc' ? a.price - b.price : b.price - a.price
      );
    } else if (sortBy === 'rating') {
      filteredItems.sort((a, b) =>
        sortDir === 'asc' ? a.rating - b.rating : b.rating - a.rating
      );
    } else {
      filteredItems.sort((a, b) =>
        sortDir === 'asc'
          ? a.name.localeCompare(b.name)
          : b.name.localeCompare(a.name)
      );
    }

    // Manual pagination
    const totalElements = filteredItems.length;
    const totalPages = Math.ceil(totalElements / size);
    const startIndex = page * size;
    const endIndex = startIndex + size;
    const paginatedItems = filteredItems.slice(startIndex, endIndex);

    return {
      content: paginatedItems,
      totalPages,
      totalElements,
      size,
      number: page,
      first: page === 0,
      last: page >= totalPages - 1,
      empty: totalElements === 0,
    };
  } catch (error) {
    console.error('Error in getFilteredMenuItems:', error);
    // Return empty response structure instead of throwing
    // This prevents undefined errors in the calling code
    return {
      content: [],
      totalPages: 0,
      totalElements: 0,
      size: 0,
      number: 0,
      first: true,
      last: true,
      empty: true,
    };
  }
};


// ==================== UTILITY FUNCTIONS ====================

/**
 * Format price for display
 */
export const formatPrice = (price, currency = '$') => {
  return `${currency}${parseFloat(price).toFixed(2)}`;
};

/**
 * Get spicy level display with emojis
 */
export const getSpicyLevelDisplay = (level) => {
  if (!level || level === 0) return '';
  return '🌶️'.repeat(level);
};

/**
 * Get spicy level text
 */
export const getSpicyLevelText = (level) => {
  const levels = {
    0: 'Not Spicy',
    1: 'Mild',
    2: 'Medium',
    3: 'Hot',
    4: 'Very Hot',
    5: 'Extreme',
  };
  return levels[level] || 'Unknown';
};

/**
 * Format preparation time
 */
export const formatPreparationTime = (minutes) => {
  if (!minutes) return 'N/A';
  if (minutes < 60) return `${minutes} min`;
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return mins > 0 ? `${hours}h ${mins}min` : `${hours}h`;
};

/**
 * Get rating stars display
 */
export const getRatingStars = (rating) => {
  if (!rating) return '☆☆☆☆☆';
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating % 1 >= 0.5;
  const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);

  return (
    '⭐'.repeat(fullStars) +
    (hasHalfStar ? '⭐' : '') +
    '☆'.repeat(emptyStars)
  );
};

// Export default object
const menuService = {
  // Categories
  getActiveCategories,
  getCategoryById,
  getCategoryBySlug,

  // Menu Items
  getAllMenuItems,
  getMenuItemsByCategory,
  getMenuItemById,
  getMenuItemBySlug,
  searchMenuItems,
  filterMenuItemsByPrice,
  getFilteredMenuItems, // Combined filter

  // Utilities
  formatPrice,
  getSpicyLevelDisplay,
  getSpicyLevelText,
  formatPreparationTime,
  getRatingStars,
};

export default menuService;