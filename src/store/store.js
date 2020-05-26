import Vue from "vue";
import Vuex from "vuex";

import home from "./modules/home";
import equipment from "./modules/equipment";
import video from "./modules/video.js";
import resident from "./modules/resident";
import auth from "./modules/authority";
import bayonet from './modules/bayonet';

Vue.use(Vuex);

const store = new Vuex.Store({
  modules: {
    home,
    equipment,
    resident,
    video,
    bayonet,
    auth
  }
});

export default store;
