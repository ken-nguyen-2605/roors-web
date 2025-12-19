import apiService from './api';

class ReservationService {
  
  // Get current user's reservations
  async getMyReservations() {
    const response = await apiService.get('/api/reservations/me');
    console.log('My Reservations Response:', response);
    return {
      success: true,
      data: response,
      message: 'Reservations retrieved successfully',
    };
  }

  // Get available reservation times
  async getAvailableReservationTimes() {
    const response = await apiService.get('/api/reservations/date-time-availability');
    return {
      success: true,
      data: response,
      message: 'Available times retrieved successfully',
    };
  }

  // Get all reservations (Manager/Staff)
  async getAllReservations() {
    const response = await apiService.get('/api/reservations');
    return {
      success: true,
      data: response,
      message: 'All reservations retrieved successfully',
    };
  }

  // Create a new reservation
  async createReservation(reservationData) {
    const response = await apiService.post('/api/reservations', reservationData);
    return {
      success: true,
      data: response,
      message: 'Reservation created successfully!',
    };
  }

  // Update an existing reservation
  async updateReservation(reservationId, updateData) {
    const response = await apiService.patch(`/api/reservations/${reservationId}`, updateData);
    return {
      success: true,
      data: response,
      message: 'Reservation updated successfully!',
    };
  }

  // Mark reservation as arrived (Staff)
  async markReservationAsArrived(reservationId) {
    const response = await apiService.patch(`/api/reservations/${reservationId}/mark-arrived`);
    return {
      success: true,
      data: response,
      message: 'Reservation marked as arrived',
    };
  }

  // Cancel a reservation
  async cancelReservation(reservationId) {
    const response = await apiService.patch(`/api/reservations/${reservationId}/cancel`);
    return {
      success: true,
      data: response,
      message: 'Reservation cancelled successfully',
    };
  }

  // ==================== UTILITY FUNCTIONS (Kept as is) ====================

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

  canModifyReservation(reservation) {
    const reservationDateTime = new Date(`${reservation.reservationDate}T${reservation.reservationTime}`);
    const now = new Date();
    const hoursDifference = (reservationDateTime - now) / (1000 * 60 * 60);
    return hoursDifference > 2 && reservation.status === 'CONFIRMED';
  }

  canCancelReservation(reservation) {
    const reservationDateTime = new Date(`${reservation.reservationDate}T${reservation.reservationTime}`);
    const now = new Date();
    const hoursDifference = (reservationDateTime - now) / (1000 * 60 * 60);
    return hoursDifference > 1 && reservation.status === 'CONFIRMED';
  }

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

  isValidReservationTime(date, time) {
    const reservationDateTime = new Date(`${date}T${time}`);
    const now = new Date();
    
    if (reservationDateTime <= now) {
      return { valid: false, message: 'Reservation time must be in the future' };
    }

    const maxDaysInAdvance = 90;
    const daysDifference = (reservationDateTime - now) / (1000 * 60 * 60 * 24);
    
    if (daysDifference > maxDaysInAdvance) {
      return { valid: false, message: `Reservations can only be made up to ${maxDaysInAdvance} days in advance` };
    }

    return { valid: true, message: 'Valid reservation time' };
  }
}

export default new ReservationService();