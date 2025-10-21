"use client";

import { useEffect, useState } from "react";
import Image from "next/image";

type SlideBackgroundProps = {
    children?: React.ReactNode;
    images : string[];
    interval?: number;
    transitionDuration?: number;
    className? : string;
    overlay? : string;
}

export default function SlideBackground({
    children,
    images,
    interval = 3000,
    transitionDuration,
    className,
    overlay,
}: SlideBackgroundProps) {

    const [idx, setIdx] = useState(0);

    useEffect(() => {
        if (images.length <= 1) return;
        const id = setInterval(() => setIdx((p) => (p + 1) % images.length), interval);
        return () => clearInterval(id);
    }, [images.length, interval, transitionDuration]);

    return (
        <div className={`relative overflow-hidden ${className}`}>
            {images.map((src, i) => (
                <div
                    key={src}
                    className="absolute inset-0 bg-cover bg-center bg-fixed"
                    style={{
                        backgroundImage: `url(${src})`,
                        opacity: i === idx ? 1 : 0,
                        transition: `opacity ${transitionDuration}ms ease-in-out`,
                    }}
                />
            ))}
            {overlay &&
            <div className={`absolute inset-0 pointer-events-none ${overlay}`}/>}

<<<<<<< Updated upstream:src/ultility/slidebackground.tsx
            <div className="absolute">{children}</div>
=======
            <div className="absolute inset-0 pointer-events-none bg-black/75"/>

            <div>{children}</div>
>>>>>>> Stashed changes:src/utils/slidebackground.tsx
        </div>
    )
}
