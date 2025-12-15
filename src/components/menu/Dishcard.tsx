"use client";

import { Icon } from "@iconify/react";
import { FaStar, FaHeart, FaRegHeart } from "react-icons/fa";

import Image from "next/image";
import Link from "next/link";

type DishCardProps = Dish & {
  quantity: number;
  onQuantityChange: (id: number, nextQty: number) => void;
  isLiked?: boolean;
  onLikeToggle?: (id: number, isLiked: boolean) => void;
};


export default function DishCard({id, image, name, description, price, categories, quantity, rating, onQuantityChange, isLiked = false, onLikeToggle}: DishCardProps) {

    const inc = (e: React.MouseEvent) => {
        e.stopPropagation();
        onQuantityChange(id, quantity + 1);
    }; 

    const dec = (e: React.MouseEvent) => {
        e.stopPropagation();
        onQuantityChange(id, Math.max(0, quantity - 1));
    };

    const handleLikeClick = (e: React.MouseEvent) => {
        e.stopPropagation();
        e.preventDefault();
        if (onLikeToggle) {
            onLikeToggle(id, !isLiked);
        }
    };

    return (
        <div className="relative w-[307px] h-[392px] shadow-2xl">
            <div className="relative w-full h-1/3 rounded-t-[30px] bg-[#F4F5ED]">
                <Link
                href={`/menu/${id}`}
                >
                    <Image
                        src={image}
                        alt=""
                        fill
                        className="object-cover menu-card-image"
                    />
                </Link>
                {onLikeToggle && (
                    <button
                        onClick={handleLikeClick}
                        className="absolute top-3 right-3 w-10 h-10 flex items-center justify-center bg-white/90 rounded-full shadow-lg hover:bg-white transition-all duration-200 hover:scale-110 z-10"
                        aria-label={isLiked ? "Unlike this item" : "Like this item"}
                    >
                        {isLiked ? (
                            <FaHeart className="text-red-500" size={20} />
                        ) : (
                            <FaRegHeart className="text-gray-600" size={20} />
                        )}
                    </button>
                )}
            </div>
            <div className="w-full h-1/2 p-3 border-b-1 border-black/50 bg-[#F4F5ED]">
                <div className="flex flex-row items-center gap-2.5 text-left text-xl font-medium">
                    {name}
                    {categories?.some(type => type === "Vegetarian") &&
                        <Icon icon="mdi:leaf" color="#007E47"/>
                    }
                </div>
                
                {/* Rating Display */}
                <div className="flex items-center gap-1 my-1">
                    <FaStar className="text-[#FBBF24]" size={16} />
                    <span className="text-sm font-medium">{rating?.toFixed(1) || '0.0'}</span>
                </div>
                
                <div className="text-justify text-sm">{description}</div>
            </div>
            <div className="flex items-center justify-between w-full h-1/6 px-3 bg-[#F4F5ED]">
                <div className="w-fit text-lg">Price: {price} VND</div>
                <div className="flex flex-row gap-2.5 w-fit">
                    <button 
                    onClick={inc}
                    className="flex-center w-[25px] h-[25px] border-1 rounded-[5px] transition duration-100 hover:scale-102">
                        +
                    </button>
                    <span className="min-w-[24px] text-center">{quantity}</span>
                    <button 
                    onClick={dec}
                    className="flex-center w-[25px] h-[25px] border-1 rounded-[5px] transition duration-100 hover:scale-102">
                        -
                    </button>
                </div>
            </div>
        </div>
    )
}