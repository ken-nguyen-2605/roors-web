"use client";

import React from "react";

type LineProps = {
    className?: string;
    color?: string;
    size?: number | string;
    direction: "horizontal" | "vertical";
    thinkness?: number;
}

export default function Line({className, color, size, direction, thinkness} : LineProps) {
    if (direction === "horizontal") {
        return (
            <svg
                className={className}
                width={size}
                height={thinkness}
                viewBox={`0 0 ${size} ${thinkness}`}
                aria-hidden="true"
            >
                <path
                    d={`M 0 ${thinkness! / 2} H ${size}`}
                    stroke={color}
                    strokeWidth={thinkness}
                />
            </svg>
        )
    }
        
    return (
        <svg
            className={className}
            width={thinkness}
            height={size}
            viewBox={`0 0 ${thinkness} ${size}`}
            aria-hidden="true"
        >
            <path
                d={`M ${thinkness! / 2} 0 V ${size}`}
                stroke={color}
                strokeWidth={thinkness}
            />
        </svg>
    )
}