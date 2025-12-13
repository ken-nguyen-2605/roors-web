// Reservation History Page - Updated with correct API interface

"use client";

import { useState, useEffect } from "react";
import SlideBackground from "@/utils/SlideBackground";
import Star from "@/components/decorativeComponents/Star";
import Line from "@/components/decorativeComponents/Line";
import Image from "next/image";
import { Inria_Serif, Italiana } from "next/font/google";
import reservationService from "@/services/reservationService";
import { useRouter } from "next/navigation";

const inriaSerif = Inria_Serif({
  weight: ["300"],
  subsets: ["latin"],
});

const italiana = Italiana({
  weight: ["400"],
  subsets: ["latin"],
});

interface Reservation {
  id: number;
  user: {
    id: number;
    username: string;
  };
  diningTable: {
    id: number;
    name: string;
    floor: string;
    capacity: number;
  };
  status: "CONFIRMED" | "ARRIVED" | "CANCELLED" | "NO_SHOW";
  phone: string;
  numberOfGuests: number;
  startTime: string; // ISO datetime format
  endTime: string; // ISO datetime format
  specialRequests?: string;
}

const statusColors = {
  CONFIRMED: "#4CAF50",
  ARRIVED: "#2196F3",
  CANCELLED: "#D32F2F",
  NO_SHOW: "#757575",
};

const cardColors = ["#F5F4ED", "#FFFFFF", "#7A7A76", "#989793"];

type FilterType = "all" | "CONFIRMED" | "ARRIVED" | "CANCELLED" | "NO_SHOW";

export default function ReservationHistory() {
  const router = useRouter();
  const [activeFilter, setActiveFilter] = useState<FilterType>("all");
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch reservations on component mount
  useEffect(() => {
    fetchReservations();
  }, []);

  const fetchReservations = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await reservationService.getMyReservations();
      if (response.success && response.data) {
        // Transform data
        const transformedReservations: Reservation[] = response.data.map((item: any) => ({
          id: item.id,
          reservationDate: item.startTime.split('T')[0], // e.g., "2025-11-15"
          reservationTime: item.startTime.split('T')[1], // e.g., "12:00:00"
          numberOfGuests: item.numberOfGuests,
          status: item.status,
          tableNumber: item.diningTable?.name,
          specialRequests: item.specialRequests, // Add more mapping if needed
          customerName: item.user?.username, // Or however you want to get customer info
          customerPhone: item.phone,
          customerEmail: item.user?.email, // Update based on actual data
        }));

        // Sort transformed data by date+time (newest first)
        const sortedReservations = transformedReservations.sort((a, b) => {
          const dateA = new Date(`${a.reservationDate}T${a.reservationTime}`);
          const dateB = new Date(`${b.reservationDate}T${b.reservationTime}`);
          return dateB.getTime() - dateA.getTime();
        });

        setReservations(sortedReservations);
      } else {
        setError(response.message || "Failed to fetch reservations");
      }
    } catch (err) {
      setError("An unexpected error occurred");
      console.error("Error fetching reservations:", err);
    } finally {
      setLoading(false);
    }
  };

  // Filter reservations based on active filter
  const filteredReservations =
    activeFilter === "all"
      ? reservations
      : reservations.filter((res) => res.status === activeFilter);

  // Categorize reservations for quick filter buttons
  const confirmedReservations = reservations.filter(
    (res) => res.status === "CONFIRMED"
  );
  const arrivedReservations = reservations.filter(
    (res) => res.status === "ARRIVED"
  );
  const cancelledReservations = reservations.filter(
    (res) => res.status === "CANCELLED"
  );
  const noShowReservations = reservations.filter(
    (res) => res.status === "NO_SHOW"
  );

  // Format date from ISO string
  const formatDate = (isoString: string) => {
    return new Date(isoString).toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  // Format time from ISO string
  const formatTime = (isoString: string) => {
    return new Date(isoString).toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  };

  // Handle cancel reservation
  const handleCancelReservation = async (reservationId: number) => {
    const confirmed = window.confirm(
      "Are you sure you want to cancel this reservation?"
    );
    
    if (!confirmed) return;

    try {
      const response = await reservationService.cancelReservation(reservationId);
      
      if (response.success) {
        alert("Reservation cancelled successfully!");
        fetchReservations(); // Refresh the list
      } else {
        alert(response.message || "Failed to cancel reservation");
      }
    } catch (err) {
      alert("An error occurred while cancelling the reservation");
      console.error("Error cancelling reservation:", err);
    }
  };

  // Handle modify reservation
  const handleModifyReservation = (reservationId: number) => {
    router.push(`/reservations/modify/${reservationId}`);
  };

  // Handle book again
  const handleBookAgain = () => {
    router.push("/reservations/new");
  };

  // Check if reservation can be modified/cancelled (only CONFIRMED reservations)
  const canModifyReservation = (reservation: Reservation) => {
    if (reservation.status !== "CONFIRMED") return false;
    
    // Check if reservation is in the future
    const reservationDate = new Date(reservation.startTime);
    const now = new Date();
    return reservationDate > now;
  };

  const canCancelReservation = (reservation: Reservation) => {
    if (reservation.status !== "CONFIRMED") return false;
    
    // Check if reservation is in the future
    const reservationDate = new Date(reservation.startTime);
    const now = new Date();
    return reservationDate > now;
  };

  // Get status display text
  const getStatusDisplay = (status: string) => {
    const statusMap: Record<string, string> = {
      CONFIRMED: "Confirmed",
      ARRIVED: "Arrived",
      CANCELLED: "Cancelled",
      NO_SHOW: "No Show",
    };
    return statusMap[status] || status;
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
              <p>Reservation</p>
              <p>History</p>
            </span>
            <p className="text-2xl">Your dining memories...</p>
          </div>
        </div>
      </SlideBackground>

      {/* Divider */}
      <div className="relative flex items-center justify-between w-[1134px] h-[64px] mt-[66px] mx-auto">
        <Line
          color="black"
          size={514}
          direction="horizontal"
          thinkness={3}
        />
        <Star color="black" size={64} />
        <Line
          color="black"
          size={514}
          direction="horizontal"
          thinkness={3}
        />
      </div>

      {/* Reservations Section */}
      <section className="relative text-center flex flex-col gap-11 w-[1280px] h-auto mt-[75px] mb-[100px] mx-auto">
        <span
          className={`${italiana.className} text-5xl`}
          data-aos="fade-up"
          data-aos-delay="0"
          data-aos-duration="650"
        >
          Your Reservations
        </span>

        {/* Filter Tabs */}
        <div
          className="flex flex-row gap-5 mx-auto"
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
            All ({reservations.length})
          </button>
          <button
            onClick={() => setActiveFilter("CONFIRMED")}
            className={`px-8 py-2 border-2 border-black transition duration-300 ${
              activeFilter === "CONFIRMED"
                ? "bg-black text-white"
                : "hover:bg-black hover:text-white"
            }`}
          >
            Confirmed ({confirmedReservations.length})
          </button>
          <button
            onClick={() => setActiveFilter("ARRIVED")}
            className={`px-8 py-2 border-2 border-black transition duration-300 ${
              activeFilter === "ARRIVED"
                ? "bg-black text-white"
                : "hover:bg-black hover:text-white"
            }`}
          >
            Arrived ({arrivedReservations.length})
          </button>
          <button
            onClick={() => setActiveFilter("NO_SHOW")}
            className={`px-8 py-2 border-2 border-black transition duration-300 ${
              activeFilter === "NO_SHOW"
                ? "bg-black text-white"
                : "hover:bg-black hover:text-white"
            }`}
          >
            No Show ({noShowReservations.length})
          </button>
          <button
            onClick={() => setActiveFilter("CANCELLED")}
            className={`px-8 py-2 border-2 border-black transition duration-300 ${
              activeFilter === "CANCELLED"
                ? "bg-black text-white"
                : "hover:bg-black hover:text-white"
            }`}
          >
            Cancelled ({cancelledReservations.length})
          </button>
        </div>

        {/* Loading State */}
        {loading && (
          <div
            className="flex flex-col items-center gap-6 py-20"
            data-aos="fade-up"
          >
            <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-black"></div>
            <p className="text-2xl text-gray-600">Loading your reservations...</p>
          </div>
        )}

        {/* Error State */}
        {error && !loading && (
          <div
            className="flex flex-col items-center gap-6 py-20"
            data-aos="fade-up"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-24 w-24 text-red-500"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <p className="text-2xl text-red-500">{error}</p>
            <button
              onClick={fetchReservations}
              className="px-8 py-3 bg-black text-white hover:bg-gray-800 transition duration-300 mt-4"
            >
              Try Again
            </button>
          </div>
        )}

        {/* Reservations List */}
        {!loading && !error && filteredReservations.length > 0 && (
          <div className="flex flex-col gap-6 mx-auto">
            {filteredReservations.map((reservation, i) => (
              <div
                key={reservation.id}
                className="relative flex flex-col w-[1100px] shadow-xl px-8 py-6 rounded-lg"
                style={{
                  backgroundColor: cardColors[i % cardColors.length],
                }}
                data-aos="fade-up"
                data-aos-delay={i * 100}
                data-aos-duration="650"
              >
                {/* Status Badge */}
                <div className="flex justify-start mb-4">
                  <span
                    className="px-4 py-1.5 rounded-full text-white text-sm font-medium uppercase"
                    style={{
                      backgroundColor: statusColors[reservation.status],
                    }}
                  >
                    {getStatusDisplay(reservation.status)}
                  </span>
                </div>

                {/* Reservation Details */}
                <div
                  className={`flex flex-row justify-between items-center ${
                    i % cardColors.length === 2 ? "text-white" : "text-black"
                  }`}
                >
                  <div className="flex flex-col gap-3 text-left">
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-2">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-6 w-6"
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
                        <span className="text-2xl font-medium">
                          {formatDate(reservation.startTime)}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-8 text-lg">
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
                        <span>
                          {formatTime(reservation.startTime)} - {formatTime(reservation.endTime)}
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
                            d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                          />
                        </svg>
                        <span>
                          {reservation.numberOfGuests}{" "}
                          {reservation.numberOfGuests === 1 ? "Guest" : "Guests"}
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
                            d="M3 10h18M3 14h18m-9-4v8m-7 0h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"
                          />
                        </svg>
                        <span>
                          Table {reservation.diningTable.name} ({reservation.diningTable.floor})
                        </span>
                      </div>
                    </div>

                    {/* Phone Number */}
                    <div className="flex items-center gap-2 text-sm">
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
                          d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                        />
                      </svg>
                      <span>{reservation.phone}</span>
                    </div>

                    {/* Special Requests */}
                    {reservation.specialRequests && (
                      <div className="flex items-start gap-2 text-sm mt-2">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-5 w-5 flex-shrink-0"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z"
                          />
                        </svg>
                        <span className="italic">{reservation.specialRequests}</span>
                      </div>
                    )}
                  </div>

                  {/* Action Buttons */}
                  {reservation.status === "CONFIRMED" && (
                    <div className="flex flex-col gap-2">
                      {canModifyReservation(reservation) && (
                        <button
                          onClick={() => handleModifyReservation(reservation.id)}
                          className="px-6 py-2 bg-black text-white hover:bg-gray-800 transition duration-300"
                        >
                          Modify
                        </button>
                      )}
                      {canCancelReservation(reservation) && (
                        <button
                          onClick={() => handleCancelReservation(reservation.id)}
                          className={`px-6 py-2 border-2 transition duration-300 ${
                            i % cardColors.length === 2
                              ? "border-white hover:bg-white hover:text-black"
                              : "border-black hover:bg-black hover:text-white"
                          }`}
                        >
                          Cancel
                        </button>
                      )}
                    </div>
                  )}

                  {reservation.status === "ARRIVED" && (
                    <button
                      onClick={handleBookAgain}
                      className="px-6 py-2 bg-black text-white hover:bg-gray-800 transition duration-300"
                    >
                      Book Again
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Empty State */}
        {!loading && !error && filteredReservations.length === 0 && (
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
                d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
            <p className="text-2xl text-gray-500">
              No{" "}
              {activeFilter !== "all"
                ? getStatusDisplay(activeFilter).toLowerCase()
                : ""}{" "}
              reservations found
            </p>
            <button
              onClick={handleBookAgain}
              className="px-8 py-3 bg-black text-white hover:bg-gray-800 transition duration-300 mt-4"
            >
              Make a Reservation
            </button>
          </div>
        )}
      </section>

      {/* Bottom Divider */}
      <div className="relative flex items-center justify-between w-[1134px] h-[64px] mb-[100px] mx-auto">
        <Line
          color="black"
          size={514}
          direction="horizontal"
          thinkness={3}
        />
        <Star color="black" size={64} />
        <Line
          color="black"
          size={514}
          direction="horizontal"
          thinkness={3}
        />
      </div>
    </section>
  );
}