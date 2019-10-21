import Axios from "@/utils/Request";
import RestApi from "@/utils/RestApi";
import store from '@/store/store.js';
import { Message } from 'element-ui';

let FaceModuleApi = RestApi.api.faceModuleAPi;

export function getFaceDeviceList(data) {
  if (data) { data.projectUuid = store.state.home.projectUuid; }
  let url = FaceModuleApi.getFaceDeviceList(store.state.home.projectUuid);
  return Axios({
    method: 'GET',
    url,
    params: data
  });
}
export function getDeviceChannelList(data) {
  if (data) { data.projectUuid = store.state.home.projectUuid; }
  let url = FaceModuleApi.getDeviceChannelList(store.state.home.projectUuid);
  return Axios({
    method: 'GET',
    url,
    params: data
  });
}

export function getFaceUuidByFaceCaptureUuid(data) {
  let url = FaceModuleApi.getFaceUuidByFaceCaptureUuid(store.state.home.projectUuid);
  return Axios({
    method: "GET",
    url,
    params: data
  });
}

// 基础设置接口
export function getFaceModuleConfig() {
  let url = FaceModuleApi.getFaceModuleConfigApi(store.state.home.projectUuid);
  return Axios({
    method: 'GET',
    url,
  });
}
export function postFaceModuleConfig(xhr) {
  let url = FaceModuleApi.postFaceModuleConfigApi(store.state.home.projectUuid);
  return Axios({
    method: 'POST',
    url,
  });
}
export function uploadAudio(xhr) {
  let url = FaceModuleApi.uploadAudioApi(store.state.home.projectUuid);
  return Axios({
    method: 'POST',
    url,
    data: xhr
  });
}
export function deleteAudio(xhr) {
  let url = FaceModuleApi.deleteAudioApi(store.state.home.projectUuid);
  return Axios({
    method: 'DELETE',
    url,
    data: xhr
  });
}
// 根据布控任务查询关联的设备以及人脸库
export function getTaskDeatailChannelAndLib(uuid) {
  let url = FaceModuleApi.getTaskDetailChannelAndLibs(store.state.home.projectUuid, uuid);
  return Axios({
    method: 'GET',
    url
  });
}
/**
 *
 * @param {enabled} 布控任务启用状态(1启用，0不启用)
 */
export function getTaskList(enabled) {
  let url = FaceModuleApi.getTaskListApi(store.state.home.projectUuid);
  return Axios({
    method: 'get',
    url,
    params: { enabled: enabled }
  });
}
// 1V1对比
export function faceComparison1v1(data) {
  let url = FaceModuleApi.faceComparison1v1(store.state.home.projectUuid);
  return Axios({
    method: "get",
    url,
    params: data
  });
}
// 抓拍列表
export function getSnapshotList(data) {
  let url = FaceModuleApi.getSnapshotList(store.state.home.projectUuid);
  return Axios({
    method: "get",
    url,
    params: data
  });
}
// 识别列表
export function getRecognizeList(data) {
  let url = FaceModuleApi.getRecognizeList(store.state.home.projectUuid);
  return Axios({
    method: "get",
    url,
    params: data
  });
}
// 识别详情
export function getRecognizeInfo(data) {
  let url = FaceModuleApi.getRecognizeInfo(store.state.home.projectUuid);
  return Axios({
    method: "get",
    url,
    params: data
  });
}
// 报警列表
export function getAlarmList(data) {
  let url = FaceModuleApi.getAlarmInfoList(store.state.home.projectUuid);
  return Axios({
    method: "get",
    url,
    params: data
  });
}

// 人脸库管理
// 增
export function addFaceLid(data) {
  let url = FaceModuleApi.faceDBApi.addFaceLibUrl(store.state.home.projectUuid);
  return Axios({
    method: 'POST',
    url,
    data
  });
}
// 查
export function getFaceLib(data) {
  let url = FaceModuleApi.faceDBApi.getFaceLibUrl(store.state.home.projectUuid);
  return Axios({
    method: 'POST',
    url,
    data
  });
}
// 二查
export function getFaceLibDetail(data) {
  let url = FaceModuleApi.faceDBApi.getFaceLibDetailUrl();
  return Axios({
    method: 'GET',
    url,
    data
  });
}
// 改
export function putFaceLib(data) {
  let url = FaceModuleApi.faceDBApi.putFaceLibUrl(store.state.home.projectUuid);
  return Axios({
    method: 'POST',
    url,
    data
  });
}
// 删
export function deleteFaceLib(data) {
  let url = FaceModuleApi.faceDBApi.deleteFaceLibUrl(store.state.home.projectUuid);
  return Axios({
    method: 'POST',
    url,
    data
  });
}

// 辅查
export function getFaceLibOptions(data) {
  let url = FaceModuleApi.faceDBApi.getFaceLibOptionsUrl(store.state.home.projectUuid);
  return Axios({
    method: 'POST',
    url,
    data
  });
}
// 人脸库人员添加
export function addStaffInfo(data) {
  let url = FaceModuleApi.faceDBApi.addStaffUrl(store.state.home.projectUuid);
  return Axios({
    method: 'POST',
    url,
    data
  });
}
// 人脸库人员列表
export function getStaffList(data) {
  let url = FaceModuleApi.faceDBApi.addStaffUrl(store.state.home.projectUuid);
  return Axios({
    method: 'POST',
    url,
    data
  });
}
// 人脸库人员详情
export function getStaffDetail(data) {
  let url = FaceModuleApi.faceDBApi.getStaffDetailUrl(store.state.home.projectUuid);
  return Axios({
    method: 'POST',
    url,
    data
  });
}
// 删除人员
export function deleteStaff(data) {
  let url = FaceModuleApi.faceDBApi.deleteStaffUrl(store.state.home.projectUuid);
  return Axios({
    method: 'DELETE',
    url,
    data
  });
}
// 编辑人员
export function updateStaff(data) {
  let url = FaceModuleApi.faceDBApi.updateStaffUrl(store.state.home.projectUuid);
  return Axios({
    method: 'PUT',
    url,
    data
  });
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
