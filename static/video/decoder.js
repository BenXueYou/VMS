function CDecoder(elment, decodeMod) {
  this.m_canvas = elment;
  this.decodeMod = decodeMod;
  this.m_player = null;
  this.m_cache = new CDeque();
  this.n_num = [];
  this.m_queue = new CDeque();
  this.m_timer = null;
  this.timeInterval = 40;
}

CDecoder.prototype.clearQueure = function() {
  if (!this.m_queue) {
    this.m_queue.n_num = [];
  }
};
CDecoder.prototype.setup = function(sdp) {
  if (this.decodeMod == "canvas") {
    this.m_player = new Player(); // fix: 分辨率先保留
    this.m_player.setCanvas(this.m_canvas);
  } else if (this.decodeMod === "video") {
    this.m_player = new wfsControl(); // fix: 分辨率先保留
    this.m_player.setup(this.m_canvas);
  }
  this.m_player.clearQueure = this.clearQueure;
};

CDecoder.prototype.play = function() {
  // fix: do nothing
};

CDecoder.prototype.stop = function() {
  delete this.m_player;
  this.m_player = null;
  delete this.m_cache;
  this.m_cache = null;
};

CDecoder.prototype.pause = function() {
  // fix: do nothing
};

CDecoder.prototype.resume = function() {
  // fix: do nothing
};

CDecoder.prototype.speedControl = function(speed) {
  // fix: 解码速度切换
};

CDecoder.prototype.drag = function() {
  // 1. 清除缓存
  this.m_cache.clear();
};

CDecoder.prototype.media = function(data) {
  // console.log(data);
  var player = this.m_player;
  var _this = this;
  if (this.m_cache != null && this.m_cache.empty()) {
    // 缓存中无数据 写入解码
    var ret = 0;

    var reader = new FileReader();

    reader.addEventListener("loadend", function() {
      console.time("appendBuffer");
      _this.m_queue.add(reader.result, data.size);
      if (player != null) {
        // 将数据放入到队列
        // console.log(vdata);
        // var vdata = _this.m_queue.get();
        // if (_this.decodeMod === "canvas") {
        //   player.h264AVFrmaeData(vdata.vdata, vdata.size);
        // } else if (_this.decodeMod === "video") {
        //   player.play(vdata.vdata);
        // }
      } else ret = -1;
      console.timeEnd("appendBuffer");
    });
    reader.readAsArrayBuffer(data);

    if (ret != 0) {
      // 写入解码失败 尾插入缓存
      this.m_cache.push_back(data);
      // 启动逻辑检查定时任务
      setInterval(this.checkCache, 0);
    }
  } else if (this.m_cache != null) {
    // 缓存中有数据 尾插入缓存
    this.m_cache.push_back(data);
  } else {
  }

  // 开启定时器，准备40毫秒拿个数据
  if (!this.m_timer) {
    this.m_timer = setInterval(function() {
      if (player != null) {
        while (1) {
          var vdata = _this.m_queue.get();
          // console.log(vdata);
          if (!vdata || !vdata.vdata) {
            break;
          }
          if (_this.decodeMod === "canvas") {
            player.h264AVFrmaeData(vdata.vdata, vdata.size);
          } else if (_this.decodeMod === "video") {
            player.play(vdata.vdata);
          }
          // 如果size小于100，则继续获取队列下个数据，不等待40毫秒
          // 否则继续拿队列下一帧数据
          if (vdata.size > 100) {
            break;
          } else {
            console.log("size小于100,继续获取下一帧数据");
          }
        }
      }
    }, this.timeInterval);
  }
};

CDecoder.prototype.checkCache = function() {
  // 缓存检查逻辑
  if (this.m_cache.size() > 1000 && !isStop) {
    // 缓存容量达到上限 并且 后端未停止送流
    // fix: 通知暂停
  } else if (this.m_cache.size() < 200 && isStop) {
    // 缓存容量降到下限 并且 后端已停止送流
    // fix: 通知恢复
  }

  // 缓存中有数据
  if (!this.m_cache.empty()) {
    let ret = 0;
    var reader = new FileReader();
    var data = this.m_cache.pop_front();
    var tmpThis = this;
    reader.addEventListener("loadend", function() {
      tmpThis.m_player.h264AVFrmaeData(reader.result, data.size);
    });
    reader.readAsArrayBuffer(data);
    if (ret != 0) {
      // 写入解码失败 头插入缓存
      this.m_cache.push_front(data);
    }
  } else {
    // fix: 缓存中无数据 停止该定时任务
    clearInterval();
  }
};
