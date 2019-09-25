import Axios from 'axios';

// import QS from 'qs';

import { Message } from 'element-ui';

// let token = mpprClient.getLoginToken()
// let ip = mpprClient.getIpAndPort()

let token = window.config.token;
// alert('token:'+mpprClient.getLoginToken());
// alert('token:'+token)

let ip = window.config.ip;

// alert('ip===='+window.config.ip);
// alert('ip==='+mpprClient.getIpAndPort());

Axios.defaults.headers.common['token'] = token;

// axios 设置请求超时机制
Axios.defaults.retry = 0;
Axios.defaults.retryDelay = 15000;

Axios.interceptors.response.use(undefined, function axiosRetryInterceptor(err) {
  var config = err.config;
  // If config does not exist or the retry option is not set, reject
  if (!config || !config.retry) return Promise.reject(err);

  // Set the variable for keeping track of the retry count
  config.__retryCount = config.__retryCount || 0;

  // Check if we've maxed out the total number of retries
  if (config.__retryCount >= config.retry) {
    // Reject with the error
    return Promise.reject(err);
  }

  // Increase the retry count
  config.__retryCount += 1;

  // Create new promise to handle exponential backoff
  var backoff = new Promise(function (resolve) {
    setTimeout(function () {
      resolve();
    }, config.retryDelay || 1);
  });

    // Return the promise in which recalls Axios to retry the request
  return backoff.then(function () {
    return Axios(config);
  });
});

// 抓拍记录到同行人分析检测的判断
export function photoRecordToAnalysis(xhr) {
  return Axios.get('http://' + ip + '/mppr-statistics/staffuuid?detecteduuid=' + xhr, { retry: 1, retryDelay: 15000 });
}

// 临时布控
export function tempCtrlTask(xhr) {
  return Axios.get('http://' + ip + '/jcfgs/v2/vip/info/temp?photouri=' + xhr, { retry: 1, retryDelay: 15000 });
}

// 获取WebRtc的连接地址
export function getWebRtcSocketIPAddress(XhrParams) {
  return Axios.get('http://' + ip + '/mppr-vids/v1/vids/rtsp/address', { retry: 1, retryDelay: 15000 });
}

// 获取布控任务的列表
export function getTaskList(XhrParams) {
  // 本地代理
  // return Axios.get('/api/face/v2/dispatching/task/list', { retry: 1, retryDelay: 15000 });
  return Axios.get('http://' + ip + '/mppr-model/face/v2/dispatching/task/list', { retry: 1, retryDelay: 15000 });
}
// 根据任务id获取任务的关联库和设备
export function getFaceLibsAndDeviceList(xhr) {
  return Axios.post('http://' + ip + '/mppr-model/face/v2/dispatching/channel/face', xhr, { retry: 1, retryDelay: 15000 });
}

// 根据任务id查询任务的识别记录
export function getRecongizeList(xhr) {
  return Axios.get('http://' + ip + '/mppr-statistics/log/taskInfo?taskUuidList=' + xhr.taskUuids + "&starttime=" + xhr.startTime + "&overtime=" + xhr.endTime, { retry: 1, retryDelay: 15000 });
}

// 获取所有设备树的列表
export function getDeviceList(XhrParams) {
  // return Axios.get('/api/v2/baseDevice/deviceTree'); get /v2/baseDevice/deviceFaceAndBodyTree
  return Axios.get('http://' + ip + '/jcfgs/v2/baseDevice/deviceFaceAndBodyTree', { retry: 1, retryDelay: 15000 });
}

// 获取人体相机的设备树列表
export function getBodyDeviceList(XhrParams) {
  // return Axios.get('/api/v2/baseDevice/deviceTree'); get /v2/baseDevice/deviceBodyTree
  return Axios.get('http://' + ip + '/jcfgs/v2/baseDevice/deviceBodyTree', { retry: 1, retryDelay: 15000 });
}

// 根据通道id批量获取rtsp地址
export function getRTSPAddress(XhrData) {
  Axios.defaults.headers.common['token'] = token;
  return Axios.post('http://' + ip + '/mppr-vids/v1/vids/rtsps',
    {
      'resource': XhrData
    }, { retry: 1, retryDelay: 15000 });
}

// 获取抓拍记录
export function getPhotoList(xhr) {
  var params = {};
  if (xhr.channelUuids) {
    params.channeluuid = xhr.channelUuids;
  }
  if (xhr.quality) {
    params.quality = xhr.quality;
  }
  if (xhr.gender) {
    params.gender = xhr.gender;
  }
  if (xhr.pageSize) {
    params.pageSize = xhr.pageSize;
  }
  if (xhr.currentPage) {
    params.currentPage = xhr.currentPage;
  }
  if (xhr.startDate) {
    params.starttime = xhr.startDate;
  }
  if (xhr.endDate) {
    params.overtime = xhr.endDate;
  }
  var url = 'http://' + ip + '/mppr-statistics/log/photograph';

  return Axios.post(url, params, { retry: 1, retryDelay: 15000 });
}

// 获取对比记录
export function getCompareList(xhr) {
  return Axios.get('http://' + ip + '/mppr-statistics/log/rec?taskUuidList=' + xhr.taskUuids + '&channelUuidList=' + xhr.channelIds + "&database=" + xhr.faceLibListUuids + "&starttime=" + xhr.startTime + "&overtime=" + xhr.endTime + "&currentPage=" + xhr.currentPage + "&pageSize=" + xhr.pageSize, { retry: 1, retryDelay: 15000 });
}

export function getCompareRecList(xhr) {
  return Axios.get('http://' + ip + '/mppr-statistics/log/faceRec?channelUuidList=' + xhr.channelIds + "&database=" + xhr.faceLibListUuids + "&starttime=" + xhr.startTime + "&overtime=" + xhr.endTime + "&currentPage=" + xhr.currentPage + "&pageSize=" + xhr.pageSize, { retry: 1, retryDelay: 15000 });
}

// 获取今日抓拍次数
export function getShootPhotoCount(xhr) {
  return Axios.get('http://' + ip + '/mppr-statistics/log/sum?channelUuidList=' + xhr.channelUuids + '&date=' + xhr.currentTime, { retry: 1, retryDelay: 15000 });
}

// 获取今日对比次数
export function getCompareCount(xhr) {
  console.log(typeof xhr, '------获取今日抓拍次数-----参数：', xhr);
  return Axios.get('http://' + ip + '/mppr-statistics/log/countDis?taskuuid=' + xhr, { retry: 1, retryDelay: 15000 });
}

// 获取今日整点时分抓拍次数
export function getStaticHourCount(xhr) {
  var paramsStr = '';

  if (xhr.quality) {
    paramsStr = 'quality=' + xhr.quality + '&';
  }
  if (xhr.channelUuids) {
    paramsStr += 'devname=' + xhr.channelUuids + '&';
  }
  if (xhr.currentTime) {
    paramsStr += 'date=' + xhr.currentTime;
  }
  return Axios.get('http://' + ip + '/mppr-statistics/statistics/singlevid_day?' + paramsStr, { retry: 1, retryDelay: 15000 });
}

// 根据人员StaffUuid获取抓拍记录

export function getShootPhotosForStaffUuid(xhr) {
  return Axios.get('http://' + ip + '/mppr-statistics/log/disInfo?staffUuid=' + xhr.staffUuid, { retry: 1, retryDelay: 15000 });
}

// 获取人脸库列表  /mppr-face/v1/face/libs
export function getFaceLibs(xhr) {
  return Axios.get('http://' + ip + '/mppr-face/v1/face/libs', { retry: 1, retryDelay: 15000 });
}

// 人体查询：/v1/face/analysis/query/bodyInfo/list
export function getMBodyRecordList(xhr) {
  // var params = {}
  // if (xhr.channelIds) {
  //     params.channelname = xhr.channelIds;
  // }
  // if (xhr.faceLibListUuids) {
  //     params.database = xhr.faceLibListUuids;
  // }
  // if (xhr.scores) {
  //     params.scores = xhr.scores;
  // }
  // if (xhr.pageSize) {
  //     params.pageSize = xhr.pageSize;
  // }
  // if (xhr.currentPage) {
  //     params.currentPage = xhr.currentPage;
  // }
  // if (xhr.startTime) {
  //     params.starttime = xhr.startTime;
  // }
  // if (xhr.endTime) {
  //     params.overtime = xhr.endTime;
  // }

  let url = 'http://' + ip + '/mppr-statistics/log/body';
  return Axios.post(url, xhr, { retry: 1, retryDelay: 15000 });
}

// 上传两张人脸对比 POST /v1/face/analysis/model/compare/images
export function compareTwoFacePhoto(xhr) {
  return Axios.post('http://' + ip + '/mppr-baseface/v2/face/search/match', xhr, {
    headers: {
      "Content-Type": "multipart/form-data",
    }
  }, { retry: 1, retryDelay: 15000 });
}
// 任务列表 ，该接口暂未用到
export function getTaskLibsList(xhr) {
  return Axios.get('http://' + ip + '/mppr-face/v1/face/dispatching/list?taskName=ALL&isBody=' + xhr, { retry: 1, retryDelay: 15000 });
}

// 人体分析查询
export function getBobyRecList(xhr) { //
  return Axios.get('http://' + ip + '/mppr-statistics/body/list?channeluuid=' + xhr, { retry: 1, retryDelay: 15000 });
}

// 人体分析次数统计
export function getBobyRecNum(xhr) { //
  return Axios.get('http://' + ip + '/mppr-statistics/today/body/number?channeluuid=' + xhr, { retry: 1, retryDelay: 15000 });
}

// ------------------请求开始-------------
function tips(res) {
  if (!res || res.result === undefined) {
    return;
  }
  if (res.result !== 0 && res.msg.length) {
    Message.error(res.msg);
  }
}
function get(url, param) {
  return new Promise((resolve, reject) => {
    Axios({
      method: 'get',
      url,
      params: param
    })
      .then((res) => {
        tips(res.data);
        resolve(res);
      })
      .catch((err) => {
        Message.error("请求失败");
        reject(err);
      });
  });
}

function post(url, param) {
  return new Promise((resolve, reject) => {
    Axios({
      method: 'post',
      url,
      data: param
    })
      .then((res) => {
        tips(res.data);
        resolve(res);
      })
      .catch((err) => {
        Message.error("请求失败");
        reject(err);
      });
  });
}

function put(url, param) {
  return new Promise((resolve, reject) => {
    Axios({
      method: 'put',
      url,
      data: param
    })
      .then((res) => {
        tips(res.data);
        resolve(res);
      })
      .catch((err) => {
        Message.error("请求失败");
        reject(err);
      });
  });
}
function deleteajax(url, param) {
  return new Promise((resolve, reject) => {
    Axios({
      method: 'delete',
      url,
      data: param
    })
      .then((res) => {
        tips(res.data);
        resolve(res);
      })
      .catch((err) => {
        Message.error("请求失败");
        reject(err);
      });
  });
}
// 人脸报警记录
export function getAlarmRecord(param) {
  var url = `http://${window.config.ip}/mppr-statistics/log/alarm`;
  return get(url, param);
}
export function getModelRecord(param) {
  var url = `http://${window.config.ip}/mppr-statistics/log/model`;
  return get(url, param);
}
// 获取到报警记录的详情信息
export function getAlarmDetail(param) {
  var url = `http://${window.config.ip}/mppr-statistics/log/alarmDetailInfo`;
  return get(url, param);
}
// 获取设备名称
export function getDeviceName(param) {
  var url = `http://${window.config.ip}/mppr-model/face/v2/channelInfo/list`;
  return post(url, param);
}
export function getModelArr() {
  var url = `http://${window.config.ip}/mppr-model/face/v2/analysis/model/list`;
  return get(url);
}
export function peopledk(param) {
  var url = `http://${window.config.ip}/v1/file/staffImportTask`;
  return post(url, param);
}
// 上传完文件分析接口
export function fenxi() {
  var url = `http://${window.config.ip}/mppr-file/v1/file/import/fileAnalysis`;
  return post(url);
}
// 添加导库任务
export function addDaoKuTask(param) {
  var url = `http://${window.config.ip}/mppr-file/v1/file/staffImportTask`;
  return post(url, param);
}
// 删除导库任务
export function deleteDaoKuTask(param) {
  var url = `http://${window.config.ip}/mppr-file/v1/file/staffImportTask/deleted?taskuuid=${param}&deleted=true`;
  return put(url);
}
// 查询人员库某个库所有的任务列表
export function getkutask(param) {
  var url = `http://${window.config.ip}/mppr-file/v1/file/staffImportTask/library`;
  return get(url, param);
}
// 查询导入任务列表
export function gettaskdetail(param) {
  var url = `http://${window.config.ip}/mppr-file/v1/file/staffImportErrorInfo/task`;
  return get(url, param);
}

// 查询所有人员库的信息
export function querystafflibrarylist() {
  var url = `http://${window.config.ip}/jcfgs/v1/staffLibrary/staffLibraryInfo/list`;
  return get(url);
}
// 查询某个人员库的具体信息
export function querystaffbyuuid(param) {
  var url = `http://${window.config.ip}/jcfgs/v1/staffLibrary/staffLibraryInfo`;
  return get(url, param);
}
// 查询人员库及其人员库数量
export function querystaff() {
  var url = `http://${window.config.ip}/jcfgs/v1/staffLibrary/libraryNumberList`;
  return get(url);
}
// 查询重点人员列表
export function queryvipinfo(param) {
  var url = `http://${window.config.ip}/jcfgs/v2/vip/vipInfo/list`;
  return get(url, param);
}
// 添加重点人员
export function addvip(param) {
  var url = `http://${window.config.ip}/jcfgs/v2/vip/info`;
  return post(url, param);
}
// 修改重点人员
export function updatevip(param) {
  var url = `http://${window.config.ip}/jcfgs/v2/vip/info`;
  return put(url, param);
}
// 删除重点人员
export function deletevip(param) {
  var url = `http://${window.config.ip}/jcfgs/v2/vip/vipInfo`;
  return deleteajax(url, param);
}
// 查询重点人员
export function queryvip(param) {
  var url = `http://${window.config.ip}/jcfgs/v2/vip/vipInfo`;
  return get(url, param);
}
// 获取证件类型 获取所有库和颜色
export function getIdCardType(param) {
  var url = `http://${window.config.ip}/jcfgs/v1/baseType/baseTypedto/groupList`;
  return get(url, param);
}
// 上传base64 得到图片url
export function uploadbase64(param) {
  var url = `http://${window.config.ip}/jcfgs/v2/vip/photoinfo`;
  return post(url, param);
}
export function deletepic(id) {
  var url = `http://${window.config.ip}/jcfgs/v2/vip/photoinfo?photouuid=${id}`;
  return deleteajax(url);
}
// 修改人员库
export function updatestaffku(param, libraryuuid) {
  var url = `http://${window.config.ip}/jcfgs/v1/staffLibrary/info?libraryuuid=${libraryuuid}`;
  return put(url, param);
}
// 删除人员库
export function deletestaffku(libraryuuid) {
  var url = `http://${window.config.ip}/jcfgs/v1/staffLibrary/info?libraryuuid=${libraryuuid}`;
  return deleteajax(url);
}
// 添加人员库
export function addstaffku(param) {
  var url = `http://${window.config.ip}/jcfgs/v1/staffLibrary/info`;
  return post(url, param);
}
export function getshitu(param) {
  var url = `http://${window.config.ip}/jcfgs/v1/staffLibrary/view/list`;
  return get(url, param);
}
export function gettranslateword(param) {
  var url = `http://${window.config.ip}/jcfgs/v1/baseType/baseTypedto/groupList`;
  return get(url, param);
}
// 将研判详情的处理
export function setyanpan(param) {
  var url = `http://${window.config.ip}/mppr-model/face/v2/analysis/model/deal`;
  return put(url, param);
}
// 获取模板
export function gettemplate(param) {
  var url = `http://${window.config.ip}/mppr-file/v1/file/staffImportTemplate/download/${param}`;
  return get(url);
}
// 处理意见
export function setyijian(param) {
  var url = `http://${window.config.ip}/mppr-linkage/linkage/v1/alarminfo/deal`;

  return put(url, param);
}
export function getExcel(param) {
  var str = "";
  for (var k in param) {
    str += `${k}=${param[k]}&`;
  }
  var url = `http://${window.config.ip}/mppr-file/v1/file/staffExport?${str}`;
  return url;
  // return get(url,param);
}
// 获取所有的布控任务
export function getbukongrenwu() {
  var url = `http://${window.config.ip}/mppr-model/face/v2/dispatching/task/list`;
  return get(url);
}

// 根据布控任务来获取设备名称和所属库
export function getchannelbykongbu(param) {
  var url = `http://${window.config.ip}/mppr-model/face/v2/dispatching/channel/face`;
  return post(url, param);
}

// 智能模型记录的检索
export function getRecordModelAnalysis(param) {
  var url = `http://${window.config.ip}/mppr-statistics/v2/statistics/faceRecognization/peopModelAnaly `;
  return post(url, param);
}

// 智能模型记录的检索的详情
export function getRecordModelAnalysisDetail(param) {
  var url = `http://${window.config.ip}/mppr-statistics/v2/statistics/faceRecognization/peopModelAnalyInfo  `;
  return post(url, param);
}

// ----------------请求结束
