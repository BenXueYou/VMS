function CVideoMgrSdk(observer)
{
    this.m_videoList    = new Array;
    this.m_observer     = observer;
}

CVideoMgrSdk.prototype.setup = async function(jSignal, jMedia, url, protocol, action, speed, canvas, w, h, file)
{
    var video = new CVideo(this);
    let ret = await video.setup(jSignal, jMedia, url, protocol, action, speed, canvas, w, h, file);
    if (ret)
    {
        this.m_videoList[this.m_videoList.length] = video;
    }
    else
    {
        this.stop(video);
        delete video;
        video = null;
    }
    return video;
}

CVideoMgrSdk.prototype.play = async function(video)
{
    var i = 0;
    for (i = 0; i < this.m_videoList.length; ++i)
    {
        if (video === this.m_videoList[i])
        {
            return await video.play();
        }
    }
    return false;
}

CVideoMgrSdk.prototype.stop = async function(video)
{
    var i = 0;
    for (i = 0; i < this.m_videoList.length; ++i)
    {
        if (video === this.m_videoList[i])
        {
            video.stopRecord();
            await video.stop();
            delete video;
            this.m_videoList.splice(i, 1);
            return true;
        }
    }
}

CVideoMgrSdk.prototype.pause = async function(video)
{
    var i = 0;
    for (i = 0; i < this.m_videoList.length; ++i)
    {
        if (video === this.m_videoList[i])
        {
            return await video.pause();
        }
    }
}

CVideoMgrSdk.prototype.resume = async function(video)
{
    var i = 0;
    for (i = 0; i < this.m_videoList.length; ++i)
    {
        if (video === this.m_videoList[i])
        {
            return await video.resume();
        }
    }
}

CVideoMgrSdk.prototype.speedControl = async function(video, speed)
{
    var i = 0;
    for (i = 0; i < this.m_videoList.length; ++i)
    {
        if (video === this.m_videoList[i])
        {
            return await video.speedControl(speed);
        }
    }
}

CVideoMgrSdk.prototype.drag = async function(video, position)
{
    var i = 0;
    for (i = 0; i < this.m_videoList.length; ++i)
    {
        if (video === this.m_videoList[i])
        {
            return await video.drag(position);
        }
    }
}

CVideoMgrSdk.prototype.record = function(video)
{
    var i = 0;
    for (i = 0; i < this.m_videoList.length; ++i)
    {
        if (video === this.m_videoList[i])
        {
            video.record();
            return true;
        }
    }
    return false;
}

CVideoMgrSdk.prototype.stopRecord = function(video)
{
    var i = 0;
    for (i = 0; i < this.m_videoList.length; ++i)
    {
        if (video === this.m_videoList[i])
        {
            video.stopRecord();
            return true;
        }
    }
    return false;
}

CVideoMgrSdk.prototype.onStreamBreak = function(video)
{
    this.m_observer(video);
}

CVideoMgrSdk.prototype.findVideo = function(canvas)
{
    for (let i = 0; i < this.m_videoList.length; ++i)
    {
        if (this.m_videoList[i].m_canvas === canvas)
        {
            return this.m_videoList[i];
        }
    }
    return undefined;
}

CVideoMgrSdk.prototype.stopByCanvas = function(canvas)
{
    for (let i = 0; i < this.m_videoList.length; ++i)
    {
        if (this.m_videoList[i].m_canvas === canvas)
        {
            let video = this.m_videoList[i];
            this.stop(video);
            break;
        }
    }
}