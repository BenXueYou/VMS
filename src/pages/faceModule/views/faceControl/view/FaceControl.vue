<template>
  <div class="main">
    <add-or-edit-control v-show="!isShowMain"
                         ref="addOrEditControl"
                         style="height: 100%;"
                         :isAdd="isAdd"
                         @onConfirm="onConfirmEditOrAddControl"
                         @onCancel="onCancelEditOrAddControl" />
    <control-details :isShow="isShowDetailDialog"
                     @onCancel="onCancelDetailDialog"
                     :dialogParama="dialogParama" />
    <div class="menu"
         v-show="isShowMain">
      <el-button @click="addNewMission"
                 type="primary"
                 size="small">
        <img src="@/assets/images/faceModule/new_mission.png">
        新建布控任务
      </el-button>
      <div class="tab">
        <template v-for="(item, index) in missionButtArr">
          <div :key="index"
               class="button-item"
               @click="select(item)"
               :style="`${item.selected ? 'background: rgba(40, 255, 187, 0.10); border: 1px #226652 solid;' : 'background: rgba(255, 255, 255, 0.1)'};`">
            {{item.text}}
          </div>
        </template>
      </div>
      <div class="list">
        <template v-for="(item, index) in menuList">
          <div :key="index"
               class="menu-item"
               @click="check(item)"
               :style="`${item.selected ? 'background: #24282C;' : ''};`">
            <img src="@/assets/images/faceModule/useing_mis.png"
                 style="margin-right: 10px;">
            {{item.faceMonitorName}}
          </div>
        </template>
      </div>
    </div>
    <div class="details"
         :style="`width: ${width}`"
         v-show="isShowMain">
      <img class="drag-left"
           src="@/assets/images/faceModule/left_drag.png"
           v-if="isShowDrag"
           @click="clickLeft">
      <img class="drag-right"
           src="@/assets/images/faceModule/right_drag.png"
           v-else
           @click="clickRight">
      <div class="button">
        <div class="button-right">
          <el-switch v-model="faceMonitorObj.enabled"
                     active-color="rgba(32,204,150,0.2)"
                     inactive-color="rgba(255,255,255,0.2)"
                     @change="switchChange"
                     :active-value="1"
                     :inactive-value="0"></el-switch>
          <span>状态</span>
          <div class="status"
               @click="editTaskInit">
            <img src="@/assets/images/edit.png"
                 width="14px"
                 height="14px" />
            <span>编辑</span>
          </div>
          <div class="status"
               @click="deleteCon">
            <img src="@/assets/images/delete2.png"
                 width="14px"
                 height="14px" />
            <span>删除</span>
          </div>
        </div>
      </div>
      <div class="container">
        <div class="info-container"
             style="margin: 18px 0;">
          <div class="info-block block-line"
               style="width: 23%">名称：{{faceMonitorObj.faceMonitorName}} </div>
          <div class="info-block block-line"
               style="width: 23%">创建人：{{faceMonitorObj.createUserName}} </div>
          <div class="info-block block-line"
               style="width: 23%">创建时间：{{faceMonitorObj.createTime}} </div>
          <div class="info-block block-line"
               style="width: 23%; background: transparent;"></div>
        </div>
        <source-show-more :title="`人脸库： 共${faceMonitorObj.libraryList ? faceMonitorObj.libraryList.length : 0}个人脸库`"
                          blockHeight="80px"
                          :itemIcon="require('@/assets/images/faceModule/crime_db.png')"
                          :dataList="faceDBItemList"
                          :lineLimit="1"
                          ref="faceDB"
                          containerId="faceDB" />
        <source-show-more :title="`视频源： 共${faceMonitorObj.channelList ? faceMonitorObj.channelList.length : 0}个摄像头`"
                          blockHeight="120px"
                          :itemIcon="require('@/assets/images/faceModule/camera.png')"
                          :dataList="cameraItemList"
                          :lineLimit="2"
                          ref="camera"
                          containerId="vidSource" />
        <div class="info-container"
             style="margin: 18px 0;">
          <div class="info-block block-line"
               style="width: 10%">阈值：{{`${faceMonitorObj.faceSimilarityThreshold}%`}} </div>
          <div class="info-block block-line"
               style="width: 11%">是否报警：{{faceMonitorObj.alarmed ? '是' : '否'}} </div>
          <div class="info-block block-line"
               style="width: 11%">是否报警弹窗：{{faceMonitorObj.popup ? '是' : '否'}} </div>
          <div class="info-block block-line"
               style="width: 13%">报警声音：{{faceMonitorObj.alarmSoundName}} </div>
          <div class="info-block block-line"
               style="width: 13%; display: flex; align-items: center">
            <span>布控颜色：</span>
            <div class="monitor-color"
                 :style="`background: ${faceMonitorObj.taskColour ? faceMonitorObj.taskColour : 'transparent'}`"></div>
          </div>
          <div class="info-block block-line"
               style="width: 13%">目标人列表：{{faceMonitorObj.reservedCount}} </div>
          <div class="info-block block-line"
               style="width: 20%">人脸抓拍图片需达到的质量：{{faceMonitorObj.faceCapturePhotoQualities ? $common.getEnumItemName("face_quality", faceMonitorObj.faceCapturePhotoQualities[faceMonitorObj.faceCapturePhotoQualities.length-1]) : ""}} </div>
        </div>
        <div class="list-title">
          <img src="@/assets/images/faceModule/alarm.png">
          <span class="alarm-num">共{{compareList.length}}个警报</span>
          <div class="title-right">
            <span class="topTitleTxt">时段：</span>
            <el-date-picker v-model="alarmDatetimeBegin"
                            type="datetime"
                            style="width: 190px"
                            placeholder="选择日期"
                            value-format="yyyy-MM-dd HH:mm:ss"></el-date-picker>
            <span class="timeText">—</span>
            <el-date-picker v-model="alarmDatetimeEnd"
                            type="datetime"
                            style="width: 190px; margin-right: 49px;"
                            placeholder="选择日期"
                            value-format="yyyy-MM-dd HH:mm:ss"></el-date-picker>
            <el-button @click="queryAct"
                       type="primary"
                       size="small"
                       icon="el-icon-search">查询</el-button>
            <el-button @click="queryAct"
                       type="primary"
                       size="small">
              <img src="@/assets/images/faceModule/turn_record.png"
                   height="10px">
              跳转人脸比对记录
            </el-button>
          </div>
        </div>
        <div class="items-list">
          <template v-for="(item, index) in compareList">
            <recoginize-card :key="index"
                             :recoginizeItem="item"
                             class="list-item"
                             @detailClick="openDetail(item)" />
          </template>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import SourceShowMore from "@/pages/faceModule/views/faceControl/components/SourceShowMore";
import AddOrEditControl from "@/pages/faceModule/views/faceControl/components/AddOrEditControl";
import ControlDetails from "@/pages/faceModule/views/faceControl/components/ControlDetails";
import RecoginizeCard from "@/pages/faceModule/components/RecoginizeCard.vue";

export default {
  components: {
    SourceShowMore,
    RecoginizeCard,
    ControlDetails,
    AddOrEditControl
  },
  props: {},
  data() {
    return {
      isShowDrag: true,
      width: "75%",
      missionButtArr: [
        {
          value: "onUse",
          text: "在用任务",
          selected: true
        },
        {
          value: "offUse",
          text: "停用任务",
          selected: false
        }
      ],
      menuList: [],
      deleteDiglogvisible: false,
      faceList: [],
      cameraList: [],
      cameraItemList: [],
      faceDBItemList: [],
      alarmDatetimeBegin: "",
      alarmDatetimeEnd: "",
      compareList: [],
      isShowMain: true,
      isShowDetailDialog: false,
      dialogParama: null,
      isAdd: true,
      enabled: 1,
      isLoading: false,
      faceMonitorObj: {
        faceMonitorUuid: "",
        faceMonitorName: "",
        libraryList: [],
        channelList: [],
        faceSimilarityThreshold: "",
        faceCapturePhotoQualities: "",
        reservedCount: "",
        alarmed: "",
        popup: "",
        alarmSoundName: "",
        alarmSoundUrl: "",
        taskColour: "",
        enabled: 1,
        createTime: "",
        createUser: "",
        systemStaffLibraryTypes: []
      },
      isAlarmLoading: false,
      faceMonitorUuid: ""
    };
  },
  created() {},
  activated() {},
  mounted() {
    this.init();
    this.getMonitoringTaskList();
  },
  methods: {
    init() {
      this.alarmDatetimeBegin = this.$common.formatDate(
        new Date(new Date().getTime() - 24 * 60 * 60 * 1000)
      );
      this.alarmDatetimeEnd = this.$common.formatDate(new Date());
    },
    clickLeft() {
      this.isShowDrag = !this.isShowDrag;
      this.width = "100%";
      setTimeout(() => {
        this.$refs.faceDB.isShowMoreButton();
        this.$refs.camera.isShowMoreButton();
      }, 600);
    },
    clickRight() {
      this.isShowDrag = !this.isShowDrag;
      this.width = "75%";
      setTimeout(() => {
        this.$refs.faceDB.isShowMoreButton();
        this.$refs.camera.isShowMoreButton();
      }, 600);
    },
    addNewMission() {
      this.isAdd = true;
      this.isShowMain = false;
    },
    onConfirmEditOrAddControl() {
      this.isShowMain = true;
      this.getMonitoringTaskList();
    },
    onCancelEditOrAddControl() {
      this.isShowMain = true;
    },
    formatMenuList() {
      this.menuList.forEach(v => {
        this.$set(v, "selected", false);
      });
    },
    select(item) {
      this.missionButtArr.forEach(v => {
        v.selected = false;
      });
      item.selected = true;
      if (item.value === "onUse") {
        this.enabled = 1;
      } else {
        this.enabled = 0;
      }
      this.getMonitoringTaskList();
    },
    check(item) {
      this.resetData();
      this.menuList.forEach(v => {
        v.selected = false;
      });
      item.selected = true;
      // this.resetData();
      this.faceMonitorUuid = item.faceMonitorUuid;
      this.getMonitoringTaskDetails(this.faceMonitorUuid);
      this.getAlarmList(this.faceMonitorUuid);
    },
    switchChange(val) {
      if (val) {
        this.editMonitoringTaskStatus(this.faceMonitorUuid, 1);
      } else {
        this.editMonitoringTaskStatus(this.faceMonitorUuid, 0);
      }
    },
    editTaskInit() {
      this.isAdd = false;
      this.$refs.addOrEditControl.setFromDataForEdit(this.faceMonitorObj);
      this.isShowMain = false;
    },
    formatObj() {
      this.faceDBItemList = [];
      this.cameraItemList = [];
      if (this.faceMonitorObj.libraryList) {
        this.faceMonitorObj.libraryList.forEach(v => {
          this.faceDBItemList.push({
            name: v.faceLibraryName
          });
        });
      }
      if (this.faceMonitorObj.channelList) {
        this.faceMonitorObj.channelList.forEach(v => {
          this.cameraItemList.push({
            name: v.channelName
          });
        });
      }
    },
    queryAct() {
      this.getAlarmList(this.faceMonitorUuid);
    },
    openDetail(item) {
      this.dialogParama = this.$common.copyObject(item, this.dialogParama);
      this.isShowDetailDialog = true;
    },
    onCancelDetailDialog() {
      this.isShowDetailDialog = false;
    },
    getMonitoringTaskList() {
      this.isLoading = true;
      this.$faceControlHttp
        .getMonitoringTaskList({
          enabled: this.enabled
        })
        .then(res => {
          let body = res.data;
          this.getMonitoringTaskListSuccess(body);
          this.isLoading = false;
        })
        .catch(() => {
          this.isLoading = false;
        });
    },
    getMonitoringTaskListSuccess(body) {
      this.menuList = body.data;
      this.formatMenuList();
      if (this.menuList && this.menuList.length !== 0) {
        if (!this.faceMonitorUuid) {
          this.check(this.menuList[0]);
        } else {
          this.menuList.forEach(v => {
            if (v.faceMonitorUuid === this.faceMonitorUuid) {
              this.check(v);
            }
          });
        }
      }
    },
    getMonitoringTaskDetails(taskUuid) {
      this.$faceControlHttp
        .getMonitoringTaskDetails({
          taskUuid
        })
        .then(res => {
          let body = res.data;
          this.getMonitoringTaskDetailsSuccess(body);
        });
    },
    getMonitoringTaskDetailsSuccess(body) {
      this.faceMonitorObj = body.data;
      this.formatObj();
    },
    getAlarmList(faceMonitorUuid) {
      this.isAlarmLoading = true;
      this.$faceControlHttp
        .getAlarmList({
          limit: 9999,
          page: 1,
          faceMonitorUuid,
          alarmDatetimeBegin: this.alarmDatetimeBegin,
          alarmDatetimeEnd: this.alarmDatetimeEnd
        })
        .then(res => {
          let body = res.data;
          this.getAlarmListSuccess(body);
          this.isAlarmLoading = false;
        })
        .catch(() => {
          this.isAlarmLoading = false;
        });
    },
    getAlarmListSuccess(body) {
      this.compareList = body.data.list ? body.data.list : [];
    },
    deleteCon() {
      this.$confirm(
        `<span style="font-family: PingFangSC-Regular;font-size: 14px;color: #FFFFFF;">是否确认删除？</span>`,
        "",
        {
          confirmButtonText: "否",
          cancelButtonText: "是",
          distinguishCancelAndClose: true,
          confirmButtonClass: "confirm-button",
          cancelButtonClass: "cancel-button",
          center: true,
          dangerouslyUseHTMLString: true
        }
      )
        .then(() => {})
        .catch(action => {
          if (action === "cancel") {
            this.$faceControlHttp
              .deleteMonitoringTask({
                taskUuid: this.faceMonitorUuid
              })
              .then(res => {
                let body = res.data;
                this.deleteMonitoringTaskSuccess(body);
              });
          }
        });
    },
    resetData() {
      this.faceDBItemList = [];
      this.cameraItemList = [];
      this.faceMonitorUuid = "";
      this.faceMonitorObj = {
        faceMonitorUuid: "",
        faceMonitorName: "",
        libraryList: [],
        channelList: [],
        faceSimilarityThreshold: "",
        faceCapturePhotoQualities: "",
        reservedCount: "",
        alarmed: "",
        popup: "",
        alarmSoundName: "",
        alarmSoundUrl: "",
        taskColour: "",
        enabled: 1,
        createTime: "",
        createUser: "",
        systemStaffLibraryTypes: []
      };
      this.compareList = [];
    },
    deleteMonitoringTaskSuccess(body) {
      this.$cToast.success(body.msg);
      this.resetData();
      this.getMonitoringTaskList();
    },
    editMonitoringTaskStatus(faceMonitorUuid, enabled) {
      this.$faceControlHttp
        .editMonitoringTaskStatus({
          faceMonitorUuid,
          enabled
        })
        .then(res => {
          let body = res.data;
          this.editMonitoringTaskStatusSuccess(body);
        });
    },
    editMonitoringTaskStatusSuccess(body) {
      this.$cToast.success(body.msg);
      this.getMonitoringTaskList();
    }
  },
  watch: {},
  deactivated() {},
  destroyed() {}
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
.main {
  position: relative;
  width: 100%;
  height: 100%;
  .menu {
    width: 25%;
    padding: 2%;
    box-sizing: border-box;
    height: 100%;
    .tab {
      display: flex;
      width: 100%;
      margin-top: 25px;
      border: {
        width: 0 0 1px 0;
        style: solid;
        color: rgba($color: #ffffff, $alpha: 0.05);
      }
      .button-item {
        font-family: PingFangSC-Regular;
        font-size: 13px;
        color: #ffffff;
        text-align: center;
        width: 120px;
        height: 34px;
        line-height: 34px;
        margin-right: 2px;
        cursor: pointer;
        border: 1px transparent solid;
      }
    }
    .list {
      margin-top: 15px;
      overflow-y: auto;
      height: 87%;
      .menu-item {
        padding: 0 18px;
        box-sizing: border-box;
        font-family: PingFangSC-Regular;
        font-size: 13px;
        color: #dddddd;
        width: 340px;
        height: 50px;
        line-height: 50px;
        cursor: pointer;
        // &:hover {
        //   background: #24282C;
        // }
        border: {
          width: 1px 1px 0px 1px;
          style: solid;
          color: rgba($color: #ffffff, $alpha: 0.05);
        }
        &:last-child {
          border: {
            width: 1px;
            style: solid;
            color: rgba($color: #ffffff, $alpha: 0.05);
          }
        }
      }
    }
  }
  .details {
    position: absolute;
    top: 0px;
    right: 0px;
    width: 75%;
    height: 100%;
    transition: 0.5s all;
    background: #212325;
    padding: 0 30px;
    box-sizing: border-box;
    .drag-left {
      position: absolute;
      top: 50%;
      left: -10px;
      transform: translate(-50%, -50%);
      cursor: pointer;
    }
    .drag-right {
      position: absolute;
      top: 50%;
      left: 15px;
      transform: translate(-50%, -50%);
      cursor: pointer;
    }
    .button {
      width: 100%;
      height: 60px;
      border: {
        width: 0 0 1px 0;
        style: dashed;
        color: rgba($color: #ffffff, $alpha: 0.2);
      }
      display: flex;
      align-items: center;
      .button-right {
        margin-left: auto;
        margin-right: 0px;
        font-family: PingFangSC-Regular;
        font-size: 14px;
        color: #26d39d;
        display: flex;
        align-items: center;
        .status {
          cursor: pointer;
          margin-left: 25px;
        }
      }
    }
    .container {
      overflow-y: auto;
      height: calc(100% - 70px);
      margin-top: 8px;
    }
    .info-block {
      background: rgba($color: #ffffff, $alpha: 0.03);
      border-radius: 2px;
      padding: 9px 0px 9px 20px;
      box-sizing: border-box;
      font-family: PingFangSC-Regular;
      font-size: 13px;
      color: #dddddd;
      overflow: hidden;
      transition: 0.5s all;
    }
    .block-line {
      height: 36px;
      display: flex;
      align-items: center;
    }
    .info-container {
      display: flex;
      align-items: center;
      justify-content: space-between;
    }
    .list-title {
      width: 100%;
      height: 98px;
      border: {
        width: 0 0 1px 0;
        style: dashed;
        color: rgba($color: #ffffff, $alpha: 0.2);
      }
      display: flex;
      align-items: center;
      .alarm-num {
        font-family: PingFangSC-Regular;
        font-size: 16px;
        color: #ffffff;
        letter-spacing: 0;
        margin-left: 10px;
      }
      .title-right {
        margin-left: auto;
        margin-right: 0px;
        .topTitleTxt {
          font-family: PingFangSC-Regular;
          font-size: 13px;
          color: #ffffff;
        }
        .timeText {
          font-family: PingFangSC-Regular;
          font-size: 14px;
          color: #888888;
          width: 28px;
        }
      }
    }
    .items-list {
      display: flex;
      flex-flow: row wrap;
      align-content: flex-start;
      margin-bottom: 10px;
      .list-item {
        margin: 24px 0px 0px 18px;
      }
    }
  }
  .monitor-color {
    width: 22px;
    height: 16px;
    border: 1px solid rgba(255, 255, 255, 0.4);
    border-radius: 1px;
  }
}
</style>
