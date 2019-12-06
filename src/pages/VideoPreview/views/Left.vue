<template>
  <div id="treeLaa"
       class="treeLaa">
    <div class="searchWrap">
      <el-input :placeholder="orgType=='staff'?'搜索组织/标签/名称':'搜索设备/标签/名称'"
                class='mysearchText'
                v-model="searchText">
        <img slot="prefix"
             class="image"
             :src="icons.search"
             alt>
      </el-input>
      <!-- <img v-if="activeName==='view'"
           @click="showAddTagDialog"
           :src="icons.addSign"
           alt> -->
    </div>

    <el-tabs v-model="activeName"
             class="tabs"
             :class="{'tabsPanel':showCloudControl}"
             @tab-click="handleClick">
      <el-tab-pane :label="orgType==='device'?'设备树':'组织架构'"
                   class="mypanel"
                   name="organiza">
        <el-tree :props="devprops"
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
                    @dragstart="dragstart(data,$event)"
                    :class="{'channelOffline':!data.isOnline}"
                    :title="node.label">{{ node.label }}</span>

              <span class="el-dropdown-link  "
                    v-if="data.isOnline||data.nodeType!='chnNode'"
                    @click.stop="saveClickData(node, data,$event)">
                <img class="checked-img threelinemenu"
                     src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAwAAAAKCAYAAACALL/6AAAAAXNSR0IArs4c6QAAAGxJREFUGBmlj7EJgEAQBPf8F+ENTBQMbEBsytRm7EQwF0sxMREzG/hbv4SD33h2YGTksRMywLACvDxQLSViY+ChwGfh8hhJDWtS9DaN3L6A24jYWg6Eey1cHiMTz1khnUUj0McrGAitLYfUEH75HhuBIHOOjAAAAABJRU5ErkJggg=="
                     style="margin-right: 20%;">
              </span>
            </div>

          </div>
        </el-tree>
      </el-tab-pane>
      <el-tab-pane label="标签"
                   name="tag">
        <el-tree :props="props"
                 class='videoTree'
                 :load="loadNode"
                 :default-expanded-keys="defaultExpKeys"
                 node-key="id"
                 :expand-on-click-node="false"
                 lazy
                 @node-click="handleNodeClick">
          <div class="custom-tree-node"
               @contextmenu="saveClickData(node, data,$event)"
               slot-scope="{ node, data }">
            <div class="channelStatus">
              <img :src="data.icon"
                   v-if="data.icon"
                   alt="">
              <span class="span"
                    @dblclick.stop="openVidoeByDBClick(node,data,$event)"
                    @click.stop="saveClickData('', data)"
                    :draggable="data.hasOwnProperty('channelType')"
                    @dragstart="dragstart(data,$event)"
                    :title="node.label"
                    :class="{'channelOffline':!data.isOnline}">{{ node.label }}</span>
              <el-dropdown trigger="click"
                           @command="handleCommand"
                           placement="bottom"
                           class='threelinemenu'>
                <span class="el-dropdown-link"
                      v-if="data.isOnline||!data.hasOwnProperty('channelType')"
                      @click="saveClickData(node, data,$event)">
                  <img class="checked-img"
                       src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAwAAAAKCAYAAACALL/6AAAAAXNSR0IArs4c6QAAAGxJREFUGBmlj7EJgEAQBPf8F+ENTBQMbEBsytRm7EQwF0sxMREzG/hbv4SD33h2YGTksRMywLACvDxQLSViY+ChwGfh8hhJDWtS9DaN3L6A24jYWg6Eey1cHiMTz1khnUUj0McrGAitLYfUEH75HhuBIHOOjAAAAABJRU5ErkJggg=="
                       style="margin-right: 20%;">
                </span>
                <el-dropdown-menu slot="dropdown">
                  <el-dropdown-item command="video">打开视频</el-dropdown-item>
                  <el-dropdown-item command="playback">查看录像</el-dropdown-item>
                </el-dropdown-menu>
              </el-dropdown>
            </div>

          </div>
        </el-tree>

      </el-tab-pane>
      <el-tab-pane label="视图"
                   name="view">
        <el-tree :props="viewProps"
                 class='videoTree'
                 :data="viewTreeData"
                 refs="tree3"
                 @check-change="viewhandleCheckChange">
          <div class="custom-tree-node"
               slot-scope="{ node, data }">
            <div>
              <span class="span"
                    style='min-width:150px;display:inline-block;'
                    @dblclick.stop="openVidewTu(node,data,$event)"
                    :title="node.label">{{ node.label }}</span>
              <el-dropdown trigger="click"
                           @command="handleCommand"
                           placement="bottom"
                           class='threelinemenu'>
                <span class="el-dropdown-link">
                  <img class="checked-img"
                       src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAwAAAAKCAYAAACALL/6AAAAAXNSR0IArs4c6QAAAGxJREFUGBmlj7EJgEAQBPf8F+ENTBQMbEBsytRm7EQwF0sxMREzG/hbv4SD33h2YGTksRMywLACvDxQLSViY+ChwGfh8hhJDWtS9DaN3L6A24jYWg6Eey1cHiMTz1khnUUj0McrGAitLYfUEH75HhuBIHOOjAAAAABJRU5ErkJggg=="
                       style="margin-right: 20%;">
                </span>
                <el-dropdown-menu slot="dropdown">
                  <el-dropdown-item command="view">打开视图</el-dropdown-item>
                  <el-dropdown-item command="renameView">重命名</el-dropdown-item>
                  <el-dropdown-item command="deleteView">删除</el-dropdown-item>
                </el-dropdown-menu>
              </el-dropdown>
            </div>
          </div>
        </el-tree>
      </el-tab-pane>
    </el-tabs>

    <div class="cloundControlPannel"
         v-show="showCloudControl">
      <div class="h">
        <img :src="icons.control"
             alt="">
        云控制台
      </div>
      <div class="icons">
        <div class="btngroup">
          <div class="button"
               v-for='(item,index) in btnGroup'
               @mousedown="cloundControl(item,index)"
               @mouseup="cloundControl2(item,index)"
               :key="index">
            <img :src="icons[item]"
                 alt="">
          </div>
        </div>
        <div class="btngroup">
          <div class="button"
               v-for='(item,index) in btnGroup2'
               @mousedown="cloundControl(item,index)"
               @mouseup="cloundControl2(item,index)"
               :key="index">
            <img :src="icons[item]"
                 alt="">
          </div>
        </div>
      </div>
      <div class='steplen'>
        <label class='label'>
          步长
        </label>
        <el-slider class='slide'
                   :max="10"
                   :min="1"
                   v-model="steplen"></el-slider>
        <span class="num">
          {{steplen}}
        </span>
      </div>
      <div class='yuzhi'>
        <el-select v-model="value"
                   placeholder="请选择">
          <el-option v-for="item in DOptions"
                     :key="item.value"
                     :label="item.label"
                     :value="item.value">
          </el-option>
        </el-select>
      </div>
      <div class='yuzhi'
           v-show="value==='yuzhi'">
        <el-select v-model="yuzhi"
                   @change="changeYuZhi"
                   placeholder="请选择">
          <el-option v-for="item in yuzhiOptions"
                     :key="item.presetPositionUuid"
                     :label="item.presetName"
                     :value="item.presetPositionUuid">
          </el-option>
        </el-select>
      </div>
      <div class='yuzhi'>
        <el-select v-model="xunhang"
                   v-show="value==='xunhang'"
                   placeholder="请选择">
          <el-option v-for="item in xunhangOptions"
                     :key="item.value"
                     :label="item.label"
                     :value="item.value">
          </el-option>
        </el-select>
      </div>
      <div class='yuzhi'
           v-show="isChoose">
        <el-input v-model="VideoOprName"></el-input>
      </div>
      <div class="buttonGroup">
        <!-- 点击就去这个点的设置位置 -->
        <div class="button"
             @click="chooseItem"
             v-show="((value=='yuzhi'&&yuzhi!=='')||(value=='xunhang'&&xunhang!==''))&&!isChoose"
             title="">
          <img :src="icons.center"
               alt="">
        </div>
        <!-- 进入预置点的设置 -->
        <div class="button"
             @click="setYZ"
             v-show="!isChoose"
             title="">
          <img :src="icons.preset"
               alt="">
        </div>
        <div class="button"
             v-show="isChoose"
             @click="setback"
             title="">
          <img :src="icons.refresh2"
               alt="">
        </div>
        <div class="button"
             v-show="isChoose"
             @click="chooseIcno"
             title="">
          <img :src="icons.chooseIcon"
               alt="">
        </div>
        <div class="button"
             v-show="isChoose"
             @click="deleteChoose"
             title="">
          <img :src="icons.deleteIcon"
               alt="">
        </div>
      </div>
    </div>

    <tree-append-child-dialog @confirm="addchildren"
                              :options="options"
                              :select="select"
                              :title="addTitle"
                              :visible.sync="appendChildrenDialogVisible"></tree-append-child-dialog>

    <tree-append-tag-dialog @confirm="addTag"
                            :title="addTitle"
                            :visible.sync="appendTagDialogVisible"></tree-append-tag-dialog>

    <tree-change-name-dialog @confirm="changeName"
                             :value="nodeValue"
                             :title="changeTitle"
                             :visible.sync="changeNameDialogVisible"></tree-change-name-dialog>

    <org-dialog :visible.sync="showOrgDialogVisible"
                :orgType="orgType"
                @confirm="confirAppendChildren"></org-dialog>
    <confirm-dialog :visible.sync="isDeleteVisible"
                    @confirm="deleteNode"
                    confirmText="确定删除"></confirm-dialog>
  </div>
</template>
<script>
import TreeAppendChildDialog from "@/common/TreeAppendChildDialog";
import TreeChangeNameDialog from "@/common/TreeChangeNameDialog";
import TreeAppendTagDialog from "@/common/TreeAppendTagDialog";
import ConfirmDialog from "@/common/ConfirmDialog";
import icons from "@/common/icon.js";
import * as api from "@/pages/equipmentMange/ajax.js";
import * as api2 from "@/pages/VideoPreview/ajax.js";
import orgDialog from "@/pages/equipmentMange/components/orgDialog";
import { addTreeKey, copyTreeKey, remeberLast } from "@/utils/tree";
import { mapState } from "vuex";
// 接口调不了，自己mock数据来测试一下
export default {
  name: "leftmenu",
  components: {
    TreeAppendChildDialog,
    TreeChangeNameDialog,
    TreeAppendTagDialog,
    orgDialog,
    ConfirmDialog
  },
  props: {
    showCloudControl: {
      type: Boolean,
      default() {
        return false;
      }
    },
    orgType: {
      type: String,
      default() {
        return window.config.orgType;
      }
    },
    channelUuid: {
      type: String,
      default() {
        return "";
      }
    },
    tagType: {
      type: String,
      default() {
        return window.config.tagType;
      }
    },
    needType: {
      type: String,
      default() {
        return "";
      }
    }
  },
  data() {
    return {
      operatorData: "", // 存储树菜单正在操作的节点
      changeTitle: "视图重命名",
      addTitle: "",
      showOrgDialogVisible: false,
      VideoOprName: "",
      isDeleteVisible: false,
      isChoose: false,
      Treeparent: "",
      options: [],
      select: "",
      treeName: "tree1",
      activeName: "organiza",
      icons,
      searchText: "", // 搜索框的文本
      appendChildrenDialogVisible: false,
      appendTagDialogVisible: false,
      changeNameDialogVisible: false,
      node: "", // 用于存储当前的操作的节点
      nodeValue: "", // 值
      rankOrder: "",
      orgUuid: "", //
      version: "",
      tagIndex: 0, // 用来上下移动标签的时候记录
      data: [],
      data2: [],
      devprops: {
        label: "label",
        isLeaf: "leaf"
      },
      props: {
        label: "label",
        isLeaf: "leaf"
      },
      defaultExpKeys: [],
      data3: [
        {
          label: "自定义视图",
          icon: icons.folder,
          children: new Array(4).fill({
            label: "东门4画面"
          })
        }
      ],
      treenodeNums: [],
      selectId: "",
      parentOrgUuid: "",
      lastParentOrgUuid: "", // 更新
      lastParent: "",
      upData: {},
      downData: {},
      btnGroup: [
        "up_left",
        "up",
        "up_right",
        "left",
        "center",
        "right",
        "down_left",
        "down",
        "down_right"
      ],
      btnGroup2: [
        "zoom_in",
        "fangda",
        "zoom_out",
        "zoom_in",
        "centerbig",
        "zoom_out",
        "zoom_in",
        "quan",
        "zoom_out"
      ],
      value: "yuzhi",
      yuzhi: "",
      xunhang: "",
      steplen: 5,
      DOptions: [
        {
          value: "yuzhi",
          label: "预置点"
        }
      ],
      yuzhiOptions: [],
      xunhangOptions: [],
      viewProps: {
        label: "viewName"
      },
      viewTreeData: [
        // {
        //   viewName: "一级 1"
        // },
        // {
        //   viewName: "一级 2"
        // },
        // {
        //   viewName: "一级 3"
        // }
      ],
      maxStepLength: 10
    };
  },
  mounted() {
    this.data = [];
    this.data2 = [];
    this.parentOrgUuid = "";
    this.Treeparent = "";
    // this.getOrgTree(true);
  },
  activated() {},
  computed: {
    ...mapState({
      tagUuid: state => {
        return state.equipment.tagUuid;
      }
    })
  },
  methods: {
    dragstart(data, e) {
      console.log(JSON.stringify(data));
      // 使用whereform记录拖拽源
      e.dataTransfer.setData("whereform", "tree");
      e.dataTransfer.setData("operatorData", JSON.stringify(data));
    },
    changeYuZhi() {
      // 下拉列表修改预置点，暂且不需要什么操作
      // for (let i = 0; i < this.yuzhiOptions.length; i++) {
      //   if (this.yuzhiOptions[i].presetPositionUuid === this.yuzhi) {
      //     console.log(this.yuzhiOptions[i]);
      //     this.maxStepLength = Math.max(
      //       this.maxStepLength,
      //       this.yuzhiOptions[i].stepLength
      //     );
      //     this.steplen = this.yuzhiOptions[i].stepLength;
      //     break;
      //   }
      // }
    },
    getPreset(resetYuzhi = false) {
      api2.getPreset({ channelUuid: this.channelUuid }).then(res => {
        let data = res.data.data || {};
        let list = (data && data.list) || [];
        let presetPosCount = data.presetPosCount || 256;
        let num = Array.from({ length: presetPosCount }, (item, index) => {
          return {
            isNew: true, // 表示是否没被设置过的预置点
            presetPositionUuid: index, // 预置点uuid
            presetPoisition: index, // 预置点位置
            presetName: index + 1, // 预置点名称
            presetNo: index // 预置点编号}
          };
        });
        for (let i = 0, len = list.length; i < len; i++) {
          num[list[i].presetNo] = list[i];
          num[list[i].presetNo].isNew = false;
        }
        // console.log(num);
        this.yuzhi = "";
        this.yuzhiOptions = num;
      });
    },
    viewhandleCheckChange() {
      console.log(this.$refs.tree3.getCheckedNodes());
    },
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
              label: "打开视频",
              children: [
                {
                  label: "主码流",
                  value: "main"
                },
                {
                  label: "辅码流",
                  value: "sub"
                },
                {
                  label: "三码流",
                  value: "thrid"
                }
              ]
            },
            {
              value: "playback",
              label: "查看录像"
            }
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
    // 根据组织或者设备来获取
    getOnlineChannelList(parentUuid, parentType, streamType) {
      api2
        .getOnlineChannel({
          parentUuid,
          parentType
        })
        .then(res => {
          console.log(res);
          let data = res.data.data;
          // 这里获取到通道UUid
          for (let i = 0; i < data.length; i++) {
            data[i].realType = data[i].type;
            this.getPreviewInfo(data[i].channelUuid, data[i], streamType, -1);
          }
        });
    },
    chuliData(streamType = "main") {
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
          streamType,
          this.operatorData
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
    openVidewTu() {
      this.$emit("openView", this.operatorData);
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
        if (this.operatorData.nodeType === "chnNode") {
          this.$emit(
            "switchLuxiang",
            this.operatorData.id,
            this.operatorData.label
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
    getPreviewInfo(channelUuid, data, streamType, operator = 1) {
      // if (!data.isOnline) {
      //   return;
      // }
      console.log(data);
      this.$emit("playRtsp", channelUuid, streamType, data, operator);
    },
    handleNodeClick() {
      // 点击展开
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
    async devloadNode(node, resolve) {
      //  懒加载子结点
      console.log(node);
      let data = await this.videoTree(
        node.data && node.data.id,
        node.data && node.data.nodeType
      );
      if (node.level === 0) {
        this.defaultExpKeys.push(data[0].id);
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
      // let data = {
      //   viewType: "video",
      //   treeStructure: "orgNode$device|chnNode",
      //   authEnable: false,
      //   parentUuid: parentOrgUuid,
      //   parentType,
      //   recursiveEnable: true,
      //   extInfo: {
      //     aimType: "chnOnlineStatus",
      //     aimDetail: null
      //   }
      // };
      // return new Promise((resolve, reject) => {
      //   api2
      //     .getPreviewTree(data)
      //     .then(res => {
      //       let list = res.data.data || [];
      //       resolve(list);
      //     })
      //     .catch(err => {
      //       console.log(err);
      //       resolve([]);
      //     });
      // });
    },
    async loadNode(node, resolve) {
      // 加载子结点
      console.log(node);
      if (node.level === 0) {
        let data = await this.getTagTreeData();
        console.log(data);
        if (node.level === 0) {
          this.defaultExpKeys.push(data[0].id);
        }
        return resolve(data);
      } else if (node.level === 1) {
        let data = await this.getChannelByNode(node.data.id);
        console.log(data);
        return resolve(data);
      }
    },
    getChannelByNode(tagUuid) {
      return new Promise((resolve, reject) => {
        api
          .getChannelByTag({
            tagUuid,
            page: 1,
            limit: 111111,
            viewType: "video"
          })
          .then(res => {
            let list = (res.data.data.list || []).map(item => {
              item.label = item.channelName;
              item.id = item.channelUuid;
              item.leaf = true;
              item.isOnline = item.extInfo.chnOnlineOrNot === "online";
              item.icon = this.getIcon(item.isOnline, item.channelType);

              return item;
            });
            resolve(list);
          });
      });
    },
    getTagTreeData() {
      return new Promise((resolve, reject) => {
        api
          .getTagList({
            tagType: this.tagType
          })
          .then(res => {
            let list = res.data.data.list || [];
            list = list.map(item => {
              item.isOnline = true;
              item.icon = require(`@/assets/images/treeIcons/doc.png`);
              return item;
            });
            resolve(list);
          });
      });
    },
    chooseItem() {
      // 选定预置点，这边进行一个跳转
      let flag = false;
      for (let i = 0; i < this.yuzhiOptions.length; i++) {
        if (
          this.yuzhiOptions[i].presetPositionUuid === this.yuzhi &&
          this.yuzhiOptions[i].isNew === false
        ) {
          this.VideoOprName = this.yuzhiOptions[i].presetName;
          flag = true;
          this.$emit(
            "preset",
            "goto_preset",
            this.yuzhiOptions[i].presetPoisition
          );
          break;
        }
      }
      if (!flag) {
        this.$message.error("该预置点没有进行过设置，不能跳转");
      }
    },
    setback() {
      this.isChoose = false;
    },
    setYZ() {
      for (let i = 0; i < this.yuzhiOptions.length; i++) {
        if (this.yuzhiOptions[i].presetPositionUuid === this.yuzhi) {
          this.VideoOprName = this.yuzhiOptions[i].presetName;
          break;
        }
      }
      this.isChoose = true;
    },
    chooseIcno() {
      // 点击了勾
      if (this.value === "yuzhi") {
        // 判断presetPositionUuid是不是空的，用来判断是新增还是更新
        console.log(this.yuzhi);
        let data = this.yuzhiOptions;
        // 用于判断是否找到了预置点列表中的之前数据
        let flag = false;
        for (let i = 0; i < data.length; i++) {
          if (
            data[i].presetPositionUuid === this.yuzhi &&
            data[i].isNew === false
          ) {
            data[i].presetName = this.VideoOprName;
            flag = true;
            this.$emit("updatePreset", data[i]);
          }
        }
        if (!flag) {
          // 表示没找到，那就是新增预置点
          //
          let data = {
            presetPoisition: this.yuzhi + 1, // 预置点位置
            presetName: this.VideoOprName, // 预置点名称
            presetNo: this.yuzhi, // 预置点编号
            channelUuid: this.channelUuid // 通道uuid
          };
          this.$emit("addPreset", data);
        }
      } else {
        api2
          .cruize({
            action: "string", // 操作类型，必填
            routeIndex: "int", // 巡航点，必填
            pointIndex: "int" // 预置点，必填
          })
          .then(() => {});
      }
    },
    deleteChoose() {
      // 清空预置点
      this.isChoose = false;
      let flag = false;
      for (let i = 0; i < this.yuzhiOptions.length; i++) {
        if (this.yuzhiOptions[i].presetPositionUuid === this.yuzhi) {
          flag = true;
          this.$emit("deletePreset", this.yuzhiOptions[i].presetPositionUuid);
          break;
        }
      }
      if (!flag) {
        this.$message.error("该预置点没有被设置过");
      }
    },
    cloundControl(name, index) {
      console.log(name, index);
      if (
        name === "fangda" ||
        name === "centerbig" ||
        name === "quan" ||
        name === "center"
      ) {
        return;
      }
      let action = "";
      if (name === "zoom_in") {
        action = "zoom_in";
        if (index === 0) {
          action = "zoom_in";
        } else if (index === 3) {
          action = "focus_near";
        } else if (index === 6) {
          action = "iris_open";
        }
      } else if (name === "zoom_out") {
        if (index === 2) {
          action = "zoom_out";
        } else if (index === 5) {
          action = "focus_far";
        } else if (index === 8) {
          action = "iris_close";
        }
      } else {
        action = name;
      }
      this.$emit("ctrl", action, true, this.steplen);
    },
    cloundControl2(name, index) {
      console.log(name, index);
      let action = "";
      if (
        name === "fangda" ||
        name === "centerbig" ||
        name === "quan" ||
        name === "center"
      ) {
        return;
      }
      if (name === "zoom_in") {
        action = "zoom_in";
        if (index === 0) {
          action = "zoom_in";
        } else if (index === 3) {
          action = "focus_near";
        } else if (index === 6) {
          action = "iris_open";
        }
      } else if (name === "zoom_out") {
        if (index === 2) {
          action = "zoom_out";
        } else if (index === 5) {
          action = "focus_far";
        } else if (index === 8) {
          action = "iris_close";
        }
      } else {
        action = name;
      }
      this.$emit("ctrl", action, false, this.steplen);
    },

    getViewTree() {
      // 获取视图
      api2
        .getView({
          viewUuid: "",
          viewType: "preview"
        })
        .then(res => {
          console.log(res);
          let data = res.data.data;
          let list = (data && data.list) || [] || [];
          this.viewTreeData = list
            .filter(item => {
              return item.viewType === "preview";
            })
            .map(item => {
              item.viewName = item.viewInfo.view_name;
              return item;
            });
        });
    },
    showAddChildrenDialog() {
      // this.appendChildrenDialogVisible = true;
      this.showOrgDialogVisible = true;
    },
    getMaxSn() {
      var max = 0;
      for (var i = 0, len = this.data2.length; i < len; i++) {
        if (this.data2[i].tagSn > max) {
          max = this.data2[i].tagSn;
        }
      }
      return max + 1;
    },
    showAddTagDialog() {
      this.appendTagDialogVisible = true;
      this.addTitle = "新增视图";
      // if (this.orgType === "device") {
      //   this.addTitle = "新增子结点";
      // } else {
      //   this.addTitle = "新增子部门";
      // }
    },
    addTag(name) {
      // api
      //   .addTag({
      //     tagName: name,
      //     tagSn: this.getMaxSn(),
      //     tagType: this.tagType
      //   })
      //   .then(res => {
      //     if (res.data.success) {
      //       this.getOrgTag(true);
      //     }
      //   });
      // 新增视图
      api2
        .addView({
          viewName: name // 视图名
        })
        .then(res => {
          console.log(res);
        });
    },
    getOrgTag(flag = false, uuid) {
      api
        .getTagList({
          tagType: this.tagType
        })
        .then(res => {
          if (res.data.data && res.data.data.list) {
            let result = res.data.data.list || [];
            addTreeKey(result, "icon", icons.sign);
            addTreeKey(result, "havechildren", "no");
            copyTreeKey(result, "label", "tagName");
            copyTreeKey(result, "orgUuid", "tagUuid");
            // if (!this.tagUuid) {
            // this.tagUuid = result[0].tagUuid;
            // this.commit("tagUuid",result[0].tagUuid);
            // alert(1);
            // 新增节点之后，不会去刷新右边第一个节点的列表
            if (!uuid) {
              this.$store.commit("setTagUuid", result[0].tagUuid);
              this.$store.commit("setTag", result[0]);
              this.$emit("clickNode", result[0]);
              result[0].selected = true;
            } else {
              let index = 0;
              for (let i = 0; i < result.length; i++) {
                if (result[i].tagUuid === uuid) {
                  result[i].selected = false;
                  index = i;
                  break;
                }
              }
              result[index].selected = true;
              this.$store.commit("setTagUuid", result[index].tagUuid);
              this.$store.commit("setTag", result[index]);
              this.$emit("clickNode", result[index]);
            }
            // }
            this.data2 = result;

            if (this.orgUuid === "" && result.length) {
              this.orgUuid = result[0].tagUuid;
              this.version = result[0].version;
              this.nodeValue = result[0].tagName;
              this.Treeparent = "0-0";
            }
            for (let i = 0, len = result.length; i < len; i++) {
              if (result[i].tagUuid === this.orgUuid) {
                this.version = result[i].version;
                this.nodeValue = result[i].tagName;
              }
            }
          }
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
    getOrgTree2() {
      // 这个更新树的方法
      // 根据parent来获取parentUuid.
      let path = this.Treeparent.split("-");
      let parentUuid = this.$refs[this.treeName].getParentKey(
        this.Treeparent,
        "id"
      );
      let data = {
        parentOrgUuid: parentUuid,
        needType: this.needType
      };
      this.orgUuid = "";
      api.getOrgTree(data, this.orgType).then(res => {
        if (res.data.data) {
          let result = res.data.data || [];
          addTreeKey(result, "icon", icons.folder);
          copyTreeKey(result, "label", "orgName");
          remeberLast(result, this.treenodeNums, this.selectId);
          // console.log(result);
          if (path.length <= 2) {
            this.data = result;
          } else {
            let parentNode = this.Treeparent.substr(
              0,
              this.Treeparent.lastIndexOf("-")
            );
            this.$refs[this.treeName].operator({
              operator: "addChildre",
              node: parentNode,
              value: result
            });
          }
          if (this.orgUuid === "" && result.length) {
            this.orgUuid = result[0].id;
            this.version = result[0].version;
            this.nodeValue = result[0].orgName;
            this.Treeparent = "0-0";
          }
          for (let i = 0, len = result.length; i < len; i++) {
            if (result[i].id === this.orgUuid) {
              this.version = result[i].version;
              this.nodeValue = result[i].orgName;
            }
          }
        }
        this.$emit("clickNode", { id: parentUuid, orgName: this.nodeValue });
      });
    },
    appendChild(children) {
      // console.log(children);
      // this.$refs[this.treeName].operator({
      //   operator: "addChildre",
      //   node: this.Treeparent,
      //   value: children
      // });
    },
    confirAppendChildren(data) {
      // console.log(data);
      if (data.parentUuid === "") {
        // 清空parentUuid和路径
        this.parentOrgUuid = "";
        this.Treeparent = "";
        this.getOrgTree();
      } else {
        // 确认添加节点，之后需要更新添加节点下面的子节点。
        // 需要根据添加节点的uuid找到父节点的路径(rankOrder),从而来更新
        this.parentOrgUuid = data.parentUuid;
        let path = this.$refs[this.treeName].operator({
          operator: "findParentById",
          parentUuid: data.parentUuid
        });
        if (path) {
          this.Treeparent = path;
          this.getOrgTree();
        }
      }
    },
    getChidrendata(orgUuid, isextend, parent) {
      let index = this.treenodeNums.indexOf(orgUuid);
      this.parentOrgUuid = orgUuid;
      if (isextend) {
        this.treenodeNums.push(orgUuid);
        this.getOrgTree();
      } else {
        this.treenodeNums.splice(index, 1);
      }
      this.Treeparent = parent;
    },
    exportData(data, root, rankOrder, node, parent) {
      this.orgUuid = node.id;
      this.version = node.version;
      this.nodeValue = node.orgName;
      //  用户存储上次的操作树的信息。保存选中和展开状态
      //  这里将点击的ID抛出去给外面
      this.$emit("clickNode", node);
      if (this.orgType === "device") {
        this.$store.commit("setOrgUuid", node.orgUuid);
      }

      // alert(node.orgUuid);
      this.selectId = data;
      this.select = node.orgUuid;
      this.Treeparent = parent;
      this.getoptions(root);
    },
    exportData2(data, root, rankOrder, node, parent) {
      // console.log(data, root, rankOrder, node);
      this.Treeparent = parent;
      this.orgUuid = node.tagUuid;
      this.version = node.version;
      this.nodeValue = node.tagName;
      this.$emit("clickNode", node);
      // alert(2);
      // console.log("22222222222222222222222222");
      if (this.orgType === "device") {
        this.$store.commit("setTagUuid", node.tagUuid);
        this.$store.commit("setTag", node);
      }
    },
    exportData3(data, root, rankOrder, node, parent) {
      // console.log(data, root, rankOrder, node);
      this.Treeparent = parent;
      this.orgUuid = node.tagUuid;
      this.version = node.version;
      this.nodeValue = node.tagName;
      this.$emit("clickNode", node);
      // alert(2);
      // console.log("22222222222222222222222222");
      if (this.orgType === "device") {
        this.$store.commit("setTagUuid", node.tagUuid);
        this.$store.commit("setTag", node);
      }
    },
    getoptions(sliblings) {
      // let arr = [];
      for (let i = 0, len = sliblings.length; i < len; i++) {
        sliblings[i].value = sliblings[i].orgUuid;
        // arr.push({
        //   label: sliblings[i].label,
        //   value: sliblings[i].orgUuid,

        // });
      }
      this.options = sliblings;
      // console.log(this.options);
    },
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
      // console.log({
      //   index,
      //   version,
      //   rankOrder,
      //   orgUuid,
      //   sliblings,
      //   isLastOne,
      //   node,
      //   value,
      //   e,
      //   downData,
      //   upData
      // });

      // console.log(downData);
      // console.log(upData);
      this.downData = downData;
      this.upData = upData;
      // 存储上个uuid 和 父节点路径
      this.lastParentOrgUuid = this.parentOrgUuid;
      this.lastParent = this.Treeparent;
      // let prefixnode = node.slice(0, node.length - 1);
      this.getoptions(sliblings);
      this.version = version;
      this.select = orgUuid;
      this.orgUuid = orgUuid;
      // 树节点右边菜单的点击事件
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
      if (node.slice(-1)[0] === "0") {
        data.splice(2, 1);
        if (isLastOne) {
          data.splice(2, 1);
        }
      } else {
        if (isLastOne) {
          data.splice(3, 1);
        }
      }

      this.treeName = "tree1";
      this.node = node;
      this.parent = node;
      this.Treeparent = node;
      this.nodeValue = value;
      this.rankOrder = rankOrder;
      this.showMenu(data, e);
    },
    clickmenu2({
      index,
      version,
      rankOrder,
      orgUuid,
      sliblings,
      isLastOne,
      node,
      value,
      e
    }) {
      this.tagIndex = index;
      // 树节点右边菜单的点击事件
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
      this.orgUuid = orgUuid;
      this.version = version;
      this.treeName = "tree2";
      this.node = node;
      this.Treeparent = node;
      this.nodeValue = value;
      this.showMenu(data, e);
    },
    clickmenu3({
      index,
      version,
      rankOrder,
      orgUuid,
      sliblings,
      isLastOne,
      node,
      value,
      e
    }) {
      this.tagIndex = index;
      // 树节点右边菜单的点击事件
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
      this.orgUuid = orgUuid;
      this.version = version;
      this.treeName = "tree2";
      this.node = node;
      this.Treeparent = node;
      this.nodeValue = value;
      this.showMenu(data, e);
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
      const _this = this;
      if (value === "addChildre") {
        _this.appendChildrenDialogVisible = true;
        if (this.orgType === "device") {
          this.addTitle = "新增子结点";
        } else {
          this.addTitle = "新增子部门";
        }
      } else if (value === "changeName") {
        // alert(this.treeName);
        if (this.treeName === "tree1") {
          if (this.orgType === "device") {
            this.changeTitle = "修改结点名称";
          } else {
            this.changeTitle = "修改部门名称";
          }
        } else {
          this.changeTitle = "修改标签";
        }
        _this.changeNameDialogVisible = true;
      } else if (value === "movedown") {
        _this.movedownNode();
      } else if (value === "moveup") {
        _this.moveupNode();
      } else if (value === "delete") {
        this.isDeleteVisible = true;
        // 这里弹出个弹框询问是否确定删除该子结点。
        // _this.deleteNode();
      }
    },
    getMaxOrgSn() {
      let maxSn = -10000;
      for (let i = 0; i < this.options.length; i++) {
        maxSn = maxSn > this.options[i].orgSn ? maxSn : this.options[i].orgSn;
      }
      return maxSn;
    },
    addchildren(name, node) {
      // console.log(this.options);
      // console.log(this.getMaxOrgSn());
      let data = {
        orgName: name,
        // orgSn: this.getMaxOrgSn(),
        orgType: this.orgType,
        parentUuid: node
      };
      api.addOrgTree(data).then(res => {
        if (res.data.success) {
          // 添加子结点成功之后，展开添加的节点
          this.getChidrendata(this.orgUuid, true, this.Treeparent);
          // this.getOrgTree();
        }
      });
    },
    changeName(name) {
      // 修改视图的名字
      console.log(name, this.operatorData);
      this.operatorData.viewInfo.view_name = name;
      this.$emit("updateView", this.operatorData);
    },
    moveupNode() {
      if (this.treeName === "tree2") {
        let data = [
          {
            tagUuid: this.data2[this.tagIndex].tagUuid,
            tagSn: this.data2[this.tagIndex - 1].tagSn,
            version: this.data2[this.tagIndex].version
          },
          {
            tagUuid: this.data2[this.tagIndex - 1].tagUuid,
            tagSn: this.data2[this.tagIndex].tagSn,
            version: this.data2[this.tagIndex - 1].version
          }
        ];
        api.opeartorTag(data).then(res => {
          if (res.data.success) {
            this.getOrgTag();
          }
        });
      } else if (this.treeName === "tree1") {
        api.operatorOrgTree(this.upData).then(res => {
          if (res.data.success) {
            // 向上移动之后,根据操作父节点重新获取获取数据
            this.$message.success("移动成功");
            // this.getOrgTree();
            this.getOrgTree2();
          }
        });
      }
    },
    movedownNode() {
      if (this.treeName === "tree2") {
        let data = [
          {
            tagUuid: this.data2[this.tagIndex].tagUuid,
            tagSn: this.data2[this.tagIndex + 1].tagSn,
            version: this.data2[this.tagIndex].version
          },
          {
            tagUuid: this.data2[this.tagIndex + 1].tagUuid,
            tagSn: this.data2[this.tagIndex].tagSn,
            version: this.data2[this.tagIndex + 1].version
          }
        ];
        api.opeartorTag(data).then(res => {
          if (res.data.success) {
            this.getOrgTag();
          }
        });
      } else if (this.treeName === "tree1") {
        api.operatorOrgTree(this.downData).then(res => {
          if (res.data.success) {
            // 向上移动之后,根据操作父节点重新获取获取数据
            this.$message.success("移动成功");
            this.getOrgTree2();
          }
        });
      }
    },
    deleteNode() {
      // 确认删除视图
      api2.deleteView(this.operatorData.viewUuid).then(res => {
        if (res.data.success) {
          this.$message.success("删除成功！");
        } else {
          this.$message.error(res.data.msg);
        }
        this.getViewTree();
      });
    },
    handleClick(tab, event) {
      this.treeName = ["tree1", "tree2", "tree3"][tab.index];
      this.orgUuid = "";
      this.version = "";
      this.nodeValue = "";
      this.parentOrgUuid = "";
      this.Treeparent = "";
      if (tab.index === "0") {
        // this.parentOrgUuid="";
        this.getOrgTree(true);
      } else if (tab.index === "1") {
        this.getOrgTag();
      } else if (tab.index === "2") {
        // 获取视图代码
        this.getViewTree();
      }
      this.$emit("changetab", tab);
    }
  },
  watch: {
    channelUuid() {
      // 监听channelUuid改变，然后去获取云台控制列表
      // 重新获取
      this.getPreset();
    },
    searchText(val) {
      this.$refs[this.treeName].filter(this.searchText);
    },
    Treeparent(val) {
      // console.log("=--==========================================");
      // console.log(val);
    }
  }
};
</script>
<style lang="scss">
@import "@/style/variables.scss";
#treeLaa {
  .el-tabs__content {
    width: 380px;
  }
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
      margin-top: 12px;
    }
  }
  // .el-tree,
  // .el-tree-node
  .custom-tree-node {
    // width: 500px;
    height: 100%;
    // overflow: auto;
  }
  .el-input__inner {
    padding-left: 30px;
    &::-webkit-input-placeholder {
      /* WebKit browsers */
      font-size: 12px;
    }
  }
  .el-tree-node__content > .el-tree-node__expand-icon {
    padding: 6px 2px 6px 0px;
  }
}
</style>

<style lang="scss" scoped>
@import "@/style/variables.scss";

.treeLaa {
  width: 220px;
  box-sizing: border-box;
  height: 100%;
  $iconWidth: 40px;
  background-color: rgba(35, 38, 41, 0.8);
  .videoTree {
    //  height: calc(100vh - 150px);
    // height: calc(100vh - 250px);
    // width:500px;
    // overflow: auto;
  }
  .mysearchText {
  }

  .custom-tree-node {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: space-between;
    font-size: 14px;
    padding-right: 18px;
    height: 100%;
    white-space: nowrap;
    // overflow: hidden;
    // text-overflow: ellipsis;
    width: calc(100% - 30px);
    .channelStatus {
      display: flex;
      justify-content: flex-start;
      align-items: center;
      flex-basis: 20px;
      flex-shrink: 20px;
      flex-flow: 20px;
      img {
        width: 12px;
        height: 12px;
      }
      span {
        font-size: 12px;
        color: #dddddd;
      }
      .channelOffline {
        color: #999999;
      }
    }
    .span {
      // width: calc(100% - 30px);
      // overflow: hidden;
      // display: block;
      // text-overflow: ellipsis;
      margin-left: 10px;
      white-space: nowrap;
      user-select: none;
      // float: left;
    }
    .el-dropdown-link {
      margin-left: 5px;
    }
    .threelinemenu {
      display: none;
      float: right;
      margin-right: 10px;
    }
    &:hover .threelinemenu {
      display: block;
    }
  }

  .searchWrap {
    padding: 25px 12px 10px;
    .el-input {
      position: relative;
      width: calc(100%);
    }
    $addIconWidth: 14px;
    img {
      display: inline-block;
      vertical-align: middle;
      width: 12px;
      margin-left: 4px;
      cursor: pointer;
    }
  }
  .tabs {
    height: calc(100vh - 170px);
    // overflow-y: auto;
    padding: 0px 12px 25px;
    overflow: auto;
  }
  .tabsPanel {
    height: calc(100vh - 550px);
    overflow: auto;
  }
  .tabsPanel {
    // height: calc(100vh - 550px);
    position: relative;
  }
  .mypanel {
    // height: calc(100vh - 60px - 70px - 80px);
    // overflow: auto;
    // position: absolute;\
  }
  .cloundControlPannel {
    user-select: none;
    padding: 30px 12px 0px 12px;
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
}
</style>
