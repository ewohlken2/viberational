'use client';

import "./home.css";


import Image from "next/image";
import HeroBanner from "./hero";
import Tabs from "./tabs";
import Link from "next/link";
import HeaderContext from './context/headerContext';
import { useContext, useEffect, useRef } from "react";
import Wrapper from "./wrapper";

import { useInView } from "react-intersection-observer";



const TABS_CONTENT = [{
  title: 'Goldencomm',
  content: 'I started my career at a local digital marketing agency as a customer service intern but was quickly promoted to an entry-level developer position. While on the team I worked on developing dynamic, responsive front-end interfaces using JavaScript, HTML, and CSS for a wide range of client projects. Over time I contributed to more than 40 different sites, meeting with clients and project managers to demo new features and share progress updates. Alongside front-end development, I created custom WordPress and Magento themes, plugins, and extensions in PHP, integrating WordPress into over 20 existing codebases to expand functionality and streamline content management for small businesses. This role gave me a strong foundation in full-stack web development and client communication, skills that have been invaluable as I advanced my career.',
  // list: ['item 1', 'item 2', 'item 3'],
  date: '2013 - 2017',
}, {
  title: 'Rhythm Agency',
  content: 'In this role, I worked on a wide range of web applications for more than 25 different agency clients, spanning from enterprise-level e-commerce platforms to smaller, content-focused marketing sites. Projects involved working across multiple systems, including Magento, Shopify, Kentico, and WooCommerce, adapting to each platform’s unique requirements. On the front end, I developed user interfaces for over 20 different sites using Vue.js, and built two single-page applications (SPAs) for enterprise customers with Angular and TypeScript, implementing server-side rendering (SSR) to maximize performance and SEO. I also maintained the shared frontend tooling that supported each new project—managing Webpack, Gulp/Grunt setups, package manager configurations, and custom Node.js build scripts. Additionally, I handled cross-platform debugging and optimization, leveraging BrowserStack and VirtualBox to ensure compatibility and stability across a variety of devices and legacy browsers.',
  // list: ['item 1', 'item 2', 'item 3'],
  date: '2017 - 2020',
}, {
  title: 'Sourceability',
  content: 'In this role, I focused on building flexible, high-performance React components for an enterprise-level B2B e-commerce platform, with a strong emphasis on usability, maintainability, and reliable testing. I took the lead on optimizing the front-end asset pipeline to ensure maximum performance across all major browsers — including legacy versions — using Lighthouse and browser profiling tools to identify and resolve bottlenecks. To improve overall stability and deployment confidence, I also developed automated end-to-end tests with Selenium and integrated them directly into the project’s build and deployment workflows, helping to streamline QA and maintain long-term reliability at scale.',
  // list: ['item 1', 'item 2', 'item 3'],
  date: '2020 - 2021',
},
{
  title: 'Timu',
  content: 'At this role, I collaborated with both local and overseas teams of software engineers to develop a large-scale collaboration platform. My responsibilities included translating business requirements into functional specifications, conducting code reviews, and managing pull requests to ensure consistent quality across the codebase. I built and maintained a reusable Vue component library, complete with documentation and a full testing suite to support long-term scalability. Alongside development work, I mentored newer developers, promoting best practices and helping resolve blockers through paired programming. One of my favorite challenges was building a custom video conferencing tool using the Twilio API, which became a key feature of the platform. Over the course of the project, I delivered on more than 150 sprints and oversaw UI development for numerous features from concept to launch.',
  // list: ['item 1', 'item 2', 'item 3'],
  date: '2021 - 2024',
}]

export default function Home() {




  const homeRef = useRef(null);
  const aboutRef = useRef(null);

  const headerRefs = [homeRef, aboutRef];

  return (

    <Wrapper headerRefs={headerRefs}>
      <div id="home" ref={homeRef}>
        {/* main banner start */}
        <HeroBanner />
        {/* main banner end */}
      </div>

      {/* About Section Start */}
      <div ref={aboutRef} id="about" className="section section-about">
        <div className="section-content">
          <h2 className="h2">
            About
          </h2>


          <p>
            I&apos;m a software engineer and freelance web developer based in Los Angeles. My path into development started at a hometown web agency, where I taught myself to build Wordpress and Magento websites for local businesses. That mix of creativity, problem-solving, and instant feedback from seeing a site come to life hooked me right away.
          </p>
          <p>
            In 2016, I began diving deeper into the Node.js ecosystem, exploring the backend side of development and modern JavaScript tooling. That path quickly led me to Next.js, where I found a framework that allowed me to build fast, scalable web applications at breakneck speeds.
          </p>
          <p>
            Lately, I&apos;ve been branching out creatively. I&apos;m currently teaching myself game development in Unity. On the side, I collaborate with friends on small web projects and experimental apps, the kind that start as late-night ideas and sometimes grow into something real. It keeps the work fun and reminds me why I got into this field in the first place &mdash; to keep exploring what&apos;s possible on the web.
          </p>
        </div>
      </div>
      {/* About Section End */}

      {/* Experience Section Start */}
      <div id="experience" className="section section-experience">


        <div className="section-content">
          <h2 className="h2">
            Experience
          </h2>

          <Tabs tabs={TABS_CONTENT} />

        </div>
      </div>
      {/* Experience Section End */}


      {/* Portfolio Section Start*/}
      {/* <div id="portfolio" className="section section-portfolio">

        <div className="section-content">
          <h2 className="h2">
            Portfolio
          </h2>

        </div>
      </div> */}
      {/* Portfolio Section End */}

      {/* Contact Section Start */}
      <div id="contact" className="section section-contact">
        <div className="section-content">
          <div className="content">
            <h2 className="h2">
              Contact
            </h2>
            <p>
              I am currently available for new opportunities. Whether you have a question or just want to say hi, I&apos;ll try my best to get back to you
            </p>
            <Link className="button button--dark" href="/contact">Contact me now</Link>

          </div>

          <ul className="links">
            <li className="link-wrap"><Link className="link" href="https://github.com/ewohlken2" target="_blank" rel="noopener noreferrer">github</Link></li>
            <li className="link-wrap"><Link className="link" href="https://www.linkedin.com/in/elvis-wohlken/" target="_blank" rel="noopener noreferrer">linkedin</Link></li>
            <li className="link-wrap"><Link className="link" href="https://github.com/ewohlken2/next-site" target="_blank" rel="noopener noreferrer">source</Link></li>
          </ul>
        </div>


      </div>
      {/* Contact Section End */}



    </Wrapper>
  );
}
