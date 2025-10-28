'use client';

import "./home.css";

import HeaderContext from './context/headerContext';
import { useEffect, useLayoutEffect, useState } from "react";
import Header from "./header";

export default function Wrapper({ children, headerRefs, intialSection }) {


    const [topSection, setTopSection] = useState(intialSection);

    // set initial top section

    useLayoutEffect(() => {
        console.log('running it now')
        let topSection = intialSection;
        if (!headerRefs) return;
        headerRefs.forEach((targetRef) => {
            if (targetRef.current) {
                if (targetRef.current.getBoundingClientRect().top <= 0) {
                    topSection = targetRef.current.id;
                }
            }
        })

        setTopSection(topSection);
    }, [headerRefs]);

    useEffect(() => {

        const unsub = [];

        if (!headerRefs) return;

        headerRefs.forEach((targetRef) => {


            const observer = new IntersectionObserver(
                ([entry]) => {



                    if (entry.isIntersecting) {
                        console.log('setting top section to ', targetRef?.current?.id);
                        setTopSection(targetRef?.current?.id);

                    }
                },
                {
                    root: null, // defaults to the viewport
                    rootMargin: '-50px 0px -100% 0px', // This creates a margin that makes the intersection occur when the top of the element hits the top of the viewport.
                    // A rootMargin of '0px 0px -100% 0px' means the bottom of the root (viewport)
                    // is effectively moved up to the top, so intersection only happens when the
                    // observed element enters this "top-only" intersection area.
                    threshold: 0, // Trigger as soon as any part of the element enters the rootMargin defined area
                }
            );


            // const observer2 = new IntersectionObserver(
            //     ([entry]) => {

            //         // entry.boundingClientRect.top gives the distance from the viewport top
            //         // entry.intersectionRect.top gives the distance of the intersecting part from viewport top
            //         // When the element's top hits the viewport top, entry.boundingClientRect.top will be close to 0.
            //         // We can use rootMargin to create a small "trigger zone" at the top.


            //         if (entry.isIntersecting) {
            //             console.log(entry)
            //             console.log(targetRef.current.id, "isvisible on screen");
            //         }
            //     },
            //     {
            //         root: null, // defaults to the viewport
            //         rootMargin: '0px 0px 0px 0px',

            //         threshold: 0, // Trigger as soon as any part of the element enters the rootMargin defined area
            //     }
            // );

            if (targetRef.current) {
                let target = targetRef.current;
                observer.observe(target);
                // observer2.observe(targetRef.current);

                unsub.push(() => {
                    observer.unobserve(target);
                    // observer2.unobserve(targetRef.current);
                });
            }
        });

        return () => {
            unsub.forEach((un) => un());
        }

    }, []); // Empty dependency array ensures this runs once on mount


    return (



        <>
            <Header topSection={topSection}></Header>
            {children}
        </>

    );
}
