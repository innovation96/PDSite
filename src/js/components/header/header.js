import React from 'react';

const Header = React.createClass({
  // backup an unused markup here
  // <button className="upload-button action-button-blue">+ Upload</button>
  render() {
    return (
      <header className="page-header">
        <div className="page-header-content">
          <a href="/"><h1 className="logo two-x-bg-icons">Pundit</h1></a>
          <form action="#" className="global-search-form">
            <input type="search" id="globalSearch" className="global-search" placeholder="Search for people and channels" />
            <button className="global-search-button">Search</button>
          </form>
          <a className="header-avatar avatar-small" href="#"><img src="images/yeh_avatar.jpg" width="40" height="40" /></a>
        </div>
      </header>
    );
  }
});

export default Header;
