<template>
  <div class="tablelist" ref="tablelist">
    <div class="aaaa">
      <el-table :data="tableData" border v-loading="isloading" style="width: 100%">
        <el-table-column prop="index" label="序号" width="60">
          <template slot-scope="scope">{{("0"+(parseInt(scope.$index)+1)).slice(-2)}}</template>
        </el-table-column>

        <el-table-column prop="zhuapai" label="抓拍摄像机">
           <template slot-scope="scope">
            <div>{{scope.row.channelNames.join(",")}}</div>
          </template>
        </el-table-column>

        <el-table-column prop="shows" label="抓拍总数" width="130"></el-table-column>
        <!-- <el-table-column prop="xiangsidu"
                         label="相似度"
                         width='130'>
        </el-table-column>-->
        <el-table-column prop="staffname" label="人员姓名" width="130"></el-table-column>

        <el-table-column prop="libraryName" label="所属库" width="130"></el-table-column>

        <el-table-column prop="idcard" label="开始时间" width="260">
          <template slot-scope="scope">
            <div>{{startTime}}</div>
          </template>
        </el-table-column>

        <el-table-column prop="dealstate" label="结束时间" width="260">
          <template slot-scope="scope">{{endTime}}</template>
        </el-table-column>

        <el-table-column label="操作" width="180">
          <template slot-scope="scope">
            <el-button @click="lookface(scope.row)" type="text" size="small">
              <i class="el-icon-search"></i>
              查看
            </el-button>
          </template>
        </el-table-column>
      </el-table>
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
        <el-input class="yeshu" v-model="yeshu" @blur="blur" type="number"></el-input>
      </div>
    </div>

    <the-analysis-dialog
      :dialogVisible="faceanalysicvisiable"
      :data="roaData"
      :row="row"
      :alarmtypetext="alarmtypetext"
      @submit="submitsuggestion"
      @ignore="ignoresuggestion"
      @close="closedialog"
    ></the-analysis-dialog>
  </div>
</template>

<script>
import * as api from "@/pages/faceModule/api";
import TheAnalysisDialog from "@/pages/faceModule/views/page/search/IntelligentModelRecord/basic/IGMDialog.vue";
export default {
  name: "facedblist",
  props: {
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
    },
    isloading: {
      type: Boolean,
      default: function() {
        return false;
      }
    },
    startTime: {
      type: String
    },
    endTime: {
      type: String
    }
  },
  data() {
    return {
      multipleSelection: [],
      yeshu: "",
      roaData: [],
      row: {},
      alarmtypetext: "",
      faceanalysicvisiable: false
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

    blur() {
      if (this.yeshu !== "") {
        if (this.yeshu > Math.ceil(this.pageCount / this.pageSize)) {
          this.yeshu = Math.ceil(this.pageCount / this.pageSize);
        }
        this.yeshu = parseInt(this.yeshu);
        this.$emit("pagechange", parseInt(this.yeshu));
      }
    },
    lookface(row) {
      console.log(row);
      var data = {
        "recognizeuuid": row.recognizeuuids
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
        .catch(() => {});
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
    }
  },
  components: {
    TheAnalysisDialog
  }
};
</script>

<style lang="scss" scoped>
.aaaa {
  height: calc(100% - 150px);
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

<style lang="scss">
.tablelist .yeshu {
  display: inline-block;
  width: 90px;
  vertical-align: middle;
  height: 40px;
  .el-input__inner {
    margin-top: 5px;
    width: 50px;
    height: 28px;
    line-height: 28px;
    padding: 0px 5px;
  }
}
</style>
