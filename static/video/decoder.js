function CDecoder(canvas, streamType) {
  this.m_canvas = canvas;
  this.m_player = null;
  this.m_cache = null;
  this.streamType = streamType;
}

CDecoder.prototype.play = function() {
  var w, h;
  if (this.streamType === "main") {
    w = 1920;
    h = 1080;
  } else if (this.streamType === "sub") {
    w = 704;
    h = 576;
  } else {
    w = 2560;
    h = 1440;
  }

  // 2560 1440

  this.m_player = new Player(w, h); // fix: 分辨率先保留
  this.m_player.setCanvas(this.m_canvas);
  this.m_cache = new CDeque();
};

CDecoder.prototype.stop = function() {
  delete this.m_player;
  delete this.m_cache;
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

CDecoder.prototype.drag = function(position) {
  // 1. 清除缓存
  this.m_cache.clear();
};

//CDecoder.prototype.media = function(data)
//{
//    let ret = 0;
//    var reader = new FileReader();
//    reader.addEventListener("loadend", function () {
//        m_player.h264AVFrmaeData(reader.result, data.size);
//    });
//    reader.readAsArrayBuffer(data);
//    if (ret != 0)
//    {
//    }
//    return ret;
//}

CDecoder.prototype.media = function(data) {
  if (this.m_cache != null && this.m_cache.empty()) {
    // 缓存中无数据 写入解码
    let ret = 0;

    var reader = new FileReader();
    var player = this.m_player;
    reader.addEventListener("loadend", function() {
      player.h264AVFrmaeData(reader.result, data.size);
    });
    reader.readAsArrayBuffer(data);

    if (ret != 0) {
      // 写入解码失败 尾插入缓存
      cache.push_back(data);
      // 启动逻辑检查定时任务
      setInterval(this.checkCache, 0);
    }
  } else if (this.m_cache != null) {
    // 缓存中有数据 尾插入缓存
    this.m_cache.push_back(data);
  } else {
  }
};

CDecoder.prototype.checkCache = function() {
  // 缓存检查逻辑
  if (cache.size() > 1000 && !isStop) {
    // 缓存容量达到上限 并且 后端未停止送流
    // fix: 通知暂停
  } else if (cache.size() < 200 && isStop) {
    // 缓存容量降到下限 并且 后端已停止送流
    // fix: 通知恢复
  }

  // 缓存中有数据
  if (!cache.empty()) {
    let ret = 0;
    var reader = new FileReader();
    var data = cache.pop_front();
    var tmpThis = this;
    reader.addEventListener("loadend", function() {
      tmpThis.m_player.h264AVFrmaeData(reader.result, data.size);
    });
    reader.readAsArrayBuffer(data);
    if (ret != 0) {
      // 写入解码失败 头插入缓存
      cache.push_front(data);
    }
  } else {
    // fix: 缓存中无数据 停止该定时任务
  }
};
