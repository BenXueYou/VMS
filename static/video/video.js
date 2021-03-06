function CVideo(observer) {
  this.m_session = null;
  this.m_decoder = null;
  this.m_bDecoder = true;
  this.m_canvas = null;
  this.decodeMod = null;
  this.m_download = null;
  this.m_observer = observer;
  this.m_action = null;
  this.m_speed = null;
  this.m_file = null;
}

CVideo.prototype.setup = async function({
  element,
  decodeMod,
  jDescription,
  webProtocol,
  url,
  protocol,
  action,
  speed,
  file
}) {
  this.m_canvas = element;
  this.decodeMod = decodeMod;
  this.m_action = action;
  this.m_speed = speed;
  this.m_file = file;
  this.m_session = new CSession(
    jDescription,
    webProtocol,
    url,
    protocol,
    action,
    speed,
    this
  );
  let ret = await this.m_session.setup();

  return ret;
};

CVideo.prototype.play = async function() {
  return await this.m_session.play();
  //this.m_decoder.play();
};

CVideo.prototype.enableDecoder = function(enable)
{
    this.m_bDecoder = enable;
}

CVideo.prototype.resetBuffer = function()
{
    if (this.m_decoder != null)
    {
        this.m_decoder.resetBuffer();
    }
}

CVideo.prototype.onSdp = function(sdp) {
  if (this.m_action === "preview" || this.m_action === "playback") {
    // fix: 要等sdp到了之后才能play
    this.m_decoder = new CDecoder(this.m_canvas, this.decodeMod);
    this.m_decoder.setup(sdp);
  } else if (this.m_action === "download") {
    // 下载需要下载模块
    // fix: 下载模块暂未实现
    if (this.m_file == undefined) this.m_file = Date().toString();
    this.m_download = new CDownload(this.m_file);
  } else {
    // fix: 其他模式暂不支持
  }
};

CVideo.prototype.onMedia = function(data) {
  // 1. 检查是否入缓存
  if (this.m_decoder != null && this.m_bDecoder) {
    this.m_decoder.media(data);
  }

  // 2. 如果有下载模块 写入下载模块
  // fix: 下载模块暂未实现
  if (this.m_download != null) {
    this.m_download.writeArray(data);
  }
};

CVideo.prototype.onStreamBreak = function() {
  if (this.m_action === "download") {
    // 下载结束
    this.m_download.close();
    delete this.m_download;
    this.m_download = null;
  }
  this.m_observer.onStreamBreak(this);
};

CVideo.prototype.stop = async function() {
  // fix: 1. 停止解码模块
  if (this.m_decoder != null) {
    this.m_decoder.stop();
    delete this.m_decoder;
    this.m_decoder = null;
  }

  // 2. 停止session
  if (this.m_session != null) {
    await this.m_session.stop();
    delete this.m_session;
    this.m_session = null;
  }

  // 3. 停止下载模块
  if (this.m_download != null) {
    this.m_download.close();
    delete this.m_download;
    this.m_download = null;
  }
};

CVideo.prototype.pause = async function() {
  this.m_decoder.pause();
  return await this.m_session.pause();
};

CVideo.prototype.resume = async function() {
  this.m_decoder.resume();
  return await this.m_session.resume();
};

CVideo.prototype.speedControl = async function(speed) {
  this.m_decoder.speedControl(speed);
  return await this.m_session.speedControl(speed);
};

CVideo.prototype.drag = async function(url) {
  this.m_decoder.drag();
  return await this.m_session.drag(url);
};

CVideo.prototype.record = function() {
  this.m_download = new CDownload(Date().toString());
};

CVideo.prototype.stopRecord = function() {
  if (this.m_download != null) {
    this.m_download.close();
    delete this.m_download;
    this.m_download = null;
  }
};
