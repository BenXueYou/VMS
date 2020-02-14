function wfsControl() {
  this.video = null;
  this.buffer = null;
  this.mediaSource = null;
  this.mimeCodec = 'video/mp4; codecs="avc1.64001E"';
  this.wfs = null;
  this.isHidden = false;
}
wfsControl.prototype.setup = function(video) {
  this.wfs = new Wfs();

  this.wfs.attachMedia({
    video: video
  });
  const _this = this;
  this.video = video;
  document.addEventListener("visibilitychange", function() {
    // console.log(document.visibilityState);
    // console.log(document.hidden);
    _this.isHidden = document.hidden;
  });
};

wfsControl.prototype.play = function(data) {
  if (!this.isHidden) {
    // 页面不可见的时候，停止接受数据
    // this.video.play();
    let t1 = this.video.currentTime,
      t2 = this.video.duration;
    // console.log(t1 + " " + t2);
    if (!isNaN(t1) && !isNaN(t2) && t1 >= t2 - 15) {
      this.setup(this.video);
      // 清空队列
      this.clearQueure();
    }
    this.wfs.play(data);
    // data = null;
    // delete data;
  } else {
  }
};
wfsControl.prototype.update = function() {};
