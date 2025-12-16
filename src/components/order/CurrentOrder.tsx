import { Italiana } from "next/font/google";
// import { useState } from "react";
import Image from "next/image";

const italiana = Italiana({
  weight: "400",
  subsets: ["latin"],
});

export interface Order {
  name: string;
  src: string;
  quantity: number;
  price: number;
}

type CurrProp = {
  orderList?: Order[];
};

export default function CurrentOrder({ orderList = [] }: CurrProp) {
  const total = orderList
    .map((obj) => obj.price * obj.quantity)
    .reduce((acc, ele) => acc + ele, 0);

  return (
    <div className="relative flex flex-col items-center my-20 w-full gap-10 z-19">
      <h2 className={`${italiana.className} text-4xl`}>Your Order</h2>
      <div className="flex flex-col items-center w-2/5 gap-6">
        {orderList.map((item, index) => (
          <div
            key={index}
            className="relative bg-[#F5F4ED] border-1 border-black w-full flex items-end h-20 gap-[5px] rounded-r-[15px] p-[3px] shadow-[3px_3px_6px_rgba(0,0,0,0.5)]"
          >
            <div className="relative w-1/5 h-full rounded-r-[10px] overflow-hidden mr-2">
              <Image
                src={item.src}
                alt=""
                fill
                sizes=""
                className="object-cover"
              ></Image>
            </div>
            <h5 className="text-lg">{item.quantity}x</h5>
            <h4 className={`${italiana.className} text-lg`}>{item.name}</h4>
            <h5 className="text-lg absolute right-3">Price: {item.price}$</h5>
          </div>
        ))}
        <div className="self-end text-right p-[7px] text-lg lo h-10 w-1/3 bg-[#E0DFD9] rounded-l-[15px] border-1 border-black shadow-[3px_3px_6px_rgba(0,0,0,0.5)]">
          Total: {total}$
        </div>
      </div>
    </div>
  );
}