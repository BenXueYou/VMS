
import Vue from 'vue';
import Vuex from 'vuex';

import {
  getWebRtcSocketIPAddress,
  getTaskList,
  getRTSPAddress,
  getPhotoList,
  getCompareList,
  getShootPhotoCount,
  getCompareCount,
  getStaticHourCount,
  getShootPhotosForStaffUuid,
  getFaceLibs,
  getMBodyRecordList,
  getTaskLibsList,
  compareTwoFacePhoto,
  getDeviceList,
  getRecongizeList,
  getBodyDeviceList,
  tempCtrlTask,
  photoRecordToAnalysis,
  getBobyRecList,
  getBobyRecNum,
  getCompareRecList
} from './api';

Vue.use(Vuex);

console.log('window.config.ip:', window.config.ip);

const store = new Vuex.Store({

  state: {
    vlcObj: '<embed type="application/x-vlc-plugin" pluginspage="http://www.videolan.org" id="vlc" controls="false" width="100%" height="calc(100% - 20px)" wmode="transparent" style="margin-top:15px;height:calc(100% - 20px);width:calc(100% - 0px);" branding="false"></embed>;',
    loading: true,
    api: 'http://' + window.config.ip,
    socketIP: window.config.socketIP,
    token: window.config.token,
    taskList: [],
    deviceList: [],
    checkedHMRtspUrl: '',
    checkedMBRtspUrl: '',
    checkedChannel: '',
    checkedMBChannel: '',
    photoUri: "",
    carPhotoUri: ""
  },
  getters: {

    getTasks: (state) => {
      return state.taskList;
    },
    getDeviceList: (state) => {
      return state.deviceList;
    },
    getCheckedChannel: (state) => {
      return state.checkedChannel;
    },
    getCheckedMBChannel: (state) => {
      return state.checkedMBChannel;
    },
    getCheckedHMRtspUrl: (state) => {
      return state.checkedHMRtspUrl;
    },
    getCheckedMBRtspUrl: (state) => {
      return state.checkedMBRtspUrl;
    },
  },

  mutations: {
    setTasks(state, taskList) {
      state.taskList = taskList;
    },
    setDeviceList(state, deviceList) {
      state.deviceList = deviceList;
    },
    setCheckedHMRtspUrl(state, checkedHMRtspUrl) {
      state.checkedHMRtspUrl = checkedHMRtspUrl;
    },
    setCheckedMBRtspUrl(state, checkedMBRtspUrl) {
      state.checkedMBRtspUrl = checkedMBRtspUrl;
    },
    setCheckedChannel(state, checkedChannel) {
      state.checkedChannel = checkedChannel;
    },
    setCheckedMBChannel(state, checkedMBChannel) {
      state.checkedMBChannel = checkedMBChannel;
    },
    SET_PHOTO_URI(state, photoUri) {
      state.photoUri = photoUri;
    },
    SET_CAR_PHOTO_URI(state, carPhotoUri) {
      state.carPhotoUri = carPhotoUri;
    }
  },
  actions: {
    // 当天人体分析次数
    getBobyRecNum(context, payload) {
      return new Promise(
        (resolve, reject) => {
          getBobyRecNum(payload).then((res) => {
            resolve(res.data);
          }).catch(function (err) {
            console.log(err);
            resolve(false);
          });
        }
      );
    },
    // 人体分析查询
    getBobyRecList(context, payload) {
      return new Promise(
        (resolve, reject) => {
          getBobyRecList(payload).then((res) => {
            resolve(res.data);
          }).catch(function (err) {
            console.log(err);
            resolve(false);
          });
        }
      );
    },
    // 是否关联到同行人分析
    photoRecordToAnalysis(context, payload) {
      return new Promise(
        (resolve, reject) => {
          photoRecordToAnalysis(payload).then((res) => {
            resolve(res.data);
          }).catch(function (err) {
            console.log(err);
            resolve(false);
          });
        }
      );
    },

    // 临时布控 tempCtrlTask
    tempCtrlTask(context, payload) {
      return new Promise(
        (resolve, reject) => {
          tempCtrlTask(payload).then((res) => {
            resolve(res.data);
          }).catch(function (err) {
            console.log(err);
            resolve(false);
          });
        }
      );
    },
    // 获取设备列表
    getDeviceList(context, payload) {
      return new Promise(
        (resolve, reject) => {
          getDeviceList(payload).then((res) => {
            resolve(res.data);
          }).catch(function (err) {
            console.log(err);
            resolve(false);
          });
        }
      );
    },
    // 获取设备列表
    getBodyDeviceList(context, payload) {
      return new Promise(
        (resolve, reject) => {
          getBodyDeviceList(payload).then((res) => {
            resolve(res.data);
          }).catch(function (err) {
            console.log(err);
            resolve(false);
          });
        }
      );
    },

    // 任务列表初始化
    getTaskList(context, payload) {
      return new Promise(
        (resolve, reject) => {
          getTaskList(payload).then((res) => {
            resolve(res.data);
          }).catch(function (err) {
            console.log(err);
            resolve(false);
          });
        }
      );
    },
    // webRtc IP
    getWebRtcSocketIPAddress(context, payload) {
      return new Promise((resolve, reject) => {
        getWebRtcSocketIPAddress(payload).then((res) => {
          resolve(res.data);
        }).catch(function (err) {
          console.log(err);
          resolve(false);
        });
      });
    },
    // 批量获取码流地址
    getRTSPAddress(context, payload) {
      return new Promise((resolve, reject) => {
        getRTSPAddress(payload).then((res) => {
          resolve(res.data);
        }).catch((err) => {
          console.log(err);
          resolve(false);
        });
      });
    },
    // 获取抓拍记录
    getPhotoList(context, payload) {
      return new Promise((resolve, reject) => {
        getPhotoList(payload).then((res) => {
          resolve(res.data);
        }).catch((err) => {
          console.log(err);
          resolve(false);
        });
      });
    },
    // 根据任务过滤任务的识别记录list
    getRecongizeList(context, payload) {
      return new Promise((resolve, reject) => {
        getRecongizeList(payload).then((res) => {
          resolve(res.data);
        }).catch((err) => {
          console.log(err);
          resolve(false);
        });
      });
    },
    // getCompareRecList
    getCompareRecList(context, payload) {
      return new Promise((resolve, reject) => {
        getCompareRecList(payload).then((res) => {
          resolve(res.data);
        }).catch((err) => {
          console.log(err);
          resolve(false);
        });
      });
    },
    // 获取抓拍记录
    getCompareList(context, payload) {
      return new Promise((resolve, reject) => {
        getCompareList(payload).then((res) => {
          resolve(res.data);
        }).catch((err) => {
          console.log(err);
          resolve(false);
        });
      });
    },
    // 获取今日抓拍次数
    getShootPhotoCount(context, payload) {
      return new Promise((resolve, reject) => {
        getShootPhotoCount(payload).then((res) => {
          resolve(res.data);
        }).catch((err) => {
          console.log(err);
          resolve(false);
        });
      });
    },
    // 获取今日对比记录
    getCompareCount(context, payload) {
      return new Promise((resolve, reject) => {
        getCompareCount(payload).then((res) => {
          resolve(res.data);
        }).catch((err) => {
          console.log(err);
          resolve(false);
        });
      });
    },
    // 获取今日整点时分抓拍次数
    getStaticHourCount(context, payload) {
      return new Promise((resolve, reject) => {
        getStaticHourCount(payload).then((res) => {
          resolve(res.data);
        }).catch((err) => {
          console.log(err);
          resolve(false);
        });
      });
    },
    // 根据stafffUuid获取抓拍记录
    getShootPhotosForStaffUuid(context, payload) {
      return new Promise((resolve, reject) => {
        getShootPhotosForStaffUuid(payload).then((res) => {
          resolve(res.data);
        }).catch((err) => {
          console.log(err);
          resolve(false);
        });
      });
    },
    // 获取人脸库列表
    getFaceLibs(context, payload) {
      return new Promise((resolve, reject) => {
        getFaceLibs(payload).then((res) => {
          resolve(res.data);
        }).catch((err) => {
          console.log(err);
          resolve(false);
        });
      });
    },

    // 获取人体查询列表
    getMBodyRecordList(context, payload) {
      return new Promise((resolve, reject) => {
        getMBodyRecordList(payload).then((res) => {
          resolve(res.data);
        }).catch((err) => {
          console.log(err);
          resolve(false);
        });
      });
    },

    // 获取任务以及关联的库的列表
    getTaskLibsList(context, payload) {
      return new Promise((resolve, reject) => {
        getTaskLibsList(payload).then((res) => {
          resolve(res.data);
        }).catch((err) => {
          console.log(err);
          resolve(false);
        });
      });
    },
    // 上传两张人脸图片，比较相似度
    compareTwoFacePhoto(context, payload) {
      return new Promise((resolve, reject) => {
        compareTwoFacePhoto(payload).then((res) => {
          resolve(res.data);
        }).catch((err) => {
          console.log(err);
          resolve(false);
        });
      });
    },
    setPhotoUri({
      commit
    }, photoUri) {
      commit('SET_PHOTO_URI', photoUri);
    },
    setCarPhotoUri({
      commit
    }, carPhotoUri) {
      commit('SET_CAR_PHOTO_URI', carPhotoUri);
    },
  }
});

export default store;
