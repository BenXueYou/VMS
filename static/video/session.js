function CSession(jSignal, jMedia, url, protocol, action, speed, observer)
{
    this.m_wsSignal     = null;
    this.m_wsMedia      = null;
    this.m_jSignal      = jSignal;
    this.m_jMedia       = jMedia;
    this.m_url          = url;
    this.m_protocol     = protocol;
    this.m_action       = action;
    this.m_speed        = speed;
    this.m_observer     = observer;

    this.m_context      = 123456;

    this.m_sessionId    = 0;
    this.m_connected    = false;
};

CSession.prototype.setup = async function()
{
    // 1. 解析json_signal
    var tmpThis = this;
    let ret = -1;
    let obj = JSON.parse(this.m_jSignal);
    if (obj.routeType == "location")
    {
        if (obj.param.location.protocol == "icc-ws")
        {
            // 2. 创建websocket_signal
            let uri = "ws://" + obj.param.location.ip + ":" + obj.param.location.port + "/" + obj.srcUuid;
            this.m_wsSignal = new CWebSocket(uri, this);
            ret = await this.m_wsSignal.open();
            if (ret == 0)
            {
                // connect success
                let setupReq = { "msgType": "setupReq" };
                setupReq.context = tmpThis.m_context;
                setupReq.url = tmpThis.m_url;
                setupReq.protocol = tmpThis.m_protocol;
                setupReq.action = tmpThis.m_action;
                setupReq.speed = tmpThis.m_speed;
                let response = await tmpThis.m_wsSignal.send(setupReq);
                if (response != "")
                {
                    let msg = JSON.parse(response);
                    if (msg.msgType === "setupRsp" && msg.context == tmpThis.m_context && msg.errCode == 0)
                    {
                        tmpThis.m_sessionId = msg.data.sessionId;
                        tmpThis.m_observer.onSdp(msg.data.sdp);
                        ret = await tmpThis.createWsMedia();
                    }
                    else
                    {
                        // fix: setup failed
                        ret = -1;
                    }
                }
                else
                {
                    // fix: send failed
                }
            }
            else
            {
                // fix: connect failed
            }
        }
    }
    else if (obj["routeType"] == "p2p")
    {
    }

    return ret == 0;
}

//CSession.prototype.onnotify = (evt) =>
CSession.prototype.onnotify = function(s)
{
    let msg = JSON.parse(s);
    if (msg.msgType == "streamBreakNtf" && msg.sessionId == this.m_sessionId)
    {
        this.m_observer.onStreamBreak();
    }
}

CSession.prototype.createWsMedia = function()
{
    return new Promise((resolve, reject) => {
        var tmpThis = this;
        let obj = JSON.parse(this.m_jMedia);
        if (obj.routeType == "location")
        {
            if (obj.param.location.protocol == "icc-ws")
            {
                let uri = "ws://" + obj.param.location.ip + ":" + obj.param.location.port + "/" + obj.srcUuid;
                this.m_wsMedia = new WebSocket(uri);
                this.m_wsMedia.binaryType = "blob";
                this.m_wsMedia.onopen = function () {
                    // 媒体通道连接成功
                    // fix: 由于js还不太熟 这里先不做同步处理 暂时认为websocket创建了就等同于连接成功了 fuck
                    let sessionIdReq = { "msgType": "sessionIdReq", "context": 0 };
                    sessionIdReq.sessionId = tmpThis.m_sessionId;
                    tmpThis.m_wsMedia.send(JSON.stringify(sessionIdReq));
                    tmpThis.m_connected = true;
                    resolve(0);
                }
                this.m_wsMedia.onerror = function (){
                    reject(-1);
                }
                this.m_wsMedia.onmessage = function (evt) {
                    // 码流
                    tmpThis.m_observer.onMedia(evt.data);
                }
                this.m_wsMedia.onclose = function () {
                    // fix: 断开连接
                }
            }
        }
    });
}

CSession.prototype.play = async function()
{
    var b = false;
    var playReq = {"msgType": "playReq"};
    playReq.context = this.m_context;
    playReq.sessionId = this.m_sessionId;
    if (this.m_connected == true)
    {
        let response = await this.m_wsSignal.send(playReq);
        if (response != "")
        {
            let msg = JSON.parse(response);
            if (msg.msgType === "playRsp" && msg.context == this.m_context && msg.errCode == 0)
            {
                b = true;
            }
            else
            {
                // fix: setup failed
                b = false;
            }
        }
    }
    return b;
}

CSession.prototype.stop = async function()
{
    var b = false;
    let stopReq = {"msgType": "stopReq"};
    stopReq.context = this.m_context;
    stopReq.sessionId = this.m_sessionId;
    if (this.m_connected == true)
    {
        let response = await this.m_wsSignal.send(stopReq);
        if (response != "")
        {
            let msg = JSON.parse(response);
            if (msg.msgType === "stopRsp" && msg.context == this.m_context && msg.errCode == 0)
            {
                b = true;
                this.m_connected = false;
            }
            else
            {
                b = false;
            }
        }
    }
    return b;
}

CSession.prototype.pause = async function()
{
    var b = false;
    let pauseReq = {"msgType": "pauseReq"};
    pauseReq.context = this.m_context;
    pauseReq.sessionId = this.m_sessionId;
    if (this.m_connected == true)
    {
        let response = await this.m_wsSignal.send(pauseReq);
        if (response != "")
        {
            let msg = JSON.parse(response);
            if (msg.msgType === "pauseRsp" && msg.context == this.m_context && msg.errCode == 0)
            {
                b = true;
            }
            else
            {
                b = false;
            }
        }
    }

    return b;
}

CSession.prototype.resume = async function()
{
    var b = false;
    let resumeReq = {"msgType": "resumeReq"};
    resumeReq.context = this.m_context;
    resumeReq.sessionId = this.m_sessionId;
    if (this.m_connected == true)
    {
        let response = await this.m_wsSignal.send(resumeReq);
        if (response != "")
        {
            let msg = JSON.parse(response);
            if (msg.msgType === "resumeRsp" && msg.context == this.m_context && msg.errCode == 0)
            {
                b = true;
            }
            else
            {
                b = false;
            }
        }
    }

    return b;
}

CSession.prototype.speedControl = async function(speed)
{
    var b = false;
    let speedControlReq = {"msgType": "speedControlReq"};
    speedControlReq.context = this.m_context;
    speedControlReq.sessionId = this.m_sessionId;
    speedControlReq.speed = speed;
    if (this.m_connected == true)
    {
        let response = await this.m_wsSignal.send(speedControlReq);
        if (response != "")
        {
            let msg = JSON.parse(response);
            if (msg.msgType === "speedControlRsp" && msg.context == this.m_context && msg.errCode == 0)
            {
                b = true;
            }
            else
            {
                b = false;
            }
        }
    }

    return b;
}

CSession.prototype.drag = async function(url)
{
    var b = false;
    let dragReq = {"msgType": "dragReq"};
    dragReq.context = this.m_context;
    dragReq.sessionId = this.m_sessionId;
    dragReq.url = url;
    if (this.m_connected == true)
    {
        let response = await this.m_wsSignal.send(dragReq);
        if (response != "")
        {
            let msg = JSON.parse(response);
            if (msg.msgType === "dragRsp" && msg.context == this.m_context && msg.errCode == 0)
            {
                b = true;
            }
            else
            {
                b = false;
            }
        }
    }

    return b;
}