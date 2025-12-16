'use client';

import { useCallback, useState, useMemo, useEffect } from 'react';
import Image from "next/image";
import Link from "next/link";
import { FaStar } from "react-icons/fa";
import SlideBackground from "@/utils/SlideBackground";
import Line from "@/components/decorativeComponents/Line";
import Star from "@/components/decorativeComponents/Star";
import DishCard from '@/components/menu/Dishcard';
import { LuNotebookPen } from "react-icons/lu";
import { FaMagnifyingGlass } from "react-icons/fa6";

import { useNoteStore } from "@/stores/useNoteStore";
import menuService from "@/services/menuService";

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

export default function Menu() {
    // UI State
    const [showNote, setShowNote] = useState(false);
    const [showCustom, setShowCustom] = useState(false);
    
    // Filter State
    const [maxPrice, setMaxPrice] = useState<string>("");
    const [minPrice, setMinPrice] = useState<string>("");
    const [rating, setRating] = useState<string>("");
    const [selectedCategoryId, setSelectedCategoryId] = useState<number | null>(null);
    const [keyword, setKeyword] = useState("");

    // Data State
    const [categories, setCategories] = useState<any[]>([]);
    const [menuItems, setMenuItems] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Note Store
    const quantities = useNoteStore(s => s.quantities);
    const setQuantity = useNoteStore(s => s.setQuantity);
    const totalItems = useNoteStore(s => s.totalItems());
    const clear = useNoteStore(s => s.reset);

    const totalPrice = useMemo(
        () => menuItems.reduce((sum, d) => sum + (quantities[d.id] ?? 0) * d.price, 0),
        [menuItems, quantities]
    );

    const note = useMemo(
        () =>
            menuItems
                .map(d => ({ item: d, quantity: quantities[d.id] ?? 0 }))
                .filter(x => x.quantity > 0),
        [menuItems, quantities]
    );

    // Load categories on mount
    useEffect(() => {
        loadCategories();
    }, []);

    // Load menu items when filters change
    useEffect(() => {
        loadMenuItems();
    }, [selectedCategoryId, keyword, minPrice, maxPrice, rating]);

    const loadCategories = async () => {
        try {
            const cats = await menuService.getActiveCategories();
            setCategories(cats);
        } catch (err: any) {
            console.error('Error loading categories:', err);
            setError('Failed to load categories');
        }
    };

    const loadMenuItems = async () => {
        try {
            setLoading(true);
            setError(null);

            const filters: any = {
                keyword: keyword.trim(),
                minPrice: minPrice ? parseFloat(minPrice) : null,
                maxPrice: maxPrice ? parseFloat(maxPrice) : null,
                minRating: rating ? parseInt(rating) : 0,
                page: 0,
                size: 500,
            };

            if (selectedCategoryId !== null) {
                filters.categoryId = selectedCategoryId;
                }

            const response = await menuService.getFilteredMenuItems(filters);
            
            // Safely check response
            if (response && response.content) {
                setMenuItems(response.content);
            } else {
                setMenuItems([]);
            }

 
        } catch (err: any) {
            console.error('Error loading menu items:', err);
            setError('Failed to load menu items');
            setMenuItems([]);
        } finally {
            setLoading(false);
        }
    };

    const handleQuantityChange = (id: number, nextQty: number) => {
        setQuantity(id, Math.max(0, nextQty));
    };

    const handleCategoryChange = (categoryId: number | null) => {
        setSelectedCategoryId(categoryId);
    };

    // Get selected category name for display
    const selectedCategoryName = useMemo(() => {
        if (!selectedCategoryId) return "Menu";
        const cat = categories.find(c => c.id === selectedCategoryId);
        return cat?.name || "Menu";
    }, [selectedCategoryId, categories]);

    return (
        <div className="relative">
            <SlideBackground
                images={["/background/bg3.jpg", "/background/bg2.jpg", "/background/bg4.jpg"]}
                interval={8000}
                transitionDuration={1500}
                className="flex-center h-screen w-full"
                overlay="bg-black/40 border-b-4 golden"
            >
                <div className="relative flex-center w-[703px] h-[290px]">
                    <span className="absolute top-0 left-0 w-[230px] h-[103px] border-white border-t-8 border-l-8" />
                    <span className="absolute bottom-0 right-0 w-[230px] h-[103px] border-white border-b-8 border-r-8" />
                    <div className="text-center text-white">
                        <span className={`${inriaSerif.className} text-8xl`} style={{ fontStyle: 'italic' }}>
                            Menu
                        </span>
                    </div>
                </div>
            </SlideBackground>

            <div className="relative pb-8">
                <section className="sticky top-[55px] flex items-center w-full h-[50px] border-t-3 border-[#FBBF24] bg-black/75 z-10">
                    <div className="flex items-center justify-between w-full px-10">
                        <div className="flex flex-row gap-5">
                            <button
                                onClick={() => setShowCustom(!showCustom)}
                                className="flex-center w-[150px] h-[30px] bg-white rounded-2xl text-xl transition duration-200 hover:opacity-90">
                                Custom
                            </button>
                            <button
                                onClick={clear}
                                className="w-[150px] h-[30px] bg-white text-xl rounded-2xl transition duration-200 hover:opacity-90"
                            >
                                Clear order
                            </button>
                        </div>
                        <div className="flex flex-row gap-2">
                            <input
                                type="string"
                                value={keyword}
                                onChange={(e) => setKeyword(e.target.value)}
                                className="flex-center w-[225px] h-[30px] border-black rounded-2xl text-black text-lg px-2 bg-white outline-none"
                                placeholder="Search. . ."
                            />
                            <div className="flex-center w-[30px] h-[30px] bg-white rounded-full">
                                <FaMagnifyingGlass />
                            </div>
                        </div>
                    </div>
                </section>

                <div className="relative flex items-center justify-between w-[1134px] h-[64px] mt-[50px] mx-auto">
                    <Line color="black" size={514} direction="horizontal" thinkness={3} />
                    <Star color="black" size={64} />
                    <Line color="black" size={514} direction="horizontal" thinkness={3} />
                </div>

                <section className="relative w-full h-fit mx-auto text-center mt-[75px]">
                    <div
                        className="absolute inset-x-0 -top-[458px] h-[700px] bg-no-repeat -z-10"
                        style={{ backgroundImage: "url('/background/Group 14.png')" }}
                        aria-hidden="true"
                    />
                    
                    {/* Category Buttons */}
                    <div className="relavtive flex flex-row gap-8 flex-center mb-[66px]">
                        <button
                            onClick={() => handleCategoryChange(null)}
                            className={`text-lg h-[45px] border-black border-2 px-5 transition duration-250
                                ${!selectedCategoryId ? "bg-black golden" : "bg-[#F4F5ED] text-black hover:bg-black hover:text-white"}`}
                        >
                            All
                        </button>
                        {categories?.map((cat) => (
                            <button
                                key={cat.id}
                                onClick={() => handleCategoryChange(cat.id)}
                                className={`text-lg h-[45px] border-black border-2 px-5 transition duration-250
                                    ${selectedCategoryId === cat.id ? "bg-black golden" : "bg-[#F4F5ED] text-black hover:bg-black hover:text-white"}`}
                            >
                                {cat.name}
                            </button>
                        ))}
                    </div>

                    <span className={`${italiana.className} text-5xl capitalize`}>
                        {selectedCategoryName}
                    </span>

                    {/* Loading State */}
                    {loading ? (
                        <div className="flex-center text-gray-500 text-xl mt-10">
                            Loading menu items...
                        </div>
                    ) : error ? (
                        <div className="flex-center text-red-500 text-xl mt-10">
                            {error}
                        </div>
                    ) : menuItems.length <= 0 ? (
                        <div className="flex-center text-gray-500 text-xl mt-10">
                            There is no dish match the demand.
                        </div>
                    ) : (
                        <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-20 w-fit mt-[66px] mx-auto place-items-center">
                            {menuItems.map((dish, i) => (
                                <div key={dish.id}>
                                    <DishCard
                                        id={dish.id}
                                        names={dish.name}
                                        images={dish.imageUrl}
                                        descriptions={dish.description}
                                        price={dish.price}
                                        categories={dish.category ? [dish.category.name] : []}
                                        rating={dish.rating}
                                        quantity={quantities[dish.id] ?? 0}
                                        onQuantityChange={handleQuantityChange}
                                    />
                                    {i === 6 && (
                                        <div
                                            className="absolute inset-y-0 top-50 -left-2 w-full h-full bg-no-repeat -z-10"
                                            style={{
                                                backgroundImage: "url('/background/Group 15.png')",
                                                backgroundSize: "115% 90%",
                                            }}
                                            aria-hidden="true"
                                        />
                                    )}
                                </div>
                            ))}
                        </div>
                    )}
                </section>

                <div className="relative flex items-center justify-between w-[1134px] h-[64px] mt-[75px] mb-[50px] mx-auto">
                    <Line color="black" size={514} direction="horizontal" thinkness={3} />
                    <Star color="black" size={64} />
                    <Line color="black" size={514} direction="horizontal" thinkness={3} />
                </div>

                {/* Order Note Modal */}
                {showNote && (
                    <div
                        className="fixed inset-0 bg-black/20 z-50"
                        onClick={() => setShowNote(!showNote)}
                    >
                        <div
                            className={`fixed right-0 top-0 h-full w-full max-w-xl creamy-white-bg shadow-2xl animate-slide-in `}
                            onClick={(e) => e.stopPropagation()}>
                            <div className={`fixed flex-center top-0 w-xl h-[65px] creamy-white-bg border-b-1 ${italiana.className} text-3xl z-20`}>Your Order</div>
                            {note.length <= 0 ? (
                                <div className="creamy-white-bg absolute flex-center inset-x-0 gap-[11px] top-[65px] bottom-[65px] text-gray-500 w-full">Your order is currently empty</div>
                            ) : (
                                <div className="creamy-white-bg absolute inset-x-0 flex flex-col gap-[11px] top-[65px] bottom-[65px] w-full overflow-y-auto scrollbar-hide">
                                    {note.map(({ item, quantity }, i) => (
                                        <div
                                            key={item.id}
                                            className="relative flex justify-between p-3 border-t-1 border-b-1 ">

                                            <div className="flex flex-row gap-2.5">
                                                <div className="relative w-[150px] h-[100px]">
                                                    <Image
                                                        src={item.imageUrl || '/dishes/placeholder.jpg'}
                                                        alt="dishes"
                                                        fill
                                                        className="flex items-center object-cover transition duration-200 hover:scale-105"
                                                    />
                                                </div>

                                                <div className="flex flex-col gap-10">
                                                    <span className="text-xl">{item.name}</span>

                                                    <div className="flex flex-row gap-2">
                                                        <button
                                                            onClick={(e) => { e.stopPropagation(); setQuantity(item.id, quantity + 1) }}
                                                            className="flex-center w-[25px] h-[25px] border-1 rounded-[5px] transition duration-100 hover:scale-102">
                                                            +
                                                        </button>
                                                        <span className="min-w-[24px] text-center">{quantity}</span>
                                                        <button
                                                            onClick={(e) => { e.stopPropagation(); setQuantity(item.id, Math.max(0, quantity - 1)) }}
                                                            className="flex-center w-[25px] h-[25px] border-1 rounded-[5px] transition duration-100 hover:scale-102">
                                                            -
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="flex flex-col justify-end text-end">
                                                <span className="">{item.price}$</span>
                                                <span className="text-xl">{(quantity * item.price).toFixed(2)}$</span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}

                            <div className={`fixed flex justify-between items-center px-3 bottom-0 w-xl h-[65px] creamy-white-bg border-t-1 text-2xl z-20`}>
                                <div className="relative w-fit flex justify-end items-center gap-2.5">
                                    {note.length > 0 &&
                                        <Link
                                            href="/checkout_page"
                                            className="flex-center w-[150px] h-[35px] p-2 text-xl bg-[#E0E0D9] border-1 rounded-2xl transition duration-150 hover:scale-105"
                                        >
                                            Comfirm
                                        </Link>
                                    }
                                    <span className="text-xl">Dishes: {totalItems}(s)</span>
                                </div>
                                <span>Total: {totalPrice.toFixed(2)}$</span>
                            </div>
                        </div>
                    </div>
                )}

                {/* Floating Order Button */}
                <button
                    className="sticky bottom-10 w-full flex justify-end pr-8"
                    onClick={() => setShowNote(!showNote)}>
                    <div className="relative w-16 h-16 bg-[#D4AF37] text-white rounded-full shadow-2xl hover:bg-[#B8941F] transition-all duration-300 flex items-center justify-center z-50 hover:scale-110">
                        <LuNotebookPen size={30} color="#F5F4ED" />
                        {totalItems > 0 &&
                            <div className="absolute flex-center top-2.5 right-2.5 w-[20px] h-[20px] bg-red-600 rounded-full text-sm font-medium z-0">
                                {totalItems}
                            </div>
                        }
                    </div>
                </button>

                {/* Custom Filter Modal */}
                {showCustom && (
                    <div
                        className="fixed inset-0 bg-black/20 backdrop-blur-[5px] z-50"
                        onClick={() => setShowCustom(!showCustom)}
                    >
                        <div
                            className={`fixed top-1/2 left-1/2 h-[650px] w-full max-w-lg creamy-white-bg shadow-2xl overflow-y-auto transform -translate-x-1/2 -translate-y-1/2 animate-slide-up`}
                            onClick={(e) => e.stopPropagation()}>
                            <div className={`top-0 flex-center w-full h-[80px] creamy-white-bg  ${italiana.className} border-b-2 border-black text-3xl z-20`}>Customization</div>
                            <div className="w-full h-fit px-11 py-5">
                                <label className="text-2xl">Price ($):</label>
                                <div className="flex-center mt-2">
                                    <input
                                        type="number"
                                        min="0"
                                        value={minPrice}
                                        onChange={(e) => setMinPrice(e.target.value)}
                                        className="w-[140px] h-[34px] border border-black rounded text-black text-sm text-center bg-[#F5F4ED] outline-none"
                                        placeholder="e.g. 2"
                                    />
                                    <span className="text-xl mx-3">{"<"}</span>
                                    <span className="text-lg">Between</span>
                                    <span className="text-xl mx-3">{"<"}</span>

                                    <input
                                        type="number"
                                        min="0"
                                        value={maxPrice}
                                        onChange={(e) => setMaxPrice(e.target.value)}
                                        className="w-[140px] h-[34px] border border-black rounded text-black text-sm text-center bg-[#F5F4ED] outline-none"
                                        placeholder="e.g. 14"
                                    />
                                </div>
                            </div>
                            <div className="flex-center">
                                <Line color="black" size={450} thinkness={1} direction='horizontal' />
                            </div>
                            <div className="w-full h-fit px-11 py-5">
                                <label className="text-2xl">Rating:</label>
                                <div className="flex flex-row gap-5 justify-center mt-2">
                                    <button
                                        onClick={() => setRating("1")}
                                        className={`${Number(rating) >= 1 ? "text-[#FBBF24]" : "text-[#F4F5ED]"} transition duration-200 hover:scale-115 `}
                                    >
                                        <FaStar stroke="#FBBF24" strokeWidth={10} size={40} />
                                    </button>
                                    <button
                                        onClick={() => setRating("2")}
                                        className={`${Number(rating) >= 2 ? "text-[#FBBF24]" : "text-[#F4F5ED]"} transition duration-200 hover:scale-115 `}
                                    >
                                        <FaStar stroke="#FBBF24" strokeWidth={10} size={40} />
                                    </button>
                                    <button
                                        onClick={() => setRating("3")}
                                        className={`${Number(rating) >= 3 ? "text-[#FBBF24]" : "text-[#F4F5ED]"} transition duration-200 hover:scale-115 `}
                                    >
                                        <FaStar stroke="#FBBF24" strokeWidth={10} size={40} />
                                    </button>
                                    <button
                                        onClick={() => setRating("4")}
                                        className={`${Number(rating) >= 4 ? "text-[#FBBF24]" : "text-[#F4F5ED]"} transition duration-200 hover:scale-115 `}
                                    >
                                        <FaStar stroke="#FBBF24" strokeWidth={10} size={40} />
                                    </button>
                                    <button
                                        onClick={() => setRating("5")}
                                        className={`${Number(rating) >= 5 ? "text-[#FBBF24]" : "text-[#F4F5ED]"} transition duration-200 hover:scale-115 `}
                                    >
                                        <FaStar stroke="#FBBF24" strokeWidth={10} size={40} />
                                    </button>
                                </div>
                            </div>
                            <div className="flex-center">
                                <Line color="black" size={450} thinkness={1} direction='horizontal' />
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

                <style jsx>{`
                     @keyframes slide-up {
                         from {
                             transform: translateY(100%);
                         }
                         to {
                             transform: translateY(0);
                         }
                     }
                     .animate-slide-up {
                         animation: slide-up 0.3s ease-out;
                     }
                 `}</style>
            </div>
        </div>
    )
}