<template>
  <div class="model-main">
    <add-or-edit-model v-show="!isShowMain"
                        ref="addOrEditModel"
                        style="height: 100%;"
                        :isAdd="isAdd"
                        @onConfirm="onConfirmEditOrAddModel"
                        @onCancel="onCancelEditOrAddModel" />
    <div class="menu"
         v-show="isShowMain">
      <el-button @click="addNewMission"
                 type="primary"
                 size="small">
        <img src="@/assets/images/faceModule/new_mission.png">
        新建模型
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
            {{item.title}}
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
          <el-switch v-model="switchTask"
                     active-color="rgba(32,204,150,0.2)"
                     inactive-color="rgba(255,255,255,0.2)"
                     @change="switchChange()"></el-switch>
          <span>状态</span>
          <div class="status"
               @click="editTaskInit">
            <img src="@/assets/images/edit.png"
                 width="14px"
                 height="14px" />
            <span>编辑</span>
          </div>
          <div class="status"
               @click="deleteIntel">
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
               style="width: 23%">名称：{{intelModelObj.faceModelName}} </div>
          <div class="info-block block-line"
               style="width: 23%">创建人：{{intelModelObj.faceModelName}} </div>
          <div class="info-block block-line"
               style="width: 23%">创建时间：{{intelModelObj.faceModelName}} </div>
          <div class="info-block block-line"
               style="width: 23%">布控原因：{{intelModelObj.faceModelName}} </div>
        </div>
        <source-show-more :title="`人脸库： 共${intelModelObj.libraryList.length}个人脸库`"
                          blockHeight="80px"
                          :itemIcon="require('@/assets/images/faceModule/crime_db.png')"
                          :dataList="faceDBItemList"
                          :lineLimit="1"
                          ref="faceDB"
                          containerId="faceDB" />
        <div class="info-container"
             style="margin: 18px 0; justify-content: flex-start;">
          <div class="info-block block-line"
               style="width: 10%; margin-right: 30px;">阈值：{{intelModelObj.faceSimilarityThreshold}}% </div>
          <div class="info-block block-line"
               style="width: 20%">人脸抓拍图片需达到的质量：{{intelModelObj.faceCapturePhotoQualities}} </div>
        </div>
        <div class="info-block">
          <div class="block-line">时间段：
            <template v-for="(item, index) in intelModelObj.timeList">
              <span :key="index">
                {{item.startTime}}至{{item.endTime}}&nbsp;&nbsp;
              </span>
            </template>
          </div>
          <div class="block-camera">
            <span>最近{{intelModelObj.recentDays}}，{{intelModelObj.statisticType}}满足</span>
            <camera-show-more blockHeight="37px"
                              :itemIcon="require('@/assets/images/faceModule/camera.png')"
                              :dataList="intelModelObj.videoSource.channelList"
                              :lineLimit="1"
                              style="width: 60%; margin-left: 75px;"
                              ref="camera1"
                              containerId="camera1" />
          </div>
          <div class="block-line">抓拍次数{{intelModelObj.videoSource.logic}}{{intelModelObj.videoSource.frequency}}，且至少{{intelModelObj.videoSource.leastNumberOfChannel}}个摄像机有抓拍</div>
          <div class="block-camera">
            <span>同时符合：</span>
            <camera-show-more blockHeight="74px"
                              :itemIcon="require('@/assets/images/faceModule/camera.png')"
                              :dataList="intelModelObj.otherVideoSource.channelList"
                              :lineLimit="2"
                              style="width: 60%; margin-left: 40px;"
                              ref="camera1"
                              containerId="camera1" />
          </div>
          <div class="block-camera">
            <span>同时不符合：</span>
            <camera-show-more blockHeight="74px"
                              :itemIcon="require('@/assets/images/faceModule/camera.png')"
                              :dataList="intelModelObj.notInVideoSource.channelList"
                              :lineLimit="2"
                              style="width: 60%; margin-left: 28px;"
                              ref="camera1"
                              containerId="camera1" />
          </div>
          <div class="block-line">排除人脸库: {{intelModelObj.notInlibrary}}</div>
          <div class="block-line">两次抓拍时间间隔：{{intelModelObj.captureInterval}}秒</div>
          <div class="block-line">备注：{{intelModelObj.remarks}}</div>
        </div>
        <div class="list-title">
          <img src="@/assets/images/faceModule/alarm.png">
          <span class="alarm-num">共{{"23"}}个感知报警</span>
          <div class="title-right">
            <span class="topTitleTxt">时段：</span>
            <el-date-picker v-model="createTimeStart"
                            type="datetime"
                            style="width: 180px"
                            placeholder="选择日期"
                            value-format="yyyy-MM-dd HH:mm:ss"></el-date-picker>
            <span class="timeText">—</span>
            <el-date-picker v-model="createTimeEnd"
                            type="datetime"
                            style="width: 180px; margin-right: 49px;"
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
            <model-item :key="index"
                        :item="item"
                        class="list-item"/>
          </template>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import CameraShowMore from "@/pages/faceModule/views/intelModel/components/CameraShowMore";
import SourceShowMore from "@/pages/faceModule/views/faceControl/components/SourceShowMore";
import ModelItem from "@/pages/faceModule/views/intelModel/components/ModelItem";
import AddOrEditModel from "@/pages/faceModule/views/intelModel/components/AddOrEditModel";

export default {
  components: {
    CameraShowMore,
    ModelItem,
    SourceShowMore,
    AddOrEditModel
  },
  props: {},
  data() {
    return {
      isShowDrag: true,
      width: "75%",
      missionButtArr: [
        {
          value: "onUse",
          text: "在用模型",
          selected: true
        },
        {
          value: "offUse",
          text: "停用模型",
          selected: false
        }
      ],
      menuList: [],
      switchTask: true,
      deleteDiglogvisible: false,
      faceList: [],
      cameraList: [],
      cameraItemList: [],
      faceDBItemList: [],
      createTimeStart: "",
      createTimeEnd: "",
      compareList: [],
      isShowMain: true,
      isShowDetailDialog: false,
      dialogParama: null,
      isAdd: true,
      enabled: 1,
      isLoading: false,
      intelModelObj: {
        faceModelUuid: "",
        faceModelName: "",
        libraryList: [],
        faceSimilarityThreshold: "",
        faceCapturePhotoQualities: "",
        timeList: [],
        recentDays: "",
        statisticType: "",
        videoSource: {
          channelList: [],
          logic: "",
          frequency: 0,
          leastNumberOfChannel: "",
        },
        otherVideoSource: {
          channelList: [],
          logic: "",
          frequency: 0,
        },
        notInVideoSource: {
          channelList: [],
          logic: "",
          frequency: 0,
        },
        notInlibrary: [],
        captureInterval: "",
        enabled: "",
        remarks: "",
      },
      isJudgeLoading: false,
      faceModelUuid: ""
    };
  },
  created() {},
  activated() {},
  mounted() {
  },
  methods: {
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
    onConfirmEditOrAddModel() {
      this.isShowMain = true;
    },
    onCancelEditOrAddModel() {
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
      this.getIntelModelList();
    },
    check(item) {
      this.menuList.forEach(v => {
        v.selected = false;
      });
      item.selected = true;
      this.faceModelUuid = item.faceModelUuid;
      this.getIntelModelDetails(this.faceModelUuid);
      this.getJudgedList(this.faceModelUuid);
    },
    switchChange(val) {
      if (val) {
        this.editIntelModel(this.faceModelUuid, 1);
      } else {
        this.editIntelModel(this.faceModelUuid, 0);
      }
    },
    editTaskInit() {
      this.isAdd = false;
      this.isShowMain = false;
    },
    formatObj() {
      if (this.intelModelObj.libraryList) {
        this.intelModelObj.libraryList.forEach(v => {
          this.faceDBItemList.push({
            name: v.libraryName
          });
        });
      }
      if (this.intelModelObj.channelList) {
        this.intelModelObj.channelList.forEach(v => {
          this.cameraItemList.push({
            name: v.channelName
          });
        });
      }
      if (this.intelModelObj.enabled) {
        this.switchTask = true;
      } else {
        this.switchTask = false;
      }
    },
    queryAct() {
      this.getJudgedList(this.faceModelUuid);
    },
    openDetail(item) {
      this.dialogParama = this.$common.copyObject(item, this.dialogParama);
      this.isShowDetailDialog = true;
    },
    onCancelDetailDialog() {
      this.isShowDetailDialog = false;
    },
    getIntelModelList() {
      this.isLoading = true;
      this.$intelModelHttp
        .getIntelModelList({
          enabled: this.enabled
        })
        .then(res => {
          let body = res.data;
          this.getIntelModelListSuccess(body);
          this.isLoading = false;
        })
        .catch(() => {
          this.isLoading = false;
        });
    },
    getIntelModelListSuccess(body) {
      this.menuList = body.data;
      this.formatMenuList();
      if (this.menuList && this.menuList.length !== 0) {
        if (!this.faceModelUuid) {
          this.check(this.menuList[0]);
        } else {
          this.menuList.forEach(v => {
            if (v.faceModelUuid === this.faceModelUuid) {
              this.check(v);
            }
          });
        }
      }
    },
    getIntelModelDetails(modelUuid) {
      this.$intelModelHttp
        .getIntelModelDetails({
          modelUuid
        })
        .then(res => {
          let body = res.data;
          this.getIntelModelDetailsSuccess(body);
        });
    },
    getIntelModelDetailsSuccess(body) {
      this.intelModelObj = body.data;
      this.formatObj();
    },
    getJudgedList(faceModelUuid) {
      this.isJudgeLoading = true;
      this.$intelModelHttp
        .getJudgedList({
          page: 1,
          limit: 1000,
          modelUuid: faceModelUuid,
          createTimeStart: this.createTimeStart,
          createTimeEnd: this.createTimeEnd
        })
        .then(res => {
          let body = res.data;
          this.getJudgedListSuccess(body);
          this.isJudgeLoading = false;
        })
        .catch(() => {
          this.isJudgeLoading = false;
        });
    },
    getJudgedListSuccess(body) {
      this.compareList = body.data.list;
    },
    deleteIntel() {
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
            this.$intelModelHttp
              .deleteIntelModel({
                modelUuid: this.faceModelUuid
              })
              .then(res => {
                let body = res.data;
                this.deleteIntelModelSuccess(body);
              });
          }
        });
    },
    deleteIntelModelSuccess(body) {
      this.$cToast.success(body.msg);
      this.faceModelUuid = "";
      this.getIntelModelList();
    },
    editIntelModel(faceModelUuid, enabled) {
      this.$intelModelHttp
        .editIntelModel({
          faceModelUuid,
          enabled
        })
        .then(res => {
          let body = res.data;
          this.editIntelModelSuccess(body);
        });
    },
    editIntelModelSuccess(body) {
      this.$cToast.success(body.msg);
      this.getIntelModelList();
    }
  },
  watch: {},
  deactivated() {},
  destroyed() {}
};
</script>
<style lang="scss">
.model-main {
  .el-icon-time:before {
    width: 0px;
  }
}
</style>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
.model-main {
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
      width: 100%;
      .menu-item {
        padding: 0 18px;
        box-sizing: border-box;
        font-family: PingFangSC-Regular;
        font-size: 13px;
        color: #dddddd;
        width: 96%;
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
      .block-camera {
        width: 100%;
        display: flex;
        line-height: 37px;
      }
    }
    .block-line {
      height: 37px;
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
        margin: 24px 0px 0px 14px;
      }
    }
  }
}
</style>
