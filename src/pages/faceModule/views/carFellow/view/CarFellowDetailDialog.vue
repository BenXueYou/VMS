<template>
  <el-dialog width="49.7%"
             title="过车详情"
             :visible.sync="isCurrentShow"
             :before-close="onClickCancel"
             :close-on-click-modal="false">
    <div class="dialog-content" v-if="carFellowDetailList.length > 0">
      <!--内容-->
      <div class="dialog-content-item">
        <div class="item-picture">
          <div class="picture-car">
            <img :src="$common.setPictureShow(carFellowDetailList[0].panoramauri)"
                 width="100%"
                 height="146px">
            <span class="time-title">
              时间：{{ $common.setStringText(carFellowDetailList[0].recordtime) }}
            </span>
          </div>
          <div class="picture-main">
            <span class="capture-title">
              主驾抓拍
            </span>
            <img :src="$common.setPictureShow(carFellowDetailList[0].maindriveruri)"
                 width="100%"
                 height="112px">
            <el-tooltip class="item" effect="dark" :content="`卡口：${$common.setStringText(carFellowDetailList[0].channelname)}`" placement="top">
              <span class="place">
                卡口：{{$common.setStringText(carFellowDetailList[0].channelname)}}
              </span>
            </el-tooltip>
          </div>
          <div class="picture-second">
            <span class="capture-title">
              副驾抓拍
            </span>
            <img :src="$common.setPictureShow(carFellowDetailList[0].subdriveruri)"
                 width="100%"
                 height="112px">
            <span class="place">
              车道：{{`车道${$common.setStringText(carFellowDetailList[0].lanenumber)}`}}
            </span>
          </div>
        </div>
        <div class="item-info">
          <el-row>
            <el-col :span="12">
              <div class="info-item">
                <div class="info-item-lable">
                  <div class="info-item-lable-text">车牌号码：</div>
                </div>
                <div class="info-item-content">
                  <div class="info-item-content-text">{{$common.setStringText(carFellowDetailList[0].vehicleno)}}</div>
                </div>
              </div>
              <div class="info-item">
                <div class="info-item-lable">
                  <div class="info-item-lable-text">经过地点：</div>
                </div>
                <div class="info-item-content">
                  <div class="info-item-content-text">{{$common.setStringText(carFellowDetailList[0].channelname)}}</div>
                </div>
              </div>
              <div class="info-item">
                <div class="info-item-lable">
                  <div class="info-item-lable-text">行驶速度：</div>
                </div>
                <div class="info-item-content">
                  <div class="info-item-content-text">{{$common.setStringText(carFellowDetailList[0].speed)}}</div>
                </div>
              </div>
              <div class="info-item">
                <div class="info-item-lable">
                  <div class="info-item-lable-text">车辆颜色：</div>
                </div>
                <div class="info-item-content">
                  <div class="info-item-content-text">{{dataTransfer['car_color'][$common.setStringText(carFellowDetailList[0].vehiclecolor)]}}</div>
                </div>
              </div>
              <div class="info-item">
                <div class="info-item-lable">
                  <div class="info-item-lable-text">车牌颜色：</div>
                </div>
                <div class="info-item-content">
                  <div class="info-item-content-text">{{dataTransfer['car_color'][$common.setStringText(carFellowDetailList[0].vehiclenumbercolor)]}}</div>
                </div>
              </div>
              <div class="info-item">
                <div class="info-item-lable">
                  <div class="info-item-lable-text">副驾驶安全带：</div>
                </div>
                <div class="info-item-content">
                  <div class="info-item-content-text">{{carFellowDetailList[0].issubseatbelt ? "有" : "无"}}</div>
                </div>
              </div>
              <div class="info-item">
                <div class="info-item-lable">
                  <div class="info-item-lable-text">副驾驶遮阳板：</div>
                </div>
                <div class="info-item-content">
                  <div class="info-item-content-text">{{carFellowDetailList[0].issubseatbelt ? "有" : "无"}}</div>
                </div>
              </div>
            </el-col>
            <el-col :span="12"
                    style="margin-left: 0px;">
              <div class="info-item">
                <div class="info-item-lable">
                  <div class="info-item-lable-text">过车时间：</div>
                </div>
                <div class="info-item-content">
                  <div class="info-item-content-text">{{$common.setStringText(carFellowDetailList[0].recordtime)}}</div>
                </div>
              </div>
              <div class="info-item">
                <div class="info-item-lable">
                  <div class="info-item-lable-text">车道号：</div>
                </div>
                <div class="info-item-content">
                  <div class="info-item-content-text">{{$common.setStringText(carFellowDetailList[0].lanenumber)}}</div>
                </div>
              </div>
              <div class="info-item">
                <div class="info-item-lable">
                  <div class="info-item-lable-text">车辆类型：</div>
                </div>
                <div class="info-item-content">
                  <div class="info-item-content-text">{{dataTransfer['car_type'][$common.setStringText(carFellowDetailList[0].vehicletype)]}}</div>
                </div>
              </div>
              <div class="info-item">
                <div class="info-item-lable">
                  <div class="info-item-lable-text">车牌类型：</div>
                </div>
                <div class="info-item-content">
                  <div class="info-item-content-text">{{dataTransfer['car_card_type'][$common.setStringText(carFellowDetailList[0].vehiclenotype)]}}</div>
                </div>
              </div>
              <div class="info-item">
                <div class="info-item-lable">
                  <div class="info-item-lable-text">主驾驶安全带：</div>
                </div>
                <div class="info-item-content">
                  <div class="info-item-content-text">{{carFellowDetailList[0].ismainseatbelt ? "有" : "无"}}</div>
                </div>
              </div>
              <div class="info-item">
                <div class="info-item-lable">
                  <div class="info-item-lable-text">主驾驶遮阳板：</div>
                </div>
                <div class="info-item-content">
                  <div class="info-item-content-text">{{carFellowDetailList[0].ismainsunvisor ? "有" : "无"}}</div>
                </div>
              </div>
            </el-col>
          </el-row>
        </div>
      </div>
      <div class="dialog-content-list">
        <div class="list-title">近期抓拍图片</div>
        <el-scrollbar style="height: 90%; margin-top: 16px;">
          <template v-for="(item, index) in carFellowDetailList">
            <el-row class="list-item"
                    :key="index">
              <el-col :span="12">
                <img :src="$common.setPictureShow(item.panoramauri)"
                     width="98%"
                     height="83.9px">
              </el-col>
              <el-col :span="12"
                      style="height: 100%;">
                <div class="list-item-detail">
                  <div class="list-item-detail-lable">日期：{{item.recordtime ? item.recordtime.substr(0,10) : "未知"}}</div>
                  <div class="list-item-detail-lable">时间：{{item.recordtime ? item.recordtime.substr(11) : "未知"}}</div>
                  <el-tooltip class="item" effect="dark" :content="`卡口：${$common.setStringText(item.channelname)}`" placement="top">
                    <div class="list-item-detail-lable">卡口：{{$common.setStringText(item.channelname)}}</div>
                  </el-tooltip>
                  <div class="list-item-detail-lable">车道：{{`车道${$common.setStringText(item.lanenumber)}`}}</div>
                </div>
              </el-col>
            </el-row>
          </template>
        </el-scrollbar>
      </div>
    </div>
    <div slot="footer"
         class="dialog-footer">
      <el-button type="primary"
                 size="mini"
                 @click="onClickCancel"
                 class="footer-button">关闭</el-button>
    </div>
  </el-dialog>
</template>

<script>
// import { getData } from "@/pages/faceModule/utils/dictionary.js";

export default {
  components: {},
  computed: {
    // dataTransfer() {
    //   return getData();
    // }
  },
  props: {
    isShow: {
      type: Boolean,
      default: false
    },
    carFellowDetailList: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      isCurrentShow: false,
    };
  },
  created() {},
  mounted() {},
  methods: {
    /**
     * 取消新增或修改
     */
    onClickCancel() {
      this.$emit("onCancel");
    }
  },
  watch: {
    isShow(val) {
      this.isCurrentShow = val;
    }
  },
  destroyed() {}
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
$line-color: #24473f;
@mixin setFontStyle($fontsize) {
  font-family: PingFangSC-Regular;
  font-size: $fontsize;
  color: #cccccc;
  letter-spacing: 0;
}
.dialog-content {
  display: flex;
  width: 100%;
  height: 595px;
  .dialog-content-item {
    width: 67%;
    padding: 14px 30px;
    border: {
      width: 0 1px 0 0;
      style: solid;
      color: $line-color;
    }
    .item-picture {
      width: 94%;
      height: 172px;
      padding: 15px 17px;
      display: flex;
      border: 1px $line-color solid;
      border-radius: 2px;
      background: #1f2124;
      @mixin flexBlock($width) {
        width: $width;
        margin-right: 4%;
        display: flex;
        flex-direction: column;
        align-items: center;
      }
      .picture-car {
        @include flexBlock(56%);
        .time-title {
          margin-top: 10px;
          @include setFontStyle(14px);
        }
      }
      %face-cap-common {
        @include flexBlock(26%);
        .capture-title {
          @include setFontStyle(12px);
          height: 34px;
          line-height: 34px;
        }
        .place {
          @include setFontStyle(14px);
          margin-top: 10px;
          text-overflow: ellipsis;
          overflow: hidden;
          white-space: nowrap;
        }
      }
      .picture-main {
        @extend %face-cap-common;
      }
      .picture-second {
        @extend %face-cap-common;
        margin-right: 0px;
      }
    }
    .item-info {
      width: 100%;
      margin-top: 25px;
      .info-item {
        display: flex;
        width: 100%;
        align-items: center;
        margin-bottom: 12px;
        .info-item-lable {
          text-align: right;
          width: 40%;
          margin-right: 2px;
          .info-item-lable-text {
            opacity: 0.8;
            font-family: PingFangSC-Regular;
            font-size: 14px;
            color: #cccccc;
          }
        }
        .info-item-content {
          border: 1px #404345 solid;
          border-radius: 3px;
          width: 52%;
          text-align: left;
          padding-left: 10px;
          .info-item-content-text {
            font-family: PingFangSC-Regular;
            font-size: 14px;
            color: #ffffff;
            height: 34px;
            line-height: 34px;
          }
        }
      }
      &:last-child {
        margin-bottom: 0px;
      }
    }
  }
  .dialog-content-list {
    width: 33%;
    padding: 14px 20px;
    height: 100%;
    .list-title {
      width: 100%;
      text-align: left;
      font-family: PingFangSC-Regular;
      font-size: 14px;
      color: #cccccc;
    }
    .list-item {
      width: 95%;
      height: 110px;
      margin-bottom: 15px;
      border: 1px $line-color solid;
      background: #202225;
      padding: 10px;
      .list-item-detail {
        display: flex;
        margin-left: 10px;
        flex-direction: column;
        align-items: flex-start;
        align-content: center;
        justify-content: center;
        justify-items: center;
        .list-item-detail-lable {
          height: 20px;
          line-height: 21px;
          font-family: PingFangSC-Regular;
          font-size: 12px;
          color: #cccccc;
          text-overflow: ellipsis;
          overflow: hidden;
          white-space: nowrap;
        }
      }
    }
  }
}
.dialog-footer {
  border: {
    width: 1px 0 0 0;
    style: solid;
    color: $line-color;
  }
  .footer-button {
    margin: 17px 28px 17px 0;
  }
}
</style>
