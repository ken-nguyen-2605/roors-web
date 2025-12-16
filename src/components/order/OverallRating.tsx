"use client";

import { Icon } from "@iconify/react";
import Image from "next/image";
import { Italiana } from "next/font/google";
import { useEffect, useState } from "react";
import DetailFeedback from "./DetailedFeedback";

const italiana = Italiana({
  weight: "400",
  subsets: ["latin"],
});

export interface Order {
  name: string;
  src: string;
  stars: number;
  feedback?: string;
}

type FeedbackProps = {
  feedbacklist: Order[];
  onSend: (finalList: Order[]) => void;
};

export default function Rating({ feedbacklist, onSend }: FeedbackProps) {
  const [selectedItem, setSelectedItem] = useState<Order | null>(null);
  const [feedbackList, setFeedbackList] = useState<Order[]>(feedbacklist);
  const [editingFeedback, setEditingFeedback] = useState<string>("");

  const handleMoreDetailClick = (itemData: Order) => {
    setSelectedItem(itemData);
  };

  const handleSetRating = (newRating: number) => {
    if (!selectedItem) return;
    setSelectedItem((prev) => (prev ? { ...prev, stars: newRating } : prev));
  };

  const handleFeedbackChange = (value: string) => {
    if (!selectedItem) return;
    setFeedbackList((prev) =>
      prev.map((item) =>
        item.name === selectedItem.name ? { ...item, feedback: value } : item
      )
    );

    setSelectedItem((prev) => (prev ? { ...prev, feedback: value } : prev));
  };

  const handleSave = () => {
    if (!selectedItem) return;

    setFeedbackList((prevList) =>
      prevList.map((item) =>
        item.name === selectedItem.name
          ? {
              ...item,
              stars: selectedItem.stars,
              feedback: editingFeedback,
            }
          : item
      )
    );

    setSelectedItem(null);
  };

  const handleNotSave = () => {
    onSend([]);
  };

  const handleSaveAll = () => {
    // Only send items that have been rated (stars > 0)
    const ratedItems = feedbackList.filter((item) => item.stars > 0);
    onSend(ratedItems);
  };

  // Check if at least one item has been rated
  const hasAnyRating = feedbackList.some((item) => item.stars > 0);

  const openDetail = (item: Order) => {
    setSelectedItem(item);
    setEditingFeedback(item.feedback || ""); // copy current feedback into temp state
  };

  return (
    <>
      {selectedItem ? (
        <>
          <DetailFeedback
            name={selectedItem.name}
            imgsrc={selectedItem.src}
            rating={selectedItem.stars}
            setRating={handleSetRating}
            feedback={selectedItem.feedback}
            onFeedbackChange={setEditingFeedback}
          />
          <div className="flex justify-between items-center mt-auto px-3 border-t-1 border-black w-full h-1/10">
            <div
              onClick={() => {
                setSelectedItem(null);
              }}
              className="flex justify-center items-center gap-1 cursor-pointer"
            >
              <Icon className="text-md" icon={"material-symbols:arrow-back"} />
              <h5 className="text-md">Back</h5>
            </div>
            <div
              onClick={handleSave}
              className="cursor-pointer bg-[#E0E0D9] flex justify-center items-center rounded-full h-3/5 w-[120px] leading-3/5 text-center text-md cursor-pi"
            >
              Save
            </div>
          </div>
        </>
      ) : (
        <div className="flex flex-col gap-[2px] justify-start items-center w-full mt-1 h-full overflow-y-auto">
          {feedbackList.map((item, index) => (
            <div
              key={index}
              className="w-full  p-[2px] h-[75px] border-y-1 border-black flex items-center"
            >
              <div className="relative w-1/5 h-9/10 rounded-r-[10px] overflow-hidden mr-2">
                <Image
                  src={item.src}
                  alt=""
                  fill
                  sizes=""
                  className="object-cover"
                />
              </div>
              <div className="flex flex-col gap-1">
                <h4 className={`${italiana.className} text-lg`}>{item.name}</h4>
                <div className="flex gap-1">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <Icon
                      key={i}
                      className="text-[#FBBF24] text-lg"
                      icon={
                        item.stars >= i ? "tabler:star-filled" : "lucide:star"
                      }
                    />
                  ))}
                </div>
              </div>
              <div
                className="flex ml-auto mr-2 place-self-end justify-center items-center gap-1 cursor-pointer"
                onClick={() => handleMoreDetailClick(item)}
              >
                <p className="text-sm">More detail</p>
                <Icon className="text-sm" icon={"solar:arrow-right-outline"} />
              </div>
            </div>
          ))}
          <div className="flex justify-between items-center mt-auto px-3 border-t-1 border-black w-full h-1/10">
            <div
              onClick={handleNotSave}
              className="flex justify-center items-center gap-1 cursor-pointer"
            >
              <Icon className="text-md" icon={"material-symbols:arrow-back"} />
              <h5 className="text-md">Back</h5>
            </div>
            <div
              onClick={hasAnyRating ? handleSaveAll : undefined}
              className={`${
                hasAnyRating ? "cursor-pointer" : "opacity-50 cursor-not-allowed"
              } bg-[#E0E0D9] flex justify-center items-center rounded-full h-3/5 w-[120px] leading-3/5 text-center text-md`}
            >
              {hasAnyRating ? "Save and send" : "Rate at least one item"}
            </div>
          </div>
        </div>
      )}
    </>
  );
}