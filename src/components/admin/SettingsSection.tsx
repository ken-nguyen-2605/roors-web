"use client";

import { useState } from 'react';
import { 
  Building2, Clock, CreditCard, Bell, Shield, Plug, 
  Save, ChevronRight, MapPin, Phone, Mail, Globe,
  DollarSign, Wifi, Truck, X
} from 'lucide-react';

export default function SettingsSection() {
  const [activeTab, setActiveTab] = useState<string | null>(null);
  const [businessInfo, setBusinessInfo] = useState({
    name: 'The Gourmet Kitchen',
    address: '123 Main Street, Suite 100',
    city: 'New York',
    state: 'NY',
    zip: '10001',
    phone: '+1 (555) 123-4567',
    email: 'contact@gourmetkitchen.com',
    website: 'www.gourmetkitchen.com'
  });

  const [hours, setHours] = useState({
    monday: { open: '09:00', close: '22:00', closed: false },
    tuesday: { open: '09:00', close: '22:00', closed: false },
    wednesday: { open: '09:00', close: '22:00', closed: false },
    thursday: { open: '09:00', close: '22:00', closed: false },
    friday: { open: '09:00', close: '23:00', closed: false },
    saturday: { open: '10:00', close: '23:00', closed: false },
    sunday: { open: '10:00', close: '21:00', closed: false }
  });

  const settingsCategories = [
    {
      id: 'business',
      title: 'Business Info',
      description: 'Restaurant details and contact information',
      icon: <Building2 className="w-6 h-6" />,
      color: 'from-blue-500 to-cyan-500'
    },
    {
      id: 'hours',
      title: 'Operating Hours',
      description: 'Set your business hours and schedule',
      icon: <Clock className="w-6 h-6" />,
      color: 'from-purple-500 to-pink-500'
    },
    {
      id: 'payments',
      title: 'Payment Settings',
      description: 'Configure payment methods and processing',
      icon: <CreditCard className="w-6 h-6" />,
      color: 'from-green-500 to-emerald-500'
    },
    {
      id: 'notifications',
      title: 'Notifications',
      description: 'Manage alerts and communication preferences',
      icon: <Bell className="w-6 h-6" />,
      color: 'from-orange-500 to-red-500'
    },
    {
      id: 'security',
      title: 'Security',
      description: 'Account security and access control',
      icon: <Shield className="w-6 h-6" />,
      color: 'from-red-500 to-pink-500'
    },
    {
      id: 'integrations',
      title: 'Integrations',
      description: 'Connect third-party services and tools',
      icon: <Plug className="w-6 h-6" />,
      color: 'from-indigo-500 to-purple-500'
    }
  ];

  const handleSave = () => {
    alert('Settings saved successfully!');
    setActiveTab(null);
  };

  return (
    <section id="settings" className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-white drop-shadow-lg">Settings</h2>
          <p className="text-white/80 mt-1">Manage your restaurant configuration</p>
        </div>
      </div>

      {!activeTab ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {settingsCategories.map((category) => (
            <button
              key={category.id}
              onClick={() => setActiveTab(category.id)}
              className="group rounded-2xl border-2 border-white/20 bg-white shadow-xl p-6 hover:shadow-2xl transition-all hover:scale-105 text-left"
            >
              <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${category.color} p-3 text-white shadow-lg mb-4 group-hover:scale-110 transition-transform`}>
                {category.icon}
              </div>
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h3 className="font-bold text-gray-900 text-lg mb-1">{category.title}</h3>
                  <p className="text-sm text-gray-600">{category.description}</p>
                </div>
                <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-orange-500 transition-colors" />
              </div>
            </button>
          ))}
        </div>
      ) : (
        <div className="rounded-2xl border-2 border-white/20 bg-white shadow-xl p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-2xl font-bold text-gray-900">
              {settingsCategories.find(c => c.id === activeTab)?.title}
            </h3>
            <button
              onClick={() => setActiveTab(null)}
              className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {activeTab === 'business' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <Building2 className="w-4 h-4 inline mr-1" />
                    Restaurant Name
                  </label>
                  <input
                    type="text"
                    value={businessInfo.name}
                    onChange={(e) => setBusinessInfo({ ...businessInfo, name: e.target.value })}
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-orange-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <Phone className="w-4 h-4 inline mr-1" />
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    value={businessInfo.phone}
                    onChange={(e) => setBusinessInfo({ ...businessInfo, phone: e.target.value })}
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-orange-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <MapPin className="w-4 h-4 inline mr-1" />
                  Street Address
                </label>
                <input
                  type="text"
                  value={businessInfo.address}
                  onChange={(e) => setBusinessInfo({ ...businessInfo, address: e.target.value })}
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">City</label>
                  <input
                    type="text"
                    value={businessInfo.city}
                    onChange={(e) => setBusinessInfo({ ...businessInfo, city: e.target.value })}
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-orange-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">State</label>
                  <input
                    type="text"
                    value={businessInfo.state}
                    onChange={(e) => setBusinessInfo({ ...businessInfo, state: e.target.value })}
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-orange-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">ZIP Code</label>
                  <input
                    type="text"
                    value={businessInfo.zip}
                    onChange={(e) => setBusinessInfo({ ...businessInfo, zip: e.target.value })}
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-orange-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <Mail className="w-4 h-4 inline mr-1" />
                    Email Address
                  </label>
                  <input
                    type="email"
                    value={businessInfo.email}
                    onChange={(e) => setBusinessInfo({ ...businessInfo, email: e.target.value })}
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-orange-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <Globe className="w-4 h-4 inline mr-1" />
                    Website
                  </label>
                  <input
                    type="url"
                    value={businessInfo.website}
                    onChange={(e) => setBusinessInfo({ ...businessInfo, website: e.target.value })}
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-orange-500"
                  />
                </div>
              </div>
            </div>
          )}

          {activeTab === 'hours' && (
            <div className="space-y-4">
              {Object.entries(hours).map(([day, time]) => (
                <div key={day} className="flex items-center gap-4 p-4 rounded-lg bg-gray-50">
                  <div className="w-32">
                    <span className="font-medium text-gray-900 capitalize">{day}</span>
                  </div>
                  <div className="flex-1 flex items-center gap-4">
                    <input
                      type="time"
                      value={time.open}
                      disabled={time.closed}
                      onChange={(e) => setHours({ ...hours, [day]: { ...time, open: e.target.value } })}
                      className="px-3 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-orange-500 disabled:bg-gray-200"
                    />
                    <span className="text-gray-500">to</span>
                    <input
                      type="time"
                      value={time.close}
                      disabled={time.closed}
                      onChange={(e) => setHours({ ...hours, [day]: { ...time, close: e.target.value } })}
                      className="px-3 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-orange-500 disabled:bg-gray-200"
                    />
                  </div>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={time.closed}
                      onChange={(e) => setHours({ ...hours, [day]: { ...time, closed: e.target.checked } })}
                      className="w-4 h-4 text-orange-500 rounded focus:ring-orange-500"
                    />
                    <span className="text-sm text-gray-600">Closed</span>
                  </label>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'payments' && (
            <div className="space-y-6">
              <div>
                <h4 className="font-semibold text-gray-900 mb-4">Accepted Payment Methods</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {[
                    { name: 'Credit/Debit Cards', icon: CreditCard, enabled: true },
                    { name: 'Cash', icon: DollarSign, enabled: true },
                    { name: 'Digital Wallets', icon: Wifi, enabled: true },
                    { name: 'Online Banking', icon: Building2, enabled: false }
                  ].map((method, idx) => (
                    <label key={idx} className="flex items-center gap-3 p-4 rounded-lg border-2 border-gray-200 hover:border-orange-300 transition-colors cursor-pointer">
                      <input type="checkbox" defaultChecked={method.enabled} className="w-5 h-5 text-orange-500 rounded" />
                      <method.icon className="w-5 h-5 text-gray-600" />
                      <span className="font-medium text-gray-900">{method.name}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <h4 className="font-semibold text-gray-900 mb-4">Tax Settings</h4>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Sales Tax Rate (%)</label>
                    <input
                      type="number"
                      step="0.01"
                      defaultValue="8.50"
                      className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-orange-500"
                    />
                  </div>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" defaultChecked className="w-4 h-4 text-orange-500 rounded" />
                    <span className="text-sm text-gray-700">Include tax in menu prices</span>
                  </label>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'notifications' && (
            <div className="space-y-6">
              <div>
                <h4 className="font-semibold text-gray-900 mb-4">Email Notifications</h4>
                <div className="space-y-3">
                  {[
                    'New orders',
                    'Order status updates',
                    'New reservations',
                    'Customer feedback',
                    'Daily sales summary',
                    'Low stock alerts'
                  ].map((notif, idx) => (
                    <label key={idx} className="flex items-center justify-between p-3 rounded-lg bg-gray-50 cursor-pointer hover:bg-gray-100 transition-colors">
                      <span className="text-sm text-gray-700">{notif}</span>
                      <input type="checkbox" defaultChecked={idx < 4} className="w-4 h-4 text-orange-500 rounded" />
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <h4 className="font-semibold text-gray-900 mb-4">SMS Notifications</h4>
                <div className="space-y-3">
                  {[
                    'Urgent order issues',
                    'Reservation confirmations',
                    'Staff schedule changes'
                  ].map((notif, idx) => (
                    <label key={idx} className="flex items-center justify-between p-3 rounded-lg bg-gray-50 cursor-pointer hover:bg-gray-100 transition-colors">
                      <span className="text-sm text-gray-700">{notif}</span>
                      <input type="checkbox" defaultChecked={idx === 0} className="w-4 h-4 text-orange-500 rounded" />
                    </label>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'security' && (
            <div className="space-y-6">
              <div>
                <h4 className="font-semibold text-gray-900 mb-4">Password Settings</h4>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Current Password</label>
                    <input
                      type="password"
                      className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-orange-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">New Password</label>
                    <input
                      type="password"
                      className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-orange-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Confirm New Password</label>
                    <input
                      type="password"
                      className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-orange-500"
                    />
                  </div>
                </div>
              </div>

              <div>
                <h4 className="font-semibold text-gray-900 mb-4">Two-Factor Authentication</h4>
                <label className="flex items-center gap-3 p-4 rounded-lg border-2 border-gray-200 cursor-pointer">
                  <input type="checkbox" className="w-5 h-5 text-orange-500 rounded" />
                  <div>
                    <div className="font-medium text-gray-900">Enable 2FA</div>
                    <div className="text-sm text-gray-600">Add an extra layer of security to your account</div>
                  </div>
                </label>
              </div>
            </div>
          )}

          {activeTab === 'integrations' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  { name: 'Google Analytics', desc: 'Track website traffic', connected: true },
                  { name: 'Stripe', desc: 'Payment processing', connected: true },
                  { name: 'Mailchimp', desc: 'Email marketing', connected: false },
                  { name: 'Uber Eats', desc: 'Delivery platform', connected: true },
                  { name: 'DoorDash', desc: 'Food delivery', connected: false },
                  { name: 'QuickBooks', desc: 'Accounting software', connected: false }
                ].map((integration, idx) => (
                  <div key={idx} className="p-4 rounded-lg border-2 border-gray-200">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-orange-500 to-red-500 flex items-center justify-center">
                          <Plug className="w-5 h-5 text-white" />
                        </div>
                        <div>
                          <div className="font-semibold text-gray-900">{integration.name}</div>
                          <div className="text-xs text-gray-600">{integration.desc}</div>
                        </div>
                      </div>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        integration.connected ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'
                      }`}>
                        {integration.connected ? 'Connected' : 'Not Connected'}
                      </span>
                    </div>
                    <button className={`w-full px-4 py-2 rounded-lg font-medium text-sm transition-colors ${
                      integration.connected 
                        ? 'bg-red-50 text-red-600 hover:bg-red-100'
                        : 'bg-orange-500 text-white hover:bg-orange-600'
                    }`}>
                      {integration.connected ? 'Disconnect' : 'Connect'}
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="flex items-center justify-end gap-3 pt-6 border-t">
            <button
              onClick={() => setActiveTab(null)}
              className="px-6 py-3 rounded-xl border-2 border-gray-300 font-medium hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              className="flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-orange-500 to-red-500 text-white font-medium hover:shadow-lg transition-all"
            >
              <Save className="w-4 h-4" />
              Save Changes
            </button>
          </div>
        </div>
      )}
    </section>
  );
}