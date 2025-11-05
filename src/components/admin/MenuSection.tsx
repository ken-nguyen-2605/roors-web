"use client";

import { useState } from 'react';
import { Plus, Search, Filter, Edit2, Trash2, Image as ImageIcon, X } from 'lucide-react';

interface MenuItem {
  id: number;
  name: string;
  category: string;
  price: number;
  status: 'Available' | 'Unavailable' | 'Out of Stock';
  description: string;
  image?: string;
  ingredients?: string;
  allergy?: string;
}

export default function MenuSection() {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('All');
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingItem, setEditingItem] = useState<MenuItem | null>(null);
  
  const [menuItems, setMenuItems] = useState<MenuItem[]>([
    { id: 1, name: 'Classic Burger', category: 'Main Course', price: 12.99, status: 'Available', description: 'Juicy beef patty with fresh vegetables', ingredients: 'Beef patty, lettuce, tomato, onion, pickles, bun', allergy: 'Gluten, Dairy' },
    { id: 2, name: 'Caesar Salad', category: 'Appetizers', price: 8.50, status: 'Available', description: 'Crisp romaine lettuce with parmesan', ingredients: 'Romaine lettuce, parmesan cheese, croutons, caesar dressing', allergy: 'Dairy, Gluten, Eggs' },
    { id: 3, name: 'Margherita Pizza', category: 'Main Course', price: 14.99, status: 'Available', description: 'Fresh mozzarella and basil', ingredients: 'Pizza dough, tomato sauce, mozzarella, basil', allergy: 'Gluten, Dairy' },
    { id: 4, name: 'Chocolate Cake', category: 'Desserts', price: 6.99, status: 'Out of Stock', description: 'Rich chocolate layered cake', ingredients: 'Flour, sugar, cocoa, eggs, butter', allergy: 'Gluten, Dairy, Eggs' },
    { id: 5, name: 'Grilled Salmon', category: 'Main Course', price: 18.99, status: 'Available', description: 'Atlantic salmon with herbs', ingredients: 'Salmon fillet, herbs, lemon, olive oil', allergy: 'Fish' },
    { id: 6, name: 'French Fries', category: 'Sides', price: 4.50, status: 'Available', description: 'Crispy golden fries', ingredients: 'Potatoes, vegetable oil, salt', allergy: 'None' }
  ]);

  const categories = ['All', 'Appetizers', 'Main Course', 'Sides', 'Desserts', 'Beverages'];

  const filteredItems = menuItems.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.category.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = filterCategory === 'All' || item.category === filterCategory;
    return matchesSearch && matchesCategory;
  });

  const handleAddItem = (newItem: Omit<MenuItem, 'id'>) => {
    const id = Math.max(...menuItems.map(i => i.id), 0) + 1;
    setMenuItems([...menuItems, { ...newItem, id }]);
    setShowAddModal(false);
  };

  const handleUpdateItem = (updatedItem: MenuItem) => {
    setMenuItems(menuItems.map(item => item.id === updatedItem.id ? updatedItem : item));
    setEditingItem(null);
  };

  const handleDeleteItem = (id: number) => {
    if (confirm('Are you sure you want to delete this menu item?')) {
      setMenuItems(menuItems.filter(item => item.id !== id));
    }
  };

  const handleStatusToggle = (id: number) => {
    setMenuItems(menuItems.map(item => 
      item.id === id 
        ? { ...item, status: item.status === 'Available' ? 'Unavailable' : 'Available' } 
        : item
    ));
  };

  return (
    <section id="menu" className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <h2 className="text-3xl font-bold text-white drop-shadow-lg">Menu Management</h2>
        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-orange-500 to-red-500 text-white font-medium shadow-lg hover:shadow-xl transition-all hover:scale-105"
        >
          <Plus className="w-5 h-5" />
          Add New Item
        </button>
      </div>

      {/* Search and Filter Bar */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search menu items..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-12 pr-4 py-3 rounded-xl border-2 border-white/20 bg-white shadow-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
          />
        </div>
        <div className="relative">
          <Filter className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <select
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            className="pl-12 pr-8 py-3 rounded-xl border-2 border-white/20 bg-white shadow-lg focus:outline-none focus:ring-2 focus:ring-orange-500 appearance-none cursor-pointer"
          >
            {categories.map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Menu Items Table */}
      <div className="rounded-2xl border-2 border-white/20 bg-white shadow-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gradient-to-r from-gray-50 to-gray-100">
                <th className="text-left px-6 py-4 text-xs font-semibold text-gray-600 uppercase tracking-wider">Item</th>
                <th className="text-left px-6 py-4 text-xs font-semibold text-gray-600 uppercase tracking-wider">Category</th>
                <th className="text-left px-6 py-4 text-xs font-semibold text-gray-600 uppercase tracking-wider">Price</th>
                <th className="text-left px-6 py-4 text-xs font-semibold text-gray-600 uppercase tracking-wider">Status</th>
                <th className="text-right px-6 py-4 text-xs font-semibold text-gray-600 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredItems.map((item) => (
                <tr key={item.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-orange-100 to-red-100 flex items-center justify-center">
                        {item.image ? (
                          <img src={item.image} alt={item.name} className="w-full h-full object-cover rounded-lg" />
                        ) : (
                          <ImageIcon className="w-6 h-6 text-orange-600" />
                        )}
                      </div>
                      <div>
                        <div className="font-semibold text-gray-900">{item.name}</div>
                        <div className="text-sm text-gray-500">{item.description}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-700">{item.category}</td>
                  <td className="px-6 py-4 text-sm font-semibold text-gray-900">${item.price.toFixed(2)}</td>
                  <td className="px-6 py-4">
                    <button
                      onClick={() => handleStatusToggle(item.id)}
                      className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                        item.status === 'Available' 
                          ? 'bg-green-100 text-green-700 hover:bg-green-200' 
                          : item.status === 'Out of Stock'
                          ? 'bg-red-100 text-red-700 hover:bg-red-200'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      {item.status}
                    </button>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => setEditingItem(item)}
                        className="p-2 rounded-lg bg-blue-50 text-blue-600 hover:bg-blue-100 transition-colors"
                        title="Edit"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteItem(item.id)}
                        className="p-2 rounded-lg bg-red-50 text-red-600 hover:bg-red-100 transition-colors"
                        title="Delete"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredItems.length === 0 && (
          <div className="text-center py-12 text-gray-500">
            <p>No menu items found</p>
          </div>
        )}
      </div>

      {/* Add/Edit Modal */}
      {(showAddModal || editingItem) && (
        <MenuItemModal
          item={editingItem}
          onClose={() => {
            setShowAddModal(false);
            setEditingItem(null);
          }}
          onSave={editingItem ? handleUpdateItem : handleAddItem}
          categories={categories.filter(c => c !== 'All')}
        />
      )}
    </section>
  );
}

function MenuItemModal({ 
  item, 
  onClose, 
  onSave, 
  categories 
}: { 
  item: MenuItem | null; 
  onClose: () => void; 
  onSave: (item: any) => void;
  categories: string[];
}) {
  const [formData, setFormData] = useState({
    name: item?.name || '',
    category: item?.category || categories[0],
    price: item?.price || 0,
    status: item?.status || 'Available',
    description: item?.description || '',
    image: item?.image || '',
    ingredients: item?.ingredients || '',
    allergy: item?.allergy || ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (item) {
      onSave({ ...item, ...formData });
    } else {
      onSave(formData);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b px-6 py-4 flex items-center justify-between">
          <h3 className="text-xl font-bold">{item ? 'Edit Menu Item' : 'Add New Menu Item'}</h3>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Item Name</label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-orange-500"
              placeholder="e.g., Grilled Chicken"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
            <select
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-orange-500"
            >
              {categories.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Price ($)</label>
            <input
              type="number"
              required
              step="0.01"
              min="0"
              value={formData.price}
              onChange={(e) => setFormData({ ...formData, price: parseFloat(e.target.value) })}
              className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-orange-500"
              placeholder="0.00"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
            <select
              value={formData.status}
              onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
              className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-orange-500"
            >
              <option value="Available">Available</option>
              <option value="Unavailable">Unavailable</option>
              <option value="Out of Stock">Out of Stock</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Image URL</label>
            <input
              type="url"
              value={formData.image}
              onChange={(e) => setFormData({ ...formData, image: e.target.value })}
              className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-orange-500"
              placeholder="https://example.com/image.jpg"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Ingredients</label>
            <textarea
              value={formData.ingredients}
              onChange={(e) => setFormData({ ...formData, ingredients: e.target.value })}
              className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-orange-500"
              rows={2}
              placeholder="e.g., Beef, lettuce, tomato, cheese"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Allergy Information</label>
            <input
              type="text"
              value={formData.allergy}
              onChange={(e) => setFormData({ ...formData, allergy: e.target.value })}
              className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-orange-500"
              placeholder="e.g., Gluten, Dairy, Nuts"
            />
          </div>
              
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-orange-500"
              rows={3}
              placeholder="Brief description of the item"
            />
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-3 rounded-xl border-2 border-gray-300 font-medium hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-3 rounded-xl bg-gradient-to-r from-orange-500 to-red-500 text-white font-medium hover:shadow-lg transition-all"
            >
              {item ? 'Update' : 'Add'} Item
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}