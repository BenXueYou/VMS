<template>
  <div class='dialogwrap'>

    <el-dialog :title="title"
               :visible.sync="diglogvisible"
               @close='close'
               width="650px"
               center>
      <el-form ref="form"
               label-width="150px">

        <el-form-item label="库名称：">
          <el-input v-model="kuname"
                    class='myinput'></el-input>
        </el-form-item>

        <el-form-item label="库描述：">
          <el-input v-model="kudescri"
                    class='myinput'></el-input>
        </el-form-item>

        <el-form-item label="显示视图：">
          <el-select v-model="shitu"
                     class='myinput'
                     placeholder="请选择活动区域">
            <el-option v-for='(item,index) in shituarr'
                       :key='index'
                       :label="item.viewname"
                       :value="item.viewuuid"></el-option>
          </el-select>

        </el-form-item>

        <el-form-item label='库标识颜色：'>
          <el-radio-group v-model="kuyanse"
                          class='flexfather'>
            <el-radio :label='item.typestr'
                      v-for="(item,index) in colorarr"
                      class='flexchild'
                      :key="index">
              <span class="color"
                    :style='{backgroundColor:item.typestr}'></span>
            </el-radio>
          </el-radio-group>
        </el-form-item>

        <el-form-item label='入库需达到的质量：'>
          <el-radio-group v-model="quality"
                          @change='changequality'>
            <el-radio v-for="(item,index) in qualityarr"
                      :key='index'
                      :label="item.label">{{item.value}}</el-radio>
            <!-- <el-radio label="自定义"></el-radio> -->
          </el-radio-group>
        </el-form-item>

        <transition name='slideDownOrUp'>
          <div class="customize"
               v-show='showcustomize'>
            <div class='wrap'>
              <div class="itemlabel">
                图片模糊：
              </div>
              <div class="itemInput">
                <el-input v-model='mohu'
                          type='number'></el-input>
              </div>

              <div class="itemlabel">
                人脸完整度：
              </div>
              <div class="itemInput">
                <el-input v-model='wanzheng'
                          type='number'></el-input>
              </div>

              <div class="itemlabel">
                人脸遮挡度：
              </div>
              <div class="itemInput">
                <el-input v-model='zhedang'
                          type='number'></el-input>
              </div>

              <div class="itemlabel">
                水平转动角：
              </div>
              <div class="itemInput">
                <el-input v-model='zhuanjiao'
                          type='number'></el-input>
              </div>

              <div class="itemlabel">
                俯仰角：
              </div>
              <div class="itemInput">
                <el-input v-model='yangfu'
                          type='number'></el-input>
              </div>

              <div class="itemlabel">
                倾斜角：
              </div>
              <div class="itemInput">
                <el-input v-model='qingxie'
                          type='number'></el-input>
              </div>
            </div>
          </div>

        </transition>

      </el-form>

      <span class="dialog-footer button-div"
            style='width:200px;display:block;overflow:hidden;margin:20px auto;'>
        <el-button type='primary'
                   @click="onSubmit">确 定</el-button>
        <el-button type='primary'
                   @click="close">取 消</el-button>
      </span>

    </el-dialog>

  </div>
</template>

<script>
export default {
  name: "TheFaceDBDialog",
  props: {
    title: {
      type: String,
      default: "新建人脸库"
    },
    faceDBDialogVisible: {
      type: Boolean,
      default: function() {
        return true;
      }
    },
    colorarr: {
      type: Array,
      default: function() {
        return [];
      }
    },
    shituarr: {
      type: Array,
      default: function() {
        return [];
      }
    },
    isaddface: {
      type: Boolean,
      default: function() {
        return true;
      }
    },
    updatefacedata: {
      type: Object,
      default: function() {
        return {};
      }
    }
  },
  mounted() {
    this.qualityarr = window.face.qualityarr;
  },
  data() {
    return {
      qualityarr: [

      ],
      diglogvisible: false,
      kuname: "",
      kudescri: "",
      shitu: "",
      kuyanse: "",
      quality: "",
      showcustomize: false,
      mohu: 0.6,
      wanzheng: 1,
      zhedang: 0.6,
      zhuanjiao: 15,
      yangfu: 15,
      qingxie: 15
    };
  },
  watch: {
    faceDBDialogVisible: function(val) {
      this.diglogvisible = this.faceDBDialogVisible;

      if (!this.isaddface) {
        console.log(this.updatefacedata);
        // librarycolor: "#FF0000"
        // libraryname: "动态库"
        // libraryuuid: "dynamic_libraryuuid"
        // quality: "NORMAL"
        // viewuuid: "1"
        // 缺少个库的描述
        this.kuname = this.updatefacedata.libraryname;
        this.kudescri = this.updatefacedata.libraryDesc;
        this.shitu = this.updatefacedata.viewuuid;
        this.kuyanse = this.updatefacedata.librarycolor;
        this.quality = this.updatefacedata.quality;
      } else {
        this.resetdata();
      }
    }
  },
  methods: {
    judge() {
      // 用于判断自定义数字

      if (this.zhuanjiao > 30) {
        this.$message.error("请填写库名称");
        return false;
      }
      return true;
    },
    onSubmit() {
      if (!this.kuname) {
        this.$message.error("请填写库名称");
        return;
      }
      if (!this.kudescri) {
        this.$message.error("请填写库描述");
        return;
      }
      if (!this.shitu) {
        this.$message.error("请选择视图区域");
        return;
      }
      if (!this.kuyanse) {
        this.$message.error("请选择颜色");
        return;
      }
      if (!this.quality) {
        this.$message.error("请选择人脸质量");
        return;
      }
      var data = {
        libraryDesc: this.kudescri,
        librarycolor: this.kuyanse,
        libraryname: this.kuname,
        quality: this.quality,
        viewuuid: this.shitu
      };
      // 是否是添加人员，true是添加 false为修改
      if (this.isaddface) {
        console.log("submit!");
        this.$emit("addstaffku", data);
      } else {
        this.$emit("updatestaffku", data, this.updatefacedata.libraryuuid);
      }
      // if (this.quality && this.quality === "自定义" && !this.judge()) {
      //   return;
      // }
    },
    resetdata() {
      this.kuname = "";
      this.kudescri = "";
      this.shitu = "";
      this.kuyanse = "";
      this.quality = "";
    },
    close() {
      this.$emit("close");
      this.resetdata();
    },
    changequality(val) {
      console.log(val);
      if (val === "自定义") {
        this.showcustom();
      } else {
        this.hidecustom();
      }
    },
    hidecustom() {
      this.showcustomize = false;
    },
    showcustom() {
      this.mohu = 0.6;
      this.wanzheng = 1;
      this.zhedang = 0.6;
      this.zhuanjiao = 15;
      this.yangfu = 15;
      this.qingxie = 15;
      this.showcustomize = true;
    }
  }
};
</script>

<style lang='scss' scoped>
.flexfather {
  width: 350px;
  .flexchild {
    margin-top: 10px;
    margin-right: 18px;
    margin-left: 0px;
  }
}
.color {
  display: inline-block;
  width: 16px;
  height: 16px;
  vertical-align: middle;
  border-radius: 2px;
  background-color: #fff;
}
.btn-center {
  position: absolute;
  left: 50%;
  height: 50px;
  transform: translateX(-50%);
}
.myinput {
  width: 350px;
}
.customize {
  border-top: 1px dashed #666;
  border-bottom: 1px dashed #666;
  height: 150px;
  overflow: hidden;
  .wrap {
    width: 555px;
    margin: 0 auto;
    padding: 20px 0px;
    line-height: 50px;
    font-size: 0px;
    .itemlabel {
      font-family: "PingFangSC-Regular";
      display: inline-block;
      width: 120px;
      font-size: 14px;
      text-align: right;
      color: #aaaaaa;
    }
    .itemInput {
      display: inline-block;
      .el-input {
        width: 65px;
      }
    }
  }
}
</style>

<style lang='scss'>
// 下拉上弹动画
.slideDownOrUp-enter-active {
  transition: all 0.3s;
}
// .slideDownOrUp-leave-active {
// }
.slideDownOrUp-enter {
  transform: scale(1, 0);
}
.slideDownOrUp-leave-to /* .fade-leave-active below version 2.1.8 */ {
  transform: scale(1, 1);
}

/* 本页面自定义 */
.dialogwrap {
  .el-form-item {
    margin-bottom: 10px;
  }
  .el-input__inner {
    padding: 0px 5px 0px 8px;
  }
}
</style>
