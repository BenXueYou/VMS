<template>
  <div id="equipLeftMenu"
       class="leftmenu">
    <div class="searchWrap">
      <el-input :placeholder="orgType=='staff'?'搜索组织/标签/名称':'搜索设备/标签/名称'"
                v-model="searchText">
        <img slot="prefix"
             class="image"
             :src="icons.search"
             alt>
      </el-input>
      <img v-if="activeName==='view'"
           @click="showAddTagDialog"
           :src="icons.addSign"
           alt>
    </div>

    <el-tabs v-model="activeName"
             class="tabs"
             @tab-click="handleClick">
      <el-tab-pane :label="orgType==='device'?'设备树':'组织架构'"
                   class="mypanel"
                   name="organiza">
        <el-tree :props="devprops"
                 :load="devloadNode"
                 ref="tree1"
                 lazy>
          <div class="custom-tree-node"
               slot-scope="{ node, data }">
            <span>{{ node.label }}</span>
            <!-- v-if="data.h5Type==='channel'" -->
            <el-dropdown trigger="click"
                         @command="handleCommand"
                         placement="bottom"
                         class='threelinemenu'>
              <span class="el-dropdown-link"
                    @click="saveClickData(node, data)">
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
        </el-tree>
      </el-tab-pane>
      <el-tab-pane label="标签"
                   name="tag">
        <el-tree :props="props"
                 :load="loadNode"
                 :expand-on-click-node="false"
                 lazy
                 @node-click="handleNodeClick">
          <div class="custom-tree-node"
               slot-scope="{ node, data }">
            <span>{{ node.label }}</span>
            <el-dropdown trigger="click"
                         @command="handleCommand"
                         placement="bottom"
                         v-if="data.hasOwnProperty('channelType')"
                         class='threelinemenu'>
              <span class="el-dropdown-link"
                    @click="saveClickData(node, data)">
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
        </el-tree>

      </el-tab-pane>
      <el-tab-pane label="视图"
                   name="view">
        <el-tree :props="viewProps"
                 :data="viewTreeData"
                 refs="tree3"
                 @check-change="viewhandleCheckChange">
          <div class="custom-tree-node"
               slot-scope="{ node, data }">
            <span>{{ node.label }}</span>
            <el-dropdown trigger="click"
                         @command="handleCommand"
                         placement="bottom"
                         class='threelinemenu'>
              <span class="el-dropdown-link"
                    @click="saveClickData(node, data)">
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
        </el-tree>
      </el-tab-pane>
    </el-tabs>

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
               @click="cloundControl(item,index)"
               :key="index">
            <img :src="icons[item]"
                 alt="">
          </div>
        </div>
        <div class="btngroup">
          <div class="button"
               v-for='(item,index) in btnGroup2'
               @click="cloundControl(item,index)"
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
                   placeholder="请选择">
          <el-option v-for="item in yuzhiOptions"
                     :key="item.value"
                     :label="item.label"
                     :value="item.value">
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
             v-show="((value=='yuzhi'&&yuzhi)||(value=='xunhang'&&xunhang))&&!isChoose"
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
    orgType: {
      type: String,
      default() {
        return window.config.orgType;
      }
    },
    deviceUuid: {
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
      changeTitle: "",
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
      steplen: 30,
      DOptions: [
        {
          value: "yuzhi",
          label: "预置点"
        }
      ],
      yuzhiOptions: Array.from({ length: 256 }, (v, i) => ({
        value: i + 1,
        label: "预置点" + (i + 1)
      })),
      xunhangOptions: [],
      viewProps: {
        label: "viewName"
      },
      viewTreeData: [
        {
          viewName: "一级 1"
        },
        {
          viewName: "一级 2"
        },
        {
          viewName: "一级 3"
        }
      ]
    };
  },
  mounted() {
    this.data = [];
    this.data2 = [];
    this.parentOrgUuid = "";
    this.Treeparent = "";
    // this.getOrgTree(true);
    this.getPreset();
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
    getPreset() {
      api2.getPreset().then(res => {
        console.log(res);
      });
    },
    viewhandleCheckChange() {
      console.log(this.$refs.tree3.getCheckedNodes());
    },
    saveClickData(node, data) {
      // 点击三角菜单保存树节点信息
      this.operatorData = data;
    },
    handleCommand(command) {
      console.log(command);
      if (command === "video") {
        // 打开视频操作
        this.getPreviewInfo(this.operatorData.channelUuid);
      } else if (command === "playback") {
      } else if (command === "view") {
      } else if (command === "renameView") {
        this.nodeValue = this.operatorData.viewName;
        this.changeNameDialogVisible = true;
      } else if (command === "deleteView") {
        this.isDeleteVisible = true;
      }
    },
    getPreviewInfo(channelUuid) {
      this.$emit("playRtsp", channelUuid);
    },
    handleNodeClick() {
      // 点击展开
    },
    async devloadNode(node, resolve) {
      //  懒加载子结点
      console.log(node);
      let data = await this.videoTree(node.data && node.data.id);

      data = data.map(item => {
        item.leaf = !item.openFlag;
        return item;
      });
      console.log(data);
      return resolve(data);
    },
    videoTree(parentOrgUuid) {
      let data = parentOrgUuid ? { parentOrgUuid } : {};
      return new Promise((resolve, reject) => {
        api2
          .videoTree(data)
          .then(res => {
            let list = res.data.data || [];
            resolve(list);
          })
          .catch(err => {
            console.log(err);
            resolve([]);
          });
      });
    },
    async loadNode(node, resolve) {
      // 加载子结点
      console.log(node);
      if (node.level === 0) {
        let data = await this.getTagTreeData();
        console.log(data);
        return resolve(data);
      } else if (node.level === 1) {
        let data = await this.getChannelByNode(node.data.id);
        return resolve(data);
      }
    },
    getChannelByNode(tagUuid) {
      return new Promise((resolve, reject) => {
        api
          .getChannelByTag({
            tagUuid,
            page: 1,
            limit: 11111
          })
          .then(res => {
            let list = (res.data.data.list || []).map(item => {
              item.label = item.channelName;
              item.id = item.channelUuid;
              // item.id = item.deviceUuid;
              item.leaf = true;
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
            resolve(list);
          });
      });
    },
    chooseItem() {
      // 选定预置点，这边进行一个跳转
      api2
        .preset({
          action: "goto_preset", // 操作类型，必填
          index: this.yuzhi // 预置点，必填
        })
        .then(() => {});
    },
    setback() {
      this.isChoose = false;
    },
    setYZ() {
      this.VideoOprName = this.yuzhi;
      this.isChoose = true;
    },
    chooseIcno() {
      if (this.value === "yuzhi") {
        api2
          .preset({
            action: "set_preset", // 操作类型，必填
            index: this.yuzhi // 预置点，必填
          })
          .then(() => {});
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
      api2
        .preset({
          action: "clear_preset", // 操作类型，必填
          index: this.yuzhi // 预置点，必填
        })
        .then(() => {});
    },
    cloundControl(name, index) {
      console.log(name, index);
      let action = "";
      if (name === "zoom_in") {
        action = "zoom_in";
      } else if (name === "zoom_out") {
        action = "zoom_out";
      } else if (name === "fangda") {
        action = "focus_near";
      } else if (name === "quan") {
        action = "focus_far";
      } else if (name === "centerbig") {
        action = "iris_close";
      } else if (name === "center") {
        action = "iris_open";
      } else {
        action = name;
      }
      this.$emit("ctrl", action, true, 1);
    },

    getViewTree() {
      // 获取视图
      api2
        .getView({
          viewUuid: ""
        })
        .then(res => {
          console.log(res);
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
      this.$refs[this.treeName].operator({
        operator: "addChildre",
        node: this.Treeparent,
        value: children
      });
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
      // if (this.treeName === "tree1") {
      //   api
      //     .updateOrg({
      //       orgName: name,
      //       orgUuid: this.orgUuid,
      //       version: this.version
      //     })
      //     .then(res => {
      //       if (res.data.success) {
      //         // this.getOrgTree();
      //         // 当前节点更新之后，怎么刷新呢
      //         // this.$refs[this.treeName].operator({
      //         //   operator: "changeName",
      //         //   node: this.parent,
      //         //   value: name
      //         // });
      //         // 返回来有一个version版本号，把这个version字段也更新了
      //         // alert(res.data.data.version);
      //         this.$refs[this.treeName].operator({
      //           operator: "changeName",
      //           version: res.data.data.version,
      //           node: this.Treeparent,
      //           value: name
      //         });
      //         this.nodeValue = name;
      //         this.version = res.data.data.version;
      //         // 更新options;
      //         // console.log(this.options);
      //         for (let i = 0; i < this.options.length; i++) {
      //           if (this.options[i].id === this.orgUuid) {
      //             this.options[i].orgName = name;
      //             this.options[i].label = name;
      //             this.options[i].version = this.version;
      //           }
      //         }
      //         this.$emit("clickNode", {
      //           id: this.orgUuid,
      //           orgName: name
      //         });
      //       }
      //     });
      // } else if (this.treeName === "tree2") {
      //   api
      //     .updateTagUrl({
      //       tagName: name,
      //       tagType: this.tagType,
      //       tagUuid: this.orgUuid,
      //       version: this.version
      //     })
      //     .then(res => {
      //       if (res.data.success) {
      //         this.getOrgTag();
      //       }
      //     });
      // }
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
      // // alert(1);
      // if (this.treeName === "tree1") {
      //   api.deleteOrgTree(this.orgUuid).then(res => {
      //     // this.Treeparent = "";
      //     // this.parentOrgUuid = "";
      //     // this.data1 = [];
      //     // this.orgUuid = "";
      //     if (res.data.success) {
      //       this.$message.success("删除成功！");
      //       // this.getOrgTree(true);
      //       this.getOrgTree2();
      //     }
      //   });
      // } else {
      //   api.deleteTag(this.orgUuid).then(res => {
      //     // this.Treeparent = "";
      //     // this.data1 = [];
      //     // this.orgUuid = "";
      //     if (res.data.success) {
      //       this.$message.success("删除成功！");
      //       this.getOrgTag();
      //     }
      //   });
      // }
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
        this.getViewTree();
      }
      this.$emit("changetab", tab);
    }
  },
  watch: {
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
#equipLeftMenu {
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

.leftmenu {
  width: 280px;
  box-sizing: border-box;
  height: 100%;
  $iconWidth: 40px;
  background-color: rgba(35, 38, 41, 0.8);
  .custom-tree-node {
    width: 100%;
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
    padding: 25px 26px 10px;
    .el-input {
      position: relative;
      width: calc(100% - #{$iconWidth});
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
  .tabs {
    height: calc(100vh - 550px);
    overflow-y: auto;
    padding: 0px 26px 25px;
  }
  .mypanel {
    // height: calc(100vh - 60px - 70px - 80px);
    overflow: auto;
    width: 228px;
  }
  .cloundControlPannel {
    padding: 30px;
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
