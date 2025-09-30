'use client';

import Link from "next/link";
import { useEffect, useRef, useState } from "react";

const DIRECTIONS = {
    BOTTOM: 'bottom',
    TOP: 'top',
    LEFT: 'left',
    RIGHT: 'right'
};

function getDirectionClosestEdge(clientX, clientY, rect) {
    const top = Math.abs(clientY - rect.top);
    const bottom = Math.abs(rect.bottom - clientY);
    const left = Math.abs(clientX - rect.left);
    const right = Math.abs(rect.right - clientX);

    const min = Math.min(top, bottom, left, right);
    if (min === top) return "top";
    if (min === bottom) return "bottom";
    if (min === left) return "left";
    return "right";
}

export default function DirectionalHoverLink({ children, className, href }) {

    const [enterDirection, setEnterDirection] = useState(null); // 'top', 'right', 'bottom', 'left'
    const [exitDirection, setExitDirection] = useState(null);
    const [isHovered, setIsHovered] = useState(false);
    const [isPreparing, setIsPreparing] = useState(false);

    const containerRef = useRef(null);

    const getDirection = (x, y, rect) => {

        return getDirectionClosestEdge(x, y, rect)
    };

    const handleMouseEnter = (e) => {
        if (!containerRef.current) return;
        const rect = containerRef.current.getBoundingClientRect();
        const dir = getDirection(e.clientX, e.clientY, rect);

        setEnterDirection(dir);
        setExitDirection(null);

        // 1) prepare: set from-{dir} and disable transitions
        setIsPreparing(true);
        setIsHovered(false);

        // 2) next frame: force reflow so the "from" transform is applied without animation,
        // then enable transitions and set hovered so it animates INTO view
        requestAnimationFrame(() => {
            // force reflow
            if (containerRef.current) void containerRef.current.offsetWidth;

            requestAnimationFrame(() => {
                setIsPreparing(false);
                setIsHovered(true);
            });
        });

    };

    const handleMouseLeave = (e) => {
        if (!containerRef.current) return;
        const rect = containerRef.current.getBoundingClientRect();
        const dir = getDirection(e.clientX, e.clientY, rect);

        // If we were still preparing (fast in+out), cancel preparing and animate out.
        if (isPreparing) {
            setIsPreparing(false);
        }

        // set exit side and remove hovered so .bg transitions toward to-{dir}
        setEnterDirection(null);
        setExitDirection(dir);

        setIsHovered(false);

    };

    const classes = [
        className,
        "directional-btn",
        isPreparing ? "preparing" : "",
        enterDirection ? `enter-${enterDirection}` : "",
        exitDirection ? `exit-${exitDirection}` : "",
        isHovered ? "hovered" : "",
    ].filter(Boolean).join(" ");



    return (
        <Link ref={containerRef}
            href={href}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            className={classes}
        >
            <div className="bg"></div>
            {children}
        </Link >

    );
}
