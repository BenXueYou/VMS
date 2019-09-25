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
   * 人脸抓拍统计（日）
   */
  getFaceCaptureSumByDay(holder) {
    let api = `http://${ip}${RestApi.api.statisticalForms.getFaceCaptureSumByDay}`;
    let params = {
      sort: holder.sort,
      date: holder.date
    };
    if (holder.flowrate) {
      params.flowrate = holder.flowrate;
    }
    if (holder.quality) {
      params.quality = holder.quality;
    }
    axios.get(api, { params: params }).then(success => {
      handleSuccessResponse(holder, success.data);
    }).catch(error => {
      handleFailResponse(holder, error);
    });
  },
  /**
   * 人脸抓拍统计（月）
   */
  getFaceCaptureSumByMonth(holder) {
    let api = `http://${ip}${RestApi.api.statisticalForms.getFaceCaptureSumByMonth}`;
    let params = {
      sort: holder.sort,
      date: holder.date
    };
    if (holder.flowrate) {
      params.flowrate = holder.flowrate;
    }
    if (holder.quality) {
      params.quality = holder.quality;
    }
    axios.get(api, { params: params }).then(success => {
      handleSuccessResponse(holder, success.data);
    }).catch(error => {
      handleFailResponse(holder, error);
    });
  },
  /**
   * 人脸比对统计（日）
   */
  getFaceCompareSumByDay(holder) {
    let api = `http://${ip}${RestApi.api.statisticalForms.getFaceCompareSumByDay}`;
    let params = {
      sort: holder.sort,
      date: holder.date
    };
    axios.get(api, { params: params }).then(success => {
      handleSuccessResponse(holder, success.data);
    }).catch(error => {
      handleFailResponse(holder, error);
    });
  },
  /**
   * 人脸比对统计（月）
   */
  getFaceCompareSumByMonth(holder) {
    let api = `http://${ip}${RestApi.api.statisticalForms.getFaceCompareSumByMonth}`;
    let params = {
      sort: holder.sort,
      date: holder.date
    };
    axios.get(api, { params: params }).then(success => {
      handleSuccessResponse(holder, success.data);
    }).catch(error => {
      handleFailResponse(holder, error);
    });
  },
  /**
   * 获取设备名称
   */
  getSingleDeviceName(holder) {
    let api = `http://${ip}${RestApi.api.statisticalForms.getSingleDeviceName}`;
    let data = ["face_ipc"];
    axios.post(api, data).then(success => {
      handleSuccessResponse(holder, success.data);
    }).catch(error => {
      handleFailResponse(holder, error);
    });
  },
  /**
   * 单路摄像机抓拍统计（日）
   */
  getSingleFaceCapSumByDay(holder) {
    let api = `http://${ip}${RestApi.api.statisticalForms.getSingleFaceCapSumByDay}`;
    let params = {
      date: holder.date
    };
    if (holder.devname) {
      params.devname = holder.devname;
    }
    if (holder.quality) {
      params.quality = holder.quality;
    }
    axios.get(api, { params: params }).then(success => {
      handleSuccessResponse(holder, success.data);
    }).catch(error => {
      handleFailResponse(holder, error);
    });
  },
  /**
   * 单路摄像机抓拍统计（月）
   */
  getSingleFaceCapSumByMonth(holder) {
    let api = `http://${ip}${RestApi.api.statisticalForms.getSingleFaceCapSumByMonth}`;
    let params = {
      date: holder.date
    };
    if (holder.devname) {
      params.devname = holder.devname;
    }
    if (holder.quality) {
      params.quality = holder.quality;
    }
    axios.get(api, { params: params }).then(success => {
      handleSuccessResponse(holder, success.data);
    }).catch(error => {
      handleFailResponse(holder, error);
    });
  },
  /**
   * 获取布控任务列表
   */
  getSingleMissionName(holder) {
    let api = `http://${ip}${RestApi.api.statisticalForms.getSingleMissionName}`;
    axios.get(api).then(success => {
      handleSuccessResponse(holder, success.data);
    }).catch(error => {
      handleFailResponse(holder, error);
    });
  },
  /**
   * 单路布控任务比对分析（日）
   */
  getSingleMissionSumByDay(holder) {
    let api = `http://${ip}${RestApi.api.statisticalForms.getSingleMissionSumByDay}`;
    let params = {
      date: holder.date
    };
    if (holder.taskUuid) {
      params.taskUuid = holder.taskUuid;
    }
    axios.get(api, { params: params }).then(success => {
      handleSuccessResponse(holder, success.data);
    }).catch(error => {
      handleFailResponse(holder, error);
    });
  },
  /**
   * 单路布控任务比对分析（月）
   */
  getSingleMissionSumByMonth(holder) {
    let api = `http://${ip}${RestApi.api.statisticalForms.getSingleMissionSumByMonth}`;
    let params = {
      date: holder.date
    };
    if (holder.taskUuid) {
      params.taskUuid = holder.taskUuid;
    }
    axios.get(api, { params: params }).then(success => {
      handleSuccessResponse(holder, success.data);
    }).catch(error => {
      handleFailResponse(holder, error);
    });
  },
  /**
   * 人脸频率分析
   */
  getFaceAnalysisTable(holder) {
    let api = `http://${ip}${RestApi.api.statisticalForms.getFaceAnalysisTable}`;
    let params = {
      starttime: holder.starttime,
      overtime: holder.overtime,
      currentPage: holder.currentPage,
      pageSize: holder.pageSize
    };
    if (holder.devname) {
      params.devname = holder.devname;
    }
    if (holder.condition) {
      params.condition = holder.condition;
    }
    if (holder.num) {
      params.num = holder.num;
    }
    axios.get(api, { params: params }).then(success => {
      handleSuccessResponse(holder, success.data);
    }).catch(error => {
      handleFailResponse(holder, error);
    });
  },
  /**
   * 人脸频率分析详情
   */
  getFaceAnalysisDetail(holder) {
    let api = `http://${ip}${RestApi.api.statisticalForms.getFaceAnalysisDetail}`;
    let params = {};
    if (holder.channelNameList) {
      params.channelNameList = holder.channelNameList;
    }
    if (holder.staffUuid) {
      params.staffUuid = holder.staffUuid;
    }
    axios.get(api, { params: params }).then(success => {
      handleSuccessResponse(holder, success.data);
    }).catch(error => {
      handleFailResponse(holder, error);
    });
  },
};

function install(Vue) {
  Vue.prototype.$statisticRequest = RequestHelper;
};

export default install;
