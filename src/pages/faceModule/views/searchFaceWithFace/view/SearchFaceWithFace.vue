<template>
  <div class="main-block">
    <look-all-view :isShow="isShowAllView"
                   @onCancel="onCancelAllView"
                   :item="selectedItem" />
    <div class="main-container">
      <div class="search">
        <div class="picture-upload">
          <template v-for="(item, index) in imageList">
            <pic-upload :disabled='!OwnAuthDisabled'
                        @addImage="addImage($event, item)"
                        @deleteImage="deleteImage(item)"
                        :key="item.key"
                        @selectImg="selectImg(item)"
                        v-if="index < 5"
                        :imageUrl="item.imageUrl"
                        :style="`margin-right: 30px; ${item.selected ? 'border: 2px #26D39D solid' : ''}`"
                        height="125px" />
          </template>
        </div>
        <div class="search-select">
          <span>时段：</span>
          <el-date-picker v-model="startTime"
                          type="datetime"
                          style="width: 13%; margin-left: 5px"
                          placeholder="选择日期"
                          value-format="yyyy-MM-dd HH:mm:ss"></el-date-picker>
          <span class="line">—</span>
          <el-date-picker v-model="endTime"
                          type="datetime"
                          style="width: 13%"
                          placeholder="选择日期"
                          value-format="yyyy-MM-dd HH:mm:ss"></el-date-picker>
          <span style="margin-left: 4%">抓拍设备：</span>
          <elPopverTree :elPopoverClass="faceRecordPopoverClass"
                        @transferCheckedChannel="transferCheckedChannel"
                        :isCheckedAll="isCheckedAll"
                        inputWidth="230px"></elPopverTree>
          <span style="margin-left: 4%">对比库：</span>
          <el-radio-group v-model="libraryType"
                          @change="handleTypeChange"
                          style="margin: 4px 0 0 0.5%;">
            <template v-for="(item, index) in libraryTypeOption">
              <el-radio :label="item.typeStr"
                        :key="index">{{item.typeName}}</el-radio>
            </template>
          </el-radio-group>
          <span style="margin-left: 4%">相似度不低于：</span>
          <el-input v-model="similarity"
                    type="number"
                    style="width: 55px;"></el-input>
          <span style="margin-left: 4px">%</span>
          <el-button :disabled="!ShowAuthDisabled"
                     @click="search"
                     type="primary"
                     size="small"
                     class="search-btn">搜索</el-button>
        </div>
      </div>
      <div class="result">
        <div class="result-title">
          <img src="@/assets/images/faceModule/face_compare.png" />
          <span style="margin-left: 15px;">{{libraryType === 'captureFaceLib' ? '抓拍库' : '人脸库'}}比对结果</span>
        </div>
        <div class="result-list"
             v-loading="isLoading">
          <template v-for="(item, index) in faceList">
            <div :key="index"
                 class="list-item">
              <img :src="$common.setPictureShow(item.faceCapturePhotoUrl, 'facelog')"
                   height="100%"
                   width="40%"
                   v-if="libraryType === 'captureFaceLib'"
                   class="img-fill" />
              <img :src="$common.setPictureShow(item.faceCapturePhotoUrl)"
                   height="100%"
                   width="40%"
                   v-else
                   class="img-fill" />
              <div class="item-info">
                <div class="info-name"
                     v-if="libraryType !== 'captureFaceLib'">{{item.staffName}}</div>
                <div class="info-other">
                  <div class="other-span">性别：{{$common.getEnumItemName("gender", item.genderCapture)}}</div>
                  <div class="other-span text-show" :title="libraryType === 'captureFaceLib' ? '抓拍库' : item.faceLibraryName">所属库：{{libraryType === 'captureFaceLib' ? '抓拍库' : item.faceLibraryName}}</div>
                  <div class="other-span text-show"
                       v-if="libraryType !== 'captureFaceLib'">人员类型：{{$common.getEnumItemName('staff_t', item.staffType)}}</div>
                  <div class="other-span">{{item.captureDatetime}}</div>
                  <div class="other-span text-show"
                       v-if="libraryType === 'captureFaceLib'"
                       :title="item.channelName">{{item.channelName}}</div>
                </div>
              </div>
              <div class="item-num">
                <el-progress type="circle"
                             :percentage="item.similarity"
                             :width="40"
                             color="#26D39D"
                             :stroke-width="2"></el-progress>
              </div>
              <div class="item-menu">
                <div :disabled="!ShowAuthDisabled"
                     class="menu-elem"
                     @click="turnToSearchFace(item)">
                  <img src="@/assets/images/faceModule/face_search.png" />
                  <span class="elem-title">以脸搜脸</span>
                </div>
                <div :disabled="!ShowAuthDisabled"
                     class="menu-elem"
                     @click="turnToPersonTrace(item)">
                  <img src="@/assets/images/faceModule/person_route.png" />
                  <span class="elem-title">人员轨迹</span>
                </div>
                <div :disabled="!ShowAuthDisabled"
                     class="menu-elem"
                     v-if="libraryType === 'captureFaceLib'"
                     @click="lookAllView(item)">
                  <img src="@/assets/images/faceModule/look_allview.png" />
                  <span class="elem-title">查看全景图</span>
                </div>
                <div :disabled="!OwnAuthDisabled"
                     class="menu-elem"
                     v-if="libraryType === 'captureFaceLib'"
                     @click="tempMonitor(item)">
                  <img src="@/assets/images/faceModule/now_dect.png" />
                  <span class="elem-title">临时布控</span>
                </div>
                <div :disabled="!OwnAuthDisabled"
                     class="menu-elem"
                     @click="downloadImage(item)">
                  <img src="@/assets/images/faceModule/export_pic.png" />
                  <span class="elem-title">导出图片</span>
                </div>
              </div>
            </div>
          </template>
        </div>
        <div class="footer">
          <el-pagination background
                         layout="total, prev, pager, next, jumper"
                         :page-size="pageInfo.pageSize"
                         :current-page="pageInfo.currentPage"
                         @current-change="handleCurrentChange"
                         :total="pageInfo.total"></el-pagination>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import PicUpload from "@/common/PicUpload";
import ElPopverTree from "@/pages/faceModule/components/ElPopverTree";
import LookAllView from "@/pages/faceModule/views/searchFaceWithFace/components/LookAllView";

export default {
  components: {
    PicUpload,
    ElPopverTree,
    LookAllView
  },
  props: {},
  data() {
    return {
      imageList: [],
      startTime: "",
      endTime: "",
      libraryType: "captureFaceLib",
      similarity: 80,
      pageInfo: {
        total: 0,
        pageSize: 15,
        currentPage: 1
      },
      faceList: [],
      deviceList: [],
      faceRecordPopoverClass: "popoverClass",
      checkedChannelKeys: [],
      channelUuids: [],
      isLoading: false,
      imageBase64: "",
      selectedKey: "",
      libraryTypeOption: [],
      isShowAllView: false,
      selectedItem: {},
      ShowAuthDisabled: true,
      OwnAuthDisabled: true,
      isOneProject: true,
    };
  },
  created() {},
  activated() {
    console.log("this.$route.params.imgObj: ", this.$route.params.imgObj);
    if (!this.ShowAuthDisabled) return;
    if (this.$route.params.imgObj) {
      this.turnSearchCommon(this.$route.params.imgObj);
    }
  },
  mounted() {
    this.ShowAuthDisabled = this.$common.getAuthIsOwn("以脸搜脸", "isShow");
    this.OwnAuthDisabled = this.$common.getAuthIsOwn("以脸搜脸", "isOwn");
    let projectType = this.$store.state.home.projectType || {};
    this.isOneProject = Boolean(projectType.platformLevel === "levelOne");
    if (!this.ShowAuthDisabled) return;
    this.initData();
  },
  methods: {
    initData() {
      this.startTime = this.$common.formatDate(
        new Date(new Date().getTime() - 24 * 60 * 60 * 1000)
      );
      this.endTime = this.$common.formatDate(new Date());
      this.libraryTypeOption = this.$common.getEnumByGroupStr(
        "face_h5_lib_group_type"
      );
      this.imageList.push({
        key: this.genModelIndex(),
        picBaseUrl: "",
        imageUrl: ""
      });
    },
    // 用js维护一套产生不重复id的机制
    genModelIndex() {
      let idStr = Date.now().toString(36);
      idStr += Math.random()
        .toString(36)
        .substr(3);
      return idStr;
    },
    defaultSelect() {
      if (!this.selectedKey) {
        this.imageList.forEach((v, i) => {
          if (i === 0 && this.imageList.length > 1) {
            this.$set(v, "selected", true);
            this.selectedKey = this.imageList[0].key;
          } else {
            this.$set(v, "selected", false);
          }
        });
      } else {
        this.imageList.forEach((v, i) => {
          this.$set(v, "selected", false);
          if (v.key === this.selectedKey) {
            this.$set(v, "selected", true);
          }
        });
      }
      this.getFaceList();
    },
    addImage(picBaseUrl, item) {
      item.picBaseUrl = picBaseUrl;
      if (this.imageList.length < 6) {
        this.imageList.push({
          key: this.genModelIndex(),
          picBaseUrl: "",
          imageUrl: ""
        });
      }
      this.defaultSelect();
    },
    deleteImage(item) {
      if (this.selectedKey === item.key) {
        this.selectedKey = "";
      }
      for (let [i, v] of this.imageList.entries()) {
        if (v.key === item.key) {
          this.imageList.splice(i, 1);
        }
      }
      this.defaultSelect();
    },
    selectImg(item) {
      this.imageList.forEach((v, i) => {
        this.$set(v, "selected", false);
      });
      this.$set(item, "selected", true);
      this.selectedKey = item.key;
      this.getFaceList();
    },
    getImg() {
      this.imageList.forEach((v, i) => {
        if (v.selected && v.imageUrl) {
          this.$common.imageToBase64(v.imageUrl, base64 => {
            this.imageBase64 = base64;
          });
        } else if (v.selected && !v.imageUrl) {
          this.imageBase64 = v.picBaseUrl;
        }
      });
      if (this.imageList.length < 2) {
        this.imageBase64 = "";
      }
    },
    search() {
      this.getFaceList();
    },
    handleTypeChange() {
      this.faceList = [];
      this.getFaceList();
    },
    transferCheckedChannel(checkedChannel) {
      this.channelUuids = [];
      for (let i = 0; i < checkedChannel.length; i++) {
        this.channelUuids.push(checkedChannel[i].channelUuid);
      }
    },
    getFaceList() {
      this.getImg();
      setTimeout(() => {
        if (!this.imageBase64) {
          this.$cToast.warn("请添加图片");
          return;
        }
        if (!this.similarity) {
          this.$cToast.warn("请输入相似度");
          return;
        }
        if (this.similarity < 0 || this.similarity > 100) {
          this.$cToast.warn("相似度只能在0到100%范围内");
          return;
        }
        if (!this.startTime || !this.endTime) {
          this.$cToast.warn("开始结束时间不能为空");
          return;
        }
        this.faceList = [];
        this.isLoading = true;
        this.$searchFaceHttp
          .searchFace({
            limit: this.pageInfo.pageSize,
            page: this.pageInfo.currentPage,
            imageBase64: this.imageBase64,
            channelUuids: this.channelUuids,
            libraryType: this.libraryType,
            similarity: parseInt(this.similarity),
            captureTimeStart: this.startTime,
            captureTimeEnd: this.endTime,
            projectUuid: this.$store.state.home.projectUuid
          })
          .then(res => {
            let body = res.data;
            this.searchFaceSuccess(body);
            this.isLoading = false;
          })
          .catch(() => {
            this.isLoading = false;
          });
      }, 500);
    },
    searchFaceSuccess(body) {
      this.faceList = body.data.list;
      this.handlePageInfo(body.data);
    },
    handlePageInfo(data) {
      let total = 0;
      if (data.total >= 0) {
        total = data.total;
      }
      this.pageInfo.total = total;
    },
    handleCurrentChange(val) {
      this.pageInfo.currentPage = val;
      this.getFaceList();
    },
    turnToSearchFace(item) {
      this.turnSearchCommon(item);
    },
    turnSearchCommon(item) {
      if (this.imageList.length > 5) {
        this.imageList.shift();
        this.imageList.forEach((v, i) => {
          this.$set(v, "selected", false);
        });
        this.imageList.splice(0, 0, {
          key: this.genModelIndex(),
          picBaseUrl: "",
          imageUrl: item.faceCapturePhotoUrl,
          selected: true
        });
        this.selectedKey = this.imageList[0].key;
      } else {
        this.imageList.pop();
        this.imageList.forEach((v, i) => {
          this.$set(v, "selected", false);
        });
        this.imageList.push({
          key: this.genModelIndex(),
          picBaseUrl: "",
          imageUrl: item.faceCapturePhotoUrl,
          selected: true
        });
        this.selectedKey = this.imageList[this.imageList.length - 1].key;
        this.imageList.push({
          key: this.genModelIndex(),
          picBaseUrl: "",
          imageUrl: ""
        });
      }
      this.defaultSelect();
    },
    turnToPersonTrace(item) {
      if (!item.hasOwnProperty("faceUuid")) {
        item.faceUuid = "";
      }
      this.$router.push({ name: "PersonTrace", params: { imgObj: item } });
    },
    lookAllView(item) {
      this.selectedItem = this.$common.copyObject(item, this.selectedItem);
      this.isShowAllView = true;
    },
    onCancelAllView() {
      this.isShowAllView = false;
    },
    downloadImage(item) {
      // this.$common.downloadImage(item.faceCapturePhotoUrl);
      this.$common.exportImageAct(item.faceCapturePhotoUrl);
    },
    tempMonitor(item) {
      let imageBase64 = "";
      this.$common.imageToBase64(item.faceCapturePhotoUrl, base64 => {
        imageBase64 = base64;
        this.$searchFaceHttp
          .tempMonitor({
            imageBase64
          })
          .then(res => {
            let body = res.data;
            this.tempMonitorSuccess(body);
          });
      });
    },
    tempMonitorSuccess(body) {
      this.$cToast.success(body.msg);
    },
  },
  watch: {},
  computed: {
    isCheckedAll() {
      return this.isOneProject;
    }
  },
  deactivated() {},
  destroyed() {}
};
</script>

<style>
.popoverClass {
  width: 500px;
  height: 230px;
  position: absolute;
  background: #202127;
  min-width: 150px;
  border: 1px solid #ebeef5;
  padding: 12px;
  z-index: 2000;
  color: #606266;
  line-height: 1.4;
  text-align: justify;
  font-size: 14px;
  -webkit-box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
  max-height: 80%;
  overflow: auto;
}
</style>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
.main-block {
  padding: 1.6%;
  box-sizing: border-box;
  width: 100%;
  height: 100%;
  .main-container {
    padding: 1.8% 3%;
    box-sizing: border-box;
    background: #212325;
    width: 100%;
    height: 100%;
    .search {
      height: 210px;
      width: 100%;
      border: {
        width: 0 0 1px 0;
        style: dashed;
        color: rgba($color: #ffffff, $alpha: 0.2);
      }
      .picture-upload {
        display: flex;
        width: 100%;
        align-items: center;
        height: 60%;
      }
      .search-select {
        display: flex;
        width: 100%;
        align-items: center;
        height: 40%;
        font-family: PingFangSC-Regular;
        font-size: 13px;
        color: #ffffff;
        .line {
          color: rgba($color: #ffffff, $alpha: 0.15);
          margin: 0 2px;
        }
        .search-btn {
          margin-left: auto;
          margin-right: 0;
          width: 80px;
        }
      }
    }
    .result {
      padding: 20px 0;
      box-sizing: border-box;
      height: 70%;
      .result-title {
        margin-bottom: 20px;
        display: flex;
        align-items: center;
        font-family: PingFangSC-Regular;
        font-size: 14px;
        color: #ffffff;
      }
      .result-list {
        height: 89%;
        overflow-y: auto;
        display: flex;
        flex-flow: row wrap;
        align-content: flex-start;
        .list-item {
          width: 19%;
          height: 160px;
          background: rgba($color: #000000, $alpha: 0.15);
          border: 1px solid #223c36;
          margin-right: 15px;
          margin-bottom: 10px;
          position: relative;
          display: flex;
          align-items: center;
          padding: 15px;
          box-sizing: border-box;
          &:hover {
            .item-menu {
              display: block;
            }
          }
          .item-info {
            display: flex;
            width: 58%;
            flex-direction: column;
            align-items: flex-start;
            margin-left: 16px;
            position: relative;
            .info-name {
              font-family: PingFangSC-Regular;
              font-size: 14px;
              width: 100%;
              color: #ffffff;
              height: 40px;
              line-height: 40px;
            }
            .info-other {
              font-family: PingFangSC-Regular;
              font-size: 12px;
              width: 100%;
              display: flex;
              flex-direction: column;
              align-items: flex-start;
              color: #dddddd;
              .other-span {
                width: 100%;
                margin-bottom: 5px;
              }
            }
          }
          .item-num {
            position: absolute;
            right: 20px;
            top: 15px;
          }
          .item-menu {
            position: absolute;
            left: 2px;
            bottom: 2px;
            background: rgba($color: #111111, $alpha: 0.9);
            border-radius: 1px;
            display: none;
            .menu-elem {
              display: flex;
              align-items: center;
              width: 120px;
              height: 32px;
              padding: 0 13px;
              box-sizing: border-box;
              font-family: PingFangSC-Regular;
              font-size: 12px;
              color: #bbbbbb;
              cursor: pointer;
              &:hover {
                background: rgba($color: #26d39d, $alpha: 0.3);
                color: #ffffff;
              }
              .elem-title {
                margin-left: 8px;
              }
            }
          }
        }
      }
      .footer {
        margin-top: 30px;
        width: 100%;
        display: flex;
        justify-content: flex-end;
      }
    }
  }
}
</style>
