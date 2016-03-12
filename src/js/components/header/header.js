import React from 'react';
import {Link} from 'react-router';

const Header = React.createClass({
  // backup an unused markup here
  // <button className="upload-button action-button-blue">+ Upload</button>
  /*<header className="page-header">
    <div className="page-header-content">
      <Link to="/"><h1 className="logo two-x-bg-icons">Pundit</h1></Link>
      <form action="#" className="global-search-form">
        <input type="search" id="globalSearch" className="global-search" placeholder="Search for people and channels" />
        <button className="global-search-button">Search</button>
      </form>
      <a className="header-avatar avatar-small" href="#"><img src="images/yeh_avatar.jpg" width="40" height="40" /></a>
    </div>
  </header>*/

  render() {
    return (
      <header className="login-bar">
        <a className="nav-logo">
          <img src="images/logo-white.png" />
        </a>
        <div className="nav-social">
          <a href="https://www.facebook.com/getpundit" target="_blank">
              <img src="images/facebook-icon.png" />
          </a>
          <a href="https://www.twitter.com/getpundit" target="_blank">
              <img src="images/twitter-icon.png" />
          </a>
        </div>
      </header>
    );
  }
});

export default Header;
