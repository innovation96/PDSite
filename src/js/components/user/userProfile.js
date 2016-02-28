import React from 'react';

const UserProfile = React.createClass({
  propTypes: {
    user: React.PropTypes.shape({
      _id: React.PropTypes.string.isRequired,
      username: React.PropTypes.string.isRequired,
      name: React.PropTypes.string.isRequired,
      profilePicture: React.PropTypes.string.isRequired,
      following: React.PropTypes.array.isRequired,
      followers: React.PropTypes.array.isRequired,
      followedChannels: React.PropTypes.array.isRequired
    })
  },

  render() {
    return (
    <div className="profile-wrapper">
      <h2 className="username">{this.props.user.username}</h2>
      <h3 className="fullname">{this.props.user.name}</h3>
      <div className="user-profile-avatar">
        <span className="avatar-big">
          <img src={this.props.user.profilePicture} alt={'Avatar of ' + this.props.user.name} />
        </span>
      </div>
      <div className="user-detail">
        <div className="section">
          <p className="number"><strong>{this.props.user.following.length}</strong></p>
          <p className="description">Following</p>
        </div>
        <div className="section">
          <p className="number"><strong>{this.props.user.followers.length}</strong></p>
          <p className="description">Followers</p>
        </div>
        <div className="section">
          <p className="number"><strong>{this.props.user.followedChannels.length}</strong></p>
          <p className="description">Channels</p>
        </div>
      </div>
      <button className="action-button-hollow-blue follow-button">Follow</button>
    </div>
    );
  }
});

export default UserProfile;