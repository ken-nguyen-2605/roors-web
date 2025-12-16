import { Icon } from "@iconify/react";

type TrackingProps = {
  trackingstate?: string;
};

export default function Tracking({ trackingstate = "" }: TrackingProps) {
  console.log(trackingstate);
  return (
    <div className="flex justify-center items-center gap-3 rounded-full bg-[#E9E7D9] my-10 w-2/5 h-[60px] relative z-15 left-1/2 -translate-x-1/2 border-1">
      <Icon
        className={`w-[24px] h-[24px] ${
          trackingstate === "prepared" ||
          trackingstate === "delivering" ||
          trackingstate === "delivered"
            ? "text-[#FBBF24]"
            : ""
        }`}
        icon={"lucide:cooking-pot"}
      />
      <div
        className={`h-1 w-40 ${
          trackingstate === "delivering" || trackingstate === "delivered"
            ? "bg-[#FBBF24]"
            : "bg-black"
        }`}
      ></div>
      <Icon
        className={`w-[24px] h-[24px] ${
          trackingstate === "delivering" || trackingstate === "delivered"
            ? "text-[#FBBF24]"
            : ""
        }`}
        icon={"ic:baseline-delivery-dining"}
      />
      <div
        className={`h-1 w-40 ${
          trackingstate === "delivered" ? "bg-[#FBBF24]" : "bg-black"
        }`}
      ></div>
      <Icon
        className={`w-[24px] h-[24px] ${
          trackingstate === "delivered" ? "text-[#FBBF24]" : ""
        }`}
        icon={"icon-park-outline:delivery"}
      />
    </div>
  );
}