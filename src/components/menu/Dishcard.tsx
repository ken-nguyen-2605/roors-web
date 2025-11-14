"use client";

import { useState } from "react";
import { Icon } from "@iconify/react";

import Image from "next/image"
import Link from "next/link";

type DishCardProps = Dish & {
  quantity: number;
  onQuantityChange: (id: number, nextQty: number) => void;
};


export default function DishCard({id, image, name, description, price, categories, quantity, rating, onQuantityChange}: DishCardProps) {

    const inc = (e: React.MouseEvent) => {
        e.stopPropagation();
        onQuantityChange(id, quantity + 1);
    }; 

    const dec = (e: React.MouseEvent) => {
        e.stopPropagation();
        onQuantityChange(id, Math.max(0, quantity - 1));
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
            </div>
            <div className="w-full h-1/2 p-3 border-b-1 border-black/50 bg-[#F4F5ED]">
                <div className="flex flex-row gap-2.5 text-left text-xl font-medium">{name}
                    {categories?.some(type => type === "Vegetarian") &&
                        <Icon icon="mdi:leaf" color="#007E47"/>
                    }
                </div>
                <div className="text-justify">{description}</div>
            </div>
            <div className="flex items-center justify-between w-full h-1/6 px-3 bg-[#F4F5ED]">
                <div className="w-fit text-lg">Price: {price}$</div>
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