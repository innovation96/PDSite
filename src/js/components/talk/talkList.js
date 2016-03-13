import React from 'react';
import $ from 'jquery';
import Talk from './talk';

const TalkList = React.createClass({
  getInitialState() {
    return {
      meta: { limit: 10, page: 1 },
      data: {
        talks: []
      },
      error: null
    };
  },

  componentDidMount() {
    $.ajax({
      url: this.props.url,
      data: 'populate=user,channels',
      dataType: 'json',
      success: this.didFetchTalks,
      error: this.didFailFetchingTalks
    });
  },

  render() {
    return (
    <div className="">
      {this.state.data.talks.map(talk => (<Talk key={talk._id} talk={talk} />))}
    </div>
    );
  },

  didFetchTalks: function(data) {
    this.setState(data);
  },

  didFailFetchingTalks: function($xhr, status, error) {
    console.error(error);
  }
});

export default TalkList;
