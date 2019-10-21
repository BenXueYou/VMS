function CVideoMgrSdk(observer) {
  this.m_videoList = new Array();
  this.m_observer = observer;
}

CVideoMgrSdk.prototype.play = function(
  jSignal,
  jMedia,
  url,
  protocol,
  action,
  speed,
  canvas,
  streamType
) {
  var video = new CVideo(this);
  video.play(jSignal, jMedia, url, protocol, action, speed, canvas, streamType);
  this.m_videoList[this.m_videoList.length] = video;
  return video;
};

CVideoMgrSdk.prototype.stop = function(video) {
  var i = 0;
  for (i = 0; i < this.m_videoList.length; ++i) {
    if (video === this.m_videoList[i]) {
      break;
    }
  }
  if (i != this.m_videoList.length) {
    video.stopRecord();
    video.stop();
    delete video;
    this.m_videoList.splice(i, 1);
  } else {
  }
};

CVideoMgrSdk.prototype.pause = function(video) {
  var i = 0;
  for (i = 0; i < this.m_videoList.length; ++i) {
    if (video === this.m_videoList[i]) {
      break;
    }
  }
  if (i != this.m_videoList.length) {
    video.pause();
  } else {
  }
};

CVideoMgrSdk.prototype.resume = function(video) {
  var i = 0;
  for (i = 0; i < this.m_videoList.length; ++i) {
    if (video === this.m_videoList[i]) {
      break;
    }
  }
  if (i != this.m_videoList.length) {
    video.resume();
  } else {
  }
};

CVideoMgrSdk.prototype.speedControl = function(video, speed) {
  var i = 0;
  for (i = 0; i < this.m_videoList.length; ++i) {
    if (video === this.m_videoList[i]) {
      break;
    }
  }
  if (i != this.m_videoList.length) {
    video.speedControl(speed);
  } else {
  }
};

CVideoMgrSdk.prototype.drag = function(video, position) {
  var i = 0;
  for (i = 0; i < this.m_videoList.length; ++i) {
    if (video === this.m_videoList[i]) {
      break;
    }
  }
  if (i != this.m_videoList.length) {
    video.drag(position);
  } else {
  }
};

CVideoMgrSdk.prototype.record = function(video) {
  var i = 0;
  for (i = 0; i < this.m_videoList.length; ++i) {
    if (video === this.m_videoList[i]) {
      video.record();
      return true;
    }
  }
  return false;
};

CVideoMgrSdk.prototype.stopRecord = function(video) {
  var i = 0;
  for (i = 0; i < this.m_videoList.length; ++i) {
    if (video === this.m_videoList[i]) {
      video.stopRecord();
      return true;
    }
  }
  return false;
};

CVideoMgrSdk.prototype.onStreamBreak = function(video) {
  this.m_observer(video);
};

CVideoMgrSdk.prototype.findVideo = function(canvas) {
  for (let i = 0; i < this.m_videoList.length; ++i) {
    if (this.m_videoList[i].m_canvas === canvas) {
      return this.m_videoList[i];
    }
  }
  return undefined;
};

CVideoMgrSdk.prototype.stopByCanvas = function(canvas) {
  for (let i = 0; i < this.m_videoList.length; ++i) {
    if (this.m_videoList[i].m_canvas === canvas) {
      let video = this.m_videoList[i];
      this.stop(video);
      break;
    }
  }
};
