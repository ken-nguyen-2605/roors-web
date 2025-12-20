import apiService from './api';

/**
 * OrderService
 *
 * Patterned after authService.js: each method wraps apiService calls
 * and returns a unified { success, data, message, status } shape.
 *
 * Base path assumptions:
 * - Orders:           /api/orders
 * - Get by ID:        /api/orders/:orderId
 * - Items on order:   /api/orders/:orderId/items
 * - Status updates:   /api/orders/:orderId/status
 * - Cancel order:     /api/orders/:orderId/cancel
 * - Payments:         /api/orders/:orderId/pay
 * - Refunds:          /api/orders/:orderId/refund
 *
 * Adjust endpoints as needed to match your backend.
 */
class OrderService {
  // Create a new order
  async createOrder(orderData) {
    const response = await apiService.post('/api/orders', orderData);
    return {
      success: true,
      data: response,
      message: 'Order created successfully',
    };
  }

  // Fetch a single order by ID
  async getOrder(orderId) {
    const response = await apiService.get(`/api/orders/${orderId}`);
    return {
      success: true,
      data: response,
      message: 'Order fetched successfully',
    };
  }

  // List orders with optional filters & pagination
  async listOrders({ 
    page = 0, 
    size = 10, 
    status, 
    orderType, 
    search, 
    sortBy = 'createdAt', 
    sortDirection = 'DESC' 
  } = {}) {
    
    // Axios handles query params automatically via the 'params' object
    const response = await apiService.get('/api/orders', {
      params: { page, size, status, orderType, search, sortBy, sortDirection }
    });

    return {
      success: true,
      data: response,
      message: 'Orders loaded',
    };
  }

  // Get orders by specific status
  async getOrdersByStatus(status, { page = 0, size = 100, orderType } = {}) {
    const response = await apiService.get(`/api/orders/status/${status}`, {
      params: { page, size, orderType }
    });
    
    return {
      success: true,
      data: response.content || response,
      totalElements: response.totalElements,
      totalPages: response.totalPages,
      message: `Orders with status ${status} loaded`,
    };
  }

  // Re-order an existing order
  async reOrder(orderId) {
    const response = await apiService.post(`/api/orders/${orderId}/reorder`);
    return {
      success: true,
      data: response,
      message: 'Order reordered successfully',
    };
  }

  // Get orders for a specific date
  async getOrdersByDate(date, { page = 0, size = 10, status } = {}) {
    const response = await apiService.get(`/api/orders/date/${date}`, {
      params: { page, size, status }
    });
    
    console.log('Orders by Date Response:', response);

    return {
      success: true,
      data: response.content || response,
      totalElements: response.totalElements,
      totalPages: response.totalPages,
      message: 'Orders loaded for date',
    };
  }

  // Check payment status
  async checkPaymentStatus(paymentCode) {
    const response = await apiService.get(`/api/payments/${paymentCode}`);
    return {
      success: true,
      data: response,
      message: 'Payment status retrieved',
    };
  }

  // Update order (full or partial payload)
  async updateOrder(orderId, payload) {
    const response = await apiService.put(`/api/orders/${orderId}`, payload);
    return {
      success: true,
      data: response,
      message: 'Order updated successfully',
    };
  }

  // Update order status only
  async updateStatus(orderId, status) {
    const response = await apiService.put(`/api/orders/${orderId}/status`, {}, {
      params: { status }
    });

    return {
      success: true,
      data: response,
      message: 'Order status updated',
    };
  }

  // Cancel an order
  async cancelOrder(orderId, reason = "") {
    const response = await apiService.post(`/api/orders/${orderId}/cancel`, { reason });
    return {
      success: true,
      data: response,
      message: 'Order canceled',
    };
  }

  // Delete an order
  async deleteOrder(orderId) {
    const response = await apiService.delete(`/api/orders/${orderId}`);
    return {
      success: true,
      data: response,
      message: 'Order deleted',
    };
  }

  // Add item to order
  async addItem(orderId, item) {
    const response = await apiService.post(`/api/orders/${orderId}/items`, item);
    return {
      success: true,
      data: response,
      message: 'Item added to order',
    };
  }

  // Remove item from order
  async removeItem(orderId, itemId) {
    const response = await apiService.delete(`/api/orders/${orderId}/items/${itemId}`);
    return {
      success: true,
      data: response,
      message: 'Item removed from order',
    };
  }

  // Update existing item
  async updateItem(orderId, itemId, partialItem) {
    const response = await apiService.put(`/api/orders/${orderId}/items/${itemId}`, partialItem);
    return {
      success: true,
      data: response,
      message: 'Item updated',
    };
  }

  // Submit payment
  async payOrder(orderId, paymentInfo) {
    const response = await apiService.post(`/api/orders/${orderId}/pay`, paymentInfo);
    return {
      success: true,
      data: response,
      message: 'Payment processed',
    };
  }

  // Issue refund
  async refundOrder(orderId, payload) {
    const response = await apiService.post(`/api/orders/${orderId}/refund`, payload);
    return {
      success: true,
      data: response,
      message: 'Refund processed',
    };
  }

  // Get current user's orders
  async getMyOrders(params = {}) {
    const response = await apiService.get('/api/orders/me', { params });
    console.log('My Orders Response:', response.content);
    return {
      success: true,
      data: response.content || response,
      message: 'Your orders loaded',
    };
  }

  // Get orders with ratings
  async getOrdersWithRatings({ page = 0, size = 100, rating, sortBy = 'ratedAt', sortDirection = 'DESC' } = {}) {
    const response = await apiService.get('/api/orders/with-ratings', {
      params: { page, size, rating, sortBy, sortDirection }
    });
    
    return {
      success: true,
      data: response.content || response,
      totalElements: response.totalElements,
      totalPages: response.totalPages,
      message: 'Orders with ratings loaded',
    };
  }

  // Submit order rating
  async submitOrderRating(orderId, rating, feedback) {
    const response = await apiService.post(`/api/orders/${orderId}/rating`, { rating, feedback });
    return {
      success: true,
      data: response,
      message: 'Rating submitted successfully',
    };
  }

  // Submit dish rating
  async submitDishRating(orderId, itemId, dishRating, dishFeedback) {
    const response = await apiService.post(`/api/orders/${orderId}/items/${itemId}/rating`, {
      dishRating,
      dishFeedback
    });
    return {
      success: true,
      data: response,
      message: 'Dish rating submitted successfully',
    };
  }

  // Respond to order feedback (Admin)
  async respondToOrderFeedback(orderId, responseText) {
    const result = await apiService.post(`/api/orders/${orderId}/rating/response`, {
      response: responseText
    });
    return {
      success: true,
      data: result,
      message: 'Response submitted successfully',
    };
  }

  // Respond to dish feedback (Admin)
  async respondToDishFeedback(orderId, itemId, responseText) {
    const result = await apiService.post(`/api/orders/${orderId}/items/${itemId}/rating/response`, {
      response: responseText
    });
    return {
      success: true,
      data: result,
      message: 'Response submitted successfully',
    };
  }
}

export default new OrderService();