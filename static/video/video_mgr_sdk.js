function CVideoMgrSdk()
{
    this.m_videoList  = new Array;
}

CVideoMgrSdk.prototype.play = function(jSignal, jMedia, url, protocol, action, canvas)
{
    var video = new CVideo;
    video.play(jSignal, jMedia, url, protocol, action, canvas);
    this.m_videoList[this.m_videoList.length] = video;
    return video;
}

CVideoMgrSdk.prototype.stop = function(video)
{
    var i = 0;
    for (i = 0; i < this.m_videoList.length; ++i)
    {
        if (video === this.m_videoList[i])
        {
            break;
        }
    }
    if (i != this.m_videoList.length)
    {
        video.stop();
        this.m_videoList.splice(i, 1);
    }
    else
    {}
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