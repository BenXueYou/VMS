// import Cookies from 'js-cookie'
import { Storage } from "@/utils/Storage";

const auth = {
    state: {
        AuthList: Storage.readSession("AuthList") || [],
        OperateModuleList: Storage.readSession("AuthList") || [],
        SetModuleList: Storage.readSession("AuthList") || [],
    },
    mutations: {
        SET_AUTH_LIST: (state, AuthList) => {
            state.AuthList = AuthList;
            Storage.saveSession("AuthList", AuthList);
        },
        SET_MODULE_LIST: (state, SetModuleList) => {
            state.SetModuleList = SetModuleList;
            Storage.saveSession("SetModuleList", SetModuleList);
        },
        OPERATE_MODULE_LIST: (state, OperateModuleList) => {
            state.OperateModuleList = OperateModuleList;
            Storage.saveSession("OperateModuleList", OperateModuleList);
        },
    },
    getters: {
        getAuthList(state) {
            return state.AuthList;
        },
        getSetModuleList(state) {
            return state.SetModuleList;
        },
        getOperateModuleList(state) {
            return state.OperateModuleList;
        }
    },
    actions: {
        setAuthList({ commit }, AuthList) {
            commit("SET_AUTH_LIST", AuthList);
        },
        setSetModuleList({ commit }, SetModuleList) {
            commit("SET_MODULE_LIST", SetModuleList);
        },
        setOperateModuleList({ commit }, OperateModuleList) {
            commit("OPERATE_MODULE_LIST", OperateModuleList);
        },
    }
};

export default auth;
