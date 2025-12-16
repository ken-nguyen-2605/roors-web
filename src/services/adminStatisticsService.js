import apiService from './api';

/**
 * Admin Statistics Service
 *
 * Wraps backend statistics endpoints:
 * - GET /api/admin/statistics/dashboard?days={days}
 */
class AdminStatisticsService {
  /**
   * Get dashboard statistics for the last N days.
   *
   * @param {number} days - Number of days to look back (default 30)
   */
  async getDashboardStatistics(days = 30) {
    try {
      const response = await apiService.get('/api/admin/statistics/dashboard', {
        params: { days },
      });

      return {
        success: true,
        data: response,
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


