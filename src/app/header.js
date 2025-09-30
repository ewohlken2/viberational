'use client';

import { useEffect, useState } from "react";
import DirectionalHoverLink from "./directional-hover";
import "./header.css";


export default function Header() {
    const [scrolled, setScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            if (window.scrollY > 100) { // Adjust threshold as needed
                setScrolled(true);
            } else {
                setScrolled(false);
            }
        };

        window.addEventListener('scroll', handleScroll);

        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, []);


    return (
        <div className={scrolled ? 'header header-scrolled' : 'header'}>
            <DirectionalHoverLink className="header-logo" href="/#home">
                <div className="link-text">Home</div>
            </DirectionalHoverLink>

            <DirectionalHoverLink className="header-link" href="/#about">
                <div className="link-text">About</div>
            </DirectionalHoverLink>
            <DirectionalHoverLink className="header-link" href="/#experience">
                <div className="link-text">Experience</div>
            </DirectionalHoverLink>
            <DirectionalHoverLink className="header-link" href="/#portfolio">
                <div className="link-text">Portfolio</div>
            </DirectionalHoverLink>
            <DirectionalHoverLink className="header-link" href="/contact">
                <div className="link-text">Contact</div>
            </DirectionalHoverLink>
        </div >

    );
}
