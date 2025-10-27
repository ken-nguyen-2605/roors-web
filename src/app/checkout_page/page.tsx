'use client';

import { useState } from 'react';
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

    // Mock cart data - In real app, this would come from context/state management
    const cartItems = [
        { id: 1, name: "Dish Name 1", price: 3.99, quantity: 2, image: "/dishes/dish1.jpg" },
        { id: 2, name: "Dish Name 2", price: 5.99, quantity: 1, image: "/dishes/dish2.jpg" },
    ];

    const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const deliveryFee = 5.00;
    const total = subtotal + deliveryFee;

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        
        if (paymentMethod === 'qr') {
            setShowQRCode(true);
        } else {
            // For cash on delivery, proceed directly to order confirmation
            handleOrderConfirmation();
        }
    };

    const handleOrderConfirmation = () => {
        // Here you would typically send the order to your backend
        setOrderPlaced(true);
        // Reset form after 3 seconds and redirect
        setTimeout(() => {
            window.location.href = '/';
        }, 3000);
    };

    if (orderPlaced) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-green-100">
                <div className="bg-white p-12 rounded-2xl shadow-2xl text-center max-w-md">
                    <div className="text-6xl mb-6 animate-bounce">✅</div>
                    <h2 className={`${italiana.className} text-4xl mb-4 text-green-600`}>
                        Đặt hàng thành công!
                    </h2>
                    <p className="text-gray-600 mb-2">Cảm ơn bạn đã đặt hàng.</p>
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
                    
                    <div className="bg-gradient-to-br from-blue-50 to-purple-50 p-6 rounded-xl mb-6">
                        <div className="text-center mb-4">
                            <p className="text-gray-700 font-semibold mb-2">Tổng thanh toán:</p>
                            <p className="text-4xl font-bold text-[#D4AF37]">${total.toFixed(2)}</p>
                        </div>
                        
                        {/* QR Code Placeholder - Replace with actual QR code generation */}
                        <div className="bg-white p-6 rounded-xl shadow-inner flex items-center justify-center">
                            <div className="w-64 h-64 bg-gray-200 flex items-center justify-center rounded-lg">
                                {/* In production, use a QR code library like qrcode.react */}
                                <div className="text-center">
                                    <div className="text-6xl mb-2">📱</div>
                                    <p className="text-sm text-gray-600">QR Code sẽ hiển thị ở đây</p>
                                    <p className="text-xs text-gray-500 mt-2">
                                        Quét mã để thanh toán
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="space-y-3 mb-6 bg-blue-50 p-4 rounded-lg">
                        <h3 className="font-semibold text-gray-800 mb-2">Hướng dẫn:</h3>
                        <ol className="list-decimal list-inside space-y-2 text-sm text-gray-700">
                            <li>Mở ứng dụng ngân hàng hoặc ví điện tử</li>
                            <li>Chọn chức năng quét QR</li>
                            <li>Quét mã QR phía trên</li>
                            <li>Kiểm tra thông tin và xác nhận thanh toán</li>
                        </ol>
                    </div>

                    <button
                        onClick={handleOrderConfirmation}
                        className="w-full py-4 bg-[#D4AF37] text-white rounded-lg hover:bg-[#B8941F] transition-all duration-300 font-bold text-lg shadow-lg hover:shadow-xl"
                    >
                        Tôi đã thanh toán
                    </button>
                    
                    <button
                        onClick={() => setShowQRCode(false)}
                        className="w-full py-3 mt-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors duration-300 font-semibold"
                    >
                        Quay lại
                    </button>
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
                                                    <span className="font-semibold">💡 Lưu ý:</span> Bạn sẽ được chuyển đến trang quét mã QR sau khi nhấn "Đặt hàng"
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
                                className="w-full py-4 bg-[#D4AF37] text-white rounded-lg hover:bg-[#B8941F] transition-all duration-300 font-bold text-lg shadow-lg hover:shadow-xl hover:scale-[1.02]"
                            >
                                {paymentMethod === 'qr' ? 'Tiếp tục thanh toán' : 'Đặt hàng'}
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
            </div>

            <style jsx>{`
                @keyframes fadeIn {
                    from {
                        opacity: 0;
                        transform: translateY(20px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }
                .animate-fadeIn {
                    animation: fadeIn 0.5s ease-out;
                }
            `}</style>
        </div>
    );
}