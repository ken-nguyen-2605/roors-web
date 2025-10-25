"use client";

import { useState } from "react";
import { Inria_Serif, Lato } from "next/font/google";
import Image from "next/image";

const inriaSerif = Inria_Serif({
	weight: ["300", "400"],
	subsets: ["latin"],
});

const lato = Lato({
	weight: ["300", "400"],
	subsets: ["latin"],
});

interface MenuItem {
	id: number;
	name: string;
	description: string;
	price: string;
	image: string;
	category: string;
	badge?: "Popular" | "New" | "Chef's Special";
}

const menuItems: MenuItem[] = [
	{
		id: 1,
		name: "Grilled Salmon",
		description: "Fresh Atlantic salmon with herbs, lemon butter sauce, and seasonal vegetables",
		price: "$28.99",
		image: "/dishes/dish1.jpg",
		category: "Main Course",
		badge: "Popular",
	},
	{
		id: 2,
		name: "Truffle Risotto",
		description: "Creamy arborio rice with black truffle, parmesan, and wild mushrooms",
		price: "$24.99",
		image: "/dishes/dish2.jpg",
		category: "Main Course",
		badge: "Chef's Special",
	},
	{
		id: 3,
		name: "Caesar Salad",
		description: "Crisp romaine, house-made croutons, parmesan, and classic Caesar dressing",
		price: "$12.99",
		image: "/dishes/dish3.jpg",
		category: "Appetizers",
	},
	{
		id: 4,
		name: "Beef Tenderloin",
		description: "8oz prime cut with red wine reduction, mashed potatoes, and grilled asparagus",
		price: "$42.99",
		image: "/dishes/dish4.jpg",
		category: "Main Course",
		badge: "Chef's Special",
	},
	{
		id: 5,
		name: "Chocolate Lava Cake",
		description: "Warm chocolate cake with molten center, vanilla ice cream, and berry coulis",
		price: "$10.99",
		image: "/dishes/dish5.jpg",
		category: "Desserts",
		badge: "Popular",
	},
	{
		id: 6,
		name: "Lobster Bisque",
		description: "Rich and creamy soup with fresh lobster meat and cognac",
		price: "$16.99",
		image: "/dishes/dish6.jpg",
		category: "Appetizers",
		badge: "New",
	},
];

const categories = ["All", "Appetizers", "Main Course", "Desserts", "Beverages"];

export default function MenuCards() {
	const [activeCategory, setActiveCategory] = useState("All");

	const filteredItems =
		activeCategory === "All"
			? menuItems
			: menuItems.filter((item) => item.category === activeCategory);

	return (
		<section className="py-20 bg-gradient-to-b from-white to-gray-50">
			<div className="container mx-auto px-4 max-w-7xl">
				{/* Section Header */}
				<div className="text-center mb-16">
					<h2
						className={`${inriaSerif.className} text-5xl md:text-6xl text-gray-800 mb-4`}
						style={{ fontStyle: "italic" }}
					>
						Our Signature Dishes
					</h2>
					<div className="w-24 h-1 bg-gradient-to-r from-amber-400 to-yellow-600 mx-auto mb-6" />
					<p className={`${lato.className} text-gray-600 text-lg max-w-2xl mx-auto`}>
						Crafted with passion, served with excellence
					</p>
				</div>

				{/* Category Filter */}
				<div className="flex flex-wrap justify-center gap-4 mb-12">
					{categories.map((category) => (
						<button
							key={category}
							onClick={() => setActiveCategory(category)}
							className={`${lato.className} px-6 py-3 rounded-full transition-all duration-300 ${
								activeCategory === category
									? "bg-gradient-to-r from-amber-400 to-yellow-600 text-white shadow-lg scale-105"
									: "bg-white text-gray-700 hover:bg-gray-100 border border-gray-200"
							}`}
						>
							{category}
						</button>
					))}
				</div>

				{/* Menu Grid */}
				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
					{filteredItems.map((item) => (
						<MenuCard key={item.id} item={item} />
					))}
				</div>
			</div>
		</section>
	);
}

function MenuCard({ item }: { item: MenuItem }) {
	const [isHovered, setIsHovered] = useState(false);

	return (
		<div
			className="group relative bg-white rounded-lg overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2"
			onMouseEnter={() => setIsHovered(true)}
			onMouseLeave={() => setIsHovered(false)}
		>
			{/* Badge */}
			{item.badge && (
				<div className="absolute top-4 right-4 z-10">
					<span
						className={`px-3 py-1 rounded-full text-xs font-semibold ${lato.className} ${
							item.badge === "Popular"
								? "bg-red-500 text-white"
								: item.badge === "New"
								? "bg-green-500 text-white"
								: "bg-purple-500 text-white"
						}`}
					>
						{item.badge}
					</span>
				</div>
			)}

			{/* Image Section */}
			<div className="relative h-64 overflow-hidden bg-gray-200">
				<Image
					src={item.image}
					alt={item.name}
					fill
					className={`object-cover transition-transform duration-700 ${
						isHovered ? "scale-110" : "scale-100"
					}`}
				/>
				<div
					className={`absolute inset-0 bg-gradient-to-t from-black/60 to-transparent transition-opacity duration-300 ${
						isHovered ? "opacity-100" : "opacity-0"
					}`}
				/>
			</div>

			{/* Content Section */}
			<div className="p-6">
				{/* Category Tag */}
				<span
					className={`${lato.className} text-xs text-amber-600 font-semibold uppercase tracking-wider`}
				>
					{item.category}
				</span>

				{/* Title and Price */}
				<div className="flex justify-between items-start mt-2 mb-3">
					<h3
						className={`${inriaSerif.className} text-2xl text-gray-800 font-semibold`}
					>
						{item.name}
					</h3>
					<span
						className={`${lato.className} text-xl font-bold text-amber-600 ml-4`}
					>
						{item.price}
					</span>
				</div>

				{/* Description */}
				<p className={`${lato.className} text-gray-600 text-sm leading-relaxed`}>
					{item.description}
				</p>

				{/* Order Button */}
				<button
					className={`${lato.className} mt-4 w-full py-3 px-6 bg-gradient-to-r from-amber-400 to-yellow-600 text-white rounded-lg font-semibold
					transform transition-all duration-300 
					${isHovered ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2"}
					hover:from-amber-500 hover:to-yellow-700 hover:shadow-lg`}
				>
					Order Now
				</button>
			</div>

			{/* Decorative Corner */}
			<div className="absolute top-0 left-0 w-16 h-16 border-t-4 border-l-4 border-amber-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
			<div className="absolute bottom-0 right-0 w-16 h-16 border-b-4 border-r-4 border-amber-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
		</div>
	);
}