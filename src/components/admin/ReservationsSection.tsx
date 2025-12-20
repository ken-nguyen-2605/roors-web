"use client";

import { useEffect, useMemo, useState } from 'react';
import { Calendar, Clock, Users, MapPin, Phone, Mail, CheckCircle, XCircle, Edit2, RefreshCw } from 'lucide-react';

import reservationService from '@/services/reservationService';

type ReservationStatus ='CONFIRMED' | 'ARRIVED' | 'COMPLETED' | 'CANCELLED' | 'NO_SHOW';
type FilterStatus = 'All' | ReservationStatus;

interface Reservation {
  id: number;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  date: Date;
  time: string;
  partySize: number;
  tableNumber: string;
  status: ReservationStatus;
  specialRequests?: string;
}

const STATUS_META: Record<ReservationStatus, { label: string; badgeClass: string }> = {
  CONFIRMED: { label: 'Confirmed', badgeClass: 'bg-blue-100 text-blue-700' },
  ARRIVED: { label: 'Arrived', badgeClass: 'bg-indigo-100 text-indigo-700' },
  COMPLETED: { label: 'Completed', badgeClass: 'bg-gray-100 text-gray-700' },
  CANCELLED: { label: 'Cancelled', badgeClass: 'bg-red-100 text-red-700' },
  NO_SHOW: { label: 'No Show', badgeClass: 'bg-rose-100 text-rose-700' },
};

const getStatusLabel = (status: ReservationStatus) =>
  STATUS_META[status]?.label ?? status.replace('_', ' ');

const getStatusColor = (status: ReservationStatus) =>
  STATUS_META[status]?.badgeClass ?? 'bg-gray-100 text-gray-700';

const formatTimeLabel = (date: Date) =>
  date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });

const formatTimeRange = (start: Date, end?: Date | null) => {
  if (end && !Number.isNaN(end.getTime())) {
    return `${formatTimeLabel(start)} – ${formatTimeLabel(end)}`;
  }
  return formatTimeLabel(start);
};

const normalizeReservation = (data: any): Reservation => {
  const start = data?.startTime ? new Date(data.startTime) : new Date();
  const end = data?.endTime ? new Date(data.endTime) : null;

  return {
    id: data?.id ?? Date.now(),
    customerName: data?.user?.username ?? 'Guest',
    customerEmail: data?.user?.email ?? 'Not provided',
    customerPhone: data?.phone ?? 'Not provided',
    date: start,
    time: formatTimeRange(start, end),
    partySize: data?.numberOfGuests ?? 0,
    tableNumber: data?.diningTable?.name
      ? `${data.diningTable.name}${data.diningTable.floor ? ` • ${data.diningTable.floor}` : ''}`
      : data?.diningTable?.id
        ? `Table ${data.diningTable.id}`
        : 'Unassigned',
    status: (data?.status ?? 'PENDING') as ReservationStatus,
    specialRequests: data?.specialRequests ?? '',
  };
};

export default function ReservationsSection() {
  const [selectedDate, setSelectedDate] = useState<Date | null>(new Date());
  const [filterStatus, setFilterStatus] = useState<FilterStatus>('All');
  const [selectedReservation, setSelectedReservation] = useState<Reservation | null>(null);
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [actionLoadingId, setActionLoadingId] = useState<number | null>(null);
  const [showCancelModal, setShowCancelModal] = useState<Reservation | null>(null);

  const statusFilters: FilterStatus[] = ['All', 'CONFIRMED', 'ARRIVED', 'COMPLETED', 'CANCELLED', 'NO_SHOW'];

  const statusCounts = useMemo(
    () =>
      reservations.reduce<Record<ReservationStatus, number>>((acc, reservation) => {
        acc[reservation.status] = (acc[reservation.status] ?? 0) + 1;
        return acc;
      }, {} as Record<ReservationStatus, number>),
    [reservations]
  );

  useEffect(() => {
    let cancelled = false;

    const loadReservations = async () => {
      setLoading(true);
      setError(null);

      try {
        const response = await reservationService.getAllReservations();
        if (!response.success) {
          throw new Error(response.message || 'Failed to fetch reservations');
        }

        const normalized = Array.isArray(response.data)
          ? response.data.map((item: any) => normalizeReservation(item))
          : [];

        if (!cancelled) {
          setReservations(normalized);
        }
      } catch (err) {
        if (!cancelled) {
          const message = err instanceof Error ? err.message : 'Failed to load reservations';
          setError(message);
          setReservations([]);
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    loadReservations();

    return () => {
      cancelled = true;
    };
  }, []);

  const refreshReservations = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await reservationService.getAllReservations();
      if (!response.success) {
        throw new Error(response.message || 'Failed to fetch reservations');
      }
      const normalized = Array.isArray(response.data)
        ? response.data.map((item: any) => normalizeReservation(item))
        : [];
      setReservations(normalized);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to load reservations';
      setError(message);
      setReservations([]);
    } finally {
      setLoading(false);
    }
  };

  const todaysReservations = useMemo(
    () =>
      reservations.filter((reservation) => {
        // If selectedDate is null, show all reservations (no date filter)
        const matchesDate = selectedDate === null || reservation.date.toDateString() === selectedDate.toDateString();
        const matchesStatus = filterStatus === 'All' || reservation.status === filterStatus;
        return matchesDate && matchesStatus;
      }),
    [reservations, selectedDate, filterStatus]
  );

  const upcomingReservations = useMemo(
    () =>
      reservations
        .filter(
          (reservation) =>
            reservation.date >= new Date() &&
            !['COMPLETED', 'CANCELLED', 'NO_SHOW'].includes(reservation.status)
        )
        .sort((a, b) => a.date.getTime() - b.date.getTime())
        .slice(0, 5),
    [reservations]
  );

  const handleStatusChange = async (reservation: Reservation, nextStatus: ReservationStatus) => {
    setError(null);
    setActionLoadingId(reservation.id);
    try {
      let updatedReservation: Reservation | null = null;

      if (nextStatus === 'ARRIVED') {
        const response = await reservationService.markReservationAsArrived(reservation.id);
        if (!response.success) {
          throw new Error(response.message || 'Failed to mark reservation as arrived');
        }
        updatedReservation = normalizeReservation(response.data);
      } else if (nextStatus === 'CANCELLED') {
        const response = await reservationService.cancelReservation(reservation.id);
        if (!response.success) {
          throw new Error(response.message || 'Failed to cancel reservation');
        }
        updatedReservation = normalizeReservation(response.data);
      } else if (nextStatus === 'NO_SHOW') {
        // If your API has a specific endpoint for NO_SHOW, use it here
        // Otherwise, you might need to use a generic update endpoint
        const response = await reservationService.markReservationAsNoShow(reservation.id);
        if (!response.success) {
          throw new Error(response.message || 'Failed to mark as no show');
        }
        updatedReservation = { ...normalizeReservation(response.data), status: 'NO_SHOW' };
      } else {
        updatedReservation = { ...reservation, status: nextStatus };
      }

      setReservations((prev) =>
        prev.map((item) => (item.id === reservation.id && updatedReservation ? updatedReservation : item))
      );
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to update reservation status';
      setError(message);
    } finally {
      setActionLoadingId(null);
    }
  };

  const handleCancelClick = (reservation: Reservation) => {
    setShowCancelModal(reservation);
  };

  const handleCancelConfirm = async (reservation: Reservation, status: 'CANCELLED' | 'NO_SHOW') => {
    await handleStatusChange(reservation, status);
    setShowCancelModal(null);
  };

  return (
    <section id="reservations" className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold text-white drop-shadow-lg">Reservations</h2>
          <p className="text-white/80 mt-1">
            {loading ? 'Loading reservations...' : `${reservations.length} total reservations`}
          </p>
          {error && (
            <p className="text-sm text-red-200 mt-2">
              {error}
            </p>
          )}
        </div>
        <div className="flex flex-col sm:flex-row gap-3">
          {/* <button className="px-6 py-3 rounded-xl bg-gradient-to-r from-orange-500 to-red-500 text-white font-medium shadow-lg hover:shadow-xl transition-all hover:scale-105">
            New Reservation
          </button> */}
          <button
            onClick={refreshReservations}
            disabled={loading}
            className="px-4 py-3 rounded-xl border border-white/40 text-white/90 flex items-center justify-center gap-2 hover:bg-white/10 transition disabled:opacity-60 disabled:cursor-not-allowed"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </button>
        </div>
      </div>

      {/* Status Filter */}
      <div className="flex flex-wrap gap-2">
        {statusFilters.map((statusKey) => {
          const isAll = statusKey === 'All';
          const label = isAll ? 'All' : getStatusLabel(statusKey as ReservationStatus);
          const count = isAll ? reservations.length : statusCounts[statusKey as ReservationStatus] ?? 0;
          return (
          <button
              key={statusKey}
              onClick={() => setFilterStatus(statusKey)}
            className={`px-4 py-2 rounded-xl font-medium text-sm transition-all ${
                filterStatus === statusKey
                ? 'bg-gradient-to-r from-orange-500 to-red-500 text-white shadow-lg'
                : 'bg-white text-gray-700 hover:bg-gray-50 shadow'
            }`}
          >
              {label}
              {!isAll && (
                <span className="ml-2 text-xs">
                  ({count})
                </span>
              )}
            </button>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Calendar View */}
        <div className="lg:col-span-2 rounded-2xl border-2 border-white/20 bg-white shadow-xl p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-bold flex items-center gap-2">
              <Calendar className="w-5 h-5 text-orange-500" />
              {selectedDate 
                ? selectedDate.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })
                : 'All Dates'}
            </h3>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setSelectedDate(null)}
                className={`px-4 py-2 rounded-lg font-medium text-sm transition-all ${
                  selectedDate === null
                    ? 'bg-gradient-to-r from-orange-500 to-red-500 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                All Dates
              </button>
              <input
                type="date"
                value={selectedDate ? selectedDate.toISOString().split('T')[0] : ''}
                onChange={(e) => setSelectedDate(e.target.value ? new Date(e.target.value) : null)}
                className="px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
            </div>
          </div>

          {/* Timeline View */}
          <div className="space-y-3">
            {loading ? (
              <div className="text-center py-12 text-gray-500">
                <Clock className="w-12 h-12 mx-auto mb-3 text-gray-400 animate-spin" />
                <p>Loading reservations...</p>
              </div>
            ) : todaysReservations.length === 0 ? (
              <div className="text-center py-12 text-gray-500">
                <Calendar className="w-12 h-12 mx-auto mb-3 text-gray-400" />
                <p>No reservations found</p>
              </div>
            ) : (
              todaysReservations.map((reservation) => (
                <div
                  key={reservation.id}
                  className="flex items-center gap-4 p-4 rounded-xl bg-gradient-to-r from-gray-50 to-white border-2 border-gray-100 hover:border-orange-200 transition-all cursor-pointer"
                  onClick={() => setSelectedReservation(reservation)}
                >
                  <div className="flex-shrink-0">
                    <div className="w-16 h-16 rounded-full bg-gradient-to-br from-orange-500 to-red-500 flex flex-col items-center justify-center text-white shadow-lg">
                      <div className="text-xs font-medium">PARTY</div>
                      <div className="text-2xl font-bold">{reservation.partySize}</div>
                    </div>
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="font-bold text-gray-900 truncate">{reservation.id}</h4>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(reservation.status)}`}>
                        {getStatusLabel(reservation.status)}
                      </span>
                    </div>
                    <div className="flex items-center gap-4 text-sm text-gray-600">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        {reservation.date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        {reservation.time}
                      </span>
                      <span className="flex items-center gap-1">
                        <MapPin className="w-4 h-4" />
                        {reservation.tableNumber}
                      </span>
                      <span className="flex items-center gap-1">
                        <Phone className="w-4 h-4" />
                        {reservation.customerPhone}
                      </span>
                    </div>
                    {reservation.specialRequests && (
                      <div className="text-xs text-orange-600 mt-1 truncate flex items-center gap-1">
                        <Edit2 className="w-3 h-3" />
                        {reservation.specialRequests}
                      </div>
                    )}
                  </div>

                  <div className="flex-shrink-0 flex gap-2">
                    {['CONFIRMED'].includes(reservation.status) && (
                      <>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleStatusChange(reservation, 'ARRIVED');
                          }}
                          disabled={actionLoadingId === reservation.id}
                          className="p-2 rounded-lg bg-green-50 text-green-600 hover:bg-green-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                          title="Mark as Arrived"
                        >
                          <CheckCircle className="w-5 h-5" />
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleCancelClick(reservation);
                          }}
                          disabled={actionLoadingId === reservation.id}
                          className="p-2 rounded-lg bg-red-50 text-red-600 hover:bg-red-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                          title="Cancel or No Show"
                        >
                          <XCircle className="w-5 h-5" />
                        </button>
                      </>
                    )}
                    {reservation.status === 'ARRIVED' && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleStatusChange(reservation, 'COMPLETED');
                        }}
                        disabled={actionLoadingId === reservation.id}
                        className="p-2 rounded-lg bg-blue-50 text-blue-600 hover:bg-blue-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        title="Mark as Completed"
                      >
                        <CheckCircle className="w-5 h-5" />
                      </button>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Upcoming Reservations Sidebar */}
        <div className="rounded-2xl border-2 border-white/20 bg-white shadow-xl p-6">
          <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
            <Clock className="w-5 h-5 text-orange-500" />
            Upcoming
          </h3>
          <div className="space-y-3">
            {loading ? (
              <p className="text-sm text-gray-500">Loading upcoming reservations...</p>
            ) : upcomingReservations.length === 0 ? (
              <p className="text-sm text-gray-500">No upcoming reservations.</p>
            ) : (
              upcomingReservations.map((reservation) => (
                <div
                  key={reservation.id}
                  className="p-3 rounded-lg border-2 border-gray-100 hover:border-orange-200 transition-all cursor-pointer"
                  onClick={() => setSelectedReservation(reservation)}
                >
                  <div className="flex items-start justify-between mb-2">
                    <div className="font-semibold text-sm text-gray-900 truncate pr-2">
                      {reservation.id}
                    </div>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium flex-shrink-0 ${getStatusColor(reservation.status)}`}>
                      {getStatusLabel(reservation.status)}
                    </span>
                  </div>
                  <div className="space-y-1 text-xs text-gray-600">
                    <div className="flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      {reservation.date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {reservation.time}
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="flex items-center gap-1">
                        <Users className="w-3 h-3" />
                        Party of {reservation.partySize}
                      </span>
                      <span className="flex items-center gap-1">
                        <MapPin className="w-3 h-3" />
                        {reservation.tableNumber}
                      </span>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Cancel/No Show Modal */}
      {showCancelModal && (
        <CancelReservationModal
          reservation={showCancelModal}
          onClose={() => setShowCancelModal(null)}
          onConfirm={handleCancelConfirm}
          loading={actionLoadingId === showCancelModal.id}
        />
      )}

      {/* Reservation Detail Modal */}
      {selectedReservation && (
        <ReservationDetailModal
          reservation={selectedReservation}
          onClose={() => setSelectedReservation(null)}
          onStatusChange={handleStatusChange}
          onCancelClick={handleCancelClick}
          actionLoadingId={actionLoadingId}
        />
      )}
    </section>
  );
}

function CancelReservationModal({
  reservation,
  onClose,
  onConfirm,
  loading,
}: {
  reservation: Reservation;
  onClose: () => void;
  onConfirm: (reservation: Reservation, status: 'CANCELLED' | 'NO_SHOW') => Promise<void>;
  loading: boolean;
}) {
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full">
        <div className="bg-gradient-to-r from-red-500 to-rose-500 text-white px-6 py-4 rounded-t-2xl">
          <h3 className="text-xl font-bold">Cancel Reservation</h3>
        </div>

        <div className="p-6 space-y-4">
          <p className="text-gray-700">
            Please select the cancellation reason for <span className="font-bold">{reservation.customerName}</span>'s reservation:
          </p>

          <div className="bg-gray-50 rounded-lg p-4 space-y-2 text-sm text-gray-600">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              <span>{reservation.date.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4" />
              <span>{reservation.time}</span>
            </div>
            <div className="flex items-center gap-2">
              <Users className="w-4 h-4" />
              <span>Party of {reservation.partySize}</span>
            </div>
          </div>

          <div className="space-y-3">
            {/* <button
              onClick={() => onConfirm(reservation, 'CANCELLED')}
              disabled={loading}
              className="w-full px-6 py-3 rounded-lg bg-orange-500 text-white font-medium hover:bg-orange-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Processing...' : 'Cancelled by Customer'}
            </button> */}
            <button
              onClick={() => onConfirm(reservation, 'NO_SHOW')}
              disabled={loading}
              className="w-full px-6 py-3 rounded-lg bg-red-500 text-white font-medium hover:bg-red-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Processing...' : 'No Show'}
            </button>
            <button
              onClick={onClose}
              disabled={loading}
              className="w-full px-6 py-3 rounded-lg border-2 border-gray-300 text-gray-700 font-medium hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function ReservationDetailModal({
  reservation,
  onClose,
  onStatusChange,
  onCancelClick,
  actionLoadingId,
}: {
  reservation: Reservation;
  onClose: () => void;
  onStatusChange: (reservation: Reservation, status: ReservationStatus) => Promise<void>;
  onCancelClick: (reservation: Reservation) => void;
  actionLoadingId: number | null;
}) {
  const modalActions: { label: string; value: ReservationStatus; action?: 'cancel' }[] = [
    { label: 'Mark as Arrived', value: 'ARRIVED' },
    { label: 'Mark as Completed', value: 'COMPLETED' },
    { label: 'Cancel / No Show', value: 'CANCELLED', action: 'cancel' },
  ];

  const handleModalAction = async (status: ReservationStatus, action?: 'cancel') => {
    if (action === 'cancel') {
      onCancelClick(reservation);
      onClose();
      return;
    }

    try {
      await onStatusChange(reservation, status);
      onClose();
    } catch {
      // Error state is handled upstream; keep modal open.
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-gradient-to-r from-orange-500 to-red-500 text-white px-6 py-4 flex items-center justify-between">
          <h3 className="text-xl font-bold">Reservation Details</h3>
          <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-lg transition-colors">
            <XCircle className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Customer Information */}
          <div>
            <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
              <Users className="w-5 h-5 text-orange-500" />
              Customer Information
            </h4>
            <div className="bg-gray-50 rounded-lg p-4 space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-600">Name:</span>
                <span className="font-medium">{reservation.customerName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600 flex items-center gap-1">
                  <Mail className="w-4 h-4" />
                  Email:
                </span>
                <span className="font-medium">{reservation.customerEmail || 'Not provided'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600 flex items-center gap-1">
                  <Phone className="w-4 h-4" />
                  Phone:
                </span>
                <span className="font-medium">{reservation.customerPhone || 'Not provided'}</span>
              </div>
            </div>
          </div>

          {/* Reservation Details */}
          <div>
            <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
              <Calendar className="w-5 h-5 text-orange-500" />
              Reservation Details
            </h4>
            <div className="bg-gray-50 rounded-lg p-4 space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-600">Date:</span>
                <span className="font-medium">
                  {reservation.date.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Time:</span>
                <span className="font-medium">{reservation.time}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Party Size:</span>
                <span className="font-medium">{reservation.partySize} guests</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Table:</span>
                <span className="font-medium">{reservation.tableNumber}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Status:</span>
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(reservation.status)}`}>
                  {getStatusLabel(reservation.status)}
                </span>
              </div>
            </div>
          </div>

          {/* Special Requests */}
          {reservation.specialRequests && (
            <div>
              <h4 className="font-semibold text-gray-900 mb-3">Special Requests</h4>
              <div className="bg-orange-50 rounded-lg p-4 text-sm text-gray-700">
                {reservation.specialRequests}
              </div>
            </div>
          )}

          {/* Actions */}
          <div>
            <h4 className="font-semibold text-gray-900 mb-3">Update Status</h4>
            <div className="grid grid-cols-2 gap-3">
              {modalActions.map((action) => (
                <button
                  key={action.value}
                  onClick={() => handleModalAction(action.value, action.action)}
                  disabled={
                    (action.action !== 'cancel' && reservation.status === action.value) ||
                    actionLoadingId === reservation.id
                  }
                  className={`px-4 py-3 rounded-lg font-medium transition-all ${
                    (action.action !== 'cancel' && reservation.status === action.value) ||
                    actionLoadingId === reservation.id
                      ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                      : action.action === 'cancel'
                        ? 'bg-gradient-to-r from-red-500 to-rose-500 text-white hover:shadow-lg'
                        : 'bg-gradient-to-r from-orange-500 to-red-500 text-white hover:shadow-lg'
                  }`}
                >
                  {action.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}