function CVideo(observer)
{
    this.m_session      = null;
    this.m_decoder      = null;
    this.m_canvas       = null;
    this.m_download     = null;
    this.m_observer     = observer;
    this.m_action       = null;
    this.m_speed        = null;
    this.m_width        = null;
    this.m_height       = null;
}

CVideo.prototype.setup = function(jSignal, jMedia, url, protocol, action, speed, canvas, w, h)
{
    this.m_canvas = canvas;
    this.m_session = new CSession(jSignal, jMedia, url, protocol, action, speed, this);
    this.m_session.setup();
    this.m_action = action;
    this.m_speed = speed;
    this.m_width = w;
    this.m_height = h;
}

CVideo.prototype.play = function()
{
    this.m_session.play();
    //this.m_decoder.play();
}

CVideo.prototype.onSdp = function(sdp)
{
    if (this.m_action === "preview" || this.m_action === "playback")
    {
        // fix: 要等sdp到了之后才能play
        this.m_decoder = new CDecoder(this.m_canvas);
        this.m_decoder.setup(sdp, this.m_width, this.m_height);
    }
    else if (this.m_action === "download")
    {
        // 下载需要下载模块
        // fix: 下载模块暂未实现
        this.m_download = new CDownload(Date().toString());
    }
    else
    {
        // fix: 其他模式暂不支持
    }
}

CVideo.prototype.onMedia = function(data)
{
    // 1. 检查是否入缓存
    if (this.m_decoder != null)
    {
        this.m_decoder.media(data);
    }

    // 2. 如果有下载模块 写入下载模块
    // fix: 下载模块暂未实现
    if (this.m_download != null)
    {
        this.m_download.writeBlob(data);
    }
}

CVideo.prototype.onStreamBreak = function()
{
    if (this.m_action === "download")
    {
        // 下载结束
        this.m_download.close();
        delete this.m_download;
        this.m_download = null;
    }
    this.m_observer.onStreamBreak(this);
}

CVideo.prototype.stop = function()
{
    // fix: 1. 停止解码模块
    if (this.m_decoder != null)
    {
        this.m_decoder.stop();
        delete this.m_decoder;
        this.m_decoder = null;
    }

    // 2. 停止session
    if (this.m_session != null)
    {
        this.m_session.stop();
        delete this.m_session;
        this.m_session = null;
    }
    
    // 3. 停止下载模块
    if (this.m_download != null)
    {
        this.m_download.close();
        delete this.m_download;
        this.m_download = null;
    }
}

CVideo.prototype.pause = function()
{
    this.m_decoder.pause();
    this.m_session.pause();
}

CVideo.prototype.resume = function()
{
    this.m_decoder.resume();
    this.m_session.resume();
}

CVideo.prototype.speedControl = function(speed)
{
    this.m_decoder.speedControl(speed);
    this.m_session.speedControl(speed);
}

CVideo.prototype.drag = function(position)
{
    this.m_decoder.drag(position);
    this.m_session.drag(position);
}

CVideo.prototype.record = function()
{
    this.m_download = new CDownload(Date().toString());
}

CVideo.prototype.stopRecord = function()
{
    if (this.m_download != null)
    {
        this.m_download.close();
        delete this.m_download;
        this.m_download = null;
    }
}
