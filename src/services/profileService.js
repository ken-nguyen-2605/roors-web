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
    return apiService.request(`/api/users/${userId}`, {
      method: 'PATCH',
      body: JSON.stringify(body),
    });
  }

  getLikedDishes(userId) {
    const endpoint = userId ? `/api/users/${userId}/liked-dishes` : '/api/users/me/liked-dishes';
    return apiService.get(endpoint);
  }

  removeLikedDish(dishId, userId) {
    const endpoint = userId
      ? `/api/users/${userId}/liked-dishes/${dishId}`
      : `/api/users/me/liked-dishes/${dishId}`;
    return apiService.delete(endpoint);
  }
}

export default new ProfileService();
