<template>
  <el-dialog width="37.5%"
             :title="title"
             :visible.sync="isCurrentShow"
             :before-close="onClickCancel"
             :close-on-click-modal="false">
    <el-row class="dialog-content"
            type="flex"
            justify="space-around">
      <el-col class="left-contain"
              :span="12">
        <el-container>
          <el-header class="box">
            <span>互锁组名称:</span>
            <el-input v-model="inputModel"
                      placeholder="请输入内容"></el-input>
          </el-header>
          <el-main>
            <tab-tree :tabs="tabs"
                      :visible="isCurrentShow"
                      :show-input="true"
                      @transferCheckedNodes="transferCheckedNodes"
                      :defaultExpandedKeys="defaultExpandedKeys"
                      :checkeTreedNodes="checkeTreedNodes">
            </tab-tree>
          </el-main>
        </el-container>
      </el-col>
      <el-col class="right-contain"
              :span="12">
        <span class="checkedSpanClass">已选门</span>
        <div class="tagBox">
          <template v-for="(tag , index) in dynamicTags">
            <el-tag class="el-tag-class"
                    :key="index"
                    closable
                    :disable-transitions="false"
                    @close="handleClose(tag,index)">
              <img class="img"
                   v-if="tag.children"
                   src="@/assets/images/doorAccess/tag_floor.png"
                   alt>
              <img class="img"
                   v-else
                   src="@/assets/images/doorAccess/tag_door.png"
                   alt>
              {{tag.label}}
              <div v-if="tag.children"
                   :key="index"
                   class="tag-hover-box">
                <template v-for="(item , i) in childrenTags(tag)">
                  <el-tag class="el-tag-class"
                          :key="i"
                          :disable-transitions="false">
                    <img class="img"
                         v-if="tag.children"
                         src="../../../../assets/images/doorAccess/tag_floor.png"
                         alt>
                    <img class="img"
                         v-else
                         src="../../../../assets/images/doorAccess/tag_door.png"
                         alt>
                    {{item.orgName}}
                  </el-tag>
                </template>
              </div>
            </el-tag>
          </template>
        </div>
      </el-col>
    </el-row>
    <div slot="footer"
         class="dialog-footer">
      <el-button type="primary"
                 size="mini"
                 @click="submit"
                 class="footer-button">确定</el-button>
      <el-button type="primary"
                 size="mini"
                 @click="onClickCancel"
                 class="footer-button">取消</el-button>
    </div>
  </el-dialog>
</template>

<script>
import tabTree from "@/common/TabTree.vue";
import * as api from "../../utils/ajax";
export default {
  components: { tabTree },
  props: {
    isShow: {
      type: Boolean,
      default: false
    },
    row: {
      type: Object,
      default() {
        return {};
      }
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
        label: "orgName"
      },
      keysArr: [],
      tabs: [
        {
          id: "1",
          label: "设备树",
          treeType: "orgAndDev",
          treeRef: "tree1",
          nodeKey: "id",
          selectSingleNode: "door"
        },
        // {
        //   id: "3",
        //   label: "标签",
        //   treeType: "device",
        //   treeNodeType: "door",
        //   treeRef: "tree3",
        //   isTag: true,
        //   nodeKey: "tagUuid",
        //   selectSingleNode: "door"
        // }
      ],
      defaultExpandedKeys: [],
      orgType: "device",
      peopleVersion: 0,
      title: ""
    };
  },
  created() {},
  mounted() {
    let projectType = this.$store.state.home.projectType;
    // 判断不是学校项目则加入基建的选项
    if (projectType.platformType !== "school") {
      this.tabs.push({
        id: "2",
        label: "地址",
        treeType: "resident",
        treeNodeType: "door",
        treeRef: "tree2",
        nodeKey: "id",
        selectSingleNode: "door"
      });
      // 按照id 大小排序
      this.tabs.sort((item1, item2) => {
        let id1 = Number(item1.id);
        let id2 = Number(item2.id);
        return id1 - id2;
      });
    }
  },
  methods: {
    submit() {
      if (!this.inputModel) {
        this.$message.error("请填写互锁的名字！");
        return;
      }
      if (!this.dynamicTags.length) {
        this.$message.error("请选择门！");
        return;
      }
      let resourceSet = [];
      console.log(this.dynamicTags);
      for (let i = 0; i < this.dynamicTags.length; i++) {
        let item = {
          resSn: i,
          resType: this.dynamicTags[i].type,
          resUuid: this.dynamicTags[i].id
        };
        if (this.peopleVersion !== 0) {
          item.version = this.peopleVersion;
        }
        resourceSet.push(item);
      }
      let data = {
        groupName: this.inputModel,
        resourceSet,
        enabled: 1
      };
      if (this.row.groupUuid) {
        data.groupUuid = this.row.groupUuid;
        data.version = this.row.version;
        data.setUuid = this.row.setUuid;
        data.enabled = this.row.enabled;
        api.updateIT(data, this.row.groupUuid).then(res => {
          console.log(res);
          if (res.data.success) {
            this.$message.success("修改成功！");
            this.$emit("onCancel");
          }
        });
      } else {
        api.addIT(data).then(res => {
          console.log(res);
          if (res.data.success) {
            this.$message.success("添加成功！");
            this.$emit("onCancel");
          }
        });
      }

      // 新增互锁
      // api.
      console.log(this.dynamicTags);
    },
    childrenTags(children) {
      console.log(children);
      var arr = [];
      this.$common.getChildren(children.children, arr);
      console.log(arr);
      return arr;
    },
    init() {
      this.dynamicTags = [];
      this.checkeTreedNodes = this.dynamicTags;
    },
    handleClose(tag, index) {
      console.log(tag, index);
      this.dynamicTags.splice(index, 1);
      this.checkeTreedNodes = this.dynamicTags;
    },
    /**
     * 取消新增或修改
     */
    onClickCancel() {
      this.$emit("onCancel");
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
    }
  },
  watch: {
    isShow(val) {
      console.log(this.row);
      // 初始化弹窗数据
      this.isCurrentShow = val;
      if (val) {
        this.title = this.row.groupUuid ? "新增互锁组" : "修改互锁组";
        let door = this.row.doors || [],
          checkeTreedNodes = [];
        for (let i = 0; i < door.length; i++) {
          let item = {
            label: door[i].resName,
            id: door[i].resUuid,
            resSn: door[i].resSn,
            type: door[i].resType,
            resType: door[i].resType,
            version: door[i].version,
            resName: door[i].resName
          };
          checkeTreedNodes.push(item);
          if (door[i].version) {
            this.peopleVersion = parseInt(door[i].version);
          }
        }
        this.inputModel = this.row.groupName;
        this.checkeTreedNodes = checkeTreedNodes;
        this.dynamicTags = checkeTreedNodes;
      }
    }
  },
  destroyed() {}
};
</script>
<style>
.Interlocking .el-input__prefix {
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
.Interlocking .el-tag-class .el-icon-close {
  color: rgba(0, 0, 0, 0.6);
  margin-right: -12px;
  margin-top: -30px;
  background-color: rgba(245, 245, 245, 0.6);
}
.Interlocking .el-container.is-vertical {
  -webkit-box-orient: vertical;
  -webkit-box-direction: normal;
  -ms-flex-direction: column;
  flex-direction: column;
  height: 100%;
}
.Interlocking .el-tag-class .el-icon-close:hover {
  background-color: transparent;
  color: #26d39d;
}
.Interlocking .el-dialog {
  height: 58.3%;
  min-width: 620px;
  min-height: 580px;
  /* height: auto; */
}
.Interlocking .el-dialog__body {
  padding: 0;
  height: calc(100% - 120px);
}
.Interlocking .el-tree {
  overflow-y: auto;
}
.Interlocking .checkedSpanClass {
  font-family: "PingFangSC-Regular";
  font-size: 12px;
  color: #dddddd;
  text-align: center;
  margin-bottom: 11px;
}
.Interlocking .checkedSpanClass::before {
  display: inline-block;
  content: "";
  width: 5px;
  height: 5px;
  background-color: #dddddd;
  margin-right: 8px;
  transform: translateY(-50%);
}
.tag-hover-box {
  display: none;
  justify-content: flex-start;
  width: 400%;
  max-width: 320px;
  background: #2a2e31;
  box-shadow: 0 2px 30px 0 rgba(0, 0, 0, 0.3);
  height: auto;
  position: absolute;
  top: 30px;
  left: 0;
  z-index: 99;
  flex-wrap: wrap;
  padding: 9px 11px;
}
.el-tag-class:hover .tag-hover-box {
  display: flex !important;
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
  height: 100%;
  .left-contain {
    border-right: 1px solid #2f2f2f;
    padding: 10px 15px;
    height: 100%;
    box-sizing: border-box;
    .box {
      display: flex;
      justify-content: space-around;
      padding: 10px 0px;
      margin: 0 25px;
      // border-bottom: 1px dashed rgb(57, 60, 64);
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
      height: calc(100% - 60px);
    }
  }
  .right-contain {
    padding: 10px 15px;
    .el-checkbox {
      margin-right: 5px;
    }
    .tagBox {
      .el-tag-class {
        margin: 15px 7.5px 0;
        background-color: rgb(48, 51, 55);
        font-family: PingFangSC-Regular;
        font-size: 12px;
        color: #ffffff;
        border: 0;
        position: relative;
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
