<template>
  <el-row class="treeTabs">
    <div v-if="showInput">
      <el-input class="el_input"
                prefix-icon="el-icon-search"
                placeholder="输入关键字进行过滤"
                v-model="filterText"></el-input>
      <el-select v-model="selectValue"
                 v-if="options.length"
                 @change="changeOptions"
                 style="width:100%;"
                 placeholder="请选择">
        <el-option v-for="item in options"
                   :key="item.value"
                   :label="item.label"
                   :value="item.value"></el-option>
      </el-select>
    </div>
    <div class="dialog-content">
      <div class="i-tree">
        <el-tree class="filter-tree"
                 :show-checkbox="false"
                 :check-strictly="true"
                 :highlight-current="true"
                 :indent="10"
                 :expand-on-click-node="false"
                 :data="treeData"
                 lazy
                 :load="loadNode"
                 :props="defaultProps"
                 :node-key="nodeKey"
                 :default-expanded-keys="defaultExpandedKeys"
                 @check-change="checkChange"
                 @node-click="nodeClick"
                 :filter-node-method="filterNode"
                 ref="treeRef">
          <div class="custom-tree-node i-tree-item"
               slot-scope="{ node, data}">
            <div class="i-tree-item-icon">
              {{ node.label }}
              <template v-if="!radio">
                <img v-if="(node.checked)"
                     src="@/assets/images/doorAccess/checked_icon.png"
                     width="10.9px"
                     height="9px"
                     style="margin-right: 20%;">
              </template>
              <template v-else>
                <img v-if="(node.checked && currentNodeId === data.id)"
                     src="@/assets/images/doorAccess/checked_icon.png"
                     width="10.9px"
                     height="9px"
                     style="margin-right: 20%;">
              </template>
            </div>
          </div>
        </el-tree>
      </div>
    </div>
  </el-row>
</template>
<script>
import icons from "@/common/icon.js";
import * as api from "@/pages/equipmentMange/ajax.js";
export default {
  components: {},
  props: {
    radio: {
      type: Boolean,
      default: false
    },
    hasDoor: {
      type: Boolean,
      default: true
    },
    searchText: {
      type: String,
      default() {
        return "";
      }
    },
    options: {
      type: Array,
      default() {
        return [];
      }
    },
    treeNodeType: {
      type: String,
      default() {
        return "staff";
      }
    },
    treeType: {
      type: String,
      default: "person"
    },
    searchType: {
      type: String,
      default() {
        return "";
      }
    },
    treeLeafType: {
      type: String,
      default: ""
    },
    showInput: {
      type: Boolean,
      default: true
    },
    visible: {
      type: Boolean,
      default: false
    },
    checkedKeys: {
      type: Array,
      default: () => []
    },
    checkeTreedNodes: {
      type: Array,
      default: () => []
    },
    selectSingleNode: {
      type: String,
      default() {
        return "";
      }
    }
  },
  data() {
    return {
      icons,
      selectValue: null,
      filterText: "",
      activeName: "",
      inputModel: "",
      isCurrentShow: false,
      data2: [],
      defaultProps: {
        children: "children",
        label: "label",
        isLeaf: "isLeaf"
      },
      defaultExpandedKeys: [],
      checkedNodes: {},
      isSetChange: false,
      orgType: "device",
      treeData: [],
      deviceTreeData: [],
      residentTagData: [],
      personTreeData: [],
      personTagData: [],
      deviceTagData: [],
      buildTreeData: [],
      nodeKey: "id",
      needType: "staffAndOrg",
      flag: false,
      currentNodeId: false
    };
  },
  created() {},
  mounted() {},
  methods: {
    init() {
      if (this.treeType === "resident") {
        this.initResidentData();
      } else {
        this.needType =
          this.treeType === "person" ? "staffAndOrg" : "orgAndDev";
        this.needType = this.treeType === "department" ? "" : this.needType;
        if (this.treeType === "orgAndAllDev") {
          this.needType = "orgAndAllDev";
        }
        this.getPersonData();
      }
    },
    nodeClick(data, node, nodeTree) {
      // 新增选择节点的类型字段，只有当点击节点type跟传进来的type一样才会选中
      if (this.selectSingleNode !== "" && this.selectSingleNode !== data.type) {
        return;
      }
      var tree = this.activeName;
      var checked = true;
      console.log(node);
      let i = this.defaultExpandedKeys.indexOf(data.id);
      this.currentNodeId = data.id;
      if (node.checked) {
        checked = false;
        // this.defaultExpandedKeys.splice(i, 1);
      } else {
        // this.defaultExpandedKeys.push(data.id);
      }
      // 判断是否单选，并且是否是最末一级
      if (this.radio && !node.isLeaf) {
        console.log(data.nodeType);
        checked = false;
      }
      // 判断：单选、节点类型、树类型 针对wang yi fei数据类型判断
      if (
        this.radio &&
        data.nodeType !== "door" &&
        this.treeType === "resident"
      ) {
        checked = false;
      }
      //判断：单选、节点类型， 树类型 针对zhengyu 接口数据类型判断
      if (this.radio && data.type !== "door" && this.treeType !== "person") {
        checked = false;
      }

      // 组织设备树，设备只选择到通道， 节点不被选择，
      if (
        this.treeLeafType === "channel" &&
        this.treeType !== "resident" &&
        data.type !== "readHead"
      ) {
        checked = false;
      }
      // 基建树，设备只选择到通道， 节点不被选择，
      if (
        this.treeType === "resident" &&
        this.treeLeafType === "channel" &&
        data.nodeType !== "readhead"
      ) {
        checked = false;
      }
      if (
        this.treeType === "orgAndDev" &&
        this.treeLeafType === "device" &&
        data.hasOwnProperty("deviceType")
      ) {
        checked = true;
      }
      if (
        this.treeType === "resident" &&
        this.treeLeafType === "device" &&
        data.type === "access_ctrl"
      ) {
        checked = true;
      }
      // this.$set(node, "expanded", checked);
      this.$set(node, "checked", checked);
      // this.$set(data, "selected", checked);
      // this.$refs.treeRef.setCheckedKeys(this.defaultExpandedKeys);
      data.chnType = this.selectValue;
      this.$emit("transferCheckedNodes", data, checked, tree);
    },
    //获取人力资源组织架构
    getPersonData() {
      let data = {
        parentOrgUuid: "",
        needType: this.needType
      };
      this.getAjaxOrgTree(data);
    },
    // 组织机构请求
    getAjaxOrgTree(data) {
      this.orgType = this.treeType === "person" ? "staff" : "device";
      this.orgType = this.treeType === "department" ? "staff" : this.orgType;

      api.getOrgTree(data, this.orgType).then(res => {
        console.log(res.data.data);
        if (res.data.data) {
          this.treeData = [];
          res.data.data.forEach(element => {
            if (element.nextCount === "0" || element.nextCount === 0) {
              element.isLeaf = true;
            }
            this.treeData.push(element);
          });
          this.defaultExpandedKeys = [];
          console.log(this.treeData[0].id);
          this.defaultExpandedKeys.push(this.treeData[0].id);
          console.log(this.defaultExpandedKeys);
        } else {
          this.$message({
            type: "warning",
            message: "没有获取到组织树"
          });
        }
      });
    },
    // 获取住户信息
    initResidentData() {
      this.$ResidentManageAjax
        .getResidentTreeDataApi(this.defaultExpandedKeys)
        .then(res => {
          console.log(res.data);
          if (res.data.success && res.data.data) {
            this.treeData = [];
            this.treeData.push(res.data.data);
            this.defaultExpandedKeys = [];
            console.log(this.treeData[0]);
            this.defaultExpandedKeys.push(this.treeData[0].id);
          } else {
            this.$message({
              type: "warning",
              message: "居民基建树获取失败"
            });
          }
        });
    },
    // 根据点击树节点的id获取当前节点的字节
    /**
     * this.treeType
     * *当值为 resident 时， 表示该树为 楼顶房屋 基建树
     * *当值为 person 时，   表示该树为 人力资源 组织架构树
     * *当值为 orgAndDev时， 表示该树为 设备 组织架构树
     * *当值为 department时， 表示该树为 人力资源 组织架构树 末节点为部门
     *
     * 人力资源组织架构树和设备组织架构树为同一个接口
     *
     * this.treeNodeType
     * 当值为 staff 时      表示该树的末节点为 人员
     * 当值为 door 时       表示该树的末节点为 门
     * 当值为 device 时     表示该树的末节点为 设备
     * 当值为 channel 时    表示该树的末节点为 读头
     */
    loadNode(node, resolve) {
      if (this.treeType === "resident") {
        if (this.treeNodeType === "staff") {
          // pxy
          this.$ResidentManageAjax
            .getResidentTreeStaffNodeApi(node.data.id, node.data.nodeType)
            .then(res => {
              if (res.data.data && res.data.data.length) {
                let data = res.data.data;
                for (let i = 0, len = data.length; i < len; i++) {
                  if (parseInt(data[i].nextCount) === 0) {
                    data[i].isLeaf = true;
                    this.$set(data[i], "isLeaf", true);
                  }
                }
                resolve(data);
              } else {
                resolve([]);
              }
            });
        } else if (this.treeNodeType === "door") {
          // kj
          api.getIninfrastructureList(node.data.id).then(res => {
            if (res.data.data && res.data.data.length) {
              let data = res.data.data;
              for (let i = 0, len = data.length; i < len; i++) {
                if (parseInt(data[i].nextCount) === 0) {
                  data[i].isLeaf = true;
                }
              }
              resolve(data);
            } else {
              resolve([]);
            }
            this.$nextTick(() => {
              this.$refs.treeRef.filter({ value: this.selectValue, type: 1 });
            });
          });
        } else if (this.treeNodeType === "device") {
          // fyw
          this.$houseHttp
            .getInfrastructureToDevice({
              parentUuid: node.data.id
            })
            .then(res => {
              if (res.data.data && res.data.data.length) {
                let data = res.data.data;
                for (let i = 0, len = data.length; i < len; i++) {
                  if (parseInt(data[i].nextCount) === 0) {
                    data[i].isLeaf = true;
                  }
                }
                resolve(data);
              } else {
                resolve([]);
              }
              this.$nextTick(() => {
                this.$refs.treeRef.filter({ value: this.selectValue, type: 1 });
              });
            });
        } else if (this.treeNodeType === "channel") {
          // pxy
          this.$DoorSetAjax.getDoorReadingHeadApi(node.data.id).then(res => {
            if (res.data.data && res.data.data.length) {
              let data = res.data.data;
              for (let i = 0, len = data.length; i < len; i++) {
                if (parseInt(data[i].nextCount) === 0) {
                  data[i].isLeaf = true;
                  this.$set(data[i], "isLeaf", true);
                }
              }
              resolve(data);
            } else {
              resolve([]);
            }
            this.$nextTick(() => {
              this.$refs.treeRef.filter({ value: this.selectValue, type: 1 });
            });
          });
        } else {
          console.log("其他");
          resolve([]);
        }
      } else if (
        this.treeType === "person" ||
        this.treeType === "orgAndDev" ||
        this.treeType === "orgAndAllDev" ||
        this.treeType === "department"
      ) {
        // 当该节点为组织节点时 处理逻辑
        if (node.data.hasOwnProperty("orgType")) {
          // kj
          this.needType =
            this.treeType === "person" ? "staffAndOrg" : "orgAndDev";
          this.needType =
            this.treeType === "orgAndAllDev" ? "orgAndAllDev" : this.needType;
          let data = {
            parentOrgUuid: node.data.id,
            needType: this.needType
          };
          this.orgType = this.treeType === "person" ? "staff" : "device";
          this.orgType =
            this.treeType === "department" ? "staff" : this.orgType;

          api
            .getOrgTree(data, this.orgType)
            .then(
              res => {
                if (res.data.data && res.data.data.length) {
                  for (let i = 0; i < res.data.data.length; i++) {
                    if (
                      res.data.data[i].source === "staff" ||
                      res.data.data[i].nextCount === "0" ||
                      res.data.data[i].nextCount === 0 ||
                      (!res.data.data[i].hasOwnProperty("nextCount") &&
                        !this.hasDoor)
                    ) {
                      this.$set(res.data.data[i], "isLeaf", true);
                    }
                  }
                  resolve(res.data.data);
                } else {
                  resolve([]);
                }
              },
              () => {
                this.$set(node, "loading", false);
              }
            )
            .catch(err => {
              resolve([]);
            });
          // 当该节点为设备节点时 处理逻辑
        } else if (node.data.hasOwnProperty("deviceType")) {
          if (!this.hasDoor) {
            resolve([]);
            return;
          }
          // 当树的节点为设备时，想要拿取下面的读头通道
          if (this.treeNodeType === "channel") {
            // pxy
            this.$DoorSetAjax
              .getDeviceReadingHeadApi(node.data.id)
              .then(res => {
                if (res.data.data && res.data.data.length) {
                  let data = res.data.data;
                  for (let i = 0, len = data.length; i < len; i++) {
                    if (parseInt(data[i].nextCount) === 0) {
                      data[i].isLeaf = true;
                    }
                  }
                  resolve(data);
                } else {
                  resolve([]);
                }
              });
            // 当树的节点为设备时，想要拿取下面的门通道
          } else if (this.treeNodeType === "all") {
            api
              .getChnByD(node.data.deviceUuid)
              .then(
                res => {
                  if (res.data.data && res.data.data.length) {
                    for (let i = 0; i < res.data.data.length; i++) {
                      res.data.data[i].isLeaf = true;
                    }
                    resolve(res.data.data);
                  } else {
                    resolve([]);
                  }
                },
                () => {
                  this.$set(node, "loading", false);
                }
              )
              .catch(() => {
                this.$set(node, "loading", false);
              });
          } else {
            // kj
            api.getTDByDUuid(node.data.deviceUuid).then(
              res => {
                if (res.data.data && res.data.data.length) {
                  for (let i = 0; i < res.data.data.length; i++) {
                    res.data.data[i].isLeaf = true;
                  }
                  resolve(res.data.data);
                } else {
                  resolve([]);
                }
              },
              () => {
                this.$set(node, "loading", false);
              }
            );
          }
        } else {
          // 未知 树的节点
          resolve([]);
        }
      } else {
        // 未知类型的树
        resolve([]);
      }
    },
    checkChange(data, nodeBool, subNodeBool) {},
    changeOptions(val) {
      this.$refs.treeRef.filter({ value: val, type: 1 });
    },
    filterNode(obj, data) {
      if (data.hasOwnProperty("channelType")) {
        console.log(obj);
        console.log(data);
      }
      // obj 里面有type字段,0表示筛选value值，1表示筛选类型
      if (!obj.value) {
        return true;
      } else {
        if (obj.type == 0) {
          return data.label.indexOf(obj.value) !== -1;
        } else if (obj.type == 1) {
          if (data.hasOwnProperty("channelType")) {
            return data.channelType.indexOf(obj.value) !== -1;
          } else {
            return true;
          }
        }
      }
    },
    setkey() {
      var num = [];
      var numKeys = [];
      for (var i = 0, len = this.checkeTreedNodes.length; i < len; i++) {
        num.push(this.checkeTreedNodes[i]);
        numKeys.push(this.checkeTreedNodes[i].id);
      }
      if (this.$refs.treeRef) {
        this.$nextTick(() => {
          this.$refs.treeRef.setCheckedNodes(num);
          this.$refs.treeRef.setCheckedKeys(numKeys);
        });
      }
    }
  },
  watch: {
    visible: {
      handler(val, oldVal) {
        if (val) {
          this.init();
        } else {
          this.treeData = [];
        }
        this.$nextTick(() => {
          this.setkey();
        });
      },
      deep: true,
      immediate: true
    },
    residentTreeData(val) {},
    filterText(val) {
      this.$refs.treeRef.filter({ value: val, type: 0 });
    },
    searchText(val) {
      this.$refs.treeRef.filter({ value: val, type: 0 });
    },
    searchType(val) {
      this.$refs.treeRef.filter({ value: val, type: 1 });
    },
    activeName(val) {
      console.log("===activeName===", val);
      this.setkey();
    },
    checkedNodes(val) {
      // 向父组件传值
    },
    checkedKeys(val) {},
    checkeTreedNodes: {
      handler(newVal, oldVal) {
        this.setkey();
      },
      immediate: true,
      deep: true
    }
  },
  destroyed() {}
};
</script>
<style>
.el_input {
  margin-bottom: 10px;
}
.el-checkbox__input.is-indeterminate .el-checkbox__inner {
  background-color: transparent;
  border-color: #26d39d;
}
.treeTabs {
  height: 100%;
  overflow: auto;
}
.AntiBack .el-input__prefix {
  position: absolute;
  height: 100%;
  left: 5px !important;
  top: 0;
  text-align: center;
  color: #c0c4cc;
  -webkit-transition: all 0.3s;
  transition: all 0.3s;
  transform: translateX(0%);
}
.AntiBack .el-select {
  display: inline-block;
  position: relative;
  width: 80%;
}
.AntiBack .el-radio {
  margin: auto 15px auto 0;
}
</style>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
$line-color: #24473f;
@mixin setFontStyle($fontsize) {
  font-family: PingFangSC-Regular;
  font-size: $fontsize;
  color: #dddddd;
  letter-spacing: 0;
}
.dialog-content {
  display: flex;
  width: 100%;
  color: #dddddd;
  height: calc(100% - 45px);
  border-top: 0px dashed rgba(255, 255, 255, 0.1);
  .box {
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: space-around;
    padding: 10px 0px;
    margin: 0 25px;
    border-bottom: 1px dashed #2f2f2f;
    span {
      width: 20%;
      min-width: 100px;
      height: 40px;
      line-height: 40px;
    }
    .el-input {
      width: 80%;
    }
  }
  .el-main {
    padding: 10px 5px;
    margin: 0px;
  }
  .tabsBox {
    width: 100%;
    height: 100%;
    .el-tabs__nav .is-top {
      display: flex;
      justify-content: space-around;
      padding: 0 5px;
    }
  }
}
.right-contain {
  padding: 10px 15px;
  .el-checkbox {
    margin-right: 5px;
  }
  .tagBox {
    padding-top: 15px;
    box-sizing: border-box;
    .tableDiv {
      display: inline-flex;
    }
    .el-tag-class {
      margin: 15px 12px 0;
    }
  }
}
.i-tree {
  width: 100%;
  height: 100%;
  overflow: auto;
  padding: 10px 0;
  box-sizing: border-box;
  overflow: auto;
  .i-tree-item {
    width: 100%;
    .i-tree-item-icon {
      display: flex;
      align-items: center;
      justify-content: space-between;
      .action-icon {
        margin-left: auto;
        margin-right: 10px;
        cursor: pointer;
      }
    }
  }
}
.dialog-footer {
  border: {
    width: 1px 0 0 0;
    style: solid;
    color: $line-color;
  }
  .footer-button {
    margin: 17px 28px 17px 0;
  }
}
</style>
