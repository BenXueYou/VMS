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
    this.videoWidth     = 2560; // 默认的
    this.videoHeight    = 1440;
}

Decoder.prototype.initDecoder = function () {
    var ret = Module._initDecoder(this.videoCallback);
    this.cacheBuffer = Module._malloc(3*2560*1440);
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
        case kSetPlayInit:
            this.initDecoder();    
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
	
    this.videoCallback = Module.addFunction(function (buff, size, width, height) {
        var outArray = Module.HEAPU8.subarray(buff, buff + size);
        var data = new Uint8Array(outArray);
        //var width = 2560;
        //var height = 1440;
        var objData = {
            t: kVideoFrame,
            d: data,
            w: width,
            h: height
        };
        self.postMessage(objData);
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

