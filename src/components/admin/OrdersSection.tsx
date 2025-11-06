"use client";

import { useState, useEffect } from 'react';
import { Clock, Eye, CheckCircle, XCircle, AlertCircle, Calendar } from 'lucide-react';

interface Order {
  id: string;
  customerName: string;
  customerPhone: string;
  items: { name: string; quantity: number; price: number }[];
  total: number;
  status: 'Pending' | 'Preparing' | 'Ready' | 'Delivered' | 'Cancelled';
  type: 'Dine-in' | 'Takeout' | 'Delivery';
  createdAt: Date;
  tableNumber?: string;
  deliveryAddress?: string;
}

export default function OrdersSection() {
  const [filterStatus, setFilterStatus] = useState<string>('All');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [selectedDate, setSelectedDate] = useState<string>(
    new Date().toISOString().split('T')[0]
  );
  
  const [orders, setOrders] = useState<Order[]>([
    {
      id: '#1045',
      customerName: 'John Doe',
      customerPhone: '+1-555-0123',
      items: [
        { name: 'Classic Burger', quantity: 2, price: 12.99 },
        { name: 'French Fries', quantity: 1, price: 4.50 }
      ],
      total: 30.48,
      status: 'Preparing',
      type: 'Dine-in',
      createdAt: new Date(Date.now() - 10 * 60000),
      tableNumber: 'T-12'
    },
    {
      id: '#1044',
      customerName: 'Sarah Smith',
      customerPhone: '+1-555-0124',
      items: [
        { name: 'Caesar Salad', quantity: 1, price: 8.50 },
        { name: 'Grilled Salmon', quantity: 1, price: 18.99 }
      ],
      total: 27.49,
      status: 'Ready',
      type: 'Takeout',
      createdAt: new Date(Date.now() - 25 * 60000)
    },
    {
      id: '#1043',
      customerName: 'Mike Johnson',
      customerPhone: '+1-555-0125',
      items: [
        { name: 'Margherita Pizza', quantity: 2, price: 14.99 },
        { name: 'Chocolate Cake', quantity: 2, price: 6.99 }
      ],
      total: 43.96,
      status: 'Delivered',
      type: 'Delivery',
      createdAt: new Date(Date.now() - 45 * 60000),
      deliveryAddress: '123 Main St, Apt 4B'
    },
    {
      id: '#1042',
      customerName: 'Emma Wilson',
      customerPhone: '+1-555-0126',
      items: [
        { name: 'Classic Burger', quantity: 1, price: 12.99 }
      ],
      total: 12.99,
      status: 'Pending',
      type: 'Dine-in',
      createdAt: new Date(Date.now() - 5 * 60000),
      tableNumber: 'T-8'
    },
    // Sample orders from yesterday
    {
      id: '#1041',
      customerName: 'David Brown',
      customerPhone: '+1-555-0127',
      items: [
        { name: 'Pepperoni Pizza', quantity: 1, price: 15.99 }
      ],
      total: 15.99,
      status: 'Delivered',
      type: 'Delivery',
      createdAt: new Date(Date.now() - 24 * 60 * 60000 - 2 * 60000),
      deliveryAddress: '456 Oak Avenue'
    },
    {
      id: '#1040',
      customerName: 'Lisa Anderson',
      customerPhone: '+1-555-0128',
      items: [
        { name: 'Chicken Wings', quantity: 2, price: 9.99 }
      ],
      total: 19.98,
      status: 'Delivered',
      type: 'Takeout',
      createdAt: new Date(Date.now() - 24 * 60 * 60000 - 3 * 60000)
    }
  ]);

  const statuses = ['All', 'Pending', 'Preparing', 'Ready', 'Delivered', 'Cancelled'];

  // Filter orders by selected date and status
  const filteredOrders = orders.filter(order => {
    const orderDate = new Date(order.createdAt).toISOString().split('T')[0];
    const matchesDate = orderDate === selectedDate;
    const matchesStatus = filterStatus === 'All' || order.status === filterStatus;
    return matchesDate && matchesStatus;
  });

  // Get count of orders for the selected date
  const dateOrderCount = orders.filter(order => {
    const orderDate = new Date(order.createdAt).toISOString().split('T')[0];
    return orderDate === selectedDate;
  }).length;

  const handleStatusChange = (orderId: string, newStatus: Order['status']) => {
    setOrders(orders.map(order => 
      order.id === orderId ? { ...order, status: newStatus } : order
    ));
  };

  const getStatusColor = (status: Order['status']) => {
    switch (status) {
      case 'Pending': return 'bg-yellow-100 text-yellow-700';
      case 'Preparing': return 'bg-blue-100 text-blue-700';
      case 'Ready': return 'bg-green-100 text-green-700';
      case 'Delivered': return 'bg-gray-100 text-gray-700';
      case 'Cancelled': return 'bg-red-100 text-red-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const getTypeColor = (type: Order['type']) => {
    switch (type) {
      case 'Dine-in': return 'bg-purple-100 text-purple-700';
      case 'Takeout': return 'bg-orange-100 text-orange-700';
      case 'Delivery': return 'bg-blue-100 text-blue-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: true 
    });
  };

  const formatDisplayDate = (dateString: string) => {
    const date = new Date(dateString);


    const dateOnly = date.toISOString().split('T')[0];


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
          <p className="text-white/80 mt-1">{dateOrderCount} orders on {formatDisplayDate(selectedDate)}</p>
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
          const statusCount = orders.filter(o => {
            const orderDate = new Date(o.createdAt).toISOString().split('T')[0];
            const matchesDate = orderDate === selectedDate;
            const matchesStatus = status === 'All' || o.status === status;
            return matchesDate && matchesStatus;
          }).length;

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
              {status}
              <span className="ml-2 text-xs">
                ({statusCount})
              </span>
            </button>
          );
        })}
      </div>

      {/* Orders Table */}
      <div className="rounded-2xl border-2 border-white/20 bg-white shadow-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gradient-to-r from-gray-50 to-gray-100">
                <th className="text-left px-6 py-4 text-xs font-semibold text-gray-600 uppercase tracking-wider">Order</th>
                <th className="text-left px-6 py-4 text-xs font-semibold text-gray-600 uppercase tracking-wider">Customer</th>
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
                    <div className="font-bold text-gray-900">{order.id}</div>
                    {order.tableNumber && (
                      <div className="text-xs text-gray-500">Table {order.tableNumber}</div>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <div className="font-medium text-gray-900">{order.customerName}</div>
                    <div className="text-xs text-gray-500">{order.customerPhone}</div>
                  </td>
                  <td className="px-6 py-4 font-semibold text-gray-900">${order.total.toFixed(2)}</td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                      {order.status}
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
                      {order.status === 'Pending' && (
                        <button
                          onClick={() => handleStatusChange(order.id, 'Preparing')}
                          className="p-2 rounded-lg bg-green-50 text-green-600 hover:bg-green-100 transition-colors"
                          title="Start Preparing"
                        >
                          <CheckCircle className="w-4 h-4" />
                        </button>
                      )}
                      {(order.status === 'Pending' || order.status === 'Preparing') && (
                        <button
                          onClick={() => handleStatusChange(order.id, 'Cancelled')}
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

        {filteredOrders.length === 0 && (
          <div className="text-center py-12 text-gray-500">
            <AlertCircle className="w-12 h-12 mx-auto mb-3 text-gray-400" />
            <p className="font-medium">No orders found</p>
            <p className="text-sm mt-1">There are no orders for {formatDisplayDate(selectedDate)}</p>
          </div>
        )}
      </div>

      {/* Order Detail Modal */}
      {selectedOrder && (
        <OrderDetailModal
          order={selectedOrder}
          onClose={() => setSelectedOrder(null)}
          onStatusChange={handleStatusChange}
        />
      )}
    </section>
  );
}

function OrderDetailModal({ 
  order, 
  onClose, 
  onStatusChange 
}: { 
  order: Order; 
  onClose: () => void;
  onStatusChange: (orderId: string, status: Order['status']) => void;
}) {
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-gradient-to-r from-orange-500 to-red-500 text-white px-6 py-4 flex items-center justify-between">
          <h3 className="text-xl font-bold">Order Details - {order.id}</h3>
          <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-lg transition-colors">
            <XCircle className="w-5 h-5" />
          </button>
        </div>
        
        <div className="p-6 space-y-6">
          {/* Customer Info */}
          <div>
            <h4 className="font-semibold text-gray-900 mb-3">Customer Information</h4>
            <div className="bg-gray-50 rounded-lg p-4 space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-600">Name:</span>
                <span className="font-medium">{order.customerName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Phone:</span>
                <span className="font-medium">{order.customerPhone}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Order Type:</span>
                <span className="font-medium">{order.type}</span>
              </div>
              {order.tableNumber && (
                <div className="flex justify-between">
                  <span className="text-gray-600">Table:</span>
                  <span className="font-medium">{order.tableNumber}</span>
                </div>
              )}
              {order.deliveryAddress && (
                <div className="flex justify-between">
                  <span className="text-gray-600">Address:</span>
                  <span className="font-medium text-right">{order.deliveryAddress}</span>
                </div>
              )}
            </div>
          </div>

          {/* Order Items */}
          <div>
            <h4 className="font-semibold text-gray-900 mb-3">Order Items</h4>
            <div className="space-y-2">
              {order.items.map((item, idx) => (
                <div key={idx} className="flex justify-between items-center bg-gray-50 rounded-lg p-3">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-orange-100 text-orange-600 flex items-center justify-center font-semibold text-sm">
                      {item.quantity}
                    </div>
                    <span className="font-medium">{item.name}</span>
                  </div>
                  <span className="font-semibold">${(item.price * item.quantity).toFixed(2)}</span>
                </div>
              ))}
            </div>
            <div className="mt-4 pt-4 border-t flex justify-between items-center">
              <span className="font-bold text-lg">Total:</span>
              <span className="font-bold text-2xl text-orange-600">${order.total.toFixed(2)}</span>
            </div>
          </div>

          {/* Status Update */}
          <div>
            <h4 className="font-semibold text-gray-900 mb-3">Update Status</h4>
            <div className="grid grid-cols-2 gap-3">
              {['Preparing', 'Ready', 'Delivered', 'Cancelled'].map((status) => (
                <button
                  key={status}
                  onClick={() => {
                    onStatusChange(order.id, status as Order['status']);
                    onClose();
                  }}
                  disabled={order.status === status}
                  className={`px-4 py-3 rounded-lg font-medium transition-all ${
                    order.status === status
                      ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                      : 'bg-gradient-to-r from-orange-500 to-red-500 text-white hover:shadow-lg'
                  }`}
                >
                  {status}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}