<template>
  <el-dialog
    :title="title"
    @close="close"
    :width="width"
    :class="{ dialogCenter: center }"
    :visible.sync="TreechangeNameDialogVisible"
  >
    <div class="wrap">
      所属组织：
      <el-popover
        placement="bottom-start"
        v-if="TreechangeNameDialogVisible"
        width="200"
        trigger="click"
      >
        <div style="max-height:300px;overflow:auto;margin-bottom:20px">
          <el-tree
            :props="devprops"
            :data="treeData"
            node-key="id"
            @node-click="handleNodeClick"
            style="margin-top:0px;"
            :default-expanded-keys="defaultExpKeys"
            :expand-on-click-node="false"
          >
            <div class="custom-tree-node" slot-scope="{ node, data }">
              <div class="oneRoad">
                <el-button type="text" @click="() => remeber(node, data)">
                  <img
                    src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAsAAAAJCAYAAADkZNYtAAAAAXNSR0IArs4c6QAAAFFJREFUGBljXLVq1TUGBgZNIAaBv4yMjBWhoaE9EC4qyQhU/B9VCMx7BtT0G0n8L5Cdw4IkgMyU+v8f1QygZnMmZBWE2ENV8XVCHgPKg8L/JgCSlhJeAnvpRQAAAABJRU5ErkJggg=="
                    alt=""
                  />
                  <span>{{ node.label }}</span>
                </el-button>
                <img
                  src="@/assets/images/doorAccess/checked_icon.png"
                  width="10.9px"
                  height="9px"
                  class="checked-img"
                  :class="{ isCheck: data.checked }"
                  alt=""
                />
              </div>
            </div>
          </el-tree>
        </div>
        <el-input
          v-model="originization"
          style="width:200px;"
          slot="reference"
          readonly="readonly"
          placeholder="选择所属组织节点"
        ></el-input>
      </el-popover>
    </div>
    <!-- <div style="height:70px;"></div> -->
    <div class="footeraa">
      <el-button type="primary" @click="confirm" size="medium">确定</el-button>
    </div>
    <div style="height:30px;"></div>
  </el-dialog>
</template>

<script>
import * as api from "@/pages/equipmentMange/ajax.js";
export default {
  name: "TreeChangeNameDialog.vue",
  props: {
    labelName: {
      type: String,
      default() {
        return "名称";
      }
    },
    width: {
      type: String,
      default() {
        return "400px";
      }
    },
    title: {
      type: String,
      default() {
        return "更改组织";
      }
    },
    childProjectUuid: {
      type: String,
      default() {
        return "";
      }
    },
    center: {
      type: Boolean,
      default() {
        return true;
      }
    },
    visible: {
      type: Boolean,
      default() {
        return false;
      }
    },
    value: {
      type: String,
      default() {
        return "";
      }
    },
    updateCount: {
      type: Number,
      default: 0
    }
  },
  data() {
    return {
      TreechangeNameDialogVisible: false,
      name: "",
      selectValue: {},
      originization: "",
      devprops: {
        label: "label",
        children: "children",
        isLeaf: "leaf"
      },
      defaultExpKeys: [],
      treeData: []
    };
  },
  mounted() {
    this.TreechangeNameDialogVisible = this.visible;
    this.initData();
  },
  methods: {
    handleNodeClick(data) {
      console.log(data);
      let checked = data.checked;
      this.originization = data.label;
      this.selectValue = data;
      this.$set(data, "checked", !checked);
    },
    initData() {
      api
        .getAreaAllOrg({
          orgType: "areaOrg"
        })
        .then(res => {
          let treeData = res.data.data || [];
          this.getAreaOrg(treeData);
          this.treeData = treeData;
        });
    },
    getAreaOrg(dataArr) {
      for (let i = 0; i < dataArr.length; i++) {
        let item = dataArr[i];
        if (item.type === "project") {
          dataArr.splice(i, 1);
          i--;
        } else {
          if (item.children && item.children.length) {
            this.getAreaOrg(item.children);
          } else {
          }
        }
      }
    },
    remeber(node, data) {
      console.log(node);
      console.log(data);
    },
    confirm() {
      console.log(this.selectValue);
      if (!this.selectValue.id) {
        this.$message.warning("请选择一个组织！");
        return;
      }
      api
        .setAreaProject({
          childProjectUuid: this.childProjectUuid /* 子项目uuid */,
          orgUuid: this.selectValue.id /* 组织uuid */
        })
        .then(res => {
          if (res.data.success) {
            this.$message.success("变更组织成功!");
            this.$emit("updateTree");
            this.$emit("update:visible", false);
          }
        });
    },
    close() {
      this.$emit("update:visible", false);
    }
  },
  watch: {
    visible(val) {
      if (val) {
        this.selectValue = {
          id: this.id,
          label: this.label
        };
        this.originization = this.selectValue.label;
      } else {
        this.selectValue = {};
      }
      this.TreechangeNameDialogVisible = this.visible;
    },
    updateCount: {
      handler(val) {
        console.log(val);
        this.initData();
      }
    }
  }
};
</script>
<style lang="scss">
$labelwidth: 7em;
.c {
  .input {
    input {
      height: 30px;
      line-height: 30px;
    }
  }
  .el-select {
    height: 30px;
    width: calc(100% - #{$labelwidth});
    .el-input {
      height: 30px;
      line-height: 30px;
      input {
        height: 30px;
        line-height: 30px;
      }
    }
  }
}
</style>

<style lang="scss" scoped>
.wrap {
  display: flex;
  justify-content: center;
  color: #fff;
  margin: 50px auto;
  line-height: 40px;
}
.footeraa {
  display: flex;
  justify-content: center;
}
.oneRoad {
  display: flex;
  justify-content: space-between;
  align-items: center;
  .checked-img {
    margin-right: 20%;
    display: none;
  }
  .isCheck {
    display: block;
  }
}
$labelwidth: 7em;
.c {
  overflow: hidden;
  .body {
    max-width: 300px;
    width: 80%;
    margin: 30px auto;
    display: flex;
    flex-wrap: wrap;
    justify-content: flex-start;
    .label {
      width: $labelwidth;
      text-align: right;
      line-height: 30px;
      padding-right: 5px;
      box-sizing: border-box;
      font-family: "PingFangSC-Regular";
      font-size: 13px;
      color: #dddddd;
      text-align: right;
    }
    .input {
      width: calc(100% - #{$labelwidth});
      height: 30px;
      line-height: 30px;
      box-sizing: border-box;

      .btn {
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
  .form-item {
    margin: 0px auto;
    margin-top: 20px;
    &:first-child {
      margin-top: 50px;
    }
  }
}
</style>
