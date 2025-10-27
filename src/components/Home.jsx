// src/components/Home.jsx

import React from "react";
import { useNavigate } from "react-router-dom";

// Icons
import { ImMenu } from "react-icons/im";
import { FaPlay } from "react-icons/fa6";
import { MdEmojiPeople } from "react-icons/md";
import { IoIosNotifications } from "react-icons/io";
import { MdEmail } from "react-icons/md";
import { IoMdReturnLeft } from "react-icons/io";

// Assets
import logo from '../assets/logo.png';
import esLogo from '../assets/esLogo.png';
import ODS from '../assets/ODS.png';
import menu from '../assets/menu.png';

// Styles
import './Home.css';

export default function Home() {
    const navigate = useNavigate();

  const handleReturn = () => {
    navigate('/login'); //  redireciona para a tela de login
};

    return (
        <div className="container">
            {/* Background Elements */}
            <img src={logo} className="logo" alt="Application Logo" aria-label="Application Logo" />
            <img src={esLogo} className="esLogo" alt="World Illustration" aria-label="World Illustration" />
            <img src={ODS} className="ODS" alt="Sustainable Development Goals" aria-label="SDG Icon" />
            <img src={menu} className="menu" alt="System Components" aria-label="Components Illustration" />

            {/* Navigation Icons */}
            <div className="menuIcon" role="button" aria-label="Menu">
                <ImMenu size={24} />
            </div>
            
            {/* Main Action Button */}
            <div className="playIcon" role="button" aria-label="Play Content">
                <FaPlay size={24} />
            </div>
            
            {/* User Interaction Icons */}
            <div className="peopleIcon" role="button" aria-label="User Profiles">
                <MdEmojiPeople size={24} />
            </div>
            
            <div className="notificationIcon" role="button" aria-label="Notifications">
                <IoIosNotifications size={24} />
            </div>
            
            <div className="emailIcon" role="button" aria-label="Messages">
                <MdEmail size={24} />
            </div>

            {/* Return Button */}
            <div 
                className="returnButton" 
                onClick={handleReturn}
                role="button"
                aria-label="Return to presentation"
                tabIndex={0}
            >
                <IoMdReturnLeft className="returnIcon" />
            </div>
        </div>
    );
}