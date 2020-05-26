import store from "@/store/store.js";

let ip = window.config.ip,
  projectUuid = store.state.home.projectUuid;
// 车辆登记 restApi
let zy = `${
  window.config.protocolHeader
}${ip}/statistics-basedata-server/project/${projectUuid}`;
export default {
  addNewCarUrl: `${zy}/parking/vehicle`, // 新增车辆
  getNewCarListUrl: `${zy}/parking/vehicle/list`, // 获取车辆列表
  getCarDetailUrl: vehicleUuid => `${zy}/parking/vehicle/detail/${vehicleUuid}`, // 获取车辆详情
  updateCarUrl: `${zy}/parking/vehicle`, // 修改车辆信息
  deleteCarUrl: `${zy}/parking/vehicle` // 删除车辆
};
