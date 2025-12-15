"use client";

import React from "react";

type LineProps = {
    className?: string;
    color?: string;
    size?: number | string;
    direction?: "horizontal" | "vertical";
    thinkness?: number;
};

export default function Line({
    className,
    color,
    size,
    direction,
    thinkness,
}: LineProps) {
    // Provide sensible defaults so <Line /> can be used without props
    const finalDirection: "horizontal" | "vertical" = direction ?? "horizontal";
    const finalThickness = thinkness ?? 2;
    const finalSize = size ?? 100;
    const finalColor = color ?? "#000000";

    if (finalDirection === "horizontal") {
        return (
            <svg
                className={className}
                width={finalSize}
                height={finalThickness}
                viewBox={`0 0 ${finalSize} ${finalThickness}`}
                aria-hidden="true"
            >
                <path
                    d={`M 0 ${finalThickness / 2} H ${finalSize}`}
                    stroke={finalColor}
                    strokeWidth={finalThickness}
                />
            </svg>
        );
    }

    return (
        <svg
            className={className}
            width={finalThickness}
            height={finalSize}
            viewBox={`0 0 ${finalThickness} ${finalSize}`}
            aria-hidden="true"
        >
            <path
                d={`M ${finalThickness / 2} 0 V ${finalSize}`}
                stroke={finalColor}
                strokeWidth={finalThickness}
            />
        </svg>
    );
}