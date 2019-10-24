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
          <!-- <div class='groupButton'>
            <el-checkbox-group v-model="checkedCities"
                               v-if="data.Auth.length"
                               @change="handleCheckedCitiesChange">
              <el-checkbox v-for="city in data.Auth"
                           :label="city.nodeName"
                           :key="city.nodeName">{{city.nodeName}}</el-checkbox>
            </el-checkbox-group>
          </div> -->
          <span>
            <el-button type="text"
                       size="mini"
                       @click="() => append(data)">
              Append
            </el-button>
            <el-button type="text"
                       size="mini"
                       @click="() => remove(node, data)">
              Delete
            </el-button>
          </span>
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
            // 节点类型
            nodeNo: int,
            // 节点序号
            auth: [],
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
            // 节点类型
            nodeNo: int,
            // 节点序号
            auth: [],
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
            // 节点类型
            nodeNo: int,
            // 节点序号
            auth: [],
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
      }
    };
  },
  mounted() {
    this.TreechangeNameDialogVisible = this.visible;
    this.name = this.value;
  },
  methods: {
    handleCheckedCitiesChange() {},
    append(data) {
      const newChild = { id: id++, label: "testtest", children: [] };
      if (!data.children) {
        this.$set(data, "children", []);
      }
      data.children.push(newChild);
    },

    remove(node, data) {
      console.log(node, data);
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
    width: 300px;
  }
  .groupButton {
    width: calc(100% - 300px);
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
  padding: 10px 40px;
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
