<template>
  <div :visible.sync="powerVisbile"
       :title="title"
       width="660px"
       class="dialogCenter addnewPower"
       :close-on-click-modal="false"
       :close-on-press-escape="false"
       :append-to-body="true"
       @close="close">

    <div class='myTitle'>
      {{ title}}
    </div>
    <div class="dash-line"></div>
    <el-form ref="form"
             :rules="rules"
             :model="data"
             class="asdasadasasdasdasda"
             label-width="200px">
      <el-form-item label="名称："
                    style="margin-top:50px;"
                    prop="name">
        <el-input size="small"
                  class="nameInput"
                  v-model="data.name"></el-input>
      </el-form-item>

      <el-form-item label="请选择被访者："
                    prop="people">
        <el-button class='iconButton'
                   @click="chooseBtn"
                   type="primary"
                   size='small'>
          <img :src="icons.tianjia"
               alt="">
          添加
        </el-button>
        <span class='total'>共{{peopleList.length}}人</span>
        <div class='showAllSelect'>
          <gt-button class='sbtn'
                     v-for="(item,index) in peopleList"
                     :key="index"
                     @close="deletePerson(index)"
                     :icon="item.type=='staff'?icons.personHead:icons.folder">
            {{item.orgName || item.staffName|| item.label}}
          </gt-button>
        </div>
      </el-form-item>
      <el-form-item label="允许访客通行的门："
                    prop="door">
        <el-button class='iconButton'
                   @click="chooseBtn2"
                   type="primary"
                   size='small'>
          <img :src="icons.tianjia"
               alt="">
          添加
        </el-button>
        <span class='total'>共{{doorList.length}}门</span>
        <div class='showAllSelect'>
          <gt-button class='sbtn'
                     @close="deleteDoor(index)"
                     v-for="(item,index) in doorList"
                     :key="index"
                     :icon="icons.door">
            {{item.orgName || item.deviceName || item.nickName || item.label}}
          </gt-button>
        </div>
      </el-form-item>
    </el-form>
    <div class="btngr">
      <el-button type="primary"
                 class="confirmBtn"
                 :disabled="canDiaabled"
                 @click="sureClick"
                 size="small">确定</el-button>
      <el-button type="primary"
                 class="confirmBtn"
                 @click="cancelClick"
                 size="small">取消</el-button>
    </div>
    <set-time-area-dialog :visible.sync="settimevisible"
                          @confirm="confirmTime"
                          title="通行时间段">

    </set-time-area-dialog>
    <set-date-area-dialog :visible.sync="setdatevisible"
                          @confirm="confirmDate">

    </set-date-area-dialog>

    <!-- <choose-dialog :visible.sync="chooseVisible">

    </choose-dialog> -->

    <tab-tree-tag title="请选择被访人"
                  rightTxt="已选的姓名、部门、楼栋房屋或标签"
                  :modal="false"
                  :tabs="tabs1"
                  :isShow.sync="chooseVisible"
                  :checkedList="peopleList"
                  @onConfirm="peopleConfirm"></tab-tree-tag>

    <div style="height:40px;"></div>

    <tab-tree-tag title="请选择允许通行的门"
                  rightTxt="已选的分组、设备、门或地址"
                  :tabs="tabs2"
                  :modal="false"
                  :isShow.sync="chooseVisible2"
                  :checkedList="doorList"
                  @onConfirm="doorConfirm"></tab-tree-tag>

    <div style="height:40px;"></div>

  </div>
</template>

<script>
import icons from "@/common/js/icon.js";
import SetTimeAreaDialog from "@/pages/equipmentMange/components/RemoteControlDialogContent/SetTimeAreaDialog";
import SetDateAreaDialog from "@/pages/equipmentMange/components/RemoteControlDialogContent/SetDateAreaDialog";
import chooseDialog from "@/pages/doorControl/components/doorAccessConfig/chooseDialog";
import tabTreeTag from "@/common/TabTreeTag";
import buttonSelect from "@/common/buttonSelect";
import * as api from "../../utils/vistorAccess/ajax.js";
export default {
  name: "AddNewPowerDialog",
  props: {
    visible: {
      type: Boolean,
      default() {
        return false;
      }
    },
    groupUuid: {
      type: String,
      default() {
        return "";
      }
    },
    title: {
      type: String,
      default() {
        return "";
      }
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
      chooseVisible: false,
      chooseVisible2: false,
      settimevisible: false,
      setdatevisible: false,
      icons,
      showTimeArea: false,
      powerVisbile: false,
      data: {
        name: "",
        people: [
          {
            resSn: 0,
            resType: "uuid44",
            resUuid: "uuid44",
            setUuid: "00012",
            version: 0
          }
        ],
        door: [
          {
            resSn: 0,
            resType: "uuid44",
            resUuid: "uuid44",
            setUuid: "00012",
            version: 0
          }
        ],
        rule: "all",
        time: "",
        date: ""
      },
      rules: {
        name: [
          { required: true, message: "请输入名称", trigger: "blur" },
          { min: 4, max: 32, message: "长度在 4 到 32 个字符", trigger: "blur" }
        ]
      },
      tabs1: [
        {
          id: "2",
          label: "楼栋房屋",
          treeType: "resident",
          treeNodeType: "staff",
          treeRef: "tree2",
          nodeKey: "id"
        },
        {
          id: "1",
          label: "组织架构",
          treeType: "person",
          treeRef: "tree1",
          nodeKey: "id"
        },
        {
          id: "3",
          label: "标签",
          treeType: "person",
          treeNodeType: "door",
          treeRef: "tree3",
          nodeKey: "tagUuid",
          isTag: true,
          selectSingleNode: "door"
        }
        // {
        //   id: "4",
        //   label: "信息来源",
        //   treeType: "orgAndDev",
        //   treeRef: "tree4",
        //   hasDoor: false,
        //   nodeKey: "id"
        // }
      ],
      tabs2: [
        {
          id: "1",
          label: "组织结构",
          treeType: "orgAndDev",
          treeRef: "tree1",
          nodeKey: "id"
        },
        {
          id: "2",
          label: "地址",
          treeType: "resident",
          treeNodeType: "door",
          treeRef: "tree2",
          nodeKey: "id"
        },
        {
          id: "3",
          label: "标签",
          treeType: "device",
          treeNodeType: "door",
          treeRef: "tree3",
          nodeKey: "tagUuid",
          isTag: true,
          selectSingleNode: "door"
        }
      ],
      timeOptions: [],
      dateOptions: [],
      peopleList: [],
      doorList: [],
      peopleVersion: 0,
      doorVersion: 0,
      peopleCount: 0,
      doorCount: 0,
      canDiaabled: false
    };
  },
  methods: {
    doorConfirm(checkedNodes) {
      console.log(checkedNodes);
      this.doorList = checkedNodes;
    },
    peopleConfirm(checkedNodes) {
      console.log(checkedNodes);
      this.peopleList = checkedNodes;
    },
    confirmTime(row) {
      console.log(row);
      // 弹窗里面点击设置了时间
      let data = Object.assign({}, this.data);
      data.time = row.periodUuid;
      this.data = data;
      this.getTimeList();
    },
    confirmDate(row) {
      console.log(row);
      // 弹窗里面点击设置了时间
      let data = Object.assign({}, this.data);
      data.date = row.holidayUuid;
      this.data = data;
      this.getDateList();
    },
    sureClick() {
      if (this.canDiaabled) {
        this.$message.error("正在发送请求，请勿重复点击！");
        return;
      }
      if (!this.judge()) {
        return;
      }

      this.$refs.form.validate(valid => {
        if (valid) {
          this.submitPM();
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    deletePerson(index) {
      this.peopleList.splice(index, 1);
    },
    deleteDoor(index) {
      this.doorList.splice(index, 1);
    },
    judge() {
      // if (!this.data.peopleList.length) {
      //   this.$message.error("请选择通行的人！");
      //   return false;
      // }
      // if (!this.data.door) {
      //   this.$message.error("请选择通行的门！");
      //   return false;
      // }
      if (this.data.rule === "normal" && !this.data.time.length) {
        this.$message.error("请选择时间段！");
        return false;
      }
      // if (this.data.rule === "normal" && !this.data.date.length) {
      //   this.$message.error("请选择特殊日期！");
      //   return false;
      // }
      return true;
    },
    submitPM() {
      let channelSet = [];
      console.log(this.doorList);

      // 遍历doorList ,判断是否有版本号

      for (let i = 0; i < this.doorList.length; i++) {
        // 这里需要判断一下，设备没有版本号
        let item = {
          resSn: i,
          resType: this.doorList[i].type,
          resUuid: this.doorList[i].id
          // this.doorList[i].channelType ||
          // this.doorList[i].deviceType ||
          // this.doorList[i].orgType,
          // resUuid:
          //   this.doorList[i].channelUuid ||
          //   this.doorList[i].deviceUuid ||
          //   this.doorList[i].orgUuid,
          // version: this.doorList[i].version || this.doorVersion
          // version: this.doorVersion
        };
        if (this.doorVersion !== 0) {
          item.version = this.doorVersion;
        }
        channelSet.push(item);
      }

      let staffSet = [];
      for (let i = 0; i < this.peopleList.length; i++) {
        let item = {
          resSn: i,
          resType: this.peopleList[i].type,
          resUuid: this.peopleList[i].id
          // resType: this.peopleList[i].orgType || this.peopleList[i].source,
          // resUuid: this.peopleList[i].orgUuid || this.peopleList[i].staffUuid,
          // version: this.peopleList[i].version || this.peopleVersion
        };
        if (this.peopleVersion !== 0) {
          item.version = this.peopleVersion;
        }
        staffSet.push(item);
      }
      console.log(this.doorList);
      console.log(this.peopleList);
      let holidayUuid = this.data.date;
      let periodUuid = this.data.time;
      if (this.data.rule === "all") {
        holidayUuid = "";
        periodUuid = "";
      }
      let data = {
        groupName: this.data.name,
        holidayUuid,
        periodUuid,
        channelSet: channelSet,
        staffSet,
        channelSetUuid: this.row.channelSetUuid,
        staffSetUuid: this.row.staffSetUuid,
        rules: this.data.rule,
        groupType: "visitor"
      };
      console.log(data);
      this.canDiaabled = true;
      // 添加或者修改权限。
      if (!this.groupUuid) {
        api
          .addNewPermission(data)
          .then(res => {
            if (res.data.success) {
              this.$message.success("添加权限组成功！");
              this.$emit("update:visible", false);
              this.$emit("sure");
            }
            this.canDiaabled = false;
          })
          .catch(() => {
            this.canDiaabled = false;
          });
      } else {
        data.groupUuid = this.groupUuid;
        data.version = this.row.version;
        api
          .editPermission(data, this.groupUuid)
          .then(res => {
            if (res.data.success) {
              this.$message.success("修改权限组成功！");
              this.$emit("update:visible", false);
              this.$emit("sure");
            }
            this.canDiaabled = false;
          })
          .catch(() => {
            this.canDiaabled = false;
          });
      }
      // api.editPermission(data, this.groupUuid).then(res => {});
    },
    cancelClick() {
      this.$emit("update:visible", false);
    },
    chooseBtn() {
      this.chooseVisible = true;
    },
    chooseBtn2() {
      this.chooseVisible2 = true;
    },
    showTime() {
      this.settimevisible = true;
    },
    showDate() {
      this.setdatevisible = true;
    },
    changeTimeRadio(val) {
      this.showTimeArea = val === "normal";
    },
    close() {
      this.$emit("update:visible", false);
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
    },
    abcd() {
      console.log(this.row);
      // this.data.name = this.row.name;
      let peopleList = [],
        people = this.row.person || [];
      for (let i = 0; i < people.length; i++) {
        let item = {
          orgSn: this.row.person[i].resSn,
          orgName: this.row.person[i].resName,
          orgType: this.row.person[i].resType,
          type: this.row.person[i].resType,
          orgUuid: this.row.person[i].resUuid,
          id: this.row.person[i].resUuid,
          version: this.row.person[i].version
        };
        peopleList.push(item);
      }
      let doorList = [],
        door = this.row.door || [];
      console.log(door);
      for (let i = 0; i < door.length; i++) {
        let item = {
          orgSn: this.row.door[i].resSn,
          orgName: this.row.door[i].resName,
          orgType: this.row.door[i].resType,
          orgUuid: this.row.door[i].resUuid,
          type: this.row.door[i].resType,
          id: this.row.door[i].resUuid,
          version: this.row.door[i].version
        };
        doorList.push(item);
      }
      console.log(doorList);
      console.log(peopleList);
      this.data.name = this.row.groupName || "";
      this.data.rule = this.row.rules || "all";
      this.showTimeArea = this.data.rule === "normal";
      this.peopleList = peopleList || [];
      this.doorList = doorList || [];
      this.row.period = this.row.period || {};
      this.row.holiday = this.row.holiday || {};
      this.data.time = this.row.period.periodUuid || "";
      this.data.date = this.row.holiday.holidayUuid || "";
      for (let i = 0; i < this.doorList.length; i++) {
        if (this.doorList[i].version) {
          this.doorVersion = parseInt(this.doorList[i].version);
          // break;
        }
      }
      for (let i = 0; i < this.peopleList.length; i++) {
        if (this.peopleList[i].version) {
          this.peopleVersion = parseInt(this.peopleList[i].version);
          // break;
        }
      }
    },
    back() {
      this.doorVersion = 0;
      this.peopleVersion = 0;
      this.data.name = "";
      this.peopleList = [];
      this.doorList = [];
      this.data.time = "";
      this.data.date = "";
      this.data.rule = "all";
      this.showTimeArea = false;
      this.$refs.form.resetFields();
    }
  },
  watch: {
    groupUuid(val) {
      if (val) {
        this.abcd();
      } else {
        this.back();
      }
      // alert(this.data.rule);
    },
    visible(val) {
      if (val) {
        this.abcd();
        this.init();
      } else {
        this.back();
      }
      this.powerVisbile = val;
    },
    setdatevisible(val) {
      if (!val) {
        this.getDateList();
      }
    },
    settimevisible(val) {
      if (!val) {
        this.getTimeList();
      }
    }
  },
  components: {
    SetTimeAreaDialog,
    SetDateAreaDialog,
    chooseDialog,
    tabTreeTag,
    buttonSelect
  }
};
</script>

<style lang="scss">
.addnewPower {
  .el-form-item {
    margin-bottom: 0px;
  }
}
</style>

<style lang="scss" scoped>
@import "@/style/variables.scss";
.addnewPower {
  padding-bottom: 20px;
  .btngr {
    margin-top: 20px;
    margin-left: 200px;
    .confirmBtn {
      margin-right: 20px;
      @include button30;
    }
  }
  .myTitle {
    position: relative;
    font-family: " PingFangSC-Regular";
    font-size: 14px;
    color: #ffffff;
    margin-bottom: 15px;
    text-indent: 20px;
    &::before {
      content: "";
      position: absolute;
      top: 2px;
      left: 0px;
      width: 3px;
      height: 15px;
      background: #26d39d;
    }
  }
  .asdasadasasdasdasda {
    // overflow: auto;
    // margin: 20px 0px;
    .nameInput {
      width: 150px;
    }
    .iconButton {
      @include buttonnoborder;
    }
    .dateTips {
      font-family: " PingFangSC-Regular";
      font-size: 12px;
      color: #999999;
    }
    .total {
      font-size: 12px;
      color: #999;
    }
    .showAllSelect {
      min-height: 50px;
      .sbtn {
        margin-right: 10px;
      }
    }
  }
}
</style>
