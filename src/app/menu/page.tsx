'use client';

import { useCallback, useState,  useMemo } from 'react';
import Image from "next/image";
import Link from "next/link";
import { FaStar } from "react-icons/fa";
import SlideBackground from "@/utils/SlideBackground";
import SearchBar from "@/components/menu/SearchBar";
import Line from "@/components/decorativeComponents/Line";
import Star from "@/components/decorativeComponents/Star";
import DishCard from '@/components/menu/Dishcard';
import { LuNotebookPen } from "react-icons/lu";
import { FaMagnifyingGlass } from "react-icons/fa6";

import { useNoteStore } from "@/stores/useNoteStore";

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

const dishes: Dish[] = [
  {
    id: 1,
    name: "Grilled Garlic Steak",
    image: "/dishes/dish1.jpg",
    description: "Juicy sirloin grilled to perfection with garlic butter and herbs, served with roasted vegetables.",
    price: 14.99,
    rating: 5,
    categories: ["beef"]
  },
  {
    id: 2,
    name: "Lemon Herb Salmon",
    image: "/dishes/dish2.jpg",
    description: "Fresh Atlantic salmon pan-seared with lemon zest and dill sauce, paired with steamed asparagus.",
    price: 13.49,
    rating: 5,
    categories: ["fish"]
  },
  {
    id: 3,
    name: "Spicy Chicken Tacos",
    image: "/dishes/dish3.jpg",
    description: "Three soft tacos filled with grilled chicken, pico de gallo, and a creamy chipotle dressing.",
    price: 10.99,
    rating: 1,
    categories: ["chicken"]
  },
  {
    id: 4,
    name: "Classic Caesar Salad",
    image: "/dishes/dish4.jpg",
    description: "Crisp romaine lettuce tossed with parmesan cheese, croutons, and Caesar dressing.",
    price: 7.99,
    rating: 5,
    categories: ["vegetarian"]
  },
  {
    id: 5,
    name: "Beef Stroganoff",
    image: "/dishes/dish5.jpg",
    description: "Tender strips of beef simmered in creamy mushroom sauce, served over buttered egg noodles.",
    price: 12.99,
    rating: 5,
    categories: ["beef"]
  },
  {
    id: 6,
    name: "Honey BBQ Ribs",
    image: "/dishes/dish6.jpg",
    description: "Slow-cooked pork ribs glazed with homemade honey BBQ sauce, served with coleslaw.",
    price: 15.99,
    rating: 3,
    categories: ["pork"]
  },
  {
    id: 7,
    name: "Mushroom Risotto",
    image: "/dishes/dish7.jpg",
    description: "Creamy Italian risotto cooked with wild mushrooms, garlic, and a hint of white wine.",
    price: 9.99,
    rating: 5,
    categories: ["vegetarian"]
  },
  {
    id: 8,
    name: "Teriyaki Chicken Bowl",
    image: "/dishes/dish8.jpg",
    description: "Grilled chicken glazed with sweet teriyaki sauce over steamed rice and sautéed vegetables.",
    price: 11.49,
    rating: 3,
    categories: ["chicken"]
  },
  {
    id: 9,
    name: "Beef Burger Deluxe",
    image: "/dishes/dish9.jpg",
    description: "Grilled beef patty topped with cheddar, lettuce, tomato, and signature sauce on a toasted bun.",
    price: 9.49,
    rating: 5,
    categories: ["beef"]
  },
  {
    id: 10,
    name: "Mediterranean Pasta",
    image: "/dishes/dish10.jpg",
    description: "Penne pasta tossed with olive oil, sun-dried tomatoes, olives, and feta cheese.",
    price: 8.99,
    rating: 5,
    categories: ["vegetarian"]
  },
  {
    id: 11,
    name: "Mango Smoothie",
    image: "/dishes/dish11.jpg",
    description: "Refreshing mango and yogurt blend with a touch of honey — perfect for a tropical vibe.",
    price: 4.99,
    rating: 4,
    categories: ["drink"]
  },
  {
    id: 12,
    name: "Iced Caramel Latte",
    image: "/dishes/dish12.jpg",
    description: "Smooth espresso with caramel syrup and milk over ice — rich and refreshing.",
    price: 3.99,
    rating: 4,
    categories: ["drink"]
  }
];

export default function Menu() {
    const [showNote, setShowNote] = useState(false)
    const [showCustom, setShowCustom] = useState(false)
    
    const [maxPrice, setMaxPrice] = useState<string>("");
    const [minPrice, setMinPrice] = useState<string>("");
    const [rating, setRating] = useState<string>("")
    const [category, setCate] = useState("all")
    const [keyword, setKeyword] = useState("")

    const quantities = useNoteStore(s => s.quantities);
    const setQuantity = useNoteStore(s => s.setQuantity);
    const totalItems = useNoteStore(s => s.totalItems());
    const totalPrice = useMemo(
        () => dishes.reduce((sum, d) => sum + (quantities[d.id] ?? 0) * d.price, 0),
        [dishes, quantities]
    );
    const clear = useNoteStore(s => s.reset);

    const handleQuantityChange = (id: number, nextQty: number) => {
        setQuantity(id, Math.max(0, nextQty)); 
    };

    const note = useMemo(
        () =>
            dishes
            .map(d => ({ item: d, quantity: quantities[d.id] ?? 0 }))
            .filter(x => x.quantity > 0),
        [quantities]
    );

    const filteredDishes = useMemo(() => {
        const maxCap = maxPrice === "" ? Infinity : Number(maxPrice);
        const safeMaxCap = Number.isFinite(maxCap) ? maxCap : Infinity;

        const minCap = minPrice === "" ? 0 : Number(minPrice);
        const safeMinCap = Number.isFinite(minCap) ? minCap : 0;
        
        const rawRate = rating === "" ? 0 : Number(rating);
        const safeRate = Number.isFinite(rawRate)
            ? Math.min(5, Math.max(0, rawRate))
            : 0;

        const searchedDish = dishes.filter(
            d =>
                (keyword === "all" || d.name.toLowerCase().includes(keyword.toLowerCase())) &&
                (category === "all" || d.categories?.includes(category))
        );
        // const byKeyword = keyword === "all"
        //     ? dishes
        //     : dishes.filter(d => d.name.toLowerCase().includes(keyword.toLowerCase()))

        // const byCategory = category === "all"
        //     ? byKeyword
        //     : byKeyword.filter(d => d.categories?.includes(category));
        return searchedDish.filter(d => d.price <= safeMaxCap && d.price >= safeMinCap && d.rating >= safeRate);
    }, [category, keyword, minPrice, maxPrice, rating]);

    

    // const addToCart = (e: React.MouseEvent, dish: Dish) => {
    //     e.preventDefault(); // Prevent navigation when clicking "Add to Cart"
    //     e.stopPropagation();
        
    //     const existingItem = note.find(noteItem => noteItem.item.id === dish.id);
    //     if (existingItem) {
    //         setNote(note.map(noteItem => 
    //             noteItem.item.id === dish.id 
    //                 ? {...noteItem, quantity: noteItem.quantity + 1}
    //                 : noteItem
    //         ));
    //     } else {
    //         setNote([...note, {item: dish, quantity: 1}]);
    //     }
    // };

    // const removeFromNote = (itemId: number) => {
    //     setNote(note.filter(noteItem => noteItem.item.id !== itemId));
    // };

    // const updateQuantity = (itemId: number, newQuantity: number) => {
    //     if (newQuantity === 0) {
    //         removeFromNote(itemId);
    //     } else {
    //         setNote(note.map(cartItem => 
    //             cartItem.item.id === itemId 
    //                 ? {...cartItem, quantity: newQuantity}
    //                 : cartItem
    //         ));
    //     }
    // };

    // const getTotalPrice = () => {
    //     return cart.reduce((total, cartItem) => 
    //         total + (cartItem.item.prices * cartItem.quantity), 0
    //     ).toFixed(2);
    // };

    // const getTotalItems = () => {
    //     return cart.reduce((total, cartItem) => total + cartItem.quantity, 0);
    // };

    return (
        <div className="relative">

            <SlideBackground
                images = {["/background/bg3.jpg", "/background/bg2.jpg", "/background/bg4.jpg"]}
                interval = {8000}
                transitionDuration = {1500}  
                className="flex-center h-screen w-full"
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
                    <Line color="black" size={514} direction="horizontal" thinkness={3}/>
                    <Star color="black" size={64}/>
                    <Line color="black" size={514} direction="horizontal" thinkness={3}/>
                </div>
                
                <section className="relative w-full h-fit mx-auto text-center mt-[75px]">
                    <div
                        className="absolute inset-x-0 -top-[235px] h-[700px] bg-no-repeat -z-10"
                        style={{ backgroundImage: "url('/background/Group 14.png')" }}
                        aria-hidden="true"
                    />
                    <div className="relavtive flex flex-row gap-8 flex-center mb-[66px]">
                        <button
                            onClick={() => {setCate("all"); console.log(category)}}
                            className={`text-lg h-[45px] border-black border-2 px-5 transition duration-250
                                ${category === "all" ? "bg-black golden" : "bg-[#F4F5ED] text-black hover:bg-black hover:text-white"}`}
                        >
                            All
                        </button>
                        <button
                            onClick={() => {setCate("appertizers"); console.log(category)}}
                            className={`text-lg h-[45px] border-black border-2 px-5 transition duration-250
                                ${category === "appertizers" ? "bg-black golden" : "bg-[#F4F5ED] text-black hover:bg-black hover:text-white"}`}
                        >
                            Appertizers
                        </button>
                        <button
                            onClick={() => {setCate("main course"); console.log(category)}}
                            className={`text-lg h-[45px] border-black border-2 px-5 transition duration-250
                                ${category === "main course" ? "bg-black golden" : "bg-[#F4F5ED] text-black hover:bg-black hover:text-white"}`}
                        >
                            Main Course
                        </button>
                        <button
                            onClick={() => {setCate("dessert"); console.log(category)}}
                            className={`text-lg h-[45px] border-black border-2 px-5 transition duration-250
                                ${category === "dessert" ? "bg-black golden" : "bg-[#F4F5ED] text-black hover:bg-black hover:text-white"}`}
                        >
                            Dessert
                        </button>
                        <button
                            onClick={() => {setCate("vegetarian"); console.log(category)}}
                            className={`text-lg h-[45px] border-black border-2 px-5 transition duration-250
                                ${category === "vegetarian" ? "bg-black golden" : "bg-[#F4F5ED] text-black hover:bg-black hover:text-white"}`}
                        >
                            Vegetarian
                        </button>
                        <button
                            onClick={() => {setCate("drink"); console.log(category)}}
                            className={`text-lg h-[45px] border-black border-2 px-5 transition duration-250
                                ${category === "drink" ? "bg-black golden" : "bg-[#F4F5ED] text-black hover:bg-black hover:text-white"}`}
                        >
                            Drink   
                        </button>
                        
                    </div>
                    
                    <span className={`${italiana.className} text-5xl capitalize`}>
                        {category === "all" ? "Menu" : category}
                    </span>
                        {filteredDishes.length <= 0 ? (
                        <div className="flex-center text-gray-500 text-xl mt-10">
                            There is no dish match the demand.
                        </div>
                        ) : (
                        <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-20 w-fit mt-[66px] mx-auto place-items-center">
                            {filteredDishes.map((dish, i) => (
                                <div key={dish.id}>
                                    <DishCard
                                    id={dish.id}
                                    name={dish.name}
                                    image={dish.image}
                                    description={dish.description}
                                    price={dish.price}
                                    categories={dish.categories}
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

                         {/*     <Link 
                        //         key={dish.id}
                        //         href={`/menu/${dish.id}`}
                        //         className="block group"
                        //     >
                        //         <div className="relative bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:scale-[1.02] cursor-pointer w-[350px]">
                        //             <div className="relative h-64 overflow-hidden">
                        //                 <Image
                        //                     src={dish.images}
                        //                     alt={dish.names}
                        //                     fill
                        //                     className="object-cover group-hover:scale-110 transition-transform duration-500"
                        //                 />
                        //                 <div className="absolute inset-0 bg-black opacity-0 group-hover:opacity-20 transition-opacity duration-300" />
                        //             </div>
                                    
                        //             <div className="p-6">
                        //                 <div className="flex justify-between items-start mb-3">
                        //                     <h3 className={`${italiana.className} text-2xl hover:text-[#D4AF37] transition-colors`}>
                        //                         {dish.names}
                        //                     </h3>
                        //                     <span className="text-xl font-bold text-[#D4AF37]">
                        //                         ${dish.prices.toFixed(2)}
                        //                     </span>
                        //                 </div>
                        //                 <p className="text-gray-600 mb-4 text-sm leading-relaxed line-clamp-2">
                        //                     {dish.descriptions}
                        //                 </p>
                                        
                        //                 <div className="flex gap-2">
                        //                     <button
                        //                         onClick={(e) => addToCart(e, dish)}
                        //                         className="flex-1 py-3 bg-[#D4AF37] text-white rounded-lg hover:bg-[#B8941F] transition-colors duration-300 font-semibold"
                        //                     >
                        //                         Add to Cart
                        //                     </button>
                        //                     <button
                        //                         onClick={(e) => {
                        //                             e.preventDefault();
                        //                             e.stopPropagation();
                        //                         }}
                        //                         className="px-4 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors duration-300"
                        //                     >
                        //                         ℹ️
                        //                     </button>
                        //                 </div>
                        //             </div>
                        //         </div>
                        // </Link>*/}
                        
                </section>
                
                <div className="relative flex items-center justify-between w-[1134px] h-[64px] mt-[75px] mb-[50px] mx-auto">
                    <Line color="black" size={514} direction="horizontal" thinkness={3}/>
                    <Star color="black" size={64}/>
                    <Line color="black" size={514} direction="horizontal" thinkness={3}/>
                </div>

                {showNote && 
                    <div 
                    className="fixed inset-0 bg-black/20 z-50"
                    onClick={() => setShowNote(!showNote)}
                    >
                        <div 
                        className={`fixed right-0 top-0 h-full w-full max-w-xl creamy-white-bg shadow-2xl animate-slide-in `}
                        onClick={(e) => e.stopPropagation()}>
                            <div className={`fixed flex-center top-0 w-xl h-[65px] creamy-white-bg border-b-1 ${italiana.className} text-3xl z-20`}>Your Order</div>
                                {note.length <= 0 ? (
                                    <div className="absolute flex-center inset-x-0 gap-[11px] top-[65px] bottom-[65px] text-gray-500 w-full">Your order is currently empty</div>
                                ) : (
                                    <div className="absolute inset-x-0 flex flex-col gap-[11px] top-[65px] bottom-[65px] w-full overflow-y-auto scrollbar-hide">
                                    {note.map(({item, quantity}, i) => (
                                        <div 
                                        key={item.id}
                                        className="relative flex justify-between p-3 border-t-1 border-b-1 ">
                                            
                                                <div className="flex flex-row gap-2.5">
                                                    <div className="relative w-[150px] h-[100px]">
                                                        <Image
                                                            src={item.image}
                                                            alt="dishes"
                                                            fill
                                                            className="flex items-center object-cover transition duration-200 hover:scale-105"
                                                        />
                                                    </div>

                                                    <div className="flex flex-col gap-10">
                                                        <span className="text-xl">{item.name}</span>
                                            
                                                        <div className="flex flex-row gap-2">
                                                            <button 
                                                            onClick={(e) => {e.stopPropagation(); setQuantity(item.id, quantity+1)}}
                                                            className="flex-center w-[25px] h-[25px] border-1 rounded-[5px] transition duration-100 hover:scale-102">
                                                                +
                                                            </button>
                                                            <span className="min-w-[24px] text-center">{quantity}</span>
                                                            <button 
                                                            onClick={(e) => {e.stopPropagation(); setQuantity(item.id, Math.max(0, quantity-1))}}
                                                            className="flex-center w-[25px] h-[25px] border-1 rounded-[5px] transition duration-100 hover:scale-102">
                                                                -
                                                            </button>
                                                        </div>
                                                    </div> 
                                                </div>
                                                <div className="flex flex-col justify-end text-end">
                                                    <span className="">{item.price}$</span>                                   
                                                    <span className="text-xl">{(quantity*item.price).toFixed(2)}$</span>                                   
                                                </div>
                                        </div>
                                    ))}
                                    </div>
                                )}
                                
                                
                            <div className={`fixed flex justify-between items-center px-3 bottom-0 w-xl h-[65px] creamy-white-bg border-t-1 text-2xl z-20`}>
                                <div className="relative w-fit flex justify-end items-center gap-2.5">
                                    {note.length > 0 && 
                                        <Link
                                            href="/"
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
                }
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
                

                {showCustom && 
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
                                        <FaStar stroke="#FBBF24" strokeWidth={10} size={40}/>
                                    </button>
                                    <button
                                    onClick={() => setRating("2")}
                                    className={`${Number(rating) >= 2 ? "text-[#FBBF24]" : "text-[#F4F5ED]"} transition duration-200 hover:scale-115 `}
                                    >
                                        <FaStar stroke="#FBBF24" strokeWidth={10} size={40}/>
                                    </button>
                                    <button
                                    onClick={() => setRating("3")}
                                    className={`${Number(rating) >= 3 ? "text-[#FBBF24]" : "text-[#F4F5ED]"} transition duration-200 hover:scale-115 `}
                                    >
                                        <FaStar stroke="#FBBF24" strokeWidth={10} size={40}/>
                                    </button>
                                    <button
                                    onClick={() => setRating("4")}
                                    className={`${Number(rating) >= 4 ? "text-[#FBBF24]" : "text-[#F4F5ED]"} transition duration-200 hover:scale-115 `}
                                    >
                                        <FaStar stroke="#FBBF24" strokeWidth={10} size={40}/>
                                    </button>
                                    <button
                                    onClick={() => setRating("5")}
                                    className={`${Number(rating) >= 5 ? "text-[#FBBF24]" : "text-[#F4F5ED]"} transition duration-200 hover:scale-115 `}
                                    >
                                        <FaStar stroke="#FBBF24" strokeWidth={10} size={40}/>
                                    </button>
                                    
                                </div>
                            </div>
                            <div className="flex-center">
                                <Line color="black" size={450} thinkness={1} direction='horizontal' />
                            </div>
                        </div>
                    </div>
                }
                {/* // <button
                //     onClick={() => setShowCart(!showCart)}
                //     className="fixed bottom-8 right-8 w-16 h-16 bg-[#D4AF37] text-white rounded-full shadow-2xl hover:bg-[#B8941F] transition-all duration-300 flex items-center justify-center z-50 hover:scale-110"
                // >
                //     <span className="text-2xl">🛒</span>
                //     {getTotalItems() > 0 && (
                //         <span className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold animate-pulse">
                //             {getTotalItems()}
                //         </span>
                //     )}
                // </button> */}

                {/* // {showCart && (
                //     <div className="fixed inset-0 bg-black/50 z-50 backdrop-blur-sm" onClick={() => setShowCart(false)}>
                //         <div 
                //             className="fixed right-0 top-0 h-full w-full max-w-md bg-white shadow-2xl overflow-y-auto animate-slide-in"
                //             onClick={(e) => e.stopPropagation()}
                //         >
                //             <div className="p-6">
                //                 <div className="flex justify-between items-center mb-6 pb-4 border-b-2 border-gray-200">
                //                     <h2 className={`${italiana.className} text-3xl`}>Your Cart</h2>
                //                     <button 
                //                         onClick={() => setShowCart(false)}
                //                         className="text-3xl hover:text-gray-600 transition-colors hover:rotate-90 duration-300"
                //                     >
                //                         ×
                //                     </button>
                //                 </div>

                //                 {cart.length === 0 ? (
                //                     <div className="text-center py-12">
                //                         <div className="text-6xl mb-4">🛒</div>
                //                         <p className="text-gray-500 text-lg">Your cart is empty</p>
                //                         <p className="text-gray-400 text-sm mt-2">Add some delicious items!</p>
                //                     </div>
                //                 ) : (
                //                     <>
                //                         <div className="space-y-4 mb-6">
                //                             {cart.map(cartItem => (
                //                                 <div key={cartItem.item.id} className="flex gap-4 p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                //                                     <div className="relative w-20 h-20 flex-shrink-0 rounded-lg overflow-hidden">
                //                                         <Image
                //                                             src={cartItem.item.images}
                //                                             alt={cartItem.item.names}
                //                                             fill
                //                                             className="object-cover"
                //                                         />
                //                                     </div>
                //                                     <div className="flex-1">
                //                                         <h4 className="font-semibold mb-1 text-gray-900">{cartItem.item.names}</h4>
                //                                         <p className="text-[#D4AF37] font-bold text-lg">${cartItem.item.prices.toFixed(2)}</p>
                //                                         <div className="flex items-center gap-2 mt-2">
                //                                             <button
                //                                                 onClick={() => updateQuantity(cartItem.item.id, cartItem.quantity - 1)}
                //                                                 className="w-8 h-8 bg-gray-200 rounded hover:bg-gray-300 transition-colors font-bold"
                //                                             >
                //                                                 -
                //                                             </button>
                //                                             <span className="w-8 text-center font-semibold">{cartItem.quantity}</span>
                //                                             <button
                //                                                 onClick={() => updateQuantity(cartItem.item.id, cartItem.quantity + 1)}
                //                                                 className="w-8 h-8 bg-gray-200 rounded hover:bg-gray-300 transition-colors font-bold"
                //                                             >
                //                                                 +
                //                                             </button>
                //                                             <button
                //                                                 onClick={() => removeFromCart(cartItem.item.id)}
                //                                                 className="ml-auto text-red-500 hover:text-red-700 transition-colors text-xl"
                //                                                 title="Remove from cart"
                //                                             >
                //                                                 🗑️
                //                                             </button>
                //                                         </div>
                //                                     </div>
                //                                 </div>
                //                             ))}
                //                         </div>

                //                         <div className="border-t-2 border-gray-200 pt-4 mb-6">
                //                             <div className="flex justify-between text-lg mb-2">
                //                                 <span className="text-gray-600">Subtotal:</span>
                //                                 <span className="font-semibold">${getTotalPrice()}</span>
                //                             </div>
                //                             <div className="flex justify-between text-lg mb-2">
                //                                 <span className="text-gray-600">Delivery:</span>
                //                                 <span className="font-semibold">$5.00</span>
                //                             </div>
                //                             <div className="flex justify-between text-xl font-bold mb-2 pt-2 border-t border-gray-300">
                //                                 <span>Total:</span>
                //                                 <span className="text-[#D4AF37]">${(parseFloat(getTotalPrice()) + 5.00).toFixed(2)}</span>
                //                             </div>
                //                             <p className="text-xs text-gray-500 mt-2">*Delivery fee may vary based on location</p>
                //                         </div>

                //                         <Link href="/checkout_page">
                //                             <button className="w-full py-4 bg-[#D4AF37] text-white rounded-lg hover:bg-[#B8941F] transition-colors duration-300 font-bold text-lg shadow-lg hover:shadow-xl">
                //                                 Proceed to Checkout
                //                             </button>
                //                         </Link>
                                        
                //                         <button 
                //                             onClick={() => setShowCart(false)}
                //                             className="w-full py-3 mt-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors duration-300 font-semibold"
                //                         >
                //                             Continue Shopping
                //                         </button>
                //                     </>
                //                 )}
                //             </div>
                //         </div>
                //     </div>
                // )} */}

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