<template>
  <el-dialog :title="title"
             @close="close"
             width="920px"
             :class="{'dialogCenter':true}"
             :close-on-click-modal="false"
             :append-to-body="true"
             class="BayonetCardDetail"
             :visible.sync="isShow">
    <div class="mywrap">
      <div class="left">
        <el-container>
          <el-container class="leftMainBox">
            <el-main>
              <el-image :src="$common.setPictureShow(BayonetCardDetail.vehiclePic,PicSourceType)"
                        :preview-src-list="[$common.setPictureShow(BayonetCardDetail.vehiclePic,PicSourceType)]">
                <div slot="error"
                     class="image-slot">
                  <img :src="$common.setPictureShow()"
                       alt="">
                </div>
              </el-image>
            </el-main>
            <el-footer>
              <el-image :src="$common.setPictureShow(BayonetCardDetail.vehicleNoPic,PicSourceType)"
                        :preview-src-list="[$common.setPictureShow(BayonetCardDetail.vehicleNoPic,PicSourceType)]">
                <div slot="error"
                     class="image-slot">
                  <img :src="$common.setPictureShow()"
                       alt="">
                </div>
              </el-image>
            </el-footer>
          </el-container>
          <el-aside width="120px">
            <el-image :src="$common.setPictureShow(BayonetCardDetail.masterDriverPic,PicSourceType)"
                      :preview-src-list="[$common.setPictureShow(BayonetCardDetail.masterDriverPic,PicSourceType)]">
              <div slot="error"
                   class="image-slot">
                <img :src="$common.setPictureShow()"
                     alt="">
              </div>
            </el-image>
            <p style="margin-bottom:11px;">主驾抓拍</p>
            <el-image :src="$common.setPictureShow(BayonetCardDetail.secondDriverPic,PicSourceType)"
                      :preview-src-list="[$common.setPictureShow(BayonetCardDetail.secondDriverPic,PicSourceType)]">
              <div slot="error"
                   class="image-slot">
                <img :src="$common.setPictureShow()"
                     alt="">
              </div>
            </el-image>
            <p>副驾抓拍</p>
          </el-aside>
        </el-container>
        <div class="MiddleClass">
          <p v-for="(item,index) in leftMiddle"
             :key="index">
            <img :src="item.icon" />
            {{item.label}}
            <template v-if="item.type">{{$common.getEnumItemName(item.type,item.value)}}</template>
            <template v-else>{{item.value}}</template>
          </p>
        </div>
      </div>
      <div class="right">
        <div class="topTips">
          <el-divider direction="vertical"></el-divider>最近一周抓拍记录
        </div>
        <div class="RightRecordCardBox">
          <el-row class="RightRecordCard"
                  v-for="(item,index) in totalCompareItemList"
                  :key="index">
            <el-col :span="13">
              <el-image :src="$common.setPictureShow(BayonetCardDetail.vehiclePic,PicSourceType)"
                        :preview-src-list="[$common.setPictureShow(BayonetCardDetail.vehiclePic,PicSourceType)]">
                <div slot="error"
                     class="image-slot">
                  <img :src="$common.setPictureShow()"
                       alt="">
                </div>
              </el-image>
            </el-col>
            <el-col class="RecordCardRightCol"
                    :span="11">
              <p>
                <img :src="icons.bayonetCarPlateW" />
                <span class="textClips"
                      @mouseover="mymouseover"
                      @mouseout="mymouseout"
                      @mousemove="mymousemove">{{item.vehicleNo||'车牌号'}}</span>
              </p>
              <p>
                <img :src="icons.bayonetCarTimeW" />
                <span class="textClips"
                      @mouseover="mymouseover"
                      @mouseout="mymouseout"
                      @mousemove="mymousemove">{{item.createTime||'抓拍时间'}}</span>
              </p>
              <div class="textClips"
                   @mouseover="mymouseover"
                   @mouseout="mymouseout"
                   @mousemove="mymousemove">
                <img :src="icons.bayonetCarAddressW" />
                <span class="textClips"
                      @mouseover="mymouseover"
                      @mouseout="mymouseout"
                      @mousemove="mymousemove">{{item.channelName||'抓拍通道名称'}}</span>
              </div>
              <p>
                <img :src="icons.bayonetCarRoadwayW" />
                <span class="textClips"
                      @mouseover="mymouseover"
                      @mouseout="mymouseout"
                      @mousemove="mymousemove">{{item.laneInfo||'抓拍'}}车道</span>
              </p>
            </el-col>
          </el-row>
        </div>
      </div>
    </div>
  </el-dialog>
</template>

<script>
// import * as api from "../http/ajax";
import icons from "@/common/js/icon.js";
import { mouseover, mouseout, mousemove } from "@/common/js/mouse.js"; // 注意路径
import * as api from "../http/ajax.js";
export default {
  name: "resouceTree",
  props: {
    visible: {
      type: Boolean,
      default() {
        return false;
      }
    },
    title: {
      type: String,
      default() {
        return "过车详情";
      }
    },
    BayonetCardDetail: {
      type: Object,
      default() {
        return {};
      }
    }
  },
  data() {
    return {
      leftMiddle: [
        { icon: icons.bayonetCarplate, label: "车牌号码：" },
        { icon: icons.bayonetDatetime, label: "经过时间：" },
        { icon: icons.bayonetRecordAddress, label: "经过地点：" },
        { icon: icons.bayonetRoadway, label: "车道名称：" },
        {
          icon: icons.bayonetCarType,
          label: "车辆类型：",
          type: "vehicle"
        },
        { icon: icons.bayonetCarColor, label: "车辆颜色：", type: "color" },
        { icon: icons.bayonetCarplate, label: "车牌类型：", type: "vehicle_no" }
      ],
      icons,
      isIndeterminate: false,
      checkAll: true,
      PicSourceType: window.config.PicSourceType,
      isShow: false,
      totalCompareItemList: [],
      total: 0
    };
  },
  mounted: function() {},
  methods: {
    initData() {
      let data = {
        page: 1,
        limit: 1000000,
        startTime: this.$common.getSpaceDate(-7) + " 00:00:00",
        endTime: this.$common.getCurrentTime()
      };
      data.vehicleNo = this.BayonetCardDetail.vehicleNo;
      this.totalCompareItemList = [];
      this.total = 0;
      api
        .getBayonetRecordList(data)
        .then(res => {
          if (res.data.success && res.data.data) {
            this.totalCompareItemList = res.data.data.list;
            this.total = res.data.data.total;
          }
        })
        .catch(() => {});
    },
    close() {
      this.$emit("update:visible", false);
    },
    mymouseover: event => {
      mouseover(event);
    },
    mymouseout(event) {
      mouseout(event);
    },
    mymousemove(event) {
      mousemove(event);
    }
  },
  watch: {
    visible(val) {
      this.isShow = this.visible;
      if (val) {
        this.leftMiddle = [
          {
            icon: icons.bayonetCarplate,
            label: "车牌号码：",
            value: this.BayonetCardDetail.vehicleNo
          },
          {
            icon: icons.bayonetDatetime,
            label: "经过时间：",
            value: this.BayonetCardDetail.createTime
          },
          {
            icon: icons.bayonetRecordAddress,
            label: "经过地点：",
            value: this.BayonetCardDetail.channelName
          },
          {
            icon: icons.bayonetRoadway,
            label: "车道名称：",
            value: this.BayonetCardDetail.laneInfo + "车道"
          },
          {
            icon: icons.bayonetCarType,
            label: "车辆类型：",
            type: "vehicle",
            value: this.$common.getEnumItemName(
              "vehicle_type",
              this.BayonetCardDetail.vehicleType
            )
          },
          {
            icon: icons.bayonetCarColor,
            label: "车辆颜色：",
            type: "color",
            value: this.BayonetCardDetail.vehicleColor
          },
          {
            icon: icons.bayonetCarplate,
            label: "车牌类型：",
            type: "vehicle_no",
            value: this.$common.getEnumItemName(
              "vehicle_no",
              this.BayonetCardDetail.vehicleNoType
            )
          }
        ];
        this.initData();
      }
    }
  }
};
</script>
<style>
.BayonetCardDetail .el-image img {
  object-fit: fill;
}
</style>
<style lang="scss" scoped>
$width: 300px;

.BayonetCardDetail {
  .mywrap {
    display: flex;
    min-height: 500px;
    .left {
      flex: 5;
      padding: 18px 25px;
      border-right: 1px solid rgba(255, 255, 255, 0.05);
      max-width: 420px;
      .leftMainBox {
        width: 280px;
        background-color: rgba(255, 255, 255, 0.04);
        margin-right: 10px;
        padding: 9px 8px 0px;
        box-sizing: border-box;
        .el-main {
          width: 100%;
          height: 150px;
          box-sizing: border-box;
          overflow: hidden;
          flex: none;
        }
        .el-footer {
          margin-top: 14px;
          height: 82px !important;
          padding: 0;
          margin-bottom: 13px;
        }
        .el-image {
          width: 100%;
          height: 100%;
          background-color: #212325;
        }
      }
      .el-aside {
        background-color: rgba(255, 255, 255, 0.04);
        padding: 9px 10px 0;
        .el-image {
          width: 99px;
          height: 99px;
        }
        p {
          text-align: center;
          font-family: "PingFangSC-Regular";
          font-size: 12px;
          color: #dddddd;
          letter-spacing: 0;
          margin: 5px;
        }
      }
      .MiddleClass {
        padding-left: 15px;
        p {
          font-family: "PingFangSC-Regular";
          font-size: 14px;
          color: #ffffff;
          img {
            width: 14px;
            margin-right: 12px;
          }
        }
      }
    }
    .right {
      flex: 5;
      padding: 10px 25px;
      border-left: 2px dashed rgba(255, 255, 255, 0.15);
      height: 630px;
      .topTips {
        font-family: "PingFangSC-Regular";
        font-size: 14px;
        color: #25d298;
        height: 50px;
        line-height: 50px;
        .el-divider {
          background-color: #26d39d;
          position: relative;
          height: 12px;
          padding-left: 3px;
          border-radius: 1px;
          margin-right: 10px;
          margin-left: 0px;
        }
      }
      .RightRecordCardBox {
        height: calc(100% - 50px);
        overflow: auto;
        .RightRecordCard {
          background: rgba(255, 255, 255, 0.04);
          margin-bottom: 20px;
          height: 120px;
          .el-col {
            height: 100%;
            .el-image {
              width: 100%;
              height: 100%;
            }
            p,
            div {
              margin: 3px 0;
              font-family: "PingFangSC-Regular";
              font-size: 14px;
              color: #dddddd;
              img {
                margin-right: 8px;
                width: 14px;
                vertical-align: text-top;
              }
            }
          }
          .RecordCardRightCol {
            padding: 10px 0 0 15px;
            p {
              // display: flex;
              // justify-content: flex-start;
              // align-content: center;
              // align-items: center;
              img {
                width: 14px;
                vertical-align: text-top;
              }
              span {
                width: 140px;
                display: inline-block;
              }
            }
          }
        }
      }
    }
  }
  .dialog-footer {
    height: 69px;
    line-height: 69px;
    border-top: 1px solid #24473f;
    padding-right: 48px;
  }
}
</style>
