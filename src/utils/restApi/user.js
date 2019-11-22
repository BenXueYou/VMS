import store from "@/store/store.js";

let ip = window.config.ip,
  projectUuid = store.state.home.projectUuid;
// 项目内权限
let httpHeader = `${
  window.config.protocolHeader

  }${ip}/sppc_auth_v1/project/${projectUuid}`;

//项目外权限
let httpAccountHeader = `${
  window.config.protocolHeader
  }${ip}/upms-v1/account`;

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
  getHomeMenuUrl: `${
    window.config.protocolHeader
    }${ip}${httpHeader}/account/menu`,
  // 获取关联通道树
  getNewTreeUrl: `${zy}/auth/organization/tree`,
  getHomeMenuUrl: `${httpHeader}/account/menu`,

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
    editRoleAccountApi: `${httpHeader}/account/role`
  }
};
