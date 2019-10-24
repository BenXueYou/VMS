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

CVideo.prototype.play = function(jSignal, jMedia, url, protocol, action, speed, canvas, w, h)
{
    this.m_canvas = canvas;
    this.m_session = new CSession(jSignal, jMedia, url, protocol, action, speed, this);
    this.m_session.play();
    this.m_action = action;
    this.m_speed = speed;
    this.m_width = w;
    this.m_height = h;
    if (action === "preview" || action === "playback")
    {
        // fix: 要等sdp到了之后才能play
        //this.m_decoder = new CDecoder(canvas);
        //this.m_decoder.play();
    }
    else if (action === "download")
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

CVideo.prototype.onSdp = function(sdp)
{
    this.m_decoder = new CDecoder(this.m_canvas);
    this.m_decoder.play(sdp, this.m_width, this.m_height);
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

/*
function CVideo()
{
    this.m_session          = null;
    this.m_decoderWorker    = null;
};

CVideo.prototype.play = function(jSignal, jMedia, url, protocol, action, canvas)
{
    this.m_session = new CSession(jSignal, jMedia, url, protocol, action, this.onMedia);
    if (action == "preview" || action == "playback")
    {
        // fix: 创建解码模块(解码模块单独一个线程)
        this.m_decoderWorker = new Worker("");
    }
    else if (action == "download")
    {
        // 下载需要下载模块
        // fix: 下载模块暂未实现
    }
    else
    {
        // fix: 其他模式暂不支持
    }
}

CVideo.prototype.onMedia = function(data)
{
    // 1. 检查是否入缓存
    if (this.m_decoderWorker != null)
    {
        this.m_decoderWorker.postMessage(data);
    }

    // 2. 如果有下载模块 写入下载模块
    // fix: 下载模块暂未实现
}
*/