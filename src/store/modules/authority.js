// import Cookies from 'js-cookie'
import { Storage } from "@/utils/Storage";

const auth = {
    state: {
        AuthList: Storage.readSession("authList") || []
    },
    mutations: {
        SET_AUTH_LIST: (state, authList) => {
            state.authList = authList;
            // Cookies.set('localTag', localTag);
            Storage.saveSession("authList", authList);
        }
    },
    actions: {
        setAuthList({ commit }, AuthList) {
            commit("SET_AUTH_LIST", AuthList);
        },
    }
};

export default auth;
