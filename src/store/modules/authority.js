// import Cookies from 'js-cookie'
import { Storage } from "@/utils/Storage";

const auth = {
    state: {
        AuthList: Storage.readSession("AuthList") || []
    },
    mutations: {
        SET_AUTH_LIST: (state, AuthList) => {
            state.AuthList = AuthList;
            Storage.saveSession("AuthList", AuthList);
        }
    },
    getters: {
        getAUthList(state) {
            return state.AuthList;
        }
    },
    actions: {
        setAuthList({ commit }, AuthList) {
            commit("SET_AUTH_LIST", AuthList);
        },
    }
};

export default auth;
