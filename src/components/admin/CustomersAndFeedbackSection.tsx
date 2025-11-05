"use client";

import { useState } from 'react';
import { User, Star, MessageSquare, TrendingUp, Calendar, DollarSign, Phone, Mail, Eye, Utensils } from 'lucide-react';

interface Customer {
  id: number;
  name: string;
  email: string;
  phone: string;
  totalOrders: number;
  totalSpent: number;
  lastOrder: Date;
  status: 'Regular' | 'VIP' | 'New';
  joinedDate: Date;
}

interface Feedback {
  id: number;
  orderId: string;
  customerName: string;
  rating: number;
  comment: string;
  date: Date;
  response?: string;
}

interface DishFeedback {
  id: number;
  orderId: string;
  customerName: string;
  dishName: string;
  dishImage?: string;
  rating: number;
  comment: string;
  date: Date;
  response?: string;
}

export default function CustomersAndFeedbackSection() {
  const [selectedFeedback, setSelectedFeedback] = useState<Feedback | null>(null);
  const [selectedDishFeedback, setSelectedDishFeedback] = useState<DishFeedback | null>(null);

  const [customers] = useState<Customer[]>([
    {
      id: 1,
      name: 'John Doe',
      email: 'john.doe@email.com',
      phone: '+1-555-0123',
      totalOrders: 24,
      totalSpent: 486.50,
      lastOrder: new Date(Date.now() - 2 * 86400000),
      status: 'VIP',
      joinedDate: new Date('2024-01-15')
    },
    {
      id: 2,
      name: 'Sarah Smith',
      email: 'sarah.smith@email.com',
      phone: '+1-555-0124',
      totalOrders: 15,
      totalSpent: 327.80,
      lastOrder: new Date(Date.now() - 5 * 86400000),
      status: 'Regular',
      joinedDate: new Date('2024-03-20')
    },
    {
      id: 3,
      name: 'Mike Johnson',
      email: 'mike.j@email.com',
      phone: '+1-555-0125',
      totalOrders: 3,
      totalSpent: 89.50,
      lastOrder: new Date(Date.now() - 1 * 86400000),
      status: 'New',
      joinedDate: new Date('2025-01-10')
    },
    {
      id: 4,
      name: 'Emma Wilson',
      email: 'emma.w@email.com',
      phone: '+1-555-0126',
      totalOrders: 18,
      totalSpent: 412.30,
      lastOrder: new Date(Date.now() - 7 * 86400000),
      status: 'Regular',
      joinedDate: new Date('2024-05-12')
    }
  ]);

  const [feedback] = useState<Feedback[]>([
    {
      id: 1,
      orderId: '#1045',
      customerName: 'John Doe',
      rating: 5,
      comment: 'Amazing food and excellent service! The burger was cooked to perfection and the atmosphere was wonderful.',
      date: new Date(Date.now() - 1 * 86400000),
      response: 'Thank you so much for your kind words! We look forward to serving you again.'
    },
    {
      id: 2,
      orderId: '#1044',
      customerName: 'Sarah Smith',
      rating: 4,
      comment: 'Great experience overall. Food was delicious but took a bit longer than expected. Still highly recommend!',
      date: new Date(Date.now() - 2 * 86400000)
    },
    {
      id: 3,
      orderId: '#1043',
      customerName: 'Mike Johnson',
      rating: 5,
      comment: 'Best pizza in town! Fresh ingredients and perfect crust. Will definitely order again.',
      date: new Date(Date.now() - 3 * 86400000),
      response: 'We appreciate your feedback! Our chefs take pride in using only the freshest ingredients.'
    },
    {
      id: 4,
      orderId: '#1042',
      customerName: 'Emma Wilson',
      rating: 3,
      comment: 'Food was good but the portion size could be better for the price.',
      date: new Date(Date.now() - 4 * 86400000)
    },
    {
      id: 5,
      orderId: '#1041',
      customerName: 'David Brown',
      rating: 5,
      comment: 'Outstanding service and quality. Everything was perfect from start to finish!',
      date: new Date(Date.now() - 5 * 86400000),
      response: 'Thank you! Your satisfaction is our priority.'
    },
    {
      id: 6,
      orderId: '#1040',
      customerName: 'Lisa Anderson',
      rating: 4,
      comment: 'Very good food and friendly staff. Will come back soon!',
      date: new Date(Date.now() - 6 * 86400000)
    }
  ]);

  const [dishFeedback] = useState<DishFeedback[]>([
    {
      id: 1,
      orderId: '#1045',
      customerName: 'John Doe',
      dishName: 'Classic Beef Burger',
      rating: 5,
      comment: 'The burger was absolutely perfect! Juicy patty, fresh toppings, and the special sauce is incredible.',
      date: new Date(Date.now() - 1 * 86400000),
      response: 'We\'re thrilled you loved our signature burger!'
    },
    {
      id: 2,
      orderId: '#1044',
      customerName: 'Sarah Smith',
      dishName: 'Margherita Pizza',
      rating: 5,
      comment: 'Best pizza I\'ve had! The crust is perfect and the mozzarella is so fresh.',
      date: new Date(Date.now() - 2 * 86400000)
    },
    {
      id: 3,
      orderId: '#1043',
      customerName: 'Mike Johnson',
      dishName: 'Pepperoni Pizza',
      rating: 5,
      comment: 'Love the generous pepperoni and the crispy crust. Perfect balance of flavors.',
      date: new Date(Date.now() - 3 * 86400000),
      response: 'Thank you! We use premium pepperoni and fresh dough daily.'
    },
    {
      id: 4,
      orderId: '#1042',
      customerName: 'Emma Wilson',
      dishName: 'Caesar Salad',
      rating: 3,
      comment: 'Salad was fresh but could use more dressing and the portion was small.',
      date: new Date(Date.now() - 4 * 86400000)
    },
    {
      id: 5,
      orderId: '#1041',
      customerName: 'David Brown',
      dishName: 'BBQ Chicken Wings',
      rating: 5,
      comment: 'These wings are amazing! Perfectly crispy on the outside, tender inside. The BBQ sauce is addictive!',
      date: new Date(Date.now() - 5 * 86400000),
      response: 'Glad you enjoyed our signature wings!'
    },
    {
      id: 6,
      orderId: '#1040',
      customerName: 'Lisa Anderson',
      dishName: 'Spaghetti Carbonara',
      rating: 4,
      comment: 'Creamy and delicious! Would love a bit more bacon though.',
      date: new Date(Date.now() - 6 * 86400000)
    }
  ]);

  const getStatusColor = (status: Customer['status']) => {
    switch (status) {
      case 'VIP': return 'bg-gradient-to-r from-purple-500 to-pink-500 text-white';
      case 'Regular': return 'bg-blue-100 text-blue-700';
      case 'New': return 'bg-green-100 text-green-700';
      default: return 'bg-gray-100 text-gray-700';
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

  const getTimeSince = (date: Date) => {
    const days = Math.floor((Date.now() - date.getTime()) / 86400000);
    if (days === 0) return 'Today';
    if (days === 1) return 'Yesterday';
    if (days < 7) return `${days} days ago`;
    if (days < 30) return `${Math.floor(days / 7)} weeks ago`;
    return `${Math.floor(days / 30)} months ago`;
  };

  const avgRating = feedback.reduce((sum, f) => sum + f.rating, 0) / feedback.length;
  const avgDishRating = dishFeedback.reduce((sum, f) => sum + f.rating, 0) / dishFeedback.length;

  return (
    <section id="customers" className="space-y-6">
      <h2 className="text-3xl font-bold text-white drop-shadow-lg">Customers & Feedback</h2>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Order Feedback */}
        <div className="rounded-2xl border-2 border-white/20 bg-white shadow-xl p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold flex items-center gap-2">
              <MessageSquare className="w-5 h-5 text-orange-500" />
              Order Feedback
            </h3>
            <div className="flex items-center gap-1 bg-orange-50 px-3 py-1 rounded-full">
              <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
              <span className="text-sm font-bold text-gray-700">{avgRating.toFixed(1)}</span>
            </div>
          </div>
          <div className="space-y-3 max-h-[600px] overflow-y-auto">
            {feedback.map((item) => (
              <div
                key={item.id}
                className="p-4 rounded-xl bg-gradient-to-r from-gray-50 to-white border-2 border-gray-100 hover:border-orange-200 transition-all cursor-pointer"
                onClick={() => setSelectedFeedback(item)}
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-semibold text-gray-900">{item.customerName}</span>
                      <span className="text-xs text-orange-600 font-medium bg-orange-50 px-2 py-0.5 rounded">{item.orderId}</span>
                    </div>
                    <div className="flex items-center gap-1 mb-2">
                      {renderStars(item.rating)}
                      <span className="text-xs text-gray-500 ml-1">{getTimeSince(item.date)}</span>
                    </div>
                  </div>
                </div>
                
                <p className="text-sm text-gray-700 line-clamp-2 mb-2">{item.comment}</p>
                
                {item.response ? (
                  <div className="bg-orange-50 rounded-lg p-2 text-xs">
                    <div className="font-medium text-orange-700 mb-1">Your Response:</div>
                    <div className="text-gray-600 line-clamp-1">{item.response}</div>
                  </div>
                ) : (
                  <button className="text-xs text-orange-600 font-medium hover:underline">
                    Respond to feedback →
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Dish-Specific Feedback */}
        <div className="rounded-2xl border-2 border-white/20 bg-white shadow-xl p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold flex items-center gap-2">
              <Utensils className="w-5 h-5 text-orange-500" />
              Dish Feedback
            </h3>
            <div className="flex items-center gap-1 bg-orange-50 px-3 py-1 rounded-full">
              <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
              <span className="text-sm font-bold text-gray-700">{avgDishRating.toFixed(1)}</span>
            </div>
          </div>
          <div className="space-y-3 max-h-[600px] overflow-y-auto">
            {dishFeedback.map((item) => (
              <div
                key={item.id}
                className="p-4 rounded-xl bg-gradient-to-r from-gray-50 to-white border-2 border-gray-100 hover:border-orange-200 transition-all cursor-pointer"
                onClick={() => setSelectedDishFeedback(item)}
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-semibold text-gray-900">{item.customerName}</span>
                      <span className="text-xs text-orange-600 font-medium bg-orange-50 px-2 py-0.5 rounded">{item.orderId}</span>
                    </div>
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <Utensils className="w-3 h-3 text-orange-500" />
                        <span className="text-sm font-medium text-orange-600">{item.dishName}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-1 mb-2">
                      {renderStars(item.rating)}
                      <span className="text-xs text-gray-500 ml-1">{getTimeSince(item.date)}</span>
                    </div>
                  </div>
                </div>
                
                <p className="text-sm text-gray-700 line-clamp-2 mb-2">{item.comment}</p>
                
                {item.response ? (
                  <div className="bg-orange-50 rounded-lg p-2 text-xs">
                    <div className="font-medium text-orange-700 mb-1">Your Response:</div>
                    <div className="text-gray-600 line-clamp-1">{item.response}</div>
                  </div>
                ) : (
                  <button className="text-xs text-orange-600 font-medium hover:underline">
                    Respond to feedback →
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Order Feedback Detail Modal */}
      {selectedFeedback && (
        <FeedbackDetailModal
          feedback={selectedFeedback}
          onClose={() => setSelectedFeedback(null)}
        />
      )}

      {/* Dish Feedback Detail Modal */}
      {selectedDishFeedback && (
        <DishFeedbackDetailModal
          feedback={selectedDishFeedback}
          onClose={() => setSelectedDishFeedback(null)}
        />
      )}
    </section>
  );
}

function FeedbackDetailModal({ feedback, onClose }: { feedback: Feedback; onClose: () => void }) {
  const [response, setResponse] = useState(feedback.response || '');

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
                <div className="text-sm text-orange-600 font-medium">Order {feedback.orderId}</div>
              </div>
              <div className="text-sm text-gray-500">
                {feedback.date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
              </div>
            </div>

            <div className="flex items-center gap-2 mb-4">
              {renderStars(feedback.rating)}
              <span className="text-sm font-medium text-gray-600">({feedback.rating}/5)</span>
            </div>

            <div className="bg-gray-50 rounded-lg p-4">
              <p className="text-gray-700">{feedback.comment}</p>
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
            />
            <button className="mt-3 w-full px-4 py-3 rounded-xl bg-gradient-to-r from-orange-500 to-red-500 text-white font-medium hover:shadow-lg transition-all">
              {feedback.response ? 'Update Response' : 'Send Response'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function DishFeedbackDetailModal({ feedback, onClose }: { feedback: DishFeedback; onClose: () => void }) {
  const [response, setResponse] = useState(feedback.response || '');

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
                <div className="text-sm text-orange-600 font-medium">Order {feedback.orderId}</div>
              </div>
              <div className="text-sm text-gray-500">
                {feedback.date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
              </div>
            </div>

            {/* Dish Name */}
            <div className="bg-orange-50 rounded-lg p-3 mb-4 flex items-center gap-2">
              <Utensils className="w-5 h-5 text-orange-600" />
              <span className="font-semibold text-orange-900">{feedback.dishName}</span>
            </div>

            <div className="flex items-center gap-2 mb-4">
              {renderStars(feedback.rating)}
              <span className="text-sm font-medium text-gray-600">({feedback.rating}/5)</span>
            </div>

            <div className="bg-gray-50 rounded-lg p-4">
              <p className="text-gray-700">{feedback.comment}</p>
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
            />
            <button className="mt-3 w-full px-4 py-3 rounded-xl bg-gradient-to-r from-orange-500 to-red-500 text-white font-medium hover:shadow-lg transition-all">
              {feedback.response ? 'Update Response' : 'Send Response'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}