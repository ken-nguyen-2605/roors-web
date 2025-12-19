import apiService from './api';

// ==================== CATEGORY SERVICES ====================

export const getAllCategories = async () => {
  const response = await apiService.get('/api/categories');
  console.log("API Response(cate):", response);    
  return response;
};

export const getActiveCategories = async () => {
  return apiService.get('/api/categories/active');
};

export const getCategoryById = async (id) => {
  return apiService.get(`/api/categories/${id}`);
};

export const getCategoryBySlug = async (slug) => {
  return apiService.get(`/api/categories/slug/${slug}`);
};

export const createCategory = async (categoryData) => {
  return apiService.post('/api/categories', categoryData);
};

export const updateCategory = async (id, categoryData) => {
  return apiService.put(`/api/categories/${id}`, categoryData);
};

export const deleteCategory = async (id) => {
  return apiService.delete(`/api/categories/${id}`);
};

// ==================== MENU ITEM SERVICES ====================

export const getAllMenuItems = async (params = {}) => {
  const { page = 0, size = 500, sortBy = 'name', sortDir = 'asc' } = params;
  
  // Axios automatically serializes 'params' into ?page=0&size=500...
  const response = await apiService.get('/api/menu', {
    params: { page, size, sortBy, sortDir }
  });
  
  console.log("API Response:", response);
  return response;
};

export const getAllMenuItemsForAdmin = async (params = {}) => {
  const { page = 0, size = 500, sortBy = 'name', sortDir = 'asc' } = params;
  return apiService.get('/api/menu/admin/all', {
    params: { page, size, sortBy, sortDir }
  });
};

export const getMenuItemsByCategoryForAdmin = async (categoryId, params = {}) => {
  const { page = 0, size = 12 } = params;
  return apiService.get(`/api/menu/admin/category/${categoryId}`, {
    params: { page, size }
  });
};

export const searchMenuItemsForAdmin = async (keyword = "", params = {}) => {
  const { page = 0, size = 12 } = params;
  return apiService.get('/api/menu/admin/search', {
    params: { keyword, page, size }
  });
};

export const getMenuItemsByCategory = async (categoryId, params = {}) => {
  const { page = 0, size = 12 } = params;
  return apiService.get(`/api/menu/category/${categoryId}`, {
    params: { page, size }
  });
};

export const getMenuItemById = async (id) => {
  return apiService.get(`/api/menu/${id}`);
};

export const getMenuItemBySlug = async (slug) => {
  return apiService.get(`/api/menu/slug/${slug}`);
};

export const searchMenuItems = async (keyword = "", params = {}) => {
  const { page = 0, size = 12 } = params;
  return apiService.get('/api/menu/search', {
    params: { keyword, page, size }
  });
};

export const filterMenuItemsByPrice = async (minPrice, maxPrice, params = {}) => {
  const { page = 0, size = 12 } = params;
  return apiService.get('/api/menu/filter/price', {
    params: { minPrice, maxPrice, page, size }
  });
};

export const getFeaturedMenuItems = async () => {
  return apiService.get('/api/menu/featured');
};

export const getTopRatedMenuItems = async () => {
  return apiService.get('/api/menu/top-rated');
};

export const getPopularMenuItems = async () => {
  return apiService.get('/api/menu/popular');
};

export const createMenuItem = async (menuItemData) => {
  return apiService.post('/api/menu', menuItemData);
};

export const updateMenuItem = async (id, menuItemData) => {
  return apiService.put(`/api/menu/${id}`, menuItemData);
};

export const toggleMenuItemAvailability = async (id) => {
  return apiService.patch(`/api/menu/${id}/toggle-availability`);
};

export const deleteMenuItem = async (id) => {
  return apiService.delete(`/api/menu/${id}`);
};

// ==================== COMBINED FILTER (Client Side Logic) ====================
// Kept logic as requested, updated internal calls to use new syntax
export const getFilteredMenuItems = async (filters = {}) => {
  try {
    const {
      categoryId = null,
      keyword = '',
      minPrice = null,
      maxPrice = null,
      minRating = 0,
      page = 0,
      size = 100, 
      sortBy = 'name',
      sortDir = 'asc',
    } = filters;

    let items = [];

    // 1. Fetch data based on priority
    if (categoryId && keyword) {
      // Get items by category first
      const categoryResponse = await getMenuItemsByCategory(categoryId, { page: 0, size: 100 });
      items = categoryResponse.content || [];
      // Client-side keyword filter
      items = items.filter(item =>
        item.name.toLowerCase().includes(keyword.toLowerCase())
      );
    } else if (categoryId) {
      const categoryResponse = await getMenuItemsByCategory(categoryId, { page: 0, size: 500 });
      items = categoryResponse.content || [];
    } else if (keyword) {
      const searchResponse = await searchMenuItems(keyword, { page: 0, size: 100 });
      items = searchResponse.content || [];
    } else {
      const allResponse = await getAllMenuItems({ page: 0, size: 500, sortBy, sortDir });
      items = allResponse.content || [];
    }

    // 2. Client-side filtering for price and rating
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

    // 3. Sorting
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

    // 4. Pagination
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

export const formatPrice = (price, currency = '$') => {
  return `${currency}${parseFloat(price).toFixed(2)}`;
};

export const formatPreparationTime = (minutes) => {
  if (!minutes) return 'N/A';
  if (minutes < 60) return `${minutes} min`;
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return mins > 0 ? `${hours}h ${mins}min` : `${hours}h`;
};

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

// ==================== LIKES & RATINGS ====================

export const likeMenuItem = async (menuItemId) => {
  return apiService.post(`/api/menu-likes/${menuItemId}`, {});
};

export const unlikeMenuItem = async (menuItemId) => {
  return apiService.delete(`/api/menu-likes/${menuItemId}`);
};

export const getMenuItemLikeStatus = async (menuItemId) => {
  return apiService.get(`/api/menu-likes/${menuItemId}/status`);
};

export const getDishRatings = async (menuItemId, limit = 5) => {
  return apiService.get(`/api/menu/${menuItemId}/ratings?limit=${limit}`);
};

// Handle API errors consistently (Updated to work with Axios errors)
export const handleApiError = (error) => {
  if (error.message) {
      console.error('API Error:', error.message);
      return { success: false, message: error.message };
  }
  console.error('Error:', error);
  return { success: false, message: 'An unknown error occurred' };
};

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
  getFilteredMenuItems, 

  // Admin
  getAllMenuItemsForAdmin,
  getMenuItemsByCategoryForAdmin,
  searchMenuItemsForAdmin,

  // Social
  likeMenuItem,
  unlikeMenuItem,
  getMenuItemLikeStatus,
  getDishRatings,

  // Utils
  formatPrice,
  formatPreparationTime, 
  getRatingStars,
  handleApiError,
};

export default menuService;