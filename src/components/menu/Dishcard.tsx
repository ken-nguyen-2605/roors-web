"use client";

import Image from "next/image"

export default function DishCard({id, images, names, descriptions, prices}: Dish) {
    return (
        <div className="relative w-[307px] h-[392px] shadow-2xl">
            <div className="relative w-full h-1/3 rounded-t-[30px] bg-[#F4F5ED]">
                <Image
                    src={images}
                    alt=""
                    fill
                    className="object-cover menu-card-image"
                />
            </div>
            <div className="w-full h-1/2 p-3 border-b-2 border-black/50 bg-[#F4F5ED]">
                <div className="text-left text-xl font-medium">{names}</div>
                <div className="text-left">{descriptions}</div>
            </div>
            <div className="flex flex-row gap-25 w-full h-1/6 px-3 items-center bg-[#F4F5ED]">
                <div className="w-fit text-lg">Price: {prices}$</div>
                <div className="flex flex-row gap-2.5 w-fit">
                    <button className="w-[25px] h-[25px] border-1 rounded-[5px] ">
                        +
                    </button>
                    <span>0</span>
                    <button className="w-[25px] h-[25px] border-1 rounded-[5px] ">
                        -
                    </button>
                </div>
            </div>
        </div>
    )
}