<template>
  <div class="MegatempCard">
    <div class="leftBox">
      <el-image :src="defaultItem.extInfo?$common.setPictureShow(defaultItem.extInfo.snapPhotoUrl):''"></el-image>
    </div>
    <div class="rightBox">
      <!-- <div class="personTxt">{{defaultItem.extInfo?defaultItem.extInfo.staffName:'陌生人'}}</div> -->
      <div class="personTxt">姓名: 陌生人</div>
      <div class="tipsTxt">
        <img src="@/assets/images/SchoolBoard/temp_icon.png"
             alt />
        <span class="stressTxt">{{defaultItem.extInfo?defaultItem.extInfo.temperature.toFixed(1):'36.5'}} ℃</span>
      </div>
      <div class="tipsTxt">
        <img src="@/assets/images/SchoolBoard/camera_icon.png"
             alt />
        <span @mouseover="mymouseover"
              @mouseout="mymouseout"
              @mousemove="mymousemove"
              class="textClips">{{defaultItem.resName||'通道名称'}}</span>
      </div>
      <div class="tipsTxt">
        <img src="@/assets/images/SchoolBoard/time_clock_icon.png"
             alt />
        <span>{{defaultItem.alarmTime||'抓拍时间'}}</span>
      </div>
    </div>
  </div>
</template>
<script>
import { mouseover, mouseout, mousemove } from "@/common/js/mouse.js";
export default {
  components: {},
  props: {
    isShow: {
      type: Boolean,
      default: false
    },
    defaultItem: {
      type: Object,
      default() {
        return {};
      }
    }
  },
  data() {
    return {
      isCurrentShow: false,
      unitUuid: "",
      staffName: "",
      gender: "",
      infrastructureUuids: "",
      contact: "",
      tableData: [],
      pageInfo: {
        total: 0,
        pageSize: 8,
        currentPage: 1
      },
      genderOptions: [],
      unitsName: ""
    };
  },
  created() {},
  mounted() {},
  methods: {
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
    isShow(val) {}
  },
  destroyed() {}
};
</script>
<style lang="scss" scoped>
.MegatempCard {
  background: rgba(60, 21, 21, 0.35);
  border-radius: 2px;
  display: flex;
  justify-content: flex-start;
  box-sizing: border-box;
  padding: 19px;
  .leftBox {
    width: 100px;
    height: 100px;
    .el-image {
      width: 100%;
      height: 100%;
    }
  }
  .rightBox {
    padding-left: 20px;
    .personTxt {
      font-family: "PingFangSC-Regular";
      font-size: 14px;
      color: #ff5f5f;
      text-align: justify;
      margin: 5px 0 15px;
    }
    .tipsTxt {
      font-family: "PingFangSC-Regular";
      font-size: 12px;
      color: rgba(255, 255, 255, 0.8);
      text-align: justify;
      line-height: 17px;
      margin: 5px 0;
      img {
        margin-right: 10px;
      }
      .stressTxt {
        color: #ff5f5f;
      }
    }
    .textClips {
      font-size: 12px;
    }
  }
}
</style>
