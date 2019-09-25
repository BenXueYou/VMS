<template>
  <div class='tablelist'
       ref='tablelist'>
    <div class="aaaa">
      <el-table :data="tableData"
                border
                v-loading="loding"
                style="width: 100%">

        <el-table-column prop="index"
                         label="序号"
                         width="60">
          <template slot-scope="scope">

            {{("0"+(parseInt(scope.$index)+1)).slice(-2)}}

          </template>
        </el-table-column>
        <el-table-column prop="modelname"
                         label="模型名称"
                        >
        </el-table-column>
        <el-table-column prop="alarmtime"
                         label="报警时间">
        </el-table-column>

        <el-table-column prop="remarks"
                         label="备注">
        </el-table-column>
        <el-table-column prop="belong"
                         label="所属库">
        </el-table-column>

        <el-table-column prop="status"
                         label="状态"
                        width="120">
        </el-table-column>

        <el-table-column label="操作"
                        width='200'>
          <template slot-scope="scope">

            <el-button @click="lookface(scope.row)"
                       type="text"
                       size="small">
              <i class='el-icon-search'></i>
              查看
            </el-button>

          </template>
        </el-table-column>
      </el-table>
    </div>
    <div class="footer">
      <el-pagination background
                     layout="prev, pager, next"
                     :page-size="pageSize"
                     :current-page="pageNow"
                     @current-change='currentChange'
                     :total="pageCount">
      </el-pagination>

      <p class='totalpagetitle'> 共{{pageCount}}条</p>

      <div class='tiaozhuan'>
        <span>跳转至</span>
        <el-input class='yeshu'
                  v-model="yeshu"
                  @blur="blur"
                  type='number'>
        </el-input>
      </div>
    </div>
    <the-analysis-dialog :dialogVisible='faceanalysicvisiable'
                         :data="roaData"
                         :row="row"
                         :alarmtypetext="alarmtypetext"
                         @submit="submitsuggestion"
                         @ignore="ignoresuggestion"
                         @close='closedialog'>

    </the-analysis-dialog>
    <!-- <the-analysis-dialog :dialogVisible='faceanalysicvisiable'
          @close='closedialog'
          @submit="submitsuggestion"
          @ignore="ignoresuggestion"
          @scrollBottom="scrollBottom"
          :alarmtypetext="detailtask"
          :data='shootdata'
          :dialogloading="dialogloading"
          :dialogloadingmore="dialogloadingmore"
          :dialognomoredata="dialognomoredata"></the-analysis-dialog> -->
  </div>
</template>

<script>
import TheAnalysisDialog from "@/pages/faceModule/views/page/search/faceanalysis/basic/TheAnalysisDialog.vue";
import * as api from "@/pages/faceModule/api";
export default {
  name: "facedblist",
  props: {
    loding: {
      type: Boolean,
      default: function() {
        return false;
      }
    },
    tableData: {
      type: Array,
      default: function() {
        var num = [];
        for (var i = 0; i < 14; i++) {
          num.push({
            index: 1,
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
  data() {
    return {
      multipleSelection: [],
      faceanalysicvisiable: false,
      detailtask: "",
      shootdata: [],
      dialogloading: false,
      dialogloadingmore: "",
      dialognomoredata: "",
      yeshu: "",
      roaData: [],
      row: {},
      alarmtypetext: "",
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
    blur() {
      if (this.yeshu !== "") {
        if (this.yeshu > Math.ceil(this.pageCount / this.pageSize)) {
          this.yeshu = Math.ceil(this.pageCount / this.pageSize);
        }
        this.yeshu = parseInt(this.yeshu);
        this.$emit("pagechange", parseInt(this.yeshu));
      }
    },
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
    scrollBottom() {},
    lookface(row) {
      // var data=JSON.parse(row.extinfo);
      // console.log(data);
      // var data2=JSON.parse(data.faceRecognization.photoinfo);
      // console.log(data2);
      // console.log(row);
      // alert(row.alarminfoid);
      console.log(row);
      this.alarmtypetext = row.modelname;
      this.roaData = row.zhuapaiarr;
      this.row = row;
      this.faceanalysicvisiable = true;
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
  height: calc(100% - 50px);
}
.tablelist {
  height: 100%;
  height: 100%;
}
.footer {
  position: relative;
  margin: 10px 0px;
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

<style lang="scss" >
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
