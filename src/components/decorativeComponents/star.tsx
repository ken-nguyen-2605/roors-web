"use client";

import React from "react";

type StarProps = {
    className?: string;
    color?: string;
    size?: number | string;
};

export default function Star({ className, color, size} : StarProps) {
    return (
        <svg
            className={className}
            viewBox="0 0 100 100"
            width={size}
            height={size}
            aria-hidden="true" 
        >
            <path
                d="
                    M 50 0
                    Q 50 50 100 50
                    Q 50 50 50 100
                    Q 50 50 0 50
                    Q 50 50 50 0
                    Z
                "
                fill={color} 
            />
        </svg>
    )
}