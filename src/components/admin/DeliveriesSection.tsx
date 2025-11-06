"use client";

import { useState } from 'react';
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
  ShoppingBag
} from 'lucide-react';

interface DeliveryOrder {
  id: string;
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
}

export default function DeliveriesSection() {
  const [activeTab, setActiveTab] = useState<'available' | 'myDeliveries'>('available');
  const [selectedOrder, setSelectedOrder] = useState<DeliveryOrder | null>(null);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  
  // Simulated employee ID - in real app, get from auth
  const currentEmployeeId = "EMP001";
  const currentEmployeeName = "Nguyen Van A";

  const [availableOrders, setAvailableOrders] = useState<DeliveryOrder[]>([
    {
      id: 'DEL-1045',
      customerName: 'Trần Minh Hoàng',
      customerPhone: '+84 901 234 567',
      deliveryAddress: '123 Nguyễn Huệ, Quận 1, TP.HCM',
      items: [
        { name: 'Classic Burger', quantity: 2, price: 12.99 },
        { name: 'French Fries', quantity: 1, price: 4.50 },
        { name: 'Coca Cola', quantity: 2, price: 2.50 }
      ],
      total: 35.48,
      orderTime: new Date(Date.now() - 10 * 60000),
      distance: '2.3 km',
      estimatedTime: '15-20 min',
      status: 'Available'
    },
    {
      id: 'DEL-1046',
      customerName: 'Lê Thị Mai',
      customerPhone: '+84 902 345 678',
      deliveryAddress: '456 Lê Lợi, Quận 3, TP.HCM',
      items: [
        { name: 'Margherita Pizza', quantity: 1, price: 14.99 },
        { name: 'Caesar Salad', quantity: 1, price: 8.50 }
      ],
      total: 23.49,
      orderTime: new Date(Date.now() - 5 * 60000),
      distance: '1.8 km',
      estimatedTime: '10-15 min',
      status: 'Available'
    },
    {
      id: 'DEL-1047',
      customerName: 'Phạm Văn Long',
      customerPhone: '+84 903 456 789',
      deliveryAddress: '789 Trần Hưng Đạo, Quận 5, TP.HCM',
      items: [
        { name: 'Grilled Salmon', quantity: 2, price: 18.99 },
        { name: 'Chocolate Cake', quantity: 1, price: 6.99 }
      ],
      total: 44.97,
      orderTime: new Date(Date.now() - 15 * 60000),
      distance: '3.5 km',
      estimatedTime: '20-25 min',
      status: 'Available'
    },
    {
      id: 'DEL-1048',
      customerName: 'Võ Thị Hà',
      customerPhone: '+84 904 567 890',
      deliveryAddress: '321 Pasteur, Quận 1, TP.HCM',
      items: [
        { name: 'Classic Burger', quantity: 3, price: 12.99 },
        { name: 'French Fries', quantity: 2, price: 4.50 }
      ],
      total: 47.97,
      orderTime: new Date(Date.now() - 8 * 60000),
      distance: '1.5 km',
      estimatedTime: '10-12 min',
      status: 'Available'
    }
  ]);

  const [myDeliveries, setMyDeliveries] = useState<DeliveryOrder[]>([
    {
      id: 'DEL-1044',
      customerName: 'Nguyễn Thị Lan',
      customerPhone: '+84 905 678 901',
      deliveryAddress: '555 Điện Biên Phủ, Quận 3, TP.HCM',
      items: [
        { name: 'Margherita Pizza', quantity: 2, price: 14.99 }
      ],
      total: 29.98,
      orderTime: new Date(Date.now() - 25 * 60000),
      distance: '2.1 km',
      estimatedTime: '15-18 min',
      status: 'In Progress',
      assignedTo: currentEmployeeId
    }
  ]);

  const handleAcceptOrder = (order: DeliveryOrder) => {
    // Move order from available to my deliveries
    const updatedOrder = { 
      ...order, 
      status: 'In Progress' as const,
      assignedTo: currentEmployeeId 
    };
    
    setAvailableOrders(availableOrders.filter(o => o.id !== order.id));
    setMyDeliveries([updatedOrder, ...myDeliveries]);
    
    // Show success notification
    alert(`Đã nhận đơn giao hàng ${order.id}`);
  };

  const handleCompleteDelivery = (order: DeliveryOrder) => {
    setSelectedOrder(order);
    setShowConfirmModal(true);
  };

  const confirmCompleteDelivery = () => {
    if (!selectedOrder) return;
    
    // Update the order status to Completed instead of removing it
    const updatedDeliveries = myDeliveries.map(order => 
      order.id === selectedOrder.id 
        ? { ...order, status: 'Completed' as const, completedTime: new Date() }
        : order
    );
    
    setMyDeliveries(updatedDeliveries);
    
    setShowConfirmModal(false);
    setSelectedOrder(null);
    
    // Show success message
    alert(`Đã xác nhận giao hàng thành công cho đơn ${selectedOrder.id}`);
  };

  const getTimeSince = (date: Date) => {
    const minutes = Math.floor((Date.now() - date.getTime()) / 60000);
    if (minutes < 1) return 'Vừa xong';
    if (minutes < 60) return `${minutes} phút trước`;
    const hours = Math.floor(minutes / 60);
    return `${hours} giờ ${minutes % 60} phút trước`;
  };

  const totalEarnings = myDeliveries
    .filter(order => order.status === 'Completed')
    .reduce((sum, order) => sum + order.total * 0.1, 0); // 10% commission

  const inProgressCount = myDeliveries.filter(o => o.status === 'In Progress').length;
  const completedCount = myDeliveries.filter(o => o.status === 'Completed').length;

  return (
    <section id="deliveries" className="space-y-6">
      {/* Header with Stats */}

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
            Đơn khả dụng ({availableOrders.length})
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
            Đơn của tôi ({myDeliveries.length})
          </div>
        </button>
      </div>

      {/* Available Orders Section */}
      {activeTab === 'available' && (
        <div className="space-y-4">
          {availableOrders.length === 0 ? (
            <div className="rounded-2xl border-2 border-white/30 bg-white/70 backdrop-blur-xl shadow-2xl p-12 text-center">
              <Package className="w-16 h-16 mx-auto mb-4 text-gray-400" />
              <h3 className="text-xl font-bold text-gray-900 mb-2 drop-shadow-sm">Không có đơn hàng nào</h3>
              <p className="text-gray-700 font-medium drop-shadow-sm">Hiện tại không có đơn giao hàng nào cần nhận</p>
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
                      <div className="text-xs text-gray-700 font-semibold drop-shadow-sm">Tổng tiền</div>
                      <div className="text-xl font-bold text-green-700 drop-shadow-md">${order.total.toFixed(2)}</div>
                    </div>
                  </div>

                  {/* Customer Info */}
                  <div className="space-y-3 mb-4">
                    <div className="flex items-start gap-2">
                      <User className="w-4 h-4 text-orange-500 mt-1 flex-shrink-0" />
                      <div className="flex-1">
                        <div className="text-xs text-gray-700 font-semibold drop-shadow-sm">Khách hàng</div>
                        <div className="text-sm font-bold text-gray-900 drop-shadow-sm">{order.customerName}</div>
                      </div>
                    </div>

                    <div className="flex items-start gap-2">
                      <Phone className="w-4 h-4 text-orange-500 mt-1 flex-shrink-0" />
                      <div className="flex-1">
                        <div className="text-xs text-gray-700 font-semibold drop-shadow-sm">Số điện thoại</div>
                        <div className="text-sm font-bold text-gray-900 drop-shadow-sm">{order.customerPhone}</div>
                      </div>
                    </div>

                    <div className="flex items-start gap-2">
                      <MapPin className="w-4 h-4 text-orange-500 mt-1 flex-shrink-0" />
                      <div className="flex-1">
                        <div className="text-xs text-gray-700 font-semibold drop-shadow-sm">Địa chỉ giao hàng</div>
                        <div className="text-sm font-bold text-gray-900 drop-shadow-sm">{order.deliveryAddress}</div>
                      </div>
                    </div>
                  </div>

                  {/* Order Items */}
                  <div className="mb-4">
                    <div className="text-xs text-gray-700 font-semibold mb-2 drop-shadow-sm">Món ăn:</div>
                    <div className="space-y-1">
                      {order.items.map((item, idx) => (
                        <div key={idx} className="flex justify-between text-sm bg-white/60 backdrop-blur-sm rounded-lg px-3 py-2 shadow-md border border-white/40">
                          <span className="font-medium text-gray-900 drop-shadow-sm">
                            {item.quantity}x {item.name}
                          </span>
                          <span className="font-bold text-gray-900 drop-shadow-sm">${(item.price * item.quantity).toFixed(2)}</span>
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
                    Nhận đơn giao hàng
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* My Deliveries Section */}
      {activeTab === 'myDeliveries' && (
        <div className="space-y-4">
          {myDeliveries.length === 0 ? (
            <div className="rounded-2xl border-2 border-white/30 bg-white/70 backdrop-blur-xl shadow-2xl p-12 text-center">
              <Navigation className="w-16 h-16 mx-auto mb-4 text-gray-400" />
              <h3 className="text-xl font-bold text-gray-900 mb-2 drop-shadow-sm">Chưa có đơn giao hàng</h3>
              <p className="text-gray-700 font-medium drop-shadow-sm">Hãy nhận đơn từ phần "Đơn khả dụng"</p>
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
                            ✓ Đã hoàn thành
                          </div>
                        ) : (
                          <div className="px-2 py-1 rounded-full text-xs font-bold bg-orange-200/80 text-orange-900 inline-block backdrop-blur-sm">
                            Đang giao hàng
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-xs text-gray-700 font-semibold drop-shadow-sm">Tổng tiền</div>
                      <div className="text-xl font-bold text-green-700 drop-shadow-md">${order.total.toFixed(2)}</div>
                      <div className="text-xs text-green-700 font-bold drop-shadow-sm">Hoa hồng: ${(order.total * 0.1).toFixed(2)}</div>
                    </div>
                  </div>

                  {/* Customer Info */}
                  <div className="space-y-3 mb-4">
                    <div className="flex items-start gap-2">
                      <User className="w-4 h-4 text-orange-500 mt-1 flex-shrink-0" />
                      <div className="flex-1">
                        <div className="text-xs text-gray-700 font-semibold drop-shadow-sm">Khách hàng</div>
                        <div className="text-sm font-bold text-gray-900 drop-shadow-sm">{order.customerName}</div>
                      </div>
                    </div>

                    <div className="flex items-start gap-2">
                      <Phone className="w-4 h-4 text-orange-500 mt-1 flex-shrink-0" />
                      <div className="flex-1">
                        <div className="text-xs text-gray-700 font-semibold drop-shadow-sm">Số điện thoại</div>
                        <a href={`tel:${order.customerPhone}`} className="text-sm font-bold text-blue-600 hover:text-blue-700 drop-shadow-sm">
                          {order.customerPhone}
                        </a>
                      </div>
                    </div>

                    <div className="flex items-start gap-2">
                      <MapPin className="w-4 h-4 text-orange-500 mt-1 flex-shrink-0" />
                      <div className="flex-1">
                        <div className="text-xs text-gray-700 font-semibold drop-shadow-sm">Địa chỉ giao hàng</div>
                        <div className="text-sm font-bold text-gray-900 drop-shadow-sm">{order.deliveryAddress}</div>
                      </div>
                    </div>

                    {order.status === 'Completed' && order.completedTime && (
                      <div className="flex items-start gap-2">
                        <Clock className="w-4 h-4 text-green-500 mt-1 flex-shrink-0" />
                        <div className="flex-1">
                          <div className="text-xs text-gray-700 font-semibold drop-shadow-sm">Hoàn thành lúc</div>
                          <div className="text-sm font-bold text-gray-900 drop-shadow-sm">{getTimeSince(order.completedTime)}</div>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Order Items */}
                  <div className="mb-4">
                    <div className="text-xs text-gray-700 font-semibold mb-2 drop-shadow-sm">Món ăn:</div>
                    <div className="space-y-1">
                      {order.items.map((item, idx) => (
                        <div key={idx} className="flex justify-between text-sm bg-white/60 backdrop-blur-sm rounded-lg px-3 py-2 shadow-md border border-white/40">
                          <span className="font-medium text-gray-900 drop-shadow-sm">
                            {item.quantity}x {item.name}
                          </span>
                          <span className="font-bold text-gray-900 drop-shadow-sm">${(item.price * item.quantity).toFixed(2)}</span>
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
                        Dẫn đường
                      </a>
                      <button
                        onClick={() => handleCompleteDelivery(order)}
                        className="px-4 py-3 rounded-xl bg-gradient-to-r from-green-500 to-emerald-500 text-white font-bold shadow-xl hover:shadow-2xl transition-all hover:scale-105 flex items-center justify-center gap-2"
                      >
                        <CheckCircle className="w-5 h-5" />
                        Hoàn thành
                      </button>
                    </div>
                  )}

                  {/* Completed badge for completed orders */}
                  {order.status === 'Completed' && (
                    <div className="mt-3 p-3 bg-green-100/80 backdrop-blur-sm rounded-lg border border-green-300/50 text-center">
                      <div className="flex items-center justify-center gap-2 text-green-800 font-bold">
                        <CheckCircle className="w-5 h-5" />
                        <span>Đơn hàng đã được giao thành công</span>
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
              <h3 className="text-xl font-bold">Xác nhận giao hàng</h3>
            </div>
            
            <div className="p-6 space-y-4">
              <div className="bg-green-50/80 backdrop-blur-sm rounded-xl p-4 border border-green-200/50">
                <p className="text-gray-900 font-medium mb-3">
                  Bạn có chắc chắn đã giao hàng thành công cho đơn hàng:
                </p>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-700 font-semibold">Mã đơn:</span>
                    <span className="font-bold text-gray-900">{selectedOrder.id}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-700 font-semibold">Khách hàng:</span>
                    <span className="font-bold text-gray-900">{selectedOrder.customerName}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-700 font-semibold">Tổng tiền:</span>
                    <span className="font-bold text-green-700">${selectedOrder.total.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-700 font-semibold">Hoa hồng:</span>
                    <span className="font-bold text-green-700">${(selectedOrder.total * 0.1).toFixed(2)}</span>
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
                  Hủy
                </button>
                <button
                  onClick={confirmCompleteDelivery}
                  className="flex-1 px-4 py-3 rounded-xl bg-gradient-to-r from-green-500 to-emerald-500 text-white font-bold shadow-xl hover:shadow-2xl transition-all"
                >
                  Xác nhận
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