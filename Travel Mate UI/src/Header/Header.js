import React from 'react';
import { Link } from 'react-router-dom';
import { AiOutlineHome } from 'react-icons/ai';
import { SiAboutDotMe } from 'react-icons/si';
import { MdRestaurantMenu } from 'react-icons/md';
import { MdRateReview } from 'react-icons/md';
//import { GrContact } from 'react-icons/gr';
import { AiOutlineLogin } from 'react-icons/ai';
import { MdContactMail } from 'react-icons/md';

import "./header.scss";

const Header = () => {
  return (
    <header className="header">
      <nav className="navbar">
        <a href="#home">
          <div className="logo">Travel Mate</div>
        </a>
        <div className="travelItems">
          <a href="#home">
            <div className="travelItems">Home</div>
          </a>
          <a href="#about">
            <div className="travelItems">About</div>
          </a>
          <a href="#work">  
            <div className="travelItems">Work</div>
          </a>
          <a href="#review">  
            <div className="travelItems">Review</div>
          </a>
          <a href="#contact">
            <div className="travelItems">Contact</div>
          </a>
          <Link to="/login">
          <div className="travelItems">Login</div>
          </Link>
        </div>
      </nav>

      <nav className="mobileNavbar">
        <div className="mobileItems">
          <a href="#home">
            <div className="mobileItem"><AiOutlineHome /></div>
          </a>
          <a href="#about">
            <div className="mobileItem"><SiAboutDotMe /></div>
          </a>
          <a href="#work">
            <div className="mobileItem"><MdRestaurantMenu /></div>
          </a>
          <a href="#review">
            <div className="mobileItem"><MdRateReview /></div>
          </a>
          <a href="#contact">
            <div className="mobileItem"><MdContactMail /></div>
          </a>
          <Link to="/login">
            <div className="mobileItem"><AiOutlineLogin /></div>
          </Link>
        </div>
      </nav>
    </header>
  );
};

export default Header;
