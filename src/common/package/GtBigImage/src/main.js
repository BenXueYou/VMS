import Vue from "vue";
import Main from "./main.vue";

let MaskDom = Vue.extend(Main);

export default {
  bind(el, binding, vnode) {
    el.style.cursor = "pointer";

    function showimage() {
      let src = el.getAttribute("src");
      const mask = new MaskDom({
        el: document.createElement("div"),
        data: {
          src: src,
          isshow: false
        }
      });
      document.body.appendChild(mask.$el);
      console.log(mask);
    }

    el.__vueclickHander = showimage;
    el.addEventListener("click", el.__vueclickHander);
  },
  inserted() {
    console.log("inserted");
  },
  update() {
    console.log("update");
  },
  componentUpdate() {
    console.log("componentUpdate");
  },
  unbind(el) {
    el.removeEventListener("click", el.__vueclickHander);
  }
};
