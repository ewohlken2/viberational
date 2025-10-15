'use client';

import "./logo.css";
import Image from "next/image";



export default function HeaderLogo() {


    return (
        <Link className="header-logo" href="/#home">
            <div className="link-text">Home</div>

            <picture className="logo-letter"><Image
                className="image"
                src="/epsilon1.svg"
                alt="Logo Letter 1"
                width={100}
                height={100}
                priority
            /></picture>
            <picture className="logo-letter"><Image
                className="image"
                src="/epsilon1.svg"
                alt="Logo Letter 2"
                width={100}
                height={100}
                priority
            /></picture>
        </Link>

    );
}
