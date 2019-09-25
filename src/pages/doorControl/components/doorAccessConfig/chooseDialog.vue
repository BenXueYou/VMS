<template>
  <el-dialog :visible.sync="exportDialogVisible"
             @close="close"
             width="680px"
             :modal="true"
             :append-to-body="true"
             class="dialogCenter adasdzqasda"
             :close-on-click-modal="false"
             :close-on-press-escape="false"
             title="选择要导入的通道">
    <div class="body">
      <div class="left">
        <el-input placeholder="搜索组织结构、设备、通道"
                  v-model="searchText">
          <img slot="prefix"
               class='image'
               :src="icons.search"
               alt="">
        </el-input>
        <el-select v-model="searchType"
                   placeholder="请选择通道类型(可多选)"
                   class="select">
          <el-option v-for="(item,index) in mode"
                     :label="item.label"
                     :key="index"
                     :value="item.value"></el-option>
        </el-select>
        <tab-tree :showInput="false"
                  :searchText="searchText"
                  :searchType="searchType"
                  class="tree"
                  @transferCheckedNodes="transferCheckedNodes"
                  :checkedKeys="keysArr"
                  title="新增互锁组"
                  :checkeTreedNodes="checkeTreedNodes">

        </tab-tree>
      </div>
      <div class="right">
        <span class="rectText">
          已选的通道
        </span>
        <div class="checkedGroup">
          <transition-group name="list"
                            tag="p">
            <gt-button v-for="(item,index) in dynamicTags"
                       class="gt-button"
                       :icon="icons.door"
                       @close="removeItem(index)"
                       :key="item.id">
              {{item.label}}
            </gt-button>
          </transition-group>
        </div>
      </div>
    </div>
    <div class="footer">
      <el-button class="button"
                 type="primary"
                 size="small">
        确定
      </el-button>
      <el-button class="button"
                 type="primary"
                 size="small">
        取消
      </el-button>
    </div>
    <div></div>
  </el-dialog>
</template>

<script>
import TabTree from "@/common/TabTree";
import icons from "@/common/icon.js";
export default {
  name: "TheTagTableExportDialog",
  props: {
    visible: {
      type: Boolean,
      default() {
        return false;
      }
    },
    mode: {
      type: Array,
      default() {
        return [
          {
            value: "mode1",
            label: "通道1"
          },
          {
            value: "mode2",
            label: "通道2"
          },
          {
            value: "mode3",
            label: "通道3"
          },
          {
            value: "mode4",
            label: "通道4"
          }
        ];
      }
    }
  },
  data() {
    return {
      icons,
      searchType: "",
      searchText: "",
      exportDialogVisible: false,
      checkeTreedNodes: [],
      dynamicTags: [],
      keysArr: []
    };
  },
  components: {
    TabTree
  },
  methods: {
    removeItem(index) {
      this.dynamicTags.splice(index, 1);
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
      console.log(this.dynamicTags);
    },
    close() {
      this.$emit("update:visible", false);
    }
  },
  watch: {
    visible(val) {
      this.exportDialogVisible = val;
    }
  }
};
</script>

<style lang="scss">
.list-enter-active,
.list-leave-active {
  transition: all 0.5s;
}
.list-enter, .list-leave-to
/* .list-leave-active for below version 2.1.8 */ {
  opacity: 0;
  transform: scaleX(0);
}
.list-leave-active {
  position: absolute;
}
.adasdzqasda {
  .el-dialog__body {
    padding: 0px 30px 20px;
  }
  .el-input__prefix {
    position: absolute;
    left: 43px;
    top: 0px;
    img {
      margin-top: 9px;
    }
  }
  .el-tree {
    background-color: transparent;
  }
}
</style>

<style lang="scss" scoped>
@import "@/style/variables.scss";
.adasdzqasda {
  $dividingLineColor: rgba(255, 255, 255, 0.05);
  .body {
    height: 440px;
    box-sizing: border-box;
    border-bottom: 1px solid $dividingLineColor;
    display: flex;
    .right {
      padding-top: 20px;
      padding-left: 20px;
      box-sizing: border-box;
      width: 50%;
      .gt-button {
        margin-right: 8px;
        margin-top: 15px;
      }
      .rectText {
        position: relative;
        padding-left: 13px;
        @include font-s;
        &::after {
          content: "";
          position: absolute;
          top: 50%;
          left: 0px;
          transform: translateY(-50%);
          width: 5px;
          height: 5px;
          border-radius: 1px;
          background: #aaaaaa;
        }
      }
    }
    .left {
      padding-top: 20px;
      width: 50%;
      box-sizing: border-box;
      padding-right: 50px;
      border-right: 1px solid $dividingLineColor;
      .select {
        width: 100%;
        margin: 10px 0px;
      }
    }
    .tree {
      height: 330px;
      overflow: auto;
    }
  }
  .footer {
    overflow: hidden;
    margin: 20px;
    display: flex;
    justify-content: flex-end;
    .button {
      @include button30;
      margin-left: 20px;
    }
  }
}
</style>
