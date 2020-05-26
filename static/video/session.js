function CSession(jDescription, webProtocol, url, protocol, action, speed, observer)
{
    let list = jDescription.list;
    let obj, routeType;
    for (let i = 0; i < list.length; ++i)
    {
        console.log(list[i]);
        if (webProtocol === "http:" && list[i].protocol === "ws" && list[i].routeType === "location")
        {
            routeType = "location";
            obj = list[i];
        }
        else if (webProtocol === "https:" && list[i].protocol === "wss" && list[i].routeType === "location")
        {
            routeType = "location";
            obj = list[i];
        }
    }
    this.m_wsSignal     = null;
    this.m_wsMedia      = null;
    this.m_jDescription = obj;
    this.m_routeType    = routeType;
    this.m_webProtocol  = webProtocol;
    this.m_url          = url;
    this.m_protocol     = protocol;
    this.m_action       = action;
    this.m_speed        = speed;
    this.m_observer     = observer;

    this.m_context      = 123456;

    this.m_sessionId    = 0;
    this.m_connected    = false;
    this.m_interval     = 0;
};

CSession.prototype.setup = async function()
{
    // 1. 解析json_signal
    var tmpThis = this;
    let ret = -1;
    if (this.m_routeType == "location")
    {
        let uri = this.m_jDescription.protocol + "://" + this.m_jDescription.signal.param.ip + ":" + this.m_jDescription.signal.param.port + "/" + this.m_jDescription.signal.srcUuid;
        this.m_wsSignal = new CWebSocket(uri, this);
        ret = await this.m_wsSignal.open();
        if (ret == 0) {
            // connect success
            let setupReq = { "msgType": "setupReq" };
            setupReq.context = tmpThis.m_context;
            setupReq.url = tmpThis.m_url;
            setupReq.protocol = tmpThis.m_protocol;
            setupReq.action = tmpThis.m_action;
            setupReq.speed = tmpThis.m_speed;
            let response = await tmpThis.m_wsSignal.send(setupReq);
            if (response != "") {
                let msg = JSON.parse(response);
                if (msg.msgType === "setupRsp" && msg.context == tmpThis.m_context && msg.errCode == 0) {
                    tmpThis.m_sessionId = msg.data.sessionId;
                    console.log("sdp: " + msg.data.sdp);
                    // console.log("sdp: " + JSON.stringify(msg.data));
                    tmpThis.m_observer.onSdp(msg.data.sdp);
                    ret = await tmpThis.createWsMedia();
                }
                else {
                    // fix: setup failed
                    ret = -1;
                }
            }
            else {
                // fix: send failed
            }
        }
        else {
            // fix: connect failed
        }
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

CSession.prototype.createWsMedia = async function()
{
    return new Promise((resolve, reject) => {
        var tmpThis = this;
        if (tmpThis.m_routeType == "location") {
            let uri = tmpThis.m_jDescription.protocol + "://" + tmpThis.m_jDescription.media.param.ip + ":" + tmpThis.m_jDescription.media.param.port + "/" + tmpThis.m_jDescription.media.srcUuid;
            this.m_wsMedia = new WebSocket(uri);
            this.m_wsMedia.binaryType = "arraybuffer";
            // this.m_wsMedia.binaryType = "blob";
            this.m_wsMedia.onopen = function () {
                // 媒体通道连接成功
                // fix: 由于js还不太熟 这里先不做同步处理 暂时认为websocket创建了就等同于连接成功了 fuck
                let sessionIdReq = { "msgType": "sessionIdReq", "context": 0 };
                sessionIdReq.sessionId = tmpThis.m_sessionId;
                tmpThis.m_wsMedia.send(JSON.stringify(sessionIdReq));
                tmpThis.m_connected = true;
                resolve(0);
            }
            this.m_wsMedia.onerror = function () {
                console.log("media channel error.");
                reject(-1);
            }
            this.m_wsMedia.onmessage = function (evt) {
                // 码流
                // let tmp = new Uint8Array(evt.data).subarray(4, 5);
                // int nFrameFlag = m_receiveBuffer[4] & 0xff;
                // if ((nFrameFlag == 0x65) || (nFrameFlag == 0x67))
                // if ((tmp & 0xff) == 0x65 || (tmp & 0xff) == 0x67)
                // {
                // var time = new Date().getTime();
                // console.log("frame interval: " + (time - this.m_interval));
                // this.m_interval = time;
                // }
                tmpThis.m_observer.onMedia(evt.data);
            }
            this.m_wsMedia.onclose = function () {
                // fix: 断开连接
                console.log("media channel closed.");
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