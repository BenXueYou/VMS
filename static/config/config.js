var ip,
  websocketIp,
  imageUrl,
  protocolHeader = window.location.protocol,
  hostname = window.location.hostname,
  Authorization = "Basic YXBwOjEyMzQ1Ng==";
var DEBUG = "DEBUG";
if (DEBUG == "DEBUG") {
  // 测试环境
  ip = "192.168.9.102:15000";
  websocketIp = "192.168.9.102:15007";
} else if (DEBUG == "TEST") {
  // 提测环境
  ip = "192.168.9.210:15000";
  websocketIp = "192.102.9.210:15007";
} else {
  // 部署环境
  if (protocolHeader === "https:") {
    ip = hostname;
    websocketIp = hostname;
  } else {
    ip = hostname + ":15000";
    websocketIp = hostname + ":80";
  }
}
// 设备资源的类型前端字典表:front end so difficult
window.config = {
  DeBug: true,
  Authorization: Authorization,
  ip: ip,
  projectUuid: "75dc384f95b84e16a93d7910552a4693",
  // zhengyu: "basedata-v1",
  // zhangwz: "iacserv-v1",
  door: "door",
  readhead: "readhead",
  door_ipc: "door_ipc",
  door_aoc: "door_aoc",
  door_aic: "door_aic",
  // wsh: "iacconfig-v1",
  // wyf: "iacapp-v1",
  socketIP: websocketIp + "/webSocketServer",
  orgType: "device",
  tagType: "device",
  protocolHeader: protocolHeader + "//",
  imageUrl: imageUrl,
  forbidBtnArr: ["uncome", "unleave"],
  signOffBtnArr: ["unleave", "leave_overtime"],
  PicSourceType: "facelog",
  subCaptureApi: "/user/topic/face-1.3/client/capture",
  subRecognizationApi: "/user/topic/face-1.3/client/recognization",
  subMonitorAlarmApi: "/user/topic/face-1.3/client/monitorAlarm",
  subDeviceOnOffApi: "/user/topic/status/device",
  subPrewarningApi: "/user/topic/staff/prewarning/info",
  subBayonetApi: "/user/topic/dashboard-1.8/client/vehicleSnapshotMessage",
  door_machine: [],
  video: [{ value: "ipc", label: "IPC" }],
  alarm: [],
  vistor: [
    { value: "manual_vistor_machine", label: "人工访客机" },
    { value: "auto_vistor_machine", label: "自助访客机" },
    { value: "vistor_machine", label: "测试访客机" }
  ]
};
