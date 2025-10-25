import { FaFacebook } from "react-icons/fa";
import { FaInstagram } from "react-icons/fa";
import { FaTiktok } from "react-icons/fa";
import { SiGmail } from "react-icons/si";
import { Icon } from "@iconify/react";

import { Italiana } from "next/font/google";
const italiana = Italiana({
  weight: ['400'],
  subsets: ['latin'],
});

import { Pacifico } from "next/font/google";
const pacifico = Pacifico({
  weight: ['400'],
  subsets: ['latin'],
});

export default function Footer() {
    return (
        <div className="relative flex-center w-full h-[128px] bg-black border-t-[7px] golden">
            <div className={`flex justify-between w-1/2 text-white`}>
                <div className="flex justify-center flex-col gap-2.5">
                    <span className={`text-2xl ${pacifico.className}`}>Contact</span>
                    <div className="flex justify-between gap-2.5">
                        <a 
                            href="https://www.facebook.com/hunghao.chau"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="transition-colors duration-150 hover:text-[#FBBF24]"
                        >
                            <FaFacebook size={24}/>
                        </a>
                        <a 
                            href="https://www.facebook.com/hunghao.chau"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="transition-colors duration-150 hover:text-[#FBBF24]"
                        >
                            <FaInstagram size={24}/>
                        </a>
                        <a 
                            href="https://www.facebook.com/hunghao.chau"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="transition-colors duration-150 hover:text-[#FBBF24]"
                        >
                            <FaTiktok size={24}/>
                        </a>
                        <a 
                            href="https://www.facebook.com/hunghao.chau"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="transition-colors duration-150 hover:text-[#FBBF24]"
                        >
                            <SiGmail size={24}/>
                        </a>
                    </div>
                </div>
                <div className="flex justify-center flex-col gap-2.5">
                    <span className={`text-2xl ${pacifico.className}`}>Location</span>
                    <div className="flex justify-between gap-2.5">
                        <Icon icon="mdi:location" className="w-[28px] h-[32px]"/>
                        <span className="flex items-center">268 Ly Thuong Kiet</span>
                    </div>
                </div>
                <div className="flex justify-center flex-col gap-2.5">
                    <span className={`text-2xl ${pacifico.className}`}>Hotline</span>
                    <div className="flex justify-between gap-2.5">
                        <Icon icon="ic:baseline-phone" className="w-[28px] h-[32px]"/>
                        <span className="flex items-center">0987654321</span>
                    </div>
                </div>
                <div className="flex justify-center flex-col gap-2.5">
                    <span className={`text-2xl ${pacifico.className}`}>Opening</span>
                    <div className="flex justify-between gap-2.5">
                        <Icon icon="mingcute:time-fill" className="w-[28px] h-[32px]"/>
                        <span className="flex items-center">8:00 - 22:00</span>
                    </div>
                </div>
            </div>
        </div>
    )
}