import React from 'react';

const ChannelPage = React.createClass({
  render() {
    return (
    <div className="page-body">
      <div className="channel-wrapper">
        <button className="action-button-hollow-blue join-channel-button">+ Join</button>
        <h2 className="title"><span className="hash-sign">#</span><span className="channel-title">Game of Thrones</span></h2>
        <p className="channel-detail">323 Members • 122 Posts</p>
        <ul className="channel-members-list">
          <li className="channel-member"><a className="avatar-small" href="#"><img src="images/yeh_avatar.jpg" width="40" height="40" /></a></li>
          <li className="channel-member"><a className="avatar-small" href="#"><img src="images/jwt_avatar.jpg" width="40" height="40" /></a></li>
          <li className="channel-member"><a className="avatar-small" href="#"><img src="images/yeh_avatar.jpg" width="40" height="40" /></a></li>
          <li className="channel-member"><a className="avatar-small" href="#"><img src="images/jwt_avatar.jpg" width="40" height="40" /></a></li>
          <li className="channel-member"><a className="avatar-small" href="#"><img src="images/yeh_avatar.jpg" width="40" height="40" /></a></li>
          <li className="channel-member"><a className="avatar-small" href="#"><img src="images/jwt_avatar.jpg" width="40" height="40" /></a></li>
          <li className="channel-member"><a className="avatar-small" href="#"><img src="images/yeh_avatar.jpg" width="40" height="40" /></a></li>
          <li className="channel-member"><a className="avatar-small" href="#"><img src="images/jwt_avatar.jpg" width="40" height="40" /></a></li>
          <li className="channel-member"><a className="avatar-small" href="#"><img src="images/yeh_avatar.jpg" width="40" height="40" /></a></li>
          <li className="channel-member"><a className="avatar-small" href="#"><img src="images/jwt_avatar.jpg" width="40" height="40" /></a></li>
          <li className="channel-member"><a className="avatar-small" href="#"><img src="images/yeh_avatar.jpg" width="40" height="40" /></a></li>
          <li className="channel-member"><a className="avatar-small" href="#"><img src="images/jwt_avatar.jpg" width="40" height="40" /></a></li>
        </ul>
      </div>
      <div className="pundits-filter">
        <button className="pundit-filter selected">Top</button><button className="pundit-filter">Recent</button>
      </div>
      <div className="pundit-wrapper">
        pundits list here
      </div>
    </div>
    );
  }
});

export default ChannelPage;
