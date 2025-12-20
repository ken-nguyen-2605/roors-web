'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
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

// import apiService from "@/services/api";
import menuService from "@/services/menuService";
import orderService from "@/services/orderService";
import { useNoteStore } from "@/stores/useNoteStore";

interface PaymentData {
    paymentId: string;
    paymentCode: string;
    paymentMethod: string;
    paymentStatus: string;
    amount: number;
    qrCodeData?: string;
    bankCode?: string;
    accountNumber?: string;
    accountName?: string;
    transferContent?: string;
}

interface OrderData {
    orderId: string;
    orderCode: string;
    total: number;
    payment?: PaymentData;
}

export default function Checkout() {
	const [formData, setFormData] = useState({
		fullName: "",
		phone: "",
		email: "",
		address: "",
		city: "",
		district: "",
		ward: "",
		notes: "",
	});

	const [paymentMethod, setPaymentMethod] = useState<"cash" | "qr">("cash");
	const [showQRCode, setShowQRCode] = useState(false);
	const [orderPlaced, setOrderPlaced] = useState(false);
	const [cartItems, setCartItems] = useState<any[]>([]);
	const [loading, setLoading] = useState(true);
	const [submitting, setSubmitting] = useState(false);
	const [error, setError] = useState<string | null>(null);

	// ✅ Polling state
	const pollingIntervalRef = useRef<NodeJS.Timeout | null>(null);
	const [pollingCount, setPollingCount] = useState(0);
	const MAX_POLLING_ATTEMPTS = 60; // 5 minutes (60 * 5 seconds)
	const POLLING_INTERVAL = 5000; // 5 seconds

	const [pendingOrderData, setPendingOrderData] = useState<OrderData | null>(
		null
	);
	const [paymentStatus, setPaymentStatus] = useState<
		"pending" | "checking" | "confirmed" | "failed"
	>("pending");
	const [qrImageError, setQrImageError] = useState(false);

	const { quantities, reset } = useNoteStore();

	const deliveryFee = 8000.0;

	// ✅ Cleanup polling on unmount
	useEffect(() => {
		return () => {
			stopPaymentPolling();
		};
	}, []);

	useEffect(() => {
		loadCartItems();
	}, [quantities]);

	// ✅ Stop polling function
	const stopPaymentPolling = useCallback(() => {
		if (pollingIntervalRef.current) {
			clearInterval(pollingIntervalRef.current);
			pollingIntervalRef.current = null;
			console.log("Polling stopped");
		}
	}, []);

	// ✅ Handle successful payment
	const handlePaymentSuccess = useCallback(() => {
		console.log("Payment confirmed!");
		stopPaymentPolling();
		setPaymentStatus("confirmed");
		reset();

		setTimeout(() => {
			setOrderPlaced(true);
		}, 1500);

		setTimeout(() => {
			window.location.href = "/";
		}, 4500);
	}, [reset, stopPaymentPolling]);

	// ✅ Start polling function
	const startPaymentPolling = useCallback(
		(paymentCode: string) => {
			console.log("Starting payment polling for:", paymentCode);
			setPollingCount(0);

			// Clear any existing interval
			stopPaymentPolling();

			pollingIntervalRef.current = setInterval(async () => {
				setPollingCount((prev) => {
					const newCount = prev + 1;
					console.log(
						`Polling attempt ${newCount}/${MAX_POLLING_ATTEMPTS}`
					);

					// Stop polling after max attempts
					if (newCount >= MAX_POLLING_ATTEMPTS) {
						stopPaymentPolling();
						setError(
							"Hết thời gian chờ thanh toán. Vui lòng thử lại hoặc liên hệ hỗ trợ."
						);
						setPaymentStatus("failed");
						return newCount;
					}
					return newCount;
				});

				try {
					// Check payment status from backend
					const statusResult = await orderService.checkPaymentStatus(
						paymentCode
					);
					console.log("Payment status check result:", statusResult);

					if (statusResult.success && statusResult.data) {
						const responseData = statusResult.data as any;
						const status =
							responseData.status || responseData.paymentStatus;

						if (status === "PAID" || status === "COMPLETED") {
							handlePaymentSuccess();
						} else if (
							status === "FAILED" ||
							status === "CANCELLED" ||
							status === "EXPIRED"
						) {
							console.log("Payment failed or cancelled");
							stopPaymentPolling();
							setPaymentStatus("failed");
							setError("Thanh toán thất bại hoặc đã hết hạn.");
						}
						// If still PENDING, continue polling
					}
				} catch (err) {
					console.error("Payment polling error:", err);
					// Don't stop polling on error, just log it
				}
			}, POLLING_INTERVAL);
		},
		[stopPaymentPolling, handlePaymentSuccess]
	);

	const loadCartItems = async () => {
    try {
        setLoading(true);
        setError(null);

        const menuItemIds = Object.keys(quantities);
        console.log("🛒 Cart quantities:", quantities);
        console.log("🔑 Menu item IDs in cart:", menuItemIds);

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

                    console.log(`📡 Fetching menu item ${id}...`);
                    const response = await menuService.getMenuItemById(id);
                    
                    // 🔍 Debug: Log the full response
                    console.log(`📦 Response for item ${id}:`, response);
                    console.log(`📦 Response.data for item ${id}:`, response?.data);

                    // Handle different response structures
                    let menuItem;
                    
                    if (response?.data?.data) {
                        // Nested data: { data: { data: {...} } }
                        menuItem = response.data.data;
                    } else if (response?.data) {
                        // Standard axios: { data: {...} }
                        menuItem = response.data;
                    } else if (response?.name) {
                        // Direct response object
                        menuItem = response;
                    } else {
                        console.error(`❌ Unexpected response structure for item ${id}:`, response);
                        return null;
                    }

                    // Validate the menu item
                    if (!menuItem || typeof menuItem !== 'object') {
                        console.error(`❌ Invalid menu item data for ${id}:`, menuItem);
                        return null;
                    }

                    if (!menuItem.name) {
                        console.error(`❌ Menu item ${id} missing 'name' property:`, menuItem);
                        return null;
                    }

                    console.log(`✅ Successfully fetched item ${id}:`, menuItem.name);

                    return {
                        id: id,
                        menuItemId: id,
                        name: menuItem.name,
                        price: menuItem.price || 0,
                        quantity: quantity,
                        image: menuItem.imageUrl || "/dishes/default.jpg",
                    };
                } catch (error) {
                    // 🔍 Better error logging
                    console.error(`❌ Failed to fetch menu item ${menuItemId}:`);
                    console.error("   Status:", error.response?.status);
                    console.error("   Message:", error.message);
                    console.error("   Response data:", error.response?.data);
                    return null;
                }
            })
        );

        const validItems = itemsWithDetails.filter((item) => item !== null);
        console.log("✅ Valid cart items:", validItems);
        
        setCartItems(validItems);
        setLoading(false);
    } catch (error) {
        console.error("Error loading cart items:", error);
        setError("Không thể tải giỏ hàng. Vui lòng thử lại.");
        setLoading(false);
    }
};
	const subtotal = cartItems.reduce(
		(sum, item) => sum + item.price * item.quantity,
		0
	);
	const total = subtotal + deliveryFee;

	const handleInputChange = (
		e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
	) => {
		setFormData({
			...formData,
			[e.target.name]: e.target.value,
		});
	};

	const validateForm = () => {
		if (!formData.fullName.trim()) {
			setError("Vui lòng nhập họ và tên");
			return false;
		}
		if (!formData.phone.trim()) {
			setError("Vui lòng nhập số điện thoại");
			return false;
		}
		if (!formData.address.trim()) {
			setError("Vui lòng nhập địa chỉ giao hàng");
			return false;
		}
		if (
			!formData.ward.trim() ||
			!formData.district.trim() ||
			!formData.city.trim()
		) {
			setError("Vui lòng nhập đầy đủ phường/xã, quận/huyện, thành phố");
			return false;
		}
		if (cartItems.length === 0) {
			setError("Giỏ hàng trống. Vui lòng thêm món ăn.");
			return false;
		}
		return true;
	};

	const createOrderPayload = (paymentMethodType: string) => {
		return {
			customerName: formData.fullName,
			customerPhone: formData.phone,
			customerEmail: formData.email || null,
			deliveryAddress: `${formData.address}, ${formData.ward}, ${formData.district}, ${formData.city}`,
			notes: formData.notes || null,
			orderType: "DELIVERY",
			paymentMethod: paymentMethodType,
			items: cartItems.map((item) => ({
				menuItemId: item.menuItemId,
				quantity: item.quantity,
				notes: null,
			})),
		};
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setError(null);

		if (!validateForm()) {
			return;
		}

		if (paymentMethod === "cash") {
			await createOrderForCash();
		} else {
			await createOrderForQR();
		}
	};

	const createOrderForCash = async () => {
		try {
			setSubmitting(true);
			setError(null);

			const orderPayload = createOrderPayload("CASH");
			console.log("Creating cash order with payload:", orderPayload);

			const result = await orderService.createOrder(orderPayload);
			console.log("Order creation result:", result);

			if (result.success) {
				reset();
				const orderData = result.data as any;
				setPendingOrderData({
					orderId: orderData.id,
					orderCode: orderData.orderNumber,
					total: total,
				});
				setOrderPlaced(true);

				setTimeout(() => {
					window.location.href = "/";
				}, 3000);
			} else {
				setError(
					result.message ||
						"Không thể tạo đơn hàng. Vui lòng thử lại."
				);
			}
		} catch (error: any) {
			console.error("Order creation error:", error);
			setError(error.message || "Đã xảy ra lỗi. Vui lòng thử lại.");
		} finally {
			setSubmitting(false);
		}
	};

	// ✅ Updated createOrderForQR with polling
	const createOrderForQR = async () => {
		try {
			setSubmitting(true);
			setError(null);
			setQrImageError(false);

			const orderPayload = createOrderPayload("BANK_TRANSFER");
			console.log("Creating QR order with payload:", orderPayload);

			const result = await orderService.createOrder(orderPayload);
			console.log("QR Order creation result:", result);

			if (result.success && result.data) {
				const responseData = result.data as any;
				const paymentData = responseData.payment;

				const orderData: OrderData = {
					orderId: responseData.id,
					orderCode: responseData.orderNumber,
					total: responseData.totalAmount || total,
					payment: paymentData
						? {
								paymentId: paymentData.id,
								paymentCode: paymentData.paymentCode,
								paymentMethod: paymentData.paymentMethod,
								paymentStatus: paymentData.status,
								amount: paymentData.amount,
								qrCodeData: paymentData.qrCodeData,
								bankCode: paymentData.bankCode,
								accountNumber: paymentData.bankAccountNumber,
								accountName: paymentData.bankAccountName,
								transferContent: responseData.orderNumber,
						  }
						: undefined,
				};

				console.log("Parsed order data:", orderData);

				setPendingOrderData(orderData);
				setPaymentStatus("pending");
				setShowQRCode(true);

				// ✅ START POLLING after showing QR
				if (orderData.payment?.paymentId) {
					startPaymentPolling(
						orderData.payment.paymentCode.toString()
					);
				}
			} else {
				setError(
					result.message ||
						"Không thể tạo đơn hàng. Vui lòng thử lại."
				);
			}
		} catch (error: any) {
			console.error("QR Order creation error:", error);
			setError(error.message || "Đã xảy ra lỗi. Vui lòng thử lại.");
		} finally {
			setSubmitting(false);
		}
	};

	// ✅ Updated cancel function to stop polling
	const handleCancelQRPayment = async () => {
		// Stop polling first
		stopPaymentPolling();

		if (pendingOrderData) {
			try {
				await orderService.cancelOrder(
					pendingOrderData.orderId,
					"QR payment canceled by user"
				);
			} catch (error) {
				console.error("Error canceling order:", error);
			}
		}
		setPendingOrderData(null);
		setShowQRCode(false);
		setPaymentStatus("pending");
		setQrImageError(false);
		setPollingCount(0);
		setError(null);
	};

	// Format currency to VND
	const formatVND = (amount: number) => {
		return new Intl.NumberFormat("vi-VN", {
			style: "currency",
			currency: "VND",
		}).format(amount);
	};

	// Get amount in VND
	const getAmountInVND = () => {
		if (pendingOrderData?.payment?.amount) {
			return pendingOrderData.payment.amount;
		}
		return Math.round(total * 24000);
	};

	// ✅ Calculate remaining time
	const getRemainingTime = () => {
		const remainingSeconds =
			(MAX_POLLING_ATTEMPTS - pollingCount) * (POLLING_INTERVAL / 1000);
		const minutes = Math.floor(remainingSeconds / 60);
		const seconds = remainingSeconds % 60;
		return `${minutes}:${seconds.toString().padStart(2, "0")}`;
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
					<h2
						className={`${italiana.className} text-4xl mb-4 text-green-600`}
					>
						Đặt hàng thành công!
					</h2>
					<p className="text-gray-600 mb-2">
						Cảm ơn bạn đã đặt hàng.
					</p>
					{pendingOrderData && (
						<p className="text-gray-800 font-semibold mb-2">
							Mã đơn hàng: {pendingOrderData.orderCode}
						</p>
					)}
					<p className="text-gray-600">
						Chúng tôi sẽ liên hệ với bạn sớm nhất.
					</p>
					<div className="mt-6 text-sm text-gray-500">
						Đang chuyển về trang chủ...
					</div>
				</div>
			</div>
		);
	}

	// ✅ Updated QR Code display with polling indicator
	if (showQRCode && pendingOrderData) {
		return (
			<div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-12 px-4">
				<div className="max-w-lg mx-auto bg-white rounded-2xl shadow-2xl p-8">
					<h2
						className={`${italiana.className} text-3xl mb-6 text-center`}
					>
						Thanh toán bằng QR Code
					</h2>

					{/* Order Info */}
					<div className="bg-gray-50 p-4 rounded-lg mb-4">
						<p className="text-sm text-gray-600">Mã đơn hàng:</p>
						<p className="font-bold text-lg text-gray-800">
							{pendingOrderData.orderCode}
						</p>
					</div>

					{/* ✅ Polling Status Indicator */}
					{paymentStatus === "pending" && (
						<div className="bg-blue-50 p-3 rounded-lg mb-4 flex items-center justify-between">
							<div className="flex items-center">
								<div className="relative mr-3">
									<div className="w-3 h-3 bg-green-500 rounded-full animate-ping absolute"></div>
									<div className="w-3 h-3 bg-green-500 rounded-full"></div>
								</div>
								<span className="text-sm text-gray-700">
									Đang chờ thanh toán...
								</span>
							</div>
							<span className="text-xs text-gray-500 font-mono">
								{getRemainingTime()}
							</span>
						</div>
					)}

					<div className="bg-gradient-to-br from-blue-50 to-purple-50 p-6 rounded-xl mb-6">
						<div className="text-center mb-4">
							<p className="text-gray-700 font-semibold mb-2">
								Số tiền cần thanh toán:
							</p>
							<p className="text-4xl font-bold text-[#D4AF37]">
								{formatVND(getAmountInVND())}
							</p>
						</div>

						{/* QR Code Display */}
						<div className="bg-white p-6 rounded-xl shadow-inner flex items-center justify-center">
							<div className="text-center">
								{pendingOrderData.payment?.qrCodeData &&
								!qrImageError ? (
									<img
										src={
											pendingOrderData.payment.qrCodeData
										}
										alt="QR Code thanh toán"
										className="w-64 h-64 mx-auto rounded-lg"
										onError={() => {
											console.error(
												"QR image failed to load"
											);
											setQrImageError(true);
										}}
										onLoad={() => {
											console.log(
												"QR image loaded successfully"
											);
										}}
									/>
								) : (
									<div className="w-64 h-64 bg-gray-100 flex items-center justify-center rounded-lg border-2 border-dashed border-gray-300">
										<div className="text-center p-4">
											<span className="text-4xl mb-2 block">
												📱
											</span>
											<p className="text-sm text-gray-600">
												{qrImageError
													? "Không thể tải mã QR. Vui lòng chuyển khoản thủ công."
													: "Đang tải mã QR..."}
											</p>
										</div>
									</div>
								)}
							</div>
						</div>

						{/* Bank Info for manual transfer */}
						{pendingOrderData.payment && (
							<div className="mt-4 p-4 bg-white rounded-lg text-sm">
								<p className="font-semibold mb-2 text-gray-800">
									Thông tin chuyển khoản:
								</p>
								<div className="space-y-1 text-gray-700">
									<p>
										<span className="text-gray-500">
											Ngân hàng:
										</span>{" "}
										{pendingOrderData.payment.bankCode ==
										"970422"
											? "MB BANK (Ngân hàng thương mại cổ phần Quân Đội)"
											: pendingOrderData.payment.bankCode}
									</p>
									<p>
										<span className="text-gray-500">
											Số TK:
										</span>{" "}
										{pendingOrderData.payment.accountNumber}
									</p>
									<p>
										<span className="text-gray-500">
											Chủ TK:
										</span>{" "}
										{pendingOrderData.payment.accountName}
									</p>
									<p>
										<span className="text-gray-500">
											Nội dung:
										</span>{" "}
										<span className="font-bold text-red-600">
											Thanh toan don hang{" "}
											{pendingOrderData.orderCode}
										</span>
									</p>
								</div>
							</div>
						)}
					</div>

					{/* Instructions */}
					<div className="space-y-3 mb-6 bg-blue-50 p-4 rounded-lg">
						<h3 className="font-semibold text-gray-800 mb-2">
							Hướng dẫn thanh toán:
						</h3>
						<ol className="list-decimal list-inside space-y-2 text-sm text-gray-700">
							<li>Mở ứng dụng ngân hàng hoặc ví điện tử</li>
							<li>Chọn chức năng quét QR hoặc chuyển khoản</li>
							<li>Quét mã QR hoặc nhập thông tin chuyển khoản</li>
							<li>
								<span className="text-red-600 font-medium">
									Quan trọng: Ghi đúng nội dung
								</span>
							</li>
							<li>
								Xác nhận thanh toán - hệ thống sẽ tự động kiểm
								tra
							</li>
						</ol>
					</div>

					{/* Payment Status Messages */}
					{paymentStatus === "checking" && (
						<div className="mb-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg flex items-center">
							<div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-yellow-600 mr-3"></div>
							<p className="text-yellow-700">
								Đang kiểm tra thanh toán...
							</p>
						</div>
					)}

					{paymentStatus === "confirmed" && (
						<div className="mb-4 p-4 bg-green-50 border border-green-200 rounded-lg">
							<p className="text-green-700 font-semibold">
								✅ Thanh toán thành công!
							</p>
						</div>
					)}

					{error && (
						<div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
							<p className="text-red-600 text-sm">{error}</p>
						</div>
					)}

					<button
						onClick={handleCancelQRPayment}
						disabled={
							paymentStatus === "checking" ||
							paymentStatus === "confirmed"
						}
						className="w-full py-3 mt-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors duration-300 font-semibold disabled:opacity-50"
					>
						Hủy và quay lại
					</button>

					{/* Support Contact */}
					<div className="mt-6 text-center text-sm text-gray-500">
						<p>Gặp vấn đề khi thanh toán?</p>
						<p className="font-semibold text-gray-700">
							Hotline: 1900 1234
						</p>
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
					<Link
						href="/menu"
						className="inline-flex items-center text-white/80 hover:text-white mb-4 transition-colors"
					>
						<span className="text-2xl mr-2">←</span>
						<span>Quay lại menu</span>
					</Link>
					<h1 className={`${italiana.className} text-5xl`}>
						Thanh toán
					</h1>
					<p className="mt-2 text-white/90">
						Hoàn tất đơn hàng của bạn
					</p>
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
						<h2 className={`${italiana.className} text-3xl mb-4`}>
							Giỏ hàng trống
						</h2>
						<p className="text-gray-600 mb-6">
							Vui lòng thêm món ăn vào giỏ hàng
						</p>
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
									<h2
										className={`${italiana.className} text-3xl`}
									>
										Thông tin giao hàng
									</h2>
								</div>

								<form className="space-y-4">
									<div className="grid md:grid-cols-2 gap-4">
										<div>
											<label className="block text-gray-700 font-semibold mb-2">
												Họ và tên{" "}
												<span className="text-red-500">
													*
												</span>
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
												Số điện thoại{" "}
												<span className="text-red-500">
													*
												</span>
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
											Địa chỉ giao hàng{" "}
											<span className="text-red-500">
												*
											</span>
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
												Phường/Xã{" "}
												<span className="text-red-500">
													*
												</span>
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
												Quận/Huyện{" "}
												<span className="text-red-500">
													*
												</span>
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
												Thành phố{" "}
												<span className="text-red-500">
													*
												</span>
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
									<h2
										className={`${italiana.className} text-3xl`}
									>
										Phương thức thanh toán
									</h2>
								</div>

								<div className="space-y-4">
									<label
										className={`block p-6 border-2 rounded-xl cursor-pointer transition-all duration-300 ${
											paymentMethod === "cash"
												? "border-[#D4AF37] bg-amber-50 shadow-md"
												: "border-gray-200 hover:border-gray-300 hover:shadow-sm"
										}`}
									>
										<div className="flex items-start">
											<input
												type="radio"
												name="payment"
												value="cash"
												checked={
													paymentMethod === "cash"
												}
												onChange={() =>
													setPaymentMethod("cash")
												}
												className="mt-1 w-5 h-5 text-[#D4AF37] focus:ring-[#D4AF37]"
											/>
											<div className="ml-4 flex-1">
												<div className="flex items-center justify-between">
													<span className="text-lg font-semibold text-gray-800">
														Tiền mặt khi nhận hàng
													</span>
													<span className="text-3xl">
														💵
													</span>
												</div>
												<p className="text-gray-600 text-sm mt-2">
													Thanh toán bằng tiền mặt khi
													nhận hàng tại nhà
												</p>
											</div>
										</div>
									</label>

									<label
										className={`block p-6 border-2 rounded-xl cursor-pointer transition-all duration-300 ${
											paymentMethod === "qr"
												? "border-[#D4AF37] bg-amber-50 shadow-md"
												: "border-gray-200 hover:border-gray-300 hover:shadow-sm"
										}`}
									>
										<div className="flex items-start">
											<input
												type="radio"
												name="payment"
												value="qr"
												checked={paymentMethod === "qr"}
												onChange={() =>
													setPaymentMethod("qr")
												}
												className="mt-1 w-5 h-5 text-[#D4AF37] focus:ring-[#D4AF37]"
											/>
											<div className="ml-4 flex-1">
												<div className="flex items-center justify-between">
													<span className="text-lg font-semibold text-gray-800">
														Chuyển khoản QR Code
													</span>
													<span className="text-3xl">
														📱
													</span>
												</div>
												<p className="text-gray-600 text-sm mt-2">
													Quét mã QR để thanh toán qua
													ứng dụng ngân hàng
												</p>
												{paymentMethod === "qr" && (
													<div className="mt-3 p-3 bg-blue-50 rounded-lg text-sm text-blue-800">
														<span className="font-semibold">
															💡 Lưu ý:
														</span>{" "}
														Đơn hàng sẽ được tạo và
														bạn sẽ nhận được mã QR
														để thanh toán
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
								<h2
									className={`${italiana.className} text-3xl mb-6`}
								>
									Đơn hàng
								</h2>

								<div className="space-y-4 mb-6 max-h-64 overflow-y-auto">
									{cartItems.map((item) => (
										<div
											key={item.id}
											className="flex gap-3 pb-4 border-b border-gray-100"
										>
											<div className="relative w-16 h-16 flex-shrink-0 rounded-lg overflow-hidden">
												<Image
													src={item.image}
													alt={item.name}
													fill
													className="object-cover"
												/>
											</div>
											<div className="flex-1">
												<h4 className="font-semibold text-gray-800 text-sm">
													{item.name}
												</h4>
												<p className="text-gray-600 text-sm">
													x{item.quantity}
												</p>
												<p className="text-[#D4AF37] font-bold">
													{formatVND(
														item.price *
															item.quantity
													)}
												</p>
											</div>
										</div>
									))}
								</div>

								<div className="space-y-3 mb-6 pb-6 border-b-2 border-gray-200">
									<div className="flex justify-between text-gray-700">
										<span>Tạm tính:</span>
										<span className="font-semibold">
											{formatVND(subtotal)}
										</span>
									</div>
									<div className="flex justify-between text-gray-700">
										<span>Phí giao hàng:</span>
										<span className="font-semibold">
											{formatVND(deliveryFee)}
										</span>
									</div>
								</div>

								<div className="flex justify-between text-xl font-bold mb-6">
									<span>Tổng cộng:</span>
									<span className="text-[#D4AF37]">
										{formatVND(total)}
									</span>
								</div>

								<button
									onClick={handleSubmit}
									disabled={submitting}
									className={`w-full py-4 bg-[#D4AF37] text-white rounded-lg hover:bg-[#B8941F] transition-all duration-300 font-bold text-lg shadow-lg hover:shadow-xl hover:scale-[1.02] ${
										submitting
											? "opacity-50 cursor-not-allowed"
											: ""
									}`}
								>
									{submitting
										? "Đang xử lý..."
										: paymentMethod === "qr"
										? "Tiếp tục thanh toán"
										: "Đặt hàng"}
								</button>

								<div className="mt-4 p-4 bg-green-50 rounded-lg">
									<div className="flex items-start">
										<span className="text-2xl mr-3">
											🔒
										</span>
										<p className="text-sm text-gray-700">
											Thông tin của bạn được bảo mật an
											toàn
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
