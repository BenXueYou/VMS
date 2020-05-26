function wfsControl() {
  this.video = null;
  this.buffer = null;
  this.mediaSource = null;
  this.mimeCodec = 'video/mp4; codecs="avc1.64001E"';
  this.wfs = null;
  this.isHidden = false;
  this.buffer = [];
  this.wfsWorker = null;
}
wfsControl.prototype.setup = function(video) {
  // this.wfsWorker = new Worker("./decoder/Wfs.js");
  this.wfs = new Wfs();
  this.wfs.attachMedia({
    video: video
  });
  const _this = this;
  document.addEventListener("visibilitychange", function() {
    // console.log(document.visibilityState);
    console.log(document.hidden);
    _this.isHidden = document.hidden;
  });
  // setInterval(function() {
  //   _this.sendPacketData();
  // }, 500);
};

wfsControl.prototype.play = function(data) {
  if (!this.isHidden) {
    // 页面不可见的时候，停止接受数据
    this.wfs.play(data);
    // setTimeout(() => {
    // }, 0);
    // _this.buffer.push(data);
  } else {
    console.log("1111111111111");
  }
};
wfsControl.prototype.update = function() {};
wfsControl.prototype.sendPacketData = function() {
  if (this.buffer.length >= 20) {
    // 获取所有的数据,并清空buffer
    var data = this.buffer;
    var req = {
      t: kSendPacketDataReq,
      d: data
    };
    this.wfsWorker.postMessage(req);
    this.buffer = [];
  }
};
