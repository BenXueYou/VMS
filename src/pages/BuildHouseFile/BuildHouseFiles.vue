<template>
  <el-dialog :title="title"
             @close="close"
             :width="width"
             class="BuildHouseFileDialog dialogCenter"
             :close-on-click-modal="false"
             :append-to-body="true"
             :model="false"
             :close-on-press-escape="false"
             :visible.sync="BuildHouseFileDialogVisiable">
    <div class="wrap">
      <div class="leftWrap">
        <div class="imgWrap">
          <el-image :src="picture"
                    :preview-src-list='[picture]'>
            <div slot="error"
                 class="image-slot">
              <img :src="$common.setPictureShow()"
                   alt="">
            </div>
          </el-image>
        </div>
        <div class="infoPannel">
          <template v-for="(item,index) in infoData">
            <p class="infoPannelItem"
               :key="index"
               v-if="item.type || item.value">
              <span>{{item.title}}：</span>
              <template v-if="item.name==='alarmState'">
                <span :class="item.value?'alarmTxtClass':''">
                  <img v-if="item.value"
                       style="vertical-align:middle;margin-right:5px;"
                       src="@/assets/images/communityBoard/cmb_alarm_icon.png" />
                  {{item.value?'报警':'未报警'}}
                </span>
                <span v-if="item.value"
                      @click="clearAlarm"
                      :style="`font-size:16px;${OwnAuthDisabled ? 'cursor:pointer;' : 'cursor:not-allowed; color: gray'}`">
                  <img style="margin-left:30px;vertical-align:middle;margin-right:6px;"
                       src="@/assets/images/communityBoard/cmb_clear_icon.png" />清除
                </span>
              </template>
              <template v-else>{{item.value}}</template>
            </p>
          </template>
          <div style="margin-top:40px;">
            <span>房屋标签：</span>
            <div class="tagBoxClass">
              <div v-for="(item,index) in tag"
                   :key="index"
                   :class="index?'stateTagClass':'focusTagClass'">{{item}}</div>
            </div>
          </div>
        </div>
      </div>
      <div class="rightWrap">
        <ul class="headerBox">
          <li v-for="(item,index) in menu"
              :class="{'active':index==activeIndex}"
              @click="switchTab(index)"
              :key="index">{{item.title}}</li>
        </ul>
        <div class="rightContent"
             ref="rightContent">
          <component :is="componentId"
                     @jumpToPeopleFile="jumpToPeopleFile"
                     :projectUuid="projectUuid"
                     :infrastructureUuid="infUuid"></component>
        </div>
      </div>
    </div>
  </el-dialog>
</template>
<script>
import DoorRecord from "./components/DoorRecord";
import ShotRecord from "./components/ShotRecord";
import ConnectCar from "./components/ConnectCar";
import PastCarRecord from "./components/PastCarRecord";
import Fans from "./components/Fans";
import VisitorRecord from "./components/VisitorRecord";
import AlarmEvent from "./components/AlarmEvent";
import Detector from "./components/Detector";
// import * as api from "@/pages/communityBoard/utils/BuildHouseFileAjax.js";
export default {
  name: "BuildHouseFileDialogVisiable",
  components: {
    DoorRecord,
    ShotRecord,
    ConnectCar,
    PastCarRecord,
    Fans,
    VisitorRecord,
    AlarmEvent,
    Detector
  },
  props: {
    moduleName: {
      type: String,
      default() {
        return "";
      }
    },
    staffName: {
      type: String,
      default() {
        return "";
      }
    },
    address: {
      type: String,
      default() {
        return "";
      }
    },
    subModuleName: {
      type: String,
      default() {
        return "";
      }
    },
    infrastructureUuid: {
      type: String,
      default() {
        return "";
      }
    },
    visible: {
      type: Boolean,
      default() {
        return false;
      }
    },
    title: {
      type: String,
      default() {
        return "一房一档";
      }
    },
    projectUuid: {
      type: String,
      default() {
        return this.$store.state.home.projectUuid;
      }
    },
    width: {
      type: String,
      default() {
        return "1300px";
      }
    }
  },
  computed: {
    componentId() {
      return this.menu[this.activeIndex].component;
    }
  },
  data() {
    return {
      picture: "",
      peopleStaffUuid: "",
      infUuid: "",
      peopleFilesDialogVisiable: false,
      BuildHouseFileDialogVisiable: false,
      httpResData: {},
      infoData: [
        {
          name: "building",
          title: "楼栋",
          value: "楼栋"
        },
        {
          name: "unit",
          title: "单元",
          value: "单元"
        },
        {
          name: "floor",
          title: "楼层",
          value: "楼层"
        },
        {
          name: "infrastructureName",
          title: "房间号",
          type: "showNull",
          value: "房间号"
        },
        {
          name: "people",
          title: "居住人数",
          type: "showNull",
          value: "0人"
        },
        {
          name: "roomType",
          title: "类型",
          type: "showNull",
          value: "住房类型"
        },
        {
          name: "roomUse",
          title: "用途",
          type: "showNull",
          value: "房屋用途"
        },
        {
          name: "acreage",
          title: "面积",
          type: "showNull",
          value: "面积"
        },
        {
          name: "alarmState",
          type: "showNull",
          title: "报警状态",
          value: false
        }
      ],
      tag: ["自住", "重点关注"],
      activeIndex: 0,
      menu: [
        {
          title: "住户",
          component: "Fans"
        },
        {
          title: "门禁记录",
          component: "DoorRecord"
        },
        {
          title: "抓拍记录",
          component: "ShotRecord"
        },
        {
          title: "关联机动车",
          component: "ConnectCar"
        },
        {
          title: "过车记录",
          component: "PastCarRecord"
        },
        {
          title: "访客列表",
          component: "VisitorRecord"
        },
        {
          title: "探测器",
          component: "Detector"
        },
        {
          title: "报警事件",
          component: "AlarmEvent"
        }
      ],
      ShowAuthDisabled: true,
      OwnAuthDisabled: true
    };
  },
  mounted() {},
  methods: {
    clearAlarm() {
      if (!this.OwnAuthDisabled) {
        return;
      }
      this.$BuildHouseFileAjax
        .putRoomAlarmState({
          infrastructureUuid: this.infrastructureUuid,
          projectUuid: this.projectUuid
        })
        .then(res => {
          if (res.data.success) {
            this.$message({ type: "success", message: "报警清除成功" });
            this.$set(this.infoData[8], "value", false);
          }
        })
        .catch(() => {});
    },
    jumpToPeopleFile(staffObj) {
      console.log(staffObj);
      this.$bus.$emit("showPersonFiles", {
        projectUuid: this.projectUuid,
        staffUuid: staffObj.staffUuid,
        staffName: staffObj.staffName,
        address: this.address,
        subModuleName: this.subModuleName,
        moduleName: this.moduleName
      });
    },
    getData() {
      if (!this.infrastructureUuid) return;
      this.$BuildHouseFileAjax
        .roomDetail(
          {
            uuid: this.infrastructureUuid,
            projectUuid: this.projectUuid
          },
          {
            modelName: this.moduleName,
            detailContent: `查看${this.subModuleName || ""}${this.address ||
              ""}房屋的一房一档`
          }
        )
        .then(res => {
          if (res.data.success) {
            let data = res.data.data;
            this.httpResData = res.data.data || {};
            let infoData = JSON.parse(JSON.stringify(this.infoData));
            if (!data) {
              infoData = [];
            }
            this.picture = data.picture;
            for (let i = 0, len = infoData.length; i < len; i++) {
              if (this.infoData[i].name) {
                infoData[i].value = data[this.infoData[i].name];
                if (this.infoData[i].name === "acreage" && infoData[i].value) {
                  infoData[i].value += "㎡";
                }
                if (this.infoData[i].name === "people" && infoData[i].value) {
                  infoData[i].value += "人";
                }
              }
              if (infoData[i].name && infoData[i].name === "roomType") {
                infoData[i].value = this.$common.getEnumItemName(
                  "house_t",
                  infoData[i].value
                );
              }
              if (infoData[i].name && infoData[i].name === "roomUse") {
                infoData[i].value = this.$common.getEnumItemName(
                  "house_u",
                  infoData[i].value
                );
              }
            }
            this.infoData = infoData;
            this.tag = [];
            let str = data.state === 1 ? "自住" : "出租";
            this.tag.push(str);
            if (data.isfocus) {
              this.tag.push("重点关注");
            } else {
              this.tag.push("非重点关注");
            }
          }
        })
        .catch(() => {
          this.resetData();
        });
    },
    switchTab(index) {
      this.activeIndex = index;
    },
    resetData() {
      this.infoData = [
        {
          name: "building",
          title: "楼栋",
          value: ""
        },
        {
          name: "unit",
          title: "单元",
          value: ""
        },
        {
          name: "floor",
          title: "楼层",
          value: ""
        },
        {
          name: "infrastructureName",
          title: "房间号",
          type: "showNull",
          value: ""
        },
        {
          name: "people",
          title: "居住人数",
          type: "showNull",
          value: "0人"
        },
        {
          name: "roomType",
          title: "类型",
          type: "showNull",
          value: "房屋类型"
        },
        {
          name: "roomUse",
          title: "用途",
          type: "showNull",
          value: "房屋用途"
        },
        {
          name: "acreage",
          title: "面积",
          type: "showNull",
          value: "面积"
        },
        {
          name: "alarmState",
          title: "报警状态",
          type: "showNull",
          value: "未报警"
        }
      ];
    },
    close() {
      this.$emit("update:visible", false);
    }
  },
  watch: {
    infrastructureUuid(val) {
      this.infUuid = val;
    },
    visible(val) {
      if (val) {
        console.log(this.projectUuid);
        this.getData();
      } else {
        this.resetData();
        this.activeIndex = 0;
      }
      this.BuildHouseFileDialogVisiable = val;
    },
    moduleName(val) {
      this.ShowAuthDisabled = this.$common.getAuthIsOwn("val", "isShow");
      this.OwnAuthDisabled = this.$common.getAuthIsOwn("val", "isOwn");
    }
  }
};
</script>
<style lang='scss'>
.tagBoxClass {
  display: flex;
  justify-content: flex-start;
}
.tagBoxClass div {
  width: 100px;
  height: 40px;
  border: 1px solid rgba(151, 151, 151, 0.3);
  margin-right: 18px;
  text-align: center;
  line-height: 40px;
  margin-top: 17px;
}
.BuildHouseFileDialog {
  overflow: auto;
}
.BuildHouseFileDialog .el-dialog__body {
  height: 830px;
}
.stateTagClass {
  background-color: rgba(37, 210, 152, 0.1);
  border-radius: 3px 0 0 3px 3px;
  border-radius: 3px 0px 0px 3px 3px;
  color: #ff5f5f;
  font-size: 16px;
  text-align: justify;
  font-family: "PingFangSC-Regular";
}
.focusTagClass {
  background-color: rgba(37, 210, 152, 0.1);
  border-radius: 3px 0 0 3px 3px;
  border-radius: 3px 0px 0px 3px 3px;
  color: #25d298;
  font-size: 16px;
  text-align: justify;
  font-family: "PingFangSC-Regular";
}
</style>
<style lang="scss" scoped>
$leftWrapWidth: 330px;
.BuildHouseFileDialog {
  .wrap {
    display: flex;
    height: 100%;
    .leftWrap {
      width: $leftWrapWidth;
      height: 100%;
      padding: 15px 30px;
      box-sizing: border-box;
      .imgWrap {
        width: 100px;
        height: 100px;
        margin: 30px auto;
        // background: #fff;
        .el-image {
          width: 100%;
          height: 100%;
        }
      }
      .infoPannel {
        font-family: "PingFangSC-Regular";
        font-size: 16px;
        color: #dddddd;
        text-align: justify;
        .infoPannelItem {
          display: flex;
          .alarmTxtClass {
            color: #ff5f5f;
          }
          .address {
            margin: 0px;
            font-family: "PingFangSC-Regular";
            font-size: 16px;
            color: #25d298;
            text-align: justify;
            line-height: 22px;
          }
        }
      }
    }
    .rightWrap {
      width: calc(100% - #{$leftWrapWidth});
      height: 100%;
      padding: 25px;
      box-sizing: border-box;
      border-left: 1px dashed rgba(151, 151, 151, 0.3);
      .headerBox {
        padding: 0px;
        margin: 0px;
        height: auto;
        li {
          cursor: pointer;
          display: inline-block;
          margin-right: 5px;
          padding: 0px 18px;
          line-height: 40px;
          background: rgba(255, 255, 255, 0.05);
          font-family: "PingFangSC-Regular";
          font-size: 18px;
          color: #bbbbbb;
          text-align: justify;
        }
        .active {
          color: #fff;
          background: rgba(37, 210, 152, 0.25);
          border: 1px solid rgba(37, 210, 152, 0.3);
        }
      }
      .rightContent {
        border: 1px solid rgba(37, 210, 152, 0.3);
        background: rgba(0, 0, 0, 0.15);
        height: calc(100% - 40px);
        padding: 15px;
        box-sizing: border-box;
        overflow: auto;
      }
    }
  }
}
</style>
