"use client";

import Image from "next/image";
import { Italiana } from "next/font/google";
import { Icon } from "@iconify/react";
import Rating from "./OverallRating";
import { useState } from "react";

const italiana = Italiana({
  weight: "400",
  subsets: ["latin"],
});

import { Order } from "./OverallRating";

type FeedbackRatingProps = {
  infolist?: { name: string; src: string }[];
  onSendRating?: (finalList: Order[]) => void;
};

export default function FeedbackRating({
  infolist = [{ name: "", src: "" }],
  onSendRating,
}: FeedbackRatingProps) {
  const [inRating, setInRating] = useState(true);
  const [orders, setOrders] = useState<Order[]>(
    infolist.map((info) => ({
      ...info,
      stars: 0,
      setStar: (n: number) => {
        setOrders((prev) =>
          prev.map((item) =>
            item.name === info.name ? { ...item, stars: n } : item
          )
        );
      },
    }))
  );
  const handleSentRating = (finalList: Order[]) => {
    setInRating(false);
    onSendRating?.(finalList);
  };
  return (
    <>
      {inRating && (
        <div className="flex flex-col items-center rounded-[15px] bg-[#F5F4ED] border-2 border-[#FBBF24] fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-35 w-1/3 h-7/10">
          <h3 className={`${italiana.className} text-2xl my-1`}>
            Rating & Feedback
          </h3>
          <div className="w-full h-0 border-t-1 border-black"></div>
          <Rating feedbacklist={orders} onSend={handleSentRating} />
        </div>
      )}
    </>
  );
}