<template>
  <el-dialog :title="title"
             @close="close"
             :width="width"
             :class="{'dialogCenter':center}"
             :close-on-click-modal="false"
             :append-to-body="true"
             :visible.sync="TreechangeNameDialogVisible">
    <div class="c tears">
      <!-- default-expand-all -->
      <div class="tableHeader">
        <div class="hitem">
          模块名称
        </div>
        <div class="hitem">
          模块是否显示
        </div>
        <div class="hitem">
          操作权限
        </div>
      </div>
      <el-tree :data="data"
               node-key="featureUuid"
               :props="props"
               :expand-on-click-node="false">
        <span class="custom-tree-node"
              slot-scope="{ node, data }">
          <div class="labelName">{{ node.label }}</div>
        </span>
      </el-tree>
    </div>
    <div class="ss">
      <el-button type="primary"
                 class="butttt"
                 @click="close"
                 size="small">取消</el-button>
      <el-button type="primary"
                 class="butttt"
                 @click="confirm"
                 size="small">确定</el-button>
    </div>
  </el-dialog>
</template>

<script>
import * as api from "@/pages/user/http/ajax.js";
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
    roleUuid: {
      type: String,
      default() {
        return "0c691cd5845b4b4a918cc710e10985ea";
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
    },
    selectAuthUuid: {
      type: Array,
      default() {
        return [];
      }
    }
  },
  data() {
    return {
      TreechangeNameDialogVisible: false,
      data: [],
      props: {
        label: "nodeName",
        children: "childNodes"
      },
      checkedNum: [],
      showNum: []
    };
  },
  mounted() {
    this.TreechangeNameDialogVisible = this.visible;
  },
  methods: {
    close() {},
    confirm() {},
    getData() {
      api
        .getAuth({
          roleUuid: this.roleUuid
        })
        .then(res => {
          console.log(res.data);
          let data = res.data.data || [];
          this.data = data;
          this.initData();
        });
    }
  },
  watch: {
    visible(val) {
      if (val) {
        this.getData();
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
.tableHeader {
  display: flex;
  .hitem {
    flex: 1;
    text-align: center;
    background-color: rgba(0, 0, 0, 0.05);
  }
}
.custom-tree-node {
  display: flex;
  width: calc(100%);
  justify-content: space-between;
  l .labelName {
    width: 200px;
  }
  .groupButton {
    display: flex;
    justify-content: flex-start;
    // width: calc(100% - 200px);
    padding-right: 50px;
  }
}
.macheckoutbox {
  margin-left: 30px;
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
