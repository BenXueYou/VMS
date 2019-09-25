<template>
  <div class='left'
       id='VideoPreviewContentLeft'>
    <div class="searchWrap">
      <el-input placeholder='搜索组织/标签/名称'
                v-model="searchText">
        <img slot="prefix"
             class="image"
             :src="icons.search"
             alt>
      </el-input>
      <img @click="showAddChildrenDialog"
           v-show="tabsIndex==2"
           :src="icons.add"
           alt>
    </div>

    <div class="treeSwitchTabs">
      <ul>
        <li :class="{'active':tabsIndex==0}"
            @click='switchTabs(0)'>设备树</li>
        <li :class="{'active':tabsIndex==1}"
            @click='switchTabs(1)'>标签</li>
        <li :class="{'active':tabsIndex==2}"
            @click='switchTabs(2)'>视图</li>
      </ul>
    </div>

    <div class="treeWrap">
      <div class="mypanel"
           v-show="tabsIndex==0">
        <gt-tree ref="tree1"
                 class="tree"
                 @getChidrendata="getChidrendata"
                 @clickmenu="clickmenu"
                 @exportData="exportData"
                 :initdata="data"></gt-tree>
      </div>
      <div class="mypanel"
           v-show="tabsIndex==1">
        <gt-tree ref="tree2"
                 class="tree"
                 @getChidrendata="getChidrendata"
                 @clickmenu="clickmenu2"
                 @exportData="exportData"
                 :initdata="data2"></gt-tree>
      </div>
      <div class="mypanel"
           v-show="tabsIndex==2">
        <gt-tree ref="tree3"
                 class="tree"
                 @getChidrendata="getChidrendata"
                 @clickmenu="clickmenu3"
                 @exportData="exportData"
                 :initdata="data3"></gt-tree>
      </div>
    </div>

    <div class="cloundControlPannel">
      <div class="h">
        <img :src="icons.control"
             alt="">
        云控制台
      </div>
      <div class="icons">
        <div class="btngroup">
          <div class="button"
               v-for='(item,index) in btnGroup'
               :key="index">
            <img :src="icons[item]"
                 alt="">
          </div>
        </div>
        <div class="btngroup">
          <div class="button"
               v-for='(item,index) in btnGroup2'
               :key="index">
            <img :src="icons[item]"
                 alt="">
          </div>
        </div>
      </div>
      <div class='steplen'>
        <label class='label'>
          步长1
        </label>
        <el-slider class='slide'
                   v-model="value1"></el-slider>
        <span class="num">
          {{value1}}
        </span>
      </div>
      <div class='yuzhi'>
        <el-select v-model="value"
                   placeholder="请选择">
          <el-option v-for="item in options"
                     :key="item.value"
                     :label="item.label"
                     :value="item.value">
          </el-option>
        </el-select>
      </div>
      <div class='yuzhi'>
        <el-select v-model="value"
                   placeholder="请选择">
          <el-option v-for="item in options"
                     :key="item.value"
                     :label="item.label"
                     :value="item.value">
          </el-option>
        </el-select>
      </div>

      <div class="buttonGroup">
        <div class="button"
             title="">
          <img :src="icons.center"
               alt="">
        </div>
        <div class="button"
             title="">
          <img :src="icons.preset"
               alt="">
        </div>
      </div>
    </div>
    <tree-append-tag-dialog @confirm="addTag"
                            title="添加视图"
                            :visible.sync="appendTagDialogVisible"></tree-append-tag-dialog>
    <tree-append-tag-dialog @confirm="renameTag"
                            title="修改视图"
                            :visible.sync="changeTagDialogVisible"></tree-append-tag-dialog>

  </div>
</template>

<script>
import icons from "@/common/icon.js";
import TreeAppendTagDialog from "@/common/TreeAppendTagDialog";
import * as api from "@/pages/equipmentMange/ajax.js";
import { addTreeKey, copyTreeKey, remeberLast } from "@/utils/tree";
export default {
  name: "Left",
  components: {
    TreeAppendTagDialog
  },
  data() {
    return {
      parentOrgUuid: "",
      needType: "",
      orgType: "device",
      treeName: "",
      node: "",
      parent: "",
      Treeparent: "",
      nodeValue: "",
      rankOrder: "",
      appendTagDialogVisible: false,
      addTitle: "添加视图",
      searchText: "",
      icons,
      changeTagDialogVisible: false,
      tabsIndex: 0,
      btnGroup: [
        "leftup",
        "up",
        "rightup",
        "left",
        "center",
        "right",
        "leftdown",
        "down",
        "rightdown"
      ],
      btnGroup2: [
        "vadd",
        "fangda",
        "minus",
        "vadd",
        "centerbig",
        "minus",
        "vadd",
        "quan",
        "minus"
      ],
      value1: 10,
      options: [
        {
          value: "预置点",
          label: "预置点"
        }
      ],
      value: "预置点",
      data: [
        {
          label: "华南区",
          icon: icons.folder,
          children: new Array(4).fill({
            label: "xxx分公司1",
            icon: icons.folder,
            children: [
              {
                label: "测试菜单展开1",
                icon: icons.folder
              }
            ]
          })
        }
      ],
      data2: [
        {
          label: "公共区域视频点位",
          icon: icons.folder,
          children: new Array(4).fill({
            label: "通道1",
            icon: icons.folder
          })
        }
      ],
      data3: [
        {
          label: "自定义视图",
          icon: icons.folder,
          children: new Array(4).fill({
            label: "东门4画面"
          })
        }
      ],
      treeName: "tree1"
    };
  },
  methods: {
    appendChild(children) {
      // console.log(children);
      this.$refs[this.treeName].operator({
        operator: "addChildre",
        node: this.Treeparent,
        value: children
      });
    },
    getOrgTree(isFirst = false) {
      // 这个添加树的方法
      let data = {
        parentOrgUuid: this.parentOrgUuid,
        needType: this.needType
      };
      // console.log(data);
      api.getOrgTree(data, this.orgType).then(res => {
        if (res.data.data) {
          let result = res.data.data || [];
          addTreeKey(result, "icon", icons.folder);
          addTreeKey(result, "isextendJudge", false);
          copyTreeKey(result, "label", "orgName");
          remeberLast(result, this.treenodeNums, this.selectId);
          for (let i = 0; i < result.length; i++) {
            result[i].selected = false;
          }

          if (this.Treeparent.length) {
            this.appendChild(result);
          } else {
            this.data = result;
          }
          if (isFirst && result && result.length) {
            // 如果是第一次进来，自动选第一个子结点并且展开。则自动展开子结点。
            this.parentOrgUuid = result[0].orgUuid;
            if (this.orgType === "device") {
              this.$store.commit("setOrgUuid", result[0].orgUuid);
            }
            this.Treeparent = "0-0";
            this.getOrgTree();
            // 自动选中第一行有问题
            // this.$refs[this.treeName].operator({
            //   operator: "selected",
            //   node: this.Treeparent,
            //   selected: true
            // });
          }

          if (this.orgUuid === "") {
            if (result.length) {
              this.orgUuid = result[0].id;
              this.version = result[0].version;
              this.nodeValue = result[0].orgName;
            }
            this.Treeparent = "0-0";
            this.select = this.orgUuid;
            this.getoptions(result);
          }
          for (let i = 0, len = result.length; i < len; i++) {
            if (result[i].id === this.orgUuid) {
              this.version = result[i].version;
              this.nodeValue = result[i].orgName;
            }
          }
          this.$emit("clickNode", {
            id: this.parentOrgUuid,
            orgName: this.nodeValue
          });
        }
      });
    },
    addTag(name) {
      console.log(name);
    },
    renameTag(name) {
      this.$refs[this.treeName].operator({
        operator: "changeName",
        version: 11,
        node: this.Treeparent,
        value: name
      });
    },
    showAddChildrenDialog() {
      this.appendTagDialogVisible = true;
    },
    switchTabs(index) {
      this.tabsIndex = index;
    },
    exportData() {},
    getChidrendata() {},
    clickmenu({
      index,
      version,
      rankOrder,
      orgUuid,
      sliblings,
      isLastOne,
      node,
      value,
      e,
      downData,
      upData
    }) {
      var data = [
        {
          value: "openVideo",
          label: "打开视频"
        },
        {
          value: "watchVideo",
          label: "查看录像"
        }
      ];
      this.treeName = "tree1";
      this.node = node;
      this.parent = node;
      this.Treeparent = node;
      this.nodeValue = value;
      this.rankOrder = rankOrder;
      this.showMenu(data, e);
    },
    clickmenu2(row) {
      var data = [
        {
          value: "openVideo2",
          label: "打开视频"
        },
        {
          value: "watchVideo2",
          label: "查看录像"
        }
      ];
      this.treeName = "tree2";
      this.node = row.node;
      this.parent = row.node;
      this.Treeparent = row.node;
      this.nodeValue = row.value;
      this.rankOrder = row.rankOrder;
      this.showMenu(data, row.e);
    },
    clickmenu3(row) {
      var data = [
        {
          value: "openView",
          label: "打开视图"
        },
        {
          value: "renameView",
          label: "重命名"
        },
        {
          value: "deleteView",
          label: "删除"
        }
      ];
      this.treeName = "tree3";
      this.node = row.node;
      this.parent = row.node;
      this.Treeparent = row.node;
      this.nodeValue = row.value;
      this.rankOrder = row.rankOrder;
      this.showMenu(data, row.e);
    },
    showMenu(data, e) {
      const _this = this;
      this.$ContextMenu({
        data: data,
        event: e,
        callback(value) {
          // value表示点击按钮的value
          _this.deal(value);
        }
      });
    },
    deal(value) {
      console.log(value);
      if (value === "renameView") {
        this.changeTagDialogVisible = true;
      }
    }
  }
};
</script>
<style lang="scss">
@import "@/style/variables.scss";
#VideoPreviewContentLeft {
  .el-tabs__item {
    color: #dddddd;
  }
  .el-tabs__nav-wrap::after {
    background: rgb(131, 131, 131);
  }
  .is-active {
    color: $add-text-color;
  }
  .el-input__prefix {
    position: absolute;
    left: 43px;
    top: 0px;
    img {
      margin-top: 9px;
    }
  }
}
</style>

<style lang="scss" scoped>
@import "@/style/variables.scss";
.left {
  width: 280px;
  box-sizing: border-box;
  height: 100%;
  $iconWidth: 40px;
  background-color: rgba(35, 38, 41, 0.8);
  padding: 0px 40px;
  .treeWrap {
    height: calc(100vh - 550px);
    overflow-y: auto;
  }
  .cloundControlPannel {
    padding-top: 30px;
    border-top: 1px solid rgba(255, 255, 255, 0.1);
    color: #fff;
    @include font-s;
    .h {
      text-align: center;
    }
    .buttonGroup {
      margin-top: 10px;
      flex-wrap: wrap;
      display: flex;
      justify-content: start;
      .button {
        width: 40px;
        height: 32px;
        display: flex;
        justify-content: center;
        align-items: center;
        margin-bottom: 5px;
        margin-right: 5px;
        cursor: pointer;
        background: rgba(40, 255, 187, 0.1);
        border: 1px solid rgba(38, 211, 157, 0.8);
        border-radius: 2px;
      }
    }
    .yuzhi {
      margin: 5px 0px;
    }
    .steplen {
      font-size: 0px;
      .label,
      .num {
        @include font-s;
        width: 50px;
        display: inline-block;
        line-height: 40px;
        vertical-align: middle;
      }
      .num {
        width: 30px;
        text-align: right;
      }
      .slide {
        display: inline-block;
        vertical-align: middle;
        width: calc(100% - 80px);
      }
    }
    .icons {
      margin: 15px 0px;
      display: flex;
      justify-content: space-between;
      .btngroup {
        width: 90px;
        flex-wrap: wrap;
        display: flex;
        justify-content: space-between;
        .button {
          width: 25px;
          height: 25px;
          background: rgba(255, 255, 255, 0.08);
          border-radius: 2px;
          display: flex;
          justify-content: center;
          align-items: center;
          margin-bottom: 5px;
          cursor: pointer;
        }
      }
    }
  }
  .treeSwitchTabs {
    ul {
      display: flex;
      list-style: none;
      padding: 0px;
      li {
        text-align: center;
        flex: 1;
        background-color: rgba(38, 211, 157, 0.2);
        color: #fff;
        line-height: 40px;
        cursor: pointer;
      }

      .active {
        background: rgba(38, 211, 157, 0.8);
      }
    }
  }
  .searchWrap {
    padding: 25px 0px 10px 0px;
    .el-input {
      position: relative;
      width: calc(100% - 30px);
    }
    $addIconWidth: 14px;
    img {
      display: inline-block;
      vertical-align: middle;
      width: $addIconWidth;
      margin-left: 4px;
      cursor: pointer;
    }
  }
}
</style>
