"use client";

import { Icon } from "@iconify/react";
import FeedbackRating from "./RatingFeedback";
import { useState } from "react";

type OrderDetailProps = {
  orderlist?: { name: string; src: string }[];
  orderstate?: string;
  orderInfo?: OrderInformation;
};

import { OrderInformation } from "@/app/order/page";

import { Order } from "./OverallRating";

export default function OrderDetail({
  orderlist = [{ name: "", src: "" }],
  orderstate = "",
  orderInfo,
}: OrderDetailProps) {
  const [isFeedback, setIsFeedback] = useState(false);
  const [gotRating, setGotRating] = useState<Order[]>([]);
  const handleSentRating = (finalRating: Order[]) => {
    setGotRating(finalRating);
    setIsFeedback(false);
  };

  return (
    <>
      <div className="relative">
        <div className="relative flex flex-col gap-3 my-20 w-2/5 items-center w-1/2 left-1/2 -translate-x-1/2">
          <div className="flex gap-3 place-self-center justify-center items-center">
            <div className="h-[1px] w-40 bg-black"></div>
            <div className="text-md">Order detail</div>
            <div className="h-[1px] w-40 bg-black"></div>
          </div>
          <p className="place-self-start">
            Destination: {orderInfo?.destination}
          </p>
          <p className="place-self-start">
            Customer phone number: {orderInfo?.phoneno}
          </p>
          <p className="place-self-start">
            Expected arrival time: {orderInfo?.ETA}
          </p>
        </div>
        <div
          onClick={() => setIsFeedback(true)}
          className={`cursor-pointer z-25 absolute flex gap-1 justify-center items-center border-1 border-black rounded-full w-1/8 h-[40px] right-1/10 ${
            orderstate === "delivered" ? "" : "invisible"
          }`}
        >
          <h5 className="text-lg ">Feedback</h5>
          <Icon
            className="text-lg font-bold"
            icon={"hugeicons:chat-feedback"}
          ></Icon>
        </div>
      </div>
      {isFeedback && (
        <FeedbackRating infolist={orderlist} onSendRating={handleSentRating} />
      )}
    </>
  );
}
