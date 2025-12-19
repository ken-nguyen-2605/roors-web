import apiService from './api';

const sanitizeProfilePayload = (payload = {}) => {
  const allowedFields = [
    'fullName',
    'email',
    'phoneNumber',
    'gender',
    'address',
    'profileImageUrl',
  ];

  return allowedFields.reduce((acc, field) => {
    if (payload[field] !== undefined && payload[field] !== null) {
      acc[field] = payload[field];
    }
    return acc;
  }, {});
};

class ProfileService {
  getProfileById(userId) {
    const response = apiService.get(`/api/users/${userId}`);
    console.log('Fetching profile for userId:', userId, 'Response:', response);
    return response;
  }

  updateProfile(userId, payload) {
    const body = sanitizeProfilePayload(payload);
    return apiService.patch(`/api/users/${userId}`, body);
  }

  disableAccount(userId) {
    // Customer endpoint: disables the currently authenticated user's account (soft delete)
    // Note: userId is not required by backend; it uses the authenticated user
    return apiService.post('/api/users/disable', {});
  }

  getLikedDishes(userId) {
    // Backend endpoint: GET /api/menu/likes (returns current authenticated user's liked items)
    // Note: userId parameter is ignored - backend uses authenticated user from token
    // For paginated results: GET /api/menu/likes/paged?page=0&size=20
    return apiService.get('/api/menu/likes');
  }

  getLikedDishesPaged(page = 0, size = 20) {
    return apiService.get(`/api/menu/likes/paged?page=${page}&size=${size}`);
  }

  removeLikedDish(dishId, userId) {
    // Backend endpoint: DELETE /api/menu/likes/{menuItemId}
    // Note: userId parameter is ignored - backend uses authenticated user from token
    return apiService.delete(`/api/menu/likes/${dishId}`);
  }
}

export default new ProfileService();
