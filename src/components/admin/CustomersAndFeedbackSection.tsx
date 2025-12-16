"use client";

import { useState, useEffect } from 'react';
import { Star, MessageSquare, Utensils, Loader2 } from 'lucide-react';
import orderService from '@/services/orderService';

interface OrderFeedback {
  id: number;
  orderNumber: string;
  customerName: string;
  rating: number;
  feedback: string;
  ratedAt: string;
  adminResponse?: string;
  respondedAt?: string;
}

interface DishFeedback {
  id: number;
  orderId: number;
  orderNumber: string;
  customerName: string;
  dishName: string;
  dishRating: number;
  dishFeedback: string;
  dishRatedAt: string;
  adminDishResponse?: string;
  dishRespondedAt?: string;
}

export default function CustomersAndFeedbackSection() {
  const [selectedFeedback, setSelectedFeedback] = useState<OrderFeedback | null>(null);
  const [selectedDishFeedback, setSelectedDishFeedback] = useState<DishFeedback | null>(null);
  const [orderFeedback, setOrderFeedback] = useState<OrderFeedback[]>([]);
  const [dishFeedback, setDishFeedback] = useState<DishFeedback[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadFeedback();
  }, []);

  const loadFeedback = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const result = await orderService.getOrdersWithRatings({ page: 0, size: 100 });
      
      if (result.success && result.data) {
        // Process order-level feedback
        const orders: OrderFeedback[] = result.data
          .filter((order: any) => order.rating != null)
          .map((order: any) => ({
            id: order.id,
            orderNumber: order.orderNumber,
            customerName: order.customerName,
            rating: order.rating,
            feedback: order.feedback || '',
            ratedAt: order.ratedAt,
            adminResponse: order.adminResponse,
            respondedAt: order.respondedAt,
          }));

        // Process dish-level feedback
        const dishes: DishFeedback[] = [];
        result.data.forEach((order: any) => {
          order.items?.forEach((item: any) => {
            if (item.dishRating != null) {
              dishes.push({
                id: item.id,
                orderId: order.id,
                orderNumber: order.orderNumber,
                customerName: order.customerName,
                dishName: item.menuItemName,
                dishRating: item.dishRating,
                dishFeedback: item.dishFeedback || '',
                dishRatedAt: item.dishRatedAt,
                adminDishResponse: item.adminDishResponse,
                dishRespondedAt: item.dishRespondedAt,
              });
            }
          });
        });

        setOrderFeedback(orders);
        setDishFeedback(dishes);
      } else {
        setError(result.message || 'Failed to load feedback');
      }
    } catch (err) {
      setError('An error occurred while loading feedback');
      console.error('Error loading feedback:', err);
    } finally {
      setLoading(false);
    }
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`w-4 h-4 ${i < rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`}
      />
    ));
  };

  const getTimeSince = (dateString: string) => {
    const date = new Date(dateString);
    const days = Math.floor((Date.now() - date.getTime()) / 86400000);
    if (days === 0) return 'Today';
    if (days === 1) return 'Yesterday';
    if (days < 7) return `${days} days ago`;
    if (days < 30) return `${Math.floor(days / 7)} weeks ago`;
    return `${Math.floor(days / 30)} months ago`;
  };

  const avgOrderRating = orderFeedback.length > 0
    ? orderFeedback.reduce((sum, f) => sum + f.rating, 0) / orderFeedback.length
    : 0;
    
  const avgDishRating = dishFeedback.length > 0
    ? dishFeedback.reduce((sum, f) => sum + f.dishRating, 0) / dishFeedback.length
    : 0;

  if (loading) {
    return (
      <section id="customers" className="space-y-6">
        <h2 className="text-3xl font-bold text-white drop-shadow-lg">Customers & Feedback</h2>
        <div className="flex items-center justify-center py-20">
          <Loader2 className="w-8 h-8 animate-spin text-orange-500" />
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section id="customers" className="space-y-6">
        <h2 className="text-3xl font-bold text-white drop-shadow-lg">Customers & Feedback</h2>
        <div className="rounded-2xl border-2 border-white/20 bg-white shadow-xl p-6">
          <p className="text-red-600">{error}</p>
          <button
            onClick={loadFeedback}
            className="mt-4 px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600"
          >
            Retry
          </button>
        </div>
      </section>
    );
  }

  return (
    <section id="customers" className="space-y-6">
      <h2 className="text-3xl font-bold text-white drop-shadow-lg">Customers & Feedback</h2>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Order Feedback */}
        <div className="rounded-2xl border-2 border-white/20 bg-white shadow-xl p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold flex items-center gap-2">
              <MessageSquare className="w-5 h-5 text-orange-500" />
              Order Feedback ({orderFeedback.length})
            </h3>
            <div className="flex items-center gap-1 bg-orange-50 px-3 py-1 rounded-full">
              <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
              <span className="text-sm font-bold text-gray-700">
                {avgOrderRating > 0 ? avgOrderRating.toFixed(1) : 'N/A'}
              </span>
            </div>
          </div>
          <div className="space-y-3 max-h-[600px] overflow-y-auto">
            {orderFeedback.length === 0 ? (
              <p className="text-gray-500 text-center py-8">No order feedback yet</p>
            ) : (
              orderFeedback.map((item) => (
                <div
                  key={item.id}
                  className="p-4 rounded-xl bg-gradient-to-r from-gray-50 to-white border-2 border-gray-100 hover:border-orange-200 transition-all cursor-pointer"
                  onClick={() => setSelectedFeedback(item)}
                >
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-semibold text-gray-900">{item.customerName}</span>
                        <span className="text-xs text-orange-600 font-medium bg-orange-50 px-2 py-0.5 rounded">
                          {item.orderNumber}
                        </span>
                      </div>
                      <div className="flex items-center gap-1 mb-2">
                        {renderStars(item.rating)}
                        <span className="text-xs text-gray-500 ml-1">{getTimeSince(item.ratedAt)}</span>
                      </div>
                    </div>
                  </div>
                  
                  <p className="text-sm text-gray-700 line-clamp-2 mb-2">{item.feedback}</p>
                  
                  {item.adminResponse ? (
                    <div className="bg-orange-50 rounded-lg p-2 text-xs">
                      <div className="font-medium text-orange-700 mb-1">Your Response:</div>
                      <div className="text-gray-600 line-clamp-1">{item.adminResponse}</div>
                    </div>
                  ) : (
                    <button className="text-xs text-orange-600 font-medium hover:underline">
                      Respond to feedback →
                    </button>
                  )}
                </div>
              ))
            )}
          </div>
        </div>

        {/* Dish-Specific Feedback */}
        <div className="rounded-2xl border-2 border-white/20 bg-white shadow-xl p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold flex items-center gap-2">
              <Utensils className="w-5 h-5 text-orange-500" />
              Dish Feedback ({dishFeedback.length})
            </h3>
            <div className="flex items-center gap-1 bg-orange-50 px-3 py-1 rounded-full">
              <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
              <span className="text-sm font-bold text-gray-700">
                {avgDishRating > 0 ? avgDishRating.toFixed(1) : 'N/A'}
              </span>
            </div>
          </div>
          <div className="space-y-3 max-h-[600px] overflow-y-auto">
            {dishFeedback.length === 0 ? (
              <p className="text-gray-500 text-center py-8">No dish feedback yet</p>
            ) : (
              dishFeedback.map((item) => (
                <div
                  key={item.id}
                  className="p-4 rounded-xl bg-gradient-to-r from-gray-50 to-white border-2 border-gray-100 hover:border-orange-200 transition-all cursor-pointer"
                  onClick={() => setSelectedDishFeedback(item)}
                >
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-semibold text-gray-900">{item.customerName}</span>
                        <span className="text-xs text-orange-600 font-medium bg-orange-50 px-2 py-0.5 rounded">
                          {item.orderNumber}
                        </span>
                      </div>
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <Utensils className="w-3 h-3 text-orange-500" />
                          <span className="text-sm font-medium text-orange-600">{item.dishName}</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-1 mb-2">
                        {renderStars(item.dishRating)}
                        <span className="text-xs text-gray-500 ml-1">{getTimeSince(item.dishRatedAt)}</span>
                      </div>
                    </div>
                  </div>
                  
                  <p className="text-sm text-gray-700 line-clamp-2 mb-2">{item.dishFeedback}</p>
                  
                  {item.adminDishResponse ? (
                    <div className="bg-orange-50 rounded-lg p-2 text-xs">
                      <div className="font-medium text-orange-700 mb-1">Your Response:</div>
                      <div className="text-gray-600 line-clamp-1">{item.adminDishResponse}</div>
                    </div>
                  ) : (
                    <button className="text-xs text-orange-600 font-medium hover:underline">
                      Respond to feedback →
                    </button>
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Order Feedback Detail Modal */}
      {selectedFeedback && (
        <FeedbackDetailModal
          feedback={selectedFeedback}
          onClose={() => setSelectedFeedback(null)}
          onResponseSubmit={loadFeedback}
        />
      )}

      {/* Dish Feedback Detail Modal */}
      {selectedDishFeedback && (
        <DishFeedbackDetailModal
          feedback={selectedDishFeedback}
          onClose={() => setSelectedDishFeedback(null)}
          onResponseSubmit={loadFeedback}
        />
      )}
    </section>
  );
}

function FeedbackDetailModal({ 
  feedback, 
  onClose, 
  onResponseSubmit 
}: { 
  feedback: OrderFeedback; 
  onClose: () => void;
  onResponseSubmit: () => void;
}) {
  const [response, setResponse] = useState(feedback.adminResponse || '');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async () => {
    setSubmitting(true);
    try {
      const result = await orderService.respondToOrderFeedback(feedback.id, response);
      if (result.success) {
        alert('Response submitted successfully!');
        onResponseSubmit();
        onClose();
      } else {
        alert(result.message || 'Failed to submit response');
      }
    } catch (error) {
      alert('An error occurred while submitting response');
    } finally {
      setSubmitting(false);
    }
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`w-5 h-5 ${i < rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`}
      />
    ));
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-gradient-to-r from-orange-500 to-red-500 text-white px-6 py-4 flex items-center justify-between">
          <h3 className="text-xl font-bold">Order Feedback</h3>
          <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-lg transition-colors">
            ✕
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Feedback Info */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <div>
                <div className="font-bold text-lg text-gray-900">{feedback.customerName}</div>
                <div className="text-sm text-orange-600 font-medium">Order {feedback.orderNumber}</div>
              </div>
              <div className="text-sm text-gray-500">
                {new Date(feedback.ratedAt).toLocaleDateString('en-US', { 
                  month: 'short', 
                  day: 'numeric', 
                  year: 'numeric' 
                })}
              </div>
            </div>

            <div className="flex items-center gap-2 mb-4">
              {renderStars(feedback.rating)}
              <span className="text-sm font-medium text-gray-600">({feedback.rating}/5)</span>
            </div>

            <div className="bg-gray-50 rounded-lg p-4">
              <p className="text-gray-700">{feedback.feedback}</p>
            </div>
          </div>

          {/* Response Section */}
          <div>
            <h4 className="font-semibold text-gray-900 mb-3">Your Response</h4>
            <textarea
              value={response}
              onChange={(e) => setResponse(e.target.value)}
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-orange-500"
              rows={4}
              placeholder="Write your response to the customer..."
              disabled={submitting}
            />
            <button 
              onClick={handleSubmit}
              disabled={submitting || !response.trim()}
              className="mt-3 w-full px-4 py-3 rounded-xl bg-gradient-to-r from-orange-500 to-red-500 text-white font-medium hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {submitting && <Loader2 className="w-4 h-4 animate-spin" />}
              {feedback.adminResponse ? 'Update Response' : 'Send Response'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function DishFeedbackDetailModal({ 
  feedback, 
  onClose,
  onResponseSubmit 
}: { 
  feedback: DishFeedback; 
  onClose: () => void;
  onResponseSubmit: () => void;
}) {
  const [response, setResponse] = useState(feedback.adminDishResponse || '');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async () => {
    setSubmitting(true);
    try {
      const result = await orderService.respondToDishFeedback(feedback.orderId, feedback.id, response);
      if (result.success) {
        alert('Response submitted successfully!');
        onResponseSubmit();
        onClose();
      } else {
        alert(result.message || 'Failed to submit response');
      }
    } catch (error) {
      alert('An error occurred while submitting response');
    } finally {
      setSubmitting(false);
    }
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`w-5 h-5 ${i < rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`}
      />
    ));
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-gradient-to-r from-orange-500 to-red-500 text-white px-6 py-4 flex items-center justify-between">
          <h3 className="text-xl font-bold">Dish Feedback</h3>
          <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-lg transition-colors">
            ✕
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Feedback Info */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <div>
                <div className="font-bold text-lg text-gray-900">{feedback.customerName}</div>
                <div className="text-sm text-orange-600 font-medium">Order {feedback.orderNumber}</div>
              </div>
              <div className="text-sm text-gray-500">
                {new Date(feedback.dishRatedAt).toLocaleDateString('en-US', { 
                  month: 'short', 
                  day: 'numeric', 
                  year: 'numeric' 
                })}
              </div>
            </div>

            {/* Dish Name */}
            <div className="bg-orange-50 rounded-lg p-3 mb-4 flex items-center gap-2">
              <Utensils className="w-5 h-5 text-orange-600" />
              <span className="font-semibold text-orange-900">{feedback.dishName}</span>
            </div>

            <div className="flex items-center gap-2 mb-4">
              {renderStars(feedback.dishRating)}
              <span className="text-sm font-medium text-gray-600">({feedback.dishRating}/5)</span>
            </div>

            <div className="bg-gray-50 rounded-lg p-4">
              <p className="text-gray-700">{feedback.dishFeedback}</p>
            </div>
          </div>

          {/* Response Section */}
          <div>
            <h4 className="font-semibold text-gray-900 mb-3">Your Response</h4>
            <textarea
              value={response}
              onChange={(e) => setResponse(e.target.value)}
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-orange-500"
              rows={4}
              placeholder="Write your response to the customer..."
              disabled={submitting}
            />
            <button 
              onClick={handleSubmit}
              disabled={submitting || !response.trim()}
              className="mt-3 w-full px-4 py-3 rounded-xl bg-gradient-to-r from-orange-500 to-red-500 text-white font-medium hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {submitting && <Loader2 className="w-4 h-4 animate-spin" />}
              {feedback.adminDishResponse ? 'Update Response' : 'Send Response'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}