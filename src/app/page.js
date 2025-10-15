'use client';

import "./home.css";


import Image from "next/image";
import Header from "./header";
import HeroBanner from "./hero";
import Tabs from "./tabs";
import { list } from "postcss";
import Link from "next/link";

const TABS_CONTENT = [{
  title: 'tab 1',
  content: 'lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum. lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum. lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
  list: ['item 1', 'item 2', 'item 3'],
  date: '2020 - Present',
}, {
  title: 'tab 2',
  content: 'lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
  list: ['item 1', 'item 2', 'item 3'],
  date: '2020 - Present',
}, {
  title: 'tab 3',
  content: 'lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
  list: ['item 1', 'item 2', 'item 3'],
  date: '2020 - Present',
}]

export default function Home() {

  function onMainBtnClick() {
    console.log('clicked');
  }

  return (
    <div id="home">
      {/* main banner start */}
      <HeroBanner />
      {/* main banner end */}

      {/* About Section Start */}
      <div id="about" className="section section-about">
        <div className="section-content">
          <h2 className="h2">
            About
          </h2>
          <p>
            lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
          </p>
          <p>
            lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
          </p>
          <p>
            lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
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


    </div >

  );
}
