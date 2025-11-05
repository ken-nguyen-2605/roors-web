"use client";

import { useState } from 'react';
import { Calendar, Clock, Users, MapPin, Phone, Mail, CheckCircle, XCircle, Edit2 } from 'lucide-react';

interface Reservation {
  id: number;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  date: Date;
  time: string;
  partySize: number;
  tableNumber: string;
  status: 'Pending' | 'Seated' | 'Completed' | 'Cancelled';
  specialRequests?: string;
}

export default function ReservationsSection() {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [filterStatus, setFilterStatus] = useState<string>('All');
  const [selectedReservation, setSelectedReservation] = useState<Reservation | null>(null);

  const [reservations, setReservations] = useState<Reservation[]>([
    {
      id: 1,
      customerName: 'Anderson Family',
      customerEmail: 'anderson@email.com',
      customerPhone: '+1-555-0201',
      date: new Date(),
      time: '12:30 PM',
      partySize: 4,
      tableNumber: 'T-12',
      status: 'Pending',
      specialRequests: 'Window seat preferred'
    },
    {
      id: 2,
      customerName: 'Business Meeting',
      customerEmail: 'corporate@company.com',
      customerPhone: '+1-555-0202',
      date: new Date(),
      time: '1:00 PM',
      partySize: 6,
      tableNumber: 'T-8',
      status: 'Pending',
      specialRequests: 'Need privacy, quiet area'
    },
    {
      id: 3,
      customerName: 'Wilson Party',
      customerEmail: 'wilson@email.com',
      customerPhone: '+1-555-0203',
      date: new Date(),
      time: '2:30 PM',
      partySize: 2,
      tableNumber: 'T-5',
      status: 'Pending'
    },
    {
      id: 4,
      customerName: 'Davis Celebration',
      customerEmail: 'davis@email.com',
      customerPhone: '+1-555-0204',
      date: new Date(Date.now() + 86400000),
      time: '7:00 PM',
      partySize: 8,
      tableNumber: 'T-20',
      status: 'Pending',
      specialRequests: 'Birthday celebration, need cake service'
    }
  ]);

  const statuses = ['All', 'Pending', 'Seated', 'Completed', 'Cancelled'];

  const todaysReservations = reservations.filter(r => 
    r.date.toDateString() === selectedDate.toDateString() &&
    (filterStatus === 'All' || r.status === filterStatus)
  );

  const upcomingReservations = reservations
    .filter(r => r.date >= new Date() && r.status !== 'Completed' && r.status !== 'Cancelled')
    .sort((a, b) => a.date.getTime() - b.date.getTime())
    .slice(0, 5);

  const handleStatusChange = (id: number, newStatus: Reservation['status']) => {
    setReservations(reservations.map(r => 
      r.id === id ? { ...r, status: newStatus } : r
    ));
  };

  const getStatusColor = (status: Reservation['status']) => {
    switch (status) {
      case 'Pending': return 'bg-yellow-100 text-yellow-700';
      case 'Seated': return 'bg-blue-100 text-blue-700';
      case 'Completed': return 'bg-gray-100 text-gray-700';
      case 'Cancelled': return 'bg-red-100 text-red-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <section id="reservations" className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold text-white drop-shadow-lg">Reservations</h2>
          <p className="text-white/80 mt-1">{reservations.length} total reservations</p>
        </div>
        <button className="px-6 py-3 rounded-xl bg-gradient-to-r from-orange-500 to-red-500 text-white font-medium shadow-lg hover:shadow-xl transition-all hover:scale-105">
          New Reservation
        </button>
      </div>

      {/* Status Filter */}
      <div className="flex flex-wrap gap-2">
        {statuses.map((status) => (
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
            {status !== 'All' && (
              <span className="ml-2 text-xs">
                ({reservations.filter(r => r.status === status).length})
              </span>
            )}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Calendar View */}
        <div className="lg:col-span-2 rounded-2xl border-2 border-white/20 bg-white shadow-xl p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-bold flex items-center gap-2">
              <Calendar className="w-5 h-5 text-orange-500" />
              {selectedDate.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
            </h3>
            <input
              type="date"
              value={selectedDate.toISOString().split('T')[0]}
              onChange={(e) => setSelectedDate(new Date(e.target.value))}
              className="px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
          </div>

          {/* Timeline View */}
          <div className="space-y-3">
            {todaysReservations.length === 0 ? (
              <div className="text-center py-12 text-gray-500">
                <Calendar className="w-12 h-12 mx-auto mb-3 text-gray-400" />
                <p>No reservations for this date</p>
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
                      <h4 className="font-bold text-gray-900 truncate">{reservation.customerName}</h4>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(reservation.status)}`}>
                        {reservation.status}
                      </span>
                    </div>
                    <div className="flex items-center gap-4 text-sm text-gray-600">
                      <span className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        {reservation.time}
                      </span>
                      <span className="flex items-center gap-1">
                        <MapPin className="w-4 h-4" />
                        Table {reservation.tableNumber}
                      </span>
                      <span className="flex items-center gap-1">
                        <Phone className="w-4 h-4" />
                        {reservation.customerPhone}
                      </span>
                    </div>
                    {reservation.specialRequests && (
                      <div className="text-xs text-orange-600 mt-1 truncate">
                        ⚠ {reservation.specialRequests}
                      </div>
                    )}
                  </div>

                  <div className="flex-shrink-0 flex gap-2">
                    {reservation.status === 'Pending' && (
                      <>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleStatusChange(reservation.id, 'Seated');
                          }}
                          className="p-2 rounded-lg bg-green-50 text-green-600 hover:bg-green-100 transition-colors"
                          title="Mark as Seated"
                        >
                          <CheckCircle className="w-5 h-5" />
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleStatusChange(reservation.id, 'Cancelled');
                          }}
                          className="p-2 rounded-lg bg-red-50 text-red-600 hover:bg-red-100 transition-colors"
                          title="Cancel"
                        >
                          <XCircle className="w-5 h-5" />
                        </button>
                      </>
                    )}
                    {reservation.status === 'Seated' && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleStatusChange(reservation.id, 'Completed');
                        }}
                        className="p-2 rounded-lg bg-blue-50 text-blue-600 hover:bg-blue-100 transition-colors"
                        title="Complete"
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
            {upcomingReservations.map((reservation) => (
              <div
                key={reservation.id}
                className="p-3 rounded-lg border-2 border-gray-100 hover:border-orange-200 transition-all cursor-pointer"
                onClick={() => setSelectedReservation(reservation)}
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="font-semibold text-sm text-gray-900 truncate pr-2">
                    {reservation.customerName}
                  </div>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium flex-shrink-0 ${getStatusColor(reservation.status)}`}>
                    {reservation.status}
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
            ))}
          </div>
        </div>
      </div>

      {/* Reservation Detail Modal */}
      {selectedReservation && (
        <ReservationDetailModal
          reservation={selectedReservation}
          onClose={() => setSelectedReservation(null)}
          onStatusChange={handleStatusChange}
        />
      )}
    </section>
  );
}

function ReservationDetailModal({
  reservation,
  onClose,
  onStatusChange
}: {
  reservation: Reservation;
  onClose: () => void;
  onStatusChange: (id: number, status: Reservation['status']) => void;
}) {
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
                <span className="font-medium">{reservation.customerEmail}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600 flex items-center gap-1">
                  <Phone className="w-4 h-4" />
                  Phone:
                </span>
                <span className="font-medium">{reservation.customerPhone}</span>
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
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                  reservation.status === 'Pending' ? 'bg-yellow-100 text-yellow-700' :
                  reservation.status === 'Seated' ? 'bg-blue-100 text-blue-700' :
                  reservation.status === 'Completed' ? 'bg-gray-100 text-gray-700' :
                  'bg-red-100 text-red-700'
                }`}>
                  {reservation.status}
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
              {['Seated', 'Completed', 'Cancelled'].map((status) => (
                <button
                  key={status}
                  onClick={() => {
                    onStatusChange(reservation.id, status as Reservation['status']);
                    onClose();
                  }}
                  disabled={reservation.status === status}
                  className={`px-4 py-3 rounded-lg font-medium transition-all ${
                    reservation.status === status
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