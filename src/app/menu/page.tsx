'use client';

import { useState } from 'react';
import Image from "next/image";
import Link from "next/link";
import SlideBackground from "@/utils/SlideBackground";
import SearchBar from "@/components/menu/SearchBar";
import Line from "@/components/decorativeComponents/Line";
import Star from "@/components/decorativeComponents/Star";

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

interface Dish {
  id: number;
  names: string;
  images: string;
  descriptions: string;
  prices: number;
}

const dishes: Dish[] = [
  {
    id: 1,
    names: "Grilled Garlic Steak",
    images: "/dishes/dish1.jpg",
    descriptions: "Juicy sirloin grilled to perfection with garlic butter and herbs, served with roasted vegetables.",
    prices: 14.99,
    //type: ["beef"]
  },
  {
    id: 2,
    names: "Lemon Herb Salmon",
    images: "/dishes/dish2.jpg",
    descriptions: "Fresh Atlantic salmon pan-seared with lemon zest and dill sauce, paired with steamed asparagus.",
    prices: 13.49,
    //type: ["fish"]
  },
  {
    id: 3,
    names: "Spicy Chicken Tacos",
    images: "/dishes/dish3.jpg",
    descriptions: "Three soft tacos filled with grilled chicken, pico de gallo, and a creamy chipotle dressing.",
    prices: 10.99,
    //type: ["chicken"]
  },
  {
    id: 4,
    names: "Classic Caesar Salad",
    images: "/dishes/dish4.jpg",
    descriptions: "Crisp romaine lettuce tossed with parmesan cheese, croutons, and Caesar dressing.",
    prices: 7.99,
    //type: ["vegetarian"]
  },
  {
    id: 5,
    names: "Beef Stroganoff",
    images: "/dishes/dish5.jpg",
    descriptions: "Tender strips of beef simmered in creamy mushroom sauce, served over buttered egg noodles.",
    prices: 12.99,
    //type: ["beef"]
  },
  {
    id: 6,
    names: "Honey BBQ Ribs",
    images: "/dishes/dish6.jpg",
    descriptions: "Slow-cooked pork ribs glazed with homemade honey BBQ sauce, served with coleslaw.",
    prices: 15.99,
    //type: ["pork"]
  },
  {
    id: 7,
    names: "Mushroom Risotto",
    images: "/dishes/dish7.jpg",
    descriptions: "Creamy Italian risotto cooked with wild mushrooms, garlic, and a hint of white wine.",
    prices: 9.99,
    //type: ["vegetarian"]
  },
  {
    id: 8,
    names: "Teriyaki Chicken Bowl",
    images: "/dishes/dish8.jpg",
    descriptions: "Grilled chicken glazed with sweet teriyaki sauce over steamed rice and sautéed vegetables.",
    prices: 11.49,
    //type: ["chicken"]
  },
  {
    id: 9,
    names: "Beef Burger Deluxe",
    images: "/dishes/dish9.jpg",
    descriptions: "Grilled beef patty topped with cheddar, lettuce, tomato, and signature sauce on a toasted bun.",
    prices: 9.49,
    //type: ["beef"]
  },
  {
    id: 10,
    names: "Mediterranean Pasta",
    images: "/dishes/dish10.jpg",
    descriptions: "Penne pasta tossed with olive oil, sun-dried tomatoes, olives, and feta cheese.",
    prices: 8.99,
    //type: ["vegetarian"]
  },
  {
    id: 11,
    names: "Mango Smoothie",
    images: "/dishes/dish11.jpg",
    descriptions: "Refreshing mango and yogurt blend with a touch of honey — perfect for a tropical vibe.",
    prices: 4.99,
    //type: ["drink"]
  },
  {
    id: 12,
    names: "Iced Caramel Latte",
    images: "/dishes/dish12.jpg",
    descriptions: "Smooth espresso with caramel syrup and milk over ice — rich and refreshing.",
    prices: 3.99,
    //type: ["drink"]
  }
];

export default function Menu() {
    const [cart, setCart] = useState<{item: Dish, quantity: number}[]>([]);
    const [showCart, setShowCart] = useState(false);

    const addToCart = (e: React.MouseEvent, dish: Dish) => {
        e.preventDefault(); // Prevent navigation when clicking "Add to Cart"
        e.stopPropagation();
        
        const existingItem = cart.find(cartItem => cartItem.item.id === dish.id);
        if (existingItem) {
            setCart(cart.map(cartItem => 
                cartItem.item.id === dish.id 
                    ? {...cartItem, quantity: cartItem.quantity + 1}
                    : cartItem
            ));
        } else {
            setCart([...cart, {item: dish, quantity: 1}]);
        }
    };

    const removeFromCart = (itemId: number) => {
        setCart(cart.filter(cartItem => cartItem.item.id !== itemId));
    };

    const updateQuantity = (itemId: number, newQuantity: number) => {
        if (newQuantity === 0) {
            removeFromCart(itemId);
        } else {
            setCart(cart.map(cartItem => 
                cartItem.item.id === itemId 
                    ? {...cartItem, quantity: newQuantity}
                    : cartItem
            ));
        }
    };

    const getTotalPrice = () => {
        return cart.reduce((total, cartItem) => 
            total + (cartItem.item.prices * cartItem.quantity), 0
        ).toFixed(2);
    };

    const getTotalItems = () => {
        return cart.reduce((total, cartItem) => total + cartItem.quantity, 0);
    };

    return (
        <div className="relative">
            <div className="absolute top-[597px] flex justify-center">
                <Image
                  src="/background/Group 14.png"
                  alt="Decorative shape"
                  width={2000}
                  height={2000}
                  className="w-[1135px] h-[764px]"
                />
            </div>

            <div className="absolute top-[1500px] w-full flex justify-center">
                <Image
                  src="/background/Group 15.png"
                  alt="Decorative shape"
                  width={2000}
                  height={2000}
                  className="w-full h-[1300px]"
                />
            </div>

            <SlideBackground
                images = {["/background/bg3.jpg", "/background/bg2.jpg", "/background/bg4.jpg"]}
                interval = {8000}
                transitionDuration = {1500}  
                className="flex-center h-[730px] w-full"
                overlay="bg-black/40 border-b-4 golden"  
            >
                <div className="relative flex-center w-[703px] h-[290px]">
                    <span className="absolute top-0 left-0 w-[230px] h-[103px] border-white border-t-8 border-l-8"/>
                    <span className="absolute bottom-0 right-0 w-[230px] h-[103px] border-white border-b-8 border-r-8"/>
                    <div className="text-center text-white">
                        <span className={`${inriaSerif.className} text-8xl`} style={{fontStyle: 'italic'}}>
                            Menu
                        </span>
                    </div>
                </div> 
            </SlideBackground>

            <SearchBar/>

            <section className="relative w-fit mx-auto text-center mt-[75px]">
                <span className={`${italiana.className} text-5xl`}>Menu</span>
                <div className="grid grid-cols-3 gap-20 mt-[66px] place-items-center">
                    {dishes.map((dish) => (
                        <Link 
                            key={dish.id}
                            href={`/menu/${dish.id}`}
                            className="block group"
                        >
                            <div className="relative bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:scale-[1.02] cursor-pointer w-[350px]">
                                {/* Image Section */}
                                <div className="relative h-64 overflow-hidden">
                                    <Image
                                        src={dish.images}
                                        alt={dish.names}
                                        fill
                                        className="object-cover group-hover:scale-110 transition-transform duration-500"
                                    />
                                    <div className="absolute inset-0 bg-black opacity-0 group-hover:opacity-20 transition-opacity duration-300" />
                                </div>
                                
                                {/* Content Section */}
                                <div className="p-6">
                                    <div className="flex justify-between items-start mb-3">
                                        <h3 className={`${italiana.className} text-2xl hover:text-[#D4AF37] transition-colors`}>
                                            {dish.names}
                                        </h3>
                                        <span className="text-xl font-bold text-[#D4AF37]">
                                            ${dish.prices.toFixed(2)}
                                        </span>
                                    </div>
                                    <p className="text-gray-600 mb-4 text-sm leading-relaxed line-clamp-2">
                                        {dish.descriptions}
                                    </p>
                                    
                                    {/* Buttons */}
                                    <div className="flex gap-2">
                                        <button
                                            onClick={(e) => addToCart(e, dish)}
                                            className="flex-1 py-3 bg-[#D4AF37] text-white rounded-lg hover:bg-[#B8941F] transition-colors duration-300 font-semibold"
                                        >
                                            Add to Cart
                                        </button>
                                        <button
                                            onClick={(e) => {
                                                e.preventDefault();
                                                e.stopPropagation();
                                            }}
                                            className="px-4 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors duration-300"
                                        >
                                            ℹ️
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
            </section>
            
            <div className="relative flex items-center justify-between w-[1134px] h-[64px] mt-[75px] mx-auto">
                <Line color="black" size={514} direction="horizontal" thinkness={3}/>
                <Star color="black" size={64}/>
                <Line color="black" size={514} direction="horizontal" thinkness={3}/>
            </div>

            {/* Floating Cart Button */}
            <button
                onClick={() => setShowCart(!showCart)}
                className="fixed bottom-8 right-8 w-16 h-16 bg-[#D4AF37] text-white rounded-full shadow-2xl hover:bg-[#B8941F] transition-all duration-300 flex items-center justify-center z-50 hover:scale-110"
            >
                <span className="text-2xl">🛒</span>
                {getTotalItems() > 0 && (
                    <span className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold animate-pulse">
                        {getTotalItems()}
                    </span>
                )}
            </button>

            {/* Cart Sidebar */}
            {showCart && (
                <div className="fixed inset-0 bg-black/50 z-50 backdrop-blur-sm" onClick={() => setShowCart(false)}>
                    <div 
                        className="fixed right-0 top-0 h-full w-full max-w-md bg-white shadow-2xl overflow-y-auto animate-slide-in"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="p-6">
                            <div className="flex justify-between items-center mb-6 pb-4 border-b-2 border-gray-200">
                                <h2 className={`${italiana.className} text-3xl`}>Your Cart</h2>
                                <button 
                                    onClick={() => setShowCart(false)}
                                    className="text-3xl hover:text-gray-600 transition-colors hover:rotate-90 duration-300"
                                >
                                    ×
                                </button>
                            </div>

                            {cart.length === 0 ? (
                                <div className="text-center py-12">
                                    <div className="text-6xl mb-4">🛒</div>
                                    <p className="text-gray-500 text-lg">Your cart is empty</p>
                                    <p className="text-gray-400 text-sm mt-2">Add some delicious items!</p>
                                </div>
                            ) : (
                                <>
                                    <div className="space-y-4 mb-6">
                                        {cart.map(cartItem => (
                                            <div key={cartItem.item.id} className="flex gap-4 p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                                                <div className="relative w-20 h-20 flex-shrink-0 rounded-lg overflow-hidden">
                                                    <Image
                                                        src={cartItem.item.images}
                                                        alt={cartItem.item.names}
                                                        fill
                                                        className="object-cover"
                                                    />
                                                </div>
                                                <div className="flex-1">
                                                    <h4 className="font-semibold mb-1 text-gray-900">{cartItem.item.names}</h4>
                                                    <p className="text-[#D4AF37] font-bold text-lg">${cartItem.item.prices.toFixed(2)}</p>
                                                    <div className="flex items-center gap-2 mt-2">
                                                        <button
                                                            onClick={() => updateQuantity(cartItem.item.id, cartItem.quantity - 1)}
                                                            className="w-8 h-8 bg-gray-200 rounded hover:bg-gray-300 transition-colors font-bold"
                                                        >
                                                            -
                                                        </button>
                                                        <span className="w-8 text-center font-semibold">{cartItem.quantity}</span>
                                                        <button
                                                            onClick={() => updateQuantity(cartItem.item.id, cartItem.quantity + 1)}
                                                            className="w-8 h-8 bg-gray-200 rounded hover:bg-gray-300 transition-colors font-bold"
                                                        >
                                                            +
                                                        </button>
                                                        <button
                                                            onClick={() => removeFromCart(cartItem.item.id)}
                                                            className="ml-auto text-red-500 hover:text-red-700 transition-colors text-xl"
                                                            title="Remove from cart"
                                                        >
                                                            🗑️
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>

                                    <div className="border-t-2 border-gray-200 pt-4 mb-6">
                                        <div className="flex justify-between text-lg mb-2">
                                            <span className="text-gray-600">Subtotal:</span>
                                            <span className="font-semibold">${getTotalPrice()}</span>
                                        </div>
                                        <div className="flex justify-between text-lg mb-2">
                                            <span className="text-gray-600">Delivery:</span>
                                            <span className="font-semibold">$5.00</span>
                                        </div>
                                        <div className="flex justify-between text-xl font-bold mb-2 pt-2 border-t border-gray-300">
                                            <span>Total:</span>
                                            <span className="text-[#D4AF37]">${(parseFloat(getTotalPrice()) + 5.00).toFixed(2)}</span>
                                        </div>
                                        <p className="text-xs text-gray-500 mt-2">*Delivery fee may vary based on location</p>
                                    </div>

                                    <Link href="/checkout_page">
                                        <button className="w-full py-4 bg-[#D4AF37] text-white rounded-lg hover:bg-[#B8941F] transition-colors duration-300 font-bold text-lg shadow-lg hover:shadow-xl">
                                            Proceed to Checkout
                                        </button>
                                    </Link>
                                    
                                    <button 
                                        onClick={() => setShowCart(false)}
                                        className="w-full py-3 mt-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors duration-300 font-semibold"
                                    >
                                        Continue Shopping
                                    </button>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            )}

            <style jsx>{`
                @keyframes slide-in {
                    from {
                        transform: translateX(100%);
                    }
                    to {
                        transform: translateX(0);
                    }
                }
                .animate-slide-in {
                    animation: slide-in 0.3s ease-out;
                }
            `}</style>
        </div>
    )
}