import Vue from "vue";
import Main from "./main.vue";

let ContextMenuDom = Vue.extend(Main);
let isNotFirst = false;
let contextmenu = null;
const ContextMenu = function(options) {
  options.isshow = true;
  if (isNotFirst) {
    contextmenu.isshow = true;
    contextmenu.$data.data = options.data;
    Object.assign(contextmenu, options);
    setTimeout(() => {
      contextmenu.initDom();
    }, 0);
  } else {
    contextmenu = new ContextMenuDom({
      el: document.createElement("div"),
      data: options
    });
    // if(options.target){
    //   options.target.appendChild(contextmenu.$el);
    // }else{

    // }
    isNotFirst = true;
  }
  if (options.dom) {
    contextmenu.$mount(options.dom);
    options.dom.appendChild(contextmenu.$el);
  } else {
    contextmenu.$mount(document.body);
    document.body.appendChild(contextmenu.$el);
  }
};

export default ContextMenu;
