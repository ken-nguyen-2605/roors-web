//Homepage of the Restaurant Website//
'use client';

import SlideBackground from "@/utils/SlideBackground";
import Star from "@/components/decorativeComponents/Star";
import Line from "@/components/decorativeComponents/Line";
import CrewCard from "@/components/home/CrewCard";
import Image from "next/image";
import Link from "next/link";
import { useState } from 'react';

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

const colors = [
  "#F5F4ED",
  "#FFFFFF",
  "#7A7A76",
  "#989793",
]

interface MenuItem {
  id: number;
  name: string;
  description: string;
  price: number;
  image: string;
  category: string;
  ingredients?: string[];
  allergens?: string[];
  calories?: number;
  prepTime?: string;
}

// Complete menu data
const menuItems: MenuItem[] = [
  {
    id: 1,
    name: "Bruschetta Trio",
    description: "Three varieties of toasted bread with tomato, mushroom, and olive tapenade",
    price: 14.99,
    image: "/menu/appetizer1.jpg",
    category: "Appetizers",
    ingredients: ["Artisan bread", "Heirloom tomatoes", "Wild mushrooms", "Kalamata olives", "Fresh basil", "Extra virgin olive oil", "Garlic"],
    allergens: ["Gluten", "Garlic"],
    calories: 320,
    prepTime: "15 mins"
  },
  {
    id: 2,
    name: "Caesar Salad",
    description: "Crisp romaine lettuce, parmesan, croutons, and house-made Caesar dressing",
    price: 12.99,
    image: "/dishes/dish4.jpg",
    category: "Appetizers",
    ingredients: ["Romaine lettuce", "Parmesan cheese", "Croutons", "Caesar dressing", "Anchovies", "Lemon"],
    allergens: ["Gluten", "Dairy", "Fish"],
    calories: 280,
    prepTime: "10 mins"
  },
  {
    id: 3,
    name: "Calamari Fritti",
    description: "Lightly fried squid with marinara and lemon aioli",
    price: 16.99,
    image: "/menu/appetizer3.jpg",
    category: "Appetizers",
    ingredients: ["Fresh squid", "Flour", "Marinara sauce", "Lemon aioli", "Fresh herbs"],
    allergens: ["Gluten", "Seafood"],
    calories: 380,
    prepTime: "12 mins"
  },
  {
    id: 4,
    name: "Signature Wagyu Steak",
    description: "Premium A5 Wagyu beef, perfectly grilled with herb butter and seasonal vegetables",
    price: 89.99,
    image: "/menu/main1.jpg",
    category: "Main Courses",
    ingredients: ["A5 Wagyu beef (8oz)", "Herb butter", "Roasted potatoes", "Seasonal vegetables", "Red wine reduction", "Fresh rosemary", "Sea salt"],
    allergens: ["Dairy"],
    calories: 850,
    prepTime: "25 mins"
  },
  {
    id: 5,
    name: "Mediterranean Seafood Platter",
    description: "Fresh lobster, prawns, and scallops with lemon butter sauce",
    price: 76.99,
    image: "/menu/main2.jpg",
    category: "Main Courses",
    ingredients: ["Fresh lobster", "Tiger prawns", "Sea scallops", "Lemon butter sauce", "Herbs", "White wine"],
    allergens: ["Seafood", "Dairy"],
    calories: 680,
    prepTime: "30 mins"
  },
  {
    id: 6,
    name: "Truffle Risotto",
    description: "Creamy arborio rice infused with black truffle and parmesan",
    price: 45.99,
    image: "/menu/main3.jpg",
    category: "Main Courses",
    ingredients: ["Arborio rice", "Black truffle", "Parmesan cheese", "White wine", "Chicken stock", "Butter", "Shallots"],
    allergens: ["Dairy"],
    calories: 520,
    prepTime: "35 mins"
  },
  {
    id: 7,
    name: "Grilled Salmon",
    description: "Atlantic salmon with roasted vegetables and dill cream sauce",
    price: 42.99,
    image: "/menu/main4.jpg",
    category: "Main Courses",
    ingredients: ["Atlantic salmon", "Roasted vegetables", "Dill cream sauce", "Lemon", "Olive oil"],
    allergens: ["Fish", "Dairy"],
    calories: 580,
    prepTime: "20 mins"
  },
  {
    id: 8,
    name: "Chef's Special Pasta",
    description: "Handmade pasta with wild mushrooms and aged balsamic reduction",
    price: 38.99,
    image: "/menu/pasta1.jpg",
    category: "Pasta",
    ingredients: ["Handmade pasta", "Wild mushrooms", "Aged balsamic", "Parmesan", "Fresh herbs", "Garlic"],
    allergens: ["Gluten", "Dairy"],
    calories: 480,
    prepTime: "18 mins"
  },
  {
    id: 9,
    name: "Spaghetti Carbonara",
    description: "Classic carbonara with pancetta, egg, and pecorino romano",
    price: 32.99,
    image: "/menu/pasta2.jpg",
    category: "Pasta",
    ingredients: ["Spaghetti", "Pancetta", "Eggs", "Pecorino Romano", "Black pepper"],
    allergens: ["Gluten", "Dairy", "Eggs"],
    calories: 620,
    prepTime: "15 mins"
  },
  {
    id: 10,
    name: "Tiramisu",
    description: "Classic Italian dessert with espresso-soaked ladyfingers and mascarpone",
    price: 12.99,
    image: "/menu/dessert1.jpg",
    category: "Desserts",
    ingredients: ["Ladyfingers", "Mascarpone", "Espresso", "Cocoa powder", "Eggs", "Sugar"],
    allergens: ["Gluten", "Dairy", "Eggs"],
    calories: 420,
    prepTime: "240 mins"
  },
  {
    id: 11,
    name: "Chocolate Lava Cake",
    description: "Warm chocolate cake with molten center, vanilla ice cream",
    price: 13.99,
    image: "/menu/dessert2.jpg",
    category: "Desserts",
    ingredients: ["Dark chocolate", "Butter", "Eggs", "Sugar", "Flour", "Vanilla ice cream"],
    allergens: ["Gluten", "Dairy", "Eggs"],
    calories: 580,
    prepTime: "20 mins"
  },
  {
    id: 12,
    name: "House Wine Selection",
    description: "Ask your server about our curated wine list",
    price: 15.99,
    image: "/menu/beverage1.jpg",
    category: "Beverages",
    ingredients: ["Premium wine selection"],
    allergens: ["Sulfites"],
    calories: 120,
    prepTime: "2 mins"
  },
  {
    id: 13,
    name: "Artisan Coffee",
    description: "Freshly brewed espresso, cappuccino, or latte",
    price: 5.99,
    image: "/menu/beverage2.jpg",
    category: "Beverages",
    ingredients: ["Premium coffee beans", "Milk", "Water"],
    allergens: ["Dairy"],
    calories: 80,
    prepTime: "5 mins"
  }
];

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function DishDetailPage({ params }: PageProps) {
  // Await the params in Next.js 15+
  const resolvedParams = await params;
  const dishId = parseInt(resolvedParams.id);
  
  return <DishDetailContent dishId={dishId} />;
}   

function DishDetailContent({ dishId }: { dishId: number }) {
  const [quantity, setQuantity] = useState(1);
  const [selectedSize, setSelectedSize] = useState("Regular");
  
  const dish = menuItems.find(item => item.id === dishId);

  if (!dish) {
    return (
      <div className="min-h-screen bg-[#F5F4ED] pt-24 pb-16 flex items-center justify-center">
        <div className="text-center">
          <h1 className={`${italiana.className} text-4xl mb-4`}>Dish Not Found</h1>
          <p className="text-gray-600 mb-6">The dish you're looking for doesn't exist.</p>
          <Link href="/menu">
            <button className="px-6 py-3 bg-[#D4AF37] text-white rounded-lg hover:bg-[#B8941F] transition-colors duration-300">
              Back to Menu
            </button>
          </Link>
        </div>
      </div>
    );
  }

  const sizes = ["Small", "Regular", "Large"];
  const sizeMultipliers: { [key: string]: number } = {
    "Small": 0.75,
    "Regular": 1,
    "Large": 1.5
  };

  const calculatePrice = () => {
    return (dish.price * sizeMultipliers[selectedSize] * quantity).toFixed(2);
  };

  const addToCart = () => {
    alert(`Added ${quantity} ${selectedSize} ${dish.name} to cart!`);
  };

  // Get related dishes (same category, different dish)
  const relatedDishes = menuItems
    .filter(item => item.category === dish.category && item.id !== dish.id)
    .slice(0, 3);
    
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
          
          {/* Breadcrumb Navigation - On top of SlideBackground */}
          <div className="mb-8 flex items-center gap-2 text-white drop-shadow-lg">
            <Link href="/" className="hover:text-[#D4AF37] transition-colors font-semibold">Home</Link>
            <span>/</span>
            <Link href="/menu" className="hover:text-[#D4AF37] transition-colors font-semibold">Menu</Link>
            <span>/</span>
            <span className="text-[#D4AF37] font-semibold">{dish.name}</span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
            
            {/* Image Section - Top half on SlideBackground */}
            <div className="space-y-4">
              <div className="relative h-[500px] rounded-2xl overflow-hidden shadow-2xl backdrop-blur-sm bg-white/10 border-4 border-[#D4AF37]">
                <Image
                  src={dish.image}
                  alt={dish.name}
                  fill
                  className="object-cover"
                  priority
                />
              </div>
              
              {/* Thumbnail Gallery */}
              <div className="grid grid-cols-4 gap-4">
                {[1, 2, 3, 4].map((index) => (
                  <div key={index} className="relative h-24 rounded-lg overflow-hidden cursor-pointer border-2 border-transparent hover:border-[#D4AF37] transition-all shadow-lg">
                    <Image
                      src={dish.image}
                      alt={`${dish.name} view ${index}`}
                      fill
                      className="object-cover"
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* Details Section - On top of SlideBackground with glass effect */}
            <div className="space-y-6 backdrop-blur-md bg-white/90 p-8 rounded-2xl shadow-2xl">
              <div>
                <span className="inline-block px-4 py-1 bg-[#D4AF37] text-white rounded-full text-sm font-semibold mb-4">
                  {dish.category}
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
                  <p className="text-2xl font-bold text-[#D4AF37]">${dish.price.toFixed(2)}</p>
                </div>
                <div className="text-center border-l border-r border-gray-200">
                  <p className="text-gray-600 text-sm mb-1">Prep Time</p>
                  <p className="text-lg font-semibold">{dish.prepTime}</p>
                </div>
                <div className="text-center">
                  <p className="text-gray-600 text-sm mb-1">Calories</p>
                  <p className="text-lg font-semibold">{dish.calories} kcal</p>
                </div>
              </div>

              {/* Size Selection */}
              <div>
                <h3 className="text-lg font-semibold mb-3">Select Size</h3>
                <div className="flex gap-3">
                  {sizes.map(size => (
                    <button
                      key={size}
                      onClick={() => setSelectedSize(size)}
                      className={`flex-1 py-3 rounded-lg font-semibold transition-all duration-300 ${
                        selectedSize === size
                          ? 'bg-[#D4AF37] text-white shadow-lg'
                          : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-300'
                      }`}
                    >
                      {size}
                      <span className="block text-sm mt-1">
                        ${(dish.price * sizeMultipliers[size]).toFixed(2)}
                      </span>
                    </button>
                  ))}
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
                  <span className="text-2xl font-semibold w-16 text-center">{quantity}</span>
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
                  Add to Cart - ${calculatePrice()}
                </button>
                <button className="w-14 h-14 bg-white border-2 border-[#D4AF37] rounded-lg hover:bg-gray-50 transition-colors text-2xl">
                  ♥
                </button>
              </div>
            </div>
          </div>

          {/* Detailed Information - Below SlideBackground on solid background */}
          <div className="bg-white rounded-2xl shadow-lg p-8 mb-16">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              
              {/* Ingredients */}
              <div>
                <h3 className={`${italiana.className} text-3xl mb-4 pb-3 border-b-2 border-[#D4AF37]`}>
                  Ingredients
                </h3>
                <ul className="space-y-2">
                  {dish.ingredients?.map((ingredient, index) => (
                    <li key={index} className="flex items-center gap-3">
                      <span className="w-2 h-2 bg-[#D4AF37] rounded-full"></span>
                      <span className="text-gray-700">{ingredient}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Allergens & Nutritional Info */}
              <div>
                <h3 className={`${italiana.className} text-3xl mb-4 pb-3 border-b-2 border-[#D4AF37]`}>
                  Allergen Information
                </h3>
                <div className="space-y-4">
                  <div>
                    <p className="text-sm text-gray-600 mb-2">Contains:</p>
                    <div className="flex flex-wrap gap-2">
                      {dish.allergens?.map((allergen, index) => (
                        <span key={index} className="px-3 py-1 bg-red-100 text-red-700 rounded-full text-sm font-semibold">
                          {allergen}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div className="pt-4">
                    <p className="text-sm text-gray-600 mb-3">Nutritional Information (per serving):</p>
                    <div className="grid grid-cols-2 gap-3">
                      <div className="p-3 bg-gray-50 rounded-lg">
                        <p className="text-xs text-gray-600">Calories</p>
                        <p className="text-lg font-bold">{dish.calories}</p>
                      </div>
                      <div className="p-3 bg-gray-50 rounded-lg">
                        <p className="text-xs text-gray-600">Prep Time</p>
                        <p className="text-lg font-bold">{dish.prepTime}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
    </section>
  );
}