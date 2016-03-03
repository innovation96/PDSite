import React from 'react';
import $ from 'jquery';
import settings from '../../settings';
import Reply from './reply';

const ReplyList = React.createClass({
  getInitialState() {
    return {
      meta: { limit: 10, page: 1, total: 0, pages: 1 },
      data: {
        replies: []
      },
      error: null
    };
  },

  componentDidMount() {
    $.ajax({
      url: settings.apiBase + 'talks/' + this.props.talkId + '/replies',
      dataType: 'json',
      success: this.didFetchReplies,
      error: this.didFailFetchingReplies
    });
  },

  render() {
    return (
    <div>
      {this.state.data.replies.map(reply => (<Reply key={reply._id} reply={reply} />))}
    </div>
    );
  },

  didFetchReplies: function(data) {
    // TODO: Nested replies and user data
    this.setState(data);
  },

  didFailFetchingReplies: function($xhr, status, error) {
    console.error(error);
  }
});

export default ReplyList;
