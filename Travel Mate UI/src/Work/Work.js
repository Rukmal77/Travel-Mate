import React from "react";
import "./Work.scss";
import bg from "./d.jpg";

const Work = () => {
  return (
    <section
      id="work"
      className="foodMenu bgImg bgImgFixed"
      style={{ backgroundImage: `url(${bg})` }}
    >
      <div className="container">
        {/* Content from Testimonial component */}
        <div className="testimonialsHeaderBackground">
        <h1 className="testimonialsHeader">How It Works !
        <br />
        Enter your travel preferences and enjoy a journey tailored to your travel tastes. 
<br />
Enter your details to get a best accommodation place for your budget</h1>
</div>
        <div className="testimonialsAll">
          <div className="workdetail">
            <img className="bgImg" src="./assets/user/a.jpg" alt="" />
            <h1>Personal Travel experience</h1>
            <p>
            Pick your travel destination easily.
            </p>
          </div>

          <div className="workdetail">
            <img className="bgImg" src="./assets/user/b.jpg" alt="" />
            <h1>Enter budget and preference</h1>
            <p>
            Enter budget and preference to get a travel recommendation.
            </p>
          </div>

          <div className="workdetail">
            <img className="bgImg" src="./assets/user/c.jpg" alt="" />
            <h1>Best Reply</h1>
            <p>
            Best travel place to your request.
            </p>
          </div>
        </div>
      </div>
      <div className="spacer"></div>
    </section>
  );
};

export default Work;

