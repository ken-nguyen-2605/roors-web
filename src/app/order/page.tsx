//Page of details of current order

"use client";

import SlideBackground from "@/utils/SlideBackground";
import CurrentOrder from "@/components/order/CurrentOrder";
import Tracking from "@/components/order/tracking";
import OrderDetail from "@/components/order/OrderDetail";
import { Inria_Serif } from "next/font/google";
import { useEffect, useState } from "react";

import Link from "next/link";
import { Icon } from "@iconify/react";

const inriaSerif = Inria_Serif({
  weight: "400",
  subsets: ["latin"],
});

export interface OrderItem {
  name: string;
  src: string;
  quantity: number;
  price: number;
}

export interface OrderInformation {
  destination: string;
  phoneno: string;
  ETA: string;
}

type OrderProps = {
  ListOfOrder?: OrderItem[];
  DeliveryState?: string; // Nhận 1 trong 4 giá trị {"", "prepared", "delivering", "delivered"}
  OrderDetails: OrderInformation;
};

export default function Order({
  ListOfOrder = [],
  DeliveryState = "delivered",
  OrderDetails,
}: OrderProps) {
  const orderlist: OrderItem[] = [
    {
      name: "Classic Cheeseburger",
      src: "/food-img/cheeseburger.jpg",
      quantity: 2,
      price: 12.5, // Price per unit
    },
    {
      name: "Caesar Salad",
      src: "/food-img/caesar-salad.jpg",
      quantity: 1,
      price: 9.0,
    },
    {
      name: "Spaghetti Carbonara",
      src: "/food-img/carbonara.jpg",
      quantity: 3,
      price: 15.75,
    },
    {
      name: "French Fries",
      src: "/food-img/french-fries.jpg",
      quantity: 2,
      price: 4.5,
    },
    {
      name: "Iced Tea (Unsweetened)",
      src: "/food-img/iced-tea.jpg",
      quantity: 4,
      price: 3.0,
    },
  ];

  const [orderStat, setOrderStat] = useState("");
  const namesrcList = orderlist.map((item) => ({
    name: item.name,
    src: item.src,
  }));
  useEffect(() => {
    setOrderStat(DeliveryState);
  }, [DeliveryState]);

  const thisOrderInfo: OrderInformation = {
    destination: "268 Ly Thuong Kiet, Quan 10, TP Ho Chi Minh",
    phoneno: "0987654321",
    ETA: "19:30",
  };

  return (
    <>
      <SlideBackground
        images={[
          "/background/bg3.jpg",
          "/background/bg2.jpg",
          "/background/bg4.jpg",
        ]}
        interval={8000}
        transitionDuration={1500}
        className="flex-center h-[730px] w-full"
        overlay="bg-black/40 border-b-4 golden"
      >
        <div className="relative flex-center w-[703px] h-[290px]">
          <span className="absolute top-0 left-0 w-[230px] h-[103px] border-white border-t-8 border-l-8" />
          <span className="absolute bottom-0 right-0 w-[230px] h-[103px] border-white border-b-8 border-r-8" />
          <div className="text-center text-white">
            <span
              className={`${inriaSerif.className} text-8xl`}
              style={{ fontStyle: "italic" }}
            >
              Your orders
            </span>
          </div>
        </div>
      </SlideBackground>
      <div className="relative h-full w-full">
        <div className="absolute top-0 z-10 w-full h-full overflow-hidden">
          <img
            src="/background/Mask group.png"
            alt=""
            className="relative w-full object-cover -top-20"
          />
        </div>

        {orderlist.length > 0 ? (
          <div className="relative">
            <Tracking trackingstate={orderStat} />
            <CurrentOrder orderList={orderlist} />
            <OrderDetail
              orderlist={namesrcList}
              orderstate={orderStat}
              orderInfo={thisOrderInfo}
            />
          </div>
        ) : (
          <div className="relative">
            <h4 className="relative text-2xl mt-20 left-1/2 -translate-x-1/2 text-center opacity-50">
              You don't have any orders.
            </h4>
          </div>
        )}
        <div className="my-30 relative w-1/2 z-20">
          <Link
            href="/"
            className="flex gap-[3px] justify-center items-center w-50 h-8 border-1 border-black relative left-1/10 rounded-full "
          >
            <Icon className="" icon={"material-symbols:arrow-back"} />
            <h5 className="text-lg">Back</h5>
          </Link>
        </div>
      </div>
    </>
  );
}