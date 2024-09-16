import React from "react";
import { Route, Switch } from "react-router-dom";
import Header from "./Header/Header";
import Home from "./Home/Home";
import About from "./About/About";
import Work from "./Work/Work";
import Contact from "./Contact/Contact";
import Footer from "./Footer/Footer";
import LoginPage from "./Login/Login";
import RegisterPage from './Register/RegisterPage';
import UserDashboard from "./UserDashboard";
import Travelrecommendation from "./Travelrecommendation";
import forgot_password from "./forgot_password";
import Reset_Password from "./Reset_Password";
import ReviewForm from './ReviewForm';
import ReviewList from './ViewReview/ReviewList';
import { FaArrowAltCircleUp } from "react-icons/fa";
import 'react-toastify/dist/ReactToastify.css';

import "./App.scss";


const AppLayout = ({ children }) => {
  const topOfThePageHandler = () => {
    document.body.scrollTop = 0;
    document.documentElement.scrollTop = 0;
  };
  
  return (
    <div>
      <FaArrowAltCircleUp
        className="Top-of-the-page"
        onClick={topOfThePageHandler}
      />
      
      <Header />
      <main>{children}</main>
      <Footer />
    </div>
  );
};

const App = () => {
  return (
    <Switch>
      <Route path="/login" component={LoginPage} exact/>
      <Route path="/signup" component={RegisterPage} exact/>
      <Route path="/dashboard" component={UserDashboard} exact/>
      <Route path="/forgot_password" component={forgot_password} exact/>
      <Route path="/Travelrecommendation" component={Travelrecommendation} exact/>
      <Route path="/Reset_Password" component={Reset_Password} exact/>
      <Route path="/ReviewForm" component={ReviewForm} exact/>
      <Route path="/ReviewList" component={ReviewList} exact/>

      
      {/* Default route for other pages */}
      <Route path="/">
        <AppLayout>
          <Route exact path="/">
            <Home />
            <About />
            <Work />
            <ReviewList/>
            <Contact />            
          </Route>
        </AppLayout>
      </Route>
    </Switch>
  );
};

export default App;
