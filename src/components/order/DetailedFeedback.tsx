"use client";

import { Icon } from "@iconify/react";
import Image from "next/image";
import { Italiana } from "next/font/google";
import { useState, ChangeEvent, useEffect } from "react";

const italiana = Italiana({
  weight: "400",
  subsets: ["latin"],
});

type DetailProp = {
  name?: string;
  imgsrc?: string;
  rating?: number;
  setRating?: (n: number) => void;
  feedback?: string;
  onFeedbackChange?: (fb: string) => void;
};

export default function DetailFeedback({
  name = "",
  imgsrc = "",
  rating = 0,
  setRating = () => {},
  feedback = "",
  onFeedbackChange = () => {},
}: DetailProp) {
  const [localFeedback, setLocalFeedback] = useState(feedback);

  useEffect(() => {
    setLocalFeedback(feedback);
  }, [feedback]);

  const handleFeedbackChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setLocalFeedback(e.target.value);
    onFeedbackChange(e.target.value);
  };

  const handleStarClick = (n: number) => {
    setRating(n);
  };
  return (
    <div className="relative flex flex-col z-40 h-full w-[95%] my-1 gap-5">
      <div className="flex justify-between items-center flex-1 gap-3">
        <div className="flex-1 rounded-[15px] h-9/10 w-full overflow-hidden relative p-2">
          <Image src={imgsrc} alt="" fill sizes="" className=" object-cover" />
        </div>

        <div className="h-8/10 flex flex-3 flex-col justify-between gap-3">
          <h3 className={`${italiana.className} text-2xl`}>{name}</h3>
          <p className="text-xs mt-auto">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit.
          </p>
        </div>
      </div>
      <div className="flex-3 flex flex-col">
        <p className="text-xs">Rate your experience with our service</p>
        <div className="flex gap-2 place-self-center mt-2">
          <Icon
            className="text-[#FBBF24] text-3xl"
            onClick={() => handleStarClick(1)}
            icon={rating >= 1 ? "tabler:star-filled" : "lucide:star"}
          ></Icon>
          <Icon
            onClick={() => handleStarClick(2)}
            className="text-[#FBBF24] text-3xl"
            icon={rating >= 2 ? "tabler:star-filled" : "lucide:star"}
          ></Icon>
          <Icon
            onClick={() => handleStarClick(3)}
            className="text-[#FBBF24] text-3xl"
            icon={rating >= 3 ? "tabler:star-filled" : "lucide:star"}
          ></Icon>
          <Icon
            onClick={() => handleStarClick(4)}
            className="text-[#FBBF24] text-3xl"
            icon={rating >= 4 ? "tabler:star-filled" : "lucide:star"}
          ></Icon>
          <Icon
            onClick={() => handleStarClick(5)}
            className="text-[#FBBF24] text-3xl"
            icon={rating == 5 ? "tabler:star-filled" : "lucide:star"}
          ></Icon>
        </div>
        <p className="text-xs mt-2">Share your feeling</p>
        <div className="h-full mb-3">
          <textarea
            name="feedback"
            value={localFeedback}
            onChange={handleFeedbackChange}
            placeholder="Write here..."
            className="w-full focus:outline-none h-full border-1 border-black rounded-[15px] mt-2 px-3 py-2 text-sm"
          ></textarea>
        </div>
      </div>
    </div>
  );
}
