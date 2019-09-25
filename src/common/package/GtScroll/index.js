import GtScroll from "./src/scroll.vue";

GtScroll.install = function(Vue) {
  Vue.component(GtScroll.name, GtScroll);
};

export default GtScroll;
