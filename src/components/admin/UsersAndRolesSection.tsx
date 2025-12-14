"use client";

import { useEffect, useState } from 'react';
import { UserPlus, Edit2, Trash2, Shield, Eye, Search, X, Mail, Phone, Calendar, CheckCircle2, AlertCircle, ArrowUpRight, Loader2 } from 'lucide-react';
import apiService from '@/services/api';

interface User {
  id: number;
  name: string; // using username as name placeholder
  email: string;
  phone: string;
  role: 'Manager' | 'Staff' | 'Customer';
  status: 'Active' | 'Disabled';
  joinedDate: Date;
  lastActive: Date;
  permissions: string[];
  disabled?: boolean;
}

export default function UsersAndRolesSection() {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRole, setFilterRole] = useState('All');
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [isManager, setIsManager] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [users, setUsers] = useState<User[]>([]);

  const roles = ['All', 'Manager', 'Staff', 'Customer'];

  const rolePermissions = {
    'Manager': ['Dashboard', 'Orders', 'Reservations', 'Menu', 'Staff Management', 'Reports', 'Customers'],
    'Staff': ['Orders', 'Reservations', 'Menu', 'Customers'],
    'Customer': ['Profile', 'Orders', 'Reservations']
  };

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = filterRole === 'All' || user.role === filterRole;
    return matchesSearch && matchesRole;
  });

  const getStatusColor = (status: User['status']) => {
    switch (status) {
      case 'Active': return 'bg-green-100 text-green-700';
      case 'Disabled': return 'bg-red-100 text-red-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const getRoleColor = (role: User['role']) => {
    switch (role) {
      case 'Manager': return 'bg-blue-100 text-blue-700';
      case 'Staff': return 'bg-orange-100 text-orange-700';
      case 'Customer': return 'bg-green-100 text-green-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const handleDeleteUser = async (id: number) => {
    if (!confirm('Are you sure you want to remove this user?')) return;
    try {
      await apiService.delete(`/api/admin/users/${id}`);
      setUsers(users.filter(user => user.id !== id));
    } catch (err: any) {
      alert(err?.message || 'Failed to delete user');
    }
  };

  const getTimeSince = (date: Date) => {
    const hours = Math.floor((Date.now() - date.getTime()) / 3600000);
    if (hours < 1) return 'Just now';
    if (hours < 24) return `${hours}h ago`;
    const days = Math.floor(hours / 24);
    return `${days}d ago`;
  };

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const raw = localStorage.getItem('userInfo');
      try {
        const parsed = raw ? JSON.parse(raw) : null;
        if (parsed?.role === 'MANAGER') setIsManager(true);
      } catch (e) {
        setIsManager(false);
      }
    }
  }, []);

  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await apiService.get('/api/admin/users');
        const data = response || [];
        const mapped = data.map((u: any) => ({
          id: u.id,
          name: u.username,
          email: u.email,
          phone: u.phone || '',
          role: mapRole(u.role),
          status: u.disabled ? 'Disabled' : 'Active',
          disabled: u.disabled,
          joinedDate: new Date(),
          lastActive: new Date(),
          permissions: u.role === 'Manager'
            ? ['all']
            : u.role === 'Staff'
              ? ['orders', 'reservations', 'menu', 'customers']
              : ['profile']
        }));
        setUsers(mapped);
      } catch (err: any) {
        setError(err?.message || 'Failed to load users');
        setUsers([]);
      } finally {
        setLoading(false);
      }
    };
    if (isManager) fetchUsers();
  }, [isManager]);

  const mapRole = (role: string): User['role'] => {
    switch ((role || '').toUpperCase()) {
      case 'MANAGER': return 'Manager';
      case 'STAFF': return 'Staff';
      default: return 'Customer';
    }
  };

  return (
    <section id="users" className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold text-white drop-shadow-lg">Users & Roles</h2>
          <p className="text-white/80 mt-1">{users.length} team members</p>
        </div>
        {isManager && (
          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-orange-500 to-red-500 text-white font-medium shadow-lg hover:shadow-xl transition-all hover:scale-105"
          >
            <UserPlus className="w-5 h-5" />
            Add Staff
          </button>
        )}
      </div>

      {/* Search and Filter */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search by name or email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-12 pr-4 py-3 rounded-xl border-2 border-white/20 bg-white shadow-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
          />
        </div>
        <div className="flex flex-wrap gap-2">
          {roles.map(role => (
            <button
              key={role}
              onClick={() => setFilterRole(role)}
              className={`px-4 py-2 rounded-xl font-medium text-sm transition-all ${
                filterRole === role
                  ? 'bg-gradient-to-r from-orange-500 to-red-500 text-white shadow-lg'
                  : 'bg-white text-gray-700 hover:bg-gray-50 shadow'
              }`}
            >
              {role}
            </button>
          ))}
        </div>
      </div>

      {/* Users Table */}
      <div className="rounded-2xl border-2 border-white/20 bg-white shadow-xl overflow-hidden">
        {error && (
          <div className="p-4 bg-red-50 text-red-700 border-b border-red-100">
            {error}
          </div>
        )}
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-6 h-6 animate-spin text-orange-500" />
            <span className="ml-3 text-gray-600">Loading users...</span>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gradient-to-r from-gray-50 to-gray-100">
                  <th className="text-left px-6 py-4 text-xs font-semibold text-gray-600 uppercase tracking-wider">User</th>
                  <th className="text-left px-6 py-4 text-xs font-semibold text-gray-600 uppercase tracking-wider">Role</th>
                  <th className="text-left px-6 py-4 text-xs font-semibold text-gray-600 uppercase tracking-wider">Status</th>
                  <th className="text-right px-6 py-4 text-xs font-semibold text-gray-600 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredUsers.map((user) => (
                  <tr key={user.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-orange-500 to-red-500 flex items-center justify-center text-white font-bold">
                          {user.name.split(' ').map(n => n[0]).join('')}
                        </div>
                        <div>
                          <div className="font-semibold text-gray-900">{user.name}</div>
                          <div className="text-sm text-gray-500">{user.email}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${getRoleColor(user.role)}`}>
                        {user.role}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(user.status)}`}>
                        {user.status}
                      </span>
                    </td>
                    {/* <td className="px-6 py-4 text-sm text-gray-600">
                      {getTimeSince(user.lastActive)}
                    </td> */}
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => setSelectedUser(user)}
                          className="p-2 rounded-lg bg-blue-50 text-blue-600 hover:bg-blue-100 transition-colors"
                          title="View Details"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        {isManager && user.role !== 'Manager' && (
                          <>
                            <button
                              onClick={async () => {
                                try {
                                  if (user.disabled) {
                                    await apiService.post(`/api/admin/users/${user.id}/enable`);
                                    setUsers(users.map(u => u.id === user.id ? { ...u, disabled: false, status: 'Active' } : u));
                                  } else {
                                    await apiService.post(`/api/admin/users/${user.id}/disable`);
                                    setUsers(users.map(u => u.id === user.id ? { ...u, disabled: true, status: 'Disabled' } : u));
                                  }
                                } catch (err) {
                                  console.error('Failed to toggle user', err);
                                  alert('Failed to update user status');
                                }
                              }}
                              className={`p-2 rounded-lg transition-colors ${user.disabled ? 'bg-green-50 text-green-600 hover:bg-green-100' : 'bg-red-50 text-red-600 hover:bg-red-100'}`}
                              title={user.disabled ? 'Enable User' : 'Disable User'}
                            >
                              <Shield className="w-4 h-4" />
                            </button>
                            {user.role !== 'Staff' && (
                              <button
                                onClick={async () => {
                                  try {
                                    await apiService.post(`/api/admin/users/${user.id}/verify-staff`);
                                    setUsers(users.map(u => u.id === user.id ? { ...u, role: 'Staff' } : u));
                                  } catch (err) {
                                    console.error('Failed to promote to staff', err);
                                    alert('Failed to promote to staff');
                                  }
                                }}
                                className="p-2 rounded-lg bg-green-50 text-green-600 hover:bg-green-100 transition-colors"
                                title="Make Staff"
                              >
                                <ArrowUpRight className="w-4 h-4" />
                              </button>
                            )}
                            <button
                              onClick={() => handleDeleteUser(user.id)}
                              className="p-2 rounded-lg bg-red-50 text-red-600 hover:bg-red-100 transition-colors"
                              title="Remove"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {filteredUsers.length === 0 && (
              <div className="text-center py-12 text-gray-500">
                <p>No users found</p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Role Permissions Reference */}
      <div className="rounded-2xl border-2 border-white/20 bg-white shadow-xl p-6">
        <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
          <Shield className="w-5 h-5 text-orange-500" />
          Role Permissions Reference
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {Object.entries(rolePermissions).map(([role, permissions]) => (
            <div key={role} className="p-4 rounded-lg border-2 border-gray-100">
              <div className={`inline-block px-3 py-1 rounded-full text-sm font-bold mb-3 ${getRoleColor(role as User['role'])}`}>
                {role}
              </div>
              <div className="space-y-1">
                {permissions.map((permission, idx) => (
                  <div key={idx} className="text-sm text-gray-600 flex items-center gap-2">
                    <div className="w-1 h-1 rounded-full bg-orange-500" />
                    {permission}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* User Detail Modal */}
      {selectedUser && (
        <UserDetailModal
          user={selectedUser}
          onClose={() => setSelectedUser(null)}
        />
      )}

      {/* Add User Modal */}
      {showAddModal && (
        <AddStaffModal
          onClose={() => setShowAddModal(false)}
          onAdd={(newUser) => {
            setUsers([...users, { ...newUser, id: Math.max(...users.map(u => u.id)) + 1 }]);
            setShowAddModal(false);
          }}
        />
      )}
    </section>
  );
}

function UserDetailModal({ user, onClose }: { user: User; onClose: () => void }) {
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-gradient-to-r from-orange-500 to-red-500 text-white px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center text-white font-bold text-lg">
              {user.name.split(' ').map(n => n[0]).join('')}
            </div>
            <div>
              <h3 className="text-xl font-bold">{user.name}</h3>
              <span className={`px-2 py-1 rounded-full text-xs font-bold ${
                user.role === 'Owner' ? 'bg-white/20' : 'bg-white/10'
              }`}>
                {user.role}
              </span>
            </div>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-lg transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Contact Information */}
          <div>
            <h4 className="font-semibold text-gray-900 mb-3">Contact Information</h4>
            <div className="bg-gray-50 rounded-lg p-4 space-y-3">
              <div className="flex items-center gap-3">
                <Mail className="w-5 h-5 text-gray-400" />
                <div>
                  <div className="text-xs text-gray-500">Email</div>
                  <div className="font-medium">{user.email}</div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Phone className="w-5 h-5 text-gray-400" />
                <div>
                  <div className="text-xs text-gray-500">Phone</div>
                  <div className="font-medium">{user.phone}</div>
                </div>
              </div>
            </div>
          </div>

          {/* Employment Info */}
          <div>
            <h4 className="font-semibold text-gray-900 mb-3">Employment Information</h4>
            <div className="bg-gray-50 rounded-lg p-4 space-y-3">
              <div className="flex items-center gap-3">
                <Calendar className="w-5 h-5 text-gray-400" />
                <div>
                  <div className="text-xs text-gray-500">Joined Date</div>
                  <div className="font-medium">
                    {user.joinedDate.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                  </div>
                </div>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Status:</span>
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                  user.status === 'Active' ? 'bg-green-100 text-green-700' :
                  user.status === 'On Leave' ? 'bg-yellow-100 text-yellow-700' :
                  'bg-gray-100 text-gray-700'
                }`}>
                  {user.status}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Last Active:</span>
                <span className="font-medium">{user.lastActive.toLocaleString('en-US')}</span>
              </div>
            </div>
          </div>

          {/* Permissions */}
          <div>
            <h4 className="font-semibold text-gray-900 mb-3">Permissions</h4>
            <div className="flex flex-wrap gap-2">
              {user.permissions.map((permission, idx) => (
                <span key={idx} className="px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-700">
                  {permission}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function AddStaffModal({ onClose, onAdd }: { onClose: () => void; onAdd: (user: any) => void }) {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: ''
  });

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    try {
      setSubmitting(true);
      await apiService.post('/api/admin/users/create-staff', {
        username: formData.username,
        email: formData.email,
        password: formData.password,
      });
      setSuccess('Staff account created');
      onAdd({
        name: formData.username,
        email: formData.email,
        phone: '',
        role: 'Staff' as User['role'],
        status: 'Active' as User['status'],
        joinedDate: new Date(),
        lastActive: new Date(),
        permissions: ['orders', 'menu'],
      });
      setFormData({ username: '', email: '', password: '', confirmPassword: '' });
    } catch (err: any) {
      const message = err?.message || 'Failed to create staff account';
      setError(message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full">
        <div className="sticky top-0 bg-gradient-to-r from-orange-500 to-red-500 text-white px-6 py-4 flex items-center justify-between">
          <h3 className="text-xl font-bold">Create Staff (Manager)</h3>
          <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-lg transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && (
            <div className="flex items-center gap-2 p-3 rounded-lg bg-red-50 text-red-700 border border-red-200">
              <AlertCircle className="w-4 h-4" />
              <span className="text-sm">{error}</span>
            </div>
          )}
          {success && (
            <div className="flex items-center gap-2 p-3 rounded-lg bg-green-50 text-green-700 border border-green-200">
              <CheckCircle2 className="w-4 h-4" />
              <span className="text-sm">{success}</span>
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Username</label>
            <input
              type="text"
              required
              value={formData.username}
              onChange={(e) => setFormData({ ...formData, username: e.target.value })}
              className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-orange-500"
              placeholder="staffuser"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
            <input
              type="email"
              required
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-orange-500"
              placeholder="staff@example.com"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
            <input
              type="password"
              required
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-orange-500"
              placeholder="Min 6 characters"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Confirm Password</label>
            <input
              type="password"
              required
              value={formData.confirmPassword}
              onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
              className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-orange-500"
              placeholder="Re-enter password"
            />
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              disabled={submitting}
              className="flex-1 px-4 py-3 rounded-xl border-2 border-gray-300 font-medium hover:bg-gray-50 transition-colors disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="flex-1 px-4 py-3 rounded-xl bg-gradient-to-r from-orange-500 to-red-500 text-white font-medium hover:shadow-lg transition-all disabled:opacity-50"
            >
              {submitting ? 'Creating...' : 'Create Staff'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
