'use client';

import SlideBackground from "@/utils/SlideBackground";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from 'react';
import { useRouter } from "next/navigation";
import profileService from "@/services/profileService";

import { Inria_Serif } from 'next/font/google';
const inriaSerif = Inria_Serif({
  weight: ['300'],
  subsets: ['latin'],
});

import { Italiana } from "next/font/google";
const italiana = Italiana({
  weight: ['400'],
  subsets: ['latin'],
});

interface CustomerProfile {
  name: string;
  email: string;
  phone: string;
  gender: string;
  address: string;
  memberSince: string;
  profileImage: string;
}

interface LikedDish {
  id: number;
  name: string;
  description: string;
  price: number;
  image: string;
  category: string;
  likedDate: string;
}

// Sample customer data fallback
const fallbackProfileData: CustomerProfile = {
  name: "",
  email: "",
  phone: "",
  gender: "",
  address: "",
  memberSince: "",
  profileImage: "/profile/profile_pic.jpg"
};

// Sample liked dishes data fallback
const fallbackLikedDishes: LikedDish[] = [
  {
    id: 1,
    name: "Signature Wagyu Steak",
    description: "Premium A5 Wagyu beef, perfectly grilled with herb butter and seasonal vegetables",
    price: 89.99,
    image: "/menu/main1.jpg",
    category: "Main Courses",
    likedDate: "Oct 15, 2024"
  },
  {
    id: 2,
    name: "Truffle Risotto",
    description: "Creamy arborio rice infused with black truffle and parmesan",
    price: 45.99,
    image: "/menu/main3.jpg",
    category: "Main Courses",
    likedDate: "Oct 10, 2024"
  },
  {
    id: 3,
    name: "Mediterranean Seafood Platter",
    description: "Fresh lobster, prawns, and scallops with lemon butter sauce",
    price: 76.99,
    image: "/menu/main2.jpg",
    category: "Main Courses",
    likedDate: "Oct 5, 2024"
  },
  {
    id: 4,
    name: "Tiramisu",
    description: "Classic Italian dessert with espresso-soaked ladyfingers and mascarpone",
    price: 12.99,
    image: "/menu/dessert1.jpg",
    category: "Desserts",
    likedDate: "Sep 28, 2024"
  },
  {
    id: 5,
    name: "Chocolate Lava Cake",
    description: "Warm chocolate cake with molten center, vanilla ice cream",
    price: 13.99,
    image: "/menu/dessert2.jpg",
    category: "Desserts",
    likedDate: "Sep 20, 2024"
  },
  {
    id: 6,
    name: "Chef's Special Pasta",
    description: "Handmade pasta with wild mushrooms and aged balsamic reduction",
    price: 38.99,
    image: "/menu/pasta1.jpg",
    category: "Pasta",
    likedDate: "Sep 15, 2024"
  }
];

const unwrapResponse = (response: any) =>
  response && typeof response === "object" && "data" in response ? response.data : response;

const formatMemberSince = (value?: string) => {
  if (!value) return "Member";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
};

const formatLikedDate = (value?: string) => {
  if (!value) return "Recently";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
};

const mapProfileResponseToCustomer = (data: any): CustomerProfile => {
  if (!data || typeof data !== 'object') {
    return fallbackProfileData;
  }

  return {
    name: data.fullName || data.username || fallbackProfileData.name,
    email: data.email || fallbackProfileData.email,
    phone: data.phoneNumber || fallbackProfileData.phone,
    gender: data.gender || fallbackProfileData.gender,
    address: data.address || fallbackProfileData.address,
    memberSince: formatMemberSince(data.memberSince),
    profileImage: data.profileImageUrl || fallbackProfileData.profileImage,
  };
};

const mapLikedDishesResponse = (items: any[]): LikedDish[] => {
  if (!Array.isArray(items)) {
    return fallbackLikedDishes;
  }

  return items.map((item, index) => ({
    id: item?.id ?? index + 1,
    name: item?.name ?? `Favorite Dish ${index + 1}`,
    description: item?.description ?? 'Customer favorite item',
    price: Number(item?.price ?? 0),
    image: item?.imageUrl ?? item?.image ?? fallbackLikedDishes[index % fallbackLikedDishes.length].image,
    category: item?.category?.name ?? item?.category ?? 'Chef Special',
    // Note: Backend doesn't return likedDate in MenuItemResponse, so we use createdAt or show "Recently"
    likedDate: formatLikedDate(item?.createdAt ?? item?.likedDate ?? item?.likedAt),
  }));
};

const getStoredUserId = (): number | null => {
  if (typeof window === 'undefined') return null;
  try {
    const raw = localStorage.getItem('userInfo');
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    return parsed?.id ?? parsed?.userId ?? null;
  } catch {
    return null;
  }
};

export default function ProfilePage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'profile' | 'liked'>('profile');
  const [isEditing, setIsEditing] = useState(false);
  const [profileData, setProfileData] = useState<CustomerProfile>(fallbackProfileData);
  const [persistedProfile, setPersistedProfile] = useState<CustomerProfile>(fallbackProfileData);
  const [likedDishesList, setLikedDishesList] = useState<LikedDish[]>(fallbackLikedDishes);
  const [loadingProfile, setLoadingProfile] = useState(false);
  const [loadingLiked, setLoadingLiked] = useState(false);
  const [savingProfile, setSavingProfile] = useState(false);
  const [userId, setUserId] = useState<number | null>(null);

  useEffect(() => {
    let isMounted = true;
    // const resolvedId = getStoredUserId();
    const resolvedId = 253;
    console.log('Resolved User ID:', resolvedId);
    setUserId(resolvedId);

    const fetchProfile = async (id: number) => {
      setLoadingProfile(true);
      try {
        const response = await profileService.getProfileById(id);
        console.log('Profile response:', response);
        if (!isMounted) return;
        const mappedProfile = mapProfileResponseToCustomer(unwrapResponse(response));
        setProfileData(mappedProfile);
        console.log('Mapped Profile Data:', mappedProfile);
        setPersistedProfile(mappedProfile);
      } catch (error) {
        console.error('Failed to load profile data:', error);
        if (isMounted) {
          setProfileData(fallbackProfileData);
          setPersistedProfile(fallbackProfileData);
        }
      } finally {
        if (isMounted) {
          setLoadingProfile(false);
        }
      }
    };

    const fetchLikedDishes = async (id: number) => {
      setLoadingLiked(true);
      try {
        // Backend returns List<MenuItemResponse> directly, not wrapped in content
        const response = await profileService.getLikedDishes(id);
        if (!isMounted) return;
        const payload = unwrapResponse(response);
        // Backend returns array directly or wrapped in data
        const items = Array.isArray(payload) ? payload : Array.isArray(payload?.content) ? payload.content : [];
        const normalized = mapLikedDishesResponse(items);
        setLikedDishesList(normalized);
      } catch (error) {
        console.error('Failed to load liked dishes:', error);
        if (isMounted) {
          setLikedDishesList(fallbackLikedDishes);
        }
      } finally {
        if (isMounted) {
          setLoadingLiked(false);
        }
      }
    };

    if (resolvedId) {
      fetchProfile(resolvedId);
      fetchLikedDishes(resolvedId);
    } else {
      setProfileData(fallbackProfileData);
      setPersistedProfile(fallbackProfileData);
      setLikedDishesList(fallbackLikedDishes);
    }

    return () => {
      isMounted = false;
    };
  }, []);

  const handleInputChange = (field: keyof CustomerProfile, value: string) => {
    setProfileData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSave = async () => {
    if (!userId) {
      setPersistedProfile(profileData);
      setIsEditing(false);
      alert('Profile updated locally.');
      return;
    }

    try {
      setSavingProfile(true);
      await profileService.updateProfile(userId, {
        fullName: profileData.name,
        email: profileData.email,
        phoneNumber: profileData.phone,
        gender: profileData.gender,
        address: profileData.address,
        profileImageUrl: profileData.profileImage,
      });
      setPersistedProfile(profileData);
      setIsEditing(false);
      alert('Profile updated successfully!');
    } catch (error: any) {
      console.error('Failed to update profile:', error);
      alert(error?.message || 'Failed to update profile. Please try again.');
    } finally {
      setSavingProfile(false);
    }
  };

  const handleRemoveLike = async (dishId: number) => {
    try {
      if (userId) {
        await profileService.removeLikedDish(dishId, userId);
      }
      setLikedDishesList((prev) => prev.filter((dish) => dish.id !== dishId));
      alert(`Removed dish ${dishId} from liked dishes!`);
    } catch (error: any) {
      console.error('Failed to remove liked dish:', error);
      alert(error?.message || 'Failed to remove liked dish.');
    }
  };

  const handleChangePassword = () => {
    router.push('/auth/change-password');
  };

  const handleDisableAccount = async () => {
    if (!userId) {
      alert('Unable to find your account information.');
      return;
    }

    const confirmed = window.confirm(
      'Are you sure you want to disable your account? You will not be able to log in until it is re-enabled by an administrator.'
    );
    if (!confirmed) return;

    try {
      await profileService.disableAccount(userId);
      alert('Your account has been disabled. You will be logged out.');

      // Clear local auth/session data
      if (typeof window !== 'undefined') {
        localStorage.removeItem('authToken');
        localStorage.removeItem('userInfo');
      }

      router.push('/auth/login');
    } catch (error: any) {
      console.error('Failed to disable account:', error);
      alert(error?.message || 'Failed to disable account. Please try again later.');
    }
  };

  return (
    <section className="relative w-full min-h-screen overflow-hidden">
      
      {/* SlideBackground as Background Layer */}
      <div className="absolute top-0 left-0 w-full h-[400px] z-0">
        <SlideBackground
          images={["/background/bg1.jpg", "/background/bg3.jpg", "/background/bg2.jpg"]}
          interval={8000}
          transitionDuration={1500}  
          className="w-full h-full"
          overlay="bg-black/50"  
        />
      </div>

      {/* Main Content */}
      <div className="relative z-10 min-h-screen pt-24 pb-16">
        <div className="max-w-[1400px] mx-auto px-4">
          
          {/* Breadcrumb Navigation */}
          <div className="mb-8 flex items-center gap-2 text-white drop-shadow-lg">
            <Link href="/" className="hover:text-[#D4AF37] transition-colors font-semibold">Home</Link>
            <span>/</span>
            <span className="text-[#D4AF37] font-semibold">My Profile</span>
          </div>

          {/* Profile Header Card - On top of SlideBackground */}
          <div className="backdrop-blur-md bg-white/95 rounded-2xl shadow-2xl p-8 mb-8">
            <div className="flex flex-col md:flex-row items-center gap-8">
              
              {/* Profile Image */}
              <div className="relative">
                <div className="w-40 h-40 rounded-full overflow-hidden border-4 border-[#D4AF37] shadow-lg">
                  <Image
                    src={profileData.profileImage}
                    alt={profileData.name}
                    width={160}
                    height={160}
                    className="object-cover"
                  />
                </div>
                <button className="absolute bottom-2 right-2 w-10 h-10 bg-[#D4AF37] rounded-full flex items-center justify-center text-white hover:bg-[#B8941F] transition-colors shadow-lg">
                  📷
                </button>
              </div>

              {/* Profile Header Info */}
              <div className="flex-1 text-center md:text-left">
                <h1 className={`${italiana.className} text-4xl mb-2 text-gray-900`}>
                  {profileData.name}
                </h1>
                <p className="text-gray-600 mb-1">{profileData.email}</p>
                <p className="text-sm text-gray-500">Member since {profileData.memberSince}</p>
                {loadingProfile && (
                  <p className="text-xs text-gray-400 mt-1">Refreshing profile...</p>
                )}
              </div>

              {/* Edit Button */}
              <div>
                {!isEditing ? (
                  <button
                    onClick={() => setIsEditing(true)}
                    className="px-6 py-3 bg-[#D4AF37] text-white rounded-lg hover:bg-[#B8941F] transition-colors duration-300 font-semibold shadow-lg"
                  >
                    Edit Profile
                  </button>
                ) : (
                  <div className="flex gap-3">
                    <button
                      onClick={handleSave}
                      disabled={savingProfile}
                      className={`px-6 py-3 rounded-lg font-semibold shadow-lg transition-colors duration-300 ${
                        savingProfile
                          ? 'bg-green-400 text-white cursor-not-allowed'
                          : 'bg-green-600 text-white hover:bg-green-700'
                      }`}
                    >
                      {savingProfile ? 'Saving...' : 'Save'}
                    </button>
                  <button
                    onClick={() => {
                      setIsEditing(false);
                      setProfileData(persistedProfile);
                    }}
                    className="px-6 py-3 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors duration-300 font-semibold shadow-lg"
                  >
                      Cancel
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Tab Navigation */}
          <div className="bg-white rounded-t-2xl shadow-lg">
            <div className="flex border-b border-gray-200">
              <button
                onClick={() => setActiveTab('profile')}
                className={`flex-1 py-4 px-6 font-semibold transition-all duration-300 ${
                  activeTab === 'profile'
                    ? 'text-[#D4AF37] border-b-4 border-[#D4AF37]'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <span className="text-xl mr-2">👤</span>
                Personal Information
              </button>
              <button
                onClick={() => setActiveTab('liked')}
                className={`flex-1 py-4 px-6 font-semibold transition-all duration-300 ${
                  activeTab === 'liked'
                    ? 'text-[#D4AF37] border-b-4 border-[#D4AF37]'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <span className="text-xl mr-2">❤️</span>
                Liked Dishes ({likedDishesList.length})
              </button>
            </div>
          </div>

          {/* Tab Content */}
          <div className="bg-white rounded-b-2xl shadow-lg p-8">
            
            {/* Personal Information Tab */}
            {activeTab === 'profile' && (
              <div className="space-y-6 max-w-3xl">
                <h2 className={`${italiana.className} text-3xl mb-6 pb-3 border-b-2 border-[#D4AF37]`}>
                  Personal Information
                </h2>

                {/* Name Field (Read-only) */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
                  <label className="text-gray-700 font-semibold">User Name</label>
                  <div className="md:col-span-2">
                    <p className="px-4 py-3 bg-gray-100 rounded-lg text-gray-700">
                      {profileData.name}
                    </p>
                  </div>
                </div>

                {/* Email Field */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
                  <label className="text-gray-700 font-semibold">Email Address</label>
                  <div className="md:col-span-2">
                    {isEditing ? (
                      <input
                        type="email"
                        value={profileData.email}
                        onChange={(e) => handleInputChange('email', e.target.value)}
                        className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-[#D4AF37] focus:outline-none transition-colors"
                      />
                    ) : (
                      <p className="px-4 py-3 bg-gray-50 rounded-lg">{profileData.email}</p>
                    )}
                  </div>
                </div>

                {/* Phone Field */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
                  <label className="text-gray-700 font-semibold">Contact Number</label>
                  <div className="md:col-span-2">
                    {isEditing ? (
                      <input
                        type="tel"
                        value={profileData.phone}
                        onChange={(e) => handleInputChange('phone', e.target.value)}
                        className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-[#D4AF37] focus:outline-none transition-colors"
                      />
                    ) : (
                      <p className="px-4 py-3 bg-gray-50 rounded-lg">{profileData.phone}</p>
                    )}
                  </div>
                </div>


                {/* Address Field */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-start">
                  <label className="text-gray-700 font-semibold pt-3">Address</label>
                  <div className="md:col-span-2">
                    {isEditing ? (
                      <textarea
                        value={profileData.address}
                        onChange={(e) => handleInputChange('address', e.target.value)}
                        rows={3}
                        className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-[#D4AF37] focus:outline-none transition-colors resize-none"
                      />
                    ) : (
                      <p className="px-4 py-3 bg-gray-50 rounded-lg">{profileData.address}</p>
                    )}
                  </div>
                </div>

                {/* Member Since (Read-only) */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
                  <label className="text-gray-700 font-semibold">Member Since</label>
                  <div className="md:col-span-2">
                    <p className="px-4 py-3 bg-gray-100 rounded-lg text-gray-600">{profileData.memberSince}</p>
                  </div>
                </div>

                {/* Account Actions */}
                <div className="pt-6 mt-6 border-t-2 border-gray-200">
                  <h3 className="text-lg font-semibold mb-4">Account Actions</h3>
                  <div className="flex flex-wrap gap-4">
                    <button
                      onClick={handleChangePassword}
                      className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-300 font-semibold"
                    >
                      Change Password
                    </button>
                    <button
                      onClick={handleDisableAccount}
                      className="px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors duration-300 font-semibold"
                    >
                      Disable Account
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Liked Dishes Tab */}
            {activeTab === 'liked' && (
              <div>
                <div className="flex items-center justify-between mb-6 pb-3 border-b-2 border-[#D4AF37]">
                  <h2 className={`${italiana.className} text-3xl`}>
                    Your Favorite Dishes
                  </h2>
                    <p className="text-gray-600">
                      {likedDishesList.length} {likedDishesList.length === 1 ? 'dish' : 'dishes'}
                    </p>
                </div>

                {loadingLiked ? (
                  <div className="text-center py-16 text-gray-500">
                    Loading liked dishes...
                  </div>
                ) : likedDishesList.length === 0 ? (
                  <div className="text-center py-16">
                    <div className="text-6xl mb-4">💔</div>
                    <h3 className={`${italiana.className} text-2xl mb-2`}>No Liked Dishes Yet</h3>
                    <p className="text-gray-600 mb-6">Start exploring our menu and save your favorites!</p>
                    <Link href="/menu">
                      <button className="px-6 py-3 bg-[#D4AF37] text-white rounded-lg hover:bg-[#B8941F] transition-colors duration-300 font-semibold">
                        Browse Menu
                      </button>
                    </Link>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {likedDishesList.map((dish) => (
                      <div key={dish.id} className="bg-white border-2 border-gray-200 rounded-xl overflow-hidden hover:border-[#D4AF37] transition-all duration-300 shadow-md hover:shadow-xl group">
                        
                        {/* Dish Image */}
                        <div className="relative h-48 overflow-hidden">
                          <Image
                            src={dish.image}
                            alt={dish.name}
                            fill
                            className="object-cover group-hover:scale-110 transition-transform duration-300"
                          />
                          <div className="absolute top-3 right-3">
                            <button
                              onClick={() => handleRemoveLike(dish.id)}
                              className="w-10 h-10 bg-red-500 rounded-full flex items-center justify-center text-white hover:bg-red-600 transition-colors shadow-lg"
                              title="Remove from favorites"
                            >
                              ❤️
                            </button>
                          </div>
                          <div className="absolute top-3 left-3">
                            <span className="px-3 py-1 bg-[#D4AF37] text-white rounded-full text-xs font-semibold">
                              {dish.category}
                            </span>
                          </div>
                        </div>

                        {/* Dish Details */}
                        <div className="p-5">
                          <h3 className={`${italiana.className} text-xl mb-2`}>{dish.name}</h3>
                          <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                            {dish.description}
                          </p>
                          
                          <div className="flex items-center justify-between mb-4">
                            <span className="text-2xl font-bold text-[#D4AF37]">
                              {dish.price.toFixed(2)} VND
                            </span>
                            <span className="text-xs text-gray-500">
                              Liked on {dish.likedDate}
                            </span>
                          </div>

                          {/* Action Buttons */}
                          <div className="flex gap-2">
                            <Link href={`/menu/${dish.id}`} className="flex-1">
                              <button className="w-full py-2 bg-[#D4AF37] text-white rounded-lg hover:bg-[#B8941F] transition-colors duration-300 font-semibold text-sm">
                                View Details
                              </button>
                            </Link>
                            <button className="px-4 py-2 border-2 border-[#D4AF37] text-[#D4AF37] rounded-lg hover:bg-[#D4AF37] hover:text-white transition-colors duration-300 font-semibold text-sm">
                              🛒
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
