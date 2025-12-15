// modify Status -> 3 status (available, unavailable, out of stock)
// add rating display in menu management table
// image_url change to image upload handling
// update sort choices in menu management table

"use client";

import { useState, useEffect } from 'react';
import { Plus, Search, Filter, Edit2, Trash2, Image as ImageIcon, X, Loader2, AlertCircle } from 'lucide-react';
import menuService from '@/services/menuService'; // Adjust path as needed
import { GiConsoleController } from 'react-icons/gi';

interface MenuItem {
  id: number;
  name: string;
  categoryId?: number;
  categoryName?: string;
  price: number;
  available: boolean;
  description: string;
  imageUrl?: string;
  ingredients?: string;
  allergyInfo?: string;
  slug?: string;
  featured?: boolean;
  rating?: number;
  preparationTime?: number;
}

interface Category {
  id: number;
  name: string;
  slug: string;
  isActive: boolean;
}

export default function MenuSection() {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState<number | 'all'>('all');
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingItem, setEditingItem] = useState<MenuItem | null>(null);
  
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [pageSize] = useState(10);

  // Fetch categories on mount
  useEffect(() => {
    fetchCategories();
  }, []);

  // Fetch menu items when filters change
  useEffect(() => {
    fetchMenuItems();
  }, [searchTerm, filterCategory, currentPage]);

  const fetchCategories = async () => {
    try {
      const response = await menuService.getAllCategories();
      setCategories(response.data || response);
    } catch (err: any) {
      console.error('Error fetching categories:', err);
      setError('Failed to load categories');
    }
  };

  // useEffect(() => {
  //   console.log("Search component MOUNTED. Initial searchTerm:", searchTerm);
  // }, []);

  const fetchMenuItems = async () => {
    setLoading(true);
    setError(null);
    
    try {
      let response;
      
      if (searchTerm.trim()) {
        // Search by keyword
        response = await menuService.searchMenuItems(searchTerm, {
          page: currentPage,
          size: pageSize
        });
      } else if (filterCategory !== 'all') {
        // Filter by category
        response = await menuService.getMenuItemsByCategory(filterCategory as number, {
          page: currentPage,
          size: pageSize
        });
      } else {
        // Get all items
        response = await menuService.getAllMenuItems({
          page: currentPage,
          size: pageSize,
          sortBy: 'name',
          sortDir: 'asc'
        });
      }

      // Handle both direct data and wrapped response
      const data = response.data || response;
      
      // Map backend fields to frontend interface
      const mappedItems = (data.content || []).map((item: any) => ({
          id: item.id,
          name: item.name,
          categoryId: item.category?.id,  // ✅ Changed from item.categoryId
          categoryName: item.category?.name,  // ✅ Changed from item.categoryName
          price: item.price,
          available: item.isAvailable,  // ✅ Changed from item.available
          description: item.description,
          imageUrl: item.imageUrl,
          ingredients: item.ingredients,
          allergyInfo: item.allergens,  // ✅ Note: backend uses "allergens" not "allergyInfo"
          slug: item.slug,
          featured: item.isFeatured,  // ✅ Changed from item.featured
          rating: item.rating,
          preparationTime: item.preparationTime
      }));


      setMenuItems(mappedItems);
      setTotalPages(data.totalPages || 0);
      setCurrentPage(data.number || 0);
    } catch (err: any) {
      console.error('Error fetching menu items:', err);
      setError('Failed to load menu items. Please try again.');
      setMenuItems([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    console.log("Search component MOUNTED. Initial searchTerm:", searchTerm);
  }, []);

  const handleAddItem = async (newItem: Omit<MenuItem, 'id'>) => {
    try {
      setLoading(true);
      
      // Map frontend fields to backend expected format
      const payload = {
        name: newItem.name,
        categoryId: newItem.categoryId,
        price: newItem.price,
        available: newItem.available,
        description: newItem.description,
        imageUrl: newItem.imageUrl || '',
        ingredients: newItem.ingredients || '',
        allergyInfo: newItem.allergyInfo || '',
        featured: newItem.featured || false,
        preparationTime: newItem.preparationTime || 0
      };

      await menuService.createMenuItem(payload);
      setShowAddModal(false);
      fetchMenuItems(); // Refresh the list
      setError(null);
    } catch (err: any) {
      console.error('Error adding menu item:', err);
      setError(err.message || 'Failed to add menu item');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateItem = async (updatedItem: MenuItem) => {
    try {
      setLoading(true);
      
      // Map frontend fields to backend expected format
      const payload = {
        name: updatedItem.name,
        categoryId: updatedItem.categoryId,
        price: updatedItem.price,
        available: updatedItem.available,
        description: updatedItem.description,
        imageUrl: updatedItem.imageUrl || '',
        ingredients: updatedItem.ingredients || '',
        allergyInfo: updatedItem.allergyInfo || '',
        featured: updatedItem.featured || false,
        preparationTime: updatedItem.preparationTime || 0
      };

      await menuService.updateMenuItem(updatedItem.id, payload);
      setEditingItem(null);
      fetchMenuItems(); // Refresh the list
      setError(null);
    } catch (err: any) {
      console.error('Error updating menu item:', err);
      setError(err.message || 'Failed to update menu item');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteItem = async (id: number) => {
    if (!confirm('Are you sure you want to delete this menu item?')) return;
    
    try {
      setLoading(true);
      await menuService.deleteMenuItem(id);
      fetchMenuItems(); // Refresh the list
      setError(null);
    } catch (err: any) {
      console.error('Error deleting menu item:', err);
      setError(err.message || 'Failed to delete menu item');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusToggle = async (id: number) => {
    try {
      await menuService.toggleMenuItemAvailability(id);
      fetchMenuItems(); // Refresh the list
      setError(null);
    } catch (err: any) {
      console.error('Error toggling availability:', err);
      setError(err.message || 'Failed to toggle availability');
    }
  };

  const handlePageChange = (newPage: number) => {
    if (newPage >= 0 && newPage < totalPages) {
      setCurrentPage(newPage);
    }
  };

  const getStatusDisplay = (available: boolean) => {
    return available ? 'Available' : 'Unavailable';
  };

  const getStatusClass = (available: boolean) => {
    return available
      ? 'bg-green-100 text-green-700 hover:bg-green-200'
      : 'bg-gray-100 text-gray-700 hover:bg-gray-200';
  };

  return (
    <section id="menu" className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <h2 className="text-3xl font-bold text-white drop-shadow-lg">Menu Management</h2>
        <button
          onClick={() => setShowAddModal(true)}
          disabled={loading}
          className="flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-orange-500 to-red-500 text-white font-medium shadow-lg hover:shadow-xl transition-all hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Plus className="w-5 h-5" />
          Add New Item
        </button>
      </div>

      {/* Error Display */}
      {error && (
        <div className="flex items-center gap-3 p-4 bg-red-50 border-2 border-red-200 rounded-xl text-red-700">
          <AlertCircle className="w-5 h-5 flex-shrink-0" />
          <p>{error}</p>
          <button
            onClick={() => setError(null)}
            className="ml-auto p-1 hover:bg-red-100 rounded"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Search and Filter Bar */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search menu items..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(0); // Reset to first page on search
            }}
            className="w-full pl-12 pr-4 py-3 rounded-xl border-2 border-white/20 bg-white shadow-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
          />
        </div>
        <div className="relative">
          <Filter className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <select
            value={filterCategory}
            onChange={(e) => {
              const value = e.target.value === 'all' ? 'all' : parseInt(e.target.value);
              setFilterCategory(value);
              setCurrentPage(0); // Reset to first page on filter change
            }}
            className="pl-12 pr-8 py-3 rounded-xl border-2 border-white/20 bg-white shadow-lg focus:outline-none focus:ring-2 focus:ring-orange-500 appearance-none cursor-pointer"
          >
            <option value="all">All Categories</option>
            {categories
              .filter(cat => cat.isActive)
              .map(cat => (
                <option key={cat.id} value={cat.id}>{cat.name}</option>
              ))
            }
          </select>
        </div>
      </div>

      {/* Loading State */}
      {loading ? (
        <div className="flex items-center justify-center py-12 bg-white rounded-2xl border-2 border-white/20 shadow-xl">
          <Loader2 className="w-8 h-8 text-orange-500 animate-spin" />
          <span className="ml-3 text-gray-600">Loading menu items...</span>
        </div>
      ) : (
        <>
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
                  {menuItems.map((item) => (
                    <tr key={item.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-orange-100 to-red-100 flex items-center justify-center overflow-hidden">
                            {item.imageUrl ? (
                              <img src={item.imageUrl} alt={item.name} className="w-full h-full object-cover" />
                            ) : (
                              <ImageIcon className="w-6 h-6 text-orange-600" />
                            )}
                          </div>
                          <div>
                            <div className="font-semibold text-gray-900">{item.name}</div>
                            <div className="text-sm text-gray-500 line-clamp-1">{item.description}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-700">{item.categoryName}</td>
                      <td className="px-6 py-4 text-sm font-semibold text-gray-900">
                        ${item.price.toFixed(2)}
                      </td>
                      <td className="px-6 py-4">
                        <button
                          onClick={() => handleStatusToggle(item.id)}
                          disabled={loading}
                          className={`px-3 py-1 rounded-full text-xs font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${getStatusClass(item.available)}`}
                        >
                          {getStatusDisplay(item.available)}
                        </button>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => setEditingItem(item)}
                            disabled={loading}
                            className="p-2 rounded-lg bg-blue-50 text-blue-600 hover:bg-blue-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            title="Edit"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDeleteItem(item.id)}
                            disabled={loading}
                            className="p-2 rounded-lg bg-red-50 text-red-600 hover:bg-red-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
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

            {menuItems.length === 0 && (
              <div className="text-center py-12 text-gray-500">
                <p>No menu items found</p>
              </div>
            )}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-2">
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 0 || loading}
                className="px-4 py-2 rounded-lg bg-white border-2 border-gray-200 text-gray-700 font-medium hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Previous
              </button>
              <span className="px-4 py-2 text-gray-700">
                Page {currentPage + 1} of {totalPages}
              </span>
              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage >= totalPages - 1 || loading}
                className="px-4 py-2 rounded-lg bg-white border-2 border-gray-200 text-gray-700 font-medium hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Next
              </button>
            </div>
          )}
        </>
      )}

      {/* Add/Edit Modal */}
      {(showAddModal || editingItem) && (
        <MenuItemModal
          item={editingItem}
          onClose={() => {
            setShowAddModal(false);
            setEditingItem(null);
          }}
          onSave={editingItem ? handleUpdateItem : handleAddItem}
          categories={categories.filter(cat => cat.isActive)}
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
  categories: Category[];
}) {
  const [formData, setFormData] = useState({
    name: item?.name || '',
    categoryId: item?.categoryId || (categories[0]?.id || 0),
    price: item?.price || 0,
    available: item?.available !== undefined ? item.available : true,
    description: item?.description || '',
    imageUrl: item?.imageUrl || '',
    ingredients: item?.ingredients || '',
    allergyInfo: item?.allergyInfo || '',
    featured: item?.featured || false,
    preparationTime: item?.preparationTime || 0
  });

  // Keep the raw File and a preview; send as base64
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(item?.imageUrl || null);
  const [submitting, setSubmitting] = useState(false);

  const toBase64 = (file: File) =>
    new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = reject;
    });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    
    try {
      let imagePayload = '';
      if (imageFile) {
        imagePayload = await toBase64(imageFile);
      }

      if (item) {
        await onSave({ ...item, ...formData, imageUrl: imagePayload });
      } else {
        await onSave({ ...formData, imageUrl: imagePayload });
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b px-6 py-4 flex items-center justify-between">
          <h3 className="text-xl font-bold">{item ? 'Edit Menu Item' : 'Add New Menu Item'}</h3>
          <button 
            onClick={onClose} 
            disabled={submitting}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors disabled:opacity-50"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Item Name *</label>
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
            <label className="block text-sm font-medium text-gray-700 mb-2">Category *</label>
            <select
              required
              value={formData.categoryId}
              onChange={(e) => setFormData({ ...formData, categoryId: parseInt(e.target.value) })}
              className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-orange-500"
            >
              {categories.map(cat => (
                <option key={cat.id} value={cat.id}>{cat.name}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Price ($) *</label>
            <input
              type="number"
              required
              step="0.01"
              min="0"
              value={formData.price}
              onChange={(e) => setFormData({ ...formData, price: parseFloat(e.target.value) || 0 })}
              className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-orange-500"
              placeholder="0.00"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Preparation Time (minutes)</label>
            <input
              type="number"
              min="0"
              value={formData.preparationTime}
              onChange={(e) => setFormData({ ...formData, preparationTime: parseInt(e.target.value) || 0 })}
              className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-orange-500"
              placeholder="15"
            />
          </div>

          <div className="flex items-center gap-4">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.available}
                onChange={(e) => setFormData({ ...formData, available: e.target.checked })}
                className="w-4 h-4 text-orange-500 rounded focus:ring-orange-500"
              />
              <span className="text-sm font-medium text-gray-700">Available</span>
            </label>

            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.featured}
                onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                className="w-4 h-4 text-orange-500 rounded focus:ring-orange-500"
              />
              <span className="text-sm font-medium text-gray-700">Featured</span>
            </label>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Image</label>
            <div className="space-y-3">
              <input
                type="file"
                accept="image/*"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (!file) {
                    setImageFile(null);
                    setImagePreview(null);
                    return;
                  }
                  setImageFile(file);
                  setImagePreview(URL.createObjectURL(file));
                }}
                className="block w-full text-sm text-gray-700 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-orange-50 file:text-orange-600 hover:file:bg-orange-100"
              />
              {imagePreview && (
                <div className="w-16 h-16 rounded-lg overflow-hidden border border-gray-200 bg-gray-50">
                  <img
                    src={imagePreview}
                    alt="Preview"
                    className="w-full h-full object-cover"
                  />
                </div>
              )}
            </div>
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
              value={formData.allergyInfo}
              onChange={(e) => setFormData({ ...formData, allergyInfo: e.target.value })}
              className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-orange-500"
              placeholder="e.g., Gluten, Dairy, Nuts"
            />
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              disabled={submitting}
              className="flex-1 px-4 py-3 rounded-xl border-2 border-gray-300 font-medium hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="flex-1 px-4 py-3 rounded-xl bg-gradient-to-r from-orange-500 to-red-500 text-white font-medium hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {submitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Saving...
                </>
              ) : (
                <>{item ? 'Update' : 'Add'} Item</>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
