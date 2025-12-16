"use client";

import { useState, useEffect } from 'react';
import { 
  Package, 
  MapPin, 
  Phone, 
  User, 
  Clock, 
  DollarSign,
  TrendingUp,
  CheckCircle,
  AlertCircle,
  Navigation,
  ChevronRight,
  ShoppingBag,
  RefreshCw
} from 'lucide-react';
import orderService from '@/services/orderService';

// Backend Order interface matching the API response
interface BackendOrder {
  id: number;
  orderNumber: string;
  status: 'PENDING' | 'CONFIRMED' | 'PREPARING' | 'READY' | 'DELIVERING' | 'COMPLETED' | 'CANCELLED';
  orderType: 'DELIVERY' | 'DINE_IN' | 'TAKEOUT';
  items: {
    id: number;
    menuItemId: number;
    menuItemName: string;
    unitPrice: number;
    quantity: number;
    subtotal: number;
    specialInstructions: string | null;
  }[];
  subtotal: number;
  taxAmount: number;
  deliveryFee: number;
  discountAmount: number;
  totalAmount: number;
  customerName: string;
  customerPhone: string;
  customerEmail: string;
  deliveryAddress: string;
  specialInstructions: string | null;
  estimatedPreparationTime: number | null;
  preparationStartedAt: string | null;
  readyAt: string | null;
  completedAt: string | null;
  createdAt: string;
  updatedAt: string;
}

// Frontend delivery order interface
interface DeliveryOrder {
  id: string;
  backendId: number;
  customerName: string;
  customerPhone: string;
  deliveryAddress: string;
  items: { name: string; quantity: number; price: number }[];
  total: number;
  orderTime: Date;
  distance: string;
  estimatedTime: string;
  status: 'Available' | 'In Progress' | 'Completed';
  assignedTo?: string;
  completedTime?: Date;
  specialInstructions?: string;
}

export default function DeliveriesSection() {
  const [activeTab, setActiveTab] = useState<'available' | 'myDeliveries'>('available');
  const [selectedOrder, setSelectedOrder] = useState<DeliveryOrder | null>(null);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Simulated employee ID - in real app, get from auth
  const currentEmployeeId = "EMP001";
  const currentEmployeeName = "Nguyen Van A";

  const [availableOrders, setAvailableOrders] = useState<DeliveryOrder[]>([]);
  const [myDeliveries, setMyDeliveries] = useState<DeliveryOrder[]>([]);

  // Helper function to calculate estimated distance (mock implementation)
  const calculateDistance = (address: string): string => {
    const distances = ['1.5 km', '1.8 km', '2.1 km', '2.3 km', '2.8 km', '3.5 km', '4.2 km'];
    return distances[Math.floor(Math.random() * distances.length)];
  };

  // Helper function to calculate estimated time based on distance
  const calculateEstimatedTime = (distance: string): string => {
    const km = parseFloat(distance);
    const minutes = Math.ceil(km * 5) + Math.floor(Math.random() * 5);
    return `${minutes}-${minutes + 5} min`;
  };

  // Convert backend order to frontend delivery order
  const convertToDeliveryOrder = (order: BackendOrder, frontendStatus: 'Available' | 'In Progress' | 'Completed'): DeliveryOrder => {
    const distance = calculateDistance(order.deliveryAddress);
    return {
      id: order.orderNumber,
      backendId: order.id,
      customerName: order.customerName,
      customerPhone: order.customerPhone,
      deliveryAddress: order.deliveryAddress,
      items: order.items.map(item => ({
        name: item.menuItemName,
        quantity: item.quantity,
        price: item.unitPrice
      })),
      total: order.totalAmount,
      orderTime: new Date(order.createdAt),
      distance: distance,
      estimatedTime: calculateEstimatedTime(distance),
      status: frontendStatus,
      specialInstructions: order.specialInstructions || undefined,
      completedTime: order.completedAt ? new Date(order.completedAt) : undefined
    };
  };

  // Fetch orders from backend by status
  const fetchOrders = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      // Fetch orders by different statuses
      const [readyResponse, deliveringResponse, completedResponse] = await Promise.all([
        orderService.getOrdersByStatus('READY', { size: 100, orderType: 'DELIVERY' }),
        orderService.getOrdersByStatus('DELIVERING', { size: 100, orderType: 'DELIVERY' }),
        orderService.getOrdersByStatus('COMPLETED', { size: 100, orderType: 'DELIVERY' })
      ]);

      // Process available orders (READY status)
      const available: DeliveryOrder[] = [];
      if (readyResponse.success && readyResponse.data) {
        const orders = Array.isArray(readyResponse.data) ? readyResponse.data : [];
        orders.forEach((order: BackendOrder) => {
          available.push(convertToDeliveryOrder(order, 'Available'));
        });
      }

      // Process orders in delivery and completed
      const assigned: DeliveryOrder[] = [];
      
      if (deliveringResponse.success && deliveringResponse.data) {
        const orders = Array.isArray(deliveringResponse.data) ? deliveringResponse.data : [];
        orders.forEach((order: BackendOrder) => {
          const deliveryOrder = convertToDeliveryOrder(order, 'In Progress');
          deliveryOrder.assignedTo = currentEmployeeId;
          assigned.push(deliveryOrder);
        });
      }

      if (completedResponse.success && completedResponse.data) {
        const orders = Array.isArray(completedResponse.data) ? completedResponse.data : [];
        orders.forEach((order: BackendOrder) => {
          const deliveryOrder = convertToDeliveryOrder(order, 'Completed');
          deliveryOrder.assignedTo = currentEmployeeId;
          assigned.push(deliveryOrder);
        });
      }

      // Sort assigned orders: In Progress first, then Completed by completion time
      assigned.sort((a, b) => {
        if (a.status === 'In Progress' && b.status === 'Completed') return -1;
        if (a.status === 'Completed' && b.status === 'In Progress') return 1;
        if (a.completedTime && b.completedTime) {
          return b.completedTime.getTime() - a.completedTime.getTime();
        }
        return 0;
      });

      setAvailableOrders(available);
      setMyDeliveries(assigned);

    } catch (err) {
      console.error('Error fetching orders:', err);
      setError('An error occurred while fetching orders');
    } finally {
      setIsLoading(false);
    }
  };

  // Load orders on component mount
  useEffect(() => {
    fetchOrders();
    
    // Set up polling to refresh orders every 30 seconds
    const interval = setInterval(fetchOrders, 30000);
    
    return () => clearInterval(interval);
  }, []);

  const handleAcceptOrder = async (order: DeliveryOrder) => {
    try {
      // Update order status to DELIVERING in backend
      const response = await orderService.updateStatus(order.backendId, 'DELIVERING');
      
      if (response.success) {
        // Move order from available to my deliveries
        const updatedOrder = { 
          ...order, 
          status: 'In Progress' as const,
          assignedTo: currentEmployeeId 
        };
        
        setAvailableOrders(availableOrders.filter(o => o.id !== order.id));
        setMyDeliveries([updatedOrder, ...myDeliveries]);
        
        alert(`Accepted delivery order ${order.id}`);
      } else {
        alert(`Lỗi: ${response.message}`);
      }
    } catch (err) {
      console.error('Error accepting order:', err);
      alert('Unable to accept the order. Please try again.');
    }
  };

  const handleCompleteDelivery = (order: DeliveryOrder) => {
    setSelectedOrder(order);
    setShowConfirmModal(true);
  };

  const confirmCompleteDelivery = async () => {
    if (!selectedOrder) return;
    
    try {
      // Update order status to COMPLETED in backend
      const response = await orderService.updateStatus(selectedOrder.backendId, 'COMPLETED');
      
      if (response.success) {
        // Update the order status to Completed
        const updatedDeliveries = myDeliveries.map(order => 
          order.id === selectedOrder.id 
            ? { ...order, status: 'Completed' as const, completedTime: new Date() }
            : order
        );
        
        setMyDeliveries(updatedDeliveries);
        setShowConfirmModal(false);
        setSelectedOrder(null);
        
        alert(`Successfully confirmed delivery for order ${selectedOrder.id}`);
      } else {
        alert(`Lỗi: ${response.message}`);
      }
    } catch (err) {
      console.error('Error completing delivery:', err);
      alert('Unable to complete the order. Please try again.');
    }
  };

  const getTimeSince = (date: Date) => {
    const minutes = Math.floor((Date.now() - date.getTime()) / 60000);
    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes} minutes ago`;
    const hours = Math.floor(minutes / 60);
    return `${hours} hours ${minutes % 60} minutes ago`;
  };

  const totalEarnings = myDeliveries
    .filter(order => order.status === 'Completed')
    .reduce((sum, order) => sum + order.total * 0.1, 0); // 10% commission

  const inProgressCount = myDeliveries.filter(o => o.status === 'In Progress').length;
  const completedCount = myDeliveries.filter(o => o.status === 'Completed').length;

  return (
    <section id="deliveries" className="space-y-6">
      {/* Header with Refresh Button */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">Delivery Management</h2>
        <button
          onClick={fetchOrders}
          disabled={isLoading}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/80 backdrop-blur-md border-2 border-white/40 shadow-lg hover:shadow-xl transition-all disabled:opacity-50"
        >
          <RefreshCw className={`w-5 h-5 ${isLoading ? 'animate-spin' : ''}`} />
          <span className="font-semibold">Refresh</span>
        </button>
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-50/80 backdrop-blur-sm border border-red-200 rounded-xl p-4 flex items-center gap-3">
          <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0" />
          <p className="text-red-800 font-medium">{error}</p>
        </div>
      )}

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="rounded-2xl border-2 border-white/30 bg-gradient-to-br from-orange-50/70 to-white/70 backdrop-blur-xl shadow-xl p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-semibold text-gray-700 drop-shadow-sm">Available Orders</p>
              <p className="text-3xl font-bold text-orange-600 drop-shadow-md">{availableOrders.length}</p>
            </div>
            <Package className="w-12 h-12 text-orange-500 opacity-80" />
          </div>
        </div>

        <div className="rounded-2xl border-2 border-white/30 bg-gradient-to-br from-blue-50/70 to-white/70 backdrop-blur-xl shadow-xl p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-semibold text-gray-700 drop-shadow-sm">In Delivery</p>
              <p className="text-3xl font-bold text-blue-600 drop-shadow-md">{inProgressCount}</p>
            </div>
            <Navigation className="w-12 h-12 text-blue-500 opacity-80" />
          </div>
        </div>

        <div className="rounded-2xl border-2 border-white/30 bg-gradient-to-br from-green-50/70 to-white/70 backdrop-blur-xl shadow-xl p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-semibold text-gray-700 drop-shadow-sm">Completed</p>
              <p className="text-3xl font-bold text-green-600 drop-shadow-md">{completedCount}</p>
            </div>
            <CheckCircle className="w-12 h-12 text-green-500 opacity-80" />
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 backdrop-blur-md bg-white/60 rounded-2xl p-2 shadow-xl border-2 border-white/30">
        <button
          onClick={() => setActiveTab('available')}
          className={`flex-1 px-6 py-3 rounded-xl font-bold text-sm transition-all ${
            activeTab === 'available'
              ? 'bg-gradient-to-r from-orange-500 to-red-500 text-white shadow-xl'
              : 'text-gray-800 hover:bg-white/50'
          }`}
        >
          <div className="flex items-center justify-center gap-2">
            <Package className="w-5 h-5" />
            Available Orders ({availableOrders.length})
          </div>
        </button>
        <button
          onClick={() => setActiveTab('myDeliveries')}
          className={`flex-1 px-6 py-3 rounded-xl font-bold text-sm transition-all ${
            activeTab === 'myDeliveries'
              ? 'bg-gradient-to-r from-orange-500 to-red-500 text-white shadow-xl'
              : 'text-gray-800 hover:bg-white/50'
          }`}
        >
          <div className="flex items-center justify-center gap-2">
            <Navigation className="w-5 h-5" />
            My Deliveries ({myDeliveries.length})
          </div>
        </button>
      </div>

      {/* Loading State */}
      {isLoading && (
        <div className="flex items-center justify-center py-12">
          <div className="flex flex-col items-center gap-3">
            <RefreshCw className="w-12 h-12 text-orange-500 animate-spin" />
            <p className="text-gray-700 font-medium">Đang tải đơn hàng...</p>
          </div>
        </div>
      )}

      {/* Available Orders Section */}
      {!isLoading && activeTab === 'available' && (
        <div className="space-y-4">
          {availableOrders.length === 0 ? (
            <div className="rounded-2xl border-2 border-white/30 bg-white/70 backdrop-blur-xl shadow-2xl p-12 text-center">
              <Package className="w-16 h-16 mx-auto mb-4 text-gray-400" />
              <h3 className="text-xl font-bold text-gray-900 mb-2 drop-shadow-sm">No Orders Available</h3>
              <p className="text-gray-700 font-medium drop-shadow-sm">There are currently no delivery orders to accept</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {availableOrders.map((order) => (
                <div key={order.id} className="rounded-2xl border-2 border-white/30 bg-white/70 backdrop-blur-xl shadow-2xl p-6 hover:shadow-3xl transition-all">
                  {/* Order Header */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-orange-500 to-red-500 flex items-center justify-center shadow-xl ring-2 ring-white/40">
                        <ShoppingBag className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <div className="font-bold text-lg text-gray-900 drop-shadow-sm">{order.id}</div>
                        <div className="text-xs text-gray-700 font-medium drop-shadow-sm flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {getTimeSince(order.orderTime)}
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-xs text-gray-700 font-semibold drop-shadow-sm">Total</div>
                      <div className="text-xl font-bold text-green-700 drop-shadow-md">{order.total.toFixed(2)} VND</div>
                    </div>
                  </div>

                  {/* Customer Info */}
                  <div className="space-y-3 mb-4">
                    <div className="flex items-start gap-2">
                      <User className="w-4 h-4 text-orange-500 mt-1 flex-shrink-0" />
                      <div className="flex-1">
                        <div className="text-xs text-gray-700 font-semibold drop-shadow-sm">Customer</div>
                        <div className="text-sm font-bold text-gray-900 drop-shadow-sm">{order.customerName}</div>
                      </div>
                    </div>

                    <div className="flex items-start gap-2">
                      <Phone className="w-4 h-4 text-orange-500 mt-1 flex-shrink-0" />
                      <div className="flex-1">
                        <div className="text-xs text-gray-700 font-semibold drop-shadow-sm">Phone Number</div>
                        <div className="text-sm font-bold text-gray-900 drop-shadow-sm">{order.customerPhone}</div>
                      </div>
                    </div>

                    <div className="flex items-start gap-2">
                      <MapPin className="w-4 h-4 text-orange-500 mt-1 flex-shrink-0" />
                      <div className="flex-1">
                        <div className="text-xs text-gray-700 font-semibold drop-shadow-sm">Delivery Address</div>
                        <div className="text-sm font-bold text-gray-900 drop-shadow-sm">{order.deliveryAddress}</div>
                      </div>
                    </div>

                    {order.specialInstructions && (
                      <div className="flex items-start gap-2">
                        <AlertCircle className="w-4 h-4 text-orange-500 mt-1 flex-shrink-0" />
                        <div className="flex-1">
                          <div className="text-xs text-gray-700 font-semibold drop-shadow-sm">Notes</div>
                          <div className="text-sm font-bold text-gray-900 drop-shadow-sm">{order.specialInstructions}</div>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Order Items */}
                  <div className="mb-4">
                    <div className="text-xs text-gray-700 font-semibold mb-2 drop-shadow-sm">Items:</div>
                    <div className="space-y-1">
                      {order.items.map((item, idx) => (
                        <div key={idx} className="flex justify-between text-sm bg-white/60 backdrop-blur-sm rounded-lg px-3 py-2 shadow-md border border-white/40">
                          <span className="font-medium text-gray-900 drop-shadow-sm">
                            {item.quantity}x {item.name}
                          </span>
                          <span className="font-bold text-gray-900 drop-shadow-sm">{(item.price * item.quantity).toFixed(2)} VND</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Distance & Time */}
                  <div className="flex items-center gap-4 mb-4 p-3 bg-blue-50/80 backdrop-blur-sm rounded-lg border border-blue-200/50">
                    <div className="flex items-center gap-1 text-sm">
                      <MapPin className="w-4 h-4 text-blue-600" />
                      <span className="font-bold text-blue-900">{order.distance}</span>
                    </div>
                    <div className="flex items-center gap-1 text-sm">
                      <Clock className="w-4 h-4 text-blue-600" />
                      <span className="font-bold text-blue-900">{order.estimatedTime}</span>
                    </div>
                  </div>

                  {/* Accept Button */}
                  <button
                    onClick={() => handleAcceptOrder(order)}
                    className="w-full px-6 py-3 rounded-xl bg-gradient-to-r from-green-500 to-emerald-500 text-white font-bold shadow-xl hover:shadow-2xl transition-all hover:scale-105 flex items-center justify-center gap-2"
                  >
                    <CheckCircle className="w-5 h-5" />
                    Accept Delivery Order
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* My Deliveries Section */}
      {!isLoading && activeTab === 'myDeliveries' && (
        <div className="space-y-4">
          {myDeliveries.length === 0 ? (
            <div className="rounded-2xl border-2 border-white/30 bg-white/70 backdrop-blur-xl shadow-2xl p-12 text-center">
              <Navigation className="w-16 h-16 mx-auto mb-4 text-gray-400" />
              <h3 className="text-xl font-bold text-gray-900 mb-2 drop-shadow-sm">No Delivery Orders Yet</h3>
              <p className="text-gray-700 font-medium drop-shadow-sm">Please accept orders from the "Available Orders" section</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {myDeliveries.map((order) => (
                <div key={order.id} className={`rounded-2xl border-2 backdrop-blur-xl shadow-2xl p-6 hover:shadow-3xl transition-all ${
                  order.status === 'Completed' 
                    ? 'border-green-300/50 bg-green-50/70' 
                    : 'border-orange-300/50 bg-white/70'
                }`}>
                  {/* Order Header */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className={`w-12 h-12 rounded-xl flex items-center justify-center shadow-xl ring-2 ring-white/40 ${
                        order.status === 'Completed'
                          ? 'bg-gradient-to-br from-green-500 to-emerald-500'
                          : 'bg-gradient-to-br from-orange-500 to-red-500 animate-pulse'
                      }`}>
                        {order.status === 'Completed' ? (
                          <CheckCircle className="w-6 h-6 text-white" />
                        ) : (
                          <Navigation className="w-6 h-6 text-white" />
                        )}
                      </div>
                      <div>
                        <div className="font-bold text-lg text-gray-900 drop-shadow-sm">{order.id}</div>
                        {order.status === 'Completed' ? (
                          <div className="px-2 py-1 rounded-full text-xs font-bold bg-green-200/80 text-green-900 inline-block backdrop-blur-sm">
                            ✓ Completed
                          </div>
                        ) : (
                          <div className="px-2 py-1 rounded-full text-xs font-bold bg-orange-200/80 text-orange-900 inline-block backdrop-blur-sm">
                            Delivering
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-xs text-gray-700 font-semibold drop-shadow-sm">Total</div>
                      <div className="text-xl font-bold text-green-700 drop-shadow-md">{order.total.toFixed(2)} VND</div>
                      <div className="text-xs text-green-700 font-bold drop-shadow-sm">Commission: {(order.total * 0.1).toFixed(2)} VND</div>
                    </div>
                  </div>

                  {/* Customer Info */}
                  <div className="space-y-3 mb-4">
                    <div className="flex items-start gap-2">
                      <User className="w-4 h-4 text-orange-500 mt-1 flex-shrink-0" />
                      <div className="flex-1">
                        <div className="text-xs text-gray-700 font-semibold drop-shadow-sm">Customer</div>
                        <div className="text-sm font-bold text-gray-900 drop-shadow-sm">{order.customerName}</div>
                      </div>
                    </div>

                    <div className="flex items-start gap-2">
                      <Phone className="w-4 h-4 text-orange-500 mt-1 flex-shrink-0" />
                      <div className="flex-1">
                        <div className="text-xs text-gray-700 font-semibold drop-shadow-sm">Phone Number</div>
                        <a href={`tel:${order.customerPhone}`} className="text-sm font-bold text-blue-600 hover:text-blue-700 drop-shadow-sm">
                          {order.customerPhone}
                        </a>
                      </div>
                    </div>

                    <div className="flex items-start gap-2">
                      <MapPin className="w-4 h-4 text-orange-500 mt-1 flex-shrink-0" />
                      <div className="flex-1">
                        <div className="text-xs text-gray-700 font-semibold drop-shadow-sm">Delivery Address</div>
                        <div className="text-sm font-bold text-gray-900 drop-shadow-sm">{order.deliveryAddress}</div>
                      </div>
                    </div>

                    {order.specialInstructions && (
                      <div className="flex items-start gap-2">
                        <AlertCircle className="w-4 h-4 text-orange-500 mt-1 flex-shrink-0" />
                        <div className="flex-1">
                          <div className="text-xs text-gray-700 font-semibold drop-shadow-sm">Notes</div>
                          <div className="text-sm font-bold text-gray-900 drop-shadow-sm">{order.specialInstructions}</div>
                        </div>
                      </div>
                    )}

                    {order.status === 'Completed' && order.completedTime && (
                      <div className="flex items-start gap-2">
                        <Clock className="w-4 h-4 text-green-500 mt-1 flex-shrink-0" />
                        <div className="flex-1">
                          <div className="text-xs text-gray-700 font-semibold drop-shadow-sm">Completed at</div>
                          <div className="text-sm font-bold text-gray-900 drop-shadow-sm">{getTimeSince(order.completedTime)}</div>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Order Items */}
                  <div className="mb-4">
                    <div className="text-xs text-gray-700 font-semibold mb-2 drop-shadow-sm">Items:</div>
                    <div className="space-y-1">
                      {order.items.map((item, idx) => (
                        <div key={idx} className="flex justify-between text-sm bg-white/60 backdrop-blur-sm rounded-lg px-3 py-2 shadow-md border border-white/40">
                          <span className="font-medium text-gray-900 drop-shadow-sm">
                            {item.quantity}x {item.name}
                          </span>
                          <span className="font-bold text-gray-900 drop-shadow-sm">{(item.price * item.quantity).toFixed(2)} VND</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Action Buttons - Only show for In Progress orders */}
                  {order.status === 'In Progress' && (
                    <div className="grid grid-cols-2 gap-3">
                      <a
                        href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(order.deliveryAddress)}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-4 py-3 rounded-xl bg-white/80 backdrop-blur-md text-gray-900 font-bold shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-2 border-2 border-white/40"
                      >
                        <MapPin className="w-5 h-5" />
                        Navigate
                      </a>
                      <button
                        onClick={() => handleCompleteDelivery(order)}
                        className="px-4 py-3 rounded-xl bg-gradient-to-r from-green-500 to-emerald-500 text-white font-bold shadow-xl hover:shadow-2xl transition-all hover:scale-105 flex items-center justify-center gap-2"
                      >
                        <CheckCircle className="w-5 h-5" />
                        Complete
                      </button>
                    </div>
                  )}

                  {/* Completed badge for completed orders */}
                  {order.status === 'Completed' && (
                    <div className="mt-3 p-3 bg-green-100/80 backdrop-blur-sm rounded-lg border border-green-300/50 text-center">
                      <div className="flex items-center justify-center gap-2 text-green-800 font-bold">
                        <CheckCircle className="w-5 h-5" />
                        <span>Order has been successfully delivered</span>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Confirmation Modal */}
      {showConfirmModal && selectedOrder && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-[fade-in_0.2s_ease-out]">
          <div className="bg-white/95 backdrop-blur-2xl rounded-2xl shadow-3xl max-w-md w-full border-2 border-white/40 animate-[scale-in_0.2s_ease-out]">
            <div className="bg-gradient-to-r from-green-500 to-emerald-500 text-white px-6 py-4 rounded-t-2xl flex items-center gap-3">
              <CheckCircle className="w-6 h-6" />
              <h3 className="text-xl font-bold">Confirm Delivery</h3>
            </div>
            
            <div className="p-6 space-y-4">
              <div className="bg-green-50/80 backdrop-blur-sm rounded-xl p-4 border border-green-200/50">
                <p className="text-gray-900 font-medium mb-3">
                  Are you sure you have successfully delivered this order:
                </p>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-700 font-semibold">Order ID:</span>
                    <span className="font-bold text-gray-900">{selectedOrder.id}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-700 font-semibold">Customer:</span>
                    <span className="font-bold text-gray-900">{selectedOrder.customerName}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-700 font-semibold">Total Amount:</span>
                    <span className="font-bold text-green-700">{selectedOrder.total.toFixed(2)} VND</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-700 font-semibold">Commission:</span>
                    <span className="font-bold text-green-700">{(selectedOrder.total * 0.1).toFixed(2)} VND</span>
                  </div>
                </div>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => {
                    setShowConfirmModal(false);
                    setSelectedOrder(null);
                  }}
                  className="flex-1 px-4 py-3 rounded-xl border-2 border-gray-300 font-bold hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmCompleteDelivery}
                  className="flex-1 px-4 py-3 rounded-xl bg-gradient-to-r from-green-500 to-emerald-500 text-white font-bold shadow-xl hover:shadow-2xl transition-all"
                >
                  Confirm
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <style jsx global>{`
        @keyframes fade-in {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes scale-in {
          from {
            opacity: 0;
            transform: scale(0.9);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }
      `}</style>
    </section>
  );
}