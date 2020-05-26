<template>
  <el-dialog width="820px"
             title="请选择视频源"
             :visible.sync="isCurrentShow"
             :before-close="onClickCancel"
             :append-to-body="true"
             :close-on-click-modal="false">
    <div class="dialog-content-video">
      <!--内容-->
      <div class="content-left">
        <div class="block-left">
          <el-input class="search-input"
                    v-model="titleText"
                    size="small"
                    clearable
                    @change="onChangeInput"
                    placeholder="搜索设备/标签">
            <img slot="prefix"
                 src="@/assets/images/search_s.png">
          </el-input>
          <div class="videoSrc-list">
            <el-tabs v-model="activeName"
                     v-if="isOneProject">
              <el-tab-pane label="设备树"
                           name="dev">
                <el-tree :props="defaultProps"
                         node-key="id"
                         :indent="10"
                         :data="treeData"
                         ref="elTree"
                         :expand-on-click-node="false"
                         lazy
                         :load="loadNode"
                         :default-expanded-keys="defaultExpKeys"
                         :highlight-current="true"
                         @node-click="handleNodeClick">
                  <div class="i-tree-item"
                       slot-scope="{ node, data }">
                    <div class="i-tree-item-icon">
                      <span class="text-show">{{node.label}}</span>
                      <div class="action-icon">
                        <img src="@/assets/images/checked_icon.png"
                             width="10.9px"
                             v-if="data.checked"
                             height="9px">
                      </div>
                    </div>
                  </div>
                </el-tree>
              </el-tab-pane>
              <el-tab-pane label="标签"
                           name="tag">
                <el-tree :props="defaultProps"
                         node-key="id"
                         :indent="10"
                         ref="elTreeTag"
                         lazy
                         :data="treeDataTag"
                         :load="loadNodeTag"
                         :default-expanded-keys="defaultExpKeysTag"
                         :highlight-current="true"
                         @node-click="handleNodeClick">
                  <div class="i-tree-item"
                       slot-scope="{ node, data }">
                    <div class="i-tree-item-icon">
                      <span class="text-show">{{node.label}}</span>
                      <div class="action-icon">
                        <img src="@/assets/images/checked_icon.png"
                             width="10.9px"
                             v-if="data.checked"
                             height="9px">
                      </div>
                    </div>
                  </div>
                </el-tree>
              </el-tab-pane>
            </el-tabs>
            <the-leftmenu ref="leftMenu"
                          v-if="!isOneProject && isShowTwoLevelTree"
                          :ShowAuthDisabled='true'
                          :OwnAuthDisabled='false'
                          :isOnlyArea="false"
                          :isShowInput="false"
                          :isCanChecked="true"
                          :ownWidth="340"
                          needType="orgAndVideoDev"
                          @clickNode="clickNodeAll"
                          @addData="addData"
                          orgType="areaOrg"></the-leftmenu>
          </div>
        </div>
      </div>
      <div class="content-right">
        <div class="block-right">
          <div class="title-line">
            <div class="spot"></div>
            <div class="title title-text">已选的视频源库</div>
          </div>
          <div class="selected-videoSrc">
            <template v-for="(item, index) in selectedList">
              <div :key="index"
                   class="videoSrc-select-item">
                <div class="item-videoSrc">
                  <img src="@/assets/images/person_g.png"
                       width="11px"
                       height="11px">
                  <span class="title-text text-show"
                        style="margin-left: 4px">{{item.label}}</span>
                </div>
                <div class="del-img"
                     @click="deleteItem(item)"
                     style="cursor: pointer;">
                  <img src="@/assets/images/delete_x.png"
                       width="13px"
                       height="13px">
                </div>
              </div>
            </template>
          </div>
        </div>
      </div>
    </div>
    <div slot="footer"
         class="dialog-footer">
      <el-button type="primary"
                 @click="onClickConfirm"
                 size="small">确定</el-button>
      <el-button type="primary"
                 @click="onClickCancel"
                 size="small">取消</el-button>
    </div>
  </el-dialog>
</template>

<script>
import TheLeftmenu from "@/pages/AreaManagement/views/leftWrap";
import * as api from "@/pages/equipmentMange/ajax.js";

export default {
  components: { TheLeftmenu },
  props: {
    isShow: {
      type: Boolean,
      default: false
    },
    initSelectData: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      isCurrentShow: false,
      titleText: "",
      selectedList: [],
      defaultExpKeys: [],
      defaultExpKeysTag: [],
      activeName: "dev",
      defaultProps: {
        children: "children",
        label: "label",
        isLeaf: "leaf"
      },
      treeData: [],
      treeDataTag: [],
      isOneProject: true,
      isShowTwoLevelTree: false
    };
  },
  created() {},
  mounted() {
    let projectType = this.$store.state.home.projectType || {};
    this.isOneProject = Boolean(projectType.platformLevel === "levelOne");
  },
  methods: {
    getFirstData() {
      this.$faceControlHttp
        .getDevList({
          needType: "orgAndVideoDev",
          orgType: "device",
          parentOrgUuid: ""
        })
        .then(res => {
          if (res.data.data) {
            this.treeData = res.data.data;
            this.treeData.forEach(v => {
              v.isChecked = false;
            });
          }
        });
      this.$faceControlHttp
        .getTagList({
          tagType: "device"
        })
        .then(res => {
          if (res.data.data) {
            this.treeDataTag = res.data.data.list;
          }
        });
      this.selectedList = this.$common.copyArray(
        this.initSelectData,
        this.selectedList
      );
    },
    loadNode(node, resolve) {
      if (node.level !== 0) {
        if (node.data.type === "organization") {
          this.$faceControlHttp
            .getDeviceChannelList({
              parentOrgUuid: node.data.id,
              projectUuid: this.$store.state.home.projectUuid,
              shootType: "faceSnap"
            })
            .then(res => {
              if (!res.data.data) {
                resolve([]);
              } else {
                let result = [];
                if (res.data.data) {
                  res.data.data.forEach(v => {
                    result.push({
                      id: v.channelUuid,
                      label: v.nickName,
                      channelUuid: v.channelUuid,
                      channelName: v.nickName,
                      channelType: v.channelType
                    });
                  });
                }
                for (let item of result) {
                  this.$set(item, "leaf", true);
                }
                this.selectedList.forEach(v => {
                  result.forEach(v2 => {
                    if (v2.id === v.id) {
                      this.$set(v2, "checked", true);
                    }
                  });
                });
                resolve(result);
              }
            });
        } else if (node.data.hasOwnProperty("channelType")) {
          resolve([]);
        }
      }
    },
    loadNodeTag(node, resolve) {
      if (node.level !== 0) {
        if (node.data) {
          this.$faceControlHttp
            .getTagDev({
              limit: 9999,
              page: 1,
              tagUuid: node.data.id,
              viewType: "video"
            })
            .then(res => {
              if (!res.data.data) {
                resolve([]);
              } else {
                let dataList = [];
                if (res.data.data.list) {
                  res.data.data.list.forEach(v => {
                    dataList.push({
                      id: v.channelUuid,
                      label: v.channelName,
                      channelUuid: v.channelUuid,
                      channelName: v.channelName,
                      channelType: v.channelType
                    });
                  });
                  this.selectedList.forEach(v => {
                    dataList.forEach(v2 => {
                      if (v2.id === v.id) {
                        this.$set(v2, "checked", true);
                      }
                    });
                  });
                }
                for (let item of dataList) {
                  this.$set(item, "leaf", true);
                }
                resolve(dataList);
              }
            });
        }
      }
    },
    deleteItem(item) {
      if (this.isOneProject) {
        for (let [i, v] of this.selectedList.entries()) {
          if (v.id === item.id) {
            if (this.$refs.elTree.getNode(v.id)) {
              this.$set(this.$refs.elTree.getNode(v.id).data, "checked", false);
            }
            if (this.$refs.elTreeTag.getNode(v.id)) {
              this.$set(
                this.$refs.elTreeTag.getNode(v.id).data,
                "checked",
                false
              );
            }
            this.selectedList.splice(i, 1);
          }
        }
      } else {
        for (let [i, v] of this.selectedList.entries()) {
          if (v.id === item.id) {
            if (this.$refs.leftMenu.$refs.mytree.getNode(v.id)) {
              this.$set(
                this.$refs.leftMenu.$refs.mytree.getNode(v.id).data,
                "checked",
                false
              );
            }
            this.selectedList.splice(i, 1);
          }
        }
      }
    },
    handleNodeClick(obj, node, component) {
      if (obj.type === "organization") {
        obj.isChecked = !obj.isChecked;
        if (node.childNodes) {
          node.childNodes.forEach(v => {
            this.$set(v.data, "checked", obj.isChecked);
            if (v.data.checked) {
              if (!this.selectedList.some(val => val.id === v.data.id)) {
                this.selectedList.push(v.data);
              }
            } else {
              for (let [i, v2] of this.selectedList.entries()) {
                if (v2.id === v.data.id) {
                  this.selectedList.splice(i, 1);
                }
              }
            }
          });
        }
      }
      if (obj.hasOwnProperty("channelType")) {
        this.$set(obj, "checked", !obj.checked);
        if (obj.checked) {
          if (!this.selectedList.some(val => val.id === obj.id)) {
            this.selectedList.push(obj);
          }
        } else {
          for (let [i, v] of this.selectedList.entries()) {
            if (v.id === obj.id) {
              this.selectedList.splice(i, 1);
            }
          }
        }
      }
    },
    onClickConfirm() {
      this.$emit("onConfirm", this.selectedList);
      this.$emit("onCancel");
    },
    onClickCancel() {
      // this.resetFormData();
      if (!this.isOneProject) {
        this.isShowTwoLevelTree = false;
      }
      this.$emit("onCancel");
    },
    // resetFormData() {},
    onChangeInput() {},
    addData(data, callback) {
      let peojectuuid = data.childProjectUuid;
      let params = {
        parentOrgUuid: data.type === "project" ? "" : data.id,
        needType: "orgAndVideoDev",
        orgType: "device"
      };
      let projectUuid = data.type === "project" ? data.id : data.projectUuid;
      if (data.type === "project") {
        api.getOrgByProjectUuid(params, projectUuid).then(res => {
          let result = res.data.data || [];
          for (let i = 0; i < result.length; i++) {
            result[i].projectUuid = projectUuid;
            result[i].nextCount = 1;
            result[i].isChecked = false;
          }
          callback(result);
        });
      } else {
        this.$faceControlHttp
        .getDeviceChannelList({
          parentOrgUuid: data.id,
          projectUuid,
          shootType: "faceSnap"
        })
        .then(res => {
          let result = [];
          if (res.data.data) {
            res.data.data.forEach(v => {
              result.push({
                id: v.channelUuid,
                label: v.nickName,
                channelUuid: v.channelUuid,
                channelName: v.nickName,
                channelType: v.channelType
              });
            });
          }
          if (result.length === 0) {
            data.nextCount = 0;
          }
          for (let i = 0; i < result.length; i++) {
            result[i].projectUuid = projectUuid;
          }
          this.selectedList.forEach(v => {
            result.forEach(v2 => {
              if (v2.id === v.id) {
                this.$set(v2, "checked", true);
              }
            });
          });
          callback(result);
        });
      }
    },
    clickNodeAll(data, node) {
      if (data.type === "areaOrg" || data.type === "project") {
        return;
      }
      this.handleNodeClick(data, node);
    }
  },
  watch: {
    isShow(val) {
      this.isCurrentShow = val;
      if (val) {
        this.isShowTwoLevelTree = true;
        this.getFirstData();
      } else {
        this.treeData = [];
        this.treeDataTag = [];
        this.selectedList = [];
      }
    }
  }
};
</script>

<style lang="scss">
.block-left {
  .el-input__prefix {
    position: absolute;
    left: 36px;
    top: 7px;
  }
  .el-input--prefix .el-input__inner {
    padding-left: 28px;
  }
  .el-tree {
    background: #25292d;
  }
}
</style>
<style lang="scss" scoped>
.dialog-content-video {
  padding: 0 4% 4% 4%;
  height: 500px;
  width: 100%;
  box-sizing: border-box;
  display: flex;
  .content-left {
    width: 50%;
    height: 100%;
    border: {
      width: 0 1px 1px 0;
      style: solid;
      color: rgba($color: #ffffff, $alpha: 0.06);
    }
    padding: 20px 15px;
    box-sizing: border-box;
    .block-left {
      width: 100%;
      height: 100%;
      margin-left: -10px;
      text-align: center;
      .search-input {
        width: 95%;
      }
      .videoSrc-list {
        width: 100%;
        height: 90%;
        margin-top: 20px;
        overflow-y: auto;
        overflow-x: hidden;
        .videoSrc-item {
          height: 32px;
          display: flex;
          flex-flow: row nowrap;
          align-items: center;
          padding: 0 2.5%;
          cursor: pointer;
          &:hover {
            background: rgba($color: #26d39d, $alpha: 0.15);
          }
          .item-videoSrc {
            width: 34%;
            margin-left: 18px;
            text-align: left;
          }
          .item-name {
            width: 20%;
            margin-left: 30px;
            text-align: left;
          }
          .check-img {
            margin-left: auto;
            margin-right: 8px;
          }
        }
      }
    }
    .text-style {
      font-family: PingFangSC-Regular;
      font-size: 13px;
      color: #dddddd;
    }
  }
  .content-right {
    width: 50%;
    height: 100%;
    border: {
      width: 0 0 1px 0;
      style: solid;
      color: rgba($color: #ffffff, $alpha: 0.06);
    }
    padding: 15px 15px;
    box-sizing: border-box;
    .block-right {
      width: 100%;
      height: 100%;
      margin-left: 18px;
      text-align: center;
      .title-line {
        display: flex;
        align-items: center;
        .spot {
          width: 5px;
          height: 5px;
          background: #aaaaaa;
          border-radius: 1px;
        }
        .title {
          margin-left: 6px;
        }
      }
      .selected-videoSrc {
        width: 100%;
        height: 95%;
        padding: 8px 0;
        box-sizing: border-box;
        margin-top: 20px;
        overflow-y: auto;
        overflow-x: hidden;
        text-align: center;
        display: flex;
        flex-flow: row wrap;
        align-content: flex-start;
        .videoSrc-select-item {
          height: 36px;
          display: flex;
          flex-flow: row nowrap;
          align-items: center;
          padding: 0 6px;
          box-sizing: border-box;
          background: rgba($color: #ffffff, $alpha: 0.03);
          border-radius: 3px;
          margin-bottom: 10px;
          margin-right: 10px;
          position: relative;
          .item-videoSrc {
            text-align: left;
          }
          .item-name {
            width: 20%;
            margin-left: 30px;
            text-align: left;
          }
          .del-img {
            position: absolute;
            top: -5px;
            right: -5px;
          }
        }
      }
      .title-text {
        font-family: PingFangSC-Regular;
        font-size: 13px;
        color: #dddddd;
      }
    }
  }
}
.dialog-footer {
  padding: 0 4% 4% 0;
  box-sizing: border-box;
}
.i-tree-item {
  width: 100%;
  .i-tree-item-icon {
    display: flex;
    align-items: center;
    .action-icon {
      margin-left: auto;
      margin-right: 18px;
    }
  }
}
</style>
