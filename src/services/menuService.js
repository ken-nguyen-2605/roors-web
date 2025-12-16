//import axios from 'axios';
import apiService from './api';

// ==================== CATEGORY SERVICES ====================

/**
 * Get all categories (for admin panel)
 * Endpoint: GET /api/categories
 */
export const getAllCategories = async () => {
  try {
    const response = await apiService.get('/api/categories');
    console.log("API Response(cate):", response);    
    return response;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

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

/**
 * Create new category (admin only)
 * Endpoint: POST /api/categories
 */
export const createCategory = async (categoryData) => {
  try {
    const response = await apiService.post('/api/categories', categoryData);
    return response;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

/**
 * Update existing category (admin only)
 * Endpoint: PUT /api/categories/{id}
 */
export const updateCategory = async (id, categoryData) => {
  try {
    const response = await apiService.put(`/api/categories/${id}`, categoryData);
    return response;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

/**
 * Delete category (admin only)
 * Endpoint: DELETE /api/categories/{id}
 */
export const deleteCategory = async (id) => {
  try {
    const response = await apiService.delete(`/api/categories/${id}`);
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
    const { page = 0, size = 500, sortBy = 'name', sortDir = 'asc' } = params;

    console.log("Sending params to backend:", { page, size, sortBy, sortDir });

    const queryParams = new URLSearchParams({
      page,
      size,
      sortBy,
      sortDir,
    });

    const response = await apiService.get(`/api/menu?${queryParams.toString()}`);
    console.log("API Response:", response);
    return response;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

/**
 * Get all menu items for admin (including unavailable)
 * Endpoint: GET /api/menu/admin/all
 */
export const getAllMenuItemsForAdmin = async (params = {}) => {
  try {
    const { page = 0, size = 500, sortBy = 'name', sortDir = 'asc' } = params;

    const queryParams = new URLSearchParams({
      page,
      size,
      sortBy,
      sortDir,
    });

    const response = await apiService.get(`/api/menu/admin/all?${queryParams.toString()}`);
    return response;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

/**
 * Get menu items by category for admin (including unavailable)
 * Endpoint: GET /api/menu/admin/category/{categoryId}
 */
export const getMenuItemsByCategoryForAdmin = async (categoryId, params = {}) => {
  try {
    const { page = 0, size = 12 } = params;
    const response = await apiService.get(`/api/menu/admin/category/${categoryId}`, {
      params: { page, size },
    });
    return response;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

/**
 * Search menu items for admin (including unavailable)
 * Endpoint: GET /api/menu/admin/search
 */
export const searchMenuItemsForAdmin = async (keyword = "", params = {}) => {
  try {
    const { page = 0, size = 12 } = params;
    const response = await apiService.get('/api/menu/admin/search', {
      params: { keyword, page, size },
    });
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
export const searchMenuItems = async (keyword= "", params = {}) => {
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
 * Get featured menu items
 * Endpoint: GET /api/menu/featured
 */
export const getFeaturedMenuItems = async () => {
  try {
    const response = await apiService.get('/api/menu/featured');
    return response;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

/**
 * Get top rated menu items
 * Endpoint: GET /api/menu/top-rated
 */
export const getTopRatedMenuItems = async () => {
  try {
    const response = await apiService.get('/api/menu/top-rated');
    return response;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

/**
 * Get popular menu items
 * Endpoint: GET /api/menu/popular
 */
export const getPopularMenuItems = async () => {
  try {
    const response = await apiService.get('/api/menu/popular');
    return response;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

/**
 * Create new menu item (admin only)
 * Endpoint: POST /api/menu
 */
export const createMenuItem = async (menuItemData) => {
  try {
    const response = await apiService.post('/api/menu', menuItemData);
    return response;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

/**
 * Update existing menu item (admin only)
 * Endpoint: PUT /api/menu/{id}
 */
export const updateMenuItem = async (id, menuItemData) => {
  try {
    const response = await apiService.put(`/api/menu/${id}`, menuItemData);
    return response;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

/**
 * Toggle menu item availability (admin only)
 * Endpoint: PATCH /api/menu/{id}/toggle-availability
 */
export const toggleMenuItemAvailability = async (id) => {
  try {
    const response = await apiService.patch(`/api/menu/${id}/toggle-availability`);
    return response;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

/**
 * Delete menu item (admin only)
 * Endpoint: DELETE /api/menu/{id}
 */
export const deleteMenuItem = async (id) => {
  try {
    const response = await apiService.delete(`/api/menu/${id}`);
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

      const categoryResponse = await getMenuItemsByCategory(categoryId, { page: 0, size: 500 });
      items = categoryResponse.content || [];
    } else if (keyword) {
      // Search by keyword
      const searchResponse = await searchMenuItems(keyword,  {page: 0}, {size: 100} );
      items = searchResponse.content || [];
    } else {
      // Get all items - fetch a large number to support pagination
      const allResponse = await getAllMenuItems({ page: 0, size: 500, sortBy, sortDir });
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

/**
 * Like a menu item
 * Endpoint: POST /api/menu/likes/{menuItemId}
 */
export const likeMenuItem = async (menuItemId) => {
  try {
    // POST endpoint doesn't require a body, but apiService.post expects data
    // Sending empty object is fine
    const response = await apiService.post(`/api/menu/likes/${menuItemId}`, {});
    return response;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

/**
 * Unlike a menu item
 * Endpoint: DELETE /api/menu/likes/{menuItemId}
 */
export const unlikeMenuItem = async (menuItemId) => {
  try {
    const response = await apiService.delete(`/api/menu/likes/${menuItemId}`);
    return response;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

/**
 * Get like status for a menu item
 * Endpoint: GET /api/menu/likes/{menuItemId}/status
 */
export const getMenuItemLikeStatus = async (menuItemId) => {
  try {
    const response = await apiService.get(`/api/menu/likes/${menuItemId}/status`);
    return response;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

/**
 * Get dish ratings for a menu item
 * Endpoint: GET /api/menu/{id}/ratings
 */
export const getDishRatings = async (menuItemId, limit = 5) => {
  try {
    const response = await apiService.get(`/api/menu/${menuItemId}/ratings?limit=${limit}`);
    return response;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

/**
 * Handle API errors consistently
 */
export const handleApiError = (error) => {
  if (error.response) {
    // Server responded with error status
    const message = error.response.data?.message || error.response.statusText;
    console.error('API Error:', message);
    return { success: false, message };
  } else if (error.request) {
    // Request made but no response
    console.error('Network Error:', error.request);
    return { success: false, message: 'Network error. Please check your connection.' };
  } else {
    // Something else happened
    console.error('Error:', error.message);
    return { success: false, message: error.message };
  }
};

// Export default object
const menuService = {
  // Categories
  getAllCategories,
  getActiveCategories,
  getCategoryById,
  getCategoryBySlug,
  createCategory,
  updateCategory,
  deleteCategory,

  // Menu Items
  getAllMenuItems,
  getMenuItemsByCategory,
  getMenuItemById,
  getMenuItemBySlug,
  searchMenuItems,
  filterMenuItemsByPrice,
  getFeaturedMenuItems,
  getTopRatedMenuItems,
  getPopularMenuItems,
  createMenuItem,
  updateMenuItem,
  toggleMenuItemAvailability,
  deleteMenuItem,
  getFilteredMenuItems, // Combined filter

  // Admin Menu Items (including unavailable)
  getAllMenuItemsForAdmin,
  getMenuItemsByCategoryForAdmin,
  searchMenuItemsForAdmin,

  // Menu Item Likes
  likeMenuItem,
  unlikeMenuItem,
  getMenuItemLikeStatus,

  // Dish Ratings
  getDishRatings,

  // Utilities
  formatPrice,
  formatPreparationTime, 
  getRatingStars,
  handleApiError,
};

export default menuService;