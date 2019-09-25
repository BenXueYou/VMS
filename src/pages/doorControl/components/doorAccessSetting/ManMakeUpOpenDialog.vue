<template>
  <el-dialog width="680px"
             :title="title"
             :visible.sync="isCurrentShow"
             :before-close="onClickCancel"
             :close-on-click-modal="false">
    <el-row class="footerBox"
            type="flex"
            justify="center">
      <el-col :span="8"
              class="left-col">
        <span style="color:red">*</span>
        <span>多人组合名称：</span>
      </el-col>
      <el-col :span="16"
              class="right-col">
        <el-input placeholder="请输入内容"
                  v-model="groupName"
                  style="margin-left:0px!important;"
                  clearable></el-input>
      </el-col>
    </el-row>
    <el-row type="flex"
            justify="center">

      <el-col :span="8"
              class="left-col">
        <div class="topBox">
          <span style="color:red">*</span>
          <span>需要多人组合验证的门：</span>
        </div>
      </el-col>
      <el-col :span="16"
              class="right-col">
        <div class="topBox">
          <el-popover class="popverTree"
                      ref="popverBox"
                      :popper-class="elPopoverClass"
                      :visible-arrow="false"
                      :value="visible_popver"
                      @show="showPopver()"
                      @hide="hidePopver()"
                      placement="bottom-start"
                      trigger="click">
            <el-row style="width:300px;">
              <tab-tree :tabs="tabs"
                        :visible="visible_popver"
                        :show-input="false"
                        @transferCheckedNodes="transferCheckedNodes"></tab-tree>
            </el-row>
            <el-input slot="reference"
                      readonly="readonly"
                      :style="`width: ${inputWidth}`"
                      v-model="checkedNode.label"
                      :clearable="true"
                      @clear="clearAction()"
                      placeholder="请选择"></el-input>
          </el-popover>
        </div>
      </el-col>
    </el-row>
    <el-row type="flex"
            justify="center">
      <el-col :span="8"
              class="left-col">
        <div class="timeRadioBox">
          <span style="color:red">*</span>
          <span>通行规则：</span>
        </div>
      </el-col>
      <el-col :span="16"
              class="right-col">
        <div class="timeRadioBox">
          <el-radio v-model="radio"
                    label="all">全时间段通行</el-radio>
          <el-radio v-model="radio"
                    label="normal">固定时间段通行</el-radio>
        </div>
      </el-col>
    </el-row>

    <el-row v-show="radio==='normal'"
            class="timeBox"
            type="flex"
            justify="center">
      <el-col :span="8"
              class="left-col">
        <span style="color:red">*</span>
        <span>通行时间段：</span>
      </el-col>
      <el-col :span="16"
              class="right-col">

        <!-- <el-select v-model="value"
                   placeholder="请选择">
          <el-option v-for="item in options"
                     :key="item.value"
                     :label="item.label"
                     :value="item.value"></el-option>
        </el-select> -->
        <button-select :value.sync="time"
                       @add="showTime"
                       :options="timeOptions">

        </button-select>
        <!-- <span style="color:#26D39D"
              @click="AddTag">
          <i class="el-icon-circle-plus-outline"></i>设置时间段
        </span> -->
      </el-col>
    </el-row>
    <el-row v-show="radio==='normal'"
            class="timeBox"
            type="flex"
            justify="center">
      <el-col :span="8"
              class="left-col">
        <span style="color:red">*</span>
        <span>特殊时期组：</span>
      </el-col>
      <el-col :span="16"
              class="right-col">
        <!-- <el-select v-model="value"
                   placeholder="请选择">
          <el-option v-for="item in options"
                     :key="item.value"
                     :label="item.label"
                     :value="item.value"></el-option>
        </el-select> -->
        <button-select :value.sync="date"
                       @add="showDate"
                       :options="dateOptions">

        </button-select>
        <!-- <span style="color:#26D39D"
              @click="AddTag">
          <i class="el-icon-circle-plus-outline"></i>设置特殊日期
        </span> -->
      </el-col>
    </el-row>

    <el-row class="middleBox"
            type="flex"
            justify="center">
      <el-col :span="8"
              class="left-col">
        <span style="color:red">*</span>
        请选择人员：
      </el-col>
      <el-col :span="16"
              class="right-col">
        <div>
          <span class="cursorClass" style="color:#26D39D"
                @click="AddTag">
            <i class="el-icon-circle-plus-outline"></i>添加
          </span>
          共{{peopleList.length}}人
        </div>
        <div class="tagBox">
          <el-tag class="el-tag-class"
                  :key="index"
                  v-for="(tag , index) in peopleList"
                  closable
                  :disable-transitions="false"
                  @close="handleClose(tag,index)">{{tag.label}}</el-tag>
        </div>
      </el-col>
    </el-row>
    <el-row class="footerBox"
            type="flex"
            justify="center">
      <el-col :span="8"
              class="left-col">
        <span style="color:red">*</span>
        以上人员至少验证通过人数：
      </el-col>
      <el-col :span="16"
              class="right-col">
        <el-input placeholder="请输入内容"
                  v-model="inputMinPerson"
                  type="number"
                  clearable></el-input>人
      </el-col>
    </el-row>
    <el-row class="footerBox"
            type="flex"
            justify="center">
      <el-col :span="8"
              class="left-col">
        <span style="color:red">*</span>
        人员验证时间间隔：
      </el-col>
      <el-col :span="16"
              class="right-col">
        <el-input placeholder="请输入内容"
                  type="number"
                  v-model="inputMinTime"
                  clearable></el-input>秒
        <span style="font-size:12px;padding-left:10px;">(间隔时间不超过5秒)</span>
      </el-col>
    </el-row>

    <div slot="footer"
         class="dialog-footer">
      <el-button type="primary"
                 size="mini"
                 @click="onClickSure"
                 class="footer-button">确定</el-button>
      <el-button type="primary"
                 size="mini"
                 @click="onClickCancel"
                 class="footer-button">取消</el-button>
    </div>
    <set-time-area-dialog :visible.sync="settimevisible"
                          @confirm="confirmTime"
                          title="通行时间段">

    </set-time-area-dialog>
    <set-date-area-dialog :visible.sync="setdatevisible"
                          @confirm="confirmDate">

    </set-date-area-dialog>

    <tab-tree-tag title="请选择允许通行的人"
                  rightTxt="已选的分组、设备、门或者地址"
                  :modal="false"
                  :tabs="tabs1"
                  :isShow.sync="chooseVisible"
                  :checkedList="peopleList"
                  @onConfirm="peopleConfirm"></tab-tree-tag>
  </el-dialog>
</template>

<script>
import buttonSelect from "@/common/buttonSelect";
import SetTimeAreaDialog from "@/pages/equipmentMange/components/RemoteControlDialogContent/SetTimeAreaDialog";
import SetDateAreaDialog from "@/pages/equipmentMange/components/RemoteControlDialogContent/SetDateAreaDialog";
import TabTree from "@/common/TabTree.vue";
import * as api from "../../utils/ajax";
import tabTreeTag from "@/common/TabTreeTag";
export default {
  components: {
    TabTree,
    SetTimeAreaDialog,
    SetDateAreaDialog,
    buttonSelect,
    tabTreeTag
  },
  props: {
    isShow: {
      type: Boolean,
      default: false
    },
    carFellowDetailList: {
      type: Array,
      default: () => []
    },
    row: {
      type: Object,
      default: () => {}
    }
  },
  data() {
    return {
      tabs: [
        {
          id: "1",
          label: "设备树",
          treeType: "orgAndDev",
          treeRef: "tree1",
          treeNodeType: "door",
          radio: true,
          nodeKey: "id"
        },
        {
          id: "2",
          label: "地址",
          treeType: "resident",
          treeRef: "tree2",
          nodeKey: "id",
          treeNodeType: "door",
          radio: true
        }
      ],
      elPopoverClass: "ManMakeUpOpenClass",
      inputWidth: "80%",
      checkedNode: {},
      visible_popver: false,
      inputMinTime: "",
      inputMinPerson: "",
      startTime: "",
      endTime: "",
      radio: "all",
      dynamicTags: [],
      inputModel: "",
      isCurrentShow: false,
      filterText: "",
      data2: [],
      defaultProps: {
        children: "children",
        label: "label"
      },
      timeOptions: [],
      dateOptions: [],
      value: "",
      tableData: [],
      time: "",
      date: "",
      title: "",
      chooseVisible: false,
      settimevisible: false,
      setdatevisible: false,
      peopleList: [],
      tabs1: [
        {
          id: "1",
          label: "组织结构",
          treeType: "person",
          treeRef: "tree1",
          nodeKey: "id"
        },
        {
          id: "2",
          label: "地址",
          treeType: "resident",
          treeNodeType: "staff",
          treeRef: "tree2",
          nodeKey: "id"
        }
      ],
      peopleVersion: 0,
      groupName: ""
    };
  },
  created() {},
  mounted() {},
  methods: {
    transferCheckedNodes(data, nodeBool, treeName) {
      console.log(data, nodeBool, treeName);
      if (data.type === "door") {
        this.checkedNode = data;
      }
    },
    peopleConfirm(checkedNodes) {
      console.log(checkedNodes);
      this.peopleList = checkedNodes;
    },
    handleClose(tag, index) {
      console.log(tag, index);
      this.peopleList.splice(index, 1);
    },
    /**
     * 取消新增或修改
     */
    onClickCancel() {
      this.$emit("onCancel");
    },
    onClickSure() {
      console.log(this.checkedNode); // 选择的通行的门
      console.log(this.radio); // 通行的规则
      console.log(this.time); // 通行时间段
      console.log(this.date); // 特殊日期组
      console.log(this.peopleList); // 选择的人员
      console.log(this.inputMinPerson); // 最少通过人数
      console.log(this.inputMinTime); // 最少通过时间
      if (!this.groupName) {
        this.$message.error("请填写多人组合名称");
        return;
      }
      if (!this.checkedNode.id) {
        this.$message.error("请选择通行的门");
        return;
      }
      if (!this.peopleList.length) {
        this.$message.error("请选择人员");
        return;
      }
      if (!this.inputMinPerson || this.inputMinPerson <= 0) {
        this.$message.error("请填写最少通过的人数");
        return;
      }
      if (!this.inputMinTime) {
        this.$message.error("请填写最少通过的时间");
        return;
      }
      if (this.inputMinTime <= 0) {
        this.$message.error("人员验证时间时间不低于0秒");
        return;
      }
      if (this.inputMinTime > 5) {
        this.$message.error("人员验证时间时间不超过5秒");
        return;
      }
      if (this.radio === "normal") {
        if (!this.time) {
          this.$message.error("请选择通行时段");
          return;
        }
        if (!this.date) {
          this.$message.error("请选择特殊日期");
          return;
        }
      }
      let resourceSet = [];
      for (let i = 0; i < this.peopleList.length; i++) {
        let item = {
          resSn: i,
          resType: this.peopleList[i].type,
          resUuid: this.peopleList[i].id
        };
        if (this.peopleVersion !== 0) {
          item.version = this.peopleVersion;
        }
        resourceSet.push(item);
      }
      let data = {
        atLeast: this.inputMinPerson,
        channelUuid: this.checkedNode.id,
        deviceUuid: this.checkedNode.deviceUuid,
        intervals: this.inputMinTime,
        holidayUuid: this.date,
        periodUuid: this.time,
        groupName: this.groupName,
        resourceSet,
        rules: this.radio
      };
      if (this.row.groupUuid) {
        data.groupUuid = this.row.groupUuid;
        data.version = this.row.version;
        data.setUuid = this.row.setUuid;
        data.deviceUuid = this.row.deviceUuid;
        api.updateDRZH(data, this.row.groupUuid).then(res => {
          console.log(res);
          if (res.data.success) {
            this.$message.success("修改成功！");
            this.$emit("onCancel");
          }
        });
      } else {
        api.addDRZH(data).then(res => {
          console.log(res);
          if (res.data.success) {
            this.$message.success("添加成功！");
            this.$emit("onCancel");
          }
        });
      }
    },
    filterNode(value, data) {
      if (!value) return true;
      return data.label.indexOf(value) !== -1;
    },
    tableIndex(val) {
      val += 1;
      return val < 10 ? "0" + val : val;
    },
    AddTag() {
      this.chooseVisible = true;
    },
    showPopver() {
      this.visible_popver = true;
    },
    hidePopver() {
      this.visible_popver = false;
    },
    confirmTime(row) {
      console.log(row);
      // 弹窗里面点击设置了时间
      this.time = row.periodUuid;
      this.getTimeList();
    },
    confirmDate(row) {
      console.log(row);
      // 弹窗里面点击设置了时间
      this.date = row.holidayUuid;
      this.getDateList();
    },
    showTime() {
      this.settimevisible = true;
    },
    showDate() {
      this.setdatevisible = true;
    },
    getTimeList() {
      // 获取时间段的列表
      api.getTimeListAll().then(res => {
        if (res.data.success) {
          this.timeOptions = res.data.data || [];
          this.timeOptions = this.timeOptions.map(item => {
            return {
              value: item.periodUuid,
              label: item.periodName
            };
          });
        }
      });
    },
    getDateList() {
      // 获取特殊时期列表
      api.getDateListAll().then(res => {
        if (res.data.success) {
          this.dateOptions = res.data.data || [];
          this.dateOptions = this.dateOptions.map(item => {
            return {
              value: item.holidayUuid,
              label: item.holidayName
            };
          });
        }
      });
    },
    init() {
      this.getTimeList();
      this.getDateList();
    }
  },
  watch: {
    isShow(val) {
      console.log(val);
      if (val) {
        this.init();
        let door = this.row.resourceSetVOS || [],
          checkeTreedNodes = [];
        for (let i = 0; i < door.length; i++) {
          let item = {
            label: door[i].resName,
            id: door[i].resUuid,
            resSn: door[i].resSn,
            resType: door[i].resType,
            type: door[i].resType,
            version: door[i].version
          };
          checkeTreedNodes.push(item);
          if (door[i].version) {
            this.peopleVersion = parseInt(door[i].version);
          }
        }
        this.peopleList = checkeTreedNodes;
        this.time = this.row.periodUuid;
        this.date = this.row.holidayUuid;
        this.inputMinTime = this.row.intervals;
        this.inputMinPerson = this.row.atLeast;
        this.groupName = this.row.groupName;
        this.radio = this.row.rules || "all";
        this.title = this.row.groupUuid
          ? "修改多人组合开门"
          : "新增多人组合开门";
        this.checkedNode = {
          label: this.row.nickName,
          id: this.row.channelUuid
        };
      } else {
        this.checkedNode = {};
      }
      this.isCurrentShow = val;
    },
    filterText(val) {
      //   this.$refs.tree2.filter(val);
    },
    visible_popver: {
      handler(val, oldVal) {
        console.log(val, oldVal);
      },
      deep: true
    }
  },
  destroyed() {}
};
</script>
<style lang='scss'>
.ManMakeUpOpenClass {
  max-height: 71%;
  overflow: auto;
}
$fontColor: #dddddd;
.ManMakeUpOpen .el-input__prefix {
  position: absolute;
  height: 100%;
  left: 5px !important;
  top: 0;
  text-align: center;
  color: $fontColor;
  -webkit-transition: all 0.3s;
  transition: all 0.3s;
  transform: translateX(0%);
}
.ManMakeUpOpen .el-select {
  display: inline-block;
  position: relative;
  width: 60%;
}
.ManMakeUpOpen .el-radio {
  width: 50%;
  margin: 5px 0 15px!important;
}
.ManMakeUpOpen .el-radio__label {
  color: $fontColor;
}
.ManMakeUpOpen .el-dialog__body {
  padding: 0 45px 0 38px;
}
.ManMakeUpOpen .el-tag:hover {
  background-color: rgba(40, 255, 187, 0.1);
  background: rgba(255, 255, 255, 0.05);
}
.ManMakeUpOpen .el-tag {
  padding: 0 15px;
  height: 32px;
  line-height: 30px;
  font-size: 12px;
  color: $fontColor;
  border-radius: 4px;
  -webkit-box-sizing: border-box;
  box-sizing: border-box;
  border: 0;
  white-space: nowrap;
  margin: 5px 8px;
  background: rgba(255, 255, 255, 0.05);
}

.ManMakeUpOpen .footerBox .el-input {
  display: inline-block;
  width: 40%;
  margin: auto 10px;
}
.ManMakeUpOpen .el-header {
  padding: 10px 10% 0;
  line-height: 60px;
}
.ManMakeUpOpen i {
  margin-right: 5px;
  color: #26d39d;
}
</style>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
$fontColor: #dddddd;
$line-color: #24473f;
@mixin setFontStyle($fontsize) {
  font-family: PingFangSC-Regular;
  font-size: $fontsize;
  color: $fontColor;
  letter-spacing: 0;
}

.ManMakeUpOpen .left-col {
  text-align: right !important;
  color: $fontColor;
}
.ManMakeUpOpen .right-col {
  text-align: left !important;
  color: $fontColor;
  // padding-left: 10px;
}
.topBox {
  line-height: 60px;
}
.timeRadioBox {
  height: 88px;
  padding-top: 15px;
}
.timeBox {
  height: 60px;
}
.middleBox {
  border-bottom: 1px dashed rgb(52, 55, 59);
  color: $fontColor;
}
.ManMakeUpOpen .tagBox {
  padding: 15px 0px 15px;
}
.footerBox {
  line-height: 60px;
}
.dialog-footer {
  text-align: center;
  border: {
    width: 0 0 0 0;
    style: solid;
    color: $line-color;
  }
  .footer-button {
    margin: 20px 28px 17px 0;
  }
}
</style>
