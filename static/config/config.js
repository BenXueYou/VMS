var protocolHeader = window.location.protocol;
var hostname = window.location.hostname;
var ip, websocketIp, imageUrl;
// var Authorization = "Basic d2ViOjEyMzQ1Ng=="
var Authorization = "Basic YXBwOjEyMzQ1Ng==";
var DEBUG = "DEBUG";
if (DEBUG == "DEBUG") {
  // 测试环境
  // ip = '180.167.210.2:51880';
  // ip = "192.168.9.190:15000";
  // websocketIp = "192.168.9.190:15007";
  ip = "192.168.6.111:15000";
  websocketIp = "192.168.9.67:15007";
  imageUrl =
    protocolHeader +
    "//" +
    ip +
    "/fileforward-server-v1/project/test_database_api/fileforward/fileByUrl?fileUrl=";
} else if (DEBUG == "TEST") {
  // 提测环境
  // ip = "192.168.9.141:15000";
  ip = "192.168.6.111:15000";
  websocketIp = "192.168.6.111:15007";
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
  } else {
    ip = hostname + ":15000";
    websocketIp = hostname + ":15007";
  }
  var imgUrlStr = protocolHeader + "//" + ip;
  imageUrl =
    imgUrlStr +
    "/fileforward-server-v1/project/test_database_api/fileforward/fileByUrl?fileUrl=";
}
// 设备资源的类型前端字典表:front end so difficult
var resourceType = {
  video: [
    {
      id: "auth_video",
      label: "视频设备"
    },
    {
      id: "auth_video_monitor",
      label: "监控点"
    },
    {
      id: "auth_video_input",
      label: "输入"
    },
    {
      id: "auth_video_output",
      label: "输出"
    }
  ],
  door: [
    {
      id: "auth_door",
      label: "门禁设备"
    },
    {
      id: "auth_door_monitor",
      label: "门禁点"
    },
    {
      id: "auth_door_input",
      label: "输入"
    },
    {
      id: "auth_door_output",
      label: "输出"
    },
    {
      id: "auth_door_readhead",
      label: "读头"
    }
  ],
  alarm: [
    {
      id: "auth_alarm",
      label: "门禁设备"
    },
    {
      id: "auth_alarm_zone",
      label: "防区"
    },
    {
      id: "auth_alarm_subsystem",
      label: "子系统"
    },
    {
      id: "auth_alarm_output",
      label: "输出"
    }
  ],
  visitor: [
    {
      id: "auth_visitor",
      label: "访客设备"
    }
  ]
};

window.config = {
  DeBug: true,
  resourceType,
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
  PicSourceType: "facelog",
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

// tableData: Array.from({ length: 15 }, (v, i) => ({ id: i, staffName: '李怡婷', createTime: '2017-06-20 12:00:00', gender: '女', deviceName: '广拓门禁', address: '上海地铁恒通大厦' })),
