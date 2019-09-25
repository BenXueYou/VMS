import axios from '@/utils/Request';
import RestApi from '@/utils/RestApi';

/**
 * 统一处理成功回应
 */
function handleSuccessResponse(holder, data) {
  var response = {
    body: data
  };
  holder.onResult(true, response);
}

/**
 * 统一处理失败回应
 */
function handleFailResponse(holder, xhr, textStatus, errorThrown) {
  var data = {
    xhr: xhr,
    textStatus: textStatus,
    error: errorThrown
  };
  holder.onResult(false, data);
}

// let ip = "192.168.9.161:9240";
let ip = window.config.ip;

export var RequestHelper = {

  /**
   * 人脸频率分析
   */
  getCarFellowList(holder) {
    let api = `http://${ip}${RestApi.api.carFellow.getCarFellowList}`;
    let params = {
      staffuuid: holder.staffuuid,
    };
    if (holder.channelList) {
      params.channelList = holder.channelList;
    }
    if (holder.startTime) {
      params.startTime = holder.startTime;
    }
    if (holder.endTime) {
      params.endTime = holder.endTime;
    }
    axios.get(api, { params: params }).then(success => {
      handleSuccessResponse(holder, success.data);
    }).catch(error => {
      handleFailResponse(holder, error);
    });
  },
  getCarFellowListDetails(holder) {
    let api = `http://${ip}${RestApi.api.carFellow.getCarFellowListDetails(holder.vehicleuuid)}`;
    let params = {
      size: holder.size,
    };
    axios.get(api, { params: params }).then(success => {
      handleSuccessResponse(holder, success.data);
    }).catch(error => {
      handleFailResponse(holder, error);
    });
  },
};
function install(Vue) {
  Vue.prototype.$carFellowRequest = RequestHelper;
};
export default install;
