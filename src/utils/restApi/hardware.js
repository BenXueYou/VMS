/**
 * 实有装备的API
 */
import store from "@/store/store.js";
export default {
  getAllequipments: `/statistics-basedata-server/project/${
    store.state.home.projectUuid
    }/equipment/list`,
  getDetailequipments: `/bstatistics-basedata-server/project/${
    store.state.home.projectUuid
    }/equipments/company`,
  delequipments: `/statistics-basedata-server/project/${
    store.state.home.projectUuid
    }/equipment`,
  addequipments: `/statistics-basedata-server/project/${
    store.state.home.projectUuid
    }/equipment`,
  updateequipments: `/statistics-basedata-server/project/${
    store.state.home.projectUuid
    }/equipment`,
  selPeople: `/statistics-basedata-server/project/${
    store.state.home.projectUuid
    }/equipments/selPeople`
};
