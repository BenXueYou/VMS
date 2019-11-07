self.Module = {
    onRuntimeInitialized: function () {
        onWasmLoaded();
    }
};

self.importScripts("common.js");
self.importScripts("libffmpeg.js");

function Decoder() {
    this.logger         = new Logger("Decoder");
    this.coreLogLevel   = 0;
    this.wasmLoaded     = false;
    this.canSend        = false;
    this.tmpReqQue      = [];
    this.cacheBuffer    = null;
    this.videoCallback  = null;
    this.videoWidth     = 1920; // 默认的
    this.videoHeight    = 1080;
}

Decoder.prototype.setVideoWidthHeight = function (videoWidth, videoHeight) {
    this.videoWidth     = videoWidth;
    this.videoHeight    = videoHeight;
    var ret = Module._initDecoder(this.videoWidth, this.videoHeight, this.videoCallback);
    this.logger.logInfo("initDecoder videoWidth: " + this.videoWidth + "videoHeight: " + this.videoHeight + ".");
    this.cacheBuffer = Module._malloc(3*this.videoWidth*this.videoHeight);
    this.canSend = true;
    var objData = {
        t: kInitDecoderRsp,
        e: ret,
        /*
        v: {
            d: duration,
            p: videoPixFmt,
            w: videoWidth,
            h: videoHeight
        }
        */
    };
    self.postMessage(objData);
}

Decoder.prototype.initDecoder = function () {
    
    this.logger.logInfo("this.videoCallback: " + this.videoCallback  + ".");
    var paramCount = 7, paramSize = 4;
    var paramByteBuffer = Module._malloc(paramCount * paramSize);
    // var ret = Module._initDecoder(this.videoWidth, this.videoHeight, this.videoCallback);
    //this.logger.logInfo("initDecoder return " + ret + ".");
    //if (0 == ret) {
        /*
        var paramIntBuff    = paramByteBuffer >> 2;
        var paramArray      = Module.HEAP32.subarray(paramIntBuff, paramIntBuff + paramCount);
        var duration        = paramArray[0];
        var videoPixFmt     = paramArray[1];
        var videoWidth      = paramArray[2];
        var videoHeight     = paramArray[3];
        */
    /*
        this.logger.logInfo("initDecoder videoWidth: " + this.videoWidth + "videoHeight: " + this.videoHeight + ".");
        this.cacheBuffer = Module._malloc(3*this.videoWidth*this.videoHeight);
        var objData = {
            t: kInitDecoderRsp,
            e: ret,
            
            v: {
                d: duration,
                p: videoPixFmt,
                w: videoWidth,
                h: videoHeight
            }
            
        };
        self.postMessage(objData);
    */
    //}
	/*
	var typedArray = new Uint8Array(2);
	typedArray[0] = 42;
    Module.HEAPU8.set(typedArray, this.cacheBuffer); //拷贝
    Module._sendData(this.cacheBuffer, typedArray.length); //传递
    */
	
};

/*
Decoder.prototype.sendData = function (data) {
    var typedArray = new Uint8Array(data);
    Module.HEAPU8.set(typedArray, this.cacheBuffer);
    Module._sendData(this.cacheBuffer, typedArray.length);
};
*/

Decoder.prototype.processReq = function (req) {
    //this.logger.logInfo("processReq " + req.t + ".");
    switch (req.t) {
        case kInitDecoderReq:
			this.initDecoder();
			this.logger.logInfo("initDecoder.");
            break;
		case kH264AVFrmaeDataReq:
			//this.logger.logInfo("kH264AVFrmaeDataReq.");
			this.h264AVFrmaeData(req.d, req.s);
            break;
        case kSetWidthAndHeight:
            this.setVideoWidthHeight(req.w, req.h);
            break;
        default:
            this.logger.logError("Unsupport messsage " + req.t);
            break;
    }
};

/*
	var typedArray = new Uint8Array(2);
	typedArray[0] = 42;
    Module.HEAPU8.set(typedArray, this.cacheBuffer); //拷贝
    Module._sendData(this.cacheBuffer, typedArray.length); //传递
*/

Decoder.prototype.h264AVFrmaeData = function (data, size) {
    // this.cacheBuffer = Module._malloc(size);
    if(this.canSend)
    {
        var typedArray = new Uint8Array(data);
        Module.HEAPU8.set(typedArray, this.cacheBuffer);
        var ret =  Module._h264AVFrmaeData(this.cacheBuffer, typedArray.length);
        
        if(ret == 0){
            // this.logger.logInfo("h264AVFrmaeData success.");
        }
    }
	
};

Decoder.prototype.cacheReq = function (req) {
    if (req) {
        this.tmpReqQue.push(req);
    }
};

Decoder.prototype.onWasmLoaded = function () {
    this.logger.logInfo("Wasm loaded.");
    this.wasmLoaded = true;
	
    this.videoCallback = Module.addFunction(function (buff, size) {
		//this.logger.logInfo("videoCallback success" + size + ".");
		//this.logger.logInfo("videoCallback success.");
        var outArray = Module.HEAPU8.subarray(buff, buff + size);
        var data = new Uint8Array(outArray);
        var objData = {
            t: kVideoFrame,
            d: data
        };
        self.postMessage(objData, [objData.d.buffer]);
    });

    while (this.tmpReqQue.length > 0) {
        var req = this.tmpReqQue.shift();
        this.processReq(req);
    }
};

self.decoder = new Decoder;

self.onmessage = function (evt) {
    if (!self.decoder) {
        console.log("[ER] Decoder not initialized!");
        return;
    }

    var req = evt.data;
    if (!self.decoder.wasmLoaded) {
        self.decoder.cacheReq(req);
        self.decoder.logger.logInfo("Temp cache req " + req.t + ".");
		console.log("[ER] Temp cache req" + req.t + ".");
        return;
    }

    self.decoder.processReq(req);
};

function onWasmLoaded() {
    if (self.decoder) {
        self.decoder.onWasmLoaded();
		console.log("[SU] onWasmLoaded kInitDecoderReq ...");
		var req = {
			t: kInitDecoderReq
		};
		self.decoder.processReq(req);
    } else {
        console.log("[ER] No decoder!");
    }
}

