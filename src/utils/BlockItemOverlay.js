import Vue from 'vue';
function ItemOverlay(point, option) {
  this._point = point;
  this._option = option;
}
ItemOverlay.prototype.init=()=>{
  ItemOverlay.prototype = new BMap.Overlay();
}
ItemOverlay.prototype.initialize = function (map) {
  this._map = map;
  var div = this._div = document.createElement("div");
  div.style.position = "absolute";
  div.style.zIndex = BMap.Overlay.getZIndex(this._point.lat);
  div.style.background = "#25292d";
  div.style.borderRadius = "2px";
  div.style.cursor = "pointer";
  div.style.width = "110px";
  div.style.height = "130px";
  div.style.padding = "10px";
  div.style.boxSizing = "border-box";
  var img = this._img = document.createElement("img");
  img.style.width = "90px";
  img.style.height = "90px";
  img.src = Vue.prototype.$common.setPictureShow(this._option.faceCapturePhotoUrl, 'facelog');
  var text = this._text = document.createElement("div");
  text.style.position = "absolute";
  text.style.width = "90px";
  text.style.textAlign = "center";
  text.style.marginTop = "3px";
  text.style.fontFamily = "PingFangSC-Regular";
  text.style.fontSize = "10px";
  text.style.color = "#dddddd";
  text.style.letterSpacing = "0";
  text.style.whiteSpace = "nowrap";
  text.style.textOverflow = "ellipsis";
  text.style.overflow = "hidden";
  text.innerHTML = this._option.channelName;
  div.appendChild(img);
  div.appendChild(text);
  map.getPanes().markerPane.appendChild(div);
  return div;
};
ItemOverlay.prototype.draw = function () {
  var position = this._map.pointToOverlayPixel(this._point);
  this._div.style.left = position.x - 55 + "px";
  this._div.style.top = position.y - 200 + "px";
};
ItemOverlay.prototype.addEventListener = function(event, fun) {
  this._div['on'+event] = fun;
}
export {
  ItemOverlay
};