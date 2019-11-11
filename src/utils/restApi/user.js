import store from "@/store/store.js";

let ip = window.config.ip,
  // projectUuid = window.config.projectUuid;
  projectUuid = store.state.home.projectUuid;
let httpHeader = `${
  window.config.protocolHeader
<<<<<<< HEAD
}${ip}/sppc_auth_v1/project/${projectUuid}`;
httpHeader =
  "http://192.168.9.142:15101/project/299fc6dfa7104483bcee8d71e59957cd";
=======
}${ip}/upms-v1/project/${projectUuid}`;
// httpHeader =
//   "http://192.168.9.166:15101/project/299fc6dfa7104483bcee8d71e59957cd";
>>>>>>> 45f0d36847158f1ab0a6979b8ab521f689d11284
let httpAccountHeader = `${window.config.protocolHeader}${ip}/upms-v1/account`;
let zy = `${
  window.config.protocolHeader
}${ip}/basedata-v1/project/${projectUuid}`;

export default {
  getAccoutUrl: `${httpHeader}`,
  // 获取角色列表
  getUserListUrl: `${httpHeader}/role/page`,
  // 获取角色详情
  getUserDetailUrl: `${httpHeader}/role`,
  // 添加角色信息
  addUserDetailUrl: `${httpHeader}/role`,
  // 修改角色信息
  editUserDetailUrl: `${httpHeader}/role`,
  // 删除角色
  deleteUserUrl: `${httpHeader}/role`,
  // 分配账号
  distruiAccoutUrl: `${httpHeader}/role/account`,
  // 变更角色状态
  // 获取角色功能模块权限树
  getAuthUrl: `${httpHeader}/role/feature/auth`,
  // 获取角色资源模块权限
  getResourceUrl: `${httpHeader}/role/resource/authh`,
  updateUserStatusUrl: `${httpHeader}/role/status`,
  // 获取用户的菜单
<<<<<<< HEAD
  getHomeMenuUrl: `${
    window.config.protocolHeader
  }${ip}${httpHeader}/account/menu`,
  // 获取关联通道树
  getNewTreeUrl: `${zy}/auth/organization/tree`,
=======
  getHomeMenuUrl: `${httpHeader}/account/menu`,

>>>>>>> 45f0d36847158f1ab0a6979b8ab521f689d11284
  accountApi: {
    addAccountApi: `${httpAccountHeader}`,
    getAccountListApi: `${httpAccountHeader}`,
    getAccountDetailApi: `${httpAccountHeader}/detail`,
    putAccountApi: accountUuid => `${httpAccountHeader}/${accountUuid}`,
    putAccountPWDApi: accountName =>
      `${httpAccountHeader}/updatePwd/${accountName}`,
    resetAccountPWDApi: `${httpAccountHeader}/resetPwd`,
    deleteAccountApi: `${httpAccountHeader}`,
    switchAccountApi: `${httpAccountHeader}`,
    //账号分配角色
    editRoleAccountApi:`${httpAccountHeader}/role`
  }
};
