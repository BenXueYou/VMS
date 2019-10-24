function CDecoder(canvas)
{
    this.m_canvas   = canvas;
    this.m_player   = null;
    this.m_cache    = new CDeque;
};

CDecoder.prototype.play = function(sdp, w, h)
{
    this.m_player = new Player(w, h);  // fix: 分辨率先保留
    this.m_player.setCanvas(this.m_canvas);
}

CDecoder.prototype.stop = function()
{
    delete this.m_player;
    delete this.m_cache;
}

CDecoder.prototype.pause = function()
{
    // fix: do nothing
}

CDecoder.prototype.resume = function()
{
    // fix: do nothing
}

CDecoder.prototype.speedControl = function(speed)
{
    // fix: 解码速度切换
}

CDecoder.prototype.drag = function(position)
{
    // 1. 清除缓存
    this.m_cache.clear();
}

CDecoder.prototype.media = function(data)
{
    if (this.m_cache != null && this.m_cache.empty()) {
        // 缓存中无数据 写入解码
        var ret = 0;

        var reader = new FileReader();
        var player = this.m_player;
        reader.addEventListener("loadend", function () {
            if (player != null)
                player.h264AVFrmaeData(reader.result, data.size);
            else
                ret = -1;
        });
        reader.readAsArrayBuffer(data);

        if (ret != 0)
        {
            // 写入解码失败 尾插入缓存
            this.m_cache.push_back(data);
            // 启动逻辑检查定时任务
            setInterval(this.checkCache, 0);
        }
    }
    else if (this.m_cache != null)
    {
        // 缓存中有数据 尾插入缓存
        this.m_cache.push_back(data);
    }
    else
    {
    }
}

CDecoder.prototype.checkCache = function()
{
    // 缓存检查逻辑
    if (this.m_cache.size() > 1000 && !isStop)
    {
        // 缓存容量达到上限 并且 后端未停止送流
        // fix: 通知暂停
    }
    else if (this.m_cache.size() < 200 && isStop)
    {
        // 缓存容量降到下限 并且 后端已停止送流
        // fix: 通知恢复
    }

    // 缓存中有数据
    if (!this.m_cache.empty())
    {
        let ret = 0;
        var reader = new FileReader();
        var data = this.m_cache.pop_front();
        var tmpThis= this;
        reader.addEventListener("loadend", function () {
            tmpThis.m_player.h264AVFrmaeData(reader.result, data.size);
        });
        reader.readAsArrayBuffer(data);
        if (ret != 0)
        {
            // 写入解码失败 头插入缓存
            this.m_cache.push_front(data);
        }
    }
    else
    {
        // fix: 缓存中无数据 停止该定时任务
        clearInterval();
    }
}