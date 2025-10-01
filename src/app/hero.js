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
                        <div className="intro-header-2">I`&lsquo;m a Full Stack Web Developer in LA and</div>
                    </div>
                    <Link className="button button--light" href="/contact">
                        I want to work with you
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
