import GtTree from "./GtTree/index.js";
import GtBigImage from "./GtBigImage/index.js";
import GtButton from "./GtButton/index.js";
import GtLoading from "./GtLoading/index.js";
import GtScroll from "./GtScroll/index.js";
import GtContextMenu from "./GtContextMenu/index.js";

import "./index.scss";

const components = [GtTree, GtLoading, GtButton, GtScroll];

const install = function (Vue, opts = {}) {
  components.forEach(component => {
    Vue.component(component.name, component);
  });

  Vue.use(GtBigImage);

  Vue.prototype.$ContextMenu = GtContextMenu; //右键菜单
};

export default {
  install
};
