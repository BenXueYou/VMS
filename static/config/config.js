// GatoCloud_V1.1_h5_iac_Build(5730)
var protocolHeader = window.location.protocol;
var hostname = window.location.hostname;
var ip, websocketIp, imageUrl;
// var Authorization = "Basic d2ViOjEyMzQ1Ng=="
var Authorization = "Basic YXBwOjEyMzQ1Ng==";
var DEBUG = "TEST";
if (DEBUG == "DEBUG") {
  // 测试环境
  // ip = '180.167.210.2:51880';
  ip = "192.168.9.190:15000";
  websocketIp = "192.168.9.190:15007";
  imageUrl =
    protocolHeader +
    "//" +
    ip +
    "/fileforward-server-v1/project/test_database_api/fileforward/fileByUrl?fileUrl=";
} else if (DEBUG == "TEST") {
  // 提测环境
  ip = "192.168.9.94:15000";
  // ip = '192.168.6.191:51880';
  websocketIp = "192.168.9.94:15007";
  imageUrl =
    protocolHeader +
    "//" +
    ip +
    "/fileforward-server-v1/project/test_database_api/fileforward/fileByUrl?fileUrl=";
} else {
  // 部署环境
  if (protocolHeader === "https:") {
    ip = hostname;
    websocketIp = hostname;
    if (window.location.port) ip += ':443';
    if (window.location.port) websocketIp += ':443';
  } else {
    ip = hostname + ":51880";
    websocketIp = "180.167.210.2:51881";
  }
  var imgUrlStr = protocolHeader + "//" + ip;
  imageUrl =
    imgUrlStr +
    "/fileforward-server-v1/project/test_database_api/fileforward/fileByUrl?fileUrl=";
}

window.config = {
  Authorization: Authorization,
  ip: ip,
  projectUuid: "75dc384f95b84e16a93d7910552a4693",
  zhengyu: "basedata-v1",
  zhangwz: "iacserv-v1",
  door: "door",
  readhead: "readhead",
  door_ipc: "door_ipc",
  door_aoc: "door_aoc",
  door_aic: "door_aic",
  wsh: "iacconfig-v1",
  wyf: "iacapp-v1",
  socketIP: websocketIp + "/webSocketServer",
  orgType: "device",
  tagType: "device",
  protocolHeader: protocolHeader + "//",
  imageUrl: imageUrl,
  forbidBtnArr: ["uncome", "unleave"],
  signOffBtnArr: ["unleave", "leave_overtime"],
  alinkArr: [
    {
      strName: "关于广拓",
      strValue: "http://www.gato.com.cn/Intro/index/cat_id/84.html"
    },
    {
      strName: "联系我们",
      strValue: "http://www.gato.com.cn/Contact/index.html"
    },
    {
      strName: "产品中心",
      strValue: "http://www.gato.com.cn/Product/index.html"
    },
    {
      strName: "解决方案",
      strValue: "http://www.gato.com.cn/Solution/index.html"
    },
    {
      strName: "成功案例",
      strValue: "http://www.gato.com.cn/Case/index.html"
    },
    {
      strName: "服务支持",
      strValue: "http://www.gato.com.cn/Download/index/cat_id/65.html"
    },
    {
      strName: "资质荣誉",
      strValue: "http://www.gato.com.cn/Honor/index/cat_id/74.html"
    },
    {
      strName: "新闻中心",
      strValue: "http://www.gato.com.cn/News/index.html"
    }
  ],
  door_machine: [{ value: "door_machine", label: "门口机" }],
  video: [{ value: "ipc", label: "IPC" }],
  alarm: [],
  vistor: [
    { value: "manual_vistor_machine", label: "人工访客机" },
    { value: "auto_vistor_machine", label: "自助访客机" },
    { value: "vistor_machine", label: "测试访客机" }
  ]
};