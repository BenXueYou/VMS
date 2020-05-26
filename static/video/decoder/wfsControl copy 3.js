function wfsControl() {
  this.video = null;
  this.buffer = [];
  this.mediaSource = null;
  this.mimeCodec = 'video/mp4; codecs="avc1.64001E"';
  this.wfs = null;
  this.isHidden = false;
}
wfsControl.prototype.setup = function(video) {
  this.wfsWorker = new Worker("./decoder/Wfs.js");
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
  this.wfsWorker.onmessage = function(e) {
    // console.log(e)
    var obj = e.data;
    switch (obj.t) {
      case 1:
        _this.wfs.play(obj.d);
        break;
    }
  };
  setInterval(function() {
    _this.sendPacketData();
  }, 16);
};

wfsControl.prototype.play = function(data) {
  if (!this.isHidden) {
    // 页面不可见的时候，停止接受数据
    // this.wfs.play(data);
    this.buffer.push(data);
  } else {
    console.log("1111111111111");
  }
};
function concatBuffer(buffer) {
  let totalLength = 0;
  function concatenate(resultConstructor, ...arrays) {
    for (let arr of arrays) {
      totalLength += arr.length;
    }
    let result = new resultConstructor(totalLength);
    let offset = 0;
    for (let arr of arrays) {
      result.set(arr, offset);
      offset += arr.length;
    }
    return result;
  }
  let Int8ArrayArr = [];
  for (let i = 0; i < buffer.length; i++) {
    let arrBuffer = buffer[i];
    Int8ArrayArr.push(new Int8Array(arrBuffer));
  }
  let new8 = concatenate(Int8Array, ...Int8ArrayArr);
  var buf = new ArrayBuffer(totalLength);
  let new8aa = new Int8Array(buf);
  for (let i = 0; i < new8aa.length; i++) {
    new8aa[i] = new8[i];
  }
  return buf;
}
wfsControl.prototype.update = function() {};
wfsControl.prototype.sendPacketData = function() {
  if (this.buffer.length >= 40) {
    // 这里合并一下buffer
    let buf = concatBuffer(this.buffer);
    // 获取所有的数据,并清空buffer
    var req = {
      t: 1,
      d: buf
    };
    this.wfsWorker.postMessage(req);
    this.buffer = [];
  }
};
