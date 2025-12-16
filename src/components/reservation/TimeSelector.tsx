"use client";
import { useRef, useEffect } from "react";
import { Italiana } from "next/font/google";

const italiana = Italiana({
  weight: ["400"],
  subsets: ["latin"],
});

interface Props {
  selectedTime: string;
  onSelect: (time: string) => void;
}

export default function TimeSelector({ selectedTime, onSelect }: Props) {
  const times = Array.from({ length: 12 }, (_, i) => 10 + i);
  const containerRef = useRef<HTMLDivElement>(null);
  const buttonRefs = useRef<Record<string, HTMLButtonElement | null>>({});

  const selectedIndex = times.findIndex((hour) => `${hour}:00` === selectedTime);
  const showLeftFade = selectedIndex > 1;
  const showRightFade = selectedIndex < times.length - 2;

  useEffect(() => {
    const container = containerRef.current;
    const selectedBtn = buttonRefs.current[selectedTime];
    if (container && selectedBtn) {
      const containerRect = container.getBoundingClientRect();
      const btnRect = selectedBtn.getBoundingClientRect();
      const offset =
        btnRect.left -
        containerRect.left +
        btnRect.width / 2 -
        containerRect.width / 2;
      container.scrollBy({
        left: offset,
        behavior: "smooth",
      });
    }
  }, [selectedTime]);

  return (
    <div className="space-y-3">      
      <div className="relative">
        {showLeftFade && (
          <div className="absolute left-0 top-0 bottom-0 w-20 bg-gradient-to-r from-white to-transparent z-10 pointer-events-none"></div>
        )}
        {showRightFade && (
          <div className="absolute right-0 top-0 bottom-0 w-20 bg-gradient-to-l from-white to-transparent z-10 pointer-events-none"></div>
        )}

        <div
          ref={containerRef}
          className="flex justify-between overflow-x-auto space-x-3 py-3 px-0.5 scroll-smooth scrollbar-hide"
        >
          {times.map((hour) => {
            const timeLabel = `${hour}:00`;
            const isSelected = timeLabel === selectedTime;
            const isPeakTime = (hour >= 18 && hour <= 20) || hour === 12;
            return (
              <button
                key={hour}
                ref={(el) => {
                  buttonRefs.current[timeLabel] = el
                }}
                onClick={() => onSelect(timeLabel)}
                className={`
                  relative min-w-[80px] px-5 py-2.5 rounded-lg 
                  transition-all duration-300
                  shadow-md hover:shadow-lg hover:scale-105
                  ${
                    isSelected
                      ? "bg-[#D4AF37] text-white scale-105"
                      : "bg-[#F5F4ED] text-[#7A7A76] hover:bg-[#989793] hover:text-white"
                  }
                `}
              >
                {isPeakTime && !isSelected && (
                  <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-red-500 rounded-full animate-pulse"></span>
                )}
                <div className={`${italiana.className} text-lg font-medium`}>
                  {timeLabel}
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}