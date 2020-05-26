<template>
	<div class="mycontent">
		<div class="left">
			<div class="imgWrap">
				<el-image :src="data.faceCapturePhotoUrl" :preview-src-list='[data.faceCapturePhotoUrl]' ></el-image>
			</div>
			<p style="margin-top:10px;text-align: left;">
				<img style="margin-right:6px;vertical-align: middle;" :src="icons.personHead" alt />
				{{$common.plusXing(data.staffName,1,1)}}</p>
		</div>
		<div class="right">
			<div class="imgWrap2">
				<el-image :src="data.panoramaCapturePhotoUrl" :preview-src-list='[data.panoramaCapturePhotoUrl]' alt ></el-image>
			</div>
			<p style="display:flex;justify-content:space-between;margin-top:10px;">
				<span>
					<img style="margin-right:6px" :src="icons.time" alt />
					{{data.passTime}}
				</span>
				<span>相似度：{{data.similar}}%</span>
			</p>
		</div>
	</div>
</template>

<script>
import icons from "@/common/icon.js";
export default {
  name: "MyName",
  props: {
    data: {
      type: Object,
      default() {
        return {};
      }
    }
  },
  data() {
    return {
      icons
    };
  },
  methods: {}
};
</script>
<style lang="scss" scoped>
.mycontent {
  display: flex;
  padding: 10px;
  margin-right: 30px;
  margin-bottom: 20px;
  background-color: rgba(255, 255, 255, 0.06);
  p {
    margin: 0px;
    font-family: "PingFangSC-Regular";
    font-size: 14px;
    color: #dddddd;
    text-align: center;
    line-height: 20px;
  }
  .left {
    .imgWrap {
      width: 100px;
      height: 100px;
      // background-color: #fff;
      text-align: center;
      .el-image {
        max-width: 100%;
        max-height: 100%;
      }
    }
    margin-right: 15px;
  }
  .right {
    .imgWrap2 {
      width: 170px;
      height: 100px;
      // background-color: #fff;
      text-align: center;
      .el-image {
        max-width: 100%;
        max-height: 100%;
      }
    }
  }
}
</style>
