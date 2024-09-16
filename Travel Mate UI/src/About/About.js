import React from "react";
import "./about.scss";
import bg from "./g.jpg";

const About = () => {
  return (
    <section id="about" className="about">
      <div className="container">
        <div className="row">
          <div className="aboutContainer">
            <div
              style={{ backgroundImage: `url(${bg})` }}
              className="aboutContainerImg bgImg"
            ></div>

            <div className="aboutContainerDetails">
              <h1>
                <span className="colorGrey">Where</span> Your Travel Preference <span className="colorGrey"> Matters</span>
              </h1>
              <p>
              A Conversational Journey and Exploration Experience.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
