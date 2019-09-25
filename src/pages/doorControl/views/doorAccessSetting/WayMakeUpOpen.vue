<template>
  <el-row class="WayMakeUpOpen" ref="mainWMHeight" type="flex">
    <el-col class="WMBox leftBox" :span="4">
      <el-header>
        <img class="img" src="../../../../assets/images/doorAccess/device_list_icon.png" alt>设备列表
      </el-header>
  <!--     <the-leftmenu @changetab="changetab" ref="leftMenu" @clickNode="clickNodeAll" needType="" tagType="devide"  orgType="devide"></the-leftmenu> -->
      <el-input prefix-icon="el-icon-search" placeholder="搜索设备地址" v-model="filterText" style="margin-bottom: 21px;"></el-input>
      <el-tree
        class="filter-tree"
        :show-checkbox="false"
        :check-strictly="false"
        :data="treeData"
        :props="defaultProps"
        node-key="id"
        @check-change="checkChange"
        @node-click="nodeClick"
        @current-change="currentChange"
        :filter-node-method="filterNode"
        :expand-on-click-node="true"
        ref="tree"
        :highlight-current="true"
        lazy
      >
         <div class="custom-tree-node i-tree-item"
            slot-scope="{ node }">
          <div class="i-tree-item-icon">
            <img :src="iconShow(node)"
                width="12.2px"
                height="7.9px"
                style="margin-right: 4px;">
            {{ node.label }}
          </div>
        </div>
      </el-tree>
    </el-col>
    <el-col class="WMBox rightBox" :span="20" v-loading="mainListLoading" element-loading-background="rgba(0, 0, 0, 0.8)">
      <el-header>
        <img class="img" src="../../../../assets/images/doorAccess/men_verify.png" alt>多种验证方式组合开门
      </el-header>
      <el-table :data="tableData" style="width: 100%">
        <el-table-column type="index" :index="tableIndex" label="序号" width="80"></el-table-column>
        <el-table-column prop="nickName" label="读头" width="200"></el-table-column>
        <el-table-column prop="options" label="开门方式">
          <template slot-scope="scope">
            <el-select v-model="scope.row.recognitionMode" @change="changeOpenStyle(scope.row)" size="large" placeholder="请选择">
              <el-option
                v-for="item in scope.row.newOption"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              ></el-option>
            </el-select>
          </template>
        </el-table-column>
      </el-table>
    </el-col>
  </el-row>
</template>
<script>
import TheLeftmenu from "./../../../equipmentMange/views/TheLeftmenu";
export default {
  components: {TheLeftmenu},
  props: {},
  data() {
    return {
      mainListLoading: false,
      api: window.config.protocolHeader + window.config.ip,
      // projectUuid: window.config.projectUuid,
      projectUuid: this.$store.state.home.projectUuid,
      treeData: [],
      filterText: "",
      defaultProps: {
        children: "children",
        id: "id",
        label: "label",
        isLeaf: "leaf"
      },
      tableData: [],
      options: [
        {
          value: "card,face,fingerprint,qrcode",
          label: "卡/脸/指纹/二维码"
        },
        {
          value: "card,face",
          label: "卡/脸"
        },
        {
          value: "card,fingerprint",
          label: "卡/指纹"
        },
        {
          value: "card,qrcode",
          label: "卡/二维码"
        },
        {
          value: "face,fingerprint",
          label: "脸/指纹"
        },
        {
          value: "face,qrcode",
          label: "脸/二维码"
        },
        {
          value: "fingerprint,qrcode",
          label: "指纹/二维码"
        },
        {
          value: "card,face,fingerprint",
          label: "卡/脸/指纹"
        },
        {
          value: "card,face,qrcode",
          label: "卡/脸/二维码"
        },
        {
          value: "face,fingerprint,qrcode",
          label: "脸/指纹/二维码"
        },
        {
          value: "card",
          label: "仅卡"
        },
        {
          value: "face",
          label: "仅脸"
        },
        {
          value: "fingerprint",
          label: "仅指纹"
        },
        {
          value: "card&face&fingerprint",
          label: "卡+脸+指纹"
        },
        {
          value: "card&face",
          label: "卡+脸"
        },
        {
          value: "card&fingerprint",
          label: "卡+指纹"
        },
        {
          value: "face&fingerprint",
          label: "脸+指纹"
        }
      ],
      newChildData: [],
      isExpanded: false,
      treeNode: "",
      treeId: ""
    };
  },
  created() {},
  activated() {
    this.filterText = "";
    this.tableData = [];
    this.initDeviceTree();
  },
  mounted() {
    this.initDeviceTree();
  },
  methods: {
    nodeClick(data, node, tree) {
      this.tableData = [];
      if (!data.parentUuid) {
        this.setChild(node, data.id);
      } else {
        this.tableData = [];
        this.tableData.push(data);
      }
    },
    setChild(node, treeId) {
      if (node) {
        this.treeNode = node;
        this.treeId = treeId;
      } else {
        node = this.treeNode;
        treeId = this.treeId;
      }
      this.newChildData = [];
      this.$set(node.data, "children", []);
      this.$set(node, "childNodes", []);
      var that = this;
      this.mainListLoading = true;
      this.$http.get(this.api + "/basedata-v1/project/" + this.projectUuid + "/deviceReadHeadList/" + treeId,
      ).then((res) => {
        console.log("获取设备读头====", res);
        if (res.status === 200) {
          if (res.data.success) {
            console.log("treeData==", this.treeData);
            this.dealResult(res.data.data);
            for (let item of res.data.data) {
              that.$set(item, "leaf", true);
            }
            node.doCreateChildren(res.data.data);
          } else {
            this.$message({
              message: res.data.msg,
              type: 'error'
            });
          }
        } else {
          this.$message({
            message: res.data.msg,
            type: 'error'
          });
        }
        this.mainListLoading = false;
      }).catch((err) => {
        this.mainListLoading = false;
        console.log("请求错误：" + err);
      });
    },
    checkChange(node, nodeBool, subBool) {
      // 节点被点击选中时的变化
    },
    currentChange() {
      // 当前选中节点变化时触发的事件
    },
    filterNode(value, data) {
      if (!value) return true;
      return data.label.indexOf(value) !== -1;
    },
    tableIndex(val) {
      val += 1;
      return val < 10 ? "0" + val : val;
    },
    clickNodeAll() {

    },
    changetab() {

    },
    initDeviceTree() {
      this.$http.get(this.api + "/basedata-v1/project/" + this.projectUuid + "/device/list?limit=900000000&page=1",
      ).then((res) => {
        console.log("获取设备通道====", res);
        if (res.status === 200) {
          if (res.data.success) {
            this.treeData = res.data.data.list;
          } else {
            this.$message({
              message: res.data.msg,
              type: 'error'
            });
          }
        } else {
          this.$message({
            message: res.data.msg,
            type: 'error'
          });
        }
      }).catch((err) => {
        console.log("请求错误：" + err);
      });
    },
    iconShow(node) {
      let icon = "";
      console.log("node===", node);
      if (!node.data.parentUuid) {
        icon = require("@/assets/images/personMange/equipment.png");
      } else {
        icon = "";
      }
      return icon;
    },
    dealResult(data) {
      let arr;
      console.log("data==", data);
      for (var j = 0; j < data.length; j++) {
        arr = [];
        for (var i = 0; i < data[j].openDoorMode.length; i++) {
          let obj = {
            value: data[j].openDoorMode[i],
          };
          arr.push(obj);
        }
        this.myFilter2(this.options, arr, data, j);
      }
    },
    myFilter2(arr1, arr2, data, index) {
      var ret = [];
      arr2.forEach(
        ele => {
          var findEle = arr1.find(x => x.value === ele.value);
          // 如果在arr1中找到,添加到arr1中
          // findEle ? ret.push(findEle) : '';
          if (findEle) {
            ret.push(findEle);
          } else {
            findEle = "";
          }
        }
      );
      data[index].newOption = ret;
      this.tableData = data;
      return ret;
    },
    changeOpenStyle(row) {
      this.$http.put(this.api + "/iacconfig-v1/project/" + this.projectUuid + "/advancedConf/checkCombinationDoorOpen/channelInfo/" + row.channelUuid,
        {
          channelUuid: row.channelUuid,
          recognitionMode: row.recognitionMode,
          version: Number(row.version)
        }
      ).then((res) => {
        console.log("编辑人员====", res);
        if (res.status === 200) {
          if (res.data.success) {
            this.$message({
              message: "修改成功",
              type: 'success'
            });
            this.setChild();
          } else {
            this.$message({
              message: res.data.msg,
              type: 'error'
            });
          }
        } else {
          this.$message({
            message: res.data.msg,
            type: 'error'
          });
        }
      }).catch((err) => {
        console.log("请求错误：" + err);
      });
    }
  },
  watch: {
    filterText(val) {
      this.$refs.tree.filter(val);
    }
  },
  destroyed() {},
  computed: {
    key() {
      return this.$route.fullPath;
    }
  }
};
</script>
<style>
.rightBox .el-select .el-input__inner {
  height: 30px;
}
</style>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss">
.WayMakeUpOpen {
  height: 100%;
  .WMBox {
    background: rgba(35, 38, 41, 0.8);
    margin-right: 20px;
    height: 100%;
  }
  .leftBox {
    padding: 0 20px;
    .el-header {
      padding-left: 0px;
    }
  }
  .rightBox .el-select {
    width: 80%;
    max-width: 220px;
    height: 30px;
  }
  .el-header {
    line-height: 60px;
  }
  .el-icon-caret-right:before {
    content: none;
  }
}
</style>
