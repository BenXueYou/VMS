import Vue from 'vue';
import store from '@/store/store.js';
/**
 * 图片地图覆盖物基类，不可直接实例化
 */
class POverlay {
  // 构造器
  constructor(option) {
    this.option = option;
    this.stage = null;
    this.config = {};
    this.shape = null;
    this.layer = null;
    this.enableMassClear = true;
    this.enableEventListen = true;
    this.mousedownX = 0;
    this.mousedownY = 0;
    this.mouseupX = 0;
    this.mouseupY = 0;
  };
  // 覆盖物的舞台和图层的初始化
  create(stage) {
    this.stage = stage;
    this.layer = new Kinetic.Layer();
  };
  // 显示覆盖物
  show() {
    this.shape.show();
    this.layer.draw();
  };
  // 隐藏覆盖物
  hide() {
    this.shape.hide();
    this.layer.draw();
  };
  // 允许覆盖物拖动
  enableDragging() {
    this.shape.draggable(true);
    let eventArray = [
      "click",
      "mousedown",
      "mouseup",
      "dragstart",
      "dragmove",
      "dragend",
    ];
    eventArray.forEach((eventType) => {
      this.addEventListener(eventType);
    });
  };
  // 禁止覆盖物拖动
  disableDragging() {
    this.shape.draggable(false);
  };
  // 允许覆盖物进行事件监听
  enableEventListen() {
    this.enableEventListen = true;
  };
  // 禁止覆盖物进行事件监听
  disableEventListen() {
    this.enableEventListen = false;
  };
  // 覆盖物事件监听
  addEventListener(eventType, callBack = function () { }) {
    if (this.shape && this.enableEventListen) {
      this.shape.on(eventType, (e) => {
        if (eventType === "mousedown") {
          this.mousedownX = e.evt.offsetX;
          this.mousedownY = e.evt.offsetY;
        }
        if (eventType === "mouseup") {
          this.mouseupX = e.evt.offsetX;
          this.mouseupY = e.evt.offsetY;
          if (this.mouseupX !== this.mousedownX || this.mouseupY !== this.mousedownY) {
            e.type = "dragend";
            e.initLayerX = this.mousedownX;
            e.initLayerY = this.mousedownY;
          }
        }
        e.evt.cancelBubble = true;
        callBack(e);
      });
    }
  };
  // 允许批量清除
  enableMassClear() {
    this.enableMassClear = true;
  };
  // 不允许批量清除
  disableMassClear() {
    this.enableMassClear = false;
  };
  // 删除覆盖物
  remove() {
    this.shape.remove();
    this.layer.draw();
  };
};

/**
 * 图片地图标记物类
 */
class PMarker extends POverlay {
  // 构造器
  constructor(option) {
    super(option);
    this.isLoaded = false;
  };
  // 初始化标记物，将其添加到图层和舞台
  create(stage) {
    super.create(stage);
    this.config.x = this.option.point.x;
    this.config.y = this.option.point.y;
    // this.config.offset = { x: 22, y: 40 };
    this.config.detectionType = "pixel";
    this.config.visible = true;
    let img = new Image();
    img.src = this.option.icon;
    img.onload = () => {
      this.config.image = img;
      this.shape = new Kinetic.Image(this.config);
      this.layer.add(this.shape);
      this.stage.add(this.layer);
      this.isLoaded = true;
    }
  };
};

/**
 * 图片地图折线类
 */
class PPolyline extends POverlay {
  // 构造器
  constructor(option) {
    super(option);
    this.midPointsArr = [];
    this.editMarkers = [];
  };
  // 初始化折线，将其添加到图层和舞台
  create(stage) {
    super.create(stage);
    this.config.detectionType = "pixel";
    this.config.stroke = "#777777";
    this.config.strokeWidth = 3;
    this.config.points = [];
    this.option.points.forEach((v) => {
      this.config.points.push(v.x);
      this.config.points.push(v.y);
    });
    this.shape = new Kinetic.Line(this.config);
    this.layer.add(this.shape);
    this.stage.add(this.layer);
    this._getMiddlePoint();
    this._setEditMarker(this._editEventCall.bind(this));
    this.disableEditing();
  };
  // 允许折线编辑
  enableEditing() {
    this.editMarkers.forEach((v) => {
      v.marker.show();
    });
    this.layer.draw();
  };
  // 禁止折线编辑
  disableEditing() {
    this.editMarkers.forEach((v) => {
      v.marker.hide();
    });
    this.layer.draw();
  };
  // 编辑折线后重新绘制折线和操作点
  _resetLinePath() {
    this.config.points = [];
    this.option.points.forEach((v) => {
      this.config.points.push(v.x);
      this.config.points.push(v.y);
    });
    this.editMarkers.forEach((v) => {
      if (v.type === "midpoint") {
        v.marker.remove();
      }
    });
    this._getMiddlePoint();
    this.midPointsArr.forEach((v) => {
      this._getEditMarker("midpoint", v, this._editEventCall.bind(this));
    });
    this.shape.setPoints(this.config.points);
    this.layer.draw();
  };
  // 获取折线的所有中间操作点
  _getMiddlePoint() {
    let lastPoint;
    this.midPointsArr = [];
    this.option.points.forEach((v, i) => {
      if (i !== 0) {
        this.midPointsArr.push({
          x: lastPoint.x + (v.x - lastPoint.x) / 2,
          y: lastPoint.y + (v.y - lastPoint.y) / 2,
          index: i
        });
      }
      lastPoint = v;
    });
  };
  // 设置折线的所有操作点
  _setEditMarker(callBack) {
    this.option.points.forEach((v) => {
      this._getEditMarker("endpoint", v, callBack);
    });
    this.midPointsArr.forEach((v) => {
      this._getEditMarker("midpoint", v, callBack);
    });
  };
  // 生成折线的所有操作点
  _getEditMarker(type, point, callBack) {
    let fill;
    if (type === "endpoint") {
      fill = "white";
    } else if (type === "midpoint") {
      fill = "transparent";
    }
    let config = {
      x: point.x,
      y: point.y,
      width: 10,
      height: 10,
      offset: { x: 5, y: 5 },
      fill: fill,
      stroke: "black",
      strokeWidth: 1,
      draggable: true
    };
    let marker = new Kinetic.Rect(config);
    let eventArray = [
      "click",
      "rightclick",
      "dblclick",
      "mousedown",
      "mouseup",
      "dragstart",
      "dragmove",
      "dragend",
    ];
    eventArray.forEach((eventType) => {
      marker.on(eventType, (e) => {
        e.cancelBubble = true;
        if (window.event.stopPropagation) {
          window.event.stopPropagation();
        } else {
          window.event.cancelBubble = true;
        }
        callBack(e, point);
      });
    });
    this.layer.add(marker);
    this.editMarkers.push({
      marker, type
    });
    this.layer.draw();
  };
  // 操作点操作时的事件监听回调
  _editEventCall(e, point) {
    let pointX = point.x;
    let pointY = point.y;
    if (e.type === "dragmove") {
      let pointXNew = this.stage.getPointerPosition().x;
      let pointYNew = this.stage.getPointerPosition().y;
      for (let v of this.editMarkers) {
        if (v.marker._id === e.target._id) {
          if (v.type === "endpoint") {
            for (let item of this.option.points) {
              if (item.x === pointX && item.y === pointY) {
                item.x = pointXNew;
                item.y = pointYNew;
                pointX = pointXNew;
                pointY = pointYNew;
                break;
              }
            }
          } else if (v.type === "midpoint") {
            for (let item of this.midPointsArr) {
              if (item.x === pointX && item.y === pointY) {
                item.x = pointXNew;
                item.y = pointYNew;
                pointX = pointXNew;
                pointY = pointYNew;
                this.option.points.splice(item.index, 0, item);
                v.type = "endpoint";
                v.marker.setFill("white");
                break;
              }
            }
          }
          break;
        }
      }
      this._resetLinePath();
    };
  };
  // 更新编辑操作点
  updateEditMarker() {
    let lastX;
    this.option.points = [];
    this.shape.getPoints().forEach((v, k) => {
      if (k % 2 === 0) {
        lastX = v;
      } else {
        this.option.points.push({
          x: lastX,
          y: v
        });
      }
    });
    this._getMiddlePoint();
    this._setEditMarker(this._editEventCall.bind(this));
  };
  // 删除元素
  remove() {
    super.remove();
    this.editMarkers.forEach((v) => {
      v.marker.remove();
    });
    this.layer.draw();
  }
};

/**
 * 图片地图矩形类
 */
class PRectangle extends POverlay {
  // 构造器
  constructor(option) {
    super(option);
  };
  // 初始化矩形，将其添加到图层和舞台
  create(stage) {
    super.create(stage);
    this.config.x = this.option.x;
    this.config.y = this.option.y;
    this.config.fill = 'rgba(37,210,152,0.4)';
    this.config.stroke = '#43FBEF';
    this.config.strokeWidth = 1;
    this.config.lineJoin = 'round';
    this.config.dash = [4, 4];
    this.config.width = this.option.width;
    this.config.height = this.option.height;
    this.shape = new Kinetic.Rect(this.config);
    this.layer.add(this.shape);
    this.stage.add(this.layer);
  };
};

/**
 * 图片地图多边形类
 */
class PPolygon extends POverlay {
  // 构造器
  constructor(option) {
    super(option);
  };
  // 初始化多边形，将其添加到图层和舞台
  create(stage) {
    super.create(stage);
    this.config.points = this.option.points;
    this.config.fill = 'rgba(37,210,152,0.4)';
    this.config.stroke = '#43FBEF';
    this.config.strokeWidth = 1;
    this.config.lineJoin = 'round';
    this.config.dash = [4, 4];
    this.shape = new Kinetic.Polygon(this.config);
    this.layer.add(this.shape);
    this.stage.add(this.layer);
  };
};

/**
 * 图片地图圆形类
 */
class PCircle extends POverlay {
  // 构造器
  constructor(option) {
    super(option);
  };
  // 初始化圆形，将其添加到图层和舞台
  create(stage) {
    super.create(stage);
    this.config.x = this.option.x;
    this.config.y = this.option.y;
    this.config.fill = 'rgba(37,210,152,0.4)';
    this.config.stroke = '#43FBEF';
    this.config.strokeWidth = 1;
    this.config.lineJoin = 'round';
    this.config.dash = [4, 4];
    this.config.radius = this.option.radius;
    this.shape = new Kinetic.Circle(this.config);
    this.layer.add(this.shape);
    this.stage.add(this.layer);
  };
};

/**
 * 图片地图扇形类
 */
class PSector extends POverlay {
  // 构造器
  constructor(option) {
    super(option);
    this.sMarker = null;
    this.eMarker = null;
    this.mMarker = null;
    this.radius = option.radius || 0;
    this.sDegree = option.sDegree || 0;
    this.eDegree = option.eDegree || 0;
  };
  // 初始化扇形，将其添加到图层和舞台
  create(stage) {
    super.create(stage);
    this.config.x = this.option.center.x;
    this.config.y = this.option.center.y;
    this.config.radius = this.option.radius;
    this.config.fill = 'rgba(67,251,239,0.4)';
    this.config.stroke = '#43FBEF';
    this.config.strokeWidth = 1;
    this.config.angle = this.option.eDegree - this.option.sDegree;
    this.config.rotation = -this.option.eDegree;
    this.shape = new Kinetic.Wedge(this.config);
    this.layer.add(this.shape);
    this.stage.add(this.layer);
    this._setEditMarker(this._editEventCall.bind(this));
    this.disableEditing();
  };
  // 允许扇形编辑，即显示编辑操作点
  enableEditing() {
    this.sMarker.show();
    this.eMarker.show();
    this.mMarker.show();
    this.layer.draw();
  };
  // 禁止扇形编辑，即隐藏编辑操作点
  disableEditing() {
    this.sMarker.hide();
    this.eMarker.hide();
    this.mMarker.hide();
    this.layer.draw();
  };
  // 设置扇形编辑操作点
  _setEditMarker(callBack) {
    this.sMarker = this._getEditMarker(this.option.center, this.option.radius, "start", this.option.sDegree, callBack);
    this.eMarker = this._getEditMarker(this.option.center, this.option.radius, "end", this.option.eDegree, callBack);
    this.mMarker = this._getEditMarker(this.option.center, this.option.radius, "middle", ((this.option.eDegree - this.option.sDegree) / 2 + this.option.sDegree), callBack);
  };
  // 添加用于编辑扇形的三个操作点
  _getEditMarker(center, radius, type, degree, callBack) {
    let point = this._getCurvePoint(center, radius, degree);
    let config = {
      x: point.x,
      y: point.y,
      fill: '#43FBEF',
      radius: 8,
      draggable: true
    };
    let marker = new Kinetic.Circle(config);
    let eventArray = [
      "click",
      "rightclick",
      "dblclick",
      "mousedown",
      "mouseup",
      "dragstart",
      "dragmove",
      "dragend",
    ];
    eventArray.forEach((eventType) => {
      marker.on(eventType, (e) => {
        e.cancelBubble = true;
        if (window.event.stopPropagation) {
          window.event.stopPropagation();
        } else {
          window.event.cancelBubble = true;
        }
        callBack(e, type);
      });
    });
    this.layer.add(marker);
    this.stage.add(this.layer);
    return marker;
  };
  // 计算圆弧上指定点的坐标
  _getCurvePoint(center, radius, degree) {
    let y = radius * Math.sin(degree * Math.PI / 180);
    let x = radius * Math.cos(degree * Math.PI / 180);
    return {
      x: center.x + x,
      y: center.y - y
    };
  };
  // 重新绘制扇形和其编辑操作点
  _resetSectorPath(radius, sDegree, eDegree) {
    this.shape.setAngle(eDegree - sDegree);
    this.shape.setRadius(radius);
    this.shape.setRotation(-eDegree);
    this.sMarker.setX(this._getCurvePoint(this.option.center, radius, sDegree).x);
    this.sMarker.setY(this._getCurvePoint(this.option.center, radius, sDegree).y);
    this.mMarker.setX(this._getCurvePoint(this.option.center, radius, ((eDegree - sDegree) / 2 + sDegree)).x);
    this.mMarker.setY(this._getCurvePoint(this.option.center, radius, ((eDegree - sDegree) / 2 + sDegree)).y);
    this.eMarker.setX(this._getCurvePoint(this.option.center, radius, eDegree).x);
    this.eMarker.setY(this._getCurvePoint(this.option.center, radius, eDegree).y);
    this.layer.draw();
  };
  // 编辑操作点的事件回调
  _editEventCall(e, type) {
    if (type === "start") {
      this._sMarkerEdit(e);
    } else if (type === "end") {
      this._eMarkerEdit(e);
    } else if (type === "middle") {
      this._mMarkerEdit(e);
    }
  };
  // 开始点的编辑事件
  _sMarkerEdit(e) {
    if (e.type === "dragmove") {
      let y = this.stage.getPointerPosition().y - this.option.center.y;
      let x = this.stage.getPointerPosition().x - this.option.center.x;
      if (y > 0 && x > 0) {
        this.sDegree = 360 - Math.atan(Math.abs(y) / Math.abs(x)) * 180 / Math.PI;
      } else if (y > 0 && x < 0) {
        this.sDegree = 180 + Math.atan(Math.abs(y) / Math.abs(x)) * 180 / Math.PI;
      } else if (y < 0 && x < 0) {
        this.sDegree = 180 - Math.atan(Math.abs(y) / Math.abs(x)) * 180 / Math.PI;
      } else if (y < 0 && x > 0) {
        this.sDegree = Math.atan(Math.abs(y) / Math.abs(x)) * 180 / Math.PI;
      }
      if (this.sDegree > this.eDegree) {
        this.sDegree = -(360 - this.sDegree);
      }
      this._resetSectorPath(this.radius, this.sDegree, this.eDegree);
    }
  };
  // 结束点的编辑事件
  _eMarkerEdit(e) {
    if (e.type === "dragmove") {
      let y = this.stage.getPointerPosition().y - this.option.center.y;
      let x = this.stage.getPointerPosition().x - this.option.center.x;
      if (y > 0 && x > 0) {
        this.eDegree = Math.atan(Math.abs(y) / Math.abs(x)) * 180 / Math.PI;
      } else if (y > 0 && x < 0) {
        this.eDegree = 180 - Math.atan(Math.abs(y) / Math.abs(x)) * 180 / Math.PI;
      } else if (y < 0 && x < 0) {
        this.eDegree = 180 + Math.atan(Math.abs(y) / Math.abs(x)) * 180 / Math.PI;
      } else if (y < 0 && x > 0) {
        this.eDegree = 360 - Math.atan(Math.abs(y) / Math.abs(x)) * 180 / Math.PI;
      }
      if (this.sDegree > this.eDegree) {
        this.eDegree = 360 + this.eDegree;
      }
      this.eDegree = 360 - this.eDegree;
      this._resetSectorPath(this.radius, this.sDegree, this.eDegree);
    }
  };
  // 中间点的编辑事件
  _mMarkerEdit(e) {
    if (e.type === "dragmove") {
      this.radius = Math.sqrt(Math.pow(this.stage.getPointerPosition().x - this.option.center.x, 2) + Math.pow(this.stage.getPointerPosition().y - this.option.center.y, 2));
      this._resetSectorPath(this.radius, this.sDegree, this.eDegree);
    }
  };
  // 删除元素
  remove() {
    super.remove();
    this.sMarker.remove();
    this.mMarker.remove();
    this.eMarker.remove();
    this.layer.draw();
  };
  hideSector() {
    this.sMarker.hide();
    this.eMarker.hide();
    this.mMarker.hide();
    this.shape.hide();
    this.layer.draw();
  };
  showSector(isCanEdit) {
    if (isCanEdit === "canEdit") {
      this.sMarker.show();
      this.eMarker.show();
      this.mMarker.show();
    }
    this.shape.show();
    this.layer.draw();
  };
  getSectorInfo() {
    return {
      center: this.option.center,
      radius: this.radius,
      sDegree: this.sDegree,
      eDegree: this.eDegree
    };
  }
}

/**
 * 图片地图类
 */
class PMap {
  // 构造器
  constructor(mapOption) {
    this.mapOption = mapOption;
    this.body = null;
    this.container = null;
    this.canvas = null;
    this.stage = null;
    this.img = null;
    this.isLoaded = false;
    this.overlayMap = new Map();
    this.create();
  };
  // 用js维护一套产生不重复id的机制
  _genModelIndex() {
    let idStr = Date.now().toString(36);
    idStr += Math.random().toString(36).substr(3);
    return idStr;
  };
  // 初始化图片地图
  create() {
    this.body = document.getElementsByTagName('body')[0];
    this.container = document.getElementById(this.mapOption.domId);
    this.container.style.position = "relative";
    this.container.style.display = "flex";
    this.container.style.alignItems = "center";
    this.container.style.justifyContent = "center";
    this.container.style.overflow = "hidden";
    this.canvas = document.createElement("div");
    this.canvas.id = "stage";
    this.img = document.createElement('img');
    this.img.src = this.mapOption.picUrl;
    this.img.onload = () => {
      this.canvas.style.width = this.img.width + "px";
      this.canvas.style.height = this.img.height + "px";
      this.canvas.style.backgroundSize = `${this.img.width}px ${this.img.height}px`;
      this.canvas.style.backgroundImage = 'url("' + Vue.prototype.$common.setPictureShow(this.img.src) + '")';
      this.canvas.style.position = "absolute";
      if (this.mapOption.startPoint) {
        this.canvas.style.top = this.mapOption.startPoint.y + "px";
        this.canvas.style.left = this.mapOption.startPoint.x + "px";
      }
      this.canvas.style.transform = "scale(" + this.mapOption.scale + ")";
      this.container.appendChild(this.canvas);
      this.canvas.oncontextmenu = (e) => {
        window.event.returnValue = false;
        return false;
      }
      this.canvas.ondragover = (e) => {
        e.preventDefault();
      }
      this.stage = new Kinetic.Stage({
        container: "stage",
        width: this.img.width,
        height: this.img.height
      });
      this.isLoaded = true;
    }
    this.enableCanvasDragging();
    this.enableScrollWheelZoom();
  };
  // 允许画布拖动
  enableCanvasDragging() {
    this.canvas.addEventListener("mousedown", (e) => {
      let disX = e.clientX - this.canvas.offsetLeft;
      let disY = e.clientY - this.canvas.offsetTop;
      e.preventDefault();
      this.body.onmousemove = (ev) => {
        ev.preventDefault();
        let x = ev.clientX - disX;
        let y = ev.clientY - disY;
        this.canvas.style.left = x + 'px';
        this.canvas.style.top = y + 'px';
      }
      // 鼠标弹起后停止移动
      this.body.onmouseup = () => {
        this.body.onmousemove = null;
        this.body.onmouseup = null;
      }
    });
  };
  // 设置画布在容器里居中
  setCenter() {
    this.canvas.style.top = "";
    this.canvas.style.left = "";
  };
  // 设置地图
  setPosition(left, top) {
    this.canvas.style.top = top + "px";
    this.canvas.style.left = left + "px";
  };
  // 允许滚轮缩放
  enableScrollWheelZoom() {
    this.container.onmousewheel = (e) => {
      let transform = this.canvas.style.transform;
      let scale = parseFloat(transform.substring(transform.indexOf('(') + 1, transform.indexOf(')'))) || 1;
      scale += e.wheelDelta / 1200;
      if (scale > 0) {
        this.canvas.style.transform = "scale(" + scale + ")";
      }
    }
  };
  // 放大地图
  zoomIn() {
    let transform = this.canvas.style.transform;
    let scale = parseFloat(transform.substring(transform.indexOf('(') + 1, transform.indexOf(')'))) || 1;
    scale = scale + 0.1;
    this.canvas.style.transform = "scale(" + scale + ")";
  };
  // 缩小地图
  zoomOut() {
    let transform = this.canvas.style.transform;
    let scale = parseFloat(transform.substring(transform.indexOf('(') + 1, transform.indexOf(')'))) || 1;
    if (scale > 0.1) {
      scale = scale - 0.1;
    }
    this.canvas.style.transform = "scale(" + scale + ")";
  };
  // 向图片地图添加覆盖物
  addOverlay(overlay) {
    overlay.create(this.stage);
    let id = this._genModelIndex();
    this.overlayMap.set(id, overlay);
  };
  // 打开图形绘制模式
  openDrawManger(drawType, callBack = function () { }) {
    this.canvas.style.cursor = 'crosshair';
    if (drawType === "rect" || drawType === "circle") {
      this.stage.on("contentMousedown", (e) => {
        e.cancelBubble = true;
        if (window.event.stopPropagation) {
          window.event.stopPropagation();
        } else {
          window.event.cancelBubble = true;
        }
        let pointX = this.stage.getPointerPosition().x;
        let pointY = this.stage.getPointerPosition().y;
        if (drawType === "rect") {
          this._drawRect(pointX, pointY, callBack);
        } else if (drawType === "circle") {
          this._drawCircle(pointX, pointY, callBack);
        }
      });
    } else if (drawType === "polyline") {
      this._drawPolyline(callBack);
    } else if (drawType === "polygon") {
      this._drawPolygon(callBack);
    }
  };
  // 绘制矩形
  _drawRect(pointX, pointY, callBack) {
    let option = {
      x: pointX,
      y: pointY,
      width: 0,
      height: 0
    };
    let rect = new PRectangle(option);
    this.addOverlay(rect);
    this.stage.on("contentMousemove", (e) => {
      e.cancelBubble = true;
      if (window.event.stopPropagation) {
        window.event.stopPropagation();
      } else {
        window.event.cancelBubble = true;
      }
      let x = this.stage.getPointerPosition().x;
      let y = this.stage.getPointerPosition().y;
      if (x - pointX > 0 && y - pointY > 0) {
        option.x = pointX;
        option.y = pointY;
      } else if (x - pointX > 0 && y - pointY < 0) {
        option.x = pointX;
        option.y = y;
      } else if (x - pointX < 0 && y - pointY < 0) {
        option.x = x;
        option.y = y;
      } else if (x - pointX < 0 && y - pointY > 0) {
        option.x = x;
        option.y = pointY;
      }
      option.width = Math.abs(x - pointX);
      option.height = Math.abs(y - pointY);
      rect.shape.setX(option.x);
      rect.shape.setY(option.y);
      rect.shape.setWidth(option.width);
      rect.shape.setHeight(option.height);
      rect.layer.draw();
    });
    this.stage.on("contentMouseup", (e) => {
      e.cancelBubble = true;
      if (window.event.stopPropagation) {
        window.event.stopPropagation();
      } else {
        window.event.cancelBubble = true;
      }
      this.canvas.style.cursor = 'default';
      this.stage.off("contentMousedown");
      this.stage.off("contentMousemove");
      this.stage.off("contentMouseup");
      callBack(rect, e);
    })
  };
  // 绘制圆形
  _drawCircle(pointX, pointY, callBack) {
    let option = {
      x: pointX,
      y: pointY,
      radius: 0,
    };
    let circle = new PCircle(option);
    this.addOverlay(circle);
    this.stage.on("contentMousemove", (e) => {
      e.cancelBubble = true;
      if (window.event.stopPropagation) {
        window.event.stopPropagation();
      } else {
        window.event.cancelBubble = true;
      }
      let x = this.stage.getPointerPosition().x;
      let y = this.stage.getPointerPosition().y;
      option.radius = Math.sqrt(Math.pow(x - pointX, 2) + Math.pow(y - pointY, 2));
      circle.shape.setRadius(option.radius);
      circle.layer.draw();
    });
    this.stage.on("contentMouseup", (e) => {
      e.cancelBubble = true;
      if (window.event.stopPropagation) {
        window.event.stopPropagation();
      } else {
        window.event.cancelBubble = true;
      }
      this.canvas.style.cursor = 'default';
      this.stage.off("contentMousedown");
      this.stage.off("contentMousemove");
      this.stage.off("contentMouseup");
      callBack(circle, e);
    })
  };
  // 绘制多边形
  _drawPolygon(callBack) {
    let option = {
      points: [0, 0]
    };
    let points = [];
    option.points.forEach((v) => {
      points.push(v.x);
      points.push(v.y);
    });
    let polygon = new PPolygon(option);
    this.addOverlay(polygon);
    this.stage.on("contentMousedown", (e) => {
      e.cancelBubble = true;
      if (window.event.stopPropagation) {
        window.event.stopPropagation();
      } else {
        window.event.cancelBubble = true;
      }
      let pointX = this.stage.getPointerPosition().x;
      let pointY = this.stage.getPointerPosition().y;
      points.forEach((v, i) => {
        if (i == points.length - 2) {
          points[i] = pointX;
        } else if (i == points.length - 1) {
          points[i] = pointY;
        }
      });
      points.push(pointX);
      points.push(pointY);
      this.stage.on("contentMousemove", (e) => {
        e.cancelBubble = true;
        if (window.event.stopPropagation) {
          window.event.stopPropagation();
        } else {
          window.event.cancelBubble = true;
        }
        let x = this.stage.getPointerPosition().x;
        let y = this.stage.getPointerPosition().y;
        points.forEach((v, i) => {
          if (i == points.length - 2) {
            points[i] = x;
          } else if (i == points.length - 1) {
            points[i] = y;
          }
        });
        polygon.shape.setPoints(points);
        polygon.layer.draw();
      });
      this.stage.on("contentDblclick", (e) => {
        e.cancelBubble = true;
        if (window.event.stopPropagation) {
          window.event.stopPropagation();
        } else {
          window.event.cancelBubble = true;
        }
        this.canvas.style.cursor = 'default';
        this.stage.off("contentMousedown");
        this.stage.off("contentMousemove");
        this.stage.off("contentDblclick");
        setTimeout(() => {
          points.pop();
          points.pop();
          points.pop();
          points.pop();
          polygon.shape.setPoints(points);
          polygon.layer.draw();
          callBack(polygon, e);
        }, 100);
      });
    });
  };
  // 绘制折线
  _drawPolyline(callBack) {
    let option = {
      points: [
        {
          x: -20,
          y: -20
        }
      ]
    };
    let points = [];
    option.points.forEach((v) => {
      points.push(v.x);
      points.push(v.y);
    });
    let polyline = new PPolyline(option);
    this.addOverlay(polyline);
    this.stage.on("contentMousedown", (e) => {
      e.cancelBubble = true;
      if (window.event.stopPropagation) {
        window.event.stopPropagation();
      } else {
        window.event.cancelBubble = true;
      }
      let pointX = this.stage.getPointerPosition().x;
      let pointY = this.stage.getPointerPosition().y;
      points.forEach((v, i) => {
        if (i == points.length - 2) {
          points[i] = pointX;
        } else if (i == points.length - 1) {
          points[i] = pointY;
        }
      });
      points.push(pointX);
      points.push(pointY);
      this.stage.on("contentMousemove", (e) => {
        e.cancelBubble = true;
        if (window.event.stopPropagation) {
          window.event.stopPropagation();
        } else {
          window.event.cancelBubble = true;
        }
        let x = this.stage.getPointerPosition().x;
        let y = this.stage.getPointerPosition().y;
        points.forEach((v, i) => {
          if (i == points.length - 2) {
            points[i] = x;
          } else if (i == points.length - 1) {
            points[i] = y;
          }
        });
        polyline.shape.setPoints(points);
        polyline.layer.draw();
      });
      this.stage.on("contentDblclick", (e) => {
        e.cancelBubble = true;
        if (window.event.stopPropagation) {
          window.event.stopPropagation();
        } else {
          window.event.cancelBubble = true;
        }
        this.canvas.style.cursor = 'default';
        this.stage.off("contentMousedown");
        this.stage.off("contentMousemove");
        this.stage.off("contentDblclick");
        setTimeout(() => {
          points.pop();
          points.pop();
          points.pop();
          points.pop();
          polyline.shape.setPoints(points);
          polyline.layer.draw();
          polyline.updateEditMarker();
          callBack(polyline, e);
        }, 100);
      });
    });
  };
  // 批量清除覆盖物
  clearOverlays() {
    this.overlayMap.forEach((v, k) => {
      if (v.enableMassClear) {
        v.remove();
        this.overlayMap.delete(k);
      }
    });
  };
  // 删除覆盖物
  removeOverlay(overlay) {
    overlay.remove();
  };
  // 获取舞台div信息
  getStageInfo() {
    let x = this.canvas.offsetLeft;
    let y = this.canvas.offsetTop;
    let width = this.canvas.offsetWidth;
    let height = this.canvas.offsetHeight;
    let transform = this.canvas.style.transform;
    let scale = parseFloat(transform.substring(transform.indexOf('(') + 1, transform.indexOf(')'))) || 1;
    return {
      x, y, width, height, scale
    }
  };
  // 覆盖物事件监听
  addEventListener(evType, callBack = function () { }) {
    if (evType === "dragstart") {
      this.canvas.addEventListener("mousedown", (e) => {
        let disX = e.clientX - this.canvas.offsetLeft;
        let disY = e.clientY - this.canvas.offsetTop;
        e.preventDefault();
        this.body.onmousemove = (ev) => {
          ev.preventDefault();
          let x = ev.clientX - disX;
          let y = ev.clientY - disY;
          this.canvas.style.left = x + 'px';
          this.canvas.style.top = y + 'px';
          callBack(ev);
        }
        // 鼠标弹起后停止移动
        this.body.onmouseup = () => {
          this.body.onmousemove = null;
          this.body.onmouseup = null;
        }
      });
    } else {
      this.canvas.addEventListener(evType, e => {
        callBack(e);
      });
    }
  };
}

/**
 * 百度地图扇形工具类
 */
class _SectorUtil {
  // 构造器
  constructor(option, map) {
    this.map = map;
    this.sector = null;
    this.center = new BMap.Point(option.center.lng, option.center.lat) || null;
    this.radius = option.radius || 0;
    this.sDegree = option.sDegree || 0;
    this.eDegree = option.eDegree || 0;
    this.sMarker = null;
    this.eMarker = null;
    this.mMarker = null;
    this.lngConv = 0; //1经度与原点的距离
    this.latConv = 0; //1纬度与原点的距离
    this._initSector();
  };

  // 初始化扇形
  _initSector() {
    this._computeConv(this.center);
    this._setSectorPath(this.center, this.radius, this.sDegree, this.eDegree);
    this._setEditMarker(this._editEventCall.bind(this));
    setTimeout(() => {
      this._hideMarkers();
    }, 10);
  };
  // 计算单位距离
  _computeConv(center) {
    this.lngConv = this.map.getDistance(center, new BMap.Point(center.lng + 1, center.lat)); //计算1经度与原点的距离
    this.latConv = this.map.getDistance(center, new BMap.Point(center.lng, center.lat + 1)); //计算1纬度与原点的距离
  }
  // 设置用于编辑扇形的三个marker
  _setEditMarker(callBack) {
    this.sMarker = this._getEditMarker(this.center, this.radius, "start", this.sDegree, callBack);
    this.eMarker = this._getEditMarker(this.center, this.radius, "end", this.eDegree, callBack);
    this.mMarker = this._getEditMarker(this.center, this.radius, "middle", ((this.eDegree - this.sDegree) / 2 + this.sDegree), callBack);
  };
  // 添加用于编辑扇形的三个marker
  _getEditMarker(center, radius, type, degree, callBack) {
    let point = this._getCurvePoint(center, radius, degree);
    let marker = new BMap.Marker(point, { enableDragging: true, enableMassClear: false });
    let myIcon = new BMap.Icon(require('@/assets/images/map/icon/circle.png'), new BMap.Size(15, 15), {
      imageSize: new BMap.Size(15, 15)
    });
    let eventArray = [
      "click",
      "rightclick",
      "dblclick",
      "mousedown",
      "mouseup",
      "dragstart",
      "dragging",
      "dragend",
    ];
    eventArray.forEach((eventType) => {
      marker.addEventListener(eventType, (e) => {
        callBack(e, type);
      });
    });
    marker.setIcon(myIcon);
    let icon = marker.getIcon();
    marker.setShadow(icon);
    this.map.addOverlay(marker);
    return marker;
  };
  // 隐藏编辑用的三个marker
  _hideMarkers() {
    this.sMarker.hide();
    this.eMarker.hide();
    this.mMarker.hide();
  };
  // 显示编辑用的三个marker
  _showMarkers() {
    this.sMarker.show();
    this.eMarker.show();
    this.mMarker.show();
  };
  // 获取用于绘制扇形的所有点
  _getSectorPoints(center, radius, sDegree, eDegree) {
    let points = []; //创建构成多边形的点数组  
    let step = ((eDegree - sDegree) / 30) || 30; //根据扇形的总夹角确定每步夹角度数，最大为10
    points.push(center);
    for (let i = sDegree; i < eDegree + 0.001; i += step) { //循环获取每步的圆弧上点的坐标，存入点数组 
      points.push(this._getCurvePoint(center, radius, i));
    }
    points.push(center);
    // if(sDegree == eDegree) {}
    return points;
  };
  // 使用数学的方法计算需要画扇形的圆弧上的点坐标
  _getCurvePoint(center, radius, degree) {
    let lat = radius * Math.sin(degree * Math.PI / 180) / this.latConv; //正弦计算待获取的点的纬度与原点纬度差
    let lng = radius * Math.cos(degree * Math.PI / 180) / this.lngConv; //余弦计算待获取的点的经度与原点经度差
    return new BMap.Point(center.lng + lng, center.lat + lat);
  };
  // 绘制扇形
  _setSectorPath(center, radius, sDegree, eDegree) {
    let styleOptions = {
      strokeColor: "#43FBEF",    //边线颜色。
      fillColor: "#43FBEF",      //填充颜色。当参数为空时，圆形将没有填充效果。
      strokeWeight: 1,       //边线的宽度，以像素为单位。
      strokeOpacity: 1,	   //边线透明度，取值范围0 - 1。
      fillOpacity: 0.4,      //填充的透明度，取值范围0 - 1。
      strokeStyle: 'solid', //边线的样式，solid或dashed。
      enableMassClear: false,
      enableEditing: false,
    };
    this.sector = new BMap.Polygon(this._getSectorPoints(center, radius, sDegree, eDegree), styleOptions);
    this.map.addOverlay(this.sector);
  };
  // 修改属性，重绘扇形
  _resetSectorPath(center, radius, sDegree, eDegree) {
    this.sector.setPath(this._getSectorPoints(center, radius, sDegree, eDegree));
    this.sMarker.setPosition(this._getCurvePoint(center, radius, sDegree));
    this.eMarker.setPosition(this._getCurvePoint(center, radius, eDegree));
    this.mMarker.setPosition(this._getCurvePoint(center, radius, ((this.eDegree - this.sDegree) / 2 + this.sDegree)));
  };
  // marker的事件回调
  _editEventCall(e, type) {
    if (type === "start") {
      this._sMarkerEdit(e);
    } else if (type === "end") {
      this._eMarkerEdit(e);
    } else if (type === "middle") {
      this._mMarkerEdit(e);
    }
  };
  // 开始点的编辑事件
  _sMarkerEdit(e) {
    if (e.type === "ondragging") {
      let y = (e.point.lat - this.center.lat) * this.latConv;
      let x = (e.point.lng - this.center.lng) * this.lngConv;
      if (y > 0 && x > 0) {
        this.sDegree = Math.atan(Math.abs(y) / Math.abs(x)) * 180 / Math.PI;
      } else if (y > 0 && x < 0) {
        this.sDegree = 180 - Math.atan(Math.abs(y) / Math.abs(x)) * 180 / Math.PI;
      } else if (y < 0 && x < 0) {
        this.sDegree = 180 + Math.atan(Math.abs(y) / Math.abs(x)) * 180 / Math.PI;
      } else if (y < 0 && x > 0) {
        this.sDegree = 360 - Math.atan(Math.abs(y) / Math.abs(x)) * 180 / Math.PI;
      }
      if (this.sDegree > this.eDegree) {
        this.sDegree = -(360 - this.sDegree);
      }
      this._resetSectorPath(this.center, this.radius, this.sDegree, this.eDegree);
    }
  };
  // 结束点的编辑事件
  _eMarkerEdit(e) {
    if (e.type === "ondragging") {
      let y = (e.point.lat - this.center.lat) * this.latConv;
      let x = (e.point.lng - this.center.lng) * this.lngConv;
      if (y > 0 && x > 0) {
        this.eDegree = Math.atan(Math.abs(y) / Math.abs(x)) * 180 / Math.PI;
      } else if (y > 0 && x < 0) {
        this.eDegree = 180 - Math.atan(Math.abs(y) / Math.abs(x)) * 180 / Math.PI;
      } else if (y < 0 && x < 0) {
        this.eDegree = 180 + Math.atan(Math.abs(y) / Math.abs(x)) * 180 / Math.PI;
      } else if (y < 0 && x > 0) {
        this.eDegree = 360 - Math.atan(Math.abs(y) / Math.abs(x)) * 180 / Math.PI;
      }
      if (this.sDegree > this.eDegree) {
        this.eDegree = 360 + this.eDegree;
      }
      this._resetSectorPath(this.center, this.radius, this.sDegree, this.eDegree);
    }
  };
  // 中间点的编辑事件
  _mMarkerEdit(e) {
    if (e.type === "ondragging") {
      this.radius = this.map.getDistance(this.center, e.point);
      this._resetSectorPath(this.center, this.radius, this.sDegree, this.eDegree);
    }
  };

  // 设置扇形为可编辑状态
  enableEditing() {
    this._showMarkers();
  };
  // 设置扇形为不可编辑状态
  disableEditing() {
    this._hideMarkers();
  };
  // 删除扇形
  deleteSector() {
    this.map.removeOverlay(this.sector);
    this.map.removeOverlay(this.sMarker);
    this.map.removeOverlay(this.eMarker);
    this.map.removeOverlay(this.mMarker);
  };
  hideSector() {
    this._hideMarkers();
    this.sector.hide();
  };
  showSector(isCanEdit) {
    if (isCanEdit === "canEdit") {
      this._showMarkers();
    }
    this.sector.show();
  };
  getSectorInfo() {
    return {
      center: this.center,
      radius: this.radius,
      sDegree: this.sDegree,
      eDegree: this.eDegree
    };
  }
};

/**
 * 地图控件模型类
 */
class MapModel {

  // 构造器
  constructor(data) {
    this.dataMap = new Map();
    this._initData(data);
  };

  // 用js维护一套产生不重复id的机制
  _genModelIndex() {
    let idStr = Date.now().toString(36);
    idStr += Math.random().toString(36).substr(3);
    return idStr;
  };
  // 初始化数据
  _initData(data) {
    data.forEach((item) => {
      let modelIndex = this._genModelIndex();
      item.isEdit = false;
      this.dataMap.set(modelIndex, item);
      this.dataMap.get(modelIndex).modelIndex = modelIndex;
    });
    this.dataMap.forEach((item) => {
      item.parentModelIndex = this._setParentModelIndex(item);
    });
  };
  // 设置元素的父元素modelIndex
  _setParentModelIndex(item) {
    let parentModelIndex = null;
    let parentItem = this.getItemByItemId(item.parentItemId);
    if (parentItem) {
      parentModelIndex = parentItem.modelIndex;
    }
    return parentModelIndex;
  };

  // 更新元素，并返回回调函数通知View
  updateItem(itemId, item, callBack = function () { }) {
    let modelIndex = this.getItemByItemId(itemId).modelIndex;
    this.dataMap.set(modelIndex, item);
    callBack(item, modelIndex);
  };
  // 根据modelIndex获取元素
  getItemByModelIndex(modelIndex) {
    return this.dataMap.get(modelIndex);
  };
  // 根据元素ID获取元素
  getItemByItemId(itemId) {
    let item = null;
    this.dataMap.forEach((v) => {
      if (v.itemId === itemId) {
        item = v;
      }
    });
    return item;
  };
  // 根据元素类型获取元素数组
  getItemsByType(type) {
    let itemArr = [];
    this.dataMap.forEach((item) => {
      if (item.type === type) {
        itemArr.push(item);
      }
    });
    return itemArr;
  };
  // 根据itemId删除元素，并返回回调函数通知View
  deleteItem(itemId, callBack = function () { }) {
    let modelIndex = this.getItemByItemId(itemId).modelIndex;
    this.dataMap.forEach((v, k) => {
      if (k === modelIndex || v.parentModelIndex === modelIndex) {
        this.dataMap.delete(modelIndex);
      }
    });
    callBack(modelIndex);
  };
  // 添加新元素
  addItem(item, callBack = function () { }) {
    let modelIndex = this._genModelIndex();
    item.isEdit = true;
    this.dataMap.set(modelIndex, item);
    this.dataMap.get(modelIndex).modelIndex = modelIndex;
    callBack(item, modelIndex);
  };
  // 清空所有元素，并返回回调函数通知View（是否有需要待定）
  clearItems(callBack = function () { }) {
    this.dataMap.clear();
    callBack();
  };

};

/**
 * 地图控件视图类
 */
class MapView {

  // 构造器
  constructor(mapModel, mapType) {
    this.mapModel = mapModel;
    this.mapType = mapType;
    this.map = null;
    this.itemMap = new Map();
    this._drawingManager = null;
    this._mapItem = null;
    this._navigation = null;
    this._overViewOpen = null;
    this._initMap();
    if (this.mapType === "gis") {
      this._initDrawingManager();
    }
  };

  // 初始化地图
  _initMap() {
    this._mapItem = this.mapModel.getItemsByType("map")[0];
    if (this.mapType === "gis") {
      let mapOption = {
        minZoom: 3,
        maxZoom: 18,
        enableMapClick: false,
      }
      this.map = new BMap.Map(this._mapItem.domId, mapOption);
      this.map.centerAndZoom(new BMap.Point(this._mapItem.startPoint.lng, this._mapItem.startPoint.lat), this._mapItem.scale);
      this.map.enableScrollWheelZoom();
      // this.addMapTypeControl();
      // this.addMapNavigation();
      // this.addOverView();
    } else if (this.mapType === "picture") {
      this.map = new PMap(this._mapItem);
    }
  };
  // 初始化画图工具
  _initDrawingManager() {
    let styleOptions = {
      strokeColor: "#43FBEF",    //边线颜色。
      fillColor: "#25D298",      //填充颜色。当参数为空时，圆形将没有填充效果。
      strokeWeight: 1,       //边线的宽度，以像素为单位。
      strokeOpacity: 1,	   //边线透明度，取值范围0 - 1。
      fillOpacity: 0.4,      //填充的透明度，取值范围0 - 1。
      strokeStyle: 'dashed' //边线的样式，solid或dashed。
    };
    let lineStyleOptions = {
      strokeColor: "#43FBEF",    //边线颜色。
      strokeWeight: 1,       //边线的宽度，以像素为单位。
      strokeOpacity: 1,	   //边线透明度，取值范围0 - 1。
      strokeStyle: 'dashed' //边线的样式，solid或dashed。
    };
    this._drawingManager = new BMapLib.DrawingManager(this.map, {
      isOpen: false, //是否开启绘制模式
      enableDrawingTool: false, //是否显示工具栏
      drawingToolOptions: {
        anchor: BMAP_ANCHOR_TOP_RIGHT, //位置
        offset: new BMap.Size(5, 5), //偏离值
      },
      circleOptions: styleOptions, //圆的样式
      polylineOptions: lineStyleOptions, //线的样式 
      polygonOptions: styleOptions, //多边形的样式
      rectangleOptions: styleOptions //矩形的样式
    });
  };
  // 设置元素
  _setItem(item, modelIndex) {
    item.modelIndex = modelIndex;
    if (item.type === "marker") {
      this._setMarker(item, modelIndex);
    }
    if (item.type === "polyline") {
      this._setPolyline(item, modelIndex);
    }
    if (item.type === "sector") {
      this._setSector(item, modelIndex);
    }
  }
  // 设置点位元素
  _setMarker(markerItem, modelIndex) {
    let marker;
    if (this.mapType === "gis") {
      let pt = new BMap.Point(markerItem.point.lng, markerItem.point.lat);
      let myIcon = new BMap.Icon(markerItem.icon, new BMap.Size(40, 53));
      marker = new BMap.Marker(pt, { icon: myIcon, enableMassClear: false });
      marker.setOffset(new BMap.Size(0, -18));
    } else if (this.mapType === "picture") {
      marker = new PMarker(markerItem);
      marker.disableMassClear();
    }
    let itemViewObj = {
      overlay: marker,
      item: markerItem
    };
    this.itemMap.set(modelIndex, itemViewObj);
    this.map.addOverlay(this.itemMap.get(modelIndex).overlay);
  }
  // 设置折线元素
  _setPolyline(polylineItem, modelIndex) {
    let polyline;
    if (this.mapType === "gis") {
      if (polylineItem.itemInfo.points && polylineItem.itemInfo.points.length !== 0) {
        let bmPointArr = [];
        for (let item of polylineItem.itemInfo.points) {
          bmPointArr.push(
            new BMap.Point(item.lng, item.lat),
          );
        }
        polyline = new BMap.Polyline(bmPointArr, {
          strokeColor: "#777777",
          strokeWeight: 3,
          strokeOpacity: 0.8,
          strokeStyle: 'solid'
        });
        polyline.disableMassClear();
        // polyline.disableEventListen();
      }
    } else if (this.mapType === "picture") {
      polyline = new PPolyline(polylineItem.itemInfo);
      polyline.disableMassClear();
    }
    let itemViewObj = {
      overlay: polyline,
      item: polylineItem
    };
    this.itemMap.set(modelIndex, itemViewObj);
    this.map.addOverlay(this.itemMap.get(modelIndex).overlay);
  };
  // 设置扇形元素
  _setSector(sectorItem, modelIndex) {
    let sector;
    if (this.mapType === "gis") {
      sector = new _SectorUtil(sectorItem.itemInfo, this.map);
    } else if (this.mapType === "picture") {
      sector = new PSector(sectorItem.itemInfo);
      sector.disableMassClear();
      this.map.addOverlay(sector);
    }
    if (!sectorItem.itemInfo || !sectorItem.itemInfo.isShowSector) {
      sector.hideSector();
    } else {
      sector.showSector();
    }
    let itemViewObj = {
      overlay: sector,
      item: sectorItem
    };
    this.itemMap.set(modelIndex, itemViewObj);
  };
  // 为元素注册事件回调
  _setItemEventCallBack(itemViewObj, callBack) {
    let eventArray = [
      "click",
      "dblclick",
      "mouseover",
      "mouseout",
      "mousemove",
      "mousedown",
      "mouseup",
      "dragstart",
      "dragging",
      "dragmove",
      "dragend",
    ];
    if (this.mapType === "gis") {
      eventArray.push("rightclick");
    }
    let callBackInner = (e) => {
      let dataObj = {};
      dataObj.item = itemViewObj.item;
      if (this.mapType === "gis") {
        // e.domEvent.stopPropagation();
        dataObj.eventType = e.type;
        dataObj.x = e.pixel.x;
        dataObj.y = e.pixel.y;
      } else if (this.mapType === "picture") {
        let type = e.type;
        if (window.event.buttons === 2) {
          type = "rightclick";
        }
        dataObj.eventType = "on" + type;
        let layerX = e.evt.layerX;
        let layerY = e.evt.layerY;
        let offset = null;
        if (e.type === "dragend") {
          offset = {
            x: itemViewObj.item.point.x - e.initLayerX,
            y: itemViewObj.item.point.y - e.initLayerY
          };
        } else {
          offset = {
            x: itemViewObj.item.point.x - e.evt.offsetX,
            y: itemViewObj.item.point.y - e.evt.offsetY
          };
        }
        dataObj.offset = offset;
        dataObj.x = layerX + this.map.canvas.offsetLeft;
        dataObj.y = layerY + this.map.canvas.offsetTop;
      }
      callBack(e, dataObj);
    };
    let sectorMarkerCall = (e) => {
      let dataObj = {};
      dataObj.eventType = "sectorDragend";
      dataObj.sectorInfo = itemViewObj.overlay.getSectorInfo();
      dataObj.item = itemViewObj.item;
      callBack(e, dataObj);
    };
    if (itemViewObj.item.type === "sector") {
      itemViewObj.overlay.sMarker.addEventListener("dragend", sectorMarkerCall);
      itemViewObj.overlay.eMarker.addEventListener("dragend", sectorMarkerCall);
      itemViewObj.overlay.mMarker.addEventListener("dragend", sectorMarkerCall);
    } else {
      eventArray.forEach((eventType) => {
        itemViewObj.overlay.addEventListener(eventType, callBackInner);
      });
    }
  };
  // 创建所有元素的公用代码
  _createItemsCommon(callBack) {
    this.mapModel.dataMap.forEach((item, modelIndex) => {
      this._setItem(item, modelIndex);
    });
    this.itemMap.forEach((itemViewObj) => {
      if (this.mapType === "picture" && itemViewObj.item.type === "marker") {
        let timer = setInterval(() => {
          if (itemViewObj.overlay.isLoaded) {
            clearInterval(timer);
            this._setItemEventCallBack(itemViewObj, callBack);
          }
        }, 50);
      } else {
        this._setItemEventCallBack(itemViewObj, callBack);
      }
    });
  }

  // 添加视图切换
  addMapTypeControl() {
    if (this.mapType === "gis") {
      this.map.addControl(
        new BMap.MapTypeControl({
          mapTypes: [BMAP_NORMAL_MAP, BMAP_SATELLITE_MAP, BMAP_HYBRID_MAP],
          anchor: BMAP_ANCHOR_BOTTOM_RIGHT,
          offset: new BMap.Size(10, 30)
        })
      );
    } else if (this.mapType === "picture") {
    }
  };
  // 添加方向盘和缩放比例
  addMapNavigation() {
    if (this.mapType === "gis") {
      this.navigation = new BMap.NavigationControl(
        {
          anchor: BMAP_ANCHOR_TOP_RIGHT,
          offset: new BMap.Size(10, 50),
          type: BMAP_NAVIGATION_CONTROL_SMALL
        }
      );
      this.map.addControl(
        this.navigation
      );
    } else if (this.mapType === "picture") {
    }
  };
  // 删除方向盘和缩放比例
  delMapNavigation() {
    if (this.mapType === "gis") {
      this.map.removeControl(
        this.navigation
      );
    } else if (this.mapType === "picture") {
    }
  };
  // 添加鸟瞰图
  addOverView() {
    if (this.mapType === "gis") {
      this.overViewOpen = new BMap.OverviewMapControl(
        {
          isOpen: true,
          anchor: BMAP_ANCHOR_BOTTOM_RIGHT
        }
      );
      this.map.addControl(
        this.overViewOpen
      );
    } else if (this.mapType === "picture") {
    }
  };
  // 删除鸟瞰图
  delOverView() {
    if (this.mapType === "gis") {
      this.map.removeControl(
        this.overViewOpen
      );
    } else if (this.mapType === "picture") {
    }
  };
  //设置地图样式
  setMapStyleV2() {
    this.map.setMapStyleV2({ styleJson: store.state.home.mapStyle });
  };
  // 设置居中
  setCenter() {
    if (this.mapType === "gis") {
      let point = new BMap.Point(this._mapItem.startPoint.lng, this._mapItem.startPoint.lat);
      this.map.setCenter(point);
    } else if (this.mapType === "picture") {
      this.map.setCenter();
    }
  };
  locationElement(center, panelCenter) {
    if (this.mapType === "gis") {
      let point = new BMap.Point(center.y, center.x);
      this.map.setCenter(point);
    } else if (this.mapType === "picture") {
      let centerPoint = this.pixelToPoint(panelCenter.x, panelCenter.y);
      this.map.setPosition(this.map.getStageInfo().x + (centerPoint.x - center.x) * this.map.getStageInfo().scale, this.map.getStageInfo().y + (centerPoint.y - center.y) * this.map.getStageInfo().scale);
    }
  };
  // 放大地图
  zoomIn() {
    this.map.zoomIn();
  };
  // 缩小地图
  zoomOut() {
    this.map.zoomOut();
  };
  // 框选并返回选中的点位数据
  rectangleSelect(callBack) {
    if (this.mapType === "gis") {
      let itemsArr = [];
      this._drawingManager.setDrawingMode(BMAP_DRAWING_RECTANGLE);
      this._drawingManager.open();
      let rectanglecomplete = (overlay) => {
        let bounds = overlay.getBounds();
        this.itemMap.forEach((itemViewObj) => {
          if (itemViewObj.item.type === "marker") {
            if (bounds.containsPoint(itemViewObj.overlay.getPosition())) {
              itemsArr.push(itemViewObj.item);
            }
          }
        });
        callBack(itemsArr, overlay);
        this._drawingManager.close();
        this._drawingManager.removeEventListener('rectanglecomplete', rectanglecomplete);
      };
      this._drawingManager.addEventListener('rectanglecomplete', rectanglecomplete);
    } else if (this.mapType === "picture") {
      let itemsArr = [];
      this.map.openDrawManger("rect", (rect, e) => {
        this.itemMap.forEach((itemViewObj) => {
          if (itemViewObj.item.type === "marker") {
            if (itemViewObj.item.point.x >= rect.option.x
              && itemViewObj.item.point.x <= rect.option.x + rect.option.width
              && itemViewObj.item.point.y >= rect.option.y
              && itemViewObj.item.point.y <= rect.option.y + rect.option.height) {
              itemsArr.push(itemViewObj.item);
            }
          }
        });
        callBack(itemsArr, rect);
      });
    }
  };
  // 圈选并返回选中的点位数据
  circleSelect(callBack) {
    if (this.mapType === "gis") {
      let itemsArr = [];
      this._drawingManager.setDrawingMode(BMAP_DRAWING_CIRCLE);
      this._drawingManager.open();
      let circlecomplete = (overlay) => {
        this.itemMap.forEach((itemViewObj) => {
          if (itemViewObj.item.type === "marker") {
            if (this.map.getDistance(overlay.getCenter(), itemViewObj.overlay.getPosition()) <= overlay.getRadius()) {
              itemsArr.push(itemViewObj.item);
            }
          }
        });
        callBack(itemsArr, overlay);
        this._drawingManager.close();
        this._drawingManager.removeEventListener('circlecomplete', circlecomplete);
      };
      this._drawingManager.addEventListener('circlecomplete', circlecomplete);
    } else if (this.mapType === "picture") {
      let itemsArr = [];
      this.map.openDrawManger("circle", (circle, e) => {
        this.itemMap.forEach((itemViewObj) => {
          if (itemViewObj.item.type === "marker") {
            if (Math.sqrt(Math.pow(Math.abs(itemViewObj.item.point.x - circle.option.x), 2)
              + Math.pow(Math.abs(itemViewObj.item.point.y - circle.option.y), 2))
              <= circle.option.radius) {
              itemsArr.push(itemViewObj.item);
            }
          }
        });
        callBack(itemsArr, circle);
      });
    }
  };
  // 多边形选并返回选中的点位数据
  polygonSelect(callBack) {
    if (this.mapType === "gis") {
      let itemsArr = [];
      this._drawingManager.setDrawingMode(BMAP_DRAWING_POLYGON);
      this._drawingManager.open();
      let polygoncomplete = (overlay) => {
        let polygonPts = [];
        overlay.getPath().forEach(v => {
          polygonPts.push(v)
        });
        let polygon = new BMap.Polygon(polygonPts);
        this.itemMap.forEach((itemViewObj) => {
          if (itemViewObj.item.type === "marker") {
            if (BMapLib.GeoUtils.isPointInPolygon(itemViewObj.overlay.getPosition(), polygon)) {
              itemsArr.push(itemViewObj.item);
            }
          }
        });
        callBack(itemsArr, overlay);
        this._drawingManager.close();
        this._drawingManager.removeEventListener('polygoncomplete', polygoncomplete);
      };
      this._drawingManager.addEventListener('polygoncomplete', polygoncomplete);
    } else if (this.mapType === "picture") {
      let itemsArr = [];
      this.map.openDrawManger("polygon", (polygon, e) => {
        this.itemMap.forEach((itemViewObj) => {
          if (itemViewObj.item.type === "marker") {
            let poly = [];
            for (let i = 2; i < polygon.shape.attrs.points.length; i = i + 2) {
              poly.push({
                x: polygon.shape.attrs.points[i],
                y: polygon.shape.attrs.points[i + 1]
              });
            }
            if (this._pointInPoly(itemViewObj.item.point, poly)) {
              itemsArr.push(itemViewObj.item);
            }
          }
        });
        callBack(itemsArr, polygon);
      });
    }
  };
  // 判断一个点是否在一个多边形内
  _pointInPoly(pt, poly) {
    for (let c = false, i = -1, l = poly.length, j = l - 1; ++i < l; j = i)
      ((poly[i].y <= pt.y && pt.y < poly[j].y) || (poly[j].y <= pt.y && pt.y < poly[i].y))
        && (pt.x < (poly[j].x - poly[i].x) * (pt.y - poly[i].y) / (poly[j].y - poly[i].y) + poly[i].x)
        && (c = !c);
    return c;
  };
  // 清除覆盖物
  clearOverlays() {
    this.map.clearOverlays();
  };
  // 创建所有元素
  createItems(callBack) {
    if (this.mapType === "gis") {
      this._createItemsCommon(callBack);
    } else if (this.mapType === "picture") {
      let timer = setInterval(() => {
        if (this.map.isLoaded) {
          clearInterval(timer);
          this._createItemsCommon(callBack);
        }
      }, 50);
    }
  };
  // 编辑模式
  setEditState() {
    this.itemMap.forEach((v) => {
      v.item.isEdit = true;
      if (v.item.type === "marker") {
        v.overlay.enableDragging();
      } else if (v.item.type === "polyline") {
        v.overlay.enableEditing();
      } else if (v.item.type === "sector") {
        if (!v.item.itemInfo || !v.item.itemInfo.isShowSector) {
          v.overlay.disableEditing();
        } else {
          v.overlay.enableEditing();
        }
      }
    });
  };
  // 设置单个元素为可编辑模式
  setItemEditState(modelIndex) {
    this.itemMap.forEach((v, k) => {
      if (k === modelIndex) {
        if (v.item.type === "marker") {
          v.overlay.enableDragging();
        } else if (v.item.type === "polyline") {
          v.overlay.enableEditing();
        } else if (v.item.type === "sector") {
          if (!v.item.itemInfo || !v.item.itemInfo.isShowSector) {
            v.overlay.disableEditing();
          } else {
            v.overlay.enableEditing();
          }
        }
      }
    });
  };
  // 退出编辑模式（测试用，正式环境退出编辑后应该直接重新获取数据并重绘地图所有显示）
  quitEditState() {
    this.itemMap.forEach((v) => {
      v.item.isEdit = false;
      if (v.item.type === "marker") {
        v.overlay.disableDragging();
      } else if (v.item.type === "polyline") {
        v.overlay.disableEditing();
      } else if (v.item.type === "sector") {
        v.overlay.disableEditing();
      }
    });
  };
  // 删除元素
  deleteItem(modelIndex) {
    this.itemMap.forEach((v, k) => {
      if (k === modelIndex || v.item.parentModelIndex === modelIndex) {
        if (v.item.type !== "sector" || this.mapType === "picture") {
          this.map.removeOverlay(v.overlay);
        } else {
          v.overlay.deleteSector();
        }
        this.itemMap.delete(modelIndex);
      }
    });
  };
  // 更新元素
  updateItem(item, modelIndex, callBack) {
    this.itemMap.forEach((itemViewObj, k) => {
      if (k === modelIndex) {
        if (itemViewObj.item.type !== "sector" || this.mapType === "picture") {
          this.map.removeOverlay(itemViewObj.overlay);
        } else {
          itemViewObj.overlay.deleteSector();
        }
        this._setItem(item, modelIndex);
        if (this.mapType === "picture" && item.type === "marker") {
          let timer = setInterval(() => {
            if (this.itemMap.get(modelIndex).overlay.isLoaded) {
              this._setItemEventCallBack(this.itemMap.get(modelIndex), callBack);
              clearInterval(timer);
            }
          }, 50);
        } else {
          this._setItemEventCallBack(this.itemMap.get(modelIndex), callBack);
        }
      }
    });
  };
  // 添加新元素
  addItem(item, modelIndex, callBack, isCanEdit = true) {
    this._setItem(item, modelIndex);
    if (this.mapType === "picture" && item.type === "marker") {
      let timer = setInterval(() => {
        if (this.itemMap.get(modelIndex).overlay.isLoaded) {
          this._setItemEventCallBack(this.itemMap.get(modelIndex), callBack);
          let item = this.itemMap.get(modelIndex);
          if (isCanEdit) {
            if (item.item.type === "marker") {
              item.overlay.enableDragging();
            } else {
              item.overlay.enableEditing();
            }
          }
          clearInterval(timer);
        }
      }, 50);
    } else {
      this._setItemEventCallBack(this.itemMap.get(modelIndex), callBack);
      // this.itemMap.get(modelIndex).overlay.enableDragging();
      let item = this.itemMap.get(modelIndex);
      if (isCanEdit) {
        if (item.item.type === "marker") {
          item.overlay.enableDragging();
        } else {
          item.overlay.enableEditing();
        }
      }
    }
    // if (item.secondType === "defanceArea") {
    //   if (this.mapType === "gis") {
    //     this._drawingManager.setDrawingMode(BMAP_DRAWING_POLYLINE);
    //     this._drawingManager.open();
    //     let overlaycomplete = (e) => {
    //       this._drawingManager.close();
    //       if (e.drawingMode === "polyline") {
    //         let childitem = {};
    //         childitem.modelIndex = this.mapModel._genModelIndex();
    //         childitem.points = e.overlay.getPath();
    //         childitem.type = "polyline";
    //         childitem.parentModelIndex = modelIndex;
    //         let itemViewObj = {
    //           overlay: e.overlay,
    //           item: childitem
    //         };
    //         e.overlay.disableMassClear();
    //         this.itemMap.set(childitem.modelIndex, itemViewObj);
    //         this.itemMap.get(childitem.modelIndex).overlay.enableEditing();
    //       }
    //     };
    //     this._drawingManager.addEventListener('overlaycomplete', overlaycomplete);
    //   } else if (this.mapType === "picture") {
    //     this.map.openDrawManger("polyline", (polyline) => {
    //       let childitem = {};
    //       childitem.modelIndex = this.mapModel._genModelIndex();
    //       childitem.points = polyline.shape.getPoints();
    //       childitem.type = "polyline";
    //       childitem.parentModelIndex = modelIndex;
    //       let itemViewObj = {
    //         overlay: polyline,
    //         item: childitem
    //       };
    //       polyline.disableMassClear();
    //       this.itemMap.set(childitem.modelIndex, itemViewObj);
    //       this.itemMap.get(childitem.modelIndex).overlay.enableEditing();
    //     });
    //   }
    // } else if (item.secondType === "videoPoint") {
    //   let childitem = {};
    //   childitem.itemInfo = {};
    //   childitem.itemInfo.center = item.point;
    //   childitem.itemInfo.radius = 120;
    //   childitem.itemInfo.sDegree = 20;
    //   childitem.itemInfo.eDegree = 60;
    //   childitem.modelIndex = this.mapModel._genModelIndex();
    //   childitem.type = "sector";
    //   childitem.parentModelIndex = modelIndex;
    //   let sector;
    //   if (this.mapType === "gis") {
    //     sector = new _SectorUtil(childitem.itemInfo, this.map);
    //   } else if (this.mapType === "picture") {
    //     sector = new PSector(childitem.itemInfo);
    //     this.map.addOverlay(sector);
    //     sector.disableMassClear();
    //   }
    //   let itemViewObj = {
    //     overlay: sector,
    //     item: childitem
    //   };
    //   this.itemMap.set(childitem.modelIndex, itemViewObj);
    //   setTimeout(() => {
    //     this.itemMap.get(childitem.modelIndex).overlay.enableEditing();
    //   }, 20);
    // }
  };
  // 像素转坐标
  pixelToPoint(x, y, offset) {
    let point = null;
    if (this.mapType === "gis") {
      let pixel = new BMap.Pixel(x, y);
      point = this.map.pixelToPoint(pixel);
    } else if (this.mapType === "picture") {
      let stageInfo = this.map.getStageInfo();
      let pointX = (x - (stageInfo.x - (stageInfo.width * stageInfo.scale - stageInfo.width) / 2)) / stageInfo.scale;
      let pointY = (y - (stageInfo.y - (stageInfo.height * stageInfo.scale - stageInfo.height) / 2)) / stageInfo.scale;
      point = {
        x: pointX,
        y: pointY
      };
      if (offset) {
        point.x = point.x + offset.x;
        point.y = point.y + offset.y;
      }
    }
    return point;
  };
  // 坐标转像素
  pointToPixel(point) {
    let pixel = null;
    if (this.mapType === "gis") {
      let pt = new BMap.Point(point.lng, point.lat);
      pixel = this.map.pointToPixel(pt);
    } else {
      let stageInfo = this.map.getStageInfo();
      pixel = {
        x: 0,
        y: 0
      }
      pixel.x = point.x * stageInfo.scale + (stageInfo.x - (stageInfo.width * stageInfo.scale - stageInfo.width) / 2);
      pixel.y = point.y * stageInfo.scale + (stageInfo.y - (stageInfo.height * stageInfo.scale - stageInfo.height) / 2);
    }
    return pixel;
  }
  // 获取地图信息
  getMapInfo() {
    let mapInfo = {};
    if (this.mapType === "gis") {
      mapInfo.lng = this.map.getCenter().lng;
      mapInfo.lat = this.map.getCenter().lat;
      mapInfo.zoom = this.map.getZoom();
    } else if (this.mapType === "picture") {
      mapInfo = this.map.getStageInfo();
    }
    return mapInfo;
  };
  // 外部获取所有item的信息
  getAllItemsData() {
    let itemsData = [];
    if (this.itemMap) {
      this.itemMap.forEach(v => {
        itemsData.push(v.item);
      });
    }
    return itemsData;
  };
  // 外部根据id获取item的信息(含overlay)
  getItemData(itemId) {
    let itemData = null;
    if (this.itemMap) {
      this.itemMap.forEach(v => {
        if (v.item.itemId === itemId) {
          itemData = v;
        }
      });
    }
    return itemData;
  };
  //gis地图测距
  gisDistanceTool(action) {
    if (this.mapType === "picture") {
      return;
    }
    let myDis = new BMapLib.DistanceTool(this.map);
    if (action === "open") {
      myDis.open();
    } else {
      myDis.close();
    }
  };
  // gis地图测面
  gisAreaTool(action) {
    if (this.mapType === "picture") {
      return;
    }
    let measureAreaTool = createMeasureAreaTool(this.map);
    if (action === "open") {
      measureAreaTool.open();
    } else {
      measureAreaTool.close();
    }
  }
  // 点位显示，图层筛选功能
  filterMarker(filterArr) {
    this.itemMap.forEach((v, k) => {
      if (v.item.type === "marker") {
        if (this._filterUtil(v, filterArr)) {
          v.overlay.show();
        } else {
          v.overlay.hide();
        }
      } else if (v.item.type === "sector") {
        this.itemMap.forEach((v2, k2) => {
          if (v.item.parentModelIndex === k2) {
            if (this._filterUtil(v2, filterArr) && v.item.itemInfo.isShowSector) {
              v.overlay.showSector();
            } else {
              v.overlay.hideSector();
            }
          }
        })
      };
    });
  };
  // 图层筛选工具类
  _filterUtil(v, filterArr) {
    let bool = true;
    let typeBool = true;
    let chnBool = true;
    let onlineBool = true;
    let scanBool = true;
    filterArr.forEach((filterVal) => {
      if (v.item.itemWebData.elementSecondType === filterVal.typeStr) {
        if (!filterVal.selected) {
          typeBool = false;
        }
        filterVal.chn.forEach((filterVal2) => {
          if (!filterVal2.selected && v.item.itemWebData.elementThirdType === filterVal2.typeStr) {
            chnBool = false;
          }
        });
        filterVal.onlineStatus.forEach((filterVal2) => {
          if (!filterVal2.selected && v.item.itemWebData.channelInfo.onlineStatus === filterVal2.typeStr) {
            onlineBool = false;
          }
        });
        filterVal.scanCollectionList.forEach((filterVal2) => {
          if (!filterVal2.selected
            && v.item.itemWebData.channelInfo.scanCollectionList
            && v.item.itemWebData.channelInfo.scanCollectionList.some(v2 => v2 === filterVal2.typeStr)) {
            scanBool = false;
          }
        });
      }
    });
    if (typeBool && chnBool && onlineBool && scanBool) {
      bool = true;
    } else {
      bool = false;
    }
    return bool;
  };
  // 根据通道类型筛选点位
  filterByChnType(chnType, isShow, hideItemCallBack = function () { }) {
    let hideitemArr = [];
    this.itemMap.forEach((v, k) => {
      if (v.item.type === "marker") {
        if (v.item.secondType === chnType) {
          isShow ? v.overlay.show() : v.overlay.hide();
          if (!isShow) {
            hideitemArr.push(v.item);
          } else {
            for (let [i, x] of hideitemArr.entries()) {
              if (x.itemId === v.item.itemId) {
                hideitemArr.splice(i, 1);
              }
            }
          }
        }
      } else if (v.item.type === "sector") {
        this.itemMap.forEach((v2, k2) => {
          if (v.item.parentModelIndex === k2) {
            if (v2.item.secondType === chnType) {
              isShow && v.item.itemInfo && v.item.itemInfo.isShowSector ? v.overlay.showSector() : v.overlay.hideSector();
            }
          }
        })
      };
    });
    hideItemCallBack(hideitemArr);
  };
  // 根据摄像机能力集筛选点位
  filterByScanCol(scanColTypeArr, hideItemCallBack = function () { }) {
    let hideitemArr = [];
    this.itemMap.forEach((v, k) => {
      if (v.item.secondType === "vc" && v.item.itemWebData && v.item.itemWebData.channelInfo && v.item.itemWebData.channelInfo.hasOwnProperty("scanCollectionList")) {
        if (v.item.itemWebData.channelInfo.scanCollectionList && v.item.itemWebData.channelInfo.scanCollectionList.length !== 0) {
          let flag = false;
          scanColTypeArr.forEach(x => {
            v.item.itemWebData.channelInfo.scanCollectionList.some(y => y === x) ? flag = true : "";
          });
          flag ? v.overlay.show() : v.overlay.hide();
          this.itemMap.forEach((v2, k2) => {
            if (v2.item.type === "sector" && v2.item.parentModelIndex === k) {
              flag && v2.item.itemInfo && v2.item.itemInfo.isShowSector ? v2.overlay.showSector() : v2.overlay.hideSector();
            }
          });
          if (!flag) {
            hideitemArr.push(v.item);
          } else {
            for (let [i, x] of hideitemArr.entries()) {
              if (x.itemId === v.item.itemId) {
                hideitemArr.splice(i, 1);
              }
            }
          }
        } else {
          scanColTypeArr.some(y => y === "normalSnap") ? v.overlay.show() : v.overlay.hide();
        }
      };
    });
    hideItemCallBack(hideitemArr);
  };
  // 显示所有点位
  showAll(callBack) {
    this.itemMap.forEach((v, k) => {
      if (v.item.type === "sector" && v.item.itemInfo && v.item.itemInfo.isShowSector) {
        v.overlay.showSector();
      } else {
        v.overlay.show();
      }
    });
    callBack("allShow");
  };
  // 隐藏所有点位
  hideAll(callBack) {
    this.itemMap.forEach((v, k) => {
      if (v.item.type === "sector") {
        v.overlay.hideSector();
      } else {
        v.overlay.hide();
      }
    });
    callBack("allHide");
  };
  setPlaceBoundStyle(placeName) {
    let areaBorderJson = store.state.home.areaMapBorder;
    if (!areaBorderJson) {
      return;
    }
    areaBorderJson.features.forEach(v => {
      if (v.properties.name === placeName) {
        let points = [];
        v.geometry.coordinates[v.geometry.coordinates.length - 1].forEach(x => {
          let ptTempArr = Vue.prototype.$coordtransform.gcj02tobd09(
            Vue.prototype.$coordtransform.wgs84togcj02(x[0], x[1])[0],
            Vue.prototype.$coordtransform.wgs84togcj02(x[0], x[1])[1]
          )
          points.push(new BMap.Point(ptTempArr[0], ptTempArr[1]));
        });
        let ply = new BMap.Polygon(points, {
          strokeColor: "#1FBEB3",    //边线颜色。
          fillColor: "#1FBEB3",      //填充颜色。当参数为空时，圆形将没有填充效果。
          strokeWeight: 1,       //边线的宽度，以像素为单位。
          strokeOpacity: 1,	   //边线透明度，取值范围0 - 1。
          fillOpacity: 0.3,      //填充的透明度，取值范围0 - 1。
          strokeStyle: 'solid', //边线的样式，solid或dashed。
          enableMassClear: false,
          enableEditing: false,
        }); //建立多边形覆盖物
        this.map.addOverlay(ply);  //添加覆盖物
        // this.map.setViewport(ply.getPath());    //调整视野  
      }
    });
  };
  // 设置下级平台区域边界
  setAreaBlockStyle(areaData, callBack, plyCallBack) {
    if (!areaData) {
      return;
    }
    if (areaData.areaBoundPoints) {
      let points = [];
      areaData.areaBoundPoints.forEach(v => {
        points.push(new BMap.Point(v.lng, v.lat));
      });
      let ply = new BMap.Polygon(points, {
        strokeColor: "#3ADED4",    //边线颜色。
        fillColor: "#2FFAEE",      //填充颜色。当参数为空时，圆形将没有填充效果。
        strokeWeight: 1,       //边线的宽度，以像素为单位。
        strokeOpacity: 1,	   //边线透明度，取值范围0 - 1。
        fillOpacity: 0.3,      //填充的透明度，取值范围0 - 1。
        strokeStyle: 'solid', //边线的样式，solid或dashed。
        enableMassClear: false,
        enableEditing: false,
      }); //建立多边形覆盖物
      this.map.addOverlay(ply);  //添加覆盖物
      ply.hide();
      plyCallBack(ply);
      ply.addEventListener("click", (e) => {
        e.domEvent.stopPropagation();
        callBack(areaData, this.pointToPixel(ply.getBounds().getCenter()), ply);
      });
    }
  }
};

export {
  MapModel,
  MapView,
};