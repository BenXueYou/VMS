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
var treeIcons = [
  {
    label: "文件",
    value: "device",
    icon: "doc"
  },
  {
    label: "IPC",
    value: "ipc",
    icon: "ip"
  },
  {
    label: "NVR",
    value: "nvr",
    icon: "nvr"
  },
  {
    label: "门禁",
    value: "door",
    icon: "door"
  },
  {
    label: "人工访客",
    value: "hand_visitordevice",
    icon: "rgfk"
  },
  {
    label: "自助访客",
    value: "auto_visitordevice",
    icon: "zzfk"
  },
  {
    label: "枪机",
    value: "bullet_camera",
    icon: "qj"
  },
  {
    label: "半球",
    value: "dome_camera",
    icon: "bq"
  },
  {
    label: "球机",
    value: "ball_camera",
    icon: "qiuji"
  },
  {
    label: "人脸门",
    value: "",
    icon: "rl"
  },
  {
    label: "普通门",
    value: "",
    icon: "pt"
  },
  {
    label: "带云台的枪机",
    value: "bullet_camera_ptz",
    icon: "ytqj"
  }
];
var ManFeatureArr = [
  {
    id: "ordinary",
    label: "普通人员"
  },
  {
    id: "famous",
    label: "知名人员"
  },
  {
    id: "cripple",
    label: "残疾人员"
  },
  {
    id: "alone",
    label: "独居老人"
  },
  {
    id: "treatment",
    label: "重点治疗人员"
  },
  {
    id: "helpers",
    label: "安置帮教人员"
  },
  {
    id: "focus",
    label: "重点关注人员"
  },
  {
    id: "other",
    label: "其他关注人员"
  }
];
var StrengthArr = [
  {
    id: "security_guard",
    label: "保安人员"
  },
  {
    id: "security_responsible",
    label: "保安负责"
  },
  {
    id: "security_assistance",
    label: "治安协助"
  },
  {
    id: "fire_assistance",
    label: "消防协助"
  },
  {
    id: "building_leader",
    label: "楼栋组长"
  },
  {
    id: "property_staff",
    label: "物业人员"
  },
  {
    id: "resident_staff",
    label: "居委人员"
  },
  {
    id: "street_staff",
    label: "街道人员"
  },
  {
    id: "area_police",
    label: "片区民警"
  },
  {
    id: "other",
    label: "其他人员"
  }
];
var alinkArr = [
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
];
var setEvents = [
  { typeName: "全部", typeStr: null },
  { typeName: "设备管理", typeStr: "设备管理" },
  { typeName: "单位管理", typeStr: "单位管理" },
  { typeName: "楼栋房屋", typeStr: "楼栋房屋" },
  { typeName: "居民管理", typeStr: "居民管理" },
  { typeName: "员工管理", typeStr: "员工管理" },
  { typeName: "用户管理", typeStr: "用户管理" },
  { typeName: "门禁管理", typeStr: "门禁管理" },
  { typeName: "访客管理", typeStr: "访客管理" },
  { typeName: "视频预览", typeStr: "视频预览" },
  { typeName: "人脸识别", typeStr: "人脸识别" },
  { typeName: "车辆识别", typeStr: "车辆识别" },
  { typeName: "视频回放", typeStr: "视频回放" },
  { typeName: "系统配置", typeStr: "系统配置" },
  { typeName: "地图配置", typeStr: "地图配置" },
  { typeName: "实有装备", typeStr: "实有装备" },
  { typeName: "车辆登记", typeStr: "车辆登记" },
  { typeName: "区域管理", typeStr: "区域管理" }
];
var operationEvents = [
  { typeName: "全部", typeStr: null },
  { typeName: "视频预览", typeStr: "视频预览" },
  { typeName: "视频回放", typeStr: "视频回放" },
  { typeName: "门禁管理", typeStr: "门禁管理" },
  { typeName: "访客管理", typeStr: "访客管理" },
  { typeName: "人脸识别", typeStr: "人脸识别" },
  { typeName: "车辆识别", typeStr: "车辆识别" },
  { typeName: "地图操作", typeStr: "地图操作" },
  { typeName: "区域管理", typeStr: "区域管理" }
];
var configObj = window.config || {}, configs = {
  StrengthArr: StrengthArr,
  ManFeatureArr: ManFeatureArr,
  resourceType: resourceType,
  treeIcons: treeIcons,
  alinkArr: alinkArr,
  operationEvents: operationEvents,
  setEvents: setEvents
};
// Object.assign(configObj, configs);
for(var key in configs){
  configObj[key] = configs[key];
}
window.config = configObj;