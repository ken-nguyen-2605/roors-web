'use client';

import { useState, useEffect } from 'react';
import Image from "next/image";
import Link from "next/link";

import { Inria_Serif } from 'next/font/google';
const inriaSerif = Inria_Serif({
  weight: ['300'],
  subsets: ['latin'],
});

import { Italiana } from "next/font/google";
const italiana = Italiana({
  weight: ['400'],
  subsets: ['latin'],
});

// Import your services and store
import apiService from '@/services/api';
import orderService from '@/services/orderService';
import { useNoteStore } from "@/stores/useNoteStore";

// QR Code generation - you can use a library like 'qrcode.react' or generate via API
// npm install qrcode.react
// import QRCode from 'qrcode.react';

interface OrderData {
    orderId: string;
    orderCode: string;
    total: number;
}

export default function Checkout() {
    const [formData, setFormData] = useState({
        fullName: '',
        phone: '',
        email: '',
        address: '',
        city: '',
        district: '',
        ward: '',
        notes: ''
    });

    const [paymentMethod, setPaymentMethod] = useState<'cash' | 'qr'>('cash');
    const [showQRCode, setShowQRCode] = useState(false);
    const [orderPlaced, setOrderPlaced] = useState(false);
    const [cartItems, setCartItems] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);
    
    // NEW: Store pending order data for QR payment
    const [pendingOrderData, setPendingOrderData] = useState<OrderData | null>(null);
    const [paymentStatus, setPaymentStatus] = useState<'pending' | 'checking' | 'confirmed' | 'failed'>('pending');

    // Get quantities and reset function from Zustand store
    const { quantities, reset } = useNoteStore();

    const deliveryFee = 5.00;

    // Load cart items from note store on component mount
    useEffect(() => {
        loadCartItems();
    }, [quantities]);

    const loadCartItems = async () => {
        try {
            setLoading(true);
            setError(null);

            console.log("Quantities from store:", quantities);

            const menuItemIds = Object.keys(quantities);
            if (menuItemIds.length === 0) {
                setCartItems([]);
                setLoading(false);
                return;
            }

            const itemsWithDetails = await Promise.all(
                menuItemIds.map(async (menuItemId) => {
                    try {
                        const id = parseInt(menuItemId);
                        const quantity = quantities[id];
                        
                        console.log("Fetching menu item:", id, "with quantity:", quantity);
                        const menuItem = await apiService.get(`/api/menu/${id}`);
                        console.log("Menu item fetched:", menuItem);
                        
                        return {
                            id: id,
                            menuItemId: id,
                            name: menuItem.name,
                            price: menuItem.price,
                            quantity: quantity,
                            image: menuItem.imageUrl || '/dishes/default.jpg',
                        };
                    } catch (error) {
                        console.error(`Failed to fetch menu item ${menuItemId}:`, error);
                        return null;
                    }
                })
            );

            const validItems = itemsWithDetails.filter(item => item !== null);
            console.log("Valid cart items:", validItems);
            setCartItems(validItems);
            setLoading(false);
        } catch (error) {
            console.error('Error loading cart items:', error);
            setError('Không thể tải giỏ hàng. Vui lòng thử lại.');
            setLoading(false);
        }
    };

    const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const total = subtotal + deliveryFee;

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const validateForm = () => {
        if (!formData.fullName.trim()) {
            setError('Vui lòng nhập họ và tên');
            return false;
        }
        if (!formData.phone.trim()) {
            setError('Vui lòng nhập số điện thoại');
            return false;
        }
        if (!formData.address.trim()) {
            setError('Vui lòng nhập địa chỉ giao hàng');
            return false;
        }
        if (!formData.ward.trim() || !formData.district.trim() || !formData.city.trim()) {
            setError('Vui lòng nhập đầy đủ phường/xã, quận/huyện, thành phố');
            return false;
        }
        if (cartItems.length === 0) {
            setError('Giỏ hàng trống. Vui lòng thêm món ăn.');
            return false;
        }
        return true;
    };

    const createOrderPayload = (status: string = 'PENDING') => {
        return {
            customerName: formData.fullName,
            customerPhone: formData.phone,
            customerEmail: formData.email || null,
            deliveryAddress: `${formData.address}, ${formData.ward}, ${formData.district}, ${formData.city}`,
            notes: formData.notes || null,
            orderType: 'DELIVERY',
            paymentMethod: paymentMethod === 'cash' ? 'CASH' : 'BANK_TRANSFER',
            paymentStatus: status, // Add payment status
            items: cartItems.map(item => ({
                menuItemId: item.menuItemId,
                quantity: item.quantity,
                notes: null
            }))
        };
    };

    // Generate VietQR URL for Vietnamese banks
    const generateVietQRUrl = (orderCode: string, amount: number) => {
        // Replace with your actual bank details
        const bankId = 'MB'; // Bank code (MB, VCB, TCB, etc.)
        const accountNo = '0909630904'; // Your bank account number
        const accountName = 'NGUYEN PHUC DIEN'; // Your account name
        const template = 'compact2'; // QR template
        
        // VietQR API URL
        const vietQRUrl = `https://img.vietqr.io/image/${bankId}-${accountNo}-${template}.png?amount=${amount}&addInfo=${orderCode}&accountName=${encodeURIComponent(accountName)}`;
        
        return vietQRUrl;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);

        if (!validateForm()) {
            return;
        }

        if (paymentMethod === 'cash') {
            // Create order immediately for cash payment
            await createOrderForCash();
        } else {
            // For QR payment: Create order first with PENDING status, then show QR
            await createOrderForQR();
        }
    };

    // Handle cash payment
    const createOrderForCash = async () => {
        try {
            setSubmitting(true);
            setError(null);

            const orderPayload = createOrderPayload('PENDING');
            console.log("Creating cash order with payload:", orderPayload);
            
            const result = await orderService.createOrder(orderPayload);
            console.log("Order creation result:", result);

            if (result.success) {
                reset();
                setOrderPlaced(true);
                
                setTimeout(() => {
                    window.location.href = '/';
                }, 3000);
            } else {
                setError(result.message || 'Không thể tạo đơn hàng. Vui lòng thử lại.');
            }
        } catch (error: any) {
            console.error('Order creation error:', error);
            setError(error.message || 'Đã xảy ra lỗi. Vui lòng thử lại.');
        } finally {
            setSubmitting(false);
        }
    };

    // Handle QR payment - Create order first, then show QR
    const createOrderForQR = async () => {
        try {
            setSubmitting(true);
            setError(null);

            const orderPayload = createOrderPayload('AWAITING_PAYMENT');
            console.log("Creating QR order with payload:", orderPayload);
            
            const result = await orderService.createOrder(orderPayload);
            console.log("QR Order creation result:", result);

            if (result.success && result.data) {
                // Store order data for payment confirmation
                setPendingOrderData({
                    orderId: result.data.id || result.data.orderId,
                    orderCode: result.data.orderCode || `ORD${Date.now()}`,
                    total: total
                });
                setPaymentStatus('pending');
                setShowQRCode(true);
            } else {
                setError(result.message || 'Không thể tạo đơn hàng. Vui lòng thử lại.');
            }
        } catch (error: any) {
            console.error('QR Order creation error:', error);
            setError(error.message || 'Đã xảy ra lỗi. Vui lòng thử lại.');
        } finally {
            setSubmitting(false);
        }
    };

    // Confirm payment after user says they paid
    const handlePaymentConfirmation = async () => {
        if (!pendingOrderData) {
            setError('Không tìm thấy thông tin đơn hàng.');
            return;
        }

        try {
            setPaymentStatus('checking');
            setError(null);

            // Option 1: Simply mark as paid (trust user)
            // Option 2: Check with payment gateway API
            // Option 3: Manual verification by staff

            // For now, we'll update the order status to PAID
            const updateResult = await orderService.updatePaymentStatus(
                pendingOrderData.orderId, 
                'PAID'
            );

            console.log("Payment update result:", updateResult);

            if (updateResult.success) {
                setPaymentStatus('confirmed');
                reset(); // Clear cart
                
                // Show success and redirect
                setTimeout(() => {
                    setOrderPlaced(true);
                }, 1500);
                
                setTimeout(() => {
                    window.location.href = '/';
                }, 4500);
            } else {
                setPaymentStatus('failed');
                setError(updateResult.message || 'Không thể xác nhận thanh toán. Vui lòng liên hệ hỗ trợ.');
            }
        } catch (error: any) {
            console.error('Payment confirmation error:', error);
            setPaymentStatus('failed');
            setError(error.message || 'Đã xảy ra lỗi khi xác nhận thanh toán.');
        }
    };

    // Cancel QR payment and go back
    const handleCancelQRPayment = async () => {
        if (pendingOrderData) {
            try {
                // Optionally cancel/delete the pending order
                await orderService.cancelOrder(pendingOrderData.orderId, "QR payment canceled by user");
            } catch (error) {
                console.error('Error canceling order:', error);
            }
        }
        setPendingOrderData(null);
        setShowQRCode(false);
        setPaymentStatus('pending');
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-[#D4AF37] mx-auto mb-4"></div>
                    <p className="text-gray-600">Đang tải giỏ hàng...</p>
                </div>
            </div>
        );
    }

    if (orderPlaced) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-green-100">
                <div className="bg-white p-12 rounded-2xl shadow-2xl text-center max-w-md">
                    <div className="text-6xl mb-6 animate-bounce">✅</div>
                    <h2 className={`${italiana.className} text-4xl mb-4 text-green-600`}>
                        Đặt hàng thành công!
                    </h2>
                    <p className="text-gray-600 mb-2">Cảm ơn bạn đã đặt hàng.</p>
                    {pendingOrderData && (
                        <p className="text-gray-800 font-semibold mb-2">
                            Mã đơn hàng: {pendingOrderData.orderCode}
                        </p>
                    )}
                    <p className="text-gray-600">Chúng tôi sẽ liên hệ với bạn sớm nhất.</p>
                    <div className="mt-6 text-sm text-gray-500">
                        Đang chuyển về trang chủ...
                    </div>
                </div>
            </div>
        );
    }

    if (showQRCode) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-12 px-4">
                <div className="max-w-lg mx-auto bg-white rounded-2xl shadow-2xl p-8">
                    <h2 className={`${italiana.className} text-3xl mb-6 text-center`}>
                        Thanh toán bằng QR Code
                    </h2>
                    
                    {/* Order Info */}
                    {pendingOrderData && (
                        <div className="bg-gray-50 p-4 rounded-lg mb-6">
                            <p className="text-sm text-gray-600">Mã đơn hàng:</p>
                            <p className="font-bold text-lg text-gray-800">{pendingOrderData.orderCode}</p>
                        </div>
                    )}
                    
                    <div className="bg-gradient-to-br from-blue-50 to-purple-50 p-6 rounded-xl mb-6">
                        <div className="text-center mb-4">
                            <p className="text-gray-700 font-semibold mb-2">Số tiền cần thanh toán:</p>
                            <p className="text-4xl font-bold text-[#D4AF37]">
                                {(total * 24000).toLocaleString('vi-VN')}đ
                            </p>
                            <p className="text-sm text-gray-500">(~${total.toFixed(2)} USD)</p>
                        </div>
                        
                        {/* QR Code Display */}
                        <div className="bg-white p-6 rounded-xl shadow-inner flex items-center justify-center">
                            {pendingOrderData ? (
                                <div className="text-center">
                                    {/* Option 1: Use VietQR API */}
                                    <img 
                                        src={generateVietQRUrl(
                                            pendingOrderData.orderCode, 
                                            Math.round(total * 24000)
                                        )}
                                        alt="QR Code thanh toán"
                                        className="w-64 h-64 mx-auto"
                                        onError={(e) => {
                                            // Fallback if VietQR fails
                                            (e.target as HTMLImageElement).style.display = 'none';
                                        }}
                                    />
                                    
                                    {/* Bank Transfer Info */}
                                    <div className="mt-4 text-left bg-gray-50 p-4 rounded-lg">
                                        <p className="text-sm font-semibold text-gray-700 mb-2">
                                            Hoặc chuyển khoản thủ công:
                                        </p>
                                        <div className="space-y-1 text-sm text-gray-600">
                                            <p><span className="font-medium">Ngân hàng:</span> MB Bank</p>
                                            <p><span className="font-medium">Số TK:</span> 0123456789</p>
                                            <p><span className="font-medium">Chủ TK:</span> NGUYEN VAN A</p>
                                            <p><span className="font-medium">Nội dung:</span> {pendingOrderData.orderCode}</p>
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                <div className="w-64 h-64 bg-gray-200 flex items-center justify-center rounded-lg">
                                    <div className="text-center">
                                        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-[#D4AF37] mx-auto mb-2"></div>
                                        <p className="text-sm text-gray-600">Đang tạo mã QR...</p>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Instructions */}
                    <div className="space-y-3 mb-6 bg-blue-50 p-4 rounded-lg">
                        <h3 className="font-semibold text-gray-800 mb-2">Hướng dẫn thanh toán:</h3>
                        <ol className="list-decimal list-inside space-y-2 text-sm text-gray-700">
                            <li>Mở ứng dụng ngân hàng hoặc ví điện tử</li>
                            <li>Chọn chức năng quét QR hoặc chuyển khoản</li>
                            <li>Quét mã QR hoặc nhập thông tin chuyển khoản</li>
                            <li>
                                <span className="text-red-600 font-medium">
                                    Quan trọng: Ghi đúng nội dung "{pendingOrderData?.orderCode}"
                                </span>
                            </li>
                            <li>Xác nhận thanh toán và nhấn "Tôi đã thanh toán"</li>
                        </ol>
                    </div>

                    {/* Payment Status */}
                    {paymentStatus === 'checking' && (
                        <div className="mb-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg flex items-center">
                            <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-yellow-600 mr-3"></div>
                            <p className="text-yellow-700">Đang xác nhận thanh toán...</p>
                        </div>
                    )}

                    {paymentStatus === 'confirmed' && (
                        <div className="mb-4 p-4 bg-green-50 border border-green-200 rounded-lg">
                            <p className="text-green-700 font-semibold">✅ Thanh toán thành công!</p>
                        </div>
                    )}

                    {error && (
                        <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
                            <p className="text-red-600 text-sm">{error}</p>
                        </div>
                    )}

                    {/* Action Buttons */}
                    <button
                        onClick={handlePaymentConfirmation}
                        disabled={paymentStatus === 'checking' || paymentStatus === 'confirmed'}
                        className={`w-full py-4 bg-[#D4AF37] text-white rounded-lg hover:bg-[#B8941F] transition-all duration-300 font-bold text-lg shadow-lg hover:shadow-xl ${
                            (paymentStatus === 'checking' || paymentStatus === 'confirmed') 
                                ? 'opacity-50 cursor-not-allowed' 
                                : ''
                        }`}
                    >
                        {paymentStatus === 'checking' 
                            ? 'Đang xác nhận...' 
                            : paymentStatus === 'confirmed'
                                ? 'Đã xác nhận ✓'
                                : 'Tôi đã thanh toán'
                        }
                    </button>
                    
                    <button
                        onClick={handleCancelQRPayment}
                        disabled={paymentStatus === 'checking' || paymentStatus === 'confirmed'}
                        className="w-full py-3 mt-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors duration-300 font-semibold"
                    >
                        Hủy và quay lại
                    </button>

                    {/* Support Contact */}
                    <div className="mt-6 text-center text-sm text-gray-500">
                        <p>Gặp vấn đề khi thanh toán?</p>
                        <p className="font-semibold text-gray-700">Hotline: 1900 1234</p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
            {/* Header */}
            <div className="bg-gradient-to-r from-[#D4AF37] to-[#B8941F] text-white py-8 shadow-lg">
                <div className="max-w-7xl mx-auto px-4">
                    <Link href="/menu" className="inline-flex items-center text-white/80 hover:text-white mb-4 transition-colors">
                        <span className="text-2xl mr-2">←</span>
                        <span>Quay lại menu</span>
                    </Link>
                    <h1 className={`${italiana.className} text-5xl`}>Thanh toán</h1>
                    <p className="mt-2 text-white/90">Hoàn tất đơn hàng của bạn</p>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 py-12">
                {error && (
                    <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 rounded-lg">
                        <p className="text-red-700">{error}</p>
                    </div>
                )}

                {cartItems.length === 0 ? (
                    <div className="text-center py-12">
                        <div className="text-6xl mb-4">🛒</div>
                        <h2 className={`${italiana.className} text-3xl mb-4`}>Giỏ hàng trống</h2>
                        <p className="text-gray-600 mb-6">Vui lòng thêm món ăn vào giỏ hàng</p>
                        <Link 
                            href="/menu"
                            className="inline-block px-8 py-3 bg-[#D4AF37] text-white rounded-lg hover:bg-[#B8941F] transition-colors"
                        >
                            Xem thực đơn
                        </Link>
                    </div>
                ) : (
                    <div className="grid lg:grid-cols-3 gap-8">
                        {/* Left Column - Forms */}
                        <div className="lg:col-span-2 space-y-6">
                            {/* Delivery Information */}
                            <div className="bg-white rounded-2xl shadow-lg p-8">
                                <div className="flex items-center mb-6">
                                    <div className="w-10 h-10 bg-[#D4AF37] text-white rounded-full flex items-center justify-center font-bold text-lg mr-4">
                                        1
                                    </div>
                                    <h2 className={`${italiana.className} text-3xl`}>Thông tin giao hàng</h2>
                                </div>

                                <form className="space-y-4">
                                    <div className="grid md:grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-gray-700 font-semibold mb-2">
                                                Họ và tên <span className="text-red-500">*</span>
                                            </label>
                                            <input
                                                type="text"
                                                name="fullName"
                                                value={formData.fullName}
                                                onChange={handleInputChange}
                                                placeholder="Nguyễn Văn A"
                                                required
                                                className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-[#D4AF37] focus:outline-none transition-colors"
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-gray-700 font-semibold mb-2">
                                                Số điện thoại <span className="text-red-500">*</span>
                                            </label>
                                            <input
                                                type="tel"
                                                name="phone"
                                                value={formData.phone}
                                                onChange={handleInputChange}
                                                placeholder="0912345678"
                                                required
                                                className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-[#D4AF37] focus:outline-none transition-colors"
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-gray-700 font-semibold mb-2">
                                            Email (tùy chọn)
                                        </label>
                                        <input
                                            type="email"
                                            name="email"
                                            value={formData.email}
                                            onChange={handleInputChange}
                                            placeholder="email@example.com"
                                            className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-[#D4AF37] focus:outline-none transition-colors"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-gray-700 font-semibold mb-2">
                                            Địa chỉ giao hàng <span className="text-red-500">*</span>
                                        </label>
                                        <input
                                            type="text"
                                            name="address"
                                            value={formData.address}
                                            onChange={handleInputChange}
                                            placeholder="Số nhà, tên đường"
                                            required
                                            className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-[#D4AF37] focus:outline-none transition-colors"
                                        />
                                    </div>

                                    <div className="grid md:grid-cols-3 gap-4">
                                        <div>
                                            <label className="block text-gray-700 font-semibold mb-2">
                                                Phường/Xã <span className="text-red-500">*</span>
                                            </label>
                                            <input
                                                type="text"
                                                name="ward"
                                                value={formData.ward}
                                                onChange={handleInputChange}
                                                placeholder="Phường 1"
                                                required
                                                className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-[#D4AF37] focus:outline-none transition-colors"
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-gray-700 font-semibold mb-2">
                                                Quận/Huyện <span className="text-red-500">*</span>
                                            </label>
                                            <input
                                                type="text"
                                                name="district"
                                                value={formData.district}
                                                onChange={handleInputChange}
                                                placeholder="Quận 1"
                                                required
                                                className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-[#D4AF37] focus:outline-none transition-colors"
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-gray-700 font-semibold mb-2">
                                                Thành phố <span className="text-red-500">*</span>
                                            </label>
                                            <input
                                                type="text"
                                                name="city"
                                                value={formData.city}
                                                onChange={handleInputChange}
                                                placeholder="TP. Hồ Chí Minh"
                                                required
                                                className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-[#D4AF37] focus:outline-none transition-colors"
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-gray-700 font-semibold mb-2">
                                            Ghi chú (tùy chọn)
                                        </label>
                                        <textarea
                                            name="notes"
                                            value={formData.notes}
                                            onChange={handleInputChange}
                                            placeholder="Ghi chú đặc biệt cho đơn hàng..."
                                            rows={3}
                                            className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-[#D4AF37] focus:outline-none transition-colors resize-none"
                                        />
                                    </div>
                                </form>
                            </div>

                            {/* Payment Method */}
                            <div className="bg-white rounded-2xl shadow-lg p-8">
                                <div className="flex items-center mb-6">
                                    <div className="w-10 h-10 bg-[#D4AF37] text-white rounded-full flex items-center justify-center font-bold text-lg mr-4">
                                        2
                                    </div>
                                    <h2 className={`${italiana.className} text-3xl`}>Phương thức thanh toán</h2>
                                </div>

                                <div className="space-y-4">
                                    {/* Cash on Delivery */}
                                    <label
                                        className={`block p-6 border-2 rounded-xl cursor-pointer transition-all duration-300 ${
                                            paymentMethod === 'cash'
                                                ? 'border-[#D4AF37] bg-amber-50 shadow-md'
                                                : 'border-gray-200 hover:border-gray-300 hover:shadow-sm'
                                        }`}
                                    >
                                        <div className="flex items-start">
                                            <input
                                                type="radio"
                                                name="payment"
                                                value="cash"
                                                checked={paymentMethod === 'cash'}
                                                onChange={() => setPaymentMethod('cash')}
                                                className="mt-1 w-5 h-5 text-[#D4AF37] focus:ring-[#D4AF37]"
                                            />
                                            <div className="ml-4 flex-1">
                                                <div className="flex items-center justify-between">
                                                    <span className="text-lg font-semibold text-gray-800">
                                                        Tiền mặt khi nhận hàng
                                                    </span>
                                                    <span className="text-3xl">💵</span>
                                                </div>
                                                <p className="text-gray-600 text-sm mt-2">
                                                    Thanh toán bằng tiền mặt khi nhận hàng tại nhà
                                                </p>
                                            </div>
                                        </div>
                                    </label>

                                    {/* QR Code Payment */}
                                    <label
                                        className={`block p-6 border-2 rounded-xl cursor-pointer transition-all duration-300 ${
                                            paymentMethod === 'qr'
                                                ? 'border-[#D4AF37] bg-amber-50 shadow-md'
                                                : 'border-gray-200 hover:border-gray-300 hover:shadow-sm'
                                        }`}
                                    >
                                        <div className="flex items-start">
                                            <input
                                                type="radio"
                                                name="payment"
                                                value="qr"
                                                checked={paymentMethod === 'qr'}
                                                onChange={() => setPaymentMethod('qr')}
                                                className="mt-1 w-5 h-5 text-[#D4AF37] focus:ring-[#D4AF37]"
                                            />
                                            <div className="ml-4 flex-1">
                                                <div className="flex items-center justify-between">
                                                    <span className="text-lg font-semibold text-gray-800">
                                                        Chuyển khoản QR Code
                                                    </span>
                                                    <span className="text-3xl">📱</span>
                                                </div>
                                                <p className="text-gray-600 text-sm mt-2">
                                                    Quét mã QR để thanh toán qua ứng dụng ngân hàng
                                                </p>
                                                {paymentMethod === 'qr' && (
                                                    <div className="mt-3 p-3 bg-blue-50 rounded-lg text-sm text-blue-800">
                                                        <span className="font-semibold">💡 Lưu ý:</span> Đơn hàng sẽ được tạo và bạn sẽ nhận được mã QR để thanh toán
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </label>
                                </div>
                            </div>
                        </div>

                        {/* Right Column - Order Summary */}
                        <div className="lg:col-span-1">
                            <div className="bg-white rounded-2xl shadow-lg p-8 sticky top-8">
                                <h2 className={`${italiana.className} text-3xl mb-6`}>Đơn hàng</h2>

                                <div className="space-y-4 mb-6 max-h-64 overflow-y-auto">
                                    {cartItems.map((item) => (
                                        <div key={item.id} className="flex gap-3 pb-4 border-b border-gray-100">
                                            <div className="relative w-16 h-16 flex-shrink-0 rounded-lg overflow-hidden">
                                                <Image
                                                    src={item.image}
                                                    alt={item.name}
                                                    fill
                                                    className="object-cover"
                                                />
                                            </div>
                                            <div className="flex-1">
                                                <h4 className="font-semibold text-gray-800 text-sm">{item.name}</h4>
                                                <p className="text-gray-600 text-sm">x{item.quantity}</p>
                                                <p className="text-[#D4AF37] font-bold">${(item.price * item.quantity).toFixed(2)}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                <div className="space-y-3 mb-6 pb-6 border-b-2 border-gray-200">
                                    <div className="flex justify-between text-gray-700">
                                        <span>Tạm tính:</span>
                                        <span className="font-semibold">${subtotal.toFixed(2)}</span>
                                    </div>
                                    <div className="flex justify-between text-gray-700">
                                        <span>Phí giao hàng:</span>
                                        <span className="font-semibold">${deliveryFee.toFixed(2)}</span>
                                    </div>
                                </div>

                                <div className="flex justify-between text-xl font-bold mb-6">
                                    <span>Tổng cộng:</span>
                                    <span className="text-[#D4AF37]">${total.toFixed(2)}</span>
                                </div>

                                <button
                                    onClick={handleSubmit}
                                    disabled={submitting}
                                    className={`w-full py-4 bg-[#D4AF37] text-white rounded-lg hover:bg-[#B8941F] transition-all duration-300 font-bold text-lg shadow-lg hover:shadow-xl hover:scale-[1.02] ${
                                        submitting ? 'opacity-50 cursor-not-allowed' : ''
                                    }`}
                                >
                                    {submitting 
                                        ? 'Đang xử lý...' 
                                        : paymentMethod === 'qr' 
                                            ? 'Tiếp tục thanh toán' 
                                            : 'Đặt hàng'
                                    }
                                </button>

                                <div className="mt-4 p-4 bg-green-50 rounded-lg">
                                    <div className="flex items-start">
                                        <span className="text-2xl mr-3">🔒</span>
                                        <p className="text-sm text-gray-700">
                                            Thông tin của bạn được bảo mật an toàn
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}