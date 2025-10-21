import SlideBackground from "@/utils/slidebackground";

import { Inria_Serif } from 'next/font/google';
const inriaSerif = Inria_Serif({
  weight: ['300'],
  subsets: ['latin'],
});

export default function Menu() {
    return (
        <SlideBackground
            images = {["/background/bg3.jpg", "/background/bg2.jpg", "/background/bg4.jpg"]}
            interval = {8000}
            transitionDuration = {1500}  
            className="flex-center h-[730px] w-full"
            overlay="bg-black/40 border-b-4 golden"  
          >
            <div className="relative flex-center w-[703px] h-[290px]">
                <span className="absolute top-0 left-0 w-[230px] h-[103px] border-white border-t-8 border-l-8"/>
                <span className="absolute bottom-0 right-0 w-[230px] h-[103px] border-white border-b-8 border-r-8"/>
                <div className="text-center text-white">
                    <span className={`${inriaSerif.className} text-8xl`} style={{fontStyle: 'italic'}}>
                        Menu
                    </span>
                </div>
            </div> 
        </SlideBackground>
    )
}