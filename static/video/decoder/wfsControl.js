function wfsControl() {
  this.m_video = null;
  this.buffer = null;
  this.mediaSource = null;
  this.mimeCodec = 'video/mp4; codecs="avc1.64001E"';
  this.wfs = null;
  this.isHidden = false;
  this.m_stopDecoder = false;
}
wfsControl.prototype.setup = function(video) {
  this.wfs = new Wfs(this);
  this.wfs.attachMedia({
    video: video
  });
  const _this = this;
  this.m_video = video;
  document.addEventListener("visibilitychange", function() {
    // console.log(document.visibilityState);
    console.log(document.hidden);
    _this.isHidden = document.hidden;
  });
};

wfsControl.prototype.play = function(data) {
  if (!this.isHidden && !this.m_stopDecoder) {
    // 页面不可见的时候，停止接受数据
    this.wfs.play(data);

    //   let buf = new Uint8Array(data);
    //   this.wfs.trigger(this.wfs._events2.default.H264_DATA_PARSED, { data: buf });
  } else {
    // console.log("1111111111111");
  }
};

wfsControl.prototype.resetBuffer = function()
{
    this.wfs.resetBuffer();
}

wfsControl.prototype.update = function() {};

wfsControl.prototype.onStopDecoderCallback = function(_this)
{
    _this.m_stopDecoder = true;
    // console.log("stop decoder");
    // console.log(_this);
    _this.wfs.destroy();
    delete _this.wfs;
    _this.wfs = new Wfs(_this);
    _this.wfs.attachMedia({video: _this.m_video});
    _this.m_stopDecoder = false;
    // console.log("resume decoder");
}