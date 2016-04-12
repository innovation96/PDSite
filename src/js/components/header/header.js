import React from 'react';
import {Link} from 'react-router';

const Header = React.createClass({
  // backup an unused markup here
  // <button className="upload-button action-button-blue">+ Upload</button>
  render() {
    return (
      <header className="page-header">
        <div className="page-header-content">
          <Link to="/"><h1 className="logo two-x-bg-icons">Pundit</h1></Link>
          <form action="#" className="global-search-form">
            <input type="search" id="globalSearch" className="global-search" placeholder="Search for people and channels" />
            <button className="global-search-button">Search</button>
          </form>
          <a className="header-avatar app-store-badge" href="https://itunes.apple.com/us/app/pundit-talk-about-your-latest/id944061760?mt=8"><img src="images/app-store-btn.png" width="140" height="46" /></a>
          <form action="#" className="phone-number-input">
            <input type="text" className="phone-number" placeholder="+1 333-333-3333" />
            <button className="hvr-back-pulse send-app-button">Send Me the App</button>
          </form>
        </div>
      </header>
    );
  }
});

export default Header;
