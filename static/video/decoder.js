function CDecoder(elment, decodeMod) {
  this.m_canvas = elment;
  this.decodeMod = decodeMod;
  this.m_player = null;
}

CDecoder.prototype.setup = function(sdp) {
  if (this.decodeMod == "canvas") {
    this.m_player = new Player(); // fix: 分辨率先保留
    this.m_player.setCanvas(this.m_canvas);
  } else if (this.decodeMod === "video") {
      // fix:
    this.m_player = new wfsControl(); // fix: 分辨率先保留
    // this.m_player = new CJmuxerControl(); 
    this.m_player.setup(this.m_canvas);
  }
};

CDecoder.prototype.play = function() {
  // fix: do nothing
};

CDecoder.prototype.stop = function() {
  delete this.m_player;
  this.m_player = null;
};

CDecoder.prototype.pause = function() {
  // fix: do nothing
};

CDecoder.prototype.resume = function() {
  // fix: do nothing
};

CDecoder.prototype.speedControl = function(speed) {
  // fix: 解码速度切换
};

CDecoder.prototype.drag = function() {
  // 1. 清除缓存
};

CDecoder.prototype.media = function(data) {
    // 缓存中无数据 写入解码
    var ret = 0;

    // var reader = new FileReader();
    var player = this.m_player;
    var _this = this;
      if (player != null) {
        if (_this.decodeMod === "canvas") {
          player.h264AVFrmaeData(data, data.size);
        } else if (_this.decodeMod === "video") {
          player.play(data);
        }
      } else ret = -1;
    // reader.addEventListener("loadend", function() {
    //   if (player != null) {
    //     if (_this.decodeMod === "canvas") {
    //       player.h264AVFrmaeData(reader.result, data.size);
    //     } else if (_this.decodeMod === "video") {
    //       player.play(reader.result);
    //     }
    //   } else ret = -1;
    // });
    // reader.readAsArrayBuffer(data);
};

CDecoder.prototype.resetBuffer = function()
{
    if (this.decodeMod === "video") {
        this.m_player.resetBuffer();
    }
}