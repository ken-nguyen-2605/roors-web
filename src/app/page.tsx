import SlideBackground from "@/ultility/slidebackground";
import Image from "next/image";

export default function Home() {
  return (
    <>
      <SlideBackground
        images = {["/background/bg1.jpg", "/background/bg2.jpg", "/background/bg3.jpg"]}
        interval = {5000}
        transitionDuration = {1500}  
        className="flex h-[730px] w-full"  
      >
        
      </SlideBackground>
    </>
  );
}