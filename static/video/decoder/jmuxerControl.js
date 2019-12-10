function jmuxerControl() {
  this.video = null;
  this.buffer = null;
  this.mediaSource = null;
  this.mimeCodec = 'video/mp4; codecs="avc1.64001E"';
  this.jmuxer = null;
  this.isHidden = false;
  this.nameCnt = 1;
}
jmuxerControl.prototype.setup = function(video) {
  let videoName = "videoControl" + this.nameCnt++;
  video.id = videoName;
  console.log(video);
  this.jmuxer = new JMuxer({
    node: video,
    mode: "video",
    flushingTime: 1000,
    fps: 25,
    debug: true
  });

  const _this = this;
  this.video = video;
  document.addEventListener("visibilitychange", function() {
    // console.log(document.visibilityState);
    // console.log(document.hidden);
    _this.isHidden = document.hidden;
  });
};

jmuxerControl.prototype.play = function(data) {
  if (!this.isHidden) {
    // 页面不可见的时候，停止接受数据
    var data = parse(data);
    console.log(data);
    this.jmuxer.feed(data);
    this.video.play();
  } else {
    console.log("1111111111111");
  }
};
jmuxerControl.prototype.update = function() {};
function parse(data) {
  var input = new Uint8Array(data),
    dv = new DataView(input.buffer),
    duration,
    audioLength,
    audio,
    video;

  duration = dv.getUint16(0, true);
  audioLength = dv.getUint16(2, true);
  audio = input.subarray(4, audioLength + 4);
  video = input.subarray(audioLength + 4);

  return {
    audio: audio,
    video: video,
    duration: duration
  };
}
