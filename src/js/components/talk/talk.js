import React from 'react';
import {Link} from 'react-router';

const Talk = React.createClass({
  // TODO: Line 29 should also have the following markup. But it looks like the info is not a channel.
  // → <Link to={'/channels/' + this.props.talk.channels[0]._id} className="tag">#{this.props.talk.channels[0].name}</Link>
  render() {
    return (
    <div className="pundit-wrapper">
      <Link to={'/users/' + this.props.talk.user._id} className="pundit-avatar avatar-small"><img src={this.props.talk.user.profilePicture} width="40" height="40" /></Link>
      <div className="pundit-details">
        <div className="pundit-tag">
          <Link to={'/users/' + this.props.talk.user._id} className="username">{this.props.talk.user.name}</Link>
        </div>
        <div className="pundit-subject">
          <p>{this.props.talk.title}</p>
          <img src="images/link_small_icon.png" width="15" height="15" />
          <a href={this.props.talk.shortUrl} className="pundit-link">{this.props.talk.shortUrl}</a>
        </div>
      </div>
    </div>
    );
  }
});

export default Talk;