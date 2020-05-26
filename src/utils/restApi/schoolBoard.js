import store from "@/store/store.js";

let ip = window.config.ip,
  projectUuid = store.state.home.projectUuid;
// 项目内权限
let httpHeader = `${
  window.config.protocolHeader
  }${ip}/sppc-iacapp-service-v1/project/${projectUuid}`;
let SCBHttpHeader = `${
  window.config.protocolHeader
  }${ip}/sppc-dashboard-v1/project/${projectUuid}/school`
export default {
  // 信息概览的接口
  getSchoolStaffCategoryApi:`${SCBHttpHeader}/category/statistics`,
  
  // 通行频率的接口
  getSchoolAccessStaticsApi:`${SCBHttpHeader}/open/door/statistics`,
  
  // 获取学校看板今日访客的接口 
  getTodayVisitorApi:`${SCBHttpHeader}/door/record`,

  // 在岗安保接口
  FacultyApi: {
    getFacultyApi: `${httpHeader}/school/attendance`
  }
};
