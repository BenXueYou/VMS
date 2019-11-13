<template>
  <el-upload class="avatar-uploader"
             :style="`width:${width}px;height:${height}px` "
             :action="fileUrl"
             :show-file-list="false"
             :auto-upload="true"
             :disabled="imageUrl ? true : isDisabled"
             :before-upload="beforeAvatarUpload"
             :http-request='httpRequest'>
    <div v-if="imageUrl"
         class="avatar"
         @mouseenter="showDelete(true)"
         @mouseleave="showDelete(false)">
      <img :src="$common.setPictureShow(imageUrl, 'facelog')"
           :width="`${width}`"
           @click="selectImg"
           :height="`${height}`"
           style="object-fit: fill;min-height: 120px;">
      <i class="el-icon-delete clearImageIcon"
         @click.stop="deleteUpdateImage()"
         v-if="isShowDelButton"></i>
    </div>
    <div v-if="!imageUrl && imageFile"
         class="avatar"
         @mouseenter="showDelete(true)"
         @mouseleave="showDelete(false)">
      <img :src="imageFile"
           :width="`${width}`"
           @click="selectImg"
           :height="`${height}`"
           style="object-fit: fill;min-height: 120px;">
      <i class="el-icon-delete clearImageIcon"
         @click.stop="deleteUpdateImage('left')"></i>
    </div>
    <div class="avatar"
         v-if="!imageUrl && !imageFile">
      <img src="@/assets/images/addImg2.png"
           class="ovo-card-img add-icon">
      <i class="el-icon-circle-plus-outline font-color">添加图片</i>
    </div>
  </el-upload>
</template>

<script>
export default {
  components: {},
  props: {
    width: {
      type: Number,
      default: 100
    },
    height: {
      type: Number,
      default: 125
    },
    enableEdit: {
      type: Boolean,
      default: false
    },
    imageUrl: {
      type: String,
      default: ""
    }
  },
  data() {
    return {
      imageFile: "",
      fileUrl: this.$store.state.api + "/mppr-face/v1/face/image/upload?fileType=full_body_shot",
    };
  },
  created() {},
  mounted() {},
  methods: {
    httpRequest(e) {
      this.imageFile = URL.createObjectURL(e.file);
      let reader = new FileReader();
      reader.readAsDataURL(e.file);
      let _this = this;
      reader.onload = function(e) {
        _this.picBaseUrl = this.result
          .replace("data:image/jpeg;base64,", "jpeg:")
          .replace("data:image/png;base64,", "png:")
          .replace("data:image/jpg;base64,", "jpg:");
        _this.$emit("addImage", _this.picBaseUrl);
      };
      if (!this.enableEdit) {
        this.isDisabled = true;
      }
    },
    //删除上传图片
    deleteUpdateImage() {
      this.imageFile = "";
      this.$emit("imageFile", this.imageFile);
    },
    /**
     * 图片格式校验+
     */
    beforeAvatarUpload(file) {
      let isJPG = false;
      if (file.type === "image/jpeg" || file.type === "image/png") {
        isJPG = true;
      }
      // const isLt2M = file.size / 1024 / 1024 < 2;
      if (!isJPG) {
        this.$cToast.error("上传图片只能是 JPG 或 PNG 格式!");
      }
      /* if (!isLt2M) {
        this.$cToast.error("上传图片大小不能超过 2MB!");
      } */
      return isJPG;
    },
    showDelete(isShow) {
      if (isShow) {
        this.isShowDelButton = true;
      } else {
        this.isShowDelButton = false;
      }
    },
    selectImg() {
      this.$emit("selectImg");
    }
  },
  watch: {
  },
  destroyed() {}
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
.avatar-uploader {
  border: 1px dashed #3C3F42;
  position: relative;
  background-color: rgb(27, 30, 33);
  padding: 4px;
  box-sizing: border-box;
}
.avatar {
  width: 100%;
  height: 100%;
  position: relative;
}
.clearImageIcon {
  position: absolute;
  right: 3px;
  top: 6px;
  z-index: 99;
  color: #efefef;
  width: 28px;
  height: 28px;
  background-color: rgba(17, 17, 17, 0.6);
  padding-top: 5px;
  box-sizing: border-box;
  border-radius: 19px;
}
.ovo-card-img {
  margin-top: 22%;
  vertical-align: middle;
  width: 55%;
  height: 55%;
  color: #20735C;
}
.font-color {
  margin-top: 20%;
  font-family: PingFangSC-Regular;
  font-size: 12px;
  color: #20735C;
  text-align: right;
}
</style>
