"use client";

import { useState } from "react";
import SlideBackground from "@/utils/SlideBackground";
import Star from "@/components/decorativeComponents/Star";
import Line from "@/components/decorativeComponents/Line";
import Image from "next/image";
import { Inria_Serif, Italiana } from "next/font/google";

const inriaSerif = Inria_Serif({
  weight: ["300"],
  subsets: ["latin"],
});

const italiana = Italiana({
  weight: ["400"],
  subsets: ["latin"],
});

interface OrderItem {
  id: number;
  name: string;
  quantity: number;
  price: number;
}

interface Order {
  id: number;
  orderNumber: string;
  date: string;
  time: string;
  status: "preparing" | "completed" | "cancelled" | "delivered";
  items: OrderItem[];
  total: number;
  paymentMethod: string;
  deliveryType: "dine-in" | "takeaway" | "delivery";
  address?: string;
}

const orders: Order[] = [
  {
    id: 1,
    orderNumber: "ORD-2025-001",
    date: "2025-02-10",
    time: "19:30",
    status: "preparing",
    items: [
      { id: 1, name: "Grilled Salmon", quantity: 2, price: 28.99 },
      { id: 2, name: "Caesar Salad", quantity: 1, price: 12.99 },
      { id: 3, name: "Red Wine", quantity: 1, price: 45.00 },
    ],
    total: 115.97,
    paymentMethod: "Credit Card",
    deliveryType: "dine-in",
  },
  {
    id: 2,
    orderNumber: "ORD-2025-002",
    date: "2025-02-05",
    time: "18:15",
    status: "completed",
    items: [
      { id: 4, name: "Ribeye Steak", quantity: 1, price: 42.99 },
      { id: 5, name: "Mashed Potatoes", quantity: 1, price: 8.99 },
      { id: 6, name: "Tiramisu", quantity: 2, price: 9.99 },
    ],
    total: 71.96,
    paymentMethod: "Cash",
    deliveryType: "dine-in",
  },
  {
    id: 3,
    orderNumber: "ORD-2025-003",
    date: "2025-01-28",
    time: "20:00",
    status: "delivered",
    items: [
      { id: 7, name: "Margherita Pizza", quantity: 2, price: 16.99 },
      { id: 8, name: "Garlic Bread", quantity: 1, price: 6.99 },
      { id: 9, name: "Coca Cola", quantity: 2, price: 3.99 },
    ],
    total: 48.95,
    paymentMethod: "Debit Card",
    deliveryType: "delivery",
    address: "123 Main Street, Apt 4B, New York, NY 10001",
  },
  {
    id: 4,
    orderNumber: "ORD-2025-004",
    date: "2025-01-20",
    time: "12:30",
    status: "completed",
    items: [
      { id: 10, name: "Chicken Pasta", quantity: 1, price: 18.99 },
      { id: 11, name: "Garden Salad", quantity: 1, price: 10.99 },
    ],
    total: 29.98,
    paymentMethod: "Credit Card",
    deliveryType: "takeaway",
  },
  {
    id: 5,
    orderNumber: "ORD-2025-005",
    date: "2025-01-15",
    time: "19:45",
    status: "cancelled",
    items: [
      { id: 12, name: "Lobster Thermidor", quantity: 2, price: 65.99 },
      { id: 13, name: "Champagne", quantity: 1, price: 89.99 },
    ],
    total: 221.97,
    paymentMethod: "Credit Card",
    deliveryType: "dine-in",
  },
  {
    id: 6,
    orderNumber: "ORD-2025-006",
    date: "2025-01-10",
    time: "13:00",
    status: "completed",
    items: [
      { id: 14, name: "Club Sandwich", quantity: 1, price: 14.99 },
      { id: 15, name: "French Fries", quantity: 1, price: 5.99 },
      { id: 16, name: "Lemonade", quantity: 1, price: 4.99 },
    ],
    total: 25.97,
    paymentMethod: "Cash",
    deliveryType: "takeaway",
  },
];

const statusColors = {
  preparing: "#FF9800",
  completed: "#4CAF50",
  cancelled: "#D32F2F",
  delivered: "#2196F3",
};

const cardColors = ["#F5F4ED", "#FFFFFF", "#7A7A76", "#989793"];

type FilterType = "all" | "preparing" | "completed" | "cancelled" | "delivered";

export default function OrderHistory() {
  const [activeFilter, setActiveFilter] = useState<FilterType>("all");
  const [expandedOrder, setExpandedOrder] = useState<number | null>(null);

  // Filter orders based on active filter
  const filteredOrders =
    activeFilter === "all"
      ? orders
      : orders.filter((order) => order.status === activeFilter);

  const toggleOrderDetails = (orderId: number) => {
    setExpandedOrder(expandedOrder === orderId ? null : orderId);
  };

  return (
    <section className="relative">
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
        images={[
          "/background/bg1.jpg",
          "/background/bg3.jpg",
          "/background/bg2.jpg",
        ]}
        interval={8000}
        transitionDuration={1500}
        className="flex-center h-[60vh] w-full"
        overlay="bg-black/40 border-b-4 golden"
      >
        <div className="flex-center w-[703px] h-[290px]">
          <span className="absolute top-0 left-0 w-[230px] h-[103px] border-white border-t-8 border-l-8" />
          <span className="absolute bottom-0 right-0 w-[230px] h-[103px] border-white border-b-8 border-r-8" />
          <div className="text-center text-white">
            <span
              className={`${inriaSerif.className} text-7xl`}
              style={{ fontStyle: "italic" }}
            >
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

      {/* Orders Section */}
      <section className="relative text-center flex flex-col gap-11 w-[1280px] h-auto mt-[75px] mb-[100px] mx-auto">
        <span
          className={`${italiana.className} text-5xl`}
          data-aos="fade-up"
          data-aos-delay="0"
          data-aos-duration="650"
        >
          Your Orders
        </span>

        {/* Filter Tabs */}
        <div
          className="flex flex-row gap-5 mx-auto flex-wrap justify-center"
          data-aos="fade-up"
          data-aos-delay="100"
          data-aos-duration="650"
        >
          <button
            onClick={() => setActiveFilter("all")}
            className={`px-8 py-2 border-2 border-black transition duration-300 ${
              activeFilter === "all"
                ? "bg-black text-white"
                : "hover:bg-black hover:text-white"
            }`}
          >
            All
          </button>
          <button
            onClick={() => setActiveFilter("preparing")}
            className={`px-8 py-2 border-2 border-black transition duration-300 ${
              activeFilter === "preparing"
                ? "bg-black text-white"
                : "hover:bg-black hover:text-white"
            }`}
          >
            Preparing
          </button>
          <button
            onClick={() => setActiveFilter("delivered")}
            className={`px-8 py-2 border-2 border-black transition duration-300 ${
              activeFilter === "delivered"
                ? "bg-black text-white"
                : "hover:bg-black hover:text-white"
            }`}
          >
            Delivered
          </button>
          <button
            onClick={() => setActiveFilter("completed")}
            className={`px-8 py-2 border-2 border-black transition duration-300 ${
              activeFilter === "completed"
                ? "bg-black text-white"
                : "hover:bg-black hover:text-white"
            }`}
          >
            Completed
          </button>
          <button
            onClick={() => setActiveFilter("cancelled")}
            className={`px-8 py-2 border-2 border-black transition duration-300 ${
              activeFilter === "cancelled"
                ? "bg-black text-white"
                : "hover:bg-black hover:text-white"
            }`}
          >
            Cancelled
          </button>
        </div>

        {/* Orders List */}
        {filteredOrders.length > 0 ? (
          <div className="flex flex-col gap-6 mx-auto">
            {filteredOrders.map((order, i) => (
              <div
                key={order.id}
                className="relative flex flex-col w-[1100px] shadow-xl px-8 py-6 rounded-lg"
                style={{
                  backgroundColor: cardColors[i % cardColors.length],
                }}
                data-aos="fade-up"
                data-aos-delay={i * 100}
                data-aos-duration="650"
              >
                {/* Order Header */}
                <div className="flex justify-between items-start mb-4">
                  <div className="flex flex-col gap-2">
                    <div className="flex items-center gap-4">
                      <span
                        className={`text-xl font-bold ${
                          i % cardColors.length === 2
                            ? "text-white"
                            : "text-black"
                        }`}
                      >
                        {order.orderNumber}
                      </span>
                      <span
                        className="px-4 py-1.5 rounded-full text-white text-sm font-medium uppercase"
                        style={{
                          backgroundColor: statusColors[order.status],
                        }}
                      >
                        {order.status}
                      </span>
                    </div>
                    <div
                      className={`flex items-center gap-6 text-base ${
                        i % cardColors.length === 2 ? "text-white" : "text-black"
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-5 w-5"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                          />
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
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-5 w-5"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                          />
                        </svg>
                        <span>{order.time}</span>
                      </div>
                      <div className="flex items-center gap-2 capitalize">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-5 w-5"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
                          />
                        </svg>
                        <span>{order.deliveryType}</span>
                      </div>
                    </div>
                  </div>
                  <div
                    className={`text-right ${
                      i % cardColors.length === 2 ? "text-white" : "text-black"
                    }`}
                  >
                    <p className="text-sm opacity-75">Total Amount</p>
                    <p className="text-3xl font-bold">${order.total.toFixed(2)}</p>
                  </div>
                </div>

                {/* Order Summary */}
                <div
                  className={`flex justify-between items-center py-4 border-t ${
                                        i % cardColors.length === 2
                      ? "border-white/30 text-white"
                      : "border-black/20 text-black"
                  }`}
                >
                  <div className="flex items-center gap-6">
                    <div className="flex items-center gap-2">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
                        />
                      </svg>
                      <span>
                        {order.items.length}{" "}
                        {order.items.length === 1 ? "Item" : "Items"}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"
                        />
                      </svg>
                      <span>{order.paymentMethod}</span>
                    </div>
                    {order.deliveryType === "delivery" && order.address && (
                      <div className="flex items-center gap-2">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-5 w-5"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                          />
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                          />
                        </svg>
                        <span className="max-w-[300px] truncate">
                          {order.address}
                        </span>
                      </div>
                    )}
                  </div>

                  <button
                    onClick={() => toggleOrderDetails(order.id)}
                    className={`flex items-center gap-2 px-4 py-2 border-2 transition duration-300 ${
                      i % cardColors.length === 2
                        ? "border-white hover:bg-white hover:text-black"
                        : "border-black hover:bg-black hover:text-white"
                    }`}
                  >
                    <span>
                      {expandedOrder === order.id
                        ? "Hide Details"
                        : "View Details"}
                    </span>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className={`h-5 w-5 transition-transform duration-300 ${
                        expandedOrder === order.id ? "rotate-180" : ""
                      }`}
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 9l-7 7-7-7"
                      />
                    </svg>
                  </button>
                </div>

                {/* Expanded Order Details */}
                {expandedOrder === order.id && (
                  <div
                    className={`mt-4 pt-4 border-t ${
                      i % cardColors.length === 2
                        ? "border-white/30 text-white"
                        : "border-black/20 text-black"
                    }`}
                  >
                    <h3 className="text-lg font-semibold mb-3">Order Items</h3>
                    <div className="flex flex-col gap-3">
                      {order.items.map((item) => (
                        <div
                          key={item.id}
                          className={`flex justify-between items-center py-3 px-4 rounded ${
                            i % cardColors.length === 2
                              ? "bg-white/10"
                              : "bg-black/5"
                          }`}
                        >
                          <div className="flex items-center gap-4">
                            <span className="font-medium text-lg">
                              {item.name}
                            </span>
                            <span
                              className={`text-sm ${
                                i % cardColors.length === 2
                                  ? "text-white/70"
                                  : "text-black/60"
                              }`}
                            >
                              x{item.quantity}
                            </span>
                          </div>
                          <span className="font-semibold text-lg">
                            ${(item.price * item.quantity).toFixed(2)}
                          </span>
                        </div>
                      ))}
                    </div>

                    {/* Order Total Breakdown */}
                    <div
                      className={`mt-4 pt-4 border-t ${
                        i % cardColors.length === 2
                          ? "border-white/30"
                          : "border-black/20"
                      }`}
                    >
                      <div className="flex justify-between items-center mb-2">
                        <span>Subtotal</span>
                        <span>${order.total.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between items-center mb-2">
                        <span>Tax (10%)</span>
                        <span>${(order.total * 0.1).toFixed(2)}</span>
                      </div>
                      {order.deliveryType === "delivery" && (
                        <div className="flex justify-between items-center mb-2">
                          <span>Delivery Fee</span>
                          <span>$5.00</span>
                        </div>
                      )}
                      <div
                        className={`flex justify-between items-center pt-3 mt-3 border-t text-xl font-bold ${
                          i % cardColors.length === 2
                            ? "border-white/30"
                            : "border-black/20"
                        }`}
                      >
                        <span>Total</span>
                        <span>
                          $
                          {(
                            order.total * 1.1 +
                            (order.deliveryType === "delivery" ? 5 : 0)
                          ).toFixed(2)}
                        </span>
                      </div>
                    </div>
                  </div>
                )}

                {/* Action Buttons */}
                <div className="flex justify-end gap-3 mt-4">
                  {order.status === "preparing" && (
                    <>
                      <button
                        className={`px-6 py-2 border-2 transition duration-300 ${
                          i % cardColors.length === 2
                            ? "border-white hover:bg-white hover:text-black"
                            : "border-black hover:bg-black hover:text-white"
                        }`}
                      >
                        Track Order
                      </button>
                      <button
                        className={`px-6 py-2 border-2 transition duration-300 ${
                          i % cardColors.length === 2
                            ? "border-red-400 text-red-400 hover:bg-red-400 hover:text-white"
                            : "border-red-600 text-red-600 hover:bg-red-600 hover:text-white"
                        }`}
                      >
                        Cancel Order
                      </button>
                    </>
                  )}

                  {(order.status === "completed" ||
                    order.status === "delivered") && (
                    <>
                      <button className="px-6 py-2 bg-black text-white hover:bg-gray-800 transition duration-300">
                        Reorder
                      </button>
                      <button
                        className={`px-6 py-2 border-2 transition duration-300 ${
                          i % cardColors.length === 2
                            ? "border-white hover:bg-white hover:text-black"
                            : "border-black hover:bg-black hover:text-white"
                        }`}
                      >
                        Leave Review
                      </button>
                      <button
                        className={`px-6 py-2 border-2 transition duration-300 ${
                          i % cardColors.length === 2
                            ? "border-white hover:bg-white hover:text-black"
                            : "border-black hover:bg-black hover:text-white"
                        }`}
                      >
                        Download Receipt
                      </button>
                    </>
                  )}

                  {order.status === "cancelled" && (
                    <button className="px-6 py-2 bg-black text-white hover:bg-gray-800 transition duration-300">
                      Reorder
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          // Empty State
          <div
            className="flex flex-col items-center gap-6 py-20"
            data-aos="fade-up"
            data-aos-delay="0"
            data-aos-duration="650"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-24 w-24 text-gray-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
              />
            </svg>
            <p className="text-2xl text-gray-500">
              No {activeFilter !== "all" ? activeFilter : ""} orders found
            </p>
            <button className="px-8 py-3 bg-black text-white hover:bg-gray-800 transition duration-300 mt-4">
              Start Ordering
            </button>
          </div>
        )}
      </section>

      {/* Bottom Divider */}
      <div className="relative flex items-center justify-between w-[1134px] h-[64px] mb-[100px] mx-auto">
        <Line color="black" size={514} direction="horizontal" thinkness={3} />
        <Star color="black" size={64} />
        <Line color="black" size={514} direction="horizontal" thinkness={3} />
      </div>
    </section>
  );
}