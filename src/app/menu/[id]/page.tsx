// app/menu/[id]/page.tsx (example path)
// Dish detail page that fetches data from backend

'use client';

import SlideBackground from "@/utils/SlideBackground";
import Image from "next/image";
import Link from "next/link";
import { useState, useEffect } from "react";
import { useParams } from "next/navigation";

import menuService from "@/services/menuService";
import { useNoteStore } from "@/stores/useNoteStore";
import { Icon } from "@iconify/react";

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

interface Category {
  id: number;
  name: string;
  slug?: string;
  description?: string;
  imageUrl?: string;
}

interface MenuItem {
  id: number;
  name: string;
  description: string;
  price: number;
  imageUrl?: string;
  category?: Category;
  rating?: number;
  calories?: number;
  preparationTime?: number;
  spicyLevel?: number;
  ingredients: string[];
  allergens: string[];
  servingSize?: string;
  slug?: string;
  isAvailable?: boolean;
  isFeatured?: boolean;
  reviewCount?: number;
  orderCount?: number;
}

const parseDelimitedField = (value?: string | string[] | null): string[] => {
  if (!value) return [];
  if (Array.isArray(value)) {
    return value.map((item) => item.trim()).filter(Boolean);
  }
  return value
    .split(/[,;]/)
    .map((item) => item.trim())
    .filter(Boolean);
};

const normalizeMenuItem = (item: any): MenuItem => {
  if (!item) {
    throw new Error("Menu item payload is empty");
  }

  const preparationTime =
    item.preparationTime ??
    item.prepTime ??
    item.prepTimeMinutes ??
    undefined;

  const parsedId = Number(item.id);
  const parsedPrice = Number(item.price);
  const safeId = Number.isFinite(parsedId) ? parsedId : 0;
  const safePrice = Number.isFinite(parsedPrice) ? parsedPrice : 0;

  return {
    id: safeId,
    name: item.name ?? "Untitled Dish",
    description: item.description ?? "No description available.",
    price: safePrice,
    imageUrl: item.imageUrl ?? undefined,
    category: item.category,
    rating: typeof item.rating === "number" ? item.rating : undefined,
    calories:
      typeof item.calories === "number" ? item.calories : undefined,
    preparationTime:
      typeof preparationTime === "number" ? preparationTime : undefined,
    spicyLevel:
      typeof item.spicyLevel === "number" ? item.spicyLevel : undefined,
    ingredients: parseDelimitedField(item.ingredients),
    allergens: parseDelimitedField(item.allergens),
    servingSize: item.servingSize ?? undefined,
    slug: item.slug ?? undefined,
    isAvailable:
      typeof item.isAvailable === "boolean" ? item.isAvailable : undefined,
    isFeatured:
      typeof item.isFeatured === "boolean" ? item.isFeatured : undefined,
    reviewCount:
      typeof item.reviewCount === "number" ? item.reviewCount : undefined,
    orderCount:
      typeof item.orderCount === "number" ? item.orderCount : undefined,
  };
};

export default function DishDetailPage() {
  const params = useParams<{ id: string }>();
  const dishId = Number(params?.id);

  // If route param is invalid
  if (!dishId || Number.isNaN(dishId)) {
    return (
      <div className="min-h-screen bg-[#F5F4ED] pt-24 pb-16 flex items-center justify-center">
        <div className="text-center">
          <h1 className={`${italiana.className} text-4xl mb-4`}>Invalid Dish</h1>
          <p className="text-gray-600 mb-6">The dish id in the URL is not valid.</p>
          <Link href="/menu">
            <button className="px-6 py-3 bg-[#D4AF37] text-white rounded-lg hover:bg-[#B8941F] transition-colors duration-300">
              Back to Menu
            </button>
          </Link>
        </div>
      </div>
    );
  }

  return <DishDetailContent dishId={dishId} />;
}

function DishDetailContent({ dishId }: { dishId: number }) {
  const [quantity, setQuantity] = useState(1);

  const setQuantityInStore = useNoteStore((state) => state.setQuantity);
  const storedQuantity = useNoteStore(
    (state) => state.quantities[dishId] ?? 0
  );

  const [dish, setDish] = useState<MenuItem | null>(null);
  const [relatedDishes, setRelatedDishes] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [relatedLoading, setRelatedLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [ratings, setRatings] = useState<Array<{
    rating: number;
    feedback: string;
    ratedAt: string;
    customerName: string;
  }>>([]);
  const [ratingsLoading, setRatingsLoading] = useState(false);

  // Fetch main dish
  useEffect(() => {
    const fetchDish = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await menuService.getMenuItemById(dishId); // calls /api/menu/{id}
        const normalizedDish = normalizeMenuItem(data);
        setDish(normalizedDish);

        // After we know the category, fetch related dishes
        if (normalizedDish?.category?.id) {
          fetchRelated(normalizedDish.id, normalizedDish.category.id);
        }
        
        // Fetch dish ratings
        fetchRatings(dishId);
      } catch (err: any) {
        console.error("Failed to load dish:", err);
        setError("Failed to load dish. Please try again later.");
        setDish(null);
      } finally {
        setLoading(false);
      }
    };

    const fetchRelated = async (currentDishId: number, categoryId: number) => {
      try {
        setRelatedLoading(true);
        const res = await menuService.getMenuItemsByCategory(categoryId, {
          page: 0,
          size: 6,
        });
        const items = (res?.content ?? res ?? []) as any[];
        const normalizedItems = items
          .filter(Boolean)
          .map((item) => normalizeMenuItem(item));
        const filtered = normalizedItems
          .filter((item) => item.id !== currentDishId)
          .slice(0, 3);
        setRelatedDishes(filtered);
      } catch (err) {
        console.error("Failed to load related dishes:", err);
        setRelatedDishes([]);
      } finally {
        setRelatedLoading(false);
      }
    };

    const fetchRatings = async (menuItemId: number) => {
      try {
        setRatingsLoading(true);
        const res = await menuService.getDishRatings(menuItemId, 5);
        setRatings(Array.isArray(res) ? res : []);
      } catch (err) {
        console.error("Failed to load ratings:", err);
        setRatings([]);
      } finally {
        setRatingsLoading(false);
      }
    };

    fetchDish();
  }, [dishId]);

  useEffect(() => {
    setQuantity(storedQuantity > 0 ? storedQuantity : 1);
  }, [storedQuantity, dishId]);

  const calculatePrice = () => {
    if (!dish) return "0.00";
    return (dish.price * quantity).toFixed(2);
  };

  const addToCart = () => {
    if (!dish) return;
    setQuantityInStore(dish.id, quantity);
    alert(`Added ${quantity} ${dish.name} to cart!`);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F5F4ED] pt-24 pb-16 flex items-center justify-center">
        <p className="text-gray-600 text-xl">Loading dish...</p>
      </div>
    );
  }

  if (error || !dish) {
    return (
      <div className="min-h-screen bg-[#F5F4ED] pt-24 pb-16 flex items-center justify-center">
        <div className="text-center">
          <h1 className={`${italiana.className} text-4xl mb-4`}>Dish Not Found</h1>
          <p className="text-gray-600 mb-6">
            {error || "The dish you're looking for doesn't exist."}
          </p>
          <Link href="/menu">
            <button className="px-6 py-3 bg-[#D4AF37] text-white rounded-lg hover:bg-[#B8941F] transition-colors duration-300">
              Back to Menu
            </button>
          </Link>
        </div>
      </div>
    );
  }

  const mainImage = dish.imageUrl || "/dishes/placeholder.jpg";
  const categoryName = dish.category?.name ?? "Dish";

  const calories =
    typeof dish.calories === "number" ? dish.calories : null;
  const prepTime =
    typeof dish.preparationTime === "number"
      ? `${dish.preparationTime} min`
      : "N/A";

  return (
    <section className="relative w-full min-h-screen overflow-hidden">
      {/* SlideBackground as Background Layer */}
      <div className="absolute top-0 left-0 w-full h-[700px] z-0">
        <SlideBackground
          images={["/background/bg1.jpg", "/background/bg3.jpg", "/background/bg2.jpg"]}
          interval={8000}
          transitionDuration={1500}
          className="w-full h-full"
          overlay="bg-black/40"
        />
      </div>

      {/* Main Content - Positioned on top of SlideBackground */}
      <div className="relative z-10 min-h-screen pt-24 pb-16">
        <div className="max-w-[1400px] mx-auto px-4">
          {/* Breadcrumb Navigation */}
          <div className="mb-8 flex items-center gap-2 text-white drop-shadow-lg">
            <Link href="/" className="hover:text-[#D4AF37] transition-colors font-semibold">
              Home
            </Link>
            <span>/</span>
            <Link href="/menu" className="hover:text-[#D4AF37] transition-colors font-semibold">
              Menu
            </Link>
            <span>/</span>
            <span className="text-[#D4AF37] font-semibold">{dish.name}</span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
            {/* Image Section */}
            <div className="space-y-4">
              <div className="relative h-[500px] rounded-2xl overflow-hidden shadow-2xl backdrop-blur-sm bg-white/10 border-4 border-[#D4AF37]">
                <Image
                  src={mainImage}
                  alt={dish.name}
                  fill
                  className="object-cover"
                  priority
                />
              </div>

              {/* Thumbnail Gallery (using same image as placeholder) */}
              <div className="grid grid-cols-4 gap-4">
                {[1, 2, 3, 4].map((index) => (
                  <div
                    key={index}
                    className="relative h-24 rounded-lg overflow-hidden cursor-pointer border-2 border-transparent hover:border-[#D4AF37] transition-all shadow-lg"
                  >
                    <Image
                      src={mainImage}
                      alt={`${dish.name} view ${index}`}
                      fill
                      className="object-cover"
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* Details Section */}
            <div className="space-y-6 backdrop-blur-md bg-white/90 p-8 rounded-2xl shadow-2xl">
              <div>
                <span className="inline-block px-4 py-1 bg-[#D4AF37] text-white rounded-full text-sm font-semibold mb-4">
                  {categoryName}
                </span>
                <h1 className={`${italiana.className} text-5xl mb-4 text-gray-900`}>{dish.name}</h1>
                <p className="text-xl text-gray-700 leading-relaxed mb-6">
                  {dish.description}
                </p>
              </div>

              {/* Price and Info Grid */}
              <div className="grid grid-cols-3 gap-4 p-6 bg-white rounded-xl shadow-md">
                <div className="text-center">
                  <p className="text-gray-600 text-sm mb-1">Price</p>
                  <p className="text-2xl font-bold text-[#D4AF37]">
                    {dish.price.toFixed(2)} VND
                  </p>
                </div>
                <div className="text-center border-l border-r border-gray-200">
                  <p className="text-gray-600 text-sm mb-1">Prep Time</p>
                  <p className="text-lg font-semibold">{prepTime}</p>
                </div>
                <div className="text-center">
                  <p className="text-gray-600 text-sm mb-1">Calories</p>
                  <p className="text-lg font-semibold">
                    {calories !== null ? `${calories} kcal` : "N/A"}
                  </p>
                </div>
              </div>

              {/* Quantity Selection */}
              <div>
                <h3 className="text-lg font-semibold mb-3">Quantity</h3>
                <div className="flex items-center gap-4">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="w-12 h-12 bg-white border border-gray-300 rounded-lg hover:bg-gray-100 transition-colors text-xl font-bold"
                  >
                    -
                  </button>
                  <span className="text-2xl font-semibold w-16 text-center">
                    {quantity}
                  </span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="w-12 h-12 bg-white border border-gray-300 rounded-lg hover:bg-gray-100 transition-colors text-xl font-bold"
                  >
                    +
                  </button>
                </div>
              </div>

              {/* Add to Cart Section */}
              <div className="flex gap-4 pt-4">
                <button
                  onClick={addToCart}
                  className="flex-1 py-4 bg-[#D4AF37] text-white rounded-lg hover:bg-[#B8941F] transition-colors duration-300 font-bold text-lg shadow-lg"
                >
                  Add to Cart - {calculatePrice()} VND
                </button>
                {/* <button className="w-14 h-14 bg-white border-2 border-[#D4AF37] rounded-lg hover:bg-gray-50 transition-colors text-2xl">
                  ♥
                </button> */}
              </div>
            </div>
          </div>

          {/* Detailed Information */}
          <div className="bg-white rounded-2xl shadow-lg p-8 mb-16">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Ingredients */}
              <div>
                <h3
                  className={`${italiana.className} text-3xl mb-4 pb-3 border-b-2 border-[#D4AF37]`}
                >
                  Ingredients
                </h3>
                {dish.ingredients && dish.ingredients.length > 0 ? (
                  <ul className="space-y-2">
                    {dish.ingredients.map((ingredient, index) => (
                      <li key={index} className="flex items-center gap-3">
                        <span className="w-2 h-2 bg-[#D4AF37] rounded-full"></span>
                        <span className="text-gray-700">{ingredient}</span>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-gray-500">No ingredient information available.</p>
                )}
              </div>

              {/* Allergens & Nutritional Info */}
              <div>
                <h3
                  className={`${italiana.className} text-3xl mb-4 pb-3 border-b-2 border-[#D4AF37]`}
                >
                  Allergen Information
                </h3>
                <div className="space-y-4">
                  <div>
                    <p className="text-sm text-gray-600 mb-2">Contains:</p>
                    {dish.allergens && dish.allergens.length > 0 ? (
                      <div className="flex flex-wrap gap-2">
                        {dish.allergens.map((allergen, index) => (
                          <span
                            key={index}
                            className="px-3 py-1 bg-red-100 text-red-700 rounded-full text-sm font-semibold"
                          >
                            {allergen}
                          </span>
                        ))}
                      </div>
                    ) : (
                      <p className="text-gray-500 text-sm">
                        No allergen information available.
                      </p>
                    )}
                  </div>
                  <div className="pt-4">
                    <p className="text-sm text-gray-600 mb-3">
                      Nutritional Information (per serving):
                    </p>
                    <div className="grid grid-cols-2 gap-3">
                      <div className="p-3 bg-gray-50 rounded-lg">
                        <p className="text-xs text-gray-600">Calories</p>
                        <p className="text-lg font-bold">
                          {calories !== null ? calories : "N/A"}
                        </p>
                      </div>
                      <div className="p-3 bg-gray-50 rounded-lg">
                        <p className="text-xs text-gray-600">Prep Time</p>
                        <p className="text-lg font-bold">{prepTime}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Customer Ratings & Reviews */}
          <div className="bg-white rounded-2xl shadow-lg p-8 mb-16">
            <h3 className={`${italiana.className} text-3xl mb-6 pb-3 border-b-2 border-[#D4AF37]`}>
              Customer Reviews
            </h3>
            {ratingsLoading ? (
              <p className="text-gray-500 text-center py-8">Loading reviews...</p>
            ) : ratings.length === 0 ? (
              <p className="text-gray-500 text-center py-8">No reviews yet. Be the first to review this dish!</p>
            ) : (
              <div className="space-y-6">
                {ratings.map((review, index) => (
                  <div key={index} className="border-b border-gray-200 pb-6 last:border-b-0 last:pb-0">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-[#D4AF37] rounded-full flex items-center justify-center text-white font-bold">
                          {review.customerName?.charAt(0)?.toUpperCase() || "A"}
                        </div>
                        <div>
                          <p className="font-semibold text-gray-900">{review.customerName || "Anonymous"}</p>
                          <p className="text-xs text-gray-500">
                            {review.ratedAt ? new Date(review.ratedAt).toLocaleDateString("en-US", {
                              month: "short",
                              day: "numeric",
                              year: "numeric",
                            }) : ""}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-1">
                        {Array.from({ length: 5 }, (_, i) => (
                          <Icon
                            key={i}
                            icon={i < review.rating ? "tabler:star-filled" : "lucide:star"}
                            className={`text-lg ${i < review.rating ? "text-[#FBBF24]" : "text-gray-300"}`}
                          />
                        ))}
                      </div>
                    </div>
                    {review.feedback && (
                      <p className="text-gray-700 leading-relaxed pl-12">{review.feedback}</p>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Related Dishes */}
          <div className="mb-16">
            <h2 className={`${italiana.className} text-3xl mb-6`}>You might also like</h2>
            {relatedLoading ? (
              <p className="text-gray-500">Loading related dishes...</p>
            ) : relatedDishes.length === 0 ? (
              <p className="text-gray-500">No related dishes found.</p>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                {relatedDishes.map((item) => (
                  <Link key={item.id} href={`/menu/${item.id}`}>
                    <div className="cursor-pointer bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow">
                      <div className="relative h-48">
                        <Image
                          src={item.imageUrl || "/dishes/placeholder.jpg"}
                          alt={item.name}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div className="p-4">
                        <p className="text-sm text-gray-500 mb-1">
                          {item.category?.name ?? categoryName}
                        </p>
                        <h3 className="text-lg font-semibold mb-1">{item.name}</h3>
                        <p className="text-sm text-gray-600 line-clamp-2 mb-2">
                          {item.description}
                        </p>
                        <p className="text-[#D4AF37] font-bold">
                          {item.price.toFixed(2)} VND
                        </p>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
