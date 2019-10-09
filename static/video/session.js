function CSession(jSignal, jMedia, url, protocol, action, observer)
{
    this.m_wsSignal     = null;
    this.m_wsMedia      = null;
    this.m_jSignal      = jSignal;
    this.m_jMedia       = jMedia;
    this.m_url          = url;
    this.m_protocol     = protocol;
    this.m_action       = action;
    this.m_observer     = observer;

    this.m_context      = 123456;

    this.m_sessionId    = 0;
    this.m_connected    = false;
};

CSession.prototype.play = function()
{
    // 1. 解析json_signal
    var tmpThis = this;
    let obj = JSON.parse(this.m_jSignal);
    if (obj.routeType == "location")
    {
        if (obj.param.location.protocol == "icc-ws")
        {
            // 2. 创建websocket_signal
            let uri = "ws://"+ obj.param.location.ip + ":" + obj.param.location.port + "/" + obj.srcUuid;
            this.m_wsSignal = new WebSocket(uri);
            this.m_wsSignal.onopen = function(){
                // 信令通道连接成功
                // 3. 发送播放请求
                //var playReq = '{"msgType": "playReq", "context": 123456, "url": "rtsp://admin:admin@192.168.9.121:554/cam/realmonitor?channel=1&subtype=0&unicast=true&proto=Onvif", "protocol": "rtsp", "action": "preview"}';
                let playReq = {"msgType": "playReq"};
                playReq.context = tmpThis.m_context;
                playReq.url = tmpThis.m_url;
                playReq.protocol = tmpThis.m_protocol;
                playReq.action = tmpThis.m_action;
                tmpThis.m_wsSignal.send(JSON.stringify(playReq));
            }
            this.m_wsSignal.onclose = function(){
                // 信令通道连接失败
                // fix: 通知上层
            }
            this.m_wsSignal.onmessage = function(evt){
                // 信令通道消息回调
                let s = evt.data; 
                let msg = JSON.parse(s);
                switch (msg.msgType)
                {
                    case "playRsp":
                        {
                            if (msg.context == tmpThis.m_context && msg.errCode == 0)
                            {
                                // 4. 创建websocket_media
                                tmpThis.m_sessionId = msg.data.sessionId;
                                let ret = tmpThis.createWsMedia();
                            }
                            else
                            {
                                // fix: print
                            }
                            break;
                        }
                    case "pauseRsp":
                        {
                            break;
                        }
                        defualt:
                        {
                            break;
                        }
                }
                tmpThis.m_context++;
            }
        }
    }
    else if (obj["routeType"] == "p2p")
    {
    }
}

CSession.prototype.createWsMedia = function()
{
    var tmpThis = this;
    let obj = JSON.parse(this.m_jMedia);
    let ret = -1;
    if (obj.routeType == "location")
    {
        if (obj.param.location.protocol == "icc-ws")
        {
            let uri = "ws://" + obj.param.location.ip + ":" + obj.param.location.port + "/" + obj.srcUuid;
            this.m_wsMedia = new WebSocket(uri);
            ret = 0;
            this.m_wsMedia.onopen = function(){
                // 媒体通道连接成功
                // fix: 由于js还不太熟 这里先不做同步处理 暂时认为websocket创建了就等同于连接成功了 fuck
                let sessionIdReq = {"msgType": "sessionIdReq", "context": 0};
                sessionIdReq.sessionId = tmpThis.m_sessionId;
                tmpThis.m_wsMedia.send(JSON.stringify(sessionIdReq));
                tmpThis.m_connected = true;
            }
            this.m_wsMedia.onmessage = function(evt){
                // 码流
                tmpThis.m_observer.onMedia(evt.data);
            }
            this.m_wsMedia.onclose = function(){
                // fix: 断开连接
            }
        }
    }
    return ret;
}

CSession.prototype.stop = function()
{
    let stopReq = {"msgType": "stopReq"};
    stopReq.context = this.m_context;
    stopReq.sessionId = this.m_sessionId;
    if (this.m_connected == 1)
    {
        this.m_wsSignal.send(JSON.stringify(stopReq));
        this.m_connected = false;
        return true;
    }
    return false;
}