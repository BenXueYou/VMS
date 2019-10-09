function CVideo()
{
    this.m_session      = null;
    this.m_decoder      = null;
    this.m_canvas       = null;
}

CVideo.prototype.play = function(jSignal, jMedia, url, protocol, action, canvas)
{
    this.m_canvas = canvas;
    this.m_session = new CSession(jSignal, jMedia, url, protocol, action, this);
    this.m_session.play();
    if (action === "preview" || action === "playback")
    {
        this.m_decoder = new CDecoder(canvas);
        this.m_decoder.play();
    }
    else if (action === "download")
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
    if (this.m_decoder != null)
    {
        this.m_decoder.media(data);
    }

    // 2. 如果有下载模块 写入下载模块
    // fix: 下载模块暂未实现
}

CVideo.prototype.stop = function()
{
    // fix: 1. 停止解码模块
    this.m_decoder.stop();

    // 2. 停止session
    this.m_session.stop();
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