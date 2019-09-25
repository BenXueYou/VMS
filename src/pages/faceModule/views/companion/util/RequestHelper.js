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
   * 同行人分析列表
   */
  getCompanionList(holder) {
    let api = `http://${ip}${RestApi.api.companion.getCompanionList}`;
    let data = {
      staffuuid: holder.staffuuid,
    };
    if (holder.channelUuids) {
      data.channelUuids = holder.channelUuids;
    }
    if (holder.startTime) {
      data.startTime = holder.startTime;
    }
    if (holder.endTime) {
      data.endTime = holder.endTime;
    }
    // 抓拍间隔
    if (holder.storInterVal) {
      data.storInterVal = holder.storInterVal;
    }
    // 同行次数不小于
    if (holder.inHarns) {
      data.inHarns = holder.inHarns;
    }
    // 共同出现的摄像头个数不小于
    if (holder.channels) {
      data.channels = holder.channels;
    }
    axios.post(api, data).then(success => {
      handleSuccessResponse(holder, success.data);
    }).catch(error => {
      handleFailResponse(holder, error);
    });
  },
};

function install(Vue) {
  Vue.prototype.$companionRequest = RequestHelper;
};

export default install;
