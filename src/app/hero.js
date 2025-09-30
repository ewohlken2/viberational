'use client';

import Link from 'next/link'


import Image from "next/image";

export default function HeroBanner() {



    return (
        <div className="main-banner-container">
            <div className="main-banner">
                <div className="main-banner-content">
                    <div className="title">
                        <span className="intro-header">Hello, my name is </span>
                        <h1 className="main-header">Elvis Wohlken</h1>
                        <span className="intro-header">Freelance Web Developer in Los Angeles </span>
                    </div>
                    <Link className="button" href="/contact">
                        Contact Me
                    </Link>
                </div>

                <picture className="main-banner-image"><Image
                    className="image"
                    src="/hero.jpg"
                    alt="Main Banner"
                    width={360}
                    height={480}
                    priority
                /></picture>
            </div >
        </div>


    );
}
