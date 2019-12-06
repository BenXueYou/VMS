import Vue from 'vue'
import Main from './main.vue'

let ContextMenuDom = Vue.extend(Main);
let isfirst = false;
let contextmenu = null;
const ContextMenu = function (options) {

  options.isshow = true;
  if (isfirst) {
    contextmenu.isshow = true;
    Object.assign(contextmenu, options);
    setTimeout(() => {
      contextmenu.initDom();
    }, 0);
  } else {
    contextmenu = new ContextMenuDom({
      el: document.createElement("div"),
      data: options
    });
    document.body.appendChild(contextmenu.$el);
    isfirst = true;
  }
}

export default ContextMenu;
