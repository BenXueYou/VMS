<template>
  <el-dialog
    class="TagViewDialogClass"
    width="31.5%"
    :title="title"
    :visible.sync="isCurrentShow"
    :before-close="onClickCancel"
    :close-on-click-modal="false"
  >
    <el-header>
      <el-input prefix-icon="el-icon-search" placeholder="输入关键字进行过滤" v-model="filterText"></el-input>
    </el-header>
    <el-main>
      <tag :tags="dynamicTags" @handleClose="handleClose"></tag>
    </el-main>

    <div slot="footer" class="dialog-footer">
      <el-button type="primary" size="mini" @click="onClickConfirm" class="footer-button">确定</el-button>
      <el-button type="primary" size="mini" @click="onClickCancel" class="footer-button">取消</el-button>
    </div>
  </el-dialog>
</template>

<script>
import tabTree from "./TabTree.vue";
import tag from "./Tag.vue";
export default {
  components: { tabTree, tag },
  props: {
    isShow: {
      type: Boolean,
      default: false
    },
    title: {
      type: String,
      default: "新增弹窗"
    }
  },
  data() {
    return {
      checkeTreedNodes: [],
      dynamicTags: [],
      inputModel: "",
      isCurrentShow: false,
      treedata: [],
      defaultProps: {
        children: "children",
        label: "label"
      },
      keysArr: [],
      filterText: ""
    };
  },
  created() {},
  mounted() {},
  methods: {
    init() {
      this.dynamicTags = [];
      this.checkeTreedNodes = this.dynamicTags;
    },
    /**
     * 取消新增或修改
     */
    onClickCancel() {
      this.$emit("onClickCancel");
    },
    onClickConfirm() {
      this.$emit("onClickConfirm", this.checkeTreedNodes);
    },
    filterNode(value, data) {
      if (!value) return true;
      return data.label.indexOf(value) !== -1;
    },
    transferCheckedNodes(data, nodeBool, treeName) {
      var num = this.dynamicTags;
      let index = -1;
      for (var i = 0; i < num.length; i++) {
        if (num[i].treeName === treeName && num[i].id === data.id) {
          index = i;
          break;
        }
      }
      if (nodeBool && index === -1) {
        console.log("==================添加数据了！！");
        data.treeName = treeName;
        num.push(data);
        this.dynamicTags = num;
        this.checkeTreedNodes = num;
      }
      if (!nodeBool && index !== -1) {
        num.splice(index, 1);
        this.dynamicTags = num;
        this.checkeTreedNodes = num;
      }
    },
    handleClose(arr) {
      this.dynamicTags = arr;
      this.checkeTreedNodes = this.dynamicTags;
    }
  },
  watch: {
    isShow(val) {
      console.log(val);
      // 初始化弹窗数据
      this.isCurrentShow = val;
      if (val) {
        setTimeout(() => {
          this.init();
        }, 100);
      }
    }
  },
  destroyed() {}
};
</script>
<style>
.TagViewDialogClass .el-input__prefix {
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
.TagViewDialogClass .el-tag-class .el-icon-close {
  color: #ffffff;
  margin-right: -12px;
  margin-top: -30px;
}
.TagViewDialogClass .el-tag-class .el-icon-close:hover {
  background-color: transparent;
  color: #26d39d;
}
.TagViewDialogClass .el-dialog {
  max-height: 58.3%;
  min-height: 45%;
}
.TagViewDialogClass .el-dialog__body {
    padding: 0;
    min-height: 360px;
}

</style>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
$line-color: #24473f;
@mixin setFontStyle($fontsize) {
  font-family: PingFangSC-Regular;
  font-size: $fontsize;
  color: #cccccc;
  letter-spacing: 0;
}
.el-dialog__body{
    height: 100%;;
}
.TagViewDialogClass .el-header{
    width: 50%;
    height: 40px!important;
    line-height: 40px;
    margin-top: 20px;
    padding-left: 35px;
}
.el-main {
  padding: 10px 25px 10px;
//   min-height: 
}

.el-checkbox {
  margin-right: 5px;
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
