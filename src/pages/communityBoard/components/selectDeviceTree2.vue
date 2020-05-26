<template>
  <el-dialog :title="title"
             @close="close"
             :width="width"
             :class="{'dialogCenter':center}"
             :visible.sync="TreechangeNameDialogVisible">
    <div class='treeSelectjiangWrap'>
      <el-tree :props="devprops"
               v-if="visible"
               :load="devloadNode"
               ref="tree1"
               :default-expanded-keys="defaultExpKeys"
               node-key="id"
               class='videoTree'
               lazy>
        <div class="custom-tree-node"
             @contextmenu="saveClickData(node, data,$event)"
             slot-scope="{ node, data }">
          <div class="channelStatus">
            <img :src="data.icon"
                 v-if="data.icon"
                 alt="">
            <span @dblclick.stop="openVidoeByDBClick(node,data,$event)"
                  class="span "
                  :draggable="data.nodeType==='chnNode'"
                  :class="{'channelOffline':!data.isOnline}"
                  :title="node.label">{{ node.label }}</span>

            <span class="el-dropdown-link  "
                  v-if="data.isOnline&&data.nodeType=='chnNode'"
                  @click.stop="saveClickData(node, data,$event)">
              <img class="checked-img threelinemenu"
                   src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAwAAAAKCAYAAACALL/6AAAAAXNSR0IArs4c6QAAAGxJREFUGBmlj7EJgEAQBPf8F+ENTBQMbEBsytRm7EQwF0sxMREzG/hbv4SD33h2YGTksRMywLACvDxQLSViY+ChwGfh8hhJDWtS9DaN3L6A24jYWg6Eey1cHiMTz1khnUUj0McrGAitLYfUEH75HhuBIHOOjAAAAABJRU5ErkJggg=="
                   style="margin-right: 20%;">
            </span>
          </div>

        </div>
      </el-tree>
    </div>
    <div style="height:60px;"></div>
  </el-dialog>
</template>

<script>
import * as api2 from "@/pages/VideoPreview/ajax.js";
export default {
  name: "TreeChangeNameDialog.vue",
  props: {
    width: {
      type: String,
      default() {
        return "400px";
      }
    },
    title: {
      type: String,
      default() {
        return "选择设备视频";
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
    }
  },
  data() {
    return {
      defaultExpKeys: [],
      TreechangeNameDialogVisible: false,
      devprops: {
        label: "label",
        isLeaf: "leaf"
      }
    };
  },
  mounted() {
    this.TreechangeNameDialogVisible = this.visible;
  },
  methods: {
    openVidoeByDBClick(node, data, e) {
      // console.log(node, data, e);
      e.preventDefault();
      e.stopPropagation();
      this.operatorData = data;
      // 不在线的通道 ，双击进行展示
      if (data.isOnline === false) {
        this.$message.error("设备不在线");
      } else {
        if (data.hasOwnProperty("channelUuid") || data.nodeType === "chnNode") {
          this.chuliData();
        }
      }
    },
    saveClickData(node, data, event) {
      // 点击三角菜单保存树节点信息
      this.operatorData = data;
      if (event) {
        event.preventDefault();
        event.stopPropagation();
        const _this = this;
        this.$ContextMenu({
          data: [
            {
              value: "video",
              label: "打开视频"
              // children: [
              //   {
              //     label: "主码流",
              //     value: "main"
              //   },
              //   {
              //     label: "辅码流",
              //     value: "sub"
              //   },
              //   {
              //     label: "第三码流",
              //     value: "thrid"
              //   }
              // ]
            }
            // {
            //   value: "playback",
            //   label: "查看录像"
            // }
          ],
          event: event,
          callback(value) {
            // alert(value);
            // value表示点击按钮的value
            _this.handleCommand(value);
          }
        });
      }
    },
    getPreviewInfo(channelUuid, data, streamType, operator = 1) {
      // if (!data.isOnline) {
      //   return;
      // }
      this.$emit("playRtsp", channelUuid, streamType, data, operator);
      this.close();
    },
    chuliData(streamType = "") {
      console.log(this.operatorData);
      if (this.operatorData.nodeType === "chnNode") {
        this.getPreviewInfo(
          this.operatorData.id,
          this.operatorData,
          streamType
        );
      } else if (this.operatorData.nodeType === "devNode") {
        // 点击的是设备，根据设备
        this.getOnlineChannelList(this.operatorData.id, "devNode", streamType);
      } else if (this.operatorData.nodeType === "orgNode") {
        // 根据组织来获取通道
        this.getOnlineChannelList(this.operatorData.id, "orgNode", streamType);
      } else if (this.operatorData.hasOwnProperty("channelType")) {
        this.getPreviewInfo(
          this.operatorData.channelUuid,
          this.operatorData,
          streamType
        );
      } else if (this.operatorData.hasOwnProperty("tagType")) {
        this.getChannelByNode(this.operatorData.id).then(res => {
          console.log(res);
          let data = res || [];
          for (let i = 0; i < data.length; i++) {
            // 判断设备在不在线
            if (data[i].extInfo.chnOnlineOrNot === "online") {
              data[i].realType = data[i].channelType;
              this.getPreviewInfo(data[i].channelUuid, data[i], streamType, -1);
            }
          }
        });
      }
    },
    handleCommand(command) {
      console.log(command);
      console.log(this.operatorData);
      if (command === "video") {
        // 打开视频操作
        this.chuliData();
      } else if (
        command === "main" ||
        command === "sub" ||
        command === "thrid"
      ) {
        this.chuliData(command);
      } else if (command === "playback") {
        console.log(this.operatorData);
        if (this.operatorData.nodeType === "chnNode") {
          this.$emit(
            "switchLuxiang",
            this.operatorData.id,
            this.operatorData.label
          );
        } else if (this.operatorData.hasOwnProperty("channelUuid")) {
          this.$emit(
            "switchLuxiang",
            this.operatorData.channelUuid,
            this.operatorData.channelName
          );
        } else {
          this.$message.error("请选择通道查看录像！");
        }
      } else if (command === "view") {
        this.openVidewTu();
      } else if (command === "renameView") {
        this.nodeValue = this.operatorData.viewName;
        this.changeNameDialogVisible = true;
      } else if (command === "deleteView") {
        this.isDeleteVisible = true;
      }
    },
    videoTree(parentUuid, parentType) {
      // 换成视频回放树，添加nvr设备
      let data = {};
      if (parentUuid) {
        data.parentUuid = parentUuid;
      }
      if (parentType) {
        data.parentType = parentType;
      }
      return new Promise((resolve, reject) => {
        api2
          .getPlayTree(data)
          .then(res => {
            let list = res.data.data || [];
            resolve(list);
          })
          .catch(err => {
            console.log(err);
            resolve([]);
          });
      });
      // 下面是新树的接口，不满足有nvr的条件，更换成上面的
    },
    async devloadNode(node, resolve) {
      setTimeout(async () => {
        //  懒加载子结点
        console.log(node);
        let data = await this.videoTree(
          node.data && node.data.id,
          node.data && node.data.nodeType
        );
        if (node.level === 0) {
          if (data.length) {
            this.defaultExpKeys.push(data[0].id);
            this.showMaxWidth = true;
          }
        }
        data = data.map(item => {
          item.leaf = !item.openFlag;
          item.isOnline = true;
          if (item.nodeType === "chnNode") {
            item.isOnline = item.extInfo.chnOnlineOrNot === "online";
          }
          if (item.nodeType === "devNode") {
            item.isOnline = item.extInfo.devOnlineOrNot === "online";
          }
          item.icon = this.getIcon(item.isOnline, item.realType);
          return item;
        });
        // data = [
        //   {
        //     label: "测试",
        //     id: "49D2B7299EAAA3AF295E33F03B982D32",
        //     leaf: true
        //   }
        // ];
        console.log(data);
        return resolve(data);
      }, 0);
    },
    getIcon(isOnline, type) {
      let treeIcons = window.config.treeIcons || [],
        icon = "";
      for (let i = 0; i < treeIcons.length; i++) {
        if (treeIcons[i].value === type) {
          if (!isOnline) {
            icon = require(`@/assets/images/treeIcons/${
              treeIcons[i].icon
            }2.png`);
          } else {
            icon = require(`@/assets/images/treeIcons/${
              treeIcons[i].icon
            }.png`);
          }
          break;
        }
      }
      return icon;
    },
    confirm() {
      this.$emit("confirm", this.name, this.selectValue);
      this.$emit("update:visible", false);
    },
    close() {
      this.$emit("update:visible", false);
    }
  },
  watch: {
    visible(val) {
      this.TreechangeNameDialogVisible = this.visible;
    }
  }
};
</script>
<style lang="scss">
$labelwidth: 5em;
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
$labelwidth: 5em;
.treeSelectjiangWrap {
  margin: 30px 60px;
  &::after {
    content: "";
    display: block;
    clear: both;
  }
}
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
