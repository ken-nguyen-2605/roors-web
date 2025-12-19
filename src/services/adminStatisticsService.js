import apiService from './api';

/**
 * Admin Statistics Service
 * * Wraps backend statistics endpoints.
 * Base path: /api/admin/statistics
 */
class AdminStatisticsService {
  
  /**
   * Get dashboard statistics for the last N days.
   * Endpoint: GET /api/admin/statistics/dashboard?days={days}
   * * @param {number} days - Number of days to look back (default 30)
   */
  async getDashboardStatistics(days = 30) {
    try {
      // Axios automatically serializes 'params' to ?days=30
      const response = await apiService.get('/api/admin/statistics/dashboard', {
        params: { days },
      });

      return {
        success: true,
        data: response, // The api.js interceptor has already unwrapped this
        message: 'Dashboard statistics loaded',
      };
    } catch (error) {
      return {
        success: false,
        message: error.message || 'Failed to load dashboard statistics',
        status: error.status,
      };
    }
  }
}

export default new AdminStatisticsService();