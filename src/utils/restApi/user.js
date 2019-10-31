import store from "@/store/store.js";

let ip = window.config.ip,
  // projectUuid = window.config.projectUuid;
  projectUuid = store.state.home.projectUuid;
let httpHeader = `${
  window.config.protocolHeader
}${ip}/sppc_auth_v1/project/${projectUuid}/`;
export default {
  getAccoutUrl: `${httpHeader}`
};
