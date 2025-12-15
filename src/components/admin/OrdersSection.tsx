"use client";

import { useState, useEffect } from 'react';
import { Clock, Eye, CheckCircle, XCircle, AlertCircle, Calendar, Loader2, Package } from 'lucide-react';
import orderService from '@/services/orderService';

interface OrderItem {
  id: string;
  menuItemName: string;
  unitPrice: number;
  quantity: number;
  price: number;
  subtotal: number;
  specialInstructions?: string;
}

interface Order {
  id: string;
  customerName: string;
  customerPhone: string;
  deliveryAddress?: string;
  items: OrderItem[];
  subtotal: number;
  taxAmount: number;
  deliveryFee: number;
  totalAmount: number;
  status: 'PENDING' | 'PREPARING' | 'READY' | 'DELIVERED' | 'CANCELLED';
  specialInstructions?: string;
  createdAt: string;
  updatedAt: string;
}

export default function OrdersSection() {
  const [filterStatus, setFilterStatus] = useState<string>('All');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [selectedDate, setSelectedDate] = useState<string>(
    new Date().toISOString().split('T')[0]
  );
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const statuses = ['All', 'PENDING', 'PREPARING', 'READY', 'DELIVERED', 'CANCELLED'];

  // Fetch orders when date changes
  useEffect(() => {
    fetchOrdersByDate(selectedDate);
  }, [selectedDate]);

  const fetchOrdersByDate = async (date: string) => {
    setLoading(true);
    setError(null);
    try {
      const response = await orderService.getOrdersByDate(date, {
        page: 0,
        size: 100 // Fetch all orders for the day
      });

      if (response.success) {
        setOrders(response.data || []);
      } else {
        setError(response.message || 'Failed to fetch orders');
        setOrders([]);
      }
    } catch (err) {
      setError('An error occurred while fetching orders');
      setOrders([]);
      console.error('Error fetching orders:', err);
    } finally {
      setLoading(false);
    }
  };

  // Filter orders by status
  const filteredOrders = orders.filter(order => {
    return filterStatus === 'All' || order.status === filterStatus;
  });

  // Get count of orders for each status
  const getStatusCount = (status: string) => {
    if (status === 'All') return orders.length;
    return orders.filter(o => o.status === status).length;
  };

  const handleStatusChange = async (orderId: string, newStatus: Order['status']) => {
    try {
      const response = await orderService.updateStatus(orderId, newStatus);
      
      if (response.success) {
        // Update local state
        setOrders(orders.map(order => 
          order.id === orderId ? { ...order, status: newStatus } : order
        ));
        
        // Update selected order if it's open
        if (selectedOrder && selectedOrder.id === orderId) {
          setSelectedOrder({ ...selectedOrder, status: newStatus });
        }
      } else {
        alert(response.message || 'Failed to update order status');
      }
    } catch (err) {
      console.error('Error updating order status:', err);
      alert('An error occurred while updating order status');
    }
  };

  const handleCancelOrder = async (orderId: string, reason?: string) => {
    if (!confirm('Are you sure you want to cancel this order?')) {
      return;
    }

    try {
      const response = await orderService.cancelOrder(orderId, reason || 'Cancelled by staff');
      
      if (response.success) {
        // Update local state
        setOrders(orders.map(order => 
          order.id === orderId ? { ...order, status: 'CANCELLED' } : order
        ));
        
        // Update selected order if it's open
        if (selectedOrder && selectedOrder.id === orderId) {
          setSelectedOrder({ ...selectedOrder, status: 'CANCELLED' });
        }
        
        alert('Order cancelled successfully');
      } else {
        alert(response.message || 'Failed to cancel order');
      }
    } catch (err) {
      console.error('Error cancelling order:', err);
      alert('An error occurred while cancelling the order');
    }
  };

  const getStatusColor = (status: Order['status']) => {
    switch (status) {
      case 'PENDING': return 'bg-yellow-100 text-yellow-700';
      case 'PREPARING': return 'bg-blue-100 text-blue-700';
      case 'READY': return 'bg-green-100 text-green-700';
      case 'DELIVERED': return 'bg-gray-100 text-gray-700';
      case 'CANCELLED': return 'bg-red-100 text-red-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const getStatusLabel = (status: Order['status']) => {
    return status.charAt(0) + status.slice(1).toLowerCase();
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: true 
    });
  };

  const formatDisplayDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      weekday: 'short',
      month: 'short', 
      day: 'numeric',
      year: 'numeric'
    });
  };

  return (
    <section id="orders" className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold text-white drop-shadow-lg">Orders Management</h2>
          <p className="text-white/80 mt-1">
            {loading ? 'Loading...' : `${orders.length} orders on ${formatDisplayDate(selectedDate)}`}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 px-4 py-2 bg-white/90 rounded-xl shadow-lg">
            <Clock className="w-5 h-5 text-orange-500" />
            <span className="text-sm font-medium">Live Updates</span>
          </div>
        </div>
      </div>

      {/* Date Selector */}
      <div className="p-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
          <div className="flex items-center gap-2 text-gray-700">
            <Calendar className="w-5 h-5 text-orange-500" />
            <label htmlFor="order-date" className="text-white font-semibold">Select Date:</label>
          </div>
          <div className="flex items-center gap-3 bg-white rounded-xl shadow-lg">
            <input
              id="order-date"
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              max={new Date().toISOString().split('T')[0]}
              className="px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-orange-500 focus:outline-none font-medium text-gray-700"
            />
          </div>
        </div>
      </div>

      {/* Status Filter */}
      <div className="flex flex-wrap gap-2">
        {statuses.map((status) => {
          const count = getStatusCount(status);

          return (
            <button
              key={status}
              onClick={() => setFilterStatus(status)}
              className={`px-4 py-2 rounded-xl font-medium text-sm transition-all ${
                filterStatus === status
                  ? 'bg-gradient-to-r from-orange-500 to-red-500 text-white shadow-lg'
                  : 'bg-white text-gray-700 hover:bg-gray-50 shadow'
              }`}
            >
              {status === 'All' ? 'All' : getStatusLabel(status as Order['status'])}
              <span className="ml-2 text-xs">
                ({count})
              </span>
            </button>
          );
        })}
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-4 flex items-center gap-3">
          <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0" />
          <p className="text-red-700">{error}</p>
        </div>
      )}

      {/* Orders Table */}
      <div className="rounded-2xl border-2 border-white/20 bg-white shadow-xl overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-8 h-8 text-orange-500 animate-spin" />
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-gradient-to-r from-gray-50 to-gray-100">
                    <th className="text-left px-6 py-4 text-xs font-semibold text-gray-600 uppercase tracking-wider">Order ID</th>
                    <th className="text-left px-6 py-4 text-xs font-semibold text-gray-600 uppercase tracking-wider">Customer</th>
                    <th className="text-left px-6 py-4 text-xs font-semibold text-gray-600 uppercase tracking-wider">Items</th>
                    <th className="text-left px-6 py-4 text-xs font-semibold text-gray-600 uppercase tracking-wider">Total</th>
                    <th className="text-left px-6 py-4 text-xs font-semibold text-gray-600 uppercase tracking-wider">Status</th>
                    <th className="text-left px-6 py-4 text-xs font-semibold text-gray-600 uppercase tracking-wider">Time</th>
                    <th className="text-right px-6 py-4 text-xs font-semibold text-gray-600 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {filteredOrders.map((order) => (
                    <tr key={order.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="font-bold text-gray-900">#{order.id}</div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="font-medium text-gray-900">{order.customerName}</div>
                        <div className="text-xs text-gray-500">{order.customerPhone}</div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <Package className="w-4 h-4 text-gray-400" />
                          <span className="text-sm text-gray-600">
                            {order.items?.length || 0} {order.items?.length === 1 ? 'item' : 'items'}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 font-semibold text-gray-900">
                        ${order.totalAmount.toFixed(2)}
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                          {getStatusLabel(order.status)}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">
                        {formatTime(order.createdAt)}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => setSelectedOrder(order)}
                            className="p-2 rounded-lg bg-blue-50 text-blue-600 hover:bg-blue-100 transition-colors"
                            title="View Details"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          {order.status === 'PENDING' && (
                            <button
                              onClick={() => handleStatusChange(order.id, 'PREPARING')}
                              className="p-2 rounded-lg bg-green-50 text-green-600 hover:bg-green-100 transition-colors"
                              title="Start Preparing"
                            >
                              <CheckCircle className="w-4 h-4" />
                            </button>
                          )}
                          {order.status !== 'CANCELLED' && order.status !== 'DELIVERED' && (
                            <button
                              onClick={() => handleCancelOrder(order.id)}
                              className="p-2 rounded-lg bg-red-50 text-red-600 hover:bg-red-100 transition-colors"
                              title="Cancel Order"
                            >
                              <XCircle className="w-4 h-4" />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {filteredOrders.length === 0 && !loading && (
              <div className="text-center py-12 text-gray-500">
                <AlertCircle className="w-12 h-12 mx-auto mb-3 text-gray-400" />
                <p className="font-medium">No orders found</p>
                <p className="text-sm mt-1">
                  {error 
                    ? 'Unable to load orders. Please try again.' 
                    : `There are no ${filterStatus === 'All' ? '' : filterStatus.toLowerCase()} orders for ${formatDisplayDate(selectedDate)}`
                  }
                </p>
              </div>
            )}
          </>
        )}
      </div>

      {/* Order Detail Modal */}
      {selectedOrder && (
        <OrderDetailModal
          order={selectedOrder}
          onClose={() => setSelectedOrder(null)}
          onStatusChange={handleStatusChange}
          onCancelOrder={handleCancelOrder}
        />
      )}
    </section>
  );
}

function OrderDetailModal({ 
  order, 
  onClose, 
  onStatusChange,
  onCancelOrder
}: { 
  order: Order; 
  onClose: () => void;
  onStatusChange: (orderId: string, status: Order['status']) => void;
  onCancelOrder: (orderId: string) => void;
}) {
  const getStatusColor = (status: Order['status']) => {
    switch (status) {
      case 'PENDING': return 'bg-yellow-100 text-yellow-700';
      case 'PREPARING': return 'bg-blue-100 text-blue-700';
      case 'READY': return 'bg-green-100 text-green-700';
      case 'DELIVERED': return 'bg-gray-100 text-gray-700';
      case 'CANCELLED': return 'bg-red-100 text-red-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const getStatusLabel = (status: Order['status']) => {
    return status.charAt(0) + status.slice(1).toLowerCase();
  };

  const formatDateTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString('en-US', {
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-2xl max-w-3xl w-full my-8">
        <div className="sticky top-0 bg-gradient-to-r from-orange-500 to-red-500 text-white px-6 py-4 flex items-center justify-between rounded-t-2xl">
          <div>
            <h3 className="text-xl font-bold">Order Details</h3>
            <p className="text-sm text-white/90 mt-1">Order ID: #{order.id}</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-lg transition-colors">
            <XCircle className="w-5 h-5" />
          </button>
        </div>
        
        <div className="p-6 space-y-6">
          {/* Order Status & Time */}
          <div className="flex items-center justify-between pb-4 border-b">
            <div>
              <span className={`px-4 py-2 rounded-full text-sm font-medium ${getStatusColor(order.status)}`}>
                {getStatusLabel(order.status)}
              </span>
            </div>
            <div className="text-right">
              <div className="text-sm text-gray-600">Order Date</div>
              <div className="font-medium text-gray-900">{formatDateTime(order.createdAt)}</div>
            </div>
          </div>

          {/* Customer Information */}
          <div>
            <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
              <div className="w-1 h-5 bg-orange-500 rounded"></div>
              Customer Information
            </h4>
            <div className="bg-gray-50 rounded-lg p-4 space-y-3">
              <div className="flex justify-between items-start">
                <span className="text-gray-600">Name:</span>
                <span className="font-medium text-right">{order.customerName}</span>
              </div>
              <div className="flex justify-between items-start">
                <span className="text-gray-600">Phone:</span>
                <span className="font-medium">{order.customerPhone}</span>
              </div>
              {order.deliveryAddress && (
                <div className="flex justify-between items-start">
                  <span className="text-gray-600">Delivery Address:</span>
                  <span className="font-medium text-right max-w-xs">{order.deliveryAddress}</span>
                </div>
              )}
            </div>
          </div>

          {/* Special Instructions */}
          {order.specialInstructions && (
            <div>
              <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                <div className="w-1 h-5 bg-orange-500 rounded"></div>
                Special Instructions
              </h4>
              <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
                <p className="text-gray-700">{order.specialInstructions}</p>
              </div>
            </div>
          )}

          {/* Order Items */}
          <div>
            <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
              <div className="w-1 h-5 bg-orange-500 rounded"></div>
              Order Items ({order.items?.length})
            </h4>
            <div className="space-y-3">
              {order.items.map((item, idx) => (
                <div key={idx} className="bg-gray-50 rounded-lg p-4">
                  <div className="flex justify-between items-start mb-2">
                    <div className="flex items-start gap-3 flex-1">
                      <div className="w-10 h-10 rounded-full bg-orange-100 text-orange-600 flex items-center justify-center font-semibold flex-shrink-0">
                        {item.quantity}×
                      </div>
                      <div className="flex-1">
                        <span className="font-medium text-gray-900 block">{item.menuItemName}</span>
                        <span className="text-sm text-gray-600">${item.unitPrice.toFixed(2)} each</span>
                        {item.specialInstructions && (
                          <div className="mt-2 text-sm text-gray-600 bg-white rounded px-3 py-2 border border-gray-200">
                            <span className="font-medium">Note:</span> {item.specialInstructions}
                          </div>
                        )}
                      </div>
                    </div>
                    <span className="font-semibold text-gray-900 ml-4">${item.subtotal.toFixed(2)}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Order Summary */}
          <div>
            <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
              <div className="w-1 h-5 bg-orange-500 rounded"></div>
              Order Summary
            </h4>
            <div className="bg-gray-50 rounded-lg p-4 space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Subtotal:</span>
                <span className="font-medium">${order.subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Tax:</span>
                <span className="font-medium">${order.taxAmount.toFixed(2)}</span>
              </div>
              {order.deliveryFee > 0 && (
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Delivery Fee:</span>
                  <span className="font-medium">${order.deliveryFee.toFixed(2)}</span>
                </div>
              )}
              <div className="pt-3 border-t-2 border-gray-200 flex justify-between items-center">
                <span className="font-bold text-lg text-gray-900">Total Amount:</span>
                <span className="font-bold text-2xl text-orange-600">${order.totalAmount.toFixed(2)}</span>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap gap-3 pt-4 border-t">
            {order.status === 'PENDING' && (
              <button
                onClick={() => {
                  onStatusChange(order.id, 'PREPARING');
                  onClose();
                }}
                className="flex-1 min-w-[200px] px-6 py-3 bg-blue-500 text-white rounded-xl font-semibold hover:bg-blue-600 transition-colors flex items-center justify-center gap-2"
              >
                <CheckCircle className="w-5 h-5" />
                Start Preparing
              </button>
            )}
            {order.status === 'PREPARING' && (
              <button
                onClick={() => {
                  onStatusChange(order.id, 'READY');
                  onClose();
                }}
                className="flex-1 min-w-[200px] px-6 py-3 bg-green-500 text-white rounded-xl font-semibold hover:bg-green-600 transition-colors flex items-center justify-center gap-2"
              >
                <CheckCircle className="w-5 h-5" />
                Mark as Ready
              </button>
            )}
            {order.status === 'READY' && (
              <button
                onClick={() => {
                  onStatusChange(order.id, 'DELIVERED');
                  onClose();
                }}
                className="flex-1 min-w-[200px] px-6 py-3 bg-gray-700 text-white rounded-xl font-semibold hover:bg-gray-800 transition-colors flex items-center justify-center gap-2"
              >
                <CheckCircle className="w-5 h-5" />
                Mark as Delivered
              </button>
            )}
            {order.status !== 'CANCELLED' && order.status !== 'DELIVERED' && (
              <button
                onClick={() => {
                  onCancelOrder(order.id);
                  onClose();
                }}
                className="flex-1 min-w-[200px] px-6 py-3 bg-red-500 text-white rounded-xl font-semibold hover:bg-red-600 transition-colors flex items-center justify-center gap-2"
              >
                <XCircle className="w-5 h-5" />
                Cancel Order
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}