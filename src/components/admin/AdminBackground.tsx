import React from "react";
import SlideBackground from "@/utils/SlideBackground";

const backgroundImages = [
	"/background/bg1.jpg",
	"/background/bg2.jpg",
	"/background/bg3.jpg",
	"/background/bg4.jpg",
];

export default function AdminBackground() {
	return (
		<div className="fixed inset-0 -z-10">
			<SlideBackground
				images={backgroundImages}
				interval={5000}
				transitionDuration={1000}
				className="h-full w-full"
			/>
			<div className="absolute inset-0 bg-black opacity-60 pointer-events-none z-10"></div>

            {/* Content Placeholder for demonstration */}
            <div className="relative z-20 flex items-center justify-center h-full">
                <div className="bg-white/10 backdrop-blur-sm p-8 rounded-xl shadow-2xl text-white text-center border border-white/20">
                    <h1 className="text-4xl font-extrabold tracking-tight mb-2">Admin Panel Mockup</h1>
                    <p className="text-lg text-gray-200">The background is blurred and darkened for high-contrast focus.</p>
                </div>
            </div>
		</div>
	);
}
