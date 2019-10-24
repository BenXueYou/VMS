<template>
  <el-dialog :title='title'
             @close="close"
             :width="width"
             :class="{'dialogCenter':center}"
             :close-on-click-modal="false"
             :append-to-body="true"
             :visible.sync="TreechangeNameDialogVisible">
    <div class='c'>
      <el-tree :data="data"
               node-key="featureUuid"
               :props="props"
               default-expand-all
               :expand-on-click-node="false">
        <span class="custom-tree-node"
              slot-scope="{ node, data }">
          <div class='labelName'>{{ node.label }}
          </div>
          <div class='groupButton'>
            <el-checkbox :indeterminate="data.isIndeterminate"
                         v-model="data.checkAll"
                         style="float:left;"
                         @change="handleCheckAllChange(node,data)">全选</el-checkbox>
            <el-checkbox-group v-model="data.checkedCities"
                               v-if="data.auth.length"
                               style="float:left;"
                               @change="handleCheckedCitiesChange(node,data)">
              <el-checkbox v-for="city in data.auth"
                           :label="city.authName"
                           :key="city.authName">{{city.authName}}</el-checkbox>
            </el-checkbox-group>
          </div>
        </span>
      </el-tree>
    </div>
    <div class="ss">
      <el-button type="primary"
                 class="butttt"
                 @click="confirm"
                 size="small">取消</el-button>
      <el-button type="primary"
                 class="butttt"
                 @click="close"
                 size="small">确定</el-button>
    </div>
  </el-dialog>
</template>

<script>
let id = 1000;
let string = "string",
  int = "int";
let auth = [
  {
    authUuid: "a1",
    authName: "新增",
    authNo: int,
    isOwn: 1
  },
  {
    authUuid: "a2",
    authName: "修改",
    authNo: int,
    isOwn: 1
  },
  {
    authUuid: "a3",
    // 功能权限uuid
    authName: "删除",
    // 功能权限名称
    authNo: int,
    // 权限序号
    isOwn: 1
    // 是否拥有该权限0无，1有
  },
  {
    authUuid: "a4",
    // 功能权限uuid
    authName: "查看",
    // 功能权限名称
    authNo: int,
    // 权限序号
    isOwn: 1
    // 是否拥有该权限0无，1有
  },
  {
    authUuid: "a5",
    // 功能权限uuid
    authName: "导入",
    // 功能权限名称
    authNo: int,
    // 权限序号
    isOwn: 1
    // 是否拥有该权限0无，1有
  },
  {
    authUuid: "a6",
    // 功能权限uuid
    authName: "导出",
    // 功能权限名称
    authNo: int,
    // 权限序号
    isOwn: 1
    // 是否拥有该权限0无，1有
  }
];
let data = [
  {
    featureUuid: "string1",
    // 功能uuid
    parentUuid: string,
    // 父节点uuid
    nodeName: "门禁管理",
    // 节点名称
    nodeType: string,
    // 节点类型
    nodeNo: int,
    checkedCities: [],
    // 节点序号
    auth: [
      // 非叶子节点时，此数组size为0
    ],
    childNodes: [
      {
        featureUuid: "string2",
        // 功能uuid
        parentUuid: string,
        // 父节点uuid
        nodeName: "权限组",
        // 节点名称
        nodeType: string,
        // 节点类型
        nodeNo: int,
        checkedCities: [],
        // 节点序号
        auth: [],
        childNodes: [
          {
            featureUuid: "string3",
            // 功能uuid
            parentUuid: string,
            // 父节点uuid
            nodeName: "权限组",
            // 节点名称
            nodeType: string,
            checkedCities: [],
            // 节点类型
            nodeNo: int,
            // 节点序号
            auth: auth,
            childNodes: []
          },
          {
            featureUuid: "string4",
            // 功能uuid
            parentUuid: string,
            // 父节点uuid
            nodeName: "通行时间段",
            // 节点名称
            nodeType: string,
            checkedCities: [],
            // 节点类型
            nodeNo: int,
            // 节点序号
            auth: [
              {
                authUuid: "a1",
                authName: "新增",
                authNo: int,
                isOwn: 0
              },
              {
                authUuid: "a2",
                authName: "修改",
                authNo: int,
                isOwn: 0
              },
              {
                authUuid: "a3",
                // 功能权限uuid
                authName: "删除",
                // 功能权限名称
                authNo: int,
                // 权限序号
                isOwn: 0
                // 是否拥有该权限0无，1有
              },
              {
                authUuid: "a4",
                // 功能权限uuid
                authName: "查看",
                // 功能权限名称
                authNo: int,
                // 权限序号
                isOwn: 0
                // 是否拥有该权限0无，1有
              },
              {
                authUuid: "a5",
                // 功能权限uuid
                authName: "导入",
                // 功能权限名称
                authNo: int,
                // 权限序号
                isOwn: 1
                // 是否拥有该权限0无，1有
              },
              {
                authUuid: "a6",
                // 功能权限uuid
                authName: "导出",
                // 功能权限名称
                authNo: int,
                // 权限序号
                isOwn: 1
                // 是否拥有该权限0无，1有
              }
            ],
            childNodes: []
          },
          {
            featureUuid: "string5",
            // 功能uuid
            parentUuid: string,
            // 父节点uuid
            nodeName: "特殊日期",
            // 节点名称
            nodeType: string,
            checkedCities: [],
            // 节点类型
            nodeNo: int,
            // 节点序号
            auth: [
              {
                authUuid: "a1",
                authName: "新增",
                authNo: int,
                isOwn: 0
              },
              {
                authUuid: "a2",
                authName: "修改",
                authNo: int,
                isOwn: 1
              },
              {
                authUuid: "a3",
                // 功能权限uuid
                authName: "删除",
                // 功能权限名称
                authNo: int,
                // 权限序号
                isOwn: 1
                // 是否拥有该权限0无，1有
              },
              {
                authUuid: "a4",
                // 功能权限uuid
                authName: "查看",
                // 功能权限名称
                authNo: int,
                // 权限序号
                isOwn: 1
                // 是否拥有该权限0无，1有
              },
              {
                authUuid: "a5",
                // 功能权限uuid
                authName: "导入",
                // 功能权限名称
                authNo: int,
                // 权限序号
                isOwn: 1
                // 是否拥有该权限0无，1有
              },
              {
                authUuid: "a6",
                // 功能权限uuid
                authName: "导出",
                // 功能权限名称
                authNo: int,
                // 权限序号
                isOwn: 1
                // 是否拥有该权限0无，1有
              }
            ],
            childNodes: []
          }
        ]
      }
    ]
  }
];
export default {
  name: "TreeChangeNameDialog.vue",
  props: {
    width: {
      type: String,
      default() {
        return "900px";
      }
    },
    title: {
      type: String,
      default() {
        return "功能模块权限";
      }
    },
    value: {
      type: String,
      default() {
        return "";
      }
    },
    visible: {
      type: Boolean,
      default() {
        return false;
      }
    },
    center: {
      type: Boolean,
      default() {
        return true;
      }
    }
  },
  data() {
    return {
      TreechangeNameDialogVisible: false,
      data: data,
      props: {
        label: "nodeName",
        children: "childNodes"
      },
      allData: ["新增", "修改", "删除", "查看", "导入", "导出"]
    };
  },
  mounted() {
    this.TreechangeNameDialogVisible = this.visible;
    this.name = this.value;
    let d = JSON.parse(JSON.stringify(this.data));
    this.dpTree(d);
    this.data = JSON.parse(JSON.stringify(d));
  },
  methods: {
    handleCheckAllChange(node, data) {
      // 点击全选按钮
      console.log(node);
      console.log(data);
      if (data.checkAll) {
        data.checkedCities = this.allData;
      } else {
        data.checkedCities = [];
      }
      data.isIndeterminate = false;
      if (node.childNodes.length) {
        this.dealParentOperator(node.childNodes, data.checkedCities);
      }
    },
    dealParentOperator(data, checkedCities) {
      for (let i = 0, len = data.length; i < len; i++) {
        data[i].data.checkedCities = checkedCities;
        data[i].data.checkAll = checkedCities.length === auth.length;
        data[i].data.isIndeterminate =
          checkedCities.length > 0 && checkedCities.length < auth.length;
        if (data[i].childNodes.length) {
          this.dealParentOperator(data[i].childNodes, checkedCities);
        }
      }
    },
    handleCheckedCitiesChange(node, data) {
      console.log(node);
      console.log(data);
      data.checkAll = data.checkedCities.length === data.auth.length;
      console.log(data.checkedCities.length);
      console.log(
        data.checkedCities.length > 0 &&
          data.checkedCities.length < data.auth.length
      );
      data.isIndeterminate =
        data.checkedCities.length > 0 &&
        data.checkedCities.length < data.auth.length;
    },
    getCheckedNodes(data) {
      let arr = [];
      for (let i = 0, len = data.length; i < len; i++) {
        if (data[i].isOwn === 1) {
          arr.push(data[i].authName);
        }
      }
      return arr;
    },
    // 循环遍历，判断是否有全选按钮
    dpTree(data) {
      let checkedCities = [],
        arr = [];
      for (let i = 0; i < data.length; i++) {
        if (data[i].childNodes) {
          checkedCities = this.dpTree(data[i].childNodes);
          console.log(data[i].nodeName);
        }
        // 表示这个是叶子节点了F
        if (data[i].auth.length) {
          data[i].checkedCities = this.getCheckedNodes(data[i].auth);
          data[i].checkAll =
            data[i].checkedCities.length === data[i].auth.length;
          data[i].isIndeterminate =
            data[i].checkedCities.length > 0 &&
            data[i].checkedCities.length < data[i].auth.length;
        } else {
          console.log(checkedCities);
          data[i].auth = auth;
          data[i].checkedCities = checkedCities;
          data[i].checkAll = checkedCities.length === data[i].auth.length;
          data[i].isIndeterminate =
            checkedCities.length > 0 &&
            checkedCities.length < data[i].auth.length;
        }
        if (!arr.length) {
          arr = data[i].checkedCities;
        } else {
          arr = this.concat(arr, data[i].checkedCities);
        }
      }
      return arr;
    },
    concat(target, num) {
      return num.filter(item => {
        return target.indexOf(item) !== -1;
      });
    },
    append(data) {
      const newChild = { id: id++, label: "testtest", children: [] };
      if (!data.children) {
        this.$set(data, "children", []);
      }
      data.children.push(newChild);
    },

    remove(node, data) {
      console.log(node);
      console.log(data);
      const parent = node.parent;
      const children = parent.data.children || parent.data;
      const index = children.findIndex(d => d.id === data.id);
      children.splice(index, 1);
    },
    confirm() {
      this.$emit("confirm", this.name);
      this.$emit("update:visible", false);
    },
    close() {
      this.$emit("update:visible", false);
      this.$emit("close");
    }
  },
  watch: {
    visible(val) {
      if (val) {
        this.name = this.value;
      }
      this.TreechangeNameDialogVisible = this.visible;
    }
  }
};
</script>
<style lang="scss">
.c {
  .input {
    input {
      height: 30px;
      line-height: 30px;
    }
  }
}
</style>
<style lang="scss" scoped>
.custom-tree-node {
  display: flex;
  .labelName {
    width: 200px;
  }
  .groupButton {
    width: calc(100% - 200px);
  }
}

$labelwidth: 5em;
.ss {
  padding: 15px;
  .butttt {
    float: right;
    margin-right: 30px;
  }
  &::after {
    content: "";
    display: block;
    clear: both;
  }
}
.c {
  overflow: auto;
  max-height: 65vh;
  min-height: 30vh;
  padding: 10px 20px;
  .body {
    max-width: 300px;
    width: 80%;
    margin: 30px auto;
    display: flex;
    flex-wrap: wrap;
    .label {
      width: $labelwidth;
      text-align: right;
      line-height: 30px;
      font-family: "PingFangSC-Regular";
      padding-right: 5px;
      box-sizing: border-box;
      font-size: 13px;
      color: #dddddd;
      text-align: right;
    }
    .input {
      width: calc(100% - #{$labelwidth});
      box-sizing: border-box;
      button {
        height: 30px;
        padding: 7px 21px;
        background: rgba(40, 255, 187, 0.12);
        border: 1px solid rgba(40, 255, 187, 0.8);
        border-radius: 2px;
        border-radius: 2px;
        font-family: "PingFangSC-Regular";
        font-size: 12px;
        color: #ffffff;
        letter-spacing: 0;
      }
    }
  }
}
</style>
