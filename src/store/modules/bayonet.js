import { Storage } from "@/utils/Storage";
const bayonet = {
    state: {
        BayonetShootArr:[]
    },
    mutations: {
        'SET_BAYONET_SHOOT_ARR':(state,BayonetShootArr)=>{
            state.BayonetShootArr = BayonetShootArr;
            Storage.saveSession('BayonetShootArr',BayonetShootArr);
        },
    },
    getters: {
        'GET_BAYONET_SHOOT_ARR':(state)=>{
            return state.BayonetShootArr;
        }
    },
    actions: {
        'setBayonetShootArr': ({ commit},BayonetShootArr)=>{
            commit('SET_BAYONET_SHOOT_ARR',BayonetShootArr);
        }
    }
}

export default bayonet;
