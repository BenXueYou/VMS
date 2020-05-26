<template>
  <div class="VisitorRecord">
    <div class="people"
         v-for="(item,index) in data "
         :key="index">
      <div class="leftImgWrap">
        <el-image :src="item.snapPhotoUri"
                  :preview-src-list="[item.snapPhotoUri]"></el-image>
      </div>
      <div class="info">
        <p>姓名：{{$common.plusXing(item.visitorName,1,1)}}</p>
        <p>性别：{{$common.getEnumItemName("gender", item.gender)}}</p>
        <p>车牌号码：{{item.plateNo}}</p>
        <p>手机号码：{{$common.plusXing(item.phoneNo,4,4)}}</p>
        <p>最后拜访时间：{{item.lastRegDatetime.split(' ')[0]}}</p>
        <p>{{ item.lastRegDatetime.split(' ')[1]}}</p>
      </div>
    </div>
  </div>
</template>
<script>
// import * as api from "@/pages/communityBoard/utils/buildHouseFileAjax.js";
export default {
  name: "VisitorRecord",
  props: {
    infrastructureUuid: {
      type: String,
      default() {
        return "";
      }
    },
    projectUuid: {
      type: String,
      default() {
        return this.$store.state.home.projectUuid;
      }
    }
  },
  data() {
    return {
      data: [],
      srcList: [
        "https://fuss10.elemecdn.com/8/27/f01c15bb73e1ef3793e64e6b7bbccjpeg.jpeg",
        "https://fuss10.elemecdn.com/1/8e/aeffeb4de74e2fde4bd74fc7b4486jpeg.jpeg"
      ]
    };
  },
  mounted() {
    this.getData();
  },
  watch: {
    infrastructureUuid(val) {
      this.data = [];
      if (val) {
        this.getData();
      }
    }
  },
  destroyed() {
    this.data = [];
  },
  methods: {
    getData() {
      if (!this.infrastructureUuid) {
        return;
      }
      this.$BuildHouseFileAjax
        .roomVisitorListApi({
          infrastructureUuid: this.infrastructureUuid,
          projectUuid: this.projectUuid
        })
        .then(res => {
          if (res.data.success) {
            let data = res.data.data;
            data.map(item => {
              item.certificatePhotoUri = item.certificatePhotoUri
                ? item.certificatePhotoUri
                : item.snapPhotoUri;
            });
            this.data = data;
          }
        });
    }
  }
};
</script>
<style lang="scss" scoped>
.VisitorRecord {
  max-height: 680px;
  overflow: auto;
  display: flex;
  flex-wrap: wrap;
  flex-direction: row;
  justify-content: flex-start;
  .people {
    width: 420px;
    display: flex;
    background-color: rgb(42, 45, 49);
    margin: 30px 20px 0 0;
    .leftImgWrap {
      width: 180px;
      height: 180px;
      // background-color: #fff;
      text-align: center;
      border: 1px solid rgb(42, 45, 49);
      .el-image {
        width: 100%;
        height: 100%;
      }
    }
    .info {
      margin: 10px;
      p {
        margin: 0px;
        font-family: "PingFangSC-Regular";
        font-size: 14px;
        color: #dddddd;
        line-height: 25px;
        white-space: nowrap;
      }
    }
  }
}
</style>
