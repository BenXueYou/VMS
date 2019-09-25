
// 楼栋房屋
// 懒加载的方式
const BuildingsHouse = () => import(/* webpackChunkName: "BuildingsHouse" */ '@/pages/buildingsHouse/BuildingsHouse');
// import BuildingsHouse from "@/pages/buildingsHouse/BuildingsHouse";
export default BuildingsHouse;
