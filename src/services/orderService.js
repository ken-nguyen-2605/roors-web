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
    try {
      const response = await apiService.post('/api/orders', orderData);
      return {
        success: true,
        data: response,
        message: 'Order created successfully',
      };
    } catch (error) {
      return {
        success: false,
        message: error.message || 'Failed to create order',
        status: error.status,
      };
    }
  }

  // Fetch a single order by ID
  async getOrder(orderId) {
    try {
      const response = await apiService.get(`/api/orders/${orderId}`);
      return {
        success: true,
        data: response,
        message: 'Order fetched successfully',
      };
    } catch (error) {
      return {
        success: false,
        message: error.message || 'Failed to fetch order',
        status: error.status,
      };
    }
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
    try {
      const params = new URLSearchParams();
      params.set('page', page.toString());
      params.set('size', size.toString());
      params.set('sortBy', sortBy);
      params.set('sortDirection', sortDirection);
      
      if (status) params.set('status', status);
      if (orderType) params.set('orderType', orderType);
      if (search) params.set('search', search);

      const qs = params.toString();
      const response = await apiService.get(`/api/orders?${qs}`);
      return {
        success: true,
        data: response,
        message: 'Orders loaded',
      };
    } catch (error) {
      return {
        success: false,
        message: error.message || 'Failed to load orders',
        status: error.status,
      };
    }
  }
  /**
   * Get orders by specific status (NEW ENDPOINT)
   * @param {string} status - Order status (PENDING, CONFIRMED, PREPARING, READY, DELIVERING, COMPLETED, CANCELLED)
   * @param {Object} options - Query parameters
   */
  async getOrdersByStatus(status, { page = 0, size = 100, orderType } = {}) {
    try {
      const params = new URLSearchParams();
      params.set('page', page);
      params.set('size', size);
      if (orderType) params.set('orderType', orderType);

      const qs = params.toString();
      const response = await apiService.get(`/api/orders/status/${status}?${qs}`);
      
      return {
        success: true,
        data: response.content || response,
        totalElements: response.totalElements,
        totalPages: response.totalPages,
        message: `Orders with status ${status} loaded`,
      };
    } catch (error) {
      return {
        success: false,
        message: error.message || `Failed to load orders with status ${status}`,
        status: error.status,
      };
    }
  }
    async reOrder(orderId) {
    try {
      // POST to /api/orders/{id}/reorder
      const response = await apiService.post(`/api/orders/${orderId}/reorder`);

      return {
        success: true,
        data: response,
        message: 'Order reordered successfully',
      };
    } catch (error) {
      return {
        success: false,
        message: error.message || 'Failed to reorder order',
        status: error.status,
      };
    }
  }



  /**
   * Get orders for a specific date (NEW ENDPOINT)
   * @param {string} date - Date in YYYY-MM-DD format
   * @param {Object} options - Query parameters
   */
  async getOrdersByDate(date, { page = 0, size = 10, status } = {}) {
    try {
      const params = new URLSearchParams();
      params.set('page', page);
      params.set('size', size);
      if (status) params.set('status', status);

      const qs = params.toString();
      const response = await apiService.get(`/api/orders/date/${date}?${qs}`);
      
      console.log('Orders by Date Response:', response);

      return {
        success: true,
        data: response.content || response,
        totalElements: response.totalElements,
        totalPages: response.totalPages,
        message: 'Orders loaded for date',
      };
    } catch (error) {
      return {
        success: false,
        message: error.message || 'Failed to load orders for date',
        status: error.status,
      };
    }
  }




  // Update order (full or partial payload)
  async updateOrder(orderId, payload) {
    try {
      const response = await apiService.put(`/api/orders/${orderId}`, payload);
      return {
        success: true,
        data: response,
        message: 'Order updated successfully',
      };
    } catch (error) {
      return {
        success: false,
        message: error.message || 'Failed to update order',
        status: error.status,
      };
    }
  }

  // Update order status only
  async updateStatus(orderId, status) {
    try {
      const response = await apiService.put(`/api/orders/${orderId}/status`, {"status": status});

      return {
        success: true,
        data: response,
        message: 'Order status updated',
      };
    } catch (error) {
      return {
        success: false,
        message: error.message || 'Failed to update order status',
        status: error.status,
      };
    }
  }

  // Cancel an order with optional reason
  async cancelOrder(orderId, reason) {
    try {
      const cancellationReason = reason || "";

      const response = await apiService.post(`/api/orders/${orderId}/cancel`, { reason: cancellationReason });
      return {
        success: true,
        data: response,
        message: 'Order canceled',
      };
    } catch (error) {
      return {
        success: false,
        message: error.message || 'Failed to cancel order',
        status: error.status,
      };
    }
  }

  // Permanently delete an order (admin-only in most systems)
  async deleteOrder(orderId) {
    try {
      const response = await apiService.delete(`/api/orders/${orderId}`);
      return {
        success: true,
        data: response,
        message: 'Order deleted',
      };
    } catch (error) {
      return {
        success: false,
        message: error.message || 'Failed to delete order',
        status: error.status,
      };
    }
  }

  // Add an item to an order
  async addItem(orderId, item) {
    try {
      const response = await apiService.post(`/api/orders/${orderId}/items`, item);
      return {
        success: true,
        data: response,
        message: 'Item added to order',
      };
    } catch (error) {
      return {
        success: false,
        message: error.message || 'Failed to add item',
        status: error.status,
      };
    }
  }

  // Remove an item from an order
  async removeItem(orderId, itemId) {
    try {
      const response = await apiService.delete(`/api/orders/${orderId}/items/${itemId}`);
      return {
        success: true,
        data: response,
        message: 'Item removed from order',
      };
    } catch (error) {
      return {
        success: false,
        message: error.message || 'Failed to remove item',
        status: error.status,
      };
    }
  }

  // Update an existing item on an order
  async updateItem(orderId, itemId, partialItem) {
    try {
      const response = await apiService.put(`/api/orders/${orderId}/items/${itemId}`, partialItem);
      return {
        success: true,
        data: response,
        message: 'Item updated',
      };
    } catch (error) {
      return {
        success: false,
        message: error.message || 'Failed to update item',
        status: error.status,
      };
    }
  }

  // Submit payment for an order
  async payOrder(orderId, paymentInfo) {
    try {
      const response = await apiService.post(`/api/orders/${orderId}/pay`, paymentInfo);
      return {
        success: true,
        data: response,
        message: 'Payment processed',
      };
    } catch (error) {
      return {
        success: false,
        message: error.message || 'Payment failed',
        status: error.status,
      };
    }
  }

  // Issue a refund for an order
  async refundOrder(orderId, payload) {
    try {
      const response = await apiService.post(`/api/orders/${orderId}/refund`, payload);
      return {
        success: true,
        data: response,
        message: 'Refund processed',
      };
    } catch (error) {
      return {
        success: false,
        message: error.message || 'Refund failed',
        status: error.status,
      };
    }
  }

  // Convenience: get orders for the current authenticated user
  async getMyOrders(params = {}) {
    try {
      const q = new URLSearchParams(params).toString();
      const response = await apiService.get(`/api/orders/me${q ? `?${q}` : ''}`);
      console.log('My Orders Response:', response.content);
      return {
        success: true,
        data: response.content,
        message: 'Your orders loaded',
      };
    } catch (error) {
      return {
        success: false,
        message: error.message || 'Failed to load your orders',
        status: error.status,
      };
    }
  }

  /**
   * Get orders with ratings
   */
  async getOrdersWithRatings({ page = 0, size = 100, rating, sortBy = 'ratedAt', sortDirection = 'DESC' } = {}) {
    try {
      const params = new URLSearchParams();
      params.set('page', page.toString());
      params.set('size', size.toString());
      params.set('sortBy', sortBy);
      params.set('sortDirection', sortDirection);
      
      if (rating) params.set('rating', rating.toString());

      const qs = params.toString();
      const response = await apiService.get(`/api/orders/with-ratings?${qs}`);
      
      return {
        success: true,
        data: response.content || response,
        totalElements: response.totalElements,
        totalPages: response.totalPages,
        message: 'Orders with ratings loaded',
      };
    } catch (error) {
      return {
        success: false,
        message: error.message || 'Failed to load orders with ratings',
        status: error.status,
      };
    }
  }

  /**
   * Submit order rating
   */
  async submitOrderRating(orderId, rating, feedback) {
    try {
      const response = await apiService.post(`/api/orders/${orderId}/rating`, {
        rating,
        feedback
      });
      return {
        success: true,
        data: response,
        message: 'Rating submitted successfully',
      };
    } catch (error) {
      return {
        success: false,
        message: error.message || 'Failed to submit rating',
        status: error.status,
      };
    }
  }

  /**
   * Submit dish rating
   */
  async submitDishRating(orderId, itemId, dishRating, dishFeedback) {
    try {
      const response = await apiService.post(`/api/orders/${orderId}/items/${itemId}/rating`, {
        dishRating,
        dishFeedback
      });
      return {
        success: true,
        data: response,
        message: 'Dish rating submitted successfully',
      };
    } catch (error) {
      return {
        success: false,
        message: error.message || 'Failed to submit dish rating',
        status: error.status,
      };
    }
  }

  /**
   * Admin respond to order feedback
   */
  async respondToOrderFeedback(orderId, response) {
    try {
      const result = await apiService.post(`/api/orders/${orderId}/rating/response`, {
        response
      });
      return {
        success: true,
        data: result,
        message: 'Response submitted successfully',
      };
    } catch (error) {
      return {
        success: false,
        message: error.message || 'Failed to submit response',
        status: error.status,
      };
    }
  }

  /**
   * Admin respond to dish feedback
   */
  async respondToDishFeedback(orderId, itemId, response) {
    try {
      const result = await apiService.post(`/api/orders/${orderId}/items/${itemId}/rating/response`, {
        response
      });
      return {
        success: true,
        data: result,
        message: 'Response submitted successfully',
      };
    } catch (error) {
      return {
        success: false,
        message: error.message || 'Failed to submit response',
        status: error.status,
      };
    }
  }

}

export default new OrderService();