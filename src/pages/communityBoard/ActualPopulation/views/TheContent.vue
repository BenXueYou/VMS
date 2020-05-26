<template>
  <div class="content"
       id='MyContent'
       v-loading="mainListLoading1"
       element-loading-background="rgba(0, 0, 0, 0.8)">
    <div class="contentWrap">
      <div class="header">
        <div class="left">
          <span v-if="isLevelOne == 'levelTwo'">请选择小区：</span>
          <el-select style="width: 120px;margin-right: 5px;"
                     v-if="isLevelOne == 'levelTwo'"
                     v-model="activeProject"
                     clearable
                     @change="handleStreetChange">
            <el-option v-for="item in selectData"
                       :label="item.childName"
                       :value="item.childUuid"
                       :key="item.childUuid"></el-option>
          </el-select>
          <el-popover placement="top-start"
                      title="标题"
                      width="200"
                      trigger="click">
            <div class="i-tree">
              <el-input prefix-icon="el-icon-search"
                        placeholder="输入关键字进行过滤"
                        v-model="filterText"></el-input>
              <el-tree :data="data"
                       :props="defaultProps"
                       node-key="id"
                       :indent="10"
                       ref="tree1"
                       lazy
                       :load="loadNode"
                       :filter-node-method="filterNode"
                       :highlight-current="true"
                       :expand-on-click-node="false"
                       :default-expanded-keys="defaultExpandedKeys"
                       @node-click="handleNodeClick">
                <!--    node.data.myChildren       -->
              </el-tree>
            </div>
            <div class="selectMask"
                 slot="reference">
              <el-select v-model="unitChoose"
                         placeholder="请选择单元"
                         style="width: 120px;position: relative;"></el-select>
              <div class="maskCon"></div>
            </div>
          </el-popover>
          <el-popover placement="top-start"
                      title="标题"
                      width="200"
                      trigger="click">
            <div class="i-tree">
              <el-input prefix-icon="el-icon-search"
                        placeholder="输入关键字进行过滤"
                        v-model="filterText2"></el-input>
              <el-tree :data="data2"
                       :props="defaultProps1"
                       node-key="id"
                       :indent="10"
                       ref="tree2"
                       :filter-node-method="filterNode1"
                       :highlight-current="true"
                       :expand-on-click-node="false"
                       :default-expanded-keys="defaultExpandedKeys"
                       @node-click="handleNodeClick1">
                <!--    node.data.myChildren       -->
              </el-tree>
            </div>
            <div class="selectMask"
                 slot="reference"
                 style="margin: 0 5px 0 5px">
              <el-select v-model="roomChoose"
                         placeholder="请选择室"
                         style="width: 120px;"></el-select>
              <div class="maskCon"></div>
            </div>
          </el-popover>
          <div class="marRight">总人口：{{totalPeopleNumber}}人</div>
          <div>重点关注人员： {{totalFocuseNumber}}人</div>
          <el-popover placement="top-start"
                      class="popverTree"
                      title="标题"
                      width="200"
                      trigger="hover"></el-popover>
        </div>
        <div class="right">
          <el-button type="primary"
                     :disabled="!ShowAuthDisabled"
                     style="width: 100px;"
                     class="search"
                     @click="goBack()">
            <img src="@/assets/images/ActualPopulation/back.png" />返回
          </el-button>
        </div>
      </div>
      <div class="bottom">
        <div class="inforWrap">
          <div class="singleCell2"
               id="singleCell2"
               v-for="(o, index) in tableData"
               :key="index"
               @mouseover.stop="idx = index,isOperationMask=true"
               @mouseleave.stop="isOperationMask=false">
            <!--右上角三角形-->
            <div v-if="tableData.length>index">
              <div class="boxWrap"
                   v-if="tableData[tableData.length-index-1].isFocus">
                <div id="box"></div>
                <div id="box1"></div>
                <div id="textWrap1">重</div>
                <div id="textWrap2">点</div>
              </div>
            </div>
            <div id="mainImg2"
                 style="overflow: hidden;">
              <img :src="tableData.length>index?(tableData[tableData.length-index-1].photoUri?WIamgeurl + tableData[tableData.length-index-1].photoUri:require('@/assets/images/user.png')):require('@/assets/images/user.png')"
                   class="mainImg2"
                   @click="showPeople(index)"
                   id="mainImg2" />
            </div>
            <div class="listTextWrap">
              <div class="singleText singleText1"
                   style="white-space: nowrap;"
                   @mouseover="mymouseover"
                   @mouseout="mymouseout"
                   @mousemove="mymousemove">
                <span :title='tableData.length>index?tableData[tableData.length-index-1].staffName:"姓名"'>{{tableData.length>index?tableData[tableData.length-index-1].staffName:"姓名"}}</span>
                <span v-if="tableData.length>index"
                      style="white-space: nowrap;">
                  <span v-if="tableData[tableData.length-index-1].gender=='male'">男</span>
                  <span v-if="tableData[tableData.length-index-1].gender=='female'">女</span>
                  <span v-if="tableData[tableData.length-index-1].staffType"
                        style="white-space: nowrap;"
                        :title="$common.transferEnumItemName($store.getters.GET_STAFFOPTIONS, tableData[tableData.length-index-1].staffType)">{{$common.transferEnumItemName($store.getters.GET_STAFFOPTIONS, tableData[tableData.length-index-1].staffType)}}</span>
                </span>
              </div>
              <div class="singleText singleText1"
                   @mouseover="mymouseover"
                   @mouseout="mymouseout"
                   @mousemove="mymousemove">{{tableData.length>index?tableData[tableData.length-index-1].address:"住址"}}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="footer">
      <el-pagination background
                     layout="total, prev, pager, next, jumper"
                     :page-size="pageInfo.pageSize"
                     :current-page="pageInfo.currentPage"
                     @current-change="handleCurrentChange"
                     :total="pageInfo.total"></el-pagination>
    </div>
  </div>
</template>
<script>
import * as api from "../ajax";
import * as Api from "../../utils/town";
import icons from "@/common/icon.js";
import RestApi from "@/utils/RestApi.js";
import { mouseover, mouseout, mousemove } from "@/common/mouse.js"; // 注意路径
export default {
  name: "wrap",
  props: {
    tabName: {
      type: String,
      default() {
        return "";
      }
    },
    tabMap: {
      type: Object,
      default() {
        return {
          organiza: "TheCompanyTable",
          tag: "TheTagTable"
        };
      }
    },
    ShowAuthDisabled: {
      type: Boolean,
      default() {
        return false;
      }
    },
    OwnAuthDisabled: {
      type: Boolean,
      default() {
        return false;
      }
    }
  },
  components: {},
  data() {
    return {
      selectData: [],
      activeProject: "",
      mainListLoading1: false,
      peopleStaffUuid: "",
      WIamgeurl: RestApi.api.imageUrl,
      totalPeopleNumber: "0",
      totalFocuseNumber: "0",
      infrastructureUuid: "",
      filterText: "",
      filterText2: "",
      data2: [],
      lastLevelType: "",
      node: "", // 用于存储当前的操作的节点
      nodeValue: "", // 值
      icons,
      defaultExpandedKeys: [],
      defaultProps: {
        children: "children",
        label: "label",
        isLeaf: "leaf"
      },
      defaultProps1: {
        children: "house",
        label: "label",
        isLeaf: "house"
      },
      data: [],
      deviceTypeArr: [],
      localService: [],
      isShowEdit: false,
      editEquipMentDialgoVisible: true,
      row: {},
      deviceUuid: "",
      viewType: "door",
      netStatus: "offline",
      update: 0, // 新建一个int变量，监听他来进行修改数据
      unitChoose: "",
      tableData: [],
      isResize: true,
      pageInfo: {
        total: 0,
        pageSize: 24,
        currentPage: 1
      },
      upAddress: "",
      labelArr: [],
      upAddress1: "",
      labelArr1: [],
      isLastAdress: false,
      roomChoose: ""
    };
  },
  computed: {
    isLevelOne() {
      return this.$store.state.home.projectType.platformLevel;
    }
  },
  activated() {
    // this.initDoorAccess();
    // this.initVisitorAccess();
    // this.isResize = true;
    // this.initData();
    // this.initImageWidth();
  },
  mounted() {
    // let height =
    //   window.innerHeight ||
    //   document.documentElement.clientHeight ||
    //   document.body.clientHeight;
    // this.pageInfo.pageSize = parseInt((height - 150) / 200) * 6;
    console.log("pageSize====", this.pageInfo.pageSize);
    // this.initData();
    window.addEventListener("resize", this.resizeHandle1);
    this.isLevelOne === "levelTwo"
      ? this.handleGetAllProject()
      : this.handleGetUnit();
  },
  destroyed() {
    /* 窗口变化时自适应 步骤三 组件被注销时，缩放函数是匿名函数，且仍然在事件监听列表中，
    因此匿名函数和匿名函数中用到的外部变量在组件注销后均不会被清理。
     所以要手动清理 */
    window.removeEventListener("resize", this.resizeHandle1);
  },
  beforeDestroy() {
    window.removeEventListener("resize", this.resizeHandle1);
  },
  deactivated() {
    this.isResize = false;
  },
  methods: {
    handleGetUnit() {
      this.initData();
    },
    handleGetAllProject() {
      Api.getStreetList({
        projectName: "",
        limit: 1000000,
        page: 1
      })
        .then(res => {
          let list = res.data.data.list;
          this.selectData = [...list];
          if (this.selectData.length) {
            this.activeProject = this.selectData[0].childUuid;
          } else {
            this.activeProject = "";
          }
          this.handleGetUnit();
        })
        .catch(err => {
          console.log(err);
        });
    },
    handleStreetChange() {
      // this.handleGetUnit();
      // let data = "";
      // if (this.isPower === true) {
      //   data = "power";
      // } else {
      //   data = "equipment";
      // }
      // this.switchTab(data);
    },
    resizeHandle1() {},
    // 鼠标划过覆盖的hover弹窗事件
    mymouseover: event => {
      mouseover(event);
    },
    mymouseout(event) {
      mouseout(event);
    },
    mymousemove(event) {
      mousemove(event);
    },
    showPeople(index) {
      console.log(this.tableData[index]);
      // console.log(index);
      index = this.tableData.length - index - 1;
      if (this.tableData[index].staffType === "visitor") {
        return;
      }
      let data = this.tableData[index];
      this.$bus.$emit("showPersonFiles", {
        projectUuid: this.activeProject,
        staffUuid: data.staffUuid,
        subModuleName: "实有人口",
        staffName: data.staffName,
        address: data.address,
        moduleName:
          this.$store.state.home.projectType.platformLevel === "levelTwo"
            ? "居委看板"
            : "社区看板"
      });
    },
    getPeopleList() {
      this.mainListLoading1 = true;
      this.tableData = [];
      // let id = this.infrastructureUuid;
      let dada = {
        page: this.pageInfo.currentPage,
        limit: this.pageInfo.pageSize
      };
      let data2 = {
        infrastructureUuid: this.infrastructureUuid,
        projectUuid: this.activeProject
      };
      let parms = {
        dada: dada,
        data2: data2
      };
      api
        .getPeopleList(parms)
        .then(res => {
          if (res.data.success) {
            this.pageInfo.total = res.data.data.total;
            this.tableData = res.data.data.list.reverse();
            // this.tableData = res.data.data.list.reverse();
            setTimeout(() => {
              this.initImageWidth();
            }, 0);
          }
          // this.newTagName = "";
          this.mainListLoading1 = false;
        })
        .catch(err => {
          this.mainListLoading1 = false;
          console.log("请求错误：" + err);
        });
    },
    getPeopleStatistics() {
      this.totalPeopleNumber = "0";
      this.totalFocuseNumber = "0";
      // let id = this.infrastructureUuid;
      let data2 = {
        infrastructureUuid: this.infrastructureUuid,
        projectUuid: this.activeProject
      };
      let data = {};
      let parms = {
        data2: data2,
        data: data
      };
      api.getPeopleStatistics(parms).then(res => {
        if (res.data.success) {
          this.totalPeopleNumber = res.data.data.total
            ? res.data.data.total
            : "0";
          this.totalFocuseNumber = res.data.data.focusCount
            ? res.data.data.focusCount
            : "0";
          // console.log("获取人员类型统计数据===", res.data.data);
          // this.pieData[0].value = res.data.data.census_staff;
          // this.pieData[1].value = res.data.data.come_shanghai_staff;
          // this.pieData[2].value = res.data.data.foreign_staff;
          // setTimeout(() => {
          //   this.startDraw();
          // }, 0);
          // this.importantArr = res.data.data;
          // debugger;
          // this.addTagDialogVisible = !this.addTagDialogVisible;
          // console.log("居民标签添加成功", res.data);
          // this.getOrgTag("add");
        }
        // this.newTagName = "";
      });
    },
    initImageWidth() {
      let length1 = document.getElementById("singleCell2").offsetWidth;
      let elems = document.querySelectorAll("#mainImg2");
      for (let index = 0; index < elems.length; index++) {
        elems[index].style.width = length1 + "px";
        elems[index].style.height = length1 + "px";
        console.log("length1==", Number(length1) + 60 + "px");
      }
    },
    changeViewType(viewType) {
      this.viewType = viewType;
    },
    serverList(arr, viewType) {
      this.localService = arr;
      this.viewType = viewType;
    },
    changeDevTypeArr(arr) {
      this.deviceTypeArr = arr;
    },
    updateTree(uuid) {
      this.$emit("updateTree", uuid);
    },
    showEdit(deviceUuid, netStatus) {
      this.row = {};
      this.deviceUuid = deviceUuid;
    },
    hiddenEdit(isSuccess) {
      this.isShowEdit = false;
      if (isSuccess) {
        this.$refs.tabList.getTableData();
      }
    },
    goBack() {
      this.$router.go(-1);
    },
    handleCurrentChange(val) {
      this.pageInfo.currentPage = val;
      this.getPeopleList();
    },
    // 根据点击树节点的id获取当前节点的字节
    loadNode(node, resolve) {
      console.log("id===", node.data.id);
      if (node.level === 0) {
        resolve([]);
        return;
      }
      node.data.projectUuid = this.activeProject;
      this.$ResidentManageAjax
        .getResidentLeftMenuSubDataApi(node.data)
        .then(res => {
          console.log("res===", res.data.data);
          if (res.data.data && res.data.data.length) {
            for (let item of res.data.data) {
              if (
                item.nodeType === "area" ||
                item.nodeType === "phase" ||
                item.nodeType === "unit" ||
                item.nodeType === "building"
              ) {
                this.$set(item, "leaf", true);
                if (item.nextCount !== 0) {
                  this.$set(item, "leaf", false);
                } else {
                  this.getFloorAndHouse(item);
                }
              } else {
                this.$set(item, "leaf", false);
                break;
              }
            }
            resolve(res.data.data);
          } else {
            resolve([]);
          }
        });
    },
    loadNode1(node, resolve) {
      console.log("node===", node.data);
      // if (node.level === 0) {
      //   resolve([]);
      //   return;
      // }
      if (node.data.house) {
        // this.$set(node.data, "leaf", true);
        resolve(node.data.house);
        // this.$set(node, "isLeaf", true);
      } else {
        // this.$set(node.data, "leaf", false);
        resolve([]);
        // this.$set(node, "isLeaf", true);
      }
      // if (data.house.indexOf(obj) !== -1) {
      //   return true;
      // } else {
      //   return false;
      // }
    },
    filterNode(obj, data) {
      if (data.label.indexOf(obj) !== -1) {
        return true;
      } else {
        return false;
      }
    },
    filterNode1(obj, data) {
      if (data.label.indexOf(obj) !== -1) {
        return true;
      } else {
        return false;
      }
    },
    handleNodeClick(data, node, component) {
      console.log("-------------", node.data.leaf);
      this.unitChoose = "";
      this.roomChoose = "";
      this.resetData();
      this.getLabelArr(node);
      this.getUpAddress(this.labelArr);
      data.name = this.upAddress;
      if (node.data.leaf === true) {
        this.unitChoose = this.upAddress;
        // if (this.isLastAdress === false) {
        //   this.getLabelArr(node);
        //   this.getUpAddress(this.labelArr);
        //   // data.name = this.upAddress;
        //   this.unitChoose = this.upAddress;
        //   // this.isLastAdress = true
        // }
        this.data2 = [];
        this.getFloorAndHouse(node.data);
        console.log("最后一个楼栋", node.data);
        console.log("地址", this.upAddress);
        this.infrastructureUuid = node.data.id;
        this.pageInfo.currentPage = 1;
        this.pageInfo.total = 0;
        this.getPeopleList();
        this.getPeopleStatistics();
      }
      console.log("node.data===", node.data);
      if (node.data.extInfo) {
        this.infrastructureUuid = this.totalUuid;
        this.getPeopleList();
        this.getPeopleStatistics();
      }
      // data.name = this.upAddress;
      // this.$store.commit("SET_LEFT_MENU_Data", data);
      // this.appendNodeOptions = data.children;
      // if (this.currentNode && this.currentNode === node) {
      //   // this.isExpanded = !this.isExpanded;
      //   // this.$set(node, "expanded", this.isExpanded);
      //   // 点击
      //   if (this.isExpanded && node.level !== 1) {
      //     this.defaultExpandedKeys.push(data.id);
      //     // this.setChild(node);
      //     // 传值
      //   } else {
      //     var index = this.defaultExpandedKeys.indexOf(node.data.id);
      //     this.defaultExpandedKeys.splice(index, 1);
      //   }
      //   console.log("data111", node.data);
      //   if(node.data.leaf===this.lastLevelType) {
      //     console.log("最后一个单元");
      //     return;
      //   }
      // } else {
      //   // this.$set(node, "expanded", false);
      //   console.log("data2222", node.data);
      //   this.currentNode = node;
      //   // this.isExpanded = false;
      // }
    },
    handleNodeClick1(data, node, component) {
      console.log("-------------", node.data);
      this.roomChoose = "";
      this.resetData1();
      this.getLabelArr1(node);
      this.getUpAddress1(this.labelArr1);
      data.name = this.upAddress1;
      if (node.data.nextCount === 0) {
        this.roomChoose = this.upAddress1;
        // if (this.isLastAdress === false) {
        //   this.getLabelArr(node);
        //   this.getUpAddress(this.labelArr);
        //   // data.name = this.upAddress;
        //   this.unitChoose = this.upAddress;
        //   // this.isLastAdress = true
        // }
        this.getFloorAndHouse(node.data);
        console.log("最后一个室", node.data);
        console.log("地址", this.upAddress1);
        this.infrastructureUuid = node.data.id;
        this.pageInfo.currentPage = 1;
        this.pageInfo.total = 0;
        this.getPeopleList();
        this.getPeopleStatistics();
      }

      // data.name = this.upAddress;
      // this.$store.commit("SET_LEFT_MENU_Data", data);
      // this.appendNodeOptions = data.children;
      // if (this.currentNode && this.currentNode === node) {
      //   // this.isExpanded = !this.isExpanded;
      //   // this.$set(node, "expanded", this.isExpanded);
      //   // 点击
      //   if (this.isExpanded && node.level !== 1) {
      //     this.defaultExpandedKeys.push(data.id);
      //     // this.setChild(node);
      //     // 传值
      //   } else {
      //     var index = this.defaultExpandedKeys.indexOf(node.data.id);
      //     this.defaultExpandedKeys.splice(index, 1);
      //   }
      //   console.log("data111", node.data);
      //   if(node.data.leaf===this.lastLevelType) {
      //     console.log("最后一个单元");
      //     return;
      //   }
      // } else {
      //   // this.$set(node, "expanded", false);
      //   console.log("data2222", node.data);
      //   this.currentNode = node;
      //   // this.isExpanded = false;
      // }
    },
    getFloorAndHouse(item) {
      // 获取层数和房屋
      console.log("item====", item);
      item.projectUuid = this.activeProject;
      this.$ResidentManageAjax.getFloorAndHouse(item).then(res => {
        if (res.data.data && res.data.data.length) {
          console.log("获取层数和房屋", res.data.data);
          this.data2 = res.data.data;
          // this.$set(item, "myChildren", res.data.data);
        }
      });
    },
    // 初始化刷新树的结构
    initData() {
      let data = {
        projectUuid: this.activeProject
      };
      this.$ResidentManageAjax.getResidentTreeDataApi(data).then(res => {
        console.log(res.data);
        this.data = [];
        if (res.data.success && res.data.data) {
          this.infrastructureUuid = res.data.data.id;
          this.totalUuid = res.data.data.id;
          this.getPeopleList();
          this.getPeopleStatistics();
          this.data.push(res.data.data);
          this.defaultExpandedKeys.push(this.data[0].id);
          this.appendNodeOptions = [];
          this.appendNodeOptions.push(this.data);
          let checkedData = this.data[0];
          checkedData.name = checkedData.label;
          this.setLastLevelType(res.data.data.extInfo);
          this.$store.commit("SET_LEFT_MENU_Data", checkedData);
        } else {
          this.$message({
            type: "warning",
            message: "没有获取到居民基建树"
          });
        }
      });
    },
    resetData() {
      this.labelArr = [];
      this.upAddress = "";
    },
    resetData1() {
      this.labelArr1 = [];
      this.upAddress1 = "";
    },
    iconShow(node) {
      let icon = "";
      if (!node) {
        icon = require("@/assets/images/building/area.png");
      } else {
        let type = node.data.nodeType;
        if (type === "infrastructure") {
          type = "area";
        } else if (type === "house") {
          icon = icons.folder;
          return icon;
        }
        icon = require(`@/assets/images/building/${type}.png`);
      }
      return icon;
    },
    setLastLevelType(data) {
      if (!data) {
        return;
      }
      for (let index in data) {
        if (parseInt(index) === data.length - 1) {
          this.lastLevelType = data[index].type;
        }
      }
      console.log("lastLevelType==", this.lastLevelType);
    },
    // getFloorAndHouse(item) {
    //   this.$ResidentManageAjax.getFloorAndHouse(item.id).then(res => {
    //     if (res.data.data && res.data.data.length) {
    //       this.$set(item, "myChildren", res.data.data);
    //     }
    //   });
    // },
    getLabelArr(node) {
      if (!node) {
        if (this.labelArr.length !== 0) {
          this.labelArr.pop();
        }
        return;
      }
      this.labelArr.push(node.data.label);
      this.getLabelArr(node.parent);
    },
    getLabelArr1(node) {
      if (!node) {
        if (this.labelArr1.length !== 0) {
          this.labelArr1.pop();
        }
        return;
      }
      this.labelArr1.push(node.data.label);
      this.getLabelArr1(node.parent);
    },
    getUpAddress(labelArr) {
      if (!this.labelArr || this.labelArr.length === 0) {
        return;
      }
      if (!this.upAddress) {
        this.upAddress = this.labelArr.pop();
      } else {
        this.upAddress = `${this.upAddress}／${this.labelArr.pop()}`;
      }
      this.getUpAddress(this.labelArr);
    },
    getUpAddress1(labelArr) {
      if (!this.labelArr1 || this.labelArr1.length === 0) {
        return;
      }
      if (!this.upAddress1) {
        this.upAddress1 = this.labelArr1.pop();
      } else {
        this.upAddress1 = `${this.upAddress1}／${this.labelArr1.pop()}`;
      }
      this.getUpAddress1(this.labelArr1);
    }
  },
  watch: {
    tabName() {
      this.isShowEdit = false;
    },
    filterText(val) {
      this.$refs["tree1"].filter(val);
    },
    filterText2(val) {
      this.$refs["tree2"].filter(val);
    },
    activeProject(val) {
      if (val) {
        // this.projectId = val;
        // console.log("val===", val);
        this.initData();
        this.$emit("activeProject", this.activeProject);
      }
    }
  }
};
</script>
<style>
.el-popover__title {
  display: none;
  margin-bottom: 0px !important;
}
</style>

<style style="scss" scoped>
#MyContent {
  width: 100%;
  height: 100%;
  overflow: auto;
}
.content .boxWrap {
  width: 100%;
  height: 40px;
  position: absolute;
  left: 0;
  top: 0;
}
.content .contentWrap {
  width: 100%;
}
.content .contentWrap .selectMask {
  width: 120px;
  height: 34px;
  position: relative;
}
.content .contentWrap .selectMask .maskCon {
  width: 120px;
  height: 34px;
  position: absolute;
  left: 0;
  top: 0;
  opacity: 0;
  z-index: 120;
  width: 120px;
  height: 34px;
  cursor: pointer;
}
.content #textWrap1 {
  width: 12px;
  height: 12px;
  -webkit-transform: rotate(-315deg);
  transform: rotate(-302deg);
  font-family: PingFangSC-Regular;
  font-size: 12px;
  color: #ff5f5f;
  text-align: justify;
  position: absolute;
  right: 9px;
  top: 6px;
}
.content #textWrap2 {
  width: 12px;
  height: 12px;
  -webkit-transform: rotate(-315deg);
  transform: rotate(-677deg);
  font-family: PingFangSC-Regular;
  font-size: 12px;
  color: #ff5f5f;
  text-align: justify;
  position: absolute;
  right: 1px;
  top: 14px;
}
.content #box {
  width: 100%;
  height: 40px;
  border: 4px solid transparent;
  background-color: transparent;
  position: relative;
}
.content #box::before,
.content #box::after {
  content: "";
  position: absolute;
  top: 0;
  right: 0;
  border-color: transparent;
  border-style: solid;
}
.content #box::before {
  border-width: 1.5em;
  border-right-color: transparent;
  border-top-color: transparent;
}
.content #box::after {
  border-radius: 0.4em;
  border-width: 1.35em;
  border-right-color: rgba(0, 0, 0, 0.3);
  border-top-color: rgba(0, 0, 0, 0.3);
  /*      border-bottom: 100px solid red;
      border-left: 50px solid transparent;
      border-right: 50px solid transparent; */
  /* width: 100px;  */
}
.content {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
}
.content .header {
  width: 100%;
  height: 80px;
  border-bottom: 1px dashed rgba(255, 255, 255, 0.24);
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  position: relative;
}
.content .header .left {
  flex: 1;
  height: 80px;
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: center;
  font-family: PingFangSC-Regular;
  font-size: 18px;
  color: #dddddd;
  text-align: justify;
}
.content .header .left .marRight {
  margin-right: 10px;
}
.content .header .right {
  width: 120px;
  height: 80px;
  display: flex;
  flex-direction: row;
  justify-content: flex-end;
  align-items: center;
}
.content .header .right .el-button--primary {
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
}
.content .header .right img {
  width: 14.2px;
  height: 16px;
  margin-right: 7.8px;
  position: relative;
  top: 3px;
}
.content .el-input.is-disabled .el-input__inner {
  border-color: black;
}
.content .bottom .inforWrap {
  width: 100%;
  height: 880px;
  padding-top: 20px;
}
.content .bottom .inforWrap .singleCell2 {
  width: 14.46%;
  /*  height: 200px;*/
  background: rgba(0, 0, 0, 0.1);
  /*   border: 1px solid rgba(255, 255, 255, 0.1);*/
  /*    border-radius: 2px;*/
  /*   padding: 8px 8px 0 8px;*/
  box-sizing: border-box;
  position: relative;
  float: left;
  margin-right: 2.5%;
  margin-bottom: 22px;
  overflow: hidden;
}
.content .bottom .inforWrap .singleCell2:nth-child(6n) {
  margin-right: 0;
}
.mainImg2 {
  cursor: pointer;
}
/*  .content .bottom .inforWrap .singleCell2 div {
    font-family: PingFangSC-Regular;
    font-size: 12px;
    color: #dddddd;
    letter-spacing: 0;
    text-align: center;
    margin-bottom: 2px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }*/
.content .bottom .inforWrap .singleCell2 .box {
  position: absolute;
  left: 16px;
  top: 16px;
}
.content .bottom .inforWrap.singleCell2 .operationMask {
  width: 120px;
  height: 108px;
  background: #2a2e31;
  box-shadow: 0 2px 30px 0 rgba(0, 0, 0, 0.2);
  position: absolute;
  left: 40px;
  top: 80px;
  z-index: 8000;
}
/*  .content .bottom .inforWrap .singleCell2 .operationMask div {
    width: 100%;
    height: 36px;
    display: flex;
    flex-direction: row;
    align-items: center;
    padding-left: 16px;
    box-sizing: border-box;
  }*/
.content .bottom .inforWrap .singleCell2 .operationMask div:hover {
  background: rgba(40, 255, 187, 0.05);
}
.content .bottom .inforWrap .singleCell2 .operationMask img {
  margin-right: 10px;
}
.content .listTextWrap {
  width: 100%;
  height: 60px;
  background: rgba(255, 255, 255, 0.05);
  overflow: hidden;
  display: flex;
  flex-direction: column;
  justify-content: space-evenly;
  align-items: center;
  /* padding: 10px 0;
    box-sizing: border-box;*/
}
.content .listTextWrap .singleText {
  font-family: PingFangSC-Regular;
  font-size: 14px;
  color: #dddddd;
  letter-spacing: 0;
  text-align: center;
  /*overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  width: 100%;*/
  line-height: 14px;
}
.content .listTextWrap .singleText1 {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  width: 100%;
}
.content .footer {
  /*margin-top: 30px;*/
  width: 100%;
  display: flex;
  justify-content: center;
}
.content .i-tree {
  box-sizing: border-box;
}
.content .i-tree .i-tree-item {
  width: 100%;
}
.content .i-tree .i-tree-item .i-tree-item-icon {
  display: flex;
  align-items: center;
}
.content .i-tree .i-tree-item-icon .action-icon {
  margin-left: auto;
  margin-right: 10px;
  cursor: pointer;
}
.content .popverTree {
  width: 215px;
  position: absolute;
  top: 10px;
  left: 10px;
}
</style>
<style lang="scss" scoped>
@import "@/style/variables.scss";

.content {
  // width: calc(100% - #{$equLeftMenuWidth});
  // height: 100%;
  // padding: $rightContentMargin;
  // box-sizing: border-box;
  width: 100%;
  flex: 1;
  // opacity: 0.7;
  // background: #212325;
  background: rgba(33, 35, 37, 0.7);
  box-shadow: 0 2px 8px 0 rgba(0, 0, 0, 0.2);
  padding: 0 30px;
  box-sizing: border-box;
}
</style>
