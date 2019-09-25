<template>
  <div class="tablelist" ref="tablelist">
    <div class="aaaa" v-loading="isloading">
      <div class="fater">
        <div class="item" v-for="(o,index) in 30" :key="index">
          <div class="imgBox" @dblclick="lookface(o)">
            <img
              :src="tableData[index]?$common.setPictureShow(tableData[index].staffPhotoUrl):$common.setPictureShow(tableData[index])"
            >
          </div>

          <div
            class="textclipClass cellTxt1"
            @mouseover="mymouseover"
            @mouseout="mymouseout"
            @mousemove="mymousemove"
          >在{{tableData[index]?tableData[index].channels:'--'}}个设备出现{{tableData[index]?tableData[index].shows:'--'}}次</div>
          <div
            class="textclipClass cellTxt2"
            @mouseover="mymouseover"
            @mouseout="mymouseout"
            @mousemove="mymousemove"
          >{{tableData[index]?tableData[index].staffname:'姓名'}} {{tableData[index]?tableData[index].libraryName:'所属库'}}</div>
        </div>
      </div>
    </div>

    <div class="footer">
      <el-pagination
        background
        layout="prev, pager, next"
        :page-size="pageSize"
        :current-page="pageNow"
        @current-change="currentChange"
        :total="pageCount"
      ></el-pagination>

      <p class="totalpagetitle">共{{pageCount}}条</p>

      <div class="tiaozhuan">
        <span>跳转至</span>
        <el-input class="yeshu" type="number"></el-input>
      </div>
    </div>
    <!-- <the-face-alarm-dialog title="对比详情"
                           :faceDBDialogVisible="faceanalysicvisiable"
    @close="faceanalysicvisiable=false"></the-face-alarm-dialog>-->
    <the-analysis-dialog
      :dialogVisible="faceanalysicvisiable"
      :data="roaData"
      :row="row"
      :alarmtypetext="alarmtypetext"
      @submit="submitsuggestion"
      @ignore="ignoresuggestion"
      @close="closedialog"
    ></the-analysis-dialog>
    <el-dialog class="aaaaasdasd" title="图片详情" :visible.sync="dialogVisible">
      <img
        style="max-width:100%;display:block;margin:0 auto;max-height:400px;"
        :src="dialogImageUrl"
        alt
      >
    </el-dialog>
  </div>
</template>

<script>
import TheFaceAlarmDialog from "@/pages/faceModule/views/page/search/facealarm/basic/TheFaceAlarmDialog.vue";
import * as api from "@/pages/faceModule/api";
import TheAnalysisDialog from "@/pages/faceModule/views/page/search/IntelligentModelRecord/basic/IGMDialog.vue";

import { mouseover, mouseout, mousemove } from "@/common/js/mouse.js"; // 注意路径
export default {
  name: "facedblist",
  props: {
    isloading: {
      type: Boolean,
      default() {
        return false;
      }
    },
    progressWidth: {
      type: Number,
      default() {
        return 45;
      }
    },
    tableData: {
      type: Array,
      default: function() {
        var num = [];
        for (var i = 0; i < 13; i++) {
          num.push({
            index: ("0" + (i + 1)).slice(-2),
            name: "王小虎",
            sex: "男",
            time: "2018-10-18 12:00:00",
            id: "342626199411060399",
            ku: "住户"
          });
        }
        return num;
      }
    },
    pageSize: {
      type: Number,
      default: function() {
        return 12;
      }
    },
    pageNow: {
      type: Number,
      default: function() {
        return 1111;
      }
    },
    pageCount: {
      type: Number,
      default: function() {
        return 1000;
      }
    }
  },
  computed: {
    getLast() {
      var len = this.pageSize - this.tableData.length;
      len = Math.max(0, len);
      var a = [];
      while (len--) {
        a.push("kj");
      }
      return a;
    }
  },
  data() {
    return {
      multipleSelection: [],
      faceanalysicvisiable: false,
      arr: [1, 1, 1, 1, 1],
      dialogImageUrl: "",
      dialogVisible: false,
      userheader: require("@/assets/user.png"),
      roaData: [],
      row: {},
      alarmtypetext: ""
    };
  },
  mounted() {
    // this.$nextTick(function() {
    //   var win_h = window.innerHeight;
    //   var tableheight =
    //     parseInt(getComputedStyle(this.$refs.tablelist).height) - 40;
    //   this.pageSize = Math.floor(tableheight / 43);
    //   //   alert(this.pageSize);
    // });
  },
  methods: {
    closedialog() {
      this.shootdata = [];
      this.faceanalysicvisiable = false;
    },
    submitsuggestion(obj) {
      console.log(obj);
      api
        .setyanpan(obj)
        .then(res => {
          console.log(res);
          this.faceanalysicvisiable = false;
        })
        .catch(() => {});
    },
    ignoresuggestion(obj) {
      api
        .setyanpan(obj)
        .then(res => {
          console.log(res);
          this.faceanalysicvisiable = false;
        })
        .catch(() => {});
    },

    showbig(url) {
      if (url) {
        this.dialogImageUrl = url;
        this.dialogVisible = true;
      }
    },
    openDialog(detail) {
      this.$emit("lookface", detail);
    },
    lookface(index) {
      console.log(index);
      var row = this.tableData[index - 1];

      var data = {
        recognizeuuid: row.recognizeuuids
      };

      api
        .getRecordModelAnalysisDetail(data)
        .then(res => {
          if (res.data.result !== 0) {
            this.$message.error("数据请求失败");
            return;
          }
          console.log(res.data.data);
          var dialogData = res.data.data;
          var dialogDataArr = [];
          for (let i = 0; i < dialogData.length; i++) {
            let tempObject = dialogData[i];
            dialogDataArr.push({
              headerurl: tempObject.imageUri.replace(/"/g, ""),
              time: tempObject.time,
              devicesname: tempObject.channelName.replace(/"/g, ""),
              feature: ""
            });
          }
          // this.alarmtypetext = row.modelname;
          this.roaData = dialogDataArr;
          // this.row = row;
          this.faceanalysicvisiable = true;
        })
        .catch(err => {
          console.log(err);
        });
    },
    currentChange(index) {
      this.$emit("pagechange", index);
    },
    toggleSelection(rows) {
      if (rows) {
        rows.forEach(row => {
          this.$refs.multipleTable.toggleRowSelection(row);
        });
      } else {
        this.$refs.multipleTable.clearSelection();
      }
    },
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },
    // 鼠标划过覆盖的hover弹窗事件
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
  components: {
    TheFaceAlarmDialog,
    TheAnalysisDialog
  }
};
</script>

<style lang="scss" scoped>
@mixin active {
  font-family: "PingFangSC-Regular";
  font-size: 14px;
  color: #fff;
  letter-spacing: 0;
}
@mixin fontsa {
  font-family: "PingFangSC-Regular";
  font-size: 14px;
  color: #aaaaaa;
  letter-spacing: 0;
}
.aaaa {
  height: calc(100% - 150px);
  .fater {
    width: 100%;
    height: 100%;
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
    align-content: space-between;
    .item {
      // width: 400px;
      width: 9%;
      margin: 10px 0.5%;
      height: 180px;
      background-color: rgb(27, 30, 33);
      box-sizing: border-box;
      padding: 13px 15px 10px;

      .imgBox {
        width: 100%;
        height: 78%;
        margin-bottom: 5px;
        cursor: pointer;
      }

      .imgBox img {
        width: 100%;
        height: 100%;
      }

      div {
        text-align: center;
      }

      .cellTxt1 {
        font-family: PingFangSC-Regular;
        font-size: 11px;
        color: rgb(105, 107, 109);
        letter-spacing: 0;
        line-height: 16px;
      }
      .cellTxt2 {
        font-family: PingFangSC-Regular;
        font-size: 12px;
        color: rgb(105, 107, 109);
        letter-spacing: 0;
        line-height: 16px;
      }
    }
  }
}
.tablelist {
  height: 100%;
  height: 100%;
}
.footer {
  position: relative;
  margin: 30px 0px;
  .totalpagetitle {
    font-size: 14px;
    color: #fff;
    float: right;
    margin-right: 20px;
    margin-top: 17px;
  }
  .el-pagination {
    margin-right: 180px;
    margin-top: 10px;
    float: right;
  }
  .tiaozhuan {
    position: absolute;
    right: 20px;
    top: 6px;
    span {
      font-size: 14px;
      color: #fff;
      padding-right: 20px;
    }
    .yeshu {
      display: inline-block;
      width: 90px;
      input {
        padding: 0px;
      }
    }
  }
}
</style>

<style lang='scss'>
.progressCircle {
  margin: 20px 10px;
  .el-progress__text {
    font-family: "PingFangSC-Regular";
    font-size: 14px !important;
    color: #28ffbb;
    letter-spacing: 0;
  }
}
.isactive {
  .el-progress__text {
    color: #ff5f5f;
  }
}
</style>
