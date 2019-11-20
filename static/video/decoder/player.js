//Decoder states.
const decoderStateIdle = 0;
const decoderStateInitializing = 1;
const decoderStateReady = 2;
const decoderStateFinished = 3;

//Player states.

/*
const playerStateIdle           = 0;
const playerStatePlaying        = 1;
const playerStatePausing        = 2;
*/

function Player() {
  this.canvas = null;
  this.webglPlayer = null;
  this.callback = null;
  this.pixFmt = 0;
  this.duration = 0;
  this.yLength = 0;
  this.uvLength = 0;
  this.videoQueue = [];
  this.canDecoder = false;
  this.logger = new Logger("Player");
  this.initDecodeWorker();
}

Player.prototype.setCanvas = function(canvas) {
  //this.logger.logInfo("setCanvas" + ".");
  this.canvas = canvas;
  this.webglPlayer = new WebGLPlayer(this.canvas, {
    //
  });
};

Player.prototype.initDecodeWorker = function() {
  var self = this;
  this.decodeWorker = new Worker("./static/video/decoder/decoder.js");
  this.decodeWorker.onmessage = function(evt) {
    var objData = evt.data;
    switch (objData.t) {
      case kOpenDecoderRsp:
        self.onOpenDecoder(objData);
        break;
      case kInitDecoderRsp:
        self.onStartDecoder(objData);
        break;
      case kVideoFrame:
        self.onVideoFrame(objData);
        break;
      case kDecodeFinishedEvt:
        self.onDecodeFinished(objData);
        break;
    }
  };

  var req = {
    t: kSetPlayInit
  };
  this.decodeWorker.postMessage(req);
};

/*
Player.prototype.initDecoder = function(){
	this.logger.logInfo("initDecoder. ffmpeg is start ...");
	var req = {
        t: kInitDecoderReq
    };
	this.decodeWorker.postMessage(req); 
	
}
*/

Player.prototype.h264AVFrmaeData = function(data, size) {
  if (this.canDecoder) {
    var req = {
      t: kH264AVFrmaeDataReq,
      d: data,
      s: size
    };

    this.decodeWorker.postMessage(req);
  } else {
    this.logger.logInfo("Wait H264AVFrmaeData.");
  }
};

Player.prototype.onOpenDecoder = function(objData) {
  //this.logger.logInfo("Open decoder response " + objData.e + ".");
  if (objData.e == 0) {
    //this.onVideoParam(objData.v);
    this.logger.logInfo("Decoder ready now.");
  }
};

Player.prototype.onStartDecoder = function(objData) {
  if (objData.e == 0) {
    this.onOpenDecoder(objData);
  }
  this.canDecoder = true;
  //this.logger.logInfo("onStartDecoder.");
};

Player.prototype.onVideoFrame = function(frame) {
  //this.logger.logInfo("onVideoFrame.");
  this.displayVideoFrame(frame);
};

Player.prototype.displayVideoFrame = function(frame) {
  var data = new Uint8Array(frame.d);
  this.renderVideoFrame(data, frame.w, frame.h);
};

Player.prototype.renderVideoFrame = function(data, width, height) {
  //    this.logger.logInfo("display width: " + width + " height: " + height + ".");
  this.yLength = width * height;
  this.uvLength = (width / 2) * (height / 2);
  this.webglPlayer.renderFrame(
    data,
    width,
    height,
    this.yLength,
    this.uvLength
  );
};

Player.prototype.formatTime = function(s) {
  var h =
    Math.floor(s / 3600) < 10
      ? "0" + Math.floor(s / 3600)
      : Math.floor(s / 3600);
  var m =
    Math.floor((s / 60) % 60) < 10
      ? "0" + Math.floor((s / 60) % 60)
      : Math.floor((s / 60) % 60);
  var s =
    Math.floor(s % 60) < 10 ? "0" + Math.floor(s % 60) : Math.floor(s % 60);
  return (result = h + ":" + m + ":" + s);
};

Player.prototype.reportPlayError = function(error, status, message) {
  var e = {
    error: error || 0,
    status: status || 0,
    message: message
  };
  if (this.callback) {
    this.callback(e);
  }
};
