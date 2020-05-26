import axios from "@/utils/Request";
import RestApi from "@/utils/RestApi";

let SCBApi = RestApi.schoolBoardApi;
export var FacultyHttp = {
  /**
   * 查询安保考勤列表
   */
  getFacultyApi(holder) {
    let api = SCBApi.FacultyApi.getFacultyApi;
    let data = {};
    for (let k in holder) {
      data[k] = holder[k];
    }
    return axios.get(api, { params: data });
  },
  // 信息概览的接口
  getSchoolStaffCategoryApi() {
    let api = SCBApi.getSchoolStaffCategoryApi;
    return axios.get(api);
  },
  // 通行频率
  getSchoolAccessStaticsApi() {
    let api = SCBApi.getSchoolAccessStaticsApi;
    return axios.get(api);
  },
  // 今日访客
  getTodayVisitorApi() {
    let api = SCBApi.getTodayVisitorApi;
    return axios.get(api);
  },
};

function install(Vue) {
  Vue.prototype.$FacultyHttp = FacultyHttp;
}

export default install;
