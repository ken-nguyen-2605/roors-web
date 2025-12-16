import apiService from './api';

class ReservationService {
  // Get current user's reservations
  async getMyReservations() {
    try {
      const response = await apiService.get('/api/reservations/me');
      console.log('My Reservations Response:', response);
      return {
        success: true,
        data: response,
        message: 'Reservations retrieved successfully',
      };
    } catch (error) {
      return {
        success: false,
        message: error.message || 'Failed to fetch reservations',
        status: error.status,
      };
    }
  }

  // Get available reservation times
  async getAvailableReservationTimes() {
    try {
      const response = await apiService.get('/api/reservations/date-time-availability');
      return {
        success: true,
        data: response,
        message: 'Available times retrieved successfully',
      };
    } catch (error) {
      return {
        success: false,
        message: error.message || 'Failed to fetch available times',
        status: error.status,
      };
    }
  }

  // Get all reservations (MANAGER or STAFF only)
  async getAllReservations() {
    try {
      const response = await apiService.get('/api/reservations');
      return {
        success: true,
        data: response,
        message: 'All reservations retrieved successfully',
      };
    } catch (error) {
      return {
        success: false,
        message: error.message || 'Failed to fetch all reservations',
        status: error.status,
      };
    }
  }

  // Create a new reservation
  async createReservation(reservationData) {
    try {
      const response = await apiService.post('/api/reservations', reservationData);
      return {
        success: true,
        data: response,
        message: 'Reservation created successfully!',
      };
    } catch (error) {
      return {
        success: false,
        message: error.message || 'Failed to create reservation',
        status: error.status,
      };
    }
  }

  // Update an existing reservation
  async updateReservation(reservationId, updateData) {
    try {
      const response = await apiService.request(`/api/reservations/${reservationId}`, {
        method: 'PATCH',
        body: JSON.stringify(updateData),
      });
      return {
        success: true,
        data: response,
        message: 'Reservation updated successfully!',
      };
    } catch (error) {
      return {
        success: false,
        message: error.message || 'Failed to update reservation',
        status: error.status,
      };
    }
  }

  // Mark reservation as arrived (STAFF only)
  async markReservationAsArrived(reservationId) {
    try {
      const response = await apiService.request(`/api/reservations/${reservationId}/mark-arrived`, {
        method: 'PATCH',
      });
      return {
        success: true,
        data: response,
        message: 'Reservation marked as arrived',
      };
    } catch (error) {
      return {
        success: false,
        message: error.message || 'Failed to mark reservation as arrived',
        status: error.status,
      };
    }
  }

  // Cancel a reservation
  async cancelReservation(reservationId) {
    try {
      const response = await apiService.request(`/api/reservations/${reservationId}/cancel`, {
        method: 'PATCH',
      });
      return {
        success: true,
        data: response,
        message: 'Reservation cancelled successfully',
      };
    } catch (error) {
      return {
        success: false,
        message: error.message || 'Failed to cancel reservation',
        status: error.status,
      };
    }
  }

  // Helper method to format reservation data
  formatReservationData(formData) {
    return {
      reservationDate: formData.reservationDate,
      reservationTime: formData.reservationTime,
      numberOfGuests: parseInt(formData.numberOfGuests),
      specialRequests: formData.specialRequests || '',
      customerName: formData.customerName,
      customerPhone: formData.customerPhone,
      customerEmail: formData.customerEmail,
    };
  }

  // Helper method to check if reservation can be modified
  canModifyReservation(reservation) {
    const reservationDateTime = new Date(`${reservation.reservationDate}T${reservation.reservationTime}`);
    const now = new Date();
    const hoursDifference = (reservationDateTime - now) / (1000 * 60 * 60);
    
    // Can modify if reservation is more than 2 hours away and status is CONFIRMED
    return hoursDifference > 2 && reservation.status === 'CONFIRMED';
  }

  // Helper method to check if reservation can be cancelled
  canCancelReservation(reservation) {
    const reservationDateTime = new Date(`${reservation.reservationDate}T${reservation.reservationTime}`);
    const now = new Date();
    const hoursDifference = (reservationDateTime - now) / (1000 * 60 * 60);
    
    // Can cancel if reservation is more than 1 hour away and status is CONFIRMED
    return hoursDifference > 1 && reservation.status === 'CONFIRMED';
  }

  // Helper method to get reservation status display
  getStatusDisplay(status) {
    const statusMap = {
      PENDING: 'Pending',
      CONFIRMED: 'Confirmed',
      ARRIVED: 'Arrived',
      COMPLETED: 'Completed',
      CANCELLED: 'Cancelled',
      NO_SHOW: 'No Show',
    };
    return statusMap[status] || status;
  }

  // Helper method to validate reservation time
  isValidReservationTime(date, time) {
    const reservationDateTime = new Date(`${date}T${time}`);
    const now = new Date();
    
    // Reservation must be in the future
    if (reservationDateTime <= now) {
      return {
        valid: false,
        message: 'Reservation time must be in the future',
      };
    }

    // Check if reservation is too far in advance (e.g., max 90 days)
    const maxDaysInAdvance = 90;
    const daysDifference = (reservationDateTime - now) / (1000 * 60 * 60 * 24);
    
    if (daysDifference > maxDaysInAdvance) {
      return {
        valid: false,
        message: `Reservations can only be made up to ${maxDaysInAdvance} days in advance`,
      };
    }

    return {
      valid: true,
      message: 'Valid reservation time',
    };
  }
}

export default new ReservationService();