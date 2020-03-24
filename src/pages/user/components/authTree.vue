<template>
  <el-dialog :title="title"
             @close="close"
             :width="width"
             :class="{'dialogCenter':center}"
             :close-on-click-modal="false"
             :append-to-body="true"
             :visible.sync="TreechangeNameDialogVisible">
    <div class="c tears">
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
      <div class="treeWrap">
        <el-tree :data="data"
                 node-key="featureUuid"
                 :props="props"
                 default-expand-all
                 :expand-on-click-node="false">
          <span class="custom-tree-node"
                slot-scope="{ node, data }">
            <div class="labelName">{{ node.label }}</div>
            <div class="labelButton">
              <el-switch :width="27"
                         v-model="data.isShow"
                         :disabled="!data.ShowAuthDisabled"
                         @change="showAuth(node,data,'isShow',1)"
                         active-color="#26D39D40"
                         inactive-color="rgb(72,73,75)"></el-switch>
            </div>
            <div class="labelButton">
              <el-switch :width="27"
                         :disabled="!data.isShow||!data.OwnAuthDisabled"
                         v-model="data.isOwn"
                         @change="showAuth(node,data,'isOwn',1)"
                         active-color="#26D39D40"
                         inactive-color="rgb(72,73,75)"></el-switch>
            </div>
          </span>
        </el-tree>
      </div>
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
    getUuid() {
      // return auth
      //   .filter(item => {
      //     return chekcedNum.indexOf(item.authName) !== -1;
      //   })
      //   .map(item => {
      //     return item.authUuid;
      //   });
    },
    showMode(node, data) {
      console.log(node, data);
    },
    showAuth(node, data, key, isChangeLeft) {
      console.log(data);
      if (isChangeLeft === 1) {
        // 显示权限关闭，那么它的操作权限也要关闭
        if (data.isShow === false && key === "isShow") {
          data.isOwn = false;
          this.showAuth(node, data, "isOwn");
        }
        // 操作权限打开，那么他的显示按钮也要打开
        if (data.isOwn === true && key === "isOwn") {
          data.isShow = true;
          this.showAuth(node, data, "isShow");
        }
      }
      if (node.childNodes && node.childNodes.length) {
        // 向下更新所有节点
        this.dealParentOperator(node.childNodes, key, data[key]);
      }
      // 向上更新所有节点
      if (node.parent) {
        this.traverseUpwrad(node.parent, key, data[key]);
      }
    },
    traverseUpwrad(node, key, flag) {
      console.log(node, flag);
      let childNodes = node.childNodes;
      for (let i = 0, len = childNodes.length; i < len; i++) {
        if (!flag) {
          break;
        }
        flag = flag && childNodes[i].data[key];
      }
      console.log(flag);
      node.data[key] = flag;
      if (node.parent) {
        this.traverseUpwrad(node.parent, key, flag);
      }
    },
    dealParentOperator(data, key, flag) {
      console.log(data);
      for (let i = 0; i < data.length; i++) {
        data[i].data[key] = flag;
        this.$set(data[i].data, key, flag);
        if (data[i].childNodes && data[i].childNodes.length) {
          this.dealParentOperator(data[i].childNodes, key, flag);
        }
      }
    },
    getAllCheckedLeafUuid(data) {
      // 遍历数据
      for (let i = 0, len = data.length; i < len; i++) {
        // 判断是不是叶子节点
        if (data[i].childNodes && data[i].childNodes.length) {
          this.getAllCheckedLeafUuid(data[i].childNodes);
        } else {
          // let num = this.getUuid(data[i].auth, data[i].checkAuth);
          // num有长度则表示要显示
          // 如果是否显示或者操作权限有true则保存下来
          if (data[i].isShow || data[i].isOwn) {
            this.showNum.push({
              featureName: data[i].nodeName,
              featureUuid: data[i].featureUuid,
              isShow: data[i].isShow,
              isOwn: data[i].isOwn,
              authUuids: data[i].auth
            });
          }
        }
      }
    },
    initData() {
      let d = JSON.parse(JSON.stringify(this.data));
      this.dpTree(d);
      this.data = JSON.parse(JSON.stringify(d));
    },
    close() {
      this.$emit("update:visible", false);
    },
    confirm() {
      this.showNum = [];
      this.getAllCheckedLeafUuid(this.data);
      // console.log(this.checkedNum);
      console.log(this.showNum);
      this.$emit("confirm", this.showNum);
      this.close();
    },
    getChild(data) {
      let isShow = true,
        isOwn = true,
        ShowAuthDisabled = true,
        OwnAuthDisabled = true;
      for (let i = 0; i < data.length; i++) {
        isShow = isShow && data[i].isShow;
        isOwn = isOwn && data[i].isOwn;
        ShowAuthDisabled = ShowAuthDisabled && data[i].ShowAuthDisabled;
        OwnAuthDisabled = OwnAuthDisabled && data[i].OwnAuthDisabled;
      }
      return {
        isOwn,
        isShow,
        ShowAuthDisabled,
        OwnAuthDisabled
      };
    },
    dpTree(data) {
      // 编辑整个数据，将数字改为bool值 isOwn isShow
      for (let i = 0; i < data.length; i++) {
        // 这里还要判断编辑的这种情况，传过来的selectAuthUuid看他有没有选中
        let index = -1;
        for (let j = 0; j < this.selectAuthUuid.length; j++) {
          if (this.selectAuthUuid[j].featureUuid === data[i].featureUuid) {
            index = j;
            break;
          }
        }
        if (index !== -1) {
          data[i].isOwn = !!this.selectAuthUuid[index].isOwn;
          data[i].isShow = !!this.selectAuthUuid[index].isShow;
        } else {
          data[i].isOwn = !!data[i].isOwn;
          data[i].isShow = !!data[i].isShow;
        }
        data[i].ShowAuthDisabled = this.$common.getAuthIsOwn(
          data[i].nodeName,
          "isShow"
        );
        data[i].OwnAuthDisabled = this.$common.getAuthIsOwn(
          data[i].nodeName,
          "isOwn"
        );
        this.dpTree(data[i].childNodes || []);
        if (data[i].childNodes && data[i].childNodes.length) {
          let {
            isShow,
            isOwn,
            ShowAuthDisabled,
            OwnAuthDisabled
          } = this.getChild(data[i].childNodes);
          // console.log(isShow, isOwn);
          data[i].isShow = isShow;
          data[i].isOwn = isOwn;
          data[i].ShowAuthDisabled = ShowAuthDisabled;
          data[i].OwnAuthDisabled = OwnAuthDisabled;
        }
      }
    },
    getData() {
      api
        .getAuth({
          roleUuid: ""
        })
        .then(res => {
          console.log(res.data);
          if (res.data.success) {
            let data = res.data.data || [];
            this.data = data;
            this.initData();
          }
        });
    }
  },
  watch: {
    visible(val) {
      if (val) {
        this.getData();
      } else {
        this.data = [];
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
  line-height: 42px;
  .hitem {
    color: rgba(255, 255, 255, 0.8);
    flex: 1;
    text-align: center;
    background-color: rgba(255, 255, 255, 0.05);
    border-right: 1px dashed rgba(255, 255, 255, 0.12);
    &:last-child {
      border: none;
    }
  }
}
.custom-tree-node {
  display: flex;
  width: calc(100%);
  justify-content: space-between;
  .labelName {
    text-align: left;
    width: calc(100% - 560px);
  }
  .labelButton {
    width: 280px;
    display: flex;
    justify-content: center;
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
  padding: 10px 20px;
  .treeWrap {
    overflow: auto;
    max-height: 65vh;
    min-height: 30vh;
  }
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
