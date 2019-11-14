import Axios from "@/utils/Request";
import { Message } from 'element-ui';

import * as baseConfigHttp from "./http/baseConfigHttp.js";
import * as faceDBHttp from "./http/faceDBHttp.js";
import * as logSearchHttp from "./http/logSearchHttp.js";
import * as homeBaseHttp from "./http/homeBaseHttp.js";

export default {
  baseConfigHttp,
  faceDBHttp,
  logSearchHttp,
  homeBaseHttp
};

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
// ----------------请求结束
