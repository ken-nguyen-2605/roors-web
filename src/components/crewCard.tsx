import Image from "next/image";
import Link from "next/link";

import { FaFacebook } from "react-icons/fa";
import { FaInstagram } from "react-icons/fa";
import { FaTiktok } from "react-icons/fa";
import { SiGmail } from "react-icons/si";

type CrewCardProps = {
    image: string;
    name: string;
    facebook?: string;
    instagram?: string;
    tiktok?: string;
    email?: string
}


export default function CrewCard({image, name, facebook, instagram, tiktok, email}: CrewCardProps) {
    return (
        <div className="relative crew-card">
            <div className="relative border-b-2 w-full h-3/4">
                <Image
                    src={image}
                    alt="Crew member"
                    fill
                    className="object-cover crew-card-image"
                />
            </div>
            <div className="relative h-1/4">
                <div className="flex-center w-full h-1/2 border-b-2 text-xl">{name}</div>
                <div className="flex-center gap-2.5 w-full h-1/2 bg-[#00000088] crew-card-contact">
                    {facebook && 
                        <a 
                            href={facebook}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="transition-colors duration-150 hover:text-[#FBBF24]"
                        >
                            <FaFacebook size={24}/>
                        </a>
                    }
                    {instagram &&   
                        <a 
                            href={instagram}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="transition-colors duration-150 hover:text-[#FBBF24]"
                        >
                            <FaInstagram size={24}/>
                        </a>
                    }
                    {tiktok &&                   
                        <a 
                            href={tiktok}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="transition-colors duration-150 hover:text-[#FBBF24]"
                        >
                            <FaTiktok size={24}/>
                        </a>
                    }
                    {email &&                    
                        <a 
                            href={email}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="transition-colors duration-150 hover:text-[#FBBF24]"
                        >
                            <SiGmail size={24}/>
                        </a>
                    }
                </div>
            </div>
        </div>
    )
}