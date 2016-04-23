/* global superagent,WaveSurfer */

var API_BASE = 'http://api.getpundit.com/';
var SITE_BASE_URL = 'https://getpundit.com/';

function parseQueryString() {
  var urlParams = {};
  var pl = /\+/g;  // Regex for replacing addition symbol with a space
  var search = /([^&=]+)=?([^&]*)/g;
  var decode = function (s) { return decodeURIComponent(s.replace(pl, ' ')); };
  var query  = window.location.search.substring(1);
  var match;

  while (match = search.exec(query)) {
    urlParams[decode(match[1])] = decode(match[2]);
  }

  return urlParams;
}

function render(data) {
  var html = '' +
    '<div class="summary">' +
      '<span class="username">' + data.username + '</span>' +
      '<span class="topic">' + (data.topic || '') + '</span>' +
    '</div>' +
    '<p class="text">' + data.text + '</p>' +
    '<button id="playButton" class="player-button play-button">Play</button>' +
    '<button id="pauseButton" class="player-button pause-button hidden">Pause</button>' +
    '<a class="reply-link" href="' + data.clickurl + '" target="_blank">Reply to ' + data.username + '</a>';

  if (data.points !== undefined) {
    html += '<p class="points">' + data.points + ' Points</p>';
  }

  document.getElementById('mainContent').innerHTML = html;
  document.getElementById('avatar').style.backgroundImage = 'url(' + data.avatar + ')';

  loadAudio(data.audio);
}

function loadAudio(audio) {
  var waveSurfer = WaveSurfer.create({
    container: '#audioWave',
    barWidth: 3,
    cursorWidth: 0,
    height: 130,
    progressColor: '#08a1bf',
    waveColor: 'rgba(224, 224, 224, 0.6)'
  });
  waveSurfer.on('ready', bind.bind(null, waveSurfer));
  waveSurfer.load(audio);
}

function bind(waveSurfer) {
  var playBtn = document.getElementById('playButton');
  var pauseBtn = document.getElementById('pauseButton');
  var showPlay = function() {
    playBtn.className = 'player-button play-button';
    pauseBtn.className = 'player-button pause-button hidden';
  };
  var showPause = function() {
    playBtn.className = 'player-button play-button hidden';
    pauseBtn.className = 'player-button pause-button';
  };

  playBtn.addEventListener('click', function() {
    waveSurfer.play();
  });
  pauseBtn.addEventListener('click', function() {
    waveSurfer.pause();
  });
  waveSurfer.on('play', showPause);
  waveSurfer.on('pause', showPlay);
  waveSurfer.on('finish', showPlay);
}

function getTalk(id) {
  var data = {};

  superagent
    .get(API_BASE + 'talks/' + id)
    .query({ populate: 'user,channels' })
    .end(function(err, res) {
      if (err) return;

      var talk = res.body.talk;
      data.id = talk._id;
      data.username = talk.user.username;
      data.avatar = talk.user.profilePicture;
      data.topic = talk.channels[0].name;
      data.text = talk.title;
      data.points = talk.points;
      data.audio = talk.audioIntroduction.url;
      data.clickurl = SITE_BASE_URL + 'talks/' + talk._id;

      render(data);
    });
}

function getReply(id) {
  var data = {};

  superagent
    .get(API_BASE + 'replies/' + id)
    .query({ populate: 'creator' })
    .end(function(err, res) {
      if (err) return;

      var reply = res.body.reply;
      data.id = reply._id;
      data.username = reply.creator.username;
      data.avatar = reply.creator.profilePicture;
      data.text = reply.text;
      data.audio = reply.answer.aws.url;
      data.clickurl = SITE_BASE_URL + 'replies/' + reply._id;

      render(data);
    });
}

(function() {
  var qs = parseQueryString();
  var category;
  if (qs.talk) {
    getTalk(qs.talk);
  }
  else if (qs.reply) {
    getReply(qs.reply);
  }
})();