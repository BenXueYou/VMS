class CWebSocket
{
    constructor(url, observer) {
        this.m_url = url;
        this.m_observer =  observer;

        // promise池
        this.m_promisePool = {};
        this.m_open = null;
    }

    open() {
        //if (this.m_open == null)
        //{
            //this.m_open = new Promise((resolve, reject) => {
            return new Promise((resolve, reject) => {
                if (typeof this.m_websocket === 'undefined') {
                    this.m_websocket = new WebSocket(this.m_url);
                    this.m_websocket.onopen = (e) => {
                        resolve(0);
                    };
                    this.m_websocket.onerror = (e) => {
                        reject(-1);
                    }
                }
                this.m_websocket.onclose = (e) => {
                }

                this.m_websocket.onmessage = (evt) => {
                    let s = evt.data;
                    let msg = JSON.parse(s);
                    const key = msg.context;
                    const req = this.m_promisePool[key];
                    if (req != undefined)
                    {
                        req.resolve(s);
                        delete this.m_promisePool[key];
                    }
                    else
                        this.m_observer.onnotify(s);
                };
            });
        //}
        //return this.m_open;
    }

    close() {
        delete this.m_open;
        this.m_open = null;
        this.m_websocket.close();
    }
    // context包含在content中
    send(content) {
        return new Promise((resolve, reject) => {
            this.m_promisePool[content.context] = {
                content,
                resolve,
                reject,
            };
            if (this.m_websocket !== 'undefined')
                this.m_websocket.send(JSON.stringify(content));
            else
                reject("");
        });
    }
}