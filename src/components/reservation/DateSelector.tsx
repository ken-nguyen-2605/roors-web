// components/reservation/DateSelector.tsx
"use client";
import { useState, useEffect, useRef } from "react";
import dayjs from "dayjs";
import { Italiana } from "next/font/google";

const italiana = Italiana({
	weight: ["400"],
	subsets: ["latin"],
});

interface Props {
	selectedDate: string;
	onSelect: (date: string) => void;
}

export default function DateSelector({ selectedDate, onSelect }: Props) {
	const [dates, setDates] = useState<string[]>([]);
	const containerRef = useRef<HTMLDivElement>(null);
	const buttonRefs = useRef<Record<string, HTMLButtonElement | null>>({});

	useEffect(() => {
		const today = dayjs();
		const days = Array.from({ length: 14 }, (_, i) =>
			today.add(i, "day").format("YYYY-MM-DD")
		);
		setDates(days);
	}, []);

	// Center the selected date in the scrollable view
	useEffect(() => {
		const container = containerRef.current;
		const selectedBtn = buttonRefs.current[selectedDate];
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
	}, [selectedDate, dates]);

	const selectedIndex = dates.findIndex((date) => date === selectedDate);
	const showLeftFade = selectedIndex > 1;
	const showRightFade = selectedIndex < dates.length - 2;

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
					className="flex overflow-x-auto space-x-3 py-3 px-0.5 scroll-smooth scrollbar-hide"
				>
					{dates.map((date) => {
						const isToday = date === dayjs().format("YYYY-MM-DD");
						const isSelected = date === selectedDate;
						return (
							<button
								key={date}
								ref={(el) => {
									buttonRefs.current[date] = el;
								}}
								onClick={() => onSelect(date)}
								className={`
                  relative min-w-[85px] px-4 py-2 rounded-lg
                  whitespace-nowrap transition-all duration-300
                  shadow-md hover:shadow-lg hover:scale-105
                  ${
						isSelected
							? "bg-[#D4AF37] text-white scale-105"
							: "bg-[#F5F4ED] text-[#7A7A76] hover:bg-[#989793] hover:text-white"
					}
                `}
							>
								{isToday && (
									<span className="absolute -top-2 left-1/2 transform -translate-x-1/2 text-xs bg-[#989793] text-white px-2 py-0.5 rounded">
										Today
									</span>
								)}
								<div
									className={`${italiana.className} text-base font-medium`}
								>
									{dayjs(date).format("ddd")}
								</div>
								<div className="text-xl font-bold mt-0.5">
									{dayjs(date).format("DD")}
								</div>
								<div className="text-xs mt-0.5 opacity-80">
									{dayjs(date).format("MMM")}
								</div>
							</button>
						);
					})}
				</div>
			</div>
		</div>
	);
}