'use client';

import "./home.css";

import HeaderContext from './context/headerContext';
import { useEffect, useLayoutEffect, useState, ReactNode, RefObject } from "react";
import Header from "./header";

interface WrapperProps {
  children: ReactNode;
  headerRefs?: RefObject<HTMLElement>[];
  intialSection?: string;
}

export default function Wrapper({ children, headerRefs, intialSection }: WrapperProps) {
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
  }, [headerRefs, intialSection]);

  useEffect(() => {
    const unsub: (() => void)[] = [];

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

      if (targetRef.current) {
        let target = targetRef.current;
        observer.observe(target);

        unsub.push(() => {
          observer.unobserve(target);
        });
      }
    });

    return () => {
      unsub.forEach((un) => un());
    }
  }, [headerRefs]); // Empty dependency array ensures this runs once on mount

  return (
    <>
      <Header topSection={topSection}></Header>
      {children}
    </>
  );
}
