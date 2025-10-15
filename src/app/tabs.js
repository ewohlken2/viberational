'use client';

import { useState } from "react";
import "./tabs.css";


export default function Tabs({ tabs }) {

    const [activeTab, setActiveTab] = useState(0);

    const titles = tabs.map((tab, index) => (
        <div onClick={() => setActiveTab(index)} key={index} className={index == activeTab ? "tab-title active" : "tab-title"}>
            <div className="tab-title-text">{tab.title}</div>
        </div>
    ));

    const tabContent = tabs.map((tab, index) => (
        <div key={index} className={index == activeTab ? "tab-content active" : "tab-content"} >


            <div className="date">{tab.date}</div>
            <p className="content">{tab.content}</p>
            <div className="list">
                {tab.list.map((item, index) => <div key={index} className="list-item">{item}</div>)}
            </div>
        </div>
    ));

    return (
        <div className="tabs-container">
            <div className="tabs">
                {titles}
            </div>

            <div className="tab-content-container">
                {tabContent}

            </div>
        </div>

    );
}
