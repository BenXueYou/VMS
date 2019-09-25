<template>
  <el-dialog
    class="MyDialogClass"
    width="37.5%"
    title="新增互锁组"
    :visible.sync="isCurrentShow"
    :before-close="onClickCancel"
    :close-on-click-modal="false"
  >
    <el-row class="dialog-content" type="flex" justify="space-around">
      <el-col class="left-contain" :span="12">
        <el-container>
          <el-main>
            <tab-tree
              @transferCheckedNodes="transferCheckedNodes"
              :checkedKeys="keysArr"
              :checkeTreedNodes="checkeTreedNodes"
            ></tab-tree>
          </el-main>
        </el-container>
      </el-col>
      <el-col class="right-contain" :span="12">
        <el-checkbox></el-checkbox>
        <span>已选择的设备</span>
        <!-- <div class="tagBox">
          <template v-for="( tag , index) in dynamicTags">
            <el-tag
              class="el-tag-class"
              :key="index"
              closable
              :disable-transitions="false"
              @close="handleClose(tag,index)"
            >
              <img
                class="img"
                v-if="tag.children"
                src="../../../assets/images/doorAccess/tag_floor.png"
                alt
              >
              <img class="img" v-else src="../../../assets/images/doorAccess/tag_door.png" alt>
              {{tag.label}}
              <div v-if="tag.children" :key="index" class="tag-hover-box">
                <template v-for="(item , i) in childrenTags(tag)">
                  <el-tag class="el-tag-class" :key="i" :disable-transitions="false">
                    <img
                      class="img"
                      v-if="item.children"
                      src="../../../assets/images/doorAccess/tag_floor.png"
                      alt
                    >
                    <img
                      class="img"
                      v-else
                      src="../../../assets/images/doorAccess/tag_door.png"
                      alt
                    >
                    {{item.label}}
                  </el-tag>
                </template>
              </div>
            </el-tag>
          </template>
        </div>-->
        <tag :tags="dynamicTags" @handleClose="handleClose"></tag>
      </el-col>
    </el-row>
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
      keysArr: []
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
      this.$emit("onCancel");
    },
    onClickConfirm() {
      this.$emit("onConfirm", this.checkeTreedNodes);
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
.MyDialogClass .el-input__prefix {
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
.MyDialogClass .el-tag-class .el-icon-close {
  color: #ffffff;
  margin-right: -12px;
  margin-top: -30px;
}
.MyDialogClass .el-tag-class .el-icon-close:hover {
  background-color: transparent;
  color: #26D39D;
}
.MyDialogClass .el-dialog {
  max-height: 58.3%;
}
.MyDialogClass .el-tree {
  overflow-y: auto;
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
.dialog-content {
  display: flex;
  width: 100%;
  .left-contain {
    border-right: 1px solid #2f2f2f;
    padding: 10px 15px;
    .box {
      display: flex;
      justify-content: space-around;
      padding: 10px 0px;
      margin: 0 25px;
      border-bottom: 1px dashed rgb(57, 60, 64);
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
      padding: 10px 15px;
    }
  }
  .right-contain {
    padding: 10px 15px;
    .el-checkbox {
      margin-right: 5px;
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
