import React from 'react';

const HomePage = React.createClass({
  render() {
    return (
    <div className="page-body pundit-talk">
      <div className="pundit-wrapper">
        <a className="pundit-avatar avatar-small" href="#"><img src="images/yeh_avatar.jpg" width="40" height="40" /></a>
        <div className="pundit-details">
          <div className="pundit-tag">
            <a href="#" className="username">username</a> → <a href="#" className="tag">#UXDesgin</a>
          </div>
          <div className="pundit-subject">
            <p>How many licks does it take to get to the center of a tootsie pop? Is it a lot?</p>
            <img src="images/link_small_icon.png" width="15" height="15" />
            <a href="#" className="pundit-link">http://techcrunch.com/2016/02/05/...</a>
          </div>
        </div>
      </div>
    </div>
    );
  }
});

export default HomePage;