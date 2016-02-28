import React from 'react';
import settings from '../../settings';
import UserProfile from './userProfile';
import TalkList from '../talk/talkList';

const UserPage = React.createClass({
  getInitialState() {
    return {
      user: {
        _id: '',
        username: '',
        name: '',
        profilePicture: '', // maybe provide a placeholder
        following: [],
        followers: [],
        followedChannels: []
      }
    };
  },

  componentDidMount() {
    $.ajax({
      url: settings.apiBase + 'users/' + this.props.params.id,
      dataType: 'json',
      success: this.didFetchUserProfile,
      error: this.didFailFetchingUserProfile
    });
  },

  render() {
    return (
    <div className="page-body">
      <UserProfile user={this.state.user} />
      <TalkList url={settings.apiBase + 'users/' + this.props.params.id + '/talks'} />
    </div>
    );
  },

  didFetchUserProfile(data) {
    this.setState({
      user: {
        _id: data.user._id,
        username: data.user.username,
        name: data.user.name,
        profilePicture: data.user.profilePicture,
        following: data.user.following,
        followers: data.user.followers,
        followedChannels: data.user.followedChannels
      }
    });
  },

  didFailFetchingUserProfile($xhr, status, error) {
    console.error(error);
  }
});

export default UserPage;