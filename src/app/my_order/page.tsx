"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import SlideBackground from "@/utils/SlideBackground";
import Star from "@/components/decorativeComponents/Star";
import Line from "@/components/decorativeComponents/Line";
import Image from "next/image";
import { Inria_Serif, Italiana } from "next/font/google";
import { Icon } from "@iconify/react";
import RatingFeedback from "@/components/order/RatingFeedback";

import orderService from "@/services/orderService";
import { useNoteStore } from "@/stores/useNoteStore";

const inriaSerif = Inria_Serif({ weight: ["300"], subsets: ["latin"] });
const italiana = Italiana({ weight: ["400"], subsets: ["latin"] });

interface OrderItem {
  id: number | string;
  menuItemId?: number | string;
  name: string;
  quantity: number;
  price: number;
  dishRating?: number;
  dishFeedback?: string;
  dishRatedAt?: string;
}

interface Order {
  id: number | string;
  orderNumber: string;
  date: string;
  time: string;
  status: "pending" | "confirmed" | "preparing" | "ready" | "delivering" | "completed" | "cancelled";
  items: OrderItem[];
  subtotal: number;
  total: number;
  paymentMethod: string;
  deliveryType: "dine-in" | "takeaway" | "delivery";
  address?: string;
  rating?: number;
  feedback?: string;
  ratedAt?: string;
}

const statusColors = {
  pending: "#FFC107",
  confirmed: "#2196F3",
  preparing: "#FF9800",
  ready: "#4CAF50",
  delivering: "#9C27B0",
  completed: "#4CAF50",
  cancelled: "#D32F2F",
};

const cardColors = ["#F5F4ED", "#FFFFFF", "#7A7A76", "#989793"] as const;
type FilterType = "all" | "pending" | "preparing" | "ready" | "delivering" | "completed" | "cancelled";

// Rating Component for Overall Order
interface RatingComponentProps {
  orderId: number | string;
  initialRating: number;
  initialFeedback?: string;
  onRate: (orderId: number | string, rating: number, feedback: string) => void;
  isLightBackground: boolean;
}

const RatingComponent = ({
  orderId,
  initialRating,
  initialFeedback,
  onRate,
  isLightBackground,
}: RatingComponentProps) => {
  const [rating, setRating] = useState(initialRating);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [feedback, setFeedback] = useState(initialFeedback || "");
  const [showFeedback, setShowFeedback] = useState(!!initialRating);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleStarClick = (starValue: number) => {
    setRating(starValue);
    setShowFeedback(true);
  };

  const handleSubmit = async () => {
    if (rating === 0) return;
    setIsSubmitting(true);
    await onRate(orderId, rating, feedback);
    setIsSubmitting(false);
  };

  return (
    <div className="flex flex-col gap-3">
      <p className={`text-sm font-semibold ${isLightBackground ? "text-black/70" : "text-white/70"}`}>
        {rating > 0 ? "Your Overall Rating:" : "Rate this order:"}
      </p>
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((starValue) => (
          <Icon
            key={starValue}
            className="text-[#FBBF24] text-3xl cursor-pointer transition-transform hover:scale-110"
            onClick={() => handleStarClick(starValue)}
            onMouseEnter={() => setHoveredRating(starValue)}
            onMouseLeave={() => setHoveredRating(0)}
            icon={(hoveredRating || rating) >= starValue ? "tabler:star-filled" : "lucide:star"}
          />
        ))}
      </div>

      {showFeedback && (
        <div className="flex flex-col gap-3 mt-2">
          <textarea
            value={feedback}
            onChange={(e) => setFeedback(e.target.value)}
            placeholder="Share your experience with this order..."
            className={`w-full px-4 py-3 rounded-lg border-2 focus:outline-none focus:ring-2 focus:ring-orange-500 resize-none ${
              isLightBackground
                ? "bg-white border-gray-300 text-black"
                : "bg-white/10 border-white/30 text-white placeholder-white/50"
            }`}
            rows={3}
            disabled={isSubmitting}
          />
          {!initialRating && (
            <button
              onClick={handleSubmit}
              disabled={isSubmitting || rating === 0}
              className={`px-6 py-2 rounded-lg font-medium transition duration-300 ${
                isLightBackground
                  ? "bg-black text-white hover:bg-gray-800"
                  : "bg-white text-black hover:bg-gray-200"
              } disabled:opacity-50 disabled:cursor-not-allowed`}
            >
              {isSubmitting ? "Submitting..." : "Submit Rating"}
            </button>
          )}
        </div>
      )}

      {initialRating && initialFeedback && (
        <div className={`mt-2 text-sm ${isLightBackground ? "text-black/60" : "text-white/60"}`}>
          <p className="italic">"{initialFeedback}"</p>
          {/* <p className="mt-1 text-xs">
            Rated on {new Date(initialFeedback).toLocaleDateString()}
          </p> */}
        </div>
      )}
    </div>
  );
};

// Cancel Confirmation Modal
interface CancelModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  orderNumber: string;
}

const CancelModal = ({ isOpen, onClose, onConfirm, orderNumber }: CancelModalProps) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-8 max-w-md w-full mx-4 shadow-2xl">
        <div className="flex items-center gap-3 mb-4">
          <Icon icon="material-symbols:warning" className="text-red-600 text-4xl" />
          <h3 className="text-2xl font-bold">Cancel Order</h3>
        </div>
        <p className="text-gray-700 mb-2">
          Are you sure you want to cancel order <span className="font-bold">{orderNumber}</span>?
        </p>
        <p className="text-gray-600 text-sm mb-6">
          This action cannot be undone. Your order will be cancelled immediately.
        </p>
        <div className="flex gap-4">
          <button
            onClick={onClose}
            className="flex-1 px-6 py-3 border-2 border-gray-300 hover:bg-gray-100 transition duration-300 rounded"
          >
            Keep Order
          </button>
          <button
            onClick={onConfirm}
            className="flex-1 px-6 py-3 bg-red-600 text-white hover:bg-red-700 transition duration-300 rounded"
          >
            Yes, Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default function OrderHistory() {
  const router = useRouter();
  const { setQuantity, reset } = useNoteStore();

  // API integration state
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // UI state
  const [activeFilter, setActiveFilter] = useState<FilterType>("all");
  const [expandedOrder, setExpandedOrder] = useState<number | string | null>(null);
  const [ordersList, setOrdersList] = useState<Order[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  // Simple in-page notification UI instead of browser alerts
  const [notification, setNotification] = useState<{
    type: "success" | "error" | "info";
    message: string;
  } | null>(null);

  const showNotification = (
    message: string,
    type: "success" | "error" | "info" = "info"
  ) => {
    setNotification({ message, type });
    // Auto-hide after 4 seconds
    setTimeout(() => {
      setNotification(null);
    }, 4000);
  };

  const [cancelModal, setCancelModal] = useState<{
    isOpen: boolean;
    orderId: number | string | null;
    orderNumber: string;
  }>({ isOpen: false, orderId: null, orderNumber: "" });

  // Rating modal for detailed per-dish reviews
  const [reviewModal, setReviewModal] = useState<{ isOpen: boolean; order: Order | null }>({
    isOpen: false,
    order: null,
  });

  // Map API order to UI Order shape
  const mapApiOrderToOrder = (o: any): Order => {
    const dateObj = new Date(o.createdAt);
    const time = `${String(dateObj.getHours()).padStart(2, "0")}:${String(
      dateObj.getMinutes()
    ).padStart(2, "0")}`;

    const status = o.status.toLowerCase() as Order["status"];

    const items = o.items.map((it: any) => ({
      id: it.id,
      menuItemId: it.menuItemId,
      name: it.menuItemName,
      quantity: it.quantity,
      price: it.unitPrice,
      dishRating: it.dishRating,
      dishFeedback: it.dishFeedback,
      dishRatedAt: it.dishRatedAt,
    }));

    const orderTypeMap: Record<string, Order["deliveryType"]> = {
      DELIVERY: "delivery",
      DINE_IN: "dine-in",
      TAKEAWAY: "takeaway",
    };
    const deliveryType = orderTypeMap[o.orderType] || "delivery";

    return {
      id: o.id,
      orderNumber: o.orderNumber,
      date: dateObj.toISOString(),
      time,
      status,
      items,
      subtotal: o.subtotal,
      total: o.totalAmount,
      paymentMethod: o.payment?.paymentMethod || "Cash",
      deliveryType,
      address: o.deliveryAddress || undefined,
      rating: o.rating || 0,
      feedback: o.feedback,
      ratedAt: o.ratedAt,
    };
  };

  // Load orders on mount
  useEffect(() => {
    let mounted = true;
    (async () => {
      setLoading(true);
      setError(null);
      const res = await orderService.getMyOrders({ page: 0, size: 50 }); 
      if (!mounted) return;

      if (!res?.success) {
        setError(res?.message || "Failed to load orders");
        setOrdersList([]);
      } else if (!res.data || res.data.length === 0) {
        setOrdersList([]);
      } else {
        setOrdersList(res.data.map(mapApiOrderToOrder));
      }
      setLoading(false);
    })();

    return () => {
      mounted = false;
    };
  }, []);

  // Filter orders based on active filter
  const filteredOrders = useMemo(() => {
    if (activeFilter === "all") return ordersList;
    return ordersList.filter((order) => order.status === activeFilter);
  }, [ordersList, activeFilter]);

  // Reset to first page when filter or data changes
  useEffect(() => {
    setCurrentPage(1);
  }, [activeFilter, filteredOrders.length]);

  // Pagination logic
  const totalPages = Math.ceil(filteredOrders.length / itemsPerPage) || 1;
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedOrders = filteredOrders.slice(startIndex, endIndex);

  const toggleOrderDetails = (orderId: number | string) => {
    setExpandedOrder(expandedOrder === orderId ? null : orderId);
  };

  const handleTrackOrder = (orderId: number | string) => {
    router.push(`/my_order/${orderId}`);
  };

  const handleCancelOrder = (orderId: number | string, orderNumber: string) => {
    setCancelModal({ isOpen: true, orderId, orderNumber });
  };

  const confirmCancelOrder = async () => {
    if (!cancelModal.orderId) return;
    const res = await orderService.cancelOrder(String(cancelModal.orderId), "Customer requested cancellation");


    if (!res?.success) {
      showNotification(res?.message || "Failed to cancel order", "error");
    } else {
      setOrdersList((prev) =>
        prev.map((o) =>
          String(o.id) === String(cancelModal.orderId) ? { ...o, status: "cancelled" } : o
        )
      );
    }
    setCancelModal({ isOpen: false, orderId: null, orderNumber: "" });
  };

  const handleReorder = async (order: Order) => {
    try {
      // Clear current cart so only reordered items are present
      reset();

      // Add each order item to the cart
      let itemsAdded = 0;

      for (const item of order.items) {
        // Check if menuItemId is available
        if (item.menuItemId) {
          const menuItemId = Number(item.menuItemId);
          const quantity = item.quantity;
          setQuantity(menuItemId, quantity);
          itemsAdded++;
        } else {
          console.warn(`Item ${item.name} does not have menuItemId, skipping...`);
        }
      }

      if (itemsAdded === 0) {
        showNotification(
          "Unable to add items to cart. Some items may not be available.",
          "error"
        );
        return;
      }

      // Navigate to checkout page
      router.push("/checkout");
    } catch (error) {
      console.error("Error adding items to cart:", error);
      showNotification("An error occurred while adding items to cart", "error");
    }
  };

  // Handle overall order rating submission
  const handleRating = async (orderId: number | string, rating: number, feedback: string) => {
    const res = await orderService.submitOrderRating(String(orderId), rating, feedback);
    if (!res?.success) {
      showNotification(res?.message || "Failed to save rating", "error");
      return;
    }
    
    // Update local state
    setOrdersList((prev) =>
      prev.map((o) =>
        String(o.id) === String(orderId)
          ? { ...o, rating, feedback, ratedAt: new Date().toISOString() }
          : o
      )
    );

    showNotification("Thank you for your rating!", "success");
  };

  // Open detailed review modal for per-dish ratings
  const handleLeaveReview = (order: Order) => {
    setReviewModal({ isOpen: true, order });
  };

  // Submit per-dish ratings from RatingFeedback component
  const handleRatingSubmit = async (finalList: any[]) => {
    if (!reviewModal.order) {
      setReviewModal({ isOpen: false, order: null });
      return;
    }

    try {
      // Submit each dish rating - match by name since we only send rated items
      const promises = finalList.map((item) => {
        // Find the matching order item by name
        const orderItem = reviewModal.order!.items.find(
          (oi) => oi.name === item.name
        );
        
        if (!orderItem) {
          console.warn("Order item not found for:", item.name);
          return Promise.resolve({ success: false, message: `Item ${item.name} not found in order` });
        }
        
        if (item.stars > 0) {
          console.log("Submitting rating:", {
            orderId: reviewModal.order!.id,
            itemId: orderItem.id,
            itemName: item.name,
            rating: item.stars,
            feedback: item.feedback || ""
          });
          return orderService.submitDishRating(
            String(reviewModal.order!.id),
            String(orderItem.id),
            item.stars,
            item.feedback || ""
          );
        }
        return Promise.resolve({ success: true });
      });

      const results = await Promise.all(promises);
      console.log("Rating submission results:", results);
      const failed = results.filter((r) => !r?.success);

      if (failed.length > 0) {
        console.error("Failed ratings:", failed);
        const errorMessages = failed.map(f => (f as any).message || 'Unknown error').join(', ');
        showNotification(
          `Some ratings failed to submit: ${errorMessages}`,
          "error"
        );
      } else {
        const ratedCount = finalList.filter(item => item.stars > 0).length;
        const totalCount = reviewModal.order!.items.length;
        
        if (ratedCount === totalCount) {
          showNotification(
            "Thank you for your detailed feedback on all items!",
            "success"
          );
        } else {
          showNotification(
            `Thank you! Your feedback for ${ratedCount} item${
              ratedCount > 1 ? "s" : ""
            } has been saved.`,
            "success"
          );
        }
        
        // Reload orders to get updated ratings
        const res = await orderService.getMyOrders({ page: 0, size: 50 });
        if (res?.success && res.data) {
          setOrdersList(res.data.map(mapApiOrderToOrder));
        }
      }
    } catch (error) {
      console.error("Error submitting ratings:", error);
      alert("An error occurred while submitting ratings: " + (error instanceof Error ? error.message : String(error)));
    }

    setReviewModal({ isOpen: false, order: null });
  };

  // Prepare infolist for RatingFeedback component
  const getInfoListForReview = (order: Order | null) => {
    if (!order) return [];
    return order.items.map((item) => ({
      name: item.name,
      src: `/food-img/${item.name.toLowerCase().replace(/\s+/g, "-")}.jpg`,
      rating: item.dishRating || 0,
      feedback: item.dishFeedback || "",
    }));
  };

  // UI Rendering
  return (
    <section className="relative">
      {/* Notification Toast */}
      {notification && (
        <div className="fixed top-24 right-6 z-50">
          <div
            className={`min-w-[260px] max-w-sm px-4 py-3 rounded shadow-lg border text-sm ${
              notification.type === "success"
                ? "bg-green-50 border-green-500 text-green-800"
                : notification.type === "error"
                ? "bg-red-50 border-red-500 text-red-800"
                : "bg-gray-50 border-gray-400 text-gray-800"
            }`}
          >
            <div className="flex items-start gap-2">
              <Icon
                icon={
                  notification.type === "success"
                    ? "mdi:check-circle-outline"
                    : notification.type === "error"
                    ? "mdi:alert-circle-outline"
                    : "mdi:information-outline"
                }
                className="mt-0.5 text-lg"
              />
              <div className="flex-1 text-left">{notification.message}</div>
              <button
                onClick={() => setNotification(null)}
                className="ml-2 text-xs opacity-60 hover:opacity-100"
              >
                ✕
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Cancel Confirmation Modal */}
      <CancelModal
        isOpen={cancelModal.isOpen}
        onClose={() => setCancelModal({ isOpen: false, orderId: null, orderNumber: "" })}
        onConfirm={confirmCancelOrder}
        orderNumber={cancelModal.orderNumber}
      />

      {/* Rating modal for detailed per-dish reviews */}
      {reviewModal.isOpen && reviewModal.order && (
        <>
          <div
            className="fixed inset-0 bg-black/50 z-30"
            onClick={() => setReviewModal({ isOpen: false, order: null })}
          />
          <RatingFeedback
            infolist={getInfoListForReview(reviewModal.order)}
            onSendRating={handleRatingSubmit}
          />
        </>
      )}

      {/* Background decorations */}
      <div className="absolute top-[800px] w-full flex justify-center">
        <Image
          src="/background/Group 12.png"
          alt="Decorative shape"
          width={2000}
          height={2000}
          className="w-full h-[1429px]"
        />
      </div>

      {/* Hero Section */}
      <SlideBackground
        images={["/background/bg1.jpg", "/background/bg3.jpg", "/background/bg2.jpg"]}
        interval={8000}
        transitionDuration={1500}
        className="flex-center h-[60vh] w-full"
        overlay="bg-black/40 border-b-4 golden"
      >
        <div className="flex-center w-[703px] h-[290px]">
          <span className="absolute top-0 left-0 w-[230px] h-[103px] border-white border-t-8 border-l-8" />
          <span className="absolute bottom-0 right-0 w-[230px] h-[103px] border-white border-b-8 border-r-8" />
          <div className="text-center text-white">
            <span className={`${inriaSerif.className} text-7xl`} style={{ fontStyle: "italic" }}>
              <p>Order</p>
              <p>History</p>
            </span>
            <p className="text-2xl">Track your culinary journey...</p>
          </div>
        </div>
      </SlideBackground>

      {/* Divider */}
      <div className="relative flex items-center justify-between w-[1134px] h-[64px] mt-[66px] mx-auto">
        <Line color="black" size={514} direction="horizontal" thinkness={3} />
        <Star color="black" size={64} />
        <Line color="black" size={514} direction="horizontal" thinkness={3} />
      </div>

      {/* Loading & Error States */}
      {loading && (
        <div className="py-20 text-center">
          <div className="flex items-center justify-center gap-3">
            <Icon icon="eos-icons:loading" className="text-5xl text-orange-500" />
            <h4 className="text-2xl opacity-60">Loading your orders…</h4>
          </div>
        </div>
      )}
      {!loading && error && (
        <div className="py-20 text-center">
          <h4 className="text-2xl text-red-600">{error}</h4>
          <button
            onClick={() => window.location.reload()}
            className="mt-4 px-6 py-2 bg-black text-white hover:bg-gray-800 transition duration-300"
          >
            Retry
          </button>
        </div>
      )}

      {/* Orders Section */}
      {!loading && !error && (
        <section className="relative text-center flex flex-col gap-11 w-[1280px] h-auto mt-[30px] mb-[100px] mx-auto">
          <span className={`${italiana.className} text-5xl`} data-aos="fade-up" data-aos-delay="0" data-aos-duration="650">
            Your Orders
          </span>

          {/* Filter Tabs */}
          <div className="flex flex-row gap-5 mx-auto flex-wrap justify-center" data-aos="fade-up" data-aos-delay="100" data-aos-duration="650">
            {(["all", "pending", "preparing", "ready", "delivering", "completed", "cancelled"] as FilterType[]).map((f) => (
              <button
                key={f}
                onClick={() => setActiveFilter(f)}
                className={`px-8 py-2 border-2 border-black transition duration-300 ${
                  activeFilter === f ? "bg-black text-white" : "hover:bg-black hover:text-white"
                }`}
              >
                {f[0].toUpperCase() + f.slice(1)}
              </button>
            ))}
          </div>

          {/* Orders List */}
          {filteredOrders.length > 0 ? (
            <div className="flex flex-col gap-6 mx-auto">
              {paginatedOrders.map((order, i) => {
                const isLightBackground = i % cardColors.length !== 2;
                return (
                  <div
                    key={order.id}
                    className="relative flex flex-col w-[1100px] shadow-xl px-8 py-6 rounded-lg"
                    style={{ backgroundColor: cardColors[i % cardColors.length] }}
                    data-aos="fade-up"
                    data-aos-delay={i * 100}
                    data-aos-duration="650"
                  >
                    {/* Order Header */}
                    <div className="flex justify-between items-start mb-4">
                      <div className="flex flex-col gap-2">
                        <div className="flex items-center gap-4">
                          <span className={`text-xl font-bold ${isLightBackground ? "text-black" : "text-white"}`}>
                            {order.orderNumber}
                          </span>
                          <span
                            className="px-4 py-1.5 rounded-full text-white text-sm font-medium uppercase"
                            style={{ backgroundColor: statusColors[order.status] }}
                          >
                            {order.status}
                          </span>
                        </div>
                        <div className={`flex items-center gap-6 text-base ${isLightBackground ? "text-black" : "text-white"}`}>
                          <div className="flex items-center gap-2">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                            <span>
                              {new Date(order.date).toLocaleDateString("en-US", {
                                month: "short",
                                day: "numeric",
                                year: "numeric",
                              })}
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            <span>{order.time}</span>
                          </div>
                          <div className="flex items-center gap-2 capitalize">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                            </svg>
                            <span>{order.deliveryType}</span>
                          </div>
                        </div>
                      </div>
                      <div className={`text-right ${isLightBackground ? "text-black" : "text-white"}`}>
                        <p className="text-sm opacity-75">Total Amount</p>
                        <p className="text-3xl font-bold">{order.total.toFixed(2)} VND</p>
                      </div>
                    </div>

                    {/* Order Summary */}
                    <div
                      className={`flex justify-between items-center py-4 border-t ${
                        isLightBackground ? "border-black/20 text-black" : "border-white/30 text-white"
                      }`}
                    >
                      <div className="flex items-center gap-6">
                        <div className="flex items-center gap-2">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                          </svg>
                          <span>
                            {order.items.length} {order.items.length === 1 ? "Item" : "Items"}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                          </svg>
                          <span>{order.paymentMethod}</span>
                        </div>
                        {order.deliveryType === "delivery" && order.address && (
                          <div className="flex items-center gap-2">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                            </svg>
                            <span className="max-w-[300px] truncate">{order.address}</span>
                          </div>
                        )}
                      </div>

                      <button
                        onClick={() => toggleOrderDetails(order.id)}
                        className={`flex items-center gap-2 px-4 py-2 border-2 transition duration-300 ${
                          isLightBackground ? "border-black hover:bg-black hover:text-white" : "border-white hover:bg-white hover:text-black"
                        }`}
                      >
                        <span>{expandedOrder === order.id ? "Hide Details" : "View Details"}</span>
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className={`h-5 w-5 transition-transform duration-300 ${
                            expandedOrder === order.id ? "rotate-180" : ""
                          }`}
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                      </button>
                    </div>

                    {/* Expanded Order Details */}
                    {expandedOrder === order.id && (
                      <div
                        className={`mt-4 pt-4 border-t ${
                          isLightBackground ? "border-black/20 text-black" : "border-white/30 text-white"
                        }`}
                      >
                        <h3 className="text-lg font-semibold mb-3">Order Items</h3>
                        <div className="flex flex-col gap-3">
                          {order.items.map((item) => (
                            <div
                              key={item.id}
                              className={`flex justify-between items-center py-3 px-4 rounded ${
                                isLightBackground ? "bg-black/5" : "bg-white/10"
                              }`}
                            >
                              <div className="flex items-center gap-4 flex-1">
                                <span className="font-medium text-lg">{item.name}</span>
                                <span className={`text-sm ${isLightBackground ? "text-black/60" : "text-white/70"}`}>
                                  x{item.quantity}
                                </span>
                                {item.dishRating && (
                                  <div className="flex items-center gap-1 ml-4">
                                    {Array.from({ length: 5 }, (_, i) => (
                                      <Icon
                                        key={i}
                                        icon={i < item.dishRating! ? "tabler:star-filled" : "lucide:star"}
                                        className="text-yellow-400 text-sm"
                                      />
                                    ))}
                                  </div>
                                )}
                              </div>
                              <span className="font-semibold text-lg">{(item.price * item.quantity).toFixed(2)} VND</span>
                            </div>
                          ))}
                        </div>

                        {/* Order Total Breakdown */}
                        <div className={`mt-4 pt-4 border-t ${isLightBackground ? "border-black/20" : "border-white/30"}`}>
                          <div className="flex justify-between items-center mb-2">
                            <span>Subtotal</span>
                            <span>{order.subtotal.toFixed(2)} VND</span>
                          </div>
                          {/* <div className="flex justify-between items-center mb-2">
                            <span>Tax (10%)</span>
                            <span>{(order.subtotal * 0.1).toFixed(2)} VND</span>
                          </div> */}
                          {order.deliveryType === "delivery" && (
                            <div className="flex justify-between items-center mb-2">
                              <span>Delivery Fee</span>
                              <span>8,000 VND</span>
                            </div>
                          )}
                          <div
                            className={`flex justify-between items-center pt-3 mt-3 border-t text-xl font-bold ${
                              isLightBackground ? "border-black/20" : "border-white/30"
                            }`}
                          >
                            <span>Total</span>
                            <span>
                              {(order.subtotal + (order.deliveryType === "delivery" ? 8000 : 0)).toFixed(2)} VND
                            </span>
                          </div>
                        </div>

                        {/* Rating Section for Completed Orders */}
                        {order.status === "completed" && (
                          <div className={`mt-6 pt-6 border-t ${isLightBackground ? "border-black/20" : "border-white/30"}`}>
                            <RatingComponent
                              orderId={order.id}
                              initialRating={order.rating || 0}
                              initialFeedback={order.feedback}
                              onRate={handleRating}
                              isLightBackground={isLightBackground}
                            />
                          </div>
                        )}
                      </div>
                    )}

                    {/* Action Buttons */}
                    <div className="flex justify-end gap-3 mt-4">
                      {/* Show track/cancel for pending, confirmed, preparing, ready statuses */}
                      {(order.status === "pending") && (
                        <>
                          {/* <button
                            onClick={() => handleTrackOrder(order.id)}
                            className={`px-6 py-2 border-2 transition duration-300 ${
                              isLightBackground ? "border-black hover:bg-black hover:text-white" : "border-white hover:bg-white hover:text-black"
                            }`}
                          >
                            Track Order
                          </button> */}
                          <button
                            onClick={() => handleCancelOrder(order.id, order.orderNumber)}
                            className={`px-6 py-2 border-2 transition duration-300 ${
                              isLightBackground
                                ? "border-red-600 text-red-600 hover:bg-red-600 hover:text-white"
                                : "border-red-400 text-red-400 hover:bg-red-400 hover:text-white"
                            }`}
                          >
                            Cancel Order
                          </button>
                        </>
                      )}

                      {/* Show track for delivering status */}
                      {order.status === "delivering" && (
                        <button
                          onClick={() => handleTrackOrder(order.id)}
                          className={`px-6 py-2 border-2 transition duration-300 ${
                            isLightBackground ? "border-black hover:bg-black hover:text-white" : "border-white hover:bg-white hover:text-black"
                          }`}
                        >
                          Track Delivery
                        </button>
                      )}

                      {/* Show review/reorder for completed status */}
                      {order.status === "completed" && (
                        <>
                          <button
                            onClick={() => handleLeaveReview(order)}
                            className={`px-6 py-2 border-2 transition duration-300 ${
                              i % cardColors.length === 2
                                ? "border-white hover:bg-white hover:text-black"
                                : "border-black hover:bg-black hover:text-white"
                            }`}
                          >
                            {order.items.some(item => item.dishRating) ? "Update Review" : "Leave Detailed Review"}
                          </button>

                          <button
                            onClick={() => handleReorder(order)}
                            className="px-6 py-2 bg-black text-white hover:bg-gray-800 transition duration-300"
                          >
                            Reorder
                          </button>
                        </>
                      )}

                      {/* Show reorder for cancelled status */}
                      {order.status === "cancelled" && (
                        <button
                          onClick={() => handleReorder(order)}
                          className="px-6 py-2 bg-black text-white hover:bg-gray-800 transition duration-300"
                        >
                          Reorder
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
              {/* Pagination Controls */}
              {filteredOrders.length > itemsPerPage && (
                <div className="flex items-center justify-center gap-4 mt-6">
                  <button
                    onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                    disabled={currentPage === 1}
                    className={`px-4 py-2 border-2 transition duration-300 ${
                      currentPage === 1
                        ? "border-gray-300 text-gray-300 cursor-not-allowed"
                        : "border-black hover:bg-black hover:text-white"
                    }`}
                  >
                    Previous
                  </button>
                  <span className="text-sm text-gray-700">
                    Page {currentPage} of {totalPages}
                  </span>
                  <button
                    onClick={() =>
                      setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                    }
                    disabled={currentPage === totalPages}
                    className={`px-4 py-2 border-2 transition duration-300 ${
                      currentPage === totalPages
                        ? "border-gray-300 text-gray-300 cursor-not-allowed"
                        : "border-black hover:bg-black hover:text-white"
                    }`}
                  >
                    Next
                  </button>
                </div>
              )}
            </div>
          ) : (
            // Empty State
            <div className="flex flex-col items-center gap-6 py-20" data-aos="fade-up" data-aos-delay="0" data-aos-duration="650">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-24 w-24 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
              <p className="text-2xl text-gray-500">No {activeFilter !== "all" ? activeFilter : ""} orders found</p>
              <button 
                onClick={() => router.push("/menu")}
                className="px-8 py-3 bg-black text-white hover:bg-gray-800 transition duration-300 mt-4"
              >
                Start Ordering
              </button>
            </div>
          )}
        </section>
      )}

      {/* Bottom Divider */}
      <div className="relative flex items-center justify-between w-[1134px] h-[64px] mb-[100px] mx-auto">
        <Line color="black" size={514} direction="horizontal" thinkness={3} />
        <Star color="black" size={64} />
        <Line color="black" size={514} direction="horizontal" thinkness={3} />
      </div>
    </section>
  );
}